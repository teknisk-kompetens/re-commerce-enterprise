
'use client';

/**
 * SECURITY MONITORING DASHBOARD
 * Real-time säkerhetsmonitoring med avancerad visualisering
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  Activity,
  Users,
  Lock,
  Eye,
  TrendingUp,
  TrendingDown,
  Globe,
  Zap,
  BarChart3,
  PieChart,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SecurityStats {
  overview: {
    totalEvents: number;
    securityScore: number;
    threatsBlocked: number;
    activeAlerts: number;
    lastUpdated: string;
  };
  threats: {
    breakdown: Record<string, number>;
    typeBreakdown: Record<string, number>;
    categoryBreakdown: Record<string, number>;
    timeline: Array<{
      date: string;
      count: number;
      severity: string;
    }>;
  };
  network: {
    blockedIPs: number;
    suspiciousIPs: number;
    blockedIPsList: string[];
    suspiciousIPsList: Array<{
      ip: string;
      count: number;
      lastSeen: string;
    }>;
  };
  compliance: {
    gdpr: {
      activeRequests: number;
      completedRequests: number;
      averageProcessingTime: number;
      consentGiven: number;
      consentWithdrawn: number;
      dataRetentionCompliance: number;
    };
  };
  authentication: {
    successfulLogins: number;
    failedLogins: number;
    bankidAuth: number;
    mfaVerifications: number;
  };
  realTimeMetrics: {
    requestsPerMinute: number;
    averageResponseTime: number;
    systemLoad: number;
    memoryUsage: number;
  };
}

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', '#80D8C3', '#A19AD3', '#72BF78'];

export default function SecurityMonitoringDashboard() {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Fetch security statistics
  const fetchStats = async (days: string = '30') => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/security/stats?days=${days}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch security stats');
      }

      const data = await response.json();
      setStats(data.data);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to fetch security stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats(selectedPeriod);
    
    // Auto-refresh varje 30 sekunder
    const interval = setInterval(() => {
      fetchStats(selectedPeriod);
    }, 30000);

    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    fetchStats(value);
  };

  const handleRefresh = () => {
    fetchStats(selectedPeriod);
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading security dashboard...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Failed to Load Security Data</h2>
          <Button onClick={() => fetchStats(selectedPeriod)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const severityData = Object.entries(stats.threats.breakdown).map(([severity, count]) => ({
    name: severity.charAt(0).toUpperCase() + severity.slice(1),
    value: count,
    color: COLORS[Object.keys(stats.threats.breakdown).indexOf(severity)]
  }));

  const timelineData = stats.threats.timeline
    .slice(-30) // Last 30 data points
    .map(item => ({
      date: new Date(item.date).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' }),
      events: item.count,
      severity: item.severity
    }));

  const authData = [
    { name: 'Successful', value: stats.authentication.successfulLogins, color: '#72BF78' },
    { name: 'Failed', value: stats.authentication.failedLogins, color: '#FF6363' },
    { name: 'BankID', value: stats.authentication.bankidAuth, color: '#60B5FF' },
    { name: 'MFA', value: stats.authentication.mfaVerifications, color: '#A19AD3' }
  ];

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSecurityScoreIcon = (score: number) => {
    if (score >= 90) return CheckCircle;
    if (score >= 70) return AlertTriangle;
    return XCircle;
  };

  const SecurityScoreIcon = getSecurityScoreIcon(stats.overview.securityScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Shield className="h-8 w-8 mr-3 text-blue-600" />
              Security Monitoring Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Real-time säkerhetsövervakning och hotanalys</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 dagar</SelectItem>
                <SelectItem value="30">30 dagar</SelectItem>
                <SelectItem value="90">90 dagar</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing}
              className="flex items-center"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Uppdatera
            </Button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                <span className="text-sm text-gray-600">System Active</span>
              </div>
              <div className="text-sm text-gray-500">
                Senast uppdaterad: {lastRefresh.toLocaleTimeString('sv-SE')}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50">
                {stats.realTimeMetrics.requestsPerMinute} req/min
              </Badge>
              <Badge variant="outline" className="bg-green-50">
                {stats.realTimeMetrics.averageResponseTime}ms avg
              </Badge>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Säkerhetspoäng</p>
                    <p className={`text-3xl font-bold ${getSecurityScoreColor(stats.overview.securityScore)}`}>
                      {stats.overview.securityScore}%
                    </p>
                  </div>
                  <SecurityScoreIcon className={`h-8 w-8 ${getSecurityScoreColor(stats.overview.securityScore)}`} />
                </div>
                <div className="mt-4 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      stats.overview.securityScore >= 90 ? 'bg-green-500' :
                      stats.overview.securityScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${stats.overview.securityScore}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Hot Blockerade</p>
                    <p className="text-3xl font-bold text-red-600">{stats.overview.threatsBlocked}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-600">-12% från förra perioden</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Aktiva Larm</p>
                    <p className="text-3xl font-bold text-orange-600">{stats.overview.activeAlerts}</p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-600" />
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <Clock className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-blue-600">Genomsnittlig åtgärdstid: 2.3h</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Säkerhetshändelser</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.overview.totalEvents}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-2 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-red-600">+8% från förra perioden</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="threats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="threats">Hot & Incidenter</TabsTrigger>
            <TabsTrigger value="network">Nätverkssäkerhet</TabsTrigger>
            <TabsTrigger value="auth">Autentisering</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="realtime">Realtid</TabsTrigger>
          </TabsList>

          {/* Threats Tab */}
          <TabsContent value="threats" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    Hotfördelning (Allvarlighetsgrad)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={severityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Hottyper
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(stats.threats.typeBreakdown).map(([type, count]) => ({
                      type: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                      count
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="type" 
                        tick={{ fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#60B5FF" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Säkerhetshändelser - Tidslinje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="events" 
                      stroke="#60B5FF" 
                      fill="#60B5FF" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Network Tab */}
          <TabsContent value="network" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2" />
                    Blockerade IP-adresser
                  </CardTitle>
                  <CardDescription>
                    Totalt {stats.network.blockedIPs} blockerade IP:er
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.network.blockedIPsList.slice(0, 5).map((ip, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                        <span className="font-mono text-sm">{ip}</span>
                        <Badge variant="destructive">Blockerad</Badge>
                      </div>
                    ))}
                    {stats.network.blockedIPsList.length > 5 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{stats.network.blockedIPsList.length - 5} fler...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                    Misstänkta IP-adresser
                  </CardTitle>
                  <CardDescription>
                    {stats.network.suspiciousIPs} IP:er under övervakning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.network.suspiciousIPsList.slice(0, 5).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <div>
                          <span className="font-mono text-sm">{item.ip}</span>
                          <p className="text-xs text-gray-500">{item.count} försök</p>
                        </div>
                        <Badge variant="outline" className="bg-yellow-100">
                          Övervakas
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Authentication Tab */}
          <TabsContent value="auth" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Autentiseringsstatistik
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={authData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {authData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Autentiseringsdetaljer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span>Lyckade inloggningar</span>
                    </div>
                    <span className="font-bold text-green-600">
                      {stats.authentication.successfulLogins}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                    <div className="flex items-center">
                      <XCircle className="h-5 w-5 text-red-600 mr-2" />
                      <span>Misslyckade inloggningar</span>
                    </div>
                    <span className="font-bold text-red-600">
                      {stats.authentication.failedLogins}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-blue-600 mr-2" />
                      <span>BankID autentiseringar</span>
                    </div>
                    <span className="font-bold text-blue-600">
                      {stats.authentication.bankidAuth}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded">
                    <div className="flex items-center">
                      <Lock className="h-5 w-5 text-purple-600 mr-2" />
                      <span>MFA verifieringar</span>
                    </div>
                    <span className="font-bold text-purple-600">
                      {stats.authentication.mfaVerifications}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">GDPR Compliance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Retention</span>
                    <span className="font-bold text-green-600">
                      {stats.compliance.gdpr.dataRetentionCompliance}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Aktiva Begäranden</span>
                    <Badge variant="outline">
                      {stats.compliance.gdpr.activeRequests}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Slutförda Begäranden</span>
                    <Badge variant="secondary">
                      {stats.compliance.gdpr.completedRequests}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Avg. Handläggningstid</span>
                    <span className="text-sm font-medium">
                      {stats.compliance.gdpr.averageProcessingTime} dagar
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Medgivanden</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Givna Medgivanden</span>
                    <span className="font-bold text-green-600">
                      {stats.compliance.gdpr.consentGiven}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Återkallade</span>
                    <span className="font-bold text-red-600">
                      {stats.compliance.gdpr.consentWithdrawn}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Medgivande-ratio</span>
                      <span>
                        {Math.round((stats.compliance.gdpr.consentGiven / 
                          (stats.compliance.gdpr.consentGiven + stats.compliance.gdpr.consentWithdrawn)) * 100)}%
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ 
                          width: `${(stats.compliance.gdpr.consentGiven / 
                            (stats.compliance.gdpr.consentGiven + stats.compliance.gdpr.consentWithdrawn)) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compliance Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">GDPR</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Compliant
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ISO 27001</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Certified
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SOC 2</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">PCI DSS</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Level 1
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Real-time Tab */}
          <TabsContent value="realtime" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Systembelastning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>CPU Användning</span>
                      <span>{Math.round(stats.realTimeMetrics.systemLoad * 100)}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          stats.realTimeMetrics.systemLoad > 0.8 ? 'bg-red-500' :
                          stats.realTimeMetrics.systemLoad > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${stats.realTimeMetrics.systemLoad * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Minne Användning</span>
                      <span>{Math.round(stats.realTimeMetrics.memoryUsage * 100)}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          stats.realTimeMetrics.memoryUsage > 0.8 ? 'bg-red-500' :
                          stats.realTimeMetrics.memoryUsage > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${stats.realTimeMetrics.memoryUsage * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.realTimeMetrics.requestsPerMinute}
                      </p>
                      <p className="text-sm text-gray-600">Requests/min</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <p className="text-2xl font-bold text-green-600">
                        {stats.realTimeMetrics.averageResponseTime}ms
                      </p>
                      <p className="text-sm text-gray-600">Avg Response</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Live Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {/* Mock live events */}
                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Successful BankID Authentication</p>
                        <p className="text-xs text-gray-500">User 192.168.1.100 - Just now</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Suspicious IP Activity Detected</p>
                        <p className="text-xs text-gray-500">IP 203.0.113.42 - 2 min ago</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New User Registration</p>
                        <p className="text-xs text-gray-500">Tenant: enterprise-corp - 5 min ago</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Failed Login Attempt</p>
                        <p className="text-xs text-gray-500">IP 198.51.100.23 - 8 min ago</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                      <Lock className="h-5 w-5 text-purple-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">MFA Verification Completed</p>
                        <p className="text-xs text-gray-500">User verified via TOTP - 12 min ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
