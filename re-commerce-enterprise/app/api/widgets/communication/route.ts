
import { createApiRoute } from '@/lib/api-gateway';
import { widgetEventBus, WidgetEventTypes } from '@/lib/event-system';
import { widgetCommunicationManager } from '@/lib/widget-communication';

export const dynamic = 'force-dynamic';

// POST /api/widgets/communication - Send message between widgets
export const POST = createApiRoute(
  {
    requireAuth: true,
    requireTenant: true,
    permissions: ['widgets:communicate'],
    rateLimit: { requests: 200, window: 60 },
  },
  async (context) => {
    try {
      const { user, tenant, request } = context;
      
      if (!user || !tenant) {
        return Response.json({ error: 'Authentication and tenant required' }, { status: 401 });
      }

      const body = await request.json();
      const { from, to, type, payload, correlationId } = body;

      if (!from || !to || !type || !payload) {
        return Response.json({ 
          error: 'Missing required fields: from, to, type, payload' 
        }, { status: 400 });
      }

      // Validate widget permissions
      const hasPermission = widgetCommunicationManager.validateWidgetPermission(
        from,
        'communicate',
        tenant.id
      );

      if (!hasPermission) {
        return Response.json({ error: 'Widget permission denied' }, { status: 403 });
      }

      // Create widget message
      const message = {
        id: crypto.randomUUID(),
        from,
        to,
        type,
        payload,
        timestamp: new Date(),
        tenantId: tenant.id,
        correlationId,
      };

      // Send through communication manager
      await widgetCommunicationManager.sendMessage(message);

      // Also publish as event for real-time updates
      await widgetEventBus.publish({
        type: WidgetEventTypes.WIDGET_MESSAGE,
        source: from,
        target: to,
        tenantId: tenant.id,
        userId: user.id,
        payload: {
          messageType: type,
          data: payload,
          correlationId,
        },
      });

      return Response.json({
        success: true,
        messageId: message.id,
        timestamp: message.timestamp,
      });
    } catch (error) {
      console.error('Error in widget communication:', error);
      return Response.json({ error: 'Failed to send widget message' }, { status: 500 });
    }
  }
);

// GET /api/widgets/communication - Get widget communication history
export const GET = createApiRoute(
  {
    requireAuth: true,
    requireTenant: true,
    permissions: ['widgets:read'],
  },
  async (context) => {
    try {
      const { user, tenant, searchParams } = context;
      
      if (!user || !tenant) {
        return Response.json({ error: 'Authentication and tenant required' }, { status: 401 });
      }

      const widgetId = searchParams.get('widgetId');
      const messageType = searchParams.get('type');
      const limit = parseInt(searchParams.get('limit') || '50');

      // Get event history filtered by tenant and widget
      const events = widgetEventBus.getEventHistory(tenant.id, WidgetEventTypes.WIDGET_MESSAGE);

      // Filter by widget if specified
      let filteredEvents = events;
      if (widgetId) {
        filteredEvents = events.filter(
          event => event.source === widgetId || event.target === widgetId
        );
      }

      // Filter by message type if specified
      if (messageType) {
        filteredEvents = filteredEvents.filter(
          event => event.payload?.messageType === messageType
        );
      }

      // Limit results
      const limitedEvents = filteredEvents.slice(0, limit);

      return Response.json({
        events: limitedEvents,
        total: filteredEvents.length,
        limit,
      });
    } catch (error) {
      console.error('Error fetching widget communication history:', error);
      return Response.json({ error: 'Failed to fetch communication history' }, { status: 500 });
    }
  }
);
