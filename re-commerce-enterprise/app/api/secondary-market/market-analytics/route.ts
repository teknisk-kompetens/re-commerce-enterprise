

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const assetType = searchParams.get("assetType");
    const assetId = searchParams.get("assetId");
    const category = searchParams.get("category");
    const period = searchParams.get("period") ?? "daily";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const limit = parseInt(searchParams.get("limit") ?? "30");

    const whereClause: any = { period };
    if (assetType) whereClause.assetType = assetType;
    if (assetId) whereClause.assetId = assetId;
    if (category) whereClause.category = category;

    // Date range filtering
    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) whereClause.date.gte = new Date(startDate);
      if (endDate) whereClause.date.lte = new Date(endDate);
    } else {
      // Default to last 30 days
      whereClause.date = {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      };
    }

    const analytics = await prisma.marketDemandAnalytics.findMany({
      where: whereClause,
      orderBy: { date: "desc" },
      take: limit,
    });

    // Calculate aggregated metrics
    const aggregatedMetrics = calculateAggregatedMetrics(analytics);

    // Get trend analysis
    const trendAnalysis = calculateTrendAnalysis(analytics);

    // Get market comparison data
    const marketComparison = await getMarketComparison(assetType, category);

    return NextResponse.json({
      analytics,
      aggregatedMetrics,
      trendAnalysis,
      marketComparison,
      period,
      dateRange: {
        start: analytics.length > 0 ? analytics[analytics.length - 1].date : null,
        end: analytics.length > 0 ? analytics[0].date : null,
      },
    });
  } catch (error) {
    console.error("Fetch market analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch market analytics" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "update_analytics":
        const { assetType, assetId, category, period = "daily" } = body;
        
        const updatedAnalytics = await updateMarketAnalytics(
          assetType,
          assetId,
          category,
          period
        );

        return NextResponse.json({ analytics: updatedAnalytics });

      case "batch_update":
        const { assetTypes, categories, period: batchPeriod = "daily" } = body;
        
        const batchResults = await batchUpdateAnalytics(assetTypes, categories, batchPeriod);
        return NextResponse.json({ batchResults });

      case "generate_forecast":
        const { assetType: forecastAssetType, assetId: forecastAssetId, days = 30 } = body;
        
        const forecast = await generateMarketForecast(forecastAssetType, forecastAssetId, days);
        return NextResponse.json({ forecast });

      case "market_comparison":
        const { assetType: compAssetType, categories: compCategories } = body;
        
        const comparison = await getDetailedMarketComparison(compAssetType, compCategories);
        return NextResponse.json({ comparison });

      case "demand_analysis":
        const { assetType: demandAssetType, timeframe = 30 } = body;
        
        const demandAnalysis = await analyzeDemandPatterns(demandAssetType, timeframe);
        return NextResponse.json({ demandAnalysis });

      case "price_elasticity":
        const { assetType: elasticityAssetType, pricePoints } = body;
        
        const elasticity = await calculatePriceElasticity(elasticityAssetType, pricePoints);
        return NextResponse.json({ elasticity });

      case "competitive_analysis":
        const { assetId: compAssetId } = body;
        
        const competitiveAnalysis = await performCompetitiveAnalysis(compAssetId);
        return NextResponse.json({ competitiveAnalysis });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Market analytics operation error:", error);
    return NextResponse.json(
      { error: "Failed to perform market analytics operation" },
      { status: 500 }
    );
  }
}

