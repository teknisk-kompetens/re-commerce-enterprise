

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period") ?? "monthly";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const tenantId = searchParams.get("tenantId");
    const limit = parseInt(searchParams.get("limit") ?? "12");

    const whereClause: any = { period };
    if (tenantId) whereClause.tenantId = tenantId;

    // Date range filtering
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date.gte = new Date(startDate);
      if (endDate) whereClause.date.lte = new Date(endDate);
    } else {
      // Default to last 12 periods
      const endDateCalc = new Date();
      const startDateCalc = new Date();
      
      if (period === "monthly") {
        startDateCalc.setMonth(startDateCalc.getMonth() - limit);
      } else if (period === "weekly") {
        startDateCalc.setDate(startDateCalc.getDate() - (limit * 7));
      } else if (period === "daily") {
        startDateCalc.setDate(startDateCalc.getDate() - limit);
      } else if (period === "quarterly") {
        startDateCalc.setMonth(startDateCalc.getMonth() - (limit * 3));
      }
      
      whereClause.date = {
        gte: startDateCalc,
        lte: endDateCalc,
      };
    }

    const economics = await prisma.platformEconomics.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
      take: limit,
    });

    // Calculate trends and insights
    const trends = calculateEconomicTrends(economics);
    const insights = generateEconomicInsights(economics);
    const forecasts = generateEconomicForecasts(economics, period);

    // Calculate current period summary
    const currentPeriod = economics[0];
    const previousPeriod = economics[1];
    const periodComparison = currentPeriod && previousPeriod ? 
      calculatePeriodComparison(currentPeriod, previousPeriod) : null;

    return NextResponse.json({
      economics,
      trends,
      insights,
      forecasts,
      currentPeriod,
      periodComparison,
      summary: {
        totalPeriods: economics.length,
        period,
        dateRange: {
          start: economics.length > 0 ? economics[economics.length - 1].date : null,
          end: economics.length > 0 ? economics[0].date : null,
        },
      },
    });
  } catch (error) {
    console.error("Fetch platform economics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch platform economics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "update_economics":
        const { period = "monthly", tenantId = "default" } = body;
        
        const updatedEconomics = await updatePlatformEconomics(period, tenantId);
        return NextResponse.json({ economics: updatedEconomics });

      case "calculate_kpis":
        const { tenantId: kpiTenantId, timeframe = "monthly" } = body;
        
        const kpis = await calculatePlatformKPIs(timeframe, kpiTenantId);
        return NextResponse.json({ kpis });

      case "revenue_breakdown":
        const { period: revPeriod = "monthly", tenantId: revTenantId } = body;
        
        const revenueBreakdown = await getRevenueBreakdown(revPeriod, revTenantId);
        return NextResponse.json({ revenueBreakdown });

      case "cost_analysis":
        const { period: costPeriod = "monthly", tenantId: costTenantId } = body;
        
        const costAnalysis = await getCostAnalysis(costPeriod, costTenantId);
        return NextResponse.json({ costAnalysis });

      case "user_economics":
        const { period: userPeriod = "monthly", tenantId: userTenantId } = body;
        
        const userEconomics = await getUserEconomics(userPeriod, userTenantId);
        return NextResponse.json({ userEconomics });

      case "market_health":
        const { tenantId: healthTenantId } = body;
        
        const marketHealth = await assessMarketHealth(healthTenantId);
        return NextResponse.json({ marketHealth });

      case "optimize_economics":
        const { tenantId: optimizeTenantId } = body;
        
        const optimization = await optimizePlatformEconomics(optimizeTenantId);
        return NextResponse.json({ optimization });

      case "benchmark_analysis":
        const { tenantId: benchmarkTenantId, competitors = [] } = body;
        
        const benchmark = await performBenchmarkAnalysis(benchmarkTenantId, competitors);
        return NextResponse.json({ benchmark });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Platform economics operation error:", error);
    return NextResponse.json(
      { error: "Failed to perform platform economics operation" },
      { status: 500 }
    );
  }
}

