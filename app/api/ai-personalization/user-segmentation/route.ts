
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const tenantId = searchParams.get("tenantId");
    const segmentType = searchParams.get("type") || "all";

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    if (userId) {
      // Get specific user's segmentation
      const userSegmentation = await getUserSegmentation(userId, tenantId);
      return NextResponse.json({
        success: true,
        userId,
        segmentation: userSegmentation
      });
    } else {
      // Get all segments for tenant
      const allSegments = await getAllSegments(tenantId, segmentType);
      return NextResponse.json({
        success: true,
        tenantId,
        segments: allSegments
      });
    }
  } catch (error) {
    console.error("User segmentation fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user segmentation" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      tenantId,
      operationType, // "segment_user", "create_segment", "update_segments", "analyze_segments"
      userId,
      segmentConfig,
      userIds = []
    } = body;

    if (!tenantId || !operationType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let result;

    switch (operationType) {
      case "segment_user":
        if (!userId) {
          return NextResponse.json({ error: "User ID required for user segmentation" }, { status: 400 });
        }
        result = await segmentSingleUser(userId, tenantId);
        break;

      case "create_segment":
        if (!segmentConfig) {
          return NextResponse.json({ error: "Segment config required" }, { status: 400 });
        }
        result = await createDynamicSegment(tenantId, segmentConfig);
        break;

      case "update_segments":
        result = await updateAllSegments(tenantId);
        break;

      case "analyze_segments":
        result = await analyzeSegmentPerformance(tenantId);
        break;

      case "batch_segment":
        if (userIds.length === 0) {
          return NextResponse.json({ error: "User IDs required for batch segmentation" }, { status: 400 });
        }
        result = await batchSegmentUsers(userIds, tenantId);
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
    console.error("User segmentation operation error:", error);
    return NextResponse.json(
      { error: "Failed to process segmentation operation" },
      { status: 500 }
    );
  }
}

// Get individual user segmentation
async function getUserSegmentation(userId: string, tenantId: string) {
  try {
    const profile = await prisma.personalizationProfile.findUnique({
      where: { userId },
      include: {
        behaviorEvents: {
          take: 50,
          orderBy: { createdAt: "desc" }
        },
        contentInteractions: {
          take: 30,
          orderBy: { createdAt: "desc" }
        },
        preferences: {
          where: { isActive: true }
        }
      }
    });

    if (!profile) {
      return { error: "User profile not found" };
    }

    // Get current segment memberships
    const segmentMemberships = await prisma.segmentMembership.findMany({
      where: { userId },
      include: {
        segment: true
      },
      orderBy: { membershipScore: "desc" }
    });

    // Use AI to analyze and update user segmentation
    const aiSegmentation = await performAISegmentation(profile);

    return {
      userId,
      currentProfile: {
        primarySegment: profile.primarySegment,
        secondarySegments: profile.secondarySegments,
        userLifecycleStage: profile.userLifecycleStage,
        engagementScore: profile.engagementScore,
        churnProbability: profile.churnProbability
      },
      segmentMemberships,
      aiSegmentation,
      recommendations: aiSegmentation.recommendations || []
    };
  } catch (error) {
    console.error("Failed to get user segmentation:", error);
    return { error: "Segmentation analysis failed" };
  }
}

// Get all segments for tenant
async function getAllSegments(tenantId: string, segmentType: string) {
  try {
    const whereClause: any = { tenantId };
    if (segmentType !== "all") {
      whereClause.segmentType = segmentType;
    }

    const segments = await prisma.behavioralSegment.findMany({
      where: whereClause,
      include: {
        segmentMemberships: {
          take: 10, // Sample memberships
          orderBy: { membershipScore: "desc" }
        },
        _count: {
          select: {
            segmentMemberships: true
          }
        }
      },
      orderBy: { userCount: "desc" }
    });

    // Get segment analytics
    const segmentAnalytics = await analyzeSegments(segments);

    return {
      segments: segments.map(segment => ({
        id: segment.id,
        segmentName: segment.segmentName,
        segmentType: segment.segmentType,
        userCount: segment.userCount,
        isActive: segment.isActive,
        autoUpdate: segment.autoUpdate,
        description: segment.description,
        tags: segment.tags,
        criteria: segment.criteria,
        sampleMemberships: segment.segmentMemberships,
        membershipCount: segment._count.segmentMemberships
      })),
      analytics: segmentAnalytics,
      totalSegments: segments.length,
      activeSegments: segments.filter(s => s.isActive).length
    };
  } catch (error) {
    console.error("Failed to get all segments:", error);
    return { error: "Failed to fetch segments" };
  }
}

// AI-powered user segmentation
async function performAISegmentation(profile: any) {
  try {
    // Prepare user data for AI analysis
    const userData = {
      profile: {
        primarySegment: profile.primarySegment,
        userLifecycleStage: profile.userLifecycleStage,
        engagementScore: profile.engagementScore,
        churnProbability: profile.churnProbability,
        behaviorVector: profile.behaviorVector,
        interactionPatterns: profile.interactionPatterns
      },
      recentBehavior: profile.behaviorEvents?.slice(0, 20) || [],
      contentInteractions: profile.contentInteractions?.slice(0, 15) || [],
      preferences: profile.preferences || []
    };

    // Use AI to determine optimal segmentation
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
          content: `Analyze user data and determine optimal segmentation:
            
            User Data: ${JSON.stringify(userData)}
            
            Determine:
            1. Primary segment (power_user, casual_user, new_user, at_risk_user, churned_user, enterprise_user)
            2. Secondary segments (behavioral, demographic, psychographic traits)
            3. Lifecycle stage (new, active, engaged, power, at_risk, dormant, churned)
            4. Engagement level (low, medium, high, very_high)
            5. Value tier (bronze, silver, gold, platinum)
            6. Risk factors and churn probability
            7. Personalization opportunities
            8. Segment migration recommendations
            
            Provide confidence scores and reasoning for each classification.`
        }],
        max_tokens: 2500,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const segmentation = JSON.parse(aiResult.choices[0].message.content);

    // Update user profile with new segmentation
    await updateUserSegmentation(profile.id, segmentation);

    return {
      primarySegment: segmentation.primarySegment || profile.primarySegment,
      secondarySegments: segmentation.secondarySegments || [],
      lifecycleStage: segmentation.lifecycleStage || profile.userLifecycleStage,
      engagementLevel: segmentation.engagementLevel || "medium",
      valueTier: segmentation.valueTier || "bronze",
      churnProbability: segmentation.churnProbability || profile.churnProbability,
      riskFactors: segmentation.riskFactors || [],
      confidence: segmentation.confidence || 0.8,
      reasoning: segmentation.reasoning || [],
      recommendations: segmentation.recommendations || [],
      migrationPath: segmentation.migrationPath || null
    };
  } catch (error) {
    console.error("Failed to perform AI segmentation:", error);
    return {
      primarySegment: profile.primarySegment,
      error: "AI segmentation failed",
      confidence: 0.5
    };
  }
}

