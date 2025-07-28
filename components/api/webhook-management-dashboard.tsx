
'use client';

import { useState, useEffect } from 'react';
import { 
  Webhook, 
  Play, 
  Pause, 
  Settings, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  method: string;
  events: string[];
  isActive: boolean;
  successCount: number;
  failureCount: number;
  avgResponseTime: number;
  lastTriggeredAt?: string;
  successRate: number;
  totalDeliveries: number;
  createdAt: string;
}

interface WebhookDelivery {
  id: string;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  attempts: number;
  maxAttempts: number;
  responseCode?: number;
  responseTime?: number;
  errorMessage?: string;
  firstAttempt: string;
  lastAttempt?: string;
  endpoint: {
    name: string;
    url: string;
  };
  event: {
    eventType: string;
    category: string;
    priority: string;
  };
}

interface WebhookEvent {
  id: string;
  eventType: string;
  category: string;
  description: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  isActive: boolean;
}

export function WebhookManagementDashboard({ tenantId }: { tenantId: string }) {
  const [activeTab, setActiveTab] = useState('endpoints');
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchWebhooks();
    fetchDeliveries();
    fetchEvents();
  }, [tenantId]);

  const fetchWebhooks = async () => {
    try {
      const response = await fetch(`/api/webhooks/management?tenantId=${tenantId}&search=${searchQuery}`);
      const data = await response.json();
      setWebhooks(data.webhooks || []);
    } catch (error) {
      console.error('Failed to fetch webhooks:', error);
    }
  };

  const fetchDeliveries = async () => {
    try {
      const response = await fetch(`/api/webhooks/deliveries?status=${statusFilter !== 'all' ? statusFilter : ''}`);
      const data = await response.json();
      setDeliveries(data.deliveries || []);
    } catch (error) {
      console.error('Failed to fetch deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/webhooks/events');
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleToggleWebhook = async (id: string, isActive: boolean) => {
    try {
      await fetch('/api/webhooks/management', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !isActive })
      });
      fetchWebhooks();
    } catch (error) {
      console.error('Failed to toggle webhook:', error);
    }
  };

  const handleRetryDelivery = async (deliveryId: string) => {
    try {
      await fetch('/api/webhooks/deliveries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliveryId })
      });
      fetchDeliveries();
    } catch (error) {
      console.error('Failed to retry delivery:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      retrying: 'bg-blue-100 text-blue-800'
    };
    
    const icons = {
      success: CheckCircle,
      failed: XCircle,
      pending: Clock,
      retrying: RefreshCw
    };

    const Icon = icons[status as keyof typeof icons] || Clock;
    
    return (
      <Badge className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: 'bg-blue-100 text-blue-800',
      normal: 'bg-gray-100 text-gray-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[priority as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Webhook Management</h1>
          <p className="text-gray-600 mt-1">Manage webhook endpoints, monitor deliveries, and configure events</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Webhook
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Webhooks</p>
                <p className="text-3xl font-bold text-gray-900">{webhooks?.length || 0}</p>
              </div>
              <Webhook className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Endpoints</p>
                <p className="text-3xl font-bold text-green-600">
                  {webhooks?.filter(w => w.isActive)?.length || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {webhooks?.length > 0 
                    ? Math.round((webhooks.reduce((sum, w) => sum + w.successRate, 0) / webhooks.length) * 100) / 100
                    : 0}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed Deliveries</p>
                <p className="text-3xl font-bold text-red-600">
                  {deliveries?.filter(d => d.status === 'failed')?.length || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="endpoints">Webhook Endpoints</TabsTrigger>
          <TabsTrigger value="deliveries">Delivery Logs</TabsTrigger>
          <TabsTrigger value="events">Event Types</TabsTrigger>
        </TabsList>

        {/* Webhook Endpoints Tab */}
        <TabsContent value="endpoints" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search webhooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={fetchWebhooks}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-6">
            {webhooks?.map((webhook) => (
              <Card key={webhook.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{webhook.name}</span>
                        {webhook.isActive ? (
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {webhook.method} {webhook.url}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleWebhook(webhook.id, webhook.isActive)}
                      >
                        {webhook.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        {webhook.isActive ? 'Disable' : 'Enable'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <p className="text-lg font-semibold text-green-600">{webhook.successRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Deliveries</p>
                      <p className="text-lg font-semibold">{webhook.totalDeliveries}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                      <p className="text-lg font-semibold">{webhook.avgResponseTime}ms</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Last Triggered</p>
                      <p className="text-lg font-semibold">
                        {webhook.lastTriggeredAt 
                          ? new Date(webhook.lastTriggeredAt).toLocaleDateString()
                          : 'Never'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Subscribed Events</p>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events?.map((event, index) => (
                        <Badge key={index} variant="outline">{event}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Delivery Logs Tab */}
        <TabsContent value="deliveries" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <option value="all">All Statuses</option>
                <option value="success">Success</option>
                <option value="failed">Failed</option>
                <option value="pending">Pending</option>
                <option value="retrying">Retrying</option>
              </Select>
            </div>
            <Button variant="outline" onClick={fetchDeliveries}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid gap-4">
            {deliveries?.map((delivery) => (
              <Card key={delivery.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        {getStatusBadge(delivery.status)}
                        <span className="font-medium">{delivery.endpoint.name}</span>
                        <span className="text-gray-500">{delivery.event.eventType}</span>
                        {getPriorityBadge(delivery.event.priority)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{delivery.endpoint.url}</p>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div>
                        <span className="text-gray-600">Attempts:</span>
                        <span className="ml-1 font-medium">{delivery.attempts}/{delivery.maxAttempts}</span>
                      </div>
                      {delivery.responseTime && (
                        <div>
                          <span className="text-gray-600">Response Time:</span>
                          <span className="ml-1 font-medium">{delivery.responseTime}ms</span>
                        </div>
                      )}
                      {delivery.responseCode && (
                        <div>
                          <span className="text-gray-600">Status Code:</span>
                          <span className="ml-1 font-medium">{delivery.responseCode}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">First Attempt:</span>
                        <span className="ml-1 font-medium">
                          {new Date(delivery.firstAttempt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {delivery.status === 'failed' && delivery.attempts < delivery.maxAttempts && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRetryDelivery(delivery.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Retry
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {delivery.errorMessage && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-800">{delivery.errorMessage}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Event Types Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="grid gap-4">
            {Object.entries(
              events?.reduce((acc, event) => {
                if (!acc[event.category]) acc[event.category] = [];
                acc[event.category].push(event);
                return acc;
              }, {} as Record<string, WebhookEvent[]>) || {}
            ).map(([category, categoryEvents]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="capitalize">{category} Events</CardTitle>
                  <CardDescription>
                    {categoryEvents.length} event type{categoryEvents.length !== 1 ? 's' : ''} available
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {categoryEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium">{event.eventType}</span>
                            {getPriorityBadge(event.priority)}
                            {event.isActive ? (
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
