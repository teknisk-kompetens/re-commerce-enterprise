
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Database,
  Activity,
  DollarSign,
  AlertTriangle,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  Target,
  Zap
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Cell
} from 'recharts';

interface TenantAnalyticsData {
  tenantId: string;
  timeRange: string;
  analytics: Record<string, Array<{
    timestamp: Date;
    value: number;
    unit?: string;
    dimensions?: any;
    trend?: string;
    change?: number;
  }>>;
  usage: Record<string, Array<{
    timestamp: Date;
    value: number;
    unit: string;
    period: string;
    aggregation: string;
  }>>;
  resources: Array<{
    resourceType: string;
    resourceName: string;
    allocated: number;
    used: number;
    utilization: number;
    status: string;
    unit: string;
    alertThreshold: number;
  }>;
  summary: {
    totalMetrics: number;
    totalUsageRecords: number;
    alertsTriggered: number;
    avgPerformance: number;
  };
}

interface SystemAnalytics {
  systemStats: {
    totalTenants: number;
    avgMaxUsers: number;
    avgStorageLimit: number;
    avgBandwidthLimit: number;
  };
  topTenants: Array<{
    tenantId: string;
    _sum: { metricValue: number };
    tenant: {
      id: string;
      name: string;
      plan: string;
      tier: string;
    };
  }>;
  usageOverview: Array<{
    resourceType: string;
    totalUsage: number;
    avgUsage: number;
  }>;
}

interface TenantAnalyticsDashboardProps {
  tenantId?: string;
  className?: string;
}

