
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
    const videoId = searchParams.get("videoId");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    if (videoId) {
      // Get SEO optimization for specific video
      const optimizations = await prisma.youTubeSEOOptimization.findMany({
        where: {
          tenantId,
          videoId
        },
        include: {
          video: {
            select: {
              title: true,
              videoId: true,
              tags: true,
              seoScore: true
            }
          }
        },
        orderBy: { optimizedAt: "desc" },
        take: limit
      });

      return NextResponse.json({
        optimizations,
        video: optimizations[0]?.video || null
      });
    } else {
      // Get SEO overview for tenant
      const [optimizations, seoStats] = await Promise.all([
        prisma.youTubeSEOOptimization.findMany({
          where: { tenantId },
          include: {
            video: {
              select: {
                title: true,
                videoId: true,
                seoScore: true,
                channel: {
                  select: {
                    channelName: true
                  }
                }
              }
            }
          },
          orderBy: { optimizedAt: "desc" },
          take: limit
        }),
        prisma.youTubeSEOOptimization.aggregate({
          where: { tenantId },
          _avg: {
            seoScore: true,
            searchVisibility: true
          },
          _count: {
            id: true
          }
        })
      ]);

      // Get videos that need optimization
      const videosNeedingOptimization = await prisma.youTubeVideo.findMany({
        where: {
          tenantId,
          seoScore: {
            lt: 70 // Videos with SEO score below 70%
          }
        },
        select: {
          id: true,
          videoId: true,
          title: true,
          seoScore: true,
          publishedAt: true,
          channel: {
            select: {
              channelName: true
            }
          }
        },
        orderBy: { seoScore: "asc" },
        take: 10
      });

      return NextResponse.json({
        optimizations,
        stats: seoStats,
        videosNeedingOptimization,
        summary: {
          totalOptimizations: seoStats._count.id,
          averageSeoScore: seoStats._avg.seoScore || 0,
          averageSearchVisibility: seoStats._avg.searchVisibility || 0,
          videosNeedingAttention: videosNeedingOptimization.length
        }
      });
    }

  } catch (error) {
    console.error("Error fetching SEO optimizations:", error);
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
      case "optimize_video":
        return await optimizeVideoSEO(data);
        
      case "bulk_optimize":
        return await bulkOptimizeVideos(data);
        
      case "analyze_keywords":
        return await analyzeKeywords(data);
        
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("Error processing SEO optimization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

async function optimizeVideoSEO(data: any) {
  const { tenantId, videoId, targetKeywords, focusKeyword } = data;

  if (!tenantId || !videoId) {
    throw new Error("Missing required fields");
  }

  // Get video details
  const video = await prisma.youTubeVideo.findFirst({
    where: {
      tenantId,
      id: videoId,
      channel: {
        creator: {
          // Verify ownership through session if needed
        }
      }
    }
  });

  if (!video) {
    throw new Error("Video not found or access denied");
  }

  // Simulate AI-powered SEO analysis
  const seoAnalysis = await generateSEOAnalysis(video, targetKeywords, focusKeyword);

  // Create or update SEO optimization record
  const optimization = await prisma.youTubeSEOOptimization.create({
    data: {
      tenantId,
      videoId,
      targetKeywords: targetKeywords || [],
      currentRanking: seoAnalysis.currentRanking,
      competitorAnalysis: seoAnalysis.competitorAnalysis,
      titleSuggestions: seoAnalysis.titleSuggestions,
      tagSuggestions: seoAnalysis.tagSuggestions,
      descriptionSuggestions: seoAnalysis.descriptionSuggestions,
      thumbnailSuggestions: seoAnalysis.thumbnailSuggestions,
      seoScore: seoAnalysis.seoScore,
      searchVisibility: seoAnalysis.searchVisibility,
      organicReach: seoAnalysis.organicReach,
      aiRecommendations: seoAnalysis.aiRecommendations,
      trendAnalysis: seoAnalysis.trendAnalysis,
      optimizedAt: new Date(),
      nextOptimization: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    }
  });

  // Update video SEO score
  await prisma.youTubeVideo.update({
    where: { id: videoId },
    data: {
      seoScore: seoAnalysis.seoScore,
      optimizedTitle: seoAnalysis.titleSuggestions[0] || video.title,
      optimizedTags: seoAnalysis.tagSuggestions
    }
  });

  return {
    success: true,
    optimization,
    seoAnalysis,
    improvements: {
      scoreIncrease: seoAnalysis.seoScore - video.seoScore,
      potentialReachIncrease: seoAnalysis.organicReach * 0.3 // Estimated 30% increase
    }
  };
}

async function bulkOptimizeVideos(data: any) {
  const { tenantId, videoIds, strategy } = data;

  if (!tenantId || !videoIds || !Array.isArray(videoIds)) {
    throw new Error("Missing required fields");
  }

  const results = [];
  const errors = [];

  for (const videoId of videoIds) {
    try {
      const result = await optimizeVideoSEO({
        tenantId,
        videoId,
        targetKeywords: [], // Will be auto-generated based on strategy
        strategy
      });
      results.push({ videoId, success: true, result });
    } catch (error) {
      errors.push({ videoId, error: error.message });
    }
  }

  return {
    success: true,
    optimized: results.length,
    errors: errors.length,
    results,
    errors
  };
}

async function analyzeKeywords(data: any) {
  const { keywords, niche, competitorChannels } = data;

  // Simulate keyword analysis
  const keywordAnalysis = keywords?.map((keyword: string) => ({
    keyword,
    searchVolume: Math.floor(Math.random() * 100000),
    competition: Math.random(),
    difficulty: Math.floor(Math.random() * 100),
    trends: generateTrendData(),
    opportunities: generateOpportunityScore(),
    relatedKeywords: generateRelatedKeywords(keyword)
  }));

  const competitorAnalysis = competitorChannels?.map((channel: string) => ({
    channel,
    topKeywords: generateTopKeywords(),
    contentGaps: generateContentGaps(),
    opportunities: generateCompetitorOpportunities()
  }));

  return {
    success: true,
    keywordAnalysis,
    competitorAnalysis,
    recommendations: [
      "Focus on long-tail keywords with lower competition",
      "Create content around trending topics in your niche",
      "Optimize video descriptions with semantic keywords"
    ],
    insights: {
      bestPerformingKeywords: keywordAnalysis?.slice(0, 3) || [],
      emergingTrends: generateEmergingTrends(),
      contentOpportunities: generateContentOpportunities()
    }
  };
}

// AI-powered SEO analysis simulation
async function generateSEOAnalysis(video: any, targetKeywords: string[], focusKeyword?: string) {
  // This would integrate with real AI services in production
  return {
    seoScore: Math.floor(Math.random() * 40) + 60, // 60-100 range
    searchVisibility: Math.random() * 100,
    organicReach: Math.floor(Math.random() * 10000),
    currentRanking: {
      [focusKeyword || "main keyword"]: Math.floor(Math.random() * 50) + 1
    },
    competitorAnalysis: {
      competitors: ["Channel A", "Channel B", "Channel C"],
      avgScore: Math.floor(Math.random() * 30) + 50,
      gapAnalysis: "Your video has opportunities in keyword density and description optimization"
    },
    titleSuggestions: [
      `${video.title} | Ultimate Guide`,
      `How to ${video.title} - Step by Step`,
      `${video.title} Tips & Tricks`,
      `The Complete ${video.title} Tutorial`
    ],
    tagSuggestions: [
      ...(targetKeywords || []),
      "tutorial", "guide", "tips", "how to", "2024", "beginner"
    ],
    descriptionSuggestions: [
      "Add more keyword-rich content in the first 125 characters",
      "Include timestamps for better user experience",
      "Add relevant hashtags",
      "Include call-to-action"
    ],
    thumbnailSuggestions: [
      "Use bright, contrasting colors",
      "Include text overlay with main keyword",
      "Show emotion or excitement",
      "Keep design clean and readable"
    ],
    aiRecommendations: {
      priority: "high",
      actions: [
        "Optimize title with focus keyword at the beginning",
        "Improve description with semantic keywords",
        "Add closed captions for better accessibility",
        "Create custom thumbnail with keyword text"
      ],
      expectedImpact: "25-40% increase in organic reach"
    },
    trendAnalysis: {
      keyword_trends: generateTrendData(),
      seasonal_patterns: "Higher search volume in Q4",
      emerging_topics: ["AI integration", "automation", "efficiency"]
    }
  };
}

function generateTrendData() {
  return Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    volume: Math.floor(Math.random() * 1000) + 500
  }));
}

function generateOpportunityScore() {
  return Math.floor(Math.random() * 100);
}

function generateRelatedKeywords(keyword: string) {
  return [
    `${keyword} tutorial`,
    `${keyword} guide`,
    `${keyword} tips`,
    `best ${keyword}`,
    `${keyword} 2024`
  ];
}

function generateTopKeywords() {
  return ["tutorial", "guide", "review", "comparison", "tips"];
}

function generateContentGaps() {
  return ["beginner guides", "advanced tutorials", "comparison videos"];
}

function generateCompetitorOpportunities() {
  return ["Less coverage on advanced topics", "Opportunity for more detailed explanations"];
}

function generateEmergingTrends() {
  return ["AI-powered content", "Short-form tutorials", "Interactive guides"];
}

function generateContentOpportunities() {
  return ["Create series-based content", "Focus on problem-solving", "Add more visual examples"];
}