async function updatePlatformEconomics(period: string, tenantId: string) {
  try {
    const periodDate = getPeriodDate(new Date(), period);
    
    // Collect economic data for the period
    const economicData = await collectEconomicData(period, periodDate, tenantId);

    // Check if record exists
    const existingRecord = await prisma.platformEconomics.findUnique({
      where: {
        date_period_tenantId: {
          date: periodDate,
          period,
          tenantId,
        },
      },
    });

    let economics;
    if (existingRecord) {
      economics = await prisma.platformEconomics.update({
        where: { id: existingRecord.id },
        data: economicData,
      });
    } else {
      economics = await prisma.platformEconomics.create({
        data: {
          ...economicData,
          date: periodDate,
          period,
          tenantId,
        },
      });
    }

    return economics;
  } catch (error) {
    console.error("Update platform economics error:", error);
    throw error;
  }
}

async function collectEconomicData(period: string, date: Date, tenantId: string) {
  const periodStart = getPeriodStart(date, period);
  const periodEnd = getPeriodEnd(date, period);

  // Revenue metrics
  const [
    primaryMarketRevenue,
    secondaryMarketRevenue,
    subscriptionRevenue,
    royaltyRevenue,
  ] = await Promise.all([
    // Primary marketplace revenue
    calculatePrimaryMarketRevenue(periodStart, periodEnd, tenantId),
    
    // Secondary marketplace revenue
    calculateSecondaryMarketRevenue(periodStart, periodEnd, tenantId),
    
    // Subscription revenue
    calculateSubscriptionRevenue(periodStart, periodEnd, tenantId),
    
    // Royalty revenue
    calculateRoyaltyRevenue(periodStart, periodEnd, tenantId),
  ]);

  const totalRevenue = primaryMarketRevenue + secondaryMarketRevenue + subscriptionRevenue + royaltyRevenue;

  // Transaction metrics
  const [
    primaryTransactions,
    secondaryTransactions,
    totalTransactionValue,
  ] = await Promise.all([
    // Primary marketplace transactions
    prisma.marketplaceTransaction.count({
      where: {
        createdAt: { gte: periodStart, lte: periodEnd },
        status: "completed",
      },
    }),
    
    // Secondary marketplace transactions
    prisma.secondaryMarketTransaction.count({
      where: {
        createdAt: { gte: periodStart, lte: periodEnd },
        status: "completed",
        tenantId,
      },
    }),
    
    // Total transaction value
    calculateTotalTransactionValue(periodStart, periodEnd, tenantId),
  ]);

  const averageTransactionSize = (primaryTransactions + secondaryTransactions) > 0 
    ? totalTransactionValue / (primaryTransactions + secondaryTransactions) 
    : 0;

  // User metrics
  const userMetrics = await calculateUserMetrics(periodStart, periodEnd, tenantId);

  // Market health metrics
  const marketHealthMetrics = await calculateMarketHealthMetrics(periodStart, periodEnd, tenantId);

  // Creator economy metrics
  const creatorMetrics = await calculateCreatorMetrics(periodStart, periodEnd, tenantId);

  // Platform metrics
  const platformMetrics = await calculatePlatformMetrics(
    totalRevenue,
    primaryTransactions + secondaryTransactions,
    periodStart,
    periodEnd,
    tenantId
  );

  // Growth metrics
  const growthMetrics = await calculateGrowthMetrics(period, date, tenantId);

  return {
    // Revenue metrics
    primaryMarketRevenue,
    secondaryMarketRevenue,
    subscriptionRevenue,
    royaltyRevenue,
    totalRevenue,

    // Transaction metrics
    primaryTransactions,
    secondaryTransactions,
    totalTransactionValue,
    averageTransactionSize,

    // User metrics
    ...userMetrics,

    // Market health metrics
    ...marketHealthMetrics,

    // Creator economy metrics
    ...creatorMetrics,

    // Platform metrics
    ...platformMetrics,

    // Growth metrics
    ...growthMetrics,
  };
}

async function calculatePrimaryMarketRevenue(start: Date, end: Date, tenantId: string): Promise<number> {
  const result = await prisma.marketplaceTransaction.aggregate({
    where: {
      createdAt: { gte: start, lte: end },
      status: "completed",
    },
    _sum: { amount: true },
  });

  return result._sum.amount || 0;
}

