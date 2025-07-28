
/**
 * ADVANCED DRAG & DROP SYSTEM
 * Sophisticated drag-and-drop with snap-to-grid, visual guidelines,
 * multi-selection, collision detection, and real-time collaboration
 */

import { eventBus } from '@/lib/event-bus-system';
import { canvasSystem } from '@/lib/canvas-system';
import { WidgetInstance } from '@/lib/widget-registry';

export interface DragDropConfig {
  snapToGrid: boolean;
  gridSize: number;
  showGuidelines: boolean;
  magneticSnap: boolean;
  snapDistance: number;
  collisionDetection: boolean;
  multiSelection: boolean;
  ghostDragging: boolean;
  realTimeSync: boolean;
  animations: {
    enabled: boolean;
    duration: number;
    easing: string;
  };
}

export interface DragState {
  isDragging: boolean;
  draggedItems: string[]; // Widget instance IDs
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
  offset: { x: number; y: number };
  ghostElement?: HTMLElement;
  guidelines: Guideline[];
  snapPoints: SnapPoint[];
  constraints?: DragConstraints;
}

export interface Guideline {
  id: string;
  type: 'vertical' | 'horizontal';
  position: number;
  strength: number; // 0-1, how strong the magnetic snap is
  source: 'grid' | 'widget' | 'canvas';
  sourceId?: string;
  temporary: boolean;
}

export interface SnapPoint {
  id: string;
  x: number;
  y: number;
  type: 'corner' | 'edge' | 'center' | 'grid';
  strength: number;
  source: string;
  magneticRadius: number;
}

export interface DragConstraints {
  bounds?: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  axis?: 'x' | 'y' | 'both';
  preserveAspectRatio?: boolean;
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
}

export interface DropZone {
  id: string;
  element: HTMLElement;
  bounds: DOMRect;
  accepts: string[]; // Widget types or categories
  highlight: boolean;
  onDrop: (items: string[], position: { x: number; y: number }) => Promise<boolean>;
  onDragOver?: (items: string[], position: { x: number; y: number }) => void;
  onDragLeave?: () => void;
}

export interface CollisionInfo {
  widgetId: string;
  bounds: { x: number; y: number; width: number; height: number };
  overlap: { x: number; y: number; width: number; height: number };
  overlapPercentage: number;
}

