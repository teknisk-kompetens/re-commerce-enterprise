
'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Plus, Save, Play, Settings, Eye, Layers } from 'lucide-react'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import SceneCanvas from '@/components/SceneBuilder/SceneCanvas'
import WidgetPalette from '@/components/SceneBuilder/WidgetPalette'
import toast from 'react-hot-toast'

interface Scene {
  id: string
  name: string
  description?: string
  config: any
  published: boolean
  widgets: SceneWidget[]
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
  widget: {
    id: string
    name: string
    type: string
    config: any
  }
}

export default function Scenes() {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [currentScene, setCurrentScene] = useState<Scene | null>(null)
  const [selectedWidget, setSelectedWidget] = useState<SceneWidget | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSceneSettings, setShowSceneSettings] = useState(false)

  useEffect(() => {
    fetchScenes()
  }, [])

  const fetchScenes = async () => {
    try {
      const response = await fetch('/api/scenes')
      if (response.ok) {
        const scenesData = await response.json()
        setScenes(scenesData)
        if (scenesData.length > 0 && !currentScene) {
          setCurrentScene(scenesData[0])
        }
      }
    } catch (error) {
      console.error('Error fetching scenes:', error)
      toast.error('Failed to load scenes')
    } finally {
      setIsLoading(false)
    }
  }

  const createNewScene = async () => {
    try {
      const response = await fetch('/api/scenes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `Scene ${scenes.length + 1}`,
          description: 'New scene created with Scene Builder',
          config: {
            layout: 'freeform',
            width: 1200,
            height: 800,
            theme: 'modern'
          }
        })
      })

      if (response.ok) {
        const newScene = await response.json()
        const sceneWithWidgets = { ...newScene, widgets: [] }
        setScenes(prev => [sceneWithWidgets, ...prev])
        setCurrentScene(sceneWithWidgets)
        toast.success('New scene created!')
      } else {
        toast.error('Failed to create scene')
      }
    } catch (error) {
      console.error('Error creating scene:', error)
      toast.error('Failed to create scene')
    }
  }

  const saveScene = async () => {
    if (!currentScene) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/scenes/${currentScene.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: currentScene.name,
          description: currentScene.description,
          config: currentScene.config,
          widgets: currentScene.widgets.map(w => ({
            widgetId: w.widgetId,
            position: w.position,
            config: w.config
          }))
        })
      })

      if (response.ok) {
        toast.success('Scene saved successfully!')
      } else {
        toast.error('Failed to save scene')
      }
    } catch (error) {
      console.error('Error saving scene:', error)
      toast.error('Failed to save scene')
    } finally {
      setIsSaving(false)
    }
  }

  const addWidgetToScene = async (widgetId: string) => {
    if (!currentScene) return

    try {
      const response = await fetch(`/api/widgets`)
      if (response.ok) {
        const widgets = await response.json()
        const widget = widgets.find((w: any) => w.id === widgetId)
        
        if (widget) {
          const newSceneWidget: SceneWidget = {
            id: `sw_${Date.now()}`,
            widgetId: widget.id,
            position: {
              x: Math.random() * 400,
              y: Math.random() * 300,
              width: 300,
              height: 200,
              zIndex: currentScene.widgets.length + 1
            },
            config: widget.config,
            widget: widget
          }

          setCurrentScene(prev => prev ? {
            ...prev,
            widgets: [...prev.widgets, newSceneWidget]
          } : null)
        }
      }
    } catch (error) {
      console.error('Error adding widget to scene:', error)
      toast.error('Failed to add widget to scene')
    }
  }

  const updateSceneWidget = (widgetId: string, position: any) => {
    if (!currentScene) return

    setCurrentScene(prev => prev ? {
      ...prev,
      widgets: prev.widgets.map(w => 
        w.id === widgetId ? { ...w, position } : w
      )
    } : null)
  }

  const removeSceneWidget = (widgetId: string) => {
    if (!currentScene) return

    setCurrentScene(prev => prev ? {
      ...prev,
      widgets: prev.widgets.filter(w => w.id !== widgetId)
    } : null)
    setSelectedWidget(null)
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
          <title>Scene Builder - RE:Commerce Enterprise</title>
        </Head>
        
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">Scene Builder</h1>
                <select
                  value={currentScene?.id || ''}
                  onChange={(e) => {
                    const scene = scenes.find(s => s.id === e.target.value)
                    setCurrentScene(scene || null)
                    setSelectedWidget(null)
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select a scene</option>
                  {scenes.map(scene => (
                    <option key={scene.id} value={scene.id}>
                      {scene.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={createNewScene}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Scene
                </button>
                
                <button
                  onClick={() => setShowSceneSettings(!showSceneSettings)}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </button>
                
                <button
                  onClick={saveScene}
                  disabled={!currentScene || isSaving}
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Scene'}
                </button>
                
                <button
                  onClick={() => {
                    if (currentScene) {
                      window.open(`/scenes/preview/${currentScene.id}`, '_blank')
                    }
                  }}
                  disabled={!currentScene}
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Widget palette */}
            <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
              <WidgetPalette onAddWidget={addWidgetToScene} />
            </div>

            {/* Scene canvas */}
            <div className="flex-1 relative">
              {currentScene ? (
                <SceneCanvas
                  sceneWidgets={currentScene.widgets}
                  onUpdateWidget={updateSceneWidget}
                  onRemoveWidget={removeSceneWidget}
                  onSelectWidget={setSelectedWidget}
                  selectedWidget={selectedWidget}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="text-gray-400 mb-4">
                      <Layers className="h-16 w-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No scene selected</h3>
                    <p className="text-gray-500 mb-4">Create or select a scene to start building</p>
                    <button
                      onClick={createNewScene}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Scene
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Properties panel */}
            {selectedWidget && (
              <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Widget Properties</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Widget Name
                    </label>
                    <input
                      type="text"
                      value={selectedWidget.widget.name}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      readOnly
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <input
                      type="text"
                      value={selectedWidget.widget.type}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                      readOnly
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Width
                      </label>
                      <input
                        type="number"
                        value={selectedWidget.position.width}
                        onChange={(e) => updateSceneWidget(selectedWidget.id, {
                          ...selectedWidget.position,
                          width: parseInt(e.target.value)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Height
                      </label>
                      <input
                        type="number"
                        value={selectedWidget.position.height}
                        onChange={(e) => updateSceneWidget(selectedWidget.id, {
                          ...selectedWidget.position,
                          height: parseInt(e.target.value)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        X Position
                      </label>
                      <input
                        type="number"
                        value={selectedWidget.position.x}
                        onChange={(e) => updateSceneWidget(selectedWidget.id, {
                          ...selectedWidget.position,
                          x: parseInt(e.target.value)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Y Position
                      </label>
                      <input
                        type="number"
                        value={selectedWidget.position.y}
                        onChange={(e) => updateSceneWidget(selectedWidget.id, {
                          ...selectedWidget.position,
                          y: parseInt(e.target.value)
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
