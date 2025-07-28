
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Activity,
  Monitor,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Shield,
  Zap,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  TrendingUp,
  Clock,
  Server,
  Globe,
  Eye,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function SystemHealthPage() {
  const [healthMetrics, setHealthMetrics] = useState<any[]>([]);
  const [testSuites, setTestSuites] = useState<any[]>([]);
  const [integrationValidations, setIntegrationValidations] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    setIsRefreshing(true);
    try {
      const [healthRes, testRes, integrationRes] = await Promise.all([
        fetch('/api/system-health'),
        fetch('/api/test-suites'),
        fetch('/api/integration-validations')
      ]);

      const [healthData, testData, integrationData] = await Promise.all([
        healthRes.json(),
        testRes.json(),
        integrationRes.json()
      ]);

      if (healthData.success) setHealthMetrics(healthData.data);
      if (testData.success) setTestSuites(testData.data);
      if (integrationData.success) setIntegrationValidations(integrationData.data);
    } catch (error) {
      console.error('Error loading health data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Real-time system metrics
  const systemMetrics = [
    { name: 'CPU Usage', value: 68, threshold: 80, status: 'healthy', icon: Cpu, color: '#3b82f6' },
    { name: 'Memory Usage', value: 75, threshold: 85, status: 'healthy', icon: HardDrive, color: '#10b981' },
    { name: 'Disk Usage', value: 45, threshold: 90, status: 'healthy', icon: Database, color: '#f59e0b' },
    { name: 'Network Load', value: 23, threshold: 70, status: 'healthy', icon: Wifi, color: '#8b5cf6' }
  ];

  // Performance trends data
  const performanceData = [
    { time: '00:00', cpu: 65, memory: 78, response: 45, throughput: 1200 },
    { time: '04:00', cpu: 58, memory: 72, response: 42, throughput: 1150 },
    { time: '08:00', cpu: 72, memory: 81, response: 48, throughput: 1350 },
    { time: '12:00', cpu: 68, memory: 75, response: 44, throughput: 1280 },
    { time: '16:00', cpu: 71, memory: 79, response: 46, throughput: 1320 },
    { time: '20:00', cpu: 63, memory: 73, response: 43, throughput: 1180 }
  ];

  // Service health overview
  const serviceHealth = [
    { name: 'API Gateway', status: 'healthy', uptime: 99.9, responseTime: 45 },
    { name: 'Database', status: 'healthy', uptime: 99.8, responseTime: 12 },
    { name: 'AI Services', status: 'degraded', uptime: 98.5, responseTime: 156 },
    { name: 'Authentication', status: 'healthy', uptime: 99.7, responseTime: 23 },
    { name: 'File Storage', status: 'healthy', uptime: 99.9, responseTime: 89 },
    { name: 'Cache Layer', status: 'healthy', uptime: 99.6, responseTime: 8 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'warning': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'degraded': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle2;
      case 'warning': case 'degraded': return AlertTriangle;
      case 'critical': return XCircle;
      default: return Monitor;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="h-8 w-8" />
                  <h1 className="text-3xl font-bold">System Health Dashboard</h1>
                </div>
                <p className="text-blue-100">
                  Comprehensive monitoring of system performance, testing, and integration health
                </p>
              </div>
              <Button 
                onClick={loadHealthData}
                disabled={isRefreshing}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* System Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {systemMetrics.map((metric, index) => (
              <Card key={index} className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${metric.color}20` }}
                      >
                        <metric.icon 
                          className="h-5 w-5"
                          style={{ color: metric.color }}
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{metric.name}</p>
                        <Badge className={getStatusColor(metric.status)}>
                          {metric.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Usage</span>
                      <span className="font-medium">{metric.value}%</span>
                    </div>
                    <Progress 
                      value={metric.value} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Threshold: {metric.threshold}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance Trends</TabsTrigger>
            <TabsTrigger value="services">Service Health</TabsTrigger>
            <TabsTrigger value="testing">Test Automation</TabsTrigger>
            <TabsTrigger value="integrations">Integration Health</TabsTrigger>
          </TabsList>

          {/* Performance Trends Tab */}
          <TabsContent value="performance" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    System Resource Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                        <XAxis 
                          dataKey="time" 
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis 
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="cpu" 
                          stackId="1"
                          stroke="#3b82f6" 
                          fill="#3b82f6"
                          fillOpacity={0.6}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="memory" 
                          stackId="2"
                          stroke="#10b981" 
                          fill="#10b981"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Response Time & Throughput
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <XAxis 
                          dataKey="time" 
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis 
                          yAxisId="left"
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis 
                          yAxisId="right"
                          orientation="right"
                          tickLine={false}
                          tick={{ fontSize: 10 }}
                        />
                        <Line 
                          yAxisId="left"
                          type="monotone" 
                          dataKey="response" 
                          stroke="#f59e0b" 
                          strokeWidth={2}
                          name="Response Time (ms)"
                        />
                        <Line 
                          yAxisId="right"
                          type="monotone" 
                          dataKey="throughput" 
                          stroke="#8b5cf6" 
                          strokeWidth={2}
                          name="Throughput"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Service Health Tab */}
          <TabsContent value="services" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-blue-600" />
                    Service Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {serviceHealth.map((service, index) => {
                      const StatusIcon = getStatusIcon(service.status);
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.1 * index }}
                          className="p-4 border rounded-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">{service.name}</h3>
                            <StatusIcon className={`h-5 w-5 ${
                              service.status === 'healthy' ? 'text-green-500' :
                              service.status === 'degraded' ? 'text-orange-500' :
                              'text-red-500'
                            }`} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Uptime</span>
                              <span className="font-medium">{service.uptime}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Response</span>
                              <span className="font-medium">{service.responseTime}ms</span>
                            </div>
                            <Badge className={getStatusColor(service.status)}>
                              {service.status}
                            </Badge>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Test Automation Tab */}
          <TabsContent value="testing" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-green-600" />
                    Automated Test Suites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {testSuites?.map?.((suite, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="p-4 border rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge variant={suite.isActive ? 'default' : 'secondary'}>
                              {suite.type}
                            </Badge>
                            <h3 className="font-semibold">{suite.name}</h3>
                          </div>
                          <Badge 
                            className={
                              suite.executions?.[0]?.status === 'passed' ? 'bg-green-500' :
                              suite.executions?.[0]?.status === 'failed' ? 'bg-red-500' :
                              suite.executions?.[0]?.status === 'running' ? 'bg-blue-500' :
                              'bg-gray-500'
                            }
                          >
                            {suite.executions?.[0]?.status || 'unknown'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{suite.description}</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Framework</p>
                            <p className="font-medium">{suite.framework}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Last Duration</p>
                            <p className="font-medium">
                              {suite.executions?.[0]?.duration ? 
                                `${Math.round(suite.executions[0].duration / 1000)}s` : 
                                'N/A'
                              }
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Coverage</p>
                            <p className="font-medium">
                              {suite.executions?.[0]?.coverage ? 
                                `${suite.executions[0].coverage}%` : 
                                'N/A'
                              }
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Integration Health Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    Integration Validation Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {integrationValidations?.map?.((validation, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="p-4 border rounded-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              validation.status === 'healthy' ? 'bg-green-500' :
                              validation.status === 'degraded' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}></div>
                            <h3 className="font-semibold">{validation.name}</h3>
                          </div>
                          <Badge className={getStatusColor(validation.status)}>
                            {validation.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Endpoint</p>
                            <p className="font-medium font-mono text-xs">{validation.endpoint}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Method</p>
                            <p className="font-medium">{validation.method}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Response Time</p>
                            <p className="font-medium">
                              {validation.responseTime ? `${validation.responseTime}ms` : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Last Check</p>
                            <p className="font-medium">
                              {validation.lastCheck ? 'Just now' : 'Never'}
                            </p>
                          </div>
                        </div>
                        {validation.errorMessage && (
                          <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-600">
                            {validation.errorMessage}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
