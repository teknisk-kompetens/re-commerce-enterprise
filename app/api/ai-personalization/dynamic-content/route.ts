
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const tenantId = searchParams.get("tenantId");
    const contentKey = searchParams.get("contentKey");
    const placement = searchParams.get("placement");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    if (contentKey) {
      // Get specific personalized content
      const personalizedContent = await getPersonalizedContent(
        contentKey,
        userId,
        tenantId,
        placement
      );
      
      return NextResponse.json({
        success: true,
        contentKey,
        content: personalizedContent.content,
        personalization: personalizedContent.personalization,
        experiment: personalizedContent.experiment
      });
    } else {
      // Get all dynamic content for tenant
      const dynamicContent = await prisma.dynamicContent.findMany({
        where: { tenantId, isActive: true },
        orderBy: { createdAt: "desc" }
      });

      return NextResponse.json({
        success: true,
        dynamicContent: dynamicContent.map(content => ({
          id: content.id,
          contentKey: content.contentKey,
          contentType: content.contentType,
          impressions: content.impressions,
          interactions: content.interactions,
          conversions: content.conversions,
          averageEngagement: content.averageEngagement,
          aiOptimized: content.aiOptimized,
          testingEnabled: content.testingEnabled
        })),
        totalContent: dynamicContent.length
      });
    }
  } catch (error) {
    console.error("Dynamic content fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dynamic content" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId,
      contentKey,
      contentType,
      baseContent,
      personalizationRules = [],
      optimizationGoal = "engagement",
      targetSegments = [],
      operationType = "create" // "create", "optimize", "test"
    } = body;

    if (!tenantId || !contentKey || !contentType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let result;

    switch (operationType) {
      case "create":
        result = await createDynamicContent({
          tenantId,
          contentKey,
          contentType,
          baseContent,
          personalizationRules,
          optimizationGoal,
          targetSegments
        });
        break;

      case "optimize":
        result = await optimizeContentWithAI(contentKey, tenantId);
        break;

      case "test":
        result = await setupContentTesting(contentKey, tenantId, body.testConfig);
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
    console.error("Dynamic content operation error:", error);
    return NextResponse.json(
      { error: "Failed to process dynamic content operation" },
      { status: 500 }
    );
  }
}

// Track content interaction
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      contentKey,
      tenantId,
      userId,
      interactionType, // "view", "click", "convert", "dismiss"
      sessionId,
      context = {}
    } = body;

    if (!contentKey || !tenantId || !interactionType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update content metrics
    const content = await prisma.dynamicContent.findFirst({
      where: { contentKey, tenantId }
    });

    if (!content) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    const updateData: any = {};
    
    if (interactionType === "view") {
      updateData.impressions = content.impressions + 1;
    } else if (interactionType === "click") {
      updateData.interactions = content.interactions + 1;
    } else if (interactionType === "convert") {
      updateData.conversions = content.conversions + 1;
    }

    // Calculate new engagement rate
    if (updateData.interactions !== undefined || updateData.impressions !== undefined) {
      const newImpressions = updateData.impressions || content.impressions;
      const newInteractions = updateData.interactions || content.interactions;
      updateData.averageEngagement = newImpressions > 0 ? newInteractions / newImpressions : 0;
    }

    const updatedContent = await prisma.dynamicContent.update({
      where: { id: content.id },
      data: updateData
    });

    // Record interaction for personalization
    if (userId) {
      await recordContentInteraction(userId, contentKey, interactionType, context, sessionId);
    }

    return NextResponse.json({
      success: true,
      content: updatedContent,
      interactionRecorded: true
    });
  } catch (error) {
    console.error("Content interaction tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track content interaction" },
      { status: 500 }
    );
  }
}

// Get personalized content for user
async function getPersonalizedContent(
  contentKey: string,
  userId: string | null,
  tenantId: string,
  placement: string | null
) {
  try {
    // Get base content
    const dynamicContent = await prisma.dynamicContent.findFirst({
      where: { contentKey, tenantId, isActive: true }
    });

    if (!dynamicContent) {
      return {
        content: null,
        personalization: { applied: false, reason: "Content not found" }
      };
    }

    let personalizedContent = dynamicContent.baseContent;
    let personalizationApplied = false;
    let experiment = null;

    if (userId) {
      // Get user profile for personalization
      const profile = await prisma.personalizationProfile.findUnique({
        where: { userId },
        include: {
          preferences: {
            where: { isActive: true },
            take: 20
          },
          behaviorEvents: {
            take: 10,
            orderBy: { createdAt: "desc" }
          }
        }
      });

      if (profile) {
        // Apply AI-powered personalization
        const aiPersonalization = await generatePersonalizedContent(
          dynamicContent,
          profile,
          placement
        );

        if (aiPersonalization.personalizedContent) {
          personalizedContent = aiPersonalization.personalizedContent;
          personalizationApplied = true;
        }

        // Check for A/B tests
        if (dynamicContent.testingEnabled && dynamicContent.testVariants) {
          experiment = await assignUserToContentTest(
            userId,
            dynamicContent,
            profile
          );
          
          if (experiment && experiment.content) {
            personalizedContent = experiment.content;
          }
        }
      }
    }

    // Update impression count
    await prisma.dynamicContent.update({
      where: { id: dynamicContent.id },
      data: { impressions: dynamicContent.impressions + 1 }
    });

    return {
      content: personalizedContent,
      personalization: {
        applied: personalizationApplied,
        userId,
        placement,
        contentKey
      },
      experiment
    };
  } catch (error) {
    console.error("Failed to get personalized content:", error);
    return {
      content: null,
      personalization: { applied: false, reason: "Personalization failed" }
    };
  }
}

