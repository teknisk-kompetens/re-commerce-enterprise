
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
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
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Palette,
  BookOpen,
  Rocket,
  Eye,
  Cpu,
  Gauge,
  Building,
  Command
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ErrorBoundary } from '@/components/error-boundary';
import { LoadingStates } from '@/components/loading-states';

interface EnterpriseFeature {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<any>;
  category: string;
  status: 'operational' | 'beta' | 'new';
  metrics?: {
    label: string;
    value: string | number;
    change?: string;
  }[];
  badge?: string;
}

const enterpriseFeatures: EnterpriseFeature[] = [
  // Core Platform
  {
    id: 'dashboard',
    title: 'Enterprise Dashboard',
    description: 'Scene-based immersive dashboard with cinematic navigation',
    href: '/dashboard',
    icon: BarChart3,
    category: 'Core Platform',
    status: 'operational',
    metrics: [
      { label: 'Active Scenes', value: 5 },
      { label: 'Users', value: '1.2K' }
    ]
  },
  {
    id: 'enterprise-hub',
    title: 'Enterprise Hub',
    description: 'Unified enterprise management and control center',
    href: '/enterprise-hub',
    icon: Building,
    category: 'Core Platform',
    status: 'operational'
  },
  {
    id: 'command-center',
    title: 'Command Center',
    description: 'Executive control panel with comprehensive oversight',
    href: '/command-center',
    icon: Command,
    category: 'Core Platform',
    status: 'operational',
    badge: 'EXECUTIVE'
  },

  // AI & Intelligence
  {
    id: 'ai-studio',
    title: 'AI Studio',
    description: 'Revolutionary AI automation and intelligence platform',
    href: '/ai-studio',
    icon: Brain,
    category: 'AI & Intelligence',
    status: 'operational',
    badge: 'ADVANCED',
    metrics: [
      { label: 'Active Workflows', value: 127 },
      { label: 'Accuracy', value: '94.7%' },
      { label: 'Predictions', value: '8.4K' }
    ]
  },
  {
    id: 'ai-analytics',
    title: 'AI Analytics',
    description: 'AI-powered business analytics and insights',
    href: '/ai-analytics',
    icon: TrendingUp,
    category: 'AI & Intelligence',
    status: 'operational'
  },
  {
    id: 'ai-insights',
    title: 'AI Insights',
    description: 'Intelligent business insights and recommendations',
    href: '/ai-insights',
    icon: Eye,
    category: 'AI & Intelligence',
    status: 'operational'
  },
  {
    id: 'intelligent-bi',
    title: 'Intelligent BI',
    description: 'AI-powered business intelligence dashboards',
    href: '/intelligent-bi',
    icon: Gauge,
    category: 'AI & Intelligence',
    status: 'operational'
  },
  {
    id: 'ml-ops',
    title: 'ML Operations',
    description: 'Machine learning operations and model management',
    href: '/ml-ops',
    icon: Cpu,
    category: 'AI & Intelligence',
    status: 'operational'
  },

  // Security & Performance
  {
    id: 'security-center',
    title: 'Security Center',
    description: 'Enterprise security monitoring and threat intelligence',
    href: '/security-center',
    icon: Shield,
    category: 'Security & Performance',
    status: 'operational',
    badge: 'CRITICAL',
    metrics: [
      { label: 'Threats Blocked', value: '2.1K' },
      { label: 'Security Score', value: '98%' }
    ]
  },
  {
    id: 'performance-center',
    title: 'Performance Center',
    description: 'Real-time performance monitoring and optimization',
    href: '/performance-center',
    icon: Zap,
    category: 'Security & Performance',
    status: 'operational',
    metrics: [
      { label: 'Response Time', value: '45ms' },
      { label: 'Uptime', value: '99.9%' }
    ]
  },
  {
    id: 'system-health',
    title: 'System Health',
    description: 'Comprehensive system monitoring and diagnostics',
    href: '/system-health',
    icon: Activity,
    category: 'Security & Performance',
    status: 'operational'
  },

  // Integration & Operations
  {
    id: 'widget-factory',
    title: 'Widget Factory',
    description: 'Advanced widget creation workspace with real-time collaboration',
    href: '/widget-factory',
    icon: Palette,
    category: 'Integration & Operations',
    status: 'operational',
    badge: 'POPULAR',
    metrics: [
      { label: 'Widgets Created', value: '1.8K' },
      { label: 'Active Users', value: 89 }
    ]
  },
  {
    id: 'integrations-hub',
    title: 'Integrations Hub',
    description: 'API management and third-party system integrations',
    href: '/integrations-hub',
    icon: Plug,
    category: 'Integration & Operations',
    status: 'operational',
    metrics: [
      { label: 'Active Integrations', value: 24 },
      { label: 'API Calls', value: '15K/h' }
    ]
  },
  {
    id: 'analytics',
    title: 'Business Analytics',
    description: 'Comprehensive business intelligence and reporting',
    href: '/analytics',
    icon: BarChart3,
    category: 'Integration & Operations',
    status: 'operational'
  },
  {
    id: 'testing-center',
    title: 'Testing Center',
    description: 'Automated testing and quality assurance',
    href: '/testing-center',
    icon: TestTube,
    category: 'Integration & Operations',
    status: 'operational'
  },

  // Management & Governance
  {
    id: 'executive-dashboard',
    title: 'Executive Dashboard',
    description: 'Executive-level insights and strategic overview',
    href: '/executive-dashboard',
    icon: Crown,
    category: 'Management & Governance',
    status: 'operational',
    badge: 'EXECUTIVE'
  },
  {
    id: 'governance-center',
    title: 'Governance Center',
    description: 'Compliance, risk management, and governance',
    href: '/governance-center',
    icon: Globe,
    category: 'Management & Governance',
    status: 'operational'
  },
  {
    id: 'documentation-center',
    title: 'Documentation Center',
    description: 'Comprehensive platform documentation',
    href: '/documentation-center',
    icon: BookOpen,
    category: 'Management & Governance',
    status: 'operational'
  },
  {
    id: 'go-live-preparation',
    title: 'Go-Live Preparation',
    description: 'Production readiness checklist and deployment',
    href: '/go-live-preparation',
    icon: Rocket,
    category: 'Management & Governance',
    status: 'operational'
  }
];

