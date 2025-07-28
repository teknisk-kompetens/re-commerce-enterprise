
/**
 * BEHEMOTH EVENT PUBLISHING API
 * Real-time event publishing for widget communication and system coordination
 */

import { NextRequest, NextResponse } from 'next/server';
import { createBehemothApiRoute } from '@/lib/behemoth-api-gateway';
import { eventBus, WidgetEvents } from '@/lib/event-bus-system';
import { observability } from '@/lib/behemoth-observability';

export const dynamic = 'force-dynamic';

interface EventPublishRequest {
  type: string;
  source: string;
  target?: string;
  data: any;
  metadata?: {
    priority?: 'low' | 'normal' | 'high' | 'critical';
    ttl?: number;
    correlationId?: string;
    causationId?: string;
  };
}

async function publishEventHandler(context: any) {
  const spanId = observability.startSpan('event_publish');
  
  try {
    const body: EventPublishRequest = await context.request.json();
    
    // Validate required fields
    if (!body.type || !body.source || !body.data) {
      return NextResponse.json({
        error: 'Missing required fields: type, source, and data',
      }, { status: 400 });
    }
    
    // Validate event type against allowed widget events
    const allowedEvents = Object.values(WidgetEvents);
    if (!allowedEvents.includes(body.type as any) && !body.type.startsWith('custom.')) {
      return NextResponse.json({
        error: 'Invalid event type. Must be a predefined widget event or start with "custom."',
        allowedEvents: allowedEvents,
      }, { status: 400 });
    }
    
    // Create event with metadata
    const event = {
      type: body.type,
      source: body.source,
      target: body.target,
      data: body.data,
      metadata: {
        timestamp: new Date(),
        tenantId: context.tenant?.id,
        userId: context.user?.id,
        priority: body.metadata?.priority || 'normal',
        ttl: body.metadata?.ttl || 3600, // 1 hour default
        correlationId: body.metadata?.correlationId || crypto.randomUUID(),
        causationId: body.metadata?.causationId,
      },
    };
    
    // Publish event through event bus
    const startTime = performance.now();
    await eventBus.publish(event);
    const publishTime = performance.now() - startTime;
    
    // Record metrics
    observability.recordMetric('events_published_total', 1, 'counter', {
      event_type: body.type,
      source: body.source,
      priority: event.metadata.priority,
    });
    
    observability.recordMetric('event_publish_duration', publishTime, 'histogram', {
      event_type: body.type,
    }, 'ms');
    
    // Finish tracing
    observability.finishSpan(spanId, 'success', {
      'event.type': body.type,
      'event.source': body.source,
      'event.target': body.target || 'broadcast',
      'event.priority': event.metadata.priority,
      'event.duration_ms': publishTime,
    });
    
    return NextResponse.json({
      success: true,
      eventId: event.metadata.correlationId,
      message: 'Event published successfully',
      metadata: {
        type: body.type,
        source: body.source,
        target: body.target,
        priority: event.metadata.priority,
        publishTime: `${publishTime.toFixed(2)}ms`,
        timestamp: event.metadata.timestamp,
      },
    });
    
  } catch (error) {
    observability.finishSpan(spanId, 'error', {
      'error': error instanceof Error ? error.message : 'Unknown error',
    });
    
    // Record error metrics
    observability.recordMetric('events_published_total', 1, 'counter', {
      event_type: 'unknown',
      source: 'unknown',
      success: 'false',
    });
    
    console.error('Event publishing failed:', error);
    
    return NextResponse.json({
      error: 'Failed to publish event',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Event publishing endpoint
export const POST = createBehemothApiRoute(
  {
    requireAuth: true,
    requireTenant: true,
    permissions: ['events:publish', 'widget_communication'],
    allowCors: true,
    enableMetrics: true,
    enableTracing: true,
    enableAudit: true,
    rateLimit: {
      requests: 1000,
      window: 300, // 1000 events per 5 minutes
    },
    widgetContext: true,
    eventPublishing: ['widget.event_published'],
  },
  publishEventHandler
);

// GET endpoint for event information
export const GET = createBehemothApiRoute(
  {
    requireAuth: true,
    requireTenant: false,
    allowCors: true,
    enableMetrics: false,
    enableTracing: false,
    rateLimit: {
      requests: 100,
      window: 60,
    },
  },
  async () => {
    // Get event bus metrics
    const eventMetrics = eventBus.getMetrics();
    
    return NextResponse.json({
      eventBus: {
        status: 'operational',
        metrics: eventMetrics,
      },
      supportedEvents: {
        widgetEvents: Object.values(WidgetEvents),
        customEvents: {
          description: 'Custom events must start with "custom."',
          examples: ['custom.user_action', 'custom.data_updated', 'custom.ui_interaction'],
        },
      },
      publishing: {
        rateLimit: '1000 events per 5 minutes',
        maxEventSize: '1MB',
        ttlRange: '60 seconds to 24 hours',
        priorities: ['low', 'normal', 'high', 'critical'],
      },
      subscription: {
        endpoint: '/api/behemoth/events/subscribe',
        websocket: '/api/behemoth/events/ws',
        filtering: 'Support for source, target, type, and metadata filtering',
      },
    });
  }
);
