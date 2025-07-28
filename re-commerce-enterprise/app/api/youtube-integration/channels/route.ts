
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

const prisma = new PrismaClient();

// YouTube Data API integration would require actual Google API credentials
// This is a mock implementation for demonstration
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const tenantId = searchParams.get("tenantId");
    const userId = searchParams.get("userId") || session.user.id;
    const syncStatus = searchParams.get("syncStatus");

    if (!tenantId) {
      return NextResponse.json({ error: "Tenant ID required" }, { status: 400 });
    }

    const whereClause: any = {
      tenantId,
      ...(userId && { creatorId: userId }),
      ...(syncStatus && { syncStatus })
    };

    const [channels, totalCount, syncStats] = await Promise.all([
      prisma.youTubeChannel.findMany({
        where: whereClause,
        include: {
          creator: {
            select: {
              name: true,
              email: true
            }
          },
          videos: {
            orderBy: { publishedAt: "desc" },
            take: 5,
            select: {
              id: true,
              videoId: true,
              title: true,
              viewCount: true,
              publishedAt: true
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
              subscribersGained: true,
              watchTimeMinutes: true,
              estimatedRevenue: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }),
      prisma.youTubeChannel.count({ where: whereClause }),
      prisma.youTubeChannel.groupBy({
        by: ["syncStatus"],
        where: { tenantId },
        _count: {
          syncStatus: true
        }
      })
    ]);

    // Convert BigInt fields for JSON serialization
    const serializedChannels = channels.map(channel => ({
      ...channel,
      viewCount: channel.viewCount.toString(),
      videos: channel.videos?.map(video => ({
        ...video,
        viewCount: video.viewCount.toString()
      }))
    }));

    return NextResponse.json({
      channels: serializedChannels,
      pagination: {
        total: totalCount,
        hasMore: false // Implement pagination if needed
      },
      syncStats,
      metrics: {
        totalChannels: totalCount,
        activeChannels: syncStats.find(s => s.syncStatus === "active")?._count?.syncStatus || 0,
        pendingChannels: syncStats.find(s => s.syncStatus === "pending")?._count?.syncStatus || 0
      }
    });

  } catch (error) {
    console.error("Error fetching YouTube channels:", error);
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
      channelName,
      channelHandle,
      description,
      accessToken,
      refreshToken
    } = body;

    if (!tenantId || !channelId || !channelName) {
      return NextResponse.json(
        { error: "Missing required fields: tenantId, channelId, channelName" },
        { status: 400 }
      );
    }

    // Check if channel already exists
    const existingChannel = await prisma.youTubeChannel.findUnique({
      where: { channelId }
    });

    if (existingChannel) {
      return NextResponse.json(
        { error: "Channel already connected" },
        { status: 409 }
      );
    }

    // Simulate fetching channel data from YouTube API
    const channelData = await fetchYouTubeChannelData(channelId, accessToken);

    const channel = await prisma.youTubeChannel.create({
      data: {
        tenantId,
        creatorId: session.user.id,
        channelId,
        channelName,
        channelHandle,
        description,
        accessToken,
        refreshToken,
        subscriberCount: channelData.subscriberCount || 0,
        videoCount: channelData.videoCount || 0,
        viewCount: BigInt(channelData.viewCount || 0),
        uploadCount: channelData.uploadCount || 0,
        thumbnailUrl: channelData.thumbnailUrl,
        bannerUrl: channelData.bannerUrl,
        syncStatus: "active",
        lastSync: new Date(),
        monetizationEnabled: false,
        revenueShare: 0.0
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Convert BigInt for JSON serialization
    const serializedChannel = {
      ...channel,
      viewCount: channel.viewCount.toString()
    };

    return NextResponse.json(serializedChannel, { status: 201 });

  } catch (error) {
    console.error("Error creating YouTube channel:", error);
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
        { error: "Channel ID required" },
        { status: 400 }
      );
    }

    // Verify ownership
    const existingChannel = await prisma.youTubeChannel.findFirst({
      where: {
        id,
        creatorId: session.user.id
      }
    });

    if (!existingChannel) {
      return NextResponse.json(
        { error: "Channel not found or access denied" },
        { status: 404 }
      );
    }

    const updatedChannel = await prisma.youTubeChannel.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Convert BigInt for JSON serialization
    const serializedChannel = {
      ...updatedChannel,
      viewCount: updatedChannel.viewCount.toString()
    };

    return NextResponse.json(serializedChannel);

  } catch (error) {
    console.error("Error updating YouTube channel:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Mock function - in production this would call actual YouTube Data API
async function fetchYouTubeChannelData(channelId: string, accessToken?: string) {
  // This would make actual API calls to YouTube Data API v3
  // For now, return mock data
  return {
    subscriberCount: Math.floor(Math.random() * 100000),
    videoCount: Math.floor(Math.random() * 500),
    viewCount: Math.floor(Math.random() * 1000000),
    uploadCount: Math.floor(Math.random() * 500),
    thumbnailUrl: `https://i.ytimg.com/vi/h8-qemIbXbo/maxresdefault.jpg`,
    bannerUrl: `https://i.ytimg.com/vi/bj_-isDqSrI/maxresdefault.jpg`
  };
}