async function calculateSecondaryMarketRevenue(start: Date, end: Date, tenantId: string): Promise<number> {
  const result = await prisma.secondaryRevenueShare.aggregate({
    where: {
      createdAt: { gte: start, lte: end },
      recipientType: "platform",
      paymentStatus: "paid",
    },
    _sum: { shareAmount: true },
  });

  return result._sum.shareAmount || 0;
}

async function calculateSubscriptionRevenue(start: Date, end: Date, tenantId: string): Promise<number> {
  const result = await prisma.creatorSubscription.aggregate({
    where: {
      lastPayment: { gte: start, lte: end },
      status: "active",
      tenantId,
    },
    _sum: { monthlyPrice: true },
  });

  return result._sum.monthlyPrice || 0;
}

async function calculateRoyaltyRevenue(start: Date, end: Date, tenantId: string): Promise<number> {
  const result = await prisma.creatorRoyalty.aggregate({
    where: {
      createdAt: { gte: start, lte: end },
      status: "paid",
    },
    _sum: { royaltyAmount: true },
  });

  return result._sum.royaltyAmount || 0;
}

async function calculateTotalTransactionValue(start: Date, end: Date, tenantId: string): Promise<number> {
  const [primaryValue, secondaryValue] = await Promise.all([
    prisma.marketplaceTransaction.aggregate({
      where: {
        createdAt: { gte: start, lte: end },
        status: "completed",
      },
      _sum: { amount: true },
    }),
    
    prisma.secondaryMarketTransaction.aggregate({
      where: {
        createdAt: { gte: start, lte: end },
        status: "completed",
        tenantId,
      },
      _sum: { salePrice: true },
    }),
  ]);

  return (primaryValue._sum.amount || 0) + (secondaryValue._sum.salePrice || 0);
}

async function calculateUserMetrics(start: Date, end: Date, tenantId: string) {
  const [
    activeCreators,
    activeBuyers,
    activeSellers,
    newUsers,
    churnedUsers,
  ] = await Promise.all([
    // Active creators (created content or received revenue)
    prisma.user.count({
      where: {
        tenantId,
        OR: [
          {
            createdWidgets: {
              some: {
                createdAt: { gte: start, lte: end },
              },
            },
          },
          {
            createdTemplates: {
              some: {
                createdAt: { gte: start, lte: end },
              },
            },
          },
          {
            secondaryRevenueShares: {
              some: {
                createdAt: { gte: start, lte: end },
              },
            },
          },
        ],
      },
    }),

    // Active buyers
    prisma.user.count({
      where: {
        tenantId,
        OR: [
          {
            buyerTransactions: {
              some: {
                createdAt: { gte: start, lte: end },
                status: "completed",
              },
            },
          },
          {
            buyerSecondaryTransactions: {
              some: {
                createdAt: { gte: start, lte: end },
                status: "completed",
              },
            },
          },
        ],
      },
    }),

    // Active sellers
    prisma.user.count({
      where: {
        tenantId,
        sellerSecondaryTransactions: {
          some: {
            createdAt: { gte: start, lte: end },
            status: "completed",
          },
        },
      },
    }),

    // New users
    prisma.user.count({
      where: {
        tenantId,
        createdAt: { gte: start, lte: end },
      },
    }),

    // Churned users (simplified - users who haven't been active)
    calculateChurnedUsers(start, end, tenantId),
  ]);

  return {
    activeCreators,
    activeBuyers,
    activeSellers,
    newUsers,
    churnedUsers,
  };
}

async function calculateChurnedUsers(start: Date, end: Date, tenantId: string): Promise<number> {
  // Users who were active in previous period but not in current period
  const previousPeriodStart = new Date(start);
  previousPeriodStart.setDate(previousPeriodStart.getDate() - (end.getDate() - start.getDate()));
  
  const [previouslyActive, currentlyActive] = await Promise.all([
    prisma.user.findMany({
      where: {
        tenantId,
        updatedAt: { gte: previousPeriodStart, lt: start },
      },
      select: { id: true },
    }),
    
    prisma.user.findMany({
      where: {
        tenantId,
        updatedAt: { gte: start, lte: end },
      },
      select: { id: true },
    }),
  ]);

  const currentlyActiveIds = new Set(currentlyActive.map(u => u.id));
  const churnedCount = previouslyActive.filter(u => !currentlyActiveIds.has(u.id)).length;

  return churnedCount;
}