async function updateMarketAnalytics(assetType: string, assetId: string, category: string, period: string) {
  try {
    const today = new Date();
    const periodDate = getPeriodDate(today, period);

    // Collect market data
    const marketData = await collectMarketData(assetType, assetId, category, periodDate);

    // Check if analytics record exists for this period
    const existingAnalytics = await prisma.marketDemandAnalytics.findUnique({
      where: {
        date_period_assetType_assetId: {
          date: periodDate,
          period,
          assetType,
          assetId: assetId || "all",
        },
      },
    });

    const analyticsData = {
      assetType,
      assetId: assetId || null,
      category: category || null,
      period,
      date: periodDate,
      ...marketData,
      tenantId: "default", // You might want to pass this as parameter
    };

    let analytics;
    if (existingAnalytics) {
      analytics = await prisma.marketDemandAnalytics.update({
        where: { id: existingAnalytics.id },
        data: analyticsData,
      });
    } else {
      analytics = await prisma.marketDemandAnalytics.create({
        data: analyticsData,
      });
    }

    return analytics;
  } catch (error) {
    console.error("Update market analytics error:", error);
    throw error;
  }
}

async function collectMarketData(assetType: string, assetId: string, category: string, date: Date) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const whereClause: any = {
    createdAt: { gte: dayStart, lte: dayEnd },
  };

  if (assetId) {
    whereClause.assetOwnership = { assetId };
  } else if (category) {
    whereClause.assetOwnership = { 
      assetData: { path: ["category"], equals: category }
    };
  }
  if (assetType) {
    whereClause.assetOwnership = { 
      ...whereClause.assetOwnership,
      assetType 
    };
  }

  // Collect various metrics
  const [
    viewCount,
    favoriteCount,
    listingCount,
    transactionCount,
    priceData,
    searchData,
  ] = await Promise.all([
    // View count (approximate based on listing views)
    prisma.secondaryMarketListing.aggregate({
      where: whereClause,
      _sum: { viewCount: true },
    }),

    // Favorite count
    prisma.secondaryMarketListing.aggregate({
      where: whereClause,
      _sum: { favoriteCount: true },
    }),

    // New listings count
    prisma.secondaryMarketListing.count({
      where: whereClause,
    }),

    // Completed transactions
    prisma.secondaryMarketTransaction.count({
      where: {
        ...whereClause,
        status: "completed",
      },
    }),

    // Price data from completed transactions
    prisma.secondaryMarketTransaction.findMany({
      where: {
        ...whereClause,
        status: "completed",
      },
      select: { salePrice: true },
    }),

    // Search count (approximate)
    prisma.secondaryMarketListing.count({
      where: {
        ...whereClause,
        viewCount: { gt: 0 },
      },
    }),
  ]);

  // Calculate price metrics
  const prices = priceData.map(t => t.salePrice).filter(p => p > 0);
  const priceMetrics = calculatePriceMetrics(prices);

  // Calculate demand score
  const demandScore = calculateDemandScore(
    viewCount._sum.viewCount || 0,
    favoriteCount._sum.favoriteCount || 0,
    listingCount,
    transactionCount
  );

  // Calculate market metrics
  const marketCap = prices.reduce((sum, price) => sum + price, 0);
  const tradingVolume = marketCap;
  const liquidity = calculateLiquidity(listingCount, transactionCount);

  // Generate predictions
  const predictions = await generatePredictions(assetType, assetId, priceMetrics);

  return {
    viewCount: viewCount._sum.viewCount || 0,
    searchCount: searchData,
    favoriteCount: favoriteCount._sum.favoriteCount || 0,
    listingCount,
    saleCount: transactionCount,
    ...priceMetrics,
    marketCap,
    tradingVolume,
    liquidity,
    demandScore,
    ...predictions,
  };
}

function calculatePriceMetrics(prices: number[]) {
  if (prices.length === 0) {
    return {
      averagePrice: 0,
      medianPrice: 0,
      minPrice: 0,
      maxPrice: 0,
      priceVolatility: 0,
    };
  }

  const sorted = prices.slice().sort((a, b) => a - b);
  const average = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const median = sorted.length % 2 === 0
    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
    : sorted[Math.floor(sorted.length / 2)];

  // Calculate volatility (standard deviation)
  const squareDiffs = prices.map(price => Math.pow(price - average, 2));
  const avgSquareDiff = squareDiffs.reduce((sum, sq) => sum + sq, 0) / prices.length;
  const volatility = Math.sqrt(avgSquareDiff) / average; // Coefficient of variation

  return {
    averagePrice: average,
    medianPrice: median,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    priceVolatility: volatility,
  };
}

