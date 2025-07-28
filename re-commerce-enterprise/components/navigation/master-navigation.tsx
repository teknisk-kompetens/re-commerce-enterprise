
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown,
  Brain,
  Shield,
  Zap,
  Database,
  BarChart3,
  Settings,
  Crown,
  Plug,
  FileText,
  TestTube,
  Activity,
  Globe,
  Users,
  Target,
  Layers,
  Command,
  Home,
  Palette,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  Eye,
  Cpu,
  Gauge,
  Building,
  Rocket,
  Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  description: string;
  badge?: string;
  category: string;
}

const navigationItems: NavigationItem[] = [
  // Core Platform
  { title: 'Home', href: '/', icon: Home, description: 'Enterprise platform overview', category: 'core' },
  { title: 'Dashboard', href: '/dashboard', icon: BarChart3, description: 'Scene-based enterprise dashboard', category: 'core' },
  { title: 'Enterprise Hub', href: '/enterprise-hub', icon: Building, description: 'Unified enterprise management', category: 'core' },
  { title: 'Command Center', href: '/command-center', icon: Command, description: 'Enterprise control panel', category: 'core' },
  
  // AI & Intelligence
  { title: 'AI Studio', href: '/ai-studio', icon: Brain, description: 'AI automation and intelligence platform', badge: 'ADVANCED', category: 'ai' },
  { title: 'AI Analytics', href: '/ai-analytics', icon: TrendingUp, description: 'AI-powered business analytics', category: 'ai' },
  { title: 'AI Insights', href: '/ai-insights', icon: Eye, description: 'Intelligent business insights', category: 'ai' },
  { title: 'Intelligent BI', href: '/intelligent-bi', icon: Gauge, description: 'AI-powered business intelligence', category: 'ai' },
  { title: 'ML Ops', href: '/ml-ops', icon: Cpu, description: 'Machine learning operations', category: 'ai' },
  
  // Security & Performance
  { title: 'Security Center', href: '/security-center', icon: Shield, description: 'Enterprise security monitoring', badge: 'CRITICAL', category: 'security' },
  { title: 'Performance Center', href: '/performance-center', icon: Zap, description: 'Performance optimization', category: 'security' },
  { title: 'System Health', href: '/system-health', icon: Activity, description: 'System monitoring and health', category: 'security' },
  
  // Integration & Operations
  { title: 'Widget Factory', href: '/widget-factory', icon: Palette, description: 'Advanced widget creation workspace', badge: 'POPULAR', category: 'operations' },
  { title: 'Integrations Hub', href: '/integrations-hub', icon: Plug, description: 'API and system integrations', category: 'operations' },
  { title: 'Analytics', href: '/analytics', icon: BarChart3, description: 'Business intelligence and reporting', category: 'operations' },
  { title: 'Testing Center', href: '/testing-center', icon: TestTube, description: 'Automated testing and validation', category: 'operations' },
  
  // Management & Governance
  { title: 'Demo Builder', href: '/demo-builder', icon: Wand2, description: 'Interactive demo builder with AI personalization', badge: 'REVOLUTIONARY', category: 'management' },
  { title: 'Executive Dashboard', href: '/executive-dashboard', icon: Crown, description: 'Executive-level insights', category: 'management' },
  { title: 'Governance Center', href: '/governance-center', icon: Globe, description: 'Compliance and governance', category: 'management' },
  { title: 'Documentation Center', href: '/documentation-center', icon: BookOpen, description: 'Comprehensive documentation', category: 'management' },
  { title: 'Go-Live Preparation', href: '/go-live-preparation', icon: Rocket, description: 'Production readiness checklist', category: 'management' }
];

const categoryConfig = {
  core: { label: 'Core Platform', color: 'bg-blue-500', description: 'Essential platform features' },
  ai: { label: 'AI & Intelligence', color: 'bg-purple-500', description: 'AI-powered automation and insights' },
  security: { label: 'Security & Performance', color: 'bg-red-500', description: 'Security monitoring and optimization' },
  operations: { label: 'Integration & Operations', color: 'bg-green-500', description: 'Operations and integration tools' },
  management: { label: 'Management & Governance', color: 'bg-orange-500', description: 'Executive and governance features' }
};

export function MasterNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-navigation-container]')) {
        setIsOpen(false);
        setActiveCategory(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveCategory(null);
  }, [pathname]);

  const categorizedItems = Object.keys(categoryConfig).reduce((acc, category) => {
    acc[category] = navigationItems.filter(item => item.category === category);
    return acc;
  }, {} as Record<string, NavigationItem[]>);

  return (
    <div className="relative" data-navigation-container>
      {/* Main Navigation Trigger */}
      <Button
        variant="ghost"
        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Open enterprise navigation menu"
      >
        <Layers className="h-5 w-5" />
        <span className="hidden md:inline">Enterprise Suite</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-screen max-w-6xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl z-50"
            style={{ minWidth: '800px' }}
            role="menu"
            aria-label="Enterprise navigation menu"
          >
            <div className="p-6">
              {/* Header */}
              <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Re-Commerce Enterprise Suite
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Access all enterprise features and capabilities
                </p>
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(categoryConfig).map(([categoryKey, config]) => (
                  <div key={categoryKey} className="space-y-3">
                    {/* Category Header */}
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${config.color}`}></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {config.label}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {config.description}
                        </p>
                      </div>
                    </div>

                    {/* Category Items */}
                    <div className="space-y-1">
                      {categorizedItems[categoryKey]?.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`group block p-3 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            pathname === item.href ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : ''
                          }`}
                          role="menuitem"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <item.icon className={`h-5 w-5 ${
                                pathname === item.href 
                                  ? 'text-blue-600 dark:text-blue-400' 
                                  : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                              }`} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className={`text-sm font-medium ${
                                  pathname === item.href 
                                    ? 'text-blue-900 dark:text-blue-100' 
                                    : 'text-gray-900 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white'
                                }`}>
                                  {item.title}
                                </p>
                                {item.badge && (
                                  <Badge 
                                    variant="secondary" 
                                    className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                  >
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Enterprise Platform v2.0 • All features operational
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 dark:text-green-400">System Healthy</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
