
/**
 * CANVAS SYSTEM
 * High-performance infinite canvas with advanced rendering, multi-layer management,
 * virtual scrolling, and sophisticated interaction handling
 */

import { eventBus, WidgetEvents } from '@/lib/event-bus-system';
import { WidgetInstance, WidgetConnection } from '@/lib/widget-registry';
import { prisma } from '@/lib/db';

export interface CanvasState {
  id: string;
  name: string;
  
  // Viewport and transformation
  viewport: {
    x: number;
    y: number;
    zoom: number;
    width: number;
    height: number;
  };
  
  // Grid and snapping
  grid: {
    enabled: boolean;
    size: number;
    snapToGrid: boolean;
    showGrid: boolean;
    color: string;
    opacity: number;
  };
  
  // Layers and rendering
  layers: CanvasLayer[];
  activeLayer: string;
  
  // Selection and manipulation
  selection: {
    selectedWidgets: string[];
    selectionBox?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    multiSelect: boolean;
  };
  
  // Interaction state
  interaction: {
    mode: 'select' | 'pan' | 'zoom' | 'draw' | 'connect';
    isDragging: boolean;
    dragTarget?: string;
    dragOffset?: { x: number; y: number };
    isResizing: boolean;
    resizeHandle?: string;
    isConnecting: boolean;
    connectionStart?: { widgetId: string; port: string };
  };
  
  // Collaboration
  collaboration: {
    userCursors: Map<string, UserCursor>;
    activeSessions: string[];
    lockOwners: Map<string, string>; // widgetId -> userId
  };
  
  // Performance
  performance: {
    renderMode: 'auto' | 'canvas' | 'dom';
    virtualScrolling: boolean;
    levelOfDetail: boolean;
    maxZoom: number;
    minZoom: number;
    renderBounds?: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  
  // Metadata
  created: Date;
  updated: Date;
  createdBy: string;
  tenantId: string;
}

export interface CanvasLayer {
  id: string;
  name: string;
  zIndex: number;
  visible: boolean;
  locked: boolean;
  opacity: number;
  widgets: string[]; // Widget instance IDs
  blendMode?: string;
}

export interface UserCursor {
  userId: string;
  userName: string;
  position: { x: number; y: number };
  color: string;
  lastSeen: Date;
  isActive: boolean;
}

export interface CanvasCommand {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  userId: string;
  canvasId: string;
}

export interface ViewportBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export class CanvasSystem {
  private static canvases = new Map<string, CanvasState>();
  private static commandHistory = new Map<string, CanvasCommand[]>();
  private static redoStack = new Map<string, CanvasCommand[]>();
  private static renderQueue = new Set<string>();
  private static rafId?: number;