function calculateDemandScore(views: number, favorites: number, listings: number, sales: number): number {
  // Normalize metrics to 0-1 scale
  const maxViews = 1000;
  const maxFavorites = 100;
  const maxListings = 50;
  const maxSales = 20;

  const normalizedViews = Math.min(views / maxViews, 1);
  const normalizedFavorites = Math.min(favorites / maxFavorites, 1);
  const normalizedListings = Math.min(listings / maxListings, 1);
  const normalizedSales = Math.min(sales / maxSales, 1);

  // Weighted score
  const weights = { views: 0.3, favorites: 0.2, listings: 0.2, sales: 0.3 };
  
  return (
    normalizedViews * weights.views +
    normalizedFavorites * weights.favorites +
    normalizedListings * weights.listings +
    normalizedSales * weights.sales
  );
}

function calculateLiquidity(listings: number, sales: number): number {
  if (listings === 0) return 0;
  return Math.min(sales / listings, 1); // Sales to listings ratio, capped at 1
}

async function generatePredictions(assetType: string, assetId: string, priceMetrics: any) {
  // Get historical data for trend analysis
  const historicalData = await prisma.marketDemandAnalytics.findMany({
    where: {
      assetType,
      assetId: assetId || null,
      period: "daily",
      date: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    },
    orderBy: { date: "desc" },
    take: 30,
  });

  const prices = historicalData.map(d => d.averagePrice).filter(p => p > 0);
  const demands = historicalData.map(d => d.demandScore);

  // Simple trend calculation
  const trendDirection = calculateTrendDirection(prices);
  const demandForecast = calculateDemandForecast(demands);
  const priceTarget = calculatePriceTarget(prices, priceMetrics.averagePrice);

  // Market sentiment analysis
  const marketSentiment = calculateMarketSentiment(
    trendDirection,
    demandForecast,
    priceMetrics.priceVolatility
  );

  // Confidence level based on data quality
  const confidenceLevel = calculateConfidenceLevel(historicalData.length, priceMetrics.priceVolatility);

  return {
    trendDirection,
    demandForecast,
    priceTarget,
    marketSentiment,
    confidenceLevel,
    seasonalFactor: 1.0, // Could be enhanced with actual seasonal data
    competitionIndex: 1.0, // Could be calculated from market share data
  };
}

function calculateTrendDirection(prices: number[]): string {
  if (prices.length < 2) return "stable";
  
  const recent = prices.slice(0, Math.floor(prices.length / 3));
  const older = prices.slice(-Math.floor(prices.length / 3));
  
  const recentAvg = recent.reduce((sum, p) => sum + p, 0) / recent.length;
  const olderAvg = older.reduce((sum, p) => sum + p, 0) / older.length;
  
  const change = (recentAvg - olderAvg) / olderAvg;
  
  if (change > 0.1) return "rising";
  if (change < -0.1) return "falling";
  if (Math.abs(change) > 0.05) return "volatile";
  return "stable";
}

function calculateDemandForecast(demands: number[]): number {
  if (demands.length === 0) return 0;
  
  // Simple moving average forecast
  const recent = demands.slice(0, Math.min(7, demands.length));
  return recent.reduce((sum, d) => sum + d, 0) / recent.length;
}

