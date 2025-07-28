
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      tenantId,
      achievementId,
      trigger,
      context = {},
      progressIncrement = 1,
    } = body;

    if (!userId || !tenantId || !achievementId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get gamification profile
    const profile = await prisma.gamificationProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Gamification profile not found" }, { status: 404 });
    }

    // Get achievement details
    const achievement = await prisma.gamificationAchievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) {
      return NextResponse.json({ error: "Achievement not found" }, { status: 404 });
    }

    // Check if achievement is available
    const now = new Date();
    if (achievement.availableFrom && achievement.availableFrom > now) {
      return NextResponse.json({ error: "Achievement not yet available" }, { status: 400 });
    }
    if (achievement.availableUntil && achievement.availableUntil < now) {
      return NextResponse.json({ error: "Achievement no longer available" }, { status: 400 });
    }

    // Get or create user achievement
    let userAchievement = await prisma.userGamificationAchievement.findUnique({
      where: {
        profileId_achievementId: {
          profileId: profile.id,
          achievementId: achievementId,
        },
      },
    });

    if (!userAchievement) {
      userAchievement = await prisma.userGamificationAchievement.create({
        data: {
          profileId: profile.id,
          achievementId: achievementId,
          currentProgress: 0,
          maxProgress: achievement.maxProgress,
        },
      });
    }

    // Check if already unlocked and not repeatable
    if (userAchievement.isUnlocked && !achievement.isRepeatable) {
      return NextResponse.json({ 
        message: "Achievement already unlocked",
        userAchievement 
      });
    }

    // Update progress
    const newProgress = userAchievement.currentProgress + progressIncrement;
    const isCompleted = achievement.maxProgress ? 
      newProgress >= achievement.maxProgress : 
      newProgress >= 1;

    const updateData: any = {
      currentProgress: newProgress,
      progressData: context,
    };

    let rewardsAwarded: any = {};

    // If achievement is completed
    if (isCompleted && !userAchievement.isUnlocked) {
      updateData.isUnlocked = true;
      updateData.unlockedAt = new Date();
      updateData.unlockTrigger = trigger;
      updateData.unlockContext = context;

      // Award rewards
      rewardsAwarded = await awardAchievementRewards(profile.id, achievement);

      // Update achievement stats
      await prisma.gamificationAchievement.update({
        where: { id: achievementId },
        data: {
          unlockedCount: { increment: 1 },
        },
      });
    }

    // Update user achievement
    userAchievement = await prisma.userGamificationAchievement.update({
      where: {
        profileId_achievementId: {
          profileId: profile.id,
          achievementId: achievementId,
        },
      },
      data: updateData,
      include: {
        achievement: true,
      },
    });

    return NextResponse.json({
      userAchievement,
      unlocked: isCompleted && updateData.isUnlocked,
      rewardsAwarded,
    });
  } catch (error) {
    console.error("Achievement unlock error:", error);
    return NextResponse.json(
      { error: "Failed to process achievement unlock" },
      { status: 500 }
    );
  }
}

async function awardAchievementRewards(profileId: string, achievement: any) {
  const rewardsAwarded: any = {};

  // Award XP
  if (achievement.xpReward > 0) {
    await prisma.pointTransaction.create({
      data: {
        profileId,
        type: "earned",
        currency: "xp",
        amount: achievement.xpReward,
        previousBalance: 0, // Will be calculated
        newBalance: 0, // Will be calculated
        source: "achievement_unlock",
        sourceId: achievement.id,
        description: `Achievement unlocked: ${achievement.name}`,
        baseAmount: achievement.xpReward,
      },
    });
    rewardsAwarded.xp = achievement.xpReward;
  }

  // Award Coins
  if (achievement.coinReward > 0) {
    await prisma.pointTransaction.create({
      data: {
        profileId,
        type: "earned",
        currency: "coins",
        amount: achievement.coinReward,
        previousBalance: 0,
        newBalance: 0,
        source: "achievement_unlock",
        sourceId: achievement.id,
        description: `Achievement unlocked: ${achievement.name}`,
        baseAmount: achievement.coinReward,
      },
    });
    rewardsAwarded.coins = achievement.coinReward;
  }

  // Award Gems
  if (achievement.gemReward > 0) {
    await prisma.pointTransaction.create({
      data: {
        profileId,
        type: "earned",
        currency: "gems",
        amount: achievement.gemReward,
        previousBalance: 0,
        newBalance: 0,
        source: "achievement_unlock",
        sourceId: achievement.id,
        description: `Achievement unlocked: ${achievement.name}`,
        baseAmount: achievement.gemReward,
      },
    });
    rewardsAwarded.gems = achievement.gemReward;
  }

  // Award Reputation
  if (achievement.reputationReward > 0) {
    await prisma.pointTransaction.create({
      data: {
        profileId,
        type: "earned",
        currency: "reputation",
        amount: achievement.reputationReward,
        previousBalance: 0,
        newBalance: 0,
        source: "achievement_unlock",
        sourceId: achievement.id,
        description: `Achievement unlocked: ${achievement.name}`,
        baseAmount: achievement.reputationReward,
      },
    });
    rewardsAwarded.reputation = achievement.reputationReward;
  }

  return rewardsAwarded;
}
