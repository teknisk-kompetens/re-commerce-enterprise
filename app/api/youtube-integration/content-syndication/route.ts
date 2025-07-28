
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
    const status = searchParams.get("status");
    const syndicationType = searchParams.get("syndicationType");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(status && { syndicationStatus: status }),
      ...(syndicationType && { syndicationType })
    };

    const [syndications, totalCount, statusStats] = await Promise.all([
      prisma.contentSyndication.findMany({
        where: whereClause,
        include: {
          channel: {
            select: {
              channelName: true,
              channelHandle: true
            }
          },
          video: {
            select: {
              title: true,
              videoId: true,
              viewCount: true,
              publishedAt: true
            }
          }
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset
      }),
      prisma.contentSyndication.count({ where: whereClause }),
      prisma.contentSyndication.groupBy({
        by: ["syndicationStatus"],
        where: { tenantId },
        _count: {
          syndicationStatus: true
        }
      })
    ]);

    // Convert BigInt fields for JSON serialization
    const serializedSyndications = syndications.map(syndication => ({
      ...syndication,
      video: syndication.video ? {
        ...syndication.video,
        viewCount: syndication.video.viewCount.toString()
      } : null
    }));

    return NextResponse.json({
      syndications: serializedSyndications,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      statusStats,
      summary: {
        totalSyndications: totalCount,
        completed: statusStats.find(s => s.syndicationStatus === "completed")?._count?.syndicationStatus || 0,
        pending: statusStats.find(s => s.syndicationStatus === "pending")?._count?.syndicationStatus || 0,
        processing: statusStats.find(s => s.syndicationStatus === "processing")?._count?.syndicationStatus || 0,
        failed: statusStats.find(s => s.syndicationStatus === "failed")?._count?.syndicationStatus || 0
      }
    });

  } catch (error) {
    console.error("Error fetching content syndications:", error);
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
      case "create_syndication":
        return await createSyndication(data, session.user.id);
        
      case "schedule_bulk_syndication":
        return await scheduleBulkSyndication(data, session.user.id);
        
      case "optimize_for_platform":
        return await optimizeForPlatform(data);
        
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("Error processing syndication request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function createSyndication(data: any, userId: string) {
  const {
    tenantId,
    channelId,
    videoId,
    syndicationType,
    targetPlatforms,
    scheduledAt,
    customizations
  } = data;

  if (!tenantId || (!channelId && !videoId) || !syndicationType || !targetPlatforms) {
    throw new Error("Missing required fields");
  }

  // Verify ownership
  if (channelId) {
    const channel = await prisma.youTubeChannel.findFirst({
      where: {
        id: channelId,
        creatorId: userId,
        tenantId
      }
    });
    if (!channel) {
      throw new Error("Channel not found or access denied");
    }
  }

  if (videoId) {
    const video = await prisma.youTubeVideo.findFirst({
      where: {
        id: videoId,
        tenantId,
        channel: {
          creatorId: userId
        }
      }
    });
    if (!video) {
      throw new Error("Video not found or access denied");
    }
  }

  // Generate platform-optimized content
  const platformOptimized = await generatePlatformOptimizations(
    targetPlatforms,
    customizations
  );

  const syndication = await prisma.contentSyndication.create({
    data: {
      tenantId,
      channelId: channelId || null,
      videoId: videoId || null,
      syndicationType,
      targetPlatforms,
      syndicationStatus: scheduledAt ? "pending" : "processing",
      platformOptimized,
      customizations: customizations || {},
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null
    },
    include: {
      channel: {
        select: {
          channelName: true
        }
      },
      video: {
        select: {
          title: true,
          videoId: true
        }
      }
    }
  });

  // If not scheduled, start syndication process immediately
  if (!scheduledAt) {
    await processSyndication(syndication.id);
  }

  return {
    success: true,
    syndication,
    estimatedCompletion: scheduledAt || new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    platformsTargeted: targetPlatforms.length
  };
}

async function scheduleBulkSyndication(data: any, userId: string) {
  const {
    tenantId,
    videoIds,
    syndicationType,
    targetPlatforms,
    scheduledAt,
    batchSize = 5
  } = data;

  if (!tenantId || !videoIds || !Array.isArray(videoIds) || !targetPlatforms) {
    throw new Error("Missing required fields");
  }

  // Verify video ownership
  const videos = await prisma.youTubeVideo.findMany({
    where: {
      id: { in: videoIds },
      tenantId,
      channel: {
        creatorId: userId
      }
    }
  });

  if (videos.length !== videoIds.length) {
    throw new Error("Some videos not found or access denied");
  }

  const syndications = [];
  const errors = [];

  // Process in batches
  for (let i = 0; i < videoIds.length; i += batchSize) {
    const batch = videoIds.slice(i, i + batchSize);
    
    for (const videoId of batch) {
      try {
        const syndication = await prisma.contentSyndication.create({
          data: {
            tenantId,
            videoId,
            syndicationType,
            targetPlatforms,
            syndicationStatus: "pending",
            platformOptimized: await generatePlatformOptimizations(targetPlatforms, {}),
            customizations: {},
            scheduledAt: scheduledAt 
              ? new Date(new Date(scheduledAt).getTime() + i * 15 * 60 * 1000) // Stagger by 15 minutes
              : new Date(Date.now() + i * 5 * 60 * 1000) // Stagger by 5 minutes
          }
        });
        syndications.push(syndication);
      } catch (error) {
        errors.push({ videoId, error: error.message });
      }
    }
  }

  return {
    success: true,
    scheduled: syndications.length,
    errors: errors.length,
    syndications,
    errors,
    estimatedDuration: Math.ceil(videoIds.length / batchSize) * 15 // minutes
  };
}

async function optimizeForPlatform(data: any) {
  const { content, platform, contentType } = data;

  if (!content || !platform) {
    throw new Error("Missing required fields");
  }

  const optimizations = await generatePlatformSpecificOptimizations(
    content,
    platform,
    contentType
  );

  return {
    success: true,
    platform,
    optimizations,
    recommendations: optimizations.recommendations || []
  };
}

async function generatePlatformOptimizations(platforms: string[], customizations: any) {
  const optimizations: any = {};

  for (const platform of platforms) {
    switch (platform.toLowerCase()) {
      case "facebook":
        optimizations.facebook = {
          titleLength: 60,
          descriptionLength: 125,
          hashtagCount: 3,
          postingTime: "12:00-15:00",
          contentTips: [
            "Use engaging thumbnails",
            "Keep videos under 2 minutes for better engagement",
            "Include captions for silent viewing"
          ]
        };
        break;
        
      case "twitter":
        optimizations.twitter = {
          titleLength: 100,
          hashtagCount: 2,
          threadRecommended: true,
          contentTips: [
            "Create tweet threads for longer content",
            "Use trending hashtags",
            "Include video preview"
          ]
        };
        break;
        
      case "linkedin":
        optimizations.linkedin = {
          titleLength: 150,
          descriptionLength: 1300,
          professionalTone: true,
          contentTips: [
            "Focus on business value",
            "Use professional language",
            "Include industry insights"
          ]
        };
        break;
        
      case "instagram":
        optimizations.instagram = {
          aspectRatio: "1:1",
          hashtagCount: 10,
          storiesRecommended: true,
          contentTips: [
            "Use square format",
            "Create story highlights",
            "Use relevant hashtags"
          ]
        };
        break;
        
      case "tiktok":
        optimizations.tiktok = {
          duration: "15-60s",
          verticalFormat: true,
          trending: true,
          contentTips: [
            "Use vertical video format",
            "Add trending sounds",
            "Keep content short and engaging"
          ]
        };
        break;
        
      default:
        optimizations[platform] = {
          generic: true,
          contentTips: ["Follow platform best practices"]
        };
    }
  }

  return optimizations;
}

async function generatePlatformSpecificOptimizations(
  content: any,
  platform: string,
  contentType: string
) {
  // AI-powered platform optimization
  const baseOptimizations = {
    title: content.title,
    description: content.description,
    tags: content.tags || []
  };

  switch (platform.toLowerCase()) {
    case "facebook":
      return {
        ...baseOptimizations,
        optimizedTitle: truncateText(content.title, 60),
        optimizedDescription: truncateText(content.description, 125),
        suggestedHashtags: ["#video", "#content", "#tutorial"],
        aspectRatio: "16:9",
        recommendations: [
          "Add engaging thumbnail",
          "Include call-to-action in first comment",
          "Post during peak hours (12PM-3PM)"
        ]
      };
      
    case "twitter":
      return {
        ...baseOptimizations,
        optimizedTitle: truncateText(content.title, 100),
        threadContent: generateTwitterThread(content),
        suggestedHashtags: ["#YouTube", "#content"],
        recommendations: [
          "Create thread for full content",
          "Use video preview",
          "Engage with comments quickly"
        ]
      };
      
    case "linkedin":
      return {
        ...baseOptimizations,
        optimizedTitle: truncateText(content.title, 150),
        professionalDescription: generateProfessionalDescription(content),
        industryTags: ["#contentmarketing", "#digitaltransformation"],
        recommendations: [
          "Highlight business value",
          "Use professional tone",
          "Tag relevant connections"
        ]
      };
      
    default:
      return baseOptimizations;
  }
}

async function processSyndication(syndicationId: string) {
  // Simulate syndication processing
  try {
    await prisma.contentSyndication.update({
      where: { id: syndicationId },
      data: {
        syndicationStatus: "processing",
        syndicationResults: {
          status: "processing",
          startedAt: new Date()
        }
      }
    });

    // Simulate async processing
    setTimeout(async () => {
      try {
        await prisma.contentSyndication.update({
          where: { id: syndicationId },
          data: {
            syndicationStatus: "completed",
            publishedAt: new Date(),
            syndicationResults: {
              status: "completed",
              completedAt: new Date(),
              platforms: {
                facebook: { success: true, postId: "fb_123456" },
                twitter: { success: true, postId: "tw_789012" },
                linkedin: { success: true, postId: "li_345678" }
              }
            }
          }
        });
      } catch (error) {
        console.error("Error updating syndication:", error);
      }
    }, 30000); // Complete after 30 seconds

  } catch (error) {
    console.error("Error processing syndication:", error);
    await prisma.contentSyndication.update({
      where: { id: syndicationId },
      data: {
        syndicationStatus: "failed",
        syndicationResults: {
          status: "failed",
          error: error.message,
          failedAt: new Date()
        }
      }
    });
  }
}

function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + "...";
}

function generateTwitterThread(content: any): string[] {
  const thread = [];
  const title = content.title || "";
  const description = content.description || "";
  
  thread.push(`🧵 ${title}`);
  
  if (description.length > 200) {
    const chunks = description.match(/.{1,200}/g) || [];
    chunks.forEach((chunk, index) => {
      thread.push(`${index + 2}/ ${chunk}`);
    });
  } else {
    thread.push(`2/ ${description}`);
  }
  
  thread.push(`Watch the full video: [Link]`);
  
  return thread;
}

function generateProfessionalDescription(content: any): string {
  const description = content.description || "";
  
  // Transform to professional tone
  return `Professional insights: ${description}
  
Key takeaways:
• Strategic approach to implementation
• Measurable business outcomes
• Industry best practices

What's your experience with this approach? Share your thoughts in the comments.

#ProfessionalDevelopment #BusinessStrategy`;
}