// Create dynamic content
async function createDynamicContent(config: any) {
  try {
    // Use AI to optimize content configuration
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
          content: `Optimize dynamic content configuration for personalization:
            
            Content Config: ${JSON.stringify(config)}
            
            Enhance:
            1. Content variants for different user segments
            2. Personalization rules and triggers
            3. A/B testing opportunities
            4. Optimization strategies
            5. Success metrics`
        }],
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const optimization = JSON.parse(aiResult.choices[0].message.content);

    // Create enhanced content
    const dynamicContent = await prisma.dynamicContent.create({
      data: {
        tenantId: config.tenantId,
        contentKey: config.contentKey,
        contentType: config.contentType,
        baseContent: config.baseContent,
        targetSegments: config.targetSegments,
        personalizationRules: optimization.personalizationRules || config.personalizationRules,
        contentVariants: optimization.contentVariants || [],
        optimizationGoal: config.optimizationGoal,
        aiOptimized: true,
        testingEnabled: optimization.testingEnabled || false,
        testVariants: optimization.testVariants || []
      }
    });

    return {
      dynamicContent,
      optimization,
      created: true
    };
  } catch (error) {
    console.error("Failed to create dynamic content:", error);
    return { error: "Content creation failed" };
  }
}

// Optimize content with AI
async function optimizeContentWithAI(contentKey: string, tenantId: string) {
  try {
    const content = await prisma.dynamicContent.findFirst({
      where: { contentKey, tenantId }
    });

    if (!content) {
      return { error: "Content not found" };
    }

    // Get performance data
    const performanceData = {
      impressions: content.impressions,
      interactions: content.interactions,
      conversions: content.conversions,
      averageEngagement: content.averageEngagement
    };

    // Use AI to optimize content
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
          content: `Optimize content based on performance data:
            
            Current Content: ${JSON.stringify(content.baseContent)}
            Performance: ${JSON.stringify(performanceData)}
            Optimization Goal: ${content.optimizationGoal}
            
            Provide:
            1. Optimized content variants
            2. Improved personalization rules
            3. Better targeting strategies
            4. Performance improvement predictions`
        }],
        max_tokens: 2500,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const optimization = JSON.parse(aiResult.choices[0].message.content);

    // Update content with optimizations
    const updatedContent = await prisma.dynamicContent.update({
      where: { id: content.id },
      data: {
        contentVariants: optimization.contentVariants || content.contentVariants,
        personalizationRules: optimization.personalizationRules || content.personalizationRules,
        aiOptimized: true
      }
    });

    return {
      updatedContent,
      optimization,
      optimized: true
    };
  } catch (error) {
    console.error("Failed to optimize content with AI:", error);
    return { error: "Content optimization failed" };
  }
}

// Setup content A/B testing
async function setupContentTesting(contentKey: string, tenantId: string, testConfig: any) {
  try {
    const content = await prisma.dynamicContent.findFirst({
      where: { contentKey, tenantId }
    });

    if (!content) {
      return { error: "Content not found" };
    }

    // Use AI to design A/B test
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
          content: `Design A/B test for content optimization:
            
            Base Content: ${JSON.stringify(content.baseContent)}
            Test Config: ${JSON.stringify(testConfig)}
            Goal: ${content.optimizationGoal}
            
            Create:
            1. Test variants with clear hypotheses
            2. Success metrics and KPIs
            3. Statistical methodology
            4. Duration and sample size
            5. Targeting criteria`
        }],
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const testDesign = JSON.parse(aiResult.choices[0].message.content);

    // Update content with test configuration
    const updatedContent = await prisma.dynamicContent.update({
      where: { id: content.id },
      data: {
        testingEnabled: true,
        testVariants: testDesign.testVariants || [],
        testStatistics: {
          ...testDesign.statistics,
          startDate: new Date().toISOString(),
          status: "active"
        }
      }
    });

    return {
      updatedContent,
      testDesign,
      testingEnabled: true
    };
  } catch (error) {
    console.error("Failed to setup content testing:", error);
    return { error: "Test setup failed" };
  }
}

