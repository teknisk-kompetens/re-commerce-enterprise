
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

    // Use AnalyticsEvent model for ROI tracking
    const rOITracking = await prisma.analyticsEvent.findMany({
      where: {
        tenantId: session.user.tenantId,
        eventType: 'roi_tracking'
      },
      take: 50,
      orderBy: { timestamp: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: rOITracking
    });
  } catch (error) {
    console.error('ROI tracking error:', error);
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

    // Create ROI tracking as analytics event
    const rOITracking = await prisma.analyticsEvent.create({
      data: {
        eventType: 'roi_tracking',
        properties: body,
        userId: session.user.id,
        tenantId: session.user.tenantId,
        sessionId: request.headers.get('x-session-id') || 'unknown'
      }
    });

    return NextResponse.json({
      success: true,
      data: rOITracking
    });
  } catch (error) {
    console.error('ROI tracking creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
