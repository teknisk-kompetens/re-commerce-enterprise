
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Database, 
  Users, 
  Cloud, 
  Zap, 
  BarChart3, 
  MessageCircle, 
  DollarSign, 
  Building, 
  Workflow, 
  Store,
  Activity,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Globe,
  Shield,
  Settings,
  Search,
  Filter,
  Plus,
  Play,
  Pause,
  RefreshCw,
  Download,
  Upload,
  Link,
  ChevronRight
} from 'lucide-react';

interface IntegrationStats {
  total: number;
  active: number;
  inactive: number;
  errors: number;
  successRate: number;
}

interface IntegrationMetrics {
  erp: IntegrationStats;
  crm: IntegrationStats;
  cloud: IntegrationStats;
  etl: IntegrationStats;
  workflow: IntegrationStats;
  communication: IntegrationStats;
  bi: IntegrationStats;
  hr: IntegrationStats;
  financial: IntegrationStats;
  marketplace: IntegrationStats;
}

interface RecentActivity {
  id: string;
  type: string;
  action: string;
  status: 'success' | 'error' | 'pending';
  timestamp: string;
  details: string;
}

export default function EnterpriseIntegrationHubPage() {
  const [metrics, setMetrics] = useState<IntegrationMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch metrics from all integration endpoints
      const [
        erpRes, crmRes, cloudRes, etlRes, workflowRes,
        commRes, biRes, hrRes, financialRes, marketplaceRes
      ] = await Promise.all([
        fetch('/api/enterprise-integration/erp?action=analytics'),
        fetch('/api/enterprise-integration/crm?action=analytics'),
        fetch('/api/enterprise-integration/cloud?action=analytics'),
        fetch('/api/enterprise-integration/etl?action=analytics'),
        fetch('/api/enterprise-integration/workflow?action=analytics'),
        fetch('/api/enterprise-integration/communication?action=analytics'),
        fetch('/api/enterprise-integration/bi?action=analytics'),
        fetch('/api/enterprise-integration/hr?action=analytics'),
        fetch('/api/enterprise-integration/financial?action=analytics'),
        fetch('/api/enterprise-integration/marketplace?action=analytics')
      ]);

      const [
        erpData, crmData, cloudData, etlData, workflowData,
        commData, biData, hrData, financialData, marketplaceData
      ] = await Promise.all([
        erpRes.json(), crmRes.json(), cloudRes.json(), etlRes.json(), workflowRes.json(),
        commRes.json(), biRes.json(), hrRes.json(), financialRes.json(), marketplaceRes.json()
      ]);

      // Transform data into unified metrics
      const metricsData: IntegrationMetrics = {
        erp: {
          total: erpData?.totalIntegrations || 0,
          active: erpData?.activeIntegrations || 0,
          inactive: (erpData?.totalIntegrations || 0) - (erpData?.activeIntegrations || 0),
          errors: erpData?.failedSyncs || 0,
          successRate: erpData?.totalSyncs ? (erpData.successfulSyncs / erpData.totalSyncs) * 100 : 0
        },
        crm: {
          total: crmData?.totalIntegrations || 0,
          active: crmData?.activeIntegrations || 0,
          inactive: (crmData?.totalIntegrations || 0) - (crmData?.activeIntegrations || 0),
          errors: crmData?.failedSyncs || 0,
          successRate: crmData?.totalSyncs ? (crmData.successfulSyncs / crmData.totalSyncs) * 100 : 0
        },
        cloud: {
          total: cloudData?.totalIntegrations || 0,
          active: cloudData?.activeIntegrations || 0,
          inactive: (cloudData?.totalIntegrations || 0) - (cloudData?.activeIntegrations || 0),
          errors: cloudData?.failedDeployments || 0,
          successRate: cloudData?.totalDeployments ? (cloudData.successfulDeployments / cloudData.totalDeployments) * 100 : 0
        },
        etl: {
          total: etlData?.totalPipelines || 0,
          active: etlData?.activePipelines || 0,
          inactive: (etlData?.totalPipelines || 0) - (etlData?.activePipelines || 0),
          errors: etlData?.failedRuns || 0,
          successRate: etlData?.totalRuns ? (etlData.successfulRuns / etlData.totalRuns) * 100 : 0
        },
        workflow: {
          total: workflowData?.totalWorkflows || 0,
          active: workflowData?.activeWorkflows || 0,
          inactive: (workflowData?.totalWorkflows || 0) - (workflowData?.activeWorkflows || 0),
          errors: workflowData?.failedExecutions || 0,
          successRate: workflowData?.totalExecutions ? (workflowData.successfulExecutions / workflowData.totalExecutions) * 100 : 0
        },
        communication: {
          total: commData?.totalIntegrations || 0,
          active: commData?.activeIntegrations || 0,
          inactive: (commData?.totalIntegrations || 0) - (commData?.activeIntegrations || 0),
          errors: 0,
          successRate: 95
        },
        bi: {
          total: biData?.totalIntegrations || 0,
          active: biData?.activeIntegrations || 0,
          inactive: (biData?.totalIntegrations || 0) - (biData?.activeIntegrations || 0),
          errors: 0,
          successRate: 98
        },
        hr: {
          total: hrData?.totalIntegrations || 0,
          active: hrData?.activeIntegrations || 0,
          inactive: (hrData?.totalIntegrations || 0) - (hrData?.activeIntegrations || 0),
          errors: hrData?.failedSyncs || 0,
          successRate: hrData?.totalSyncs ? (hrData.successfulSyncs / hrData.totalSyncs) * 100 : 0
        },
        financial: {
          total: financialData?.totalIntegrations || 0,
          active: financialData?.activeIntegrations || 0,
          inactive: (financialData?.totalIntegrations || 0) - (financialData?.activeIntegrations || 0),
          errors: financialData?.failedSyncs || 0,
          successRate: financialData?.totalSyncs ? (financialData.successfulSyncs / financialData.totalSyncs) * 100 : 0
        },
        marketplace: {
          total: marketplaceData?.totalApps || 0,
          active: marketplaceData?.publishedApps || 0,
          inactive: marketplaceData?.pendingApps || 0,
          errors: 0,
          successRate: 100
        }
      };

      setMetrics(metricsData);

      // Generate recent activity
      const activities: RecentActivity[] = [
        {
          id: '1',
          type: 'ERP',
          action: 'SAP Integration Sync Completed',
          status: 'success',
          timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
          details: '1,247 records processed successfully'
        },
        {
          id: '2',
          type: 'CRM',
          action: 'Salesforce Customer Data Import',
          status: 'success',
          timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
          details: '523 new customers added'
        },
        {
          id: '3',
          type: 'Cloud',
          action: 'AWS Auto-scaling Event',
          status: 'success',
          timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
          details: 'Scaled up 3 EC2 instances'
        },
        {
          id: '4',
          type: 'ETL',
          action: 'Data Pipeline Execution',
          status: 'success',
          timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
          details: 'Processed 50,000 records in 4.2 minutes'
        },
        {
          id: '5',
          type: 'Workflow',
          action: 'Approval Process Completed',
          status: 'success',
          timestamp: new Date(Date.now() - 32 * 60000).toISOString(),
          details: 'Purchase order #PO-2024-001 approved'
        },
        {
          id: '6',
          type: 'BI',
          action: 'Dashboard Refresh Failed',
          status: 'error',
          timestamp: new Date(Date.now() - 38 * 60000).toISOString(),
          details: 'Connection timeout to Tableau server'
        }
      ];

      setRecentActivity(activities);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const integrationTypes = [
    { 
      key: 'erp', 
      title: 'ERP Systems', 
      icon: Database, 
      color: 'bg-blue-500', 
      description: 'SAP, Oracle, Microsoft Dynamics',
      route: '/enterprise-integration-hub/erp'
    },
    { 
      key: 'crm', 
      title: 'CRM Platforms', 
      icon: Users, 
      color: 'bg-green-500', 
      description: 'Salesforce, HubSpot, Microsoft CRM',
      route: '/enterprise-integration-hub/crm'
    },
    { 
      key: 'cloud', 
      title: 'Cloud Infrastructure', 
      icon: Cloud, 
      color: 'bg-purple-500', 
      description: 'AWS, Azure, Google Cloud',
      route: '/enterprise-integration-hub/cloud'
    },
    { 
      key: 'etl', 
      title: 'Data Pipelines', 
      icon: Zap, 
      color: 'bg-yellow-500', 
      description: 'ETL/ELT Processing & Automation',
      route: '/enterprise-integration-hub/etl'
    },
    { 
      key: 'workflow', 
      title: 'Workflow Automation', 
      icon: Workflow, 
      color: 'bg-pink-500', 
      description: 'Business Process Orchestration',
      route: '/enterprise-integration-hub/workflow'
    },
    { 
      key: 'communication', 
      title: 'Communication', 
      icon: MessageCircle, 
      color: 'bg-indigo-500', 
      description: 'Slack, Teams, Email Integration',
      route: '/enterprise-integration-hub/communication'
    },
    { 
      key: 'bi', 
      title: 'Business Intelligence', 
      icon: BarChart3, 
      color: 'bg-orange-500', 
      description: 'Tableau, Power BI, Looker',
      route: '/enterprise-integration-hub/bi'
    },
    { 
      key: 'hr', 
      title: 'HR Systems', 
      icon: Building, 
      color: 'bg-teal-500', 
      description: 'Workday, BambooHR, ADP',
      route: '/enterprise-integration-hub/hr'
    },
    { 
      key: 'financial', 
      title: 'Financial Systems', 
      icon: DollarSign, 
      color: 'bg-red-500', 
      description: 'QuickBooks, NetSuite, Xero',
      route: '/enterprise-integration-hub/financial'
    },
    { 
      key: 'marketplace', 
      title: 'App Marketplace', 
      icon: Store, 
      color: 'bg-cyan-500', 
      description: 'Enterprise App Store & Extensions',
      route: '/enterprise-integration-hub/marketplace'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'error': return AlertCircle;
      case 'pending': return Clock;
      default: return Activity;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)} hours ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredIntegrations = integrationTypes.filter(integration => {
    const matchesSearch = integration.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || integration.key === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && (metrics?.[integration.key as keyof IntegrationMetrics]?.active ?? 0) > 0) ||
                         (statusFilter === 'inactive' && (metrics?.[integration.key as keyof IntegrationMetrics]?.active ?? 0) === 0);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalIntegrations = metrics ? Object.values(metrics).reduce((sum, m) => sum + m.total, 0) : 0;
  const activeIntegrations = metrics ? Object.values(metrics).reduce((sum, m) => sum + m.active, 0) : 0;
  const overallSuccessRate = metrics ? 
    Object.values(metrics).reduce((sum, m) => sum + m.successRate, 0) / Object.values(metrics).length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Enterprise Integration Hub
              </h1>
              <p className="text-lg text-gray-600">
                Centralized management for all enterprise system integrations
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={fetchDashboardData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Integration
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Integrations</p>
                  <p className="text-3xl font-bold text-gray-900">{totalIntegrations}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Integrations</p>
                  <p className="text-3xl font-bold text-green-600">{activeIntegrations}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-3xl font-bold text-purple-600">{overallSuccessRate.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">System Health</p>
                  <p className="text-3xl font-bold text-orange-600">98.5%</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Integrations */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Integration Systems</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input
                        placeholder="Search integrations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-64"
                      />
                    </div>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="erp">ERP</SelectItem>
                        <SelectItem value="crm">CRM</SelectItem>
                        <SelectItem value="cloud">Cloud</SelectItem>
                        <SelectItem value="etl">ETL</SelectItem>
                        <SelectItem value="workflow">Workflow</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredIntegrations.map((integration, index) => {
                    const Icon = integration.icon;
                    const stats = metrics?.[integration.key as keyof IntegrationMetrics];
                    
                    return (
                      <motion.div
                        key={integration.key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="group"
                      >
                        <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${integration.color}`}>
                                  <Icon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{integration.title}</h3>
                                  <p className="text-sm text-gray-600">{integration.description}</p>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                            </div>
                            
                            {stats && (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Status</span>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant={stats.active > 0 ? "default" : "secondary"}>
                                      {stats.active > 0 ? "Active" : "Inactive"}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Connections</span>
                                  <span className="font-medium">{stats.total}</span>
                                </div>
                                
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Success Rate</span>
                                    <span className="font-medium">{stats.successRate.toFixed(1)}%</span>
                                  </div>
                                  <Progress value={stats.successRate} className="h-2" />
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Activity */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-xl">Recent Activity</CardTitle>
                <CardDescription>Latest integration events and updates</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => {
                    const StatusIcon = getStatusIcon(activity.status);
                    
                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <StatusIcon className={`h-5 w-5 ${getStatusColor(activity.status)}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {activity.type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(activity.timestamp)}
                            </span>
                          </div>
                          <p className="font-medium text-gray-900 mt-1">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.details}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
