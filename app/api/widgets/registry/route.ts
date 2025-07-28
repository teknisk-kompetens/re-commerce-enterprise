
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
    console.error('Widget registry error:', error);
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

    // Create widget blueprint
    const dashboardWidget = await prisma.widgetBlueprint.create({
      data: {
        name: body.name,
        description: body.description || '',
        category: body.category || 'general',
        config: body.config || {},
        template: body.template || '',
        version: body.version || '1.0.0',
        published: body.published || false,
        createdBy: session.user.id
      }
    });

    return NextResponse.json({
      success: true,
      data: dashboardWidget
    });
  } catch (error) {
    console.error('Widget registry creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Widget ID is required' }, { status: 400 });
    }

    // Update widget blueprint
    const dashboardWidget = await prisma.widgetBlueprint.update({
      where: { id },
      data: {
        name: updateData.name,
        description: updateData.description,
        category: updateData.category,
        config: updateData.config,
        template: updateData.template,
        version: updateData.version,
        published: updateData.published,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      data: dashboardWidget
    });
  } catch (error) {
    console.error('Widget registry update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Widget ID is required' }, { status: 400 });
    }

    // Delete widget blueprint
    await prisma.widgetBlueprint.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Widget deleted successfully'
    });
  } catch (error) {
    console.error('Widget registry deletion error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
