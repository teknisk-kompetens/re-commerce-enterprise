
'use client';

import { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingCart, 
  Mail, 
  CreditCard, 
  Share2, 
  BarChart3,
  Zap,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Plus,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  Globe,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Integration {
  id: string;
  name: string;
  platform: string;
  type: 'ecommerce' | 'marketing' | 'payment' | 'social' | 'analytics';
  status: 'active' | 'inactive' | 'error' | 'syncing' | 'suspended';
  version: string;
  lastSync?: string;
  syncInterval: number;
  features: string[];
  errorCount: number;
  lastError?: string;
  createdAt: string;
  metrics?: {
    successRate?: number;
    totalVolume?: number;
    transactionCount?: number;
    avgOpenRate?: number;
    avgClickRate?: number;
    totalSubscribers?: number;
    followersCount?: number;
    engagementRate?: number;
    eventsCount?: number;
    usersCount?: number;
  };
}

export function IntegrationManagementDashboard({ tenantId }: { tenantId: string }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAllIntegrations();
  }, [tenantId]);

  const fetchAllIntegrations = async () => {
    try {
      const [ecommerce, marketing, payment, social, analytics] = await Promise.all([
        fetch(`/api/integrations/ecommerce?tenantId=${tenantId}`).then(r => r.json()),
        fetch(`/api/integrations/marketing?tenantId=${tenantId}`).then(r => r.json()),
        fetch(`/api/integrations/payment?tenantId=${tenantId}`).then(r => r.json()),
        fetch(`/api/integrations/social?tenantId=${tenantId}`).then(r => r.json()),
        fetch(`/api/integrations/analytics?tenantId=${tenantId}`).then(r => r.json())
      ]);

      const allIntegrations = [
        ...(ecommerce.integrations || []).map((i: any) => ({ ...i, type: 'ecommerce' as const })),
        ...(marketing.integrations || []).map((i: any) => ({ ...i, type: 'marketing' as const })),
        ...(payment.integrations || []).map((i: any) => ({ ...i, type: 'payment' as const })),
        ...(social.integrations || []).map((i: any) => ({ ...i, type: 'social' as const })),
        ...(analytics.integrations || []).map((i: any) => ({ ...i, type: 'analytics' as const }))
      ];

      setIntegrations(allIntegrations);
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleIntegration = async (integration: Integration, newStatus: string) => {
    try {
      const endpoint = `/api/integrations/${integration.type}`;
      await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: integration.id, status: newStatus })
      });
      
      fetchAllIntegrations();
    } catch (error) {
      console.error('Failed to toggle integration:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      ecommerce: ShoppingCart,
      marketing: Mail,
      payment: CreditCard,
      social: Share2,
      analytics: BarChart3
    };
    return icons[type as keyof typeof icons] || Package;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      error: 'bg-red-100 text-red-800',
      syncing: 'bg-blue-100 text-blue-800',
      suspended: 'bg-yellow-100 text-yellow-800'
    };

    const icons = {
      active: CheckCircle,
      inactive: Pause,
      error: AlertTriangle,
      syncing: RefreshCw,
      suspended: Clock
    };

    const Icon = icons[status as keyof typeof icons] || CheckCircle;
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesType = selectedType === 'all' || integration.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || integration.status === selectedStatus;
    const matchesSearch = !searchQuery || 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.platform.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesStatus && matchesSearch;
  });

  const integrationStats = {
    total: integrations.length,
    active: integrations.filter(i => i.status === 'active').length,
    error: integrations.filter(i => i.status === 'error').length,
    syncing: integrations.filter(i => i.status === 'syncing').length,
    byType: integrations.reduce((acc, i) => {
      acc[i.type] = (acc[i.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integration Management</h1>
          <p className="text-gray-600 mt-1">Manage all your platform integrations in one place</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={fetchAllIntegrations}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh All
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900">{integrationStats.total}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600">{integrationStats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Errors</p>
                <p className="text-3xl font-bold text-red-600">{integrationStats.error}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Syncing</p>
                <p className="text-3xl font-bold text-blue-600">{integrationStats.syncing}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {integrationStats.total > 0 
                    ? Math.round((integrationStats.active / integrationStats.total) * 100)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <option value="all">All Types</option>
              <option value="ecommerce">E-commerce</option>
              <option value="marketing">Marketing</option>
              <option value="payment">Payment</option>
              <option value="social">Social</option>
              <option value="analytics">Analytics</option>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="error">Error</option>
              <option value="syncing">Syncing</option>
              <option value="suspended">Suspended</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Integration Grid */}
      <div className="grid gap-6">
        {filteredIntegrations.map((integration) => {
          const TypeIcon = getTypeIcon(integration.type);
          
          return (
            <Card key={integration.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <TypeIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{integration.name}</span>
                        {getStatusBadge(integration.status)}
                      </CardTitle>
                      <CardDescription>
                        {integration.platform} • {integration.type.charAt(0).toUpperCase() + integration.type.slice(1)}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleIntegration(
                        integration, 
                        integration.status === 'active' ? 'inactive' : 'active'
                      )}
                    >
                      {integration.status === 'active' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  {/* E-commerce Metrics */}
                  {integration.type === 'ecommerce' && integration.metrics && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Success Rate</p>
                        <p className="text-lg font-semibold text-green-600">
                          {integration.metrics.successRate?.toFixed(1) || 0}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Products Synced</p>
                        <p className="text-lg font-semibold">{integration.metrics.transactionCount || 0}</p>
                      </div>
                    </>
                  )}
                  
                  {/* Marketing Metrics */}
                  {integration.type === 'marketing' && integration.metrics && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Open Rate</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {integration.metrics.avgOpenRate?.toFixed(1) || 0}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Subscribers</p>
                        <p className="text-lg font-semibold">
                          {integration.metrics.totalSubscribers?.toLocaleString() || 0}
                        </p>
                      </div>
                    </>
                  )}
                  
                  {/* Payment Metrics */}
                  {integration.type === 'payment' && integration.metrics && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Volume</p>
                        <p className="text-lg font-semibold text-green-600">
                          ${integration.metrics.totalVolume?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Transactions</p>
                        <p className="text-lg font-semibold">
                          {integration.metrics.transactionCount?.toLocaleString() || 0}
                        </p>
                      </div>
                    </>
                  )}
                  
                  {/* Social Metrics */}
                  {integration.type === 'social' && integration.metrics && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Followers</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {integration.metrics.followersCount?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Engagement</p>
                        <p className="text-lg font-semibold">
                          {integration.metrics.engagementRate?.toFixed(1) || 0}%
                        </p>
                      </div>
                    </>
                  )}
                  
                  {/* Analytics Metrics */}
                  {integration.type === 'analytics' && integration.metrics && (
                    <>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Events</p>
                        <p className="text-lg font-semibold text-purple-600">
                          {integration.metrics.eventsCount?.toLocaleString() || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Users</p>
                        <p className="text-lg font-semibold">
                          {integration.metrics.usersCount?.toLocaleString() || 0}
                        </p>
                      </div>
                    </>
                  )}
                  
                  {/* Common Metrics */}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Last Sync</p>
                    <p className="text-lg font-semibold">
                      {integration.lastSync 
                        ? new Date(integration.lastSync).toLocaleDateString()
                        : 'Never'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Errors</p>
                    <p className={`text-lg font-semibold ${integration.errorCount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {integration.errorCount}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-600 mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {integration.features?.map((feature, index) => (
                      <Badge key={index} variant="outline">{feature}</Badge>
                    ))}
                  </div>
                </div>

                {/* Error Message */}
                {integration.lastError && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800">
                      <strong>Last Error:</strong> {integration.lastError}
                    </p>
                  </div>
                )}

                {/* Sync Information */}
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Sync Interval: {Math.floor(integration.syncInterval / 60)} minutes
                  </span>
                  <span>
                    Created: {new Date(integration.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredIntegrations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || selectedType !== 'all' || selectedStatus !== 'all'
                ? 'No integrations match your current filters.'
                : 'Get started by adding your first integration.'
              }
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
