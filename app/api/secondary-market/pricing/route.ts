

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ruleType = searchParams.get("ruleType");
    const status = searchParams.get("status");
    const assetType = searchParams.get("assetType");
    const assetId = searchParams.get("assetId");
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    const whereClause: any = {};
    if (ruleType) whereClause.ruleType = ruleType;
    if (status) whereClause.status = status;
    if (assetType) whereClause.assetTypes = { has: assetType };
    if (category) whereClause.categories = { has: category };

    const pricingRules = await prisma.dynamicPricingRule.findMany({
      where: whereClause,
      orderBy: [
        { priority: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      skip: offset,
    });

    // If assetId is provided, calculate pricing for that specific asset
    if (assetId) {
      const assetPricing = await calculateAssetPricing(assetId, assetType);
      return NextResponse.json({
        pricingRules,
        assetPricing,
        pagination: {
          limit,
          offset,
          total: await prisma.dynamicPricingRule.count({ where: whereClause }),
        },
      });
    }

    return NextResponse.json({
      pricingRules,
      pagination: {
        limit,
        offset,
        total: await prisma.dynamicPricingRule.count({ where: whereClause }),
      },
    });
  } catch (error) {
    console.error("Fetch pricing rules error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing rules" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "create_rule":
        const {
          name,
          description,
          ruleType,
          conditions = {},
          actions = {},
          triggers = [],
          assetTypes = [],
          categories = [],
          priceRange = {},
          basePrice,
          minPrice,
          maxPrice,
          adjustmentFactor = 1.0,
          activeHours = {},
          seasonality = {},
          priority = 1,
        } = body;

        const pricingRule = await prisma.dynamicPricingRule.create({
          data: {
            name,
            description,
            ruleType,
            conditions,
            actions,
            triggers,
            assetTypes,
            categories,
            priceRange,
            basePrice,
            minPrice,
            maxPrice,
            adjustmentFactor,
            activeHours,
            seasonality,
            priority,
            tenantId: body.tenantId,
          },
        });

        return NextResponse.json({ pricingRule });

      case "update_rule":
        const { ruleId, updateData } = body;
        
        const updatedRule = await prisma.dynamicPricingRule.update({
          where: { id: ruleId },
          data: updateData,
        });

        return NextResponse.json({ pricingRule: updatedRule });

      case "calculate_price":
        const { assetType: calcAssetType, assetId: calcAssetId, basePrice: calcBasePrice } = body;
        
        const calculatedPrice = await calculateDynamicPrice(
          calcAssetType,
          calcAssetId,
          calcBasePrice
        );

        return NextResponse.json({ calculatedPrice });

      case "apply_pricing":
        const { listingIds, ruleId: applyRuleId } = body;
        
        const rule = await prisma.dynamicPricingRule.findUnique({
          where: { id: applyRuleId },
        });

        if (!rule) {
          return NextResponse.json(
            { error: "Pricing rule not found" },
            { status: 404 }
          );
        }

        const appliedListings = await applyPricingToListings(listingIds, rule);
        
        // Update rule usage count
        await prisma.dynamicPricingRule.update({
          where: { id: applyRuleId },
          data: {
            usageCount: { increment: appliedListings.length },
            lastTriggered: new Date(),
          },
        });

        return NextResponse.json({ appliedListings });

      case "analyze_market":
        const { assetType: analyzeAssetType, category: analyzeCategory } = body;
        
        const marketAnalysis = await analyzeMarketPricing(analyzeAssetType, analyzeCategory);
        return NextResponse.json({ marketAnalysis });

      case "optimize_pricing":
        const { assetId: optimizeAssetId, currentPrice } = body;
        
        const optimizedPricing = await optimizePricing(optimizeAssetId, currentPrice);
        return NextResponse.json({ optimizedPricing });

      case "price_recommendation":
        const { assetType: recAssetType, assetData, targetMargin = 0.2 } = body;
        
        const recommendation = await generatePriceRecommendation(
          recAssetType,
          assetData,
          targetMargin
        );

        return NextResponse.json({ recommendation });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Pricing operation error:", error);
    return NextResponse.json(
      { error: "Failed to perform pricing operation" },
      { status: 500 }
    );
  }
}

async function calculateAssetPricing(assetId: string, assetType: string) {
  try {
    // Get current market data
    const marketData = await prisma.marketDemandAnalytics.findFirst({
      where: {
        assetId,
        assetType,
        period: "daily",
      },
      orderBy: { date: "desc" },
    });

    // Get asset ownership details
    const ownership = await prisma.digitalAssetOwnership.findFirst({
      where: { assetId },
    });

    // Get recent transactions
    const recentTransactions = await prisma.secondaryMarketTransaction.findMany({
      where: {
        listing: {
          assetOwnership: { assetId },
        },
        status: "completed",
        completedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      select: { salePrice: true, completedAt: true },
      orderBy: { completedAt: "desc" },
      take: 10,
    });

    const basePrice = ownership?.originalPrice ?? 0;
    const currentValuation = ownership?.currentValuation ?? basePrice;
    const averagePrice = marketData?.averagePrice ?? basePrice;
    const priceTarget = marketData?.priceTarget ?? averagePrice;

    // Calculate price factors
    const demandFactor = marketData?.demandScore ?? 1.0;
    const volatilityFactor = 1 - (marketData?.priceVolatility ?? 0);
    const trendFactor = getTrendFactor(marketData?.trendDirection ?? "stable");

    // Calculate recommended price range
    const minRecommendedPrice = Math.max(
      basePrice * 0.7, // Never go below 70% of original
      averagePrice * 0.8 // Or 80% of market average
    );

    const maxRecommendedPrice = Math.min(
      basePrice * 2.0, // Never exceed 200% of original
      averagePrice * 1.5 // Or 150% of market average
    );

    const recommendedPrice = calculateOptimalPrice(
      basePrice,
      averagePrice,
      demandFactor,
      volatilityFactor,
      trendFactor
    );

    return {
      assetId,
      assetType,
      basePrice,
      currentValuation,
      marketData: {
        averagePrice,
        priceTarget,
        demandScore: demandFactor,
        priceVolatility: marketData?.priceVolatility ?? 0,
        trendDirection: marketData?.trendDirection ?? "stable",
      },
      pricing: {
        recommendedPrice: Math.max(minRecommendedPrice, Math.min(maxRecommendedPrice, recommendedPrice)),
        minPrice: minRecommendedPrice,
        maxPrice: maxRecommendedPrice,
        priceRange: {
          conservative: recommendedPrice * 0.9,
          aggressive: recommendedPrice * 1.1,
          premium: recommendedPrice * 1.2,
        },
      },
      recentSales: recentTransactions,
      confidence: calculatePriceConfidence(marketData, recentTransactions.length),
    };
  } catch (error) {
    console.error("Calculate asset pricing error:", error);
    throw error;
  }
}

async function calculateDynamicPrice(assetType: string, assetId: string, basePrice: number) {
  try {
    // Get applicable pricing rules
    const applicableRules = await prisma.dynamicPricingRule.findMany({
      where: {
        status: "active",
        assetTypes: { has: assetType },
      },
      orderBy: { priority: "desc" },
    });

    let finalPrice = basePrice;
    const appliedRules = [];

    for (const rule of applicableRules) {
      const adjustment = await evaluatePricingRule(rule, assetId, finalPrice);
      if (adjustment.shouldApply) {
        finalPrice = adjustment.newPrice;
        appliedRules.push({
          ruleId: rule.id,
          ruleName: rule.name,
          adjustment: adjustment.adjustmentAmount,
          reason: adjustment.reason,
        });
      }
    }

    // Apply min/max constraints
    const minPrice = Math.min(...applicableRules.map(r => r.minPrice ?? finalPrice));
    const maxPrice = Math.max(...applicableRules.map(r => r.maxPrice ?? finalPrice));
    
    finalPrice = Math.max(minPrice, Math.min(maxPrice, finalPrice));

    return {
      originalPrice: basePrice,
      adjustedPrice: finalPrice,
      adjustment: finalPrice - basePrice,
      adjustmentPercent: ((finalPrice - basePrice) / basePrice) * 100,
      appliedRules,
      priceConstraints: { minPrice, maxPrice },
    };
  } catch (error) {
    console.error("Calculate dynamic price error:", error);
    throw error;
  }
}

async function evaluatePricingRule(rule: any, assetId: string, currentPrice: number) {
  try {
    const { conditions, actions, adjustmentFactor } = rule;
    
    // Check time-based conditions
    if (rule.activeHours && Object.keys(rule.activeHours).length > 0) {
      const currentHour = new Date().getHours();
      const activeStart = rule.activeHours.start ?? 0;
      const activeEnd = rule.activeHours.end ?? 23;
      
      if (currentHour < activeStart || currentHour > activeEnd) {
        return { shouldApply: false };
      }
    }

    // Check demand-based conditions
    if (rule.ruleType === "demand_based") {
      const demandData = await prisma.marketDemandAnalytics.findFirst({
        where: { assetId, period: "daily" },
        orderBy: { date: "desc" },
      });

      const demandScore = demandData?.demandScore ?? 0;
      const demandThreshold = conditions.demandThreshold ?? 0.7;

      if (demandScore > demandThreshold) {
        const priceIncrease = currentPrice * (conditions.demandMultiplier ?? 0.1);
        return {
          shouldApply: true,
          newPrice: currentPrice + priceIncrease,
          adjustmentAmount: priceIncrease,
          reason: `High demand (${demandScore.toFixed(2)})`,
        };
      }
    }

    // Check inventory-based conditions
    if (rule.ruleType === "inventory_based") {
      const similarListings = await prisma.secondaryMarketListing.count({
        where: {
          assetOwnership: { assetType: rule.assetTypes[0] },
          status: "active",
        },
      });

      const inventoryThreshold = conditions.inventoryThreshold ?? 10;
      
      if (similarListings < inventoryThreshold) {
        const priceIncrease = currentPrice * (conditions.scarcityMultiplier ?? 0.15);
        return {
          shouldApply: true,
          newPrice: currentPrice + priceIncrease,
          adjustmentAmount: priceIncrease,
          reason: `Low inventory (${similarListings} listings)`,
        };
      }
    }

    // Check competitor-based conditions
    if (rule.ruleType === "competitor_based") {
      const competitorAvg = await getCompetitorAveragePrice(assetId);
      const competitivenessThreshold = conditions.competitivenessThreshold ?? 0.05;
      
      if (currentPrice > competitorAvg * (1 + competitivenessThreshold)) {
        const priceDecrease = (currentPrice - competitorAvg) * 0.5;
        return {
          shouldApply: true,
          newPrice: currentPrice - priceDecrease,
          adjustmentAmount: -priceDecrease,
          reason: `Competitive adjustment (market avg: ${competitorAvg})`,
        };
      }
    }

    return { shouldApply: false };
  } catch (error) {
    console.error("Evaluate pricing rule error:", error);
    return { shouldApply: false };
  }
}

async function applyPricingToListings(listingIds: string[], rule: any) {
  const appliedListings = [];

  for (const listingId of listingIds) {
    try {
      const listing = await prisma.secondaryMarketListing.findUnique({
        where: { id: listingId },
        include: { assetOwnership: true },
      });

      if (!listing) continue;

      const priceAdjustment = await calculateDynamicPrice(
        listing.assetOwnership.assetType,
        listing.assetOwnership.assetId,
        listing.askingPrice
      );

      const updatedListing = await prisma.secondaryMarketListing.update({
        where: { id: listingId },
        data: {
          askingPrice: priceAdjustment.adjustedPrice,
          priceHistory: [
            ...listing.priceHistory,
            {
              price: priceAdjustment.adjustedPrice,
              previousPrice: listing.askingPrice,
              timestamp: new Date(),
              reason: `Dynamic pricing rule: ${rule.name}`,
              ruleId: rule.id,
            },
          ],
        },
      });

      appliedListings.push(updatedListing);
    } catch (error) {
      console.error(`Failed to apply pricing to listing ${listingId}:`, error);
    }
  }

  return appliedListings;
}

async function analyzeMarketPricing(assetType: string, category?: string) {
  const whereClause: any = { assetType };
  if (category) whereClause.category = category;

  const marketData = await prisma.marketDemandAnalytics.findMany({
    where: {
      ...whereClause,
      period: "daily",
      date: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      },
    },
    orderBy: { date: "desc" },
  });

  const priceData = marketData.map(d => d.averagePrice).filter(p => p > 0);
  const demandData = marketData.map(d => d.demandScore);

  return {
    assetType,
    category,
    priceAnalysis: {
      averagePrice: calculateAverage(priceData),
      medianPrice: calculateMedian(priceData),
      priceRange: {
        min: Math.min(...priceData),
        max: Math.max(...priceData),
      },
      priceVolatility: calculateStandardDeviation(priceData),
      priceTrend: calculateTrend(priceData),
    },
    demandAnalysis: {
      averageDemand: calculateAverage(demandData),
      demandTrend: calculateTrend(demandData),
      demandVolatility: calculateStandardDeviation(demandData),
    },
    marketHealth: {
      liquidityScore: marketData.length > 0 ? marketData[0].liquidity : 0,
      tradingVolume: marketData.reduce((sum, d) => sum + d.tradingVolume, 0),
      marketSentiment: getMostCommonSentiment(marketData),
    },
    recommendations: generateMarketRecommendations(marketData),
  };
}

async function optimizePricing(assetId: string, currentPrice: number) {
  const assetPricing = await calculateAssetPricing(assetId, "widget"); // Default to widget
  const marketAnalysis = await analyzeMarketPricing(assetPricing.assetType);

  const optimizationFactors = {
    marketPosition: currentPrice / marketAnalysis.priceAnalysis.averagePrice,
    demandLevel: assetPricing.marketData.demandScore,
    volatility: marketAnalysis.priceAnalysis.priceVolatility,
    trend: assetPricing.marketData.trendDirection,
  };

  const optimizations = [];

  // Price positioning optimization
  if (optimizationFactors.marketPosition > 1.2) {
    optimizations.push({
      type: "price_reduction",
      recommendation: currentPrice * 0.9,
      reason: "Price is 20% above market average",
      impact: "Higher conversion rate",
    });
  } else if (optimizationFactors.marketPosition < 0.8) {
    optimizations.push({
      type: "price_increase",
      recommendation: currentPrice * 1.1,
      reason: "Price is 20% below market average",
      impact: "Higher revenue per sale",
    });
  }

  // Demand-based optimization
  if (optimizationFactors.demandLevel > 0.8) {
    optimizations.push({
      type: "premium_pricing",
      recommendation: currentPrice * 1.15,
      reason: "High demand detected",
      impact: "Maximize revenue during peak demand",
    });
  }

  return {
    currentPrice,
    assetId,
    optimizationFactors,
    optimizations,
    recommendedPrice: optimizations.length > 0 
      ? optimizations[0].recommendation 
      : currentPrice,
    confidence: calculateOptimizationConfidence(optimizationFactors),
  };
}

async function generatePriceRecommendation(assetType: string, assetData: any, targetMargin: number) {
  const category = assetData.category;
  const marketAnalysis = await analyzeMarketPricing(assetType, category);

  const basePricing = {
    entry: marketAnalysis.priceAnalysis.averagePrice * 0.8,
    market: marketAnalysis.priceAnalysis.averagePrice,
    premium: marketAnalysis.priceAnalysis.averagePrice * 1.2,
  };

  const recommendations = {
    conservative: basePricing.entry,
    balanced: basePricing.market,
    aggressive: basePricing.premium,
    targetMargin: basePricing.market * (1 + targetMargin),
  };

  return {
    assetType,
    category,
    targetMargin,
    marketContext: marketAnalysis,
    basePricing,
    recommendations,
    suggestedStrategy: getSuggestedPricingStrategy(marketAnalysis),
  };
}

// Helper functions
function getTrendFactor(trendDirection: string): number {
  switch (trendDirection) {
    case "rising": return 1.1;
    case "falling": return 0.9;
    case "volatile": return 1.05;
    default: return 1.0;
  }
}

function calculateOptimalPrice(base: number, market: number, demand: number, volatility: number, trend: number): number {
  const demandWeight = 0.3;
  const marketWeight = 0.4;
  const baseWeight = 0.2;
  const trendWeight = 0.1;

  return (
    base * baseWeight +
    market * marketWeight +
    (market * demand) * demandWeight +
    (market * trend) * trendWeight
  ) * volatility;
}

function calculatePriceConfidence(marketData: any, transactionCount: number): number {
  const dataQuality = marketData ? 0.7 : 0.3;
  const transactionQuality = Math.min(transactionCount / 10, 1) * 0.3;
  return Math.min(dataQuality + transactionQuality, 1.0);
}

function calculateAverage(numbers: number[]): number {
  return numbers.length > 0 ? numbers.reduce((a, b) => a + b, 0) / numbers.length : 0;
}

function calculateMedian(numbers: number[]): number {
  const sorted = numbers.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calculateStandardDeviation(numbers: number[]): number {
  const avg = calculateAverage(numbers);
  const squareDiffs = numbers.map(value => Math.pow(value - avg, 2));
  return Math.sqrt(calculateAverage(squareDiffs));
}

function calculateTrend(numbers: number[]): string {
  if (numbers.length < 2) return "stable";
  const recent = numbers.slice(0, Math.floor(numbers.length / 2));
  const older = numbers.slice(Math.floor(numbers.length / 2));
  const recentAvg = calculateAverage(recent);
  const olderAvg = calculateAverage(older);
  const change = (recentAvg - olderAvg) / olderAvg;
  
  if (change > 0.05) return "rising";
  if (change < -0.05) return "falling";
  return "stable";
}

function getMostCommonSentiment(marketData: any[]): string {
  const sentiments = marketData.map(d => d.marketSentiment).filter(Boolean);
  const counts = sentiments.reduce((acc, sentiment) => {
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, "neutral");
}

function generateMarketRecommendations(marketData: any[]): string[] {
  const recommendations = [];
  const latestData = marketData[0];
  
  if (latestData?.demandScore > 0.8) {
    recommendations.push("High demand detected - consider premium pricing");
  }
  if (latestData?.priceVolatility > 0.3) {
    recommendations.push("High price volatility - monitor closely");
  }
  if (latestData?.liquidity < 0.5) {
    recommendations.push("Low market liquidity - consider competitive pricing");
  }
  
  return recommendations;
}

function calculateOptimizationConfidence(factors: any): number {
  const weights = {
    marketPosition: 0.3,
    demandLevel: 0.3,
    volatility: 0.2,
    trend: 0.2,
  };
  
  let confidence = 0;
  confidence += Math.min(Math.abs(1 - factors.marketPosition), 1) * weights.marketPosition;
  confidence += factors.demandLevel * weights.demandLevel;
  confidence += (1 - Math.min(factors.volatility, 1)) * weights.volatility;
  confidence += (factors.trend === "rising" ? 0.8 : factors.trend === "stable" ? 0.6 : 0.4) * weights.trend;
  
  return Math.min(confidence, 1.0);
}

function getSuggestedPricingStrategy(marketAnalysis: any): string {
  const { demandAnalysis, priceAnalysis, marketHealth } = marketAnalysis;
  
  if (demandAnalysis.averageDemand > 0.8 && marketHealth.liquidityScore > 0.7) {
    return "aggressive";
  } else if (priceAnalysis.priceVolatility > 0.3) {
    return "conservative";
  } else {
    return "balanced";
  }
}

async function getCompetitorAveragePrice(assetId: string): Promise<number> {
  const competitorListings = await prisma.secondaryMarketListing.findMany({
    where: {
      assetOwnership: { assetId },
      status: "active",
    },
    select: { askingPrice: true },
  });
  
  if (competitorListings.length === 0) return 0;
  
  const prices = competitorListings.map(l => l.askingPrice);
  return calculateAverage(prices);
}

