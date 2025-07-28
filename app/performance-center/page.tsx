
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Server,
  Database,
  Globe,
  Cpu,
  HardDrive,
  Wifi,
  RefreshCw,
  Download,
  Settings,
  Target,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface OptimizationRecommendation {
  id: number;
  category: string;
  title: string;
  description: string;
  impact: string;
  effort: string;
  priority: number;
  estimatedImprovement: any;
  status: string;
}

export default function PerformanceCenterPage() {
  const [metrics, setMetrics] = useState<any>({});
  const [optimizations, setOptimizations] = useState<OptimizationRecommendation[]>([]);

  // Sample performance data
  const performanceData = [
    { time: '00:00', cpu: 45, memory: 62, response: 120, throughput: 850 },
    { time: '04:00', cpu: 38, memory: 58, response: 95, throughput: 720 },
    { time: '08:00', cpu: 67, memory: 75, response: 180, throughput: 1200 },
    { time: '12:00', cpu: 84, memory: 82, response: 245, throughput: 1650 },
    { time: '16:00', cpu: 78, memory: 79, response: 210, throughput: 1450 },
    { time: '20:00', cpu: 65, memory: 71, response: 155, throughput: 1100 },
  ];

  const resourceUtilization = [
    { resource: 'CPU', current: 78, average: 65, peak: 95 },
    { resource: 'Memory', current: 82, average: 74, peak: 89 },
    { resource: 'Disk I/O', current: 45, average: 52, peak: 78 },
    { resource: 'Network', current: 67, average: 58, peak: 85 },
  ];

  const endpointPerformance = [
    { endpoint: '/api/users', avgResponse: 120, requests: 15430, errors: 0.2 },
    { endpoint: '/api/analytics', avgResponse: 450, requests: 8920, errors: 0.1 },
    { endpoint: '/api/dashboard', avgResponse: 230, requests: 12650, errors: 0.3 },
    { endpoint: '/api/reports', avgResponse: 890, requests: 3240, errors: 1.2 },
  ];

  const sampleOptimizations = [
    {
      id: 1,
      category: 'database',
      title: 'Database Query Optimization',
      description: 'Optimize slow queries on user analytics table - potential 40% improvement',
      impact: 'high',
      effort: 'medium',
      priority: 9,
      estimatedImprovement: { responseTime: '40%', throughput: '25%', costReduction: '15%' },
      status: 'pending'
    },
    {
      id: 2,
      category: 'caching',
      title: 'Redis Cache Implementation',
      description: 'Implement Redis caching for frequently accessed API endpoints',
      impact: 'high',
      effort: 'high',
      priority: 8,
      estimatedImprovement: { responseTime: '60%', throughput: '35%', memoryUsage: '20%' },
      status: 'implementing'
    },
    {
      id: 3,
      category: 'frontend',
      title: 'Asset Optimization',
      description: 'Compress and optimize images and static assets',
      impact: 'medium',
      effort: 'low',
      priority: 6,
      estimatedImprovement: { loadTime: '30%', bandwidth: '45%', cacheHitRatio: '85%' },
      status: 'pending'
    }
  ];

  useEffect(() => {
    setOptimizations(sampleOptimizations);
    setMetrics({
      responseTime: 156,
      throughput: 1230,
      errorRate: 0.2,
      availability: 99.8
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-yellow-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Performance Center</h1>
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                DAG 4 ENTERPRISE
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Metrics
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Performance Report
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
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-yellow-900">
                    Performance Optimization Center
                  </CardTitle>
                  <p className="text-yellow-700 mt-2">
                    Real-time performance monitoring, optimization recommendations, and resource analytics
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">Optimal Performance</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: <Clock className="h-8 w-8 text-blue-500" />, title: "Avg Response Time", value: `${metrics.responseTime}ms`, change: "-12ms", color: "bg-blue-50 border-blue-200" },
            { icon: <Activity className="h-8 w-8 text-green-500" />, title: "Throughput", value: `${metrics.throughput} req/s`, change: "+85", color: "bg-green-50 border-green-200" },
            { icon: <AlertTriangle className="h-8 w-8 text-red-500" />, title: "Error Rate", value: `${metrics.errorRate}%`, change: "-0.1%", color: "bg-red-50 border-red-200" },
            { icon: <TrendingUp className="h-8 w-8 text-purple-500" />, title: "Availability", value: `${metrics.availability}%`, change: "+0.1%", color: "bg-purple-50 border-purple-200" }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className={`transition-all duration-300 hover:shadow-lg ${metric.color}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    {metric.icon}
                    <Badge variant="outline" className="text-xs text-green-700 bg-green-100">
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Performance Content */}
        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
            <TabsTrigger value="resources">Resource Usage</TabsTrigger>
            <TabsTrigger value="endpoints">API Performance</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-500" />
                    Real-time Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="cpu" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="memory" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="response" stackId="2" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="h-5 w-5 mr-2 text-purple-500" />
                    Resource Utilization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resourceUtilization.map((resource, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {resource.resource === 'CPU' && <Cpu className="h-4 w-4 text-blue-500" />}
                          {resource.resource === 'Memory' && <Database className="h-4 w-4 text-green-500" />}
                          {resource.resource === 'Disk I/O' && <HardDrive className="h-4 w-4 text-purple-500" />}
                          {resource.resource === 'Network' && <Wifi className="h-4 w-4 text-orange-500" />}
                          <span className="font-medium">{resource.resource}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">{resource.current}%</span>
                          <div className="text-xs text-gray-500">
                            Avg: {resource.average}% | Peak: {resource.peak}%
                          </div>
                        </div>
                      </div>
                      <Progress value={resource.current} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
                    System Health Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">94.2</div>
                    <div className="text-sm text-gray-600">Overall Health Score</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">CPU Efficiency</span>
                      <span className="text-sm text-gray-600">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Memory Optimization</span>
                      <span className="text-sm text-gray-600">89%</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Network Performance</span>
                      <span className="text-sm text-gray-600">96%</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Storage Efficiency</span>
                      <span className="text-sm text-gray-600">98%</span>
                    </div>
                    <Progress value={98} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="endpoints">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-indigo-500" />
                  API Endpoint Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {endpointPerformance.map((endpoint, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border hover:shadow-md transition-all"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div className="md:col-span-2">
                          <h3 className="font-semibold text-gray-900">{endpoint.endpoint}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {endpoint.requests.toLocaleString()} requests
                            </Badge>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{endpoint.avgResponse}ms</div>
                          <div className="text-xs text-gray-500">Avg Response</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-semibold ${endpoint.errors < 1 ? 'text-green-600' : 'text-red-600'}`}>
                            {endpoint.errors}%
                          </div>
                          <div className="text-xs text-gray-500">Error Rate</div>
                        </div>
                        <div className="text-center">
                          <Button size="sm" variant="outline">
                            Optimize
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization">
            <div className="space-y-6">
              {optimizations.map((optimization, index) => (
                <motion.div
                  key={optimization.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center">
                            <Target className="h-5 w-5 mr-2 text-blue-500" />
                            {optimization.title}
                          </CardTitle>
                          <p className="text-gray-600 mt-2">{optimization.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={optimization.status === 'implementing' ? 'default' : optimization.status === 'completed' ? 'secondary' : 'outline'}>
                            {optimization.status}
                          </Badge>
                          <Badge variant={optimization.priority >= 8 ? 'destructive' : optimization.priority >= 6 ? 'default' : 'secondary'}>
                            Priority {optimization.priority}/10
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Impact & Effort</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant={optimization.impact === 'high' ? 'destructive' : optimization.impact === 'medium' ? 'default' : 'secondary'}>
                              {optimization.impact} impact
                            </Badge>
                            <Badge variant={optimization.effort === 'high' ? 'destructive' : optimization.effort === 'medium' ? 'default' : 'secondary'}>
                              {optimization.effort} effort
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Expected Improvements</h4>
                          <div className="space-y-1">
                            {Object.entries(optimization.estimatedImprovement).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="capitalize text-gray-600">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                <span className="font-medium text-green-600">+{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Actions</h4>
                          <div className="space-y-2">
                            <Button size="sm" className="w-full" disabled={optimization.status === 'implementing'}>
                              {optimization.status === 'implementing' ? 'In Progress' : 'Start Implementation'}
                            </Button>
                            <Button size="sm" variant="outline" className="w-full">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="response" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="throughput" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-purple-500" />
                    Resource Usage Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={resourceUtilization}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="resource" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="current" fill="#3B82F6" />
                      <Bar dataKey="average" fill="#10B981" />
                      <Bar dataKey="peak" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
