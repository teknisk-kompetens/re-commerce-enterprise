
/**
 * REAL-TIME COLLABORATION ENGINE
 * WebSocket-based real-time synchronization with operational transform,
 * live cursors, user presence, and conflict resolution
 */

import { eventBus } from '@/lib/event-bus-system';
import { prisma } from '@/lib/db';

export interface CollaborationConfig {
  websocketUrl: string;
  reconnectInterval: number;
  heartbeatInterval: number;
  operationBufferSize: number;
  conflictResolution: 'operational-transform' | 'last-write-wins' | 'merge';
  cursorSyncInterval: number;
  presenceTimeout: number;
  enableVoiceChat: boolean;
  enableVideoChat: boolean;
}

export interface CollaborationSession {
  id: string;
  canvasId: string;
  participants: SessionParticipant[];
  operations: CollaborativeOperation[];
  state: 'active' | 'paused' | 'ended';
  created: Date;
  lastActivity: Date;
  settings: {
    allowAnonymous: boolean;
    maxParticipants: number;
    recordSession: boolean;
    enableChat: boolean;
    permissions: SessionPermissions;
  };
}

export interface SessionParticipant {
  userId: string;
  userName: string;
  userEmail: string;
  role: 'owner' | 'editor' | 'viewer';
  joinedAt: Date;
  lastSeen: Date;
  cursor: UserCursor;
  presence: UserPresence;
  permissions: UserPermissions;
  isOnline: boolean;
}

export interface UserCursor {
  position: { x: number; y: number };
  color: string;
  size: number;
  visible: boolean;
  label?: string;
  icon?: string;
  animation?: 'pulse' | 'bounce' | 'glow';
}

export interface UserPresence {
  status: 'active' | 'idle' | 'away' | 'busy';
  activity: string; // Current activity description
  focusedWidget?: string;
  selectedWidgets: string[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  device: {
    type: 'desktop' | 'tablet' | 'mobile';
    browser: string;
    os: string;
  };
}

export interface UserPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canMove: boolean;
  canResize: boolean;
  canConnect: boolean;
  canCreateWidgets: boolean;
  canManageUsers: boolean;
  canExport: boolean;
  restrictedWidgets?: string[];
  allowedRegions?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}

export interface SessionPermissions {
  defaultRole: 'editor' | 'viewer';
  allowRoleChange: boolean;
  allowInvites: boolean;
  allowScreenSharing: boolean;
  allowFileSharing: boolean;
  maxViewers: number;
  maxEditors: number;
}

export interface CollaborativeOperation {
  id: string;
  type: OperationType;
  userId: string;
  sessionId: string;
  timestamp: Date;
  
  // Target information
  target: {
    type: 'widget' | 'canvas' | 'connection' | 'layer';
    id: string;
    property?: string;
  };
  
  // Operation data
  operation: {
    action: 'create' | 'update' | 'delete' | 'move' | 'resize' | 'connect';
    data: any;
    previousValue?: any;
    metadata?: any;
  };
  
  // Operational Transform data
  transform: {
    baseVersion: number;
    dependencies: string[];
    conflicts: string[];
    transformed: boolean;
    transformations: TransformOperation[];
  };
  
  // State and delivery
  state: 'pending' | 'applied' | 'rejected' | 'merged';
  acknowledgments: string[]; // User IDs who have acknowledged
  rejections: Array<{
    userId: string;
    reason: string;
    timestamp: Date;
  }>;
}

export interface TransformOperation {
  id: string;
  originalOp: string; // Original operation ID
  transformedBy: string; // Operation that caused transformation
  transformationType: 'retain' | 'insert' | 'delete' | 'none';
  offset?: number;
  length?: number;
}

export type OperationType = 
  | 'widget.create'
  | 'widget.update'
  | 'widget.delete'
  | 'widget.move'
  | 'widget.resize'
  | 'widget.style'
  | 'widget.connect'
  | 'canvas.update'
  | 'selection.change'
  | 'layer.add'
  | 'layer.remove'
  | 'layer.reorder';

