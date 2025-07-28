
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const userId = searchParams.get("userId");
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const rarity = searchParams.get("rarity");
    const isActive = searchParams.get("isActive");
    const availableOnly = searchParams.get("availableOnly") === "true";
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = { tenantId };
    if (category) whereClause.category = category;
    if (type) whereClause.type = type;
    if (rarity) whereClause.rarity = rarity;
    if (isActive !== null) whereClause.isActive = isActive === "true";
    
    if (availableOnly) {
      const now = new Date();
      whereClause.availableFrom = { lte: now };
      whereClause.OR = [
        { availableUntil: null },
        { availableUntil: { gte: now } },
      ];
    }

    // Get user's gamification profile if userId provided
    let userProfile = null;
    if (userId) {
      userProfile = await prisma.gamificationProfile.findUnique({
        where: { userId },
      });
    }

    const rewardItems = await prisma.rewardItem.findMany({
      where: whereClause,
      include: {
        redemptions: userId && userProfile ? {
          where: { profileId: userProfile.id },
          orderBy: { createdAt: "desc" },
          take: 1,
        } : false,
        _count: {
          select: {
            redemptions: true,
          },
        },
      },
      orderBy: [
        { rarity: "desc" },
        { totalPurchases: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      skip: offset,
    });

    const totalCount = await prisma.rewardItem.count({
      where: whereClause,
    });

    // Filter items based on user requirements
    const availableItems = rewardItems.map(item => {
      let canPurchase = true;
      let purchaseBlockers: string[] = [];

      if (userProfile) {
        // Check level requirement
        if (item.levelRequirement > userProfile.currentLevel) {
          canPurchase = false;
          purchaseBlockers.push(`Requires level ${item.levelRequirement}`);
        }

        // Check tier requirement
        if (item.tierRequirement && item.tierRequirement !== userProfile.currentTier) {
          canPurchase = false;
          purchaseBlockers.push(`Requires ${item.tierRequirement} tier`);
        }

        // Check stock
        if (item.stock !== null && item.stock <= 0) {
          canPurchase = false;
          purchaseBlockers.push("Out of stock");
        }

        // Check max per user
        if (item.maxPerUser && item.redemptions && item.redemptions.length >= item.maxPerUser) {
          canPurchase = false;
          purchaseBlockers.push("Purchase limit reached");
        }

        // Check balance for each currency in cost
        const cost = item.cost as any;
        for (const [currency, amount] of Object.entries(cost)) {
          if (typeof amount === "number") {
            let userBalance = 0;
            switch (currency) {
              case "coins":
                userBalance = userProfile.gamificationCoins;
                break;
              case "gems":
                userBalance = userProfile.premiumGems;
                break;
              case "xp":
                userBalance = userProfile.experiencePoints;
                break;
              case "reputation":
                userBalance = userProfile.reputationPoints;
                break;
            }
            
            if (userBalance < amount) {
              canPurchase = false;
              purchaseBlockers.push(`Insufficient ${currency} (need ${amount}, have ${userBalance})`);
            }
          }
        }
      }

      return {
        ...item,
        canPurchase,
        purchaseBlockers,
        userRedemptions: item.redemptions || [],
        totalRedemptions: item._count.redemptions,
        redemptions: undefined,
        _count: undefined,
      };
    });

    return NextResponse.json({
      rewardItems: availableItems,
      pagination: {
        limit,
        offset,
        total: totalCount,
      },
    });
  } catch (error) {
    console.error("Reward items fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reward items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId,
      name,
      description,
      category,
      type,
      cost = {},
      originalValue = {},
      discountPercentage = 0,
      isActive = true,
      stock,
      maxPerUser,
      levelRequirement = 1,
      tierRequirement,
      achievements = [],
      imageUrl,
      iconUrl,
      rarity = "common",
      availableFrom,
      availableUntil,
      isLimitedTime = false,
      benefits = [],
      duration,
      stackable = false,
      tradeable = false,
    } = body;

    if (!tenantId || !name || !description || !category || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const rewardItem = await prisma.rewardItem.create({
      data: {
        tenantId,
        name,
        description,
        category,
        type,
        cost,
        originalValue,
        discountPercentage,
        isActive,
        stock,
        maxPerUser,
        levelRequirement,
        tierRequirement,
        achievements,
        imageUrl,
        iconUrl,
        rarity,
        availableFrom: availableFrom ? new Date(availableFrom) : new Date(),
        availableUntil: availableUntil ? new Date(availableUntil) : null,
        isLimitedTime,
        benefits,
        duration,
        stackable,
        tradeable,
      },
    });

    return NextResponse.json({ rewardItem }, { status: 201 });
  } catch (error) {
    console.error("Reward item creation error:", error);
    return NextResponse.json(
      { error: "Failed to create reward item" },
      { status: 500 }
    );
  }
}
