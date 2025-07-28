
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
    const trendType = searchParams.get("trendType");
    const category = searchParams.get("category");
    const metricName = searchParams.get("metricName");
    const timeRange = searchParams.get("timeRange") ?? "30";
    const limit = parseInt(searchParams.get("limit") ?? "20");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const endDate = new Date();
    const startDate = new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000);

    const whereClause: any = {
      tenantId,
      analysisStart: { gte: startDate },
      analysisEnd: { lte: endDate },
      ...(trendType && { trendType }),
      ...(category && { category }),
      ...(metricName && { metricName })
    };

    const [trendAnalyses, trendStats, correlationData] = await Promise.all([
      prisma.trendAnalysis.findMany({
        where: whereClause,
        orderBy: { strength: "desc" },
        take: limit
      }),
      prisma.trendAnalysis.groupBy({
        by: ["trendType", "category"],
        where: { tenantId },
        _count: { trendType: true },
        _avg: {
          strength: true,
          rSquared: true
        }
      }),
      calculateTrendCorrelations(tenantId, category)
    ]);

    // Calculate trend momentum
    const trendMomentum = calculateTrendMomentum(trendAnalyses);
    
    // Get market trends
    const marketTrends = await getMarketTrends(tenantId);
    
    // Identify emerging trends
    const emergingTrends = identifyEmergingTrends(trendAnalyses);

    return NextResponse.json({
      trendAnalyses,
      trendStats,
      correlationData,
      trendMomentum,
      marketTrends,
      emergingTrends,
      insights: {
        totalTrends: trendAnalyses.length,
        strongTrends: trendAnalyses.filter(t => t.strength > 0.7).length,
        upwardTrends: trendAnalyses.filter(t => t.direction === "upward").length,
        significantTrends: trendAnalyses.filter(t => t.pValue && t.pValue < 0.05).length,
        trendAcceleration: calculateTrendAcceleration(trendAnalyses),
        forecastReliability: calculateForecastReliability(trendAnalyses)
      }
    });

  } catch (error) {
    console.error("Error fetching trend analysis:", error);
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
      case "analyze_trend":
        return await analyzeTrend(data);
        
      case "forecast_trend":
        return await forecastTrend(data);
        
      case "compare_trends":
        return await compareTrends(data);
        
      case "detect_breakpoints":
        return await detectBreakpoints(data);
        
      case "seasonal_decomposition":
        return await seasonalDecomposition(data);
        
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("Error processing trend analysis request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function analyzeTrend(data: any) {
  const {
    tenantId,
    metricName,
    category,
    timeSeriesData,
    analysisType = "comprehensive"
  } = data;

  if (!tenantId || !metricName || !timeSeriesData || !Array.isArray(timeSeriesData)) {
    throw new Error("Missing required fields");
  }

  // Perform trend analysis
  const trendAnalysis = await performTrendAnalysis(timeSeriesData, metricName, category);
  
  // Detect seasonal patterns
  const seasonalAnalysis = await detectSeasonalPatterns(timeSeriesData);
  
  // Identify anomalies
  const anomalies = await detectTrendAnomalies(timeSeriesData);
  
  // Calculate statistical significance
  const statisticalTests = await performStatisticalTests(timeSeriesData);

  // Save trend analysis
  const savedAnalysis = await prisma.trendAnalysis.create({
    data: {
      tenantId,
      trendType: trendAnalysis.trendType,
      category: category || "general",
      metricName,
      strength: trendAnalysis.strength,
      direction: trendAnalysis.direction,
      duration: trendAnalysis.duration,
      acceleration: trendAnalysis.acceleration,
      startValue: trendAnalysis.startValue,
      currentValue: trendAnalysis.currentValue,
      changePercent: trendAnalysis.changePercent,
      slope: trendAnalysis.slope,
      rSquared: trendAnalysis.rSquared,
      pValue: statisticalTests.pValue,
      analysisStart: new Date(timeSeriesData[0].timestamp),
      analysisEnd: new Date(timeSeriesData[timeSeriesData.length - 1].timestamp),
      trendStart: trendAnalysis.trendStart,
      projectedEnd: trendAnalysis.projectedEnd,
      seasonalComponent: seasonalAnalysis.seasonalComponent,
      weeklyPattern: seasonalAnalysis.weeklyPattern,
      monthlyPattern: seasonalAnalysis.monthlyPattern,
      correlatedEvents: trendAnalysis.correlatedEvents,
      likelyCauses: trendAnalysis.likelyCauses,
      externalFactors: trendAnalysis.externalFactors,
      shortTermForecast: trendAnalysis.shortTermForecast,
      longTermForecast: trendAnalysis.longTermForecast,
      confidenceInterval: trendAnalysis.confidenceInterval,
      alertThreshold: trendAnalysis.alertThreshold,
      alertTriggered: trendAnalysis.alertTriggered,
      alertLevel: trendAnalysis.alertLevel
    }
  });

  return {
    success: true,
    analysis: savedAnalysis,
    trendAnalysis,
    seasonalAnalysis,
    anomalies,
    statisticalTests,
    recommendations: generateTrendRecommendations(trendAnalysis, seasonalAnalysis),
    forecast: generateTrendForecast(trendAnalysis, timeSeriesData)
  };
}

async function forecastTrend(data: any) {
  const {
    tenantId,
    metricName,
    forecastHorizon = 30,
    confidenceLevel = 0.95,
    includeSeasonality = true,
    includeExternalFactors = false
  } = data;

  if (!tenantId || !metricName) {
    throw new Error("Missing required fields");
  }

  // Get historical trend data
  const historicalTrends = await prisma.trendAnalysis.findMany({
    where: {
      tenantId,
      metricName
    },
    orderBy: { analysisEnd: "desc" },
    take: 10
  });

  if (historicalTrends.length === 0) {
    throw new Error("No historical trend data found");
  }

  // Generate forecast
  const forecast = await generateAdvancedForecast({
    historicalTrends,
    forecastHorizon,
    confidenceLevel,
    includeSeasonality,
    includeExternalFactors
  });

  return {
    success: true,
    forecast,
    methodology: {
      model: forecast.model,
      parameters: forecast.parameters,
      assumptions: forecast.assumptions,
      limitations: forecast.limitations
    },
    scenarios: {
      optimistic: forecast.optimisticScenario,
      realistic: forecast.realisticScenario,
      pessimistic: forecast.pessimisticScenario
    },
    riskFactors: identifyForecastRisks(forecast, historicalTrends)
  };
}

async function compareTrends(data: any) {
  const {
    tenantId,
    metrics,
    timeRange = 90,
    comparisonType = "correlation"
  } = data;

  if (!tenantId || !metrics || !Array.isArray(metrics) || metrics.length < 2) {
    throw new Error("At least two metrics required for comparison");
  }

  const comparisons = [];

  // Compare each pair of metrics
  for (let i = 0; i < metrics.length; i++) {
    for (let j = i + 1; j < metrics.length; j++) {
      const metric1 = metrics[i];
      const metric2 = metrics[j];
      
      const comparison = await compareTwoTrends(tenantId, metric1, metric2, timeRange, comparisonType);
      comparisons.push(comparison);
    }
  }

  // Identify trend clusters
  const trendClusters = identifyTrendClusters(comparisons);
  
  // Calculate cross-correlations
  const crossCorrelations = calculateCrossCorrelations(comparisons);

  return {
    success: true,
    comparisons,
    trendClusters,
    crossCorrelations,
    insights: {
      strongestCorrelation: findStrongestCorrelation(comparisons),
      leadingIndicators: identifyLeadingIndicators(comparisons),
      commonPatterns: identifyCommonPatterns(comparisons)
    }
  };
}

async function detectBreakpoints(data: any) {
  const {
    tenantId,
    metricName,
    timeSeriesData,
    sensitivity = "medium"
  } = data;

  if (!tenantId || !metricName || !timeSeriesData) {
    throw new Error("Missing required fields");
  }

  // Detect structural breaks in the time series
  const breakpoints = await detectStructuralBreaks(timeSeriesData, sensitivity);
  
  // Analyze pre and post breakpoint trends
  const segmentAnalysis = await analyzeSegments(timeSeriesData, breakpoints);
  
  // Identify breakpoint causes
  const breakpointCauses = await identifyBreakpointCauses(breakpoints, tenantId);

  return {
    success: true,
    breakpoints,
    segmentAnalysis,
    breakpointCauses,
    insights: {
      totalBreakpoints: breakpoints.length,
      significantBreakpoints: breakpoints.filter(bp => bp.significance === "high").length,
      trendStability: calculateTrendStability(segmentAnalysis),
      regimeChanges: identifyRegimeChanges(segmentAnalysis)
    }
  };
}

async function seasonalDecomposition(data: any) {
  const {
    tenantId,
    metricName,
    timeSeriesData,
    decompositionMethod = "additive",
    seasonalPeriod = "auto"
  } = data;

  if (!tenantId || !metricName || !timeSeriesData) {
    throw new Error("Missing required fields");
  }

  // Perform seasonal decomposition
  const decomposition = await performSeasonalDecomposition(
    timeSeriesData,
    decompositionMethod,
    seasonalPeriod
  );
  
  // Analyze each component
  const componentAnalysis = await analyzeDecompositionComponents(decomposition);
  
  // Generate seasonal insights
  const seasonalInsights = await generateSeasonalInsights(decomposition, componentAnalysis);

  return {
    success: true,
    decomposition,
    componentAnalysis,
    seasonalInsights,
    recommendations: generateSeasonalRecommendations(decomposition, seasonalInsights)
  };
}

// Helper functions
async function performTrendAnalysis(timeSeriesData: any[], metricName: string, category?: string) {
  const values = timeSeriesData.map(d => d.value);
  const timestamps = timeSeriesData.map(d => new Date(d.timestamp).getTime());
  
  // Calculate trend statistics
  const trend = calculateTrendStatistics(values, timestamps);
  const changePoints = detectChangePoints(values);
  const seasonality = detectSeasonality(timeSeriesData);

  return {
    trendType: classifyTrendType(trend.slope, trend.acceleration),
    strength: Math.min(Math.abs(trend.rSquared), 1.0),
    direction: trend.slope > 0 ? "upward" : trend.slope < 0 ? "downward" : "stable",
    duration: timeSeriesData.length,
    acceleration: trend.acceleration,
    startValue: values[0],
    currentValue: values[values.length - 1],
    changePercent: ((values[values.length - 1] - values[0]) / values[0]) * 100,
    slope: trend.slope,
    rSquared: trend.rSquared,
    trendStart: changePoints.length > 0 ? new Date(timestamps[changePoints[0]]) : new Date(timestamps[0]),
    projectedEnd: projectTrendEnd(trend, timestamps),
    correlatedEvents: await findCorrelatedEvents(timeSeriesData, category),
    likelyCauses: identifyLikelyCauses(trend, changePoints),
    externalFactors: await identifyExternalFactors(timeSeriesData, category),
    shortTermForecast: generateShortTermForecast(trend, values, 7),
    longTermForecast: generateLongTermForecast(trend, values, 30),
    confidenceInterval: calculateConfidenceInterval(trend, values),
    alertThreshold: calculateAlertThreshold(values, trend),
    alertTriggered: shouldTriggerAlert(trend, values),
    alertLevel: determineAlertLevel(trend, values)
  };
}

async function detectSeasonalPatterns(timeSeriesData: any[]) {
  const values = timeSeriesData.map(d => d.value);
  const timestamps = timeSeriesData.map(d => new Date(d.timestamp));
  
  // Detect weekly patterns
  const weeklyPattern = detectWeeklyPattern(values, timestamps);
  
  // Detect monthly patterns
  const monthlyPattern = detectMonthlyPattern(values, timestamps);
  
  // Calculate seasonal component strength
  const seasonalComponent = calculateSeasonalComponent(weeklyPattern, monthlyPattern);

  return {
    seasonalComponent,
    weeklyPattern,
    monthlyPattern,
    seasonalStrength: Math.max(weeklyPattern.strength, monthlyPattern.strength),
    dominantPeriod: weeklyPattern.strength > monthlyPattern.strength ? "weekly" : "monthly"
  };
}

async function detectTrendAnomalies(timeSeriesData: any[]) {
  const values = timeSeriesData.map(d => d.value);
  const timestamps = timeSeriesData.map(d => d.timestamp);
  
  // Statistical anomaly detection
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
  
  const anomalies = [];
  const threshold = 2.5 * stdDev; // 2.5 sigma threshold
  
  for (let i = 0; i < values.length; i++) {
    if (Math.abs(values[i] - mean) > threshold) {
      anomalies.push({
        timestamp: timestamps[i],
        value: values[i],
        severity: Math.abs(values[i] - mean) > 3 * stdDev ? "high" : "medium",
        deviation: Math.abs(values[i] - mean) / stdDev,
        type: values[i] > mean ? "positive" : "negative"
      });
    }
  }

  return anomalies;
}

async function performStatisticalTests(timeSeriesData: any[]) {
  const values = timeSeriesData.map(d => d.value);
  
  // Perform various statistical tests
  const trendTest = performMannKendallTest(values);
  const stationarityTest = performAugmentedDickeyFullerTest(values);
  const normalityTest = performShapiroWilkTest(values);

  return {
    trendSignificance: trendTest.significant,
    pValue: trendTest.pValue,
    stationarity: stationarityTest.stationary,
    normality: normalityTest.normal,
    testStatistics: {
      mannKendall: trendTest.statistic,
      adf: stationarityTest.statistic,
      shapiroWilk: normalityTest.statistic
    }
  };
}

function calculateTrendMomentum(trendAnalyses: any[]) {
  if (trendAnalyses.length === 0) return 0;
  
  const recentTrends = trendAnalyses.slice(0, 5);
  const momentum = recentTrends.reduce((sum, trend) => {
    const direction = trend.direction === "upward" ? 1 : trend.direction === "downward" ? -1 : 0;
    return sum + (direction * trend.strength * trend.acceleration);
  }, 0) / recentTrends.length;

  return momentum;
}

async function getMarketTrends(tenantId: string) {
  // Simulate market trend data
  return {
    industry: {
      growth: Math.random() * 0.2 + 0.05, // 5-25% growth
      volatility: Math.random() * 0.3 + 0.1, // 10-40% volatility
      competitionLevel: Math.random() * 100 + 50 // 50-150 competition index
    },
    technology: {
      adoptionRate: Math.random() * 0.4 + 0.1, // 10-50% adoption
      innovationIndex: Math.random() * 100 + 60, // 60-160 innovation index
      disruption: Math.random() > 0.8 ? "high" : Math.random() > 0.6 ? "medium" : "low"
    },
    consumer: {
      sentiment: Math.random() * 100 + 40, // 40-140 sentiment index
      spendingTrend: Math.random() > 0.5 ? "increasing" : "decreasing",
      behaviorShift: Math.random() > 0.7 ? "significant" : "minimal"
    }
  };
}

function identifyEmergingTrends(trendAnalyses: any[]) {
  return trendAnalyses
    .filter(trend => 
      trend.duration < 30 && // Recent trends
      trend.strength > 0.6 && // Strong trends
      trend.acceleration > 0 && // Accelerating trends
      trend.direction === "upward" // Growing trends
    )
    .map(trend => ({
      metricName: trend.metricName,
      category: trend.category,
      strength: trend.strength,
      acceleration: trend.acceleration,
      emergenceScore: calculateEmergenceScore(trend),
      potentialImpact: assessPotentialImpact(trend)
    }))
    .sort((a, b) => b.emergenceScore - a.emergenceScore)
    .slice(0, 5);
}

function calculateTrendAcceleration(trendAnalyses: any[]) {
  const accelerations = trendAnalyses.map(t => t.acceleration);
  return accelerations.reduce((sum, acc) => sum + acc, 0) / accelerations.length;
}

function calculateForecastReliability(trendAnalyses: any[]) {
  const reliabilityScores = trendAnalyses.map(trend => {
    const rSquaredWeight = trend.rSquared * 0.4;
    const strengthWeight = trend.strength * 0.3;
    const durationWeight = Math.min(trend.duration / 90, 1) * 0.3; // More data = more reliable
    
    return rSquaredWeight + strengthWeight + durationWeight;
  });

  return reliabilityScores.reduce((sum, score) => sum + score, 0) / reliabilityScores.length;
}

async function calculateTrendCorrelations(tenantId: string, category?: string) {
  const trends = await prisma.trendAnalysis.findMany({
    where: {
      tenantId,
      ...(category && { category })
    },
    select: {
      metricName: true,
      slope: true,
      strength: true,
      direction: true
    }
  });

  const correlations = [];
  
  for (let i = 0; i < trends.length; i++) {
    for (let j = i + 1; j < trends.length; j++) {
      const correlation = calculateCorrelation(
        [trends[i].slope, trends[i].strength],
        [trends[j].slope, trends[j].strength]
      );
      
      correlations.push({
        metric1: trends[i].metricName,
        metric2: trends[j].metricName,
        correlation,
        strength: Math.abs(correlation) > 0.7 ? "strong" : Math.abs(correlation) > 0.4 ? "medium" : "weak"
      });
    }
  }

  return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation)).slice(0, 10);
}

