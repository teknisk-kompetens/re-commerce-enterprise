
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const period = searchParams.get("period") ?? "monthly";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit") ?? "30");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);
    if (!startDate && !endDate) {
      // Default to last 90 days
      dateFilter.gte = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    }

    const [viralAnalytics, aggregatedMetrics, trendData] = await Promise.all([
      prisma.viralGrowthAnalytics.findMany({
        where: {
          tenantId,
          period,
          date: dateFilter
        },
        orderBy: { date: "asc" },
        take: limit
      }),
      prisma.viralGrowthAnalytics.aggregate({
        where: {
          tenantId,
          period,
          date: dateFilter
        },
        _avg: {
          viralCoefficient: true,
          k_factor: true,
          cycleTime: true,
          inviteAcceptanceRate: true
        },
        _sum: {
          organicUsers: true,
          referredUsers: true,
          totalInvites: true,
          acceptedInvites: true,
          contentViews: true,
          contentShares: true,
          contentReferrals: true,
          youtubeReferrals: true
        }
      }),
      calculateGrowthTrends(tenantId, period, dateFilter)
    ]);

    // Calculate viral metrics
    const viralMetrics = calculateViralMetrics(aggregatedMetrics);
    
    // Calculate growth stages
    const growthStages = analyzeGrowthStages(viralAnalytics);

    return NextResponse.json({
      analytics: viralAnalytics,
      aggregatedMetrics,
      viralMetrics,
      growthStages,
      trendData,
      insights: {
        currentViralCoefficient: aggregatedMetrics._avg.viralCoefficient || 0,
        isViralGrowth: (aggregatedMetrics._avg.viralCoefficient || 0) > 1.0,
        growthRate: calculateGrowthRate(viralAnalytics),
        topPerformingChannels: await getTopPerformingChannels(tenantId, dateFilter),
        recommendations: generateGrowthRecommendations(viralMetrics)
      }
    });

  } catch (error) {
    console.error("Error fetching viral growth analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case "calculate_viral_metrics":
        return await calculateViralMetricsForPeriod(data);
        
      case "simulate_growth":
        return await simulateViralGrowth(data);
        
      case "analyze_cohorts":
        return await analyzeCohorts(data);
        
      case "track_viral_loop":
        return await trackViralLoop(data);
        
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("Error processing viral analytics request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function calculateViralMetricsForPeriod(data: any) {
  const { tenantId, startDate, endDate, period } = data;

  if (!tenantId) {
    throw new Error("Tenant ID required");
  }

  const dateFilter = {
    gte: new Date(startDate),
    lte: new Date(endDate)
  };

  // Get referral data for the period
  const [referralData, userGrowthData, contentData] = await Promise.all([
    prisma.referralTracking.findMany({
      where: {
        tenantId,
        referredAt: dateFilter
      },
      select: {
        referredAt: true,
        status: true,
        qualificationMet: true,
        clickedAt: true,
        signedUpAt: true
      }
    }),
    prisma.user.groupBy({
      by: ["createdAt"],
      where: {
        tenantId,
        createdAt: dateFilter
      },
      _count: {
        id: true
      }
    }),
    prisma.contentReferralTracking.findMany({
      where: {
        tenantId,
        createdAt: dateFilter
      },
      select: {
        clicks: true,
        conversions: true,
        contentType: true,
        createdAt: true
      }
    })
  ]);

  // Calculate viral coefficient
  const totalInvites = referralData.length;
  const acceptedInvites = referralData.filter(r => r.status === "qualified").length;
  const viralCoefficient = totalInvites > 0 ? acceptedInvites / totalInvites : 0;

  // Calculate K-factor
  const totalUsers = userGrowthData.reduce((sum, day) => sum + day._count.id, 0);
  const referredUsers = referralData.filter(r => r.qualificationMet).length;
  const k_factor = totalUsers > 0 ? referredUsers / totalUsers : 0;

  // Calculate cycle time (average time from referral to conversion)
  const cycleTimes = referralData
    .filter(r => r.clickedAt && r.signedUpAt)
    .map(r => {
      const clickTime = new Date(r.clickedAt!).getTime();
      const signupTime = new Date(r.signedUpAt!).getTime();
      return (signupTime - clickTime) / (1000 * 60 * 60); // Convert to hours
    });
  const averageCycleTime = cycleTimes.length > 0 
    ? cycleTimes.reduce((sum, time) => sum + time, 0) / cycleTimes.length 
    : 0;

  // Content-driven metrics
  const contentViews = contentData.reduce((sum, item) => sum + item.clicks, 0);
  const contentReferrals = contentData.reduce((sum, item) => sum + item.conversions, 0);
  const youtubeReferrals = contentData
    .filter(item => item.contentType === "youtube_video")
    .reduce((sum, item) => sum + item.conversions, 0);

  // Create or update viral growth analytics record
  const viralAnalytics = await prisma.viralGrowthAnalytics.create({
    data: {
      tenantId,
      date: new Date(),
      period,
      viralCoefficient,
      k_factor,
      cycleTime: averageCycleTime,
      organicUsers: totalUsers - referredUsers,
      referredUsers,
      totalInvites,
      acceptedInvites,
      inviteAcceptanceRate: totalInvites > 0 ? acceptedInvites / totalInvites : 0,
      contentViews,
      contentShares: Math.floor(contentViews * 0.15), // Estimated share rate
      contentReferrals,
      youtubeReferrals,
      platformStats: calculatePlatformStats(contentData),
      channelEffectiveness: calculateChannelEffectiveness(referralData),
      cohortData: generateCohortData(userGrowthData),
      retentionCurves: generateRetentionCurves(referralData)
    }
  });

  return {
    success: true,
    viralAnalytics,
    metrics: {
      viralCoefficient,
      k_factor,
      averageCycleTime,
      growthClassification: classifyGrowth(viralCoefficient, k_factor),
      sustainability: calculateSustainability(viralCoefficient, averageCycleTime)
    }
  };
}

async function simulateViralGrowth(data: any) {
  const { 
    initialUsers = 1000,
    viralCoefficient = 1.2,
    cycleTime = 48, // hours
    simulationDays = 30,
    churnRate = 0.05
  } = data;

  const simulation = [];
  let currentUsers = initialUsers;
  
  for (let day = 0; day <= simulationDays; day++) {
    const cyclesPerDay = 24 / cycleTime;
    const newUsersPerDay = currentUsers * viralCoefficient * cyclesPerDay;
    const churnedUsers = currentUsers * churnRate;
    
    currentUsers = currentUsers + newUsersPerDay - churnedUsers;
    
    simulation.push({
      day,
      users: Math.round(currentUsers),
      newUsers: Math.round(newUsersPerDay),
      churnedUsers: Math.round(churnedUsers),
      netGrowth: Math.round(newUsersPerDay - churnedUsers),
      growthRate: ((newUsersPerDay - churnedUsers) / currentUsers) * 100
    });
  }

  return {
    success: true,
    simulation,
    summary: {
      finalUsers: Math.round(currentUsers),
      totalGrowth: ((currentUsers - initialUsers) / initialUsers) * 100,
      averageDailyGrowth: simulation.slice(1).reduce((sum, day) => sum + day.growthRate, 0) / simulationDays,
      sustainableGrowth: viralCoefficient > 1.0 && churnRate < 0.1
    }
  };
}

async function analyzeCohorts(data: any) {
  const { tenantId, cohortSize = 7 } = data; // 7-day cohorts

  // Get user registration data
  const users = await prisma.user.findMany({
    where: { tenantId },
    select: {
      id: true,
      createdAt: true
    },
    orderBy: { createdAt: "asc" }
  });

  // Get referral data
  const referrals = await prisma.referralTracking.findMany({
    where: {
      tenantId,
      qualificationMet: true
    },
    select: {
      referredAt: true,
      signedUpAt: true
    }
  });

  // Group users into cohorts
  const cohorts = groupIntoCohorts(users, cohortSize);
  
  // Calculate cohort metrics
  const cohortAnalysis = cohorts.map(cohort => {
    const cohortReferrals = referrals.filter(r => {
      const signupDate = new Date(r.signedUpAt || r.referredAt);
      return signupDate >= cohort.startDate && signupDate < cohort.endDate;
    });

    return {
      cohort: cohort.name,
      startDate: cohort.startDate,
      endDate: cohort.endDate,
      totalUsers: cohort.users.length,
      referredUsers: cohortReferrals.length,
      referralRate: cohort.users.length > 0 ? cohortReferrals.length / cohort.users.length : 0,
      viralCoefficient: calculateCohortViralCoefficient(cohort.users, cohortReferrals)
    };
  });

  return {
    success: true,
    cohortAnalysis,
    insights: {
      bestPerformingCohort: cohortAnalysis.reduce((best, current) => 
        current.viralCoefficient > best.viralCoefficient ? current : best
      ),
      averageViralCoefficient: cohortAnalysis.reduce((sum, cohort) => 
        sum + cohort.viralCoefficient, 0) / cohortAnalysis.length,
      trendDirection: calculateCohortTrend(cohortAnalysis)
    }
  };
}

async function trackViralLoop(data: any) {
  const { tenantId, userId, sessionId } = data;

  // Track viral loop stages: Exposure -> Click -> Sign-up -> Activation -> Referral
  const viralLoopData = {
    exposure: await trackExposure(tenantId, userId),
    click: await trackClick(tenantId, userId),
    signup: await trackSignup(tenantId, userId),
    activation: await trackActivation(tenantId, userId),
    referral: await trackReferralGeneration(tenantId, userId)
  };

  const loopEfficiency = calculateLoopEfficiency(viralLoopData);

  return {
    success: true,
    viralLoopData,
    loopEfficiency,
    recommendations: generateLoopOptimizationRecommendations(loopEfficiency)
  };
}

// Helper functions
function calculateViralMetrics(aggregatedMetrics: any) {
  const totalUsers = (aggregatedMetrics._sum.organicUsers || 0) + (aggregatedMetrics._sum.referredUsers || 0);
  const viralCoefficient = aggregatedMetrics._avg.viralCoefficient || 0;
  const k_factor = aggregatedMetrics._avg.k_factor || 0;

  return {
    viralCoefficient,
    k_factor,
    totalUsers,
    viralUsers: aggregatedMetrics._sum.referredUsers || 0,
    organicUsers: aggregatedMetrics._sum.organicUsers || 0,
    viralPercentage: totalUsers > 0 ? ((aggregatedMetrics._sum.referredUsers || 0) / totalUsers) * 100 : 0,
    growthType: classifyGrowth(viralCoefficient, k_factor)
  };
}

function analyzeGrowthStages(analytics: any[]) {
  if (analytics.length < 3) return [];

  const stages = [];
  for (let i = 1; i < analytics.length; i++) {
    const current = analytics[i];
    const previous = analytics[i - 1];
    
    const userGrowth = ((current.organicUsers + current.referredUsers) - 
                      (previous.organicUsers + previous.referredUsers)) / 
                      (previous.organicUsers + previous.referredUsers) * 100;

    stages.push({
      period: current.date,
      growthRate: userGrowth,
      stage: classifyGrowthStage(userGrowth),
      viralCoefficient: current.viralCoefficient
    });
  }

  return stages;
}

async function calculateGrowthTrends(tenantId: string, period: string, dateFilter: any) {
  // Calculate various growth trends
  const trends = {
    userGrowth: [],
    viralGrowth: [],
    contentGrowth: [],
    channelEffectiveness: []
  };

  // This would involve complex calculations based on historical data
  // For now, return mock trend data
  return trends;
}

async function getTopPerformingChannels(tenantId: string, dateFilter: any) {
  const channels = await prisma.contentReferralTracking.groupBy({
    by: ["contentType"],
    where: {
      tenantId,
      createdAt: dateFilter
    },
    _sum: {
      clicks: true,
      conversions: true
    },
    _count: {
      id: true
    }
  });

  return channels
    .map(channel => ({
      type: channel.contentType,
      clicks: channel._sum.clicks || 0,
      conversions: channel._sum.conversions || 0,
      conversionRate: channel._sum.clicks ? (channel._sum.conversions || 0) / channel._sum.clicks : 0,
      campaigns: channel._count.id
    }))
    .sort((a, b) => b.conversions - a.conversions)
    .slice(0, 5);
}

function calculateGrowthRate(analytics: any[]) {
  if (analytics.length < 2) return 0;
  
  const first = analytics[0];
  const last = analytics[analytics.length - 1];
  
  const firstTotal = first.organicUsers + first.referredUsers;
  const lastTotal = last.organicUsers + last.referredUsers;
  
  return firstTotal > 0 ? ((lastTotal - firstTotal) / firstTotal) * 100 : 0;
}

function generateGrowthRecommendations(metrics: any) {
  const recommendations = [];

  if (metrics.viralCoefficient < 1.0) {
    recommendations.push({
      priority: "high",
      category: "viral_optimization",
      message: "Viral coefficient below 1.0. Focus on improving referral incentives and reducing friction.",
      actions: ["Increase referral rewards", "Simplify sharing process", "A/B test referral messaging"]
    });
  }

  if (metrics.viralPercentage < 20) {
    recommendations.push({
      priority: "medium",
      category: "referral_activation",
      message: "Low viral user percentage. Improve referral program visibility.",
      actions: ["Add referral prompts in user journey", "Gamify referral process", "Create referral leaderboards"]
    });
  }

  if (metrics.k_factor > 0.5) {
    recommendations.push({
      priority: "low",
      category: "optimization",
      message: "Good K-factor. Focus on scaling successful referral channels.",
      actions: ["Increase budget for top-performing channels", "Expand to similar platforms", "Create referral case studies"]
    });
  }

  return recommendations;
}

function classifyGrowth(viralCoefficient: number, k_factor: number) {
  if (viralCoefficient > 1.5 && k_factor > 1.0) return "explosive";
  if (viralCoefficient > 1.0 && k_factor > 0.5) return "viral";
  if (viralCoefficient > 0.5 && k_factor > 0.2) return "growing";
  if (viralCoefficient > 0.2) return "moderate";
  return "slow";
}

function classifyGrowthStage(growthRate: number) {
  if (growthRate > 50) return "explosive";
  if (growthRate > 20) return "rapid";
  if (growthRate > 5) return "steady";
  if (growthRate > -5) return "stable";
  return "declining";
}

function calculateSustainability(viralCoefficient: number, cycleTime: number) {
  const sustainability = viralCoefficient * (1 / (cycleTime / 24)); // Daily sustainability score
  return Math.min(sustainability, 2.0); // Cap at 2.0
}

function calculatePlatformStats(contentData: any[]) {
  const platforms: any = {};
  
  contentData.forEach(item => {
    if (!platforms[item.contentType]) {
      platforms[item.contentType] = { clicks: 0, conversions: 0, count: 0 };
    }
    platforms[item.contentType].clicks += item.clicks;
    platforms[item.contentType].conversions += item.conversions;
    platforms[item.contentType].count += 1;
  });

  return platforms;
}

function calculateChannelEffectiveness(referralData: any[]) {
  // Group by source/medium and calculate effectiveness
  const effectiveness: any = {};
  
  referralData.forEach(referral => {
    const key = `${referral.source || 'unknown'}_${referral.medium || 'unknown'}`;
    if (!effectiveness[key]) {
      effectiveness[key] = { total: 0, qualified: 0 };
    }
    effectiveness[key].total += 1;
    if (referral.qualificationMet) {
      effectiveness[key].qualified += 1;
    }
  });

  return Object.keys(effectiveness).map(key => ({
    channel: key,
    total: effectiveness[key].total,
    qualified: effectiveness[key].qualified,
    rate: effectiveness[key].total > 0 ? effectiveness[key].qualified / effectiveness[key].total : 0
  }));
}

function generateCohortData(userGrowthData: any[]) {
  // Generate cohort analysis data
  return {
    weekly: "cohort analysis data would be calculated here",
    monthly: "monthly cohort retention data",
    retention_curves: "retention curve calculations"
  };
}

function generateRetentionCurves(referralData: any[]) {
  // Calculate retention curves for referred users
  return {
    day_1: 0.85,
    day_7: 0.65,
    day_30: 0.45,
    day_90: 0.35
  };
}

function groupIntoCohorts(users: any[], cohortSize: number) {
  const cohorts = [];
  const startDate = new Date(users[0]?.createdAt || new Date());
  
  for (let i = 0; i < users.length; i += cohortSize) {
    const cohortStartDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const cohortEndDate = new Date(cohortStartDate.getTime() + cohortSize * 24 * 60 * 60 * 1000);
    
    cohorts.push({
      name: `Cohort ${Math.floor(i / cohortSize) + 1}`,
      startDate: cohortStartDate,
      endDate: cohortEndDate,
      users: users.slice(i, i + cohortSize)
    });
  }
  
  return cohorts;
}

function calculateCohortViralCoefficient(users: any[], referrals: any[]) {
  return users.length > 0 ? referrals.length / users.length : 0;
}

function calculateCohortTrend(cohortAnalysis: any[]) {
  if (cohortAnalysis.length < 2) return "insufficient_data";
  
  const recent = cohortAnalysis.slice(-3);
  const older = cohortAnalysis.slice(0, -3);
  
  const recentAvg = recent.reduce((sum, c) => sum + c.viralCoefficient, 0) / recent.length;
  const olderAvg = older.length > 0 ? older.reduce((sum, c) => sum + c.viralCoefficient, 0) / older.length : 0;
  
  if (recentAvg > olderAvg * 1.1) return "improving";
  if (recentAvg < olderAvg * 0.9) return "declining";
  return "stable";
}

// Mock functions for viral loop tracking
async function trackExposure(tenantId: string, userId?: string) {
  return { count: Math.floor(Math.random() * 1000), rate: 0.8 };
}

async function trackClick(tenantId: string, userId?: string) {
  return { count: Math.floor(Math.random() * 800), rate: 0.15 };
}

async function trackSignup(tenantId: string, userId?: string) {
  return { count: Math.floor(Math.random() * 120), rate: 0.05 };
}

async function trackActivation(tenantId: string, userId?: string) {
  return { count: Math.floor(Math.random() * 80), rate: 0.04 };
}

async function trackReferralGeneration(tenantId: string, userId?: string) {
  return { count: Math.floor(Math.random() * 40), rate: 0.02 };
}

function calculateLoopEfficiency(loopData: any) {
  const stages = Object.values(loopData) as any[];
  const efficiency = stages.reduce((acc, stage, index) => {
    if (index === 0) return stage.rate;
    return acc * stage.rate;
  }, 1);
  
  return {
    overall: efficiency,
    bottleneck: stages.reduce((min, stage, index) => 
      stage.rate < stages[min].rate ? index : min, 0
    ),
    stages: stages.map((stage, index) => ({
      stage: ["exposure", "click", "signup", "activation", "referral"][index],
      rate: stage.rate,
      optimization_potential: 1 - stage.rate
    }))
  };
}

function generateLoopOptimizationRecommendations(efficiency: any) {
  const bottleneckStage = efficiency.stages[efficiency.bottleneck];
  
  return [
    {
      priority: "high",
      stage: bottleneckStage.stage,
      message: `Optimize ${bottleneckStage.stage} stage - current rate: ${(bottleneckStage.rate * 100).toFixed(1)}%`,
      potential_impact: `${(bottleneckStage.optimization_potential * 100).toFixed(1)}% improvement possible`
    }
  ];
}
