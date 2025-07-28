
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Building2, 
  Users, 
  Database, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Plus,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Minus,
  Globe,
  Shield,
  Zap
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  plan: string;
  tier: string;
  status: string;
  maxUsers: number;
  lastAccessedAt: Date;
  healthStatus: string;
  currentUsage: Record<string, number>;
  monthlyBilling: number;
  _count: {
    users: number;
    tenantUsageRecords: number;
    tenantAnalytics: number;
  };
  tenantBrandings?: Array<{
    logoUrl?: string;
    primaryColor: string;
    brandName?: string;
  }>;
}

interface TenantSummary {
  totalTenants: number;
  activeTenants: number;  
  suspendedTenants: number;
  planDistribution: Record<string, number>;
}

interface TenantManagementDashboardProps {
  className?: string;
}

export function TenantManagementDashboard({ className }: TenantManagementDashboardProps) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [summary, setSummary] = useState<TenantSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [selectedTenants, setSelectedTenants] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    fetchTenants();
  }, [currentPage, statusFilter, planFilter, searchTerm]);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(planFilter !== 'all' && { plan: planFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/tenant-management?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tenants');
      }

      const data = await response.json();
      if (data.success) {
        setTenants(data.data.tenants);
        setSummary(data.data.summary);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        throw new Error(data.error || 'Failed to fetch tenants');
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

  const handleTenantAction = async (tenantId: string, action: string) => {
    try {
      let endpoint = '';
      let method = 'POST';
      let body: any = {};

      switch (action) {
        case 'suspend':
          endpoint = '/api/bulk-tenant-operations';
          body = {
            operation: 'suspend',
            tenantIds: [tenantId]
          };
          break;
        case 'activate':
          endpoint = '/api/bulk-tenant-operations';
          body = {
            operation: 'activate', 
            tenantIds: [tenantId]
          };
          break;
        case 'backup':
          endpoint = '/api/tenant-backup';
          body = {
            tenantId,
            backupType: 'full'
          };
          break;
        default:
          throw new Error('Invalid action');
      }

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} tenant`);
      }

      toast({
        title: 'Success',
        description: `Tenant ${action} completed successfully`
      });

      fetchTenants();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedTenants.length === 0) {
      toast({
        title: 'No Selection',
        description: 'Please select tenants first',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch('/api/bulk-tenant-operations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: action,
          tenantIds: selectedTenants
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to execute bulk ${action}`);
      }

      const data = await response.json();
      toast({
        title: 'Bulk Operation Complete',
        description: `${data.data.successCount} tenants processed successfully, ${data.data.errorCount} failed`
      });

      setSelectedTenants([]);
      fetchTenants();
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
      active: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      suspended: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      migrating: { variant: 'secondary' as const, icon: Activity, color: 'text-blue-600' },
      terminated: { variant: 'outline' as const, icon: Minus, color: 'text-gray-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <IconComponent className={`h-3 w-3 ${config.color}`} />
        {status}
      </Badge>
    );
  };

  const getHealthBadge = (health: string) => {
    const healthConfig = {
      healthy: { color: 'bg-green-500', text: 'Healthy' },
      degraded: { color: 'bg-yellow-500', text: 'Degraded' },
      critical: { color: 'bg-red-500', text: 'Critical' }
    };

    const config = healthConfig[health as keyof typeof healthConfig] || healthConfig.healthy;

    return (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${config.color}`} />
        <span className="text-sm text-gray-600">{config.text}</span>
      </div>
    );
  };

  const calculateUtilization = (usage: Record<string, number>, tenant: Tenant) => {
    const storageUtil = (usage.storage || 0) / Number(tenant.maxUsers * 1000000) * 100; // Simplified calculation
    const userUtil = tenant._count.users / tenant.maxUsers * 100;
    return Math.round((storageUtil + userUtil) / 2);
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
      {/* Header with Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalTenants || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across all plans and regions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary?.activeTenants || 0}</div>
            <p className="text-xs text-muted-foreground">
              {summary ? Math.round((summary.activeTenants / summary.totalTenants) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary?.suspendedTenants || 0}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enterprise Plans</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {summary?.planDistribution?.enterprise || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              High-value customers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 space-y-2 sm:space-y-0 sm:flex sm:gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tenants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="migrating">Migrating</SelectItem>
                </SelectContent>
              </Select>

              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              {selectedTenants.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('suspend')}
                  >
                    Suspend Selected
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkAction('activate')}
                  >
                    Activate Selected
                  </Button>
                </>
              )}
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Tenant
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedTenants.length === tenants.length && tenants.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTenants(tenants.map(t => t.id));
                        } else {
                          setSelectedTenants([]);
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="p-4 font-medium">Tenant</th>
                  <th className="p-4 font-medium">Plan & Status</th>
                  <th className="p-4 font-medium">Usage</th>
                  <th className="p-4 font-medium">Health</th>
                  <th className="p-4 font-medium">Users</th>
                  <th className="p-4 font-medium">Last Active</th>
                  <th className="p-4 font-medium w-12"></th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id} className="border-b hover:bg-gray-50/50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedTenants.includes(tenant.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTenants([...selectedTenants, tenant.id]);
                          } else {
                            setSelectedTenants(selectedTenants.filter(id => id !== tenant.id));
                          }
                        }}
                        className="rounded"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                          {tenant.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{tenant.name}</div>
                          <div className="text-sm text-gray-500">{tenant.domain}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-xs">
                          {tenant.plan} • {tenant.tier}
                        </Badge>
                        {getStatusBadge(tenant.status)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Utilization</span>
                          <span>{calculateUtilization(tenant.currentUsage, tenant)}%</span>
                        </div>
                        <Progress value={calculateUtilization(tenant.currentUsage, tenant)} className="h-2" />
                      </div>
                    </td>
                    <td className="p-4">
                      {getHealthBadge(tenant.healthStatus)}
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="font-medium">{tenant._count.users}</div>
                        <div className="text-gray-500">of {tenant.maxUsers}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-500">
                        {new Date(tenant.lastAccessedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {tenants.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tenants found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
