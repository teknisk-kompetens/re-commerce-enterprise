
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Server, 
  Shield, 
  Database, 
  Languages, 
  Activity, 
  Zap, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Settings,
  Users,
  Cloud,
  Network,
  Lock,
  Monitor,
  GitBranch,
  Timer,
  BarChart3,
  Layers,
  Cpu,
  HardDrive,
  Wifi,
  Eye,
  Bell,
  MapPin,
  Gauge
} from 'lucide-react';
// Global deployment components will be loaded dynamically or accessed through dedicated routes

interface GlobalMetrics {
  deployments: {
    total: number;
    active: number;
    regions: number;
    cdnConfigs: number;
    tenants: number;
  };
  database: {
    clusters: number;
    activeReplications: number;
    syncLag: number;
    throughput: number;
  };
  localization: {
    languages: number;
    translations: number;
    regions: number;
    completeness: number;
  };
  monitoring: {
    configurations: number;
    alerts: number;
    systemHealth: number;
    averageLatency: number;
  };
  edgeComputing: {
    functions: number;
    applications: number;
    gateways: number;
    globalAvailability: number;
  };
  security: {
    threats: number;
    vulnerabilities: number;
    compliance: number;
    incidents: number;
  };
  failover: {
    configurations: number;
    events: number;
    rto: number;
    rpo: number;
  };
}

interface SystemStatus {
  overall: 'healthy' | 'warning' | 'critical';
  components: {
    deployment: 'healthy' | 'warning' | 'critical';
    database: 'healthy' | 'warning' | 'critical';
    localization: 'healthy' | 'warning' | 'critical';
    monitoring: 'healthy' | 'warning' | 'critical';
    edgeComputing: 'healthy' | 'warning' | 'critical';
    security: 'healthy' | 'warning' | 'critical';
    failover: 'healthy' | 'warning' | 'critical';
  };
}

