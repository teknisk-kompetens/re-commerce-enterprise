
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Get webhook events catalog
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      prisma.webhookEvent.findMany({
        where: category ? { category } : { isActive: true },
        orderBy: [
          { priority: 'desc' },
          { category: 'asc' },
          { eventType: 'asc' }
        ],
        skip,
        take: limit
      }),
      prisma.webhookEvent.count({
        where: category ? { category } : { isActive: true }
      })
    ]);

    // Group events by category
    const eventsByCategory = events.reduce((acc, event) => {
      if (!acc[event.category]) {
        acc[event.category] = [];
      }
      acc[event.category].push(event);
      return acc;
    }, {} as Record<string, typeof events>);

    return NextResponse.json({
      events,
      eventsByCategory,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching webhook events:', error);
    return NextResponse.json({ error: 'Failed to fetch webhook events' }, { status: 500 });
  }
}

// Create new webhook event type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventType, category, description, payloadSchema, priority } = body;

    if (!eventType || !category || !description) {
      return NextResponse.json({ 
        error: 'Missing required fields: eventType, category, description' 
      }, { status: 400 });
    }

    const event = await prisma.webhookEvent.create({
      data: {
        eventType,
        category,
        description,
        payloadSchema: payloadSchema || {},
        priority: priority || 'normal'
      }
    });

    return NextResponse.json({ event }, { status: 201 });

  } catch (error) {
    console.error('Error creating webhook event:', error);
    return NextResponse.json({ error: 'Failed to create webhook event' }, { status: 500 });
  }
}

// Update webhook event
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, description, payloadSchema, isActive, priority } = body;

    if (!id) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    const event = await prisma.webhookEvent.update({
      where: { id },
      data: {
        ...(description && { description }),
        ...(payloadSchema && { payloadSchema }),
        ...(isActive !== undefined && { isActive }),
        ...(priority && { priority })
      }
    });

    return NextResponse.json({ event });

  } catch (error) {
    console.error('Error updating webhook event:', error);
    return NextResponse.json({ error: 'Failed to update webhook event' }, { status: 500 });
  }
}
