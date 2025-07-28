
/**
 * WIDGET FACTORY API - WIDGETS
 * API endpoints for widget management, creation, and configuration
 */

import { NextRequest, NextResponse } from 'next/server';
import { createBehemothApiRoute } from '@/lib/behemoth-api-gateway';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/widget-factory/widgets - List widgets
async function getWidgets(context: any) {
  try {
    const { searchParams } = context;
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const tags = searchParams.get('tags')?.split(',');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get real widget blueprints from database
    const widgetBlueprints = await prisma.widgetBlueprint.findMany({
      where: {
        published: true,
        ...(category && category !== 'all' && { category: category })
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        creator: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    // Convert database blueprints to widget format
    const widgets = widgetBlueprints.map(blueprint => ({
      id: blueprint.id,
      name: blueprint.name,
      version: blueprint.version,
      category: blueprint.category,
      description: blueprint.description,
      author: blueprint.creator?.name || 'Unknown',
      tags: [], // Could be extracted from blueprint metadata
      icon: '🧩', // Default icon, could be stored in metadata
      metadata: {
        downloads: 0, // Could be tracked in separate table
        rating: 0, // Could be tracked in separate table
        created: blueprint.createdAt,
        updated: blueprint.updatedAt,
        status: blueprint.published ? 'published' : 'draft',
      },
      configSchema: typeof blueprint.config === 'object' ? blueprint.config : {},
      defaultConfig: {
        name: blueprint.name,
        description: blueprint.description,
      },
    }));

    // Apply filters
    let filteredWidgets = widgets;
    
    if (category && category !== 'all') {
      filteredWidgets = filteredWidgets.filter(w => 
        w.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (search) {
      const query = search.toLowerCase();
      filteredWidgets = filteredWidgets.filter(w =>
        w.name?.toLowerCase().includes(query) ||
        w.description?.toLowerCase().includes(query) ||
        (w.tags || []).some((tag: string) => tag.toLowerCase().includes(query))
      );
    }

    if (tags && tags.length > 0) {
      filteredWidgets = filteredWidgets.filter(w =>
        tags.every((tag: string) => (w.tags || []).includes(tag))
      );
    }

    const total = filteredWidgets.length;
    const paginatedWidgets = filteredWidgets.slice(offset, offset + limit);

    return NextResponse.json({
      widgets: paginatedWidgets,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching widgets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch widgets' },
      { status: 500 }
    );
  }
}

// POST /api/widget-factory/widgets - Create widget instance
async function createWidget(context: any) {
  try {
    const { body } = context;
    const { widgetId, canvasId, position, size, config } = body;

    if (!widgetId || !canvasId) {
      return NextResponse.json(
        { error: 'Widget ID and Canvas ID are required' },
        { status: 400 }
      );
    }

    // Simulate widget instance creation
    const instance = {
      id: crypto.randomUUID(),
      widgetId,
      version: '1.0.0',
      name: `Widget ${Date.now()}`,
      canvasId,
      position: position || { x: 0, y: 0, z: 0 },
      size: size || { width: 200, height: 100 },
      config: config || {},
      state: {},
      isVisible: true,
      isLocked: false,
      created: new Date(),
      updated: new Date(),
      createdBy: context.user?.id || 'anonymous',
      tenantId: context.tenant?.id || 'default',
    };

    // In production, this would use the widget registry
    // await widgetRegistry.createInstance(widgetId, canvasId, instance);

    return NextResponse.json(instance, { status: 201 });
  } catch (error) {
    console.error('Error creating widget:', error);
    return NextResponse.json(
      { error: 'Failed to create widget' },
      { status: 500 }
    );
  }
}

export const GET = createBehemothApiRoute(
  {
    requireAuth: false,
    enableMetrics: true,
    enableAudit: true,
    allowCors: true,
  },
  getWidgets
);

export const POST = createBehemothApiRoute(
  {
    requireAuth: true,
    enableMetrics: true,
    enableAudit: true,
    allowCors: true,
  },
  createWidget
);
