
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
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const offset = parseInt(searchParams.get("offset") ?? "0");
    const sortBy = searchParams.get("sortBy") ?? "publishedAt";
    const sortOrder = searchParams.get("sortOrder") ?? "desc";
    const search = searchParams.get("search");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(channelId && { channelId }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } }
        ]
      })
    };

    const orderBy: any = {};
    if (sortBy === "viewCount" || sortBy === "likeCount" || sortBy === "commentCount") {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const [videos, totalCount, performanceStats] = await Promise.all([
      prisma.youTubeVideo.findMany({
        where: whereClause,
        orderBy,
        take: limit,
        skip: offset,
        include: {
          channel: {
            select: {
              channelName: true,
              channelHandle: true
            }
          },
          analytics: {
            where: {
              period: "monthly",
              date: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              }
            },
            orderBy: { date: "desc" },
            take: 1,
            select: {
              views: true,
              likes: true,
              comments: true,
              shares: true,
              watchTimeMinutes: true,
              retentionRate: true,
              estimatedRevenue: true
            }
          },
          seoOptimizations: {
            orderBy: { optimizedAt: "desc" },
            take: 1,
            select: {
              seoScore: true,
              searchVisibility: true,
              targetKeywords: true
            }
          }
        }
      }),
      prisma.youTubeVideo.count({ where: whereClause }),
      prisma.youTubeVideo.aggregate({
        where: whereClause,
        _avg: {
          seoScore: true,
          cpm: true,
          rpm: true
        },
        _sum: {
          viewCount: true,
          likeCount: true,
          commentCount: true,
          shareCount: true,
          revenue: true
        }
      })
    ]);

    // Convert BigInt fields for JSON serialization
    const serializedVideos = videos.map(video => ({
      ...video,
      viewCount: video.viewCount.toString(),
      analytics: video.analytics?.map(analytic => ({
        ...analytic,
        watchTimeMinutes: analytic.watchTimeMinutes
      }))
    }));

    const serializedStats = {
      ...performanceStats,
      _sum: {
        ...performanceStats._sum,
        viewCount: performanceStats._sum.viewCount?.toString() || "0"
      }
    };

    return NextResponse.json({
      videos: serializedVideos,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      performanceStats: serializedStats,
      summary: {
        totalVideos: totalCount,
        averageSeoScore: performanceStats._avg.seoScore || 0,
        totalRevenue: performanceStats._sum.revenue || 0,
        averageCpm: performanceStats._avg.cpm || 0
      }
    });

  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
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
    const {
      tenantId,
      channelId,
      videoId,
      title,
      description,
      thumbnailUrl,
      duration,
      publishedAt,
      privacyStatus,
      categoryId,
      tags
    } = body;

    if (!tenantId || !channelId || !videoId || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if video already exists
    const existingVideo = await prisma.youTubeVideo.findUnique({
      where: { videoId }
    });

    if (existingVideo) {
      return NextResponse.json(
        { error: "Video already exists" },
        { status: 409 }
      );
    }

    // Verify channel ownership
    const channel = await prisma.youTubeChannel.findFirst({
      where: {
        id: channelId,
        creatorId: session.user.id,
        tenantId
      }
    });

    if (!channel) {
      return NextResponse.json(
        { error: "Channel not found or access denied" },
        { status: 404 }
      );
    }

    // Simulate fetching video data from YouTube API
    const videoData = await fetchYouTubeVideoData(videoId);

    const video = await prisma.youTubeVideo.create({
      data: {
        tenantId,
        channelId,
        videoId,
        title,
        description,
        thumbnailUrl,
        duration,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        privacyStatus: privacyStatus || "public",
        categoryId,
        tags: tags || [],
        viewCount: BigInt(videoData.viewCount || 0),
        likeCount: videoData.likeCount || 0,
        dislikeCount: videoData.dislikeCount || 0,
        commentCount: videoData.commentCount || 0,
        shareCount: videoData.shareCount || 0,
        seoScore: 0.0,
        monetized: false,
        revenue: 0.0,
        cpm: 0.0,
        rpm: 0.0
      },
      include: {
        channel: {
          select: {
            channelName: true,
            channelHandle: true
          }
        }
      }
    });

    // Convert BigInt for JSON serialization
    const serializedVideo = {
      ...video,
      viewCount: video.viewCount.toString()
    };

    return NextResponse.json(serializedVideo, { status: 201 });

  } catch (error) {
    console.error("Error creating YouTube video:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Video ID required" },
        { status: 400 }
      );
    }

    // Verify ownership through channel
    const existingVideo = await prisma.youTubeVideo.findFirst({
      where: {
        id,
        channel: {
          creatorId: session.user.id
        }
      }
    });

    if (!existingVideo) {
      return NextResponse.json(
        { error: "Video not found or access denied" },
        { status: 404 }
      );
    }

    const updatedVideo = await prisma.youTubeVideo.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        channel: {
          select: {
            channelName: true,
            channelHandle: true
          }
        }
      }
    });

    // Convert BigInt for JSON serialization
    const serializedVideo = {
      ...updatedVideo,
      viewCount: updatedVideo.viewCount.toString()
    };

    return NextResponse.json(serializedVideo);

  } catch (error) {
    console.error("Error updating YouTube video:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Mock function - in production this would call actual YouTube Data API
async function fetchYouTubeVideoData(videoId: string) {
  // This would make actual API calls to YouTube Data API v3
  // For now, return mock data
  return {
    viewCount: Math.floor(Math.random() * 100000),
    likeCount: Math.floor(Math.random() * 5000),
    dislikeCount: Math.floor(Math.random() * 100),
    commentCount: Math.floor(Math.random() * 1000),
    shareCount: Math.floor(Math.random() * 500)
  };
}
