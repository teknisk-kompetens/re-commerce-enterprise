
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
    const channelId = searchParams.get("channelId");
    const videoId = searchParams.get("videoId");
    const period = searchParams.get("period") ?? "monthly";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const dateFilter: any = {};
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);
    if (!startDate && !endDate) {
      // Default to last 30 days
      dateFilter.gte = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    if (videoId) {
      // Get video-specific analytics
      const videoAnalytics = await prisma.youTubeVideoAnalytics.findMany({
        where: {
          tenantId,
          videoId,
          period,
          date: dateFilter
        },
        include: {
          video: {
            select: {
              title: true,
              videoId: true,
              channel: {
                select: {
                  channelName: true
                }
              }
            }
          }
        },
        orderBy: { date: "asc" }
      });

      // Calculate aggregated metrics
      const aggregatedMetrics = await prisma.youTubeVideoAnalytics.aggregate({
        where: {
          tenantId,
          videoId,
          period,
          date: dateFilter
        },
        _sum: {
          views: true,
          likes: true,
          comments: true,
          shares: true,
          watchTimeMinutes: true,
          subscribersGained: true,
          estimatedRevenue: true
        },
        _avg: {
          clickThroughRate: true,
          averageViewDuration: true,
          retentionRate: true
        }
      });

      return NextResponse.json({
        type: "video",
        analytics: videoAnalytics,
        aggregatedMetrics,
        summary: {
          totalViews: aggregatedMetrics._sum.views || 0,
          totalWatchTime: aggregatedMetrics._sum.watchTimeMinutes || 0,
          totalRevenue: aggregatedMetrics._sum.estimatedRevenue || 0,
          averageRetention: aggregatedMetrics._avg.retentionRate || 0,
          averageCtr: aggregatedMetrics._avg.clickThroughRate || 0
        }
      });

    } else if (channelId) {
      // Get channel-specific analytics
      const channelAnalytics = await prisma.youTubeAnalytics.findMany({
        where: {
          tenantId,
          channelId,
          period,
          date: dateFilter
        },
        include: {
          channel: {
            select: {
              channelName: true,
              channelId: true
            }
          }
        },
        orderBy: { date: "asc" }
      });

      // Get aggregated channel metrics
      const aggregatedMetrics = await prisma.youTubeAnalytics.aggregate({
        where: {
          tenantId,
          channelId,
          period,
          date: dateFilter
        },
        _sum: {
          watchTimeMinutes: true,
          subscribersGained: true,
          subscribersLost: true,
          likesCount: true,
          commentsCount: true,
          sharesCount: true,
          estimatedRevenue: true,
          adImpressions: true
        },
        _avg: {
          averageViewDuration: true,
          averagePercentageViewed: true,
          cpm: true,
          playbackBasedCpm: true
        }
      });

      // Convert BigInt fields
      const serializedAnalytics = channelAnalytics.map(analytics => ({
        ...analytics,
        watchTimeMinutes: analytics.watchTimeMinutes.toString()
      }));

      const serializedMetrics = {
        ...aggregatedMetrics,
        _sum: {
          ...aggregatedMetrics._sum,
          watchTimeMinutes: aggregatedMetrics._sum.watchTimeMinutes?.toString() || "0"
        }
      };

      return NextResponse.json({
        type: "channel",
        analytics: serializedAnalytics,
        aggregatedMetrics: serializedMetrics,
        summary: {
          totalWatchTime: aggregatedMetrics._sum.watchTimeMinutes?.toString() || "0",
          netSubscribers: (aggregatedMetrics._sum.subscribersGained || 0) - (aggregatedMetrics._sum.subscribersLost || 0),
          totalRevenue: aggregatedMetrics._sum.estimatedRevenue || 0,
          averageCpm: aggregatedMetrics._avg.cpm || 0,
          totalImpressions: aggregatedMetrics._sum.adImpressions || 0
        }
      });

    } else {
      // Get tenant-wide analytics overview
      const [channelOverview, videoOverview, revenueOverview] = await Promise.all([
        prisma.youTubeAnalytics.aggregate({
          where: {
            tenantId,
            period,
            date: dateFilter
          },
          _sum: {
            watchTimeMinutes: true,
            subscribersGained: true,
            subscribersLost: true,
            estimatedRevenue: true
          },
          _count: {
            channelId: true
          }
        }),
        prisma.youTubeVideoAnalytics.aggregate({
          where: {
            tenantId,
            period,
            date: dateFilter
          },
          _sum: {
            views: true,
            likes: true,
            comments: true,
            shares: true,
            estimatedRevenue: true
          },
          _count: {
            videoId: true
          }
        }),
        prisma.youTubeChannel.findMany({
          where: {
            tenantId,
            syncStatus: "active"
          },
          select: {
            id: true,
            channelName: true,
            subscriberCount: true,
            viewCount: true,
            videoCount: true,
            monetizationEnabled: true
          }
        })
      ]);

      // Convert BigInt fields
      const serializedChannelOverview = {
        ...channelOverview,
        _sum: {
          ...channelOverview._sum,
          watchTimeMinutes: channelOverview._sum.watchTimeMinutes?.toString() || "0"
        }
      };

      const serializedRevenueOverview = revenueOverview.map(channel => ({
        ...channel,
        viewCount: channel.viewCount.toString()
      }));

      return NextResponse.json({
        type: "overview",
        channelMetrics: serializedChannelOverview,
        videoMetrics: videoOverview,
        channels: serializedRevenueOverview,
        summary: {
          activeChannels: revenueOverview.length,
          totalSubscribers: revenueOverview.reduce((sum, ch) => sum + ch.subscriberCount, 0),
          totalViews: revenueOverview.reduce((sum, ch) => sum + Number(ch.viewCount), 0),
          totalVideos: revenueOverview.reduce((sum, ch) => sum + ch.videoCount, 0),
          monetizedChannels: revenueOverview.filter(ch => ch.monetizationEnabled).length,
          totalRevenue: (channelOverview._sum.estimatedRevenue || 0) + (videoOverview._sum.estimatedRevenue || 0)
        }
      });
    }

  } catch (error) {
    console.error("Error fetching YouTube analytics:", error);
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
      case "sync_analytics":
        const { tenantId, channelId, period } = data;
        
        if (!tenantId || !channelId) {
          return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
          );
        }

        // Simulate analytics sync from YouTube API
        const syncResult = await syncYouTubeAnalytics(tenantId, channelId, period);
        
        return NextResponse.json({
          success: true,
          syncResult,
          message: "Analytics sync initiated"
        });

      case "generate_report":
        const reportData = await generateAnalyticsReport(data);
        return NextResponse.json(reportData);

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("Error processing YouTube analytics request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Mock function for syncing analytics from YouTube API
async function syncYouTubeAnalytics(tenantId: string, channelId: string, period: string) {
  // In production, this would fetch real data from YouTube Analytics API
  const mockAnalyticsData = {
    watchTimeMinutes: BigInt(Math.floor(Math.random() * 100000)),
    subscribersGained: Math.floor(Math.random() * 1000),
    subscribersLost: Math.floor(Math.random() * 100),
    likesCount: Math.floor(Math.random() * 5000),
    commentsCount: Math.floor(Math.random() * 1000),
    sharesCount: Math.floor(Math.random() * 500),
    estimatedRevenue: Math.random() * 1000,
    adImpressions: Math.floor(Math.random() * 50000),
    cpm: Math.random() * 5,
    averageViewDuration: Math.random() * 300
  };

  try {
    const analytics = await prisma.youTubeAnalytics.upsert({
      where: {
        channelId_date_period: {
          channelId,
          date: new Date(),
          period
        }
      },
      update: mockAnalyticsData,
      create: {
        tenantId,
        channelId,
        date: new Date(),
        period,
        ...mockAnalyticsData
      }
    });

    return {
      synced: true,
      recordsUpdated: 1,
      lastSync: new Date()
    };
  } catch (error) {
    console.error("Error syncing analytics:", error);
    return {
      synced: false,
      error: error.message
    };
  }
}

// Generate comprehensive analytics report
async function generateAnalyticsReport(data: any) {
  const { tenantId, reportType, timeRange, channels } = data;

  // Mock report generation
  return {
    reportId: `report_${Date.now()}`,
    reportType,
    timeRange,
    generatedAt: new Date(),
    summary: {
      totalChannels: channels?.length || 0,
      totalViews: Math.floor(Math.random() * 1000000),
      totalRevenue: Math.random() * 10000,
      averageEngagement: Math.random() * 100
    },
    insights: [
      {
        type: "growth",
        message: "Channel growth has increased by 25% this month",
        confidence: 0.85
      },
      {
        type: "optimization",
        message: "Consider optimizing video titles for better SEO performance",
        confidence: 0.92
      }
    ]
  };
}