export function TenantAnalyticsDashboard({ tenantId, className }: TenantAnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<TenantAnalyticsData | null>(null);
  const [systemData, setSystemData] = useState<SystemAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [category, setCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, [tenantId, timeRange, category]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        timeRange,
        ...(tenantId && { tenantId }),
        ...(category !== 'all' && { category })
      });

      const response = await fetch(`/api/tenant-analytics?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      if (data.success) {
        if (tenantId) {
          setAnalyticsData(data.data);
          setSystemData(null);
        } else {
          setSystemData(data.data);
          setAnalyticsData(null);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch analytics');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalytics();
    setRefreshing(false);
    toast({
      title: 'Success',
      description: 'Analytics data refreshed'
    });
  };

  const exportData = () => {
    const dataToExport = tenantId ? analyticsData : systemData;
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tenant-analytics-${tenantId || 'system'}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatValue = (value: number, unit?: string): string => {
    if (unit === 'bytes') {
      if (value >= 1e12) return `${(value / 1e12).toFixed(1)}TB`;
      if (value >= 1e9) return `${(value / 1e9).toFixed(1)}GB`;
      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}MB`;
      if (value >= 1e3) return `${(value / 1e3).toFixed(1)}KB`;
      return `${value}B`;
    }
    if (unit === 'percentage') return `${value.toFixed(1)}%`;
    if (unit === 'currency') return `$${value.toFixed(2)}`;
    return value.toLocaleString();
  };

  const getTrendIcon = (trend?: string, change?: number) => {
    if (!trend || !change) return null;
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-400" />;
  };

  const colors = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', '#80D8C3'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {tenantId ? 'Tenant Analytics' : 'System Analytics'}
          </h2>
          <p className="text-gray-600">
            {tenantId 
              ? 'Detailed analytics and insights for this tenant'
              : 'System-wide analytics and tenant overview'
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24H</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          
          {tenantId && (
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="usage">Usage</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="users">Users</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Single Tenant Analytics */}
      {analyticsData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Metrics</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.summary.totalMetrics}</div>
                <p className="text-xs text-muted-foreground">
                  Across all categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usage Records</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.summary.totalUsageRecords}</div>
                <p className="text-xs text-muted-foreground">
                  Data points collected
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alerts Triggered</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {analyticsData.summary.alertsTriggered}
                </div>
                <p className="text-xs text-muted-foreground">
                  Require attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {analyticsData.summary.avgPerformance.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  System performance
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="usage">Usage</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics Over Time</CardTitle>
                  <CardDescription>Performance trends and patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={Object.entries(analyticsData.analytics).length > 0 
                        ? Object.entries(analyticsData.analytics)[0][1].map(item => ({
                            timestamp: new Date(item.timestamp).toLocaleDateString(),
                            value: item.value,
                            trend: item.trend
                          }))
                        : []
                      }>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#60B5FF" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(analyticsData.analytics).map(([key, metrics]) => {
                  const latestMetric = metrics[metrics.length - 1];
                  if (!latestMetric) return null;

                  return (
                    <Card key={key}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium">
                            {key.split('-').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
                          </CardTitle>
                          {getTrendIcon(latestMetric.trend, latestMetric.change)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {formatValue(latestMetric.value, latestMetric.unit)}
                        </div>
                        {latestMetric.change && (
                          <p className={`text-xs ${
                            latestMetric.change > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {latestMetric.change > 0 ? '+' : ''}{latestMetric.change.toFixed(1)}% 
                            from previous period
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>System performance and response times</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData.analytics['performance-response_time'] || []}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="timestamp" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <YAxis />
                        <Tooltip 
                          labelFormatter={(value) => new Date(value).toLocaleString()}
                          formatter={(value: number) => [`${value}ms`, 'Response Time']}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#60B5FF" 
                          fill="#60B5FF" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="usage" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(analyticsData.usage).map(([resourceType, usageData]) => (
                  <Card key={resourceType}>
                    <CardHeader>
                      <CardTitle className="capitalize">{resourceType} Usage</CardTitle>
                      <CardDescription>
                        Usage patterns over {timeRange}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={usageData.slice(-10)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="timestamp"
                              tickFormatter={(value) => new Date(value).toLocaleDateString()}
                            />
                            <YAxis />
                            <Tooltip 
                              labelFormatter={(value) => new Date(value).toLocaleString()}
                              formatter={(value: number, name: string, props: any) => [
                                formatValue(value, props.payload.unit),
                                'Usage'
                              ]}
                            />
                            <Bar dataKey="value" fill="#60B5FF" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyticsData.resources.map((resource, index) => (
                  <Card key={`${resource.resourceType}-${resource.resourceName}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        {resource.resourceName}
                      </CardTitle>
                      <CardDescription className="capitalize">
                        {resource.resourceType} • {resource.status}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Utilization</span>
                          <span className={
                            resource.utilization >= 0.9 ? 'text-red-600' :
                            resource.utilization >= 0.7 ? 'text-yellow-600' :
                            'text-green-600'
                          }>
                            {(resource.utilization * 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={resource.utilization * 100} className="h-2" />
                        
                        <div className="text-xs text-gray-500 mt-2">
                          {formatValue(resource.used, resource.unit)} of{' '}
                          {formatValue(resource.allocated, resource.unit)}
                        </div>

                        {resource.utilization >= resource.alertThreshold && (
                          <Badge variant="destructive" className="text-xs">
                            Alert Threshold Exceeded
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* System Analytics */}
      {systemData && (
        <>
          {/* System Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemData.systemStats.totalTenants}</div>
                <p className="text-xs text-muted-foreground">
                  Active tenant accounts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Users/Tenant</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(systemData.systemStats.avgMaxUsers || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  User capacity per tenant
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Storage</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatValue(systemData.systemStats.avgStorageLimit || 0, 'bytes')}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per tenant allocation
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Bandwidth</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatValue(systemData.systemStats.avgBandwidthLimit || 0, 'bytes')}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per tenant allocation
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Tenants */}
            <Card>
              <CardHeader>
                <CardTitle>Top Tenants by Usage</CardTitle>
                <CardDescription>Highest resource consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemData.topTenants.slice(0, 10).map((tenant, index) => (
                    <div key={tenant.tenantId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{tenant.tenant?.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">
                            {tenant.tenant?.plan} • {tenant.tenant?.tier}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatValue(tenant._sum.metricValue || 0)}
                        </div>
                        <div className="text-sm text-gray-500">usage points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Usage Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Usage Overview</CardTitle>
                <CardDescription>System-wide resource consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={systemData.usageOverview}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="resourceType" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: number) => [formatValue(value), 'Total Usage']}
                      />
                      <Bar dataKey="totalUsage" fill="#60B5FF" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
