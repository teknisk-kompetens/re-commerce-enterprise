
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Users,
  Package,
  Target,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  CreditCard,
  Wallet,
  Coins,
  Award,
  Star,
  Zap,
  Globe,
  Clock,
  AlertCircle,
  CheckCircle,
  Info,
  Settings,
  Share2,
  ExternalLink,
  Gauge,
  Shield,
  Lock,
  Unlock,
  Database,
  Server,
  Cpu,
  HardDrive,
  Network,
  MonitorSpeaker,
  Bell,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Scale,
  Building,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

// Import Recharts dynamically to avoid SSR issues
import dynamic from 'next/dynamic';

const LineChartComponent = dynamic(() => import('recharts').then(mod => ({ default: mod.LineChart })), { ssr: false });
const BarChartComponent = dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart })), { ssr: false });
const AreaChartComponent = dynamic(() => import('recharts').then(mod => ({ default: mod.AreaChart })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => ({ default: mod.Line })), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => ({ default: mod.Bar })), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => ({ default: mod.Area })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => ({ default: mod.Legend })), { ssr: false });

interface PlatformEconomicsMonitoringProps {
  tenantId?: string;
  userRole?: string;
}

export default function PlatformEconomicsMonitoring({ 
  tenantId = "default",
  userRole = "admin"
}: PlatformEconomicsMonitoringProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("monthly");
  const [alertLevel, setAlertLevel] = useState("all");
  const [economicsData, setEconomicsData] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [marketHealth, setMarketHealth] = useState(null);
  const [forecasts, setForecasts] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEconomicsData();
  }, [timeframe, tenantId]);

  const fetchEconomicsData = async () => {
    setLoading(true);
    try {
      const [economicsRes, kpisRes, healthRes] = await Promise.all([
        fetch(`/api/secondary-market/economics?period=${timeframe}&tenantId=${tenantId}&limit=12`),
        fetch(`/api/secondary-market/economics?action=calculate_kpis&timeframe=${timeframe}&tenantId=${tenantId}`),
        fetch(`/api/secondary-market/economics?action=market_health&tenantId=${tenantId}`),
      ]);

      const [economicsData, kpisData, healthData] = await Promise.all([
        economicsRes.json(),
        kpisRes.json(),
        healthRes.json(),
      ]);

      setEconomicsData(economicsData);
      setKpis(kpisData.kpis);
      setMarketHealth(healthData.marketHealth);
      setForecasts(economicsData.forecasts || []);
      
      // Generate system alerts based on data
      setSystemAlerts(generateSystemAlerts(economicsData, kpisData.kpis, healthData.marketHealth));
    } catch (error) {
      console.error('Error fetching economics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSystemAlerts = (economics: any, kpis: any, health: any) => {
    const alerts = [];
    const latestData = economics?.economics?.[0];

    if (latestData?.profitMargin < 0.2) {
      alerts.push({
        type: 'warning',
        title: 'Low Profit Margin',
        description: 'Platform profit margin below 20%',
        severity: 'medium',
        time: new Date(),
      });
    }

    if (health?.liquidity < 0.5) {
      alerts.push({
        type: 'error',
        title: 'Low Market Liquidity',
        description: 'Market liquidity below optimal levels',
        severity: 'high',
        time: new Date(),
      });
    }

    if (latestData?.revenueGrowthRate < -5) {
      alerts.push({
        type: 'error',
        title: 'Revenue Decline',
        description: 'Revenue growth rate showing negative trend',
        severity: 'high',
        time: new Date(),
      });
    }

    if (latestData?.userGrowthRate > 20) {
      alerts.push({
        type: 'success',
        title: 'Strong User Growth',
        description: 'User acquisition exceeding targets',
        severity: 'low',
        time: new Date(),
      });
    }

    return alerts;
  };

  const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', '#80D8C3', '#A19AD3', '#72BF78'];

  const EconomicsOverview = () => {
    const latestData = economicsData?.economics?.[0];
    const previousData = economicsData?.economics?.[1];
    
    const calculateChange = (current: number, previous: number) => {
      if (!previous) return 0;
      return ((current - previous) / previous) * 100;
    };

    return (
      <div className="space-y-6">
        {/* Key Economic Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Platform Revenue</p>
                    <p className="text-2xl font-bold text-green-900">
                      ${latestData?.totalRevenue?.toLocaleString() || '0'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {calculateChange(latestData?.totalRevenue || 0, previousData?.totalRevenue || 0) >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      )}
                      <span className="text-xs text-green-600">
                        {Math.abs(calculateChange(latestData?.totalRevenue || 0, previousData?.totalRevenue || 0)).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Profit Margin</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {((latestData?.profitMargin || 0) * 100).toFixed(1)}%
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Target className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-blue-600">Target: 25%</span>
                    </div>
                  </div>
                  <Percent className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Active Users</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {(latestData?.activeBuyers + latestData?.activeSellers + latestData?.activeCreators || 0).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Users className="h-3 w-3 text-purple-500" />
                      <span className="text-xs text-purple-600">
                        +{latestData?.newUsers || 0} new
                      </span>
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Market Health</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {marketHealth?.overall || 'Good'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Gauge className="h-3 w-3 text-orange-500" />
                      <span className="text-xs text-orange-600">
                        {((marketHealth?.liquidity || 0) * 100).toFixed(0)}% liquidity
                      </span>
                    </div>
                  </div>
                  <Activity className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Platform Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-blue-500" />
                Revenue Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {!loading && economicsData?.economics?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChartComponent data={economicsData.economics.slice(0, 12).reverse()}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                      />
                      <YAxis 
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        contentStyle={{ fontSize: 11 }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: 11 }}
                        verticalAlign="top"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="totalRevenue" 
                        stackId="1"
                        stroke={COLORS[0]} 
                        fill={COLORS[0]}
                        fillOpacity={0.6}
                        name="Total Revenue"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="platformFees" 
                        stackId="2"
                        stroke={COLORS[1]} 
                        fill={COLORS[1]}
                        fillOpacity={0.6}
                        name="Platform Fees"
                      />
                    </AreaChartComponent>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <BarChart3 className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Growth Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {!loading && economicsData?.economics?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChartComponent data={economicsData.economics.slice(0, 6).reverse()}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                      />
                      <YAxis 
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        tickFormatter={(value) => `${value.toFixed(0)}%`}
                      />
                      <Tooltip 
                        formatter={(value) => [`${Number(value).toFixed(1)}%`, '']}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        contentStyle={{ fontSize: 11 }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: 11 }}
                        verticalAlign="top"
                      />
                      <Bar dataKey="revenueGrowthRate" fill={COLORS[2]} name="Revenue Growth" />
                      <Bar dataKey="userGrowthRate" fill={COLORS[3]} name="User Growth" />
                      <Bar dataKey="transactionGrowthRate" fill={COLORS[4]} name="Transaction Growth" />
                    </BarChartComponent>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <BarChart3 className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPI Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Gross Margin</span>
                  <span>{((kpis?.grossMargin || 0) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(kpis?.grossMargin || 0) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Operating Efficiency</span>
                  <span>{((1 - (latestData?.operatingCosts || 0) / (latestData?.totalRevenue || 1)) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(1 - (latestData?.operatingCosts || 0) / (latestData?.totalRevenue || 1)) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>ROI</span>
                  <span>{((latestData?.roi || 0) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={Math.min((latestData?.roi || 0) * 100, 100)} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Customer LTV</span>
                <span className="font-semibold">${kpis?.customerLifetimeValue || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Customer CAC</span>
                <span className="font-semibold">${kpis?.customerAcquisitionCost || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">LTV/CAC Ratio</span>
                <span className="font-semibold">
                  {((kpis?.customerLifetimeValue || 0) / (kpis?.customerAcquisitionCost || 1)).toFixed(1)}x
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">User Engagement</span>
                <span className="font-semibold">
                  {((kpis?.userEngagement || 0) * 100).toFixed(0)}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Market Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {economicsData?.insights?.map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    insight.severity === 'positive' ? 'bg-green-500' :
                    insight.severity === 'warning' ? 'bg-yellow-500' :
                    insight.severity === 'negative' ? 'bg-red-500' : 'bg-blue-500'
                  }`} />
                  <p className="text-sm text-gray-600">{insight.message}</p>
                </div>
              )) || (
                <p className="text-sm text-gray-500">No insights available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const SystemHealth = () => (
    <div className="space-y-6">
      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">System Uptime</p>
                <p className="text-2xl font-bold text-green-900">99.9%</p>
                <p className="text-xs text-green-500 mt-1">Last 30 days</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Transaction Success</p>
                <p className="text-2xl font-bold text-blue-900">
                  {((kpis?.transactionSuccess || 0) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-blue-500 mt-1">Success rate</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">API Performance</p>
                <p className="text-2xl font-bold text-purple-900">245ms</p>
                <p className="text-xs text-purple-500 mt-1">Avg response time</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Error Rate</p>
                <p className="text-2xl font-bold text-orange-900">0.03%</p>
                <p className="text-xs text-orange-500 mt-1">System errors</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-red-500" />
              System Alerts
            </CardTitle>
            <Select value={alertLevel} onValueChange={setAlertLevel}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemAlerts
              .filter(alert => alertLevel === 'all' || alert.severity === alertLevel)
              .map((alert, index) => (
                <Alert key={index} className={
                  alert.type === 'error' ? 'border-red-200 bg-red-50' :
                  alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                  'border-green-200 bg-green-50'
                }>
                  <div className="flex items-start gap-3">
                    {alert.type === 'error' ? (
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                    ) : alert.type === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <AlertTitle className="text-sm font-semibold">{alert.title}</AlertTitle>
                      <AlertDescription className="text-sm text-gray-600 mt-1">
                        {alert.description}
                      </AlertDescription>
                      <p className="text-xs text-gray-500 mt-2">
                        {alert.time.toLocaleTimeString()}
                      </p>
                    </div>
                    <Badge variant="outline" className={
                      alert.severity === 'high' ? 'border-red-300 text-red-700' :
                      alert.severity === 'medium' ? 'border-yellow-300 text-yellow-700' :
                      'border-blue-300 text-blue-700'
                    }>
                      {alert.severity}
                    </Badge>
                  </div>
                </Alert>
              ))}
            
            {systemAlerts.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">All Systems Operational</h3>
                <p className="text-gray-500">No alerts or issues detected</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-500" />
              Resource Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  CPU Usage
                </span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4" />
                  Memory Usage
                </span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Database Usage
                </span>
                <span>23%</span>
              </div>
              <Progress value={23} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Network I/O
                </span>
                <span>12%</span>
              </div>
              <Progress value={12} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-green-500" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Response Time (95th)</span>
              <span className="font-semibold">450ms</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Throughput</span>
              <span className="font-semibold">1,234 req/min</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Error Rate</span>
              <span className="font-semibold text-green-600">0.03%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Concurrent Users</span>
              <span className="font-semibold">847</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Sessions</span>
              <span className="font-semibold">1,205</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const MarketOptimization = () => (
    <div className="space-y-6">
      {/* Optimization Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            Optimization Opportunities
          </CardTitle>
          <CardDescription>
            AI-powered recommendations to improve platform performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                title: "Increase Secondary Market Fees",
                description: "Consider raising fees by 1% to improve revenue margins",
                impact: { revenue: 15, cost: 0 },
                confidence: 87,
                type: "revenue"
              },
              {
                title: "Launch Creator Incentive Program",
                description: "Implement tiered rewards to improve creator retention",
                impact: { revenue: 8, cost: 5 },
                confidence: 76,
                type: "retention"
              },
              {
                title: "Optimize Pricing Algorithms",
                description: "Update dynamic pricing rules for better market efficiency",
                impact: { revenue: 12, cost: 3 },
                confidence: 92,
                type: "efficiency"
              },
              {
                title: "Expand Payment Options",
                description: "Add more payment methods to reduce transaction friction",
                impact: { revenue: 6, cost: 8 },
                confidence: 68,
                type: "conversion"
              }
            ].map((opportunity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold">{opportunity.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{opportunity.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant="outline" className={
                      opportunity.type === 'revenue' ? 'border-green-300 text-green-700' :
                      opportunity.type === 'retention' ? 'border-blue-300 text-blue-700' :
                      opportunity.type === 'efficiency' ? 'border-purple-300 text-purple-700' :
                      'border-orange-300 text-orange-700'
                    }>
                      {opportunity.type}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Revenue Impact</p>
                    <p className="font-semibold text-green-600">+{opportunity.impact.revenue}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Implementation Cost</p>
                    <p className="font-semibold text-orange-600">{opportunity.impact.cost}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Confidence</p>
                    <div className="flex items-center gap-2">
                      <Progress value={opportunity.confidence} className="h-1 flex-1" />
                      <span className="font-semibold">{opportunity.confidence}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Forecasts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            Economic Forecasts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {forecasts?.map((forecast, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold capitalize mb-2">{forecast.metric}</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="font-semibold">
                    {forecast.metric === 'revenue' ? '$' : ''}
                    {forecast.currentValue?.toLocaleString()}
                    {forecast.metric === 'newUsers' ? ' users' : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Forecast</span>
                  <span className="font-semibold text-blue-600">
                    {forecast.metric === 'revenue' ? '$' : ''}
                    {forecast.forecastValue?.toLocaleString()}
                    {forecast.metric === 'newUsers' ? ' users' : ''}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Confidence</span>
                  <div className="flex items-center gap-2">
                    <Progress value={forecast.confidence * 100} className="h-1 w-16" />
                    <span className="text-xs">{(forecast.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 col-span-2">No forecasts available</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Benchmark Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-blue-500" />
            Industry Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { metric: "Average Revenue per User", value: 127, benchmark: 115, unit: "$" },
              { metric: "Customer Acquisition Cost", value: 45, benchmark: 52, unit: "$" },
              { metric: "Monthly Churn Rate", value: 3.2, benchmark: 4.1, unit: "%" },
              { metric: "Gross Margin", value: 72, benchmark: 68, unit: "%" },
              { metric: "Transaction Success Rate", value: 98.7, benchmark: 96.3, unit: "%" },
              { metric: "Time to Market", value: 14, benchmark: 18, unit: " days" },
            ].map((item, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium text-sm mb-3">{item.metric}</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Your Platform</span>
                    <span className="font-semibold">
                      {item.unit === "$" && item.unit}{item.value}
                      {item.unit !== "$" && item.unit}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Industry Average</span>
                    <span className="text-gray-600">
                      {item.unit === "$" && item.unit}{item.benchmark}
                      {item.unit !== "$" && item.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.value > item.benchmark ? (
                      <ThumbsUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <ThumbsDown className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-xs ${
                      item.value > item.benchmark ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.value > item.benchmark ? 'Above' : 'Below'} average
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Platform Economics</h1>
              <p className="text-gray-600 mt-2">
                Monitor platform health, performance, and economic indicators
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Last Week</SelectItem>
                  <SelectItem value="monthly">Last Month</SelectItem>
                  <SelectItem value="quarterly">Last Quarter</SelectItem>
                  <SelectItem value="yearly">Last Year</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={fetchEconomicsData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Alerts
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center gap-2">
              <MonitorSpeaker className="h-4 w-4" />
              System Health
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Optimization
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <EconomicsOverview />
          </TabsContent>

          <TabsContent value="health">
            <SystemHealth />
          </TabsContent>

          <TabsContent value="optimization">
            <MarketOptimization />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
