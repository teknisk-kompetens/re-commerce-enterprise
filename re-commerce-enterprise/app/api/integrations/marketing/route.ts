
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get marketing integrations for a tenant
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    const skip = (page - 1) * limit;

    const whereClause = {
      tenantId,
      ...(platform && { platform }),
      ...(status && { status })
    };

    const [integrations, total] = await Promise.all([
      prisma.marketingIntegration.findMany({
        where: whereClause,
        include: {
          syncLogs: {
            orderBy: { startTime: 'desc' },
            take: 5
          },
          campaigns: {
            orderBy: { createdAt: 'desc' },
            take: 10
          },
          _count: {
            select: {
              syncLogs: true,
              campaigns: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.marketingIntegration.count({ where: whereClause })
    ]);

    // Calculate performance metrics
    const integrationsWithMetrics = await Promise.all(
      integrations.map(async (integration) => {
        const recentCampaigns = integration.campaigns.slice(0, 5);
        const avgOpenRate = recentCampaigns.length > 0 
          ? recentCampaigns.reduce((sum, c) => sum + c.openRate, 0) / recentCampaigns.length 
          : 0;
        const avgClickRate = recentCampaigns.length > 0 
          ? recentCampaigns.reduce((sum, c) => sum + c.clickRate, 0) / recentCampaigns.length 
          : 0;

        return {
          ...integration,
          metrics: {
            avgOpenRate: Math.round(avgOpenRate * 100) / 100,
            avgClickRate: Math.round(avgClickRate * 100) / 100,
            totalSubscribers: integration.subscribersCount,
            totalCampaigns: integration.campaignsCount,
            recentCampaigns: recentCampaigns.length
          }
        };
      })
    );

    return NextResponse.json({
      integrations: integrationsWithMetrics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching marketing integrations:', error);
    return NextResponse.json({ error: 'Failed to fetch marketing integrations' }, { status: 500 });
  }
}

// Create marketing integration
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
      syncSettings,
      features
    } = body;

    if (!tenantId || !name || !platform || !apiEndpoint) {
      return NextResponse.json({ 
        error: 'Missing required fields: tenantId, name, platform, apiEndpoint' 
      }, { status: 400 });
    }

    const integration = await prisma.marketingIntegration.create({
      data: {
        tenantId,
        name,
        platform,
        version: version || '1.0',
        apiEndpoint,
        credentials: credentials || {},
        configuration: configuration || {},
        syncSettings: syncSettings || {
          autoSync: true,
          syncInterval: 3600,
          syncTypes: ['lists', 'subscribers', 'campaigns']
        },
        features: features || ['email_marketing', 'automation', 'analytics'],
        rateLimits: getMarketingRateLimits(platform),
        monitoring: {
          healthCheckEnabled: true,
          alertsEnabled: true,
          performanceTracking: true
        }
      }
    });

    return NextResponse.json({ integration }, { status: 201 });

  } catch (error) {
    console.error('Error creating marketing integration:', error);
    return NextResponse.json({ error: 'Failed to create marketing integration' }, { status: 500 });
  }
}

// Update marketing integration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, credentials, configuration, syncSettings, status, features } = body;

    if (!id) {
      return NextResponse.json({ error: 'Integration ID required' }, { status: 400 });
    }

    const integration = await prisma.marketingIntegration.update({
      where: { id },
      data: {
        ...(credentials && { credentials }),
        ...(configuration && { configuration }),
        ...(syncSettings && { syncSettings }),
        ...(status && { status }),
        ...(features && { features })
      }
    });

    return NextResponse.json({ integration });

  } catch (error) {
    console.error('Error updating marketing integration:', error);
    return NextResponse.json({ error: 'Failed to update marketing integration' }, { status: 500 });
  }
}

function getMarketingRateLimits(platform: string) {
  const limits: Record<string, any> = {
    'mailchimp': { requestsPerSecond: 10, dailyLimit: 50000 },
    'klaviyo': { requestsPerSecond: 150, dailyLimit: 1000000 },
    'sendgrid': { requestsPerSecond: 600, dailyLimit: 2000000 },
    'constant_contact': { requestsPerSecond: 4, dailyLimit: 10000 },
    'campaign_monitor': { requestsPerSecond: 5, dailyLimit: 20000 }
  };
  
  return limits[platform.toLowerCase()] || { requestsPerSecond: 10, dailyLimit: 50000 };
}
