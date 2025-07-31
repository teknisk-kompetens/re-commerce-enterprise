
'use client';

import { useState, useEffect } from 'react';
import { WidgetGridLayout } from '@/components/widget-dashboard/widget-grid-layout';
import { SmartphoneGrid } from '@/components/app-container/smartphone-grid';
import { SceneBuilderTabs } from '@/components/scene-builder/scene-builder-tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Grid, 
  Smartphone, 
  Layers, 
  Monitor,
  Crown,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ViewMode = 'widgets' | 'mobile' | 'scenes';

export default function HomePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('widgets');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and then show widget view as default
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
            <Crown className="h-10 w-10 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Re-Commerce Enterprise
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Initializing Widget-First Experience...
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* View Mode Selector */}
      <div className="fixed top-4 right-4 z-50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2"
        >
          <Button
            variant={viewMode === 'widgets' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('widgets')}
            className="rounded-xl"
          >
            <Grid className="h-4 w-4 mr-2" />
            Widgets
            {viewMode === 'widgets' && (
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
                Default
              </Badge>
            )}
          </Button>
          
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('mobile')}
            className="rounded-xl"
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile
          </Button>
          
          <Button
            variant={viewMode === 'scenes' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('scenes')}
            className="rounded-xl"
          >
            <Layers className="h-4 w-4 mr-2" />
            Scenes
            <Badge variant="outline" className="ml-2">
              <Sparkles className="h-3 w-3 mr-1" />
              New
            </Badge>
          </Button>
        </motion.div>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {viewMode === 'widgets' && (
          <motion.div
            key="widgets"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <WidgetGridLayout />
          </motion.div>
        )}
        
        {viewMode === 'mobile' && (
          <motion.div
            key="mobile"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <SmartphoneGrid />
          </motion.div>
        )}
        
        {viewMode === 'scenes' && (
          <motion.div
            key="scenes"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SceneBuilderTabs />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Crown className="h-6 w-6" />
        </Button>
      </motion.div>
    </div>
  );
}