// Segment single user
async function segmentSingleUser(userId: string, tenantId: string) {
  try {
    const profile = await prisma.personalizationProfile.findUnique({
      where: { userId },
      include: {
        behaviorEvents: {
          take: 50,
          orderBy: { createdAt: "desc" }
        },
        contentInteractions: {
          take: 30,
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!profile) {
      return { error: "User profile not found" };
    }

    const segmentation = await performAISegmentation(profile);

    // Update segment memberships
    await updateSegmentMemberships(userId, segmentation, tenantId);

    return {
      userId,
      segmentation,
      updated: true
    };
  } catch (error) {
    console.error("Failed to segment single user:", error);
    return { error: "User segmentation failed" };
  }
}

// Create dynamic segment
async function createDynamicSegment(tenantId: string, segmentConfig: any) {
  try {
    // Use AI to optimize segment configuration
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
          content: `Optimize segment configuration and create criteria:
            
            Segment Config: ${JSON.stringify(segmentConfig)}
            
            Create:
            1. Optimized segment criteria
            2. Segment description
            3. Target characteristics
            4. Membership rules
            5. Auto-update logic
            6. Success metrics`
        }],
        max_tokens: 1500,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    const optimizedConfig = JSON.parse(aiResult.choices[0].message.content);

    // Create segment
    const segment = await prisma.behavioralSegment.create({
      data: {
        tenantId,
        segmentName: segmentConfig.segmentName,
        segmentType: segmentConfig.segmentType || "behavioral",
        criteria: optimizedConfig.criteria || segmentConfig.criteria,
        description: optimizedConfig.description || segmentConfig.description,
        tags: segmentConfig.tags || [],
        autoUpdate: segmentConfig.autoUpdate !== false,
        isActive: true
      }
    });

    // Populate segment with initial members
    await populateSegmentMembers(segment.id, segment.criteria, tenantId);

    return {
      segment,
      optimizedConfig,
      created: true
    };
  } catch (error) {
    console.error("Failed to create dynamic segment:", error);
    return { error: "Segment creation failed" };
  }
}

// Update all segments
async function updateAllSegments(tenantId: string) {
  try {
    const segments = await prisma.behavioralSegment.findMany({
      where: { tenantId, isActive: true, autoUpdate: true }
    });

    const updateResults = [];

    for (const segment of segments) {
      try {
        const result = await updateSegmentMemberships_v2(segment);
        updateResults.push({
          segmentId: segment.id,
          segmentName: segment.segmentName,
          ...result
        });
      } catch (error) {
        updateResults.push({
          segmentId: segment.id,
          segmentName: segment.segmentName,
          error: error.message
        });
      }
    }

    return {
      totalSegments: segments.length,
      updateResults,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Failed to update all segments:", error);
    return { error: "Segment update failed" };
  }
}

// Analyze segment performance
async function analyzeSegmentPerformance(tenantId: string) {
  try {
    const segments = await prisma.behavioralSegment.findMany({
      where: { tenantId },
      include: {
        segmentMemberships: {
          take: 100,
          orderBy: { membershipScore: "desc" }
        }
      }
    });

    // Use AI to analyze segment performance
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
          content: `Analyze segment performance and provide insights:
            
            Segments: ${JSON.stringify(segments.map(s => ({
              name: s.segmentName,
              type: s.segmentType,
              userCount: s.userCount,
              membershipCount: s.segmentMemberships.length,
              criteria: s.criteria
            })))}
            
            Provide:
            1. Segment effectiveness analysis
            2. Overlap detection
            3. Growth opportunities
            4. Optimization recommendations
            5. Performance metrics
            6. Migration patterns`
        }],
        max_tokens: 2500,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    return JSON.parse(aiResult.choices[0].message.content);
  } catch (error) {
    console.error("Failed to analyze segment performance:", error);
    return { error: "Segment analysis failed" };
  }
}

