
/**
 * CHUNK 1: WIDGET FACTORY OPTIMIZATION
 * Optimized version with React.memo, virtualization, and lazy loading
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { FixedSizeList as List } from 'react-window';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Palette,
  Plus,
  Save,
  Share2,
  Users,
  Grid,
  MousePointer,
  Type,
  Image as ImageIcon,
  BarChart3,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Home,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ErrorBoundary, WidgetErrorFallback } from '@/lib/error-handling/error-boundary';
import { logger, withPerformanceLogging } from '@/lib/error-handling/logger';
import { debounce, useAutoSave } from '@/lib/performance/debounce';
import { widgetAPI } from '@/lib/api/retry-fetch';
import Link from 'next/link';

// Lazy loaded components for better performance
const PropertiesPanel = dynamic(() => import('./properties-panel'), {
  loading: () => <div className="w-80 bg-gray-50 dark:bg-gray-800 animate-pulse" />,
  ssr: false,
});

const CollaborationBar = dynamic(() => import('./collaboration-bar'), {
  loading: () => <div className="h-12 bg-white dark:bg-gray-900 animate-pulse" />,
  ssr: false,
});

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

// Memoized widget template item for virtualization
const WidgetTemplateItem = React.memo(({ 
  index, 
  style, 
  data 
}: { 
  index: number; 
  style: React.CSSProperties; 
  data: { templates: WidgetTemplate[]; onAdd: (template: WidgetTemplate) => void } 
}) => {
  const template = data.templates[index];
  
  return (
    <div style={style} className="p-2">
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card 
          className="cursor-pointer hover:shadow-md transition-all duration-200 group h-full"
          onClick={() => data.onAdd(template)}
          role="button"
          tabIndex={0}
          aria-label={`Add ${template.name} widget`}
        >
          <CardContent className="p-3 h-full">
            <div className="flex items-center gap-3 h-full">
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
    </div>
  );
});

WidgetTemplateItem.displayName = 'WidgetTemplateItem';

// Memoized widget component
const WidgetComponent = React.memo(({ 
  widget, 
  isSelected, 
  onSelect 
}: { 
  widget: Widget; 
  isSelected: boolean; 
  onSelect: (id: string) => void 
}) => {
  const handleClick = useCallback(() => {
    onSelect(widget.id);
  }, [widget.id, onSelect]);

  return (
    <ErrorBoundary fallback={WidgetErrorFallback}>
      <motion.div
        className={`absolute cursor-move border-2 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow ${
          isSelected 
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
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`${widget.name} widget`}
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
        {isSelected && (
          <>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-se-resize" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-ne-resize" />
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-nw-resize" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border border-white rounded-full cursor-sw-resize" />
          </>
        )}
      </motion.div>
    </ErrorBoundary>
  );
});

WidgetComponent.displayName = 'WidgetComponent';

// Main optimized widget factory component
export const OptimizedWidgetFactory = React.memo(() => {
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [canvasMode, setCanvasMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Auto-save functionality
  const { save: autoSave } = useAutoSave(widgets, async (data) => {
    try {
      await widgetAPI.saveWidget({ widgets: data });
      logger.info('Widgets auto-saved successfully', { 
        component: 'widget-factory',
        widgetCount: data.length 
      });
    } catch (error) {
      logger.error('Auto-save failed', error as Error, { 
        component: 'widget-factory' 
      });
    }
  });

  // Debounced search
  const debouncedSearch = useMemo(
    () => debounce((term: string) => {
      logger.logPerformanceMetric('widget-search', performance.now());
    }, 300),
    []
  );

  // Filtered templates based on search
  const filteredTemplates = useMemo(() => {
    if (!searchTerm) return widgetTemplates;
    return widgetTemplates.filter(template =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Performance optimized add widget function
  const addWidget = useCallback(withPerformanceLogging((template: WidgetTemplate) => {
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
    autoSave();
    
    logger.logWidgetAction('added', newWidget.id, {
      tenantId: 'current-tenant', // Replace with actual tenant ID
      widgetType: template.id,
    });
  }, 'add-widget'), [autoSave]);

  const handleWidgetSelect = useCallback((id: string) => {
    setSelectedWidget(id);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  }, [debouncedSearch]);

  const getCanvasSize = useCallback(() => {
    switch (canvasMode) {
      case 'mobile': return { width: 375, height: 667 };
      case 'tablet': return { width: 768, height: 1024 };
      default: return { width: 1200, height: 800 };
    }
  }, [canvasMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      logger.logPerformanceMetric('widget-factory-load', performance.now());
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-save when widgets change
  useEffect(() => {
    if (widgets.length > 0) {
      autoSave();
    }
  }, [widgets, autoSave]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Palette className="h-8 w-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Initializing Widget Factory...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
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
                  Widget Factory Pro
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Optimized Performance Edition
                </p>
              </div>
            </div>

            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Auto-Save Active
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <CollaborationBar />
            
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
          {/* Sidebar - Widget Library with Virtualization */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Widget Library
              </h3>
              
              <Input
                placeholder="Search widgets..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-4"
              />
            </div>
            
            <div className="flex-1">
              <List
                height={400}
                itemCount={filteredTemplates.length}
                itemSize={100}
                itemData={{ templates: filteredTemplates, onAdd: addWidget }}
              >
                {WidgetTemplateItem}
              </List>
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
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-gray-100 dark:bg-gray-800 overflow-auto p-8">
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
                      backgroundImage: `radial-gradient(circle, #e5e7eb 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}
                  />

                  {/* Widgets */}
                  <AnimatePresence>
                    {widgets.map((widget) => (
                      <WidgetComponent
                        key={widget.id}
                        widget={widget}
                        isSelected={selectedWidget === widget.id}
                        onSelect={handleWidgetSelect}
                      />
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
                            Search and drag widgets from the library to begin building your interface.
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

          {/* Properties Panel - Lazy Loaded */}
          <PropertiesPanel 
            selectedWidget={selectedWidget}
            widgets={widgets}
            onUpdateWidget={(id, updates) => {
              setWidgets(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
            }}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
});

OptimizedWidgetFactory.displayName = 'OptimizedWidgetFactory';

export default OptimizedWidgetFactory;