function calculatePriceTarget(historicalPrices: number[], currentPrice: number): number {
  if (historicalPrices.length === 0) return currentPrice;
  
  const trend = calculateTrendDirection(historicalPrices);
  const volatility = calculatePriceVolatility(historicalPrices);
  
  let target = currentPrice;
  
  switch (trend) {
    case "rising":
      target = currentPrice * (1 + Math.min(volatility, 0.2));
      break;
    case "falling":
      target = currentPrice * (1 - Math.min(volatility, 0.2));
      break;
    case "volatile":
      target = currentPrice * (1 + (Math.random() - 0.5) * volatility);
      break;
    default:
      target = currentPrice;
  }
  
  return target;
}

function calculatePriceVolatility(prices: number[]): number {
  if (prices.length < 2) return 0;
  
  const average = prices.reduce((sum, p) => sum + p, 0) / prices.length;
  const squareDiffs = prices.map(price => Math.pow(price - average, 2));
  const variance = squareDiffs.reduce((sum, sq) => sum + sq, 0) / prices.length;
  
  return Math.sqrt(variance) / average; // Coefficient of variation
}

function calculateMarketSentiment(trend: string, demand: number, volatility: number): string {
  if (trend === "rising" && demand > 0.7) return "bullish";
  if (trend === "falling" && demand < 0.3) return "bearish";
  if (volatility > 0.3) return "uncertain";
  return "neutral";
}

function calculateConfidenceLevel(dataPoints: number, volatility: number): number {
  const dataQuality = Math.min(dataPoints / 30, 1) * 0.7; // More data = higher confidence
  const stabilityBonus = Math.max(0, (1 - volatility)) * 0.3; // Lower volatility = higher confidence
  return Math.min(dataQuality + stabilityBonus, 1.0);
}

function calculateAggregatedMetrics(analytics: any[]) {
  if (analytics.length === 0) return {};

  const totals = analytics.reduce(
    (acc, item) => ({
      totalViews: acc.totalViews + item.viewCount,
      totalFavorites: acc.totalFavorites + item.favoriteCount,
      totalListings: acc.totalListings + item.listingCount,
      totalSales: acc.totalSales + item.saleCount,
      totalVolume: acc.totalVolume + item.tradingVolume,
    }),
    { totalViews: 0, totalFavorites: 0, totalListings: 0, totalSales: 0, totalVolume: 0 }
  );

  const averages = {
    avgPrice: analytics.reduce((sum, item) => sum + item.averagePrice, 0) / analytics.length,
    avgDemand: analytics.reduce((sum, item) => sum + item.demandScore, 0) / analytics.length,
    avgLiquidity: analytics.reduce((sum, item) => sum + item.liquidity, 0) / analytics.length,
  };

  return { ...totals, ...averages };
}

function calculateTrendAnalysis(analytics: any[]) {
  if (analytics.length < 2) return {};

  const prices = analytics.map(a => a.averagePrice).reverse(); // Chronological order
  const demands = analytics.map(a => a.demandScore).reverse();
  const volumes = analytics.map(a => a.tradingVolume).reverse();

  return {
    priceMovement: calculateMovement(prices),
    demandMovement: calculateMovement(demands),
    volumeMovement: calculateMovement(volumes),
    overallTrend: calculateTrendDirection(prices),
  };
}

function calculateMovement(values: number[]): { direction: string; change: number; percentage: number } {
  if (values.length < 2) return { direction: "stable", change: 0, percentage: 0 };

  const first = values[0];
  const last = values[values.length - 1];
  const change = last - first;
  const percentage = first > 0 ? (change / first) * 100 : 0;

  let direction = "stable";
  if (Math.abs(percentage) > 5) {
    direction = percentage > 0 ? "up" : "down";
  }

  return { direction, change, percentage };
}

