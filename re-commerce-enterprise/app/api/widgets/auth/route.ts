
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

    // Use WidgetBlueprint model for dashboard widgets
    const dashboardWidgets = await prisma.widgetBlueprint.findMany({
      where: {
        published: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: dashboardWidgets
    });
  } catch (error) {
    console.error('Widget auth error:', error);
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

    // Log widget authentication
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'widget_auth',
        resource: body.widgetId || 'unknown',
        details: {
          widgetType: body.widgetType,
          action: body.action,
          timestamp: new Date()
        },
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Widget authentication logged'
    });
  } catch (error) {
    console.error('Widget auth creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use WidgetBlueprint model for dashboard widgets
    const dashboardWidgets = await prisma.widgetBlueprint.findMany({
      where: {
        createdBy: session.user.id
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: dashboardWidgets
    });
  } catch (error) {
    console.error('Widget update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
