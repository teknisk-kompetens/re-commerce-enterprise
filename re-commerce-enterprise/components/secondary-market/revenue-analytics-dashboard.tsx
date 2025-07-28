
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

// Import Recharts dynamically to avoid SSR issues
import dynamic from 'next/dynamic';

const LineChartComponent = dynamic(() => import('recharts').then(mod => ({ default: mod.LineChart })), { ssr: false });
const BarChartComponent = dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart })), { ssr: false });
const PieChartComponent = dynamic(() => import('recharts').then(mod => ({ default: mod.PieChart })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => ({ default: mod.Line })), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => ({ default: mod.Bar })), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => ({ default: mod.Cell })), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => ({ default: mod.Pie })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false });
const Legend = dynamic(() => import('recharts').then(mod => ({ default: mod.Legend })), { ssr: false });

interface RevenueAnalyticsDashboardProps {
  userId?: string;
  userRole?: string;
  tenantId?: string;
}

export default function RevenueAnalyticsDashboard({ 
  userId, 
  userRole = "user",
  tenantId = "default"
}: RevenueAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("monthly");
  const [filterBy, setFilterBy] = useState("all");
  const [revenueData, setRevenueData] = useState(null);
  const [marketAnalytics, setMarketAnalytics] = useState(null);
  const [economicsData, setEconomicsData] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe, filterBy]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [revenueRes, marketRes, economicsRes] = await Promise.all([
        fetch(`/api/secondary-market/revenue-sharing?recipientId=${userId || 'all'}&timeframe=${timeframe}`),
        fetch(`/api/secondary-market/market-analytics?period=${timeframe}&limit=30`),
        fetch(`/api/secondary-market/economics?period=${timeframe}&tenantId=${tenantId}&limit=12`),
      ]);

      const [revenueData, marketData, economicsData] = await Promise.all([
        revenueRes.json(),
        marketRes.json(),
        economicsRes.json(),
      ]);

      setRevenueData(revenueData);
      setMarketAnalytics(marketData);
      setEconomicsData(economicsData);
      
      // Generate trends data for charts
      setTrendsData(generateTrendsData(economicsData.economics || []));
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTrendsData = (economics: any[]) => {
    return economics.slice(0, 12).reverse().map((item, index) => ({
      month: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
      primaryRevenue: item.primaryMarketRevenue || 0,
      secondaryRevenue: item.secondaryMarketRevenue || 0,
      subscriptionRevenue: item.subscriptionRevenue || 0,
      royaltyRevenue: item.royaltyRevenue || 0,
      totalRevenue: item.totalRevenue || 0,
      transactions: (item.primaryTransactions || 0) + (item.secondaryTransactions || 0),
      users: item.newUsers || 0,
      growth: index > 0 ? ((item.totalRevenue - economics[index - 1]?.totalRevenue) / economics[index - 1]?.totalRevenue * 100) : 0,
    }));
  };

  const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', '#80D8C3', '#A19AD3', '#72BF78'];

  const RevenueOverview = () => {
    const latestEconomics = economicsData?.economics?.[0];
    const previousEconomics = economicsData?.economics?.[1];
    
    const calculateGrowth = (current: number, previous: number) => {
      if (!previous) return 0;
      return ((current - previous) / previous) * 100;
    };

    return (
      <div className="space-y-6">
        {/* Revenue KPIs */}
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
                    <p className="text-sm font-medium text-green-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-900">
                      ${latestEconomics?.totalRevenue?.toLocaleString() || '0'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {calculateGrowth(latestEconomics?.totalRevenue || 0, previousEconomics?.totalRevenue || 0) >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      )}
                      <span className="text-xs text-green-600">
                        {Math.abs(calculateGrowth(latestEconomics?.totalRevenue || 0, previousEconomics?.totalRevenue || 0)).toFixed(1)}%
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
                    <p className="text-sm font-medium text-blue-600">Secondary Market</p>
                    <p className="text-2xl font-bold text-blue-900">
                      ${latestEconomics?.secondaryMarketRevenue?.toLocaleString() || '0'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-blue-500" />
                      <span className="text-xs text-blue-600">
                        {((latestEconomics?.secondaryMarketRevenue || 0) / (latestEconomics?.totalRevenue || 1) * 100).toFixed(1)}% of total
                      </span>
                    </div>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
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
                    <p className="text-sm font-medium text-purple-600">Subscriptions</p>
                    <p className="text-2xl font-bold text-purple-900">
                      ${latestEconomics?.subscriptionRevenue?.toLocaleString() || '0'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <RefreshCw className="h-3 w-3 text-purple-500" />
                      <span className="text-xs text-purple-600">Recurring</span>
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
                    <p className="text-sm font-medium text-orange-600">Creator Royalties</p>
                    <p className="text-2xl font-bold text-orange-900">
                      ${latestEconomics?.royaltyRevenue?.toLocaleString() || '0'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 text-orange-500" />
                      <span className="text-xs text-orange-600">
                        {((latestEconomics?.royaltyRevenue || 0) / (latestEconomics?.totalRevenue || 1) * 100).toFixed(1)}% share
                      </span>
                    </div>
                  </div>
                  <Award className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Revenue Trends Chart */}
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
                {!loading && trendsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChartComponent data={trendsData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                      />
                      <YAxis 
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                      />
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                        labelStyle={{ fontSize: 11 }}
                        contentStyle={{ fontSize: 11 }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: 11 }}
                        verticalAlign="top"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalRevenue" 
                        stroke={COLORS[0]} 
                        strokeWidth={3}
                        name="Total Revenue"
                        dot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="secondaryRevenue" 
                        stroke={COLORS[1]} 
                        strokeWidth={2}
                        name="Secondary Market"
                        dot={{ r: 3 }}
                      />
                    </LineChartComponent>
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
                <PieChart className="h-5 w-5 text-purple-500" />
                Revenue Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {!loading && latestEconomics ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChartComponent>
                      <Pie
                        data={[
                          { name: 'Primary Market', value: latestEconomics.primaryMarketRevenue || 0 },
                          { name: 'Secondary Market', value: latestEconomics.secondaryMarketRevenue || 0 },
                          { name: 'Subscriptions', value: latestEconomics.subscriptionRevenue || 0 },
                          { name: 'Royalties', value: latestEconomics.royaltyRevenue || 0 },
                        ].filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                        contentStyle={{ fontSize: 11 }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: 11 }}
                        verticalAlign="top"
                      />
                    </PieChartComponent>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <PieChart className="h-12 w-12 text-gray-300" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Market Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Market Liquidity</span>
                  <span>{((latestEconomics?.marketLiquidity || 0) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(latestEconomics?.marketLiquidity || 0) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Price Stability</span>
                  <span>{((latestEconomics?.priceStability || 0) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(latestEconomics?.priceStability || 0) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Profit Margin</span>
                  <span>{((latestEconomics?.profitMargin || 0) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(latestEconomics?.profitMargin || 0) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Growth Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Revenue Growth</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="font-semibold text-green-600">
                    +{latestEconomics?.revenueGrowthRate?.toFixed(1) || 0}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">User Growth</span>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold text-blue-600">
                    +{latestEconomics?.userGrowthRate?.toFixed(1) || 0}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Transaction Growth</span>
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4 text-purple-500" />
                  <span className="font-semibold text-purple-600">
                    +{latestEconomics?.transactionGrowthRate?.toFixed(1) || 0}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Insights</CardTitle>
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

  const MarketAnalytics = () => (
    <div className="space-y-6">
      {/* Market Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Trading Volume</p>
                <p className="text-2xl font-bold text-green-900">
                  ${marketAnalytics?.aggregatedMetrics?.totalVolume?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-green-500 mt-1">Last 30 days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Average Price</p>
                <p className="text-2xl font-bold text-blue-900">
                  ${marketAnalytics?.aggregatedMetrics?.avgPrice?.toFixed(2) || '0.00'}
                </p>
                <p className="text-xs text-blue-500 mt-1">Market average</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Market Demand</p>
                <p className="text-2xl font-bold text-purple-900">
                  {((marketAnalytics?.aggregatedMetrics?.avgDemand || 0) * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-purple-500 mt-1">Demand score</p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Market Trends Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-4">Price Movement</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Trend</span>
                  <Badge className={
                    marketAnalytics?.trendAnalysis?.overallTrend === 'rising' ? 'bg-green-100 text-green-800' :
                    marketAnalytics?.trendAnalysis?.overallTrend === 'falling' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }>
                    {marketAnalytics?.trendAnalysis?.overallTrend || 'stable'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Price Change</span>
                  <span className={`font-semibold ${
                    (marketAnalytics?.trendAnalysis?.priceMovement?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(marketAnalytics?.trendAnalysis?.priceMovement?.change || 0) >= 0 ? '+' : ''}
                    {marketAnalytics?.trendAnalysis?.priceMovement?.change?.toFixed(2) || '0.00'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Volume Change</span>
                  <span className={`font-semibold ${
                    (marketAnalytics?.trendAnalysis?.volumeMovement?.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(marketAnalytics?.trendAnalysis?.volumeMovement?.change || 0) >= 0 ? '+' : ''}
                    {marketAnalytics?.trendAnalysis?.volumeMovement?.change?.toFixed(0) || '0'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Market Comparison</h4>
              <div className="space-y-3">
                {marketAnalytics?.marketComparison?.slice(0, 4).map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{item.assetType}</span>
                    <div className="text-right">
                      <span className="font-semibold">${item.avgPrice?.toFixed(2)}</span>
                      <div className="text-xs text-gray-500">
                        Vol: {item.totalVolume?.toFixed(0)}
                      </div>
                    </div>
                  </div>
                )) || (
                  <p className="text-sm text-gray-500">No comparison data available</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Analytics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Market Activity Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {!loading && marketAnalytics?.analytics?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChartComponent data={marketAnalytics.analytics.slice(0, 10).reverse()}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    contentStyle={{ fontSize: 11 }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: 11 }}
                    verticalAlign="top"
                  />
                  <Bar dataKey="viewCount" fill={COLORS[0]} name="Views" />
                  <Bar dataKey="listingCount" fill={COLORS[1]} name="Listings" />
                  <Bar dataKey="saleCount" fill={COLORS[2]} name="Sales" />
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
  );

  const CreatorEconomy = () => (
    <div className="space-y-6">
      {/* Creator Economy Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Creator Earnings</p>
                <p className="text-2xl font-bold text-yellow-900">
                  ${latestEconomics?.creatorEarnings?.toLocaleString() || '0'}
                </p>
                <p className="text-xs text-yellow-500 mt-1">This period</p>
              </div>
              <Coins className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active Creators</p>
                <p className="text-2xl font-bold text-purple-900">
                  {latestEconomics?.activeCreators || 0}
                </p>
                <p className="text-xs text-purple-500 mt-1">Publishing content</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Avg. Creator Income</p>
                <p className="text-2xl font-bold text-green-900">
                  ${latestEconomics?.averageCreatorIncome?.toFixed(0) || '0'}
                </p>
                <p className="text-xs text-green-500 mt-1">Per creator</p>
              </div>
              <Wallet className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Retention Rate</p>
                <p className="text-2xl font-bold text-blue-900">
                  {((latestEconomics?.creatorRetentionRate || 0) * 100).toFixed(1)}%
                </p>
                <p className="text-xs text-blue-500 mt-1">Creator retention</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Creator Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Creator Economy Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {!loading && trendsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChartComponent data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ fontSize: 11 }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: 11 }}
                    verticalAlign="top"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="royaltyRevenue" 
                    stroke={COLORS[3]} 
                    strokeWidth={3}
                    name="Royalty Revenue"
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="subscriptionRevenue" 
                    stroke={COLORS[4]} 
                    strokeWidth={2}
                    name="Subscription Revenue"
                    dot={{ r: 3 }}
                  />
                </LineChartComponent>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <LineChart className="h-12 w-12 text-gray-300" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Creators */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Top Performing Creators</CardTitle>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">Creator {index + 1}</p>
                    <p className="text-sm text-gray-600">
                      {Math.floor(Math.random() * 50) + 10} assets created
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    ${(Math.random() * 5000 + 1000).toFixed(0)}
                  </p>
                  <p className="text-xs text-gray-500">This month</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const latestEconomics = economicsData?.economics?.[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Revenue Analytics</h1>
              <p className="text-gray-600 mt-2">
                Comprehensive insights into platform revenue and market performance
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
              
              <Button variant="outline" onClick={fetchAnalyticsData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Report
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
              <BarChart3 className="h-4 w-4" />
              Revenue Overview
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Market Analytics
            </TabsTrigger>
            <TabsTrigger value="creators" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Creator Economy
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <RevenueOverview />
          </TabsContent>

          <TabsContent value="market">
            <MarketAnalytics />
          </TabsContent>

          <TabsContent value="creators">
            <CreatorEconomy />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


