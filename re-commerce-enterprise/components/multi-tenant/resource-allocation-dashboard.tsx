
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Database,
  HardDrive,
  Cpu,
  Wifi,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Zap
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Cell, BarChart, Bar } from 'recharts';

interface TenantResource {
  id: string;
  tenantId: string;
  resourceType: string;
  resourceName: string;
  allocatedAmount: number;
  usedAmount: number;
  maxAmount?: number;
  unit: string;
  costPerUnit: number;
  region?: string;
  provider?: string;
  status: string;
  alertThreshold: number;
  resetPeriod: string;
  utilization: number;
  utilizationStatus: string;
  cost: number;
  usageStats: {
    total: number;
    average: number;
    maximum: number;
    minimum: number;
    dataPoints: number;
  };
  recentUsage: Array<{
    timestamp: Date;
    value: number;
    unit: string;
    period: string;
  }>;
}

interface ResourceSummary {
  totalResources: number;
  resourceTypes: string[];
  totalAllocated: number;
  totalUsed: number;
  totalCost: number;
  overallUtilization: number;
}

interface ResourceAllocationDashboardProps {
  tenantId?: string;
  className?: string;
}

export function ResourceAllocationDashboard({ tenantId, className }: ResourceAllocationDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [resources, setResources] = useState<TenantResource[]>([]);
  const [summary, setSummary] = useState<ResourceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<TenantResource | null>(null);
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResource, setNewResource] = useState({
    resourceType: '',
    resourceName: '',
    allocatedAmount: '',
    unit: '',
    costPerUnit: '0',
    region: '',
    provider: '',
    alertThreshold: '0.8'
  });

  const { toast } = useToast();

  useEffect(() => {
    if (tenantId) {
      fetchResources();
    }
  }, [tenantId]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        tenantId: tenantId || '',
        includeUsage: 'true'
      });

      const response = await fetch(`/api/resource-allocation?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch resources');
      }

      const data = await response.json();
      if (data.success) {
        setResources(data.data.resources);
        setSummary(data.data.summary);
      } else {
        throw new Error(data.error || 'Failed to fetch resources');
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

  const createResource = async () => {
    try {
      if (!newResource.resourceType || !newResource.resourceName || !newResource.allocatedAmount) {
        toast({
          title: 'Validation Error',
          description: 'Resource type, name, and allocated amount are required',
          variant: 'destructive'
        });
        return;
      }

      const response = await fetch('/api/resource-allocation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          ...newResource,
          allocatedAmount: parseInt(newResource.allocatedAmount)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create resource');
      }

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Resource allocated successfully'
        });
        
        setShowAddResource(false);
        setNewResource({
          resourceType: '',
          resourceName: '',
          allocatedAmount: '',
          unit: '',
          costPerUnit: '0',
          region: '',
          provider: '',
          alertThreshold: '0.8'
        });
        fetchResources();
      } else {
        throw new Error(data.error || 'Failed to create resource');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const updateResource = async (resourceId: string, updates: any) => {
    try {
      const response = await fetch('/api/resource-allocation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId,
          updates
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update resource');
      }

      toast({
        title: 'Success',
        description: 'Resource updated successfully'
      });
      
      fetchResources();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const deleteResource = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/resource-allocation?resourceId=${resourceId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }

      toast({
        title: 'Success',
        description: 'Resource deallocated successfully'
      });
      
      fetchResources();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const getResourceIcon = (resourceType: string) => {
    const icons = {
      storage: HardDrive,
      database: Database,
      compute: Cpu,
      bandwidth: Wifi,
      users: Users,
      api_calls: Zap
    };
    return icons[resourceType as keyof typeof icons] || Database;
  };

  const getUtilizationColor = (utilization: number, status: string) => {
    if (status === 'critical') return 'text-red-600';
    if (status === 'warning') return 'text-yellow-600';
    if (status === 'moderate') return 'text-blue-600';
    return 'text-green-600';
  };

  const getProgressColor = (utilization: number) => {
    if (utilization >= 90) return 'bg-red-500';
    if (utilization >= 75) return 'bg-yellow-500';
    if (utilization >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Prepare chart data
  const resourceTypeData = resources.reduce((acc, resource) => {
    const existingType = acc.find(item => item.name === resource.resourceType);
    if (existingType) {
      existingType.value += resource.cost;
      existingType.count += 1;
    } else {
      acc.push({
        name: resource.resourceType,
        value: resource.cost,
        count: 1,
        utilization: resource.utilization
      });
    }
    return acc;
  }, [] as any[]);

  const utilizationData = resources.map(resource => ({
    name: resource.resourceName,
    utilization: resource.utilization,
    cost: resource.cost,
    type: resource.resourceType
  }));

  const timeSeriesData = selectedResource?.recentUsage?.map(usage => ({
    timestamp: new Date(usage.timestamp).toLocaleDateString(),
    value: usage.value,
    unit: usage.unit
  })) || [];

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
      {/* Header with Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Resource Allocation</h2>
          <p className="text-gray-600">Monitor and manage resource allocation and utilization</p>
        </div>
        <Button onClick={() => setShowAddResource(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalResources || 0}</div>
            <p className="text-xs text-muted-foreground">
              {summary?.resourceTypes?.length || 0} different types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((summary?.overallUtilization || 0) * 100)}%
            </div>
            <Progress value={(summary?.overallUtilization || 0) * 100} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(summary?.totalCost || 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">85%</div>
            <p className="text-xs text-muted-foreground">
              Cost optimization
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resource Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Resource Distribution
                </CardTitle>
                <CardDescription>Cost allocation across resource types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <RechartsPieChart data={resourceTypeData}>
                        {resourceTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </RechartsPieChart>
                      <Tooltip
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Cost']}
                        labelFormatter={(label) => `${label} Resources`}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Utilization Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Utilization by Resource
                </CardTitle>
                <CardDescription>Current utilization levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={utilizationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval={0}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          name === 'utilization' ? `${value}%` : `$${value.toFixed(2)}`,
                          name === 'utilization' ? 'Utilization' : 'Cost'
                        ]}
                      />
                      <Bar dataKey="utilization" fill="#60B5FF" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common resource management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                  <Plus className="h-6 w-6" />
                  <span>Add Storage</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span>Scale Compute</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="h-6 w-6" />
                  <span>Optimize Costs</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="space-y-4">
            {resources.map((resource) => {
              const IconComponent = getResourceIcon(resource.resourceType);
              return (
                <Card key={resource.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{resource.resourceName}</CardTitle>
                          <CardDescription>
                            {resource.resourceType} • {resource.provider} • {resource.region}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={resource.status === 'active' ? 'default' : 'secondary'}
                        >
                          {resource.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedResource(resource)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteResource(resource.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Utilization</Label>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Used</span>
                            <span className={getUtilizationColor(resource.utilization, resource.utilizationStatus)}>
                              {resource.utilization}%
                            </span>
                          </div>
                          <Progress 
                            value={resource.utilization} 
                            className="h-2"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Allocation</Label>
                        <div className="text-sm">
                          <div>
                            Used: {resource.unit === 'bytes' 
                              ? formatBytes(resource.usedAmount) 
                              : `${resource.usedAmount.toLocaleString()} ${resource.unit}`
                            }
                          </div>
                          <div className="text-gray-500">
                            of {resource.unit === 'bytes' 
                              ? formatBytes(resource.allocatedAmount) 
                              : `${resource.allocatedAmount.toLocaleString()} ${resource.unit}`
                            }
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Cost</Label>
                        <div className="text-sm">
                          <div className="font-medium">${resource.cost.toFixed(2)}</div>
                          <div className="text-gray-500">per month</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Performance</Label>
                        <div className="text-sm">
                          <div>Avg: {resource.usageStats.average.toFixed(0)}</div>
                          <div className="text-gray-500">
                            Max: {resource.usageStats.maximum.toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {resource.utilizationStatus === 'critical' && (
                      <Alert className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Resource utilization is critically high. Consider scaling up or optimizing usage.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Resource Analytics</CardTitle>
              <CardDescription>Detailed usage patterns and trends</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedResource ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">{selectedResource.resourceName}</h4>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedResource(null)}
                    >
                      View All
                    </Button>
                  </div>

                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => [
                            selectedResource.unit === 'bytes' 
                              ? formatBytes(value) 
                              : `${value} ${selectedResource.unit}`,
                            'Usage'
                          ]}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#60B5FF" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <div className="text-2xl font-bold">
                        {selectedResource.usageStats.total.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Total Usage</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-2xl font-bold">
                        {selectedResource.usageStats.average.toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-500">Average</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-2xl font-bold">
                        {selectedResource.usageStats.maximum.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">Peak Usage</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-2xl font-bold">
                        {selectedResource.usageStats.dataPoints}
                      </div>
                      <div className="text-sm text-gray-500">Data Points</div>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a resource to view detailed analytics</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimization Recommendations</CardTitle>
                <CardDescription>AI-powered suggestions to optimize resource usage and costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-green-50">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-green-900">Storage Optimization</div>
                        <div className="text-sm text-green-700 mt-1">
                          Your storage utilization is optimal at 67%. Consider enabling compression to reduce costs by 15%.
                        </div>
                        <Button size="sm" className="mt-2">Apply Recommendation</Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-yellow-50">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-yellow-900">Compute Scaling</div>
                        <div className="text-sm text-yellow-700 mt-1">
                          Your compute resources are underutilized. Consider scaling down to save $150/month.
                        </div>
                        <Button size="sm" variant="outline" className="mt-2">Review Details</Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-blue-900">Bandwidth Prediction</div>
                        <div className="text-sm text-blue-700 mt-1">
                          Based on current trends, you may exceed bandwidth limits in 2 weeks. Consider upgrading your plan.
                        </div>
                        <Button size="sm" variant="outline" className="mt-2">View Forecast</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Optimization</CardTitle>
                <CardDescription>Potential savings and efficiency improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">$247</div>
                    <div className="text-sm text-gray-500">Potential Monthly Savings</div>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">23%</div>
                    <div className="text-sm text-gray-500">Efficiency Improvement</div>
                  </Card>
                  
                  <Card className="p-4 text-center">
                    <TrendingDown className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">31%</div>
                    <div className="text-sm text-gray-500">Cost Reduction</div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Resource Modal */}
      {showAddResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Add New Resource</CardTitle>
              <CardDescription>Allocate a new resource to this tenant</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resourceType">Resource Type</Label>
                <Select
                  value={newResource.resourceType}
                  onValueChange={(value) => setNewResource(prev => ({ ...prev, resourceType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="storage">Storage</SelectItem>
                    <SelectItem value="compute">Compute</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="bandwidth">Bandwidth</SelectItem>
                    <SelectItem value="api_calls">API Calls</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resourceName">Resource Name</Label>
                <Input
                  id="resourceName"
                  value={newResource.resourceName}
                  onChange={(e) => setNewResource(prev => ({ ...prev, resourceName: e.target.value }))}
                  placeholder="e.g., Primary Storage"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="allocatedAmount">Amount</Label>
                  <Input
                    id="allocatedAmount"
                    type="number"
                    value={newResource.allocatedAmount}
                    onChange={(e) => setNewResource(prev => ({ ...prev, allocatedAmount: e.target.value }))}
                    placeholder="1000000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={newResource.unit}
                    onValueChange={(value) => setNewResource(prev => ({ ...prev, unit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bytes">Bytes</SelectItem>
                      <SelectItem value="calls">Calls</SelectItem>
                      <SelectItem value="users">Users</SelectItem>
                      <SelectItem value="requests">Requests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costPerUnit">Cost per Unit</Label>
                  <Input
                    id="costPerUnit"
                    type="number"
                    step="0.0001"
                    value={newResource.costPerUnit}
                    onChange={(e) => setNewResource(prev => ({ ...prev, costPerUnit: e.target.value }))}
                    placeholder="0.0001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alertThreshold">Alert Threshold</Label>
                  <Input
                    id="alertThreshold"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    value={newResource.alertThreshold}
                    onChange={(e) => setNewResource(prev => ({ ...prev, alertThreshold: e.target.value }))}
                    placeholder="0.8"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddResource(false)}
                >
                  Cancel
                </Button>
                <Button onClick={createResource}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Resource
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
