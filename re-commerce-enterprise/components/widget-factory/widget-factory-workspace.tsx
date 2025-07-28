
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Palette,
  Plus,
  Save,
  Download,
  Upload,
  Share2,
  Settings,
  Users,
  Layers,
  Grid,
  MousePointer,
  Type,
  Image as ImageIcon,
  BarChart3,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Code,
  Smartphone,
  Monitor,
  Tablet,
  Home,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary, ComponentErrorFallback } from '@/components/error-boundary';
import { LoadingStates } from '@/components/loading-states';
import Link from 'next/link';

interface Widget {
  id: string;
  name: string;
  type: string;
  category: string;
  x: number;
  y: number;
  width: number;
  height: number;
  properties: Record<string, any>;
}

interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  preview: string;
}

const widgetTemplates: WidgetTemplate[] = [
  {
    id: 'chart-bar',
    name: 'Bar Chart',
    description: 'Interactive bar chart for data visualization',
    category: 'Charts',
    icon: BarChart3,
    preview: 'chart-preview.png'
  },
  {
    id: 'text-block',
    name: 'Text Block',
    description: 'Rich text content with formatting options',
    category: 'Content',
    icon: Type,
    preview: 'text-preview.png'
  },
  {
    id: 'image-gallery',
    name: 'Image Gallery',
    description: 'Responsive image gallery with lightbox',
    category: 'Media',
    icon: ImageIcon,
    preview: 'gallery-preview.png'
  },
  {
    id: 'button-group',
    name: 'Button Group',
    description: 'Customizable button components',
    category: 'Interactive',
    icon: MousePointer,
    preview: 'button-preview.png'
  }
];

export function WidgetFactoryWorkspace() {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('canvas');
  const [canvasMode, setCanvasMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(true);
  const [collaborators, setCollaborators] = useState([
    { id: '1', name: 'John Doe', avatar: 'JD', status: 'active' },
    { id: '2', name: 'Jane Smith', avatar: 'JS', status: 'active' },
    { id: '3', name: 'Mike Johnson', avatar: 'MJ', status: 'idle' }
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const addWidget = (template: WidgetTemplate) => {
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      name: template.name,
      type: template.id,
      category: template.category,
      x: Math.random() * 400,
      y: Math.random() * 300,
      width: 200,
      height: 150,
      properties: {
        title: template.name,
        description: template.description
      }
    };

    setWidgets(prev => [...prev, newWidget]);
    setSelectedWidget(newWidget.id);
  };

  const getCanvasSize = () => {
    switch (canvasMode) {
      case 'mobile': return { width: 375, height: 667 };
      case 'tablet': return { width: 768, height: 1024 };
      default: return { width: 1200, height: 800 };
    }
  };

  if (isLoading) {
    return <LoadingStates.PageLoading message="Initializing Widget Factory..." />;
  }

  return (
    <ErrorBoundary fallback={ComponentErrorFallback}>
      <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
        {/* Header */}
        <header 
          className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
          role="banner"
        >
          <div className="flex items-center gap-4">
            <Link href="/" aria-label="Return to home page">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <Home className="h-4 w-4" />
              </Button>
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Widget Factory
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Advanced Widget Creation Workspace
                </p>
              </div>
            </div>

            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live Collaboration
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* Collaborators */}
            <div className="flex items-center gap-2 mr-4">
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <div className="flex -space-x-1">
                {collaborators.map((collaborator) => (
                  <div
                    key={collaborator.id}
                    className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium border-2 border-white dark:border-gray-900 ${
                      collaborator.status === 'active' ? 'ring-2 ring-green-400' : ''
                    }`}
                    title={`${collaborator.name} (${collaborator.status})`}
                  >
                    {collaborator.avatar}
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <Button variant="outline" size="sm" aria-label="Save project">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            
            <Button variant="outline" size="sm" aria-label="Share project">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Button size="sm" aria-label="Preview project">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </header>

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Widget Library */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Widget Library
              </h3>
              
              <div className="space-y-3">
                {widgetTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-all duration-200 group"
                      onClick={() => addWidget(template)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Add ${template.name} widget`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          addWidget(template);
                        }
                      }}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/40 transition-colors">
                            <template.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                              {template.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {template.description}
                            </p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 space-y-2">
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  Quick Actions
                </h4>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Widget
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Code className="h-4 w-4 mr-2" />
                  Custom Code
                </Button>
              </div>
            </div>
          </div>

          {/* Main Canvas Area */}
          <div className="flex-1 flex flex-col">
            {/* Canvas Toolbar */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Canvas:
                </span>
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <Button
                    variant={canvasMode === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCanvasMode('desktop')}
                    aria-label="Desktop view"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={canvasMode === 'tablet' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCanvasMode('tablet')}
                    aria-label="Tablet view"
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={canvasMode === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setCanvasMode('mobile')}
                    aria-label="Mobile view"
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {widgets.length} widgets
                </span>
                <Button variant="ghost" size="sm" aria-label="Grid settings">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" aria-label="Layers panel">
                  <Layers className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Canvas */}
            <div 
              className="flex-1 bg-gray-100 dark:bg-gray-800 overflow-auto p-8"
              role="application"
              aria-label="Widget canvas"
            >
              <div className="flex justify-center">
                <motion.div
                  className="bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden"
                  style={getCanvasSize()}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Canvas Grid */}
                  <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle, #e5e7eb 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px'
                    }}
                  />

                  {/* Widgets */}
                  <AnimatePresence>
                    {widgets.map((widget) => (
                      <motion.div
                        key={widget.id}
                        className={`absolute cursor-move border-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow ${
                          selectedWidget === widget.id 
                            ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                        style={{
                          left: widget.x,
                          top: widget.y,
                          width: widget.width,
                          height: widget.height
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setSelectedWidget(widget.id)}
                        role="button"
                        tabIndex={0}
                        aria-label={`${widget.name} widget`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedWidget(widget.id);
                          }
                        }}
                      >
                        <div className="p-3 h-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                              <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                              {widget.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {widget.category}
                            </p>
                          </div>
                        </div>

                        {/* Resize Handles */}
                        {selectedWidget === widget.id && (
                          <>
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize" />
                            <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize" />
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize" />
                          </>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Empty State */}
                  {widgets.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto">
                          <Palette className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Start Creating
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                            Drag widgets from the library to begin building your interface. 
                            Collaborate in real-time with your team.
                          </p>
                        </div>
                        <Button onClick={() => addWidget(widgetTemplates[0])}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Widget
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Properties
              </h3>

              {selectedWidget ? (
                <ErrorBoundary fallback={ComponentErrorFallback}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="widget-name">Widget Name</Label>
                      <Input
                        id="widget-name"
                        defaultValue={widgets.find(w => w.id === selectedWidget)?.name}
                        aria-describedby="widget-name-desc"
                      />
                      <p id="widget-name-desc" className="text-xs text-gray-500 dark:text-gray-400">
                        Display name for this widget
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label htmlFor="widget-width">Width</Label>
                        <Input
                          id="widget-width"
                          type="number"
                          defaultValue={widgets.find(w => w.id === selectedWidget)?.width}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="widget-height">Height</Label>
                        <Input
                          id="widget-height"
                          type="number"
                          defaultValue={widgets.find(w => w.id === selectedWidget)?.height}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Actions</Label>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="h-3 w-3 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </ErrorBoundary>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <MousePointer className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Select a widget to edit its properties
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
