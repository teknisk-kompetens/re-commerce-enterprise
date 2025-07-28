
/**
 * USER BEHAVIOR ANALYTICS API
 * User journey tracking, heatmap analysis, session recording, and A/B testing
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
    const pageUrl = searchParams.get('pageUrl');

    switch (action) {
      case 'user_journeys':
        return await getUserJourneys(tenantId, timeRange);
      case 'heatmap_data':
        return await getHeatmapData(tenantId, timeRange, pageUrl);
      case 'session_recordings':
        return await getSessionRecordings(tenantId, timeRange);
      case 'ab_tests':
        return await getABTests(tenantId);
      case 'behavioral_segments':
        return await getBehavioralSegments(tenantId);
      case 'user_flow_analysis':
        return await getUserFlowAnalysis(tenantId, timeRange);
      case 'interaction_analysis':
        return await getInteractionAnalysis(tenantId, timeRange, pageUrl);
      default:
        return await getBehaviorOverview(tenantId, timeRange);
    }
  } catch (error) {
    console.error('User behavior analytics API error:', error);
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
      case 'track_user_journey':
        return await trackUserJourney(data);
      case 'record_heatmap_interaction':
        return await recordHeatmapInteraction(data);
      case 'create_session_recording':
        return await createSessionRecording(data);
      case 'create_ab_test':
        return await createABTest(data);
      case 'assign_ab_test_variant':
        return await assignABTestVariant(data);
      case 'record_ab_test_conversion':
        return await recordABTestConversion(data);
      case 'create_behavioral_segment':
        return await createBehavioralSegment(data);
      case 'update_segment_membership':
        return await updateSegmentMembership(data);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('User behavior analytics POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getUserJourneys(tenantId: string, timeRange: string) {
  const dateFilter = getDateFilter(timeRange);

  const [journeyData, topPaths, conversionPaths, dropoffAnalysis] = await Promise.all([
    prisma.userJourney.findMany({
      where: { tenantId, timestamp: dateFilter },
      orderBy: [{ journeyId: 'asc' }, { stepNumber: 'asc' }],
      take: 2000
    }),
    prisma.userJourney.groupBy({
      by: ['stepName'],
      where: { tenantId, timestamp: dateFilter },
      _count: { stepName: true },
      orderBy: { _count: { stepName: 'desc' } },
      take: 10
    }),
    prisma.userJourney.findMany({
      where: { 
        tenantId, 
        timestamp: dateFilter,
        conversionEvent: true 
      },
      orderBy: { timestamp: 'desc' },
      take: 100
    }),
    prisma.userJourney.findMany({
      where: { 
        tenantId, 
        timestamp: dateFilter,
        exitPoint: true 
      },
      orderBy: { timestamp: 'desc' },
      take: 100
    })
  ]);

  // Group journeys by journey ID
  const journeysById = journeyData.reduce((acc, step) => {
    if (!acc[step.journeyId]) {
      acc[step.journeyId] = [];
    }
    acc[step.journeyId].push(step);
    return acc;
  }, {} as Record<string, any[]>);

  // Analyze journey patterns
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
      path: sortedSteps.map(s => s.stepName),
      timestamp: journey[0].timestamp
    };
  });

  // Calculate path frequencies
  const pathFrequencies = journeyAnalysis.reduce((acc, journey) => {
    const pathKey = journey.path.join(' → ');
    if (!acc[pathKey]) {
      acc[pathKey] = { 
        path: pathKey, 
        count: 0, 
        avgTime: 0, 
        conversionRate: 0, 
        completions: 0,
        totalTime: 0 
      };
    }
    acc[pathKey].count++;
    acc[pathKey].totalTime += journey.totalTime;
    if (journey.completed) acc[pathKey].completions++;
    return acc;
  }, {} as Record<string, any>);

  Object.values(pathFrequencies).forEach((path: any) => {
    path.avgTime = Math.round(path.totalTime / path.count);
    path.conversionRate = Math.round((path.completions / path.count) * 100);
    delete path.totalTime;
  });

  const topJourneyPaths = Object.values(pathFrequencies)
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 15);

  // Dropout analysis
  const dropoffPoints = dropoffAnalysis.reduce((acc, step) => {
    if (!acc[step.stepName]) {
      acc[step.stepName] = 0;
    }
    acc[step.stepName]++;
    return acc;
  }, {} as Record<string, number>);

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalJourneys: journeyAnalysis.length,
        avgJourneyLength: Math.round(journeyAnalysis.reduce((sum, j) => sum + j.totalSteps, 0) / (journeyAnalysis.length || 1)),
        avgJourneyTime: Math.round(journeyAnalysis.reduce((sum, j) => sum + j.totalTime, 0) / (journeyAnalysis.length || 1)),
        conversionRate: Math.round((journeyAnalysis.filter(j => j.completed).length / journeyAnalysis.length) * 100),
        totalConversions: conversionPaths.length,
        totalDropoffs: dropoffAnalysis.length
      },
      topPaths: topPaths.map(path => ({
        step: path.stepName,
        visits: path._count.stepName
      })),
      journeyPaths: topJourneyPaths,
      dropoffPoints: Object.entries(dropoffPoints)
        .map(([step, count]) => ({ step, dropoffs: count }))
        .sort((a, b) => b.dropoffs - a.dropoffs)
        .slice(0, 10),
      deviceAnalysis: analyzeJourneysByDevice(journeyAnalysis),
      timeSeriesData: groupJourneysByTime(journeyData, timeRange)
    }
  });
}

async function getHeatmapData(tenantId: string, timeRange: string, pageUrl?: string | null) {
  const dateFilter = getDateFilter(timeRange);
  const where: any = { tenantId, timestamp: dateFilter };
  if (pageUrl) {
    where.pageUrl = pageUrl;
  }

  const [heatmapData, topPages, interactionTypes, deviceBreakdown] = await Promise.all([
    prisma.heatmapData.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 5000
    }),
    prisma.heatmapData.groupBy({
      by: ['pageUrl'],
      where: { tenantId, timestamp: dateFilter },
      _count: { pageUrl: true },
      _sum: { clickCount: true, hoverTime: true },
      orderBy: { _count: { pageUrl: 'desc' } },
      take: 10
    }),
    prisma.heatmapData.groupBy({
      by: ['interactionType'],
      where,
      _count: { interactionType: true },
      _sum: { clickCount: true, hoverTime: true }
    }),
    prisma.heatmapData.groupBy({
      by: ['deviceType'],
      where: { ...where, deviceType: { not: null } },
      _count: { deviceType: true },
      _avg: { xCoordinate: true, yCoordinate: true }
    })
  ]);

  // Process heatmap data for visualization
  const processedHeatmapData = heatmapData.map(item => ({
    id: item.id,
    pageUrl: item.pageUrl,
    x: item.xCoordinate,
    y: item.yCoordinate,
    intensity: item.clickCount + (item.hoverTime / 1000), // Normalize hover time to seconds
    interactionType: item.interactionType,
    elementType: item.elementType,
    elementText: item.elementText,
    timestamp: item.timestamp
  }));

  // Generate click density map
  const clickDensityMap = generateClickDensityMap(heatmapData);

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalInteractions: heatmapData.length,
        totalClicks: heatmapData.reduce((sum, item) => sum + item.clickCount, 0),
        totalHoverTime: Math.round(heatmapData.reduce((sum, item) => sum + item.hoverTime, 0) / 1000), // Convert to seconds
        uniquePages: topPages.length
      },
      heatmapData: processedHeatmapData,
      clickDensityMap,
      topPages: topPages.map(page => ({
        page: page.pageUrl,
        interactions: page._count.pageUrl,
        totalClicks: page._sum.clickCount || 0,
        totalHoverTime: Math.round((page._sum.hoverTime || 0) / 1000)
      })),
      interactionBreakdown: interactionTypes.map(type => ({
        type: type.interactionType,
        count: type._count.interactionType,
        totalClicks: type._sum.clickCount || 0,
        totalHoverTime: Math.round((type._sum.hoverTime || 0) / 1000)
      })),
      deviceBreakdown: deviceBreakdown.map(device => ({
        device: device.deviceType,
        interactions: device._count.deviceType,
        avgX: Math.round(device._avg.xCoordinate || 0),
        avgY: Math.round(device._avg.yCoordinate || 0)
      }))
    }
  });
}

async function getSessionRecordings(tenantId: string, timeRange: string) {
  const dateFilter = getDateFilter(timeRange);

  const [recordings, recordingStats, topDevices, bounceAnalysis] = await Promise.all([
    prisma.sessionRecording.findMany({
      where: { tenantId, startTime: dateFilter },
      orderBy: { startTime: 'desc' },
      take: 100
    }),
    prisma.sessionRecording.aggregate({
      where: { tenantId, startTime: dateFilter },
      _avg: { 
        duration: true, 
        pageCount: true, 
        interactionCount: true,
        errorCount: true 
      },
      _count: { id: true }
    }),
    prisma.sessionRecording.groupBy({
      by: ['deviceType'],
      where: { tenantId, startTime: dateFilter, deviceType: { not: null } },
      _count: { deviceType: true },
      _avg: { duration: true, interactionCount: true }
    }),
    prisma.sessionRecording.findMany({
      where: { 
        tenantId, 
        startTime: dateFilter,
        bounced: true 
      },
      orderBy: { startTime: 'desc' },
      take: 50
    })
  ]);

  const recordingsWithAnalysis = recordings.map(recording => ({
    id: recording.id,
    sessionId: recording.sessionId,
    userId: recording.userId,
    duration: recording.duration,
    pageCount: recording.pageCount,
    interactionCount: recording.interactionCount,
    errorCount: recording.errorCount,
    conversionEvents: recording.conversionEvents,
    deviceType: recording.deviceType,
    browserType: recording.browserType,
    recordingUrl: recording.recordingUrl,
    bounced: recording.bounced,
    startTime: recording.startTime,
    endTime: recording.endTime,
    engagementScore: calculateEngagementScore(recording)
  }));

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalRecordings: recordingStats._count.id,
        avgDuration: Math.round(recordingStats._avg.duration || 0),
        avgPageCount: Math.round(recordingStats._avg.pageCount || 0),
        avgInteractionCount: Math.round(recordingStats._avg.interactionCount || 0),
        avgErrorCount: Math.round(recordingStats._avg.errorCount || 0),
        bounceRate: Math.round((bounceAnalysis.length / recordings.length) * 100) || 0
      },
      recordings: recordingsWithAnalysis,
      deviceBreakdown: topDevices.map(device => ({
        device: device.deviceType,
        count: device._count.deviceType,
        avgDuration: Math.round(device._avg.duration || 0),
        avgInteractions: Math.round(device._avg.interactionCount || 0)
      })),
      bounceAnalysis: {
        totalBounced: bounceAnalysis.length,
        bounceRate: Math.round((bounceAnalysis.length / recordings.length) * 100) || 0,
        avgBounceTime: Math.round(bounceAnalysis.reduce((sum, r) => sum + r.duration, 0) / (bounceAnalysis.length || 1))
      }
    }
  });
}

async function getABTests(tenantId: string) {
  const [activeTests, completedTests, testParticipants] = await Promise.all([
    prisma.aBTest.findMany({
      where: { tenantId, status: { in: ['running', 'paused'] } },
      include: {
        abTestParticipants: {
          take: 10,
          orderBy: { assignedAt: 'desc' }
        }
      },
      orderBy: { startDate: 'desc' }
    }),
    prisma.aBTest.findMany({
      where: { tenantId, status: 'completed' },
      include: {
        abTestParticipants: true
      },
      orderBy: { endDate: 'desc' },
      take: 10
    }),
    prisma.aBTestParticipant.groupBy({
      by: ['testId', 'assignedVariant'],
      where: {
        abTest: { tenantId }
      },
      _count: { id: true },
      _avg: { conversionValue: true },
      _sum: { conversionValue: true }
    })
  ]);

  // Calculate test results
  const testsWithResults = activeTests.map(test => {
    const participants = testParticipants.filter(p => p.testId === test.id);
    const totalParticipants = participants.reduce((sum, p) => sum + p._count.id, 0);
    
    const variantResults = participants.map(p => ({
      variant: p.assignedVariant,
      participants: p._count.id,
      avgConversionValue: Math.round((p._avg.conversionValue || 0) * 100) / 100,
      totalConversionValue: Math.round((p._sum.conversionValue || 0) * 100) / 100,
      participantShare: Math.round((p._count.id / totalParticipants) * 100) || 0
    }));

    return {
      ...test,
      totalParticipants,
      variantResults,
      progressPercentage: test.sampleSize ? Math.round((totalParticipants / test.sampleSize) * 100) : 0
    };
  });

  const completedTestsWithResults = completedTests.map(test => {
    const participants = testParticipants.filter(p => p.testId === test.id);
    const totalParticipants = participants.reduce((sum, p) => sum + p._count.id, 0);
    
    const variantResults = participants.map(p => ({
      variant: p.assignedVariant,
      participants: p._count.id,
      avgConversionValue: Math.round((p._avg.conversionValue || 0) * 100) / 100,
      totalConversionValue: Math.round((p._sum.conversionValue || 0) * 100) / 100
    }));

    return {
      ...test,
      totalParticipants,
      variantResults
    };
  });

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        activeTests: activeTests.length,
        completedTests: completedTests.length,
        totalParticipants: testParticipants.reduce((sum, p) => sum + p._count.id, 0)
      },
      activeTests: testsWithResults,
      completedTests: completedTestsWithResults
    }
  });
}

async function getBehavioralSegments(tenantId: string) {
  const segments = await prisma.behavioralSegment.findMany({
    where: { tenantId },
    include: {
      segmentMemberships: {
        where: { isActive: true },
        orderBy: { joinedAt: 'desc' },
        take: 10
      }
    },
    orderBy: { userCount: 'desc' }
  });

  const segmentsWithAnalysis = segments.map(segment => ({
    id: segment.id,
    name: segment.segmentName,
    type: segment.segmentType,
    userCount: segment.userCount,
    isActive: segment.isActive,
    autoUpdate: segment.autoUpdate,
    description: segment.description,
    tags: segment.tags,
    criteria: segment.criteria,
    lastUpdated: segment.lastUpdated,
    activeMemberships: segment.segmentMemberships.length,
    recentMemberships: segment.segmentMemberships.slice(0, 5).map(m => ({
      userId: m.userId,
      membershipScore: m.membershipScore,
      joinedAt: m.joinedAt,
      lastActivity: m.lastActivity
    }))
  }));

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalSegments: segments.length,
        activeSegments: segments.filter(s => s.isActive).length,
        totalMemberships: segments.reduce((sum, s) => sum + s.segmentMemberships.length, 0),
        avgSegmentSize: Math.round(segments.reduce((sum, s) => sum + s.userCount, 0) / (segments.length || 1))
      },
      segments: segmentsWithAnalysis
    }
  });
}

async function getUserFlowAnalysis(tenantId: string, timeRange: string) {
  const dateFilter = getDateFilter(timeRange);

  const flowData = await prisma.userJourney.findMany({
    where: { tenantId, timestamp: dateFilter },
    orderBy: [{ sessionId: 'asc' }, { stepNumber: 'asc' }]
  });

  // Create flow transitions
  const transitions: Record<string, Record<string, number>> = {};
  const sessionsById = flowData.reduce((acc, step) => {
    if (!acc[step.sessionId]) {
      acc[step.sessionId] = [];
    }
    acc[step.sessionId].push(step);
    return acc;
  }, {} as Record<string, any[]>);

  Object.values(sessionsById).forEach(session => {
    const sortedSteps = session.sort((a, b) => a.stepNumber - b.stepNumber);
    for (let i = 0; i < sortedSteps.length - 1; i++) {
      const fromStep = sortedSteps[i].stepName;
      const toStep = sortedSteps[i + 1].stepName;
      
      if (!transitions[fromStep]) {
        transitions[fromStep] = {};
      }
      if (!transitions[fromStep][toStep]) {
        transitions[fromStep][toStep] = 0;
      }
      transitions[fromStep][toStep]++;
    }
  });

  // Convert to array format for easier consumption
  const flowTransitions = Object.entries(transitions).flatMap(([from, tos]) =>
    Object.entries(tos).map(([to, count]) => ({
      from,
      to,
      count,
      percentage: Math.round((count / Object.values(tos).reduce((sum, c) => sum + c, 0)) * 100)
    }))
  ).sort((a, b) => b.count - a.count);

  return NextResponse.json({
    success: true,
    data: {
      transitions: flowTransitions.slice(0, 50), // Top 50 transitions
      totalSessions: Object.keys(sessionsById).length,
      totalSteps: flowData.length,
      uniqueSteps: [...new Set(flowData.map(step => step.stepName))].length
    }
  });
}

async function getInteractionAnalysis(tenantId: string, timeRange: string, pageUrl?: string | null) {
  const dateFilter = getDateFilter(timeRange);
  const where: any = { tenantId, timestamp: dateFilter };
  if (pageUrl) {
    where.pageUrl = pageUrl;
  }

  const [interactions, elementAnalysis, scrollAnalysis] = await Promise.all([
    prisma.heatmapData.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 1000
    }),
    prisma.heatmapData.groupBy({
      by: ['elementType', 'elementId'],
      where,
      _count: { elementType: true },
      _sum: { clickCount: true, hoverTime: true },
      _avg: { scrollDepth: true },
      orderBy: { _count: { elementType: 'desc' } },
      take: 20
    }),
    prisma.heatmapData.aggregate({
      where: { ...where, interactionType: 'scroll' },
      _avg: { scrollDepth: true },
      _max: { scrollDepth: true },
      _count: { id: true }
    })
  ]);

  return NextResponse.json({
    success: true,
    data: {
      summary: {
        totalInteractions: interactions.length,
        uniqueElements: elementAnalysis.length,
        avgScrollDepth: Math.round((scrollAnalysis._avg.scrollDepth || 0) * 100) / 100,
        maxScrollDepth: Math.round((scrollAnalysis._max.scrollDepth || 0) * 100) / 100,
        scrollInteractions: scrollAnalysis._count.id
      },
      topElements: elementAnalysis.map(element => ({
        elementType: element.elementType,
        elementId: element.elementId,
        interactions: element._count.elementType,
        totalClicks: element._sum.clickCount || 0,
        totalHoverTime: Math.round((element._sum.hoverTime || 0) / 1000),
        avgScrollDepth: Math.round((element._avg.scrollDepth || 0) * 100) / 100
      })),
      interactionHeatmap: generateInteractionHeatmap(interactions)
    }
  });
}

async function getBehaviorOverview(tenantId: string, timeRange: string) {
  const [journeys, heatmap, recordings, tests] = await Promise.all([
    getUserJourneys(tenantId, timeRange),
    getHeatmapData(tenantId, timeRange),
    getSessionRecordings(tenantId, timeRange),
    getABTests(tenantId)
  ]);

  const [journeyData, heatmapData, recordingData, testData] = await Promise.all([
    journeys.json(),
    heatmap.json(),
    recordings.json(),
    tests.json()
  ]);

  return NextResponse.json({
    success: true,
    data: {
      overview: {
        journeys: journeyData.data.summary,
        interactions: heatmapData.data.summary,
        recordings: recordingData.data.summary,
        tests: testData.data.summary
      },
      highlights: {
        topJourneyPath: journeyData.data.journeyPaths[0]?.path || 'N/A',
        mostInteractivePage: heatmapData.data.topPages[0]?.page || 'N/A',
        avgSessionDuration: recordingData.data.summary.avgDuration,
        activeABTests: testData.data.summary.activeTests
      },
      timeRange
    }
  });
}

// Recording/Tracking functions
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

async function recordHeatmapInteraction(data: any) {
  const interaction = await prisma.heatmapData.create({
    data: {
      tenantId: data.tenantId,
      pageUrl: data.pageUrl,
      elementId: data.elementId,
      elementType: data.elementType,
      elementText: data.elementText,
      xCoordinate: parseFloat(data.xCoordinate),
      yCoordinate: parseFloat(data.yCoordinate),
      interactionType: data.interactionType,
      sessionId: data.sessionId,
      userId: data.userId,
      deviceType: data.deviceType,
      screenWidth: data.screenWidth,
      screenHeight: data.screenHeight,
      clickCount: data.clickCount || 1,
      hoverTime: data.hoverTime || 0,
      scrollDepth: data.scrollDepth || 0,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { interactionId: interaction.id }
  });
}

async function createSessionRecording(data: any) {
  const recording = await prisma.sessionRecording.create({
    data: {
      tenantId: data.tenantId,
      sessionId: data.sessionId,
      userId: data.userId,
      recordingUrl: data.recordingUrl,
      duration: data.duration || 0,
      pageCount: data.pageCount || 0,
      interactionCount: data.interactionCount || 0,
      errorCount: data.errorCount || 0,
      conversionEvents: data.conversionEvents || [],
      deviceType: data.deviceType,
      browserType: data.browserType,
      operatingSystem: data.operatingSystem,
      screenResolution: data.screenResolution,
      ipAddress: data.ipAddress,
      geoLocation: data.geoLocation || {},
      referrerUrl: data.referrerUrl,
      landingPage: data.landingPage,
      exitPage: data.exitPage,
      bounced: data.bounced || false,
      startTime: data.startTime ? new Date(data.startTime) : new Date(),
      endTime: data.endTime ? new Date(data.endTime) : null,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { recordingId: recording.id }
  });
}

async function createABTest(data: any) {
  const test = await prisma.aBTest.create({
    data: {
      tenantId: data.tenantId,
      testName: data.testName,
      hypothesis: data.hypothesis,
      status: data.status || 'draft',
      testType: data.testType,
      variants: data.variants,
      trafficAllocation: data.trafficAllocation,
      targetAudience: data.targetAudience || {},
      conversionGoals: data.conversionGoals || [],
      statisticalPower: data.statisticalPower || 0.8,
      significanceLevel: data.significanceLevel || 0.05,
      minDetectableEffect: data.minDetectableEffect || 0.05,
      sampleSize: data.sampleSize,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      createdBy: data.createdBy,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { testId: test.id }
  });
}

async function assignABTestVariant(data: any) {
  const participant = await prisma.aBTestParticipant.create({
    data: {
      testId: data.testId,
      userId: data.userId,
      sessionId: data.sessionId,
      assignedVariant: data.assignedVariant,
      deviceType: data.deviceType,
      browserType: data.browserType,
      geoLocation: data.geoLocation || {},
      metadata: data.metadata || {}
    }
  });

  // Update test current sample size
  await prisma.aBTest.update({
    where: { id: data.testId },
    data: {
      currentSampleSize: {
        increment: 1
      }
    }
  });

  return NextResponse.json({
    success: true,
    data: { participantId: participant.id }
  });
}

async function recordABTestConversion(data: any) {
  const participant = await prisma.aBTestParticipant.update({
    where: { id: data.participantId },
    data: {
      conversionEvents: data.conversionEvents || [],
      converted: data.converted || true,
      conversionValue: data.conversionValue || 0,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { participantId: participant.id }
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

async function updateSegmentMembership(data: any) {
  const membership = await prisma.segmentMembership.upsert({
    where: {
      id: data.membershipId || 'new'
    },
    create: {
      segmentId: data.segmentId,
      userId: data.userId,
      sessionId: data.sessionId,
      membershipScore: data.membershipScore || 1.0,
      isActive: data.isActive !== false,
      metadata: data.metadata || {}
    },
    update: {
      membershipScore: data.membershipScore,
      lastActivity: new Date(),
      isActive: data.isActive,
      metadata: data.metadata || {}
    }
  });

  return NextResponse.json({
    success: true,
    data: { membershipId: membership.id }
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
    default: return { gte: new Date(now.getTime() - 604800000) };
  }
}

function analyzeJourneysByDevice(journeys: any[]) {
  const devices: Record<string, any> = {};
  
  journeys.forEach(journey => {
    const device = journey.deviceType || 'Unknown';
    if (!devices[device]) {
      devices[device] = { 
        device, 
        count: 0, 
        avgTime: 0, 
        conversionRate: 0, 
        totalTime: 0,
        conversions: 0 
      };
    }
    devices[device].count++;
    devices[device].totalTime += journey.totalTime;
    if (journey.completed) devices[device].conversions++;
  });

  return Object.values(devices).map((device: any) => ({
    device: device.device,
    count: device.count,
    avgTime: Math.round(device.totalTime / device.count),
    conversionRate: Math.round((device.conversions / device.count) * 100)
  }));
}

function groupJourneysByTime(journeys: any[], timeRange: string) {
  const groupBy = timeRange === '1h' || timeRange === '24h' ? 'hour' : 'day';
  const grouped: Record<string, any> = {};

  journeys.forEach(journey => {
    const date = new Date(journey.timestamp);
    let key: string;

    if (groupBy === 'hour') {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:00`;
    } else {
      key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }

    if (!grouped[key]) {
      grouped[key] = { timestamp: key, journeys: 0, steps: 0, conversions: 0 };
    }

    grouped[key].journeys++;
    grouped[key].steps++;
    if (journey.conversionEvent) grouped[key].conversions++;
  });

  return Object.values(grouped).sort((a: any, b: any) => a.timestamp.localeCompare(b.timestamp));
}

function generateClickDensityMap(heatmapData: any[]) {
  const densityMap: Record<string, number> = {};
  const gridSize = 50; // 50px grid

  heatmapData.forEach(item => {
    const gridX = Math.floor(item.xCoordinate / gridSize) * gridSize;
    const gridY = Math.floor(item.yCoordinate / gridSize) * gridSize;
    const key = `${gridX},${gridY}`;
    
    if (!densityMap[key]) {
      densityMap[key] = 0;
    }
    densityMap[key] += item.clickCount;
  });

  return Object.entries(densityMap).map(([key, density]) => {
    const [x, y] = key.split(',').map(Number);
    return { x, y, density };
  }).sort((a, b) => b.density - a.density);
}

function generateInteractionHeatmap(interactions: any[]) {
  return interactions.map(interaction => ({
    x: interaction.xCoordinate,
    y: interaction.yCoordinate,
    intensity: interaction.clickCount + (interaction.hoverTime / 1000),
    type: interaction.interactionType
  }));
}

function calculateEngagementScore(recording: any): number {
  let score = 0;
  
  // Base score from duration (max 30 points)
  score += Math.min(recording.duration / 60, 30); // 1 point per minute up to 30
  
  // Interaction score (max 40 points)
  score += Math.min(recording.interactionCount * 2, 40);
  
  // Page diversity score (max 20 points)
  score += Math.min(recording.pageCount * 4, 20);
  
  // Conversion bonus (10 points)
  if (recording.conversionEvents && recording.conversionEvents.length > 0) {
    score += 10;
  }
  
  // Error penalty
  score -= recording.errorCount * 5;
  
  // Bounce penalty
  if (recording.bounced) {
    score *= 0.5;
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}
