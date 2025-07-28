
/**
 * AI-Powered Threat Intelligence API
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIPoweredThreatIntelligence } from '@/lib/ai-powered-threat-intelligence';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { context, indicators, timeframe } = await request.json();

    if (!context) {
      return NextResponse.json(
        { error: 'Context is required' },
        { status: 400 }
      );
    }

    const intelligence = await AIPoweredThreatIntelligence.analyzeThreatIntelligence(
      context,
      indicators || [],
      timeframe || '24h'
    );

    return NextResponse.json(intelligence);
  } catch (error) {
    console.error('Threat intelligence error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze threat intelligence' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '24h';

    const summary = await AIPoweredThreatIntelligence.getThreatIntelligenceSummary(timeframe);

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error getting threat intelligence summary:', error);
    return NextResponse.json(
      { error: 'Failed to get threat intelligence summary' },
      { status: 500 }
    );
  }
}
