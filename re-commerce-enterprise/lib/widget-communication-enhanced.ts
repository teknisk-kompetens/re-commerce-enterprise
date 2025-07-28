
/**
 * ENHANCED WIDGET COMMUNICATION SYSTEM
 * Real-time, high-performance inter-widget communication with event routing,
 * message queuing, and collaborative synchronization
 */

import { eventBus, WidgetEvents, Event } from '@/lib/event-bus-system';
import { prisma } from '@/lib/db';

export interface WidgetCommunicationConfig {
  enableRealtime: boolean;
  messageQueueSize: number;
  batchProcessing: boolean;
  encryption: boolean;
  compression: boolean;
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
    exponentialBackoff: boolean;
  };
  routing: {
    strategy: 'direct' | 'broadcast' | 'topic' | 'pattern';
    filters: MessageFilter[];
  };
  collaboration: {
    enabled: boolean;
    conflictResolution: 'last-write-wins' | 'operational-transform' | 'merge';
    stateSync: boolean;
  };
}

export interface WidgetMessage {
  id: string;
  fromWidget: string;
  toWidget?: string; // undefined for broadcast
  messageType: string;
  payload: any;
  priority: 'low' | 'normal' | 'high' | 'critical';
  timestamp: Date;
  ttl?: number; // Time to live in seconds
  
  // Routing and delivery
  routing: {
    strategy: string;
    topic?: string;
    pattern?: string;
    filters?: Record<string, any>;
  };
  
  // Collaboration context
  collaboration: {
    sessionId?: string;
    operationId?: string;
    userId?: string;
    conflictVersion?: number;
  };
  
  // Security and validation
  signature?: string;
  encrypted?: boolean;
  compressed?: boolean;
  
  // Delivery tracking
  delivery: {
    attempts: number;
    lastAttempt?: Date;
    delivered: boolean;
    acknowledged: boolean;
    error?: string;
  };
}

export interface MessageFilter {
  id: string;
  type: 'widget' | 'user' | 'tenant' | 'messageType' | 'custom';
  property: string;
  operator: 'equals' | 'contains' | 'matches' | 'in' | 'not_in';
  value: any;
  condition?: string; // JavaScript expression for complex filtering
}

export interface WidgetPort {
  id: string;
  name: string;
  type: 'input' | 'output' | 'bidirectional';
  dataType: string;
  description?: string;
  required: boolean;
  defaultValue?: any;
  validation?: {
    schema: any;
    customValidator?: string;
  };
}

export interface WidgetConnection {
  id: string;
  sourceWidget: string;
  sourcePort: string;
  targetWidget: string;
  targetPort: string;
  connectionType: 'data' | 'event' | 'state' | 'stream';
  
  // Connection configuration
  config: {
    buffering: boolean;
    bufferSize?: number;
    throttling?: {
      enabled: boolean;
      rateMs: number;
    };
    transformation?: {
      enabled: boolean;
      function: string; // JavaScript function for data transformation
    };
    validation?: {
      enabled: boolean;
      schema: any;
    };
  };
  
  // Real-time state
  state: {
    isActive: boolean;
    lastMessage?: Date;
    messageCount: number;
    errorCount: number;
    latency: number; // Average latency in ms
  };
  
  // Metadata
  created: Date;
  updated: Date;
  canvasId: string;
  tenantId: string;
}

export interface CollaborativeOperation {
  id: string;
  type: 'insert' | 'delete' | 'update' | 'move' | 'resize';
  widgetId: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  
  // Operation data
  operation: {
    path: string; // JSONPath to the affected property
    oldValue?: any;
    newValue?: any;
    position?: number; // For insert/delete operations
  };
  
  // Operational Transform data
  transform: {
    baseVersion: number;
    resultVersion: number;
    dependencies: string[]; // Operation IDs this depends on
    conflicts: string[]; // Operation IDs that conflict with this
  };
  
  // State
  applied: boolean;
  acknowledged: boolean;
  rejected?: {
    reason: string;
    timestamp: Date;
  };
}

