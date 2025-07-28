
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  ArrowRight,
  Play,
  Pause,
  Square,
  RotateCcw,
  Clock,
  Database,
  Server,
  Globe,
  Shield,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Calendar,
  FileText,
  Activity,
  Zap
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TenantMigration {
  id: string;
  tenantId: string;
  tenant: {
    id: string;
    name: string;
    domain: string;
    plan: string;
  };
  migrationType: string;
  sourceConfiguration: any;
  targetConfiguration: any;
  status: string;
  progress: number;
  currentStep?: string;
  totalSteps: number;
  completedSteps: number;
  estimatedDuration?: number;
  actualDuration?: number;
  dataTransferred: number;
  totalDataSize?: number;
  downtime: number;
  rollbackPlan: any;
  validationResults: any;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  cancelledAt?: Date;
  errorMessage?: string;
  logs: any[];
  estimatedCompletion?: Date;
  transferProgress: number;
}

interface MigrationSummary {
  totalMigrations: number;
  activeMigrations: number;
  completedMigrations: number;
  failedMigrations: number;
  averageProgress: number;
  averageDuration: number;
  typeDistribution: Record<string, number>;
}

interface MigrationFormData {
  tenantId: string;
  migrationType: string;
  sourceConfiguration: any;
  targetConfiguration: any;
  scheduledAt?: string;
  estimatedDuration?: number;
}

interface MigrationManagementInterfaceProps {
  className?: string;
}

