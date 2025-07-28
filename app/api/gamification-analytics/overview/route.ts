
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const period = searchParams.get("period") ?? "monthly";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const now = new Date();
    let periodStart: Date;
    let periodEnd: Date;

    if (startDate && endDate) {
      periodStart = new Date(startDate);
      periodEnd = new Date(endDate);
    } else {
      switch (period) {
        case "daily":
          periodStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          periodEnd = new Date(periodStart.getTime() + 24 * 60 * 60 * 1000);
          break;
        case "weekly":
          const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          periodStart = startOfWeek;
          periodEnd = now;
          break;
        case "monthly":
          periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
          periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
          break;
        case "yearly":
          periodStart = new Date(now.getFullYear(), 0, 1);
          periodEnd = new Date(now.getFullYear() + 1, 0, 1);
          break;
        default:
          periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
          periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      }
    }

    // Get or create analytics record
    let analytics = await prisma.gamificationAnalytics.findFirst({
      where: {
        tenantId,
        period,
        startDate: periodStart,
        endDate: periodEnd,
      },
    });

    if (!analytics) {
      // Calculate and create new analytics
      analytics = await calculateAndStoreAnalytics(tenantId, period, periodStart, periodEnd);
    }

    // Get additional real-time metrics
    const realtimeMetrics = await calculateRealtimeMetrics(tenantId, periodStart, periodEnd);

    return NextResponse.json({
      analytics,
      realtimeMetrics,
      period: {
        type: period,
        startDate: periodStart,
        endDate: periodEnd,
      },
    });
  } catch (error) {
    console.error("Gamification analytics fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gamification analytics" },
      { status: 500 }
    );
  }
}

