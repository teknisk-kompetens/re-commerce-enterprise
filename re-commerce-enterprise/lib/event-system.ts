
import { EventEmitter } from 'events';

export interface WidgetEvent {
  id: string;
  type: string;
  source: string;
  target?: string;
  tenantId: string;
  userId?: string;
  payload: Record<string, any>;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface EventSubscription {
  id: string;
  eventType: string;
  handler: (event: WidgetEvent) => void | Promise<void>;
  filter?: (event: WidgetEvent) => boolean;
}

export class WidgetEventBus extends EventEmitter {
  private static instance: WidgetEventBus;
  private subscriptions = new Map<string, EventSubscription>();
  private eventHistory: WidgetEvent[] = [];
  private maxHistorySize = 1000;

  private constructor() {
    super();
    this.setMaxListeners(100); // Allow many widget subscriptions
  }

  static getInstance(): WidgetEventBus {
    if (!WidgetEventBus.instance) {
      WidgetEventBus.instance = new WidgetEventBus();
    }
    return WidgetEventBus.instance;
  }

  // Publish an event to the bus
  async publish(event: Omit<WidgetEvent, 'id' | 'timestamp'>): Promise<void> {
    const fullEvent: WidgetEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    try {
      // Add to history
      this.addToHistory(fullEvent);

      // Emit to local subscribers
      this.emit(event.type, fullEvent);
      this.emit('*', fullEvent); // Wildcard listeners

      // Log event for debugging (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('Event published:', fullEvent);
      }

      // Future: Persist to database for cross-instance communication
      await this.persistEvent(fullEvent);

    } catch (error) {
      console.error('Error publishing event:', error);
      throw new Error('Failed to publish event');
    }
  }

  // Subscribe to events
  subscribe(
    eventType: string,
    handler: (event: WidgetEvent) => void | Promise<void>,
    filter?: (event: WidgetEvent) => boolean
  ): string {
    const subscriptionId = crypto.randomUUID();
    
    const subscription: EventSubscription = {
      id: subscriptionId,
      eventType,
      handler,
      filter,
    };

    this.subscriptions.set(subscriptionId, subscription);

    // Set up event listener
    const wrappedHandler = async (event: WidgetEvent) => {
      try {
        // Apply filter if provided
        if (filter && !filter(event)) {
          return;
        }

        await handler(event);
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error);
      }
    };

    this.on(eventType, wrappedHandler);

    return subscriptionId;
  }

  // Unsubscribe from events
  unsubscribe(subscriptionId: string): void {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      this.removeAllListeners(subscription.eventType);
      this.subscriptions.delete(subscriptionId);
    }
  }

  // Get event history
  getEventHistory(tenantId?: string, eventType?: string): WidgetEvent[] {
    let history = this.eventHistory;

    if (tenantId) {
      history = history.filter(event => event.tenantId === tenantId);
    }

    if (eventType) {
      history = history.filter(event => event.type === eventType);
    }

    return history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Clear event history
  clearHistory(): void {
    this.eventHistory = [];
  }

  private addToHistory(event: WidgetEvent): void {
    this.eventHistory.push(event);
    
    // Maintain history size limit
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
    }
  }

  private async persistEvent(event: WidgetEvent): Promise<void> {
    try {
      // In production, persist to database for cross-instance events
      // For now, just store in memory
      // TODO: Implement database persistence for distributed systems
    } catch (error) {
      console.error('Error persisting event:', error);
    }
  }
}

// Event types for widget communication
export const WidgetEventTypes = {
  // Widget lifecycle
  WIDGET_MOUNTED: 'widget.mounted',
  WIDGET_UNMOUNTED: 'widget.unmounted',
  WIDGET_ERROR: 'widget.error',
  
  // Widget communication
  WIDGET_MESSAGE: 'widget.message',
  WIDGET_REQUEST: 'widget.request',
  WIDGET_RESPONSE: 'widget.response',
  
  // Data events
  DATA_UPDATED: 'data.updated',
  DATA_CREATED: 'data.created',
  DATA_DELETED: 'data.deleted',
  
  // User events
  USER_ACTION: 'user.action',
  USER_NAVIGATION: 'user.navigation',
  
  // System events
  SYSTEM_NOTIFICATION: 'system.notification',
  SYSTEM_ERROR: 'system.error',
  
  // Tenant events
  TENANT_SWITCHED: 'tenant.switched',
  TENANT_UPDATED: 'tenant.updated',
  
  // Real-time sync
  REAL_TIME_UPDATE: 'realtime.update',
  REAL_TIME_BROADCAST: 'realtime.broadcast',
} as const;

// Utility functions for common event patterns
export class WidgetEventUtils {
  private static eventBus = WidgetEventBus.getInstance();

  // Publish data update event
  static async publishDataUpdate(
    source: string,
    tenantId: string,
    resource: string,
    data: any,
    userId?: string
  ): Promise<void> {
    await this.eventBus.publish({
      type: WidgetEventTypes.DATA_UPDATED,
      source,
      tenantId,
      userId,
      payload: {
        resource,
        data,
      },
    });
  }

  // Publish user action event
  static async publishUserAction(
    source: string,
    tenantId: string,
    action: string,
    data: any,
    userId?: string
  ): Promise<void> {
    await this.eventBus.publish({
      type: WidgetEventTypes.USER_ACTION,
      source,
      tenantId,
      userId,
      payload: {
        action,
        data,
      },
    });
  }

  // Subscribe to tenant-specific events
  static subscribeTenantEvents(
    tenantId: string,
    eventType: string,
    handler: (event: WidgetEvent) => void | Promise<void>
  ): string {
    return this.eventBus.subscribe(
      eventType,
      handler,
      (event) => event.tenantId === tenantId
    );
  }

  // Subscribe to widget-specific events
  static subscribeWidgetEvents(
    widgetId: string,
    eventType: string,
    handler: (event: WidgetEvent) => void | Promise<void>
  ): string {
    return this.eventBus.subscribe(
      eventType,
      handler,
      (event) => event.source === widgetId || event.target === widgetId
    );
  }
}

// Export singleton instance
export const widgetEventBus = WidgetEventBus.getInstance();