async function calculateMarketHealthMetrics(start: Date, end: Date, tenantId: string) {
  const [
    totalListings,
    totalSales,
    averageTimeToSale,
    priceStabilityMetric,
  ] = await Promise.all([
    // Total active listings
    prisma.secondaryMarketListing.count({
      where: {
        tenantId,
        createdAt: { gte: start, lte: end },
        status: "active",
      },
    }),

    // Total sales
    prisma.secondaryMarketTransaction.count({
      where: {
        tenantId,
        completedAt: { gte: start, lte: end },
        status: "completed",
      },
    }),

    // Average time to sale
    calculateAverageTimeToSale(start, end, tenantId),

    // Price stability
    calculatePriceStability(start, end, tenantId),
  ]);

  const marketLiquidity = totalListings > 0 ? totalSales / totalListings : 0;
  const tradingVolume = await calculateTotalTransactionValue(start, end, tenantId);
  const marketMakerActivity = await calculateMarketMakerActivity(start, end, tenantId);

  return {
    marketLiquidity,
    priceStability: priceStabilityMetric,
    tradingVolume,
    marketMakerActivity,
  };
}

async function calculateAverageTimeToSale(start: Date, end: Date, tenantId: string): Promise<number> {
  const completedTransactions = await prisma.secondaryMarketTransaction.findMany({
    where: {
      tenantId,
      completedAt: { gte: start, lte: end },
      status: "completed",
    },
    include: {
      listing: {
        select: { createdAt: true },
      },
    },
  });

  if (completedTransactions.length === 0) return 0;

  const totalDays = completedTransactions.reduce((sum, transaction) => {
    const listingDate = transaction.listing.createdAt;
    const saleDate = transaction.completedAt!;
    const daysDifference = (saleDate.getTime() - listingDate.getTime()) / (1000 * 60 * 60 * 24);
    return sum + daysDifference;
  }, 0);

  return totalDays / completedTransactions.length;
}

async function calculatePriceStability(start: Date, end: Date, tenantId: string): Promise<number> {
  const priceData = await prisma.secondaryMarketTransaction.findMany({
    where: {
      tenantId,
      completedAt: { gte: start, lte: end },
      status: "completed",
    },
    select: { salePrice: true },
    orderBy: { completedAt: "asc" },
  });

  if (priceData.length < 2) return 1.0; // Perfect stability if no variance

  const prices = priceData.map(t => t.salePrice);
  const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
  const standardDeviation = Math.sqrt(variance);

  // Convert to stability score (1 = perfectly stable, 0 = highly volatile)
  const coefficientOfVariation = mean > 0 ? standardDeviation / mean : 0;
  return Math.max(0, 1 - coefficientOfVariation);
}

async function calculateMarketMakerActivity(start: Date, end: Date, tenantId: string): Promise<number> {
  // Simplified metric based on listing creation activity
  const listings = await prisma.secondaryMarketListing.count({
    where: {
      tenantId,
      createdAt: { gte: start, lte: end },
    },
  });

  const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return days > 0 ? listings / days : 0;
}

async function calculateCreatorMetrics(start: Date, end: Date, tenantId: string) {
  const [
    totalCreatorEarnings,
    activeCreators,
    topCreatorEarnings,
    retainedCreators,
  ] = await Promise.all([
    // Total creator earnings
    prisma.creatorPayout.aggregate({
      where: {
        tenantId,
        paidAt: { gte: start, lte: end },
        status: "paid",
      },
      _sum: { netAmount: true },
    }),

    // Active creators count
    prisma.creatorProfile.count({
      where: {
        tenantId,
        programStatus: "active",
        lastPayout: { gte: start, lte: end },
      },
    }),

    // Top creator earnings
    prisma.creatorPayout.findFirst({
      where: {
        tenantId,
        paidAt: { gte: start, lte: end },
        status: "paid",
      },
      orderBy: { netAmount: "desc" },
      select: { netAmount: true },
    }),

    // Creator retention
    calculateCreatorRetention(start, end, tenantId),
  ]);

  const creatorEarnings = totalCreatorEarnings._sum.netAmount || 0;
  const averageCreatorIncome = activeCreators > 0 ? creatorEarnings / activeCreators : 0;
  const topCreatorEarningsAmount = topCreatorEarnings?.netAmount || 0;

  return {
    creatorEarnings,
    averageCreatorIncome,
    topCreatorEarnings: topCreatorEarningsAmount,
    creatorRetentionRate: retainedCreators,
  };
}

