

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const transactionId = searchParams.get("transactionId");
    const buyerId = searchParams.get("buyerId");
    const sellerId = searchParams.get("sellerId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const whereClause: any = {};
    if (transactionId) whereClause.transactionId = transactionId;
    if (buyerId) whereClause.buyerId = buyerId;
    if (sellerId) whereClause.sellerId = sellerId;
    if (status) whereClause.status = status;

    const escrowAccounts = await prisma.escrowAccount.findMany({
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
          },
        },
        buyer: {
          select: { id: true, name: true, email: true },
        },
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      escrowAccounts,
      pagination: {
        limit,
        offset,
        total: await prisma.escrowAccount.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Fetch escrow accounts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch escrow accounts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "create_escrow":
        const {
          transactionId,
          buyerId,
          sellerId,
          escrowAmount,
          autoReleaseAfter = 72,
          requiresBothParties = false,
        } = body;

        // Verify transaction exists
        const transaction = await prisma.secondaryMarketTransaction.findUnique({
          where: { id: transactionId },
        });

        if (!transaction) {
          return NextResponse.json(
            { error: "Transaction not found" },
            { status: 404 }
          );
        }

        if (transaction.status !== "payment_processing") {
          return NextResponse.json(
            { error: "Transaction not in payment processing status" },
            { status: 400 }
          );
        }

        const escrowId = generateEscrowId();
        const securityHash = generateSecurityHash(escrowId, escrowAmount);

        const escrowAccount = await prisma.escrowAccount.create({
          data: {
            transactionId,
            buyerId,
            sellerId,
            escrowAmount,
            escrowFee: escrowAmount * 0.01, // 1% escrow fee
            autoReleaseAfter,
            requiresBothParties,
            escrowId,
            securityHash,
            releaseConditions: {
              deliveryRequired: true,
              qualityApprovalRequired: true,
              autoReleaseEnabled: !requiresBothParties,
            },
            tenantId: body.tenantId,
          },
          include: {
            transaction: true,
            buyer: {
              select: { id: true, name: true },
            },
            seller: {
              select: { id: true, name: true },
            },
          },
        });

        // Update transaction status
        await prisma.secondaryMarketTransaction.update({
          where: { id: transactionId },
          data: {
            status: "in_escrow",
            escrowId: escrowAccount.escrowId,
          },
        });

        return NextResponse.json({ escrowAccount });

      case "fund_escrow":
        const { escrowAccountId, paymentMethod, paymentId } = body;
        
        const fundedEscrow = await prisma.escrowAccount.update({
          where: { id: escrowAccountId },
          data: {
            status: "funded",
            fundedAt: new Date(),
          },
        });

        return NextResponse.json({ escrowAccount: fundedEscrow });

      case "confirm_delivery":
        const { escrowAccountId: deliveryEscrowId, userId, confirmationType } = body;
        
        const escrowForDelivery = await prisma.escrowAccount.findUnique({
          where: { id: deliveryEscrowId },
          include: { transaction: true },
        });

        if (!escrowForDelivery) {
          return NextResponse.json(
            { error: "Escrow account not found" },
            { status: 404 }
          );
        }

        if (escrowForDelivery.status !== "funded") {
          return NextResponse.json(
            { error: "Escrow not in funded status" },
            { status: 400 }
          );
        }

        const updateData: any = {};
        
        if (confirmationType === "delivery" && userId === escrowForDelivery.buyerId) {
          updateData.deliveryConfirmed = true;
        } else if (confirmationType === "quality" && userId === escrowForDelivery.buyerId) {
          updateData.qualityApproved = true;
        } else {
          return NextResponse.json(
            { error: "Invalid confirmation type or unauthorized user" },
            { status: 400 }
          );
        }

        const updatedEscrow = await prisma.escrowAccount.update({
          where: { id: deliveryEscrowId },
          data: updateData,
        });

        // Check if we can auto-release
        if (updatedEscrow.deliveryConfirmed && updatedEscrow.qualityApproved) {
          return await releaseEscrow(deliveryEscrowId, "delivery_and_quality_confirmed");
        }

        return NextResponse.json({ escrowAccount: updatedEscrow });

      case "release_escrow":
        const { escrowAccountId: releaseEscrowId, reason = "manual_release" } = body;
        return await releaseEscrow(releaseEscrowId, reason);

      case "refund_escrow":
        const { escrowAccountId: refundEscrowId, reason: refundReason = "buyer_request" } = body;
        
        const refundedEscrow = await prisma.escrowAccount.update({
          where: { id: refundEscrowId },
          data: {
            status: "refunded",
            releasedAt: new Date(),
            releaseReason: refundReason,
          },
        });

        // Update transaction status
        await prisma.secondaryMarketTransaction.update({
          where: { id: refundedEscrow.transactionId },
          data: { status: "refunded" },
        });

        return NextResponse.json({ escrowAccount: refundedEscrow });

      case "dispute_escrow":
        const { escrowAccountId: disputeEscrowId } = body;
        
        const disputedEscrow = await prisma.escrowAccount.update({
          where: { id: disputeEscrowId },
          data: {
            status: "disputed",
            disputeResolved: false,
          },
        });

        // Update transaction status
        await prisma.secondaryMarketTransaction.update({
          where: { id: disputedEscrow.transactionId },
          data: { status: "disputed" },
        });

        return NextResponse.json({ escrowAccount: disputedEscrow });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Escrow operation error:", error);
    return NextResponse.json(
      { error: "Failed to perform escrow operation" },
      { status: 500 }
    );
  }
}

