
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

    // Use MetricSnapshot model for performance metrics
    const performanceMetrics = await prisma.metricSnapshot.findMany({
      where: {
        category: 'performance'
      },
      take: 50,
      orderBy: { timestamp: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: performanceMetrics
    });
  } catch (error) {
    console.error('Performance metrics error:', error);
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

    // Create performance metric as metric snapshot
    const performanceMetric = await prisma.metricSnapshot.create({
      data: {
        category: 'performance',
        metrics: body.metrics || {},
        metadata: {
          createdBy: session.user.id,
          source: 'performance_monitor',
          ...body.metadata
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: performanceMetric
    });
  } catch (error) {
    console.error('Performance metric creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
