
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  DollarSign,
  Zap,
  Shield,
  Globe,
  Brain,
  Gauge,
  Target,
  Award,
  Lightbulb,
  Bell,
  Download,
  Share,
  Filter,
  Calendar,
  BarChart3,
  LineChart,
  PieChart,
  Eye,
  RefreshCw,
  Star,
  Flame,
  ThumbsUp,
  ThumbsDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Info,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Settings,
  Mail,
  Phone,
  MessageCircle,
  FileText,
  Database,
  Server,
  Cloud,
  Network,
  Cpu,

  HardDrive,
  Wifi,
  Lock,
  Key,
  UserCheck,
  ShieldCheck,
  Fingerprint,
  Code,
  Terminal,
  GitBranch,
  Workflow,
  Layers,
  Grid,
  Layout,
  Navigation,
  Smartphone,
  Tablet,
  Monitor,
  Rocket,
  Sparkles,
  Building,
  Briefcase,
  MapPin,
  Home,
  Search,
  Hash,
  Tag,
  Bookmark,
  Heart,
  Flag,
  Copy,
  Edit,
  Trash,
  Save,
  Send,
  Maximize,
  Minimize,
  MoreHorizontal,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  X,
  Check,
  Timer,
  Calendar as CalendarIcon,
  Clock as ClockIcon
} from 'lucide-react';

interface ExecutiveDashboard {
  summary: {
    overallHealth: number;
    businessHealth: number;
    operationalHealth: number;
    strategicGoals: number;
    riskLevel: 'low' | 'medium' | 'high';
    keyWins: string[];
    keyRisks: string[];
    recommendations: string[];
  };
  kpis: KPITrend[];
  metrics: ExecutiveMetrics;
  insights: {
    id: string;
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    urgency: 'urgent' | 'high' | 'medium' | 'low';
    category: string;
    recommendation: string;
    dataSource: string;
  }[];
  alerts: {
    id: string;
    type: 'warning' | 'error' | 'info';
    title: string;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    timestamp: Date;
    acknowledged: boolean;
  }[];
}

interface KPITrend {
  metric: string;
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  target: number;
  status: 'on-track' | 'at-risk' | 'off-track';
}

interface ExecutiveMetrics {
  business: {
    totalRevenue: number;
    revenueGrowth: number;
    activeUsers: number;
    userGrowth: number;
    customerSatisfaction: number;
    churnRate: number;
    nps: number;
    mrr: number;
    arr: number;
    cac: number;
    ltv: number;
    ltvCacRatio: number;
  };
  operations: {
    systemUptime: number;
    avgResponseTime: number;
    errorRate: number;
    deploymentFrequency: number;
    deploymentSuccessRate: number;
    mttr: number;
    changeFailureRate: number;
    leadTime: number;
    throughput: number;
    reliability: number;
  };
  aiAnalytics: {
    modelsDeployed: number;
    predictionAccuracy: number;
    insightsGenerated: number;
    automationSavings: number;
    dataPointsProcessed: number;
    mlPipelineSuccess: number;
    aiAdoption: number;
    costOptimization: number;
  };
  security: {
    securityScore: number;
    vulnerabilities: number;
    threatsMitigated: number;
    complianceScore: number;
    incidentResolution: number;
    securityAudits: number;
    dataBreaches: number;
    securityTraining: number;
  };
  performance: {
    loadCapacity: number;
    scalingEfficiency: number;
    resourceUtilization: number;
    costEfficiency: number;
    cachingEfficiency: number;
    cdnPerformance: number;
    edgeOptimization: number;
    infrastructureCost: number;
  };
  integration: {
    activeIntegrations: number;
    integrationSuccess: number;
    apiUsage: number;
    webhookDelivery: number;
    dataSync: number;
    partnerConnections: number;
    workflowAutomation: number;
    integrationHealth: number;
  };
  global: {
    regions: number;
    languages: number;
    localizationCoverage: number;
    globalLatency: number;
    crossRegionSync: number;
    internationalUsers: number;
    culturalAdaptation: number;
    timeZoneSupport: number;
  };
  team: {
    teamSize: number;
    productivity: number;
    collaboration: number;
    training: number;
    satisfaction: number;
    retention: number;
    skillGrowth: number;
    innovation: number;
  };
}

