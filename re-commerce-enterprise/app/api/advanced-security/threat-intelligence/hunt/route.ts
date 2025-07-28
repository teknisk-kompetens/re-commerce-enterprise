
/**
 * APT Threat Hunting API
 */

import { NextRequest, NextResponse } from 'next/server';
import { AIPoweredThreatIntelligence } from '@/lib/ai-powered-threat-intelligence';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { huntingQuery, timeframe } = await request.json();

    if (!huntingQuery) {
      return NextResponse.json(
        { error: 'Hunting query is required' },
        { status: 400 }
      );
    }

    const results = await AIPoweredThreatIntelligence.huntAPT(
      huntingQuery,
      timeframe || '30d'
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error('APT hunting error:', error);
    return NextResponse.json(
      { error: 'Failed to hunt APT' },
      { status: 500 }
    );
  }
}
