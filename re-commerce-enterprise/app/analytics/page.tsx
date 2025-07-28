
/**
 * ENTERPRISE ANALYTICS DASHBOARD
 * Main analytics dashboard with real-time metrics, visualizations,
 * ML insights, and comprehensive business intelligence
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  BarChart3, 
  Brain, 
  Database, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Zap,
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  RefreshCw,
  Download,
  Settings,
  Maximize,
  Eye,
  LineChart,
  PieChart,
  Map,
  Gauge
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    timeRange: '7d',
    region: 'all',
    segment: 'all'
  });

  // Sample data for visualizations
  const revenueData = [
    { date: 'Jan', revenue: 125000, profit: 32000, growth: 12.5 },
    { date: 'Feb', revenue: 143000, profit: 38000, growth: 14.4 },
    { date: 'Mar', revenue: 167000, profit: 45000, growth: 16.8 },
    { date: 'Apr', revenue: 189000, profit: 52000, growth: 13.2 },
    { date: 'May', revenue: 215000, profit: 61000, growth: 13.8 },
    { date: 'Jun', revenue: 238000, profit: 68000, growth: 10.7 }
  ];

  const userMetrics = [
    { metric: 'Active Users', value: 12450, change: 5.2, trend: 'up' },
    { metric: 'New Signups', value: 890, change: -2.1, trend: 'down' },
    { metric: 'Retention Rate', value: 78.5, change: 1.8, trend: 'up' },
    { metric: 'Conversion Rate', value: 3.4, change: 0.7, trend: 'up' }
  ];

  const conversionFunnel = [
    { stage: 'Visitors', value: 10000, percentage: 100 },
    { stage: 'Leads', value: 2500, percentage: 25 },
    { stage: 'Prospects', value: 1200, percentage: 12 },
    { stage: 'Customers', value: 450, percentage: 4.5 }
  ];

  const geoData = [
    { region: 'North America', users: 4520, revenue: 156000 },
    { region: 'Europe', users: 3200, revenue: 98000 },
    { region: 'Asia Pacific', users: 2800, revenue: 87000 },
    { region: 'Latin America', users: 1200, revenue: 34000 },
    { region: 'Middle East', users: 890, revenue: 23000 }
  ];

  const mlInsights = [
    { 
      model: 'Customer Churn Prediction', 
      accuracy: 94.2, 
      predictions: 8450, 
      trend: 'improving',
      alert: 'high_risk_customers'
    },
    { 
      model: 'Revenue Forecasting', 
      accuracy: 91.6, 
      predictions: 2340, 
      trend: 'stable',
      alert: 'forecast_updated'
    },
    { 
      model: 'Product Recommendations', 
      accuracy: 87.3, 
      predictions: 15670, 
      trend: 'improving',
      alert: 'engagement_up'
    }
  ];

  const performanceMetrics = [
    { name: 'Response Time', value: 125, unit: 'ms', status: 'good' },
    { name: 'Throughput', value: 1250, unit: 'req/s', status: 'excellent' },
    { name: 'Error Rate', value: 0.02, unit: '%', status: 'excellent' },
    { name: 'Availability', value: 99.95, unit: '%', status: 'excellent' }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Activity className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Enterprise Analytics</h1>
                <p className="text-sm text-gray-600">Real-time insights and business intelligence</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="realtime" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Real-time</span>
            </TabsTrigger>
            <TabsTrigger value="ml-insights" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>ML Insights</span>
            </TabsTrigger>
            <TabsTrigger value="data-warehouse" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Data Warehouse</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center space-x-2">
              <Gauge className="h-4 w-4" />
              <span>Performance</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {userMetrics.map((metric, index) => (
                <motion.div
                  key={metric.metric}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{metric.metric}</p>
                          <p className="text-3xl font-bold text-gray-900">
                            {metric.value.toLocaleString()}
                            {metric.metric.includes('Rate') && '%'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(metric.trend)}
                          <span className={`text-sm font-medium ${
                            metric.change > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LineChart className="h-5 w-5 text-blue-600" />
                    <span>Revenue & Profit Trend</span>
                  </CardTitle>
                  <CardDescription>Monthly revenue and profit analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={revenueData}>
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: any, name: string) => [
                          `$${value.toLocaleString()}`, 
                          name.charAt(0).toUpperCase() + name.slice(1)
                        ]}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#60B5FF" 
                        strokeWidth={3}
                        dot={{ fill: '#60B5FF', strokeWidth: 2, r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="profit" 
                        stroke="#FF9149" 
                        strokeWidth={3}
                        dot={{ fill: '#FF9149', strokeWidth: 2, r: 4 }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Conversion Funnel */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-600" />
                    <span>Conversion Funnel</span>
                  </CardTitle>
                  <CardDescription>User journey and conversion rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {conversionFunnel.map((stage, index) => (
                      <div key={stage.stage} className="flex items-center space-x-4">
                        <div className="w-20 text-sm font-medium text-gray-600">
                          {stage.stage}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">
                              {stage.value.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">
                              {stage.percentage}%
                            </span>
                          </div>
                          <Progress 
                            value={stage.percentage} 
                            className="h-3"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Geographic Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <span>Geographic Distribution</span>
                  </CardTitle>
                  <CardDescription>Users and revenue by region</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={geoData}>
                      <XAxis dataKey="region" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="users" orientation="left" tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="revenue" orientation="right" tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="users" dataKey="users" fill="#60B5FF" name="Users" />
                      <Bar yAxisId="revenue" dataKey="revenue" fill="#FF9149" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gauge className="h-5 w-5 text-orange-600" />
                    <span>System Performance</span>
                  </CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {performanceMetrics.map((metric, index) => (
                      <div key={metric.name} className="text-center">
                        <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                          {metric.value}
                          <span className="text-sm ml-1">{metric.unit}</span>
                        </div>
                        <div className="text-sm text-gray-600">{metric.name}</div>
                        <Badge 
                          variant={metric.status === 'excellent' ? 'default' : 'secondary'}
                          className="mt-1"
                        >
                          {metric.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Real-time Tab */}
          <TabsContent value="realtime" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Live Metrics */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <span>Live Activity Feed</span>
                    <Badge variant="secondary" className="ml-2">
                      <Clock className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <motion.div 
                      className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New user registered</p>
                        <p className="text-xs text-gray-600">john.doe@company.com - 2s ago</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <DollarSign className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Purchase completed</p>
                        <p className="text-xs text-gray-600">$1,299.00 - Enterprise Plan - 15s ago</p>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">High churn risk detected</p>
                        <p className="text-xs text-gray-600">Customer ID: #12345 - 45s ago</p>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              {/* Real-time Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">234</div>
                    <div className="text-sm text-gray-600">Active Users</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">12</div>
                    <div className="text-sm text-gray-600">Live Sessions</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">1.2K</div>
                    <div className="text-sm text-gray-600">Events/min</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">89ms</div>
                    <div className="text-sm text-gray-600">Avg Response</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ML Insights Tab */}
          <TabsContent value="ml-insights" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ML Models Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    <span>ML Models Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mlInsights.map((model, index) => (
                      <div key={model.model} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{model.model}</h4>
                          {getTrendIcon(model.trend)}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Accuracy:</span>
                            <span className="ml-2 font-medium">{model.accuracy}%</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Predictions:</span>
                            <span className="ml-2 font-medium">{model.predictions.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <Progress value={model.accuracy} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Predictions & Insights */}
              <Card>
                <CardHeader>
                  <CardTitle>Latest Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="font-medium text-red-700">High Churn Risk</h4>
                      <p className="text-sm text-gray-600">
                        45 customers identified with high churn probability ({'>'}80%)
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        View Details
                      </Button>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium text-green-700">Revenue Forecast</h4>
                      <p className="text-sm text-gray-600">
                        Projected 15% growth for next quarter based on current trends
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        View Forecast
                      </Button>
                    </div>
                    
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-blue-700">Recommendations</h4>
                      <p className="text-sm text-gray-600">
                        Updated product recommendations driving 12% higher engagement
                      </p>
                      <Button size="sm" variant="outline" className="mt-2">
                        Optimize
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Data Warehouse Tab */}
          <TabsContent value="data-warehouse" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* OLAP Operations */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <span>Data Warehouse Operations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <Eye className="h-6 w-6 mb-2" />
                      <span className="text-sm">Drill Down</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <TrendingUp className="h-6 w-6 mb-2" />
                      <span className="text-sm">Drill Up</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <PieChart className="h-6 w-6 mb-2" />
                      <span className="text-sm">Slice</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <BarChart3 className="h-6 w-6 mb-2" />
                      <span className="text-sm">Dice</span>
                    </Button>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium mb-4">Active Data Cubes</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">Sales Cube</span>
                        <Badge>5 dimensions</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">Customer Cube</span>
                        <Badge>4 dimensions</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">Financial Cube</span>
                        <Badge>6 dimensions</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Warehouse Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Warehouse Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">45.8 GB</div>
                    <div className="text-sm text-gray-600">Total Data</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">1,250</div>
                    <div className="text-sm text-gray-600">Queries Today</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">89ms</div>
                    <div className="text-sm text-gray-600">Avg Query Time</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">99.95%</div>
                    <div className="text-sm text-gray-600">Availability</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span>System Health</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Database</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cache</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>API Gateway</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Analytics Engine</span>
                      <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Usage */}
              <Card>
                <CardHeader>
                  <CardTitle>Resource Usage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>CPU Usage</span>
                      <span>45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Memory Usage</span>
                      <span>67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Disk Usage</span>
                      <span>34%</span>
                    </div>
                    <Progress value={34} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Network Usage</span>
                      <span>23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
