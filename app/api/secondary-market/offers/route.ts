

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const listingId = searchParams.get("listingId");
    const buyerId = searchParams.get("buyerId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const whereClause: any = {};
    if (listingId) whereClause.listingId = listingId;
    if (buyerId) whereClause.buyerId = buyerId;
    if (status) whereClause.status = status;

    const offers = await prisma.secondaryMarketOffer.findMany({
      where: whereClause,
      include: {
        listing: {
          include: {
            seller: {
              select: { id: true, name: true, email: true },
            },
            assetOwnership: {
              select: { assetType: true, assetData: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({
      offers,
      pagination: {
        limit,
        offset,
        total: await prisma.secondaryMarketOffer.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Fetch offers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch offers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      listingId,
      buyerId,
      offerAmount,
      offerType = "direct",
      paymentTerms = "immediate",
      deliveryTerms = {},
      conditions,
      message,
      expirationHours = 48,
    } = body;

    // Verify listing exists and is active
    const listing = await prisma.secondaryMarketListing.findFirst({
      where: {
        id: listingId,
        status: "active",
        expiresAt: { gte: new Date() },
      },
      include: {
        assetOwnership: true,
        seller: {
          select: { id: true, name: true },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found or inactive" },
        { status: 404 }
      );
    }

    if (listing.sellerId === buyerId) {
      return NextResponse.json(
        { error: "Cannot make offer on own listing" },
        { status: 400 }
      );
    }

    // Check for existing pending offers from same buyer
    const existingOffer = await prisma.secondaryMarketOffer.findFirst({
      where: {
        listingId,
        buyerId,
        status: "pending",
      },
    });

    if (existingOffer) {
      return NextResponse.json(
        { error: "You already have a pending offer on this listing" },
        { status: 400 }
      );
    }

    // Validate offer amount
    if (listing.reservePrice && offerAmount < listing.reservePrice) {
      return NextResponse.json(
        { error: `Offer must be at least ${listing.reservePrice}` },
        { status: 400 }
      );
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expirationHours);

    const offer = await prisma.secondaryMarketOffer.create({
      data: {
        listingId,
        buyerId,
        offerAmount,
        offerType,
        paymentTerms,
        deliveryTerms,
        conditions,
        message,
        expiresAt,
      },
      include: {
        listing: {
          include: {
            seller: {
              select: { id: true, name: true, email: true },
            },
            assetOwnership: true,
          },
        },
      },
    });

    // Update listing offer count
    await prisma.secondaryMarketListing.update({
      where: { id: listingId },
      data: {
        offerCount: { increment: 1 },
      },
    });

    // Auto-accept if offer meets criteria and auto-accept is enabled
    if (listing.autoAcceptOffer && offerAmount >= listing.askingPrice) {
      const acceptedOffer = await prisma.secondaryMarketOffer.update({
        where: { id: offer.id },
        data: {
          status: "accepted",
          responseTime: new Date(),
          responseMessage: "Auto-accepted - offer meets asking price",
        },
      });

      // Create transaction
      const transaction = await createSecondaryTransaction(
        acceptedOffer,
        listing
      );

      return NextResponse.json({
        offer: acceptedOffer,
        transaction,
        autoAccepted: true,
      });
    }

    return NextResponse.json({ offer });
  } catch (error) {
    console.error("Create offer error:", error);
    return NextResponse.json(
      { error: "Failed to create offer" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, responseMessage, counterOffer } = body;

    const offer = await prisma.secondaryMarketOffer.findUnique({
      where: { id },
      include: {
        listing: {
          include: {
            seller: {
              select: { id: true, name: true },
            },
            assetOwnership: true,
          },
        },
      },
    });

    if (!offer) {
      return NextResponse.json(
        { error: "Offer not found" },
        { status: 404 }
      );
    }

    if (offer.status !== "pending") {
      return NextResponse.json(
        { error: "Offer is no longer pending" },
        { status: 400 }
      );
    }

    let updateData: any = {
      responseTime: new Date(),
      responseMessage,
    };

    switch (action) {
      case "accept":
        updateData.status = "accepted";
        
        // Create transaction
        const transaction = await createSecondaryTransaction(offer, offer.listing);
        
        // Mark listing as sold
        await prisma.secondaryMarketListing.update({
          where: { id: offer.listingId },
          data: { status: "sold" },
        });

        // Reject all other pending offers
        await prisma.secondaryMarketOffer.updateMany({
          where: {
            listingId: offer.listingId,
            id: { not: id },
            status: "pending",
          },
          data: {
            status: "rejected",
            responseMessage: "Listing sold to another buyer",
          },
        });

        const acceptedOffer = await prisma.secondaryMarketOffer.update({
          where: { id },
          data: updateData,
        });

        return NextResponse.json({
          offer: acceptedOffer,
          transaction,
        });

      case "reject":
        updateData.status = "rejected";
        break;

      case "counter":
        if (!counterOffer) {
          return NextResponse.json(
            { error: "Counter offer amount required" },
            { status: 400 }
          );
        }
        updateData.counterOffer = counterOffer;
        updateData.status = "pending"; // Keep as pending for counter-offer
        break;

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

    const updatedOffer = await prisma.secondaryMarketOffer.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ offer: updatedOffer });
  } catch (error) {
    console.error("Update offer error:", error);
    return NextResponse.json(
      { error: "Failed to update offer" },
      { status: 500 }
    );
  }
}

async function createSecondaryTransaction(offer: any, listing: any) {
  // Calculate fees and royalties
  const salePrice = offer.offerAmount;
  const platformFeeRate = 0.05; // 5% platform fee
  const creatorRoyaltyRate = 0.03; // 3% creator royalty
  
  const platformFee = salePrice * platformFeeRate;
  const creatorRoyalty = salePrice * creatorRoyaltyRate;
  const totalFees = platformFee + creatorRoyalty;
  const netAmount = salePrice - totalFees;

  const transactionHash = generateTransactionHash();

  const transaction = await prisma.secondaryMarketTransaction.create({
    data: {
      listingId: listing.id,
      buyerId: offer.buyerId,
      sellerId: listing.sellerId,
      transactionType: "sale",
      salePrice,
      platformFee,
      creatorRoyalty,
      totalFees,
      netAmount,
      paymentMethod: offer.paymentTerms,
      status: "payment_processing",
      transactionHash,
    },
  });

  return transaction;
}

function generateTransactionHash(): string {
  return `tx_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

