
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const tenantId = searchParams.get("tenantId");
    const type = searchParams.get("type") || "all";
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!userId || !tenantId) {
      return NextResponse.json({ error: "User ID and Tenant ID required" }, { status: 400 });
    }

    // Get or create personalization profile
    let profile = await prisma.personalizationProfile.findUnique({
      where: { userId },
      include: {
        recommendations: {
          where: {
            status: "active",
            OR: [
              { expiresAt: null },
              { expiresAt: { gte: new Date() } }
            ]
          },
          orderBy: [
            { priority: "desc" },
            { confidenceScore: "desc" }
          ],
          take: limit
        },
        behaviorEvents: {
          take: 50,
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!profile) {
      profile = await prisma.personalizationProfile.create({
        data: {
          userId,
          tenantId,
          behaviorVector: {},
          interactionPatterns: {},
          preferenceWeights: {},
          personalizationLevel: "adaptive",
          privacyLevel: "balanced",
          primarySegment: "new_user",
          userLifecycleStage: "new"
        },
        include: {
          recommendations: true,
          behaviorEvents: true
        }
      });
    }

    // If no recommendations exist or they're stale, generate new ones
    if (profile.recommendations?.length === 0 || shouldRegenerateRecommendations(profile)) {
      await generatePersonalizedRecommendations(profile.id, userId, tenantId, type);
      
      // Fetch updated recommendations
      profile = await prisma.personalizationProfile.findUnique({
        where: { userId },
        include: {
          recommendations: {
            where: {
              status: "active",
              OR: [
                { expiresAt: null },
                { expiresAt: { gte: new Date() } }
              ]
            },
            orderBy: [
              { priority: "desc" },
              { confidenceScore: "desc" }
            ],
            take: limit
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: profile?.id,
        userId: profile?.userId,
        primarySegment: profile?.primarySegment,
        userLifecycleStage: profile?.userLifecycleStage,
        engagementScore: profile?.engagementScore,
        modelConfidence: profile?.modelConfidence
      },
      recommendations: profile?.recommendations || [],
      totalRecommendations: profile?.recommendations?.length || 0
    });
  } catch (error) {
    console.error("AI recommendations fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch AI recommendations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      tenantId,
      recommendationType = "widget",
      context = {},
      triggerEvent,
      placementLocation
    } = body;

    if (!userId || !tenantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get user profile
    const profile = await prisma.personalizationProfile.findUnique({
      where: { userId },
      include: {
        behaviorEvents: {
          take: 20,
          orderBy: { createdAt: "desc" }
        },
        preferences: {
          where: { isActive: true }
        }
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    // Generate AI-powered recommendations
    const recommendations = await generateAIRecommendations(
      profile,
      recommendationType,
      context,
      triggerEvent,
      placementLocation
    );

    return NextResponse.json({
      success: true,
      recommendations,
      totalGenerated: recommendations.length,
      profileUpdated: true
    });
  } catch (error) {
    console.error("AI recommendation generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI recommendations" },
      { status: 500 }
    );
  }
}

// Track recommendation interaction
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      recommendationId,
      interactionType, // "view", "click", "dismiss", "convert"
      feedback, // "positive", "negative", "neutral"
      feedbackReason,
      context = {}
    } = body;

    if (!recommendationId || !interactionType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const recommendation = await prisma.personalizedRecommendation.findUnique({
      where: { id: recommendationId }
    });

    if (!recommendation) {
      return NextResponse.json({ error: "Recommendation not found" }, { status: 404 });
    }

    // Update recommendation metrics
    const updateData: any = {};
    
    if (interactionType === "view") {
      updateData.impressions = recommendation.impressions + 1;
      updateData.displayedAt = updateData.displayedAt || new Date();
    } else if (interactionType === "click") {
      updateData.clicks = recommendation.clicks + 1;
      updateData.clickedAt = new Date();
      updateData.clickThroughRate = (recommendation.clicks + 1) / Math.max(recommendation.impressions, 1);
    } else if (interactionType === "convert") {
      updateData.conversions = recommendation.conversions + 1;
      updateData.convertedAt = new Date();
      updateData.status = "converted";
      updateData.conversionRate = (recommendation.conversions + 1) / Math.max(recommendation.clicks, 1);
    } else if (interactionType === "dismiss") {
      updateData.status = "dismissed";
    }

    if (feedback) {
      updateData.userFeedback = feedback;
      updateData.feedbackReason = feedbackReason;
    }

    const updatedRecommendation = await prisma.personalizedRecommendation.update({
      where: { id: recommendationId },
      data: updateData
    });

    // Record personalization event
    await prisma.personalizationEvent.create({
      data: {
        profileId: recommendation.profileId,
        eventType: interactionType,
        eventCategory: "recommendation_interaction",
        element: "recommendation",
        elementId: recommendationId,
        recommendationId,
        eventData: {
          recommendationType: recommendation.recommendationType,
          algorithmUsed: recommendation.algorithmUsed,
          confidenceScore: recommendation.confidenceScore,
          feedback,
          feedbackReason,
          ...context
        },
        sessionId: context.sessionId || "unknown"
      }
    });

    return NextResponse.json({
      success: true,
      recommendation: updatedRecommendation,
      interactionRecorded: true
    });
  } catch (error) {
    console.error("Recommendation interaction tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track recommendation interaction" },
      { status: 500 }
    );
  }
}

// Helper functions
function shouldRegenerateRecommendations(profile: any): boolean {
  if (!profile.recommendations || profile.recommendations.length === 0) {
    return true;
  }
  
  const lastUpdate = new Date(profile.lastModelUpdate);
  const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);
  
  return hoursSinceUpdate > 2; // Regenerate every 2 hours
}

async function generatePersonalizedRecommendations(
  profileId: string,
  userId: string,
  tenantId: string,
  type: string
) {
  try {
    // Get user behavior data
    const profile = await prisma.personalizationProfile.findUnique({
      where: { id: profileId },
      include: {
        behaviorEvents: {
          take: 50,
          orderBy: { createdAt: "desc" }
        },
        preferences: {
          where: { isActive: true }
        },
        contentInteractions: {
          take: 20,
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!profile) return;

    // Use AI to generate recommendations
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
          content: `Generate personalized recommendations for user profile:
            - Segment: ${profile.primarySegment}
            - Lifecycle: ${profile.userLifecycleStage}
            - Engagement Score: ${profile.engagementScore}
            - Recent Events: ${JSON.stringify(profile.behaviorEvents?.slice(0, 5))}
            - Preferences: ${JSON.stringify(profile.preferences?.slice(0, 5))}
            - Content Interactions: ${JSON.stringify(profile.contentInteractions?.slice(0, 3))}
            
            Generate 10 diverse, relevant recommendations including widgets, features, content, and actions. Consider user behavior patterns and preferences.`
        }],
        max_tokens: 2500,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const aiRecommendations = JSON.parse(aiResult.choices[0].message.content);

    // Save AI-generated recommendations
    if (aiRecommendations.recommendations) {
      for (const rec of aiRecommendations.recommendations) {
        await prisma.personalizedRecommendation.create({
          data: {
            profileId,
            recommendationType: rec.type || "widget",
            recommendedItemId: rec.itemId || `generated_${Date.now()}`,
            recommendedItemType: rec.itemType || "feature",
            title: rec.title || "Personalized Recommendation",
            description: rec.description,
            algorithmUsed: "ai_hybrid",
            confidenceScore: rec.confidence || 0.8,
            relevanceScore: rec.relevance || 0.7,
            diversityScore: rec.diversity || 0.6,
            noveltyScore: rec.novelty || 0.5,
            context: {
              generatedBy: "ai",
              userSegment: profile.primarySegment,
              userLifecycle: profile.userLifecycleStage,
              reasoning: rec.reasoning
            },
            priority: rec.priority || 50,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
          }
        });
      }
    }

    // Update profile model data
    await prisma.personalizationProfile.update({
      where: { id: profileId },
      data: {
        lastModelUpdate: new Date(),
        modelConfidence: aiRecommendations.modelConfidence || 0.8,
        trainingDataPoints: profile.trainingDataPoints + 1
      }
    });
  } catch (error) {
    console.error("Failed to generate personalized recommendations:", error);
  }
}

async function generateAIRecommendations(
  profile: any,
  recommendationType: string,
  context: any,
  triggerEvent?: string,
  placementLocation?: string
) {
  try {
    // Use AI to generate contextual recommendations
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
          content: `Generate contextual ${recommendationType} recommendations for user:
            - Profile: ${JSON.stringify({ 
              segment: profile.primarySegment,
              lifecycle: profile.userLifecycleStage,
              engagement: profile.engagementScore 
            })}
            - Context: ${JSON.stringify(context)}
            - Trigger: ${triggerEvent}
            - Placement: ${placementLocation}
            - Recent Events: ${JSON.stringify(profile.behaviorEvents?.slice(0, 3))}
            - Preferences: ${JSON.stringify(profile.preferences?.slice(0, 3))}
            
            Generate 5 highly relevant, contextual recommendations.`
        }],
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const aiRecommendations = JSON.parse(aiResult.choices[0].message.content);

    const recommendations = [];

    if (aiRecommendations.recommendations) {
      for (const rec of aiRecommendations.recommendations) {
        const recommendation = await prisma.personalizedRecommendation.create({
          data: {
            profileId: profile.id,
            recommendationType,
            recommendedItemId: rec.itemId || `contextual_${Date.now()}`,
            recommendedItemType: rec.itemType || "feature",
            title: rec.title || "Contextual Recommendation",
            description: rec.description,
            algorithmUsed: "contextual_ai",
            confidenceScore: rec.confidence || 0.85,
            relevanceScore: rec.relevance || 0.9,
            diversityScore: rec.diversity || 0.5,
            noveltyScore: rec.novelty || 0.6,
            context: {
              ...context,
              triggerEvent,
              placementLocation,
              generatedBy: "contextual_ai",
              reasoning: rec.reasoning
            },
            triggerEvent,
            placementLocation,
            priority: rec.priority || 60,
            expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours for contextual
          }
        });

        recommendations.push(recommendation);
      }
    }

    return recommendations;
  } catch (error) {
    console.error("Failed to generate AI recommendations:", error);
    return [];
  }
}
