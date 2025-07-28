
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const tenantId = searchParams.get("tenantId");
    const includeRelations = searchParams.get("include") === "true";

    if (!userId || !tenantId) {
      return NextResponse.json({ error: "User ID and Tenant ID required" }, { status: 400 });
    }

    const includeConfig = includeRelations ? {
      behaviorEvents: {
        take: 20,
        orderBy: { createdAt: "desc" as const }
      },
      recommendations: {
        where: { status: "active" },
        take: 10,
        orderBy: { createdAt: "desc" as const }
      },
      experiments: {
        where: { status: "active" },
        take: 5
      },
      preferences: {
        where: { isActive: true },
        take: 20
      },
      journeySteps: {
        take: 10,
        orderBy: { createdAt: "desc" as const }
      },
      contentInteractions: {
        take: 15,
        orderBy: { createdAt: "desc" as const }
      }
    } : {};

    const profile = await prisma.personalizationProfile.findUnique({
      where: { userId },
      include: includeConfig
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Generate AI insights for the profile
    const aiInsights = await generateProfileInsights(profile);

    return NextResponse.json({
      success: true,
      profile: {
        id: profile.id,
        userId: profile.userId,
        tenantId: profile.tenantId,
        behaviorVector: profile.behaviorVector,
        interactionPatterns: profile.interactionPatterns,
        preferenceWeights: profile.preferenceWeights,
        personalizationLevel: profile.personalizationLevel,
        privacyLevel: profile.privacyLevel,
        primarySegment: profile.primarySegment,
        secondarySegments: profile.secondarySegments,
        userLifecycleStage: profile.userLifecycleStage,
        churnProbability: profile.churnProbability,
        lifetimeValueTier: profile.lifetimeValueTier,
        engagementScore: profile.engagementScore,
        satisfactionScore: profile.satisfactionScore,
        personalizationROI: profile.personalizationROI,
        adaptationSpeed: profile.adaptationSpeed,
        trainingDataPoints: profile.trainingDataPoints,
        modelConfidence: profile.modelConfidence,
        lastModelUpdate: profile.lastModelUpdate,
        modelVersion: profile.modelVersion,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
        ...(includeRelations && {
          behaviorEvents: profile.behaviorEvents,
          recommendations: profile.recommendations,
          experiments: profile.experiments,
          preferences: profile.preferences,
          journeySteps: profile.journeySteps,
          contentInteractions: profile.contentInteractions
        })
      },
      aiInsights,
      includeRelations
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch personalization profile" },
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
      initialData = {},
      personalizationLevel = "adaptive",
      privacyLevel = "balanced",
      consentGiven = false
    } = body;

    if (!userId || !tenantId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if profile already exists
    const existingProfile = await prisma.personalizationProfile.findUnique({
      where: { userId }
    });

    if (existingProfile) {
      return NextResponse.json({ 
        error: "Profile already exists",
        profileId: existingProfile.id 
      }, { status: 409 });
    }

    // Use AI to initialize profile with smart defaults
    const aiInitialization = await initializeProfileWithAI(userId, tenantId, initialData);

    // Create new personalization profile
    const profile = await prisma.personalizationProfile.create({
      data: {
        userId,
        tenantId,
        behaviorVector: aiInitialization.behaviorVector || {},
        interactionPatterns: aiInitialization.interactionPatterns || {},
        preferenceWeights: aiInitialization.preferenceWeights || {},
        personalizationLevel,
        privacyLevel,
        consentGiven,
        consentDate: consentGiven ? new Date() : null,
        primarySegment: aiInitialization.primarySegment || "new_user",
        secondarySegments: aiInitialization.secondarySegments || [],
        userLifecycleStage: "new",
        churnProbability: 0.1,
        lifetimeValueTier: "bronze",
        engagementScore: 0.0,
        satisfactionScore: 0.0,
        personalizationROI: 0.0,
        adaptationSpeed: 0.5,
        trainingDataPoints: 0,
        modelConfidence: 0.5,
        modelVersion: "1.0"
      }
    });

    return NextResponse.json({
      success: true,
      profile,
      aiInitialization,
      created: true
    });
  } catch (error) {
    console.error("Profile creation error:", error);
    return NextResponse.json(
      { error: "Failed to create personalization profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      updates = {},
      operationType = "manual_update", // "manual_update", "ai_update", "behavior_update", "preference_update"
      behaviorData = {},
      preferenceData = {}
    } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const profile = await prisma.personalizationProfile.findUnique({
      where: { userId },
      include: {
        behaviorEvents: {
          take: 50,
          orderBy: { createdAt: "desc" }
        },
        preferences: {
          where: { isActive: true }
        }
      }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    let updateData = { ...updates };

    switch (operationType) {
      case "ai_update":
        const aiUpdates = await generateAIProfileUpdates(profile, behaviorData);
        updateData = { ...updateData, ...aiUpdates };
        break;

      case "behavior_update":
        const behaviorUpdates = await processBehaviorUpdate(profile, behaviorData);
        updateData = { ...updateData, ...behaviorUpdates };
        break;

      case "preference_update":
        const preferenceUpdates = await processPreferenceUpdate(profile, preferenceData);
        updateData = { ...updateData, ...preferenceUpdates };
        break;
    }

    // Always update lastModelUpdate when making changes
    updateData.lastModelUpdate = new Date();
    updateData.updatedAt = new Date();

    const updatedProfile = await prisma.personalizationProfile.update({
      where: { userId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      operationType,
      updated: true
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update personalization profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const deleteType = searchParams.get("type") || "soft"; // "soft", "hard", "anonymize"

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const profile = await prisma.personalizationProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    let result;

    switch (deleteType) {
      case "hard":
        // Permanently delete all data
        await prisma.personalizationProfile.delete({
          where: { userId }
        });
        result = { deleted: true, type: "hard" };
        break;

      case "anonymize":
        // Anonymize but keep aggregated data
        const anonymizedProfile = await anonymizeProfile(profile);
        result = { anonymized: true, type: "anonymize", profile: anonymizedProfile };
        break;

      case "soft":
      default:
        // Soft delete - mark as inactive
        const softDeletedProfile = await prisma.personalizationProfile.update({
          where: { userId },
          data: {
            // Clear personal data but keep aggregated insights
            behaviorVector: {},
            interactionPatterns: {},
            preferenceWeights: {},
            consentGiven: false,
            consentDate: null,
            metadata: { deleted: true, deletedAt: new Date() }
          }
        });
        result = { deleted: true, type: "soft", profile: softDeletedProfile };
        break;
    }

    return NextResponse.json({
      success: true,
      userId,
      result
    });
  } catch (error) {
    console.error("Profile deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete personalization profile" },
      { status: 500 }
    );
  }
}

// Helper functions
async function generateProfileInsights(profile: any) {
  try {
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
          content: `Generate AI insights for user personalization profile:
            
            Profile: ${JSON.stringify({
              primarySegment: profile.primarySegment,
              userLifecycleStage: profile.userLifecycleStage,
              engagementScore: profile.engagementScore,
              churnProbability: profile.churnProbability,
              lifetimeValueTier: profile.lifetimeValueTier,
              trainingDataPoints: profile.trainingDataPoints,
              modelConfidence: profile.modelConfidence
            })}
            
            Recent Events: ${JSON.stringify((profile.behaviorEvents || []).slice(0, 5))}
            Active Preferences: ${JSON.stringify((profile.preferences || []).slice(0, 5))}
            
            Provide:
            1. User profile summary
            2. Engagement insights
            3. Personalization opportunities
            4. Risk factors and mitigation
            5. Growth potential
            6. Recommended actions`
        }],
        max_tokens: 1500,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    return JSON.parse(aiResult.choices[0].message.content);
  } catch (error) {
    console.error("Failed to generate profile insights:", error);
    return {
      summary: "Profile analysis unavailable",
      insights: [],
      recommendations: []
    };
  }
}

async function initializeProfileWithAI(userId: string, tenantId: string, initialData: any) {
  try {
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
          content: `Initialize personalization profile with smart defaults:
            
            User ID: ${userId}
            Tenant ID: ${tenantId}
            Initial Data: ${JSON.stringify(initialData)}
            
            Generate:
            1. Initial behavior vector
            2. Interaction pattern templates
            3. Preference weight defaults
            4. Primary segment classification
            5. Secondary segment suggestions
            6. Lifecycle stage assessment`
        }],
        max_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    return JSON.parse(aiResult.choices[0].message.content);
  } catch (error) {
    console.error("Failed to initialize profile with AI:", error);
    return {
      behaviorVector: {},
      interactionPatterns: {},
      preferenceWeights: {},
      primarySegment: "new_user",
      secondarySegments: []
    };
  }
}

async function generateAIProfileUpdates(profile: any, behaviorData: any) {
  try {
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
          content: `Update personalization profile with AI analysis:
            
            Current Profile: ${JSON.stringify({
              primarySegment: profile.primarySegment,
              userLifecycleStage: profile.userLifecycleStage,
              engagementScore: profile.engagementScore,
              churnProbability: profile.churnProbability,
              behaviorVector: profile.behaviorVector,
              interactionPatterns: profile.interactionPatterns
            })}
            
            New Behavior Data: ${JSON.stringify(behaviorData)}
            Recent Events: ${JSON.stringify((profile.behaviorEvents || []).slice(0, 10))}
            
            Update:
            1. Behavior vector evolution
            2. Interaction pattern changes
            3. Engagement score adjustment
            4. Churn probability update
            5. Segment migration assessment
            6. Lifecycle stage progression`
        }],
        max_tokens: 1500,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const updates = JSON.parse(aiResult.choices[0].message.content);

    return {
      behaviorVector: updates.behaviorVector || profile.behaviorVector,
      interactionPatterns: updates.interactionPatterns || profile.interactionPatterns,
      engagementScore: Math.min(updates.engagementScore || profile.engagementScore, 1),
      churnProbability: Math.min(updates.churnProbability || profile.churnProbability, 1),
      primarySegment: updates.primarySegment || profile.primarySegment,
      userLifecycleStage: updates.userLifecycleStage || profile.userLifecycleStage,
      modelConfidence: updates.modelConfidence || profile.modelConfidence,
      trainingDataPoints: profile.trainingDataPoints + 1
    };
  } catch (error) {
    console.error("Failed to generate AI profile updates:", error);
    return {};
  }
}

async function processBehaviorUpdate(profile: any, behaviorData: any) {
  // Process behavior data and update relevant profile fields
  const updates: any = {
    trainingDataPoints: profile.trainingDataPoints + 1
  };

  if (behaviorData.engagementLevel) {
    const engagementMap = {
      "very_low": 0.1,
      "low": 0.3,
      "normal": 0.5,
      "high": 0.7,
      "very_high": 0.9
    };
    updates.engagementScore = engagementMap[behaviorData.engagementLevel as keyof typeof engagementMap] || profile.engagementScore;
  }

  if (behaviorData.actions && Array.isArray(behaviorData.actions)) {
    const actionCount = behaviorData.actions.length;
    const engagementBoost = Math.min(actionCount * 0.05, 0.2);
    updates.engagementScore = Math.min((profile.engagementScore || 0) + engagementBoost, 1);
  }

  return updates;
}

async function processPreferenceUpdate(profile: any, preferenceData: any) {
  // Process preference updates
  const currentWeights = profile.preferenceWeights || {};
  const newWeights = { ...currentWeights };

  if (preferenceData.preferences && Array.isArray(preferenceData.preferences)) {
    for (const pref of preferenceData.preferences) {
      if (pref.category && pref.weight !== undefined) {
        newWeights[pref.category] = pref.weight;
      }
    }
  }

  return {
    preferenceWeights: newWeights,
    trainingDataPoints: profile.trainingDataPoints + 1
  };
}

async function anonymizeProfile(profile: any) {
  const anonymizedId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return await prisma.personalizationProfile.update({
    where: { id: profile.id },
    data: {
      userId: anonymizedId,
      behaviorVector: {},
      interactionPatterns: {},
      preferenceWeights: {},
      consentGiven: false,
      consentDate: null,
      metadata: {
        anonymized: true,
        anonymizedAt: new Date(),
        originalSegment: profile.primarySegment,
        originalLifecycleStage: profile.userLifecycleStage
      }
    }
  });
}
