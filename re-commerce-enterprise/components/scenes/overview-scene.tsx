
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Target,
  CheckCircle2,
  Activity,
  TrendingUp,
  ArrowRight,
  Brain,
  Shield,
  Zap,
  Plug,
  Crown,
  Monitor,
  BookOpen,
  Rocket,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function OverviewScene() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeProjects: 0,
    completedTasks: 0,
    systemHealth: 0
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Animate metrics counting up
    const timer = setTimeout(() => {
      setMetrics({
        totalUsers: 1520,
        activeProjects: 89,
        completedTasks: 3456,
        systemHealth: 98.5
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
  ];

  const userActivityData = [
    { name: 'Active', value: 68, color: '#10B981' },
    { name: 'Idle', value: 22, color: '#F59E0B' },
    { name: 'Offline', value: 10, color: '#EF4444' },
  ];

  // Feature cards for slideshow
  const featureCards = [
    [
      {
        title: 'AI-Powered Analytics',
        description: 'Advanced machine learning insights',
        icon: <Brain className="h-6 w-6 text-purple-500" />,
        href: '/ai-analytics',
        gradient: 'from-purple-500 to-pink-600'
      },
      {
        title: 'Security & Compliance',
        description: 'Comprehensive security monitoring',
        icon: <Shield className="h-6 w-6 text-blue-500" />,
        href: '/security-center',
        gradient: 'from-blue-500 to-cyan-600'
      }
    ],
    [
      {
        title: 'Performance Center',
        description: 'System optimization and monitoring',
        icon: <Zap className="h-6 w-6 text-yellow-500" />,
        href: '/performance-center',
        gradient: 'from-yellow-500 to-orange-600'
      },
      {
        title: 'Integration Hub',
        description: 'API management and integrations',
        icon: <Plug className="h-6 w-6 text-green-500" />,
        href: '/integrations-hub',
        gradient: 'from-green-500 to-teal-600'
      }
    ],
    [
      {
        title: 'Enterprise Command Center',
        description: 'Executive-level enterprise management',
        icon: <Crown className="h-6 w-6 text-yellow-500" />,
        href: '/command-center',
        gradient: 'from-indigo-600 to-purple-600'
      },
      {
        title: 'System Health Dashboard',
        description: 'Real-time system monitoring',
        icon: <Monitor className="h-6 w-6 text-green-500" />,
        href: '/system-health',
        gradient: 'from-emerald-500 to-green-600'
      }
    ]
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureCards.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [featureCards.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50"
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl text-blue-900">
                    Welcome to your Complete Enterprise Suite
                  </CardTitle>
                  <p className="text-blue-700 mt-2 text-lg">
                    Day 5 Complete: Full enterprise transformation with cinematic scene-based navigation
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">All Systems Operational</span>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              icon: <Users className="h-8 w-8 text-blue-500" />, 
              title: "Total Users", 
              value: metrics.totalUsers, 
              change: "+12.5%",
              color: "bg-blue-50 border-blue-200"
            },
            { 
              icon: <Target className="h-8 w-8 text-green-500" />, 
              title: "Active Projects", 
              value: metrics.activeProjects, 
              change: "+8.3%",
              color: "bg-green-50 border-green-200"
            },
            { 
              icon: <CheckCircle2 className="h-8 w-8 text-purple-500" />, 
              title: "Completed Tasks", 
              value: metrics.completedTasks, 
              change: "+15.2%",
              color: "bg-purple-50 border-purple-200"
            },
            { 
              icon: <Activity className="h-8 w-8 text-yellow-500" />, 
              title: "System Health", 
              value: `${metrics.systemHealth}%`, 
              change: "+2.1%",
              color: "bg-yellow-50 border-yellow-200"
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
                    <Badge variant="outline" className="text-xs text-green-700 bg-green-100">
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="lg:col-span-2"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Revenue Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
                  </LineChart>
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
                  <Users className="h-5 w-5 mr-2 text-blue-500" />
                  User Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userActivityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {userActivityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Feature Cards Slideshow */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8"
        >
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Enterprise Features</CardTitle>
                <div className="flex space-x-1">
                  {featureCards.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {featureCards[currentSlide]?.map((feature, index) => (
                  <Link key={index} href={feature.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 rounded-xl bg-gradient-to-r ${feature.gradient} text-white cursor-pointer transition-all duration-300 hover:shadow-xl`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center mb-2">
                            {feature.icon}
                            <h3 className="ml-2 text-lg font-semibold">{feature.title}</h3>
                          </div>
                          <p className="text-white/90 text-sm">{feature.description}</p>
                        </div>
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </motion.div>
  );
}
