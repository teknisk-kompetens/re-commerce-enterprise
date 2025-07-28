
/**
 * INTELLIGENT BUSINESS INTELLIGENCE
 * AI-powered business intelligence dashboards, automated reports,
 * predictive metrics, and intelligent data classification
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Brain, 
  TrendingUp, 
  FileText, 
  Shield, 
  Zap, 
  Eye,
  Target,
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Download,
  Share2,
  Settings,
  RefreshCw
} from 'lucide-react';
import dynamic from 'next/dynamic';

// @ts-ignore
const Chart = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64">Loading chart...</div>
});

interface BIData {
  dashboards: any[];
  reports: any[];
  insights: any[];
  predictions: any[];
  recommendations: any[];
  stats: {
    totalDashboards: number;
    activeReports: number;
    dailyInsights: number;
    accuracyRate: number;
    dataProcessed: number;
    predictionAccuracy: number;
  };
  keyMetrics: {
    revenue: any;
    customers: any;
    conversion: any;
  };
}

export default function IntelligentBI() {
  const [data, setData] = useState<BIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [processing, setProcessing] = useState(false);
  
  // Form states
  const [dashboardForm, setDashboardForm] = useState({
    name: '',
    description: '',
    dataSource: ''
  });
  
  const [reportForm, setReportForm] = useState({
    name: '',
    type: '',
    schedule: '',
    recipients: ''
  });

  useEffect(() => {
    fetchBIData();
  }, []);

  const fetchBIData = async () => {
    try {
      const response = await fetch('/api/intelligent-bi');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch BI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDashboard = async () => {
    if (!dashboardForm.name || !dashboardForm.dataSource) return;
    
    setProcessing(true);
    try {
      const response = await fetch('/api/intelligent-bi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_dashboard',
          data: {
            ...dashboardForm,
            tenantId: 'default'
          }
        })
      });
      
      const result = await response.json();
      if (result.biId) {
        setDashboardForm({ name: '', description: '', dataSource: '' });
        await fetchBIData();
      }
    } catch (error) {
      console.error('Failed to create dashboard:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleCreateReport = async () => {
    if (!reportForm.name || !reportForm.type) return;
    
    setProcessing(true);
    try {
      const response = await fetch('/api/intelligent-bi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_automated_report',
          data: {
            ...reportForm,
            recipients: reportForm.recipients.split(',').map(r => r.trim()),
            parameters: {},
            tenantId: 'default'
          }
        })
      });
      
      const result = await response.json();
      if (result.reportId) {
        setReportForm({ name: '', type: '', schedule: '', recipients: '' });
        await fetchBIData();
      }
    } catch (error) {
      console.error('Failed to create report:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleGenerateReport = async (reportId: string) => {
    setProcessing(true);
    try {
      const response = await fetch('/api/intelligent-bi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_report',
          data: { reportId }
        })
      });
      
      const result = await response.json();
      if (result.content) {
        // Handle generated report
        console.log('Generated report:', result);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handlePredictMetrics = async (data: any) => {
    setProcessing(true);
    try {
      const response = await fetch('/api/intelligent-bi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'predict_metrics',
          data: {
            name: 'Revenue Prediction',
            description: 'Predict revenue trends',
            type: 'time_series',
            algorithm: 'lstm',
            dataSource: 'sales_data',
            features: ['historical_sales', 'marketing_spend', 'seasonality'],
            frequency: 'daily',
            inputData: data,
            tenantId: 'default'
          }
        })
      });
      
      const result = await response.json();
      if (result.predictions) {
        await fetchBIData();
      }
    } catch (error) {
      console.error('Failed to predict metrics:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Loading Intelligent BI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-600 rounded-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Intelligent Business Intelligence</h1>
                <p className="text-gray-600">AI-powered insights, automated reports, and predictive analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share Dashboard
              </Button>
              <Button variant="outline" onClick={fetchBIData} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Dashboards</p>
                  <p className="text-2xl font-bold text-gray-900">{data?.stats?.totalDashboards || 0}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{data?.stats?.activeReports || 0}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Daily Insights</p>
                  <p className="text-2xl font-bold text-gray-900">{data?.stats?.dailyInsights || 0}</p>
                </div>
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Accuracy Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{data?.stats?.accuracyRate || 0}%</p>
                </div>
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Data Processed</p>
                  <p className="text-2xl font-bold text-gray-900">{data?.stats?.dataProcessed || 0}TB</p>
                </div>
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Prediction Accuracy</p>
                  <p className="text-2xl font-bold text-gray-900">{data?.stats?.predictionAccuracy || 0}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Business Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Revenue Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="font-bold text-2xl">${(data?.keyMetrics?.revenue?.current || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Predicted</span>
                  <span className="font-bold text-lg text-green-600">${(data?.keyMetrics?.revenue?.predicted || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Growth</span>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    +{data?.keyMetrics?.revenue?.growth || 0}%
                  </Badge>
                </div>
                <Progress value={data?.keyMetrics?.revenue?.growth || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Customer Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="font-bold text-2xl">{(data?.keyMetrics?.customers?.current || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Predicted</span>
                  <span className="font-bold text-lg text-blue-600">{(data?.keyMetrics?.customers?.predicted || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Growth</span>
                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                    +{data?.keyMetrics?.customers?.growth || 0}%
                  </Badge>
                </div>
                <Progress value={data?.keyMetrics?.customers?.growth || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Conversion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current</span>
                  <span className="font-bold text-2xl">{data?.keyMetrics?.conversion?.current || 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Predicted</span>
                  <span className="font-bold text-lg text-purple-600">{data?.keyMetrics?.conversion?.predicted || 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Growth</span>
                  <Badge variant="default" className="bg-purple-100 text-purple-800">
                    +{data?.keyMetrics?.conversion?.growth || 0}%
                  </Badge>
                </div>
                <Progress value={data?.keyMetrics?.conversion?.growth || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Overview Chart */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Chart
                      data={[{
                        x: ['Revenue', 'Customers', 'Conversion', 'Retention', 'Satisfaction'],
                        y: [92, 88, 85, 90, 94],
                        type: 'bar',
                        marker: { color: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444'] }
                      }]}
                      layout={{
                        autosize: true,
                        margin: { l: 40, r: 40, t: 40, b: 40 },
                        yaxis: { title: { text: 'Performance Score' } },
                        showlegend: false
                      }}
                      config={{
                        responsive: true,
                        displayModeBar: false
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Trend Analysis */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Chart
                      data={[{
                        x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        y: [85, 87, 89, 91, 93, 94],
                        type: 'scatter',
                        mode: 'lines+markers',
                        name: 'Accuracy Trend',
                        line: { color: '#10B981' }
                      }]}
                      layout={{
                        autosize: true,
                        margin: { l: 40, r: 40, t: 40, b: 40 },
                        yaxis: { title: { text: 'Accuracy %' } },
                        showlegend: false
                      }}
                      config={{
                        responsive: true,
                        displayModeBar: false
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Insights */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Recent Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data?.insights?.slice(0, 4).map((insight, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{insight.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'} className="text-xs">
                              {insight.impact}
                            </Badge>
                            <span className="text-xs text-gray-500">{(insight.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Recommendations */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Top Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data?.recommendations?.slice(0, 4).map((rec, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{rec.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                              {rec.priority}
                            </Badge>
                            <span className="text-xs text-gray-500">{rec.source}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dashboards" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Create Dashboard */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dashboard-name">Dashboard Name</Label>
                    <Input
                      id="dashboard-name"
                      placeholder="Enter dashboard name"
                      value={dashboardForm.name}
                      onChange={(e) => setDashboardForm({ ...dashboardForm, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dashboard-description">Description</Label>
                    <Textarea
                      id="dashboard-description"
                      placeholder="Describe your dashboard"
                      value={dashboardForm.description}
                      onChange={(e) => setDashboardForm({ ...dashboardForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data Source</Label>
                    <Select value={dashboardForm.dataSource} onValueChange={(value) => setDashboardForm({ ...dashboardForm, dataSource: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales_data">Sales Data</SelectItem>
                        <SelectItem value="customer_data">Customer Data</SelectItem>
                        <SelectItem value="marketing_data">Marketing Data</SelectItem>
                        <SelectItem value="financial_data">Financial Data</SelectItem>
                        <SelectItem value="operational_data">Operational Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleCreateDashboard} 
                    disabled={processing || !dashboardForm.name || !dashboardForm.dataSource}
                    className="w-full"
                  >
                    {processing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Dashboard
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Dashboards */}
              <div className="lg:col-span-2">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Existing Dashboards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data?.dashboards?.map((dashboard) => (
                        <div key={dashboard.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium">{dashboard.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{dashboard.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>Data Source: {dashboard.dataSource}</span>
                                <span>•</span>
                                <span>{dashboard.insights} insights</span>
                                <span>•</span>
                                <span>{dashboard.predictions} predictions</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {dashboard.refreshRate}s refresh
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Settings className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Last refresh: {new Date(dashboard.lastRefresh).toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              Created: {new Date(dashboard.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Create Report */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Create Automated Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-name">Report Name</Label>
                    <Input
                      id="report-name"
                      placeholder="Enter report name"
                      value={reportForm.name}
                      onChange={(e) => setReportForm({ ...reportForm, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Report Type</Label>
                    <Select value={reportForm.type} onValueChange={(value) => setReportForm({ ...reportForm, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="performance">Performance Report</SelectItem>
                        <SelectItem value="business">Business Report</SelectItem>
                        <SelectItem value="technical">Technical Report</SelectItem>
                        <SelectItem value="compliance">Compliance Report</SelectItem>
                        <SelectItem value="security">Security Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Schedule</Label>
                    <Select value={reportForm.schedule} onValueChange={(value) => setReportForm({ ...reportForm, schedule: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-recipients">Recipients</Label>
                    <Input
                      id="report-recipients"
                      placeholder="Enter email addresses (comma separated)"
                      value={reportForm.recipients}
                      onChange={(e) => setReportForm({ ...reportForm, recipients: e.target.value })}
                    />
                  </div>

                  <Button 
                    onClick={handleCreateReport} 
                    disabled={processing || !reportForm.name || !reportForm.type}
                    className="w-full"
                  >
                    {processing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Report
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Reports */}
              <div className="lg:col-span-2">
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Automated Reports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {data?.reports?.map((report) => (
                        <div key={report.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium">{report.name}</h3>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>Type: {report.type}</span>
                                <span>•</span>
                                <span>Schedule: {report.schedule}</span>
                                <span>•</span>
                                <span>{report.recipients.length} recipients</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={report.isActive ? 'default' : 'secondary'} className="text-xs">
                                {report.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleGenerateReport(report.id)}
                                disabled={processing}
                              >
                                <FileText className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Settings className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Last generated: {new Date(report.lastGenerated).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Insights */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI-Generated Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data?.insights?.map((insight, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded-full ${
                              insight.type === 'trend' ? 'bg-blue-100' :
                              insight.type === 'anomaly' ? 'bg-red-100' :
                              insight.type === 'pattern' ? 'bg-green-100' :
                              insight.type === 'correlation' ? 'bg-purple-100' :
                              'bg-orange-100'
                            }`}>
                              {insight.type === 'trend' && <TrendingUp className="h-3 w-3 text-blue-600" />}
                              {insight.type === 'anomaly' && <AlertCircle className="h-3 w-3 text-red-600" />}
                              {insight.type === 'pattern' && <CheckCircle className="h-3 w-3 text-green-600" />}
                              {insight.type === 'correlation' && <Brain className="h-3 w-3 text-purple-600" />}
                              {insight.type === 'forecast' && <Eye className="h-3 w-3 text-orange-600" />}
                            </div>
                            <span className="text-sm font-medium capitalize">{insight.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'} className="text-xs">
                              {insight.impact}
                            </Badge>
                            <span className="text-xs text-gray-500">{(insight.confidence * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                        <h3 className="font-medium">{insight.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Source: {insight.biName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(insight.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Insight Categories */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Insight Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Chart
                      data={[{
                        values: [15, 8, 12, 6, 9],
                        labels: ['Trends', 'Anomalies', 'Patterns', 'Correlations', 'Forecasts'],
                        type: 'pie',
                        hole: 0.4,
                        marker: {
                          colors: ['#3B82F6', '#EF4444', '#10B981', '#8B5CF6', '#F59E0B']
                        }
                      }]}
                      layout={{
                        autosize: true,
                        margin: { l: 40, r: 40, t: 40, b: 40 },
                        showlegend: true,
                        legend: { orientation: 'h', y: -0.2 }
                      }}
                      config={{
                        responsive: true,
                        displayModeBar: false
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prediction Results */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Prediction Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data?.predictions?.map((prediction, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{prediction.metric}</h3>
                            <p className="text-sm text-gray-600">{prediction.timeframe}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {(prediction.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-gray-500">Current Value</p>
                            <p className="text-lg font-bold">{prediction.currentValue.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Predicted Value</p>
                            <p className="text-lg font-bold text-green-600">{prediction.predictedValue.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-1">Key Factors:</p>
                          <div className="flex flex-wrap gap-1">
                            {prediction.factors?.slice(0, 3).map((factor: any, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {factor.feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Source: {prediction.sourceName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(prediction.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Prediction Accuracy */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Prediction Accuracy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Chart
                      data={[{
                        x: ['Revenue', 'Customers', 'Conversion', 'Retention', 'Growth'],
                        y: [94, 91, 88, 92, 89],
                        type: 'bar',
                        marker: { 
                          color: '#10B981',
                          opacity: 0.8
                        }
                      }]}
                      layout={{
                        autosize: true,
                        margin: { l: 40, r: 40, t: 40, b: 40 },
                        yaxis: { 
                          title: { text: 'Accuracy %' },
                          range: [0, 100]
                        },
                        showlegend: false
                      }}
                      config={{
                        responsive: true,
                        displayModeBar: false
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI Recommendations */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data?.recommendations?.map((rec, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1 rounded-full ${
                              rec.type === 'optimization' ? 'bg-blue-100' :
                              rec.type === 'cost_reduction' ? 'bg-green-100' :
                              rec.type === 'performance' ? 'bg-purple-100' :
                              rec.type === 'security' ? 'bg-red-100' :
                              'bg-orange-100'
                            }`}>
                              {rec.type === 'optimization' && <TrendingUp className="h-3 w-3 text-blue-600" />}
                              {rec.type === 'cost_reduction' && <Target className="h-3 w-3 text-green-600" />}
                              {rec.type === 'performance' && <Zap className="h-3 w-3 text-purple-600" />}
                              {rec.type === 'security' && <Shield className="h-3 w-3 text-red-600" />}
                              {rec.type === 'user_experience' && <Eye className="h-3 w-3 text-orange-600" />}
                            </div>
                            <span className="text-sm font-medium capitalize">{rec.type.replace('_', ' ')}</span>
                          </div>
                          <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'} className="text-xs">
                            {rec.priority}
                          </Badge>
                        </div>
                        <h3 className="font-medium">{rec.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        <div className="mt-2 p-2 bg-white rounded border">
                          <p className="text-xs text-gray-500">Estimated Impact:</p>
                          <p className="text-sm font-medium">{rec.estimatedImpact}</p>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Source: {rec.sourceName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(rec.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendation Impact */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Recommendation Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Chart
                      data={[{
                        x: ['Optimization', 'Cost Reduction', 'Performance', 'Security', 'UX'],
                        y: [8, 12, 6, 4, 10],
                        type: 'bar',
                        marker: { 
                          color: ['#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B'],
                          opacity: 0.8
                        }
                      }]}
                      layout={{
                        autosize: true,
                        margin: { l: 40, r: 40, t: 40, b: 40 },
                        yaxis: { title: { text: 'Number of Recommendations' } },
                        showlegend: false
                      }}
                      config={{
                        responsive: true,
                        displayModeBar: false
                      }}
                    />
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