// Batch segment users
async function batchSegmentUsers(userIds: string[], tenantId: string) {
  try {
    const profiles = await prisma.personalizationProfile.findMany({
      where: {
        userId: { in: userIds },
        tenantId
      },
      include: {
        behaviorEvents: {
          take: 20,
          orderBy: { createdAt: "desc" }
        }
      }
    });

    const segmentationResults = [];

    for (const profile of profiles) {
      try {
        const segmentation = await performAISegmentation(profile);
        await updateSegmentMemberships(profile.userId, segmentation, tenantId);
        
        segmentationResults.push({
          userId: profile.userId,
          segmentation,
          success: true
        });
      } catch (error) {
        segmentationResults.push({
          userId: profile.userId,
          error: error.message,
          success: false
        });
      }
    }

    return {
      totalUsers: userIds.length,
      processedUsers: profiles.length,
      segmentationResults,
      successCount: segmentationResults.filter(r => r.success).length
    };
  } catch (error) {
    console.error("Failed to batch segment users:", error);
    return { error: "Batch segmentation failed" };
  }
}

// Helper functions
async function updateUserSegmentation(profileId: string, segmentation: any) {
  try {
    await prisma.personalizationProfile.update({
      where: { id: profileId },
      data: {
        primarySegment: segmentation.primarySegment,
        secondarySegments: segmentation.secondarySegments || [],
        userLifecycleStage: segmentation.lifecycleStage,
        churnProbability: segmentation.churnProbability,
        lastModelUpdate: new Date()
      }
    });
  } catch (error) {
    console.error("Failed to update user segmentation:", error);
  }
}

async function updateSegmentMemberships(userId: string, segmentation: any, tenantId: string) {
  try {
    // Remove old memberships
    await prisma.segmentMembership.deleteMany({
      where: { userId }
    });

    // Add new memberships based on segmentation
    const segments = await prisma.behavioralSegment.findMany({
      where: { tenantId, isActive: true }
    });

    for (const segment of segments) {
      const membershipScore = calculateMembershipScore(segmentation, segment);
      
      if (membershipScore > 0.3) { // Threshold for membership
        await prisma.segmentMembership.create({
          data: {
            segmentId: segment.id,
            userId,
            membershipScore,
            isActive: true
          }
        });
      }
    }
  } catch (error) {
    console.error("Failed to update segment memberships:", error);
  }
}