async function getMarketComparison(assetType?: string, category?: string) {
  const whereClause: any = { period: "daily" };
  if (assetType) whereClause.assetType = assetType;
  if (category) whereClause.category = category;

  const marketData = await prisma.marketDemandAnalytics.findMany({
    where: {
      ...whereClause,
      date: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
      },
    },
    select: {
      assetType: true,
      category: true,
      averagePrice: true,
      demandScore: true,
      tradingVolume: true,
    },
  });

  // Group by asset type and category
  const comparison = marketData.reduce((acc, item) => {
    const key = `${item.assetType}_${item.category || "uncategorized"}`;
    if (!acc[key]) {
      acc[key] = {
        assetType: item.assetType,
        category: item.category,
        avgPrice: 0,
        avgDemand: 0,
        totalVolume: 0,
        count: 0,
      };
    }
    
    acc[key].avgPrice += item.averagePrice;
    acc[key].avgDemand += item.demandScore;
    acc[key].totalVolume += item.tradingVolume;
    acc[key].count += 1;
    
    return acc;
  }, {});

  // Calculate averages
  Object.values(comparison).forEach((item: any) => {
    item.avgPrice /= item.count;
    item.avgDemand /= item.count;
  });

  return Object.values(comparison);
}

async function getDetailedMarketComparison(assetType: string, categories: string[]) {
  // Implementation for detailed market comparison
  const comparisons = await Promise.all(
    categories.map(async (category) => {
      const analytics = await prisma.marketDemandAnalytics.findMany({
        where: {
          assetType,
          category,
          period: "daily",
          date: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        orderBy: { date: "desc" },
        take: 30,
      });

      return {
        category,
        analytics: calculateAggregatedMetrics(analytics),
        trend: calculateTrendAnalysis(analytics),
      };
    })
  );

  return comparisons;
}

async function batchUpdateAnalytics(assetTypes: string[], categories: string[], period: string) {
  const results = [];
  
  for (const assetType of assetTypes) {
    for (const category of categories) {
      try {
        const analytics = await updateMarketAnalytics(assetType, null, category, period);
        results.push({ assetType, category, success: true, analytics });
      } catch (error) {
        results.push({ assetType, category, success: false, error: error.message });
      }
    }
  }

  return results;
}

async function generateMarketForecast(assetType: string, assetId: string, days: number) {
  // Placeholder implementation for market forecasting
  const historicalData = await prisma.marketDemandAnalytics.findMany({
    where: {
      assetType,
      assetId: assetId || null,
      period: "daily",
      date: {
        gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // Last 60 days
      },
    },
    orderBy: { date: "desc" },
  });

  // Simple linear regression forecast
  const forecast = [];
  const prices = historicalData.map(d => d.averagePrice);
  const demands = historicalData.map(d => d.demandScore);

  for (let i = 1; i <= days; i++) {
    const futureDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
    const priceProjection = calculateProjection(prices, i);
    const demandProjection = calculateProjection(demands, i);

    forecast.push({
      date: futureDate,
      projectedPrice: priceProjection,
      projectedDemand: demandProjection,
      confidence: Math.max(0, 1 - (i / days) * 0.5), // Decreasing confidence over time
    });
  }

  return {
    assetType,
    assetId,
    forecastPeriod: days,
    historicalDataPoints: historicalData.length,
    forecast,
  };
}

function calculateProjection(values: number[], daysAhead: number): number {
  if (values.length < 2) return values[0] || 0;

  // Simple linear trend projection
  const recentValue = values[0];
  const olderValue = values[Math.min(7, values.length - 1)];
  const dailyChange = (recentValue - olderValue) / Math.min(7, values.length - 1);

  return Math.max(0, recentValue + (dailyChange * daysAhead));
}

async function analyzeDemandPatterns(assetType: string, timeframe: number) {
  const analytics = await prisma.marketDemandAnalytics.findMany({
    where: {
      assetType,
      period: "daily",
      date: {
        gte: new Date(Date.now() - timeframe * 24 * 60 * 60 * 1000),
      },
    },
    orderBy: { date: "desc" },
  });

  // Analyze patterns by day of week, time trends, etc.
  const patterns = {
    weeklyPattern: analyzeWeeklyPattern(analytics),
    seasonalTrend: analyzeSeasonalTrend(analytics),
    demandDrivers: identifyDemandDrivers(analytics),
  };

  return patterns;
}

function analyzeWeeklyPattern(analytics: any[]) {
  const dayOfWeekData = analytics.reduce((acc, item) => {
    const dayOfWeek = new Date(item.date).getDay();
    if (!acc[dayOfWeek]) {
      acc[dayOfWeek] = { totalDemand: 0, count: 0 };
    }
    acc[dayOfWeek].totalDemand += item.demandScore;
    acc[dayOfWeek].count += 1;
    return acc;
  }, {});

  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekDays.map((day, index) => ({
    day,
    averageDemand: dayOfWeekData[index] ? dayOfWeekData[index].totalDemand / dayOfWeekData[index].count : 0,
  }));
}

function analyzeSeasonalTrend(analytics: any[]) {
  // Simple implementation - could be enhanced with proper seasonal decomposition
  const monthlyData = analytics.reduce((acc, item) => {
    const month = new Date(item.date).getMonth();
    if (!acc[month]) {
      acc[month] = { totalDemand: 0, count: 0 };
    }
    acc[month].totalDemand += item.demandScore;
    acc[month].count += 1;
    return acc;
  }, {});

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month, index) => ({
    month,
    averageDemand: monthlyData[index] ? monthlyData[index].totalDemand / monthlyData[index].count : 0,
  }));
}

