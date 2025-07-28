
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

    // Use MetricSnapshot model for system health metrics
    const systemHealthMetrics = await prisma.metricSnapshot.findMany({
      where: {
        category: 'system_health'
      },
      take: 50,
      orderBy: { timestamp: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: systemHealthMetrics
    });
  } catch (error) {
    console.error('System health error:', error);
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

    // Create system health metric as metric snapshot
    const systemHealthMetric = await prisma.metricSnapshot.create({
      data: {
        category: 'system_health',
        metrics: body.metrics || {},
        metadata: {
          createdBy: session.user.id,
          source: 'system_health_monitor',
          ...body.metadata
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: systemHealthMetric
    });
  } catch (error) {
    console.error('System health metric creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
