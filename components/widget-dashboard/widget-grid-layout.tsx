
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Grid,
  Search,
  Filter,
  MoreVertical,
  Maximize2,
  Minimize2,
  Settings,
  Star,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
  Activity,
  Shield,
  Brain,
  Zap,
  Database,
  Globe,
  Target,
  Award,
  CheckCircle2,
  ArrowRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface WidgetConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  size: 'small' | 'medium' | 'large';
  color: string;
  gradient: string;
  metrics?: {
    value: string;
    change: string;
    trend: 'up' | 'down' | 'stable';
  };
  status?: 'active' | 'warning' | 'error' | 'success';
  lastUpdated?: string;
}

const widgetConfigs: WidgetConfig[] = [
  {
    id: 'command-center',
    title: 'Command Center',
    description: 'Enterprise control panel with real-time monitoring',
    icon: Grid,
    href: '/command-center',
    category: 'Core',
    priority: 'high',
    size: 'large',
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
    metrics: { value: '98.7%', change: '+2.1%', trend: 'up' },
    status: 'active'
  },
  {
    id: 'analytics',
    title: 'Advanced Analytics',
    description: 'Data visualization and business intelligence',
    icon: BarChart3,
    href: '/advanced-analytics-dashboard',
    category: 'Analytics',
    priority: 'high',
    size: 'medium',
    color: 'bg-green-500',
    gradient: 'from-green-500 to-green-600',
    metrics: { value: '1,247', change: '+7.9%', trend: 'up' },
    status: 'active'
  },
  {
    id: 'ai-insights',
    title: 'AI Insights',
    description: 'Machine learning powered recommendations',
    icon: Brain,
    href: '/ai-insights',
    category: 'AI',
    priority: 'high',
    size: 'medium',
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-purple-600',
    metrics: { value: '94.2%', change: '+4.4%', trend: 'up' },
    status: 'active'
  },
  {
    id: 'security',
    title: 'Security Center',
    description: 'Comprehensive security monitoring and alerts',
    icon: Shield,
    href: '/security-center',
    category: 'Security',
    priority: 'high',
    size: 'medium',
    color: 'bg-red-500',
    gradient: 'from-red-500 to-red-600',
    status: 'success'
  },
  {
    id: 'performance',
    title: 'Performance Center',
    description: 'System performance optimization and monitoring',
    icon: Zap,
    href: '/performance-center',
    category: 'Performance',
    priority: 'medium',
    size: 'medium',
    color: 'bg-yellow-500',
    gradient: 'from-yellow-500 to-yellow-600',
    status: 'active'
  },
  {
    id: 'widget-factory',
    title: 'Widget Factory',
    description: 'Create and customize dashboard widgets',
    icon: Settings,
    href: '/widget-factory',
    category: 'Tools',
    priority: 'medium',
    size: 'medium',
    color: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-indigo-600',
    status: 'active'
  },
  {
    id: 'system-health',
    title: 'System Health',
    description: 'Real-time system monitoring and diagnostics',
    icon: Activity,
    href: '/system-health',
    category: 'Monitoring',
    priority: 'high',
    size: 'small',
    color: 'bg-teal-500',
    gradient: 'from-teal-500 to-teal-600',
    status: 'active'
  },
  {
    id: 'user-management',
    title: 'User Management',
    description: 'Manage users, roles, and permissions',
    icon: Users,
    href: '/user-management',
    category: 'Admin',
    priority: 'medium',
    size: 'small',
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-orange-600',
    status: 'active'
  },
  {
    id: 'integrations',
    title: 'Integration Hub',
    description: 'Connect with external services and APIs',
    icon: Globe,
    href: '/integrations-hub',
    category: 'Integration',
    priority: 'medium',
    size: 'small',
    color: 'bg-cyan-500',
    gradient: 'from-cyan-500 to-cyan-600',
    status: 'active'
  },
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'Comprehensive platform documentation',
    icon: Database,
    href: '/documentation-center',
    category: 'Resources',
    priority: 'low',
    size: 'small',
    color: 'bg-gray-500',
    gradient: 'from-gray-500 to-gray-600',
    status: 'active'
  }
];

export function WidgetGridLayout() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(widgetConfigs.map(w => w.category)));
    return ['all', ...cats];
  }, []);

  const filteredWidgets = useMemo(() => {
    return widgetConfigs.filter(widget => {
      const matchesSearch = widget.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           widget.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const toggleFavorite = (widgetId: string) => {
    setFavorites(prev => 
      prev.includes(widgetId) 
        ? prev.filter(id => id !== widgetId)
        : [...prev, widgetId]
    );
  };

  const getGridClass = (size: string) => {
    switch (size) {
      case 'large': return 'col-span-2 row-span-2';
      case 'medium': return 'col-span-1 row-span-1';
      case 'small': return 'col-span-1 row-span-1';
      default: return 'col-span-1 row-span-1';
    }
  };

  const WidgetCard = ({ widget }: { widget: WidgetConfig }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${getGridClass(widget.size)} group`}
    >
      <Link href={widget.href}>
        <Card className="h-full cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden relative">
          {/* Background Gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${widget.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
          
          <CardHeader className="pb-2 relative">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${widget.gradient} shadow-lg group-hover:shadow-xl transition-shadow`}>
                <widget.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(widget.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Star className={`h-4 w-4 ${favorites.includes(widget.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                </Button>
                {widget.status && (
                  <div className={`w-3 h-3 rounded-full ${
                    widget.status === 'active' ? 'bg-green-500' :
                    widget.status === 'warning' ? 'bg-yellow-500' :
                    widget.status === 'error' ? 'bg-red-500' :
                    'bg-blue-500'
                  } animate-pulse`} />
                )}
              </div>
            </div>
            
            <div className="mt-4">
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {widget.title}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {widget.description}
              </p>
            </div>
          </CardHeader>

          <CardContent className="pt-0 relative">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {widget.category}
              </Badge>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
            </div>

            {widget.metrics && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {widget.metrics.value}
                  </span>
                  <div className={`flex items-center gap-1 text-sm ${
                    widget.metrics.trend === 'up' ? 'text-green-600' : 
                    widget.metrics.trend === 'down' ? 'text-red-600' : 
                    'text-gray-600'
                  }`}>
                    <TrendingUp className="h-3 w-3" />
                    {widget.metrics.change}
                  </div>
                </div>
              </div>
            )}

            {widget.priority === 'high' && (
              <div className="absolute top-2 right-2">
                <Badge variant="destructive" className="text-xs">
                  Priority
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Enterprise Widget Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Unified access to all platform features and tools
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search widgets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Widget Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr"
        >
          <AnimatePresence>
            {filteredWidgets.map((widget) => (
              <WidgetCard key={widget.id} widget={widget} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredWidgets.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No widgets found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WidgetGridLayout;