  /**
   * Create a new canvas
   */
  static async createCanvas(config: {
    name: string;
    tenantId: string;
    createdBy: string;
    template?: string;
  }): Promise<CanvasState> {
    const canvasId = crypto.randomUUID();
    
    const canvas: CanvasState = {
      id: canvasId,
      name: config.name,
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
        {
          id: 'overlay',
          name: 'Overlay',
          zIndex: 1000,
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
      interaction: {
        mode: 'select',
        isDragging: false,
        isResizing: false,
        isConnecting: false,
      },
      collaboration: {
        userCursors: new Map(),
        activeSessions: [],
        lockOwners: new Map(),
      },
      performance: {
        renderMode: 'auto',
        virtualScrolling: true,
        levelOfDetail: true,
        maxZoom: 10,
        minZoom: 0.1,
      },
      created: new Date(),
      updated: new Date(),
      createdBy: config.createdBy,
      tenantId: config.tenantId,
    };

    // Store canvas
    this.canvases.set(canvasId, canvas);
    this.commandHistory.set(canvasId, []);
    this.redoStack.set(canvasId, []);

    // Persist to database
    await this.persistCanvas(canvas);

    // Publish creation event
    await eventBus.publish({
      type: 'canvas.created',
      source: 'canvas-system',
      data: { canvasId, canvas },
      metadata: {
        tenantId: config.tenantId,
        userId: config.createdBy,
        timestamp: new Date(),
      },
    });

    return canvas;
  }

  /**
   * Get canvas by ID
   */
  static getCanvas(canvasId: string): CanvasState | null {
    return this.canvases.get(canvasId) || null;
  }

  /**
   * Update viewport (pan and zoom)
   */
  static updateViewport(
    canvasId: string,
    viewport: Partial<CanvasState['viewport']>
  ): boolean {
    const canvas = this.canvases.get(canvasId);
    if (!canvas) return false;

    const oldViewport = { ...canvas.viewport };
    canvas.viewport = {
      ...canvas.viewport,
      ...viewport,
    };

    // Clamp zoom to limits
    canvas.viewport.zoom = Math.max(
      canvas.performance.minZoom,
      Math.min(canvas.performance.maxZoom, canvas.viewport.zoom)
    );

    canvas.updated = new Date();

    // Update render bounds for virtual scrolling
    this.updateRenderBounds(canvas);

    // Queue render update
    this.queueRender(canvasId);

    // Publish viewport change event
    eventBus.publish({
      type: 'canvas.viewport_changed',
      source: 'canvas-system',
      target: canvasId,
      data: { 
        oldViewport, 
        newViewport: canvas.viewport,
        renderBounds: canvas.performance.renderBounds 
      },
      metadata: { timestamp: new Date() },
    });

    return true;
  }

  /**
   * Add widget to canvas layer
   */
  static addWidgetToLayer(
    canvasId: string,
    widgetInstanceId: string,
    layerId?: string
  ): boolean {
    const canvas = this.canvases.get(canvasId);
    if (!canvas) return false;

    const targetLayerId = layerId || canvas.activeLayer;
    const layer = canvas.layers.find(l => l.id === targetLayerId);
    if (!layer) return false;

    // Add widget to layer if not already present
    if (!layer.widgets.includes(widgetInstanceId)) {
      layer.widgets.push(widgetInstanceId);
      canvas.updated = new Date();

      // Execute command
      this.executeCommand(canvasId, {
        id: crypto.randomUUID(),
        type: 'add_widget',
        data: { widgetInstanceId, layerId: targetLayerId },
        timestamp: new Date(),
        userId: 'system', // Would be actual user ID
        canvasId,
      });

      this.queueRender(canvasId);
      return true;
    }

    return false;
  }

  /**
   * Remove widget from canvas
   */
  static removeWidgetFromCanvas(canvasId: string, widgetInstanceId: string): boolean {
    const canvas = this.canvases.get(canvasId);
    if (!canvas) return false;

    let removed = false;
    canvas.layers.forEach(layer => {
      const index = layer.widgets.indexOf(widgetInstanceId);
      if (index > -1) {
        layer.widgets.splice(index, 1);
        removed = true;
      }
    });

    if (removed) {
      // Remove from selection
      canvas.selection.selectedWidgets = canvas.selection.selectedWidgets.filter(
        id => id !== widgetInstanceId
      );

      canvas.updated = new Date();

      // Execute command
      this.executeCommand(canvasId, {
        id: crypto.randomUUID(),
        type: 'remove_widget',
        data: { widgetInstanceId },
        timestamp: new Date(),
        userId: 'system',
        canvasId,
      });

      this.queueRender(canvasId);
    }

    return removed;
  }

  /**
   * Update widget selection
   */
  static updateSelection(
    canvasId: string,
    selection: {
      widgetIds?: string[];
      mode?: 'set' | 'add' | 'remove' | 'toggle';
      selectionBox?: { x: number; y: number; width: number; height: number };
    }
  ): boolean {
    const canvas = this.canvases.get(canvasId);
    if (!canvas) return false;

    const oldSelection = [...canvas.selection.selectedWidgets];

    if (selection.widgetIds) {
      switch (selection.mode || 'set') {
        case 'set':
          canvas.selection.selectedWidgets = [...selection.widgetIds];
          break;
        case 'add':
          selection.widgetIds.forEach(id => {
            if (!canvas.selection.selectedWidgets.includes(id)) {
              canvas.selection.selectedWidgets.push(id);
            }
          });
          break;
        case 'remove':
          canvas.selection.selectedWidgets = canvas.selection.selectedWidgets.filter(
            id => !selection.widgetIds!.includes(id)
          );
          break;
        case 'toggle':
          selection.widgetIds.forEach(id => {
            const index = canvas.selection.selectedWidgets.indexOf(id);
            if (index > -1) {
              canvas.selection.selectedWidgets.splice(index, 1);
            } else {
              canvas.selection.selectedWidgets.push(id);
            }
          });
          break;
      }
    }

    canvas.selection.selectionBox = selection.selectionBox;
    canvas.updated = new Date();

    // Publish selection change event
    eventBus.publish({
      type: 'canvas.selection_changed',
      source: 'canvas-system',
      target: canvasId,
      data: { 
        oldSelection, 
        newSelection: canvas.selection.selectedWidgets,
        selectionBox: canvas.selection.selectionBox 
      },
      metadata: { timestamp: new Date() },
    });

    this.queueRender(canvasId);
    return true;
  }

  /**
   * Snap position to grid
   */
  static snapToGrid(canvasId: string, position: { x: number; y: number }): { x: number; y: number } {
    const canvas = this.canvases.get(canvasId);
    if (!canvas || !canvas.grid.enabled || !canvas.grid.snapToGrid) {
      return position;
    }

    const gridSize = canvas.grid.size;
    return {
      x: Math.round(position.x / gridSize) * gridSize,
      y: Math.round(position.y / gridSize) * gridSize,
    };
  }

  /**
   * Convert screen coordinates to canvas coordinates
   */
  static screenToCanvas(
    canvasId: string,
    screenPos: { x: number; y: number }
  ): { x: number; y: number } | null {
    const canvas = this.canvases.get(canvasId);
    if (!canvas) return null;

    const { viewport } = canvas;
    return {
      x: (screenPos.x - viewport.x) / viewport.zoom,
      y: (screenPos.y - viewport.y) / viewport.zoom,
    };
  }

  /**
   * Convert canvas coordinates to screen coordinates
   */
  static canvasToScreen(
    canvasId: string,
    canvasPos: { x: number; y: number }
  ): { x: number; y: number } | null {
    const canvas = this.canvases.get(canvasId);
    if (!canvas) return null;

    const { viewport } = canvas;
    return {
      x: canvasPos.x * viewport.zoom + viewport.x,
      y: canvasPos.y * viewport.zoom + viewport.y,
    };
  }

  /**
   * Get widgets in viewport (for virtual scrolling)
   */
  static getWidgetsInViewport(canvasId: string): string[] {
    const canvas = this.canvases.get(canvasId);
    if (!canvas || !canvas.performance.virtualScrolling) {
      // Return all widgets if virtual scrolling is disabled
      return canvas ? canvas.layers.flatMap(layer => layer.widgets) : [];
    }

    const { renderBounds } = canvas.performance;
    if (!renderBounds) return [];

    // Get visible widgets based on render bounds
    // This would check widget positions against viewport bounds
    // For now, return all widgets (would be optimized in production)
    return canvas.layers
      .filter(layer => layer.visible)
      .flatMap(layer => layer.widgets);
  }

  /**
   * Execute undo operation
   */
  static undo(canvasId: string): boolean {
    const history = this.commandHistory.get(canvasId);
    const redoStack = this.redoStack.get(canvasId);
    
    if (!history || !redoStack || history.length === 0) {
      return false;
    }

    const command = history.pop()!;
    redoStack.push(command);

    // Apply reverse command
    this.applyReverseCommand(canvasId, command);

    // Publish undo event
    eventBus.publish({
      type: 'canvas.undo',
      source: 'canvas-system',
      target: canvasId,
      data: { command },
      metadata: { timestamp: new Date() },
    });

    this.queueRender(canvasId);
    return true;
  }

  /**
   * Execute redo operation
   */
  static redo(canvasId: string): boolean {
    const history = this.commandHistory.get(canvasId);
    const redoStack = this.redoStack.get(canvasId);
    
    if (!history || !redoStack || redoStack.length === 0) {
      return false;
    }

    const command = redoStack.pop()!;
    this.executeCommand(canvasId, command);

    // Publish redo event
    eventBus.publish({
      type: 'canvas.redo',
      source: 'canvas-system',
      target: canvasId,
      data: { command },
      metadata: { timestamp: new Date() },
    });

    this.queueRender(canvasId);
    return true;
  }

  /**
   * Update user cursor position for collaboration
   */
  static updateUserCursor(
    canvasId: string,
    userId: string,
    cursor: Partial<UserCursor>
  ): void {
    const canvas = this.canvases.get(canvasId);
    if (!canvas) return;

    const existingCursor = canvas.collaboration.userCursors.get(userId);
    const updatedCursor: UserCursor = {
      userId,
      userName: cursor.userName || existingCursor?.userName || 'Unknown User',
      position: cursor.position || existingCursor?.position || { x: 0, y: 0 },
      color: cursor.color || existingCursor?.color || '#007bff',
      lastSeen: new Date(),
      isActive: cursor.isActive !== undefined ? cursor.isActive : true,
    };

    canvas.collaboration.userCursors.set(userId, updatedCursor);

    // Publish cursor update event
    eventBus.publish({
      type: 'canvas.cursor_updated',
      source: 'canvas-system',
      target: canvasId,
      data: { userId, cursor: updatedCursor },
      metadata: { timestamp: new Date() },
    });

    // Clean up inactive cursors
    this.cleanupInactiveCursors(canvasId);
  }

  /**
   * Queue canvas for rendering
   */
  private static queueRender(canvasId: string): void {
    this.renderQueue.add(canvasId);
    
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => {
        this.processRenderQueue();
        this.rafId = undefined;
      });
    }
  }