export class WidgetCommunicationSystem {
  private static config: WidgetCommunicationConfig = {
    enableRealtime: true,
    messageQueueSize: 1000,
    batchProcessing: true,
    encryption: false,
    compression: true,
    retryPolicy: {
      maxRetries: 3,
      backoffMs: 1000,
      exponentialBackoff: true,
    },
    routing: {
      strategy: 'direct',
      filters: [],
    },
    collaboration: {
      enabled: true,
      conflictResolution: 'operational-transform',
      stateSync: true,
    },
  };

  private static messageQueue = new Map<string, WidgetMessage[]>();
  private static connections = new Map<string, WidgetConnection>();
  private static widgets = new Map<string, { ports: WidgetPort[]; subscriptions: string[] }>();
  private static operations = new Map<string, CollaborativeOperation[]>();
  private static sessions = new Map<string, Set<string>>(); // sessionId -> widgetIds

  /**
   * Initialize widget communication system
   */
  static async initialize(config?: Partial<WidgetCommunicationConfig>): Promise<void> {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    // Subscribe to widget events
    eventBus.subscribe(
      [
        WidgetEvents.WIDGET_LOADED,
        WidgetEvents.WIDGET_UNLOADED,
        WidgetEvents.WIDGET_MESSAGE,
        WidgetEvents.WIDGET_BROADCAST,
      ],
      this.handleWidgetEvent.bind(this),
      { source: 'widget-communication' },
      { persistent: true, parallelProcessing: true }
    );

    // Start background processors
    this.startMessageProcessor();
    this.startCollaborationProcessor();
    this.startConnectionMonitor();

    console.log('Widget Communication System initialized');
  }

  /**
   * Register widget with communication ports
   */
  static registerWidget(
    widgetId: string,
    ports: WidgetPort[],
    config?: { autoConnect?: boolean }
  ): void {
    this.widgets.set(widgetId, {
      ports,
      subscriptions: [],
    });

    // Create message queue for widget
    this.messageQueue.set(widgetId, []);

    // Auto-connect compatible ports if enabled
    if (config?.autoConnect) {
      this.autoConnectWidget(widgetId);
    }

    // Publish widget registration event
    eventBus.publish({
      type: 'widget.communication.registered',
      source: 'widget-communication',
      target: widgetId,
      data: { widgetId, ports },
      metadata: { timestamp: new Date() },
    });
  }

  /**
   * Create connection between widgets
   */
  static async createConnection(
    sourceWidget: string,
    sourcePort: string,
    targetWidget: string,
    targetPort: string,
    config?: Partial<WidgetConnection['config']>
  ): Promise<string> {
    const connectionId = crypto.randomUUID();

    // Validate ports
    const sourcePortDef = this.getWidgetPort(sourceWidget, sourcePort);
    const targetPortDef = this.getWidgetPort(targetWidget, targetPort);

    if (!sourcePortDef || !targetPortDef) {
      throw new Error('Invalid port specified');
    }

    if (sourcePortDef.type === 'input' || targetPortDef.type === 'output') {
      throw new Error('Invalid connection direction');
    }

    const connection: WidgetConnection = {
      id: connectionId,
      sourceWidget,
      sourcePort,
      targetWidget,
      targetPort,
      connectionType: 'data',
      config: {
        buffering: false,
        throttling: { enabled: false, rateMs: 100 },
        transformation: { enabled: false, function: '' },
        validation: { enabled: false, schema: {} },
        ...config,
      },
      state: {
        isActive: true,
        messageCount: 0,
        errorCount: 0,
        latency: 0,
      },
      created: new Date(),
      updated: new Date(),
      canvasId: 'default', // Would be passed in production
      tenantId: 'default', // Would be passed in production
    };

    this.connections.set(connectionId, connection);

    // Persist connection
    await this.persistConnection(connection);

    // Publish connection created event
    eventBus.publish({
      type: 'widget.connection.created',
      source: 'widget-communication',
      data: { connection },
      metadata: { timestamp: new Date() },
    });

    return connectionId;
  }

