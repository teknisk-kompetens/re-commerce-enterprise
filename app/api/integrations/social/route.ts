
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get social media integrations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    const whereClause = {
      tenantId,
      ...(platform && { platform }),
      ...(status && { status })
    };

    const integrations = await prisma.socialIntegration.findMany({
      where: whereClause,
      include: {
        posts: {
          orderBy: { publishedAt: 'desc' },
          take: 10
        },
        analytics: {
          orderBy: { date: 'desc' },
          take: 30
        },
        _count: {
          select: {
            posts: true,
            analytics: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate social media metrics
    const integrationsWithMetrics = integrations.map(integration => {
      const recentPosts = integration.posts.slice(0, 10);
      const recentAnalytics = integration.analytics.slice(0, 7); // Last 7 days

      const totalEngagement = recentPosts.reduce((sum, post) => 
        sum + post.likesCount + post.commentsCount + post.sharesCount, 0
      );
      
      const totalReach = recentPosts.reduce((sum, post) => sum + post.reachCount, 0);
      const avgEngagementRate = recentPosts.length > 0 
        ? recentPosts.reduce((sum, post) => sum + post.engagementRate, 0) / recentPosts.length 
        : 0;

      const weeklyGrowth = recentAnalytics.length >= 2 
        ? recentAnalytics[0].followers - recentAnalytics[recentAnalytics.length - 1].followers
        : 0;

      return {
        ...integration,
        metrics: {
          engagement: {
            totalEngagement,
            avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
            totalReach
          },
          growth: {
            weeklyFollowerGrowth: weeklyGrowth,
            currentFollowers: integration.followersCount
          },
          content: {
            recentPosts: recentPosts.length,
            totalPosts: integration.postsCount
          }
        }
      };
    });

    return NextResponse.json({ integrations: integrationsWithMetrics });

  } catch (error) {
    console.error('Error fetching social integrations:', error);
    return NextResponse.json({ error: 'Failed to fetch social integrations' }, { status: 500 });
  }
}

// Create social media integration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      tenantId, 
      name, 
      platform, 
      version, 
      apiEndpoint, 
      credentials, 
      configuration,
      accountId,
      accountName,
      accountHandle,
      features,
      permissions
    } = body;

    if (!tenantId || !name || !platform || !apiEndpoint || !credentials) {
      return NextResponse.json({ 
        error: 'Missing required fields: tenantId, name, platform, apiEndpoint, credentials' 
      }, { status: 400 });
    }

    const integration = await prisma.socialIntegration.create({
      data: {
        tenantId,
        name,
        platform,
        version: version || '1.0',
        apiEndpoint,
        credentials,
        configuration: configuration || {},
        accountId,
        accountName,
        accountHandle,
        syncInterval: getSocialSyncInterval(platform),
        features: features || ['posting', 'analytics'],
        permissions: permissions || [],
        rateLimits: getSocialRateLimits(platform),
        monitoring: {
          engagementTracking: true,
          performanceAlerts: true,
          contentModeration: true
        }
      }
    });

    return NextResponse.json({ integration }, { status: 201 });

  } catch (error) {
    console.error('Error creating social integration:', error);
    return NextResponse.json({ error: 'Failed to create social integration' }, { status: 500 });
  }
}

// Update social media integration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, 
      credentials, 
      configuration, 
      status, 
      accountName, 
      accountHandle,
      features,
      permissions
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Integration ID required' }, { status: 400 });
    }

    const integration = await prisma.socialIntegration.update({
      where: { id },
      data: {
        ...(credentials && { credentials }),
        ...(configuration && { configuration }),
        ...(status && { status }),
        ...(accountName && { accountName }),
        ...(accountHandle && { accountHandle }),
        ...(features && { features }),
        ...(permissions && { permissions })
      }
    });

    return NextResponse.json({ integration });

  } catch (error) {
    console.error('Error updating social integration:', error);
    return NextResponse.json({ error: 'Failed to update social integration' }, { status: 500 });
  }
}

function getSocialSyncInterval(platform: string): number {
  const intervals: Record<string, number> = {
    'facebook': 3600,    // 1 hour
    'instagram': 3600,   // 1 hour  
    'twitter': 1800,     // 30 minutes
    'linkedin': 7200,    // 2 hours
    'tiktok': 3600,      // 1 hour
    'youtube': 7200,     // 2 hours
    'pinterest': 7200    // 2 hours
  };
  
  return intervals[platform.toLowerCase()] || 3600;
}

function getSocialRateLimits(platform: string) {
  const limits: Record<string, any> = {
    'facebook': { requestsPerHour: 200, postsPerDay: 25 },
    'instagram': { requestsPerHour: 200, postsPerDay: 25 },
    'twitter': { requestsPerHour: 300, postsPerDay: 100 },
    'linkedin': { requestsPerHour: 100, postsPerDay: 20 },
    'tiktok': { requestsPerHour: 100, postsPerDay: 10 },
    'youtube': { requestsPerHour: 100, postsPerDay: 5 },
    'pinterest': { requestsPerHour: 200, postsPerDay: 50 }
  };
  
  return limits[platform.toLowerCase()] || { requestsPerHour: 100, postsPerDay: 25 };
}