// Additional helper functions
function calculateTrendStatistics(values: number[], timestamps: number[]) {
  const n = values.length;
  const x = timestamps.map((t, i) => i); // Use index for simplicity
  const y = values;
  
  // Linear regression
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;
  
  const numerator = x.reduce((sum, val, i) => sum + (val - xMean) * (y[i] - yMean), 0);
  const denominator = x.reduce((sum, val) => sum + Math.pow(val - xMean, 2), 0);
  
  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = yMean - slope * xMean;
  
  // R-squared
  const yPred = x.map(val => slope * val + intercept);
  const ssRes = y.reduce((sum, val, i) => sum + Math.pow(val - yPred[i], 2), 0);
  const ssTot = y.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
  const rSquared = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;
  
  // Acceleration (second derivative approximation)
  const acceleration = n > 2 ? (values[n-1] - 2*values[n-2] + values[n-3]) : 0;

  return { slope, intercept, rSquared, acceleration };
}

function detectChangePoints(values: number[]) {
  const changePoints = [];
  const threshold = 0.2; // 20% change threshold
  
  for (let i = 1; i < values.length; i++) {
    const change = Math.abs((values[i] - values[i-1]) / values[i-1]);
    if (change > threshold) {
      changePoints.push(i);
    }
  }
  
  return changePoints;
}

