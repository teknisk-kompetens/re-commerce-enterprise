
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Tenant Monitoring API
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');
    const metric = searchParams.get('metric');
    const timeRange = searchParams.get('timeRange') || '24h';

    // Calculate time range
    const timeRangeMap: Record<string, number> = {
      '1h': 1 * 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };

    const startTime = new Date(Date.now() - (timeRangeMap[timeRange] || timeRangeMap['24h']));

    if (tenantId) {
      // Get monitoring data for specific tenant
      const [tenant, healthChecks, usageAlerts, performanceMetrics] = await Promise.all([
        prisma.tenant.findUnique({
          where: { id: tenantId },
          select: {
            id: true,
            name: true,
            status: true,
            plan: true,
            tier: true,
            lastAccessedAt: true,
            maxUsers: true,
            storageLimit: true,
            bandwidthLimit: true,
            apiCallLimit: true,
            _count: {
              select: {
                users: true,
                tenantUsageRecords: {
                  where: {
                    timestamp: { gte: startTime }
                  }
                }
              }
            }
          }
        }),
        // Simulated health checks - in production, this would be real monitoring data
        generateHealthChecks(tenantId, startTime),
        prisma.tenantAnalytics.findMany({
          where: {
            tenantId,
            alertTriggered: true,
            timestamp: { gte: startTime }
          },
          orderBy: { timestamp: 'desc' }
        }),
        prisma.tenantUsageRecord.findMany({
          where: {
            tenantId,
            timestamp: { gte: startTime }
          },
          orderBy: { timestamp: 'asc' }
        })
      ]);

      if (!tenant) {
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
      }

      // Calculate current resource usage
      const currentUsage = performanceMetrics.reduce((acc, record) => {
        const key = record.resourceType;
        if (!acc[key]) {
          acc[key] = { total: 0, count: 0, latest: 0 };
        }
        acc[key].total += Number(record.value);
        acc[key].count += 1;
        acc[key].latest = Number(record.value);
        return acc;
      }, {} as Record<string, { total: number; count: number; latest: number }>);

      // Calculate utilization percentages
      const utilization = {
        users: {
          used: tenant._count.users,
          allocated: tenant.maxUsers,
          percentage: Math.round((tenant._count.users / tenant.maxUsers) * 100)
        },
        storage: {
          used: currentUsage.storage?.latest || 0,
          allocated: Number(tenant.storageLimit),
          percentage: Math.round(((currentUsage.storage?.latest || 0) / Number(tenant.storageLimit)) * 100)
        },
        bandwidth: {
          used: currentUsage.bandwidth?.latest || 0,
          allocated: Number(tenant.bandwidthLimit),
          percentage: Math.round(((currentUsage.bandwidth?.latest || 0) / Number(tenant.bandwidthLimit)) * 100)
        },
        apiCalls: {
          used: currentUsage.api_calls?.latest || 0,
          allocated: tenant.apiCallLimit,
          percentage: Math.round(((currentUsage.api_calls?.latest || 0) / tenant.apiCallLimit) * 100)
        }
      };

      // Determine overall health status
      const healthScore = calculateHealthScore(tenant, utilization, healthChecks, usageAlerts);
      
      const monitoringData = {
        tenant: {
          id: tenant.id,
          name: tenant.name,
          status: tenant.status,
          plan: tenant.plan,
          tier: tenant.tier,
          lastAccessedAt: tenant.lastAccessedAt,
          healthScore,
          healthStatus: getHealthStatus(healthScore)
        },
        utilization,
        healthChecks,
        alerts: {
          active: usageAlerts.filter(a => a.alertLevel === 'critical').length,
          warnings: usageAlerts.filter(a => a.alertLevel === 'warning').length,
          recent: usageAlerts.slice(0, 10)
        },
        performance: {
          uptime: healthChecks.filter(h => h.status === 'healthy').length / healthChecks.length * 100,
          responseTime: healthChecks.reduce((sum, h) => sum + h.responseTime, 0) / healthChecks.length,
          errorRate: healthChecks.filter(h => h.status === 'error').length / healthChecks.length * 100
        },
        usage: {
          timeline: performanceMetrics.map(record => ({
            timestamp: record.timestamp,
            resourceType: record.resourceType,
            value: Number(record.value),
            unit: record.unit
          })),
          summary: Object.entries(currentUsage).map(([resource, data]) => ({
            resource,
            current: data.latest,
            average: data.total / data.count,
            dataPoints: data.count
          }))
        }
      };

      return NextResponse.json({
        success: true,
        data: monitoringData
      });
    } else {
      // Get system-wide monitoring overview
      const [tenantCount, systemHealth, topAlerts] = await Promise.all([
        prisma.tenant.groupBy({
          by: ['status', 'plan'],
          _count: true
        }),
        generateSystemHealth(),
        prisma.tenantAnalytics.findMany({
          where: {
            alertTriggered: true,
            timestamp: { gte: startTime }
          },
          orderBy: { timestamp: 'desc' },
          take: 20,
          include: {
            tenant: {
              select: { id: true, name: true, plan: true }
            }
          }
        })
      ]);

      return NextResponse.json({
        success: true,
        data: {
          systemOverview: {
            tenantDistribution: tenantCount,
            totalTenants: tenantCount.reduce((sum, group) => sum + group._count, 0),
            activeTenants: tenantCount
              .filter(group => group.status === 'active')
              .reduce((sum, group) => sum + group._count, 0)
          },
          systemHealth,
          topAlerts: topAlerts.map(alert => ({
            ...alert,
            tenant: alert.tenant
          }))
        }
      });
    }
  } catch (error) {
    console.error('Tenant monitoring error:', error);
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
    const { tenantId, resourceType, metricName, value, unit = '', metadata = {} } = body;

    if (!tenantId || !resourceType || !metricName || value === undefined) {
      return NextResponse.json(
        { error: 'tenantId, resourceType, metricName, and value are required' },
        { status: 400 }
      );
    }

    // Create usage record
    const usageRecord = await prisma.tenantUsageRecord.create({
      data: {
        tenantId,
        resourceType,
        metricName,
        value: BigInt(value),
        unit,
        metadata
      }
    });

    // Update resource usage if exists
    const resource = await prisma.tenantResource.findFirst({
      where: {
        tenantId,
        resourceType,
        resourceName: metricName
      }
    });

    if (resource) {
      const newUsedAmount = BigInt(value);
      const utilization = Number(newUsedAmount) / Number(resource.allocatedAmount);

      await prisma.tenantResource.update({
        where: { id: resource.id },
        data: {
          usedAmount: newUsedAmount,
          updatedAt: new Date()
        }
      });

      // Check if alert threshold is exceeded
      if (utilization >= resource.alertThreshold) {
        await prisma.tenantAnalytics.create({
          data: {
            tenantId,
            metricCategory: 'alert',
            metricName: 'resource_threshold_exceeded',
            metricValue: utilization * 100,
            metricUnit: 'percentage',
            alertTriggered: true,
            alertLevel: utilization >= 0.95 ? 'critical' : 'warning',
            dimensions: {
              resourceType,
              resourceName: resource.resourceName,
              threshold: resource.alertThreshold,
              utilization
            }
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...usageRecord,
        value: Number(usageRecord.value)
      },
      message: 'Usage data recorded successfully'
    });
  } catch (error) {
    console.error('Usage recording error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions
function calculateHealthScore(
  tenant: any,
  utilization: any,
  healthChecks: any[],
  alerts: any[]
): number {
  let score = 100;

  // Penalize based on resource utilization
  Object.values(utilization).forEach((resource: any) => {
    if (resource.percentage > 90) score -= 20;
    else if (resource.percentage > 80) score -= 10;
    else if (resource.percentage > 70) score -= 5;
  });

  // Penalize based on health checks
  const failedChecks = healthChecks.filter(h => h.status !== 'healthy').length;
  score -= failedChecks * 5;

  // Penalize based on recent alerts
  const criticalAlerts = alerts.filter(a => a.alertLevel === 'critical').length;
  const warningAlerts = alerts.filter(a => a.alertLevel === 'warning').length;
  score -= criticalAlerts * 15;
  score -= warningAlerts * 5;

  return Math.max(0, Math.min(100, score));
}

function getHealthStatus(score: number): string {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'fair';
  if (score >= 40) return 'poor';
  return 'critical';
}

async function generateHealthChecks(tenantId: string, startTime: Date): Promise<any[]> {
  // Simulate health check data - in production, this would come from real monitoring
  const checks: Array<{ timestamp: Date; service: string; status: string; responseTime: number; details: any }> = [];
  const now = new Date();
  const interval = 5 * 60 * 1000; // 5 minutes

  for (let time = startTime.getTime(); time <= now.getTime(); time += interval) {
    checks.push({
      timestamp: new Date(time),
      service: 'api',
      status: Math.random() > 0.05 ? 'healthy' : 'error',
      responseTime: Math.random() * 100 + 50,
      details: {}
    });
    
    checks.push({
      timestamp: new Date(time),
      service: 'database',
      status: Math.random() > 0.02 ? 'healthy' : 'degraded',
      responseTime: Math.random() * 50 + 10,
      details: {}
    });
  }

  return checks;
}

async function generateSystemHealth(): Promise<any> {
  return {
    cpu: Math.random() * 30 + 40,
    memory: Math.random() * 20 + 60,
    disk: Math.random() * 15 + 75,
    network: Math.random() * 10 + 85,
    services: {
      api: 'healthy',
      database: 'healthy',
      cache: 'healthy',
      storage: 'healthy'
    }
  };
}
