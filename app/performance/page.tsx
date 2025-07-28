
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
  Wifi
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

export default function PerformancePage() {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [performanceScore, setPerformanceScore] = useState(0);
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  useEffect(() => {
    // Animate performance score
    const timer = setTimeout(() => {
      setPerformanceScore(94.8);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const performOptimization = () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOptimizing(false);
          setPerformanceScore(97.3);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Performance data
  const realTimeData = [
    { time: '12:00', cpu: 45, memory: 62, network: 78, response: 120 },
    { time: '12:05', cpu: 52, memory: 68, network: 82, response: 115 },
    { time: '12:10', cpu: 67, memory: 75, network: 88, response: 108 },
    { time: '12:15', cpu: 84, memory: 82, network: 92, response: 95 },
    { time: '12:20', cpu: 78, memory: 79, network: 89, response: 102 },
    { time: '12:25', cpu: 65, memory: 71, network: 85, response: 110 },
    { time: '12:30', cpu: 58, memory: 64, network: 80, response: 118 },
  ];

  const optimizationData = [
    { category: 'Database Queries', before: 245, after: 89, improvement: 64 },
    { category: 'Cache Hit Rate', before: 67, after: 94, improvement: 40 },
    { category: 'Page Load Time', before: 3.2, after: 1.8, improvement: 44 },
    { category: 'API Response', before: 180, after: 95, improvement: 47 },
  ];

  const systemMetrics = [
    { name: 'CPU Usage', value: 68, status: 'good', color: 'bg-green-500' },
    { name: 'Memory', value: 74, status: 'warning', color: 'bg-yellow-500' },
    { name: 'Disk I/O', value: 45, status: 'excellent', color: 'bg-blue-500' },
    { name: 'Network', value: 82, status: 'good', color: 'bg-green-500' },
  ];

  const cacheMetrics = [
    { type: 'Redis', hitRate: 94.5, size: '2.3GB', keys: 45678 },
    { type: 'CDN', hitRate: 89.2, size: '15.7GB', keys: 12345 },
    { type: 'Database', hitRate: 78.9, size: '8.1GB', keys: 67890 },
    { type: 'Application', hitRate: 92.1, size: '1.2GB', keys: 23456 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Performance Center</h1>
              <Badge className="bg-gradient-to-r from-green-500 to-blue-600 text-white">
                DAG 3 Performance
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={performOptimization}
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
                    Optimize Now
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
        {/* Performance Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-green-900 flex items-center">
                    <Gauge className="h-6 w-6 mr-2" />
                    Performance Score: {performanceScore}%
                  </CardTitle>
                  <p className="text-green-700 mt-2">
                    System performance is optimized and running efficiently
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {performanceScore}%
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    Excellent
                  </Badge>
                </div>
              </div>
              {isOptimizing && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700">Optimization Progress</span>
                    <span className="text-sm text-green-600">{optimizationProgress}%</span>
                  </div>
                  <Progress value={optimizationProgress} className="h-2" />
                </div>
              )}
            </CardHeader>
          </Card>
        </motion.div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {systemMetrics.map((metric, index) => (
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
                      {metric.name === 'CPU Usage' && <Cpu className="h-6 w-6 text-blue-500" />}
                      {metric.name === 'Memory' && <HardDrive className="h-6 w-6 text-purple-500" />}
                      {metric.name === 'Disk I/O' && <Database className="h-6 w-6 text-green-500" />}
                      {metric.name === 'Network' && <Wifi className="h-6 w-6 text-orange-500" />}
                    </div>
                    <Badge className={`text-xs ${
                      metric.status === 'excellent' ? 'bg-blue-100 text-blue-700' :
                      metric.status === 'good' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}%</p>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Performance Dashboard */}
        <Tabs defaultValue="realtime" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="cache">Cache</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="cdn">CDN</TabsTrigger>
          </TabsList>

          <TabsContent value="realtime">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Real-time Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-500" />
                    Real-time Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={realTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="memory" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="network" stroke="#F59E0B" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Response Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-green-500" />
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={realTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="response" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                    Performance Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <AlertDescription>
                        <div className="flex justify-between items-center">
                          <span>Database optimization completed</span>
                          <Badge className="bg-green-100 text-green-700">Resolved</Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <AlertDescription>
                        <div className="flex justify-between items-center">
                          <span>Memory usage above 70%</span>
                          <Badge className="bg-yellow-100 text-yellow-700">Monitoring</Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-blue-200 bg-blue-50">
                      <Activity className="h-4 w-4 text-blue-500" />
                      <AlertDescription>
                        <div className="flex justify-between items-center">
                          <span>CDN cache optimization scheduled</span>
                          <Badge className="bg-blue-100 text-blue-700">Scheduled</Badge>
                        </div>
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-purple-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Run Performance Optimization
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Clear Database Cache
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="h-4 w-4 mr-2" />
                    Refresh CDN Cache
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Performance Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="optimization">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Optimization Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {optimizationData.map((item, index) => (
                      <div key={index} className="p-4 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{item.category}</span>
                          <Badge className="bg-green-100 text-green-700">
                            +{item.improvement}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Before: </span>
                            <span className="font-medium">{item.before}ms</span>
                          </div>
                          <div>
                            <span className="text-gray-600">After: </span>
                            <span className="font-medium text-green-600">{item.after}ms</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={optimizationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="improvement" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cache">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2 text-blue-500" />
                  Cache Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cacheMetrics.map((cache, index) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-blue-900">{cache.type} Cache</h3>
                        <Badge className="bg-blue-100 text-blue-700">
                          {cache.hitRate}%
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Hit Rate</span>
                          <span className="text-sm font-medium">{cache.hitRate}%</span>
                        </div>
                        <Progress value={cache.hitRate} className="h-2" />
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Cache Size</span>
                          <span className="text-sm font-medium">{cache.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Keys</span>
                          <span className="text-sm font-medium">{cache.keys.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="database">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2 text-purple-500" />
                    Database Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium">Query Response Time</p>
                        <p className="text-sm text-gray-600">Average response time</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700">
                        45ms
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Connection Pool</p>
                        <p className="text-sm text-gray-600">Active connections</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        12/50
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Buffer Hit Ratio</p>
                        <p className="text-sm text-gray-600">Cache efficiency</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">
                        94.5%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
                    Query Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">SELECT queries</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-20 h-2" />
                        <span className="text-sm text-gray-600">85ms</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">INSERT queries</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={92} className="w-20 h-2" />
                        <span className="text-sm text-gray-600">23ms</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">UPDATE queries</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={78} className="w-20 h-2" />
                        <span className="text-sm text-gray-600">67ms</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">DELETE queries</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={95} className="w-20 h-2" />
                        <span className="text-sm text-gray-600">15ms</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cdn">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-orange-500" />
                  CDN Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-orange-900">Global Hit Rate</h3>
                      <Badge className="bg-orange-100 text-orange-700">89.2%</Badge>
                    </div>
                    <Progress value={89.2} className="h-2 mb-2" />
                    <p className="text-sm text-gray-600">Requests served from cache</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-green-900">Bandwidth Saved</h3>
                      <Badge className="bg-green-100 text-green-700">67%</Badge>
                    </div>
                    <Progress value={67} className="h-2 mb-2" />
                    <p className="text-sm text-gray-600">15.7GB cached content</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-blue-900">Response Time</h3>
                      <Badge className="bg-blue-100 text-blue-700">45ms</Badge>
                    </div>
                    <Progress value={95} className="h-2 mb-2" />
                    <p className="text-sm text-gray-600">Average edge response</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