function detectSeasonality(timeSeriesData: any[]) {
  // Simple seasonality detection using autocorrelation
  const values = timeSeriesData.map(d => d.value);
  const autocorr7 = calculateAutocorrelation(values, 7); // Weekly
  const autocorr30 = calculateAutocorrelation(values, 30); // Monthly
  
  return {
    weekly: autocorr7 > 0.3,
    monthly: autocorr30 > 0.3,
    strength: Math.max(autocorr7, autocorr30)
  };
}

function calculateAutocorrelation(values: number[], lag: number) {
  if (values.length <= lag) return 0;
  
  const n = values.length - lag;
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (values[i] - mean) * (values[i + lag] - mean);
  }
  
  for (let i = 0; i < values.length; i++) {
    denominator += Math.pow(values[i] - mean, 2);
  }
  
  return denominator !== 0 ? numerator / denominator : 0;
}

function classifyTrendType(slope: number, acceleration: number) {
  if (Math.abs(slope) < 0.01) return "stable";
  if (acceleration > 0.1) return "accelerating";
  if (acceleration < -0.1) return "decelerating";
  if (slope > 0) return "growth";
  return "decline";
}

function projectTrendEnd(trend: any, timestamps: number[]) {
  // Project when trend might end based on deceleration
  if (trend.acceleration >= 0) return null; // Trend not decelerating
  
  const timeToZero = -trend.slope / trend.acceleration;
  const lastTimestamp = timestamps[timestamps.length - 1];
  
  return new Date(lastTimestamp + timeToZero * 24 * 60 * 60 * 1000);
}