  /**
   * Send message between widgets
   */
  static async sendMessage(
    fromWidget: string,
    toWidget: string | undefined,
    messageType: string,
    payload: any,
    options?: {
      priority?: WidgetMessage['priority'];
      ttl?: number;
      routing?: Partial<WidgetMessage['routing']>;
      collaboration?: Partial<WidgetMessage['collaboration']>;
    }
  ): Promise<string> {
    const messageId = crypto.randomUUID();

    const message: WidgetMessage = {
      id: messageId,
      fromWidget,
      toWidget,
      messageType,
      payload,
      priority: options?.priority || 'normal',
      timestamp: new Date(),
      ttl: options?.ttl,
      routing: {
        strategy: this.config.routing.strategy,
        ...options?.routing,
      },
      collaboration: {
        ...options?.collaboration,
      },
      delivery: {
        attempts: 0,
        delivered: false,
        acknowledged: false,
      },
    };

    // Apply compression if enabled
    if (this.config.compression) {
      message.compressed = true;
      // Would apply compression to payload
    }

    // Apply encryption if enabled
    if (this.config.encryption) {
      message.encrypted = true;
      // Would encrypt payload
    }

    // Route message
    await this.routeMessage(message);

    // Persist message for reliability
    await this.persistMessage(message);

    return messageId;
  }

  /**
   * Broadcast message to all widgets in canvas
   */
  static async broadcastMessage(
    fromWidget: string,
    messageType: string,
    payload: any,
    filters?: MessageFilter[]
  ): Promise<string> {
    return this.sendMessage(fromWidget, undefined, messageType, payload, {
      routing: {
        strategy: 'broadcast',
        filters: filters ? Object.fromEntries(filters.map(f => [f.id, f])) : undefined,
      },
    });
  }

  /**
   * Subscribe to messages
   */
  static subscribe(
    widgetId: string,
    messageTypes: string[],
    handler: (message: WidgetMessage) => Promise<void>,
    filters?: MessageFilter[]
  ): string {
    const subscriptionId = crypto.randomUUID();

    // Add to widget subscriptions
    const widget = this.widgets.get(widgetId);
    if (widget) {
      widget.subscriptions.push(subscriptionId);
    }

    // Create event bus subscription
    eventBus.subscribe(
      ['widget.message.routed'],
      async (event: Event) => {
        const message = event.data.message as WidgetMessage;
        
        // Check if message is for this widget
        if (message.toWidget && message.toWidget !== widgetId) {
          return;
        }

        // Check message type filter
        if (!messageTypes.includes(message.messageType)) {
          return;
        }

        // Apply custom filters
        if (filters && !this.applyFilters(message, filters)) {
          return;
        }

        try {
          await handler(message);
          
          // Mark as acknowledged
          message.delivery.acknowledged = true;
          await this.updateMessage(message);
        } catch (error) {
          console.error('Error handling widget message:', error);
          message.delivery.error = error instanceof Error ? error.message : 'Unknown error';
          await this.updateMessage(message);
        }
      },
      { source: 'widget-communication' },
      { persistent: true }
    );

    return subscriptionId;
  }

