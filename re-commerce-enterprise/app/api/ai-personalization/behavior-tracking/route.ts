
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      tenantId,
      sessionId,
      events // Array of events to batch process
    } = body;

    if (!userId || !tenantId || !sessionId || !events || !Array.isArray(events)) {
      return NextResponse.json(
        { error: "Missing required fields or invalid events array" },
        { status: 400 }
      );
    }

    // Get or create personalization profile
    let profile = await prisma.personalizationProfile.findUnique({
      where: { userId }
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
        }
      });
    }

    // Process events in batch
    const processedEvents = [];
    const eventPromises = events.map(async (event, index) => {
      try {
        const enrichedEvent = await enrichEventWithContext(event, sessionId);
        
        const personalEvent = await prisma.personalizationEvent.create({
          data: {
            profileId: profile.id,
            eventType: event.eventType || "interaction",
            eventCategory: event.eventCategory || "ui_interaction",
            element: event.element,
            elementId: event.elementId,
            pageUrl: event.pageUrl,
            pageTitle: event.pageTitle,
            referrer: event.referrer,
            sessionId,
            deviceType: event.deviceType,
            browserType: event.browserType,
            timeOfDay: new Date().getHours(),
            dayOfWeek: new Date().getDay() + 1,
            isWorkingHours: isWorkingHours(new Date()),
            timeSpent: event.timeSpent || 0,
            recommendationId: event.recommendationId,
            experimentId: event.experimentId,
            segmentContext: event.segmentContext || [],
            eventData: {
              ...event.eventData,
              ...enrichedEvent.aiContext
            },
            previousEvent: event.previousEvent,
            eventSequence: index + 1,
            processed: false,
            contributesToModel: true
          }
        });

        processedEvents.push(personalEvent);
        return personalEvent;
      } catch (error) {
        console.error(`Failed to process event ${index}:`, error);
        return null;
      }
    });

    await Promise.all(eventPromises);

    // Analyze behavior patterns with AI
    const behaviorAnalysis = await analyzeUserBehaviorWithAI(profile.id, events, sessionId);

    // Update personalization profile with new insights
    await updateProfileWithBehaviorInsights(profile.id, behaviorAnalysis, events);

    // Generate real-time personalization context
    const personalizationContext = await updatePersonalizationContext(
      sessionId, 
      profile.id, 
      events, 
      behaviorAnalysis
    );

    return NextResponse.json({
      success: true,
      eventsProcessed: processedEvents.length,
      behaviorAnalysis,
      personalizationContext,
      profileUpdated: true
    });
  } catch (error) {
    console.error("Behavior tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track user behavior" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const sessionId = searchParams.get("sessionId");
    const limit = parseInt(searchParams.get("limit") || "50");

    if (!userId && !sessionId) {
      return NextResponse.json({ error: "User ID or Session ID required" }, { status: 400 });
    }

    let whereClause: any = {};
    
    if (userId) {
      const profile = await prisma.personalizationProfile.findUnique({
        where: { userId }
      });
      
      if (profile) {
        whereClause.profileId = profile.id;
      } else {
        return NextResponse.json({ events: [], behaviorAnalysis: null });
      }
    }
    
    if (sessionId) {
      whereClause.sessionId = sessionId;
    }

    const events = await prisma.personalizationEvent.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        profile: {
          select: {
            userId: true,
            primarySegment: true,
            userLifecycleStage: true,
            engagementScore: true
          }
        }
      }
    });

    // Generate behavior analysis
    const behaviorAnalysis = await generateBehaviorAnalysis(events);

    return NextResponse.json({
      success: true,
      events,
      totalEvents: events.length,
      behaviorAnalysis
    });
  } catch (error) {
    console.error("Behavior data fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch behavior data" },
      { status: 500 }
    );
  }
}

