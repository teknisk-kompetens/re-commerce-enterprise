
'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Plus, Save, Users, Layers, Grid, Move, Type, Square, Circle } from 'lucide-react'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import toast from 'react-hot-toast'

interface CanvasElement {
  id: string
  type: 'text' | 'shape' | 'image'
  position: { x: number; y: number }
  size?: { width: number; height: number }
  style: any
  content?: string
}

interface CanvasLayer {
  id: string
  name: string
  type: string
  visible: boolean
  elements: CanvasElement[]
}

interface Canvas {
  id: string
  name: string
  description?: string
  data: {
    layers: CanvasLayer[]
  }
  settings: any
}

export default function CanvasSystem() {
  const [canvases, setCanvases] = useState<Canvas[]>([])
  const [currentCanvas, setCurrentCanvas] = useState<Canvas | null>(null)
  const [selectedTool, setSelectedTool] = useState<string>('move')
  const [selectedLayer, setSelectedLayer] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchCanvases()
  }, [])

  const fetchCanvases = async () => {
    try {
      const response = await fetch('/api/canvas')
      if (response.ok) {
        const canvasData = await response.json()
        setCanvases(canvasData)
        if (canvasData.length > 0 && !currentCanvas) {
          setCurrentCanvas(canvasData[0])
          setSelectedLayer(canvasData[0].data?.layers?.[0]?.id || '')
        }
      }
    } catch (error) {
      console.error('Error fetching canvases:', error)
      toast.error('Failed to load canvases')
    } finally {
      setIsLoading(false)
    }
  }

  const createNewCanvas = async () => {
    try {
      const response = await fetch('/api/canvas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `Canvas ${canvases.length + 1}`,
          description: 'New collaborative canvas',
          data: {
            layers: [
              {
                id: 'bg-layer',
                name: 'Background',
                type: 'background',
                visible: true,
                elements: []
              },
              {
                id: 'content-layer',
                name: 'Content',
                type: 'content',
                visible: true,
                elements: []
              }
            ]
          },
          settings: {
            infiniteCanvas: true,
            realTimeCollab: true,
            gridEnabled: true,
            snapToGrid: false
          }
        })
      })

      if (response.ok) {
        const newCanvas = await response.json()
        setCanvases(prev => [newCanvas, ...prev])
        setCurrentCanvas(newCanvas)
        setSelectedLayer(newCanvas.data.layers[1].id)
        toast.success('New canvas created!')
      } else {
        toast.error('Failed to create canvas')
      }
    } catch (error) {
      console.error('Error creating canvas:', error)
      toast.error('Failed to create canvas')
    }
  }

  const saveCanvas = async () => {
    if (!currentCanvas) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/canvas/${currentCanvas.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: currentCanvas.name,
          description: currentCanvas.description,
          data: currentCanvas.data,
          settings: currentCanvas.settings
        })
      })

      if (response.ok) {
        toast.success('Canvas saved successfully!')
      } else {
        toast.error('Failed to save canvas')
      }
    } catch (error) {
      console.error('Error saving canvas:', error)
      toast.error('Failed to save canvas')
    } finally {
      setIsSaving(false)
    }
  }

  const addElement = (type: 'text' | 'shape' | 'image') => {
    if (!currentCanvas || !selectedLayer) return

    const newElement: CanvasElement = {
      id: `element_${Date.now()}`,
      type,
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      size: type === 'text' ? undefined : { width: 100, height: 100 },
      style: {
        color: type === 'text' ? '#333333' : '#60B5FF',
        fontSize: type === 'text' ? 16 : undefined,
        backgroundColor: type === 'shape' ? '#60B5FF' : undefined,
        borderRadius: type === 'shape' ? 8 : undefined
      },
      content: type === 'text' ? 'New Text' : undefined
    }

    setCurrentCanvas(prev => {
      if (!prev) return null
      return {
        ...prev,
        data: {
          ...prev.data,
          layers: prev.data.layers.map(layer =>
            layer.id === selectedLayer
              ? { ...layer, elements: [...layer.elements, newElement] }
              : layer
          )
        }
      }
    })
  }

  const tools = [
    { id: 'move', icon: Move, label: 'Move' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' }
  ]

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
          <title>Canvas System - RE:Commerce Enterprise</title>
        </Head>
        
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">Canvas System</h1>
                <select
                  value={currentCanvas?.id || ''}
                  onChange={(e) => {
                    const canvas = canvases.find(c => c.id === e.target.value)
                    setCurrentCanvas(canvas || null)
                    if (canvas?.data?.layers?.[0]) {
                      setSelectedLayer(canvas.data.layers[0].id)
                    }
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select a canvas</option>
                  {canvases.map(canvas => (
                    <option key={canvas.id} value={canvas.id}>
                      {canvas.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={createNewCanvas}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Canvas
                </button>
                
                <button
                  onClick={saveCanvas}
                  disabled={!currentCanvas || isSaving}
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                
                <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  <Users className="h-4 w-4 mr-2" />
                  Collaborate
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Tools panel */}
            <div className="w-64 bg-white border-r border-gray-200 p-4">
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        if (tool.id === 'move') {
                          setSelectedTool(tool.id)
                        } else {
                          addElement(tool.id as any)
                        }
                      }}
                      className={`flex flex-col items-center p-3 rounded-md border transition-colors ${
                        selectedTool === tool.id
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <tool.icon className="h-5 w-5 mb-1" />
                      <span className="text-xs">{tool.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Layers panel */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <Layers className="h-4 w-4 mr-2" />
                  Layers
                </h3>
                {currentCanvas?.data?.layers && (
                  <div className="space-y-1">
                    {currentCanvas.data.layers.map((layer) => (
                      <button
                        key={layer.id}
                        onClick={() => setSelectedLayer(layer.id)}
                        className={`w-full flex items-center justify-between p-2 text-sm rounded transition-colors ${
                          selectedLayer === layer.id
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{layer.name}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">
                            {layer.elements.length}
                          </span>
                          <div className={`w-2 h-2 rounded-full ${
                            layer.visible ? 'bg-green-400' : 'bg-gray-300'
                          }`} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Canvas area */}
            <div className="flex-1 relative overflow-hidden">
              {currentCanvas ? (
                <div className="w-full h-full bg-gray-50 relative">
                  {/* Grid background */}
                  {currentCanvas.settings?.gridEnabled && (
                    <div 
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage: `
                          linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                        `,
                        backgroundSize: '20px 20px'
                      }}
                    />
                  )}

                  {/* Canvas elements */}
                  {currentCanvas.data.layers
                    .filter(layer => layer.visible)
                    .map(layer => (
                      <div key={layer.id}>
                        {layer.elements.map(element => (
                          <div
                            key={element.id}
                            className="absolute cursor-pointer border-2 border-transparent hover:border-indigo-300 transition-colors"
                            style={{
                              left: element.position.x,
                              top: element.position.y,
                              width: element.size?.width,
                              height: element.size?.height,
                              color: element.style.color,
                              fontSize: element.style.fontSize,
                              backgroundColor: element.style.backgroundColor,
                              borderRadius: element.style.borderRadius
                            }}
                          >
                            {element.type === 'text' && (
                              <div className="p-2 min-w-[100px]">
                                {element.content}
                              </div>
                            )}
                            {element.type === 'shape' && (
                              <div className="w-full h-full" />
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <Grid className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No canvas selected</h3>
                    <p className="text-gray-500 mb-4">Create a new canvas to start designing</p>
                    <button
                      onClick={createNewCanvas}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Canvas
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