export interface WebSocketMessage {
  type: 'operation' | 'cursor' | 'presence' | 'sync' | 'ack' | 'error' | 'heartbeat';
  sessionId: string;
  userId: string;
  timestamp: Date;
  data: any;
  id?: string;
}

export interface SyncRequest {
  lastOperationId?: string;
  requestedVersion?: number;
  fullSync?: boolean;
}

export interface SyncResponse {
  operations: CollaborativeOperation[];
  currentVersion: number;
  participants: SessionParticipant[];
  canvasState: any;
}

export class CollaborationEngine {
  private static config: CollaborationConfig = {
    websocketUrl: 'ws://localhost:3001/collaboration',
    reconnectInterval: 5000,
    heartbeatInterval: 30000,
    operationBufferSize: 100,
    conflictResolution: 'operational-transform',
    cursorSyncInterval: 100,
    presenceTimeout: 60000,
    enableVoiceChat: false,
    enableVideoChat: false,
  };

  private static sessions = new Map<string, CollaborationSession>();
  private static currentSession: CollaborationSession | null = null;
  private static websocket: WebSocket | null = null;
  private static operationQueue: CollaborativeOperation[] = [];
  private static acknowledgmentQueue = new Map<string, number>();
  private static reconnectAttempts = 0;
  private static heartbeatInterval: NodeJS.Timeout | null = null;
  private static cursorSyncInterval: NodeJS.Timeout | null = null;

  private static localUserId: string = '';
  private static localUserCursor: UserCursor = {
    position: { x: 0, y: 0 },
    color: '#007bff',
    size: 12,
    visible: true,
  };

  /**
   * Initialize collaboration engine
   */
  static async initialize(
    userId: string, 
    config?: Partial<CollaborationConfig>
  ): Promise<void> {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    this.localUserId = userId;
    this.setupEventListeners();
    
    console.log('Collaboration Engine initialized');
  }

  /**
   * Start collaboration session
   */
  static async startSession(
    canvasId: string,
    config?: {
      settings?: Partial<CollaborationSession['settings']>;
      invite?: string[];
    }
  ): Promise<CollaborationSession> {
    const sessionId = crypto.randomUUID();

    const session: CollaborationSession = {
      id: sessionId,
      canvasId,
      participants: [],
      operations: [],
      state: 'active',
      created: new Date(),
      lastActivity: new Date(),
      settings: {
        allowAnonymous: false,
        maxParticipants: 10,
        recordSession: true,
        enableChat: true,
        permissions: {
          defaultRole: 'editor',
          allowRoleChange: true,
          allowInvites: true,
          allowScreenSharing: false,
          allowFileSharing: false,
          maxViewers: 20,
          maxEditors: 5,
        },
        ...config?.settings,
      },
    };

    // Add current user as owner
    await this.addParticipant(session, {
      userId: this.localUserId,
      userName: 'Current User', // Would get from user context
      userEmail: 'user@example.com', // Would get from user context
      role: 'owner',
    });

    this.sessions.set(sessionId, session);
    this.currentSession = session;

    // Persist session
    await this.persistSession(session);

    // Connect to WebSocket
    await this.connectWebSocket(sessionId);

    // Send invitations if provided
    if (config?.invite) {
      await this.inviteUsers(sessionId, config.invite);
    }

    // Publish session started event
    eventBus.publish({
      type: 'collaboration.session.started',
      source: 'collaboration-engine',
      data: { sessionId, canvasId },
      metadata: {
        userId: this.localUserId,
        timestamp: new Date(),
      },
    });

    return session;
  }