async function findCorrelatedEvents(timeSeriesData: any[], category?: string) {
  // Mock correlated events
  const events = [
    { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), event: "Product launch", impact: "positive" },
    { date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), event: "Marketing campaign", impact: "positive" },
    { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), event: "Server outage", impact: "negative" }
  ];
  
  return events.slice(0, 3);
}

function identifyLikelyCauses(trend: any, changePoints: number[]) {
  const causes = [];
  
  if (trend.direction === "upward") {
    causes.push("Successful marketing initiatives", "Product improvements", "Market expansion");
  } else if (trend.direction === "downward") {
    causes.push("Increased competition", "Market saturation", "Economic factors");
  }
  
  if (changePoints.length > 0) {
    causes.push("Structural changes in business model", "External market events");
  }
  
  return causes.slice(0, 3);
}

async function identifyExternalFactors(timeSeriesData: any[], category?: string) {
  // Mock external factors
  return [
    { factor: "Economic conditions", impact: "medium", confidence: 0.7 },
    { factor: "Seasonal variations", impact: "high", confidence: 0.9 },
    { factor: "Industry trends", impact: "medium", confidence: 0.6 }
  ];
}

function generateShortTermForecast(trend: any, values: number[], days: number) {
  const lastValue = values[values.length - 1];
  const forecast = [];
  
  for (let i = 1; i <= days; i++) {
    const projectedValue = lastValue + (trend.slope * i) + (0.5 * trend.acceleration * i * i);
    forecast.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      value: Math.max(0, projectedValue),
      confidence: Math.max(0.5, 1 - (i / days) * 0.3)
    });
  }
  
  return forecast;
}

