
'use client';

/**
 * BLUEPRINT DESIGNER
 * Visual designer for creating and managing widget blueprints
 * with template system and inheritance patterns
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Plus, 
  Copy, 
  Edit, 
  Trash2, 
  Download, 
  Upload,
  Settings,
  Code,
  Eye,
  Share,
  GitBranch,
  Zap
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { blueprintSystem } from '@/lib/blueprint-system';

interface BlueprintDesignerProps {
  canvasId: string;
}

interface BlueprintDefinition {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  type: 'widget' | 'layout' | 'page' | 'application';
  author: string;
  tags: string[];
  metadata: {
    created: Date;
    updated: Date;
    status: 'draft' | 'published' | 'deprecated';
    downloads: number;
    rating: number;
    isPublic: boolean;
  };
  composition: {
    widgets: any[];
    layouts: any[];
    connections: any[];
  };
}

const SAMPLE_BLUEPRINTS: BlueprintDefinition[] = [
  {
    id: 'dashboard-layout',
    name: 'Dashboard Layout',
    version: '1.0.0',
    description: 'Standard dashboard layout with header, sidebar, and main content area',
    category: 'Layout',
    type: 'layout',
    author: 'Layout Team',
    tags: ['dashboard', 'layout', 'standard'],
    metadata: {
      created: new Date('2024-02-01'),
      updated: new Date('2024-03-10'),
      status: 'published',
      downloads: 456,
      rating: 4.7,
      isPublic: true,
    },
    composition: {
      widgets: [],
      layouts: [],
      connections: [],
    },
  },
  {
    id: 'analytics-page',
    name: 'Analytics Page',
    version: '2.1.0',
    description: 'Complete analytics page with charts, metrics, and data tables',
    category: 'Page',
    type: 'page',
    author: 'Analytics Pro',
    tags: ['analytics', 'charts', 'data', 'metrics'],
    metadata: {
      created: new Date('2024-01-15'),
      updated: new Date('2024-03-12'),
      status: 'published',
      downloads: 789,
      rating: 4.9,
      isPublic: true,
    },
    composition: {
      widgets: [],
      layouts: [],
      connections: [],
    },
  },
  {
    id: 'form-collection',
    name: 'Form Collection',
    version: '1.5.0',
    description: 'Set of connected form widgets with validation and data flow',
    category: 'Widget Set',
    type: 'widget',
    author: 'Form Builder',
    tags: ['forms', 'validation', 'input', 'collection'],
    metadata: {
      created: new Date('2024-02-10'),
      updated: new Date('2024-03-08'),
      status: 'draft',
      downloads: 234,
      rating: 4.5,
      isPublic: false,
    },
    composition: {
      widgets: [],
      layouts: [],
      connections: [],
    },
  },
];

export function BlueprintDesigner({ canvasId }: BlueprintDesignerProps) {
  const [blueprints, setBlueprints] = useState<BlueprintDefinition[]>(SAMPLE_BLUEPRINTS);
  const [selectedBlueprint, setSelectedBlueprint] = useState<BlueprintDefinition | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');

  const [newBlueprint, setNewBlueprint] = useState({
    name: '',
    description: '',
    category: '',
    type: 'widget' as BlueprintDefinition['type'],
    tags: '',
  });

  const handleCreateBlueprint = useCallback(async () => {
    try {
      const blueprintData = {
        ...newBlueprint,
        id: crypto.randomUUID(),
        version: '1.0.0',
        author: 'Current User',
        tags: newBlueprint.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        metadata: {
          created: new Date(),
          updated: new Date(),
          status: 'draft' as const,
          downloads: 0,
          rating: 0,
          isPublic: false,
        },
        composition: {
          widgets: [],
          layouts: [],
          connections: [],
        },
      };

      setBlueprints(prev => [blueprintData, ...prev]);
      setSelectedBlueprint(blueprintData);
      setIsCreating(false);
      setNewBlueprint({
        name: '',
        description: '',
        category: '',
        type: 'widget',
        tags: '',
      });
      setActiveTab('design');
    } catch (error) {
      console.error('Error creating blueprint:', error);
    }
  }, [newBlueprint]);

  const handleDeleteBlueprint = useCallback((blueprintId: string) => {
    setBlueprints(prev => prev.filter(b => b.id !== blueprintId));
    if (selectedBlueprint?.id === blueprintId) {
      setSelectedBlueprint(null);
    }
  }, [selectedBlueprint]);

  const handleCloneBlueprint = useCallback((blueprint: BlueprintDefinition) => {
    const cloned = {
      ...blueprint,
      id: crypto.randomUUID(),
      name: `${blueprint.name} (Copy)`,
      version: '1.0.0',
      metadata: {
        ...blueprint.metadata,
        created: new Date(),
        updated: new Date(),
        status: 'draft' as const,
        downloads: 0,
      },
    };
    setBlueprints(prev => [cloned, ...prev]);
    setSelectedBlueprint(cloned);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Blueprint Designer
          </h2>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Blueprint
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Blueprint</DialogTitle>
                <DialogDescription>
                  Create a new blueprint template for reusable widget compositions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newBlueprint.name}
                    onChange={(e) => setNewBlueprint(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Blueprint name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newBlueprint.description}
                    onChange={(e) => setNewBlueprint(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this blueprint does"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newBlueprint.type}
                      onValueChange={(value) => setNewBlueprint(prev => ({ 
                        ...prev, 
                        type: value as BlueprintDefinition['type'] 
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="widget">Widget</SelectItem>
                        <SelectItem value="layout">Layout</SelectItem>
                        <SelectItem value="page">Page</SelectItem>
                        <SelectItem value="application">Application</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newBlueprint.category}
                      onChange={(e) => setNewBlueprint(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Dashboard, Form"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newBlueprint.tags}
                    onChange={(e) => setNewBlueprint(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="dashboard, analytics, charts"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateBlueprint}>
                    Create Blueprint
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} className="h-full">
          <TabsContent value="browse" className="h-full m-0">
            <BlueprintBrowser
              blueprints={blueprints}
              onSelect={setSelectedBlueprint}
              onDelete={handleDeleteBlueprint}
              onClone={handleCloneBlueprint}
            />
          </TabsContent>

          <TabsContent value="design" className="h-full m-0">
            {selectedBlueprint ? (
              <BlueprintDesignEditor
                blueprint={selectedBlueprint}
                canvasId={canvasId}
                onUpdate={(updated) => {
                  setBlueprints(prev => prev.map(b => 
                    b.id === updated.id ? updated : b
                  ));
                  setSelectedBlueprint(updated);
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Layers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Blueprint Selected
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Select a blueprint from the browser or create a new one to start designing.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="code" className="h-full m-0">
            {selectedBlueprint ? (
              <BlueprintCodeEditor
                blueprint={selectedBlueprint}
                onUpdate={(updated) => {
                  setBlueprints(prev => prev.map(b => 
                    b.id === updated.id ? updated : b
                  ));
                  setSelectedBlueprint(updated);
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Code className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Blueprint Selected
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Select a blueprint to view and edit its configuration code.
                  </p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Blueprint Browser Component
interface BlueprintBrowserProps {
  blueprints: BlueprintDefinition[];
  onSelect: (blueprint: BlueprintDefinition) => void;
  onDelete: (blueprintId: string) => void;
  onClone: (blueprint: BlueprintDefinition) => void;
}

function BlueprintBrowser({ blueprints, onSelect, onDelete, onClone }: BlueprintBrowserProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {blueprints.map((blueprint) => (
          <Card 
            key={blueprint.id} 
            className="cursor-pointer hover:shadow-md transition-shadow bg-white dark:bg-gray-900"
            onClick={() => onSelect(blueprint)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <CardTitle className="text-base truncate">{blueprint.name}</CardTitle>
                    <Badge 
                      variant={blueprint.metadata.status === 'published' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {blueprint.metadata.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {blueprint.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {blueprint.description}
                  </p>
                </div>
                <div className="flex items-center space-x-1 ml-4">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClone(blueprint);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(blueprint.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1 mb-3">
                {blueprint.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-3">
                  <span>v{blueprint.version}</span>
                  <span>by {blueprint.author}</span>
                  <div className="flex items-center">
                    <Download className="h-3 w-3 mr-1" />
                    {blueprint.metadata.downloads}
                  </div>
                </div>
                <span>Updated {formatDate(blueprint.metadata.updated)}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {blueprints.length === 0 && (
          <div className="text-center py-12">
            <Layers className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No Blueprints Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Create your first blueprint to get started with template-based widget creation.
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

// Blueprint Design Editor Component
interface BlueprintDesignEditorProps {
  blueprint: BlueprintDefinition;
  canvasId: string;
  onUpdate: (blueprint: BlueprintDefinition) => void;
}

function BlueprintDesignEditor({ blueprint, canvasId, onUpdate }: BlueprintDesignEditorProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{blueprint.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Design your blueprint composition
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" size="sm">
              <Zap className="h-4 w-4 mr-2" />
              Apply to Canvas
            </Button>
            <Button size="sm">
              <Share className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="h-full bg-gray-100 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
          <div className="text-center">
            <GitBranch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Blueprint Design Editor
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Visual blueprint composition editor coming soon.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              For now, use the code editor to configure your blueprint.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Blueprint Code Editor Component
interface BlueprintCodeEditorProps {
  blueprint: BlueprintDefinition;
  onUpdate: (blueprint: BlueprintDefinition) => void;
}

function BlueprintCodeEditor({ blueprint, onUpdate }: BlueprintCodeEditorProps) {
  const [code, setCode] = useState(JSON.stringify(blueprint, null, 2));

  const handleSave = useCallback(() => {
    try {
      const updated = JSON.parse(code);
      onUpdate(updated);
    } catch (error) {
      console.error('Invalid JSON:', error);
    }
  }, [code, onUpdate]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{blueprint.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Edit blueprint configuration
            </p>
          </div>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4">
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="h-full font-mono text-sm resize-none"
          placeholder="Blueprint configuration..."
        />
      </div>
    </div>
  );
}

function formatDate(date: Date) {
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    'day'
  );
}
