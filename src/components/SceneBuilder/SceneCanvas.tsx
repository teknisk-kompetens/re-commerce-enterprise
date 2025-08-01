
'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core'
import { Trash2, Settings } from 'lucide-react'
import WidgetRenderer from './WidgetRenderer'

interface Widget {
  id: string
  name: string
  type: string
  config: any
}

interface SceneWidget {
  id: string
  widgetId: string
  position: {
    x: number
    y: number
    width: number
    height: number
    zIndex: number
  }
  config?: any
  widget: Widget
}

interface SceneCanvasProps {
  sceneWidgets: SceneWidget[]
  onUpdateWidget: (id: string, position: any) => void
  onRemoveWidget: (id: string) => void
  onSelectWidget: (widget: SceneWidget | null) => void
  selectedWidget: SceneWidget | null
}

export default function SceneCanvas({
  sceneWidgets,
  onUpdateWidget,
  onRemoveWidget,
  onSelectWidget,
  selectedWidget
}: SceneCanvasProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }, [])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, delta } = event
    const widgetId = active.id as string
    
    const widget = sceneWidgets.find(w => w.id === widgetId)
    if (widget) {
      const newPosition = {
        ...widget.position,
        x: Math.max(0, widget.position.x + delta.x),
        y: Math.max(0, widget.position.y + delta.y)
      }
      onUpdateWidget(widgetId, newPosition)
    }
    
    setActiveId(null)
  }, [sceneWidgets, onUpdateWidget])

  const activeWidget = activeId ? sceneWidgets.find(w => w.id === activeId) : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative w-full h-full bg-gray-50 overflow-hidden">
        {/* Grid background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />

        {/* Scene widgets */}
        {sceneWidgets.map((sceneWidget) => (
          <div
            key={sceneWidget.id}
            className={`absolute cursor-move group ${
              selectedWidget?.id === sceneWidget.id ? 'ring-2 ring-indigo-500' : ''
            }`}
            style={{
              left: sceneWidget.position.x,
              top: sceneWidget.position.y,
              width: sceneWidget.position.width,
              height: sceneWidget.position.height,
              zIndex: sceneWidget.position.zIndex
            }}
            onClick={() => onSelectWidget(sceneWidget)}
          >
            {/* Widget controls */}
            <div className="absolute -top-8 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectWidget(sceneWidget)
                }}
                className="p-1 bg-gray-800 text-white rounded text-xs hover:bg-gray-700"
              >
                <Settings className="h-3 w-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRemoveWidget(sceneWidget.id)
                }}
                className="p-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>

            {/* Widget content */}
            <div className="w-full h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <WidgetRenderer
                widget={sceneWidget.widget}
                config={sceneWidget.config || sceneWidget.widget.config}
              />
            </div>
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeWidget ? (
          <div
            className="bg-white rounded-lg shadow-lg border border-gray-200 opacity-80"
            style={{
              width: activeWidget.position.width,
              height: activeWidget.position.height
            }}
          >
            <WidgetRenderer
              widget={activeWidget.widget}
              config={activeWidget.config || activeWidget.widget.config}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