async function calculateCreatorRetention(start: Date, end: Date, tenantId: string): Promise<number> {
  // Simplified retention calculation
  const previousPeriodStart = new Date(start);
  const previousPeriodEnd = new Date(start);
  const periodLength = end.getTime() - start.getTime();
  previousPeriodStart.setTime(previousPeriodStart.getTime() - periodLength);

  const [previousPeriodCreators, currentPeriodCreators] = await Promise.all([
    prisma.creatorProfile.findMany({
      where: {
        tenantId,
        lastPayout: { gte: previousPeriodStart, lt: start },
      },
      select: { userId: true },
    }),

    prisma.creatorProfile.findMany({
      where: {
        tenantId,
        lastPayout: { gte: start, lte: end },
      },
      select: { userId: true },
    }),
  ]);

  if (previousPeriodCreators.length === 0) return 1.0;

  const currentCreatorIds = new Set(currentPeriodCreators.map(c => c.userId));
  const retainedCreators = previousPeriodCreators.filter(c => currentCreatorIds.has(c.userId)).length;

  return retainedCreators / previousPeriodCreators.length;
}

async function calculatePlatformMetrics(
  totalRevenue: number,
  totalTransactions: number,
  start: Date,
  end: Date,
  tenantId: string
) {
  // Platform fees calculation
  const platformFees = await prisma.secondaryRevenueShare.aggregate({
    where: {
      createdAt: { gte: start, lte: end },
      recipientType: "platform",
      paymentStatus: "paid",
    },
    _sum: { shareAmount: true },
  });

  // Operating costs (simplified - this would typically come from external data)
  const operatingCosts = totalRevenue * 0.3; // Assume 30% operating costs

  const platformFeesAmount = platformFees._sum.shareAmount || 0;
  const profitMargin = totalRevenue > 0 ? (totalRevenue - operatingCosts) / totalRevenue : 0;
  const roi = operatingCosts > 0 ? (totalRevenue - operatingCosts) / operatingCosts : 0;

  return {
    platformFees: platformFeesAmount,
    operatingCosts,
    profitMargin,
    roi,
  };
}

async function calculateGrowthMetrics(period: string, currentDate: Date, tenantId: string) {
  // Get previous period data for comparison
  const previousPeriodDate = getPreviousPeriodDate(currentDate, period);
  
  const [currentPeriodData, previousPeriodData] = await Promise.all([
    prisma.platformEconomics.findUnique({
      where: {
        date_period_tenantId: {
          date: currentDate,
          period,
          tenantId,
        },
      },
    }),

    prisma.platformEconomics.findUnique({
      where: {
        date_period_tenantId: {
          date: previousPeriodDate,
          period,
          tenantId,
        },
      },
    }),
  ]);

  if (!previousPeriodData) {
    return {
      revenueGrowthRate: 0,
      userGrowthRate: 0,
      transactionGrowthRate: 0,
      marketShareGrowth: 0,
    };
  }

  const revenueGrowthRate = calculateGrowthRate(
    previousPeriodData.totalRevenue,
    currentPeriodData?.totalRevenue || 0
  );

  const userGrowthRate = calculateGrowthRate(
    previousPeriodData.newUsers,
    currentPeriodData?.newUsers || 0
  );

  const transactionGrowthRate = calculateGrowthRate(
    previousPeriodData.primaryTransactions + previousPeriodData.secondaryTransactions,
    (currentPeriodData?.primaryTransactions || 0) + (currentPeriodData?.secondaryTransactions || 0)
  );

  // Market share growth (simplified)
  const marketShareGrowth = calculateGrowthRate(
    previousPeriodData.tradingVolume,
    currentPeriodData?.tradingVolume || 0
  );

  return {
    revenueGrowthRate,
    userGrowthRate,
    transactionGrowthRate,
    marketShareGrowth,
  };
}

