
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Users, 
  TrendingUp, 
  Brain, 
  Activity,
  Download,
  Calendar,
  Globe,
  Zap,
  Target
} from 'lucide-react';

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);

  // Mock analytics data
  const kpiData = [
    {
      title: 'Total Searches',
      value: '12,457',
      change: '+23%',
      changeType: 'positive',
      icon: Search,
      description: 'Search queries this month'
    },
    {
      title: 'Active Users',
      value: '2,891',
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      description: 'Unique users this month'
    },
    {
      title: 'AI Assist Usage',
      value: '67%',
      change: '+8%',
      changeType: 'positive',
      icon: Brain,
      description: 'Searches using AI assistance'
    },
    {
      title: 'Avg Response Time',
      value: '0.24s',
      change: '-15%',
      changeType: 'positive',
      icon: Zap,
      description: 'Average search response time'
    }
  ];

  const searchTrendsData = [
    { date: '2024-01-01', searches: 1240, users: 320, aiUsage: 58 },
    { date: '2024-01-02', searches: 1380, users: 340, aiUsage: 62 },
    { date: '2024-01-03', searches: 1520, users: 385, aiUsage: 65 },
    { date: '2024-01-04', searches: 1680, users: 420, aiUsage: 69 },
    { date: '2024-01-05', searches: 1840, users: 465, aiUsage: 71 },
    { date: '2024-01-06', searches: 1920, users: 480, aiUsage: 74 },
    { date: '2024-01-07', searches: 2100, users: 520, aiUsage: 76 }
  ];

  const topQueriesData = [
    { query: 'AI implementation strategies', count: 234, trend: 'up' },
    { query: 'remote team management', count: 189, trend: 'up' },
    { query: 'sustainable business practices', count: 156, trend: 'stable' },
    { query: 'UX design principles', count: 134, trend: 'up' },
    { query: 'digital transformation', count: 123, trend: 'down' },
    { query: 'customer experience optimization', count: 109, trend: 'up' },
    { query: 'data analytics tools', count: 98, trend: 'stable' },
    { query: 'innovation management', count: 87, trend: 'up' }
  ];

  const categoryData = [
    { name: 'Technology', value: 35, color: '#3B82F6' },
    { name: 'Leadership', value: 25, color: '#EF4444' },
    { name: 'Design', value: 20, color: '#8B5CF6' },
    { name: 'Business', value: 15, color: '#10B981' },
    { name: 'Innovation', value: 5, color: '#F59E0B' }
  ];

  const aiUsageData = [
    { consciousness: 'Vera', usage: 45, satisfaction: 92 },
    { consciousness: 'Luna', usage: 32, satisfaction: 89 },
    { consciousness: 'Axel', usage: 23, satisfaction: 95 }
  ];

  return (
    <div className="container max-w-7xl mx-auto px-4">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">
              Comprehensive insights into your enterprise search platform performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last 7 days
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <Badge 
                    variant={kpi.changeType === 'positive' ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {kpi.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{kpi.value}</p>
                  <p className="text-sm font-medium">{kpi.title}</p>
                  <p className="text-xs text-muted-foreground">{kpi.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Search Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Search Trends
              </CardTitle>
              <CardDescription>Daily search activity and user engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={searchTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString('sv-SE')}
                    contentStyle={{ fontSize: 11 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="searches" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Searches"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    name="Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Search Categories
              </CardTitle>
              <CardDescription>Distribution of searches by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {categoryData.map((entry, index) => (
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

      {/* Tables Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Top Queries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Top Search Queries
              </CardTitle>
              <CardDescription>Most popular search terms this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topQueriesData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{item.query}</p>
                      <p className="text-xs text-muted-foreground">{item.count} searches</p>
                    </div>
                    <Badge 
                      variant={item.trend === 'up' ? 'default' : item.trend === 'down' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {item.trend === 'up' ? '↗' : item.trend === 'down' ? '↘' : '→'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Usage Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Assistant Performance
              </CardTitle>
              <CardDescription>Usage an satisfaction by AI consciousness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {aiUsageData.map((ai, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{ai.consciousness}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {ai.usage}% usage
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {ai.satisfaction}% satisfaction
                        </Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${ai.usage}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              System Performance
            </CardTitle>
            <CardDescription>Real-time system health and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">0.24s</div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">0.02%</div>
                <div className="text-sm text-muted-foreground">Error Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">1,245</div>
                <div className="text-sm text-muted-foreground">Req/min</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
