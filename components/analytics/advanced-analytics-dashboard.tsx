
/**
 * ADVANCED ANALYTICS DASHBOARD
 * User engagement, feature usage, conversion funnels, and revenue analytics
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  MousePointer,
  TrendingUp,
  DollarSign,
  Activity,
  BarChart3,
  PieChart as PieChartIcon,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Clock,
  UserCheck,
  Zap,
  Target,
  ShoppingCart,
  AlertCircle,
  Info
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';

// Proper TypeScript interfaces for analytics data
interface EngagementOverview {
  totalUsers: number;
  activeUsers: number;
  sessionsToday: number;
  averageSessionDuration: number;
  bounceRate: number;
  pageViews: number;
}

interface DeviceBreakdown {
  device: 'desktop' | 'mobile' | 'tablet';
  users: number;
  percentage: number;
  averageSessionDuration: number;
}

interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  metric: string;
}

interface FeatureUsage {
  featureId: string;
  featureName: string;
  usageCount: number;
  uniqueUsers: number;
  conversionRate: number;
  category: string;
}

interface CategoryBreakdown {
  category: string;
  usageCount: number;
  percentage: number;
  averageTimeSpent: number;
}

interface ConversionFunnel {
  id: string;
  name: string;
  steps: Array<{
    stepName: string;
    users: number;
    conversionRate: number;
    dropoffRate: number;
  }>;
  overallConversionRate: number;
  totalUsers: number;
}

interface FunnelSummary {
  totalFunnels: number;
  averageConversionRate: number;
  biggestDropoffStep: string;
  mostImprovedFunnel: string;
}

interface RevenueOverview {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageRevenuePerUser: number;
  revenueGrowthRate: number;
  totalCustomers: number;
  churnRate: number;
}

interface RevenueByType {
  type: 'subscription' | 'one-time' | 'addon';
  amount: number;
  percentage: number;
  growth: number;
}

interface RevenueByPlan {
  planName: string;
  amount: number;
  subscribers: number;
  averageRevenuePerUser: number;
}

interface JourneySummary {
  totalJourneys: number;
  averageSteps: number;
  topConversionPath: string;
  averageTimeToConversion: number;
}

interface UserPath {
  id: string;
  path: string[];
  userCount: number;
  conversionRate: number;
  averageDuration: number;
}

interface DeviceAnalysis {
  device: 'desktop' | 'mobile' | 'tablet';
  userCount: number;
  conversionRate: number;
  averageSessionDuration: number;
}

interface BehavioralSegment {
  id: string;
  name: string;
  userCount: number;
  conversionRate: number;
  averageValue: number;
  characteristics: string[];
}

interface SegmentSummary {
  totalSegments: number;
  mostValuableSegment: string;
  fastestGrowingSegment: string;
  segmentationAccuracy: number;
}

interface AnalyticsData {
  userEngagement: {
    overview: EngagementOverview;
    deviceBreakdown: DeviceBreakdown[];
    timeSeriesData: TimeSeriesDataPoint[];
  };
  featureUsage: {
    topFeatures: FeatureUsage[];
    categoryBreakdown: CategoryBreakdown[];
    timeSeriesData: TimeSeriesDataPoint[];
  };
  conversionFunnels: {
    funnels: ConversionFunnel[];
    summary: FunnelSummary;
  };
  revenueAnalytics: {
    overview: RevenueOverview;
    revenueByType: RevenueByType[];
    revenueByPlan: RevenueByPlan[];
    timeSeriesData: TimeSeriesDataPoint[];
  };
  userJourneys: {
    summary: JourneySummary;
    topPaths: UserPath[];
    deviceAnalysis: DeviceAnalysis[];
  };
  behavioralSegments: {
    segments: BehavioralSegment[];
    summary: SegmentSummary;
  };
}

interface AdvancedAnalyticsDashboardProps {
  tenantId?: string;
}

export function AdvancedAnalyticsDashboard({ tenantId = 'default' }: AdvancedAnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [activeMetric, setActiveMetric] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [engagement, features, funnels, revenue, journeys, segments] = await Promise.all([
        fetch(`/api/analytics/advanced-dashboard?action=user_engagement&tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/analytics/advanced-dashboard?action=feature_usage&tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/analytics/advanced-dashboard?action=conversion_funnel&tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/analytics/advanced-dashboard?action=revenue_analytics&tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/analytics/advanced-dashboard?action=user_journey&tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/analytics/advanced-dashboard?action=behavioral_segments&tenantId=${tenantId}`)
      ]);

      const [engagementData, featuresData, funnelsData, revenueData, journeysData, segmentsData] = await Promise.all([
        engagement.json(),
        features.json(),
        funnels.json(),
        revenue.json(),
        journeys.json(),
        segments.json()
      ]);

      setData({
        userEngagement: engagementData.data,
        featureUsage: featuresData.data,
        conversionFunnels: funnelsData.data,
        revenueAnalytics: revenueData.data,
        userJourneys: journeysData.data,
        behavioralSegments: segmentsData.data
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [tenantId, selectedTimeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 animate-pulse" />
          <span>Loading analytics data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>No analytics data available</AlertDescription>
      </Alert>
    );
  }

  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Advanced Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights into user behavior and business metrics</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button onClick={fetchAnalyticsData} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{formatNumber(data.userEngagement.overview?.totalSessions || 0)}</p>
                <p className="text-sm text-muted-foreground">
                  {formatNumber(data.userEngagement.overview?.uniqueUsers || 0)} unique users
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(data.revenueAnalytics.overview?.totalRevenue || 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  MRR: {formatCurrency(data.revenueAnalytics.overview?.totalMRR || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-purple-100">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">
                  {data.conversionFunnels.summary?.avgConversionRate?.toFixed(1) || 0}%
                </p>
                <p className="text-sm text-muted-foreground">
                  {data.conversionFunnels.summary?.totalEvents || 0} funnel events
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-orange-100">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Session Duration</p>
                <p className="text-2xl font-bold">
                  {formatDuration(data.userEngagement.overview?.avgSessionDuration || 0)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Bounce rate: {data.userEngagement.overview?.bounceRate?.toFixed(1) || 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="engagement" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="engagement">User Engagement</TabsTrigger>
          <TabsTrigger value="features">Feature Usage</TabsTrigger>
          <TabsTrigger value="funnels">Conversion Funnels</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="journeys">User Journeys</TabsTrigger>
          <TabsTrigger value="segments">Behavioral Segments</TabsTrigger>
        </TabsList>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Device Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChartIcon className="h-5 w-5" />
                  <span>Device Breakdown</span>
                </CardTitle>
                <CardDescription>Sessions by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.userEngagement.deviceBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="sessions"
                        nameKey="device"
                        label={(entry) => `${entry.device}: ${entry.sessions}`}
                      >
                        {data.userEngagement.deviceBreakdown.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Sessions']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Engagement Trends</span>
                </CardTitle>
                <CardDescription>User engagement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.userEngagement.timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                        formatter={(value: any, name) => [value, name]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#3B82F6" 
                        fill="#3B82F6"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Details</CardTitle>
              <CardDescription>Detailed breakdown of user engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {data.userEngagement.deviceBreakdown.map((device, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize">{device.device}</h4>
                      <Badge variant="outline">{device.sessions} sessions</Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Avg Duration:</span>
                        <span>{formatDuration(device.avgDuration)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Top Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Top Features</span>
                </CardTitle>
                <CardDescription>Most used features and their adoption rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.featureUsage.topFeatures.slice(0, 8).map((feature, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                        <span className="font-medium">{feature.feature}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{feature.usage}</p>
                        <p className="text-sm text-muted-foreground">{feature.uniqueUsers} users</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Category Breakdown</span>
                </CardTitle>
                <CardDescription>Feature usage by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.featureUsage.categoryBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="category" 
                        tick={{ fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip formatter={(value: any, name) => [value, name]} />
                      <Bar dataKey="usage" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature Usage Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage Trends</CardTitle>
              <CardDescription>How feature usage has changed over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.featureUsage.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                      formatter={(value: any, name) => [value, name]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnels" className="space-y-4">
          <div className="grid gap-4">
            {data.conversionFunnels.funnels.map((funnel, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>{funnel.funnelName} Funnel</span>
                  </CardTitle>
                  <CardDescription>
                    Overall conversion rate: {funnel.overallConversionRate.toFixed(1)}% 
                    ({funnel.totalConversions} conversions)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {funnel.steps.map((step: any, stepIndex: number) => (
                      <div key={stepIndex} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold">
                            {step.stepOrder}
                          </div>
                          <div>
                            <p className="font-medium">{step.stepName}</p>
                            <p className="text-sm text-muted-foreground">
                              {step.count} users • {step.conversionRate.toFixed(1)}% conversion
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{step.completions} completed</p>
                          {stepIndex > 0 && (
                            <p className="text-sm text-red-600">
                              {step.dropoffRate.toFixed(1)}% dropoff
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Revenue by Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Revenue by Type</span>
                </CardTitle>
                <CardDescription>Breakdown of revenue sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.revenueAnalytics.revenueByType.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                        <span className="font-medium capitalize">{type.type}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(type.amount)}</p>
                        <p className="text-sm text-muted-foreground">{type.count} transactions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue by Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Revenue by Plan</span>
                </CardTitle>
                <CardDescription>Revenue breakdown by subscription plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.revenueAnalytics.revenueByPlan.map((plan, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                        <span className="font-medium capitalize">{plan.plan}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(plan.amount)}</p>
                        <p className="text-sm text-muted-foreground">{plan.customers} customers</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Revenue growth over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.revenueAnalytics.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                      formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#10B981" 
                      fill="#10B981"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="journeys" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Journey Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Journey Summary</span>
                </CardTitle>
                <CardDescription>Overview of user journey metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatNumber(data.userJourneys.summary?.totalJourneys || 0)}</p>
                    <p className="text-sm text-muted-foreground">Total Journeys</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.userJourneys.summary?.avgJourneyLength || 0}</p>
                    <p className="text-sm text-muted-foreground">Avg Steps</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatDuration(data.userJourneys.summary?.avgJourneyTime || 0)}</p>
                    <p className="text-sm text-muted-foreground">Avg Duration</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.userJourneys.summary?.conversionRate || 0}%</p>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Journey Device Analysis</span>
                </CardTitle>
                <CardDescription>User journeys by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.userJourneys.deviceAnalysis?.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium capitalize">{device.device}</span>
                      <div className="text-right">
                        <p className="font-semibold">{device.count} journeys</p>
                        <p className="text-sm text-muted-foreground">{device.conversionRate}% conversion</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Journey Paths */}
          <Card>
            <CardHeader>
              <CardTitle>Top Journey Paths</CardTitle>
              <CardDescription>Most common user journey paths</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.userJourneys.topPaths?.slice(0, 10).map((path, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{path.path}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{path.count}</p>
                      <p className="text-sm text-muted-foreground">{path.conversionRate}% conversion</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Behavioral Segments</span>
              </CardTitle>
              <CardDescription>
                {data.behavioralSegments.summary?.totalSegments || 0} segments with {formatNumber(data.behavioralSegments.summary?.totalMemberships || 0)} total memberships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.behavioralSegments.segments?.map((segment, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{segment.name}</h4>
                        <Badge variant={segment.isActive ? "default" : "secondary"}>
                          {segment.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="capitalize">{segment.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Users:</span>
                          <span className="font-semibold">{formatNumber(segment.userCount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Memberships:</span>
                          <span>{segment.activeMemberships}</span>
                        </div>
                        {segment.description && (
                          <p className="text-muted-foreground text-xs mt-2">{segment.description}</p>
                        )}
                        {segment.tags && segment.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {segment.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