// Generate personalized content with AI
async function generatePersonalizedContent(
  dynamicContent: any,
  profile: any,
  placement: string | null
) {
  try {
    // Prepare personalization context
    const context = {
      userProfile: {
        segment: profile.primarySegment,
        lifecycle: profile.userLifecycleStage,
        engagement: profile.engagementScore,
        preferences: profile.preferences?.slice(0, 5) || []
      },
      recentBehavior: profile.behaviorEvents?.slice(0, 5) || [],
      placement,
      contentType: dynamicContent.contentType,
      optimizationGoal: dynamicContent.optimizationGoal
    };

    // Use AI to personalize content
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
          content: `Personalize content for user context:
            
            Base Content: ${JSON.stringify(dynamicContent.baseContent)}
            User Context: ${JSON.stringify(context)}
            Personalization Rules: ${JSON.stringify(dynamicContent.personalizationRules)}
            Available Variants: ${JSON.stringify(dynamicContent.contentVariants)}
            
            Generate:
            1. Personalized content optimized for user
            2. Reasoning for personalization choices
            3. Expected impact on engagement
            4. Alternative variations if needed`
        }],
        max_tokens: 1500,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const personalization = JSON.parse(aiResult.choices[0].message.content);

    return {
      personalizedContent: personalization.personalizedContent || dynamicContent.baseContent,
      reasoning: personalization.reasoning || [],
      expectedImpact: personalization.expectedImpact || 0,
      alternatives: personalization.alternatives || []
    };
  } catch (error) {
    console.error("Failed to generate personalized content:", error);
    return {
      personalizedContent: dynamicContent.baseContent,
      reasoning: ["Personalization failed, using base content"]
    };
  }
}

// Assign user to content A/B test
async function assignUserToContentTest(
  userId: string,
  dynamicContent: any,
  profile: any
) {
  try {
    if (!dynamicContent.testVariants || dynamicContent.testVariants.length === 0) {
      return null;
    }

    // Check if user is already assigned to this test
    const existingAssignment = await prisma.personalizationExperiment.findFirst({
      where: {
        profileId: profile.id,
        experimentName: `content_test_${dynamicContent.contentKey}`,
        status: "active"
      }
    });

    if (existingAssignment) {
      const variant = dynamicContent.testVariants.find(
        (v: any) => v.id === existingAssignment.variant
      );
      return {
        variantId: existingAssignment.variant,
        content: variant?.content || dynamicContent.baseContent,
        controlGroup: existingAssignment.controlGroup
      };
    }

    // Assign to test variant
    const variants = dynamicContent.testVariants;
    const randomIndex = Math.floor(Math.random() * (variants.length + 1)); // +1 for control
    const isControl = randomIndex === variants.length;
    const variant = isControl ? null : variants[randomIndex];

    // Create experiment assignment
    await prisma.personalizationExperiment.create({
      data: {
        profileId: profile.id,
        experimentName: `content_test_${dynamicContent.contentKey}`,
        experimentType: "content_optimization",
        variant: isControl ? "control" : variant.id,
        controlGroup: isControl,
        successMetric: dynamicContent.optimizationGoal
      }
    });

    return {
      variantId: isControl ? "control" : variant.id,
      content: isControl ? dynamicContent.baseContent : variant.content,
      controlGroup: isControl
    };
  } catch (error) {
    console.error("Failed to assign user to content test:", error);
    return null;
  }
}

// Record content interaction for personalization
async function recordContentInteraction(
  userId: string,
  contentKey: string,
  interactionType: string,
  context: any,
  sessionId?: string
) {
  try {
    const profile = await prisma.personalizationProfile.findUnique({
      where: { userId }
    });

    if (!profile) return;

    await prisma.contentInteraction.create({
      data: {
        profileId: profile.id,
        contentId: contentKey,
        contentType: "dynamic_content",
        interactionType,
        interactionDuration: context.duration || 0,
        interactionDepth: context.depth || 0,
        discoveryMethod: context.discoveryMethod || "direct",
        deviceContext: context.deviceType,
        engagementScore: calculateEngagementScore(interactionType, context),
        converted: interactionType === "convert",
        conversionType: interactionType === "convert" ? "content_interaction" : null
      }
    });

    // Update personalization event
    await prisma.personalizationEvent.create({
      data: {
        profileId: profile.id,
        eventType: interactionType,
        eventCategory: "content_engagement",
        element: "dynamic_content",
        elementId: contentKey,
        sessionId: sessionId || "unknown",
        eventData: {
          contentKey,
          interactionType,
          ...context
        }
      }
    });
  } catch (error) {
    console.error("Failed to record content interaction:", error);
  }
}

// Helper functions
function calculateEngagementScore(interactionType: string, context: any): number {
  let score = 0;

  switch (interactionType) {
    case "view":
      score = 0.1;
      break;
    case "click":
      score = 0.5;
      break;
    case "convert":
      score = 1.0;
      break;
    case "dismiss":
      score = -0.2;
      break;
  }

  // Adjust based on duration
  if (context.duration) {
    score += Math.min(context.duration / 30000, 0.3); // Up to 30 seconds adds 0.3
  }

  return Math.max(-1, Math.min(1, score));
}