function generateLongTermForecast(trend: any, values: number[], days: number) {
  return generateShortTermForecast(trend, values, days);
}

function calculateConfidenceInterval(trend: any, values: number[]) {
  const residuals = values.map((val, i) => val - (trend.intercept + trend.slope * i));
  const mse = residuals.reduce((sum, res) => sum + res * res, 0) / (values.length - 2);
  const se = Math.sqrt(mse);
  
  return {
    upperBound: se * 1.96, // 95% confidence interval
    lowerBound: -se * 1.96
  };
}

function calculateAlertThreshold(values: number[], trend: any) {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);
  
  return {
    upper: mean + 2 * stdDev,
    lower: mean - 2 * stdDev
  };
}

function shouldTriggerAlert(trend: any, values: number[]) {
  const lastValue = values[values.length - 1];
  const threshold = calculateAlertThreshold(values, trend);
  
  return lastValue > threshold.upper || lastValue < threshold.lower;
}

function determineAlertLevel(trend: any, values: number[]) {
  if (Math.abs(trend.acceleration) > 0.5) return "critical";
  if (Math.abs(trend.slope) > 1.0) return "warning";
  return "info";
}

// Mock statistical test functions
function performMannKendallTest(values: number[]) {
  // Simplified Mann-Kendall test
  let s = 0;
  for (let i = 0; i < values.length - 1; i++) {
    for (let j = i + 1; j < values.length; j++) {
      s += Math.sign(values[j] - values[i]);
    }
  }
  
  const n = values.length;
  const variance = (n * (n - 1) * (2 * n + 5)) / 18;
  const z = s / Math.sqrt(variance);
  const pValue = 2 * (1 - normalCDF(Math.abs(z)));
  
  return {
    statistic: s,
    pValue,
    significant: pValue < 0.05
  };
}

