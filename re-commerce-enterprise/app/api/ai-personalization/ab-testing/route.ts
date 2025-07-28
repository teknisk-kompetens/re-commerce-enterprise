
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const tenantId = searchParams.get("tenantId");
    const experimentType = searchParams.get("type");
    const status = searchParams.get("status") || "active";

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    if (userId) {
      // Get user's active experiments
      const profile = await prisma.personalizationProfile.findUnique({
        where: { userId }
      });

      if (!profile) {
        return NextResponse.json({ experiments: [] });
      }

      const experiments = await prisma.personalizationExperiment.findMany({
        where: {
          profileId: profile.id,
          status,
          ...(experimentType && { experimentType })
        },
        orderBy: { startDate: "desc" }
      });

      return NextResponse.json({
        success: true,
        userId,
        experiments,
        totalExperiments: experiments.length
      });
    } else {
      // Get all experiments for tenant
      const experiments = await prisma.personalizationExperiment.findMany({
        where: {
          profile: { tenantId },
          status,
          ...(experimentType && { experimentType })
        },
        include: {
          profile: {
            select: {
              userId: true,
              primarySegment: true,
              userLifecycleStage: true
            }
          }
        },
        orderBy: { startDate: "desc" },
        take: 100
      });

      // Aggregate experiment statistics
      const experimentStats = await aggregateExperimentStats(experiments);

      return NextResponse.json({
        success: true,
        experiments,
        stats: experimentStats,
        totalExperiments: experiments.length
      });
    }
  } catch (error) {
    console.error("A/B testing fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch A/B testing data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId,
      operationType, // "create_experiment", "assign_user", "record_result", "analyze_results"
      experimentConfig,
      userId,
      experimentId,
      resultData
    } = body;

    if (!tenantId || !operationType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let result;

    switch (operationType) {
      case "create_experiment":
        if (!experimentConfig) {
          return NextResponse.json({ error: "Experiment config required" }, { status: 400 });
        }
        result = await createPersonalizationExperiment(tenantId, experimentConfig);
        break;

      case "assign_user":
        if (!userId || !experimentId) {
          return NextResponse.json({ error: "User ID and Experiment ID required" }, { status: 400 });
        }
        result = await assignUserToExperiment(userId, experimentId);
        break;

      case "record_result":
        if (!experimentId || !resultData) {
          return NextResponse.json({ error: "Experiment ID and result data required" }, { status: 400 });
        }
        result = await recordExperimentResult(experimentId, resultData);
        break;

      case "analyze_results":
        if (!experimentId) {
          return NextResponse.json({ error: "Experiment ID required" }, { status: 400 });
        }
        result = await analyzeExperimentResults(experimentId);
        break;

      default:
        return NextResponse.json({ error: "Invalid operation type" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      operationType,
      result,
      processedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("A/B testing operation error:", error);
    return NextResponse.json(
      { error: "Failed to process A/B testing operation" },
      { status: 500 }
    );
  }
}

// Create personalization experiment
async function createPersonalizationExperiment(tenantId: string, config: any) {
  try {
    // Use AI to optimize experiment design
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
          content: `Optimize personalization experiment design:
            
            Experiment Config: ${JSON.stringify(config)}
            
            Enhance:
            1. Hypothesis formulation
            2. Variant design and allocation
            3. Success metrics and KPIs
            4. Statistical methodology
            5. Duration and sample size
            6. Targeting and segmentation
            7. Risk mitigation strategies`
        }],
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const optimization = JSON.parse(aiResult.choices[0].message.content);

    // Get target users for experiment
    const targetUsers = await getTargetUsersForExperiment(tenantId, config);

    // Create experiment assignments for target users
    const assignments = [];
    for (const profile of targetUsers) {
      const variant = assignVariant(optimization.variants || config.variants);
      
      const experiment = await prisma.personalizationExperiment.create({
        data: {
          profileId: profile.id,
          experimentName: config.experimentName,
          experimentType: config.experimentType,
          hypothesis: optimization.hypothesis || config.hypothesis,
          variant: variant.name,
          controlGroup: variant.isControl,
          trafficAllocation: optimization.trafficAllocation || config.trafficAllocation || 0.5,
          duration: optimization.duration || config.duration,
          successMetric: optimization.successMetric || config.successMetric,
          secondaryMetrics: optimization.secondaryMetrics || config.secondaryMetrics || []
        }
      });

      assignments.push({
        userId: profile.userId,
        experimentId: experiment.id,
        variant: variant.name,
        controlGroup: variant.isControl
      });
    }

    return {
      experiment: {
        name: config.experimentName,
        type: config.experimentType,
        hypothesis: optimization.hypothesis,
        variants: optimization.variants,
        optimization
      },
      assignments,
      targetUsers: targetUsers.length,
      created: true
    };
  } catch (error) {
    console.error("Failed to create personalization experiment:", error);
    return { error: "Experiment creation failed" };
  }
}

// Assign user to experiment
async function assignUserToExperiment(userId: string, experimentName: string) {
  try {
    const profile = await prisma.personalizationProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return { error: "User profile not found" };
    }

    // Check if user is already in experiment
    const existingAssignment = await prisma.personalizationExperiment.findFirst({
      where: {
        profileId: profile.id,
        experimentName,
        status: "active"
      }
    });

    if (existingAssignment) {
      return {
        experimentId: existingAssignment.id,
        variant: existingAssignment.variant,
        controlGroup: existingAssignment.controlGroup,
        alreadyAssigned: true
      };
    }

    // Get experiment configuration from existing experiments
    const experimentExample = await prisma.personalizationExperiment.findFirst({
      where: {
        experimentName,
        status: "active"
      }
    });

    if (!experimentExample) {
      return { error: "Experiment not found" };
    }

    // Assign variant
    const variants = [
      { name: "control", isControl: true },
      { name: "variant_a", isControl: false },
      { name: "variant_b", isControl: false }
    ];
    const variant = assignVariant(variants);

    const assignment = await prisma.personalizationExperiment.create({
      data: {
        profileId: profile.id,
        experimentName,
        experimentType: experimentExample.experimentType,
        hypothesis: experimentExample.hypothesis,
        variant: variant.name,
        controlGroup: variant.isControl,
        trafficAllocation: 0.33,
        successMetric: experimentExample.successMetric,
        secondaryMetrics: experimentExample.secondaryMetrics
      }
    });

    return {
      experimentId: assignment.id,
      variant: variant.name,
      controlGroup: variant.isControl,
      assigned: true
    };
  } catch (error) {
    console.error("Failed to assign user to experiment:", error);
    return { error: "Assignment failed" };
  }
}

