
'use client';

/**
 * WIDGET CANVAS
 * High-performance infinite canvas with drag-and-drop, real-time collaboration,
 * and advanced rendering capabilities
 */

import { forwardRef, useEffect, useRef, useState, useCallback, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Import systems
import { canvasSystem } from '@/lib/canvas-system';
import { dragDropSystem } from '@/lib/drag-drop-system';
import { collaborationEngine } from '@/lib/collaboration-engine';
import { eventBus } from '@/lib/event-bus-system';

interface WidgetCanvasProps {
  canvasId: string;
  showGrid: boolean;
  snapToGrid: boolean;
  zoom: number;
  selectedWidgets: string[];
  onSelectionChange: (widgetIds: string[]) => void;
  onZoomChange: (zoom: number) => void;
  className?: string;
}

interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
  width: number;
  height: number;
}

interface LiveCursor {
  userId: string;
  userName: string;
  position: { x: number; y: number };
  color: string;
  visible: boolean;
}

export const WidgetCanvas = forwardRef<HTMLDivElement, WidgetCanvasProps>(
  ({ 
    canvasId, 
    showGrid, 
    snapToGrid, 
    zoom, 
    selectedWidgets,
    onSelectionChange,
    onZoomChange,
    className 
  }, ref) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [viewport, setViewport] = useState<CanvasViewport>({
      x: 0,
      y: 0,
      zoom: 1,
      width: 0,
      height: 0,
    });
    
    const [widgets, setWidgets] = useState<any[]>([]);
    const [liveCursors, setLiveCursors] = useState<LiveCursor[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isPanning, setPanning] = useState(false);
    const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

    // Expose canvas ref
    useImperativeHandle(ref, () => canvasRef.current!);

    // Initialize canvas
    useEffect(() => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setViewport(prev => ({
          ...prev,
          width: rect.width,
          height: rect.height,
        }));

        // Set up resize observer
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect;
            setViewport(prev => ({
              ...prev,
              width,
              height,
            }));
          }
        });

        resizeObserver.observe(canvasRef.current);

        return () => {
          resizeObserver.disconnect();
        };
      }
    }, []);

    // Subscribe to collaboration events
    useEffect(() => {
      const subscriptions = [
        eventBus.subscribe(
          ['collaboration.cursor.updated'],
          async (event) => {
            const { userId, cursor } = event.data;
            setLiveCursors(prev => {
              const existing = prev.find(c => c.userId === userId);
              if (existing) {
                return prev.map(c => 
                  c.userId === userId 
                    ? { ...c, position: cursor.position, visible: cursor.visible }
                    : c
                );
              } else {
                return [...prev, {
                  userId,
                  userName: `User ${userId.slice(0, 8)}`,
                  position: cursor.position,
                  color: cursor.color,
                  visible: cursor.visible,
                }];
              }
            });
          }
        ),

        eventBus.subscribe(
          ['canvas.render_requested'],
          async (event) => {
            if (event.target === canvasId) {
              // Re-render canvas
              triggerUpdate();
            }
          }
        ),
      ];

      return () => {
        subscriptions.forEach(sub => eventBus.unsubscribe(sub));
      };
    }, [canvasId]);

    // Handle mouse events
    const handleMouseDown = useCallback((event: React.MouseEvent) => {
      if (event.button === 1 || (event.button === 0 && event.altKey)) {
        // Middle mouse or Alt+click for panning
        setPanning(true);
        setLastPanPoint({ x: event.clientX, y: event.clientY });
        event.preventDefault();
      }
    }, []);

    const handleMouseMove = useCallback((event: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const canvasPosition = {
        x: (event.clientX - rect.left - viewport.x) / viewport.zoom,
        y: (event.clientY - rect.top - viewport.y) / viewport.zoom,
      };

      // Update collaboration cursor
      collaborationEngine.updateCursor(canvasPosition);

      // Handle panning
      if (isPanning) {
        const deltaX = event.clientX - lastPanPoint.x;
        const deltaY = event.clientY - lastPanPoint.y;

        setViewport(prev => ({
          ...prev,
          x: prev.x + deltaX,
          y: prev.y + deltaY,
        }));

        canvasSystem.updateViewport(canvasId, {
          x: viewport.x + deltaX,
          y: viewport.y + deltaY,
        });

        setLastPanPoint({ x: event.clientX, y: event.clientY });
      }
    }, [canvasId, viewport, isPanning, lastPanPoint]);

    const handleMouseUp = useCallback(() => {
      setPanning(false);
    }, []);

    // Handle wheel events for zooming
    const handleWheel = useCallback((event: React.WheelEvent) => {
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();
        
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Zoom towards mouse position
        const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.1, Math.min(5, viewport.zoom * zoomFactor));

        const newX = viewport.x - (mouseX - viewport.x) * (newZoom / viewport.zoom - 1);
        const newY = viewport.y - (mouseY - viewport.y) * (newZoom / viewport.zoom - 1);

        setViewport(prev => ({
          ...prev,
          x: newX,
          y: newY,
          zoom: newZoom,
        }));

        canvasSystem.updateViewport(canvasId, {
          x: newX,
          y: newY,
          zoom: newZoom,
        });

        onZoomChange(newZoom);
      }
    }, [canvasId, viewport, onZoomChange]);

    // Handle selection
    const handleCanvasClick = useCallback((event: React.MouseEvent) => {
      if (event.target === canvasRef.current) {
        // Click on empty canvas - clear selection
        onSelectionChange([]);
      }
    }, [onSelectionChange]);

    // Force re-render
    const [, forceUpdate] = useState({});
    const triggerUpdate = useCallback(() => {
      forceUpdate({});
    }, []);

    // Grid pattern
    const gridPattern = showGrid ? (
      <defs>
        <pattern
          id="grid"
          width={20 * viewport.zoom}
          height={20 * viewport.zoom}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${20 * viewport.zoom} 0 L 0 0 0 ${20 * viewport.zoom}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </pattern>
      </defs>
    ) : null;

    return (
      <div
        ref={canvasRef}
        className={cn(
          "relative overflow-hidden bg-white dark:bg-gray-900 select-none",
          className
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        style={{
          cursor: isPanning ? 'grabbing' : 'default',
        }}
      >
        {/* SVG Layer for Grid and Guidelines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {gridPattern}
          {showGrid && (
            <rect
              width="100%"
              height="100%"
              fill="url(#grid)"
              className="text-gray-300 dark:text-gray-600"
            />
          )}
        </svg>

        {/* Widgets Layer */}
        <div
          className="absolute"
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            transformOrigin: '0 0',
            zIndex: 10,
          }}
        >
          <AnimatePresence>
            {widgets.map((widget) => (
              <WidgetRenderer
                key={widget.id}
                widget={widget}
                isSelected={selectedWidgets.includes(widget.id)}
                onSelect={() => onSelectionChange([widget.id])}
                onMultiSelect={() => {
                  if (selectedWidgets.includes(widget.id)) {
                    onSelectionChange(selectedWidgets.filter(id => id !== widget.id));
                  } else {
                    onSelectionChange([...selectedWidgets, widget.id]);
                  }
                }}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Live Cursors Layer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 100 }}
        >
          <AnimatePresence>
            {liveCursors
              .filter(cursor => cursor.visible)
              .map((cursor) => (
                <motion.div
                  key={cursor.userId}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute flex items-center space-x-2"
                  style={{
                    left: viewport.x + cursor.position.x * viewport.zoom,
                    top: viewport.y + cursor.position.y * viewport.zoom,
                    transform: 'translate(-2px, -2px)',
                  }}
                >
                  {/* Cursor Icon */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="drop-shadow-sm"
                  >
                    <path
                      d="M0 0L16 6L6 8L0 16L0 0Z"
                      fill={cursor.color}
                      stroke="white"
                      strokeWidth="1"
                    />
                  </svg>

                  {/* User Label */}
                  <div
                    className="px-2 py-1 rounded text-xs text-white font-medium shadow-sm"
                    style={{ backgroundColor: cursor.color }}
                  >
                    {cursor.userName}
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </div>

        {/* Canvas Info Overlay */}
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 px-3 py-2 text-xs text-gray-600 dark:text-gray-300">
          <div>Zoom: {Math.round(viewport.zoom * 100)}%</div>
          <div>Position: {Math.round(viewport.x)}, {Math.round(viewport.y)}</div>
          <div>Widgets: {widgets.length}</div>
        </div>
      </div>
    );
  }
);

WidgetCanvas.displayName = 'WidgetCanvas';

// Widget Renderer Component
interface WidgetRendererProps {
  widget: any;
  isSelected: boolean;
  onSelect: () => void;
  onMultiSelect: () => void;
}

function WidgetRenderer({ widget, isSelected, onSelect, onMultiSelect }: WidgetRendererProps) {
  const handleClick = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (event.ctrlKey || event.metaKey) {
      onMultiSelect();
    } else {
      onSelect();
    }
  }, [onSelect, onMultiSelect]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "absolute border-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm cursor-pointer transition-colors",
        isSelected 
          ? "border-blue-500 shadow-blue-500/20" 
          : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
      )}
      style={{
        left: widget.position.x,
        top: widget.position.y,
        width: widget.size.width,
        height: widget.size.height,
      }}
      onClick={handleClick}
      data-widget-id={widget.id}
      data-draggable="true"
    >
      {/* Widget Content */}
      <div className="w-full h-full p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {widget.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {widget.widgetId}
          </div>
        </div>
      </div>

      {/* Selection Handles */}
      {isSelected && (
        <>
          {/* Corner handles for resizing */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize" />
          
          {/* Edge handles */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-n-resize" />
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-s-resize" />
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-w-resize" />
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-e-resize" />
        </>
      )}
    </motion.div>
  );
}
