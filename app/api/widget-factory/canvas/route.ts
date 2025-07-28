
/**
 * WIDGET FACTORY API - CANVAS
 * API endpoints for canvas operations, viewport management, and widget positioning
 */

import { NextRequest, NextResponse } from 'next/server';
import { createBehemothApiRoute } from '@/lib/behemoth-api-gateway';

export const dynamic = 'force-dynamic';

// GET /api/widget-factory/canvas - Get canvas state
async function getCanvas(context: any) {
  try {
    const { searchParams } = context;
    const canvasId = searchParams.get('canvasId');

    if (!canvasId) {
      return NextResponse.json(
        { error: 'Canvas ID is required' },
        { status: 400 }
      );
    }

    // Simulate canvas state
    const canvas = {
      id: canvasId,
      name: 'Widget Factory Canvas',
      viewport: {
        x: 0,
        y: 0,
        zoom: 1,
        width: 1920,
        height: 1080,
      },
      grid: {
        enabled: true,
        size: 20,
        snapToGrid: true,
        showGrid: true,
        color: '#e0e0e0',
        opacity: 0.5,
      },
      layers: [
        {
          id: 'background',
          name: 'Background',
          zIndex: 0,
          visible: true,
          locked: false,
          opacity: 1,
          widgets: [],
        },
        {
          id: 'main',
          name: 'Main Layer',
          zIndex: 100,
          visible: true,
          locked: false,
          opacity: 1,
          widgets: [],
        },
      ],
      activeLayer: 'main',
      selection: {
        selectedWidgets: [],
        multiSelect: false,
      },
      created: new Date(),
      updated: new Date(),
      createdBy: context.user?.id || 'system',
      tenantId: context.tenant?.id || 'default',
    };

    return NextResponse.json(canvas);
  } catch (error) {
    console.error('Error fetching canvas:', error);
    return NextResponse.json(
      { error: 'Failed to fetch canvas' },
      { status: 500 }
    );
  }
}

// POST /api/widget-factory/canvas - Create canvas
async function createCanvas(context: any) {
  try {
    const { body } = context;
    const { name, template } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Canvas name is required' },
        { status: 400 }
      );
    }

    const canvas = {
      id: crypto.randomUUID(),
      name,
      viewport: {
        x: 0,
        y: 0,
        zoom: 1,
        width: 1920,
        height: 1080,
      },
      grid: {
        enabled: true,
        size: 20,
        snapToGrid: true,
        showGrid: true,
        color: '#e0e0e0',
        opacity: 0.5,
      },
      layers: [
        {
          id: 'background',
          name: 'Background',
          zIndex: 0,
          visible: true,
          locked: false,
          opacity: 1,
          widgets: [],
        },
        {
          id: 'main',
          name: 'Main Layer',
          zIndex: 100,
          visible: true,
          locked: false,
          opacity: 1,
          widgets: [],
        },
      ],
      activeLayer: 'main',
      selection: {
        selectedWidgets: [],
        multiSelect: false,
      },
      created: new Date(),
      updated: new Date(),
      createdBy: context.user?.id || 'system',
      tenantId: context.tenant?.id || 'default',
    };

    return NextResponse.json(canvas, { status: 201 });
  } catch (error) {
    console.error('Error creating canvas:', error);
    return NextResponse.json(
      { error: 'Failed to create canvas' },
      { status: 500 }
    );
  }
}

// PUT /api/widget-factory/canvas - Update canvas
async function updateCanvas(context: any) {
  try {
    const { body } = context;
    const { canvasId, viewport, grid, selection } = body;

    if (!canvasId) {
      return NextResponse.json(
        { error: 'Canvas ID is required' },
        { status: 400 }
      );
    }

    // Simulate canvas update
    const updatedCanvas = {
      id: canvasId,
      viewport: viewport || {
        x: 0,
        y: 0,
        zoom: 1,
        width: 1920,
        height: 1080,
      },
      grid: grid || {
        enabled: true,
        size: 20,
        snapToGrid: true,
        showGrid: true,
      },
      selection: selection || {
        selectedWidgets: [],
        multiSelect: false,
      },
      updated: new Date(),
    };

    return NextResponse.json(updatedCanvas);
  } catch (error) {
    console.error('Error updating canvas:', error);
    return NextResponse.json(
      { error: 'Failed to update canvas' },
      { status: 500 }
    );
  }
}

export const GET = createBehemothApiRoute(
  {
    requireAuth: false,
    enableMetrics: true,
    allowCors: true,
  },
  getCanvas
);

export const POST = createBehemothApiRoute(
  {
    requireAuth: true,
    enableMetrics: true,
    enableAudit: true,
    allowCors: true,
  },
  createCanvas
);

export const PUT = createBehemothApiRoute(
  {
    requireAuth: true,
    enableMetrics: true,
    enableAudit: true,
    allowCors: true,
  },
  updateCanvas
);