// Helper functions
async function enrichEventWithContext(event: any, sessionId: string) {
  try {
    // Use AI to extract insights from event
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
          content: `Analyze user behavior event and extract insights:
            Event: ${JSON.stringify(event)}
            Session: ${sessionId}
            
            Extract user intent, engagement level, sentiment, and behavior patterns. Provide context for personalization.`
        }],
        max_tokens: 1000,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const analysis = JSON.parse(aiResult.choices[0].message.content);

    return {
      aiContext: {
        inferredIntent: analysis.intent || "unknown",
        engagementLevel: analysis.engagementLevel || "normal",
        sentiment: analysis.sentiment || "neutral",
        behaviorPattern: analysis.behaviorPattern || "standard",
        insights: analysis.insights || []
      }
    };
  } catch (error) {
    console.error("Failed to enrich event with AI context:", error);
    return {
      aiContext: {
        inferredIntent: "unknown",
        engagementLevel: "normal",
        sentiment: "neutral"
      }
    };
  }
}

async function analyzeUserBehaviorWithAI(profileId: string, events: any[], sessionId: string) {
  try {
    // Get historical behavior data
    const historicalEvents = await prisma.personalizationEvent.findMany({
      where: { profileId },
      orderBy: { createdAt: "desc" },
      take: 100
    });

    // Use AI to analyze behavior patterns
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
          content: `Analyze user behavior patterns and generate insights:
            Current Session Events: ${JSON.stringify(events)}
            Historical Events: ${JSON.stringify(historicalEvents.slice(0, 20))}
            
            Analyze:
            1. Behavior patterns and trends
            2. User intent and goals
            3. Engagement levels and quality
            4. Personalization opportunities
            5. Churn risk indicators
            6. Lifecycle stage progression
            7. Content preferences
            8. Feature usage patterns
            
            Provide actionable insights for personalization.`
        }],
        max_tokens: 2500,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const analysis = JSON.parse(aiResult.choices[0].message.content);

    return {
      behaviorPatterns: analysis.behaviorPatterns || [],
      userIntent: analysis.userIntent || "exploration",
      engagementLevel: analysis.engagementLevel || "normal",
      churnRisk: analysis.churnRisk || 0.1,
      lifecycleStage: analysis.lifecycleStage || "active",
      contentPreferences: analysis.contentPreferences || [],
      featureAffinities: analysis.featureAffinities || [],
      personalizationOpportunities: analysis.personalizationOpportunities || [],
      insights: analysis.insights || [],
      recommendations: analysis.recommendations || []
    };
  } catch (error) {
    console.error("Failed to analyze behavior with AI:", error);
    return {
      behaviorPatterns: [],
      userIntent: "unknown",
      engagementLevel: "normal",
      churnRisk: 0.1,
      insights: []
    };
  }
}

async function updateProfileWithBehaviorInsights(profileId: string, analysis: any, events: any[]) {
  try {
    const profile = await prisma.personalizationProfile.findUnique({
      where: { id: profileId }
    });

    if (!profile) return;

    // Calculate engagement score
    const engagementScore = calculateEngagementScore(events, analysis);
    
    // Update profile with AI insights
    await prisma.personalizationProfile.update({
      where: { id: profileId },
      data: {
        behaviorVector: {
          ...profile.behaviorVector as any,
          lastSession: analysis.behaviorPatterns,
          engagementTrend: analysis.engagementLevel,
          intentSignals: analysis.userIntent
        },
        interactionPatterns: {
          ...profile.interactionPatterns as any,
          recentPatterns: analysis.behaviorPatterns,
          featureAffinities: analysis.featureAffinities,
          contentPreferences: analysis.contentPreferences
        },
        primarySegment: analysis.suggestedSegment || profile.primarySegment,
        userLifecycleStage: analysis.lifecycleStage || profile.userLifecycleStage,
        churnProbability: Math.min(analysis.churnRisk || 0, 1),
        engagementScore: engagementScore,
        trainingDataPoints: profile.trainingDataPoints + events.length,
        lastModelUpdate: new Date()
      }
    });
  } catch (error) {
    console.error("Failed to update profile with behavior insights:", error);
  }
}

