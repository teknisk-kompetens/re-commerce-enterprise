
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
      challengeId,
      progressIncrement = 1,
      activity = {},
    } = body;

    if (!userId || !tenantId || !challengeId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user's gamification profile
    const profile = await prisma.gamificationProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: "Gamification profile not found" }, { status: 404 });
    }

    // Get challenge details
    const challenge = await prisma.dailyChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      return NextResponse.json({ error: "Challenge not found" }, { status: 404 });
    }

    // Check if challenge is still available
    const now = new Date();
    if (challenge.expiresAt < now) {
      return NextResponse.json({ error: "Challenge has expired" }, { status: 400 });
    }

    // Get or create user progress
    let userProgress = await prisma.dailyChallengeProgress.findUnique({
      where: {
        challengeId_profileId: {
          challengeId,
          profileId: profile.id,
        },
      },
    });

    if (!userProgress) {
      userProgress = await prisma.dailyChallengeProgress.create({
        data: {
          challengeId,
          profileId: profile.id,
          currentProgress: 0,
          targetProgress: challenge.targetValue,
          activities: [],
          milestones: [],
        },
      });
    }

    // Check if already completed
    if (userProgress.isCompleted) {
      return NextResponse.json({ 
        message: "Challenge already completed",
        userProgress 
      });
    }

    // Update progress
    const newProgress = userProgress.currentProgress + progressIncrement;
    const progressPercentage = Math.min((newProgress / challenge.targetValue) * 100, 100);
    const isCompleted = newProgress >= challenge.targetValue;

    const activities = (userProgress.activities as any[]) || [];
    activities.push({
      timestamp: new Date(),
      increment: progressIncrement,
      activity,
    });

    const updateData: any = {
      currentProgress: newProgress,
      progressPercentage,
      activities,
    };

    let rewardsEarned: any = {};

    // If challenge is completed
    if (isCompleted && !userProgress.isCompleted) {
      updateData.isCompleted = true;
      updateData.completedAt = new Date();
      updateData.timeToComplete = Math.floor((new Date().getTime() - userProgress.createdAt.getTime()) / 60000); // minutes

      // Calculate and award rewards
      rewardsEarned = await calculateAndAwardRewards(profile, challenge);
      updateData.rewardsEarned = rewardsEarned;

      // Update challenge stats
      await prisma.dailyChallenge.update({
        where: { id: challengeId },
        data: {
          totalParticipants: { increment: userProgress.currentProgress === 0 ? 1 : 0 },
          completionRate: {
            // Recalculate completion rate
            set: await calculateCompletionRate(challengeId),
          },
        },
      });

      // Update user's daily streak
      await updateDailyStreak(profile.id, userId);
    }

    // Update user progress
    userProgress = await prisma.dailyChallengeProgress.update({
      where: {
        challengeId_profileId: {
          challengeId,
          profileId: profile.id,
        },
      },
      data: updateData,
      include: {
        challenge: true,
      },
    });

    return NextResponse.json({
      userProgress,
      completed: isCompleted && updateData.isCompleted,
      rewardsEarned,
    });
  } catch (error) {
    console.error("Challenge progress update error:", error);
    return NextResponse.json(
      { error: "Failed to update challenge progress" },
      { status: 500 }
    );
  }
}

async function calculateAndAwardRewards(profile: any, challenge: any) {
  const baseReward = challenge.baseReward as any;
  const bonusReward = challenge.bonusReward as any;
  const streakMultiplier = challenge.streakMultiplier || 1.0;
  
  const rewardsEarned: any = {};

  // Apply streak multiplier based on user's current streak
  const effectiveMultiplier = streakMultiplier + (profile.dailyStreak * 0.1); // 10% bonus per streak day

  // Calculate base rewards
  for (const [currency, amount] of Object.entries(baseReward)) {
    if (typeof amount === "number") {
      const finalAmount = Math.round(amount * effectiveMultiplier);
      rewardsEarned[currency] = finalAmount;

      // Create point transaction
      await prisma.pointTransaction.create({
        data: {
          profileId: profile.id,
          type: "earned",
          currency,
          amount: finalAmount,
          previousBalance: 0, // Will be calculated
          newBalance: 0, // Will be calculated
          source: "daily_challenge",
          sourceId: challenge.id,
          description: `Daily challenge completed: ${challenge.name}`,
          baseAmount: amount,
          multiplier: effectiveMultiplier,
          streakBonus: Math.round(amount * (effectiveMultiplier - 1)),
        },
      });
    }
  }

  // Add bonus rewards if applicable
  for (const [currency, amount] of Object.entries(bonusReward)) {
    if (typeof amount === "number") {
      rewardsEarned[currency] = (rewardsEarned[currency] || 0) + amount;

      await prisma.pointTransaction.create({
        data: {
          profileId: profile.id,
          type: "earned",
          currency,
          amount,
          previousBalance: 0,
          newBalance: 0,
          source: "daily_challenge_bonus",
          sourceId: challenge.id,
          description: `Daily challenge bonus: ${challenge.name}`,
          baseAmount: amount,
        },
      });
    }
  }

  return rewardsEarned;
}

async function calculateCompletionRate(challengeId: string): Promise<number> {
  const totalParticipants = await prisma.dailyChallengeProgress.count({
    where: { challengeId },
  });

  const completedParticipants = await prisma.dailyChallengeProgress.count({
    where: { challengeId, isCompleted: true },
  });

  return totalParticipants > 0 ? (completedParticipants / totalParticipants) * 100 : 0;
}

async function updateDailyStreak(profileId: string, userId: string) {
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  // Check if user completed any challenge yesterday
  const yesterdayCompletion = await prisma.dailyChallengeProgress.findFirst({
    where: {
      profileId,
      isCompleted: true,
      completedAt: {
        gte: new Date(yesterday.setHours(0, 0, 0, 0)),
        lte: new Date(yesterday.setHours(23, 59, 59, 999)),
      },
    },
  });

  const profile = await prisma.gamificationProfile.findUnique({
    where: { userId },
  });

  if (!profile) return;

  let newStreak = 1;
  if (yesterdayCompletion) {
    newStreak = profile.dailyStreak + 1;
  }

  const longestStreak = Math.max(profile.longestStreak, newStreak);

  await prisma.gamificationProfile.update({
    where: { userId },
    data: {
      dailyStreak: newStreak,
      longestStreak,
      lastActivityDate: today,
    },
  });
}