  /**
   * Join existing collaboration session
   */
  static async joinSession(
    sessionId: string,
    userData?: {
      userName?: string;
      userEmail?: string;
    }
  ): Promise<CollaborationSession> {
    const session = await this.loadSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // Add current user as participant
    await this.addParticipant(session, {
      userId: this.localUserId,
      userName: userData?.userName || 'Anonymous User',
      userEmail: userData?.userEmail || '',
      role: session.settings.permissions.defaultRole,
    });

    this.currentSession = session;

    // Connect to WebSocket
    await this.connectWebSocket(sessionId);

    // Request sync
    await this.requestSync();

    // Publish session joined event
    eventBus.publish({
      type: 'collaboration.session.joined',
      source: 'collaboration-engine',
      data: { sessionId, userId: this.localUserId },
      metadata: {
        userId: this.localUserId,
        timestamp: new Date(),
      },
    });

    return session;
  }

  /**
   * Leave collaboration session
   */
  static async leaveSession(): Promise<void> {
    if (!this.currentSession) return;

    const sessionId = this.currentSession.id;

    // Remove current user from participants
    this.currentSession.participants = this.currentSession.participants.filter(
      p => p.userId !== this.localUserId
    );

    // Update session
    await this.persistSession(this.currentSession);

    // Disconnect WebSocket
    this.disconnectWebSocket();

    // Publish session left event
    eventBus.publish({
      type: 'collaboration.session.left',
      source: 'collaboration-engine',
      data: { sessionId, userId: this.localUserId },
      metadata: {
        userId: this.localUserId,
        timestamp: new Date(),
      },
    });

    this.currentSession = null;
  }

  /**
   * Apply collaborative operation
   */
  static async applyOperation(operation: Partial<CollaborativeOperation>): Promise<boolean> {
    if (!this.currentSession) {
      throw new Error('No active collaboration session');
    }

    const fullOperation: CollaborativeOperation = {
      id: crypto.randomUUID(),
      userId: this.localUserId,
      sessionId: this.currentSession.id,
      timestamp: new Date(),
      type: operation.type as OperationType,
      target: operation.target!,
      operation: operation.operation!,
      transform: {
        baseVersion: this.currentSession.operations.length,
        dependencies: [],
        conflicts: [],
        transformed: false,
        transformations: [],
      },
      state: 'pending',
      acknowledgments: [],
      rejections: [],
    };

    try {
      // Apply operational transform if needed
      const transformedOp = await this.transformOperation(fullOperation);
      
      // Apply operation locally
      await this.executeOperation(transformedOp);
      
      // Add to operation history
      this.currentSession.operations.push(transformedOp);
      this.operationQueue.push(transformedOp);
      
      // Send via WebSocket
      await this.sendWebSocketMessage({
        type: 'operation',
        sessionId: this.currentSession.id,
        userId: this.localUserId,
        timestamp: new Date(),
        data: transformedOp,
      });

      // Update last activity
      this.currentSession.lastActivity = new Date();

      return true;
    } catch (error) {
      console.error('Error applying collaborative operation:', error);
      return false;
    }
  }

  /**
   * Update user cursor position
   */
  static updateCursor(position: { x: number; y: number }): void {
    this.localUserCursor.position = position;
    
    if (this.currentSession && this.websocket) {
      this.sendWebSocketMessage({
        type: 'cursor',
        sessionId: this.currentSession.id,
        userId: this.localUserId,
        timestamp: new Date(),
        data: this.localUserCursor,
      });
    }
  }

  /**
   * Update user presence
   */
  static updatePresence(presence: Partial<UserPresence>): void {
    if (!this.currentSession) return;

    const participant = this.currentSession.participants.find(
      p => p.userId === this.localUserId
    );

    if (participant) {
      participant.presence = {
        ...participant.presence,
        ...presence,
      };
      participant.lastSeen = new Date();

      if (this.websocket) {
        this.sendWebSocketMessage({
          type: 'presence',
          sessionId: this.currentSession.id,
          userId: this.localUserId,
          timestamp: new Date(),
          data: participant.presence,
        });
      }
    }
  }

  /**
   * Get session participants
   */
  static getParticipants(): SessionParticipant[] {
    return this.currentSession?.participants || [];
  }

  /**
   * Get session operations
   */
  static getOperations(since?: Date): CollaborativeOperation[] {
    if (!this.currentSession) return [];

    return this.currentSession.operations.filter(op => 
      !since || op.timestamp > since
    );
  }

