
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Grid,
  List,
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
  Settings,
  Home,
  Plus,
  Filter,
  MoreVertical,
  Smartphone,
  Download,
  Share2
} from 'lucide-react';
import Link from 'next/link';

interface AppIcon {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  category: string;
  color: string;
  gradient: string;
  isNew?: boolean;
  isPopular?: boolean;
  notifications?: number;
  lastUsed?: string;
}

const appIcons: AppIcon[] = [
  {
    id: 'command-center',
    name: 'Command Center',
    description: 'Enterprise control panel',
    icon: Grid,
    href: '/command-center',
    category: 'Core',
    color: '#3B82F6',
    gradient: 'from-blue-400 to-blue-600',
    isPopular: true,
    notifications: 3
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Data insights',
    icon: BarChart3,
    href: '/advanced-analytics-dashboard',
    category: 'Analytics',
    color: '#10B981',
    gradient: 'from-green-400 to-green-600',
    isPopular: true
  },
  {
    id: 'ai-insights',
    name: 'AI Insights',
    description: 'Machine learning',
    icon: Brain,
    href: '/ai-insights',
    category: 'AI',
    color: '#8B5CF6',
    gradient: 'from-purple-400 to-purple-600',
    isNew: true
  },
  {
    id: 'security',
    name: 'Security',
    description: 'Security center',
    icon: Shield,
    href: '/security-center',
    category: 'Security',
    color: '#EF4444',
    gradient: 'from-red-400 to-red-600',
    notifications: 1
  },
  {
    id: 'performance',
    name: 'Performance',
    description: 'System optimization',
    icon: Zap,
    href: '/performance-center',
    category: 'Performance',
    color: '#F59E0B',
    gradient: 'from-yellow-400 to-yellow-600'
  },
  {
    id: 'widget-factory',
    name: 'Widget Factory',
    description: 'Create widgets',
    icon: Settings,
    href: '/widget-factory',
    category: 'Tools',
    color: '#6366F1',
    gradient: 'from-indigo-400 to-indigo-600'
  },
  {
    id: 'system-health',
    name: 'System Health',
    description: 'Health monitoring',
    icon: Activity,
    href: '/system-health',
    category: 'Monitoring',
    color: '#14B8A6',
    gradient: 'from-teal-400 to-teal-600'
  },
  {
    id: 'users',
    name: 'Users',
    description: 'User management',
    icon: Users,
    href: '/user-management',
    category: 'Admin',
    color: '#F97316',
    gradient: 'from-orange-400 to-orange-600'
  },
  {
    id: 'integrations',
    name: 'Integrations',
    description: 'API connections',
    icon: Globe,
    href: '/integrations-hub',
    category: 'Integration',
    color: '#06B6D4',
    gradient: 'from-cyan-400 to-cyan-600'
  },
  {
    id: 'documentation',
    name: 'Docs',
    description: 'Documentation',
    icon: Database,
    href: '/documentation-center',
    category: 'Resources',
    color: '#6B7280',
    gradient: 'from-gray-400 to-gray-600'
  },
  {
    id: 'scene-builder',
    name: 'Scene Builder',
    description: 'UI templates',
    icon: Target,
    href: '/scene-builder',
    category: 'Design',
    color: '#EC4899',
    gradient: 'from-pink-400 to-pink-600',
    isNew: true
  },
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Main dashboard',
    icon: Home,
    href: '/dashboard',
    category: 'Core',
    color: '#8B5CF6',
    gradient: 'from-violet-400 to-violet-600'
  }
];

export function SmartphoneGrid() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<string[]>(['command-center', 'analytics']);

  const categories = ['all', 'Core', 'Analytics', 'AI', 'Security', 'Tools', 'Admin'];

  const filteredApps = appIcons.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (appId: string) => {
    setFavorites(prev => 
      prev.includes(appId) 
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    );
  };

  const AppIconComponent = ({ app, index }: { app: AppIcon; index: number }) => (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="group relative"
    >
      <Link href={app.href}>
        <div className="relative">
          {/* App Icon */}
          <div 
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden`}
            style={{ 
              boxShadow: `0 4px 20px ${app.color}30` 
            }}
          >
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <app.icon className="h-8 w-8 text-white relative z-10" />
            
            {/* Notification Badge */}
            {app.notifications && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {app.notifications}
                </span>
              </div>
            )}

            {/* New Badge */}
            {app.isNew && (
              <div className="absolute -top-1 -left-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </div>
            )}

            {/* Popular Badge */}
            {app.isPopular && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <Star className="h-2 w-2 text-white fill-current" />
              </div>
            )}
          </div>

          {/* App Name */}
          <div className="mt-2 text-center">
            <h3 className="text-xs font-medium text-gray-900 dark:text-white truncate">
              {app.name}
            </h3>
          </div>

          {/* Favorite Indicator */}
          {favorites.includes(app.id) && (
            <div className="absolute top-0 left-0 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white" />
          )}
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Status Bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-2 text-white text-sm">
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="w-1 h-1 bg-white/50 rounded-full" />
          </div>
          <span className="ml-2 text-xs">Enterprise</span>
        </div>
        <div className="text-xs font-medium">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-6 h-3 border border-white/50 rounded-sm">
            <div className="w-4 h-1 bg-green-400 rounded-sm m-0.5" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 py-8">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <h1 className="text-2xl font-bold text-white mb-2">
              Enterprise Suite
            </h1>
            <p className="text-blue-200 text-sm">
              {filteredApps.length} apps available
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative mb-6"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search apps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-white/10 border-white/20 text-white placeholder-gray-300 rounded-2xl backdrop-blur-sm"
              />
            </div>
          </motion.div>

          {/* Category Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-2 overflow-x-auto pb-2 mb-6"
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap rounded-full ${
                  selectedCategory === category
                    ? 'bg-white text-gray-900'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </Button>
            ))}
          </motion.div>
        </div>

        {/* App Grid */}
        <motion.div 
          layout
          className="grid grid-cols-4 gap-6 px-4"
        >
          <AnimatePresence>
            {filteredApps.map((app, index) => (
              <AppIconComponent key={app.id} app={app} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredApps.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-white/60" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              No apps found
            </h3>
            <p className="text-blue-200">
              Try adjusting your search or category filter
            </p>
          </motion.div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-lg border-t border-white/10">
        <div className="flex items-center justify-around py-4">
          <Button variant="ghost" size="sm" className="text-white">
            <Home className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white/60">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white/60">
            <Star className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="text-white/60">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SmartphoneGrid;
