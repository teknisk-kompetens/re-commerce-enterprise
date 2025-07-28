
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use AnalyticsEvent model for optimization recommendations
    const optimizationRecommendations = await prisma.analyticsEvent.findMany({
      where: {
        tenantId: session.user.tenantId,
        eventType: 'optimization_recommendation'
      },
      take: 50,
      orderBy: { timestamp: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: optimizationRecommendations
    });
  } catch (error) {
    console.error('Optimization recommendations error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Create optimization recommendation as analytics event
    const optimizationRecommendation = await prisma.analyticsEvent.create({
      data: {
        eventType: 'optimization_recommendation',
        properties: body,
        userId: session.user.id,
        tenantId: session.user.tenantId,
        sessionId: request.headers.get('x-session-id') || 'unknown'
      }
    });

    return NextResponse.json({
      success: true,
      data: optimizationRecommendation
    });
  } catch (error) {
    console.error('Optimization recommendation creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
