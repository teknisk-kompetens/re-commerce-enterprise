

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ownerId = searchParams.get("ownerId");
    const assetType = searchParams.get("assetType");
    const isListedForSale = searchParams.get("isListedForSale");
    const marketStatus = searchParams.get("marketStatus");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!ownerId) {
      return NextResponse.json(
        { error: "Owner ID is required" },
        { status: 400 }
      );
    }

    const whereClause: any = { currentOwnerId: ownerId };
    if (assetType) whereClause.assetType = assetType;
    if (isListedForSale !== null) whereClause.isListedForSale = isListedForSale === "true";
    if (marketStatus) whereClause.marketStatus = marketStatus;

    const assets = await prisma.digitalAssetOwnership.findMany({
      where: whereClause,
      include: {
        currentOwner: {
          select: { id: true, name: true, email: true },
        },
        previousOwner: {
          select: { id: true, name: true, email: true },
        },
        secondaryListings: {
          where: { status: "active" },
          take: 1,
          orderBy: { createdAt: "desc" },
        },
        assetTransfers: {
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            transferUser: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { acquisitionDate: "desc" },
      take: limit,
      skip: offset,
    });

    // Get original asset details
    const assetsWithDetails = await Promise.all(assets.map(async (asset) => {
      let originalAssetDetails = null;
      
      if (asset.assetType === "widget") {
        originalAssetDetails = await prisma.marketplaceWidget.findUnique({
          where: { id: asset.originalItemId },
          select: {
            id: true,
            name: true,
            displayName: true,
            description: true,
            category: true,
            previewImage: true,
            tags: true,
            creator: {
              select: { id: true, name: true },
            },
          },
        });
      } else if (asset.assetType === "template") {
        originalAssetDetails = await prisma.marketplaceTemplate.findUnique({
          where: { id: asset.originalItemId },
          select: {
            id: true,
            name: true,
            displayName: true,
            description: true,
            category: true,
            previewImage: true,
            tags: true,
            creator: {
              select: { id: true, name: true },
            },
          },
        });
      }

      // Get market analytics
      const marketAnalytics = await prisma.marketDemandAnalytics.findFirst({
        where: {
          assetType: asset.assetType,
          assetId: asset.assetId,
          period: "daily",
        },
        orderBy: { date: "desc" },
      });

      return {
        ...asset,
        originalAssetDetails,
        marketAnalytics,
        estimatedValue: marketAnalytics?.averagePrice ?? asset.currentValuation,
        priceTarget: marketAnalytics?.priceTarget ?? asset.currentValuation,
      };
    }));

    return NextResponse.json({
      assets: assetsWithDetails,
      pagination: {
        limit,
        offset,
        total: await prisma.digitalAssetOwnership.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Fetch assets error:", error);
    return NextResponse.json(
      { error: "Failed to fetch digital assets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, assetId, userId } = body;

    switch (action) {
      case "create_ownership":
        // This is called when a user purchases an asset from primary marketplace
        const { transactionId, assetType, originalItemId, purchasePrice } = body;

        const ownershipProof = generateOwnershipProof(userId, originalItemId);

        const ownership = await prisma.digitalAssetOwnership.create({
          data: {
            assetType,
            assetId: originalItemId,
            originalItemId,
            currentOwnerId: userId,
            originalPurchaseId: transactionId,
            originalPrice: purchasePrice,
            currentValuation: purchasePrice,
            licenseType: "standard",
            transferRights: "resellable",
            ownershipProof,
            tenantId: body.tenantId,
          },
        });

        return NextResponse.json({ ownership });

      case "update_valuation":
        const { newValuation } = body;
        
        const asset = await prisma.digitalAssetOwnership.findFirst({
          where: { id: assetId, currentOwnerId: userId },
        });

        if (!asset) {
          return NextResponse.json(
            { error: "Asset not found or not owned by user" },
            { status: 404 }
          );
        }

        const updatedAsset = await prisma.digitalAssetOwnership.update({
          where: { id: assetId },
          data: { currentValuation: newValuation },
        });

        return NextResponse.json({ asset: updatedAsset });

      case "transfer_asset":
        const { toUserId, transferType = "gift", transferReason } = body;

        const assetToTransfer = await prisma.digitalAssetOwnership.findFirst({
          where: { 
            id: assetId, 
            currentOwnerId: userId,
            transferRights: { not: "non_transferable" },
          },
        });

        if (!assetToTransfer) {
          return NextResponse.json(
            { error: "Asset not found or not transferable" },
            { status: 404 }
          );
        }

        // Create transfer record
        const transferHash = generateTransferHash();
        
        await prisma.assetTransferHistory.create({
          data: {
            assetOwnershipId: assetId,
            fromUserId: userId,
            toUserId,
            transferType,
            transferReason,
            transferHash,
            verified: true,
            verificationMethod: "manual",
            verifiedAt: new Date(),
          },
        });

        // Update ownership
        const transferredAsset = await prisma.digitalAssetOwnership.update({
          where: { id: assetId },
          data: {
            previousOwnerId: userId,
            currentOwnerId: toUserId,
            transferHistory: [
              ...assetToTransfer.transferHistory,
              {
                from: userId,
                to: toUserId,
                type: transferType,
                reason: transferReason,
                date: new Date(),
                hash: transferHash,
              },
            ],
          },
        });

        return NextResponse.json({ asset: transferredAsset });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Asset operation error:", error);
    return NextResponse.json(
      { error: "Failed to perform asset operation" },
      { status: 500 }
    );
  }
}

function generateOwnershipProof(userId: string, assetId: string): string {
  const timestamp = Date.now();
  const data = `${userId}_${assetId}_${timestamp}`;
  return `proof_${Buffer.from(data).toString('base64').substring(0, 20)}`;
}

function generateTransferHash(): string {
  return `transfer_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

