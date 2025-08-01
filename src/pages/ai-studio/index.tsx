
'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Bot, Zap, Brain, Cog, Play, Settings, BarChart3, MessageSquare } from 'lucide-react'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import toast from 'react-hot-toast'

interface AIModule {
  id: string
  name: string
  type: string
  config: any
  data?: any
  status: string
}

const moduleTypes = [
  {
    type: 'AUTOMATION_ENGINE',
    name: 'Automation Engine',
    icon: Zap,
    description: 'Automate business processes and workflows',
    color: 'bg-yellow-500'
  },
  {
    type: 'COGNITIVE_BI',
    name: 'Cognitive BI',
    icon: Brain,
    description: 'AI-powered business intelligence and insights',
    color: 'bg-purple-500'
  },
  {
    type: 'CONVERSATIONAL_AI',
    name: 'Conversational AI',
    icon: MessageSquare,
    description: 'Intelligent chatbots and virtual assistants',
    color: 'bg-blue-500'
  },
  {
    type: 'ML_OPS',
    name: 'ML-Ops Platform',
    icon: Cog,
    description: 'Machine learning operations and model management',
    color: 'bg-green-500'
  }
]

export default function AIStudio() {
  const [modules, setModules] = useState<AIModule[]>([])
  const [selectedModule, setSelectedModule] = useState<AIModule | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isExecuting, setIsExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<string>('')

  useEffect(() => {
    fetchModules()
  }, [])

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/ai-modules')
      if (response.ok) {
        const modulesData = await response.json()
        setModules(modulesData)
        if (modulesData.length > 0) {
          setSelectedModule(modulesData[0])
        }
      }
    } catch (error) {
      console.error('Error fetching AI modules:', error)
      toast.error('Failed to load AI modules')
    } finally {
      setIsLoading(false)
    }
  }

  const executeModule = async (moduleId: string, prompt: string) => {
    setIsExecuting(true)
    setExecutionResult('')
    
    try {
      const response = await fetch('/api/ai-modules/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ moduleId, prompt })
      })

      if (response.ok) {
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let result = ''

        while (reader) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') {
                setIsExecuting(false)
                return
              }
              try {
                const parsed = JSON.parse(data)
                result += parsed.content
                setExecutionResult(result)
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } else {
        toast.error('Failed to execute AI module')
      }
    } catch (error) {
      console.error('Error executing module:', error)
      toast.error('Failed to execute AI module')
    } finally {
      setIsExecuting(false)
    }
  }

  const renderModuleInterface = (module: AIModule) => {
    const moduleType = moduleTypes.find(t => t.type === module.type)
    
    switch (module.type) {
      case 'AUTOMATION_ENGINE':
        return <AutomationEngineInterface module={module} onExecute={executeModule} />
      case 'COGNITIVE_BI':
        return <CognitiveBIInterface module={module} onExecute={executeModule} />
      case 'CONVERSATIONAL_AI':
        return <ConversationalAIInterface module={module} onExecute={executeModule} />
      case 'ML_OPS':
        return <MLOpsInterface module={module} onExecute={executeModule} />
      default:
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <Bot className="h-12 w-12 mx-auto mb-4" />
              <p>Module interface not implemented</p>
            </div>
          </div>
        )
    }
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
          <title>AI Studio - RE:Commerce Enterprise</title>
        </Head>
        
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bot className="h-8 w-8 text-indigo-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">AI Studio</h1>
              </div>
              <div className="text-sm text-gray-500">
                {modules.length} AI modules active
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Module sidebar */}
            <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Modules</h3>
                <div className="space-y-3">
                  {modules.map((module) => {
                    const moduleType = moduleTypes.find(t => t.type === module.type)
                    return (
                      <button
                        key={module.id}
                        onClick={() => setSelectedModule(module)}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          selectedModule?.id === module.id
                            ? 'bg-indigo-50 border-indigo-200'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-lg ${moduleType?.color || 'bg-gray-500'} bg-opacity-10 mr-3`}>
                            {moduleType?.icon && (
                              <moduleType.icon className={`h-5 w-5 ${moduleType.color?.replace('bg-', 'text-') || 'text-gray-500'}`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{module.name}</h4>
                            <p className="text-sm text-gray-500 mt-1">{moduleType?.description}</p>
                            <div className="flex items-center mt-2">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                module.status === 'active' ? 'bg-green-400' : 'bg-gray-300'
                              }`} />
                              <span className="text-xs text-gray-500 capitalize">{module.status}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Module interface */}
            <div className="flex-1 flex flex-col">
              {selectedModule ? (
                <>
                  <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {(() => {
                          const moduleType = moduleTypes.find(t => t.type === selectedModule.type)
                          const IconComponent = moduleType?.icon
                          return IconComponent ? <IconComponent className="h-6 w-6 text-indigo-600 mr-3" /> : null
                        })()}
                        <h2 className="text-xl font-semibold text-gray-900">{selectedModule.name}</h2>
                      </div>
                      <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-6 overflow-y-auto">
                    {renderModuleInterface(selectedModule)}
                  </div>

                  {/* Execution Result */}
                  {(executionResult || isExecuting) && (
                    <div className="bg-white border-t border-gray-200 p-6 max-h-64 overflow-y-auto">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        {isExecuting ? 'Executing...' : 'Result:'}
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        {isExecuting ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
                            <span className="text-sm text-gray-600">Processing...</span>
                          </div>
                        ) : (
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{executionResult}</pre>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Bot className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select an AI Module</h3>
                    <p className="text-gray-500">Choose a module from the sidebar to get started</p>
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

// Individual module interfaces
function AutomationEngineInterface({ module, onExecute }: { module: AIModule, onExecute: (id: string, prompt: string) => void }) {
  const [workflow, setWorkflow] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Workflows</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <Zap className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Create Automation</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Define workflows to automate business processes and tasks.
              </p>
            </div>
          </div>
        </div>
        
        <textarea
          value={workflow}
          onChange={(e) => setWorkflow(e.target.value)}
          placeholder="Describe the workflow you want to automate. For example: 'Create an automation that sends welcome emails to new customers and adds them to the newsletter list.'"
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        
        <button
          onClick={() => onExecute(module.id, workflow)}
          disabled={!workflow.trim()}
          className="mt-4 flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="h-4 w-4 mr-2" />
          Generate Automation
        </button>
      </div>
    </div>
  )
}

function CognitiveBIInterface({ module, onExecute }: { module: AIModule, onExecute: (id: string, prompt: string) => void }) {
  const [query, setQuery] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Intelligence</h3>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <Brain className="h-5 w-5 text-purple-400 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-purple-800">AI-Powered Insights</h4>
              <p className="text-sm text-purple-700 mt-1">
                Get intelligent analysis and recommendations for your business data.
              </p>
            </div>
          </div>
        </div>
        
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask for business insights. For example: 'Analyze our sales trends and identify opportunities for growth' or 'What are the key factors affecting customer retention?'"
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        
        <button
          onClick={() => onExecute(module.id, query)}
          disabled={!query.trim()}
          className="mt-4 flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Generate Insights
        </button>
      </div>
    </div>
  )
}

function ConversationalAIInterface({ module, onExecute }: { module: AIModule, onExecute: (id: string, prompt: string) => void }) {
  const [message, setMessage] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversational AI</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <MessageSquare className="h-5 w-5 text-blue-400 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-blue-800">Intelligent Assistant</h4>
              <p className="text-sm text-blue-700 mt-1">
                Chat with AI to get help with business questions and tasks.
              </p>
            </div>
          </div>
        </div>
        
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask me anything about your business, e-commerce strategies, customer service, or need help with specific tasks..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        
        <button
          onClick={() => onExecute(module.id, message)}
          disabled={!message.trim()}
          className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Send Message
        </button>
      </div>
    </div>
  )
}

function MLOpsInterface({ module, onExecute }: { module: AIModule, onExecute: (id: string, prompt: string) => void }) {
  const [task, setTask] = useState('')

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ML-Ops Platform</h3>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <Cog className="h-5 w-5 text-green-400 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-green-800">Machine Learning Operations</h4>
              <p className="text-sm text-green-700 mt-1">
                Deploy and manage machine learning models for your business needs.
              </p>
            </div>
          </div>
        </div>
        
        <textarea
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Describe your ML task. For example: 'Create a customer segmentation model' or 'Build a recommendation engine for products' or 'Predict customer churn based on behavior data'."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        
        <button
          onClick={() => onExecute(module.id, task)}
          disabled={!task.trim()}
          className="mt-4 flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Cog className="h-4 w-4 mr-2" />
          Execute ML Task
        </button>
      </div>
    </div>
  )
}
