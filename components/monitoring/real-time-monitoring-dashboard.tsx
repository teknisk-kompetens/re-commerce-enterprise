
/**
 * REAL-TIME MONITORING DASHBOARD
 * Live system metrics, alerts, and resource usage monitoring
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
  AlertTriangle,
  CheckCircle,
  Cpu,
  Database,
  HardDrive,
  MemoryStick,
  Network,
  Server,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  AlertCircle,
  Info
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface MonitoringData {
  systemMonitors: any[];
  liveMetrics: Record<string, any[]>;
  resourceUsages: any[];
  alerts: any[];
  healthScore: number;
}

interface RealtimeMonitoringDashboardProps {
  tenantId?: string;
  refreshInterval?: number;
}

export function RealtimeMonitoringDashboard({ 
  tenantId = 'default', 
  refreshInterval = 30000 
}: RealtimeMonitoringDashboardProps) {
  const [data, setData] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchMonitoringData = async () => {
    try {
      setError(null);
      const response = await fetch(
        `/api/monitoring/real-time?tenantId=${tenantId}&timeRange=${selectedTimeRange}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch monitoring data');
      }
      
      const result = await response.json();
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoringData();
  }, [tenantId, selectedTimeRange]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchMonitoringData, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, tenantId, selectedTimeRange]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': case 'ok': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'healthy': case 'ok': return 'default';
      case 'warning': return 'secondary';
      case 'critical': case 'down': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': case 'ok': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': case 'down': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatMetricValue = (value: number, unit: string) => {
    if (unit === 'bytes') {
      if (value > 1e9) return `${(value / 1e9).toFixed(1)}GB`;
      if (value > 1e6) return `${(value / 1e6).toFixed(1)}MB`;
      if (value > 1e3) return `${(value / 1e3).toFixed(1)}KB`;
      return `${value}B`;
    }
    if (unit === 'ms') return `${value.toFixed(1)}ms`;
    if (unit === 'percentage') return `${value.toFixed(1)}%`;
    return `${value.toFixed(1)} ${unit}`;
  };

  const getTrendIcon = (trend: string | null) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Activity className="h-6 w-6 animate-pulse" />
          <span>Loading monitoring data...</span>
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
        <AlertDescription>No monitoring data available</AlertDescription>
      </Alert>
    );
  }

  const pieChartColors = ['#10B981', '#F59E0B', '#EF4444', '#6B7280'];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Real-time Monitoring</h2>
          <p className="text-muted-foreground">Live system metrics and alerts</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Auto Refresh:</label>
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? 'ON' : 'OFF'}
            </Button>
          </div>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="5m">Last 5 minutes</option>
            <option value="15m">Last 15 minutes</option>
            <option value="1h">Last hour</option>
            <option value="24h">Last 24 hours</option>
          </select>
          <Button onClick={fetchMonitoringData} size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full bg-opacity-10 ${
                data.healthScore >= 90 ? 'bg-green-100' : 
                data.healthScore >= 70 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <Activity className={`h-6 w-6 ${
                  data.healthScore >= 90 ? 'text-green-600' : 
                  data.healthScore >= 70 ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Health Score</p>
                <p className="text-2xl font-bold">{data.healthScore || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Server className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Monitors</p>
                <p className="text-2xl font-bold">{data.systemMonitors?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-purple-100">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Live Metrics</p>
                <p className="text-2xl font-bold">
                  {Object.values(data.liveMetrics || {}).reduce((sum, metrics) => sum + metrics.length, 0)}
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
                <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold">{data.alerts?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="systems">System Monitors</TabsTrigger>
          <TabsTrigger value="resources">Resource Usage</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="metrics">Live Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* System Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>System Status Distribution</CardTitle>
                <CardDescription>Current status of all monitored systems</CardDescription>
              </CardHeader>
              <CardContent>
                {data.systemMonitors && data.systemMonitors.length > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Healthy', value: data.systemMonitors.filter(m => m.status === 'healthy').length, color: '#10B981' },
                            { name: 'Warning', value: data.systemMonitors.filter(m => m.status === 'warning').length, color: '#F59E0B' },
                            { name: 'Critical', value: data.systemMonitors.filter(m => m.status === 'critical').length, color: '#EF4444' },
                            { name: 'Down', value: data.systemMonitors.filter(m => m.status === 'down').length, color: '#6B7280' }
                          ].filter(item => item.value > 0)}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={(entry) => `${entry.name}: ${entry.value}`}
                        >
                          {pieChartColors.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    No system monitor data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resource Usage Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Resource Usage Overview</CardTitle>
                <CardDescription>Current resource utilization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.resourceUsages && data.resourceUsages.length > 0 ? (
                  data.resourceUsages.slice(0, 4).map((resource, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {resource.resourceType === 'cpu' && <Cpu className="h-4 w-4" />}
                          {resource.resourceType === 'memory' && <MemoryStick className="h-4 w-4" />}
                          {resource.resourceType === 'disk' && <HardDrive className="h-4 w-4" />}
                          {resource.resourceType === 'network' && <Network className="h-4 w-4" />}
                          {resource.resourceType === 'database' && <Database className="h-4 w-4" />}
                          <span className="text-sm font-medium capitalize">{resource.resourceType}</span>
                          <Badge 
                            variant={getStatusBadgeVariant(resource.alertStatus)}
                            className="text-xs"
                          >
                            {resource.alertStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(resource.trend)}
                          <span className="text-sm font-medium">{resource.usagePercent.toFixed(1)}%</span>
                        </div>
                      </div>
                      <Progress 
                        value={resource.usagePercent} 
                        className="h-2"
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">
                    No resource usage data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>Latest system alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {data.alerts && data.alerts.length > 0 ? (
                <div className="space-y-3">
                  {data.alerts.slice(0, 5).map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(alert.alertConfiguration?.severity || 'info')}
                        <div>
                          <p className="font-medium">{alert.alertConfiguration?.alertName || 'Unknown Alert'}</p>
                          <p className="text-sm text-muted-foreground">
                            Triggered at {new Date(alert.triggerTime).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusBadgeVariant(alert.status)}>
                          {alert.status}
                        </Badge>
                        <span className="text-sm font-mono">
                          {alert.triggerValue?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No active alerts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="systems" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Monitors</CardTitle>
              <CardDescription>All monitored systems and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              {data.systemMonitors && data.systemMonitors.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.systemMonitors.map((monitor, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Server className="h-4 w-4" />
                            <span className="font-medium">{monitor.instanceId}</span>
                          </div>
                          <Badge variant={getStatusBadgeVariant(monitor.status)}>
                            {monitor.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="capitalize">{monitor.monitorType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">CPU:</span>
                            <span>{monitor.cpuUsage?.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Memory:</span>
                            <span>{monitor.memoryUsage?.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Response:</span>
                            <span>{monitor.responseTime?.toFixed(0)}ms</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Updated:</span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(monitor.updatedAt).toLocaleString()}</span>
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No system monitors configured
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resource Usage Details</CardTitle>
              <CardDescription>Detailed resource utilization metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {data.resourceUsages && data.resourceUsages.length > 0 ? (
                <div className="space-y-6">
                  {data.resourceUsages.map((resource, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {resource.resourceType === 'cpu' && <Cpu className="h-5 w-5" />}
                          {resource.resourceType === 'memory' && <MemoryStick className="h-5 w-5" />}
                          {resource.resourceType === 'disk' && <HardDrive className="h-5 w-5" />}
                          {resource.resourceType === 'network' && <Network className="h-5 w-5" />}
                          {resource.resourceType === 'database' && <Database className="h-5 w-5" />}
                          <h4 className="font-medium capitalize">{resource.resourceType} - {resource.resourceName}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getStatusBadgeVariant(resource.alertStatus)}>
                            {resource.alertStatus}
                          </Badge>
                          {getTrendIcon(resource.trend)}
                        </div>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-3 mb-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Current Usage</p>
                          <p className="text-lg font-semibold">
                            {formatMetricValue(resource.currentUsage, resource.unit)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Max Capacity</p>
                          <p className="text-lg font-semibold">
                            {resource.maxCapacity ? formatMetricValue(resource.maxCapacity, resource.unit) : 'N/A'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Usage Percentage</p>
                          <p className="text-lg font-semibold">{resource.usagePercent.toFixed(1)}%</p>
                        </div>
                      </div>
                      
                      <Progress value={resource.usagePercent} className="h-3" />
                      
                      <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>Last updated: {new Date(resource.timestamp).toLocaleString()}</span>
                        <span>100%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No resource usage data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>All currently active alerts and their details</CardDescription>
            </CardHeader>
            <CardContent>
              {data.alerts && data.alerts.length > 0 ? (
                <div className="space-y-4">
                  {data.alerts.map((alert, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getStatusIcon(alert.alertConfiguration?.severity || 'info')}
                          <div className="space-y-1">
                            <h4 className="font-medium">{alert.alertConfiguration?.alertName || 'Unknown Alert'}</h4>
                            <p className="text-sm text-muted-foreground">
                              {alert.alertConfiguration?.description || 'No description available'}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>Triggered: {new Date(alert.triggerTime).toLocaleString()}</span>
                              <span>Value: {alert.triggerValue?.toFixed(2)}</span>
                              <span>Threshold: {alert.alertConfiguration?.threshold}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge variant={getStatusBadgeVariant(alert.alertConfiguration?.severity || 'info')}>
                            {alert.alertConfiguration?.severity || 'info'}
                          </Badge>
                          <Badge variant={getStatusBadgeVariant(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                      
                      {alert.status === 'acknowledged' && (
                        <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                          <p><strong>Acknowledged by:</strong> {alert.acknowledgedBy}</p>
                          <p><strong>At:</strong> {new Date(alert.acknowledgedAt).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No active alerts</p>
                  <p className="text-sm">All systems are operating normally</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Metrics</CardTitle>
              <CardDescription>Real-time metrics and performance data</CardDescription>
            </CardHeader>
            <CardContent>
              {data.liveMetrics && Object.keys(data.liveMetrics).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(data.liveMetrics).slice(0, 4).map(([metricKey, metrics]) => (
                    <div key={metricKey} className="space-y-2">
                      <h4 className="font-medium capitalize">{metricKey.replace('.', ' - ')}</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={metrics.slice(-20)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                              dataKey="timestamp" 
                              tick={{ fontSize: 10 }}
                              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                            />
                            <YAxis tick={{ fontSize: 10 }} />
                            <Tooltip 
                              labelFormatter={(value) => new Date(value).toLocaleString()}
                              formatter={(value: any, name) => [
                                `${value.toFixed(2)} ${metrics[0]?.unit || ''}`, 
                                name
                              ]}
                            />
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#3B82F6" 
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No live metrics data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