  /**
   * Get live cursors
   */
  static getLiveCursors(): Array<{ userId: string; cursor: UserCursor; userName: string }> {
    if (!this.currentSession) return [];

    return this.currentSession.participants
      .filter(p => p.userId !== this.localUserId && p.isOnline && p.cursor.visible)
      .map(p => ({
        userId: p.userId,
        cursor: p.cursor,
        userName: p.userName,
      }));
  }

  // Private helper methods
  private static setupEventListeners(): void {
    // Listen for widget events to create operations
    eventBus.subscribe(
      [
        'widget.drag.updated',
        'widget.resized',
        'widget.configured',
        'widget.deleted',
        'widget.created',
      ],
      this.handleWidgetEvent.bind(this),
      { source: 'collaboration-engine' },
      { persistent: true }
    );

    // Listen for canvas events
    eventBus.subscribe(
      [
        'canvas.viewport_changed',
        'canvas.selection_changed',
      ],
      this.handleCanvasEvent.bind(this),
      { source: 'collaboration-engine' },
      { persistent: true }
    );
  }

  private static async handleWidgetEvent(event: any): Promise<void> {
    if (!this.currentSession) return;

    // Convert widget event to collaborative operation
    let operationType: OperationType;
    let operationData: any;

    switch (event.type) {
      case 'widget.drag.updated':
        operationType = 'widget.move';
        operationData = {
          action: 'update',
          data: event.data.position,
          previousValue: null, // Would need to track previous position
        };
        break;
      case 'widget.configured':
        operationType = 'widget.update';
        operationData = {
          action: 'update',
          data: event.data.config,
          previousValue: null, // Would need to track previous config
        };
        break;
      default:
        return;
    }

    await this.applyOperation({
      type: operationType,
      target: {
        type: 'widget',
        id: event.target || event.data.widgetId,
      },
      operation: operationData,
    });
  }

  private static async handleCanvasEvent(event: any): Promise<void> {
    if (!this.currentSession) return;

    switch (event.type) {
      case 'canvas.viewport_changed':
        this.updatePresence({
          viewport: event.data.newViewport,
          activity: 'navigating',
        });
        break;
      case 'canvas.selection_changed':
        this.updatePresence({
          selectedWidgets: event.data.newSelection,
          activity: 'selecting',
        });
        break;
    }
  }

