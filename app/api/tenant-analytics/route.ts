
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Tenant Analytics API
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const timeRange = searchParams.get('timeRange') || '7d';
    const metrics = searchParams.get('metrics')?.split(',') || [];
    const category = searchParams.get('category');

    // Calculate time range
    const timeRangeMap: Record<string, number> = {
      '1h': 1 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000
    };

    const startTime = new Date(Date.now() - (timeRangeMap[timeRange] || timeRangeMap['7d']));

    if (tenantId) {
      // Get analytics for specific tenant
      const [analytics, usageRecords, resources] = await Promise.all([
        prisma.tenantAnalytics.findMany({
          where: {
            tenantId,
            timestamp: { gte: startTime },
            ...(category && { metricCategory: category }),
            ...(metrics.length > 0 && { metricName: { in: metrics } })
          },
          orderBy: { timestamp: 'asc' }
        }),
        prisma.tenantUsageRecord.findMany({
          where: {
            tenantId,
            timestamp: { gte: startTime }
          },
          orderBy: { timestamp: 'asc' }
        }),
        prisma.tenantResource.findMany({
          where: { tenantId }
        })
      ]);

      // Process and aggregate data
      const analyticsData = analytics.reduce((acc, record) => {
        const key = `${record.metricCategory}-${record.metricName}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push({
          timestamp: record.timestamp,
          value: record.metricValue,
          unit: record.metricUnit,
          dimensions: record.dimensions,
          trend: record.trendDirection,
          change: record.percentChange
        });
        return acc;
      }, {} as Record<string, any[]>);

      const usageData = usageRecords.reduce((acc, record) => {
        const key = `${record.resourceType}-${record.metricName}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push({
          timestamp: record.timestamp,
          value: Number(record.value),
          unit: record.unit,
          period: record.period,
          aggregation: record.aggregation
        });
        return acc;
      }, {} as Record<string, any[]>);

      // Calculate resource utilization
      const resourceUtilization = resources.map(resource => ({
        resourceType: resource.resourceType,
        resourceName: resource.resourceName,
        allocated: Number(resource.allocatedAmount),
        used: Number(resource.usedAmount),
        utilization: Number(resource.usedAmount) / Number(resource.allocatedAmount),
        status: resource.status,
        unit: resource.unit,
        alertThreshold: resource.alertThreshold
      }));

      return NextResponse.json({
        success: true,
        data: {
          tenantId,
          timeRange,
          analytics: analyticsData,
          usage: usageData,
          resources: resourceUtilization,
          summary: {
            totalMetrics: analytics.length,
            totalUsageRecords: usageRecords.length,
            alertsTriggered: analytics.filter(a => a.alertTriggered).length,
            avgPerformance: analytics
              .filter(a => a.metricCategory === 'performance')
              .reduce((sum, a) => sum + a.metricValue, 0) / 
              Math.max(analytics.filter(a => a.metricCategory === 'performance').length, 1)
          }
        }
      });
    } else {
      // Get system-wide tenant analytics
      const [tenantStats, topTenants, usageOverview] = await Promise.all([
        prisma.tenant.aggregate({
          _count: true,
          _avg: {
            maxUsers: true,
            storageLimit: true,
            bandwidthLimit: true
          }
        }),
        prisma.tenantAnalytics.groupBy({
          by: ['tenantId'],
          where: {
            timestamp: { gte: startTime },
            metricCategory: 'usage'
          },
          _sum: {
            metricValue: true
          },
          orderBy: {
            _sum: {
              metricValue: 'desc'
            }
          },
          take: 10
        }),
        prisma.tenantUsageRecord.groupBy({
          by: ['resourceType'],
          where: {
            timestamp: { gte: startTime }
          },
          _sum: {
            value: true
          },
          _avg: {
            value: true
          }
        })
      ]);

      // Get tenant details for top tenants
      const topTenantIds = topTenants.map(t => t.tenantId);
      const tenantDetails = await prisma.tenant.findMany({
        where: { id: { in: topTenantIds } },
        select: { id: true, name: true, plan: true, tier: true }
      });

      const enrichedTopTenants = topTenants.map(usage => {
        const tenant = tenantDetails.find(t => t.id === usage.tenantId);
        return {
          ...usage,
          tenant
        };
      });

      return NextResponse.json({
        success: true,
        data: {
          systemStats: {
            totalTenants: tenantStats._count,
            avgMaxUsers: tenantStats._avg.maxUsers,
            avgStorageLimit: tenantStats._avg.storageLimit,
            avgBandwidthLimit: tenantStats._avg.bandwidthLimit
          },
          topTenants: enrichedTopTenants,
          usageOverview: usageOverview.map(usage => ({
            resourceType: usage.resourceType,
            totalUsage: Number(usage._sum.value || 0),
            avgUsage: Number(usage._avg.value || 0)
          })),
          timeRange
        }
      });
    }
  } catch (error) {
    console.error('Tenant analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      tenantId,
      metricCategory,
      metricName,
      metricValue,
      metricUnit,
      dimensions = {},
      period = 'daily'
    } = body;

    if (!tenantId || !metricCategory || !metricName || metricValue === undefined) {
      return NextResponse.json(
        { error: 'tenantId, metricCategory, metricName, and metricValue are required' },
        { status: 400 }
      );
    }

    // Calculate trend if previous data exists
    const previousRecord = await prisma.tenantAnalytics.findFirst({
      where: {
        tenantId,
        metricCategory,
        metricName
      },
      orderBy: { timestamp: 'desc' }
    });

    let trendDirection: string | null = null;
    let percentChange: number | null = null;

    if (previousRecord) {
      const change = metricValue - previousRecord.metricValue;
      percentChange = previousRecord.metricValue !== 0 
        ? (change / previousRecord.metricValue) * 100 
        : 0;
      
      if (Math.abs(percentChange) < 5) {
        trendDirection = 'stable';
      } else {
        trendDirection = change > 0 ? 'up' : 'down';
      }
    }

    const analyticsRecord = await prisma.tenantAnalytics.create({
      data: {
        tenantId,
        metricCategory,
        metricName,
        metricValue,
        metricUnit,
        dimensions,
        period,
        trendDirection,
        percentChange
      }
    });

    return NextResponse.json({
      success: true,
      data: analyticsRecord,
      message: 'Analytics record created successfully'
    });
  } catch (error) {
    console.error('Analytics creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