// Record experiment result
async function recordExperimentResult(experimentId: string, resultData: any) {
  try {
    const experiment = await prisma.personalizationExperiment.findUnique({
      where: { id: experimentId }
    });

    if (!experiment) {
      return { error: "Experiment not found" };
    }

    // Update experiment metrics
    const updateData: any = {
      impressions: experiment.impressions + (resultData.impressions || 0),
      interactions: experiment.interactions + (resultData.interactions || 0),
      conversions: experiment.conversions + (resultData.conversions || 0)
    };

    // Update primary metric value
    if (resultData.primaryMetricValue !== undefined) {
      updateData.primaryMetricValue = resultData.primaryMetricValue;
    }

    // Update secondary metrics
    if (resultData.secondaryMetricValues) {
      updateData.secondaryMetricValues = {
        ...experiment.secondaryMetricValues as any,
        ...resultData.secondaryMetricValues
      };
    }

    const updatedExperiment = await prisma.personalizationExperiment.update({
      where: { id: experimentId },
      data: updateData
    });

    return {
      experiment: updatedExperiment,
      recorded: true
    };
  } catch (error) {
    console.error("Failed to record experiment result:", error);
    return { error: "Result recording failed" };
  }
}

// Analyze experiment results with AI
async function analyzeExperimentResults(experimentId: string) {
  try {
    const experiment = await prisma.personalizationExperiment.findUnique({
      where: { id: experimentId },
      include: {
        profile: {
          select: {
            userId: true,
            primarySegment: true,
            userLifecycleStage: true
          }
        }
      }
    });

    if (!experiment) {
      return { error: "Experiment not found" };
    }

    // Get all experiments with same name for comparison
    const allExperiments = await prisma.personalizationExperiment.findMany({
      where: {
        experimentName: experiment.experimentName,
        status: { in: ["active", "completed"] }
      },
      include: {
        profile: {
          select: {
            primarySegment: true,
            userLifecycleStage: true
          }
        }
      }
    });

    // Use AI to analyze results
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
          content: `Analyze A/B test results and provide insights:
            
            Target Experiment: ${JSON.stringify({
              name: experiment.experimentName,
              type: experiment.experimentType,
              variant: experiment.variant,
              controlGroup: experiment.controlGroup,
              impressions: experiment.impressions,
              interactions: experiment.interactions,
              conversions: experiment.conversions,
              primaryMetricValue: experiment.primaryMetricValue,
              secondaryMetricValues: experiment.secondaryMetricValues
            })}
            
            All Variants: ${JSON.stringify(allExperiments.map(e => ({
              variant: e.variant,
              controlGroup: e.controlGroup,
              impressions: e.impressions,
              interactions: e.interactions,
              conversions: e.conversions,
              primaryMetricValue: e.primaryMetricValue,
              userSegment: e.profile?.primarySegment
            })))}
            
            Provide:
            1. Statistical significance analysis
            2. Performance comparison between variants
            3. Winning variant identification
            4. Effect size and confidence intervals
            5. Segment-based insights
            6. Actionable recommendations
            7. Next steps and iterations`
        }],
        max_tokens: 2500,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const analysis = JSON.parse(aiResult.choices[0].message.content);

    // Update experiment with analysis results
    await prisma.personalizationExperiment.update({
      where: { id: experimentId },
      data: {
        significance: analysis.significance,
        confidenceInterval: analysis.confidenceInterval || {},
        effect: analysis.effect,
        pValue: analysis.pValue,
        status: analysis.recommendedStatus || experiment.status
      }
    });

    return {
      experiment,
      analysis,
      allVariants: allExperiments.length,
      analyzed: true
    };
  } catch (error) {
    console.error("Failed to analyze experiment results:", error);
    return { error: "Analysis failed" };
  }
}

