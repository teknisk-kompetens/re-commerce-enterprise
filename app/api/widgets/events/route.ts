
import { createApiRoute } from '@/lib/api-gateway';
import { widgetEventBus, WidgetEventTypes, WidgetEventUtils } from '@/lib/event-system';

export const dynamic = 'force-dynamic';

// POST /api/widgets/events - Publish widget event
export const POST = createApiRoute(
  {
    requireAuth: true,
    requireTenant: true,
    permissions: ['widgets:events'],
    rateLimit: { requests: 300, window: 60 },
  },
  async (context) => {
    try {
      const { user, tenant, request } = context;
      
      if (!user || !tenant) {
        return Response.json({ error: 'Authentication and tenant required' }, { status: 401 });
      }

      const body = await request.json();
      const { type, source, target, payload, metadata } = body;

      if (!type || !source || !payload) {
        return Response.json({ 
          error: 'Missing required fields: type, source, payload' 
        }, { status: 400 });
      }

      // Validate event type
      const validEventTypes = Object.values(WidgetEventTypes);
      if (!validEventTypes.includes(type)) {
        return Response.json({ 
          error: 'Invalid event type',
          validTypes: validEventTypes 
        }, { status: 400 });
      }

      // Publish event
      await widgetEventBus.publish({
        type,
        source,
        target,
        tenantId: tenant.id,
        userId: user.id,
        payload,
        metadata,
      });

      return Response.json({
        success: true,
        eventType: type,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error publishing widget event:', error);
      return Response.json({ error: 'Failed to publish event' }, { status: 500 });
    }
  }
);

// GET /api/widgets/events - Get widget events
export const GET = createApiRoute(
  {
    requireAuth: true,
    requireTenant: true,
    permissions: ['widgets:events'],
  },
  async (context) => {
    try {
      const { user, tenant, searchParams } = context;
      
      if (!user || !tenant) {
        return Response.json({ error: 'Authentication and tenant required' }, { status: 401 });
      }

      const eventType = searchParams.get('type');
      const source = searchParams.get('source');
      const target = searchParams.get('target');
      const limit = parseInt(searchParams.get('limit') || '100');

      // Get events for tenant
      let events = widgetEventBus.getEventHistory(tenant.id, eventType || undefined);

      // Apply filters
      if (source) {
        events = events.filter(event => event.source === source);
      }

      if (target) {
        events = events.filter(event => event.target === target);
      }

      // Limit results
      const limitedEvents = events.slice(0, limit);

      return Response.json({
        events: limitedEvents,
        total: events.length,
        filters: {
          eventType,
          source,
          target,
          limit,
        },
      });
    } catch (error) {
      console.error('Error fetching widget events:', error);
      return Response.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
  }
);

// DELETE /api/widgets/events - Clear event history
export const DELETE = createApiRoute(
  {
    requireAuth: true,
    requireTenant: true,
    permissions: ['widgets:events:manage'],
  },
  async (context) => {
    try {
      const { user, tenant } = context;
      
      if (!user || !tenant) {
        return Response.json({ error: 'Authentication and tenant required' }, { status: 401 });
      }

      // Only allow super admins or tenant admins to clear history
      if (user.role !== 'super_admin' && user.role !== 'tenant_admin') {
        return Response.json({ error: 'Insufficient permissions' }, { status: 403 });
      }

      // Clear event history
      widgetEventBus.clearHistory();

      return Response.json({
        success: true,
        clearedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error clearing widget events:', error);
      return Response.json({ error: 'Failed to clear events' }, { status: 500 });
    }
  }
);
