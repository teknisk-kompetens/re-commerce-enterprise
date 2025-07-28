
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Zap,
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Server,
  Monitor,
  TrendingUp,
  TrendingDown,
  Clock,
  Database,
  Globe
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

export function PerformanceScene() {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    uptime: 0,
    responseTime: 0,
    throughput: 0,
    errorRate: 0
  });

  useEffect(() => {
    // Animate metrics counting up
    const timer = setTimeout(() => {
      setPerformanceMetrics({
        uptime: 99.97,
        responseTime: 142,
        throughput: 2847,
        errorRate: 0.03
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Sample data for charts
  const systemMetricsData = [
    { time: '00:00', cpu: 45, memory: 62, disk: 34, network: 78 },
    { time: '04:00', cpu: 52, memory: 68, disk: 38, network: 82 },
    { time: '08:00', cpu: 67, memory: 75, disk: 42, network: 88 },
    { time: '12:00', cpu: 84, memory: 82, disk: 48, network: 92 },
    { time: '16:00', cpu: 78, memory: 79, disk: 45, network: 89 },
    { time: '20:00', cpu: 65, memory: 71, disk: 41, network: 85 },
  ];

  const responseTimeData = [
    { time: '00:00', api: 120, database: 45, frontend: 850 },
    { time: '04:00', api: 135, database: 52, frontend: 920 },
    { time: '08:00', api: 180, database: 68, frontend: 1100 },
    { time: '12:00', api: 220, database: 85, frontend: 1350 },
    { time: '16:00', api: 195, database: 72, frontend: 1200 },
    { time: '20:00', api: 155, database: 58, frontend: 980 },
  ];

  const serverStatusData = [
    { server: 'Web-01', cpu: 45, memory: 68, status: 'healthy' },
    { server: 'Web-02', cpu: 52, memory: 72, status: 'healthy' },
    { server: 'API-01', cpu: 78, memory: 85, status: 'warning' },
    { server: 'API-02', cpu: 41, memory: 58, status: 'healthy' },
    { server: 'DB-01', cpu: 65, memory: 89, status: 'healthy' },
    { server: 'Cache-01', cpu: 23, memory: 45, status: 'healthy' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50"
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-yellow-900">
                    Performance Optimization Center
                  </CardTitle>
                  <p className="text-yellow-700 mt-1">
                    Real-time system monitoring and performance analytics
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: <Clock className="h-8 w-8 text-green-500" />,
              title: "System Uptime",
              value: `${performanceMetrics.uptime}%`,
              status: "Excellent",
              color: "bg-green-50 border-green-200"
            },
            {
              icon: <Activity className="h-8 w-8 text-blue-500" />,
              title: "Response Time",
              value: `${performanceMetrics.responseTime}ms`,
              status: "Good",
              color: "bg-blue-50 border-blue-200"
            },
            {
              icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
              title: "Throughput",
              value: `${performanceMetrics.throughput.toLocaleString()}/sec`,
              status: "High",
              color: "bg-purple-50 border-purple-200"
            },
            {
              icon: <TrendingDown className="h-8 w-8 text-red-500" />,
              title: "Error Rate",
              value: `${performanceMetrics.errorRate}%`,
              status: "Low",
              color: "bg-red-50 border-red-200"
            }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className={`transition-all duration-300 hover:shadow-xl ${metric.color}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    {metric.icon}
                    <Badge variant="outline" className="text-xs text-gray-700 bg-gray-100">
                      {metric.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* System Resources */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="h-5 w-5 mr-2 text-blue-500" />
                  System Resource Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={systemMetricsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="cpu" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="memory" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="disk" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="network" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Response Times */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="h-5 w-5 mr-2 text-green-500" />
                  Response Time Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="api" stroke="#10B981" strokeWidth={2} name="API" />
                    <Line type="monotone" dataKey="database" stroke="#3B82F6" strokeWidth={2} name="Database" />
                    <Line type="monotone" dataKey="frontend" stroke="#F59E0B" strokeWidth={2} name="Frontend" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Server Status */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="h-5 w-5 mr-2 text-purple-500" />
                Server Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serverStatusData.map((server, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Server className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">{server.server}</span>
                      </div>
                      <Badge 
                        variant={server.status === 'healthy' ? 'default' : 'secondary'}
                        className={server.status === 'healthy' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                      >
                        {server.status}
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>CPU Usage</span>
                          <span>{server.cpu}%</span>
                        </div>
                        <Progress value={server.cpu} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Memory Usage</span>
                          <span>{server.memory}%</span>
                        </div>
                        <Progress value={server.memory} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                Performance Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Optimization Opportunities</h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Database Query Optimization
                        </p>
                        <p className="text-xs text-gray-600">
                          Potential 25% performance improvement
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          CDN Cache Enhancement
                        </p>
                        <p className="text-xs text-gray-600">
                          Reduce load times by 40%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Auto-scaling Configuration
                        </p>
                        <p className="text-xs text-gray-600">
                          Optimize resource allocation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Current Performance</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Overall Score</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={87} className="w-16" />
                        <span className="text-sm font-medium">87%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Speed Index</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={92} className="w-16" />
                        <span className="text-sm font-medium">92%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Reliability</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={96} className="w-16" />
                        <span className="text-sm font-medium">96%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </motion.div>
  );
}
