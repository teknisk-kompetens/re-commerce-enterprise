
/**
 * BEHEMOTH EVENT BUS SYSTEM
 * Enterprise-grade event bus for real-time widget communication,
 * event sourcing, and distributed system coordination
 */

import { EventEmitter } from 'events';
import { prisma } from '@/lib/db';

export interface Event {
  id?: string;
  type: string;
  source: string;
  target?: string;
  data: any;
  metadata?: {
    timestamp?: Date;
    version?: number;
    correlationId?: string;
    causationId?: string;
    tenantId?: string;
    userId?: string;
    priority?: 'low' | 'normal' | 'high' | 'critical';
    ttl?: number; // Time to live in seconds
    traceId?: string;
    failedSubscriptionId?: string;
    failureReason?: string;
    failureTime?: Date;
  };
}

export interface EventHandler {
  (event: Event): Promise<void>;
}

export interface EventSubscription {
  id: string;
  eventTypes: string[];
  handler: EventHandler;
  filter?: EventFilter;
  options?: SubscriptionOptions;
}

export interface EventFilter {
  source?: string | string[];
  target?: string | string[];
  tenantId?: string;
  userId?: string;
  dataConditions?: Record<string, any>;
}

export interface SubscriptionOptions {
  persistent?: boolean;
  retryPolicy?: {
    maxRetries: number;
    backoffMs: number;
    exponentialBackoff?: boolean;
  };
  deadLetterQueue?: boolean;
  batchSize?: number;
  parallelProcessing?: boolean;
}

export interface EventMetrics {
  eventsPublished: number;
  eventsProcessed: number;
  eventsFailedProcessing: number;
  averageProcessingTimeMs: number;
  subscriptionsActive: number;
  deadLetterQueueSize: number;
}

export class EventBus extends EventEmitter {
  private subscriptions = new Map<string, EventSubscription>();
  private eventStore: Event[] = [];
  private deadLetterQueue: Event[] = [];
  private metrics: EventMetrics = {
    eventsPublished: 0,
    eventsProcessed: 0,
    eventsFailedProcessing: 0,
    averageProcessingTimeMs: 0,
    subscriptionsActive: 0,
    deadLetterQueueSize: 0,
  };
  
  private processingTimes: number[] = [];
  private maxStoredProcessingTimes = 1000;

  constructor() {
    super();
    this.setMaxListeners(1000); // Support many concurrent subscriptions
    this.startDeadLetterQueueProcessor();
  }

  /**
   * Publish an event to the bus
   */
  async publish(event: Event): Promise<void> {
    try {
      // Generate event ID if not provided
      if (!event.id) {
        event.id = crypto.randomUUID();
      }

      // Set default metadata
      event.metadata = {
        timestamp: new Date(),
        version: 1,
        priority: 'normal',
        ttl: 3600, // 1 hour default TTL
        ...event.metadata,
      };

      // Store event for persistence and replay
      await this.persistEvent(event);
      this.eventStore.push(event);

      // Update metrics
      this.metrics.eventsPublished++;

      // Emit to subscriptions
      this.emit('event', event);

      // Process matching subscriptions
      await this.processEventSubscriptions(event);

    } catch (error) {
      console.error('Error publishing event:', error);
      throw error;
    }
  }

  /**
   * Subscribe to events with optional filtering
   */
  subscribe(
    eventTypes: string | string[],
    handler: EventHandler,
    filter?: EventFilter,
    options?: SubscriptionOptions
  ): string {
    const subscriptionId = crypto.randomUUID();
    const eventTypesArray = Array.isArray(eventTypes) ? eventTypes : [eventTypes];

    const subscription: EventSubscription = {
      id: subscriptionId,
      eventTypes: eventTypesArray,
      handler,
      filter,
      options: {
        persistent: false,
        retryPolicy: {
          maxRetries: 3,
          backoffMs: 1000,
          exponentialBackoff: true,
        },
        deadLetterQueue: true,
        batchSize: 1,
        parallelProcessing: false,
        ...options,
      },
    };

    this.subscriptions.set(subscriptionId, subscription);
    this.metrics.subscriptionsActive = this.subscriptions.size;

    return subscriptionId;
  }

