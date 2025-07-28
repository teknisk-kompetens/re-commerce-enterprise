
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
    const rarity = searchParams.get("rarity");
    const difficulty = searchParams.get("difficulty");
    const unlockedOnly = searchParams.get("unlockedOnly") === "true";
    const availableOnly = searchParams.get("availableOnly") === "true";
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = { tenantId };
    if (category) whereClause.category = category;
    if (rarity) whereClause.rarity = rarity;
    if (difficulty) whereClause.difficulty = difficulty;
    
    if (availableOnly) {
      whereClause.OR = [
        { availableUntil: null },
        { availableUntil: { gte: new Date() } },
      ];
      whereClause.availableFrom = { lte: new Date() };
    }

    const achievements = await prisma.gamificationAchievement.findMany({
      where: whereClause,
      include: {
        userAchievements: userId ? {
          where: {
            profile: {
              userId,
            },
          },
        } : false,
        _count: {
          select: {
            userAchievements: {
              where: {
                isUnlocked: true,
              },
            },
          },
        },
      },
      orderBy: [
        { rarity: "desc" },
        { pointValue: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      skip: offset,
    });

    // Filter by unlocked status if requested
    let filteredAchievements = achievements;
    if (unlockedOnly && userId) {
      filteredAchievements = achievements.filter(achievement => 
        achievement.userAchievements && achievement.userAchievements.length > 0 && 
        achievement.userAchievements[0].isUnlocked
      );
    }

    const totalCount = await prisma.gamificationAchievement.count({
      where: whereClause,
    });

    // Calculate user progress if userId provided
    const achievementsWithProgress = filteredAchievements.map(achievement => {
      const userAchievement = achievement.userAchievements?.[0];
      const unlockedCount = achievement._count.userAchievements;
      
      return {
        ...achievement,
        userProgress: userAchievement ? {
          currentProgress: userAchievement.currentProgress,
          isUnlocked: userAchievement.isUnlocked,
          unlockedAt: userAchievement.unlockedAt,
          isFavorite: userAchievement.isFavorite,
          progressPercentage: achievement.maxProgress ? 
            (userAchievement.currentProgress / achievement.maxProgress) * 100 : 
            userAchievement.isUnlocked ? 100 : 0,
        } : null,
        globalStats: {
          unlockedCount,
          unlockRate: totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0,
        },
        userAchievements: undefined, // Remove raw relation data
        _count: undefined,
      };
    });

    return NextResponse.json({
      achievements: achievementsWithProgress,
      pagination: {
        limit,
        offset,
        total: totalCount,
      },
    });
  } catch (error) {
    console.error("Achievements fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
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
      rarity = "common",
      difficulty = "easy",
      pointValue = 10,
      iconUrl,
      badgeUrl,
      animationUrl,
      color = "#3B82F6",
      gradientColors = [],
      criteria = {},
      prerequisites = [],
      progressType = "count",
      maxProgress,
      xpReward = 0,
      coinReward = 0,
      gemReward = 0,
      reputationReward = 0,
      specialRewards = [],
      isSecret = false,
      isRepeatable = false,
      isTimeLimited = false,
      isRetroactive = true,
      availableFrom,
      availableUntil,
      seasonId,
    } = body;

    if (!tenantId || !name || !description || !category || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const achievement = await prisma.gamificationAchievement.create({
      data: {
        tenantId,
        name,
        description,
        category,
        type,
        rarity,
        difficulty,
        pointValue,
        iconUrl,
        badgeUrl,
        animationUrl,
        color,
        gradientColors,
        criteria,
        prerequisites,
        progressType,
        maxProgress,
        xpReward,
        coinReward,
        gemReward,
        reputationReward,
        specialRewards,
        isSecret,
        isRepeatable,
        isTimeLimited,
        isRetroactive,
        availableFrom: availableFrom ? new Date(availableFrom) : new Date(),
        availableUntil: availableUntil ? new Date(availableUntil) : null,
        seasonId,
      },
    });

    return NextResponse.json({ achievement }, { status: 201 });
  } catch (error) {
    console.error("Achievement creation error:", error);
    return NextResponse.json(
      { error: "Failed to create achievement" },
      { status: 500 }
    );
  }
}
