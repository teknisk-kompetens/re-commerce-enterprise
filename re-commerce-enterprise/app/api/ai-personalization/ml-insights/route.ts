
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const tenantId = searchParams.get("tenantId");
    const insightType = searchParams.get("type") || "all"; // "prediction", "segmentation", "optimization", "churn"

    if (!userId || !tenantId) {
      return NextResponse.json({ error: "User ID and Tenant ID required" }, { status: 400 });
    }

    // Get user profile with comprehensive data
    const profile = await prisma.personalizationProfile.findUnique({
      where: { userId },
      include: {
        behaviorEvents: {
          take: 100,
          orderBy: { createdAt: "desc" }
        },
        contentInteractions: {
          take: 50,
          orderBy: { createdAt: "desc" }
        },
        journeySteps: {
          take: 30,
          orderBy: { createdAt: "desc" }
        },
        recommendations: {
          where: { status: "active" },
          take: 20
        },
        preferences: {
          where: { isActive: true }
        }
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Generate comprehensive ML insights
    const insights = await generateMLInsights(profile, insightType);

    return NextResponse.json({
      success: true,
      userId,
      profile: {
        id: profile.id,
        primarySegment: profile.primarySegment,
        userLifecycleStage: profile.userLifecycleStage,
        engagementScore: profile.engagementScore,
        churnProbability: profile.churnProbability,
        modelConfidence: profile.modelConfidence
      },
      insights,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("ML insights generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate ML insights" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId,
      insightType = "batch_analysis",
      userIds = [],
      analysisConfig = {}
    } = body;

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    if (insightType === "batch_analysis" && userIds.length === 0) {
      return NextResponse.json({ error: "User IDs required for batch analysis" }, { status: 400 });
    }

    let results;

    switch (insightType) {
      case "batch_analysis":
        results = await generateBatchUserInsights(userIds, tenantId);
        break;
      case "cohort_analysis":
        results = await generateCohortAnalysis(tenantId, analysisConfig);
        break;
      case "segment_analysis":
        results = await generateSegmentAnalysis(tenantId, analysisConfig);
        break;
      case "model_performance":
        results = await analyzeModelPerformance(tenantId);
        break;
      default:
        return NextResponse.json({ error: "Invalid insight type" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      insightType,
      results,
      analysisConfig,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Batch ML insights error:", error);
    return NextResponse.json(
      { error: "Failed to generate batch insights" },
      { status: 500 }
    );
  }
}

// Individual user ML insights
async function generateMLInsights(profile: any, insightType: string) {
  try {
    // Prepare comprehensive user data for AI analysis
    const userData = {
      profile: {
        id: profile.id,
        userId: profile.userId,
        primarySegment: profile.primarySegment,
        userLifecycleStage: profile.userLifecycleStage,
        engagementScore: profile.engagementScore,
        churnProbability: profile.churnProbability,
        behaviorVector: profile.behaviorVector,
        interactionPatterns: profile.interactionPatterns,
        trainingDataPoints: profile.trainingDataPoints
      },
      recentBehavior: profile.behaviorEvents?.slice(0, 20) || [],
      contentInteractions: profile.contentInteractions?.slice(0, 15) || [],
      journeySteps: profile.journeySteps?.slice(0, 10) || [],
      activeRecommendations: profile.recommendations || [],
      preferences: profile.preferences || []
    };

    // Use AI to generate comprehensive insights
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{
          role: 'user',
          content: `Generate comprehensive ML insights for user profile:
            
            User Data: ${JSON.stringify(userData)}
            Insight Type: ${insightType}
            
            Generate advanced insights including:
            1. User Behavior Predictions (next actions, conversion probability, churn risk)
            2. Personalization Recommendations (content, features, timing, messaging)
            3. Engagement Optimization (strategies to increase engagement)
            4. Lifecycle Progression (how to move user to next stage)
            5. Risk Assessment (churn indicators, satisfaction predictors)
            6. Content Affinity (preferred content types, topics, formats)
            7. Feature Utilization (usage patterns, adoption opportunities)
            8. Temporal Patterns (optimal engagement times, frequency)
            9. Conversion Optimization (path to conversion, barriers)
            10. Competitive Analysis (retention strategies, differentiation)
            
            Provide actionable, data-driven insights with confidence scores.`
        }],
        max_tokens: 3500,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const insights = JSON.parse(aiResult.choices[0].message.content);

    // Structure and enhance insights
    return {
      behaviorPredictions: insights.behaviorPredictions || {},
      personalizationRecommendations: insights.personalizationRecommendations || {},
      engagementOptimization: insights.engagementOptimization || {},
      lifecycleProgression: insights.lifecycleProgression || {},
      riskAssessment: insights.riskAssessment || {},
      contentAffinity: insights.contentAffinity || {},
      featureUtilization: insights.featureUtilization || {},
      temporalPatterns: insights.temporalPatterns || {},
      conversionOptimization: insights.conversionOptimization || {},
      competitiveAnalysis: insights.competitiveAnalysis || {},
      overallConfidence: insights.overallConfidence || 0.8,
      keyInsights: insights.keyInsights || [],
      actionableRecommendations: insights.actionableRecommendations || []
    };
  } catch (error) {
    console.error("Failed to generate ML insights:", error);
    return {
      error: "Insight generation failed",
      fallbackRecommendations: generateFallbackInsights(profile)
    };
  }
}

// Batch user analysis
async function generateBatchUserInsights(userIds: string[], tenantId: string) {
  try {
    const profiles = await prisma.personalizationProfile.findMany({
      where: {
        userId: { in: userIds },
        tenantId
      },
      include: {
        behaviorEvents: {
          take: 10,
          orderBy: { createdAt: "desc" }
        },
        contentInteractions: {
          take: 5,
          orderBy: { createdAt: "desc" }
        }
      }
    });

    // Use AI to analyze user cohorts
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{
          role: 'user',
          content: `Analyze user cohort and generate batch insights:
            
            User Profiles: ${JSON.stringify(profiles.map(p => ({
              userId: p.userId,
              segment: p.primarySegment,
              lifecycle: p.userLifecycleStage,
              engagement: p.engagementScore,
              churn: p.churnProbability
            })))}
            
            Provide:
            1. Cohort behavior patterns
            2. Segment distribution analysis
            3. Engagement trends
            4. Churn risk analysis
            5. Personalization opportunities
            6. Comparative insights
            7. Optimization recommendations`
        }],
        max_tokens: 3000,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const analysis = JSON.parse(aiResult.choices[0].message.content);

    return {
      totalUsers: profiles.length,
      cohortAnalysis: analysis.cohortAnalysis || {},
      segmentDistribution: analysis.segmentDistribution || {},
      engagementTrends: analysis.engagementTrends || {},
      churnRiskAnalysis: analysis.churnRiskAnalysis || {},
      personalizationOpportunities: analysis.personalizationOpportunities || [],
      comparativeInsights: analysis.comparativeInsights || [],
      optimizationRecommendations: analysis.optimizationRecommendations || []
    };
  } catch (error) {
    console.error("Failed to generate batch insights:", error);
    return { error: "Batch analysis failed" };
  }
}

// Cohort analysis
async function generateCohortAnalysis(tenantId: string, config: any) {
  try {
    const timeframe = config.timeframe || "30_days";
    const segmentBy = config.segmentBy || "lifecycle_stage";

    // Get cohort data
    const cohortData = await getCohortData(tenantId, timeframe, segmentBy);

    // Use AI to analyze cohort patterns
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{
          role: 'user',
          content: `Analyze cohort data and generate insights:
            
            Cohort Data: ${JSON.stringify(cohortData)}
            Timeframe: ${timeframe}
            Segment By: ${segmentBy}
            
            Provide:
            1. Cohort retention analysis
            2. Lifecycle progression patterns
            3. Engagement evolution
            4. Churn prediction patterns
            5. Personalization effectiveness
            6. Seasonal trends
            7. Actionable insights`
        }],
        max_tokens: 2500,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    return JSON.parse(aiResult.choices[0].message.content);
  } catch (error) {
    console.error("Failed to generate cohort analysis:", error);
    return { error: "Cohort analysis failed" };
  }
}

// Segment analysis
async function generateSegmentAnalysis(tenantId: string, config: any) {
  try {
    // Get segment data
    const segments = await prisma.personalizationProfile.groupBy({
      by: ['primarySegment'],
      where: { tenantId },
      _count: { primarySegment: true },
      _avg: {
        engagementScore: true,
        churnProbability: true
      }
    });

    // Use AI to analyze segments
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{
          role: 'user',
          content: `Analyze user segments and generate insights:
            
            Segment Data: ${JSON.stringify(segments)}
            
            Provide:
            1. Segment characteristics
            2. Performance comparison
            3. Growth opportunities
            4. Personalization strategies
            5. Migration patterns
            6. Risk factors
            7. Optimization recommendations`
        }],
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    return JSON.parse(aiResult.choices[0].message.content);
  } catch (error) {
    console.error("Failed to generate segment analysis:", error);
    return { error: "Segment analysis failed" };
  }
}

// Model performance analysis
async function analyzeModelPerformance(tenantId: string) {
  try {
    // Get model performance data
    const models = await prisma.personalizationModel.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" }
    });

    // Use AI to analyze model performance
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{
          role: 'user',
          content: `Analyze ML model performance and generate insights:
            
            Models: ${JSON.stringify(models.map(m => ({
              name: m.modelName,
              type: m.modelType,
              accuracy: m.accuracy,
              precision: m.precision,
              recall: m.recall,
              f1Score: m.f1Score,
              conversionLift: m.conversionLift,
              engagementLift: m.engagementLift,
              status: m.status
            })))}
            
            Provide:
            1. Performance comparison
            2. Model effectiveness analysis
            3. Improvement opportunities
            4. Resource optimization
            5. Deployment recommendations
            6. Risk assessment
            7. Future roadmap`
        }],
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    return JSON.parse(aiResult.choices[0].message.content);
  } catch (error) {
    console.error("Failed to analyze model performance:", error);
    return { error: "Model performance analysis failed" };
  }
}

// Helper functions
async function getCohortData(tenantId: string, timeframe: string, segmentBy: string) {
  const daysBack = timeframe === "30_days" ? 30 : timeframe === "7_days" ? 7 : 90;
  const startDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);

  return await prisma.personalizationProfile.findMany({
    where: {
      tenantId,
      createdAt: { gte: startDate }
    },
    select: {
      userId: true,
      primarySegment: true,
      userLifecycleStage: true,
      engagementScore: true,
      churnProbability: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

function generateFallbackInsights(profile: any) {
  return {
    behaviorPredictions: {
      nextActions: ["dashboard_view", "feature_exploration"],
      conversionProbability: profile.engagementScore || 0.3,
      confidence: 0.6
    },
    personalizationRecommendations: {
      contentTypes: ["tutorial", "feature_highlight"],
      timing: "working_hours",
      confidence: 0.7
    },
    riskAssessment: {
      churnRisk: profile.churnProbability || 0.1,
      factors: ["low_engagement", "feature_underutilization"],
      confidence: 0.8
    }
  };
}
