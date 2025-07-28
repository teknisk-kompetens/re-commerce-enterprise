
/**
 * ML OPERATIONS CENTER
 * Scalable AI model serving, monitoring, explainability,
 * governance, and production health management
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Settings, 
  Activity, 
  Shield, 
  Eye, 
  GitBranch, 
  Server, 
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  BarChart3,
  TrendingUp,
  Zap,
  Play,
  Pause,
  RotateCcw,
  RefreshCw,
  Plus,
  Download,
  Upload
} from 'lucide-react';
import dynamic from 'next/dynamic';

// @ts-ignore
const Chart = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64">Loading chart...</div>
});

interface MLOpsData {
  serving: any[];
  monitoring: any[];
  versioning: any[];
  governance: any[];
  stats: {
    totalModels: number;
    activeServing: number;
    healthyModels: number;
    totalVersions: number;
    governancePolicies: number;
    complianceRate: number;
  };
  alerts: any[];
}

export default function MLOpsCenter() {
  const [data, setData] = useState<MLOpsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [processing, setProcessing] = useState(false);
  
  // Form states
  const [deployForm, setDeployForm] = useState({
    modelId: '',
    name: '',
    version: '',
    replicas: '1',
    cpu: '500m',
    memory: '1Gi'
  });

  const [versionForm, setVersionForm] = useState({
    modelId: '',
    version: '',
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchMLOpsData();
  }, []);

  const fetchMLOpsData = async () => {
    try {
      const response = await fetch('/api/ml-ops');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch ML Ops data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeployModel = async () => {
    if (!deployForm.modelId || !deployForm.name) return;
    
    setProcessing(true);
    try {
      const response = await fetch('/api/ml-ops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deploy_model',
          data: {
            modelId: deployForm.modelId,
            name: deployForm.name,
            version: deployForm.version,
            type: 'classification',
            framework: 'tensorflow',
            servingConfig: {
              resourceRequirements: {
                cpu: deployForm.cpu,
                memory: deployForm.memory,
                replicas: parseInt(deployForm.replicas)
              }
            },
            scaling: {
              type: 'auto',
              enabled: true
            },
            tenantId: 'default'
          }
        })
      });
      
      const result = await response.json();
      if (result.servingId) {
        setDeployForm({ modelId: '', name: '', version: '', replicas: '1', cpu: '500m', memory: '1Gi' });
        await fetchMLOpsData();
      }
    } catch (error) {
      console.error('Failed to deploy model:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleScaleModel = async (servingId: string, targetReplicas: number) => {
    setProcessing(true);
    try {
      const response = await fetch('/api/ml-ops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'scale_model',
          data: {
            servingId,
            targetReplicas,
            modelId: 'model_1'
          }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        await fetchMLOpsData();
      }
    } catch (error) {
      console.error('Failed to scale model:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleCreateVersion = async () => {
    if (!versionForm.modelId || !versionForm.version) return;
    
    setProcessing(true);
    try {
      const response = await fetch('/api/ml-ops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_version',
          data: {
            modelId: versionForm.modelId,
            version: versionForm.version,
            name: versionForm.name,
            description: versionForm.description,
            artifacts: [],
            metadata: { framework: 'tensorflow' },
            performance: { accuracy: 0.95 },
            compatibility: { apiVersion: '1.0' }
          }
        })
      });
      
      const result = await response.json();
      if (result.versionId) {
        setVersionForm({ modelId: '', version: '', name: '', description: '' });
        await fetchMLOpsData();
      }
    } catch (error) {
      console.error('Failed to create version:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleRollbackModel = async (modelId: string, targetVersion: string) => {
    setProcessing(true);
    try {
      const response = await fetch('/api/ml-ops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rollback_model',
          data: {
            modelId,
            targetVersion
          }
        })
      });
      
      const result = await response.json();
      if (result.success) {
        await fetchMLOpsData();
      }
    } catch (error) {
      console.error('Failed to rollback model:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading ML Operations Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <Settings className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">ML Operations Center</h1>
                <p className="text-gray-600">Scalable AI model serving, monitoring, and governance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Model
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Config
              </Button>
              <Button variant="outline" onClick={fetchMLOpsData} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Models</p>
                  <p className="text-2xl font-bold text-gray-900">{data?.stats?.totalModels || 0}</p>
                </div>
                <Database className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Serving</p>
                  <p className="text-2xl font-bold text-gray-900">{data?.stats?.activeServing || 0}</p>
                </div>
                <Server className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Healthy Models</p>
                  <p className="text-2xl font-bold text-gray-900">{data?.stats?.healthyModels || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Versions</p>
                  <p className="text-2xl font-bold text-gray-900">{data?.stats?.totalVersions || 0}</p>
                </div>
                <GitBranch className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Governance Policies</p>
                  <p className="text-2xl font-bold text-gray-900">{data?.stats?.governancePolicies || 0}</p>
                </div>
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{data?.stats?.complianceRate || 0}%</p>
                </div>
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {data?.alerts && data.alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">System Alerts</h2>
            <div className="space-y-3">
              {data.alerts.map((alert) => (
                <Alert key={alert.id} className={`${
                  alert.severity === 'high' ? 'border-red-500 bg-red-50' : 
                  alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' : 
                  'border-blue-500 bg-blue-50'
                }`}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>{alert.message}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {alert.model}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {alert.type}
                        </Badge>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="serving">Serving</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="versioning">Versioning</TabsTrigger>
            <TabsTrigger value="governance">Governance</TabsTrigger>
            <TabsTrigger value="explainability">Explainability</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Model Health Overview */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Model Health Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Chart
                      data={[{
                        values: [24, 3, 1],
                        labels: ['Healthy', 'Degraded', 'Unhealthy'],
                        type: 'pie',
                        hole: 0.4,
                        marker: {
                          colors: ['#10B981', '#F59E0B', '#EF4444']
                        }
                      }]}
                      layout={{
                        autosize: true,
                        margin: { l: 40, r: 40, t: 40, b: 40 },
                        showlegend: true,
                        legend: { orientation: 'h', y: -0.2 }
                      }}
                      config={{
                        responsive: true,
                        displayModeBar: false
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Performance Trends */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Chart
                      data={[{
                        x: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                        y: [99.8, 99.7, 99.9, 99.6, 99.8, 99.9],
                        type: 'scatter',
                        mode: 'lines+markers',
                        name: 'Availability',
                        line: { color: '#10B981' }
                      }]}
                      layout={{
                        autosize: true,
                        margin: { l: 40, r: 40, t: 40, b: 40 },
                        yaxis: { title: { text: 'Availability %' } },
                        showlegend: false
                      }}
                      config={{
                        responsive: true,
                        displayModeBar: false
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Resource Usage */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    Resource Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Chart
                      data={[{
                        x: ['CPU', 'Memory', 'Storage', 'Network', 'GPU'],
                        y: [67.4, 73.2, 45.8, 12.3, 89.1],
                        type: 'bar',
                        marker: { color: '#3B82F6' }
                      }]}
                      layout={{
                        autosize: true,
                        margin: { l: 40, r: 40, t: 40, b: 40 },
                        yaxis: { title: { text: 'Usage %' } },
                        showlegend: false
                      }}
                      config={{
                        responsive: true,
                        displayModeBar: false
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* SLA Metrics */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    SLA Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Availability</span>
                      <div className="flex items-center gap-2">
                        <Progress value={99.97} className="w-24 h-2" />
                        <span className="text-sm font-bold">99.97%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Response Time</span>
                      <div className="flex items-center gap-2">
                        <Progress value={85} className="w-24 h-2" />
                        <span className="text-sm font-bold">145ms</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Error Rate</span>
                      <div className="flex items-center gap-2">
                        <Progress value={3} className="w-24 h-2" />
                        <span className="text-sm font-bold">0.03%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Throughput</span>
                      <div className="flex items-center gap-2">
                        <Progress value={92} className="w-24 h-2" />
                        <span className="text-sm font-bold">15.4K/s</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="serving" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Deploy Model */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Deploy Model
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="model-id">Model ID</Label>
                    <Input
                      id="model-id"
                      placeholder="Enter model ID"
                      value={deployForm.modelId}
                      onChange={(e) => setDeployForm({ ...deployForm, modelId: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="deploy-name">Deployment Name</Label>
                    <Input
                      id="deploy-name"
                      placeholder="Enter deployment name"
                      value={deployForm.name}
                      onChange={(e) => setDeployForm({ ...deployForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deploy-version">Version</Label>
                    <Input
                      id="deploy-version"
                      placeholder="Enter version"
                      value={deployForm.version}
                      onChange={(e) => setDeployForm({ ...deployForm, version: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="replicas">Replicas</Label>
                      <Input
                        id="replicas"
                        type="number"
                        placeholder="1"
                        value={deployForm.replicas}
                        onChange={(e) => setDeployForm({ ...deployForm, replicas: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpu">CPU</Label>
                      <Input
                        id="cpu"
                        placeholder="500m"
                        value={deployForm.cpu}
                        onChange={(e) => setDeployForm({ ...deployForm, cpu: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="memory">Memory</Label>
                    <Input
                      id="memory"
                      placeholder="1Gi"
                      value={deployForm.memory}
                      onChange={(e) => setDeployForm({ ...deployForm, memory: e.target.value })}
                    />
                  </div>

                  <Button 
                    onClick={handleDeployModel} 
                    disabled={processing || !deployForm.modelId || !deployForm.name}
                    className="w-full"
                  >
                    {processing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Deploy Model
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Model Serving */}
              <div className="lg:col-span-2">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      Model Serving
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data?.serving?.map((serving) => (
                        <div key={serving.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="font-medium">{serving.name}</h3>
                                <Badge variant={serving.status === 'active' ? 'default' : 'secondary'}>
                                  {serving.status}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  v{serving.version}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{serving.type} • {serving.framework}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>Replicas: {serving.scaling.replicas}/{serving.scaling.maxReplicas}</span>
                                <span>•</span>
                                <span>CPU: {serving.resources.cpu}</span>
                                <span>•</span>
                                <span>Memory: {serving.resources.memory}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={serving.health.status === 'healthy' ? 'default' : 'destructive'} className="text-xs">
                                {serving.health.status}
                              </Badge>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleScaleModel(serving.id, serving.scaling.replicas + 1)}
                                disabled={processing}
                              >
                                <TrendingUp className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Settings className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Uptime</p>
                              <p className="font-medium">{serving.health.uptime}%</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Endpoints</p>
                              <p className="font-medium">{serving.endpoints.length}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Created</p>
                              <p className="font-medium">{new Date(serving.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Updated</p>
                              <p className="font-medium">{new Date(serving.lastUpdated).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Model Monitoring */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Model Monitoring
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data?.monitoring?.map((monitoring) => (
                      <div key={monitoring.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{monitoring.name}</h3>
                            <p className="text-sm text-gray-600">Model ID: {monitoring.modelId}</p>
                          </div>
                          <Badge variant={monitoring.performance.uptime > 99 ? 'default' : 'destructive'}>
                            {monitoring.performance.uptime}% uptime
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Response Time</span>
                              <span className="text-sm font-medium">{monitoring.performance.responseTime}ms</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Error Rate</span>
                              <span className="text-sm font-medium">{monitoring.performance.errorRate}%</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Throughput</span>
                              <span className="text-sm font-medium">{monitoring.performance.throughput}/s</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">CPU Usage</span>
                              <span className="text-sm font-medium">{monitoring.resources.cpuUtilization}%</span>
                            </div>
                          </div>
                        </div>

                        {monitoring.alerts && monitoring.alerts.length > 0 && (
                          <div className="mt-3 pt-3 border-t">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">Active Alerts</span>
                              <Badge variant="destructive" className="text-xs">
                                {monitoring.alerts.length}
                              </Badge>
                            </div>
                            <div className="mt-2 space-y-1">
                              {monitoring.alerts.slice(0, 2).map((alert: any) => (
                                <div key={alert.id} className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                                  {alert.message}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Chart
                      data={[{
                        x: ['Response Time', 'Throughput', 'Error Rate', 'CPU Usage', 'Memory Usage'],
                        y: [145, 85, 0.3, 67, 73],
                        type: 'bar',
                        marker: { color: '#3B82F6' }
                      }]}
                      layout={{
                        autosize: true,
                        margin: { l: 40, r: 40, t: 40, b: 40 },
                        yaxis: { title: { text: 'Value' } },
                        showlegend: false
                      }}
                      config={{
                        responsive: true,
                        displayModeBar: false
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="versioning" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Create Version */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create Version
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="version-model-id">Model ID</Label>
                    <Input
                      id="version-model-id"
                      placeholder="Enter model ID"
                      value={versionForm.modelId}
                      onChange={(e) => setVersionForm({ ...versionForm, modelId: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="version-version">Version</Label>
                    <Input
                      id="version-version"
                      placeholder="e.g., 1.2.0"
                      value={versionForm.version}
                      onChange={(e) => setVersionForm({ ...versionForm, version: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="version-name">Name</Label>
                    <Input
                      id="version-name"
                      placeholder="Enter version name"
                      value={versionForm.name}
                      onChange={(e) => setVersionForm({ ...versionForm, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="version-description">Description</Label>
                    <Textarea
                      id="version-description"
                      placeholder="Describe the changes"
                      value={versionForm.description}
                      onChange={(e) => setVersionForm({ ...versionForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <Button 
                    onClick={handleCreateVersion} 
                    disabled={processing || !versionForm.modelId || !versionForm.version}
                    className="w-full"
                  >
                    {processing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <GitBranch className="h-4 w-4 mr-2" />
                        Create Version
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Model Versioning */}
              <div className="lg:col-span-2">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5" />
                      Model Versioning
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data?.versioning?.map((versioning) => (
                        <div key={versioning.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="font-medium">Model {versioning.modelId}</h3>
                                <Badge variant="default">
                                  Active: {versioning.activeVersion}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {versioning.totalVersions} versions
                                </Badge>
                              </div>
                              <div className="mt-3 space-y-2">
                                {versioning.versions.slice(0, 3).map((version: any) => (
                                  <div key={version.id} className="flex items-center justify-between p-2 bg-white rounded">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">v{version.version}</span>
                                      <span className="text-sm text-gray-600">{version.name}</span>
                                      <Badge variant={version.status === 'production' ? 'default' : 'secondary'} className="text-xs">
                                        {version.status}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      <span>Accuracy: {(version.performance.accuracy * 100).toFixed(1)}%</span>
                                      <span>•</span>
                                      <span>{new Date(version.createdAt).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRollbackModel(versioning.modelId, versioning.versions[1]?.id)}
                                disabled={processing}
                              >
                                <RotateCcw className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Settings className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Rollback Config: {versioning.rollbackConfig.strategy}
                            </span>
                            <span className="text-xs text-gray-500">
                              Last updated: {new Date(versioning.lastUpdated).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="governance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Governance Policies */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Governance Policies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data?.governance?.map((framework) => (
                      <div key={framework.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium">{framework.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{framework.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span>{framework.policies.length} policies</span>
                              <span>•</span>
                              <span>{framework.compliance.length} compliance frameworks</span>
                              <span>•</span>
                              <span>{framework.riskAssessments.length} risk assessments</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {framework.policies.filter((p: any) => p.isActive).length} active
                          </Badge>
                        </div>
                        
                        <div className="mt-3 space-y-2">
                          {framework.policies.slice(0, 3).map((policy: any) => (
                            <div key={policy.id} className="flex items-center justify-between p-2 bg-white rounded">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{policy.name}</span>
                                <Badge variant={policy.isActive ? 'default' : 'secondary'} className="text-xs">
                                  {policy.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{policy.type}</span>
                                <span>•</span>
                                <span>{policy.rules} rules</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Status */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Compliance Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Chart
                      data={[{
                        x: ['GDPR', 'CCPA', 'HIPAA', 'SOX', 'ISO27001'],
                        y: [95, 98, 92, 96, 94],
                        type: 'bar',
                        marker: { color: '#10B981' }
                      }]}
                      layout={{
                        autosize: true,
                        margin: { l: 40, r: 40, t: 40, b: 40 },
                        yaxis: { title: { text: 'Compliance %' } },
                        showlegend: false
                      }}
                      config={{
                        responsive: true,
                        displayModeBar: false
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="explainability" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Model Explainability */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Model Explainability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">Credit Risk Assessment</h3>
                        <Badge variant="default">Score: 0.92</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Credit Score</span>
                          <span className="text-sm font-medium">35%</span>
                        </div>
                        <Progress value={35} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Income</span>
                          <span className="text-sm font-medium">28%</span>
                        </div>
                        <Progress value={28} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Debt Ratio</span>
                          <span className="text-sm font-medium">22%</span>
                        </div>
                        <Progress value={22} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Employment Length</span>
                          <span className="text-sm font-medium">15%</span>
                        </div>
                        <Progress value={15} className="h-2" />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-gray-500">Interpretability: High</span>
                        <span className="text-gray-500">Methods: SHAP, LIME</span>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">Customer Churn Prediction</h3>
                        <Badge variant="default">Score: 0.85</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Usage Frequency</span>
                          <span className="text-sm font-medium">42%</span>
                        </div>
                        <Progress value={42} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Support Tickets</span>
                          <span className="text-sm font-medium">31%</span>
                        </div>
                        <Progress value={31} className="h-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Payment History</span>
                          <span className="text-sm font-medium">27%</span>
                        </div>
                        <Progress value={27} className="h-2" />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-gray-500">Interpretability: Medium</span>
                        <span className="text-gray-500">Methods: Feature Attribution</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fairness Metrics */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Fairness Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Chart
                      data={[{
                        x: ['Demographic Parity', 'Equalized Odds', 'Calibration'],
                        y: [0.88, 0.91, 0.94],
                        type: 'bar',
                        marker: { color: '#8B5CF6' }
                      }]}
                      layout={{
                        autosize: true,
                        margin: { l: 40, r: 40, t: 40, b: 40 },
                        yaxis: { title: { text: 'Fairness Score' } },
                        showlegend: false
                      }}
                      config={{
                        responsive: true,
                        displayModeBar: false
                      }}
                    />
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