export function GlobalDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<GlobalMetrics | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadGlobalMetrics();
    const interval = setInterval(loadGlobalMetrics, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadGlobalMetrics = async () => {
    try {
      // Simulate loading metrics from all systems
      const mockMetrics: GlobalMetrics = {
        deployments: {
          total: 45,
          active: 42,
          regions: 12,
          cdnConfigs: 8,
          tenants: 156
        },
        database: {
          clusters: 15,
          activeReplications: 14,
          syncLag: 25,
          throughput: 15420
        },
        localization: {
          languages: 25,
          translations: 12500,
          regions: 18,
          completeness: 92
        },
        monitoring: {
          configurations: 8,
          alerts: 12,
          systemHealth: 96,
          averageLatency: 45
        },
        edgeComputing: {
          functions: 156,
          applications: 45,
          gateways: 12,
          globalAvailability: 99.8
        },
        security: {
          threats: 8,
          vulnerabilities: 15,
          compliance: 95,
          incidents: 3
        },
        failover: {
          configurations: 12,
          events: 45,
          rto: 52,
          rpo: 18
        }
      };

      const mockStatus: SystemStatus = {
        overall: 'healthy',
        components: {
          deployment: 'healthy',
          database: 'healthy',
          localization: 'healthy',
          monitoring: 'warning',
          edgeComputing: 'healthy',
          security: 'warning',
          failover: 'healthy'
        }
      };

      setMetrics(mockMetrics);
      setSystemStatus(mockStatus);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Failed to load global metrics:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'critical':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'critical') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'critical':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-lg font-medium">Loading Global Dashboard...</div>
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
              <div className="flex items-center space-x-2">
                <Globe className="w-8 h-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  RE-Commerce Enterprise
                </h1>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Global Deployment & Multi-Region Architecture
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(systemStatus?.overall || 'healthy')} border-0`}
                >
                  {getStatusIcon(systemStatus?.overall || 'healthy')}
                  <span className="ml-1 capitalize">{systemStatus?.overall}</span>
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={loadGlobalMetrics}
                className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-1 rounded-lg">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="deployment" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Deployment</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center space-x-2">
              <Database className="w-4 h-4" />
              <span className="hidden sm:inline">Database</span>
            </TabsTrigger>
            <TabsTrigger value="localization" className="flex items-center space-x-2">
              <Languages className="w-4 h-4" />
              <span className="hidden sm:inline">Localization</span>
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center space-x-2">
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Monitoring</span>
            </TabsTrigger>
            <TabsTrigger value="edge" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Edge</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="failover" className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Failover</span>
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
                {/* System Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Global Deployments</CardTitle>
                      <Globe className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{metrics?.deployments.active}</div>
                      <p className="text-xs text-muted-foreground">
                        {metrics?.deployments.total} total across {metrics?.deployments.regions} regions
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(systemStatus?.components.deployment || 'healthy')} border-0 text-xs`}
                        >
                          {getStatusIcon(systemStatus?.components.deployment || 'healthy')}
                          <span className="ml-1">Active</span>
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Database Clusters</CardTitle>
                      <Database className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{metrics?.database.clusters}</div>
                      <p className="text-xs text-muted-foreground">
                        {metrics?.database.activeReplications} active replications
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(systemStatus?.components.database || 'healthy')} border-0 text-xs`}
                        >
                          {getStatusIcon(systemStatus?.components.database || 'healthy')}
                          <span className="ml-1">Synced</span>
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Edge Functions</CardTitle>
                      <Zap className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">{metrics?.edgeComputing.functions}</div>
                      <p className="text-xs text-muted-foreground">
                        {metrics?.edgeComputing.applications} applications, {metrics?.edgeComputing.gateways} gateways
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(systemStatus?.components.edgeComputing || 'healthy')} border-0 text-xs`}
                        >
                          {getStatusIcon(systemStatus?.components.edgeComputing || 'healthy')}
                          <span className="ml-1">{metrics?.edgeComputing.globalAvailability}%</span>
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Security Status</CardTitle>
                      <Shield className="w-4 h-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{metrics?.security.compliance}%</div>
                      <p className="text-xs text-muted-foreground">
                        {metrics?.security.threats} threats, {metrics?.security.vulnerabilities} vulnerabilities
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge 
                          variant="outline" 
                          className={`${getStatusColor(systemStatus?.components.security || 'warning')} border-0 text-xs`}
                        >
                          {getStatusIcon(systemStatus?.components.security || 'warning')}
                          <span className="ml-1">Monitored</span>
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* System Health Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <span>System Health</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Overall Health</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm">{metrics?.monitoring.systemHealth}%</span>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${metrics?.monitoring.systemHealth}%` }}
                          ></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{metrics?.monitoring.systemHealth}%</div>
                            <div className="text-xs text-muted-foreground">Availability</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{metrics?.monitoring.averageLatency}ms</div>
                            <div className="text-xs text-muted-foreground">Avg Latency</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-purple-600" />
                        <span>Global Presence</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{metrics?.deployments.regions}</div>
                            <div className="text-xs text-muted-foreground">Active Regions</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{metrics?.localization.languages}</div>
                            <div className="text-xs text-muted-foreground">Languages</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{metrics?.deployments.tenants}</div>
                            <div className="text-xs text-muted-foreground">Tenants</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{metrics?.failover.rto}s</div>
                            <div className="text-xs text-muted-foreground">Avg RTO</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="w-5 h-5 text-yellow-600" />
                      <span>Recent Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Database cluster synchronized</div>
                          <div className="text-xs text-muted-foreground">us-east-1 → eu-west-1 • 2 minutes ago</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Edge function deployed</div>
                          <div className="text-xs text-muted-foreground">image-optimizer-v2.1 • 5 minutes ago</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Security alert resolved</div>
                          <div className="text-xs text-muted-foreground">Failed login attempts blocked • 8 minutes ago</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">CDN cache purged</div>
                          <div className="text-xs text-muted-foreground">Global static assets • 12 minutes ago</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="deployment">
              <Card>
                <CardHeader>
                  <CardTitle>Global Deployment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Global deployment management is available through dedicated deployment tools.
                    Visit the <a href="/governance-center" className="text-blue-600 hover:underline">Governance Center</a> for comprehensive enterprise management.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="database">
              <Card>
                <CardHeader>
                  <CardTitle>Global Database</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Database management and monitoring tools are available through the data governance section.
                    Visit the <a href="/governance-center" className="text-blue-600 hover:underline">Governance Center</a> for data governance features.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="localization">
              <Card>
                <CardHeader>
                  <CardTitle>Localization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    International localization and compliance management tools are available.
                    Visit the <a href="/governance-center" className="text-blue-600 hover:underline">Governance Center</a> for regulatory compliance features.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitoring">
              <Card>
                <CardHeader>
                  <CardTitle>Global Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Comprehensive monitoring and observability tools are available.
                    Visit the <a href="/governance-center" className="text-blue-600 hover:underline">Governance Center</a> for enterprise monitoring features.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edge">
              <Card>
                <CardHeader>
                  <CardTitle>Edge Computing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Edge computing and serverless management tools are available.
                    Visit the <a href="/governance-center" className="text-blue-600 hover:underline">Governance Center</a> for edge computing features.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Global Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Enterprise security and compliance management tools are available.
                    Visit the <a href="/governance-center" className="text-blue-600 hover:underline">Governance Center</a> for comprehensive security features.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="failover">
              <Card>
                <CardHeader>
                  <CardTitle>Cross-Region Failover</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Cross-region failover and disaster recovery tools are available.
                    Visit the <a href="/governance-center" className="text-blue-600 hover:underline">Governance Center</a> for risk management features.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
