
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Plug, 
  Play, 
  Pause, 
  Settings, 
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  RefreshCw,
  Plus,
  Search,
  Filter,
  BarChart3,
  Database,
  Cloud,
  Zap,
  Globe,
  Users,
  ShoppingCart,
  MessageSquare,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';

interface Integration {
  id: number;
  name: string;
  type: string;
  category: string;
  provider: string;
  status: string;
  lastSync: string;
  syncCount: number;
  errorRate: number;
  icon: JSX.Element;
}

export default function IntegrationsHubPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample integration data
  const integrationData = [
    { time: '00:00', successful: 45, failed: 2, pending: 1 },
    { time: '04:00', successful: 38, failed: 1, pending: 0 },
    { time: '08:00', successful: 67, failed: 3, pending: 2 },
    { time: '12:00', successful: 89, failed: 4, pending: 1 },
    { time: '16:00', successful: 78, failed: 2, pending: 3 },
    { time: '20:00', successful: 65, failed: 1, pending: 1 },
  ];

  const integrationTypes = [
    { name: 'API', value: 40, color: '#3B82F6' },
    { name: 'Webhook', value: 25, color: '#10B981' },
    { name: 'Database', value: 20, color: '#F59E0B' },
    { name: 'File Sync', value: 15, color: '#EF4444' },
  ];

  const sampleIntegrations = [
    {
      id: 1,
      name: 'Salesforce CRM',
      type: 'api',
      category: 'crm',
      provider: 'Salesforce',
      status: 'active',
      lastSync: '2 minutes ago',
      syncCount: 1524,
      errorRate: 0.1,
      icon: <Users className="h-6 w-6" />
    },
    {
      id: 2,
      name: 'Stripe Payments',
      type: 'webhook',
      category: 'payment',
      provider: 'Stripe',
      status: 'active',
      lastSync: '5 minutes ago',
      syncCount: 892,
      errorRate: 0.0,
      icon: <CreditCard className="h-6 w-6" />
    },
    {
      id: 3,
      name: 'Google Analytics',
      type: 'api',
      category: 'analytics',
      provider: 'Google',
      status: 'active',
      lastSync: '1 hour ago',
      syncCount: 2341,
      errorRate: 0.2,
      icon: <BarChart3 className="h-6 w-6" />
    },
    {
      id: 4,
      name: 'Slack Notifications',
      type: 'webhook',
      category: 'communication',
      provider: 'Slack',
      status: 'inactive',
      lastSync: '2 days ago',
      syncCount: 456,
      errorRate: 2.1,
      icon: <MessageSquare className="h-6 w-6" />
    },
    {
      id: 5,
      name: 'AWS S3 Storage',
      type: 'file_sync',
      category: 'storage',
      provider: 'Amazon',
      status: 'active',
      lastSync: '30 minutes ago',
      syncCount: 3672,
      errorRate: 0.05,
      icon: <Cloud className="h-6 w-6" />
    },
    {
      id: 6,
      name: 'PostgreSQL Warehouse',
      type: 'database',
      category: 'database',
      provider: 'PostgreSQL',
      status: 'active',
      lastSync: '15 minutes ago',
      syncCount: 5234,
      errorRate: 0.0,
      icon: <Database className="h-6 w-6" />
    }
  ];

  const availableIntegrations = [
    { name: 'HubSpot CRM', category: 'crm', icon: <Users className="h-8 w-8" />, description: 'Sync customer data and sales pipelines' },
    { name: 'Shopify', category: 'ecommerce', icon: <ShoppingCart className="h-8 w-8" />, description: 'E-commerce platform integration' },
    { name: 'Microsoft Teams', category: 'communication', icon: <MessageSquare className="h-8 w-8" />, description: 'Team collaboration and messaging' },
    { name: 'Mailchimp', category: 'marketing', icon: <Globe className="h-8 w-8" />, description: 'Email marketing automation' },
    { name: 'Tableau', category: 'analytics', icon: <BarChart3 className="h-8 w-8" />, description: 'Advanced data visualization' },
    { name: 'Jira', category: 'project', icon: <Settings className="h-8 w-8" />, description: 'Project management and issue tracking' }
  ];

  useEffect(() => {
    setIntegrations(sampleIntegrations);
  }, []);

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Plug className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Integration Hub</h1>
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                DAG 4 ENTERPRISE
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync All
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Config
              </Button>
              <Link href="/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-indigo-900">
                    Enterprise Integration Ecosystem
                  </CardTitle>
                  <p className="text-indigo-700 mt-2">
                    Seamlessly connect and manage all your business applications with advanced API management and monitoring
                  </p>
                </div>
                <Plug className="h-12 w-12 text-indigo-600" />
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Integration Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: <CheckCircle2 className="h-8 w-8 text-green-500" />, title: "Active Integrations", value: 6, change: "+2", color: "bg-green-50 border-green-200" },
            { icon: <Zap className="h-8 w-8 text-blue-500" />, title: "Total Syncs Today", value: 1847, change: "+234", color: "bg-blue-50 border-blue-200" },
            { icon: <Clock className="h-8 w-8 text-yellow-500" />, title: "Avg Response Time", value: "120ms", change: "-15ms", color: "bg-yellow-50 border-yellow-200" },
            { icon: <AlertTriangle className="h-8 w-8 text-red-500" />, title: "Failed Syncs", value: 3, change: "-2", color: "bg-red-50 border-red-200" }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className={`transition-all duration-300 hover:shadow-lg ${metric.color}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    {metric.icon}
                    <Badge variant="outline" className="text-xs text-green-700 bg-green-100">
                      {metric.change}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Integration Content */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="active">Active Integrations</TabsTrigger>
            <TabsTrigger value="marketplace">Integration Marketplace</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="space-y-6">
              {/* Search and Filter */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search integrations..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="all">All Categories</option>
                        <option value="crm">CRM</option>
                        <option value="payment">Payment</option>
                        <option value="analytics">Analytics</option>
                        <option value="communication">Communication</option>
                        <option value="storage">Storage</option>
                        <option value="database">Database</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Integrations List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIntegrations.map((integration, index) => (
                  <motion.div
                    key={integration.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card className="transition-all duration-300 hover:shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {integration.icon}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              <p className="text-sm text-gray-600">{integration.provider}</p>
                            </div>
                          </div>
                          <Badge variant={integration.status === 'active' ? 'default' : 'secondary'} 
                                 className={integration.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {integration.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Last Sync</span>
                            <span className="text-sm font-medium">{integration.lastSync}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Syncs</span>
                            <span className="text-sm font-medium">{integration.syncCount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Error Rate</span>
                            <Badge variant={integration.errorRate < 1 ? 'default' : 'destructive'} className="text-xs">
                              {integration.errorRate}%
                            </Badge>
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Settings className="h-4 w-4 mr-1" />
                              Configure
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              {integration.status === 'active' ? (
                                <Pause className="h-4 w-4 mr-1" />
                              ) : (
                                <Play className="h-4 w-4 mr-1" />
                              )}
                              {integration.status === 'active' ? 'Pause' : 'Resume'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="marketplace">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Available Integrations</CardTitle>
                  <p className="text-gray-600">Discover and connect new services to your enterprise platform</p>
                </CardHeader>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableIntegrations.map((integration, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card className="transition-all duration-300 hover:shadow-lg">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                            {integration.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <Badge variant="outline" className="text-xs mt-1">
                              {integration.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{integration.description}</p>
                        <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Connect
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="monitoring">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                    Integration Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={integrationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <defs>
                        <linearGradient id="colorSuccessful" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="successful" stackId="1" stroke="#10B981" fill="url(#colorSuccessful)" />
                      <Area type="monotone" dataKey="failed" stackId="1" stroke="#EF4444" fill="url(#colorFailed)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plug className="h-5 w-5 mr-2 text-purple-500" />
                    Integration Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={integrationTypes}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {integrationTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {integrationTypes.map((type, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                          <span className="text-sm font-medium">{type.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{type.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="webhooks">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Webhook Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { url: 'https://api.example.com/webhooks/orders', events: ['order.created', 'order.updated'], status: 'active', lastDelivery: '2 min ago' },
                    { url: 'https://api.example.com/webhooks/users', events: ['user.created', 'user.updated'], status: 'active', lastDelivery: '15 min ago' },
                    { url: 'https://api.example.com/webhooks/payments', events: ['payment.completed', 'payment.failed'], status: 'error', lastDelivery: '2 hours ago' },
                    { url: 'https://api.example.com/webhooks/analytics', events: ['event.tracked'], status: 'inactive', lastDelivery: '1 day ago' }
                  ].map((webhook, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{webhook.url}</h3>
                          <div className="flex flex-wrap gap-1">
                            {webhook.events.map((event, eventIndex) => (
                              <Badge key={eventIndex} variant="outline" className="text-xs">
                                {event}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={webhook.status === 'active' ? 'default' : webhook.status === 'error' ? 'destructive' : 'secondary'}>
                            {webhook.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Last delivery: {webhook.lastDelivery}</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-1" />
                            Configure
                          </Button>
                          <Button size="sm" variant="outline">
                            Test
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
                    Integration Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={integrationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="successful" fill="#10B981" />
                      <Bar dataKey="failed" fill="#EF4444" />
                      <Bar dataKey="pending" fill="#F59E0B" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
