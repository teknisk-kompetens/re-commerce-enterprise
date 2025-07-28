
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const tenantId = searchParams.get("tenantId");

    if (!userId || !tenantId) {
      return NextResponse.json({ error: "User ID and Tenant ID required" }, { status: 400 });
    }

    const profile = await prisma.gamificationProfile.findUnique({
      where: { userId },
      include: {
        pointTransactions: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
        earnedAchievements: {
          where: { isUnlocked: true },
          include: {
            achievement: true,
          },
          take: 5,
          orderBy: { unlockedAt: "desc" },
        },
        leaderboardEntries: {
          include: {
            leaderboard: true,
          },
          take: 3,
          orderBy: { currentRank: "asc" },
        },
      },
    });

    if (!profile) {
      // Create new gamification profile
      const newProfile = await prisma.gamificationProfile.create({
        data: {
          userId,
          tenantId,
          experiencePoints: 0,
          gamificationCoins: 0,
          premiumGems: 0,
          reputationPoints: 0,
          currentLevel: 1,
          nextLevelXP: 100,
          dailyStreak: 0,
          longestStreak: 0,
          currentTier: "bronze",
        },
        include: {
          pointTransactions: true,
          earnedAchievements: true,
          leaderboardEntries: true,
        },
      });

      return NextResponse.json({ profile: newProfile });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Gamification profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gamification profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      tenantId,
      action,
      context = {},
    } = body;

    if (!userId || !tenantId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Award points based on action
    const pointsAwarded = await awardPointsForAction(userId, tenantId, action, context);
    
    // Check for achievements
    const achievementsUnlocked = await checkAchievements(userId, tenantId, action, context);
    
    // Update level progression
    const levelUpdates = await updateLevelProgression(userId);

    return NextResponse.json({
      success: true,
      pointsAwarded,
      achievementsUnlocked,
      levelUpdates,
    });
  } catch (error) {
    console.error("Gamification action processing error:", error);
    return NextResponse.json(
      { error: "Failed to process gamification action" },
      { status: 500 }
    );
  }
}

async function awardPointsForAction(userId: string, tenantId: string, action: string, context: any) {
  const rules = await prisma.gamificationRule.findMany({
    where: {
      tenantId,
      triggerEvent: action,
      isActive: true,
      OR: [
        { validUntil: null },
        { validUntil: { gte: new Date() } },
      ],
    },
  });

  const pointsAwarded: any = {};

  for (const rule of rules) {
    const pointRewards = rule.pointRewards as any;
    
    for (const [currency, baseAmount] of Object.entries(pointRewards)) {
      if (typeof baseAmount === "number") {
        const multiplier = rule.bonusMultiplier || 1;
        const amount = Math.round(baseAmount * multiplier);
        
        await prisma.pointTransaction.create({
          data: {
            profileId: (await getGamificationProfile(userId, tenantId)).id,
            type: "earned",
            currency,
            amount,
            previousBalance: 0, // Will be calculated
            newBalance: 0, // Will be calculated
            source: action,
            sourceId: context.sourceId,
            description: rule.description,
            baseAmount,
            multiplier,
          },
        });

        pointsAwarded[currency] = (pointsAwarded[currency] || 0) + amount;
      }
    }
  }

  return pointsAwarded;
}

async function checkAchievements(userId: string, tenantId: string, action: string, context: any) {
  const achievements = await prisma.gamificationAchievement.findMany({
    where: {
      tenantId,
      isTimeLimited: false,
      OR: [
        { availableUntil: null },
        { availableUntil: { gte: new Date() } },
      ],
    },
  });

  const unlockedAchievements: any[] = [];

  for (const achievement of achievements) {
    const criteria = achievement.criteria as any;
    
    // Simple achievement checking logic
    if (criteria.triggerEvent === action) {
      const profile = await getGamificationProfile(userId, tenantId);
      
      const userAchievement = await prisma.userGamificationAchievement.findUnique({
        where: {
          profileId_achievementId: {
            profileId: profile.id,
            achievementId: achievement.id,
          },
        },
      });

      if (!userAchievement || !userAchievement.isUnlocked) {
        await prisma.userGamificationAchievement.upsert({
          where: {
            profileId_achievementId: {
              profileId: profile.id,
              achievementId: achievement.id,
            },
          },
          update: {
            isUnlocked: true,
            unlockedAt: new Date(),
            unlockTrigger: action,
            unlockContext: context,
          },
          create: {
            profileId: profile.id,
            achievementId: achievement.id,
            isUnlocked: true,
            unlockedAt: new Date(),
            unlockTrigger: action,
            unlockContext: context,
          },
        });

        unlockedAchievements.push(achievement);
      }
    }
  }

  return unlockedAchievements;
}

async function updateLevelProgression(userId: string) {
  const profile = await prisma.gamificationProfile.findUnique({
    where: { userId },
  });

  if (!profile) return null;

  const xpNeededForNextLevel = calculateXPForLevel(profile.currentLevel + 1);
  
  if (profile.experiencePoints >= xpNeededForNextLevel) {
    const newLevel = profile.currentLevel + 1;
    const nextLevelXP = calculateXPForLevel(newLevel + 1);

    await prisma.gamificationProfile.update({
      where: { userId },
      data: {
        currentLevel: newLevel,
        nextLevelXP,
        levelUpCount: profile.levelUpCount + 1,
      },
    });

    return { levelUp: true, newLevel, nextLevelXP };
  }

  return { levelUp: false };
}

function calculateXPForLevel(level: number): number {
  // Exponential XP scaling: XP = 100 * (level^1.5)
  return Math.floor(100 * Math.pow(level, 1.5));
}

async function getGamificationProfile(userId: string, tenantId: string) {
  let profile = await prisma.gamificationProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    profile = await prisma.gamificationProfile.create({
      data: {
        userId,
        tenantId,
        experiencePoints: 0,
        gamificationCoins: 0,
        premiumGems: 0,
        reputationPoints: 0,
        currentLevel: 1,
        nextLevelXP: 100,
        dailyStreak: 0,
        longestStreak: 0,
        currentTier: "bronze",
      },
    });
  }

  return profile;
}