  /**
   * Process render queue
   */
  private static processRenderQueue(): void {
    for (const canvasId of this.renderQueue) {
      this.renderCanvas(canvasId);
    }
    this.renderQueue.clear();
  }

  /**
   * Render canvas (would trigger React re-renders)
   */
  private static renderCanvas(canvasId: string): void {
    // Publish render event to trigger React component updates
    eventBus.publish({
      type: 'canvas.render_requested',
      source: 'canvas-system',
      target: canvasId,
      data: { canvasId },
      metadata: { timestamp: new Date() },
    });
  }

  /**
   * Update render bounds for virtual scrolling
   */
  private static updateRenderBounds(canvas: CanvasState): void {
    if (!canvas.performance.virtualScrolling) return;

    const { viewport } = canvas;
    const padding = 200; // Render padding around viewport

    canvas.performance.renderBounds = {
      x: -viewport.x / viewport.zoom - padding,
      y: -viewport.y / viewport.zoom - padding,
      width: viewport.width / viewport.zoom + padding * 2,
      height: viewport.height / viewport.zoom + padding * 2,
    };
  }

  /**
   * Execute command and add to history
   */
  private static executeCommand(canvasId: string, command: CanvasCommand): void {
    const history = this.commandHistory.get(canvasId);
    if (!history) return;

    // Clear redo stack when new command is executed
    this.redoStack.set(canvasId, []);
    
    // Add to history
    history.push(command);
    
    // Limit history size
    if (history.length > 100) {
      history.shift();
    }

    // Apply command
    this.applyCommand(canvasId, command);
  }