function calculateGrowthRate(previousValue: number, currentValue: number): number {
  if (previousValue === 0) return currentValue > 0 ? 100 : 0;
  return ((currentValue - previousValue) / previousValue) * 100;
}

function calculateEconomicTrends(economics: any[]) {
  if (economics.length < 2) return {};

  const trends = {
    revenue: calculateTrend(economics.map(e => e.totalRevenue)),
    transactions: calculateTrend(economics.map(e => e.primaryTransactions + e.secondaryTransactions)),
    users: calculateTrend(economics.map(e => e.newUsers)),
    profitability: calculateTrend(economics.map(e => e.profitMargin)),
  };

  return trends;
}

function calculateTrend(values: number[]) {
  if (values.length < 2) return { direction: "stable", strength: 0 };

  // Simple linear regression
  const n = values.length;
  const x = Array.from({ length: n }, (_, i) => i);
  const y = values.reverse(); // Chronological order

  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const direction = slope > 0.1 ? "increasing" : slope < -0.1 ? "decreasing" : "stable";
  const strength = Math.abs(slope);

  return { direction, strength, slope };
}

function generateEconomicInsights(economics: any[]) {
  if (economics.length === 0) return [];

  const insights = [];
  const latest = economics[0];
  const previous = economics[1];

  // Revenue insights
  if (latest.totalRevenue > 0) {
    const primaryShare = (latest.primaryMarketRevenue / latest.totalRevenue) * 100;
    const secondaryShare = (latest.secondaryMarketRevenue / latest.totalRevenue) * 100;
    
    insights.push({
      type: "revenue_mix",
      message: `Primary market contributes ${primaryShare.toFixed(1)}% of total revenue, secondary market ${secondaryShare.toFixed(1)}%`,
      severity: secondaryShare > 30 ? "positive" : "neutral",
    });
  }

  // Growth insights
  if (previous) {
    const revenueGrowth = calculateGrowthRate(previous.totalRevenue, latest.totalRevenue);
    insights.push({
      type: "growth",
      message: `Revenue ${revenueGrowth >= 0 ? "increased" : "decreased"} by ${Math.abs(revenueGrowth).toFixed(1)}% from previous period`,
      severity: revenueGrowth >= 10 ? "positive" : revenueGrowth <= -10 ? "negative" : "neutral",
    });
  }

  // Market health insights
  if (latest.marketLiquidity < 0.3) {
    insights.push({
      type: "market_health",
      message: "Low market liquidity detected - consider incentives to increase trading activity",
      severity: "warning",
    });
  }

  // Creator economy insights
  if (latest.creatorRetentionRate < 0.7) {
    insights.push({
      type: "creator_retention",
      message: "Creator retention below 70% - consider improving creator incentives",
      severity: "warning",
    });
  }

  return insights;
}

function generateEconomicForecasts(economics: any[], period: string) {
  if (economics.length < 3) return [];

  const forecasts = [];
  const revenues = economics.map(e => e.totalRevenue).reverse();
  const users = economics.map(e => e.newUsers).reverse();

  // Simple trend-based forecasts
  const revenueTrend = calculateTrend(revenues);
  const userTrend = calculateTrend(users);

  const nextPeriodRevenue = revenues[revenues.length - 1] + (revenueTrend.slope * revenues.length);
  const nextPeriodUsers = users[users.length - 1] + (userTrend.slope * users.length);

  forecasts.push({
    metric: "revenue",
    currentValue: revenues[revenues.length - 1],
    forecastValue: Math.max(0, nextPeriodRevenue),
    confidence: calculateForecastConfidence(revenueTrend.strength),
  });

  forecasts.push({
    metric: "newUsers",
    currentValue: users[users.length - 1],
    forecastValue: Math.max(0, nextPeriodUsers),
    confidence: calculateForecastConfidence(userTrend.strength),
  });

  return forecasts;
}