function performAugmentedDickeyFullerTest(values: number[]) {
  // Simplified ADF test
  const statistic = Math.random() * -5; // Mock statistic
  return {
    statistic,
    stationary: statistic < -2.86, // Critical value at 5%
    pValue: Math.random() * 0.1
  };
}

function performShapiroWilkTest(values: number[]) {
  // Simplified Shapiro-Wilk test
  const statistic = Math.random() * 0.3 + 0.7; // 0.7 to 1.0
  return {
    statistic,
    normal: statistic > 0.9,
    pValue: Math.random() * 0.1
  };
}

function normalCDF(x: number) {
  // Approximation of normal CDF
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

function erf(x: number) {
  // Approximation of error function
  const a1 =  0.254829592;
  const a2 = -0.284496736;
  const a3 =  1.421413741;
  const a4 = -1.453152027;
  const a5 =  1.061405429;
  const p  =  0.3275911;

  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

// Additional trend analysis helper functions would continue here...

function detectWeeklyPattern(values: number[], timestamps: Date[]) {
  const dayPatterns = Array(7).fill(0).map(() => ({ sum: 0, count: 0 }));
  
  values.forEach((value, index) => {
    const dayOfWeek = timestamps[index].getDay();
    dayPatterns[dayOfWeek].sum += value;
    dayPatterns[dayOfWeek].count += 1;
  });
  
  const averages = dayPatterns.map(p => p.count > 0 ? p.sum / p.count : 0);
  const overallMean = averages.reduce((sum, avg) => sum + avg, 0) / 7;
  const variance = averages.reduce((sum, avg) => sum + Math.pow(avg - overallMean, 2), 0) / 7;
  
  return {
    pattern: averages,
    strength: Math.sqrt(variance) / overallMean,
    significance: variance > overallMean * 0.1 ? "significant" : "minimal"
  };
}

function detectMonthlyPattern(values: number[], timestamps: Date[]) {
  const monthPatterns = Array(12).fill(0).map(() => ({ sum: 0, count: 0 }));
  
  values.forEach((value, index) => {
    const month = timestamps[index].getMonth();
    monthPatterns[month].sum += value;
    monthPatterns[month].count += 1;
  });
  
  const averages = monthPatterns.map(p => p.count > 0 ? p.sum / p.count : 0);
  const overallMean = averages.reduce((sum, avg) => sum + avg, 0) / 12;
  const variance = averages.reduce((sum, avg) => sum + Math.pow(avg - overallMean, 2), 0) / 12;
  
  return {
    pattern: averages,
    strength: Math.sqrt(variance) / overallMean,
    significance: variance > overallMean * 0.15 ? "significant" : "minimal"
  };
}

function calculateSeasonalComponent(weeklyPattern: any, monthlyPattern: any) {
  return Math.max(weeklyPattern.strength, monthlyPattern.strength);
}

function generateTrendRecommendations(trendAnalysis: any, seasonalAnalysis: any) {
  const recommendations = [];
  
  if (trendAnalysis.direction === "upward" && trendAnalysis.strength > 0.7) {
    recommendations.push({
      priority: "high",
      category: "optimization",
      message: "Strong upward trend detected. Scale successful initiatives.",
      actions: ["Increase resource allocation", "Expand successful strategies", "Monitor sustainability"]
    });
  }
  
  if (trendAnalysis.direction === "downward" && trendAnalysis.strength > 0.7) {
    recommendations.push({
      priority: "critical",
      category: "risk_mitigation",
      message: "Strong downward trend requires immediate attention.",
      actions: ["Identify root causes", "Implement corrective measures", "Monitor closely"]
    });
  }
  
  if (seasonalAnalysis.seasonalStrength > 0.5) {
    recommendations.push({
      priority: "medium",
      category: "planning",
      message: "Strong seasonal patterns detected. Plan accordingly.",
      actions: ["Adjust seasonal strategies", "Prepare for peak periods", "Optimize inventory"]
    });
  }
  
  return recommendations;
}

function generateTrendForecast(trendAnalysis: any, timeSeriesData: any[]) {
  const forecastDays = 30;
  const lastValue = timeSeriesData[timeSeriesData.length - 1].value;
  const forecast = [];
  
  for (let i = 1; i <= forecastDays; i++) {
    const trendComponent = trendAnalysis.slope * i;
    const seasonalComponent = Math.sin(i * 0.2) * lastValue * 0.1; // Simple seasonal effect
    const noise = (Math.random() - 0.5) * lastValue * 0.05; // 5% noise
    
    forecast.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      value: Math.max(0, lastValue + trendComponent + seasonalComponent + noise),
      confidence: Math.max(0.5, 1 - (i / forecastDays) * 0.4)
    });
  }
  
  return forecast;
}

function calculateEmergenceScore(trend: any) {
  const strengthWeight = trend.strength * 0.4;
  const accelerationWeight = Math.min(trend.acceleration, 1) * 0.3;
  const recencyWeight = (30 - trend.duration) / 30 * 0.3;
  
  return strengthWeight + accelerationWeight + recencyWeight;
}

function assessPotentialImpact(trend: any) {
  const impact = trend.strength * trend.acceleration * (trend.changePercent / 100);
  
  if (impact > 0.5) return "high";
  if (impact > 0.2) return "medium";
  return "low";
}

function calculateCorrelation(x: number[], y: number[]) {
  const n = Math.min(x.length, y.length);
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;
  
  let numerator = 0;
  let xVariance = 0;
  let yVariance = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (x[i] - xMean) * (y[i] - yMean);
    xVariance += Math.pow(x[i] - xMean, 2);
    yVariance += Math.pow(y[i] - yMean, 2);
  }
  
  return numerator / Math.sqrt(xVariance * yVariance);
}
