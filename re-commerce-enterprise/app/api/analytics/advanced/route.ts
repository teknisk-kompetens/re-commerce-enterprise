
/**
 * ADVANCED ANALYTICS API
 * Handles advanced analytics requests with real-time capabilities
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { advancedAnalyticsSystem } from '@/lib/advanced-analytics-system';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant ID required' }, { status: 400 });
    }

    switch (action) {
      case 'heatmap':
        const canvasId = searchParams.get('canvasId');
        if (!canvasId) {
          return NextResponse.json({ error: 'Canvas ID required' }, { status: 400 });
        }
        
        const heatmapData = await advancedAnalyticsSystem.generateHeatmapData(
          canvasId,
          tenantId
        );
        return NextResponse.json(heatmapData);

      case 'performance':
        const widgetId = searchParams.get('widgetId');
        const performanceInsights = await advancedAnalyticsSystem.analyzeWidgetPerformance(
          tenantId,
          widgetId || undefined
        );
        return NextResponse.json(performanceInsights);

      case 'behavior':
        const userId = searchParams.get('userId');
        if (!userId) {
          return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }
        
        const behaviorPatterns = await advancedAnalyticsSystem.trackUserBehavior(
          userId,
          tenantId
        );
        return NextResponse.json(behaviorPatterns);

      case 'dashboard':
        const dashboardData = await advancedAnalyticsSystem.getRealtimeDashboardData(tenantId);
        return NextResponse.json(dashboardData);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Advanced analytics error:', error);
    return NextResponse.json(
      { error: 'Analytics request failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, data } = await request.json();

    switch (action) {
      case 'track_event':
        await advancedAnalyticsSystem.trackEvent(data);
        return NextResponse.json({ success: true });

      case 'generate_report':
        const report = await advancedAnalyticsSystem.generateBusinessIntelligenceReport(
          data.tenantId,
          data.reportType,
          data.timeRange
        );
        return NextResponse.json(report);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Advanced analytics error:', error);
    return NextResponse.json(
      { error: 'Analytics request failed' },
      { status: 500 }
    );
  }
}