export class DragDropSystem {
  private static config: DragDropConfig = {
    snapToGrid: true,
    gridSize: 20,
    showGuidelines: true,
    magneticSnap: true,
    snapDistance: 10,
    collisionDetection: true,
    multiSelection: true,
    ghostDragging: true,
    realTimeSync: true,
    animations: {
      enabled: true,
      duration: 200,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  };

  private static dragState: DragState = {
    isDragging: false,
    draggedItems: [],
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    guidelines: [],
    snapPoints: [],
  };

  private static dropZones = new Map<string, DropZone>();
  private static widgets = new Map<string, WidgetInstance>();
  private static canvasElement: HTMLElement | null = null;
  private static guidelineElements: HTMLElement[] = [];

  /**
   * Initialize drag and drop system
   */
  static initialize(canvasElement: HTMLElement, config?: Partial<DragDropConfig>): void {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    this.canvasElement = canvasElement;
    this.setupEventListeners();
    this.createGuidelineContainer();

    console.log('Drag & Drop System initialized');
  }

  /**
   * Make element draggable
   */
  static makeDraggable(
    element: HTMLElement,
    widgetId: string,
    constraints?: DragConstraints
  ): void {
    element.draggable = true;
    element.dataset.widgetId = widgetId;
    element.dataset.draggable = 'true';

    // Store constraints
    if (constraints) {
      element.dataset.constraints = JSON.stringify(constraints);
    }

    // Add drag handle class for styling
    element.classList.add('widget-draggable');
  }

  /**
   * Register drop zone
   */
  static registerDropZone(dropZone: DropZone): void {
    this.dropZones.set(dropZone.id, dropZone);
    dropZone.element.classList.add('drop-zone');
  }

  /**
   * Update widget registry
   */
  static updateWidgets(widgets: WidgetInstance[]): void {
    this.widgets.clear();
    widgets.forEach(widget => {
      this.widgets.set(widget.id, widget);
    });
    
    // Update snap points and guidelines
    this.updateSnapPoints();
    this.updateGuidelines();
  }

  /**
   * Start dragging operation
   */
  static startDrag(
    widgetIds: string[],
    startPosition: { x: number; y: number },
    offset: { x: number; y: number }
  ): void {
    this.dragState = {
      isDragging: true,
      draggedItems: widgetIds,
      startPosition,
      currentPosition: startPosition,
      offset,
      guidelines: [],
      snapPoints: [],
    };

    // Generate guidelines and snap points
    this.generateGuidelines();
    this.generateSnapPoints();

    // Create ghost element if enabled
    if (this.config.ghostDragging) {
      this.createGhostElement();
    }

    // Show guidelines if enabled
    if (this.config.showGuidelines) {
      this.showGuidelines();
    }

    // Publish drag start event
    eventBus.publish({
      type: 'widget.drag.started',
      source: 'drag-drop-system',
      data: {
        widgetIds,
        startPosition,
        userId: 'current-user', // Would be actual user ID
      },
      metadata: { timestamp: new Date() },
    });
  }

  /**
   * Update drag position
   */
  static updateDrag(position: { x: number; y: number }): void {
    if (!this.dragState.isDragging) return;

    let snappedPosition = { ...position };

    // Apply constraints
    snappedPosition = this.applyConstraints(snappedPosition);

    // Apply snapping
    if (this.config.snapToGrid || this.config.magneticSnap) {
      snappedPosition = this.applySnapping(snappedPosition);
    }

    this.dragState.currentPosition = snappedPosition;

    // Update ghost element
    if (this.dragState.ghostElement) {
      this.updateGhostElement(snappedPosition);
    }

    // Update guidelines
    this.updateDynamicGuidelines(snappedPosition);

    // Check collision detection
    if (this.config.collisionDetection) {
      const collisions = this.detectCollisions(snappedPosition);
      this.handleCollisions(collisions);
    }

    // Highlight drop zones
    this.updateDropZoneHighlights(snappedPosition);

    // Publish drag update event
    if (this.config.realTimeSync) {
      eventBus.publish({
        type: 'widget.drag.updated',
        source: 'drag-drop-system',
        data: {
          widgetIds: this.dragState.draggedItems,
          position: snappedPosition,
          userId: 'current-user',
        },
        metadata: { timestamp: new Date() },
      });
    }
  }

  /**
   * End dragging operation
   */
  static endDrag(finalPosition?: { x: number; y: number }): void {
    if (!this.dragState.isDragging) return;

    const position = finalPosition || this.dragState.currentPosition;

    // Apply final snapping
    const snappedPosition = this.applySnapping(position);

    // Check if dropped on valid drop zone
    const dropZone = this.getDropZoneAt(snappedPosition);

    if (dropZone) {
      // Handle drop on drop zone
      this.handleDropZoneDrop(dropZone, snappedPosition);
    } else {
      // Handle regular position update
      this.updateWidgetPositions(snappedPosition);
    }

    // Cleanup
    this.cleanup();

    // Publish drag end event
    eventBus.publish({
      type: 'widget.drag.ended',
      source: 'drag-drop-system',
      data: {
        widgetIds: this.dragState.draggedItems,
        finalPosition: snappedPosition,
        success: true,
        userId: 'current-user',
      },
      metadata: { timestamp: new Date() },
    });

    // Reset drag state
    this.dragState = {
      isDragging: false,
      draggedItems: [],
      startPosition: { x: 0, y: 0 },
      currentPosition: { x: 0, y: 0 },
      offset: { x: 0, y: 0 },
      guidelines: [],
      snapPoints: [],
    };
  }

  /**
   * Cancel dragging operation
   */
  static cancelDrag(): void {
    if (!this.dragState.isDragging) return;

    // Return widgets to original positions
    this.returnToOriginalPositions();

    // Cleanup
    this.cleanup();

    // Publish drag cancel event
    eventBus.publish({
      type: 'widget.drag.cancelled',
      source: 'drag-drop-system',
      data: {
        widgetIds: this.dragState.draggedItems,
        userId: 'current-user',
      },
      metadata: { timestamp: new Date() },
    });

    // Reset drag state
    this.dragState.isDragging = false;
  }

  // Private helper methods
  private static setupEventListeners(): void {
    if (!this.canvasElement) return;

    // Mouse events
    this.canvasElement.addEventListener('dragstart', this.handleDragStart.bind(this));
    this.canvasElement.addEventListener('drag', this.handleDrag.bind(this));
    this.canvasElement.addEventListener('dragend', this.handleDragEnd.bind(this));
    this.canvasElement.addEventListener('dragover', this.handleDragOver.bind(this));
    this.canvasElement.addEventListener('drop', this.handleDrop.bind(this));

    // Touch events for mobile
    this.canvasElement.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvasElement.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.canvasElement.addEventListener('touchend', this.handleTouchEnd.bind(this));

    // Keyboard events
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private static handleDragStart(event: DragEvent): void {
    const target = event.target as HTMLElement;
    const widgetId = target.dataset.widgetId;
    
    if (!widgetId || !target.dataset.draggable) {
      event.preventDefault();
      return;
    }

    const rect = target.getBoundingClientRect();
    const canvasRect = this.canvasElement!.getBoundingClientRect();
    
    const startPosition = {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top,
    };

    const offset = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };

    // Check if part of multi-selection
    const selectedWidgets = this.getSelectedWidgets();
    const draggedWidgets = selectedWidgets.includes(widgetId) ? selectedWidgets : [widgetId];

    this.startDrag(draggedWidgets, startPosition, offset);

    // Set drag data
    event.dataTransfer?.setData('application/widget-ids', JSON.stringify(draggedWidgets));
    event.dataTransfer!.effectAllowed = 'move';
  }

  private static handleDrag(event: DragEvent): void {
    if (!this.dragState.isDragging || event.clientX === 0 && event.clientY === 0) return;

    const canvasRect = this.canvasElement!.getBoundingClientRect();
    const position = {
      x: event.clientX - canvasRect.left - this.dragState.offset.x,
      y: event.clientY - canvasRect.top - this.dragState.offset.y,
    };

    this.updateDrag(position);
  }

  private static handleDragEnd(event: DragEvent): void {
    if (!this.dragState.isDragging) return;

    const canvasRect = this.canvasElement!.getBoundingClientRect();
    const finalPosition = {
      x: event.clientX - canvasRect.left - this.dragState.offset.x,
      y: event.clientY - canvasRect.top - this.dragState.offset.y,
    };

    this.endDrag(finalPosition);
  }

  private static handleDragOver(event: DragEvent): void {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  }

  private static handleDrop(event: DragEvent): void {
    event.preventDefault();
    
    const widgetIds = JSON.parse(
      event.dataTransfer?.getData('application/widget-ids') || '[]'
    );

    if (widgetIds.length === 0) return;

    const canvasRect = this.canvasElement!.getBoundingClientRect();
    const dropPosition = {
      x: event.clientX - canvasRect.left,
      y: event.clientY - canvasRect.top,
    };

    // If not currently dragging, this is an external drop
    if (!this.dragState.isDragging) {
      this.handleExternalDrop(widgetIds, dropPosition);
    }
  }

  private static handleTouchStart(event: TouchEvent): void {
    // Handle touch start for mobile dragging
  }

  private static handleTouchMove(event: TouchEvent): void {
    // Handle touch move for mobile dragging
  }

  private static handleTouchEnd(event: TouchEvent): void {
    // Handle touch end for mobile dragging
  }

  private static handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.dragState.isDragging) {
      this.cancelDrag();
    }
  }

  private static applyConstraints(position: { x: number; y: number }): { x: number; y: number } {
    if (!this.dragState.constraints) return position;

    const constraints = this.dragState.constraints;
    let { x, y } = position;

    // Apply bounds constraints
    if (constraints.bounds) {
      x = Math.max(constraints.bounds.left, Math.min(constraints.bounds.right, x));
      y = Math.max(constraints.bounds.top, Math.min(constraints.bounds.bottom, y));
    }

    // Apply axis constraints
    if (constraints.axis === 'x') {
      y = this.dragState.startPosition.y;
    } else if (constraints.axis === 'y') {
      x = this.dragState.startPosition.x;
    }

    return { x, y };
  }

  private static applySnapping(position: { x: number; y: number }): { x: number; y: number } {
    let { x, y } = position;

    // Grid snapping
    if (this.config.snapToGrid) {
      x = Math.round(x / this.config.gridSize) * this.config.gridSize;
      y = Math.round(y / this.config.gridSize) * this.config.gridSize;
    }

    // Magnetic snapping to guidelines and snap points
    if (this.config.magneticSnap) {
      const snapResult = this.findBestSnapPoint({ x, y });
      if (snapResult) {
        x = snapResult.x;
        y = snapResult.y;
      }
    }

    return { x, y };
  }

  private static findBestSnapPoint(position: { x: number; y: number }): { x: number; y: number } | null {
    let bestSnap: { x: number; y: number; distance: number } | null = null;

    // Check snap points
    for (const snapPoint of this.dragState.snapPoints) {
      const distance = Math.sqrt(
        Math.pow(position.x - snapPoint.x, 2) + Math.pow(position.y - snapPoint.y, 2)
      );

      if (distance <= snapPoint.magneticRadius && (!bestSnap || distance < bestSnap.distance)) {
        bestSnap = {
          x: snapPoint.x,
          y: snapPoint.y,
          distance,
        };
      }
    }

    // Check guidelines
    for (const guideline of this.dragState.guidelines) {
      const distance = guideline.type === 'vertical' 
        ? Math.abs(position.x - guideline.position)
        : Math.abs(position.y - guideline.position);

      if (distance <= this.config.snapDistance) {
        const snapPos = guideline.type === 'vertical'
          ? { x: guideline.position, y: position.y }
          : { x: position.x, y: guideline.position };

        if (!bestSnap || distance < bestSnap.distance) {
          bestSnap = {
            ...snapPos,
            distance,
          };
        }
      }
    }

    return bestSnap;
  }

  private static generateGuidelines(): void {
    this.dragState.guidelines = [];

    // Grid guidelines
    if (this.config.snapToGrid) {
      this.generateGridGuidelines();
    }

    // Widget alignment guidelines
    this.generateWidgetGuidelines();
  }

  private static generateGridGuidelines(): void {
    const canvasRect = this.canvasElement!.getBoundingClientRect();
    const gridSize = this.config.gridSize;

    // Vertical grid lines
    for (let x = 0; x <= canvasRect.width; x += gridSize) {
      this.dragState.guidelines.push({
        id: `grid-v-${x}`,
        type: 'vertical',
        position: x,
        strength: 0.5,
        source: 'grid',
        temporary: false,
      });
    }

    // Horizontal grid lines
    for (let y = 0; y <= canvasRect.height; y += gridSize) {
      this.dragState.guidelines.push({
        id: `grid-h-${y}`,
        type: 'horizontal',
        position: y,
        strength: 0.5,
        source: 'grid',
        temporary: false,
      });
    }
  }

  private static generateWidgetGuidelines(): void {
    // Generate alignment guidelines based on other widgets
    for (const widget of this.widgets.values()) {
      if (this.dragState.draggedItems.includes(widget.id)) continue;

      const { position, size } = widget;

      // Vertical guidelines (left, center, right edges)
      this.dragState.guidelines.push(
        {
          id: `widget-v-left-${widget.id}`,
          type: 'vertical',
          position: position.x,
          strength: 0.8,
          source: 'widget',
          sourceId: widget.id,
          temporary: false,
        },
        {
          id: `widget-v-center-${widget.id}`,
          type: 'vertical',
          position: position.x + size.width / 2,
          strength: 0.9,
          source: 'widget',
          sourceId: widget.id,
          temporary: false,
        },
        {
          id: `widget-v-right-${widget.id}`,
          type: 'vertical',
          position: position.x + size.width,
          strength: 0.8,
          source: 'widget',
          sourceId: widget.id,
          temporary: false,
        }
      );

      // Horizontal guidelines (top, center, bottom edges)
      this.dragState.guidelines.push(
        {
          id: `widget-h-top-${widget.id}`,
          type: 'horizontal',
          position: position.y,
          strength: 0.8,
          source: 'widget',
          sourceId: widget.id,
          temporary: false,
        },
        {
          id: `widget-h-center-${widget.id}`,
          type: 'horizontal',
          position: position.y + size.height / 2,
          strength: 0.9,
          source: 'widget',
          sourceId: widget.id,
          temporary: false,
        },
        {
          id: `widget-h-bottom-${widget.id}`,
          type: 'horizontal',
          position: position.y + size.height,
          strength: 0.8,
          source: 'widget',
          sourceId: widget.id,
          temporary: false,
        }
      );
    }
  }

  private static generateSnapPoints(): void {
    this.dragState.snapPoints = [];

    // Generate snap points from guidelines intersection
    for (const vGuideline of this.dragState.guidelines.filter(g => g.type === 'vertical')) {
      for (const hGuideline of this.dragState.guidelines.filter(g => g.type === 'horizontal')) {
        this.dragState.snapPoints.push({
          id: `intersection-${vGuideline.id}-${hGuideline.id}`,
          x: vGuideline.position,
          y: hGuideline.position,
          type: 'corner',
          strength: (vGuideline.strength + hGuideline.strength) / 2,
          source: `${vGuideline.source}-${hGuideline.source}`,
          magneticRadius: this.config.snapDistance,
        });
      }
    }

    // Add widget corner snap points
    for (const widget of this.widgets.values()) {
      if (this.dragState.draggedItems.includes(widget.id)) continue;

      const { position, size } = widget;
      const corners = [
        { x: position.x, y: position.y }, // Top-left
        { x: position.x + size.width, y: position.y }, // Top-right
        { x: position.x, y: position.y + size.height }, // Bottom-left
        { x: position.x + size.width, y: position.y + size.height }, // Bottom-right
      ];

      corners.forEach((corner, index) => {
        this.dragState.snapPoints.push({
          id: `widget-corner-${widget.id}-${index}`,
          x: corner.x,
          y: corner.y,
          type: 'corner',
          strength: 1,
          source: widget.id,
          magneticRadius: this.config.snapDistance,
        });
      });
    }
  }

  private static updateSnapPoints(): void {
    // Update snap points based on current widget positions
    this.generateSnapPoints();
  }

  private static updateGuidelines(): void {
    // Update guidelines based on current widget positions
    this.generateGuidelines();
  }

  private static updateDynamicGuidelines(position: { x: number; y: number }): void {
    // Remove temporary guidelines
    this.dragState.guidelines = this.dragState.guidelines.filter(g => !g.temporary);

    // Add dynamic guidelines based on current position
    const draggedWidget = this.widgets.get(this.dragState.draggedItems[0]);
    if (!draggedWidget) return;

    // Find widgets that align with current position
    for (const widget of this.widgets.values()) {
      if (this.dragState.draggedItems.includes(widget.id)) continue;

      const tolerance = 5;

      // Check for alignment
      if (Math.abs(position.x - widget.position.x) <= tolerance) {
        // Vertical alignment
        this.dragState.guidelines.push({
          id: `temp-align-v-${widget.id}`,
          type: 'vertical',
          position: widget.position.x,
          strength: 1,
          source: 'widget',
          sourceId: widget.id,
          temporary: true,
        });
      }

      if (Math.abs(position.y - widget.position.y) <= tolerance) {
        // Horizontal alignment
        this.dragState.guidelines.push({
          id: `temp-align-h-${widget.id}`,
          type: 'horizontal',
          position: widget.position.y,
          strength: 1,
          source: 'widget',
          sourceId: widget.id,
          temporary: true,
        });
      }
    }
  }

  private static detectCollisions(position: { x: number; y: number }): CollisionInfo[] {
    const collisions: CollisionInfo[] = [];

    const draggedWidget = this.widgets.get(this.dragState.draggedItems[0]);
    if (!draggedWidget) return collisions;

    const draggedBounds = {
      x: position.x,
      y: position.y,
      width: draggedWidget.size.width,
      height: draggedWidget.size.height,
    };

    for (const widget of this.widgets.values()) {
      if (this.dragState.draggedItems.includes(widget.id)) continue;

      const widgetBounds = {
        x: widget.position.x,
        y: widget.position.y,
        width: widget.size.width,
        height: widget.size.height,
      };

      const overlap = this.calculateOverlap(draggedBounds, widgetBounds);
      if (overlap.width > 0 && overlap.height > 0) {
        const overlapPercentage = 
          (overlap.width * overlap.height) / 
          (draggedBounds.width * draggedBounds.height);

        collisions.push({
          widgetId: widget.id,
          bounds: widgetBounds,
          overlap,
          overlapPercentage,
        });
      }
    }

    return collisions;
  }

  private static calculateOverlap(
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number }
  ): { x: number; y: number; width: number; height: number } {
    const left = Math.max(rect1.x, rect2.x);
    const top = Math.max(rect1.y, rect2.y);
    const right = Math.min(rect1.x + rect1.width, rect2.x + rect2.width);
    const bottom = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);

    return {
      x: left,
      y: top,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top),
    };
  }

  private static handleCollisions(collisions: CollisionInfo[]): void {
    // Handle collision detection and resolution
    for (const collision of collisions) {
      // Add visual feedback for collision
      const element = document.querySelector(`[data-widget-id="${collision.widgetId}"]`) as HTMLElement;
      if (element) {
        element.classList.add('collision-detected');
      }
    }

    // Remove collision class from non-colliding widgets
    for (const widget of this.widgets.values()) {
      if (!collisions.some(c => c.widgetId === widget.id)) {
        const element = document.querySelector(`[data-widget-id="${widget.id}"]`) as HTMLElement;
        if (element) {
          element.classList.remove('collision-detected');
        }
      }
    }
  }

  private static getSelectedWidgets(): string[] {
    // Get currently selected widgets from canvas system
    const canvas = canvasSystem.getCanvas('default'); // Would use actual canvas ID
    return canvas?.selection.selectedWidgets || [];
  }

  private static createGuidelineContainer(): void {
    // Create container for guideline elements
    const container = document.createElement('div');
    container.id = 'guideline-container';
    container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
    `;
    this.canvasElement?.appendChild(container);
  }

  private static showGuidelines(): void {
    this.hideGuidelines(); // Clear existing guidelines

    const container = document.getElementById('guideline-container');
    if (!container) return;

    for (const guideline of this.dragState.guidelines) {
      if (guideline.source === 'grid' && guideline.strength < 0.8) continue;

      const element = document.createElement('div');
      element.className = `guideline guideline-${guideline.type}`;
      element.style.cssText = `
        position: absolute;
        background-color: rgba(0, 123, 255, ${guideline.strength});
        pointer-events: none;
        z-index: 1001;
        ${guideline.type === 'vertical' 
          ? `left: ${guideline.position}px; top: 0; width: 1px; height: 100%;`
          : `top: ${guideline.position}px; left: 0; height: 1px; width: 100%;`
        }
      `;

      container.appendChild(element);
      this.guidelineElements.push(element);
    }
  }

  private static hideGuidelines(): void {
    this.guidelineElements.forEach(element => element.remove());
    this.guidelineElements = [];
  }

  private static createGhostElement(): void {
    // Create ghost element for drag preview
    const draggedElement = document.querySelector(
      `[data-widget-id="${this.dragState.draggedItems[0]}"]`
    ) as HTMLElement;
    
    if (!draggedElement) return;

    const ghost = draggedElement.cloneNode(true) as HTMLElement;
    ghost.style.cssText = `
      position: absolute;
      opacity: 0.5;
      pointer-events: none;
      z-index: 1000;
      transform: scale(0.95);
    `;

    this.canvasElement?.appendChild(ghost);
    this.dragState.ghostElement = ghost;
  }

  private static updateGhostElement(position: { x: number; y: number }): void {
    if (!this.dragState.ghostElement) return;

    this.dragState.ghostElement.style.left = `${position.x}px`;
    this.dragState.ghostElement.style.top = `${position.y}px`;
  }

  private static updateDropZoneHighlights(position: { x: number; y: number }): void {
    // Update drop zone highlighting
    for (const dropZone of this.dropZones.values()) {
      const isOver = this.isPositionOverElement(position, dropZone.element);
      
      if (isOver && !dropZone.highlight) {
        dropZone.highlight = true;
        dropZone.element.classList.add('drop-zone-highlight');
        dropZone.onDragOver?.(this.dragState.draggedItems, position);
      } else if (!isOver && dropZone.highlight) {
        dropZone.highlight = false;
        dropZone.element.classList.remove('drop-zone-highlight');
        dropZone.onDragLeave?.();
      }
    }
  }

  private static isPositionOverElement(position: { x: number; y: number }, element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    const canvasRect = this.canvasElement!.getBoundingClientRect();
    
    const relativeRect = {
      left: rect.left - canvasRect.left,
      top: rect.top - canvasRect.top,
      right: rect.right - canvasRect.left,
      bottom: rect.bottom - canvasRect.top,
    };

    return (
      position.x >= relativeRect.left &&
      position.x <= relativeRect.right &&
      position.y >= relativeRect.top &&
      position.y <= relativeRect.bottom
    );
  }

  private static getDropZoneAt(position: { x: number; y: number }): DropZone | null {
    for (const dropZone of this.dropZones.values()) {
      if (this.isPositionOverElement(position, dropZone.element)) {
        return dropZone;
      }
    }
    return null;
  }

  private static async handleDropZoneDrop(dropZone: DropZone, position: { x: number; y: number }): Promise<void> {
    try {
      const success = await dropZone.onDrop(this.dragState.draggedItems, position);
      if (!success) {
        this.returnToOriginalPositions();
      }
    } catch (error) {
      console.error('Error handling drop zone drop:', error);
      this.returnToOriginalPositions();
    }
  }

  private static updateWidgetPositions(position: { x: number; y: number }): void {
    // Update widget positions in canvas system
    for (const widgetId of this.dragState.draggedItems) {
      const widget = this.widgets.get(widgetId);
      if (widget) {
        // Update widget position
        widget.position.x = position.x;
        widget.position.y = position.y;
        widget.updated = new Date();

        // Update in canvas system
        canvasSystem.updateSelection('default', { widgetIds: [widgetId] }); // Would use actual canvas ID
      }
    }
  }

  private static returnToOriginalPositions(): void {
    // Return widgets to their original positions
    for (const widgetId of this.dragState.draggedItems) {
      const widget = this.widgets.get(widgetId);
      if (widget) {
        // Reset to start position (would need to track original positions)
        const element = document.querySelector(`[data-widget-id="${widgetId}"]`) as HTMLElement;
        if (element) {
          element.style.transform = '';
        }
      }
    }
  }

  private static handleExternalDrop(widgetIds: string[], position: { x: number; y: number }): void {
    // Handle drop from external source (e.g., widget palette)
    eventBus.publish({
      type: 'widget.external.dropped',
      source: 'drag-drop-system',
      data: {
        widgetIds,
        position,
        userId: 'current-user',
      },
      metadata: { timestamp: new Date() },
    });
  }

  private static cleanup(): void {
    // Remove ghost element
    if (this.dragState.ghostElement) {
      this.dragState.ghostElement.remove();
      this.dragState.ghostElement = undefined;
    }

    // Hide guidelines
    this.hideGuidelines();

    // Clear drop zone highlights
    for (const dropZone of this.dropZones.values()) {
      dropZone.highlight = false;
      dropZone.element.classList.remove('drop-zone-highlight');
    }

    // Clear collision highlights
    document.querySelectorAll('.collision-detected').forEach(element => {
      element.classList.remove('collision-detected');
    });
  }
}

// Singleton export
export const dragDropSystem = DragDropSystem;
