
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  DollarSign,
  Activity,
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

export function AnalyticsScene() {
  const [animatedValues, setAnimatedValues] = useState({
    revenue: 0,
    conversion: 0,
    users: 0,
    growth: 0
  });

  useEffect(() => {
    // Animate values counting up
    const timer = setTimeout(() => {
      setAnimatedValues({
        revenue: 2450000,
        conversion: 14.7,
        users: 45670,
        growth: 23.5
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Sample data for charts
  const performanceData = [
    { time: '00:00', cpu: 45, memory: 62, network: 78, users: 120 },
    { time: '04:00', cpu: 52, memory: 68, network: 82, users: 140 },
    { time: '08:00', cpu: 67, memory: 75, network: 88, users: 320 },
    { time: '12:00', cpu: 84, memory: 82, network: 92, users: 450 },
    { time: '16:00', cpu: 78, memory: 79, network: 89, users: 380 },
    { time: '20:00', cpu: 65, memory: 71, network: 85, users: 280 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 45000, target: 50000, growth: 12 },
    { month: 'Feb', revenue: 52000, target: 55000, growth: 15 },
    { month: 'Mar', revenue: 48000, target: 50000, growth: 8 },
    { month: 'Apr', revenue: 61000, target: 58000, growth: 22 },
    { month: 'May', revenue: 55000, target: 60000, growth: 18 },
    { month: 'Jun', revenue: 67000, target: 65000, growth: 25 },
  ];

  const conversionData = [
    { channel: 'Email', conversions: 2400, rate: 14.5 },
    { channel: 'Social', conversions: 1800, rate: 8.2 },
    { channel: 'Search', conversions: 3200, rate: 22.1 },
    { channel: 'Direct', conversions: 1600, rate: 18.7 },
    { channel: 'Referral', conversions: 900, rate: 12.3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50"
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-green-900">
                    Advanced Analytics Dashboard
                  </CardTitle>
                  <p className="text-green-700 mt-1">
                    Real-time business intelligence and performance insights
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              icon: <DollarSign className="h-8 w-8 text-green-500" />,
              title: "Total Revenue",
              value: `$${animatedValues.revenue.toLocaleString()}`,
              change: "+18.2%",
              trend: "up",
              color: "bg-green-50 border-green-200"
            },
            {
              icon: <Target className="h-8 w-8 text-blue-500" />,
              title: "Conversion Rate",
              value: `${animatedValues.conversion}%`,
              change: "+2.4%",
              trend: "up",
              color: "bg-blue-50 border-blue-200"
            },
            {
              icon: <Users className="h-8 w-8 text-purple-500" />,
              title: "Active Users",
              value: animatedValues.users.toLocaleString(),
              change: "+12.8%",
              trend: "up",
              color: "bg-purple-50 border-purple-200"
            },
            {
              icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
              title: "Growth Rate",
              value: `${animatedValues.growth}%`,
              change: "+5.1%",
              trend: "up",
              color: "bg-orange-50 border-orange-200"
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
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        metric.trend === 'up' 
                          ? 'text-green-700 bg-green-100' 
                          : 'text-red-700 bg-red-100'
                      }`}
                    >
                      {metric.trend === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                      {metric.change}
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
          {/* Revenue Trend */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Revenue vs Target
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="target" 
                      stackId="1" 
                      stroke="#94A3B8" 
                      fill="#E2E8F0" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stackId="2" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Activity */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-blue-500" />
                  System Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={performanceData}>
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
          </motion.div>
        </div>

        {/* Conversion Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-500" />
                Conversion by Channel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={conversionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channel" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="conversions" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Real-time Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Real-time Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">1,247</div>
                  <div className="text-sm text-gray-600">Active Sessions</div>
                  <div className="text-xs text-green-600 mt-1">+15% from yesterday</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">89.3%</div>
                  <div className="text-sm text-gray-600">Server Uptime</div>
                  <div className="text-xs text-green-600 mt-1">+2.1% this week</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">342ms</div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                  <div className="text-xs text-green-600 mt-1">-18ms improved</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </motion.div>
  );
}
