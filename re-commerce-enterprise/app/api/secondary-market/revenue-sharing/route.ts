

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const recipientId = searchParams.get("recipientId");
    const recipientType = searchParams.get("recipientType");
    const period = searchParams.get("period");
    const revenueType = searchParams.get("revenueType");
    const paymentStatus = searchParams.get("paymentStatus");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const whereClause: any = {};
    if (recipientId) whereClause.recipientId = recipientId;
    if (recipientType) whereClause.recipientType = recipientType;
    if (period) whereClause.period = period;
    if (revenueType) whereClause.revenueType = revenueType;
    if (paymentStatus) whereClause.paymentStatus = paymentStatus;

    const revenueShares = await prisma.secondaryRevenueShare.findMany({
      where: whereClause,
      include: {
        recipient: {
          select: { id: true, name: true, email: true },
        },
        transaction: {
          include: {
            listing: {
              include: {
                assetOwnership: {
                  select: { assetType: true, assetData: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    // Calculate aggregated metrics
    const aggregatedMetrics = await prisma.secondaryRevenueShare.aggregate({
      where: whereClause,
      _sum: {
        shareAmount: true,
        grossAmount: true,
      },
      _count: true,
    });

    return NextResponse.json({
      revenueShares,
      aggregatedMetrics: {
        totalShareAmount: aggregatedMetrics._sum.shareAmount ?? 0,
        totalGrossAmount: aggregatedMetrics._sum.grossAmount ?? 0,
        totalShares: aggregatedMetrics._count,
      },
      pagination: {
        limit,
        offset,
        total: aggregatedMetrics._count,
      },
    });
  } catch (error) {
    console.error("Fetch revenue shares error:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue shares" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "calculate_shares":
        const { transactionId } = body;
        
        const transaction = await prisma.secondaryMarketTransaction.findUnique({
          where: { id: transactionId },
          include: {
            listing: {
              include: { assetOwnership: true },
            },
          },
        });

        if (!transaction) {
          return NextResponse.json(
            { error: "Transaction not found" },
            { status: 404 }
          );
        }

        const shares = await calculateRevenueShares(transaction);
        return NextResponse.json({ shares });

      case "process_payouts":
        const { recipientId, period } = body;
        
        const pendingShares = await prisma.secondaryRevenueShare.findMany({
          where: {
            recipientId,
            period,
            paymentStatus: "pending",
          },
        });

        const totalAmount = pendingShares.reduce((sum, share) => sum + share.shareAmount, 0);
        
        if (totalAmount === 0) {
          return NextResponse.json(
            { error: "No pending revenue shares found" },
            { status: 404 }
          );
        }

        // Create payout record
        const payout = await prisma.creatorPayout.create({
          data: {
            creatorId: recipientId,
            payoutType: "manual",
            period,
            totalAmount,
            secondaryRevenue: totalAmount,
            netAmount: totalAmount * 0.95, // 5% processing fee
            processingFee: totalAmount * 0.05,
            paymentMethod: "bank_transfer",
            tenantId: body.tenantId,
          },
        });

        // Update revenue shares as processing
        await prisma.secondaryRevenueShare.updateMany({
          where: {
            recipientId,
            period,
            paymentStatus: "pending",
          },
          data: {
            paymentStatus: "processing",
            paymentId: payout.id,
          },
        });

        return NextResponse.json({ payout, processedShares: pendingShares.length });

      case "update_payment_status":
        const { shareIds, status, paymentId } = body;
        
        const updatedShares = await prisma.secondaryRevenueShare.updateMany({
          where: {
            id: { in: shareIds },
          },
          data: {
            paymentStatus: status,
            paymentId: paymentId,
            paidAt: status === "paid" ? new Date() : undefined,
          },
        });

        return NextResponse.json({ updatedCount: updatedShares.count });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Revenue sharing operation error:", error);
    return NextResponse.json(
      { error: "Failed to process revenue sharing operation" },
      { status: 500 }
    );
  }
}

async function calculateRevenueShares(transaction: any) {
  const saleAmount = transaction.salePrice;
  const period = new Date().toISOString().substring(0, 7);
  
  const shares = [];

  // Platform fee (5%)
  if (transaction.platformFee > 0) {
    shares.push({
      recipientType: "platform",
      sharePercentage: transaction.platformFee / saleAmount,
      shareAmount: transaction.platformFee,
      revenueType: "platform_fee",
    });
  }

  // Seller net amount (remaining after fees)
  const sellerAmount = transaction.netAmount;
  if (sellerAmount > 0) {
    shares.push({
      recipientId: transaction.sellerId,
      recipientType: "seller",
      sharePercentage: sellerAmount / saleAmount,
      shareAmount: sellerAmount,
      revenueType: "sale_commission",
    });
  }

  // Creator royalty (3%)
  if (transaction.creatorRoyalty > 0) {
    const originalCreator = await findOriginalCreator(
      transaction.listing.assetOwnership.assetType,
      transaction.listing.assetOwnership.originalItemId
    );

    if (originalCreator) {
      shares.push({
        recipientId: originalCreator.id,
        recipientType: "creator",
        sharePercentage: transaction.creatorRoyalty / saleAmount,
        shareAmount: transaction.creatorRoyalty,
        revenueType: "royalty",
      });
    }
  }

  return shares;
}

async function findOriginalCreator(assetType: string, originalItemId: string) {
  if (assetType === "widget") {
    const widget = await prisma.marketplaceWidget.findUnique({
      where: { id: originalItemId },
      select: { creator: true },
    });
    return widget?.creator;
  } else if (assetType === "template") {
    const template = await prisma.marketplaceTemplate.findUnique({
      where: { id: originalItemId },
      select: { creator: true },
    });
    return template?.creator;
  }
  return null;
}

