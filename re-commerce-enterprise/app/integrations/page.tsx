
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Webhook, 
  Key, 
  Settings, 
  CheckCircle2, 
  AlertTriangle,
  Plus,
  Trash2,
  Copy,
  Globe,
  Database,
  Mail,
  MessageSquare,
  CreditCard,
  FileText,
  Cloud,
  Zap,
  Link as LinkIcon,
  Activity,
  Shield
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function IntegrationsPage() {
  const [webhooks, setWebhooks] = useState([
    { id: 1, name: 'User Registration', url: 'https://api.example.com/webhooks/user', events: ['user.created'], active: true },
    { id: 2, name: 'Order Processing', url: 'https://api.example.com/webhooks/order', events: ['order.created', 'order.updated'], active: true },
    { id: 3, name: 'Payment Notifications', url: 'https://api.example.com/webhooks/payment', events: ['payment.completed'], active: false },
  ]);

  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Production API', key: 'ep_prod_*********************', permissions: ['read', 'write'], lastUsed: '2 minutes ago' },
    { id: 2, name: 'Analytics Service', key: 'ep_analytics_***************', permissions: ['read'], lastUsed: '15 minutes ago' },
    { id: 3, name: 'Mobile App', key: 'ep_mobile_******************', permissions: ['read', 'write'], lastUsed: '1 hour ago' },
  ]);

  const integrations = [
    { 
      name: 'Slack', 
      description: 'Team communication and notifications',
      icon: <MessageSquare className="h-8 w-8 text-purple-500" />,
      status: 'connected',
      category: 'communication'
    },
    { 
      name: 'Stripe', 
      description: 'Payment processing and billing',
      icon: <CreditCard className="h-8 w-8 text-blue-500" />,
      status: 'connected',
      category: 'payment'
    },
    { 
      name: 'SendGrid', 
      description: 'Email delivery and marketing',
      icon: <Mail className="h-8 w-8 text-green-500" />,
      status: 'connected',
      category: 'email'
    },
    { 
      name: 'Google Analytics', 
      description: 'Web analytics and tracking',
      icon: <Activity className="h-8 w-8 text-orange-500" />,
      status: 'connected',
      category: 'analytics'
    },
    { 
      name: 'AWS S3', 
      description: 'Cloud storage and file management',
      icon: <Cloud className="h-8 w-8 text-yellow-500" />,
      status: 'connected',
      category: 'storage'
    },
    { 
      name: 'Salesforce', 
      description: 'CRM and customer management',
      icon: <Database className="h-8 w-8 text-indigo-500" />,
      status: 'pending',
      category: 'crm'
    },
    { 
      name: 'Zapier', 
      description: 'Workflow automation',
      icon: <Zap className="h-8 w-8 text-red-500" />,
      status: 'available',
      category: 'automation'
    },
    { 
      name: 'DocuSign', 
      description: 'Digital signature management',
      icon: <FileText className="h-8 w-8 text-purple-500" />,
      status: 'available',
      category: 'documents'
    },
  ];

  const generateApiKey = () => {
    const newKey = {
      id: apiKeys.length + 1,
      name: 'New API Key',
      key: 'ep_new_' + Math.random().toString(36).substr(2, 20),
      permissions: ['read'],
      lastUsed: 'Never'
    };
    setApiKeys([...apiKeys, newKey]);
  };

  const deleteApiKey = (id: number) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <LinkIcon className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Enterprise Integrations</h1>
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                DAG 3 Integrations
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
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
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { title: "Active Integrations", value: "5", icon: <CheckCircle2 className="h-6 w-6 text-green-500" />, color: "bg-green-50 border-green-200" },
            { title: "API Keys", value: "3", icon: <Key className="h-6 w-6 text-blue-500" />, color: "bg-blue-50 border-blue-200" },
            { title: "Webhooks", value: "3", icon: <Webhook className="h-6 w-6 text-purple-500" />, color: "bg-purple-50 border-purple-200" },
            { title: "Monthly Requests", value: "124K", icon: <Activity className="h-6 w-6 text-orange-500" />, color: "bg-orange-50 border-orange-200" }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`${metric.color} transition-all duration-300 hover:shadow-lg`}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                    </div>
                    {metric.icon}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="integrations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.map((integration, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className="transition-all duration-300 hover:shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {integration.icon}
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <p className="text-sm text-gray-600">{integration.description}</p>
                          </div>
                        </div>
                        <Badge className={`${
                          integration.status === 'connected' ? 'bg-green-100 text-green-700' :
                          integration.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {integration.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 capitalize">{integration.category}</span>
                        <Button size="sm" variant={integration.status === 'connected' ? 'outline' : 'default'}>
                          {integration.status === 'connected' ? 'Configure' : 
                           integration.status === 'pending' ? 'Complete Setup' : 'Connect'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="api-keys">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2 text-blue-500" />
                    API Keys Management
                  </CardTitle>
                  <Button onClick={generateApiKey} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate New Key
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div key={key.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{key.name}</h3>
                          <p className="text-sm text-gray-600">Last used: {key.lastUsed}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {key.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm">{key.key}</code>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(key.key)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteApiKey(key.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Webhook className="h-5 w-5 mr-2 text-purple-500" />
                    Webhook Management
                  </CardTitle>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Webhook
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {webhooks.map((webhook) => (
                    <div key={webhook.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{webhook.name}</h3>
                          <p className="text-sm text-gray-600">{webhook.url}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch checked={webhook.active} />
                          <Badge className={webhook.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {webhook.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Events:</span>
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-gray-500" />
                    API Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rate-limit">Rate Limit (requests/minute)</Label>
                    <Input id="rate-limit" type="number" defaultValue="1000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                    <Input id="timeout" type="number" defaultValue="30" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="cors" />
                    <Label htmlFor="cors">Enable CORS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="logging" defaultChecked />
                    <Label htmlFor="logging">Enable API Logging</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-500" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="ip-whitelist" />
                    <Label htmlFor="ip-whitelist">IP Whitelist</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="webhook-verification" defaultChecked />
                    <Label htmlFor="webhook-verification">Webhook Signature Verification</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="api-key-rotation" />
                    <Label htmlFor="api-key-rotation">Automatic API Key Rotation</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-requests">Max Requests Per Key</Label>
                    <Input id="max-requests" type="number" defaultValue="100000" />
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-500" />
                    Integration Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">API Uptime</span>
                        <Badge className="bg-green-100 text-green-700">99.9%</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Last 30 days</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Webhook Success</span>
                        <Badge className="bg-blue-100 text-blue-700">98.5%</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Delivery rate</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Avg Response Time</span>
                        <Badge className="bg-purple-100 text-purple-700">120ms</Badge>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">API endpoints</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
