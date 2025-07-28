
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

    // Use AnalyticsEvent model instead of non-existent aiInsight
    const analyticsEvents = await prisma.analyticsEvent.findMany({
      where: {
        tenantId: session.user.tenantId,
        eventType: 'ai_insight'
      },
      take: 50,
      orderBy: { timestamp: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: analyticsEvents.map(event => ({
        id: event.id,
        type: event.eventType,
        timestamp: event.timestamp,
        properties: event.properties,
        userId: event.userId,
        sessionId: event.sessionId
      }))
    });
  } catch (error) {
    console.error('AI Analytics error:', error);
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

    // Create analytics event instead of non-existent aiInsight
    const analyticsEvent = await prisma.analyticsEvent.create({
      data: {
        eventType: 'ai_insight',
        properties: body,
        userId: session.user.id,
        tenantId: session.user.tenantId,
        sessionId: request.headers.get('x-session-id') || 'unknown'
      }
    });

    return NextResponse.json({
      success: true,
      data: analyticsEvent
    });
  } catch (error) {
    console.error('AI Analytics creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