export function ExecutiveDashboard() {
  const [dashboard, setDashboard] = useState<ExecutiveDashboard | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [timeframe]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/executive-metrics?type=dashboard&timeframe=${timeframe}`);
      const data = await response.json();
      
      setDashboard(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await fetch('/api/executive-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'acknowledge-alert', alertId })
      });
      loadDashboardData();
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    }
  };

  const exportReport = async () => {
    try {
      const response = await fetch('/api/executive-metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'export-report' })
      });
      const data = await response.json();
      
      if (data.success) {
        // In a real app, this would trigger a download
        alert('Executive report generated successfully!');
      }
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 95) return 'text-green-600 bg-green-100';
    if (health >= 85) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'text-green-600 bg-green-100';
      case 'at-risk':
        return 'text-yellow-600 bg-yellow-100';
      case 'off-track':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-lg font-medium">Loading Executive Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Executive Dashboard
                  </h1>
                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                    Unified Analytics & Insights
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  className={`${getHealthColor(dashboard?.summary.overallHealth || 0)} border-0`}
                >
                  <Activity className="w-4 h-4 mr-1" />
                  {dashboard?.summary.overallHealth}% Health
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={loadDashboardData}
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              
              <Button
                onClick={exportReport}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 gap-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-1 rounded-lg">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Business</span>
            </TabsTrigger>
            <TabsTrigger value="operations" className="flex items-center space-x-2">
              <Gauge className="w-4 h-4" />
              <span className="hidden sm:inline">Operations</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="space-y-6">
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Executive Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Overall Health</CardTitle>
                      <Activity className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {dashboard?.summary.overallHealth}%
                      </div>
                      <Progress value={dashboard?.summary.overallHealth} className="mt-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Risk Level: {dashboard?.summary.riskLevel}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Business Health</CardTitle>
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {dashboard?.summary.businessHealth}%
                      </div>
                      <Progress value={dashboard?.summary.businessHealth} className="mt-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Revenue: ${dashboard?.metrics.business.totalRevenue.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Operational Health</CardTitle>
                      <Gauge className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {dashboard?.summary.operationalHealth}%
                      </div>
                      <Progress value={dashboard?.summary.operationalHealth} className="mt-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        Uptime: {dashboard?.metrics.operations.systemUptime}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Strategic Goals</CardTitle>
                      <Target className="w-4 h-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {dashboard?.summary.strategicGoals}%
                      </div>
                      <Progress value={dashboard?.summary.strategicGoals} className="mt-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        On-track goals: {dashboard?.kpis.filter(k => k.status === 'on-track').length}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Key KPIs */}
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span>Key Performance Indicators</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dashboard?.kpis.map((kpi, index) => (
                        <motion.div
                          key={kpi.metric}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-sm">{kpi.metric}</h3>
                            <div className="flex items-center space-x-1">
                              {getTrendIcon(kpi.trend)}
                              <Badge variant="outline" className={`${getStatusColor(kpi.status)} border-0 text-xs`}>
                                {kpi.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-2xl font-bold">{kpi.value}</span>
                            <span className={`text-sm ${kpi.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {kpi.change > 0 ? '+' : ''}{kpi.change} ({kpi.changePercent > 0 ? '+' : ''}{kpi.changePercent.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Target: {kpi.target} | Previous: {kpi.previousValue}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Key Wins and Risks */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="w-5 h-5 text-green-600" />
                        <span>Key Wins</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dashboard?.summary.keyWins.map((win, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{win}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span>Key Risks</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dashboard?.summary.keyRisks.map((risk, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                            <span className="text-sm">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-blue-600" />
                      <span>Strategic Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {dashboard?.summary.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                          </div>
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="business" className="space-y-6">
              <motion.div
                key="business"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        ${dashboard?.metrics.business.totalRevenue.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Growth: {dashboard?.metrics.business.revenueGrowth}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                      <Users className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {dashboard?.metrics.business.activeUsers.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Growth: {dashboard?.metrics.business.userGrowth}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
                      <ThumbsUp className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {dashboard?.metrics.business.nps}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Satisfaction: {dashboard?.metrics.business.customerSatisfaction}/5
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">LTV:CAC Ratio</CardTitle>
                      <Target className="w-4 h-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {dashboard?.metrics.business.ltvCacRatio.toFixed(1)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        LTV: ${dashboard?.metrics.business.ltv} | CAC: ${dashboard?.metrics.business.cac}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="operations" className="space-y-6">
              <motion.div
                key="operations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                      <Activity className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {dashboard?.metrics.operations.systemUptime}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Reliability: {dashboard?.metrics.operations.reliability}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                      <Clock className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {dashboard?.metrics.operations.avgResponseTime}ms
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Error Rate: {dashboard?.metrics.operations.errorRate}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Deployment Success</CardTitle>
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">
                        {dashboard?.metrics.operations.deploymentSuccessRate}%
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Frequency: {dashboard?.metrics.operations.deploymentFrequency}/week
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">MTTR</CardTitle>
                      <Timer className="w-4 h-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {dashboard?.metrics.operations.mttr}min
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Lead Time: {dashboard?.metrics.operations.leadTime}d
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <motion.div
                key="insights"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  {dashboard?.insights.map((insight, index) => (
                    <Card key={insight.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Lightbulb className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{insight.title}</CardTitle>
                              <p className="text-sm text-muted-foreground">{insight.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={`${getImpactColor(insight.impact)} border-0`}>
                              {insight.impact} impact
                            </Badge>
                            <Badge variant="outline" className={`${getUrgencyColor(insight.urgency)} border-0`}>
                              {insight.urgency}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm">{insight.description}</p>
                          
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                              Recommendation:
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              {insight.recommendation}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Data Source: {insight.dataSource}</span>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <motion.div
                key="alerts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  {dashboard?.alerts.map((alert) => (
                    <Card key={alert.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getAlertIcon(alert.type)}
                            <div>
                              <CardTitle className="text-lg">{alert.title}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {new Date(alert.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={`${getSeverityColor(alert.severity)} border-0`}>
                              {alert.severity}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => acknowledgeAlert(alert.id)}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Acknowledge
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{alert.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