const categoryColors = {
  'Core Platform': 'bg-blue-500',
  'AI & Intelligence': 'bg-purple-500',
  'Security & Performance': 'bg-red-500',
  'Integration & Operations': 'bg-green-500',
  'Management & Governance': 'bg-orange-500'
};

function FeatureCard({ feature, index }: { feature: EnterpriseFeature; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group h-full"
    >
      <Link href={feature.href} className="block h-full">
        <Card className="h-full transition-all duration-300 hover:shadow-xl border-0 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${categoryColors[feature.category]} bg-opacity-10`}>
                  <feature.icon className={`h-6 w-6 text-current`} style={{color: categoryColors[feature.category].replace('bg-', '#').replace('-500', '')}} />
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {feature.category}
                    </Badge>
                    {feature.badge && (
                      <Badge className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                feature.status === 'operational' ? 'bg-green-500' :
                feature.status === 'beta' ? 'bg-yellow-500' : 'bg-blue-500'
              }`} title={feature.status} />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
              {feature.description}
            </p>
            
            {feature.metrics && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {feature.metrics.map((metric, idx) => (
                  <div key={idx} className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {metric.value}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
              Access Feature
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export function EnhancedHomePage() {
  const [systemMetrics, setSystemMetrics] = useState({
    totalFeatures: 0,
    activeUsers: 0,
    systemHealth: 0,
    uptime: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading and animate metrics
    const timer = setTimeout(() => {
      setSystemMetrics({
        totalFeatures: enterpriseFeatures.length,
        activeUsers: 1247,
        systemHealth: 98.7,
        uptime: 99.94
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingStates.PageLoading message="Loading Enterprise Platform..." />;
  }

  const groupedFeatures = enterpriseFeatures.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, EnterpriseFeature[]>);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                ENTERPRISE PLATFORM COMPLETE
              </Badge>
              <h1 className="text-5xl font-bold mb-6">
                Re-Commerce Enterprise Suite
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Complete enterprise platform with AI-powered analytics, advanced security monitoring, 
                performance optimization, and seamless integration ecosystem for modern businesses.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/command-center">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Enterprise Command Center
                    <Command className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Scene Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 -mt-8 relative z-10">
            {[
              { label: 'Enterprise Features', value: systemMetrics.totalFeatures, icon: Database, color: 'text-blue-600' },
              { label: 'Active Users', value: systemMetrics.activeUsers.toLocaleString(), icon: Users, color: 'text-green-600' },
              { label: 'System Health', value: `${systemMetrics.systemHealth}%`, icon: Activity, color: 'text-orange-600' },
              { label: 'Uptime', value: `${systemMetrics.uptime}%`, icon: CheckCircle2, color: 'text-purple-600' }
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <metric.icon className={`h-8 w-8 ${metric.color} mx-auto mb-2`} />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Features by Category */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {Object.entries(groupedFeatures).map(([category, features], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-4 h-4 rounded-full ${categoryColors[category]}`}></div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {category}
                </h2>
                <Badge variant="outline">
                  {features.length} Features
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <FeatureCard 
                    key={feature.id} 
                    feature={feature} 
                    index={index} 
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions Footer */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  🚀 Enterprise Platform Ready
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  All enterprise features are operational and ready for production use
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link href="/widget-factory">
                    <Button variant="outline">
                      <Palette className="mr-2 h-4 w-4" />
                      Widget Factory
                    </Button>
                  </Link>
                  <Link href="/ai-studio">
                    <Button variant="outline">
                      <Brain className="mr-2 h-4 w-4" />
                      AI Studio
                    </Button>
                  </Link>
                  <Link href="/security-center">
                    <Button variant="outline">
                      <Shield className="mr-2 h-4 w-4" />
                      Security Center
                    </Button>
                  </Link>
                  <Link href="/documentation-center">
                    <Button variant="outline">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Documentation
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
}
