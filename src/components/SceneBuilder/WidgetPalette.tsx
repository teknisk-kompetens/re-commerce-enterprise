
'use client'

import { useState, useEffect } from 'react'
import { DragEndEvent, useDndContext } from '@dnd-kit/core'
import { Plus, BarChart3, Type, Image, Table, FileText, Map } from 'lucide-react'
import toast from 'react-hot-toast'

interface Widget {
  id: string
  name: string
  type: string
  description?: string
  config: any
}

interface WidgetPaletteProps {
  onAddWidget: (widgetId: string) => void
}

const widgetTypes = [
  {
    type: 'CHART',
    name: 'Chart Widget',
    icon: BarChart3,
    description: 'Interactive charts and graphs',
    defaultConfig: {
      chartType: 'line',
      dataSource: 'sample',
      colors: ['#60B5FF', '#FF9149']
    }
  },
  {
    type: 'TEXT',
    name: 'Text Widget',
    icon: Type,
    description: 'Rich text content',
    defaultConfig: {
      text: 'Your text here',
      fontSize: 16,
      color: '#1f2937',
      align: 'center'
    }
  },
  {
    type: 'IMAGE',
    name: 'Image Widget',
    icon: Image,
    description: 'Images and media',
    defaultConfig: {
      src: '',
      alt: 'Image description'
    }
  },
  {
    type: 'TABLE',
    name: 'Table Widget',
    icon: Table,
    description: 'Data tables',
    defaultConfig: {
      data: [
        { name: 'Item 1', value: 100 },
        { name: 'Item 2', value: 200 }
      ]
    }
  },
  {
    type: 'FORM',
    name: 'Form Widget',
    icon: FileText,
    description: 'Interactive forms',
    defaultConfig: {
      title: 'Contact Form',
      fields: ['name', 'email', 'message']
    }
  },
  {
    type: 'MAP',
    name: 'Map Widget',
    icon: Map,
    description: 'Interactive maps',
    defaultConfig: {
      location: 'Stockholm, Sweden',
      zoom: 10
    }
  }
]

export default function WidgetPalette({ onAddWidget }: WidgetPaletteProps) {
  const [availableWidgets, setAvailableWidgets] = useState<Widget[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchWidgets()
  }, [])

  const fetchWidgets = async () => {
    try {
      const response = await fetch('/api/widgets')
      if (response.ok) {
        const widgets = await response.json()
        setAvailableWidgets(widgets)
      }
    } catch (error) {
      console.error('Error fetching widgets:', error)
      toast.error('Failed to load widgets')
    } finally {
      setIsLoading(false)
    }
  }

  const createWidget = async (type: string) => {
    const widgetType = widgetTypes.find(w => w.type === type)
    if (!widgetType) return

    try {
      const response = await fetch('/api/widgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: widgetType.name,
          type: widgetType.type,
          description: widgetType.description,
          config: widgetType.defaultConfig
        })
      })

      if (response.ok) {
        const newWidget = await response.json()
        setAvailableWidgets(prev => [newWidget, ...prev])
        onAddWidget(newWidget.id)
        toast.success('Widget created and added to scene!')
      } else {
        toast.error('Failed to create widget')
      }
    } catch (error) {
      console.error('Error creating widget:', error)
      toast.error('Failed to create widget')
    }
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Widget types */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Create New Widget</h3>
        <div className="space-y-2">
          {widgetTypes.map((widgetType) => (
            <button
              key={widgetType.type}
              onClick={() => createWidget(widgetType.type)}
              className="w-full flex items-center p-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <widgetType.icon className="h-4 w-4 mr-2 text-gray-500" />
              <div>
                <div className="font-medium">{widgetType.name}</div>
                <div className="text-xs text-gray-500">{widgetType.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Available widgets */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Available Widgets</h3>
        {availableWidgets.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-sm">No widgets created yet</div>
            <div className="text-xs mt-1">Create your first widget above</div>
          </div>
        ) : (
          <div className="space-y-2">
            {availableWidgets.map((widget) => (
              <button
                key={widget.id}
                onClick={() => onAddWidget(widget.id)}
                className="w-full flex items-center p-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium">{widget.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{widget.type}</div>
                  {widget.description && (
                    <div className="text-xs text-gray-400 mt-1">{widget.description}</div>
                  )}
                </div>
                <Plus className="h-4 w-4 text-gray-400" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
