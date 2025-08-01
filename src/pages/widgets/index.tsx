
'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Plus, Palette, Edit, Trash2, Copy, Eye } from 'lucide-react'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import WidgetRenderer from '@/components/SceneBuilder/WidgetRenderer'
import toast from 'react-hot-toast'

interface Widget {
  id: string
  name: string
  type: string
  description?: string
  config: any
  blueprint?: any
  createdAt: string
  updatedAt: string
}

const widgetTypes = [
  { value: 'CHART', label: 'Chart Widget', description: 'Interactive charts and graphs' },
  { value: 'TEXT', label: 'Text Widget', description: 'Rich text content' },
  { value: 'IMAGE', label: 'Image Widget', description: 'Images and media' },
  { value: 'TABLE', label: 'Table Widget', description: 'Data tables' },
  { value: 'FORM', label: 'Form Widget', description: 'Interactive forms' },
  { value: 'MAP', label: 'Map Widget', description: 'Interactive maps' },
  { value: 'CUSTOM', label: 'Custom Widget', description: 'Custom functionality' }
]

export default function Widgets() {
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingWidget, setEditingWidget] = useState<Widget | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchWidgets()
  }, [])

  const fetchWidgets = async () => {
    try {
      const response = await fetch('/api/widgets')
      if (response.ok) {
        const widgetsData = await response.json()
        setWidgets(widgetsData)
      }
    } catch (error) {
      console.error('Error fetching widgets:', error)
      toast.error('Failed to load widgets')
    } finally {
      setIsLoading(false)
    }
  }

  const createWidget = async (widgetData: Partial<Widget>) => {
    try {
      const response = await fetch('/api/widgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(widgetData)
      })

      if (response.ok) {
        const newWidget = await response.json()
        setWidgets(prev => [newWidget, ...prev])
        setShowCreateModal(false)
        toast.success('Widget created successfully!')
      } else {
        toast.error('Failed to create widget')
      }
    } catch (error) {
      console.error('Error creating widget:', error)
      toast.error('Failed to create widget')
    }
  }

  const deleteWidget = async (widgetId: string) => {
    if (!confirm('Are you sure you want to delete this widget?')) return

    try {
      const response = await fetch(`/api/widgets/${widgetId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setWidgets(prev => prev.filter(w => w.id !== widgetId))
        toast.success('Widget deleted successfully!')
      } else {
        toast.error('Failed to delete widget')
      }
    } catch (error) {
      console.error('Error deleting widget:', error)
      toast.error('Failed to delete widget')
    }
  }

  const duplicateWidget = async (widget: Widget) => {
    const duplicatedWidget = {
      name: `${widget.name} (Copy)`,
      type: widget.type,
      description: widget.description,
      config: widget.config,
      blueprint: widget.blueprint
    }

    await createWidget(duplicatedWidget)
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>Widget Factory - RE:Commerce Enterprise</title>
        </Head>
        
        <div className="p-6 space-y-6 bg-gray-50 min-h-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Palette className="h-8 w-8 text-indigo-600 mr-3" />
                Widget Factory
              </h1>
              <p className="text-gray-600 mt-2">Create and manage reusable widgets for your scenes</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <div className="w-4 h-4 flex flex-col gap-1">
                    <div className="bg-current h-0.5 rounded"></div>
                    <div className="bg-current h-0.5 rounded"></div>
                    <div className="bg-current h-0.5 rounded"></div>
                  </div>
                </button>
              </div>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Widget
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{widgets.length}</div>
              <div className="text-sm text-gray-500">Total Widgets</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-indigo-600">
                {widgets.filter(w => w.type === 'CHART').length}
              </div>
              <div className="text-sm text-gray-500">Chart Widgets</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-green-600">
                {widgets.filter(w => w.type === 'FORM').length}
              </div>
              <div className="text-sm text-gray-500">Form Widgets</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-purple-600">
                {widgets.filter(w => w.type === 'CUSTOM').length}
              </div>
              <div className="text-sm text-gray-500">Custom Widgets</div>
            </div>
          </div>

          {/* Widgets Grid/List */}
          {widgets.length === 0 ? (
            <div className="text-center py-12">
              <Palette className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No widgets created yet</h3>
              <p className="text-gray-500 mb-6">Create your first widget to get started with the Widget Factory</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Widget
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  className={`bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow ${
                    viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      {/* Widget Preview */}
                      <div className="h-32 bg-gray-50 rounded-lg mb-4 overflow-hidden">
                        <WidgetRenderer widget={widget} config={widget.config} />
                      </div>
                      
                      {/* Widget Info */}
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{widget.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">{widget.type}</p>
                        {widget.description && (
                          <p className="text-sm text-gray-600">{widget.description}</p>
                        )}
                      </div>
                      
                      {/* Widget Actions */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {new Date(widget.updatedAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setEditingWidget(widget)}
                            className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => duplicateWidget(widget)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteWidget(widget.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List View */}
                      <div className="w-16 h-16 bg-gray-50 rounded-lg mr-4 overflow-hidden flex-shrink-0">
                        <WidgetRenderer widget={widget} config={widget.config} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{widget.name}</h3>
                            <p className="text-sm text-gray-500">{widget.type}</p>
                            {widget.description && (
                              <p className="text-sm text-gray-600 mt-1">{widget.description}</p>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {new Date(widget.updatedAt).toLocaleDateString()}
                            </span>
                            <button
                              onClick={() => setEditingWidget(widget)}
                              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => duplicateWidget(widget)}
                              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                              title="Duplicate"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteWidget(widget.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Widget Modal */}
        {showCreateModal && (
          <CreateWidgetModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={createWidget}
            widgetTypes={widgetTypes}
          />
        )}

        {/* Edit Widget Modal */}
        {editingWidget && (
          <EditWidgetModal
            widget={editingWidget}
            onClose={() => setEditingWidget(null)}
            onUpdate={(updatedWidget) => {
              setWidgets(prev => prev.map(w => w.id === updatedWidget.id ? updatedWidget : w))
              setEditingWidget(null)
              toast.success('Widget updated successfully!')
            }}
            widgetTypes={widgetTypes}
          />
        )}
      </Layout>
    </ProtectedRoute>
  )
}

// Create Widget Modal Component
function CreateWidgetModal({ 
  onClose, 
  onSubmit, 
  widgetTypes 
}: { 
  onClose: () => void
  onSubmit: (data: any) => void
  widgetTypes: any[]
}) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'CHART',
    description: '',
    config: {}
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Set default config based on widget type
    let defaultConfig = {}
    switch (formData.type) {
      case 'CHART':
        defaultConfig = { chartType: 'line', colors: ['#60B5FF', '#FF9149'] }
        break
      case 'TEXT':
        defaultConfig = { text: 'Sample text', fontSize: 16, color: '#333333' }
        break
      case 'IMAGE':
        defaultConfig = { src: '', alt: 'Image description' }
        break
      case 'TABLE':
        defaultConfig = { data: [{ name: 'Item 1', value: 100 }] }
        break
      case 'FORM':
        defaultConfig = { title: 'Contact Form', fields: ['name', 'email', 'message'] }
        break
      case 'MAP':
        defaultConfig = { location: 'Stockholm, Sweden', zoom: 10 }
        break
      default:
        defaultConfig = {}
    }

    onSubmit({
      ...formData,
      config: defaultConfig
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Widget</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Widget Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Widget Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {widgetTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              rows={3}
            />
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Create Widget
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Widget Modal Component (simplified for demo)
function EditWidgetModal({ 
  widget, 
  onClose, 
  onUpdate, 
  widgetTypes 
}: { 
  widget: Widget
  onClose: () => void
  onUpdate: (widget: Widget) => void
  widgetTypes: any[]
}) {
  const [formData, setFormData] = useState({
    name: widget.name,
    description: widget.description || '',
    config: widget.config
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({
      ...widget,
      ...formData
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Edit Widget</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Widget Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              rows={3}
            />
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Update Widget
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