  /**
   * Unsubscribe from events
   */
  unsubscribe(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId);
    this.metrics.subscriptionsActive = this.subscriptions.size;
  }

  /**
   * Get event history with optional filtering
   */
  getEventHistory(filter?: {
    eventTypes?: string[];
    source?: string;
    target?: string;
    startTime?: Date;
    endTime?: Date;
    limit?: number;
  }): Event[] {
    let filteredEvents = [...this.eventStore];

    if (filter) {
      if (filter.eventTypes) {
        filteredEvents = filteredEvents.filter(event => 
          filter.eventTypes!.includes(event.type)
        );
      }

      if (filter.source) {
        filteredEvents = filteredEvents.filter(event => 
          event.source === filter.source
        );
      }

      if (filter.target) {
        filteredEvents = filteredEvents.filter(event => 
          event.target === filter.target
        );
      }

      if (filter.startTime) {
        filteredEvents = filteredEvents.filter(event => 
          event.metadata?.timestamp && event.metadata.timestamp >= filter.startTime!
        );
      }

      if (filter.endTime) {
        filteredEvents = filteredEvents.filter(event => 
          event.metadata?.timestamp && event.metadata.timestamp <= filter.endTime!
        );
      }

      if (filter.limit) {
        filteredEvents = filteredEvents.slice(-filter.limit);
      }
    }

    return filteredEvents.sort((a, b) => {
      const timeA = a.metadata?.timestamp?.getTime() || 0;
      const timeB = b.metadata?.timestamp?.getTime() || 0;
      return timeA - timeB;
    });
  }

  /**
   * Replay events to a specific subscription
   */
  async replayEvents(
    subscriptionId: string,
    fromTime?: Date,
    eventTypes?: string[]
  ): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const events = this.getEventHistory({
      startTime: fromTime,
      eventTypes: eventTypes || subscription.eventTypes,
    });

    for (const event of events) {
      if (this.eventMatchesSubscription(event, subscription)) {
        await this.processEventForSubscription(event, subscription);
      }
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): EventMetrics {
    return {
      ...this.metrics,
      averageProcessingTimeMs: this.calculateAverageProcessingTime(),
      deadLetterQueueSize: this.deadLetterQueue.length,
    };
  }

  /**
   * Process events for matching subscriptions
   */
  private async processEventSubscriptions(event: Event): Promise<void> {
    const matchingSubscriptions = Array.from(this.subscriptions.values())
      .filter(subscription => this.eventMatchesSubscription(event, subscription));

    if (matchingSubscriptions.length === 0) {
      return;
    }

    // Process subscriptions in parallel or sequentially based on options
    const processingPromises = matchingSubscriptions.map(subscription => {
      if (subscription.options?.parallelProcessing) {
        return this.processEventForSubscription(event, subscription);
      } else {
        return this.processEventForSubscription(event, subscription);
      }
    });

    if (matchingSubscriptions.some(s => s.options?.parallelProcessing)) {
      await Promise.allSettled(processingPromises);
    } else {
      for (const promise of processingPromises) {
        await promise;
      }
    }
  }

  /**
   * Process event for a specific subscription
   */
  private async processEventForSubscription(
    event: Event,
    subscription: EventSubscription
  ): Promise<void> {
    const startTime = performance.now();
    let retryCount = 0;
    const maxRetries = subscription.options?.retryPolicy?.maxRetries || 3;

    while (retryCount <= maxRetries) {
      try {
        await subscription.handler(event);
        
        // Update metrics on success
        const processingTime = performance.now() - startTime;
        this.updateProcessingMetrics(processingTime);
        
        return;
      } catch (error) {
        console.error(`Error processing event ${event.id} for subscription ${subscription.id}:`, error);
        retryCount++;

        if (retryCount <= maxRetries) {
          // Calculate backoff delay
          const baseDelay = subscription.options?.retryPolicy?.backoffMs || 1000;
          const delay = subscription.options?.retryPolicy?.exponentialBackoff
            ? baseDelay * Math.pow(2, retryCount - 1)
            : baseDelay;

          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // Max retries exceeded, send to dead letter queue
          if (subscription.options?.deadLetterQueue) {
            this.deadLetterQueue.push({
              ...event,
              metadata: {
                ...event.metadata,
                failedSubscriptionId: subscription.id,
                failureReason: error instanceof Error ? error.message : 'Unknown error',
                failureTime: new Date(),
              },
            });
          }

          this.metrics.eventsFailedProcessing++;
          throw error;
        }
      }
    }
  }

  /**
   * Check if event matches subscription criteria
   */
  private eventMatchesSubscription(event: Event, subscription: EventSubscription): boolean {
    // Check event type
    if (!subscription.eventTypes.includes(event.type)) {
      return false;
    }

    // Apply filters
    if (subscription.filter) {
      const filter = subscription.filter;

      if (filter.source) {
        const sources = Array.isArray(filter.source) ? filter.source : [filter.source];
        if (!sources.includes(event.source)) {
          return false;
        }
      }

      if (filter.target && event.target) {
        const targets = Array.isArray(filter.target) ? filter.target : [filter.target];
        if (!targets.includes(event.target)) {
          return false;
        }
      }

      if (filter.tenantId && event.metadata?.tenantId !== filter.tenantId) {
        return false;
      }

      if (filter.userId && event.metadata?.userId !== filter.userId) {
        return false;
      }

      if (filter.dataConditions) {
        for (const [key, value] of Object.entries(filter.dataConditions)) {
          if (event.data[key] !== value) {
            return false;
          }
        }
      }
    }

    return true;
  }

  /**
   * Persist event to database
   */
  private async persistEvent(event: Event): Promise<void> {
    try {
      // TODO: Add eventStore model to schema
      // Mock implementation for now
      console.log('Persisting event:', event.type);
      // await prisma.eventStore.create({
      //   data: {
      //     aggregateId: event.target || event.source,
      //     aggregateType: event.type.split('.')[0] || 'Event',
      //     eventType: event.type,
      //     eventVersion: event.metadata?.version || 1,
      //     eventData: event.data,
      //     eventMetadata: event.metadata || {},
      //     streamPosition: await this.getNextStreamPosition(),
      //     timestamp: event.metadata?.timestamp || new Date(),
      //     tenantId: event.metadata?.tenantId,
      //     causedBy: event.metadata?.userId,
      //     correlationId: event.metadata?.correlationId,
      //     causationId: event.metadata?.causationId,
      //   },
      // });
    } catch (error) {
      console.error('Error persisting event:', error);
    }
  }

  /**
   * Get next stream position
   */
  private async getNextStreamPosition(): Promise<bigint> {
    try {
      // TODO: Add eventStore model to schema
      // Mock implementation for now
      return BigInt(Date.now());
      // const lastEvent = await prisma.eventStore.findFirst({
      //   orderBy: { streamPosition: 'desc' },
      //   select: { streamPosition: true },
      // });
      // return BigInt((lastEvent?.streamPosition || 0n) + 1n);
    } catch (error) {
      console.error('Error getting next stream position:', error);
      return BigInt(Date.now()); // Fallback to timestamp
    }
  }

  /**
   * Update processing time metrics
   */
  private updateProcessingMetrics(processingTime: number): void {
    this.processingTimes.push(processingTime);
    
    // Keep only recent processing times for average calculation
    if (this.processingTimes.length > this.maxStoredProcessingTimes) {
      this.processingTimes.shift();
    }
    
    this.metrics.eventsProcessed++;
  }

  /**
   * Calculate average processing time
   */
  private calculateAverageProcessingTime(): number {
    if (this.processingTimes.length === 0) {
      return 0;
    }

    const sum = this.processingTimes.reduce((acc, time) => acc + time, 0);
    return sum / this.processingTimes.length;
  }

  /**
   * Start dead letter queue processor
   */
  private startDeadLetterQueueProcessor(): void {
    setInterval(() => {
      if (this.deadLetterQueue.length > 0) {
        console.log(`Dead letter queue has ${this.deadLetterQueue.length} failed events`);
        
        // Could implement retry logic for dead letter queue items
        // For now, just log and clear old items
        const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
        this.deadLetterQueue = this.deadLetterQueue.filter(event => {
          const failureTime = event.metadata?.failureTime;
          return failureTime && failureTime > cutoffTime;
        });
      }
    }, 60000); // Check every minute
  }
}

// Widget Communication Specific Event Types
export const WidgetEvents = {
  // Lifecycle events
  WIDGET_LOADED: 'widget.loaded',
  WIDGET_UNLOADED: 'widget.unloaded',
  WIDGET_CONFIGURED: 'widget.configured',
  WIDGET_ERROR: 'widget.error',

  // Communication events
  WIDGET_MESSAGE: 'widget.message',
  WIDGET_BROADCAST: 'widget.broadcast',
  WIDGET_REQUEST: 'widget.request',
  WIDGET_RESPONSE: 'widget.response',

  // Data events
  DATA_UPDATED: 'data.updated',
  DATA_SYNC_REQUIRED: 'data.sync_required',
  DATA_CONFLICT: 'data.conflict',

  // UI events
  UI_STATE_CHANGED: 'ui.state_changed',
  UI_INTERACTION: 'ui.interaction',
  UI_FOCUS_CHANGED: 'ui.focus_changed',

  // System events
  SYSTEM_ALERT: 'system.alert',
  SYSTEM_MAINTENANCE: 'system.maintenance',
  TENANT_SWITCHED: 'tenant.switched',
} as const;

// Singleton instance
export const eventBus = new EventBus();
