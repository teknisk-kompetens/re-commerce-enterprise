
/**
 * APPLICATION PERFORMANCE MONITORING (APM) API
 * APM metrics, Core Web Vitals, and database query performance tracking
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
    const serviceName = searchParams.get('serviceName');

    switch (action) {
      case 'apm_metrics':
        return await getAPMMetrics(tenantId, timeRange, serviceName);
      case 'web_vitals':
        return await getWebVitals(tenantId, timeRange);
      case 'query_performance':
        return await getQueryPerformance(tenantId, timeRange);
      case 'endpoint_performance':
        return await getEndpointPerformance(tenantId, timeRange);
      case 'error_tracking':
        return await getErrorTracking(tenantId, timeRange);
      case 'performance_trends':
        return await getPerformanceTrends(tenantId, timeRange);
      default:
        return await getPerformanceOverview(tenantId, timeRange);
    }
  } catch (error) {
    console.error('APM tracking API error:', error);
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
      case 'record_apm_metric':
        return await recordAPMMetric(data);
      case 'record_web_vital':
        return await recordWebVital(data);
      case 'record_query_performance':
        return await recordQueryPerformance(data);
      case 'batch_record_metrics':
        return await batchRecordMetrics(data);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('APM tracking POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getAPMMetrics(tenantId: string, timeRange: string, serviceName?: string | null) {
  const dateFilter = getDateFilter(timeRange);
  const where: any = { tenantId, timestamp: dateFilter };
  if (serviceName) {
    where.serviceName = serviceName;
  }

  const [apmMetrics, serviceBreakdown, statusCodeBreakdown, performanceStats] = await Promise.all([
    prisma.aPMMetric.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 1000
    }),
    prisma.aPMMetric.groupBy({
      by: ['serviceName'],
      where,
      _avg: {
        responseTime: true,
        errorRate: true,
        throughput: true,
        memoryUsage: true,
        cpuUsage: true
      },
      _count: { serviceName: true }
    }),
    prisma.aPMMetric.groupBy({
      by: ['statusCode'],
      where: { ...where, statusCode: { not: null } },
      _count: { statusCode: true }
    }),
    prisma.aPMMetric.aggregate({
      where,
      _avg: {
        responseTime: true,
        errorRate: true,
        throughput: true,
        databaseTime: true,
        externalApiTime: true,
        cacheHitRate: true
      },
      _max: { responseTime: true },
      _min: { responseTime: true }
    })
  ]);

  const p95ResponseTime = calculatePercentile(apmMetrics.map(m => m.responseTime), 95);
  const p99ResponseTime = calculatePercentile(apmMetrics.map(m => m.responseTime), 99);

  return NextResponse.json({
    success: true,
    data: {
      overview: {
        totalRequests: apmMetrics.length,
        avgResponseTime: Math.round(performanceStats._avg.responseTime || 0),
        p95ResponseTime: Math.round(p95ResponseTime),
        p99ResponseTime: Math.round(p99ResponseTime),
        avgErrorRate: Math.round((performanceStats._avg.errorRate || 0) * 100) / 100,
        avgThroughput: Math.round(performanceStats._avg.throughput || 0),
        avgCacheHitRate: Math.round((performanceStats._avg.cacheHitRate || 0) * 100) / 100
      },
      serviceBreakdown: serviceBreakdown.map(service => ({
        serviceName: service.serviceName,
        requestCount: service._count.serviceName,
        avgResponseTime: Math.round(service._avg.responseTime || 0),
        avgErrorRate: Math.round((service._avg.errorRate || 0) * 100) / 100,
        avgThroughput: Math.round(service._avg.throughput || 0),
        avgMemoryUsage: Math.round((service._avg.memoryUsage || 0) * 100) / 100,
        avgCpuUsage: Math.round((service._avg.cpuUsage || 0) * 100) / 100
      })),
      statusCodeBreakdown: statusCodeBreakdown.map(status => ({
        statusCode: status.statusCode,
        count: status._count.statusCode,
        percentage: Math.round((status._count.statusCode / apmMetrics.length) * 100)
      })),
      timeSeriesData: groupAPMMetricsByTime(apmMetrics, timeRange),
      slowestEndpoints: await getTopSlowEndpoints(tenantId, dateFilter)
    }
  });
}

async function getWebVitals(tenantId: string, timeRange: string) {
  const dateFilter = getDateFilter(timeRange);

  const [webVitals, vitalsByMetric, vitalsByPage, deviceBreakdown] = await Promise.all([
    prisma.webVital.findMany({
      where: { tenantId, timestamp: dateFilter },
      orderBy: { timestamp: 'desc' },
      take: 1000
    }),
    prisma.webVital.groupBy({
      by: ['metricName', 'rating'],
      where: { tenantId, timestamp: dateFilter },
      _count: { metricName: true },
      _avg: { value: true }
    }),
    prisma.webVital.groupBy({
      by: ['pageUrl'],
      where: { tenantId, timestamp: dateFilter },
      _avg: { value: true },
      _count: { pageUrl: true },
      orderBy: { _count: { pageUrl: 'desc' } },
      take: 10
    }),
    prisma.webVital.groupBy({
      by: ['deviceType'],
      where: { tenantId, timestamp: dateFilter, deviceType: { not: null } },
      _avg: { value: true },
      _count: { deviceType: true }
    })
  ]);

  const vitalsSummary = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'].map(vital => {
    const vitalData = vitalsByMetric.filter(v => v.metricName === vital);
    const total = vitalData.reduce((sum, v) => sum + v._count.metricName, 0);
    const good = vitalData.find(v => v.rating === 'good')?._count.metricName || 0;
    const needsImprovement = vitalData.find(v => v.rating === 'needs-improvement')?._count.metricName || 0;
    const poor = vitalData.find(v => v.rating === 'poor')?._count.metricName || 0;
    const avgValue = vitalData.reduce((sum, v) => sum + (v._avg.value || 0), 0) / (vitalData.length || 1);

    return {
      metric: vital,
      avgValue: Math.round(avgValue * 100) / 100,
      distribution: {
        good: Math.round((good / total) * 100) || 0,
        needsImprovement: Math.round((needsImprovement / total) * 100) || 0,
        poor: Math.round((poor / total) * 100) || 0
      },
      totalMeasurements: total
    };
  });

  return NextResponse.json({
    success: true,
    data: {
      summary: vitalsSummary,
      topPages: vitalsByPage.map(page => ({
        page: page.pageUrl,
        measurements: page._count.pageUrl,
        avgValue: Math.round((page._avg.value || 0) * 100) / 100
      })),
      deviceBreakdown: deviceBreakdown.map(device => ({
        device: device.deviceType,
        measurements: device._count.deviceType,
        avgValue: Math.round((device._avg.value || 0) * 100) / 100
      })),
      timeSeriesData: groupWebVitalsByTime(webVitals, timeRange)
    }
  });
}

async function getQueryPerformance(tenantId: string, timeRange: string) {
  const dateFilter = getDateFilter(timeRange);

  const [queryMetrics, slowQueries, tableBreakdown, queryTypeBreakdown] = await Promise.all([
    prisma.queryPerformance.findMany({
      where: { tenantId, timestamp: dateFilter },
      orderBy: { timestamp: 'desc' },
      take: 1000
    }),
    prisma.queryPerformance.findMany({
      where: { tenantId, timestamp: dateFilter },
      orderBy: { executionTime: 'desc' },
      take: 20
    }),
    prisma.queryPerformance.groupBy({
      by: ['tableName'],
      where: { tenantId, timestamp: dateFilter, tableName: { not: null } },
      _avg: { executionTime: true },
      _count: { tableName: true },
      _sum: { rowsAffected: true, rowsScanned: true },
      orderBy: { _avg: { executionTime: 'desc' } },
      take: 10
    }),
    prisma.queryPerformance.groupBy({
      by: ['queryType'],
      where: { tenantId, timestamp: dateFilter },
      _avg: { executionTime: true },
      _count: { queryType: true },
      _sum: { rowsAffected: true }
    })
  ]);

  const performanceStats = {
    totalQueries: queryMetrics.length,
    avgExecutionTime: Math.round(queryMetrics.reduce((sum, q) => sum + q.executionTime, 0) / (queryMetrics.length || 1)),
    slowestQuery: Math.max(...queryMetrics.map(q => q.executionTime)),
    totalRowsAffected: queryMetrics.reduce((sum, q) => sum + q.rowsAffected, 0),
    totalRowsScanned: queryMetrics.reduce((sum, q) => sum + q.rowsScanned, 0),
    avgCacheHitRate: Math.round((queryMetrics.filter(q => q.cacheHit).length / queryMetrics.length) * 100) || 0
  };

  return NextResponse.json({
    success: true,
    data: {
      overview: performanceStats,
      slowestQueries: slowQueries.map(query => ({
        queryHash: query.queryHash,
        queryType: query.queryType,
        tableName: query.tableName,
        executionTime: Math.round(query.executionTime),
        rowsAffected: query.rowsAffected,
        rowsScanned: query.rowsScanned,
        timestamp: query.timestamp,
        errorMessage: query.errorMessage
      })),
      tableBreakdown: tableBreakdown.map(table => ({
        tableName: table.tableName,
        queryCount: table._count.tableName,
        avgExecutionTime: Math.round(table._avg.executionTime || 0),
        totalRowsAffected: table._sum.rowsAffected || 0,
        totalRowsScanned: table._sum.rowsScanned || 0
      })),
      queryTypeBreakdown: queryTypeBreakdown.map(type => ({
        queryType: type.queryType,
        count: type._count.queryType,
        avgExecutionTime: Math.round(type._avg.executionTime || 0),
        totalRowsAffected: type._sum.rowsAffected || 0
      })),
      timeSeriesData: groupQueryPerformanceByTime(queryMetrics, timeRange)
    }
  });
}

async function getEndpointPerformance(tenantId: string, timeRange: string) {
  const dateFilter = getDateFilter(timeRange);

  const endpointMetrics = await prisma.aPMMetric.groupBy({
    by: ['endpointPath', 'methodType'],
    where: {
      tenantId,
      timestamp: dateFilter,
      endpointPath: { not: null },
      methodType: { not: null }
    },
    _avg: {
      responseTime: true,
      errorRate: true,
      throughput: true,
      databaseTime: true,
      externalApiTime: true
    },
    _count: { endpointPath: true },
    orderBy: { _avg: { responseTime: 'desc' } },
    take: 50
  });

  return NextResponse.json({
    success: true,
    data: {
      endpoints: endpointMetrics.map(endpoint => ({
        endpoint: `${endpoint.methodType} ${endpoint.endpointPath}`,
        requestCount: endpoint._count.endpointPath,
        avgResponseTime: Math.round(endpoint._avg.responseTime || 0),
        avgErrorRate: Math.round((endpoint._avg.errorRate || 0) * 100) / 100,
        avgThroughput: Math.round(endpoint._avg.throughput || 0),
        avgDatabaseTime: Math.round(endpoint._avg.databaseTime || 0),
        avgExternalApiTime: Math.round(endpoint._avg.externalApiTime || 0)
      }))
    }
  });
}

async function getErrorTracking(tenantId: string, timeRange: string) {
  const dateFilter = getDateFilter(timeRange);

  const [errorRates, errorsByService, errorsByType, recentErrors] = await Promise.all([
    prisma.errorRate.findMany({
      where: { tenantId, timestamp: dateFilter },
      orderBy: { timestamp: 'desc' },
      take: 100
    }),
    prisma.errorRate.groupBy({
      by: ['serviceName'],
      where: { tenantId, timestamp: dateFilter },
      _sum: { errorCount: true, totalRequests: true },
      _avg: { errorRate: true }
    }),
    prisma.errorRate.groupBy({
      by: ['errorType'],
      where: { tenantId, timestamp: dateFilter },
      _sum: { errorCount: true },
      _avg: { errorRate: true }
    }),
    prisma.errorRate.findMany({
      where: { tenantId, timestamp: dateFilter, resolved: false },
      orderBy: { lastOccurrence: 'desc' },
      take: 10
    })
  ]);

  const totalErrors = errorRates.reduce((sum, e) => sum + e.errorCount, 0);
  const totalRequests = errorRates.reduce((sum, e) => sum + e.totalRequests, 0);
  const overallErrorRate = totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;

  return NextResponse.json({
    success: true,
    data: {
      overview: {
        totalErrors,
        totalRequests,
        overallErrorRate: Math.round(overallErrorRate * 100) / 100,
        unresolvedErrors: recentErrors.length,
        criticalErrors: errorRates.filter(e => e.severity === 'critical').length
      },
      errorsByService: errorsByService.map(service => ({
        service: service.serviceName,
        totalErrors: service._sum.errorCount || 0,
        totalRequests: service._sum.totalRequests || 0,
        errorRate: Math.round((service._avg.errorRate || 0) * 100) / 100
      })),
      errorsByType: errorsByType.map(type => ({
        type: type.errorType,
        count: type._sum.errorCount || 0,
        avgRate: Math.round((type._avg.errorRate || 0) * 100) / 100
      })),
      recentErrors: recentErrors.map(error => ({
        id: error.id,
        service: error.serviceName,
        type: error.errorType,
        message: error.errorMessage,
        severity: error.severity,
        affectedUsers: error.affectedUsers,
        firstOccurrence: error.firstOccurrence,
        lastOccurrence: error.lastOccurrence,
        errorCount: error.errorCount
      })),
      timeSeriesData: groupErrorRatesByTime(errorRates, timeRange)
    }
  });
}

async function getPerformanceTrends(tenantId: string, timeRange: string) {
  const dateFilter = getDateFilter(timeRange);
  const previousPeriodFilter = getPreviousPeriodFilter(timeRange);

  const [currentMetrics, previousMetrics] = await Promise.all([
    prisma.aPMMetric.aggregate({
      where: { tenantId, timestamp: dateFilter },
      _avg: {
        responseTime: true,
        errorRate: true,
        throughput: true,
        memoryUsage: true,
        cpuUsage: true
      }
    }),
    prisma.aPMMetric.aggregate({
      where: { tenantId, timestamp: previousPeriodFilter },
      _avg: {
        responseTime: true,
        errorRate: true,
        throughput: true,
        memoryUsage: true,
        cpuUsage: true
      }
    })
  ]);

  const trends = {
    responseTime: calculateTrend(currentMetrics._avg.responseTime, previousMetrics._avg.responseTime),
    errorRate: calculateTrend(currentMetrics._avg.errorRate, previousMetrics._avg.errorRate),
    throughput: calculateTrend(currentMetrics._avg.throughput, previousMetrics._avg.throughput),
    memoryUsage: calculateTrend(currentMetrics._avg.memoryUsage, previousMetrics._avg.memoryUsage),
    cpuUsage: calculateTrend(currentMetrics._avg.cpuUsage, previousMetrics._avg.cpuUsage)
  };

  return NextResponse.json({
    success: true,
    data: {
      current: {
        responseTime: Math.round(currentMetrics._avg.responseTime || 0),
        errorRate: Math.round((currentMetrics._avg.errorRate || 0) * 100) / 100,
        throughput: Math.round(currentMetrics._avg.throughput || 0),
        memoryUsage: Math.round((currentMetrics._avg.memoryUsage || 0) * 100) / 100,
        cpuUsage: Math.round((currentMetrics._avg.cpuUsage || 0) * 100) / 100
      },
      trends
    }
  });
}

async function getPerformanceOverview(tenantId: string, timeRange: string) {
  const [apm, webVitals, queries, errors] = await Promise.all([
    getAPMMetrics(tenantId, timeRange),
    getWebVitals(tenantId, timeRange),
    getQueryPerformance(tenantId, timeRange),
    getErrorTracking(tenantId, timeRange)
  ]);

  const [apmData, webVitalsData, queryData, errorData] = await Promise.all([
    apm.json(),
    webVitals.json(),
    queries.json(),
    errors.json()
  ]);

  return NextResponse.json({
    success: true,
    data: {
      overview: {
        apm: apmData.data.overview,
        webVitals: {
          lcpGood: webVitalsData.data.summary.find((v: any) => v.metric === 'LCP')?.distribution.good || 0,
          fidGood: webVitalsData.data.summary.find((v: any) => v.metric === 'FID')?.distribution.good || 0,
          clsGood: webVitalsData.data.summary.find((v: any) => v.metric === 'CLS')?.distribution.good || 0
        },
        database: queryData.data.overview,
        errors: errorData.data.overview
      },
      timeRange
    }
  });
}

// Recording functions
async function recordAPMMetric(data: any) {
  const metric = await prisma.aPMMetric.create({
    data: {
      tenantId: data.tenantId,
      serviceName: data.serviceName,
      endpointPath: data.endpointPath,
      methodType: data.methodType,
      responseTime: parseFloat(data.responseTime),
      statusCode: data.statusCode,
      errorRate: data.errorRate || 0,
      throughput: data.throughput || 0,
      memoryUsage: data.memoryUsage || 0,
      cpuUsage: data.cpuUsage || 0,
      databaseTime: data.databaseTime || 0,
      externalApiTime: data.externalApiTime || 0,
      cacheHitRate: data.cacheHitRate || 0,
      errorMessage: data.errorMessage,
      traceId: data.traceId,
      spanId: data.spanId,
      userId: data.userId,
      sessionId: data.sessionId,
      userAgent: data.userAgent,
      ipAddress: data.ipAddress,
      region: data.region,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { metricId: metric.id }
  });
}

async function recordWebVital(data: any) {
  const vital = await prisma.webVital.create({
    data: {
      tenantId: data.tenantId,
      metricName: data.metricName,
      value: parseFloat(data.value),
      rating: data.rating,
      pageUrl: data.pageUrl,
      userId: data.userId,
      sessionId: data.sessionId,
      deviceType: data.deviceType,
      connectionType: data.connectionType,
      browserName: data.browserName,
      browserVersion: data.browserVersion,
      operatingSystem: data.operatingSystem,
      screenResolution: data.screenResolution,
      navigationTiming: data.navigationTiming || {},
      resourceTiming: data.resourceTiming || {},
      userAgent: data.userAgent,
      ipAddress: data.ipAddress,
      geoLocation: data.geoLocation || {},
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { vitalId: vital.id }
  });
}

async function recordQueryPerformance(data: any) {
  const query = await prisma.queryPerformance.create({
    data: {
      tenantId: data.tenantId,
      queryType: data.queryType,
      tableName: data.tableName,
      queryHash: data.queryHash,
      executionTime: parseFloat(data.executionTime),
      rowsAffected: data.rowsAffected || 0,
      rowsScanned: data.rowsScanned || 0,
      indexUsage: data.indexUsage || [],
      queryPlan: data.queryPlan || {},
      connectionCount: data.connectionCount || 0,
      lockWaitTime: data.lockWaitTime || 0,
      ioReadTime: data.ioReadTime || 0,
      ioWriteTime: data.ioWriteTime || 0,
      cacheHit: data.cacheHit || false,
      userId: data.userId,
      sessionId: data.sessionId,
      applicationName: data.applicationName,
      errorMessage: data.errorMessage,
      warningCount: data.warningCount || 0,
      region: data.region,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { queryId: query.id }
  });
}

async function batchRecordMetrics(data: any[]) {
  const results = await Promise.all(
    data.map(async (item) => {
      switch (item.type) {
        case 'apm':
          return await recordAPMMetric(item.data);
        case 'webvital':
          return await recordWebVital(item.data);
        case 'query':
          return await recordQueryPerformance(item.data);
        default:
          throw new Error(`Unknown metric type: ${item.type}`);
      }
    })
  );

  return NextResponse.json({
    success: true,
    data: { recordedCount: results.length }
  });
}

// Utility functions
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

function getPreviousPeriodFilter(timeRange: string) {
  const now = new Date();
  let periodMs = 86400000; // 24h default
  
  switch (timeRange) {
    case '1h': periodMs = 3600000; break;
    case '24h': periodMs = 86400000; break;
    case '7d': periodMs = 604800000; break;
    case '30d': periodMs = 2592000000; break;
  }

  return {
    gte: new Date(now.getTime() - (periodMs * 2)),
    lt: new Date(now.getTime() - periodMs)
  };
}

function calculatePercentile(values: number[], percentile: number): number {
  const sorted = values.sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index] || 0;
}

function calculateTrend(current: number | null, previous: number | null): { change: number; direction: string } {
  if (!current || !previous) {
    return { change: 0, direction: 'stable' };
  }

  const change = ((current - previous) / previous) * 100;
  const direction = change > 5 ? 'up' : change < -5 ? 'down' : 'stable';
  
  return { change: Math.round(change * 100) / 100, direction };
}

async function getTopSlowEndpoints(tenantId: string, dateFilter: any) {
  return await prisma.aPMMetric.groupBy({
    by: ['endpointPath', 'methodType'],
    where: {
      tenantId,
      timestamp: dateFilter,
      endpointPath: { not: null }
    },
    _avg: { responseTime: true },
    _count: { endpointPath: true },
    orderBy: { _avg: { responseTime: 'desc' } },
    take: 5
  });
}

function groupAPMMetricsByTime(metrics: any[], timeRange: string) {
  return groupDataByTime(metrics, timeRange, (item: any) => ({
    responseTime: item.responseTime,
    errorRate: item.errorRate,
    throughput: item.throughput
  }));
}

function groupWebVitalsByTime(vitals: any[], timeRange: string) {
  return groupDataByTime(vitals, timeRange, (item: any) => ({
    value: item.value,
    metric: item.metricName
  }));
}

function groupQueryPerformanceByTime(queries: any[], timeRange: string) {
  return groupDataByTime(queries, timeRange, (item: any) => ({
    executionTime: item.executionTime,
    rowsAffected: item.rowsAffected
  }));
}

function groupErrorRatesByTime(errors: any[], timeRange: string) {
  return groupDataByTime(errors, timeRange, (item: any) => ({
    errorCount: item.errorCount,
    errorRate: item.errorRate
  }));
}

function groupDataByTime(data: any[], timeRange: string, valueExtractor: (item: any) => any) {
  const groupBy = timeRange === '1h' || timeRange === '24h' ? 'hour' : 'day';
  const grouped: Record<string, any> = {};

  data.forEach(item => {
    const date = new Date(item.timestamp);
    let key: string;

    if (groupBy === 'hour') {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:00`;
    } else {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }

    if (!grouped[key]) {
      grouped[key] = { timestamp: key, items: [], count: 0 };
    }

    grouped[key].items.push(valueExtractor(item));
    grouped[key].count++;
  });

  return Object.values(grouped)
    .map((group: any) => ({
      timestamp: group.timestamp,
      ...aggregateValues(group.items),
      count: group.count
    }))
    .sort((a: any, b: any) => a.timestamp.localeCompare(b.timestamp));
}

function aggregateValues(items: any[]): any {
  if (items.length === 0) return {};

  const result: any = {};
  const firstItem = items[0];

  Object.keys(firstItem).forEach(key => {
    if (typeof firstItem[key] === 'number') {
      result[key] = Math.round(items.reduce((sum, item) => sum + (item[key] || 0), 0) / items.length);
    }
  });

  return result;
}
