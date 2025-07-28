
/**
 * Security Orchestration API
 */

import { NextRequest, NextResponse } from 'next/server';
import { IntelligentSecurityOrchestration } from '@/lib/intelligent-security-orchestration';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json();

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    let result;
    switch (action) {
      case 'executePlaybook':
        result = await IntelligentSecurityOrchestration.executePlaybook(
          params.playbookId,
          params.context,
          params.triggeredBy
        );
        break;
      case 'createAdaptiveControl':
        result = await IntelligentSecurityOrchestration.createAdaptiveSecurityControl(
          params.name,
          params.type,
          params.riskLevel,
          params.currentSettings,
          params.triggers
        );
        break;
      case 'selfHealing':
        result = await IntelligentSecurityOrchestration.performSelfHealing(
          params.systemId,
          params.issues,
          params.context
        );
        break;
      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Security orchestration error:', error);
    return NextResponse.json(
      { error: 'Failed to perform security orchestration' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '24h';

    const summary = await IntelligentSecurityOrchestration.getOrchestrationSummary(timeframe);

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error getting orchestration summary:', error);
    return NextResponse.json(
      { error: 'Failed to get orchestration summary' },
      { status: 500 }
    );
  }
}