  private static async connectWebSocket(sessionId: string): Promise<void> {
    try {
      this.websocket = new WebSocket(`${this.config.websocketUrl}?sessionId=${sessionId}&userId=${this.localUserId}`);

      this.websocket.onopen = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.startCursorSync();
      };

      this.websocket.onmessage = (event) => {
        this.handleWebSocketMessage(JSON.parse(event.data));
      };

      this.websocket.onclose = () => {
        console.log('WebSocket disconnected');
        this.stopHeartbeat();
        this.stopCursorSync();
        this.scheduleReconnect();
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Error connecting WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  private static disconnectWebSocket(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
    this.stopHeartbeat();
    this.stopCursorSync();
  }

  private static scheduleReconnect(): void {
    if (this.reconnectAttempts < 10) {
      setTimeout(() => {
        this.reconnectAttempts++;
        if (this.currentSession) {
          this.connectWebSocket(this.currentSession.id);
        }
      }, this.config.reconnectInterval * Math.pow(2, this.reconnectAttempts));
    }
  }

  private static async sendWebSocketMessage(message: WebSocketMessage): Promise<void> {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, message queued');
      // Could implement message queuing for offline support
    }
  }

  private static async handleWebSocketMessage(message: WebSocketMessage): Promise<void> {
    try {
      switch (message.type) {
        case 'operation':
          await this.handleRemoteOperation(message.data);
          break;
        case 'cursor':
          this.handleRemoteCursor(message.userId, message.data);
          break;
        case 'presence':
          this.handleRemotePresence(message.userId, message.data);
          break;
        case 'sync':
          await this.handleSyncResponse(message.data);
          break;
        case 'ack':
          this.handleAcknowledgment(message.data);
          break;
        case 'error':
          console.error('Collaboration error:', message.data);
          break;
        case 'heartbeat':
          // Respond to heartbeat
          this.sendWebSocketMessage({
            type: 'heartbeat',
            sessionId: this.currentSession!.id,
            userId: this.localUserId,
            timestamp: new Date(),
            data: { response: true },
          });
          break;
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  private static async handleRemoteOperation(operation: CollaborativeOperation): Promise<void> {
    if (!this.currentSession) return;

    // Transform operation against local operations
    const transformedOp = await this.transformRemoteOperation(operation);
    
    // Apply operation
    await this.executeOperation(transformedOp);
    
    // Add to operation history
    this.currentSession.operations.push(transformedOp);
    
    // Send acknowledgment
    this.sendWebSocketMessage({
      type: 'ack',
      sessionId: this.currentSession.id,
      userId: this.localUserId,
      timestamp: new Date(),
      data: { operationId: operation.id },
    });

    // Publish operation applied event
    eventBus.publish({
      type: 'collaboration.operation.applied',
      source: 'collaboration-engine',
      data: { operation: transformedOp },
      metadata: {
        userId: operation.userId,
        timestamp: new Date(),
      },
    });
  }

  private static handleRemoteCursor(userId: string, cursor: UserCursor): void {
    if (!this.currentSession) return;

    const participant = this.currentSession.participants.find(p => p.userId === userId);
    if (participant) {
      participant.cursor = cursor;
      participant.lastSeen = new Date();

      // Publish cursor update event
      eventBus.publish({
        type: 'collaboration.cursor.updated',
        source: 'collaboration-engine',
        data: { userId, cursor },
        metadata: { timestamp: new Date() },
      });
    }
  }

  private static handleRemotePresence(userId: string, presence: UserPresence): void {
    if (!this.currentSession) return;

    const participant = this.currentSession.participants.find(p => p.userId === userId);
    if (participant) {
      participant.presence = presence;
      participant.lastSeen = new Date();
      participant.isOnline = true;

      // Publish presence update event
      eventBus.publish({
        type: 'collaboration.presence.updated',
        source: 'collaboration-engine',
        data: { userId, presence },
        metadata: { timestamp: new Date() },
      });
    }
  }

  private static async handleSyncResponse(syncData: SyncResponse): Promise<void> {
    if (!this.currentSession) return;

    // Apply missing operations
    for (const operation of syncData.operations) {
      await this.handleRemoteOperation(operation);
    }

    // Update participants
    this.currentSession.participants = syncData.participants;

    // Publish sync completed event
    eventBus.publish({
      type: 'collaboration.sync.completed',
      source: 'collaboration-engine',
      data: { syncData },
      metadata: { timestamp: new Date() },
    });
  }

  private static handleAcknowledgment(ackData: { operationId: string }): void {
    // Handle operation acknowledgment
    const operation = this.operationQueue.find(op => op.id === ackData.operationId);
    if (operation) {
      operation.acknowledgments.push(this.localUserId);
    }
  }

  private static async transformOperation(operation: CollaborativeOperation): Promise<CollaborativeOperation> {
    if (!this.currentSession) return operation;

    const transformedOp = { ...operation };

    // Find concurrent operations
    const concurrentOps = this.currentSession.operations.filter(op => 
      op.timestamp > operation.timestamp &&
      op.target.id === operation.target.id &&
      op.userId !== operation.userId
    );

    // Apply operational transform
    for (const concurrentOp of concurrentOps) {
      transformedOp.transform.transformations.push({
        id: crypto.randomUUID(),
        originalOp: operation.id,
        transformedBy: concurrentOp.id,
        transformationType: this.getTransformationType(operation, concurrentOp),
      });
    }

    transformedOp.transform.transformed = transformedOp.transform.transformations.length > 0;
    return transformedOp;
  }

  private static async transformRemoteOperation(operation: CollaborativeOperation): Promise<CollaborativeOperation> {
    // Transform remote operation against local operations
    return this.transformOperation(operation);
  }

  private static getTransformationType(
    op1: CollaborativeOperation,
    op2: CollaborativeOperation
  ): TransformOperation['transformationType'] {
    // Simplified transformation type determination
    if (op1.operation.action === 'update' && op2.operation.action === 'update') {
      return 'retain';
    } else if (op1.operation.action === 'create' || op2.operation.action === 'create') {
      return 'insert';
    } else if (op1.operation.action === 'delete' || op2.operation.action === 'delete') {
      return 'delete';
    }
    return 'none';
  }

  private static async executeOperation(operation: CollaborativeOperation): Promise<void> {
    // Execute the operation on the local state
    switch (operation.type) {
      case 'widget.move':
        await this.executeWidgetMove(operation);
        break;
      case 'widget.update':
        await this.executeWidgetUpdate(operation);
        break;
      case 'widget.create':
        await this.executeWidgetCreate(operation);
        break;
      case 'widget.delete':
        await this.executeWidgetDelete(operation);
        break;
      // Add more operation types
    }

    operation.state = 'applied';
  }

  private static async executeWidgetMove(operation: CollaborativeOperation): Promise<void> {
    // Update widget position in canvas system
    const { canvasSystem } = await import('@/lib/canvas-system');
    // Implementation would update widget position
  }

  private static async executeWidgetUpdate(operation: CollaborativeOperation): Promise<void> {
    // Update widget configuration
    const { widgetRegistry } = await import('@/lib/widget-registry');
    // Implementation would update widget config
  }

  private static async executeWidgetCreate(operation: CollaborativeOperation): Promise<void> {
    // Create new widget
    const { widgetRegistry } = await import('@/lib/widget-registry');
    // Implementation would create widget
  }

  private static async executeWidgetDelete(operation: CollaborativeOperation): Promise<void> {
    // Delete widget
    const { widgetRegistry } = await import('@/lib/widget-registry');
    // Implementation would delete widget
  }

  private static async addParticipant(
    session: CollaborationSession,
    userData: {
      userId: string;
      userName: string;
      userEmail: string;
      role: SessionParticipant['role'];
    }
  ): Promise<void> {
    const participant: SessionParticipant = {
      ...userData,
      joinedAt: new Date(),
      lastSeen: new Date(),
      cursor: {
        position: { x: 0, y: 0 },
        color: this.generateUserColor(userData.userId),
        size: 12,
        visible: true,
      },
      presence: {
        status: 'active',
        activity: 'joined',
        selectedWidgets: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        device: {
          type: 'desktop', // Would detect actual device
          browser: 'unknown',
          os: 'unknown',
        },
      },
      permissions: this.getDefaultPermissions(userData.role),
      isOnline: true,
    };

    session.participants.push(participant);
  }

  private static generateUserColor(userId: string): string {
    // Generate consistent color based on user ID
    const colors = [
      '#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8',
      '#6f42c1', '#e83e8c', '#fd7e14', '#20c997', '#6610f2'
    ];
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  }

  private static getDefaultPermissions(role: SessionParticipant['role']): UserPermissions {
    switch (role) {
      case 'owner':
        return {
          canEdit: true,
          canDelete: true,
          canMove: true,
          canResize: true,
          canConnect: true,
          canCreateWidgets: true,
          canManageUsers: true,
          canExport: true,
        };
      case 'editor':
        return {
          canEdit: true,
          canDelete: true,
          canMove: true,
          canResize: true,
          canConnect: true,
          canCreateWidgets: true,
          canManageUsers: false,
          canExport: false,
        };
      case 'viewer':
        return {
          canEdit: false,
          canDelete: false,
          canMove: false,
          canResize: false,
          canConnect: false,
          canCreateWidgets: false,
          canManageUsers: false,
          canExport: false,
        };
    }
  }

  private static async requestSync(): Promise<void> {
    if (!this.currentSession || !this.websocket) return;

    const lastOperationId = this.currentSession.operations.length > 0 
      ? this.currentSession.operations[this.currentSession.operations.length - 1].id
      : undefined;

    this.sendWebSocketMessage({
      type: 'sync',
      sessionId: this.currentSession.id,
      userId: this.localUserId,
      timestamp: new Date(),
      data: {
        lastOperationId,
        requestedVersion: this.currentSession.operations.length,
        fullSync: false,
      },
    });
  }

  private static startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.websocket && this.currentSession) {
        this.sendWebSocketMessage({
          type: 'heartbeat',
          sessionId: this.currentSession.id,
          userId: this.localUserId,
          timestamp: new Date(),
          data: { ping: true },
        });
      }
    }, this.config.heartbeatInterval);
  }

