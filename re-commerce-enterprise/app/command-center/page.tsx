
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Command,
  Crown,
  TrendingUp,
  Brain,
  Shield,
  Zap,
  Database,
  BarChart3,
  CheckCircle2,
  Activity,
  Users,
  Target,
  Plug,
  Cpu,
  Globe,
  Settings,
  AlertCircle,
  Clock,
  Award,
  ArrowRight,
  Rocket,
  Monitor,
  BookOpen,
  FileText,
  ThumbsUp
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export default function CommandCenterPage() {
  const [systemMetrics, setSystemMetrics] = useState({
    overallHealth: 0,
    activeUsers: 0,
    systemUptime: 0,
    completionRate: 0
  });

  const [platformStatus, setPlatformStatus] = useState([]);
  const [quickActions, setQuickActions] = useState([]);

  useEffect(() => {
    // Animate metrics counting up
    const timer = setTimeout(() => {
      setSystemMetrics({
        overallHealth: 98.7,
        activeUsers: 1247,
        systemUptime: 99.9,
        completionRate: 94.2
      });
    }, 500);

    // Load platform status
    fetch('/api/platform-status')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPlatformStatus(data.data);
        }
      })
      .catch(console.error);

    return () => clearTimeout(timer);
  }, []);

  // Day completion data
  const dayCompletionData = [
    { day: 'Day 1', completion: 100, features: 15, status: 'complete' },
    { day: 'Day 2', completion: 100, features: 12, status: 'complete' },
    { day: 'Day 3', completion: 100, features: 8, status: 'complete' },
    { day: 'Day 4', completion: 100, features: 16, status: 'complete' },
    { day: 'Day 5', completion: 94, features: 20, status: 'active' }
  ];

  // System health data
  const healthData = [
    { time: '00:00', cpu: 65, memory: 78, response: 45 },
    { time: '04:00', cpu: 58, memory: 72, response: 42 },
    { time: '08:00', cpu: 72, memory: 81, response: 48 },
    { time: '12:00', cpu: 68, memory: 75, response: 44 },
    { time: '16:00', cpu: 71, memory: 79, response: 46 },
    { time: '20:00', cpu: 63, memory: 73, response: 43 }
  ];

  // Executive metrics overview
  const executiveMetrics = [
    { category: 'Revenue', value: '$2.54M', change: '+6.2%', trend: 'up', color: '#10b981' },
    { category: 'Users', value: '1,247', change: '+7.9%', trend: 'up', color: '#3b82f6' },
    { category: 'Satisfaction', value: '4.7/5', change: '+4.4%', trend: 'up', color: '#f59e0b' },
    { category: 'Uptime', value: '99.8%', change: '+0.2%', trend: 'up', color: '#8b5cf6' }
  ];

  const dayFeatures = [
    {
      day: 'Day 1',
      title: 'Foundation & Core',
      description: 'API-first architecture, multi-tenant foundation',
      icon: Database,
      color: 'bg-blue-500',
      features: ['Multi-tenant Architecture', 'User Management', 'Task System', 'Basic Dashboard']
    },
    {
      day: 'Day 2',
      title: 'Advanced Platform',
      description: 'Real-time collaboration, advanced dashboard',
      icon: Users,
      color: 'bg-green-500',
      features: ['Real-time Collaboration', 'Advanced Analytics', 'Workflow Management', 'API Integration']
    },
    {
      day: 'Day 3',
      title: 'Mobile & Workflow',
      description: 'Mobile capabilities, enterprise workflows',
      icon: Zap,
      color: 'bg-yellow-500',
      features: ['Mobile API', 'Workflow Engine', 'Automation', 'Enterprise Features']
    },
    {
      day: 'Day 4',
      title: 'AI & Intelligence',
      description: 'AI analytics, security, performance optimization',
      icon: Brain,
      color: 'bg-purple-500',
      features: ['AI Analytics', 'Security Center', 'Performance Optimization', 'Integration Hub']
    },
    {
      day: 'Day 5',
      title: 'Enterprise Complete',
      description: 'Production readiness, documentation, success metrics',
      icon: Crown,
      color: 'bg-indigo-500',
      features: ['System Health', 'Documentation Center', 'Go-Live Preparation', 'Executive Dashboard']
    }
  ];

  const criticalAlerts = [
    { id: 1, type: 'warning', message: 'AI Analytics response time elevated', component: 'Day 4' },
    { id: 2, type: 'info', message: 'System backup completed successfully', component: 'Infrastructure' },
    { id: 3, type: 'success', message: 'Production readiness checklist 94% complete', component: 'Day 5' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center items-center gap-3 mb-4">
              <Crown className="h-12 w-12 text-yellow-400" />
              <h1 className="text-4xl md:text-5xl font-bold">Enterprise Command Center</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Unified control panel for your complete re:commerce Enterprise Suite. Monitor, manage, and master all Day 1-5 features from one powerful interface.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Executive Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {executiveMetrics.map((metric, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.category}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-sm text-green-600 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {metric.change}
                      </p>
                    </div>
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${metric.color}20` }}
                    >
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: metric.color }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Main Command Center Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Platform Status & Health */}
          <div className="lg:col-span-2 space-y-6">
            {/* Day-by-Day Feature Completion */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    5-Day Enterprise Transformation Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dayFeatures.map((day, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="flex items-center space-x-4 p-4 rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border"
                      >
                        <div className={`${day.color} p-2 rounded-lg`}>
                          <day.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{day.day}: {day.title}</h3>
                            <Badge variant={dayCompletionData[index].status === 'complete' ? 'default' : 'secondary'}>
                              {dayCompletionData[index].completion}%
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{day.description}</p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {day.features.slice(0, 2).map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {day.features.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{day.features.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CheckCircle2 className={`h-5 w-5 ${dayCompletionData[index].status === 'complete' ? 'text-green-500' : 'text-gray-300'}`} />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* System Health Overview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Real-Time System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={healthData}>
                        <XAxis 
                          dataKey="time" 
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis 
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="cpu" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          name="CPU %"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="memory" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Memory %"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="response" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          name="Response Time (ms)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium">CPU Usage</span>
                      </div>
                      <p className="text-lg font-bold text-blue-600">68%</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">Memory</span>
                      </div>
                      <p className="text-lg font-bold text-green-600">75%</p>
                    </div>
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium">Response</span>
                      </div>
                      <p className="text-lg font-bold text-yellow-600">44ms</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-purple-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/system-health">
                    <Button className="w-full justify-start" variant="outline">
                      <Monitor className="h-4 w-4 mr-2" />
                      System Health Dashboard
                    </Button>
                  </Link>
                  <Link href="/documentation-center">
                    <Button className="w-full justify-start" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Documentation Center
                    </Button>
                  </Link>
                  <Link href="/go-live-preparation">
                    <Button className="w-full justify-start" variant="outline">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Go-Live Preparation
                    </Button>
                  </Link>
                  <Link href="/executive-dashboard">
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Executive Dashboard
                    </Button>
                  </Link>
                  <Link href="/ai-analytics">
                    <Button className="w-full justify-start" variant="outline">
                      <Brain className="h-4 w-4 mr-2" />
                      AI Analytics
                    </Button>
                  </Link>
                  <Link href="/security-center">
                    <Button className="w-full justify-start" variant="outline">
                      <Shield className="h-4 w-4 mr-2" />
                      Security Center
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Critical Alerts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {criticalAlerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                        alert.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                        'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      }`}
                    >
                      <p className="text-sm font-medium">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">{alert.component}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Platform Status Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    Platform Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { component: 'Overall System', status: 'operational' },
                    { component: 'Day 1-3 Features', status: 'operational' },
                    { component: 'Day 4 AI Features', status: 'degraded' },
                    { component: 'Day 5 Features', status: 'operational' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium">{item.component}</span>
                      <Badge 
                        variant={item.status === 'operational' ? 'default' : 'secondary'}
                        className={
                          item.status === 'operational' ? 'bg-green-500' : 
                          item.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Feature Access Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Command className="h-5 w-5 text-indigo-600" />
                Complete Feature Suite Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: 'Dashboard', icon: BarChart3, href: '/dashboard', color: 'bg-blue-500' },
                  { title: 'Analytics', icon: TrendingUp, href: '/analytics', color: 'bg-green-500' },
                  { title: 'AI Insights', icon: Brain, href: '/ai-insights', color: 'bg-purple-500' },
                  { title: 'Security', icon: Shield, href: '/security-center', color: 'bg-red-500' },
                  { title: 'Performance', icon: Zap, href: '/performance-center', color: 'bg-yellow-500' },
                  { title: 'Integrations', icon: Plug, href: '/integrations-hub', color: 'bg-indigo-500' },
                  { title: 'Documentation', icon: FileText, href: '/documentation-center', color: 'bg-gray-500' },
                  { title: 'Go-Live', icon: CheckCircle2, href: '/go-live-preparation', color: 'bg-orange-500' }
                ].map((feature, index) => (
                  <Link key={index} href={feature.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-4 rounded-lg border bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-lg transition-all cursor-pointer group"
                    >
                      <div className={`${feature.color} p-2 rounded-lg w-fit mb-3 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-2" />
                    </motion.div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
