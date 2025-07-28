
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, 
  Activity, 
  Server, 
  Database, 
  Globe,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Download,
  Settings,
  Gauge,
  BarChart3,
  Cpu,
  HardDrive,
  Wifi,
  Target,
  Shield,
  Users,
  Layers,
  GitBranch,
  Code,
  Monitor,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface SystemOverview {
  timestamp: Date;
  systems: {
    caching: any;
    database: any;
    scaling: any;
    events: any;
    circuitBreaker: any;
    performance: any;
    frontend: any;
    monitoring: any;
  };
  health: {
    overall: string;
    issues: number;
    warnings: number;
  };
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  change: number;
}

export default function PerformanceOptimizationPage() {
  const [systemOverview, setSystemOverview] = useState<SystemOverview | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchSystemOverview();
    fetchPerformanceMetrics();
    
    // Set up auto-refresh
    const interval = setInterval(() => {
      fetchSystemOverview();
      fetchPerformanceMetrics();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchSystemOverview = async () => {
    try {
      const response = await fetch('/api/performance-system?system=overview');
      const data = await response.json();
      setSystemOverview(data);
    } catch (error) {
      console.error('Failed to fetch system overview:', error);
    }
  };

  const fetchPerformanceMetrics = async () => {
    try {
      const response = await fetch('/api/performance-system?system=performance&action=metrics');
      const data = await response.json();
      
      // Mock performance metrics
      const metrics: PerformanceMetric[] = [
        { name: 'Response Time', value: 145, unit: 'ms', trend: 'down', status: 'good', change: -12 },
        { name: 'Throughput', value: 1247, unit: 'req/s', trend: 'up', status: 'excellent', change: 8 },
        { name: 'Error Rate', value: 0.3, unit: '%', trend: 'stable', status: 'excellent', change: 0 },
        { name: 'Cache Hit Rate', value: 94.2, unit: '%', trend: 'up', status: 'excellent', change: 2.1 },
        { name: 'CPU Usage', value: 68, unit: '%', trend: 'down', status: 'good', change: -5 },
        { name: 'Memory Usage', value: 72, unit: '%', trend: 'stable', status: 'good', change: 1 },
        { name: 'Database Latency', value: 23, unit: 'ms', trend: 'down', status: 'excellent', change: -8 },
        { name: 'Active Users', value: 2847, unit: 'users', trend: 'up', status: 'good', change: 15 }
      ];
      
      setPerformanceMetrics(metrics);
    } catch (error) {
      console.error('Failed to fetch performance metrics:', error);
    }
  };

  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    try {
      const interval = setInterval(() => {
        setOptimizationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsOptimizing(false);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
      
      // Run optimizations on multiple systems
      const optimizations = [
        { system: 'caching', action: 'optimize' },
        { system: 'database', action: 'optimize' },
        { system: 'scaling', action: 'optimize' },
        { system: 'frontend', action: 'optimize_lazy_loading' }
      ];
      
      for (const opt of optimizations) {
        await fetch('/api/performance-system', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(opt)
        });
      }
    } catch (error) {
      console.error('Optimization failed:', error);
      setIsOptimizing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-500" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  // Sample chart data
  const performanceData = [
    { time: '00:00', responseTime: 120, throughput: 1100, errorRate: 0.2 },
    { time: '04:00', responseTime: 95, throughput: 950, errorRate: 0.1 },
    { time: '08:00', responseTime: 180, throughput: 1300, errorRate: 0.4 },
    { time: '12:00', responseTime: 145, throughput: 1247, errorRate: 0.3 },
    { time: '16:00', responseTime: 160, throughput: 1180, errorRate: 0.2 },
    { time: '20:00', responseTime: 130, throughput: 1020, errorRate: 0.1 },
  ];

  const systemHealthData = [
    { name: 'Caching', value: 95, color: '#10B981' },
    { name: 'Database', value: 88, color: '#3B82F6' },
    { name: 'Scaling', value: 92, color: '#8B5CF6' },
    { name: 'Events', value: 90, color: '#F59E0B' },
    { name: 'Circuit Breaker', value: 94, color: '#EF4444' },
    { name: 'Frontend', value: 87, color: '#06B6D4' },
  ];

  const resourceUtilization = [
    { resource: 'CPU', usage: 68, limit: 80 },
    { resource: 'Memory', usage: 72, limit: 85 },
    { resource: 'Disk', usage: 45, limit: 90 },
    { resource: 'Network', usage: 34, limit: 70 },
  ];

  const optimizationRecommendations = [
    { id: 1, title: 'Implement Database Indexing', impact: 'High', effort: 'Medium', savings: '35%' },
    { id: 2, title: 'Enable CDN Caching', impact: 'High', effort: 'Low', savings: '40%' },
    { id: 3, title: 'Optimize Bundle Size', impact: 'Medium', effort: 'Low', savings: '25%' },
    { id: 4, title: 'Configure Auto-scaling', impact: 'High', effort: 'High', savings: '50%' },
    { id: 5, title: 'Implement Circuit Breakers', impact: 'Medium', effort: 'Medium', savings: '20%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Performance Optimization</h1>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                DAG 2 CHUNK 3
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={runOptimization}
                disabled={isOptimizing}
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Run Optimization
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Health Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-blue-900">
                    System Performance Health
                  </CardTitle>
                  <p className="text-blue-700 mt-2">
                    Real-time monitoring and optimization across all performance systems
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">98.2%</div>
                    <div className="text-sm text-gray-600">Overall Health</div>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              {isOptimizing && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">System Optimization Progress</span>
                    <span className="text-sm text-blue-600">{optimizationProgress}%</span>
                  </div>
                  <Progress value={optimizationProgress} className="h-2" />
                </div>
              )}
            </CardHeader>
          </Card>
        </motion.div>

        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(metric.trend)}
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {metric.value.toLocaleString()} {metric.unit}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="caching">Caching</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="scaling">Scaling</TabsTrigger>
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="responseTime" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="throughput" stroke="#10B981" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-500" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={systemHealthData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="name" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar name="Health" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Resource Utilization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cpu className="h-5 w-5 mr-2 text-purple-500" />
                    Resource Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resourceUtilization.map((resource, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{resource.resource}</span>
                        <span className="text-sm text-gray-600">
                          {resource.usage}% / {resource.limit}%
                        </span>
                      </div>
                      <Progress value={resource.usage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Optimization Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-orange-500" />
                    Optimization Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {optimizationRecommendations.map((rec, index) => (
                      <div key={rec.id} className="p-3 bg-gradient-to-r from-white to-gray-50 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{rec.title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {rec.impact} Impact
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {rec.effort} Effort
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">{rec.savings}</div>
                            <div className="text-xs text-gray-500">Potential Savings</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="caching">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Layers className="h-5 w-5 mr-2 text-blue-500" />
                    Cache Layers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Memory Cache', 'Redis Cache', 'CDN Cache', 'Database Cache'].map((layer, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{layer}</span>
                          <Badge className="bg-blue-100 text-blue-700">
                            {(95 - index * 5).toFixed(1)}%
                          </Badge>
                        </div>
                        <Progress value={95 - index * 5} className="h-2 mt-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
                    Hit Rate Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="throughput" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-purple-500" />
                    Cache Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">TTL Strategy</span>
                      <Badge variant="outline">LRU</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Max Size</span>
                      <span className="text-sm font-medium">1GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Compression</span>
                      <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Invalidation</span>
                      <Badge className="bg-blue-100 text-blue-700">Smart</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="database">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2 text-blue-500" />
                    Database Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-gray-600">Query Time</div>
                        <div className="text-2xl font-bold text-blue-600">23ms</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-gray-600">Connections</div>
                        <div className="text-2xl font-bold text-green-600">12/50</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Buffer Hit Ratio</span>
                        <span className="text-sm font-medium">94.5%</span>
                      </div>
                      <Progress value={94.5} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-500" />
                    Query Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['SELECT queries', 'INSERT queries', 'UPDATE queries', 'DELETE queries'].map((query, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{query}</span>
                        <div className="flex items-center space-x-2">
                          <Progress value={85 + index * 5} className="w-20 h-2" />
                          <span className="text-sm text-gray-600">{85 + index * 5}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="scaling">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-purple-500" />
                    Auto-scaling Rules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['CPU Scale Up', 'Memory Scale Up', 'Response Time Scale', 'Load Scale Down'].map((rule, index) => (
                      <div key={index} className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{rule}</span>
                          <Badge className="bg-purple-100 text-purple-700">
                            Active
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Threshold: {70 + index * 5}%
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2 text-orange-500" />
                    Resource Pools
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Compute', 'Memory', 'Storage', 'Network'].map((resource, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{resource}</span>
                          <span className="text-sm text-gray-600">
                            {5 + index * 2} / {10 + index * 3} units
                          </span>
                        </div>
                        <Progress value={(5 + index * 2) / (10 + index * 3) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    Scaling Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: 'Scale Up', resource: 'CPU', time: '5m ago', status: 'success' },
                      { type: 'Scale Down', resource: 'Memory', time: '15m ago', status: 'success' },
                      { type: 'Scale Up', resource: 'Storage', time: '1h ago', status: 'success' },
                      { type: 'Scale Up', resource: 'Network', time: '2h ago', status: 'success' }
                    ].map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium text-sm">{event.type}</div>
                          <div className="text-xs text-gray-600">{event.resource} • {event.time}</div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="frontend">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="h-5 w-5 mr-2 text-blue-500" />
                    Bundle Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Bundle Size</span>
                        <span className="text-lg font-bold text-blue-600">1.2MB</span>
                      </div>
                      <Progress value={75} className="h-2 mt-2" />
                      <div className="text-sm text-gray-600 mt-1">75% of budget used</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-gray-600">Compressed</div>
                        <div className="text-xl font-bold text-green-600">415KB</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="text-sm text-gray-600">Chunks</div>
                        <div className="text-xl font-bold text-purple-600">12</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gauge className="h-5 w-5 mr-2 text-green-500" />
                    Web Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { metric: 'LCP', value: 1.2, unit: 's', status: 'good' },
                      { metric: 'FID', value: 45, unit: 'ms', status: 'good' },
                      { metric: 'CLS', value: 0.05, unit: '', status: 'good' },
                      { metric: 'FCP', value: 0.9, unit: 's', status: 'excellent' }
                    ].map((vital, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{vital.metric}</div>
                          <div className="text-sm text-gray-600">
                            {vital.value}{vital.unit}
                          </div>
                        </div>
                        <Badge className={getStatusColor(vital.status)}>
                          {vital.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="monitoring">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Monitor className="h-5 w-5 mr-2 text-blue-500" />
                    Active Dashboards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Performance Overview', 'Infrastructure Monitor', 'Application Health', 'Security Dashboard'].map((dashboard, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{dashboard}</span>
                          <Badge className="bg-blue-100 text-blue-700">
                            Active
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {15 + index * 3} widgets • Last updated: {index + 1}m ago
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                    Recent Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { title: 'High CPU Usage', severity: 'warning', time: '2m ago', status: 'active' },
                      { title: 'Database Connection', severity: 'critical', time: '5m ago', status: 'resolved' },
                      { title: 'Cache Miss Rate', severity: 'info', time: '12m ago', status: 'acknowledged' },
                      { title: 'Memory Threshold', severity: 'warning', time: '30m ago', status: 'resolved' }
                    ].map((alert, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <div className="font-medium text-sm">{alert.title}</div>
                          <div className="text-xs text-gray-600">{alert.severity} • {alert.time}</div>
                        </div>
                        <Badge className={
                          alert.status === 'active' ? 'bg-red-100 text-red-700' :
                          alert.status === 'resolved' ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
                        }>
                          {alert.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
