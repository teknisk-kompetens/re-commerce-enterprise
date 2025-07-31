
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Palette,
  Layout,
  Layers,
  Settings,
  Image as ImageIcon,
  Monitor,
  Smartphone,
  Tablet,
  Eye,
  Save,
  Share2,
  Grid,
  Plus,
  Maximize2,
  RotateCcw,
  Download
} from 'lucide-react';
import Image from 'next/image';

interface SceneTab {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  mockImage: string;
  category: 'layout' | 'components' | 'themes' | 'advanced';
}

const sceneTabs: SceneTab[] = [
  {
    id: 'admin-panel',
    name: 'Admin Panel',
    description: 'Clean administrative interface with sidebar navigation',
    icon: Layout,
    mockImage: '/mock_images/Light_Theme_Admin_Panel.png',
    category: 'layout'
  },
  {
    id: 'clean-interface',
    name: 'Clean Interface',
    description: 'Minimalist design with focus on content',
    icon: Monitor,
    mockImage: '/mock_images/Light_Theme_Clean_Interface.png',
    category: 'themes'
  },
  {
    id: 'scene-excellence',
    name: 'Scene Excellence',
    description: 'Premium layout with advanced components',
    icon: Layers,
    mockImage: '/mock_images/Light_Theme_Scene_Excellence.png',
    category: 'advanced'
  },
  {
    id: 'widget-management',
    name: 'Widget Management',
    description: 'Specialized interface for widget configuration',
    icon: Settings,
    mockImage: '/mock_images/Light_Theme_Widget_Management.png',
    category: 'components'
  },
  {
    id: 'enterprise-dashboard',
    name: 'Enterprise Dashboard',
    description: 'Material Design enterprise-grade dashboard',
    icon: Grid,
    mockImage: '/mock_images/Material_Design_Enterprise_Dashboard.png',
    category: 'layout'
  },
  {
    id: 'advanced-layout',
    name: 'Advanced Layout',
    description: 'Complex multi-panel layout system',
    icon: Maximize2,
    mockImage: '/mock_images/Scene_Builder_Advanced_Layout.png',
    category: 'advanced'
  },
  {
    id: 'component-library',
    name: 'Component Library',
    description: 'Comprehensive UI component showcase',
    icon: Palette,
    mockImage: '/mock_images/Scene_Builder_Component_Library.png',
    category: 'components'
  },
  {
    id: 'master-reference',
    name: 'Master Reference',
    description: 'Complete design system reference',
    icon: Eye,
    mockImage: '/mock_images/Scene_Builder_Master_Reference.png',
    category: 'advanced'
  },
  {
    id: 'widget-canvas',
    name: 'Widget Canvas',
    description: 'Interactive widget design workspace',
    icon: ImageIcon,
    mockImage: '/mock_images/Scene_Builder_Widget_Canvas.png',
    category: 'components'
  },
  {
    id: 'professional-interface',
    name: 'Professional Interface',
    description: 'Swedish enterprise professional design',
    icon: Monitor,
    mockImage: '/mock_images/Swedish_Enterprise_Professional_Interface.png',
    category: 'themes'
  },
  {
    id: 'architecture-monitoring',
    name: 'Architecture Monitoring',
    description: 'Technical architecture monitoring dashboard',
    icon: Settings,
    mockImage: '/mock_images/Technical_Architecture_Monitoring.png',
    category: 'advanced'
  },
  {
    id: 'architecture-sidebar',
    name: 'Architecture Sidebar',
    description: 'Technical sidebar navigation system',
    icon: Layout,
    mockImage: '/mock_images/Technical_Architecture_Sidebar.png',
    category: 'layout'
  }
];

export function SceneBuilderTabs() {
  const [activeTab, setActiveTab] = useState('layout');
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const categories = [
    { id: 'layout', name: 'Layouts', icon: Layout, count: sceneTabs.filter(s => s.category === 'layout').length },
    { id: 'components', name: 'Components', icon: Palette, count: sceneTabs.filter(s => s.category === 'components').length },
    { id: 'themes', name: 'Themes', icon: Monitor, count: sceneTabs.filter(s => s.category === 'themes').length },
    { id: 'advanced', name: 'Advanced', icon: Layers, count: sceneTabs.filter(s => s.category === 'advanced').length }
  ];

  const filteredScenes = sceneTabs.filter(scene => scene.category === activeTab);

  const SceneCard = ({ scene }: { scene: SceneTab }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer"
      onClick={() => setSelectedScene(scene.id)}
    >
      <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          <Image
            src={scene.mockImage}
            alt={scene.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* Overlay Actions */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {/* Category Badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-white/90 text-gray-900">
              {scene.category}
            </Badge>
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <scene.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {scene.name}
                </CardTitle>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {scene.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Use Template
              </Button>
            </div>
            <Button size="sm" variant="ghost">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Scene Builder Pro
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Professional interface templates and components
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <Button
                  variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'tablet' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>

              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Project
              </Button>
              
              <Button>
                <Share2 className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="flex items-center gap-2"
              >
                <category.icon className="h-4 w-4" />
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-0">
              <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <AnimatePresence>
                  {filteredScenes.map((scene) => (
                    <SceneCard key={scene.id} scene={scene} />
                  ))}
                </AnimatePresence>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Empty State */}
        {filteredScenes.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Layers className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No scenes available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Scenes for this category are being prepared
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SceneBuilderTabs;
