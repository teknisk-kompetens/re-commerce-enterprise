
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("sessionId");
    const userId = searchParams.get("userId");

    if (!sessionId && !userId) {
      return NextResponse.json({ error: "Session ID or User ID required" }, { status: 400 });
    }

    let context;
    
    if (sessionId) {
      context = await prisma.personalizationContext.findUnique({
        where: { sessionId }
      });
    } else if (userId) {
      // Find most recent context for user
      const profile = await prisma.personalizationProfile.findUnique({
        where: { userId }
      });
      
      if (profile) {
        context = await prisma.personalizationContext.findFirst({
          where: { profileId: profile.id },
          orderBy: { lastActivity: "desc" }
        });
      }
    }

    if (!context) {
      return NextResponse.json({ 
        context: null,
        message: "No active context found" 
      });
    }

    // Check if context is expired
    if (new Date() > new Date(context.expiresAt)) {
      return NextResponse.json({ 
        context: null,
        message: "Context expired" 
      });
    }

    return NextResponse.json({
      success: true,
      context: {
        sessionId: context.sessionId,
        profileId: context.profileId,
        currentPage: context.currentPage,
        sessionDuration: context.sessionDuration,
        pageViews: context.pageViews,
        actionsThisSession: context.actionsThisSession,
        inferredIntent: context.inferredIntent,
        sentimentScore: context.sentimentScore,
        engagementLevel: context.engagementLevel,
        urgencyLevel: context.urgencyLevel,
        churnRisk: context.churnRisk,
        conversionProbability: context.conversionProbability,
        nextActionPrediction: context.nextActionPrediction,
        personalizations: context.personalizations,
        recommendationsCache: context.recommendationsCache,
        lastActivity: context.lastActivity
      }
    });
  } catch (error) {
    console.error("Personalization context fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch personalization context" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      userId,
      pageUrl,
      userAgent,
      deviceType,
      geoLocation = {},
      initialContext = {}
    } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    // Get or create user profile if userId provided
    let profileId = null;
    if (userId) {
      let profile = await prisma.personalizationProfile.findUnique({
        where: { userId }
      });

      if (!profile) {
        profile = await prisma.personalizationProfile.create({
          data: {
            userId,
            tenantId: initialContext.tenantId || "default",
            behaviorVector: {},
            interactionPatterns: {},
            preferenceWeights: {},
            personalizationLevel: "adaptive",
            privacyLevel: "balanced",
            primarySegment: "new_user",
            userLifecycleStage: "new"
          }
        });
      }
      profileId = profile.id;
    }

    // Create or update personalization context
    const contextData = {
      profileId,
      userAgent,
      deviceType,
      geoLocation,
      currentPage: pageUrl,
      sessionDuration: 0,
      pageViews: 1,
      actionsThisSession: 1,
      inferredIntent: "exploration",
      engagementLevel: "normal",
      urgencyLevel: "normal",
      churnRisk: 0.1,
      conversionProbability: 0.2,
      nextActionPrediction: {},
      personalizations: {},
      recommendationsCache: [],
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    };

    const context = await prisma.personalizationContext.upsert({
      where: { sessionId },
      update: {
        ...contextData,
        pageViews: { increment: 1 },
        actionsThisSession: { increment: 1 }
      },
      create: {
        sessionId,
        ...contextData
      }
    });

    return NextResponse.json({
      success: true,
      context,
      created: true
    });
  } catch (error) {
    console.error("Personalization context creation error:", error);
    return NextResponse.json(
      { error: "Failed to create personalization context" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      updates = {},
      aiUpdate = false,
      contextData = {}
    } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const context = await prisma.personalizationContext.findUnique({
      where: { sessionId }
    });

    if (!context) {
      return NextResponse.json({ error: "Context not found" }, { status: 404 });
    }

    let updateData = {
      ...updates,
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // Extend expiry
    };

    // If AI update requested, use AI to analyze and update context
    if (aiUpdate && contextData) {
      const aiUpdates = await generateAIContextUpdates(context, contextData);
      updateData = { ...updateData, ...aiUpdates };
    }

    const updatedContext = await prisma.personalizationContext.update({
      where: { sessionId },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      context: updatedContext,
      aiUpdate
    });
  } catch (error) {
    console.error("Personalization context update error:", error);
    return NextResponse.json(
      { error: "Failed to update personalization context" },
      { status: 500 }
    );
  }
}

// AI-powered context updates
async function generateAIContextUpdates(context: any, contextData: any) {
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
          content: `Update personalization context with AI insights:
            
            Current Context: ${JSON.stringify({
              sessionId: context.sessionId,
              currentPage: context.currentPage,
              sessionDuration: context.sessionDuration,
              pageViews: context.pageViews,
              actionsThisSession: context.actionsThisSession,
              inferredIntent: context.inferredIntent,
              engagementLevel: context.engagementLevel,
              churnRisk: context.churnRisk,
              conversionProbability: context.conversionProbability
            })}
            
            New Data: ${JSON.stringify(contextData)}
            
            Analyze and update:
            1. User intent progression
            2. Engagement level changes
            3. Churn risk indicators
            4. Conversion probability updates
            5. Next action predictions
            6. Urgency level assessment
            7. Sentiment analysis
            8. Personalization opportunities`
        }],
        max_tokens: 1500,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const analysis = JSON.parse(aiResult.choices[0].message.content);

    return {
      inferredIntent: analysis.inferredIntent || context.inferredIntent,
      sentimentScore: analysis.sentimentScore || context.sentimentScore,
      engagementLevel: analysis.engagementLevel || context.engagementLevel,
      urgencyLevel: analysis.urgencyLevel || context.urgencyLevel,
      churnRisk: Math.min(analysis.churnRisk || context.churnRisk, 1),
      conversionProbability: Math.min(analysis.conversionProbability || context.conversionProbability, 1),
      nextActionPrediction: analysis.nextActionPrediction || context.nextActionPrediction,
      personalizations: {
        ...context.personalizations,
        ...analysis.personalizations
      }
    };
  } catch (error) {
    console.error("Failed to generate AI context updates:", error);
    return {};
  }
}