function calculateForecastConfidence(trendStrength: number): number {
  // Higher trend strength = higher confidence, but cap at 90%
  return Math.min(0.9, 0.5 + (trendStrength * 0.4));
}

function calculatePeriodComparison(current: any, previous: any) {
  const metrics = [
    "totalRevenue",
    "primaryTransactions",
    "secondaryTransactions",
    "newUsers",
    "marketLiquidity",
    "profitMargin",
  ];

  const comparison = {};
  
  metrics.forEach(metric => {
    const currentValue = current[metric] || 0;
    const previousValue = previous[metric] || 0;
    const change = currentValue - previousValue;
    const percentChange = previousValue > 0 ? (change / previousValue) * 100 : 0;

    comparison[metric] = {
      current: currentValue,
      previous: previousValue,
      change,
      percentChange,
      trend: percentChange > 5 ? "up" : percentChange < -5 ? "down" : "stable",
    };
  });

  return comparison;
}

async function calculatePlatformKPIs(timeframe: string, tenantId: string) {
  const endDate = new Date();
  const startDate = getTimeframeStartDate(endDate, timeframe);

  const kpis = {
    // Financial KPIs
    totalRevenue: await calculateTotalRevenue(startDate, endDate, tenantId),
    grossMargin: await calculateGrossMargin(startDate, endDate, tenantId),
    customerLifetimeValue: await calculateCustomerLTV(tenantId),
    customerAcquisitionCost: await calculateCustomerCAC(startDate, endDate, tenantId),
    
    // Operational KPIs
    activeUsers: await calculateActiveUsers(startDate, endDate, tenantId),
    transactionSuccess: await calculateTransactionSuccessRate(startDate, endDate, tenantId),
    averageOrderValue: await calculateAverageOrderValue(startDate, endDate, tenantId),
    
    // Market KPIs
    marketLiquidity: await calculateCurrentMarketLiquidity(tenantId),
    creatorSatisfaction: await calculateCreatorSatisfaction(tenantId),
    userEngagement: await calculateUserEngagement(startDate, endDate, tenantId),
  };

  return kpis;
}

// Helper functions for date calculations
function getPeriodDate(date: Date, period: string): Date {
  const result = new Date(date);
  
  switch (period) {
    case "daily":
      result.setHours(0, 0, 0, 0);
      break;
    case "weekly":
      const dayOfWeek = result.getDay();
      result.setDate(result.getDate() - dayOfWeek);
      result.setHours(0, 0, 0, 0);
      break;
    case "monthly":
      result.setDate(1);
      result.setHours(0, 0, 0, 0);
      break;
    case "quarterly":
      const quarter = Math.floor(result.getMonth() / 3);
      result.setMonth(quarter * 3, 1);
      result.setHours(0, 0, 0, 0);
      break;
  }
  
  return result;
}

function getPeriodStart(date: Date, period: string): Date {
  return getPeriodDate(date, period);
}

function getPeriodEnd(date: Date, period: string): Date {
  const start = getPeriodStart(date, period);
  const end = new Date(start);
  
  switch (period) {
    case "daily":
      end.setDate(end.getDate() + 1);
      break;
    case "weekly":
      end.setDate(end.getDate() + 7);
      break;
    case "monthly":
      end.setMonth(end.getMonth() + 1);
      break;
    case "quarterly":
      end.setMonth(end.getMonth() + 3);
      break;
  }
  
  end.setMilliseconds(end.getMilliseconds() - 1);
  return end;
}

function getPreviousPeriodDate(date: Date, period: string): Date {
  const result = new Date(date);
  
  switch (period) {
    case "daily":
      result.setDate(result.getDate() - 1);
      break;
    case "weekly":
      result.setDate(result.getDate() - 7);
      break;
    case "monthly":
      result.setMonth(result.getMonth() - 1);
      break;
    case "quarterly":
      result.setMonth(result.getMonth() - 3);
      break;
  }
  
  return getPeriodDate(result, period);
}

function getTimeframeStartDate(endDate: Date, timeframe: string): Date {
  const startDate = new Date(endDate);
  
  switch (timeframe) {
    case "weekly":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "monthly":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "quarterly":
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case "yearly":
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(startDate.getMonth() - 1);
  }
  
  return startDate;
}

