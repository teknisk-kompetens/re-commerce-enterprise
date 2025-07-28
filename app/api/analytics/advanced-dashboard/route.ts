
/**
 * ADVANCED ANALYTICS DASHBOARD API
 * Advanced analytics with user engagement, feature usage, and business metrics
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
    const timeRange = searchParams.get('timeRange') || '7d';
    const metric = searchParams.get('metric');

    switch (action) {
      case 'user_engagement':
        return await getUserEngagementAnalytics(tenantId, timeRange);
      case 'feature_usage':
        return await getFeatureUsageAnalytics(tenantId, timeRange);
      case 'conversion_funnel':
        return await getConversionFunnelAnalytics(tenantId, timeRange);
      case 'revenue_analytics':
        return await getRevenueAnalytics(tenantId, timeRange);
      case 'user_journey':
        return await getUserJourneyAnalytics(tenantId, timeRange);
      case 'behavioral_segments':
        return await getBehavioralSegments(tenantId);
      case 'custom_analytics':
        return await getCustomAnalytics(tenantId, metric, timeRange);
      default:
        return await getAnalyticsDashboard(tenantId, timeRange);
    }
  } catch (error) {
    console.error('Advanced analytics API error:', error);
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
      case 'track_engagement':
        return await trackUserEngagement(data);
      case 'track_feature_usage':
        return await trackFeatureUsage(data);
      case 'track_conversion_event':
        return await trackConversionEvent(data);
      case 'record_revenue':
        return await recordRevenue(data);
      case 'track_user_journey':
        return await trackUserJourney(data);
      case 'create_segment':
        return await createBehavioralSegment(data);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Advanced analytics POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getUserEngagementAnalytics(tenantId: string, timeRange: string) {
  const dateFilter = getDateFilter(timeRange);
  
  const [engagementData, uniqueUsers, avgSessionDuration, bounceRate] = await Promise.all([
    prisma.userEngagement.findMany({
      where: {
        tenantId,
        timestamp: dateFilter
      },
      orderBy: { timestamp: 'desc' }
    }),
    prisma.userEngagement.groupBy({
      by: ['userId'],
      where: {
        tenantId,
        timestamp: dateFilter,
        userId: { not: null }
      },
      _count: { userId: true }
    }),
    prisma.userEngagement.aggregate({
      where: {
        tenantId,
        timestamp: dateFilter
      },
      _avg: { sessionDuration: true }
    }),
    prisma.userEngagement.aggregate({
      where: {
        tenantId,
        timestamp: dateFilter
      },
      _avg: { bounceRate: true }
    })
  ]);

  const deviceBreakdown = await prisma.userEngagement.groupBy({
    by: ['deviceType'],
    where: {
      tenantId,
      timestamp: dateFilter
    },
    _count: { deviceType: true },
    _avg: { sessionDuration: true }
  });

  const topPages = await prisma.userEngagement.groupBy({
    by: ['featureUsage'],
    where: {
      tenantId,
      timestamp: dateFilter
    },
    _count: { featureUsage: true },
    orderBy: { _count: { featureUsage: 'desc' } },
    take: 10
  });

  return NextResponse.json({
    success: true,
    data: {
      overview: {
        totalSessions: engagementData.length,
        uniqueUsers: uniqueUsers.length,
        avgSessionDuration: Math.round(avgSessionDuration._avg.sessionDuration || 0),
        bounceRate: Math.round((bounceRate._avg.bounceRate || 0) * 100) / 100
      },
      deviceBreakdown: deviceBreakdown.map(item => ({
        device: item.deviceType || 'Unknown',
        sessions: item._count.deviceType,
        avgDuration: Math.round(item._avg.sessionDuration || 0)
      })),
      topPages,
      timeSeriesData: groupEngagementByTime(engagementData, timeRange)
    }
  });
}

async function getFeatureUsageAnalytics(tenantId: string, timeRange: string) {
  const dateFilter = getDateFilter(timeRange);

  const [featureUsage, topFeatures, categoryBreakdown] = await Promise.all([
    prisma.featureUsage.findMany({
      where: {
        tenantId,
        timestamp: dateFilter
      },
      orderBy: { timestamp: 'desc' }
    }),
    prisma.featureUsage.groupBy({
      by: ['featureName'],
      where: {
        tenantId,
        timestamp: dateFilter
      },
      _count: { featureName: true },
      _avg: { duration: true },
      orderBy: { _count: { featureName: 'desc' } },
      take: 10
    }),
    prisma.featureUsage.groupBy({
      by: ['featureCategory'],
      where: {
        tenantId,
        timestamp: dateFilter
      },
      _count: { featureCategory: true },
      _avg: { duration: true }
    })
  ]);

  const userAdoption = await prisma.featureUsage.groupBy({
    by: ['featureName', 'userId'],
    where: {
      tenantId,
      timestamp: dateFilter,
      userId: { not: null }
    },
    _count: { userId: true }
  });

  const adoptionRates = topFeatures.map(feature => {
    const uniqueUsers = userAdoption.filter(u => u.featureName === feature.featureName).length;
    return {
      feature: feature.featureName,
      usage: feature._count.featureName,
      uniqueUsers,
      avgDuration: Math.round(feature._avg.duration || 0)
    };
  });

  return NextResponse.json({
    success: true,
    data: {
      topFeatures: adoptionRates,
      categoryBreakdown: categoryBreakdown.map(cat => ({
        category: cat.featureCategory,
        usage: cat._count.featureCategory,
        avgDuration: Math.round(cat._avg.duration || 0)
      })),
      timeSeriesData: groupFeatureUsageByTime(featureUsage, timeRange)
    }
  });
}

async function getConversionFunnelAnalytics(tenantId: string, timeRange: string) {
  const dateFilter = getDateFilter(timeRange);

  const funnelData = await prisma.conversionFunnel.findMany({
    where: {
      tenantId,
      timestamp: dateFilter
    },
    orderBy: [{ funnelName: 'asc' }, { stepOrder: 'asc' }]
  });

  const funnelsByName = funnelData.reduce((acc, item) => {
    if (!acc[item.funnelName]) {
      acc[item.funnelName] = [];
    }
    acc[item.funnelName].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  const funnelAnalysis = Object.entries(funnelsByName).map(([funnelName, steps]) => {
    const stepAnalysis = steps.reduce((acc, step) => {
      const existingStep = acc.find(s => s.stepName === step.funnelStep);
      if (existingStep) {
        existingStep.count++;
        existingStep.conversionValue += step.conversionValue;
        if (step.completed) existingStep.completions++;
      } else {
        acc.push({
          stepName: step.funnelStep,
          stepOrder: step.stepOrder,
          count: 1,
          completions: step.completed ? 1 : 0,
          conversionValue: step.conversionValue
        });
      }
      return acc;
    }, [] as any[]);

    stepAnalysis.sort((a, b) => a.stepOrder - b.stepOrder);

    // Calculate conversion rates
    const totalEntered = stepAnalysis[0]?.count || 0;
    stepAnalysis.forEach((step, index) => {
      step.conversionRate = totalEntered > 0 ? (step.count / totalEntered) * 100 : 0;
      step.dropoffRate = index > 0 ? ((stepAnalysis[index - 1].count - step.count) / stepAnalysis[index - 1].count) * 100 : 0;
    });

    return {
      funnelName,
      steps: stepAnalysis,
      totalConversions: stepAnalysis[stepAnalysis.length - 1]?.completions || 0,
      overallConversionRate: totalEntered > 0 ? ((stepAnalysis[stepAnalysis.length - 1]?.completions || 0) / totalEntered) * 100 : 0
    };
  });

  return NextResponse.json({
    success: true,
    data: {
      funnels: funnelAnalysis,
      summary: {
        totalFunnels: Object.keys(funnelsByName).length,
        totalEvents: funnelData.length,
        avgConversionRate: funnelAnalysis.reduce((sum, f) => sum + f.overallConversionRate, 0) / (funnelAnalysis.length || 1)
      }
    }
  });
}

async function getRevenueAnalytics(tenantId: string, timeRange: string) {
  const dateFilter = getDateFilter(timeRange);

  const [revenueData, revenueByType, revenueByPlan, mrr, arr] = await Promise.all([
    prisma.revenueAnalytics.findMany({
      where: {
        tenantId,
        timestamp: dateFilter
      },
      orderBy: { timestamp: 'desc' }
    }),
    prisma.revenueAnalytics.groupBy({
      by: ['revenueType'],
      where: {
        tenantId,
        timestamp: dateFilter
      },
      _sum: { amount: true, netRevenue: true },
      _count: { revenueType: true }
    }),
    prisma.revenueAnalytics.groupBy({
      by: ['planTier'],
      where: {
        tenantId,
        timestamp: dateFilter,
        planTier: { not: null }
      },
      _sum: { amount: true, netRevenue: true },
      _count: { planTier: true }
    }),
    prisma.revenueAnalytics.aggregate({
      where: {
        tenantId,
        timestamp: dateFilter
      },
      _sum: { mrr: true }
    }),
    prisma.revenueAnalytics.aggregate({
      where: {
        tenantId,
        timestamp: dateFilter
      },
      _sum: { arr: true }
    })
  ]);

  const totalRevenue = revenueData.reduce((sum, r) => sum + r.amount, 0);
  const totalNetRevenue = revenueData.reduce((sum, r) => sum + r.netRevenue, 0);

  return NextResponse.json({
    success: true,
    data: {
      overview: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalNetRevenue: Math.round(totalNetRevenue * 100) / 100,
        totalMRR: Math.round((mrr._sum.mrr || 0) * 100) / 100,
        totalARR: Math.round((arr._sum.arr || 0) * 100) / 100,
        transactionCount: revenueData.length
      },
      revenueByType: revenueByType.map(item => ({
        type: item.revenueType,
        amount: Math.round((item._sum.amount || 0) * 100) / 100,
        netRevenue: Math.round((item._sum.netRevenue || 0) * 100) / 100,
        count: item._count.revenueType
      })),
      revenueByPlan: revenueByPlan.map(item => ({
        plan: item.planTier,
        amount: Math.round((item._sum.amount || 0) * 100) / 100,
        netRevenue: Math.round((item._sum.netRevenue || 0) * 100) / 100,
        customers: item._count.planTier
      })),
      timeSeriesData: groupRevenueByTime(revenueData, timeRange)
    }
  });
}

async function getUserJourneyAnalytics(tenantId: string, timeRange: string) {
  const dateFilter = getDateFilter(timeRange);

  const journeyData = await prisma.userJourney.findMany({
    where: {
      tenantId,
      timestamp: dateFilter
    },
    orderBy: [{ journeyId: 'asc' }, { stepNumber: 'asc' }]
  });

  const journeysById = journeyData.reduce((acc, step) => {
    if (!acc[step.journeyId]) {
      acc[step.journeyId] = [];
    }
    acc[step.journeyId].push(step);
    return acc;
  }, {} as Record<string, any[]>);

  const journeyAnalysis = Object.values(journeysById).map(journey => {
    const sortedSteps = journey.sort((a, b) => a.stepNumber - b.stepNumber);
    const totalTime = sortedSteps.reduce((sum, step) => sum + step.timeOnStep, 0);
    const conversionEvents = sortedSteps.filter(step => step.conversionEvent).length;
    const errors = sortedSteps.filter(step => step.errorOccurred).length;
    const exitPoint = sortedSteps.find(step => step.exitPoint);

    return {
      journeyId: journey[0].journeyId,
      userId: journey[0].userId,
      sessionId: journey[0].sessionId,
      totalSteps: sortedSteps.length,
      totalTime,
      conversionEvents,
      errors,
      completed: !exitPoint,
      exitStep: exitPoint ? exitPoint.stepName : null,
      deviceType: journey[0].deviceType,
      path: sortedSteps.map(s => s.stepName)
    };
  });

  const pathAnalysis = journeyAnalysis.reduce((acc, journey) => {
    const pathKey = journey.path.join(' → ');
    if (!acc[pathKey]) {
      acc[pathKey] = {
        path: pathKey,
        count: 0,
        avgTime: 0,
        conversionRate: 0,
        completions: 0
      };
    }
    acc[pathKey].count++;
    acc[pathKey].avgTime += journey.totalTime;
    if (journey.completed) acc[pathKey].completions++;
    return acc;
  }, {} as Record<string, any>);

  Object.values(pathAnalysis).forEach((path: any) => {
    path.avgTime = Math.round(path.avgTime / path.count);
    path.conversionRate = Math.round((path.completions / path.count) * 100);
  });

  const topPaths = Object.values(pathAnalysis)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 10);

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalJourneys: journeyAnalysis.length,
        avgJourneyLength: Math.round(journeyAnalysis.reduce((sum, j) => sum + j.totalSteps, 0) / (journeyAnalysis.length || 1)),
        avgJourneyTime: Math.round(journeyAnalysis.reduce((sum, j) => sum + j.totalTime, 0) / (journeyAnalysis.length || 1)),
        overallConversionRate: Math.round((journeyAnalysis.filter(j => j.completed).length / journeyAnalysis.length) * 100)
      },
      topPaths,
      deviceBreakdown: groupJourneysByDevice(journeyAnalysis)
    }
  });
}

async function getBehavioralSegments(tenantId: string) {
  const segments = await prisma.behavioralSegment.findMany({
    where: { tenantId },
    include: {
      segmentMemberships: {
        where: { isActive: true },
        take: 100
      }
    },
    orderBy: { userCount: 'desc' }
  });

  return NextResponse.json({
    success: true,
    data: {
      segments: segments.map(segment => ({
        id: segment.id,
        name: segment.segmentName,
        type: segment.segmentType,
        userCount: segment.userCount,
        isActive: segment.isActive,
        autoUpdate: segment.autoUpdate,
        description: segment.description,
        tags: segment.tags,
        lastUpdated: segment.lastUpdated,
        memberships: segment.segmentMemberships.length
      })),
      summary: {
        totalSegments: segments.length,
        activeSegments: segments.filter(s => s.isActive).length,
        totalMemberships: segments.reduce((sum, s) => sum + s.segmentMemberships.length, 0)
      }
    }
  });
}

async function getCustomAnalytics(tenantId: string, metric: string | null, timeRange: string) {
  if (!metric) {
    return NextResponse.json({ error: 'Metric parameter required' }, { status: 400 });
  }

  const dateFilter = getDateFilter(timeRange);

  const analyticsData = await prisma.liveMetric.findMany({
    where: {
      tenantId,
      metricName: metric,
      timestamp: dateFilter
    },
    orderBy: { timestamp: 'desc' },
    take: 1000
  });

  const aggregations = {
    count: analyticsData.length,
    sum: analyticsData.reduce((sum, m) => sum + m.value, 0),
    avg: analyticsData.reduce((sum, m) => sum + m.value, 0) / (analyticsData.length || 1),
    min: Math.min(...analyticsData.map(m => m.value)),
    max: Math.max(...analyticsData.map(m => m.value))
  };

  return NextResponse.json({
    success: true,
    data: {
      metric,
      timeRange,
      aggregations: {
        ...aggregations,
        avg: Math.round(aggregations.avg * 100) / 100
      },
      timeSeriesData: groupMetricsByTime(analyticsData, timeRange),
      latestValues: analyticsData.slice(0, 10)
    }
  });
}

async function getAnalyticsDashboard(tenantId: string, timeRange: string) {
  const [engagement, features, conversions, revenue] = await Promise.all([
    getUserEngagementAnalytics(tenantId, timeRange),
    getFeatureUsageAnalytics(tenantId, timeRange),
    getConversionFunnelAnalytics(tenantId, timeRange),
    getRevenueAnalytics(tenantId, timeRange)
  ]);

  const [engagementData, featureData, conversionData, revenueData] = await Promise.all([
    engagement.json(),
    features.json(),
    conversions.json(),
    revenue.json()
  ]);

  return NextResponse.json({
    success: true,
    data: {
      overview: {
        engagement: engagementData.data.overview,
        revenue: revenueData.data.overview,
        conversions: conversionData.data.summary,
        features: {
          totalFeatures: featureData.data.topFeatures.length,
          topFeature: featureData.data.topFeatures[0]?.feature || 'N/A'
        }
      },
      timeRange
    }
  });
}

// Helper functions for tracking data
async function trackUserEngagement(data: any) {
  const engagement = await prisma.userEngagement.create({
    data: {
      tenantId: data.tenantId,
      userId: data.userId,
      sessionId: data.sessionId,
      pageViews: data.pageViews || 1,
      uniquePages: data.uniquePages || 1,
      sessionDuration: data.sessionDuration || 0,
      bounceRate: data.bounceRate || 0,
      interactionCount: data.interactionCount || 0,
      featureUsage: data.featureUsage || {},
      conversionEvents: data.conversionEvents || [],
      deviceType: data.deviceType,
      browserType: data.browserType,
      operatingSystem: data.operatingSystem,
      referrerSource: data.referrerSource,
      geoLocation: data.geoLocation || {},
      userAgent: data.userAgent,
      sessionStart: data.sessionStart ? new Date(data.sessionStart) : new Date(),
      sessionEnd: data.sessionEnd ? new Date(data.sessionEnd) : null,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { engagementId: engagement.id }
  });
}

async function trackFeatureUsage(data: any) {
  const usage = await prisma.featureUsage.create({
    data: {
      tenantId: data.tenantId,
      featureName: data.featureName,
      featureCategory: data.featureCategory,
      userId: data.userId,
      sessionId: data.sessionId,
      usageCount: data.usageCount || 1,
      duration: data.duration || 0,
      interactionType: data.interactionType,
      elementId: data.elementId,
      elementType: data.elementType,
      context: data.context || {},
      success: data.success !== false,
      errorMessage: data.errorMessage,
      userExperience: data.userExperience || {},
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { usageId: usage.id }
  });
}

async function trackConversionEvent(data: any) {
  const conversion = await prisma.conversionFunnel.create({
    data: {
      tenantId: data.tenantId,
      funnelName: data.funnelName,
      funnelStep: data.funnelStep,
      stepOrder: data.stepOrder,
      userId: data.userId,
      sessionId: data.sessionId,
      eventType: data.eventType,
      eventData: data.eventData || {},
      conversionValue: data.conversionValue || 0,
      completed: data.completed || false,
      timeToComplete: data.timeToComplete,
      dropoffReason: data.dropoffReason,
      source: data.source,
      campaign: data.campaign,
      cohort: data.cohort,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { conversionId: conversion.id }
  });
}

async function recordRevenue(data: any) {
  const revenue = await prisma.revenueAnalytics.create({
    data: {
      tenantId: data.tenantId,
      revenueType: data.revenueType,
      amount: parseFloat(data.amount),
      currency: data.currency || 'USD',
      billingPeriod: data.billingPeriod,
      planTier: data.planTier,
      userId: data.userId,
      accountId: data.accountId,
      transactionId: data.transactionId,
      paymentMethod: data.paymentMethod,
      discountApplied: data.discountApplied || 0,
      taxAmount: data.taxAmount || 0,
      netRevenue: parseFloat(data.netRevenue || data.amount),
      mrr: data.mrr || 0,
      arr: data.arr || 0,
      ltv: data.ltv || 0,
      churnRisk: data.churnRisk || 0,
      cohort: data.cohort,
      region: data.region,
      recognitionDate: data.recognitionDate ? new Date(data.recognitionDate) : new Date(),
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { revenueId: revenue.id }
  });
}

async function trackUserJourney(data: any) {
  const journey = await prisma.userJourney.create({
    data: {
      tenantId: data.tenantId,
      userId: data.userId,
      sessionId: data.sessionId,
      journeyId: data.journeyId,
      stepNumber: data.stepNumber,
      stepName: data.stepName,
      pageUrl: data.pageUrl,
      elementClicked: data.elementClicked,
      actionType: data.actionType,
      actionData: data.actionData || {},
      timeOnStep: data.timeOnStep || 0,
      exitPoint: data.exitPoint || false,
      conversionEvent: data.conversionEvent || false,
      errorOccurred: data.errorOccurred || false,
      errorMessage: data.errorMessage,
      deviceType: data.deviceType,
      browserType: data.browserType,
      referrerUrl: data.referrerUrl,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { journeyId: journey.id }
  });
}

async function createBehavioralSegment(data: any) {
  const segment = await prisma.behavioralSegment.create({
    data: {
      tenantId: data.tenantId,
      segmentName: data.segmentName,
      segmentType: data.segmentType,
      criteria: data.criteria,
      userCount: data.userCount || 0,
      isActive: data.isActive !== false,
      autoUpdate: data.autoUpdate !== false,
      description: data.description,
      tags: data.tags || [],
      createdBy: data.createdBy,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { segmentId: segment.id }
  });
}

// Utility functions
function getDateFilter(timeRange: string) {
  const now = new Date();
  const filter: any = {};

  switch (timeRange) {
    case '1h':
      filter.gte = new Date(now.getTime() - 3600000);
      break;
    case '24h':
      filter.gte = new Date(now.getTime() - 86400000);
      break;
    case '7d':
      filter.gte = new Date(now.getTime() - 604800000);
      break;
    case '30d':
      filter.gte = new Date(now.getTime() - 2592000000);
      break;
    case '90d':
      filter.gte = new Date(now.getTime() - 7776000000);
      break;
    default:
      filter.gte = new Date(now.getTime() - 604800000); // Default to 7 days
  }

  return filter;
}

function groupEngagementByTime(data: any[], timeRange: string) {
  return groupDataByTime(data, timeRange, 'sessionDuration');
}

function groupFeatureUsageByTime(data: any[], timeRange: string) {
  return groupDataByTime(data, timeRange, 'usageCount');
}

function groupRevenueByTime(data: any[], timeRange: string) {
  return groupDataByTime(data, timeRange, 'amount');
}

function groupMetricsByTime(data: any[], timeRange: string) {
  return groupDataByTime(data, timeRange, 'value');
}

function groupDataByTime(data: any[], timeRange: string, valueField: string) {
  const groupBy = timeRange === '1h' || timeRange === '24h' ? 'hour' : 'day';
  const grouped: Record<string, { timestamp: string; value: number; count: number }> = {};

  data.forEach(item => {
    const date = new Date(item.timestamp);
    let key: string;

    if (groupBy === 'hour') {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:00`;
    } else {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }

    if (!grouped[key]) {
      grouped[key] = { timestamp: key, value: 0, count: 0 };
    }

    grouped[key].value += item[valueField] || 0;
    grouped[key].count++;
  });

  return Object.values(grouped).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

function groupJourneysByDevice(journeys: any[]) {
  const devices: Record<string, { device: string; count: number; avgTime: number; conversionRate: number }> = {};

  journeys.forEach(journey => {
    const device = journey.deviceType || 'Unknown';
    if (!devices[device]) {
      devices[device] = { device, count: 0, avgTime: 0, conversionRate: 0 };
    }
    devices[device].count++;
    devices[device].avgTime += journey.totalTime;
    if (journey.completed) devices[device].conversionRate++;
  });

  return Object.values(devices).map(device => ({
    ...device,
    avgTime: Math.round(device.avgTime / device.count),
    conversionRate: Math.round((device.conversionRate / device.count) * 100)
  }));
}
