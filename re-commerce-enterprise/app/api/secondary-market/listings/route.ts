

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const assetType = searchParams.get("assetType");
    const status = searchParams.get("status") ?? "active";
    const sellerId = searchParams.get("sellerId");
    const category = searchParams.get("category");
    const listingType = searchParams.get("listingType");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const sortBy = searchParams.get("sortBy") ?? "newest";
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const whereClause: any = {
      status,
      visibility: "public",
      expiresAt: { gte: new Date() },
      ...(assetType && { assetOwnership: { assetType } }),
      ...(sellerId && { sellerId }),
      ...(listingType && { listingType }),
      ...(category && { assetOwnership: { assetData: { path: ["category"], equals: category } } }),
    };

    if (priceMin || priceMax) {
      whereClause.askingPrice = {};
      if (priceMin) whereClause.askingPrice.gte = parseFloat(priceMin);
      if (priceMax) whereClause.askingPrice.lte = parseFloat(priceMax);
    }

    let orderBy: any = { createdAt: "desc" };
    switch (sortBy) {
      case "price_low":
        orderBy = { askingPrice: "asc" };
        break;
      case "price_high":
        orderBy = { askingPrice: "desc" };
        break;
      case "popular":
        orderBy = { viewCount: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "ending_soon":
        orderBy = { expiresAt: "asc" };
        break;
    }

    const listings = await prisma.secondaryMarketListing.findMany({
      where: whereClause,
      include: {
        seller: {
          select: { id: true, name: true, email: true },
        },
        assetOwnership: {
          include: {
            currentOwner: {
              select: { id: true, name: true, email: true },
            },
          },
        },
        offers: {
          take: 3,
          orderBy: { createdAt: "desc" },
          include: {
            listing: {
              select: { id: true, title: true },
            },
          },
        },
        _count: {
          select: { offers: true, secondaryTransactions: true },
        },
      },
      orderBy,
      take: limit,
      skip: offset,
    });

    // Get analytics for each listing
    const listingsWithAnalytics = await Promise.all(listings.map(async (listing) => {
      const analytics = await prisma.marketDemandAnalytics.findFirst({
        where: {
          assetType: listing.assetOwnership.assetType,
          assetId: listing.assetOwnership.assetId,
          period: "daily",
          date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        orderBy: { date: "desc" },
      });

      return {
        ...listing,
        marketAnalytics: analytics,
        demandScore: analytics?.demandScore ?? 0,
        priceTarget: analytics?.priceTarget ?? listing.askingPrice,
      };
    }));

    return NextResponse.json({
      listings: listingsWithAnalytics,
      pagination: {
        limit,
        offset,
        total: await prisma.secondaryMarketListing.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Secondary market listings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch secondary market listings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      assetOwnershipId,
      sellerId,
      listingType = "fixed_price",
      askingPrice,
      reservePrice,
      title,
      description,
      tags = [],
      images = [],
      pricingStrategy = "market_rate",
      negotiable = true,
      listingDuration = 30,
      visibility = "public",
    } = body;

    // Verify asset ownership
    const assetOwnership = await prisma.digitalAssetOwnership.findFirst({
      where: {
        id: assetOwnershipId,
        currentOwnerId: sellerId,
        transferRights: { not: "non_transferable" },
        isListedForSale: false,
      },
    });

    if (!assetOwnership) {
      return NextResponse.json(
        { error: "Asset not found or not eligible for listing" },
        { status: 404 }
      );
    }

    // Calculate optimal pricing using market analytics
    const marketData = await prisma.marketDemandAnalytics.findFirst({
      where: {
        assetType: assetOwnership.assetType,
        assetId: assetOwnership.assetId,
        period: "daily",
      },
      orderBy: { date: "desc" },
    });

    let suggestedPrice = askingPrice;
    if (pricingStrategy === "market_rate" && marketData) {
      suggestedPrice = marketData.averagePrice * 1.1; // 10% above market average
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + listingDuration);

    const listing = await prisma.secondaryMarketListing.create({
      data: {
        assetOwnershipId,
        sellerId,
        listingType,
        askingPrice: suggestedPrice,
        reservePrice,
        title,
        description,
        tags,
        images,
        pricingStrategy,
        negotiable,
        expiresAt,
        visibility,
        priceHistory: [
          {
            price: suggestedPrice,
            timestamp: new Date(),
            reason: "initial_listing",
          },
        ],
      },
      include: {
        assetOwnership: true,
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Update asset ownership status
    await prisma.digitalAssetOwnership.update({
      where: { id: assetOwnershipId },
      data: {
        isListedForSale: true,
        listingPrice: suggestedPrice,
        marketStatus: "listed",
      },
    });

    return NextResponse.json({
      listing,
      suggestedPrice,
      marketData,
    });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      sellerId,
      askingPrice,
      title,
      description,
      tags,
      images,
      status,
      pricingStrategy,
      negotiable,
    } = body;

    // Verify ownership
    const existingListing = await prisma.secondaryMarketListing.findFirst({
      where: { id, sellerId },
      include: { assetOwnership: true },
    });

    if (!existingListing) {
      return NextResponse.json(
        { error: "Listing not found or unauthorized" },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (tags !== undefined) updateData.tags = tags;
    if (images !== undefined) updateData.images = images;
    if (status !== undefined) updateData.status = status;
    if (pricingStrategy !== undefined) updateData.pricingStrategy = pricingStrategy;
    if (negotiable !== undefined) updateData.negotiable = negotiable;

    // Handle price changes
    if (askingPrice !== undefined && askingPrice !== existingListing.askingPrice) {
      updateData.askingPrice = askingPrice;
      updateData.priceHistory = [
        ...existingListing.priceHistory,
        {
          price: askingPrice,
          timestamp: new Date(),
          previousPrice: existingListing.askingPrice,
          reason: "price_update",
        },
      ];
    }

    const updatedListing = await prisma.secondaryMarketListing.update({
      where: { id },
      data: updateData,
      include: {
        assetOwnership: true,
        seller: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Update asset ownership if status changed
    if (status === "cancelled" || status === "sold") {
      await prisma.digitalAssetOwnership.update({
        where: { id: existingListing.assetOwnershipId },
        data: {
          isListedForSale: false,
          marketStatus: status === "sold" ? "sold" : "owned",
        },
      });
    }

    return NextResponse.json({ listing: updatedListing });
  } catch (error) {
    console.error("Update listing error:", error);
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 }
    );
  }
}