function identifyDemandDrivers(analytics: any[]) {
  // Correlation analysis between different metrics
  const correlations = [];
  
  const demands = analytics.map(a => a.demandScore);
  const prices = analytics.map(a => a.averagePrice);
  const volumes = analytics.map(a => a.tradingVolume);
  const views = analytics.map(a => a.viewCount);

  correlations.push({
    factor: "Price",
    correlation: calculateCorrelation(demands, prices),
    interpretation: interpretCorrelation(calculateCorrelation(demands, prices)),
  });

  correlations.push({
    factor: "Trading Volume", 
    correlation: calculateCorrelation(demands, volumes),
    interpretation: interpretCorrelation(calculateCorrelation(demands, volumes)),
  });

  correlations.push({
    factor: "View Count",
    correlation: calculateCorrelation(demands, views),
    interpretation: interpretCorrelation(calculateCorrelation(demands, views)),
  });

  return correlations;
}

function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0;

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

  return denominator === 0 ? 0 : numerator / denominator;
}

function interpretCorrelation(correlation: number): string {
  const abs = Math.abs(correlation);
  if (abs > 0.7) return "Strong relationship";
  if (abs > 0.3) return "Moderate relationship";
  return "Weak relationship";
}

async function calculatePriceElasticity(assetType: string, pricePoints: number[]) {
  // Simplified price elasticity calculation
  const elasticity = [];
  
  for (const pricePoint of pricePoints) {
    // Get demand at this price point (simplified)
    const demandAtPrice = await estimateDemandAtPrice(assetType, pricePoint);
    elasticity.push({
      price: pricePoint,
      estimatedDemand: demandAtPrice,
    });
  }

  return {
    assetType,
    pricePoints: elasticity,
    elasticityCoefficient: calculateElasticityCoefficient(elasticity),
  };
}

async function estimateDemandAtPrice(assetType: string, price: number): Promise<number> {
  // This would typically use historical data and machine learning
  // For now, using a simple inverse relationship
  const basePrice = 100; // Assumed base price
  const baseDemand = 1.0; // Assumed base demand
  
  const priceRatio = price / basePrice;
  const estimatedDemand = baseDemand / Math.sqrt(priceRatio); // Square root relationship
  
  return Math.max(0, estimatedDemand);
}

