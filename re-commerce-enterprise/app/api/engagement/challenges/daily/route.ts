
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const userId = searchParams.get("userId");
    const date = searchParams.get("date") ?? new Date().toISOString().split('T')[0];
    const category = searchParams.get("category");
    const difficulty = searchParams.get("difficulty");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const targetDate = new Date(date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const whereClause: any = {
      tenantId,
      availableDate: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    if (category) whereClause.category = category;
    if (difficulty) whereClause.difficulty = difficulty;

    // Get user's gamification profile if userId provided
    let userProfile = null;
    if (userId) {
      userProfile = await prisma.gamificationProfile.findUnique({
        where: { userId },
      });
    }

    const challenges = await prisma.dailyChallenge.findMany({
      where: whereClause,
      include: {
        userProgress: userProfile ? {
          where: { profileId: userProfile.id },
        } : false,
        _count: {
          select: {
            userProgress: {
              where: { isCompleted: true },
            },
          },
        },
      },
      orderBy: [
        { difficulty: "asc" },
        { category: "asc" },
        { createdAt: "asc" },
      ],
    });

    // Enrich challenges with user progress
    const enrichedChallenges = challenges.map(challenge => {
      const userProgress = challenge.userProgress?.[0];
      const completionCount = challenge._count.userProgress;
      
      return {
        ...challenge,
        userProgress: userProgress ? {
          currentProgress: userProgress.currentProgress,
          targetProgress: userProgress.targetProgress,
          progressPercentage: userProgress.progressPercentage,
          isCompleted: userProgress.isCompleted,
          completedAt: userProgress.completedAt,
          rewardsEarned: userProgress.rewardsEarned,
        } : null,
        globalStats: {
          completionCount,
          completionRate: challenge.completionRate,
        },
        userProgress: undefined, // Remove raw relation data
        _count: undefined,
      };
    });

    return NextResponse.json({
      challenges: enrichedChallenges,
      date,
    });
  } catch (error) {
    console.error("Daily challenges fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily challenges" },
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
      type = "simple",
      objective,
      targetValue,
      criteria = {},
      baseReward = {},
      bonusReward = {},
      streakMultiplier = 1.0,
      availableDate,
      duration = 24,
      difficulty = "easy",
      rarity = "common",
      isRepeating = false,
      repeatInterval,
      maxCompletions = 1,
    } = body;

    if (!tenantId || !name || !description || !category || !objective || !targetValue) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const challengeDate = availableDate ? new Date(availableDate) : new Date();
    const expiresAt = new Date(challengeDate.getTime() + (duration * 60 * 60 * 1000));

    const challenge = await prisma.dailyChallenge.create({
      data: {
        tenantId,
        name,
        description,
        category,
        type,
        objective,
        targetValue,
        criteria,
        baseReward,
        bonusReward,
        streakMultiplier,
        availableDate: challengeDate,
        expiresAt,
        duration,
        difficulty,
        rarity,
        isRepeating,
        repeatInterval,
        maxCompletions,
      },
    });

    return NextResponse.json({ challenge }, { status: 201 });
  } catch (error) {
    console.error("Daily challenge creation error:", error);
    return NextResponse.json(
      { error: "Failed to create daily challenge" },
      { status: 500 }
    );
  }
}