// Helper functions
async function getTargetUsersForExperiment(tenantId: string, config: any) {
  const whereClause: any = { tenantId };
  
  // Apply targeting criteria
  if (config.targetSegments && config.targetSegments.length > 0) {
    whereClause.primarySegment = { in: config.targetSegments };
  }
  
  if (config.targetLifecycleStages && config.targetLifecycleStages.length > 0) {
    whereClause.userLifecycleStage = { in: config.targetLifecycleStages };
  }

  if (config.minEngagementScore) {
    whereClause.engagementScore = { gte: config.minEngagementScore };
  }

  const profiles = await prisma.personalizationProfile.findMany({
    where: whereClause,
    take: config.maxUsers || 1000
  });

  return profiles;
}

function assignVariant(variants: any[]): any {
  if (!variants || variants.length === 0) {
    return { name: "control", isControl: true };
  }

  const randomIndex = Math.floor(Math.random() * variants.length);
  return variants[randomIndex];
}

async function aggregateExperimentStats(experiments: any[]) {
  try {
    const stats = {
      totalExperiments: experiments.length,
      activeExperiments: experiments.filter(e => e.status === "active").length,
      completedExperiments: experiments.filter(e => e.status === "completed").length,
      experimentTypes: {} as any,
      variantDistribution: {} as any,
      totalImpressions: 0,
      totalInteractions: 0,
      totalConversions: 0,
      averageConversionRate: 0
    };

    experiments.forEach(exp => {
      // Count by type
      stats.experimentTypes[exp.experimentType] = 
        (stats.experimentTypes[exp.experimentType] || 0) + 1;

      // Count by variant
      stats.variantDistribution[exp.variant] = 
        (stats.variantDistribution[exp.variant] || 0) + 1;

      // Sum metrics
      stats.totalImpressions += exp.impressions || 0;
      stats.totalInteractions += exp.interactions || 0;
      stats.totalConversions += exp.conversions || 0;
    });

    // Calculate average conversion rate
    if (stats.totalImpressions > 0) {
      stats.averageConversionRate = stats.totalConversions / stats.totalImpressions;
    }

    return stats;
  } catch (error) {
    console.error("Failed to aggregate experiment stats:", error);
    return {};
  }
}
