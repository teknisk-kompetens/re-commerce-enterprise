
/**
 * SYSTEM HEALTH MONITORING DASHBOARD
 * Uptime monitoring, error tracking, alert management, and incident response
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
  XCircle,
  Clock,
  Server,
  Database,
  Network,
  Shield,
  Bell,
  BellRing,
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Globe,
  Heart,
  Cpu,
  MemoryStick,
  HardDrive,
  Wifi,
  MonitorSpeaker,
  Timer,
  AlertCircle,
  Info,
  Settings,
  Eye,
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
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts';

interface HealthData {
  uptime: {
    overview: any;
    monitors: any[];
    recentDowntime: any[];
    timeSeriesData: any[];
  };
  errors: {
    overview: any;
    errorsByService: any[];
    errorsByType: any[];
    recentErrors: any[];
    timeSeriesData: any[];
  };
  alerts: {
    overview: any;
    alertConfigurations: any[];
    activeAlerts: any[];
    recentTriggers: any[];
  };
  incidents: {
    overview: any;
    incidents: any[];
    recentIncidents: any[];
    incidentTrends: any[];
  };
  healthChecks: {
    overallHealth: any;
    checks: any[];
    timestamp: string;
  };
  systemStatus: {
    status: string;
    systemHealth: number;
    components: any;
    lastUpdated: string;
  };
  slaMetrics: {
    slaMetrics: any;
    period: string;
    timestamp: string;
  };
}

interface SystemHealthDashboardProps {
  tenantId?: string;
}

export function SystemHealthDashboard({ tenantId = 'default' }: SystemHealthDashboardProps) {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [uptime, errors, alerts, incidents, healthChecks, systemStatus, slaMetrics] = await Promise.all([
        fetch(`/api/health/system-monitoring?action=uptime_monitoring&tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/health/system-monitoring?action=error_tracking&tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/health/system-monitoring?action=alert_management&tenantId=${tenantId}`),
        fetch(`/api/health/system-monitoring?action=incident_response&tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/health/system-monitoring?action=health_checks&tenantId=${tenantId}`),
        fetch(`/api/health/system-monitoring?action=system_status&tenantId=${tenantId}`),
        fetch(`/api/health/system-monitoring?action=sla_metrics&tenantId=${tenantId}&timeRange=${selectedTimeRange}`)
      ]);

      const [uptimeData, errorsData, alertsData, incidentsData, healthChecksData, systemStatusData, slaMetricsData] = await Promise.all([
        uptime.json(),
        errors.json(),
        alerts.json(),
        incidents.json(),
        healthChecks.json(),
        systemStatus.json(),
        slaMetrics.json()
      ]);

      setData({
        uptime: uptimeData.data,
        errors: errorsData.data,
        alerts: alertsData.data,
        incidents: incidentsData.data,
        healthChecks: healthChecksData.data,
        systemStatus: systemStatusData.data,
        slaMetrics: slaMetricsData.data
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, [tenantId, selectedTimeRange]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchHealthData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh, tenantId, selectedTimeRange]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operational': case 'healthy': case 'up': case 'good': return 'text-green-600';
      case 'degraded': case 'warning': return 'text-yellow-600';
      case 'critical': case 'down': case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status?.toLowerCase()) {
      case 'operational': case 'healthy': case 'up': case 'good': return 'default';
      case 'degraded': case 'warning': return 'secondary';
      case 'critical': case 'down': case 'poor': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'operational': case 'healthy': case 'up': case 'good': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded': case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'critical': case 'down': case 'poor': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatUptime = (percentage: number) => {
    return `${percentage.toFixed(3)}%`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'low': return <Info className="h-4 w-4 text-blue-600" />;
      default: return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 animate-pulse text-red-500" />
          <span>Loading system health...</span>
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
        <AlertDescription>No health data available</AlertDescription>
      </Alert>
    );
  }

  const chartColors = ['#10B981', '#F59E0B', '#EF4444', '#6B7280'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">System Health Monitoring</h2>
          <p className="text-muted-foreground">Real-time system health, uptime, and incident management</p>
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
            <option value="1h">Last hour</option>
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          <Button onClick={fetchHealthData} size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                data.systemStatus.status === 'operational' ? 'bg-green-100' : 
                data.systemStatus.status === 'degraded' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                {getStatusIcon(data.systemStatus.status)}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Status</p>
                <p className="text-lg font-bold capitalize">{data.systemStatus.status}</p>
                <Badge variant={getStatusBadgeVariant(data.systemStatus.status)} className="text-xs mt-1">
                  {data.systemStatus.systemHealth}% Health
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Uptime</p>
                <p className="text-2xl font-bold">{formatUptime(data.uptime.overview?.avgUptime || 100)}</p>
                <p className="text-sm text-muted-foreground">
                  {data.uptime.overview?.upMonitors || 0}/{data.uptime.overview?.totalMonitors || 0} monitors up
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-red-100">
                <Bell className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold">{data.alerts.overview?.triggeredAlerts || 0}</p>
                <p className="text-sm text-muted-foreground">
                  {data.alerts.overview?.criticalAlerts || 0} critical
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-purple-100">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Incidents</p>
                <p className="text-2xl font-bold">{data.incidents.overview?.openIncidents || 0}</p>
                <p className="text-sm text-muted-foreground">
                  MTTR: {formatDuration(data.incidents.overview?.mttr || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Score Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Overall Health Score</span>
          </CardTitle>
          <CardDescription>Real-time system health assessment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-32 h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={[
                    { name: 'Health', value: data.healthChecks.overallHealth?.score || 0, fill: data.healthChecks.overallHealth?.score >= 90 ? '#10B981' : data.healthChecks.overallHealth?.score >= 70 ? '#F59E0B' : '#EF4444' }
                  ]}>
                    <RadialBar dataKey="value" cornerRadius={10} />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className={`text-2xl font-bold ${getHealthScoreColor(data.healthChecks.overallHealth?.score || 0)}`}>
                    {data.healthChecks.overallHealth?.score || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Health Score</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-5 mt-6">
            {data.healthChecks.checks?.map((check, index) => (
              <div key={index} className="text-center p-3 border rounded-lg">
                <div className="flex justify-center mb-2">
                  {check.component === 'Database' && <Database className="h-5 w-5" />}
                  {check.component === 'Application' && <Server className="h-5 w-5" />}
                  {check.component === 'Network' && <Network className="h-5 w-5" />}
                  {check.component === 'Storage' && <HardDrive className="h-5 w-5" />}
                  {check.component === 'External Services' && <Globe className="h-5 w-5" />}
                </div>
                <h4 className="font-medium text-sm">{check.component}</h4>
                <div className="flex items-center justify-center mt-2">
                  {getStatusIcon(check.status)}
                  <span className={`ml-1 text-sm ${getStatusColor(check.status)}`}>
                    {check.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {check.responseTime ? `${check.responseTime.toFixed(0)}ms` : 'N/A'}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="uptime" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="uptime">Uptime</TabsTrigger>
          <TabsTrigger value="errors">Errors</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="health">Health Checks</TabsTrigger>
          <TabsTrigger value="sla">SLA Metrics</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>

        <TabsContent value="uptime" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Uptime Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Uptime Overview</span>
                </CardTitle>
                <CardDescription>Monitor availability statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{data.uptime.overview?.upMonitors || 0}</p>
                    <p className="text-sm text-muted-foreground">Up</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{data.uptime.overview?.downMonitors || 0}</p>
                    <p className="text-sm text-muted-foreground">Down</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{data.uptime.overview?.degradedMonitors || 0}</p>
                    <p className="text-sm text-muted-foreground">Degraded</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.uptime.overview?.totalDowntimeEvents || 0}</p>
                    <p className="text-sm text-muted-foreground">Incidents</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Uptime Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Uptime Trends</span>
                </CardTitle>
                <CardDescription>Uptime percentage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.uptime.timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis 
                        domain={[95, 100]}
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                        formatter={(value: any) => [`${value}%`, 'Uptime']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="uptime" 
                        stroke="#10B981" 
                        fill="#10B981"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monitor Details */}
          <Card>
            <CardHeader>
              <CardTitle>Monitor Status</CardTitle>
              <CardDescription>Individual monitor performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.uptime.monitors?.map((monitor, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(monitor.status)}
                      <div>
                        <p className="font-medium">{monitor.monitorName}</p>
                        <p className="text-sm text-muted-foreground">
                          {monitor.monitorType} • {monitor.target}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatUptime(monitor.currentUptime)}</p>
                      <p className="text-sm text-muted-foreground">
                        {monitor.avgResponseTime}ms avg
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={getStatusBadgeVariant(monitor.status)} className="text-xs">
                          {monitor.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {monitor.successfulChecks}/{monitor.totalChecks}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Downtime */}
          {data.uptime.recentDowntime && data.uptime.recentDowntime.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Downtime Events</CardTitle>
                <CardDescription>Latest service disruptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.uptime.recentDowntime.slice(0, 8).map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg border-red-200 bg-red-50">
                      <div className="flex items-center space-x-3">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <div>
                          <p className="font-medium">{event.monitorName}</p>
                          <p className="text-sm text-muted-foreground">{event.errorMessage}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{new Date(event.checkTime).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {event.responseTime ? `${event.responseTime}ms` : 'Timeout'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="errors" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Error Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <XCircle className="h-5 w-5" />
                  <span>Error Overview</span>
                </CardTitle>
                <CardDescription>System-wide error statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2">
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

            {/* Error Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Error Trends</span>
                </CardTitle>
                <CardDescription>Error rate over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.errors.timeSeriesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="timestamp" 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis 
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleString()}
                        formatter={(value: any, name) => [`${value}${name === 'errorRate' ? '%' : ''}`, name === 'errorRate' ? 'Error Rate' : 'Error Count']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="errorRate" 
                        stroke="#EF4444" 
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Errors by Service */}
          <Card>
            <CardHeader>
              <CardTitle>Errors by Service</CardTitle>
              <CardDescription>Error breakdown per service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.errors.errorsByService?.slice(0, 8).map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{service.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.totalRequests.toLocaleString()} total requests
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">{service.totalErrors.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{service.errorRate}% rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Critical Errors */}
          {data.errors.recentErrors && data.errors.recentErrors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Critical Errors</CardTitle>
                <CardDescription>Latest unresolved critical errors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data.errors.recentErrors.slice(0, 6).map((error, index) => (
                    <div key={index} className="p-3 border rounded-lg border-red-200 bg-red-50">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            {getSeverityIcon(error.severity)}
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
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Alert Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Alert Overview</span>
                </CardTitle>
                <CardDescription>Alert configuration and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.alerts.overview?.totalAlerts || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Alerts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{data.alerts.overview?.activeAlerts || 0}</p>
                    <p className="text-sm text-muted-foreground">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{data.alerts.overview?.triggeredAlerts || 0}</p>
                    <p className="text-sm text-muted-foreground">Triggered</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-800">{data.alerts.overview?.criticalAlerts || 0}</p>
                    <p className="text-sm text-muted-foreground">Critical</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alert Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BellRing className="h-5 w-5" />
                  <span>Alert Status</span>
                </CardTitle>
                <CardDescription>Current alert status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Triggered', value: data.alerts.overview?.triggeredAlerts || 0, color: '#EF4444' },
                          { name: 'Acknowledged', value: data.alerts.overview?.acknowledgedAlerts || 0, color: '#F59E0B' },
                          { name: 'Resolved', value: data.alerts.overview?.resolvedAlerts || 0, color: '#10B981' }
                        ].filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={(entry) => `${entry.name}: ${entry.value}`}
                      >
                        {chartColors.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>Currently triggered alerts requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              {data.alerts.activeAlerts && data.alerts.activeAlerts.length > 0 ? (
                <div className="space-y-3">
                  {data.alerts.activeAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex items-start space-x-3">
                        {getSeverityIcon(alert.severity)}
                        <div>
                          <h4 className="font-medium">{alert.alertName}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <span>Triggered: {new Date(alert.triggerTime).toLocaleString()}</span>
                            <span>Value: {alert.triggerValue?.toFixed(2)}</span>
                            <span>Threshold: {alert.threshold}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant={getStatusBadgeVariant(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(alert.status)}>
                          {alert.status}
                        </Badge>
                        {alert.escalationLevel > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Escalation: {alert.escalationLevel}
                          </Badge>
                        )}
                      </div>
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

          {/* Alert Configurations */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Configurations</CardTitle>
              <CardDescription>Configured alert rules and thresholds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.alerts.alertConfigurations?.slice(0, 8).map((config, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{config.alertName}</p>
                      <p className="text-sm text-muted-foreground">
                        {config.metricName} {config.condition} {config.threshold}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Badge variant={config.isActive ? "default" : "secondary"}>
                          {config.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(config.severity)}>
                          {config.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Triggered {config.triggerCount} times
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Incident Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Incident Overview</span>
                </CardTitle>
                <CardDescription>Incident response statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{data.incidents.overview?.totalIncidents || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Incidents</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{data.incidents.overview?.openIncidents || 0}</p>
                    <p className="text-sm text-muted-foreground">Open</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{data.incidents.overview?.resolvedIncidents || 0}</p>
                    <p className="text-sm text-muted-foreground">Resolved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatDuration(data.incidents.overview?.mttr || 0)}</p>
                    <p className="text-sm text-muted-foreground">MTTR</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SLA Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>SLA Impact</span>
                </CardTitle>
                <CardDescription>Service level agreement status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">SLA Breaches</span>
                    <span className="font-semibold text-red-600">{data.incidents.overview?.slaBreaches || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Critical Incidents</span>
                    <span className="font-semibold">{data.incidents.overview?.criticalIncidents || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg Impact</span>
                    <span className="font-semibold">${data.incidents.overview?.avgImpact || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Incidents */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Incidents</CardTitle>
              <CardDescription>Latest incidents and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {data.incidents.recentIncidents && data.incidents.recentIncidents.length > 0 ? (
                <div className="space-y-3">
                  {data.incidents.recentIncidents.map((incident, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            {getSeverityIcon(incident.severity)}
                            <span className="font-medium">{incident.title}</span>
                            <Badge variant={getStatusBadgeVariant(incident.severity)}>
                              {incident.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            ID: {incident.incidentId}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusBadgeVariant(incident.status)}>
                            {incident.status}
                          </Badge>
                          <p className="text-sm text-muted-foreground mt-1">
                            {incident.affectedUsers} users affected
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Detected: {new Date(incident.detectedAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No recent incidents</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.healthChecks.checks?.map((check, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {check.component === 'Database' && <Database className="h-5 w-5" />}
                      {check.component === 'Application' && <Server className="h-5 w-5" />}
                      {check.component === 'Network' && <Network className="h-5 w-5" />}
                      {check.component === 'Storage' && <HardDrive className="h-5 w-5" />}
                      {check.component === 'External Services' && <Globe className="h-5 w-5" />}
                      <h4 className="font-medium">{check.component}</h4>
                    </div>
                    <Badge variant={getStatusBadgeVariant(check.status)}>
                      {check.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response Time:</span>
                      <span>{check.responseTime ? `${check.responseTime.toFixed(0)}ms` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Check:</span>
                      <span>{new Date(check.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-muted-foreground text-xs mt-2">{check.message}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sla" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Uptime SLA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold">{data.slaMetrics.slaMetrics?.uptime?.actual || 0}%</p>
                  <p className="text-sm text-muted-foreground">Target: {data.slaMetrics.slaMetrics?.uptime?.target || 0}%</p>
                  <Badge variant={data.slaMetrics.slaMetrics?.uptime?.met ? "default" : "destructive"} className="mt-2">
                    {data.slaMetrics.slaMetrics?.uptime?.met ? 'Met' : 'Missed'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Response Time SLA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold">{data.slaMetrics.slaMetrics?.responseTime?.actual || 0}ms</p>
                  <p className="text-sm text-muted-foreground">Target: {data.slaMetrics.slaMetrics?.responseTime?.target || 0}ms</p>
                  <Badge variant={data.slaMetrics.slaMetrics?.responseTime?.met ? "default" : "destructive"} className="mt-2">
                    {data.slaMetrics.slaMetrics?.responseTime?.met ? 'Met' : 'Missed'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Error Rate SLA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold">{data.slaMetrics.slaMetrics?.errorRate?.actual || 0}%</p>
                  <p className="text-sm text-muted-foreground">Target: &lt;{data.slaMetrics.slaMetrics?.errorRate?.target || 0}%</p>
                  <Badge variant={data.slaMetrics.slaMetrics?.errorRate?.met ? "default" : "destructive"} className="mt-2">
                    {data.slaMetrics.slaMetrics?.errorRate?.met ? 'Met' : 'Missed'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold">{data.slaMetrics.slaMetrics?.availability?.percentage || 0}%</p>
                  <p className="text-sm text-muted-foreground capitalize">{data.slaMetrics.slaMetrics?.availability?.status || 'unknown'}</p>
                  <Badge variant={
                    data.slaMetrics.slaMetrics?.availability?.status === 'excellent' ? "default" : 
                    data.slaMetrics.slaMetrics?.availability?.status === 'good' ? "secondary" : "destructive"
                  } className="mt-2">
                    {data.slaMetrics.slaMetrics?.availability?.status || 'Unknown'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="components" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-5 w-5" />
                  <span>Monitors</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-600">Healthy:</span>
                    <span className="font-semibold">{data.systemStatus.components?.monitors?.healthy || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-yellow-600">Warning:</span>
                    <span className="font-semibold">{data.systemStatus.components?.monitors?.warning || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-600">Critical:</span>
                    <span className="font-semibold">{data.systemStatus.components?.monitors?.critical || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Down:</span>
                    <span className="font-semibold">{data.systemStatus.components?.monitors?.down || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <XCircle className="h-5 w-5" />
                  <span>Errors</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{data.systemStatus.components?.errors?.unresolved || 0}</p>
                  <p className="text-sm text-muted-foreground">Unresolved Errors</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{data.systemStatus.components?.alerts?.active || 0}</p>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Incidents</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{data.systemStatus.components?.incidents?.open || 0}</p>
                  <p className="text-sm text-muted-foreground">Open Incidents</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Status Summary</CardTitle>
              <CardDescription>Overall system component status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-6">
                <div className={`p-4 rounded-full ${
                  data.systemStatus.status === 'operational' ? 'bg-green-100' : 
                  data.systemStatus.status === 'degraded' ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  {getStatusIcon(data.systemStatus.status)}
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold capitalize mb-2">{data.systemStatus.status}</h3>
                <p className="text-muted-foreground mb-4">System Health: {data.systemStatus.systemHealth}%</p>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(data.systemStatus.lastUpdated).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