async function updateSegmentMemberships_v2(segment: any) {
  try {
    // Get current members
    const currentMembers = await prisma.segmentMembership.findMany({
      where: { segmentId: segment.id }
    });

    // Evaluate all users for this segment
    const profiles = await prisma.personalizationProfile.findMany({
      where: { tenantId: segment.tenantId }
    });

    let addedMembers = 0;
    let removedMembers = 0;
    let updatedMembers = 0;

    for (const profile of profiles) {
      const membershipScore = await evaluateSegmentMembership(profile, segment.criteria);
      const existingMembership = currentMembers.find(m => m.userId === profile.userId);

      if (membershipScore > 0.3) {
        if (existingMembership) {
          // Update existing membership
          if (Math.abs(existingMembership.membershipScore - membershipScore) > 0.1) {
            await prisma.segmentMembership.update({
              where: { id: existingMembership.id },
              data: { 
                membershipScore,
                lastActivity: new Date()
              }
            });
            updatedMembers++;
          }
        } else {
          // Add new membership
          await prisma.segmentMembership.create({
            data: {
              segmentId: segment.id,
              userId: profile.userId,
              membershipScore,
              isActive: true
            }
          });
          addedMembers++;
        }
      } else if (existingMembership) {
        // Remove membership
        await prisma.segmentMembership.delete({
          where: { id: existingMembership.id }
        });
        removedMembers++;
      }
    }

    // Update segment user count
    const totalMembers = await prisma.segmentMembership.count({
      where: { segmentId: segment.id, isActive: true }
    });

    await prisma.behavioralSegment.update({
      where: { id: segment.id },
      data: { 
        userCount: totalMembers,
        lastUpdated: new Date()
      }
    });

    return {
      addedMembers,
      removedMembers,
      updatedMembers,
      totalMembers
    };
  } catch (error) {
    console.error("Failed to update segment memberships:", error);
    throw error;
  }
}

async function populateSegmentMembers(segmentId: string, criteria: any, tenantId: string) {
  try {
    const profiles = await prisma.personalizationProfile.findMany({
      where: { tenantId },
      take: 1000 // Process in batches
    });

    let membersAdded = 0;

    for (const profile of profiles) {
      const membershipScore = await evaluateSegmentMembership(profile, criteria);
      
      if (membershipScore > 0.3) {
        await prisma.segmentMembership.create({
          data: {
            segmentId,
            userId: profile.userId,
            membershipScore,
            isActive: true
          }
        });
        membersAdded++;
      }
    }

    // Update segment count
    await prisma.behavioralSegment.update({
      where: { id: segmentId },
      data: { userCount: membersAdded }
    });

    return membersAdded;
  } catch (error) {
    console.error("Failed to populate segment members:", error);
    return 0;
  }
}

async function analyzeSegments(segments: any[]) {
  try {
    // Use AI to analyze segment collection
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
          content: `Analyze segment collection and provide insights:
            
            Segments: ${JSON.stringify(segments.map(s => ({
              name: s.segmentName,
              type: s.segmentType,
              userCount: s.userCount,
              isActive: s.isActive
            })))}
            
            Provide overview analytics and recommendations.`
        }],
        max_tokens: 1500,
        response_format: { type: "json_object" }
      }),
    });

    const aiResult = await response.json();
    return JSON.parse(aiResult.choices[0].message.content);
  } catch (error) {
    console.error("Failed to analyze segments:", error);
    return { overview: "Analysis unavailable" };
  }
}

function calculateMembershipScore(segmentation: any, segment: any): number {
  // Simple scoring logic - would be more sophisticated in production
  let score = 0;

  if (segmentation.primarySegment === segment.segmentName) {
    score += 0.8;
  }

  if (segmentation.secondarySegments?.includes(segment.segmentName)) {
    score += 0.6;
  }

  // Check lifecycle stage alignment
  if (segment.segmentType === "lifecycle" && 
      segmentation.lifecycleStage === segment.segmentName) {
    score += 0.7;
  }

  return Math.min(score, 1.0);
}

async function evaluateSegmentMembership(profile: any, criteria: any): Promise<number> {
  // Simplified membership evaluation
  let score = 0;

  try {
    if (criteria.engagementScore && profile.engagementScore >= criteria.engagementScore.min) {
      score += 0.3;
    }

    if (criteria.churnProbability && profile.churnProbability <= criteria.churnProbability.max) {
      score += 0.3;
    }

    if (criteria.lifecycleStage && profile.userLifecycleStage === criteria.lifecycleStage) {
      score += 0.4;
    }

    return Math.min(score, 1.0);
  } catch (error) {
    console.error("Failed to evaluate segment membership:", error);
    return 0;
  }
}