function calculateElasticityCoefficient(elasticity: any[]): number {
  if (elasticity.length < 2) return 0;
  
  // Calculate percentage change in demand vs percentage change in price
  const first = elasticity[0];
  const last = elasticity[elasticity.length - 1];
  
  const priceChange = (last.price - first.price) / first.price;
  const demandChange = (last.estimatedDemand - first.estimatedDemand) / first.estimatedDemand;
  
  return priceChange === 0 ? 0 : demandChange / priceChange;
}

async function performCompetitiveAnalysis(assetId: string) {
  // Get asset details
  const asset = await prisma.digitalAssetOwnership.findFirst({
    where: { assetId },
  });

  if (!asset) {
    throw new Error("Asset not found");
  }

  // Find similar assets
  const similarAssets = await prisma.digitalAssetOwnership.findMany({
    where: {
      assetType: asset.assetType,
      id: { not: asset.id },
    },
    take: 10,
  });

  // Get pricing data for similar assets
  const competitorAnalysis = await Promise.all(
    similarAssets.map(async (similarAsset) => {
      const listings = await prisma.secondaryMarketListing.findMany({
        where: {
          assetOwnershipId: similarAsset.id,
          status: "active",
        },
      });

      const transactions = await prisma.secondaryMarketTransaction.findMany({
        where: {
          listing: {
            assetOwnershipId: similarAsset.id,
          },
          status: "completed",
        },
        take: 5,
        orderBy: { completedAt: "desc" },
      });

      return {
        assetId: similarAsset.assetId,
        currentPrice: listings[0]?.askingPrice || similarAsset.currentValuation,
        recentSales: transactions.map(t => t.salePrice),
        averageSalePrice: transactions.length > 0 
          ? transactions.reduce((sum, t) => sum + t.salePrice, 0) / transactions.length 
          : 0,
        listingCount: listings.length,
      };
    })
  );

  return {
    targetAsset: {
      assetId: asset.assetId,
      assetType: asset.assetType,
      currentValuation: asset.currentValuation,
    },
    competitors: competitorAnalysis,
    marketPosition: calculateMarketPosition(asset.currentValuation, competitorAnalysis),
    recommendations: generateCompetitiveRecommendations(asset.currentValuation, competitorAnalysis),
  };
}

function calculateMarketPosition(currentPrice: number, competitors: any[]) {
  if (competitors.length === 0) return "unknown";

  const competitorPrices = competitors.map(c => c.currentPrice).filter(p => p > 0);
  if (competitorPrices.length === 0) return "unknown";

  const averageCompetitorPrice = competitorPrices.reduce((sum, p) => sum + p, 0) / competitorPrices.length;
  const priceRatio = currentPrice / averageCompetitorPrice;

  if (priceRatio > 1.2) return "premium";
  if (priceRatio < 0.8) return "discount";
  return "competitive";
}

function generateCompetitiveRecommendations(currentPrice: number, competitors: any[]): string[] {
  const recommendations = [];
  
  if (competitors.length === 0) {
    recommendations.push("No direct competitors found - potential market leader position");
    return recommendations;
  }

  const competitorPrices = competitors.map(c => c.currentPrice).filter(p => p > 0);
  const averagePrice = competitorPrices.reduce((sum, p) => sum + p, 0) / competitorPrices.length;
  
  if (currentPrice > averagePrice * 1.2) {
    recommendations.push("Consider price reduction - currently priced above market average");
  } else if (currentPrice < averagePrice * 0.8) {
    recommendations.push("Opportunity for price increase - currently underpriced");
  } else {
    recommendations.push("Competitively priced - monitor market for changes");
  }

  const activeListing = competitors.filter(c => c.listingCount > 0).length;
  if (activeListing < competitors.length * 0.3) {
    recommendations.push("Low competition - good time to list for sale");
  }

  return recommendations;
}

function getPeriodDate(date: Date, period: string): Date {
  const result = new Date(date);
  
  switch (period) {
    case "hourly":
      result.setMinutes(0, 0, 0);
      break;
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
    default:
      result.setHours(0, 0, 0, 0);
  }
  
  return result;
}

