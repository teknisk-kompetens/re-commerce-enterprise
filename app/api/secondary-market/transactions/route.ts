

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const type = searchParams.get("type"); // "buyer" or "seller"
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const whereClause: any = {};
    if (userId && type) {
      whereClause[type === "buyer" ? "buyerId" : "sellerId"] = userId;
    }
    if (status) whereClause.status = status;

    const transactions = await prisma.secondaryMarketTransaction.findMany({
      where: whereClause,
      include: {
        buyer: {
          select: { id: true, name: true, email: true },
        },
        seller: {
          select: { id: true, name: true, email: true },
        },
        listing: {
          include: {
            assetOwnership: {
              select: { assetType: true, assetData: true },
            },
          },
        },
        escrowAccount: true,
        revenueShares: true,
        disputes: {
          where: { status: { in: ["open", "investigating", "mediation"] } },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      transactions,
      pagination: {
        limit,
        offset,
        total: await prisma.secondaryMarketTransaction.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Fetch transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, transactionId, userId } = body;

    const transaction = await prisma.secondaryMarketTransaction.findUnique({
      where: { id: transactionId },
      include: {
        listing: {
          include: { assetOwnership: true },
        },
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

    switch (action) {
      case "process_payment":
        if (transaction.status !== "pending") {
          return NextResponse.json(
            { error: "Transaction not in pending status" },
            { status: 400 }
          );
        }

        // Create escrow account
        const escrowAccount = await prisma.escrowAccount.create({
          data: {
            transactionId: transaction.id,
            buyerId: transaction.buyerId,
            sellerId: transaction.sellerId,
            escrowAmount: transaction.salePrice,
            escrowFee: transaction.salePrice * 0.01, // 1% escrow fee
            escrowId: `escrow_${Date.now()}`,
            securityHash: generateSecurityHash(),
            status: "funded",
            fundedAt: new Date(),
            tenantId: transaction.tenantId,
          },
        });

        // Update transaction status
        const updatedTransaction = await prisma.secondaryMarketTransaction.update({
          where: { id: transactionId },
          data: {
            status: "in_escrow",
            paymentAt: new Date(),
            escrowId: escrowAccount.escrowId,
          },
        });

        return NextResponse.json({
          transaction: updatedTransaction,
          escrowAccount,
        });

      case "confirm_delivery":
        if (transaction.buyerId !== userId) {
          return NextResponse.json(
            { error: "Only buyer can confirm delivery" },
            { status: 403 }
          );
        }

        if (transaction.status !== "in_escrow") {
          return NextResponse.json(
            { error: "Transaction not in escrow" },
            { status: 400 }
          );
        }

        // Update escrow account
        await prisma.escrowAccount.update({
          where: { transactionId },
          data: {
            deliveryConfirmed: true,
            qualityApproved: true,
          },
        });

        // Transfer asset ownership
        await transferAssetOwnership(transaction);

        // Complete transaction
        const completedTransaction = await prisma.secondaryMarketTransaction.update({
          where: { id: transactionId },
          data: {
            status: "completed",
            completedAt: new Date(),
            assetTransferredAt: new Date(),
            transferConfirmed: true,
          },
        });

        // Process revenue shares
        await processRevenueShares(transaction);

        // Release escrow
        await prisma.escrowAccount.update({
          where: { transactionId },
          data: {
            status: "released",
            releasedAt: new Date(),
            releaseReason: "delivery_confirmed",
          },
        });

        return NextResponse.json({ transaction: completedTransaction });

      case "dispute":
        const dispute = await prisma.disputeResolution.create({
          data: {
            transactionId,
            submitterId: userId,
            respondentId: userId === transaction.buyerId ? transaction.sellerId : transaction.buyerId,
            disputeType: body.disputeType || "quality",
            category: "commercial",
            title: body.title || "Transaction Dispute",
            description: body.description || "Dispute submitted",
            evidence: body.evidence || [],
            tenantId: transaction.tenantId,
          },
        });

        await prisma.secondaryMarketTransaction.update({
          where: { id: transactionId },
          data: { status: "disputed" },
        });

        return NextResponse.json({ dispute });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Process transaction error:", error);
    return NextResponse.json(
      { error: "Failed to process transaction" },
      { status: 500 }
    );
  }
}

async function transferAssetOwnership(transaction: any) {
  const assetOwnership = transaction.listing.assetOwnership;

  // Create transfer history record
  await prisma.assetTransferHistory.create({
    data: {
      assetOwnershipId: assetOwnership.id,
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
    where: { id: assetOwnership.id },
    data: {
      previousOwnerId: assetOwnership.currentOwnerId,
      currentOwnerId: transaction.buyerId,
      currentValuation: transaction.salePrice,
      isListedForSale: false,
      marketStatus: "owned",
      transferHistory: [
        ...assetOwnership.transferHistory,
        {
          from: transaction.sellerId,
          to: transaction.buyerId,
          price: transaction.salePrice,
          date: new Date(),
          transactionId: transaction.id,
        },
      ],
    },
  });
}

async function processRevenueShares(transaction: any) {
  const saleAmount = transaction.salePrice;
  const period = new Date().toISOString().substring(0, 7); // YYYY-MM format

  // Platform fee
  if (transaction.platformFee > 0) {
    await prisma.secondaryRevenueShare.create({
      data: {
        transactionId: transaction.id,
        recipientId: "platform", // Special platform recipient
        recipientType: "platform",
        grossAmount: saleAmount,
        sharePercentage: transaction.platformFee / saleAmount,
        shareAmount: transaction.platformFee,
        revenueType: "platform_fee",
        period,
      },
    });
  }

  // Creator royalty
  if (transaction.creatorRoyalty > 0) {
    // Find original creator from the asset
    const assetOwnership = await prisma.digitalAssetOwnership.findUnique({
      where: { id: transaction.listing.assetOwnershipId },
    });

    if (assetOwnership) {
      const originalCreator = await findOriginalCreator(
        assetOwnership.assetType,
        assetOwnership.originalItemId
      );

      if (originalCreator) {
        await prisma.creatorRoyalty.create({
          data: {
            transactionId: transaction.id,
            originalCreatorId: originalCreator.id,
            assetType: assetOwnership.assetType,
            originalAssetId: assetOwnership.originalItemId,
            saleAmount,
            royaltyRate: transaction.creatorRoyalty / saleAmount,
            royaltyAmount: transaction.creatorRoyalty,
            generationCount: 1, // This is a direct resale
          },
        });
      }
    }
  }
}

async function findOriginalCreator(assetType: string, originalItemId: string) {
  if (assetType === "widget") {
    return await prisma.marketplaceWidget.findUnique({
      where: { id: originalItemId },
      select: { creator: true },
    }).then(widget => widget?.creator);
  } else if (assetType === "template") {
    return await prisma.marketplaceTemplate.findUnique({
      where: { id: originalItemId },
      select: { creator: true },
    }).then(template => template?.creator);
  }
  return null;
}

function generateSecurityHash(): string {
  return `hash_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

function generateTransferHash(): string {
  return `transfer_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

