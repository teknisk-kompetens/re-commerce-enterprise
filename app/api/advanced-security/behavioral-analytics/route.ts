
/**
 * Behavioral Analytics API
 */

import { NextRequest, NextResponse } from 'next/server';
import { BehavioralAnalyticsEngine } from '@/lib/behavioral-analytics-engine';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { userId, metrics, sessionId } = await request.json();

    if (!userId || !metrics || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const analysis = await BehavioralAnalyticsEngine.analyzeBehavior(
      userId,
      metrics,
      sessionId
    );

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Behavioral analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze behavior' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const profile = await BehavioralAnalyticsEngine.getUserBehavioralProfile(userId);

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error getting behavioral profile:', error);
    return NextResponse.json(
      { error: 'Failed to get behavioral profile' },
      { status: 500 }
    );
  }
}