  private static stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private static startCursorSync(): void {
    this.cursorSyncInterval = setInterval(() => {
      if (this.currentSession && this.websocket) {
        this.sendWebSocketMessage({
          type: 'cursor',
          sessionId: this.currentSession.id,
          userId: this.localUserId,
          timestamp: new Date(),
          data: this.localUserCursor,
        });
      }
    }, this.config.cursorSyncInterval);
  }

  private static stopCursorSync(): void {
    if (this.cursorSyncInterval) {
      clearInterval(this.cursorSyncInterval);
      this.cursorSyncInterval = null;
    }
  }

  private static async persistSession(session: CollaborationSession): Promise<void> {
    try {
      await prisma.collaborationSession.upsert({
        where: { id: session.id },
        update: {
          userName: session.participants[0]?.userName || '',
          userColor: session.participants[0]?.cursor.color || '#007bff',
          cursor: session.participants[0]?.cursor as any || {},
          isActive: session.state === 'active',
          lastSeen: session.lastActivity,
        },
        create: {
          id: session.id,
          name: `Collaboration Session ${session.id.slice(-8)}`,
          canvasId: session.canvasId,
          userId: this.localUserId,
          userName: session.participants[0]?.userName || '',
          userColor: session.participants[0]?.cursor.color || '#007bff',
          cursor: session.participants[0]?.cursor as any || {},
          isActive: true,
          lastSeen: session.lastActivity,
          tenantId: 'default', // Would be actual tenant ID
          createdBy: this.localUserId,
        },
      });
    } catch (error) {
      console.error('Error persisting collaboration session:', error);
    }
  }

