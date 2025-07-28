
/**
 * PRODUCTION READINESS API
 * Handles production readiness requests and monitoring
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { productionReadinessSystem } from '@/lib/production-readiness-system';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'health':
        const health = await productionReadinessSystem.getSystemHealth();
        return NextResponse.json(health);

      case 'monitoring':
        const monitoring = await productionReadinessSystem.getSystemMonitoring();
        return NextResponse.json(monitoring);

      case 'error_analytics':
        const timeRange = {
          start: new Date(searchParams.get('start') || Date.now() - 24 * 60 * 60 * 1000),
          end: new Date(searchParams.get('end') || Date.now())
        };
        const errorAnalytics = await productionReadinessSystem.getErrorAnalytics(timeRange);
        return NextResponse.json(errorAnalytics);

      case 'health_check':
        const checkId = searchParams.get('checkId');
        if (!checkId) {
          return NextResponse.json({ error: 'Check ID required' }, { status: 400 });
        }
        const healthResult = await productionReadinessSystem.executeHealthCheck(checkId);
        return NextResponse.json(healthResult);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Production readiness error:', error);
    return NextResponse.json(
      { error: 'Production readiness request failed' },
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
      case 'register_health_check':
        await productionReadinessSystem.registerHealthCheck(data.check);
        return NextResponse.json({ success: true });

      case 'create_alert':
        const alertId = await productionReadinessSystem.createSystemAlert(data.alert);
        return NextResponse.json({ alertId });

      case 'resolve_alert':
        await productionReadinessSystem.resolveSystemAlert(data.alertId);
        return NextResponse.json({ success: true });

      case 'track_error':
        const errorId = await productionReadinessSystem.trackError(data.error, data.context);
        return NextResponse.json({ errorId });

      case 'register_auto_recovery':
        await productionReadinessSystem.registerAutoRecoveryAction(data.action);
        return NextResponse.json({ success: true });

      case 'execute_auto_recovery':
        const recoveryResult = await productionReadinessSystem.executeAutoRecoveryAction(data.actionId);
        return NextResponse.json(recoveryResult);

      case 'start_profiling':
        await productionReadinessSystem.startPerformanceProfiling(data.profilerId);
        return NextResponse.json({ success: true });

      case 'stop_profiling':
        const profilingResult = await productionReadinessSystem.stopPerformanceProfiling(data.profilerId);
        return NextResponse.json(profilingResult);

      case 'configure_deployment':
        await productionReadinessSystem.configureDeployment(data.config);
        return NextResponse.json({ success: true });

      case 'execute_deployment':
        const deploymentResult = await productionReadinessSystem.executeDeployment(data.version);
        return NextResponse.json(deploymentResult);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Production readiness error:', error);
    return NextResponse.json(
      { error: 'Production readiness request failed' },
      { status: 500 }
    );
  }
}
