
'use client';

import { useState, useEffect } from 'react';
import { 
  Code, 
  Key, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Settings, 
  Plus, 
  Copy, 
  RefreshCw,
  Download,
  Star,
  Users,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Globe,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface DeveloperPortal {
  id: string;
  developerId: string;
  companyName?: string;
  website?: string;
  description?: string;
  logo?: string;
  contactEmail: string;
  isVerified: boolean;
  verificationLevel: 'basic' | 'standard' | 'premium' | 'enterprise';
  revenueShare: number;
  apiQuota: number;
  apiUsage: number;
  status: 'active' | 'suspended' | 'banned';
  joinedAt: string;
  lastActiveAt: string;
  metrics: {
    totalDownloads: number;
    totalRevenue: number;
    activeInstalls: number;
    avgRating: number;
    totalApps: number;
    publishedApps: number;
  };
  apps: DeveloperApp[];
  apiKeys: DeveloperAPIKey[];
}

interface DeveloperApp {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  status: 'published' | 'pending' | 'rejected' | 'draft';
  downloads: number;
  rating: number;
  installations: any[];
  reviewRecords: any[];
  revenues: any[];
}

interface DeveloperAPIKey {
  id: string;
  keyId: string;
  name: string;
  description?: string;
  environment: 'sandbox' | 'production';
  scopes: string[];
  quotaLimit: number;
  quotaUsed: number;
  quotaResetAt: string;
  lastUsedAt?: string;
  isActive: boolean;
  createdAt: string;
}

export function DeveloperPortalDashboard({ developerId }: { developerId: string }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [portal, setPortal] = useState<DeveloperPortal | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAPIKeyModal, setShowAPIKeyModal] = useState(false);
  const [newAPIKey, setNewAPIKey] = useState({ name: '', description: '', environment: 'sandbox', scopes: ['read'] });

  useEffect(() => {
    fetchDeveloperPortal();
  }, [developerId]);

  const fetchDeveloperPortal = async () => {
    try {
      const response = await fetch(`/api/developer-portal/management?developerId=${developerId}`);
      const data = await response.json();
      setPortal(data.portal);
    } catch (error) {
      console.error('Failed to fetch developer portal:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAPIKey = async () => {
    try {
      const response = await fetch('/api/developer-portal/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAPIKey, developerId })
      });

      if (response.ok) {
        setShowAPIKeyModal(false);
        setNewAPIKey({ name: '', description: '', environment: 'sandbox', scopes: ['read'] });
        fetchDeveloperPortal();
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getVerificationBadge = (level: string) => {
    const colors = {
      basic: 'bg-gray-100 text-gray-800',
      standard: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      enterprise: 'bg-gold-100 text-gold-800'
    };
    
    return (
      <Badge className={colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!portal) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Developer Portal Not Found</h3>
        <p className="text-gray-600">Please check the developer ID and try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={portal.logo} alt={portal.companyName || 'Developer'} />
            <AvatarFallback>
              <Code className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {portal.companyName || 'Developer Portal'}
            </h1>
            <p className="text-gray-600">{portal.contactEmail}</p>
            <div className="flex items-center space-x-2 mt-2">
              {getVerificationBadge(portal.verificationLevel)}
              {portal.isVerified && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              <Badge className={portal.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {portal.status.charAt(0).toUpperCase() + portal.status.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New App
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">
                  ${portal.metrics.totalRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Revenue share: {(portal.revenueShare * 100)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-3xl font-bold text-blue-600">
                  {portal.metrics.totalDownloads.toLocaleString()}
                </p>
              </div>
              <Download className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Across {portal.metrics.totalApps} apps
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Installs</p>
                <p className="text-3xl font-bold text-purple-600">
                  {portal.metrics.activeInstalls.toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {portal.metrics.avgRating.toFixed(1)}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {portal.metrics.publishedApps} published apps
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Usage Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>API Usage</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Current Period Usage</p>
              <p className="text-2xl font-bold">
                {portal.apiUsage.toLocaleString()} / {portal.apiQuota.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Usage Rate</p>
              <p className="text-2xl font-bold">
                {((portal.apiUsage / portal.apiQuota) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${Math.min((portal.apiUsage / portal.apiQuota) * 100, 100)}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="apps">My Apps</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Apps */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Apps</CardTitle>
                <CardDescription>Your latest app submissions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portal.apps.slice(0, 5).map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{app.name}</span>
                          <Badge variant="outline">v{app.version}</Badge>
                          <Badge className={
                            app.status === 'published' ? 'bg-green-100 text-green-800' :
                            app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{app.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>{app.downloads.toLocaleString()} downloads</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{app.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Your earnings and payout information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-semibold">$1,245.50</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Last Month</span>
                    <span className="font-semibold">$987.25</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Earned</span>
                    <span className="font-semibold">${portal.metrics.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t">
                    <Button className="w-full" variant="outline">
                      <DollarSign className="h-4 w-4 mr-2" />
                      View Payout Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* My Apps Tab */}
        <TabsContent value="apps" className="space-y-6">
          <div className="grid gap-6">
            {portal.apps.map((app) => (
              <Card key={app.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{app.name}</span>
                        <Badge variant="outline">v{app.version}</Badge>
                        <Badge className={
                          app.status === 'published' ? 'bg-green-100 text-green-800' :
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {app.status}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{app.description}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Downloads</p>
                      <p className="text-lg font-semibold">{app.downloads.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Installs</p>
                      <p className="text-lg font-semibold">
                        {app.installations.filter(i => i.status === 'installed').length}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rating</p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-lg font-semibold">{app.rating.toFixed(1)}</span>
                        <span className="text-sm text-gray-500">({app.reviewRecords.length})</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                      <p className="text-lg font-semibold text-green-600">
                        ${app.revenues.reduce((sum, r) => sum + Number(r.developerShare), 0) / 100}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">API Keys</h3>
              <p className="text-gray-600">Manage your API keys for development and production</p>
            </div>
            <Button onClick={() => setShowAPIKeyModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </div>

          <div className="grid gap-4">
            {portal.apiKeys.map((apiKey) => (
              <Card key={apiKey.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <span className="font-medium">{apiKey.name}</span>
                        <Badge className={apiKey.environment === 'production' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>
                          {apiKey.environment}
                        </Badge>
                        <Badge className={apiKey.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {apiKey.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      {apiKey.description && (
                        <p className="text-sm text-gray-600 mt-1">{apiKey.description}</p>
                      )}
                      <div className="flex items-center space-x-6 mt-3 text-sm">
                        <div>
                          <span className="text-gray-600">Usage:</span>
                          <span className="ml-1 font-medium">
                            {apiKey.quotaUsed.toLocaleString()} / {apiKey.quotaLimit.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Scopes:</span>
                          <span className="ml-1 font-medium">{apiKey.scopes.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Last Used:</span>
                          <span className="ml-1 font-medium">
                            {apiKey.lastUsedAt 
                              ? new Date(apiKey.lastUsedAt).toLocaleDateString()
                              : 'Never'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(apiKey.keyId)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Usage Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Quota Usage</span>
                      <span>{((apiKey.quotaUsed / apiKey.quotaLimit) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((apiKey.quotaUsed / apiKey.quotaLimit) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Download Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Download analytics chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Revenue analytics chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create API Key Modal */}
      {showAPIKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Create API Key</h2>
                <Button variant="outline" onClick={() => setShowAPIKeyModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <Input
                    value={newAPIKey.name}
                    onChange={(e) => setNewAPIKey({ ...newAPIKey, name: e.target.value })}
                    placeholder="My API Key"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <Input
                    value={newAPIKey.description}
                    onChange={(e) => setNewAPIKey({ ...newAPIKey, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
                  <Select 
                    value={newAPIKey.environment} 
                    onValueChange={(value) => setNewAPIKey({ ...newAPIKey, environment: value as 'sandbox' | 'production' })}
                  >
                    <option value="sandbox">Sandbox</option>
                    <option value="production">Production</option>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scopes</label>
                  <div className="space-y-2">
                    {['read', 'write', 'admin'].map((scope) => (
                      <label key={scope} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newAPIKey.scopes.includes(scope)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAPIKey({ ...newAPIKey, scopes: [...newAPIKey.scopes, scope] });
                            } else {
                              setNewAPIKey({ ...newAPIKey, scopes: newAPIKey.scopes.filter(s => s !== scope) });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="capitalize">{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button 
                    onClick={createAPIKey}
                    className="flex-1"
                    disabled={!newAPIKey.name}
                  >
                    Create API Key
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAPIKeyModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
