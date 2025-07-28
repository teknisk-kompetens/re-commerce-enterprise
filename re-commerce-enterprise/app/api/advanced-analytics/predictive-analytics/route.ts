
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
    const modelType = searchParams.get("modelType");
    const targetMetric = searchParams.get("targetMetric");
    const status = searchParams.get("status") ?? "active";
    const limit = parseInt(searchParams.get("limit") ?? "20");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      status,
      ...(modelType && { modelType }),
      ...(targetMetric && { targetMetric })
    };

    const [predictions, modelStats, accuracyStats] = await Promise.all([
      prisma.predictiveAnalytics.findMany({
        where: whereClause,
        orderBy: { predictionDate: "desc" },
        take: limit
      }),
      prisma.predictiveAnalytics.groupBy({
        by: ["modelType"],
        where: { tenantId, status },
        _count: { modelType: true },
        _avg: {
          confidenceScore: true,
          accuracy: true
        }
      }),
      prisma.predictiveAnalytics.aggregate({
        where: { 
          tenantId, 
          status,
          accuracy: { not: null }
        },
        _avg: {
          accuracy: true,
          precision: true,
          recall: true,
          f1Score: true
        }
      })
    ]);

    // Calculate prediction trends
    const predictionTrends = calculatePredictionTrends(predictions);
    
    // Get model performance over time
    const modelPerformance = await getModelPerformance(tenantId);
    
    // Calculate feature importance
    const featureImportance = calculateFeatureImportance(predictions);

    return NextResponse.json({
      predictions,
      modelStats,
      accuracyStats,
      predictionTrends,
      modelPerformance,
      featureImportance,
      insights: {
        totalPredictions: predictions.length,
        averageAccuracy: accuracyStats._avg.accuracy || 0,
        bestPerformingModel: findBestPerformingModel(modelStats),
        predictionReliability: calculatePredictionReliability(predictions),
        nextRetraining: getNextRetrainingSchedule(predictions)
      }
    });

  } catch (error) {
    console.error("Error fetching predictive analytics:", error);
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
      case "create_prediction":
        return await createPrediction(data);
        
      case "train_model":
        return await trainModel(data);
        
      case "validate_model":
        return await validateModel(data);
        
      case "forecast_trends":
        return await forecastTrends(data);
        
      case "batch_predictions":
        return await generateBatchPredictions(data);
        
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("Error processing predictive analytics request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function createPrediction(data: any) {
  const {
    tenantId,
    modelType,
    targetMetric,
    targetEntity,
    predictionHorizon,
    inputFeatures,
    algorithm = "random_forest"
  } = data;

  if (!tenantId || !modelType || !targetMetric || !predictionHorizon) {
    throw new Error("Missing required fields");
  }

  // Generate prediction using ML model
  const predictionResult = await generatePrediction({
    modelType,
    targetMetric,
    targetEntity,
    predictionHorizon,
    inputFeatures,
    algorithm
  });

  // Create prediction record
  const prediction = await prisma.predictiveAnalytics.create({
    data: {
      tenantId,
      modelType,
      modelVersion: "1.0",
      algorithm,
      targetMetric,
      targetEntity,
      predictionHorizon,
      predictedValue: predictionResult.value,
      confidenceScore: predictionResult.confidence,
      predictionRange: predictionResult.range,
      accuracy: null, // Will be updated when actual values are recorded
      precision: null,
      recall: null,
      f1Score: null,
      inputFeatures: inputFeatures || {},
      featureImportance: predictionResult.featureImportance,
      basePeriodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      basePeriodEnd: new Date(),
      predictionDate: new Date(Date.now() + predictionHorizon * 24 * 60 * 60 * 1000),
      actualValue: null,
      actualRecordedAt: null,
      status: "active",
      trainingDate: new Date(),
      nextRetrain: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Retrain weekly
    }
  });

  return {
    success: true,
    prediction,
    predictionResult,
    interpretation: interpretPrediction(predictionResult, targetMetric),
    recommendations: generatePredictionRecommendations(predictionResult, modelType)
  };
}

async function trainModel(data: any) {
  const {
    tenantId,
    modelType,
    targetMetric,
    trainingData,
    algorithm = "random_forest",
    hyperparameters = {}
  } = data;

  if (!tenantId || !modelType || !targetMetric) {
    throw new Error("Missing required fields");
  }

  // Simulate model training process
  const trainingResult = await simulateModelTraining({
    modelType,
    targetMetric,
    trainingData,
    algorithm,
    hyperparameters
  });

  // Update existing models or create new one
  const existingModels = await prisma.predictiveAnalytics.findMany({
    where: {
      tenantId,
      modelType,
      targetMetric,
      status: "active"
    }
  });

  // Mark old models as deprecated
  if (existingModels.length > 0) {
    await prisma.predictiveAnalytics.updateMany({
      where: {
        tenantId,
        modelType,
        targetMetric,
        status: "active"
      },
      data: { status: "deprecated" }
    });
  }

  return {
    success: true,
    trainingResult,
    modelMetrics: {
      accuracy: trainingResult.accuracy,
      precision: trainingResult.precision,
      recall: trainingResult.recall,
      f1Score: trainingResult.f1Score
    },
    deployment: {
      status: "ready",
      modelVersion: trainingResult.version,
      trainingDataSize: trainingData?.length || 0,
      algorithm: algorithm
    }
  };
}

async function validateModel(data: any) {
  const { tenantId, modelType, validationData, targetMetric } = data;

  if (!tenantId || !modelType || !targetMetric) {
    throw new Error("Missing required fields");
  }

  // Get latest model for validation
  const latestModel = await prisma.predictiveAnalytics.findFirst({
    where: {
      tenantId,
      modelType,
      targetMetric,
      status: "active"
    },
    orderBy: { trainingDate: "desc" }
  });

  if (!latestModel) {
    throw new Error("No active model found for validation");
  }

  // Simulate model validation
  const validationResult = await simulateModelValidation(
    latestModel,
    validationData
  );

  // Update model with validation results
  await prisma.predictiveAnalytics.update({
    where: { id: latestModel.id },
    data: {
      accuracy: validationResult.accuracy,
      precision: validationResult.precision,
      recall: validationResult.recall,
      f1Score: validationResult.f1Score
    }
  });

  return {
    success: true,
    validationResult,
    modelPerformance: {
      accuracy: validationResult.accuracy,
      precision: validationResult.precision,
      recall: validationResult.recall,
      f1Score: validationResult.f1Score,
      rocAuc: validationResult.rocAuc
    },
    recommendations: generateValidationRecommendations(validationResult)
  };
}

async function forecastTrends(data: any) {
  const {
    tenantId,
    metrics,
    timeHorizon = 30,
    granularity = "daily",
    includeSeasonality = true
  } = data;

  if (!tenantId || !metrics || !Array.isArray(metrics)) {
    throw new Error("Missing required fields");
  }

  const forecasts = [];

  for (const metric of metrics) {
    // Get historical data for the metric
    const historicalData = await getHistoricalData(tenantId, metric, 90); // 90 days of history
    
    // Generate forecast
    const forecast = await generateTimeSerieForecast({
      metric,
      historicalData,
      timeHorizon,
      granularity,
      includeSeasonality
    });

    forecasts.push({
      metric,
      forecast,
      confidence: forecast.confidence,
      trends: identifyTrends(forecast.values),
      seasonality: includeSeasonality ? detectSeasonality(historicalData) : null
    });
  }

  return {
    success: true,
    forecasts,
    summary: {
      totalMetrics: metrics.length,
      timeHorizon,
      granularity,
      averageConfidence: forecasts.reduce((sum, f) => sum + f.confidence, 0) / forecasts.length,
      keyInsights: extractKeyInsights(forecasts)
    }
  };
}

async function generateBatchPredictions(data: any) {
  const {
    tenantId,
    targets,
    modelType,
    predictionHorizon = 7
  } = data;

  if (!tenantId || !targets || !Array.isArray(targets)) {
    throw new Error("Missing required fields");
  }

  const predictions = [];
  const errors = [];

  for (const target of targets) {
    try {
      const prediction = await createPrediction({
        tenantId,
        modelType,
        targetMetric: target.metric,
        targetEntity: target.entity,
        predictionHorizon,
        inputFeatures: target.features
      });
      
      predictions.push(prediction);
    } catch (error) {
      errors.push({
        target,
        error: error.message
      });
    }
  }

  return {
    success: true,
    generated: predictions.length,
    errors: errors.length,
    predictions,
    errors,
    batchSummary: {
      averageConfidence: predictions.reduce((sum, p) => sum + p.prediction.confidenceScore, 0) / predictions.length,
      highConfidencePredictions: predictions.filter(p => p.prediction.confidenceScore > 0.8).length,
      riskPredictions: predictions.filter(p => p.predictionResult.value < 0).length
    }
  };
}

// Helper functions
function calculatePredictionTrends(predictions: any[]) {
  const trends = {
    accuracy: calculateAccuracyTrend(predictions),
    confidence: calculateConfidenceTrend(predictions),
    volume: calculateVolumeTrend(predictions)
  };

  return trends;
}

async function getModelPerformance(tenantId: string) {
  const performance = await prisma.predictiveAnalytics.groupBy({
    by: ["modelType", "algorithm"],
    where: {
      tenantId,
      accuracy: { not: null }
    },
    _avg: {
      accuracy: true,
      confidenceScore: true
    },
    _count: {
      id: true
    }
  });

  return performance.map(p => ({
    modelType: p.modelType,
    algorithm: p.algorithm,
    averageAccuracy: p._avg.accuracy,
    averageConfidence: p._avg.confidenceScore,
    predictionCount: p._count.id,
    performance: classifyPerformance(p._avg.accuracy || 0)
  }));
}

function calculateFeatureImportance(predictions: any[]) {
  const allFeatures: any = {};
  
  predictions.forEach(prediction => {
    if (prediction.featureImportance) {
      Object.entries(prediction.featureImportance).forEach(([feature, importance]: [string, any]) => {
        if (!allFeatures[feature]) {
          allFeatures[feature] = [];
        }
        allFeatures[feature].push(importance);
      });
    }
  });

  return Object.entries(allFeatures).map(([feature, importances]: [string, any]) => ({
    feature,
    averageImportance: importances.reduce((sum: number, imp: number) => sum + imp, 0) / importances.length,
    consistency: calculateConsistency(importances),
    rank: 0 // Will be calculated after sorting
  })).sort((a, b) => b.averageImportance - a.averageImportance)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

function findBestPerformingModel(modelStats: any[]) {
  return modelStats.reduce((best, current) => 
    (current._avg.accuracy || 0) > (best._avg.accuracy || 0) ? current : best
  );
}

function calculatePredictionReliability(predictions: any[]) {
  const recentPredictions = predictions.filter(p => 
    new Date(p.predictionDate).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
  );

  const averageConfidence = recentPredictions.reduce((sum, p) => sum + p.confidenceScore, 0) / recentPredictions.length;
  const consistencyScore = calculateConsistency(recentPredictions.map(p => p.confidenceScore));

  return {
    averageConfidence,
    consistencyScore,
    reliability: (averageConfidence + consistencyScore) / 2,
    classification: classifyReliability((averageConfidence + consistencyScore) / 2)
  };
}

function getNextRetrainingSchedule(predictions: any[]) {
  const nextRetrainDates = predictions
    .filter(p => p.nextRetrain)
    .map(p => new Date(p.nextRetrain).getTime())
    .sort((a, b) => a - b);

  return nextRetrainDates.length > 0 ? new Date(nextRetrainDates[0]) : null;
}

async function generatePrediction(params: any) {
  // Simulate ML prediction generation
  const { modelType, targetMetric, predictionHorizon, inputFeatures } = params;

  // Mock prediction based on model type
  let baseValue = 100;
  let variance = 20;

  switch (modelType) {
    case "user_churn":
      baseValue = Math.random() * 0.2; // 0-20% churn rate
      variance = 0.05;
      break;
    case "revenue_forecast":
      baseValue = Math.random() * 10000 + 5000; // $5K-15K revenue
      variance = 2000;
      break;
    case "growth_prediction":
      baseValue = Math.random() * 50 + 10; // 10-60% growth
      variance = 15;
      break;
    case "content_performance":
      baseValue = Math.random() * 100000 + 10000; // 10K-110K views
      variance = 20000;
      break;
  }

  const predicted = baseValue + (Math.random() - 0.5) * variance;
  const confidence = Math.random() * 0.4 + 0.6; // 60-100% confidence

  return {
    value: predicted,
    confidence,
    range: {
      min: predicted - variance * 0.3,
      max: predicted + variance * 0.3
    },
    featureImportance: generateFeatureImportance(inputFeatures)
  };
}

function interpretPrediction(result: any, targetMetric: string) {
  const interpretation = {
    trend: result.value > 100 ? "increasing" : "decreasing",
    significance: result.confidence > 0.8 ? "high" : result.confidence > 0.6 ? "medium" : "low",
    risk: assessRisk(result.value, targetMetric),
    actionRequired: result.confidence > 0.8 && assessRisk(result.value, targetMetric) === "high"
  };

  return interpretation;
}

function generatePredictionRecommendations(result: any, modelType: string) {
  const recommendations = [];

  if (result.confidence < 0.7) {
    recommendations.push({
      priority: "high",
      category: "model_improvement",
      message: "Low prediction confidence. Consider gathering more training data or feature engineering.",
      action: "improve_data_quality"
    });
  }

  switch (modelType) {
    case "user_churn":
      if (result.value > 0.15) {
        recommendations.push({
          priority: "high",
          category: "retention",
          message: "High churn risk predicted. Implement retention campaigns.",
          action: "activate_retention_strategy"
        });
      }
      break;
    case "revenue_forecast":
      if (result.value < 5000) {
        recommendations.push({
          priority: "medium",
          category: "revenue",
          message: "Low revenue forecast. Consider promotional campaigns.",
          action: "boost_marketing_efforts"
        });
      }
      break;
  }

  return recommendations;
}

async function simulateModelTraining(params: any) {
  // Simulate model training process
  const { algorithm, modelType } = params;

  // Mock training results based on algorithm
  const results: any = {
    random_forest: { accuracy: 0.85, precision: 0.82, recall: 0.87, f1Score: 0.84 },
    neural_network: { accuracy: 0.88, precision: 0.85, recall: 0.90, f1Score: 0.87 },
    linear_regression: { accuracy: 0.75, precision: 0.73, recall: 0.78, f1Score: 0.75 },
    time_series: { accuracy: 0.80, precision: 0.78, recall: 0.82, f1Score: 0.80 }
  };

  const baseResults = results[algorithm] || results.random_forest;
  
  return {
    ...baseResults,
    version: "2.0",
    trainingTime: Math.random() * 300 + 60, // 1-6 minutes
    iterations: Math.floor(Math.random() * 500) + 100,
    convergence: true,
    validationLoss: Math.random() * 0.1 + 0.05
  };
}

async function simulateModelValidation(model: any, validationData: any) {
  // Simulate model validation
  const variance = 0.05; // 5% variance from training accuracy
  
  return {
    accuracy: (model.accuracy || 0.8) + (Math.random() - 0.5) * variance,
    precision: (model.precision || 0.8) + (Math.random() - 0.5) * variance,
    recall: (model.recall || 0.8) + (Math.random() - 0.5) * variance,
    f1Score: (model.f1Score || 0.8) + (Math.random() - 0.5) * variance,
    rocAuc: Math.random() * 0.2 + 0.8, // 80-100%
    confusionMatrix: generateConfusionMatrix(),
    validationDataSize: validationData?.length || 100
  };
}

async function getHistoricalData(tenantId: string, metric: string, days: number) {
  // Mock historical data generation
  const data = [];
  const baseValue = Math.random() * 1000 + 500;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const trend = Math.sin(i * 0.1) * 50; // Seasonal pattern
    const noise = (Math.random() - 0.5) * 100;
    const value = baseValue + trend + noise;
    
    data.push({
      date,
      value: Math.max(0, value),
      metric
    });
  }
  
  return data;
}

async function generateTimeSerieForecast(params: any) {
  const { metric, historicalData, timeHorizon, granularity } = params;
  
  if (!historicalData || historicalData.length === 0) {
    throw new Error("Insufficient historical data for forecasting");
  }

  // Simple trend-based forecast
  const values = historicalData.map((d: any) => d.value);
  const trend = calculateTrend(values);
  const seasonality = detectSeasonality(historicalData);
  
  const forecast = [];
  const lastValue = values[values.length - 1];
  
  for (let i = 1; i <= timeHorizon; i++) {
    const trendComponent = lastValue + (trend * i);
    const seasonalComponent = seasonality ? Math.sin(i * 0.1) * seasonality.amplitude : 0;
    const noise = (Math.random() - 0.5) * lastValue * 0.1; // 10% noise
    
    forecast.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000),
      value: Math.max(0, trendComponent + seasonalComponent + noise),
      confidence: Math.max(0.5, 1 - (i / timeHorizon) * 0.4) // Decreasing confidence over time
    });
  }

  return {
    values: forecast,
    confidence: forecast.reduce((sum, f) => sum + f.confidence, 0) / forecast.length,
    trend: trend > 0 ? "increasing" : trend < 0 ? "decreasing" : "stable",
    seasonality: seasonality
  };
}