async function releaseEscrow(escrowAccountId: string, reason: string) {
  try {
    const escrowAccount = await prisma.escrowAccount.findUnique({
      where: { id: escrowAccountId },
      include: { transaction: true },
    });

    if (!escrowAccount) {
      return NextResponse.json(
        { error: "Escrow account not found" },
        { status: 404 }
      );
    }

    // Release escrow
    const releasedEscrow = await prisma.escrowAccount.update({
      where: { id: escrowAccountId },
      data: {
        status: "released",
        releasedAt: new Date(),
        releaseReason: reason,
      },
    });

    // Complete transaction
    await prisma.secondaryMarketTransaction.update({
      where: { id: escrowAccount.transactionId },
      data: {
        status: "completed",
        completedAt: new Date(),
        escrowReleasedAt: new Date(),
      },
    });

    // Process final revenue shares and asset transfer
    await processTransactionCompletion(escrowAccount.transaction);

    return NextResponse.json({ escrowAccount: releasedEscrow });
  } catch (error) {
    console.error("Release escrow error:", error);
    return NextResponse.json(
      { error: "Failed to release escrow" },
      { status: 500 }
    );
  }
}

async function processTransactionCompletion(transaction: any) {
  // Transfer asset ownership
  const listing = await prisma.secondaryMarketListing.findUnique({
    where: { id: transaction.listingId },
    include: { assetOwnership: true },
  });

  if (listing) {
    // Create transfer history
    await prisma.assetTransferHistory.create({
      data: {
        assetOwnershipId: listing.assetOwnership.id,
        transactionId: transaction.id,
        fromUserId: transaction.sellerId,
        toUserId: transaction.buyerId,
        transferType: "purchase",
        transferPrice: transaction.salePrice,
        transferHash: generateTransferHash(),
        verified: true,
        verificationMethod: "automated",
        verifiedAt: new Date(),
      },
    });

    // Update asset ownership
    await prisma.digitalAssetOwnership.update({
      where: { id: listing.assetOwnership.id },
      data: {
        previousOwnerId: transaction.sellerId,
        currentOwnerId: transaction.buyerId,
        currentValuation: transaction.salePrice,
        isListedForSale: false,
        marketStatus: "owned",
      },
    });
  }

  // Process revenue shares
  const period = new Date().toISOString().substring(0, 7);

  // Platform fee
  if (transaction.platformFee > 0) {
    await prisma.secondaryRevenueShare.create({
      data: {
        transactionId: transaction.id,
        recipientId: "platform",
        recipientType: "platform",
        grossAmount: transaction.salePrice,
        sharePercentage: transaction.platformFee / transaction.salePrice,
        shareAmount: transaction.platformFee,
        revenueType: "platform_fee",
        period,
        paymentStatus: "paid",
        paidAt: new Date(),
      },
    });
  }

  // Creator royalty
  if (transaction.creatorRoyalty > 0 && listing) {
    const originalCreator = await findOriginalCreator(
      listing.assetOwnership.assetType,
      listing.assetOwnership.originalItemId
    );

    if (originalCreator) {
      await prisma.creatorRoyalty.create({
        data: {
          transactionId: transaction.id,
          originalCreatorId: originalCreator.id,
          assetType: listing.assetOwnership.assetType,
          originalAssetId: listing.assetOwnership.originalItemId,
          saleAmount: transaction.salePrice,
          royaltyRate: transaction.creatorRoyalty / transaction.salePrice,
          royaltyAmount: transaction.creatorRoyalty,
          status: "processed",
        },
      });
    }
  }
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

function generateEscrowId(): string {
  return `escrow_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function generateSecurityHash(escrowId: string, amount: number): string {
  return `hash_${escrowId}_${amount}_${Date.now()}`;
}

function generateTransferHash(): string {
  return `transfer_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