  /**
   * Apply command to canvas
   */
  private static applyCommand(canvasId: string, command: CanvasCommand): void {
    // Implementation would handle different command types
    switch (command.type) {
      case 'add_widget':
        // Command already applied in addWidgetToLayer
        break;
      case 'remove_widget':
        // Command already applied in removeWidgetFromCanvas
        break;
      case 'move_widget':
        // Handle widget movement
        break;
      case 'resize_widget':
        // Handle widget resizing
        break;
      // Add more command types as needed
    }
  }

  /**
   * Apply reverse command for undo
   */
  private static applyReverseCommand(canvasId: string, command: CanvasCommand): void {
    // Implementation would handle reversing different command types
    switch (command.type) {
      case 'add_widget':
        this.removeWidgetFromCanvas(canvasId, command.data.widgetInstanceId);
        break;
      case 'remove_widget':
        this.addWidgetToLayer(canvasId, command.data.widgetInstanceId, command.data.layerId);
        break;
      // Add more reverse command handlers
    }
  }

  /**
   * Clean up inactive user cursors
   */
  private static cleanupInactiveCursors(canvasId: string): void {
    const canvas = this.canvases.get(canvasId);
    if (!canvas) return;

    const cutoffTime = new Date(Date.now() - 30000); // 30 seconds

    for (const [userId, cursor] of canvas.collaboration.userCursors) {
      if (cursor.lastSeen < cutoffTime) {
        canvas.collaboration.userCursors.delete(userId);
      }
    }
  }

  /**
   * Persist canvas to database
   */
  private static async persistCanvas(canvas: CanvasState): Promise<void> {
    try {
      await prisma.canvas.upsert({
        where: { id: canvas.id },
        update: {
          name: canvas.name,
          viewport: canvas.viewport as any,
          grid: canvas.grid as any,
          layers: canvas.layers as any,
          activeLayer: canvas.activeLayer,
          performance: canvas.performance as any,
          updatedAt: canvas.updated,
        },
        create: {
          id: canvas.id,
          name: canvas.name,
          viewport: canvas.viewport as any,
          grid: canvas.grid as any,
          layers: canvas.layers as any,
          activeLayer: canvas.activeLayer,
          performance: canvas.performance as any,
          createdBy: canvas.createdBy,
          tenantId: canvas.tenantId,
          createdAt: canvas.created,
          updatedAt: canvas.updated,
        },
      });
    } catch (error) {
      console.error('Error persisting canvas:', error);
    }
  }
}

// Singleton export
export const canvasSystem = CanvasSystem;