async function calculateAndStoreAnalytics(
  tenantId: string, 
  period: string, 
  startDate: Date, 
  endDate: Date
) {
  // Active users in period
  const totalActiveUsers = await prisma.gamificationProfile.count({
    where: {
      tenantId,
      lastActivityDate: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Daily active users (last 24 hours)
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const dailyActiveUsers = await prisma.gamificationProfile.count({
    where: {
      tenantId,
      lastActivityDate: { gte: dayAgo },
    },
  });

  // Weekly active users (last 7 days)
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const weeklyActiveUsers = await prisma.gamificationProfile.count({
    where: {
      tenantId,
      lastActivityDate: { gte: weekAgo },
    },
  });

  // Monthly active users (last 30 days)
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const monthlyActiveUsers = await prisma.gamificationProfile.count({
    where: {
      tenantId,
      lastActivityDate: { gte: monthAgo },
    },
  });

  // Points distributed by currency
  const pointsDistributed = await prisma.pointTransaction.groupBy({
    by: ["currency"],
    where: {
      profile: { tenantId },
      type: "earned",
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const pointsByCurrency = pointsDistributed.reduce((acc: any, item) => {
    acc[item.currency] = item._sum.amount || 0;
    return acc;
  }, {});

  // Achievements unlocked
  const achievementsUnlocked = await prisma.userGamificationAchievement.count({
    where: {
      profile: { tenantId },
      isUnlocked: true,
      unlockedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Challenges completed
  const challengesCompleted = await prisma.dailyChallengeProgress.count({
    where: {
      profile: { tenantId },
      isCompleted: true,
      completedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Leaderboard activity
  const leaderboardActivity = await prisma.leaderboardEntry.count({
    where: {
      profile: { tenantId },
      updatedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Rewards purchased
  const rewardsPurchased = await prisma.rewardRedemption.count({
    where: {
      profile: { tenantId },
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // Currency circulation
  const currencyCirculation = await calculateCurrencyCirculation(tenantId, startDate, endDate);

  // Calculate retention and engagement metrics
  const { userRetention, engagementGrowth } = await calculateEngagementMetrics(tenantId, startDate, endDate);

  const analytics = await prisma.gamificationAnalytics.create({
    data: {
      tenantId,
      period,
      startDate,
      endDate,
      totalActiveUsers,
      dailyActiveUsers,
      weeklyActiveUsers,
      monthlyActiveUsers,
      pointsDistributed: pointsByCurrency,
      achievementsUnlocked,
      challengesCompleted,
      leaderboardActivity,
      rewardsPurchased,
      currencyCirculation,
      userRetention,
      engagementGrowth,
      economyHealth: calculateEconomyHealth(pointsByCurrency, currencyCirculation),
      socialActivity: await calculateSocialActivity(tenantId, startDate, endDate),
    },
  });

  return analytics;
}

async function calculateRealtimeMetrics(tenantId: string, startDate: Date, endDate: Date) {
  // Top performers
  const topPerformers = await prisma.gamificationProfile.findMany({
    where: {
      tenantId,
      lastActivityDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
    orderBy: { experiencePoints: "desc" },
    take: 10,
  });

  // Recent achievements
  const recentAchievements = await prisma.userGamificationAchievement.findMany({
    where: {
      profile: { tenantId },
      isUnlocked: true,
      unlockedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      achievement: true,
      profile: {
        include: {
          user: {
            select: { id: true, name: true },
          },
        },
      },
    },
    orderBy: { unlockedAt: "desc" },
    take: 20,
  });

  // Activity trends
  const activityTrends = await prisma.engagementLog.groupBy({
    by: ["activityType"],
    where: {
      profile: { tenantId },
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
  });

  return {
    topPerformers,
    recentAchievements,
    activityTrends,
  };
}

async function calculateCurrencyCirculation(tenantId: string, startDate: Date, endDate: Date) {
  const circulation = await prisma.pointTransaction.groupBy({
    by: ["currency", "type"],
    where: {
      profile: { tenantId },
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const circulationData: any = {};
  
  circulation.forEach(item => {
    if (!circulationData[item.currency]) {
      circulationData[item.currency] = { earned: 0, spent: 0, net: 0 };
    }
    
    const amount = item._sum.amount || 0;
    if (item.type === "earned") {
      circulationData[item.currency].earned += amount;
    } else if (item.type === "spent") {
      circulationData[item.currency].spent += Math.abs(amount);
    }
  });

  // Calculate net circulation
  Object.keys(circulationData).forEach(currency => {
    circulationData[currency].net = circulationData[currency].earned - circulationData[currency].spent;
  });

  return circulationData;
}

async function calculateEngagementMetrics(tenantId: string, startDate: Date, endDate: Date) {
  // Calculate user retention (users who were active in previous period and current period)
  const previousPeriodStart = new Date(startDate.getTime() - (endDate.getTime() - startDate.getTime()));
  
  const currentPeriodUsers = await prisma.gamificationProfile.findMany({
    where: {
      tenantId,
      lastActivityDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: { userId: true },
  });

  const previousPeriodUsers = await prisma.gamificationProfile.findMany({
    where: {
      tenantId,
      lastActivityDate: {
        gte: previousPeriodStart,
        lte: startDate,
      },
    },
    select: { userId: true },
  });

  const currentUserIds = new Set(currentPeriodUsers.map(u => u.userId));
  const previousUserIds = new Set(previousPeriodUsers.map(u => u.userId));
  
  const retainedUsers = Array.from(currentUserIds).filter(id => previousUserIds.has(id));
  const userRetention = previousUserIds.size > 0 ? (retainedUsers.length / previousUserIds.size) * 100 : 0;

  // Calculate engagement growth
  const engagementGrowth = previousUserIds.size > 0 ? 
    ((currentUserIds.size - previousUserIds.size) / previousUserIds.size) * 100 : 0;

  return { userRetention, engagementGrowth };
}

function calculateEconomyHealth(pointsDistributed: any, currencyCirculation: any): number {
  // Simple economy health score based on balanced distribution and circulation
  let healthScore = 1.0;

  Object.keys(currencyCirculation).forEach(currency => {
    const circulation = currencyCirculation[currency];
    if (circulation.earned > 0) {
      const spendRatio = circulation.spent / circulation.earned;
      // Healthy economy has spend ratio between 0.3 and 0.8
      if (spendRatio >= 0.3 && spendRatio <= 0.8) {
        healthScore += 0.2;
      } else if (spendRatio < 0.3) {
        healthScore -= 0.1; // Hoarding
      } else if (spendRatio > 0.8) {
        healthScore -= 0.05; // Over-spending
      }
    }
  });

  return Math.max(0, Math.min(2.0, healthScore));
}

async function calculateSocialActivity(tenantId: string, startDate: Date, endDate: Date): Promise<number> {
  const socialEvents = await prisma.socialEngagement.count({
    where: {
      tenantId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return socialEvents;
}