async function updatePersonalizationContext(
  sessionId: string, 
  profileId: string, 
  events: any[], 
  analysis: any
) {
  try {
    // Get or create personalization context
    let context = await prisma.personalizationContext.findUnique({
      where: { sessionId }
    });

    const currentPage = events[events.length - 1]?.pageUrl || context?.currentPage;
    const actionsThisSession = (context?.actionsThisSession || 0) + events.length;

    const contextData = {
      profileId,
      deviceType: events[0]?.deviceType || context?.deviceType,
      browserType: events[0]?.browserType || context?.browserType,
      currentPage,
      sessionDuration: context ? (Date.now() - new Date(context.createdAt).getTime()) : 0,
      pageViews: (context?.pageViews || 0) + events.filter(e => e.eventType === "page_view").length,
      actionsThisSession,
      inferredIntent: analysis.userIntent,
      sentimentScore: calculateSentimentScore(events),
      engagementLevel: analysis.engagementLevel,
      urgencyLevel: calculateUrgencyLevel(events, analysis),
      churnRisk: analysis.churnRisk || 0,
      conversionProbability: calculateConversionProbability(events, analysis),
      nextActionPrediction: analysis.recommendations?.slice(0, 3) || [],
      lastActivity: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    };

    if (context) {
      context = await prisma.personalizationContext.update({
        where: { sessionId },
        data: contextData
      });
    } else {
      context = await prisma.personalizationContext.create({
        data: {
          sessionId,
          ...contextData
        }
      });
    }

    return context;
  } catch (error) {
    console.error("Failed to update personalization context:", error);
    return null;
  }
}

async function generateBehaviorAnalysis(events: any[]) {
  if (events.length === 0) return null;

  try {
    // Use AI to analyze event patterns
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
          content: `Analyze these user behavior events and generate insights:
            Events: ${JSON.stringify(events.slice(0, 10))}
            
            Provide:
            1. Behavior summary
            2. Engagement patterns
            3. User journey insights
            4. Potential issues or opportunities`
        }],
        max_tokens: 1500,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    return JSON.parse(aiResult.choices[0].message.content);
  } catch (error) {
    console.error("Failed to generate behavior analysis:", error);
    return {
      summary: "Analysis unavailable",
      patterns: [],
      insights: []
    };
  }
}

// Utility functions
function isWorkingHours(date: Date): boolean {
  const hour = date.getHours();
  const day = date.getDay();
  return day >= 1 && day <= 5 && hour >= 9 && hour <= 17;
}

function calculateEngagementScore(events: any[], analysis: any): number {
  let score = 0;
  
  // Base score from event count
  score += Math.min(events.length * 0.1, 0.4);
  
  // Engagement from time spent
  const totalTime = events.reduce((sum, e) => sum + (e.timeSpent || 0), 0);
  score += Math.min(totalTime / 60000 * 0.1, 0.3); // Convert to minutes
  
  // AI-analyzed engagement level
  if (analysis.engagementLevel === "high") score += 0.3;
  else if (analysis.engagementLevel === "very_high") score += 0.5;
  else if (analysis.engagementLevel === "low") score -= 0.2;
  
  return Math.max(0, Math.min(1, score));
}

function calculateSentimentScore(events: any[]): number {
  const sentiments = events
    .map(e => e.eventData?.sentiment)
    .filter(s => s !== undefined);
  
  if (sentiments.length === 0) return 0;
  
  return sentiments.reduce((sum, s) => sum + s, 0) / sentiments.length;
}

function calculateUrgencyLevel(events: any[], analysis: any): string {
  const quickActions = events.filter(e => 
    e.eventType === "click" && 
    (e.timeSpent || 0) < 1000
  ).length;
  
  const sessionLength = events.length;
  
  if (quickActions > sessionLength * 0.7) return "high";
  if (analysis.churnRisk > 0.7) return "urgent";
  if (quickActions > sessionLength * 0.4) return "normal";
  
  return "low";
}

function calculateConversionProbability(events: any[], analysis: any): number {
  let probability = 0.1; // Base probability
  
  // High engagement increases probability
  if (analysis.engagementLevel === "high" || analysis.engagementLevel === "very_high") {
    probability += 0.3;
  }
  
  // Specific actions that indicate conversion intent
  const conversionSignals = events.filter(e => 
    e.eventType === "click" && 
    (e.element?.includes("button") || e.element?.includes("cta"))
  ).length;
  
  probability += Math.min(conversionSignals * 0.1, 0.4);
  
  // Low churn risk increases probability
  if ((analysis.churnRisk || 0) < 0.3) {
    probability += 0.2;
  }
  
  return Math.max(0, Math.min(1, probability));
}
