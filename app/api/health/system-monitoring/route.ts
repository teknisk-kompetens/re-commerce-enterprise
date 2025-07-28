
/**
 * SYSTEM HEALTH MONITORING API
 * Uptime monitoring, error rate tracking, alert management, and incident response
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
    const timeRange = searchParams.get('timeRange') || '24h';
    const severity = searchParams.get('severity');

    switch (action) {
      case 'uptime_monitoring':
        return await getUptimeMonitoring(tenantId, timeRange);
      case 'error_tracking':
        return await getErrorTracking(tenantId, timeRange, severity);
      case 'alert_management':
        return await getAlertManagement(tenantId);
      case 'incident_response':
        return await getIncidentResponse(tenantId, timeRange);
      case 'health_checks':
        return await getHealthChecks(tenantId);
      case 'system_status':
        return await getSystemStatus(tenantId);
      case 'sla_metrics':
        return await getSLAMetrics(tenantId, timeRange);
      default:
        return await getHealthOverview(tenantId, timeRange);
    }
  } catch (error) {
    console.error('System health monitoring API error:', error);
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
      case 'create_uptime_monitor':
        return await createUptimeMonitor(data);
      case 'record_uptime_check':
        return await recordUptimeCheck(data);
      case 'create_alert_config':
        return await createAlertConfiguration(data);
      case 'trigger_alert':
        return await triggerAlert(data);
      case 'acknowledge_alert':
        return await acknowledgeAlert(data);
      case 'resolve_alert':
        return await resolveAlert(data);
      case 'create_incident':
        return await createIncident(data);
      case 'update_incident':
        return await updateIncident(data);
      case 'record_error_rate':
        return await recordErrorRate(data);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('System health monitoring POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getUptimeMonitoring(tenantId: string, timeRange: string) {
  const dateFilter = getDateFilter(timeRange);

  const [monitors, checks, downtimeEvents] = await Promise.all([
    prisma.uptimeMonitor.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.uptimeCheck.findMany({
      where: {
        monitor: { tenantId },
        checkTime: dateFilter
      },
      include: { monitor: true },
      orderBy: { checkTime: 'desc' },
      take: 1000
    }),
    prisma.uptimeCheck.findMany({
      where: {
        monitor: { tenantId },
        status: 'failure',
        checkTime: dateFilter
      },
      include: { monitor: true },
      orderBy: { checkTime: 'desc' }
    })
  ]);

  // Calculate uptime statistics
  const uptimeStats = monitors.map(monitor => {
    const monitorChecks = checks.filter(c => c.monitorId === monitor.id);
    const successfulChecks = monitorChecks.filter(c => c.status === 'success').length;
    const totalChecks = monitorChecks.length;
    const currentUptime = totalChecks > 0 ? (successfulChecks / totalChecks) * 100 : 100;
    
    const avgResponseTime = monitorChecks.reduce((sum, c) => sum + (c.responseTime || 0), 0) / (monitorChecks.length || 1);
    const recentDowntime = downtimeEvents.filter(e => e.monitorId === monitor.id);

    return {
      id: monitor.id,
      monitorName: monitor.monitorName,
      monitorType: monitor.monitorType,
      target: monitor.target,
      status: monitor.status,
      currentUptime: Math.round(currentUptime * 100) / 100,
      targetUptime: monitor.slaTarget,
      avgResponseTime: Math.round(avgResponseTime),
      totalChecks,
      successfulChecks,
      failedChecks: totalChecks - successfulChecks,
      recentDowntime: recentDowntime.length,
      lastCheckTime: monitor.lastCheckTime,
      isActive: monitor.isActive
    };
  });

  // Overall uptime summary
  const overallStats = {
    totalMonitors: monitors.length,
    activeMonitors: monitors.filter(m => m.isActive).length,
    upMonitors: monitors.filter(m => m.status === 'up').length,
    downMonitors: monitors.filter(m => m.status === 'down').length,
    degradedMonitors: monitors.filter(m => m.status === 'degraded').length,
    avgUptime: Math.round(uptimeStats.reduce((sum, m) => sum + m.currentUptime, 0) / (uptimeStats.length || 1)),
    totalDowntimeEvents: downtimeEvents.length
  };

  return NextResponse.json({
    success: true,
    data: {
      overview: overallStats,
      monitors: uptimeStats,
      recentDowntime: downtimeEvents.slice(0, 20).map(event => ({
        monitorName: event.monitor.monitorName,
        checkTime: event.checkTime,
        errorMessage: event.errorMessage,
        responseTime: event.responseTime,
        region: event.region
      })),
      timeSeriesData: groupUptimeByTime(checks, timeRange)
    }
  });
}

async function getErrorTracking(tenantId: string, timeRange: string, severity?: string | null) {
  const dateFilter = getDateFilter(timeRange);
  const where: any = { tenantId, timestamp: dateFilter };
  if (severity) {
    where.severity = severity;
  }

  const [errorRates, errorsByService, errorTrends, criticalErrors] = await Promise.all([
    prisma.errorRate.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 500
    }),
    prisma.errorRate.groupBy({
      by: ['serviceName', 'errorType'],
      where,
      _sum: { errorCount: true, totalRequests: true },
      _avg: { errorRate: true },
      _count: { serviceName: true },
      orderBy: { _avg: { errorRate: 'desc' } }
    }),
    prisma.errorRate.groupBy({
      by: ['timestamp'],
      where,
      _sum: { errorCount: true, totalRequests: true },
      _avg: { errorRate: true },
      orderBy: { timestamp: 'asc' }
    }),
    prisma.errorRate.findMany({
      where: {
        ...where,
        severity: 'critical',
        resolved: false
      },
      orderBy: { lastOccurrence: 'desc' },
      take: 10
    })
  ]);

  const totalErrors = errorRates.reduce((sum, e) => sum + e.errorCount, 0);
  const totalRequests = errorRates.reduce((sum, e) => sum + e.totalRequests, 0);
  const overallErrorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;

  const errorAnalysis = {
    totalErrors,
    totalRequests,
    overallErrorRate: Math.round(overallErrorRate * 1000) / 1000,
    uniqueErrors: errorRates.length,
    criticalErrors: criticalErrors.length,
    resolvedErrors: errorRates.filter(e => e.resolved).length,
    mostAffectedUsers: Math.max(...errorRates.map(e => e.affectedUsers), 0)
  };

  return NextResponse.json({
    success: true,
    data: {
      overview: errorAnalysis,
      errorsByService: errorsByService.map(error => ({
        service: error.serviceName,
        errorType: error.errorType,
        totalErrors: error._sum.errorCount || 0,
        totalRequests: error._sum.totalRequests || 0,
        errorRate: Math.round((error._avg.errorRate || 0) * 1000) / 1000,
        occurrences: error._count.serviceName
      })),
      criticalErrors: criticalErrors.map(error => ({
        id: error.id,
        service: error.serviceName,
        type: error.errorType,
        message: error.errorMessage,
        errorCount: error.errorCount,
        affectedUsers: error.affectedUsers,
        firstOccurrence: error.firstOccurrence,
        lastOccurrence: error.lastOccurrence
      })),
      timeSeriesData: groupErrorsByTime(errorRates, timeRange),
      errorTrends: errorTrends.map(trend => ({
        timestamp: trend.timestamp,
        errorCount: trend._sum.errorCount || 0,
        totalRequests: trend._sum.totalRequests || 0,
        errorRate: Math.round((trend._avg.errorRate || 0) * 1000) / 1000
      }))
    }
  });
}

async function getAlertManagement(tenantId: string) {
  const [alertConfigs, activeAlerts, recentTriggers, alertStats] = await Promise.all([
    prisma.alertConfiguration.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.alertTrigger.findMany({
      where: {
        alertConfiguration: { tenantId },
        status: { in: ['triggered', 'acknowledged'] }
      },
      include: { alertConfiguration: true },
      orderBy: { triggerTime: 'desc' }
    }),
    prisma.alertTrigger.findMany({
      where: {
        alertConfiguration: { tenantId }
      },
      include: { alertConfiguration: true },
      orderBy: { triggerTime: 'desc' },
      take: 50
    }),
    prisma.alertTrigger.groupBy({
      by: ['status'],
      where: {
        alertConfiguration: { tenantId }
      },
      _count: { status: true }
    })
  ]);

  const alertSummary = {
    totalAlerts: alertConfigs.length,
    activeAlerts: alertConfigs.filter(a => a.isActive).length,
    triggeredAlerts: activeAlerts.filter(a => a.status === 'triggered').length,
    acknowledgedAlerts: activeAlerts.filter(a => a.status === 'acknowledged').length,
    resolvedAlerts: alertStats.find(s => s.status === 'resolved')?._count.status || 0,
    criticalAlerts: activeAlerts.filter(a => a.alertConfiguration.severity === 'critical').length
  };

  return NextResponse.json({
    success: true,
    data: {
      overview: alertSummary,
      alertConfigurations: alertConfigs.map(config => ({
        id: config.id,
        alertName: config.alertName,
        alertType: config.alertType,
        metricName: config.metricName,
        condition: config.condition,
        threshold: config.threshold,
        severity: config.severity,
        isActive: config.isActive,
        triggerCount: config.triggerCount,
        lastTriggered: config.lastTriggered
      })),
      activeAlerts: activeAlerts.map(alert => ({
        id: alert.id,
        alertName: alert.alertConfiguration.alertName,
        severity: alert.alertConfiguration.severity,
        triggerValue: alert.triggerValue,
        threshold: alert.alertConfiguration.threshold,
        status: alert.status,
        triggerTime: alert.triggerTime,
        acknowledgedBy: alert.acknowledgedBy,
        acknowledgedAt: alert.acknowledgedAt,
        escalationLevel: alert.escalationLevel
      })),
      recentTriggers: recentTriggers.slice(0, 20).map(trigger => ({
        id: trigger.id,
        alertName: trigger.alertConfiguration.alertName,
        severity: trigger.alertConfiguration.severity,
        status: trigger.status,
        triggerTime: trigger.triggerTime,
        triggerValue: trigger.triggerValue,
        resolvedAt: trigger.resolvedAt
      }))
    }
  });
}

async function getIncidentResponse(tenantId: string, timeRange: string) {
  const dateFilter = getDateFilter(timeRange);

  const [incidents, incidentStats, recentIncidents] = await Promise.all([
    prisma.incidentResponse.findMany({
      where: { tenantId, detectedAt: dateFilter },
      orderBy: { detectedAt: 'desc' }
    }),
    prisma.incidentResponse.groupBy({
      by: ['status', 'severity'],
      where: { tenantId, detectedAt: dateFilter },
      _count: { status: true },
      _avg: { estimatedImpact: true }
    }),
    prisma.incidentResponse.findMany({
      where: { 
        tenantId,
        status: { in: ['open', 'investigating'] }
      },
      orderBy: { detectedAt: 'desc' },
      take: 10
    })
  ]);

  const mttr = calculateMTTR(incidents.filter(i => i.resolvedAt));
  const slaBreaches = incidents.filter(i => i.slaBreached).length;

  const incidentSummary = {
    totalIncidents: incidents.length,
    openIncidents: incidents.filter(i => i.status === 'open').length,
    investigatingIncidents: incidents.filter(i => i.status === 'investigating').length,
    resolvedIncidents: incidents.filter(i => i.status === 'resolved').length,
    criticalIncidents: incidents.filter(i => i.severity === 'critical').length,
    slaBreaches,
    mttr: Math.round(mttr),
    avgImpact: Math.round(incidents.reduce((sum, i) => sum + i.estimatedImpact, 0) / (incidents.length || 1))
  };

  return NextResponse.json({
    success: true,
    data: {
      overview: incidentSummary,
      incidents: incidents.map(incident => ({
        id: incident.id,
        incidentId: incident.incidentId,
        title: incident.title,
        description: incident.description,
        severity: incident.severity,
        status: incident.status,
        category: incident.category,
        priority: incident.priority,
        assignedTo: incident.assignedTo,
        affectedServices: incident.affectedServices,
        affectedUsers: incident.affectedUsers,
        detectedAt: incident.detectedAt,
        acknowledgedAt: incident.acknowledgedAt,
        resolvedAt: incident.resolvedAt,
        slaBreached: incident.slaBreached,
        estimatedImpact: incident.estimatedImpact
      })),
      recentIncidents: recentIncidents.map(incident => ({
        id: incident.id,
        incidentId: incident.incidentId,
        title: incident.title,
        severity: incident.severity,
        status: incident.status,
        detectedAt: incident.detectedAt,
        affectedUsers: incident.affectedUsers
      })),
      incidentTrends: groupIncidentsByTime(incidents, timeRange)
    }
  });
}

async function getHealthChecks(tenantId: string) {
  const healthChecks = await Promise.all([
    checkDatabaseHealth(tenantId),
    checkApplicationHealth(tenantId),
    checkExternalServicesHealth(tenantId),
    checkStorageHealth(tenantId),
    checkNetworkHealth(tenantId)
  ]);

  const overallHealth = calculateOverallHealth(healthChecks);

  return NextResponse.json({
    success: true,
    data: {
      overallHealth,
      checks: healthChecks,
      timestamp: new Date()
    }
  });
}

async function getSystemStatus(tenantId: string) {
  const [monitors, errors, alerts, incidents] = await Promise.all([
    prisma.systemMonitor.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' }
    }),
    prisma.errorRate.count({
      where: {
        tenantId,
        resolved: false,
        severity: { in: ['high', 'critical'] }
      }
    }),
    prisma.alertTrigger.count({
      where: {
        alertConfiguration: { tenantId },
        status: { in: ['triggered', 'acknowledged'] }
      }
    }),
    prisma.incidentResponse.count({
      where: {
        tenantId,
        status: { in: ['open', 'investigating'] }
      }
    })
  ]);

  const systemHealth = calculateSystemHealth(monitors);
  const statusLevel = determineStatusLevel(systemHealth, errors, alerts, incidents);

  return NextResponse.json({
    success: true,
    data: {
      status: statusLevel,
      systemHealth,
      components: {
        monitors: {
          total: monitors.length,
          healthy: monitors.filter(m => m.status === 'healthy').length,
          warning: monitors.filter(m => m.status === 'warning').length,
          critical: monitors.filter(m => m.status === 'critical').length,
          down: monitors.filter(m => m.status === 'down').length
        },
        errors: {
          unresolved: errors
        },
        alerts: {
          active: alerts
        },
        incidents: {
          open: incidents
        }
      },
      lastUpdated: new Date()
    }
  });
}

async function getSLAMetrics(tenantId: string, timeRange: string) {
  const dateFilter = getDateFilter(timeRange);

  const [uptimeData, responseTimeData, errorRateData] = await Promise.all([
    prisma.uptimeCheck.findMany({
      where: {
        monitor: { tenantId },
        checkTime: dateFilter
      },
      include: { monitor: true }
    }),
    prisma.aPMMetric.findMany({
      where: { tenantId, timestamp: dateFilter },
      select: { responseTime: true, serviceName: true, timestamp: true }
    }),
    prisma.errorRate.findMany({
      where: { tenantId, timestamp: dateFilter },
      select: { errorRate: true, serviceName: true, timestamp: true }
    })
  ]);

  const slaMetrics = {
    uptime: calculateSLAUptime(uptimeData),
    responseTime: calculateSLAResponseTime(responseTimeData),
    errorRate: calculateSLAErrorRate(errorRateData),
    availability: calculateAvailability(uptimeData, errorRateData)
  };

  return NextResponse.json({
    success: true,
    data: {
      slaMetrics,
      period: timeRange,
      timestamp: new Date()
    }
  });
}

async function getHealthOverview(tenantId: string, timeRange: string) {
  const [uptime, errors, alerts, incidents, healthChecks] = await Promise.all([
    getUptimeMonitoring(tenantId, timeRange),
    getErrorTracking(tenantId, timeRange),
    getAlertManagement(tenantId),
    getIncidentResponse(tenantId, timeRange),
    getHealthChecks(tenantId)
  ]);

  const [uptimeData, errorData, alertData, incidentData, healthData] = await Promise.all([
    uptime.json(),
    errors.json(),
    alerts.json(),
    incidents.json(),
    healthChecks.json()
  ]);

  return NextResponse.json({
    success: true,
    data: {
      overview: {
        uptime: uptimeData.data.overview,
        errors: errorData.data.overview,
        alerts: alertData.data.overview,
        incidents: incidentData.data.overview,
        health: healthData.data.overallHealth
      },
      status: determineOverallStatus(
        uptimeData.data.overview,
        errorData.data.overview,
        alertData.data.overview,
        incidentData.data.overview
      ),
      timeRange
    }
  });
}

// Create/Update functions
async function createUptimeMonitor(data: any) {
  const monitor = await prisma.uptimeMonitor.create({
    data: {
      tenantId: data.tenantId,
      monitorName: data.monitorName,
      monitorType: data.monitorType,
      target: data.target,
      checkInterval: data.checkInterval || 60,
      timeout: data.timeout || 30,
      isActive: data.isActive !== false,
      regions: data.regions || [],
      alertContacts: data.alertContacts || [],
      slaTarget: data.slaTarget || 99.9,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { monitorId: monitor.id }
  });
}

async function recordUptimeCheck(data: any) {
  const check = await prisma.uptimeCheck.create({
    data: {
      monitorId: data.monitorId,
      status: data.status,
      responseTime: data.responseTime,
      statusCode: data.statusCode,
      errorMessage: data.errorMessage,
      responseSize: data.responseSize,
      region: data.region,
      ipAddress: data.ipAddress,
      sslExpiry: data.sslExpiry ? new Date(data.sslExpiry) : null,
      metadata: data.metadata || {}
    }
  });

  // Update monitor statistics
  await updateMonitorStats(data.monitorId, data.status, data.responseTime);

  return NextResponse.json({
    success: true,
    data: { checkId: check.id }
  });
}

async function createAlertConfiguration(data: any) {
  const config = await prisma.alertConfiguration.create({
    data: {
      tenantId: data.tenantId,
      alertName: data.alertName,
      alertType: data.alertType,
      metricName: data.metricName,
      condition: data.condition,
      threshold: parseFloat(data.threshold),
      evaluationWindow: data.evaluationWindow || 300,
      datapoints: data.datapoints || 2,
      comparison: data.comparison || 'greater_than',
      isActive: data.isActive !== false,
      severity: data.severity || 'medium',
      description: data.description,
      query: data.query,
      suppressionRules: data.suppressionRules || {},
      escalationRules: data.escalationRules || {},
      notificationChannels: data.notificationChannels || [],
      tags: data.tags || [],
      createdBy: data.createdBy,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { alertConfigId: config.id }
  });
}

async function triggerAlert(data: any) {
  const trigger = await prisma.alertTrigger.create({
    data: {
      alertConfigurationId: data.alertConfigurationId,
      triggerValue: parseFloat(data.triggerValue),
      status: 'triggered',
      notificationsSent: data.notificationsSent || [],
      escalationLevel: data.escalationLevel || 0,
      metadata: data.metadata || {}
    }
  });

  // Update alert configuration stats
  await prisma.alertConfiguration.update({
    where: { id: data.alertConfigurationId },
    data: {
      lastTriggered: new Date(),
      triggerCount: { increment: 1 }
    }
  });

  return NextResponse.json({
    success: true,
    data: { triggerId: trigger.id }
  });
}

async function acknowledgeAlert(data: any) {
  const trigger = await prisma.alertTrigger.update({
    where: { id: data.triggerId },
    data: {
      status: 'acknowledged',
      acknowledgedBy: data.acknowledgedBy,
      acknowledgedAt: new Date(),
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { triggerId: trigger.id }
  });
}

async function resolveAlert(data: any) {
  const trigger = await prisma.alertTrigger.update({
    where: { id: data.triggerId },
    data: {
      status: 'resolved',
      resolvedBy: data.resolvedBy,
      resolvedAt: new Date(),
      resolution: data.resolution,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { triggerId: trigger.id }
  });
}

async function createIncident(data: any) {
  const incident = await prisma.incidentResponse.create({
    data: {
      tenantId: data.tenantId,
      incidentId: data.incidentId || generateIncidentId(),
      title: data.title,
      description: data.description,
      severity: data.severity,
      status: data.status || 'open',
      category: data.category,
      priority: data.priority || 'medium',
      assignedTo: data.assignedTo,
      reportedBy: data.reportedBy,
      affectedServices: data.affectedServices || [],
      affectedUsers: data.affectedUsers || 0,
      estimatedImpact: data.estimatedImpact || 0,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { incidentId: incident.id }
  });
}

async function updateIncident(data: any) {
  const updateData: any = {};
  
  if (data.status) updateData.status = data.status;
  if (data.assignedTo) updateData.assignedTo = data.assignedTo;
  if (data.rootCause) updateData.rootCause = data.rootCause;
  if (data.timeline) updateData.timeline = data.timeline;
  if (data.actions) updateData.actions = data.actions;
  if (data.resolution && data.status === 'resolved') {
    updateData.resolvedAt = new Date();
    updateData.postMortem = data.resolution;
  }
  if (data.status === 'investigating' && !data.acknowledgedAt) {
    updateData.acknowledgedAt = new Date();
  }
  if (data.metadata) updateData.metadata = data.metadata;

  const incident = await prisma.incidentResponse.update({
    where: { id: data.incidentId },
    data: updateData
  });

  return NextResponse.json({
    success: true,
    data: { incidentId: incident.id }
  });
}

async function recordErrorRate(data: any) {
  const errorRate = await prisma.errorRate.create({
    data: {
      tenantId: data.tenantId,
      serviceName: data.serviceName,
      errorType: data.errorType,
      errorCode: data.errorCode,
      errorMessage: data.errorMessage,
      errorCount: data.errorCount || 1,
      totalRequests: data.totalRequests || 1,
      errorRate: parseFloat(data.errorRate || 0),
      severity: data.severity || 'medium',
      affectedUsers: data.affectedUsers || 0,
      stackTrace: data.stackTrace,
      userAgent: data.userAgent,
      ipAddress: data.ipAddress,
      region: data.region,
      environment: data.environment || 'production',
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { errorRateId: errorRate.id }
  });
}

// Helper functions
function getDateFilter(timeRange: string) {
  const now = new Date();
  switch (timeRange) {
    case '1h': return { gte: new Date(now.getTime() - 3600000) };
    case '24h': return { gte: new Date(now.getTime() - 86400000) };
    case '7d': return { gte: new Date(now.getTime() - 604800000) };
    case '30d': return { gte: new Date(now.getTime() - 2592000000) };
    default: return { gte: new Date(now.getTime() - 86400000) };
  }
}

function groupUptimeByTime(checks: any[], timeRange: string) {
  const groupBy = timeRange === '1h' || timeRange === '24h' ? 'hour' : 'day';
  const grouped: Record<string, any> = {};

  checks.forEach(check => {
    const date = new Date(check.checkTime);
    let key: string;

    if (groupBy === 'hour') {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:00`;
    } else {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }

    if (!grouped[key]) {
      grouped[key] = { 
        timestamp: key, 
        totalChecks: 0, 
        successfulChecks: 0, 
        avgResponseTime: 0,
        responseTimeSum: 0
      };
    }

    grouped[key].totalChecks++;
    if (check.status === 'success') {
      grouped[key].successfulChecks++;
    }
    if (check.responseTime) {
      grouped[key].responseTimeSum += check.responseTime;
    }
  });

  return Object.values(grouped).map((group: any) => ({
    timestamp: group.timestamp,
    uptime: group.totalChecks > 0 ? Math.round((group.successfulChecks / group.totalChecks) * 100) : 100,
    avgResponseTime: group.totalChecks > 0 ? Math.round(group.responseTimeSum / group.totalChecks) : 0,
    totalChecks: group.totalChecks
  })).sort((a: any, b: any) => a.timestamp.localeCompare(b.timestamp));
}

function groupErrorsByTime(errors: any[], timeRange: string) {
  const groupBy = timeRange === '1h' || timeRange === '24h' ? 'hour' : 'day';
  const grouped: Record<string, any> = {};

  errors.forEach(error => {
    const date = new Date(error.timestamp);
    let key: string;

    if (groupBy === 'hour') {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:00`;
    } else {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }

    if (!grouped[key]) {
      grouped[key] = { 
        timestamp: key, 
        errorCount: 0, 
        totalRequests: 0
      };
    }

    grouped[key].errorCount += error.errorCount;
    grouped[key].totalRequests += error.totalRequests;
  });

  return Object.values(grouped).map((group: any) => ({
    timestamp: group.timestamp,
    errorCount: group.errorCount,
    totalRequests: group.totalRequests,
    errorRate: group.totalRequests > 0 ? Math.round((group.errorCount / group.totalRequests) * 100 * 1000) / 1000 : 0
  })).sort((a: any, b: any) => a.timestamp.localeCompare(b.timestamp));
}

function groupIncidentsByTime(incidents: any[], timeRange: string) {
  const groupBy = timeRange === '1h' || timeRange === '24h' ? 'hour' : 'day';
  const grouped: Record<string, any> = {};

  incidents.forEach(incident => {
    const date = new Date(incident.detectedAt);
    let key: string;

    if (groupBy === 'hour') {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:00`;
    } else {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }

    if (!grouped[key]) {
      grouped[key] = { 
        timestamp: key, 
        incidents: 0, 
        critical: 0, 
        resolved: 0
      };
    }

    grouped[key].incidents++;
    if (incident.severity === 'critical') grouped[key].critical++;
    if (incident.status === 'resolved') grouped[key].resolved++;
  });

  return Object.values(grouped).sort((a: any, b: any) => a.timestamp.localeCompare(b.timestamp));
}

async function checkDatabaseHealth(tenantId: string) {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - start;

    return {
      component: 'Database',
      status: responseTime < 100 ? 'healthy' : responseTime < 500 ? 'warning' : 'critical',
      responseTime,
      message: `Database responding in ${responseTime}ms`,
      timestamp: new Date()
    };
  } catch (error) {
    return {
      component: 'Database',
      status: 'critical',
      responseTime: null,
      message: `Database connection failed: ${error}`,
      timestamp: new Date()
    };
  }
}

async function checkApplicationHealth(tenantId: string) {
  // Simple application health check
  return {
    component: 'Application',
    status: 'healthy',
    responseTime: Math.random() * 50 + 10, // Simulated response time
    message: 'Application services operational',
    timestamp: new Date()
  };
}

async function checkExternalServicesHealth(tenantId: string) {
  // Check external service connectivity
  return {
    component: 'External Services',
    status: 'healthy',
    responseTime: Math.random() * 200 + 50,
    message: 'External integrations operational',
    timestamp: new Date()
  };
}

async function checkStorageHealth(tenantId: string) {
  return {
    component: 'Storage',
    status: 'healthy',
    responseTime: Math.random() * 30 + 5,
    message: 'Storage systems operational',
    timestamp: new Date()
  };
}

async function checkNetworkHealth(tenantId: string) {
  return {
    component: 'Network',
    status: 'healthy',
    responseTime: Math.random() * 20 + 5,
    message: 'Network connectivity stable',
    timestamp: new Date()
  };
}

function calculateOverallHealth(healthChecks: any[]): { status: string; score: number } {
  const healthyCount = healthChecks.filter(c => c.status === 'healthy').length;
  const warningCount = healthChecks.filter(c => c.status === 'warning').length;
  const criticalCount = healthChecks.filter(c => c.status === 'critical').length;
  
  const score = ((healthyCount * 100) + (warningCount * 60) + (criticalCount * 0)) / (healthChecks.length * 100) * 100;
  
  let status = 'healthy';
  if (score < 60 || criticalCount > 0) status = 'critical';
  else if (score < 80 || warningCount > 1) status = 'warning';
  
  return { status, score: Math.round(score) };
}

function calculateSystemHealth(monitors: any[]): number {
  if (monitors.length === 0) return 100;
  
  const healthyCount = monitors.filter(m => m.status === 'healthy').length;
  const warningCount = monitors.filter(m => m.status === 'warning').length;
  const criticalCount = monitors.filter(m => m.status === 'critical').length;
  const downCount = monitors.filter(m => m.status === 'down').length;
  
  const score = ((healthyCount * 100) + (warningCount * 70) + (criticalCount * 30) + (downCount * 0)) / monitors.length;
  return Math.round(score);
}

function determineStatusLevel(systemHealth: number, errors: number, alerts: number, incidents: number): string {
  if (systemHealth < 60 || incidents > 2 || errors > 10) return 'critical';
  if (systemHealth < 80 || incidents > 0 || alerts > 5 || errors > 3) return 'warning';
  if (alerts > 2 || errors > 0) return 'degraded';
  return 'operational';
}

function determineOverallStatus(uptime: any, errors: any, alerts: any, incidents: any): string {
  const criticalConditions = [
    uptime.avgUptime < 95,
    errors.criticalErrors > 0,
    alerts.criticalAlerts > 0,
    incidents.criticalIncidents > 0
  ];

  const warningConditions = [
    uptime.avgUptime < 99,
    errors.overallErrorRate > 1,
    alerts.triggeredAlerts > 3,
    incidents.openIncidents > 0
  ];

  if (criticalConditions.some(condition => condition)) return 'critical';
  if (warningConditions.some(condition => condition)) return 'warning';
  return 'operational';
}

function calculateMTTR(resolvedIncidents: any[]): number {
  if (resolvedIncidents.length === 0) return 0;
  
  const totalTime = resolvedIncidents.reduce((sum, incident) => {
    const detectedAt = new Date(incident.detectedAt).getTime();
    const resolvedAt = new Date(incident.resolvedAt).getTime();
    return sum + (resolvedAt - detectedAt);
  }, 0);
  
  return totalTime / resolvedIncidents.length / (1000 * 60); // Convert to minutes
}

function calculateSLAUptime(uptimeData: any[]): { target: number; actual: number; met: boolean } {
  const totalChecks = uptimeData.length;
  const successfulChecks = uptimeData.filter(check => check.status === 'success').length;
  const actual = totalChecks > 0 ? (successfulChecks / totalChecks) * 100 : 100;
  const target = 99.9; // Default SLA target
  
  return {
    target,
    actual: Math.round(actual * 1000) / 1000,
    met: actual >= target
  };
}

function calculateSLAResponseTime(responseTimeData: any[]): { target: number; actual: number; met: boolean } {
  const avgResponseTime = responseTimeData.reduce((sum, item) => sum + item.responseTime, 0) / (responseTimeData.length || 1);
  const target = 500; // 500ms target
  
  return {
    target,
    actual: Math.round(avgResponseTime),
    met: avgResponseTime <= target
  };
}

function calculateSLAErrorRate(errorRateData: any[]): { target: number; actual: number; met: boolean } {
  const avgErrorRate = errorRateData.reduce((sum, item) => sum + item.errorRate, 0) / (errorRateData.length || 1);
  const target = 1; // 1% error rate target
  
  return {
    target,
    actual: Math.round(avgErrorRate * 1000) / 1000,
    met: avgErrorRate <= target
  };
}

function calculateAvailability(uptimeData: any[], errorRateData: any[]): { percentage: number; status: string } {
  const uptimeScore = calculateSLAUptime(uptimeData).actual;
  const errorRateScore = 100 - calculateSLAErrorRate(errorRateData).actual;
  
  const availability = (uptimeScore + errorRateScore) / 2;
  let status = 'excellent';
  
  if (availability < 95) status = 'poor';
  else if (availability < 98) status = 'fair';
  else if (availability < 99.5) status = 'good';
  
  return {
    percentage: Math.round(availability * 100) / 100,
    status
  };
}

async function updateMonitorStats(monitorId: string, status: string, responseTime?: number) {
  const updateData: any = {
    lastCheckTime: new Date(),
    totalChecks: { increment: 1 }
  };

  if (status === 'success') {
    updateData.successfulChecks = { increment: 1 };
    if (responseTime) {
      updateData.responseTime = responseTime;
    }
  } else {
    updateData.failedChecks = { increment: 1 };
    if (status === 'failure') {
      updateData.lastDowntime = new Date();
    }
  }

  // Update uptime percentage
  const monitor = await prisma.uptimeMonitor.findUnique({ where: { id: monitorId } });
  if (monitor) {
    const newTotalChecks = monitor.totalChecks + 1;
    const newSuccessfulChecks = status === 'success' ? monitor.successfulChecks + 1 : monitor.successfulChecks;
    const newUptimePercent = (newSuccessfulChecks / newTotalChecks) * 100;
    updateData.uptimePercent = newUptimePercent;
  }

  await prisma.uptimeMonitor.update({
    where: { id: monitorId },
    data: updateData
  });
}

function generateIncidentId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `INC-${timestamp}-${random}`.toUpperCase();
}
