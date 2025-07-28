
'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus,
  Trash2,
  Edit,
  Play,
  ArrowRight,
  GitBranch,
  Settings,
  Save,
  Download,
  Upload,
  Zap,
  Brain,
  Database,
  Shield,
  BarChart3,
  Layers,
  MousePointer,
  Move3D
} from 'lucide-react';
import type { 
  DemoProfile, 
  DemoWorkflowConfig, 
  DemoWorkflowStep, 
  DemoWorkflowConnection,
  EnterpriseSystemComponent 
} from '@/lib/types';

interface WorkflowBuilderProps {
  profile?: DemoProfile;
  enterpriseComponents: EnterpriseSystemComponent[];
  onWorkflowUpdate: () => void;
}

interface Position {
  x: number;
  y: number;
}

export function WorkflowBuilder({ profile, enterpriseComponents, onWorkflowUpdate }: WorkflowBuilderProps) {
  const [workflows, setWorkflows] = useState<DemoWorkflowConfig[]>(profile?.workflows || []);
  const [activeWorkflow, setActiveWorkflow] = useState<DemoWorkflowConfig | null>(workflows[0] || null);
  const [selectedStep, setSelectedStep] = useState<DemoWorkflowStep | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<EnterpriseSystemComponent | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<Position>({ x: 0, y: 0 });
  const [isCreateWorkflowOpen, setIsCreateWorkflowOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Position>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((component: EnterpriseSystemComponent, e: React.DragEvent<HTMLDivElement>) => {
    setDraggedComponent(component);
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragPosition({
        x: (e.clientX - rect.left) / zoom - pan.x,
        y: (e.clientY - rect.top) / zoom - pan.y
      });
    }
  }, [zoom, pan]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (draggedComponent && activeWorkflow && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom - pan.x;
      const y = (e.clientY - rect.top) / zoom - pan.y;

      const newStep: DemoWorkflowStep = {
        id: `step-${Date.now()}`,
        name: draggedComponent.name,
        title: draggedComponent.title,
        description: draggedComponent.description,
        type: 'component',
        componentId: draggedComponent.id,
        config: { ...draggedComponent.demoContent },
        position: { x, y },
        inputs: [],
        outputs: []
      };

      const updatedWorkflow = {
        ...activeWorkflow,
        steps: [...activeWorkflow.steps, newStep]
      };

      setActiveWorkflow(updatedWorkflow);
      updateWorkflow(updatedWorkflow);
    }
    
    setDraggedComponent(null);
    setIsDragging(false);
  }, [draggedComponent, activeWorkflow, zoom, pan]);

  const updateWorkflow = async (workflow: DemoWorkflowConfig) => {
    try {
      await fetch(`/api/demo-builder/workflows/${workflow.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflow)
      });
      onWorkflowUpdate();
    } catch (error) {
      console.error('Error updating workflow:', error);
    }
  };

  const createWorkflow = async (workflowData: Partial<DemoWorkflowConfig>) => {
    try {
      const response = await fetch(`/api/demo-builder/profiles/${profile?.id}/workflows`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(workflowData)
      });

      if (response.ok) {
        const newWorkflow = await response.json();
        setWorkflows([...workflows, newWorkflow]);
        setActiveWorkflow(newWorkflow);
        setIsCreateWorkflowOpen(false);
        onWorkflowUpdate();
      }
    } catch (error) {
      console.error('Error creating workflow:', error);
    }
  };

  const deleteStep = (stepId: string) => {
    if (!activeWorkflow) return;

    const updatedWorkflow = {
      ...activeWorkflow,
      steps: activeWorkflow.steps.filter(step => step.id !== stepId),
      connections: activeWorkflow.connections.filter(
        conn => conn.fromStep !== stepId && conn.toStep !== stepId
      )
    };

    setActiveWorkflow(updatedWorkflow);
    updateWorkflow(updatedWorkflow);
    setSelectedStep(null);
  };

  const addConnection = (fromStepId: string, toStepId: string) => {
    if (!activeWorkflow) return;

    const newConnection: DemoWorkflowConnection = {
      id: `conn-${Date.now()}`,
      fromStep: fromStepId,
      toStep: toStepId
    };

    const updatedWorkflow = {
      ...activeWorkflow,
      connections: [...activeWorkflow.connections, newConnection]
    };

    setActiveWorkflow(updatedWorkflow);
    updateWorkflow(updatedWorkflow);
  };

  const categoryColors = {
    ai: 'bg-purple-500',
    security: 'bg-red-500',
    analytics: 'bg-blue-500',
    integration: 'bg-green-500',
    management: 'bg-orange-500'
  };

  if (!profile) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Select a demo profile to build workflows</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Workflow Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select 
            value={activeWorkflow?.id || ''} 
            onValueChange={(value) => {
              const workflow = workflows.find(w => w.id === value);
              setActiveWorkflow(workflow || null);
            }}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select workflow" />
            </SelectTrigger>
            <SelectContent>
              {workflows.map(workflow => (
                <SelectItem key={workflow.id} value={workflow.id}>
                  {workflow.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {activeWorkflow && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {activeWorkflow.steps.length} steps
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={isCreateWorkflowOpen} onOpenChange={setIsCreateWorkflowOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Workflow
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
              </DialogHeader>
              <WorkflowForm onSubmit={createWorkflow} />
            </DialogContent>
          </Dialog>

          {activeWorkflow && (
            <>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Test
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Workflow Builder Interface */}
      <div className="grid grid-cols-4 gap-4 h-[600px]">
        {/* Component Palette */}
        <div className="col-span-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-y-auto">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Components
          </h3>
          
          <div className="space-y-2">
            {Object.entries(
              enterpriseComponents.reduce((acc, component) => {
                if (!acc[component.category]) acc[component.category] = [];
                acc[component.category].push(component);
                return acc;
              }, {} as Record<string, EnterpriseSystemComponent[]>)
            ).map(([category, components]) => (
              <div key={category} className="space-y-1">
                <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  {category}
                </h4>
                {components.map(component => (
                  <motion.div
                    key={component.id}
                    draggable
                    onDragStart={(e) => handleDragStart(component, e as unknown as React.DragEvent<HTMLDivElement>)}
                    className="p-2 bg-white dark:bg-gray-700 rounded border cursor-move hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${categoryColors[component.category as keyof typeof categoryColors] || 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {component.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                      {component.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Canvas */}
        <div className="col-span-2 bg-white dark:bg-gray-900 rounded-lg border relative overflow-hidden">
          {/* Canvas Controls */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
            >
              +
            </Button>
            <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
            >
              -
            </Button>
          </div>

          {/* Canvas */}
          <div
            ref={canvasRef}
            className="w-full h-full relative"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: '0 0'
            }}
          >
            {/* Grid Background */}
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

            {/* Drop Zone Indicator */}
            {isDragging && (
              <motion.div
                className="absolute w-32 h-20 border-2 border-dashed border-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center"
                style={{
                  left: dragPosition.x - 64,
                  top: dragPosition.y - 40
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Plus className="h-6 w-6 text-purple-500" />
              </motion.div>
            )}

            {/* Workflow Steps */}
            {activeWorkflow?.steps.map(step => {
              const component = enterpriseComponents.find(c => c.id === step.componentId);
              return (
                <motion.div
                  key={step.id}
                  className={`absolute w-48 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 cursor-pointer shadow-lg ${
                    selectedStep?.id === step.id 
                      ? 'border-purple-500 shadow-purple-200 dark:shadow-purple-900' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  style={{
                    left: step.position.x,
                    top: step.position.y
                  }}
                  onClick={() => setSelectedStep(step)}
                  whileHover={{ scale: 1.02 }}
                  drag
                  onDragEnd={(_, info) => {
                    const newStep = {
                      ...step,
                      position: {
                        x: step.position.x + info.offset.x / zoom,
                        y: step.position.y + info.offset.y / zoom
                      }
                    };
                    
                    if (activeWorkflow) {
                      const updatedWorkflow = {
                        ...activeWorkflow,
                        steps: activeWorkflow.steps.map(s => s.id === step.id ? newStep : s)
                      };
                      setActiveWorkflow(updatedWorkflow);
                      updateWorkflow(updatedWorkflow);
                    }
                  }}
                >
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {component && (
                        <div className={`w-4 h-4 rounded ${categoryColors[component.category as keyof typeof categoryColors] || 'bg-gray-400'}`}></div>
                      )}
                      <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                        {step.title}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteStep(step.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Step Content */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {step.description}
                  </div>

                  {/* Step Type Badge */}
                  <Badge variant="secondary" className="text-xs">
                    {step.type}
                  </Badge>

                  {/* Connection Points */}
                  <div className="absolute -right-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 cursor-pointer hover:bg-blue-600"></div>
                  <div className="absolute -left-2 top-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 cursor-pointer hover:bg-green-600"></div>
                </motion.div>
              );
            })}

            {/* Workflow Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {activeWorkflow?.connections.map(connection => {
                const fromStep = activeWorkflow.steps.find(s => s.id === connection.fromStep);
                const toStep = activeWorkflow.steps.find(s => s.id === connection.toStep);
                
                if (!fromStep || !toStep) return null;

                const fromX = fromStep.position.x + 192; // 48 * 4 (w-48)
                const fromY = fromStep.position.y + 40; // Half height
                const toX = toStep.position.x;
                const toY = toStep.position.y + 40;

                return (
                  <g key={connection.id}>
                    <path
                      d={`M ${fromX} ${fromY} C ${fromX + 50} ${fromY}, ${toX - 50} ${toY}, ${toX} ${toY}`}
                      stroke="#8b5cf6"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                    />
                  </g>
                );
              })}
              
              {/* Arrow marker definition */}
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
                </marker>
              </defs>
            </svg>

            {/* Empty State */}
            {(!activeWorkflow || activeWorkflow.steps.length === 0) && !isDragging && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Move3D className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Drag components here</p>
                  <p className="text-sm">Build your demo workflow by dragging components from the left panel</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="col-span-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-y-auto">
          <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Properties
          </h3>

          {selectedStep ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="step-title">Title</Label>
                <Input
                  id="step-title"
                  value={selectedStep.title}
                  onChange={(e) => {
                    const updatedStep = { ...selectedStep, title: e.target.value };
                    setSelectedStep(updatedStep);
                    
                    if (activeWorkflow) {
                      const updatedWorkflow = {
                        ...activeWorkflow,
                        steps: activeWorkflow.steps.map(s => s.id === selectedStep.id ? updatedStep : s)
                      };
                      setActiveWorkflow(updatedWorkflow);
                      updateWorkflow(updatedWorkflow);
                    }
                  }}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="step-description">Description</Label>
                <Input
                  id="step-description"
                  value={selectedStep.description}
                  onChange={(e) => {
                    const updatedStep = { ...selectedStep, description: e.target.value };
                    setSelectedStep(updatedStep);
                    
                    if (activeWorkflow) {
                      const updatedWorkflow = {
                        ...activeWorkflow,
                        steps: activeWorkflow.steps.map(s => s.id === selectedStep.id ? updatedStep : s)
                      };
                      setActiveWorkflow(updatedWorkflow);
                      updateWorkflow(updatedWorkflow);
                    }
                  }}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Step Type</Label>
                <Badge variant="outline" className="mt-1">
                  {selectedStep.type}
                </Badge>
              </div>

              <div>
                <Label>Position</Label>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  X: {Math.round(selectedStep.position.x)}, Y: {Math.round(selectedStep.position.y)}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 hover:text-red-700"
                  onClick={() => deleteStep(selectedStep.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Step
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <MousePointer className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select a step to edit properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WorkflowForm({ onSubmit }: { onSubmit: (data: Partial<DemoWorkflowConfig>) => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    autoAdvance: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      steps: [],
      connections: [],
      variables: {},
      adaptations: {},
      timing: {},
      version: '1.0'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Workflow Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="autoAdvance"
          checked={formData.autoAdvance}
          onChange={(e) => setFormData({ ...formData, autoAdvance: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="autoAdvance">Auto advance steps</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          Create Workflow
        </Button>
      </div>
    </form>
  );
}