// Placeholder implementations for additional KPI calculations
async function calculateTotalRevenue(start: Date, end: Date, tenantId: string): Promise<number> {
  // Implementation already exists in collectEconomicData
  return 0;
}

async function calculateGrossMargin(start: Date, end: Date, tenantId: string): Promise<number> {
  // Calculate gross margin
  return 0.7; // 70% gross margin placeholder
}

async function calculateCustomerLTV(tenantId: string): Promise<number> {
  // Calculate customer lifetime value
  return 500; // $500 LTV placeholder
}

async function calculateCustomerCAC(start: Date, end: Date, tenantId: string): Promise<number> {
  // Calculate customer acquisition cost
  return 50; // $50 CAC placeholder
}

async function calculateActiveUsers(start: Date, end: Date, tenantId: string): Promise<number> {
  // Implementation already exists in calculateUserMetrics
  return 0;
}

async function calculateTransactionSuccessRate(start: Date, end: Date, tenantId: string): Promise<number> {
  const totalTransactions = await prisma.secondaryMarketTransaction.count({
    where: {
      tenantId,
      createdAt: { gte: start, lte: end },
    },
  });

  const successfulTransactions = await prisma.secondaryMarketTransaction.count({
    where: {
      tenantId,
      createdAt: { gte: start, lte: end },
      status: "completed",
    },
  });

  return totalTransactions > 0 ? successfulTransactions / totalTransactions : 0;
}

async function calculateAverageOrderValue(start: Date, end: Date, tenantId: string): Promise<number> {
  const result = await prisma.secondaryMarketTransaction.aggregate({
    where: {
      tenantId,
      completedAt: { gte: start, lte: end },
      status: "completed",
    },
    _avg: { salePrice: true },
  });

  return result._avg.salePrice || 0;
}

async function calculateCurrentMarketLiquidity(tenantId: string): Promise<number> {
  // Implementation already exists in calculateMarketHealthMetrics
  return 0.5; // 50% liquidity placeholder
}

async function calculateCreatorSatisfaction(tenantId: string): Promise<number> {
  // This would typically come from surveys or ratings
  return 4.2; // 4.2/5 satisfaction placeholder
}

async function calculateUserEngagement(start: Date, end: Date, tenantId: string): Promise<number> {
  // Calculate based on user activity metrics
  return 0.75; // 75% engagement placeholder
}

// Additional placeholder functions for the remaining operations
async function getRevenueBreakdown(period: string, tenantId: string) {
  // Implementation for detailed revenue breakdown
  return {
    primaryMarket: 60,
    secondaryMarket: 25,
    subscriptions: 10,
    royalties: 5,
  };
}

async function getCostAnalysis(period: string, tenantId: string) {
  // Implementation for cost analysis
  return {
    operatingCosts: 30,
    marketingCosts: 15,
    platformCosts: 10,
    supportCosts: 5,
  };
}

async function getUserEconomics(period: string, tenantId: string) {
  // Implementation for user economics analysis
  return {
    averageUserValue: 150,
    userAcquisitionCost: 25,
    userLifetimeValue: 400,
    churnRate: 0.05,
  };
}

async function assessMarketHealth(tenantId: string) {
  // Implementation for market health assessment
  return {
    overall: "healthy",
    liquidity: 0.7,
    volatility: 0.3,
    growth: "moderate",
  };
}

async function optimizePlatformEconomics(tenantId: string) {
  // Implementation for platform optimization recommendations
  return {
    recommendations: [
      "Increase secondary market fees by 1%",
      "Launch creator incentive program",
      "Optimize pricing algorithms",
    ],
    potentialImpact: {
      revenueIncrease: 15,
      costReduction: 8,
    },
  };
}

async function performBenchmarkAnalysis(tenantId: string, competitors: string[]) {
  // Implementation for benchmark analysis
  return {
    performance: "above_average",
    marketPosition: "strong",
    competitiveAdvantages: [
      "Higher creator retention",
      "Lower transaction fees",
      "Better user experience",
    ],
  };
}