// Additional helper functions
function calculateAccuracyTrend(predictions: any[]) {
  const accuracyData = predictions
    .filter(p => p.accuracy !== null)
    .map(p => ({ date: p.trainingDate, accuracy: p.accuracy }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    data: accuracyData,
    trend: calculateTrend(accuracyData.map(d => d.accuracy)),
    improvement: accuracyData.length > 1 ? 
      accuracyData[accuracyData.length - 1].accuracy - accuracyData[0].accuracy : 0
  };
}

function calculateConfidenceTrend(predictions: any[]) {
  const confidenceData = predictions
    .map(p => ({ date: p.predictionDate, confidence: p.confidenceScore }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    data: confidenceData,
    trend: calculateTrend(confidenceData.map(d => d.confidence)),
    average: confidenceData.reduce((sum, d) => sum + d.confidence, 0) / confidenceData.length
  };
}

function calculateVolumeTrend(predictions: any[]) {
  const volumeByDay: any = {};
  
  predictions.forEach(p => {
    const day = new Date(p.predictionDate).toDateString();
    volumeByDay[day] = (volumeByDay[day] || 0) + 1;
  });

  const volumeData = Object.entries(volumeByDay).map(([date, count]) => ({
    date: new Date(date),
    volume: count
  }));

  return {
    data: volumeData,
    trend: calculateTrend(volumeData.map(d => d.volume as number)),
    totalVolume: predictions.length
  };
}

function classifyPerformance(accuracy: number) {
  if (accuracy > 0.9) return "excellent";
  if (accuracy > 0.8) return "good";
  if (accuracy > 0.7) return "fair";
  return "poor";
}

function calculateConsistency(values: number[]) {
  if (values.length < 2) return 1;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  
  // Consistency score: 1 - (standardDeviation / mean)
  return Math.max(0, 1 - (standardDeviation / Math.max(mean, 0.01)));
}

function classifyReliability(score: number) {
  if (score > 0.8) return "high";
  if (score > 0.6) return "medium";
  return "low";
}

function generateFeatureImportance(inputFeatures: any) {
  if (!inputFeatures) return {};
  
  const features = Object.keys(inputFeatures);
  const importance: any = {};
  
  features.forEach(feature => {
    importance[feature] = Math.random(); // Random importance for simulation
  });
  
  // Normalize to sum to 1
  const total = Object.values(importance).reduce((sum: number, val: any) => sum + val, 0);
  Object.keys(importance).forEach(key => {
    importance[key] = importance[key] / total;
  });
  
  return importance;
}

function assessRisk(value: number, targetMetric: string) {
  switch (targetMetric) {
    case "churn_rate":
      return value > 0.15 ? "high" : value > 0.08 ? "medium" : "low";
    case "revenue":
      return value < 5000 ? "high" : value < 10000 ? "medium" : "low";
    case "growth_rate":
      return value < 5 ? "high" : value < 15 ? "medium" : "low";
    default:
      return "medium";
  }
}

function generateValidationRecommendations(validationResult: any) {
  const recommendations = [];

  if (validationResult.accuracy < 0.8) {
    recommendations.push({
      priority: "high",
      message: "Model accuracy below threshold. Consider retraining with more data.",
      action: "retrain_model"
    });
  }

  if (validationResult.precision < 0.7) {
    recommendations.push({
      priority: "medium",
      message: "Low precision. Review feature selection and data quality.",
      action: "improve_features"
    });
  }

  return recommendations;
}

function identifyTrends(forecastValues: any[]) {
  const values = forecastValues.map(f => f.value);
  const trend = calculateTrend(values);
  
  return {
    direction: trend > 0 ? "increasing" : trend < 0 ? "decreasing" : "stable",
    strength: Math.abs(trend),
    significance: Math.abs(trend) > values[0] * 0.1 ? "significant" : "minor"
  };
}

function detectSeasonality(historicalData: any[]) {
  // Simple seasonality detection
  const values = historicalData.map(d => d.value);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const amplitude = Math.max(...values) - Math.min(...values);
  
  return {
    detected: amplitude > mean * 0.2,
    amplitude: amplitude,
    period: 7 // Assume weekly seasonality
  };
}

function extractKeyInsights(forecasts: any[]) {
  const insights = [];
  
  forecasts.forEach(forecast => {
    if (forecast.trends.significance === "significant") {
      insights.push({
        metric: forecast.metric,
        insight: `${forecast.metric} shows ${forecast.trends.direction} trend`,
        confidence: forecast.confidence
      });
    }
  });
  
  return insights;
}

function calculateTrend(values: number[]) {
  if (values.length < 2) return 0;
  
  // Simple linear regression slope
  const n = values.length;
  const xSum = (n * (n - 1)) / 2; // Sum of indices 0,1,2,...,n-1
  const ySum = values.reduce((sum, val) => sum + val, 0);
  const xySum = values.reduce((sum, val, index) => sum + val * index, 0);
  const x2Sum = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squares of indices
  
  return (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum);
}

function generateConfusionMatrix() {
  // Generate mock confusion matrix
  return {
    truePositive: Math.floor(Math.random() * 50) + 50,
    falsePositive: Math.floor(Math.random() * 20) + 5,
    trueNegative: Math.floor(Math.random() * 50) + 50,
    falseNegative: Math.floor(Math.random() * 20) + 5
  };
}

