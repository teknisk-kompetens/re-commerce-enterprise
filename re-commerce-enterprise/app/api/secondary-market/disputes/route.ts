

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const transactionId = searchParams.get("transactionId");
    const submitterId = searchParams.get("submitterId");
    const respondentId = searchParams.get("respondentId");
    const status = searchParams.get("status");
    const disputeType = searchParams.get("disputeType");
    const priority = searchParams.get("priority");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const whereClause: any = {};
    if (transactionId) whereClause.transactionId = transactionId;
    if (submitterId) whereClause.submitterId = submitterId;
    if (respondentId) whereClause.respondentId = respondentId;
    if (status) whereClause.status = status;
    if (disputeType) whereClause.disputeType = disputeType;
    if (priority) whereClause.priority = priority;

    const disputes = await prisma.disputeResolution.findMany({
      where: whereClause,
      include: {
        transaction: {
          include: {
            listing: {
              include: {
                assetOwnership: {
                  select: { assetType: true, assetData: true },
                },
              },
            },
            escrowAccount: {
              select: { escrowAmount: true, status: true },
            },
          },
        },
        submitter: {
          select: { id: true, name: true, email: true },
        },
        respondent: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      disputes,
      pagination: {
        limit,
        offset,
        total: await prisma.disputeResolution.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Fetch disputes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch disputes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "create_dispute":
        const {
          transactionId,
          submitterId,
          disputeType,
          category = "commercial",
          title,
          description,
          evidence = [],
          priority = "normal",
        } = body;

        // Verify transaction exists
        const transaction = await prisma.secondaryMarketTransaction.findUnique({
          where: { id: transactionId },
          include: {
            buyer: true,
            seller: true,
          },
        });

        if (!transaction) {
          return NextResponse.json(
            { error: "Transaction not found" },
            { status: 404 }
          );
        }

        // Determine respondent
        const respondentId = submitterId === transaction.buyerId 
          ? transaction.sellerId 
          : transaction.buyerId;

        // Check for existing open disputes
        const existingDispute = await prisma.disputeResolution.findFirst({
          where: {
            transactionId,
            status: { in: ["open", "investigating", "mediation"] },
          },
        });

        if (existingDispute) {
          return NextResponse.json(
            { error: "Active dispute already exists for this transaction" },
            { status: 400 }
          );
        }

        const dispute = await prisma.disputeResolution.create({
          data: {
            transactionId,
            submitterId,
            respondentId,
            disputeType,
            category,
            title,
            description,
            evidence,
            priority,
            timeline: [
              {
                action: "dispute_created",
                timestamp: new Date(),
                actor: submitterId,
                details: "Dispute submitted",
              },
            ],
            tenantId: body.tenantId,
          },
          include: {
            submitter: {
              select: { id: true, name: true },
            },
            respondent: {
              select: { id: true, name: true },
            },
            transaction: true,
          },
        });

        // Update transaction status
        await prisma.secondaryMarketTransaction.update({
          where: { id: transactionId },
          data: { status: "disputed" },
        });

        // Update escrow status if exists
        await prisma.escrowAccount.updateMany({
          where: { transactionId },
          data: { status: "disputed", disputeResolved: false },
        });

        return NextResponse.json({ dispute });

      case "respond_to_dispute":
        const { disputeId, respondentId: respId, response, evidence: responseEvidence = [] } = body;
        
        const disputeToRespond = await prisma.disputeResolution.findUnique({
          where: { id: disputeId },
        });

        if (!disputeToRespond) {
          return NextResponse.json(
            { error: "Dispute not found" },
            { status: 404 }
          );
        }

        if (disputeToRespond.respondentId !== respId) {
          return NextResponse.json(
            { error: "Unauthorized to respond to this dispute" },
            { status: 403 }
          );
        }

        const updatedDispute = await prisma.disputeResolution.update({
          where: { id: disputeId },
          data: {
            status: "investigating",
            respondedAt: new Date(),
            evidence: [
              ...disputeToRespond.evidence,
              ...responseEvidence,
            ],
            timeline: [
              ...disputeToRespond.timeline,
              {
                action: "response_submitted",
                timestamp: new Date(),
                actor: respId,
                details: response,
              },
            ],
            communicationLog: [
              ...disputeToRespond.communicationLog,
              {
                from: respId,
                message: response,
                timestamp: new Date(),
                type: "response",
              },
            ],
          },
        });

        return NextResponse.json({ dispute: updatedDispute });

      case "assign_mediator":
        const { disputeId: mediationDisputeId, mediatorId } = body;
        
        const mediatedDispute = await prisma.disputeResolution.update({
          where: { id: mediationDisputeId },
          data: {
            status: "mediation",
            assignedMediator: mediatorId,
            mediationStarted: new Date(),
            timeline: [
              ...disputeToRespond.timeline,
              {
                action: "mediator_assigned",
                timestamp: new Date(),
                actor: mediatorId,
                details: "Mediator assigned to case",
              },
            ],
          },
        });

        return NextResponse.json({ dispute: mediatedDispute });

      case "resolve_dispute":
        const {
          disputeId: resolveDisputeId,
          verdict,
          resolutionType,
          compensationAmount = 0,
          agreedSolution,
        } = body;

        const resolvedDispute = await prisma.disputeResolution.update({
          where: { id: resolveDisputeId },
          data: {
            status: "resolved",
            verdict,
            resolutionType,
            compensationAmount,
            agreedSolution,
            resolvedAt: new Date(),
            timeline: [
              ...disputeToRespond.timeline,
              {
                action: "dispute_resolved",
                timestamp: new Date(),
                actor: "system",
                details: `Resolved: ${verdict}`,
              },
            ],
          },
        });

        // Process resolution
        await processDisputeResolution(resolvedDispute);

        return NextResponse.json({ dispute: resolvedDispute });

      case "close_dispute":
        const { disputeId: closeDisputeId } = body;
        
        const closedDispute = await prisma.disputeResolution.update({
          where: { id: closeDisputeId },
          data: {
            status: "closed",
            closedAt: new Date(),
          },
        });

        return NextResponse.json({ dispute: closedDispute });

      case "escalate_dispute":
        const { disputeId: escalateDisputeId } = body;
        
        const escalatedDispute = await prisma.disputeResolution.update({
          where: { id: escalateDisputeId },
          data: {
            status: "arbitration",
            priority: "high",
            timeline: [
              ...disputeToRespond.timeline,
              {
                action: "escalated_to_arbitration",
                timestamp: new Date(),
                actor: "system",
                details: "Dispute escalated to arbitration",
              },
            ],
          },
        });

        return NextResponse.json({ dispute: escalatedDispute });

      case "add_evidence":
        const { disputeId: evidenceDisputeId, userId, evidence: newEvidence } = body;
        
        const disputeWithEvidence = await prisma.disputeResolution.findUnique({
          where: { id: evidenceDisputeId },
        });

        if (!disputeWithEvidence) {
          return NextResponse.json(
            { error: "Dispute not found" },
            { status: 404 }
          );
        }

        const updatedDisputeWithEvidence = await prisma.disputeResolution.update({
          where: { id: evidenceDisputeId },
          data: {
            evidence: [
              ...disputeWithEvidence.evidence,
              {
                submittedBy: userId,
                timestamp: new Date(),
                ...newEvidence,
              },
            ],
          },
        });

        return NextResponse.json({ dispute: updatedDisputeWithEvidence });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Dispute operation error:", error);
    return NextResponse.json(
      { error: "Failed to perform dispute operation" },
      { status: 500 }
    );
  }
}

async function processDisputeResolution(dispute: any) {
  const { transactionId, verdict, resolutionType, compensationAmount } = dispute;

  try {
    switch (resolutionType) {
      case "refund":
        // Full refund to buyer
        await prisma.escrowAccount.updateMany({
          where: { transactionId },
          data: {
            status: "refunded",
            releasedAt: new Date(),
            releaseReason: "dispute_resolved_refund",
          },
        });

        await prisma.secondaryMarketTransaction.update({
          where: { id: transactionId },
          data: { status: "refunded" },
        });
        break;

      case "partial_refund":
        // Partial refund with compensation
        await prisma.escrowAccount.updateMany({
          where: { transactionId },
          data: {
            status: "released",
            releasedAt: new Date(),
            releaseReason: "dispute_resolved_partial",
          },
        });

        await prisma.secondaryMarketTransaction.update({
          where: { id: transactionId },
          data: { status: "completed" },
        });
        break;

      case "replacement":
        // Asset replacement logic
        await prisma.secondaryMarketTransaction.update({
          where: { id: transactionId },
          data: { status: "completed" },
        });
        break;

      case "compensation":
        // Additional compensation
        await prisma.escrowAccount.updateMany({
          where: { transactionId },
          data: {
            status: "released",
            releasedAt: new Date(),
            releaseReason: "dispute_resolved_compensation",
          },
        });
        break;

      case "no_action":
        // No action required, complete transaction
        await prisma.escrowAccount.updateMany({
          where: { transactionId },
          data: {
            status: "released",
            releasedAt: new Date(),
            releaseReason: "dispute_resolved_no_action",
          },
        });

        await prisma.secondaryMarketTransaction.update({
          where: { id: transactionId },
          data: { status: "completed" },
        });
        break;
    }

    // Update escrow dispute status
    await prisma.escrowAccount.updateMany({
      where: { transactionId },
      data: { disputeResolved: true },
    });

  } catch (error) {
    console.error("Process dispute resolution error:", error);
    throw error;
  }
}

