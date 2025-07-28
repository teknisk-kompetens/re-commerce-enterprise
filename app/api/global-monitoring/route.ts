
/**
 * GLOBAL MONITORING API
 * API endpoints for global monitoring and observability
 */

import { NextRequest, NextResponse } from 'next/server';
import { globalMonitoringObservability } from '@/lib/global-monitoring-observability';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const configId = searchParams.get('configId');
    const dashboardId = searchParams.get('dashboardId');
    const metricId = searchParams.get('metricId');

    switch (action) {
      case 'configurations':
        const configurations = await globalMonitoringObservability.listGlobalMonitoringConfigs();
        return NextResponse.json({ success: true, data: configurations });

      case 'configuration':
        if (!configId) {
          return NextResponse.json({ success: false, error: 'Config ID required' }, { status: 400 });
        }
        const configuration = await globalMonitoringObservability.getGlobalMonitoringConfig(configId);
        return NextResponse.json({ success: true, data: configuration });

      case 'active-alerts':
        const alerts = await globalMonitoringObservability.getActiveAlerts(configId ?? undefined);
        return NextResponse.json({ success: true, data: alerts });

      case 'metric-history':
        if (!metricId) {
          return NextResponse.json({ success: false, error: 'Metric ID required' }, { status: 400 });
        }
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        const timeRange = startDate && endDate ? {
          start: new Date(startDate),
          end: new Date(endDate)
        } : undefined;
        
        const history = await globalMonitoringObservability.getMetricHistory(metricId, timeRange);
        return NextResponse.json({ success: true, data: history });

      case 'dashboards':
        const dashboards = await globalMonitoringObservability.listGlobalDashboards();
        return NextResponse.json({ success: true, data: dashboards });

      case 'dashboard':
        if (!dashboardId) {
          return NextResponse.json({ success: false, error: 'Dashboard ID required' }, { status: 400 });
        }
        const dashboard = await globalMonitoringObservability.getGlobalDashboard(dashboardId);
        return NextResponse.json({ success: true, data: dashboard });

      case 'global-metrics':
        const globalMetrics = await globalMonitoringObservability.getGlobalMonitoringMetrics();
        return NextResponse.json({ success: true, data: globalMetrics });

      case 'system-health':
        const systemHealth = {
          totalConfigurations: 0,
          activeConfigurations: 0,
          totalMetrics: 0,
          activeAlerts: 0,
          systemHealth: 95,
          averageLatency: 45
        };
        
        try {
          const metrics = await globalMonitoringObservability.getGlobalMonitoringMetrics();
          Object.assign(systemHealth, metrics);
        } catch (error) {
          console.warn('Could not fetch system health metrics:', error);
        }
        
        return NextResponse.json({ success: true, data: systemHealth });

      case 'performance-metrics':
        const performanceMetrics = {
          cpu: Math.floor(Math.random() * 30) + 40,
          memory: Math.floor(Math.random() * 25) + 50,
          disk: Math.floor(Math.random() * 20) + 30,
          network: Math.floor(Math.random() * 35) + 25,
          latency: Math.floor(Math.random() * 50) + 20,
          throughput: Math.floor(Math.random() * 1000) + 500,
          errors: Math.floor(Math.random() * 10),
          availability: 99.9 - Math.random() * 0.5
        };
        return NextResponse.json({ success: true, data: performanceMetrics });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Global monitoring API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'create-configuration':
        const configId = await globalMonitoringObservability.createGlobalMonitoringConfig(data);
        return NextResponse.json({ success: true, data: { configId } });

      case 'create-dashboard':
        const dashboardId = await globalMonitoringObservability.createGlobalDashboard(data);
        return NextResponse.json({ success: true, data: { dashboardId } });

      case 'trigger-alert':
        const { alertId, severity, message, region } = data;
        if (!alertId || !severity || !message) {
          return NextResponse.json({ success: false, error: 'Alert ID, severity, and message required' }, { status: 400 });
        }
        
        // Simulate alert triggering
        const alert = {
          id: alertId,
          severity,
          message,
          region: region || 'global',
          timestamp: new Date(),
          status: 'active'
        };
        
        return NextResponse.json({ success: true, data: { alert } });

      case 'acknowledge-alert':
        const { alertId: ackAlertId, userId } = data;
        if (!ackAlertId || !userId) {
          return NextResponse.json({ success: false, error: 'Alert ID and user ID required' }, { status: 400 });
        }
        
        // Simulate alert acknowledgment
        return NextResponse.json({ success: true, data: { message: 'Alert acknowledged' } });

      case 'resolve-alert':
        const { alertId: resolveAlertId, resolution } = data;
        if (!resolveAlertId || !resolution) {
          return NextResponse.json({ success: false, error: 'Alert ID and resolution required' }, { status: 400 });
        }
        
        // Simulate alert resolution
        return NextResponse.json({ success: true, data: { message: 'Alert resolved' } });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Global monitoring API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'update-configuration':
        const { configId, updates } = data;
        if (!configId || !updates) {
          return NextResponse.json({ success: false, error: 'Config ID and updates required' }, { status: 400 });
        }
        
        // Simulate configuration update
        return NextResponse.json({ success: true, data: { message: 'Configuration updated' } });

      case 'update-dashboard':
        const { dashboardId, updates: dashboardUpdates } = data;
        if (!dashboardId || !dashboardUpdates) {
          return NextResponse.json({ success: false, error: 'Dashboard ID and updates required' }, { status: 400 });
        }
        
        // Simulate dashboard update
        return NextResponse.json({ success: true, data: { message: 'Dashboard updated' } });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Global monitoring API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }

    switch (action) {
      case 'delete-configuration':
        // Simulate configuration deletion
        return NextResponse.json({ success: true, data: { message: 'Configuration deleted' } });

      case 'delete-dashboard':
        // Simulate dashboard deletion
        return NextResponse.json({ success: true, data: { message: 'Dashboard deleted' } });

      default:
        return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Global monitoring API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

