
/**
 * PERFORMANCE METRICS DASHBOARD
 * APM metrics, Core Web Vitals, database performance, and error tracking
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Activity,
  Clock,
  Database,
  Globe,
  MonitorSpeaker,
  Server,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  Code,
  Eye,
  AlertCircle,
  Info,
  BarChart3
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
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface PerformanceData {
  apm: {
    overview: any;
    serviceBreakdown: any[];
    statusCodeBreakdown: any[];
    timeSeriesData: any[];
    slowestEndpoints: any[];
  };
  webVitals: {
    summary: any[];
    topPages: any[];
    deviceBreakdown: any[];
    timeSeriesData: any[];
  };
  database: {
    overview: any;
    slowestQueries: any[];
    tableBreakdown: any[];
    queryTypeBreakdown: any[];
    timeSeriesData: any[];
  };
  endpoints: {
    endpoints: any[];
  };
  errors: {
    overview: any;
    errorsByService: any[];
    errorsByType: any[];
    recentErrors: any[];
    timeSeriesData: any[];
  };
  trends: {
    current: any;
    trends: any;
  };
}

interface PerformanceMetricsDashboardProps {
  tenantId?: string;
}

export function PerformanceMetricsDashboard({ tenantId = 'default' }: PerformanceMetricsDashboardProps) {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [apm, webVitals, database, endpoints, errors, trends] = await Promise.all([
        fetch(`/api/performance/apm-tracking?action=apm_metrics&tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/performance/apm-tracking?action=web_vitals&tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/performance/apm-tracking?action=query_performance&tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/performance/apm-tracking?action=endpoint_performance&tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/performance/apm-tracking?action=error_tracking&tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/performance/apm-tracking?action=performance_trends&tenantId=${tenantId}&timeRange=${selectedTimeRange}`)
      ]);

      const [apmData, webVitalsData, databaseData, endpointsData, errorsData, trendsData] = await Promise.all([
        apm.json(),
        webVitals.json(),
        database.json(),
        endpoints.json(),
        errors.json(),
        trends.json()
      ]);

      setData({
        apm: apmData.data,
        webVitals: webVitalsData.data,
        database: databaseData.data,
        endpoints: endpointsData.data,
        errors: errorsData.data,
        trends: trendsData.data
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch performance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, [tenantId, selectedTimeRange]);

  const getWebVitalRating = (metric: string, value: number) => {
    const thresholds: Record<string, { good: number; poor: number }> = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'unknown';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  };

  const getWebVitalColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatResponseTime = (ms: number) => {
    if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
    return `${ms.toFixed(0)}ms`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)}GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)}MB`;
    if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)}KB`;
    return `${bytes}B`;
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 animate-pulse" />
          <span>Loading performance data...</span>
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
        <AlertDescription>No performance data available</AlertDescription>
      </Alert>
    );
  }

  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance Metrics</h2>
          <p className="text-muted-foreground">Application performance monitoring and optimization insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="1h">Last hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <Button onClick={fetchPerformanceData} size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">{formatResponseTime(data.apm.overview?.avgResponseTime || 0)}</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(data.trends.trends?.responseTime?.direction)}
                  <span className="text-sm text-muted-foreground ml-1">
                    {data.trends.trends?.responseTime?.change?.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <p className="text-2xl font-bold">{(data.apm.overview?.totalRequests || 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  {data.apm.overview?.avgThroughput || 0} req/s
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                <p className="text-2xl font-bold">{data.apm.overview?.avgErrorRate?.toFixed(2) || 0}%</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(data.trends.trends?.errorRate?.direction)}
                  <span className="text-sm text-muted-foreground ml-1">
                    {data.trends.trends?.errorRate?.change?.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-purple-100">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">DB Avg Query Time</p>
                <p className="text-2xl font-bold">{formatResponseTime(data.database.overview?.avgExecutionTime || 0)}</p>
                <p className="text-sm text-muted-foreground">
                  {(data.database.overview?.totalQueries || 0).toLocaleString()} queries
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="apm" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="apm">APM Metrics</TabsTrigger>
          <TabsTrigger value="webvitals">Web Vitals</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>  
          <TabsTrigger value="errors">Error Tracking</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="apm" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Service Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-5 w-5" />
                  <span>Service Performance</span>
                </CardTitle>
                <CardDescription>Performance metrics by service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.apm.serviceBreakdown?.slice(0, 6).map((service, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{service.serviceName}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {service.requestCount} requests
                          </Badge>
                          <span className="text-sm font-semibold">
                            {formatResponseTime(service.avgResponseTime)}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>CPU: {service.avgCpuUsage?.toFixed(1)}%</div>
                        <div>Memory: {service.avgMemoryUsage?.toFixed(1)}%</div>
                        <div>Error: {service.avgErrorRate?.toFixed(2)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status Code Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Status Code Distribution</span>
                </CardTitle>
                <CardDescription>HTTP status codes breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.apm.statusCodeBreakdown}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        nameKey="statusCode"
                        label={(entry) => `${entry.statusCode}: ${entry.percentage}%`}
                      >
                        {data.apm.statusCodeBreakdown?.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, 'Requests']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Response Time Trends</CardTitle>
              <CardDescription>Application response time over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.apm.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                    />
                    <YAxis 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => formatResponseTime(value)}
                    />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                      formatter={(value: any, name) => [formatResponseTime(value), name]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke="#3B82F6" 
                      fill="#3B82F6"
                      fillOpacity={0.3}
                      name="Response Time"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="errorRate" 
                      stroke="#EF4444" 
                      fill="#EF4444"
                      fillOpacity={0.2}
                      name="Error Rate"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webvitals" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.webVitals.summary?.map((vital, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{vital.metric}</span>
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </CardTitle>
                  <CardDescription>
                    {vital.totalMeasurements} measurements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{vital.avgValue.toFixed(0)}</p>
                      <p className="text-sm text-muted-foreground">
                        {vital.metric === 'CLS' ? 'score' : 
                         vital.metric === 'FID' || vital.metric === 'LCP' || vital.metric === 'FCP' || vital.metric === 'TTFB' ? 'ms' : 'units'}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Good</span>
                        <span>{vital.distribution.good}%</span>
                      </div>
                      <Progress value={vital.distribution.good} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-yellow-600">Needs Improvement</span>
                        <span>{vital.distribution.needsImprovement}%</span>
                      </div>
                      <Progress value={vital.distribution.needsImprovement} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-red-600">Poor</span>
                        <span>{vital.distribution.poor}%</span>
                      </div>
                      <Progress value={vital.distribution.poor} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Top Pages by Web Vitals */}
          <Card>
            <CardHeader>
              <CardTitle>Pages Performance</CardTitle>
              <CardDescription>Top pages by Web Vitals performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.webVitals.topPages?.slice(0, 8).map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate">{page.page}</p>
                      <p className="text-xs text-muted-foreground">{page.measurements} measurements</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{page.avgValue.toFixed(0)}</p>
                      <div className="w-2 h-2 rounded-full mt-1 ml-auto" 
                           style={{ backgroundColor: page.avgValue < 2500 ? '#10B981' : page.avgValue < 4000 ? '#F59E0B' : '#EF4444' }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Query Type Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Query Type Performance</span>
                </CardTitle>
                <CardDescription>Performance by query type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.database.queryTypeBreakdown?.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                        <span className="font-medium">{type.queryType}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatResponseTime(type.avgExecutionTime)}</p>
                        <p className="text-sm text-muted-foreground">{type.count} queries</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Table Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <HardDrive className="h-5 w-5" />
                  <span>Table Performance</span>
                </CardTitle>
                <CardDescription>Slowest database tables</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.database.tableBreakdown?.slice(0, 6).map((table, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{table.tableName}</p>
                        <p className="text-sm text-muted-foreground">{table.queryCount} queries</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatResponseTime(table.avgExecutionTime)}</p>
                        <p className="text-sm text-muted-foreground">
                          {table.totalRowsScanned.toLocaleString()} rows scanned
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Slowest Queries */}
          <Card>
            <CardHeader>
              <CardTitle>Slowest Queries</CardTitle>
              <CardDescription>Queries with the highest execution time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.database.slowestQueries?.slice(0, 8).map((query, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{query.queryType}</Badge>
                        <span className="text-sm font-medium">{query.tableName}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-red-600">{formatResponseTime(query.executionTime)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(query.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>Rows affected: {query.rowsAffected.toLocaleString()}</div>
                      <div>Rows scanned: {query.rowsScanned.toLocaleString()}</div>
                      <div>Cache hit: {query.cacheHit ? 'Yes' : 'No'}</div>
                    </div>
                    {query.errorMessage && (
                      <p className="text-sm text-red-600 mt-2">{query.errorMessage}</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="endpoints" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Network className="h-5 w-5" />
                <span>API Endpoint Performance</span>
              </CardTitle>
              <CardDescription>Performance metrics for all API endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.endpoints.endpoints?.slice(0, 10).map((endpoint, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {endpoint.endpoint.split(' ')[0]}
                        </Badge>
                        <span className="font-medium text-sm">{endpoint.endpoint.split(' ')[1]}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatResponseTime(endpoint.avgResponseTime)}</p>
                        <p className="text-sm text-muted-foreground">{endpoint.requestCount} requests</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>Error: {endpoint.avgErrorRate.toFixed(2)}%</div>
                      <div>Throughput: {endpoint.avgThroughput.toFixed(1)} req/s</div>
                      <div>DB Time: {formatResponseTime(endpoint.avgDatabaseTime)}</div>
                      <div>API Time: {formatResponseTime(endpoint.avgExternalApiTime)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Error Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Error Overview</span>
                </CardTitle>
                <CardDescription>Overall error statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{data.errors.overview?.totalErrors?.toLocaleString() || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Errors</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.errors.overview?.overallErrorRate?.toFixed(3) || 0}%</p>
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">{data.errors.overview?.unresolvedErrors || 0}</p>
                    <p className="text-sm text-muted-foreground">Unresolved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{data.errors.overview?.criticalErrors || 0}</p>
                    <p className="text-sm text-muted-foreground">Critical</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Errors by Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="h-5 w-5" />
                  <span>Errors by Type</span>
                </CardTitle>
                <CardDescription>Error distribution by type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.errors.errorsByType?.slice(0, 6).map((errorType, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                        <span className="font-medium">{errorType.type}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{errorType.count}</p>
                        <p className="text-sm text-muted-foreground">{errorType.avgRate.toFixed(2)}% rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Critical Errors */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Critical Errors</CardTitle>
              <CardDescription>Latest unresolved critical errors</CardDescription>
            </CardHeader>
            <CardContent>
              {data.errors.recentErrors && data.errors.recentErrors.length > 0 ? (
                <div className="space-y-3">
                  {data.errors.recentErrors.map((error, index) => (
                    <div key={index} className="p-3 border rounded-lg border-red-200 bg-red-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="font-medium">{error.service}</span>
                            <Badge variant="destructive">{error.severity}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{error.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{error.errorCount} occurrences</p>
                          <p className="text-sm text-muted-foreground">
                            {error.affectedUsers} users affected
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{error.message}</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>First: {new Date(error.firstOccurrence).toLocaleString()}</span>
                        <span>Last: {new Date(error.lastOccurrence).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No critical errors</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Response Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{formatResponseTime(data.trends.current?.responseTime || 0)}</p>
                    <p className="text-sm text-muted-foreground">Current average</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(data.trends.trends?.responseTime?.direction)}
                    <span className={`font-semibold ${
                      data.trends.trends?.responseTime?.direction === 'up' ? 'text-red-600' : 
                      data.trends.trends?.responseTime?.direction === 'down' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {Math.abs(data.trends.trends?.responseTime?.change || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Error Rate</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{data.trends.current?.errorRate?.toFixed(2) || 0}%</p>
                    <p className="text-sm text-muted-foreground">Current rate</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(data.trends.trends?.errorRate?.direction)}
                    <span className={`font-semibold ${
                      data.trends.trends?.errorRate?.direction === 'up' ? 'text-red-600' : 
                      data.trends.trends?.errorRate?.direction === 'down' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {Math.abs(data.trends.trends?.errorRate?.change || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Throughput</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{data.trends.current?.throughput || 0}</p>
                    <p className="text-sm text-muted-foreground">req/s</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(data.trends.trends?.throughput?.direction)}
                    <span className={`font-semibold ${
                      data.trends.trends?.throughput?.direction === 'up' ? 'text-green-600' : 
                      data.trends.trends?.throughput?.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {Math.abs(data.trends.trends?.throughput?.change || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MemoryStick className="h-5 w-5" />
                  <span>Memory Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{data.trends.current?.memoryUsage?.toFixed(1) || 0}%</p>
                    <p className="text-sm text-muted-foreground">Current usage</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(data.trends.trends?.memoryUsage?.direction)}
                    <span className={`font-semibold ${
                      data.trends.trends?.memoryUsage?.direction === 'up' ? 'text-red-600' : 
                      data.trends.trends?.memoryUsage?.direction === 'down' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {Math.abs(data.trends.trends?.memoryUsage?.change || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cpu className="h-5 w-5" />
                  <span>CPU Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{data.trends.current?.cpuUsage?.toFixed(1) || 0}%</p>
                    <p className="text-sm text-muted-foreground">Current usage</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(data.trends.trends?.cpuUsage?.direction)}
                    <span className={`font-semibold ${
                      data.trends.trends?.cpuUsage?.direction === 'up' ? 'text-red-600' : 
                      data.trends.trends?.cpuUsage?.direction === 'down' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {Math.abs(data.trends.trends?.cpuUsage?.change || 0).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
