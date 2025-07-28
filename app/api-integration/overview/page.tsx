
export const dynamic = "force-dynamic";

import { Suspense } from 'react';
import { 
  Package, 
  Webhook, 
  Code, 
  Store, 
  Users, 
  Settings,
  BarChart3,
  Globe,
  Zap,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface APIOverviewStats {
  totalIntegrations: number;
  activeIntegrations: number;
  webhookEndpoints: number;
  apiCalls: number;
  developers: number;
  marketplaceApps: number;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-32 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function getAPIOverviewStats(): Promise<APIOverviewStats> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    totalIntegrations: 28,
    activeIntegrations: 24,
    webhookEndpoints: 15,
    apiCalls: 1250000,
    developers: 156,
    marketplaceApps: 89
  };
}

async function APIOverviewContent() {
  const stats = await getAPIOverviewStats();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API & Integration Powerhouse</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive API ecosystem with webhooks, integrations, marketplace, and developer tools
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Zap className="h-4 w-4 mr-2" />
            Quick Setup
          </Button>
        </div>
      </div>

      {/* Feature Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* API Management */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-blue-600" />
              <span>API Management</span>
            </CardTitle>
            <CardDescription>
              RESTful & GraphQL APIs with comprehensive documentation and SDK generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Calls (30d)</span>
                <span className="font-semibold">{stats.apiCalls.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Developers</span>
                <span className="font-semibold">{stats.developers}</span>
              </div>
              <div className="flex space-x-2 pt-2">
                <Button size="sm" className="flex-1">Explore APIs</Button>
                <Button size="sm" variant="outline" className="flex-1">View Docs</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Webhook Management */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Webhook className="h-5 w-5 text-green-600" />
              <span>Webhook System</span>
            </CardTitle>
            <CardDescription>
              Real-time event streaming with intelligent retry logic and monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Endpoints</span>
                <span className="font-semibold">{stats.webhookEndpoints}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-semibold text-green-600">99.2%</span>
              </div>
              <div className="flex space-x-2 pt-2">
                <Button size="sm" className="flex-1">Manage Webhooks</Button>
                <Button size="sm" variant="outline" className="flex-1">View Logs</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Marketplace */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5 text-purple-600" />
              <span>Marketplace</span>
            </CardTitle>
            <CardDescription>
              Community-driven integration marketplace with revenue sharing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Available Apps</span>
                <span className="font-semibold">{stats.marketplaceApps}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Categories</span>
                <span className="font-semibold">7</span>
              </div>
              <div className="flex space-x-2 pt-2">
                <Button size="sm" className="flex-1">Browse Apps</Button>
                <Button size="sm" variant="outline" className="flex-1">Submit App</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Integrations</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalIntegrations}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                {stats.activeIntegrations} Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Calls</p>
                <p className="text-3xl font-bold text-gray-900">
                  {(stats.apiCalls / 1000000).toFixed(1)}M
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Developers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.developers}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Registered developers</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-3xl font-bold text-green-600">99.9%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Integration Management */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Integration Management</span>
            </CardTitle>
            <CardDescription>
              Manage all your platform integrations in one unified dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">E-commerce Platforms</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Marketing Tools</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Payment Gateways</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Social Media & Analytics</span>
              </div>
              <Button className="w-full mt-4">View All Integrations</Button>
            </div>
          </CardContent>
        </Card>

        {/* Developer Portal */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Code className="h-5 w-5" />
              <span>Developer Portal</span>
            </CardTitle>
            <CardDescription>
              Tools and resources for developers to build and publish integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm">API Keys & Authentication</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm">SDK Generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm">App Publishing</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Revenue Analytics</span>
              </div>
              <Button className="w-full mt-4">Access Portal</Button>
            </div>
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>API Documentation</span>
            </CardTitle>
            <CardDescription>
              Interactive API docs with live testing and code examples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Interactive Testing</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Code Examples</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Schema Definitions</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-purple-500" />
                <span className="text-sm">SDK Downloads</span>
              </div>
              <Button className="w-full mt-4">Explore API</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates across your API ecosystem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">New Shopify integration activated</p>
                <p className="text-sm text-gray-600">Successfully connected to store "example-store.myshopify.com"</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            
            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Webhook className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Webhook endpoint created</p>
                <p className="text-sm text-gray-600">New webhook for order updates configured</p>
              </div>
              <span className="text-sm text-gray-500">4 hours ago</span>
            </div>
            
            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Store className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">New app published to marketplace</p>
                <p className="text-sm text-gray-600">"Analytics Pro" by DevCorp is now available</p>
              </div>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
            
            <div className="flex items-center space-x-4 p-3 border rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">API rate limit approaching</p>
                <p className="text-sm text-gray-600">Mailchimp integration at 85% of monthly quota</p>
              </div>
              <span className="text-sm text-gray-500">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function APIIntegrationOverviewPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <APIOverviewContent />
    </Suspense>
  );
}