export function MigrationManagementInterface({ className }: MigrationManagementInterfaceProps) {
  const [activeTab, setActiveTab] = useState('active');
  const [migrations, setMigrations] = useState<TenantMigration[]>([]);
  const [summary, setSummary] = useState<MigrationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMigration, setSelectedMigration] = useState<TenantMigration | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Form state for creating new migration
  const [migrationForm, setMigrationForm] = useState<MigrationFormData>({
    tenantId: '',
    migrationType: 'region',
    sourceConfiguration: {},
    targetConfiguration: {},
    estimatedDuration: 60
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchMigrations();
  }, [activeTab]);

  useEffect(() => {
    // Auto-refresh active migrations every 30 seconds
    const interval = setInterval(() => {
      if (activeTab === 'active') {
        fetchMigrations();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchMigrations = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: '20',
        ...(activeTab === 'active' && { status: 'running' })
      });

      const response = await fetch(`/api/tenant-migration?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch migrations');
      }

      const data = await response.json();
      if (data.success) {
        setMigrations(data.data.migrations);
        setSummary(data.data.summary);
      } else {
        throw new Error(data.error || 'Failed to fetch migrations');
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

  const createMigration = async () => {
    try {
      if (!migrationForm.tenantId || !migrationForm.migrationType) {
        toast({
          title: 'Validation Error',
          description: 'Tenant and migration type are required',
          variant: 'destructive'
        });
        return;
      }

      const response = await fetch('/api/tenant-migration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(migrationForm)
      });

      if (!response.ok) {
        throw new Error('Failed to create migration');
      }

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Migration created successfully'
        });
        
        setShowCreateForm(false);
        setMigrationForm({
          tenantId: '',
          migrationType: 'region',
          sourceConfiguration: {},
          targetConfiguration: {},
          estimatedDuration: 60
        });
        fetchMigrations();
      } else {
        throw new Error(data.error || 'Failed to create migration');
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

  const handleMigrationAction = async (migrationId: string, action: string) => {
    try {
      const response = await fetch('/api/tenant-migration', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          migrationId,
          action
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} migration`);
      }

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: data.message
        });
        fetchMigrations();
      } else {
        throw new Error(data.error || `Failed to ${action} migration`);
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      planned: { variant: 'secondary' as const, icon: Clock, color: 'text-blue-600' },
      running: { variant: 'default' as const, icon: Activity, color: 'text-green-600' },
      paused: { variant: 'secondary' as const, icon: Pause, color: 'text-yellow-600' },
      completed: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      failed: { variant: 'destructive' as const, icon: AlertTriangle, color: 'text-red-600' },
      cancelled: { variant: 'outline' as const, icon: Square, color: 'text-gray-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planned;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className={`h-3 w-3 ${config.color}`} />
        {status}
      </Badge>
    );
  };

  const getMigrationTypeIcon = (type: string) => {
    const icons = {
      region: Globe,
      plan: Zap,
      infrastructure: Database,
      data: Server,
      full: Shield
    };
    return icons[type as keyof typeof icons] || Database;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

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
          <h2 className="text-2xl font-bold">Migration Management</h2>
          <p className="text-gray-600">Manage tenant migrations and data transfers</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Play className="h-4 w-4 mr-2" />
          New Migration
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Migrations</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalMigrations}</div>
              <p className="text-xs text-muted-foreground">
                All time migrations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{summary.activeMigrations}</div>
              <p className="text-xs text-muted-foreground">
                Currently running
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {summary.totalMigrations > 0 
                  ? Math.round((summary.completedMigrations / summary.totalMigrations) * 100)
                  : 0
                }%
              </div>
              <p className="text-xs text-muted-foreground">
                {summary.completedMigrations} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDuration(Math.round(summary.averageDuration || 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                Average completion time
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active Migrations</TabsTrigger>
          <TabsTrigger value="all">All Migrations</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {migrations.length > 0 ? (
            <div className="space-y-4">
              {migrations.map((migration) => {
                const IconComponent = getMigrationTypeIcon(migration.migrationType);
                return (
                  <Card key={migration.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-blue-50">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{migration.tenant?.name}</CardTitle>
                            <CardDescription>
                              {migration.migrationType} migration • {migration.tenant?.domain}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(migration.status)}
                          <div className="flex items-center gap-1">
                            {migration.status === 'running' && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMigrationAction(migration.id, 'pause')}
                                >
                                  <Pause className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMigrationAction(migration.id, 'cancel')}
                                >
                                  <Square className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {migration.status === 'paused' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMigrationAction(migration.id, 'resume')}
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            {migration.status === 'failed' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMigrationAction(migration.id, 'rollback')}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{migration.progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={migration.progress} className="h-2" />
                          <div className="text-xs text-gray-500">
                            Step {migration.completedSteps} of {migration.totalSteps}
                            {migration.currentStep && ` • ${migration.currentStep}`}
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Data Transferred</Label>
                            <div className="text-sm font-medium">
                              {formatBytes(migration.dataTransferred)}
                              {migration.totalDataSize && (
                                <span className="text-gray-500">
                                  {' '}/ {formatBytes(migration.totalDataSize)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Duration</Label>
                            <div className="text-sm font-medium">
                              {migration.actualDuration 
                                ? formatDuration(migration.actualDuration)
                                : migration.estimatedDuration 
                                  ? `~${formatDuration(migration.estimatedDuration)}`
                                  : 'Unknown'
                              }
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Downtime</Label>
                            <div className="text-sm font-medium">
                              {formatDuration(migration.downtime)}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs text-gray-500">ETA</Label>
                            <div className="text-sm font-medium">
                              {migration.estimatedCompletion 
                                ? new Date(migration.estimatedCompletion).toLocaleString()
                                : 'Unknown'
                              }
                            </div>
                          </div>
                        </div>

                        {/* Transfer Progress */}
                        {migration.totalDataSize && migration.totalDataSize > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Data Transfer</span>
                              <span>{migration.transferProgress.toFixed(1)}%</span>
                            </div>
                            <Progress value={migration.transferProgress} className="h-1" />
                          </div>
                        )}

                        {/* Error Message */}
                        {migration.errorMessage && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{migration.errorMessage}</AlertDescription>
                          </Alert>
                        )}

                        {/* Timestamps */}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {migration.startedAt && (
                            <span>Started: {new Date(migration.startedAt).toLocaleString()}</span>
                          )}
                          {migration.completedAt && (
                            <span>Completed: {new Date(migration.completedAt).toLocaleString()}</span>
                          )}
                          {migration.failedAt && (
                            <span>Failed: {new Date(migration.failedAt).toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {activeTab === 'active' 
                    ? 'No active migrations'
                    : `No ${activeTab} migrations found`
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Migration Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create New Migration</CardTitle>
              <CardDescription>
                Set up a new tenant migration with custom configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantId">Tenant ID</Label>
                  <Input
                    id="tenantId"
                    value={migrationForm.tenantId}
                    onChange={(e) => setMigrationForm(prev => ({ ...prev, tenantId: e.target.value }))}
                    placeholder="Enter tenant ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="migrationType">Migration Type</Label>
                  <Select
                    value={migrationForm.migrationType}
                    onValueChange={(value) => setMigrationForm(prev => ({ ...prev, migrationType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="region">Region Migration</SelectItem>
                      <SelectItem value="plan">Plan Upgrade</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure Change</SelectItem>
                      <SelectItem value="data">Data Migration</SelectItem>
                      <SelectItem value="full">Full Migration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceConfig">Source Configuration</Label>
                <Textarea
                  id="sourceConfig"
                  value={JSON.stringify(migrationForm.sourceConfiguration, null, 2)}
                  onChange={(e) => {
                    try {
                      const config = JSON.parse(e.target.value);
                      setMigrationForm(prev => ({ ...prev, sourceConfiguration: config }));
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  placeholder='{"region": "eu-north-1", "plan": "basic"}'
                  className="h-24 font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetConfig">Target Configuration</Label>
                <Textarea
                  id="targetConfig"
                  value={JSON.stringify(migrationForm.targetConfiguration, null, 2)}
                  onChange={(e) => {
                    try {
                      const config = JSON.parse(e.target.value);
                      setMigrationForm(prev => ({ ...prev, targetConfiguration: config }));
                    } catch {
                      // Invalid JSON, ignore
                    }
                  }}
                  placeholder='{"region": "us-east-1", "plan": "professional"}'
                  className="h-24 font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Schedule Migration (Optional)</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={migrationForm.scheduledAt || ''}
                    onChange={(e) => setMigrationForm(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedDuration">Estimated Duration (minutes)</Label>
                  <Input
                    id="estimatedDuration"
                    type="number"
                    min="15"
                    max="1440"
                    value={migrationForm.estimatedDuration || ''}
                    onChange={(e) => setMigrationForm(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                    placeholder="60"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={createMigration}>
                  <Play className="h-4 w-4 mr-2" />
                  Create Migration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