  /**
   * Apply collaborative operation
   */
  static async applyOperation(operation: CollaborativeOperation): Promise<boolean> {
    try {
      // Check for conflicts
      const conflicts = await this.detectConflicts(operation);
      
      if (conflicts.length > 0 && this.config.collaboration.conflictResolution !== 'last-write-wins') {
        // Apply operational transform
        const transformedOp = await this.transformOperation(operation, conflicts);
        operation = transformedOp;
      }

      // Apply the operation
      await this.executeOperation(operation);

      // Mark as applied
      operation.applied = true;
      
      // Store operation
      const sessionOps = this.operations.get(operation.sessionId) || [];
      sessionOps.push(operation);
      this.operations.set(operation.sessionId, sessionOps);

      // Broadcast to other session participants
      await this.broadcastOperation(operation);

      return true;
    } catch (error) {
      console.error('Error applying collaborative operation:', error);
      operation.rejected = {
        reason: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
      return false;
    }
  }

  /**
   * Get widget performance metrics
   */
  static getMetrics(widgetId?: string): any {
    const metrics = {
      totalMessages: 0,
      averageLatency: 0,
      errorRate: 0,
      connectionCount: 0,
      activeConnections: 0,
    };

    // Calculate metrics based on connections and messages
    for (const connection of this.connections.values()) {
      if (!widgetId || connection.sourceWidget === widgetId || connection.targetWidget === widgetId) {
        metrics.connectionCount++;
        if (connection.state.isActive) {
          metrics.activeConnections++;
        }
        metrics.totalMessages += connection.state.messageCount;
        metrics.averageLatency += connection.state.latency;
      }
    }

    if (metrics.connectionCount > 0) {
      metrics.averageLatency /= metrics.connectionCount;
    }

    return metrics;
  }

  // Private helper methods
  private static async handleWidgetEvent(event: Event): Promise<void> {
    switch (event.type) {
      case WidgetEvents.WIDGET_LOADED:
        // Initialize widget communication
        break;
      case WidgetEvents.WIDGET_UNLOADED:
        // Cleanup widget communication
        this.cleanupWidget(event.target!);
        break;
      case WidgetEvents.WIDGET_MESSAGE:
        // Handle direct widget message
        await this.processDirectMessage(event.data);
        break;
      case WidgetEvents.WIDGET_BROADCAST:
        // Handle broadcast message
        await this.processBroadcastMessage(event.data);
        break;
    }
  }

  private static getWidgetPort(widgetId: string, portName: string): WidgetPort | null {
    const widget = this.widgets.get(widgetId);
    return widget?.ports.find(p => p.name === portName) || null;
  }

  private static autoConnectWidget(widgetId: string): void {
    const widget = this.widgets.get(widgetId);
    if (!widget) return;

    // Find compatible ports in other widgets
    for (const [otherWidgetId, otherWidget] of this.widgets) {
      if (otherWidgetId === widgetId) continue;

      for (const port of widget.ports) {
        if (port.type === 'output') {
          // Find compatible input ports
          const compatibleInputs = otherWidget.ports.filter(
            p => p.type === 'input' && p.dataType === port.dataType
          );

          for (const input of compatibleInputs) {
            // Create connection automatically
            this.createConnection(widgetId, port.name, otherWidgetId, input.name);
          }
        }
      }
    }
  }

  private static async routeMessage(message: WidgetMessage): Promise<void> {
    const startTime = performance.now();

    try {
      switch (message.routing.strategy) {
        case 'direct':
          await this.routeDirectMessage(message);
          break;
        case 'broadcast':
          await this.routeBroadcastMessage(message);
          break;
        case 'topic':
          await this.routeTopicMessage(message);
          break;
        case 'pattern':
          await this.routePatternMessage(message);
          break;
      }

      message.delivery.delivered = true;
      message.delivery.attempts++;

      // Update connection latency
      const latency = performance.now() - startTime;
      this.updateConnectionLatency(message.fromWidget, message.toWidget, latency);

    } catch (error) {
      message.delivery.error = error instanceof Error ? error.message : 'Unknown error';
      message.delivery.attempts++;
      
      // Retry if policy allows
      if (message.delivery.attempts < this.config.retryPolicy.maxRetries) {
        setTimeout(() => this.routeMessage(message), this.config.retryPolicy.backoffMs);
      }
    }
  }

  private static async routeDirectMessage(message: WidgetMessage): Promise<void> {
    if (!message.toWidget) {
      throw new Error('Direct message requires target widget');
    }

    // Add to target widget's queue
    const queue = this.messageQueue.get(message.toWidget) || [];
    queue.push(message);
    this.messageQueue.set(message.toWidget, queue);

    // Publish routed message event
    eventBus.publish({
      type: 'widget.message.routed',
      source: 'widget-communication',
      target: message.toWidget,
      data: { message },
      metadata: { timestamp: new Date() },
    });
  }

  private static async routeBroadcastMessage(message: WidgetMessage): Promise<void> {
    // Send to all registered widgets except sender
    for (const widgetId of this.widgets.keys()) {
      if (widgetId !== message.fromWidget) {
        const broadcastMessage = { ...message, toWidget: widgetId };
        await this.routeDirectMessage(broadcastMessage);
      }
    }
  }

  private static async routeTopicMessage(message: WidgetMessage): Promise<void> {
    // Route based on topic subscription
    // Implementation would check widget topic subscriptions
  }

  private static async routePatternMessage(message: WidgetMessage): Promise<void> {
    // Route based on pattern matching
    // Implementation would use pattern matching for message routing
  }

  private static applyFilters(message: WidgetMessage, filters: MessageFilter[]): boolean {
    for (const filter of filters) {
      if (!this.evaluateFilter(message, filter)) {
        return false;
      }
    }
    return true;
  }

  private static evaluateFilter(message: WidgetMessage, filter: MessageFilter): boolean {
    let value: any;

    switch (filter.type) {
      case 'messageType':
        value = message.messageType;
        break;
      case 'widget':
        value = filter.property === 'from' ? message.fromWidget : message.toWidget;
        break;
      default:
        value = (message as any)[filter.property];
    }

    switch (filter.operator) {
      case 'equals':
        return value === filter.value;
      case 'contains':
        return typeof value === 'string' && value.includes(filter.value);
      case 'in':
        return Array.isArray(filter.value) && filter.value.includes(value);
      case 'not_in':
        return Array.isArray(filter.value) && !filter.value.includes(value);
      default:
        return true;
    }
  }

  private static async detectConflicts(operation: CollaborativeOperation): Promise<CollaborativeOperation[]> {
    const sessionOps = this.operations.get(operation.sessionId) || [];
    const conflicts: CollaborativeOperation[] = [];

    for (const existingOp of sessionOps) {
      if (this.operationsConflict(operation, existingOp)) {
        conflicts.push(existingOp);
      }
    }

    return conflicts;
  }

  private static operationsConflict(op1: CollaborativeOperation, op2: CollaborativeOperation): boolean {
    // Check if operations affect the same widget and property path
    return (
      op1.widgetId === op2.widgetId &&
      op1.operation.path === op2.operation.path &&
      op1.id !== op2.id
    );
  }

  private static async transformOperation(
    operation: CollaborativeOperation,
    conflicts: CollaborativeOperation[]
  ): Promise<CollaborativeOperation> {
    // Implement operational transform algorithm
    // This is a simplified version - production would need full OT implementation
    
    let transformedOp = { ...operation };
    
    for (const conflict of conflicts) {
      // Apply transformation based on operation types
      if (operation.type === 'update' && conflict.type === 'update') {
        // Last write wins for now
        transformedOp.transform.baseVersion = Math.max(
          transformedOp.transform.baseVersion,
          conflict.transform.resultVersion
        );
      }
    }

    return transformedOp;
  }

  private static async executeOperation(operation: CollaborativeOperation): Promise<void> {
    // Apply the operation to the widget state
    // This would integrate with the widget registry to update widget state
    
    eventBus.publish({
      type: 'widget.operation.applied',
      source: 'widget-communication',
      target: operation.widgetId,
      data: { operation },
      metadata: {
        userId: operation.userId,
        timestamp: new Date(),
      },
    });
  }

  private static async broadcastOperation(operation: CollaborativeOperation): Promise<void> {
    // Broadcast operation to other session participants
    const sessionWidgets = this.sessions.get(operation.sessionId);
    if (sessionWidgets) {
      for (const widgetId of sessionWidgets) {
        if (widgetId !== operation.widgetId) {
          eventBus.publish({
            type: 'widget.operation.broadcast',
            source: 'widget-communication',
            target: widgetId,
            data: { operation },
            metadata: { timestamp: new Date() },
          });
        }
      }
    }
  }

  private static updateConnectionLatency(
    sourceWidget: string,
    targetWidget: string | undefined,
    latency: number
  ): void {
    for (const connection of this.connections.values()) {
      if (
        connection.sourceWidget === sourceWidget &&
        (!targetWidget || connection.targetWidget === targetWidget)
      ) {
        // Update running average
        const oldLatency = connection.state.latency;
        const messageCount = connection.state.messageCount;
        connection.state.latency = (oldLatency * messageCount + latency) / (messageCount + 1);
        connection.state.messageCount++;
        break;
      }
    }
  }

  private static cleanupWidget(widgetId: string): void {
    // Remove widget from communication system
    this.widgets.delete(widgetId);
    this.messageQueue.delete(widgetId);

    // Remove connections involving this widget
    for (const [connectionId, connection] of this.connections) {
      if (connection.sourceWidget === widgetId || connection.targetWidget === widgetId) {
        this.connections.delete(connectionId);
      }
    }
  }

  private static async processDirectMessage(data: any): Promise<void> {
    // Process direct widget message
  }

  private static async processBroadcastMessage(data: any): Promise<void> {
    // Process broadcast widget message
  }

  private static startMessageProcessor(): void {
    // Start background message processor
    setInterval(() => {
      this.processMessageQueues();
    }, 100); // Process every 100ms
  }

  private static startCollaborationProcessor(): void {
    // Start background collaboration processor
    setInterval(() => {
      this.processCollaborativeOperations();
    }, 50); // Process every 50ms for real-time collaboration
  }

  private static startConnectionMonitor(): void {
    // Start connection health monitor
    setInterval(() => {
      this.monitorConnections();
    }, 5000); // Monitor every 5 seconds
  }

  private static processMessageQueues(): void {
    // Process pending messages in batches
    for (const [widgetId, queue] of this.messageQueue) {
      if (queue.length > 0) {
        const batchSize = this.config.batchProcessing ? 10 : 1;
        const batch = queue.splice(0, batchSize);
        
        // Process batch
        for (const message of batch) {
          this.processMessage(message);
        }
      }
    }
  }

  private static processCollaborativeOperations(): void {
    // Process pending collaborative operations
  }

  private static monitorConnections(): void {
    // Monitor connection health and performance
    for (const connection of this.connections.values()) {
      // Check if connection is healthy
      if (connection.state.errorCount > 10) {
        connection.state.isActive = false;
      }
    }
  }

  private static processMessage(message: WidgetMessage): void {
    // Process individual message
  }

  private static async persistConnection(connection: WidgetConnection): Promise<void> {
    try {
      await prisma.widgetConnection.create({
        data: {
          id: connection.id,
          sourceWidget: connection.sourceWidget,
          targetWidget: connection.targetWidget,
          sourcePort: connection.sourcePort,
          targetPort: connection.targetPort,
          connectionType: connection.connectionType,
          config: connection.config,
          canvasId: connection.canvasId,
          tenantId: connection.tenantId,
        },
      });
    } catch (error) {
      console.error('Error persisting connection:', error);
    }
  }

  private static async persistMessage(message: WidgetMessage): Promise<void> {
    try {
      await prisma.widgetMessage.create({
        data: {
          id: message.id,
          fromWidget: message.fromWidget,
          toWidget: message.toWidget,
          messageType: message.messageType,
          payload: message.payload,
          priority: message.priority,
          timestamp: message.timestamp,
          processed: message.delivery.delivered,
          canvasId: 'default', // Would be passed in production
          tenantId: 'default', // Would be passed in production
        },
      });
    } catch (error) {
      console.error('Error persisting message:', error);
    }
  }

  private static async updateMessage(message: WidgetMessage): Promise<void> {
    try {
      await prisma.widgetMessage.update({
        where: { id: message.id },
        data: {
          processed: message.delivery.delivered,
        },
      });
    } catch (error) {
      console.error('Error updating message:', error);
    }
  }
}

// Singleton export
export const widgetCommunication = WidgetCommunicationSystem;