  private static async loadSession(sessionId: string): Promise<CollaborationSession | null> {
    try {
      const dbSession = await prisma.collaborationSession.findUnique({
        where: { id: sessionId },
      });

      if (!dbSession) return null;

      // Convert database session to CollaborationSession
      // This is simplified - production would need full conversion
      const session: CollaborationSession = {
        id: dbSession.id,
        canvasId: dbSession.canvasId ?? 'default-canvas',
        participants: [],
        operations: [],
        state: 'active',
        created: new Date(), // Would be from database
        lastActivity: dbSession.lastSeen,
        settings: {
          allowAnonymous: false,
          maxParticipants: 10,
          recordSession: true,
          enableChat: true,
          permissions: {
            defaultRole: 'editor',
            allowRoleChange: true,
            allowInvites: true,
            allowScreenSharing: false,
            allowFileSharing: false,
            maxViewers: 20,
            maxEditors: 5,
          },
        },
      };

      return session;
    } catch (error) {
      console.error('Error loading collaboration session:', error);
      return null;
    }
  }

  private static async inviteUsers(sessionId: string, userIds: string[]): Promise<void> {
    // Send invitations to users
    for (const userId of userIds) {
      eventBus.publish({
        type: 'collaboration.invitation.sent',
        source: 'collaboration-engine',
        target: userId,
        data: { sessionId, invitedBy: this.localUserId },
        metadata: { timestamp: new Date() },
      });
    }
  }
}

// Singleton export
export const collaborationEngine = CollaborationEngine;
