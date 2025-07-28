
/**
 * REAL-TIME MONITORING API
 * Real-time system monitoring with live metrics and alerts
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const tenantId = searchParams.get('tenantId') || session.user.tenantId;
    const monitorType = searchParams.get('monitorType');
    const timeRange = searchParams.get('timeRange') || '1h';

    switch (action) {
      case 'system_monitors':
        return await getSystemMonitors(tenantId, monitorType);
      case 'live_metrics':
        return await getLiveMetrics(tenantId, timeRange);
      case 'resource_usage':
        return await getResourceUsage(tenantId);
      case 'alerts':
        return await getActiveAlerts(tenantId);
      case 'health_status':
        return await getHealthStatus(tenantId);
      default:
        return await getMonitoringOverview(tenantId);
    }
  } catch (error) {
    console.error('Real-time monitoring API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, data } = body;

    switch (action) {
      case 'record_metric':
        return await recordLiveMetric(data);
      case 'update_system_monitor':
        return await updateSystemMonitor(data);
      case 'record_resource_usage':
        return await recordResourceUsage(data);
      case 'trigger_alert':
        return await triggerAlert(data);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Real-time monitoring POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getSystemMonitors(tenantId: string, monitorType?: string | null) {
  const where: any = { tenantId };
  if (monitorType) {
    where.monitorType = monitorType;
  }

  const monitors = await prisma.systemMonitor.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    take: 100
  });

  const summary = await prisma.systemMonitor.groupBy({
    by: ['status'],
    where: { tenantId },
    _count: { status: true }
  });

  return NextResponse.json({
    success: true,
    data: {
      monitors,
      summary: summary.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>)
    }
  });
}

async function getLiveMetrics(tenantId: string, timeRange: string) {
  const now = new Date();
  const timeAgo = new Date();
  
  switch (timeRange) {
    case '5m':
      timeAgo.setMinutes(now.getMinutes() - 5);
      break;
    case '15m':
      timeAgo.setMinutes(now.getMinutes() - 15);
      break;
    case '1h':
      timeAgo.setHours(now.getHours() - 1);
      break;
    case '24h':
      timeAgo.setHours(now.getHours() - 24);
      break;
    default:
      timeAgo.setHours(now.getHours() - 1);
  }

  const metrics = await prisma.liveMetric.findMany({
    where: {
      tenantId,
      timestamp: {
        gte: timeAgo
      }
    },
    orderBy: { timestamp: 'desc' },
    take: 1000
  });

  // Group metrics by type and name for easier consumption
  const groupedMetrics = metrics.reduce((acc, metric) => {
    const key = `${metric.metricType}.${metric.metricName}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push({
      timestamp: metric.timestamp,
      value: metric.value,
      unit: metric.unit,
      tags: metric.tags,
      dimensions: metric.dimensions
    });
    return acc;
  }, {} as Record<string, any[]>);

  return NextResponse.json({
    success: true,
    data: {
      metrics: groupedMetrics,
      timeRange,
      recordCount: metrics.length
    }
  });
}

async function getResourceUsage(tenantId: string) {
  const resourceUsages = await prisma.resourceUsage.findMany({
    where: { tenantId },
    orderBy: { timestamp: 'desc' },
    take: 50
  });

  const critical = resourceUsages.filter(r => r.alertStatus === 'critical');
  const warning = resourceUsages.filter(r => r.alertStatus === 'warning');

  return NextResponse.json({
    success: true,
    data: {
      resourceUsages,
      alerts: {
        critical: critical.length,
        warning: warning.length,
        total: critical.length + warning.length
      }
    }
  });
}

async function getActiveAlerts(tenantId: string) {
  const alertTriggers = await prisma.alertTrigger.findMany({
    where: {
      alertConfiguration: {
        tenantId
      },
      status: {
        in: ['triggered', 'acknowledged']
      }
    },
    include: {
      alertConfiguration: true
    },
    orderBy: { triggerTime: 'desc' },
    take: 50
  });

  return NextResponse.json({
    success: true,
    data: {
      alerts: alertTriggers,
      summary: {
        triggered: alertTriggers.filter(a => a.status === 'triggered').length,
        acknowledged: alertTriggers.filter(a => a.status === 'acknowledged').length
      }
    }
  });
}

async function getHealthStatus(tenantId: string) {
  const [systemMonitors, errorRates, uptimeMonitors] = await Promise.all([
    prisma.systemMonitor.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.errorRate.findMany({
      where: { tenantId },
      orderBy: { timestamp: 'desc' },
      take: 10
    }),
    prisma.uptimeMonitor.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' }
    })
  ]);

  const healthScore = calculateHealthScore(systemMonitors, errorRates, uptimeMonitors);

  return NextResponse.json({
    success: true,
    data: {
      healthScore,
      systemStatus: {
        healthy: systemMonitors.filter(m => m.status === 'healthy').length,
        warning: systemMonitors.filter(m => m.status === 'warning').length,
        critical: systemMonitors.filter(m => m.status === 'critical').length,
        down: systemMonitors.filter(m => m.status === 'down').length
      },
      uptime: {
        average: uptimeMonitors.reduce((sum, m) => sum + m.uptimePercent, 0) / (uptimeMonitors.length || 1),
        monitors: uptimeMonitors.length
      },
      errors: {
        totalErrors: errorRates.reduce((sum, e) => sum + e.errorCount, 0),
        averageErrorRate: errorRates.reduce((sum, e) => sum + e.errorRate, 0) / (errorRates.length || 1)
      }
    }
  });
}

async function getMonitoringOverview(tenantId: string) {
  const [systemStatus, liveMetricsCount, resourceAlerts, recentIncidents] = await Promise.all([
    getHealthStatus(tenantId),
    prisma.liveMetric.count({
      where: {
        tenantId,
        timestamp: {
          gte: new Date(Date.now() - 3600000) // Last hour
        }
      }
    }),
    prisma.resourceUsage.count({
      where: {
        tenantId,
        alertStatus: {
          in: ['warning', 'critical']
        }
      }
    }),
    prisma.incidentResponse.count({
      where: {
        tenantId,
        status: {
          in: ['open', 'investigating']
        }
      }
    })
  ]);

  return NextResponse.json({
    success: true,
    data: {
      overview: {
        systemHealth: (await systemStatus.json()).data.healthScore,
        liveMetricsCount,
        resourceAlerts,
        activeIncidents: recentIncidents
      }
    }
  });
}

async function recordLiveMetric(data: any) {
  const metric = await prisma.liveMetric.create({
    data: {
      tenantId: data.tenantId,
      metricType: data.metricType,
      metricName: data.metricName,
      value: parseFloat(data.value),
      unit: data.unit,
      tags: data.tags || {},
      dimensions: data.dimensions || {},
      sourceId: data.sourceId,
      userId: data.userId,
      sessionId: data.sessionId,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { metricId: metric.id }
  });
}

async function updateSystemMonitor(data: any) {
  const monitor = await prisma.systemMonitor.upsert({
    where: {
      id: data.monitorId || 'new'
    },
    create: {
      tenantId: data.tenantId,
      monitorType: data.monitorType,
      instanceId: data.instanceId,
      status: data.status,
      uptime: BigInt(data.uptime || 0),
      responseTime: data.responseTime,
      errorRate: data.errorRate || 0,
      throughput: BigInt(data.throughput || 0),
      memoryUsage: data.memoryUsage || 0,
      cpuUsage: data.cpuUsage || 0,
      diskUsage: data.diskUsage || 0,
      networkIn: BigInt(data.networkIn || 0),
      networkOut: BigInt(data.networkOut || 0),
      activeConnections: data.activeConnections || 0,
      queueDepth: data.queueDepth || 0,
      metadata: data.metadata || {},
      alertsTriggered: data.alertsTriggered || [],
      region: data.region,
      environment: data.environment || 'production'
    },
    update: {
      status: data.status,
      lastHeartbeat: new Date(),
      responseTime: data.responseTime,
      errorRate: data.errorRate,
      throughput: BigInt(data.throughput || 0),
      memoryUsage: data.memoryUsage,
      cpuUsage: data.cpuUsage,
      diskUsage: data.diskUsage,
      networkIn: BigInt(data.networkIn || 0),
      networkOut: BigInt(data.networkOut || 0),
      activeConnections: data.activeConnections,
      queueDepth: data.queueDepth,
      metadata: data.metadata || {},
      alertsTriggered: data.alertsTriggered || []
    }
  });

  return NextResponse.json({
    success: true,
    data: { monitorId: monitor.id }
  });
}

async function recordResourceUsage(data: any) {
  const usage = await prisma.resourceUsage.create({
    data: {
      tenantId: data.tenantId,
      resourceType: data.resourceType,
      resourceName: data.resourceName,
      currentUsage: parseFloat(data.currentUsage),
      maxCapacity: data.maxCapacity ? parseFloat(data.maxCapacity) : null,
      usagePercent: parseFloat(data.usagePercent),
      unit: data.unit,
      threshold: data.threshold || {},
      alertStatus: data.alertStatus || 'ok',
      trend: data.trend,
      forecast: data.forecast || {},
      region: data.region,
      instanceId: data.instanceId,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { usageId: usage.id }
  });
}

async function triggerAlert(data: any) {
  const alertTrigger = await prisma.alertTrigger.create({
    data: {
      alertConfigurationId: data.alertConfigurationId,
      triggerValue: parseFloat(data.triggerValue),
      status: 'triggered',
      notificationsSent: data.notificationsSent || [],
      escalationLevel: data.escalationLevel || 0,
      metadata: data.metadata || {}
    }
  });

  // Update alert configuration trigger count
  await prisma.alertConfiguration.update({
    where: { id: data.alertConfigurationId },
    data: {
      lastTriggered: new Date(),
      triggerCount: {
        increment: 1
      }
    }
  });

  return NextResponse.json({
    success: true,
    data: { alertTriggerId: alertTrigger.id }
  });
}

function calculateHealthScore(systemMonitors: any[], errorRates: any[], uptimeMonitors: any[]): number {
  let score = 100;

  // System monitors impact (40% weight)
  const healthyMonitors = systemMonitors.filter(m => m.status === 'healthy').length;
  const totalMonitors = systemMonitors.length || 1;
  const systemHealthRatio = healthyMonitors / totalMonitors;
  score *= systemHealthRatio * 0.4 + 0.6;

  // Error rates impact (30% weight)
  const avgErrorRate = errorRates.reduce((sum, e) => sum + e.errorRate, 0) / (errorRates.length || 1);
  const errorImpact = Math.max(0, 1 - (avgErrorRate / 100));
  score *= errorImpact * 0.3 + 0.7;

  // Uptime impact (30% weight)
  const avgUptime = uptimeMonitors.reduce((sum, m) => sum + m.uptimePercent, 0) / (uptimeMonitors.length || 1);
  const uptimeImpact = avgUptime / 100;
  score *= uptimeImpact * 0.3 + 0.7;

  return Math.round(Math.max(0, Math.min(100, score)));
}
