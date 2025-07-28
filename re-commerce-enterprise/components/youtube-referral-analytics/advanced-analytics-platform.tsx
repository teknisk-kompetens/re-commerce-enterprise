
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Activity,
  Lightbulb,
  Search,
  Filter,
  Download,
  RefreshCw as Refresh,
  Eye,
  Shield,
  Crown,
  Rocket,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Play,
  Pause,
  Settings
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface Prediction {
  id: string;
  modelType: string;
  targetMetric: string;
  predictedValue: number;
  confidenceScore: number;
  predictionDate: string;
  actualValue?: number;
}

interface AIInsight {
  id: string;
  insightType: string;
  category: string;
  priority: string;
  confidence: number;
  title: string;
  description: string;
  actionableSteps: any;
  expectedImpact: any;
  status: string;
}

interface TrendAnalysis {
  id: string;
  trendType: string;
  category: string;
  metricName: string;
  strength: number;
  direction: string;
  duration: number;
  acceleration: number;
}

interface CompetitorIntelligence {
  id: string;
  competitorName: string;
  competitorType: string;
  threatLevel: string;
  marketShare?: number;
  growthRate?: number;
  marketPosition: string;
}

interface ContentPerformance {
  id: string;
  contentType: string;
  contentTitle?: string;
  viralityScore: number;
  engagementRate: number;
  views: string;
  roi?: number;
}

export default function AdvancedAnalyticsPlatform() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [trendAnalyses, setTrendAnalyses] = useState<TrendAnalysis[]>([]);
  const [competitors, setCompetitors] = useState<CompetitorIntelligence[]>([]);
  const [contentPerformance, setContentPerformance] = useState<ContentPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedTimeRange]);

  const fetchAnalyticsData = async () => {
    try {
      const tenantId = "tenant-1";
      const [predictionsRes, insightsRes, trendsRes, competitorsRes, contentRes] = await Promise.all([
        fetch(`/api/advanced-analytics/predictive-analytics?tenantId=${tenantId}&limit=20`),
        fetch(`/api/advanced-analytics/ai-insights?tenantId=${tenantId}&status=new&limit=15`),
        fetch(`/api/advanced-analytics/trend-analysis?tenantId=${tenantId}&timeRange=${selectedTimeRange}`),
        fetch(`/api/advanced-analytics/competitive-intelligence?tenantId=${tenantId}&limit=10`),
        fetch(`/api/advanced-analytics/content-performance?tenantId=${tenantId}&timeRange=${selectedTimeRange}`)
      ]);

      const [predictionsData, insightsData, trendsData, competitorsData, contentData] = await Promise.all([
        predictionsRes.json(),
        insightsRes.json(),
        trendsRes.json(),
        competitorsRes.json(),
        contentRes.json()
      ]);

      setPredictions(predictionsData.predictions || []);
      setAiInsights(insightsData.insights || []);
      setTrendAnalyses(trendsData.trendAnalyses || []);
      setCompetitors(competitorsData.competitors || []);
      setContentPerformance(contentData.contentAnalytics || []);

      // Set dashboard summary data
      setDashboardData({
        totalPredictions: predictionsData.insights?.totalPredictions || 0,
        averageAccuracy: predictionsData.insights?.averageAccuracy || 0,
        highPriorityInsights: insightsData.insights?.highPriorityInsights || 0,
        strongTrends: trendsData.insights?.strongTrends || 0,
        emergingThreats: competitorsData.insights?.highThreatCompetitors || 0,
        viralContent: contentData.insights?.viralContent || 0
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async (dataSource: string) => {
    try {
      const tenantId = "tenant-1";
      setActiveAnalysis(dataSource);
      
      const response = await fetch('/api/advanced-analytics/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_insights',
          data: {
            tenantId,
            dataSource,
            analysisType: 'comprehensive',
            timeRange: parseInt(selectedTimeRange),
            minConfidence: 0.7
          }
        })
      });

      const data = await response.json();
      if (data.insights) {
        setAiInsights(prev => [...data.insights, ...prev]);
      }
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setActiveAnalysis(null);
    }
  };

  const createPrediction = async (modelType: string, targetMetric: string) => {
    try {
      const tenantId = "tenant-1";
      const response = await fetch('/api/advanced-analytics/predictive-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_prediction',
          data: {
            tenantId,
            modelType,
            targetMetric,
            predictionHorizon: 30,
            inputFeatures: {
              user_engagement: 0.75,
              content_quality: 0.85,
              market_trends: 0.65
            }
          }
        })
      });

      const data = await response.json();
      if (data.prediction) {
        setPredictions(prev => [data.prediction, ...prev]);
      }
    } catch (error) {
      console.error('Error creating prediction:', error);
    }
  };

  const runTrendAnalysis = async (metricName: string) => {
    try {
      const tenantId = "tenant-1";
      const response = await fetch('/api/advanced-analytics/trend-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze_trend',
          data: {
            tenantId,
            metricName,
            category: 'performance',
            timeSeriesData: generateMockTimeSeriesData()
          }
        })
      });

      const data = await response.json();
      if (data.analysis) {
        setTrendAnalyses(prev => [data.analysis, ...prev]);
      }
    } catch (error) {
      console.error('Error running trend analysis:', error);
    }
  };

  const addCompetitor = async (competitorName: string, competitorDomain: string) => {
    try {
      const tenantId = "tenant-1";
      const response = await fetch('/api/advanced-analytics/competitive-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_competitor',
          data: {
            tenantId,
            competitorName,
            competitorDomain,
            competitorType: 'direct',
            industry: 'technology'
          }
        })
      });

      const data = await response.json();
      if (data.competitor) {
        setCompetitors(prev => [data.competitor, ...prev]);
      }
    } catch (error) {
      console.error('Error adding competitor:', error);
    }
  };

  const generateMockTimeSeriesData = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: Math.random() * 1000 + 500 + Math.sin(i * 0.2) * 200
    }));
  };

  const formatNumber = (num: number | string) => {
    const n = typeof num === 'string' ? parseFloat(num) : num;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n?.toFixed(0) || '0';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    }
  };

  const getThreatLevelColor = (threatLevel: string) => {
    switch (threatLevel.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction.toLowerCase()) {
      case 'upward': return <ArrowUpRight className="h-4 w-4 text-green-500" />;
      case 'downward': return <ArrowDownRight className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3', '#72BF78'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Advanced Analytics Platform</h1>
          <p className="text-muted-foreground">AI-powered insights, predictive analytics, and competitive intelligence</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => generateInsights('user_behavior')}
            disabled={activeAnalysis === 'user_behavior'}
            className="flex items-center space-x-2"
          >
            {activeAnalysis === 'user_behavior' ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Brain className="h-4 w-4" />
            )}
            <span>Generate AI Insights</span>
          </Button>
          <Button onClick={fetchAnalyticsData} variant="outline" className="flex items-center space-x-2">
            <Refresh className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Predictions</p>
                <p className="text-2xl font-bold">{dashboardData?.totalPredictions || 0}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <Badge variant="secondary">
                {(dashboardData?.averageAccuracy * 100 || 0).toFixed(0)}% accuracy
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">AI Insights</p>
                <p className="text-2xl font-bold">{dashboardData?.highPriorityInsights || 0}</p>
              </div>
              <Brain className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4">
              <Badge variant="default">High Priority</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Strong Trends</p>
                <p className="text-2xl font-bold">{dashboardData?.strongTrends || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4">
              <Badge variant="outline">Detected</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Threats</p>
                <p className="text-2xl font-bold">{dashboardData?.emergingThreats || 0}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-4">
              <Badge variant="destructive">High Priority</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Viral Content</p>
                <p className="text-2xl font-bold">{dashboardData?.viralContent || 0}</p>
              </div>
              <Rocket className="h-8 w-8 text-pink-600" />
            </div>
            <div className="mt-4">
              <Badge variant="default">Performing</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Analytics Score</p>
                <p className="text-2xl font-bold">94</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mt-4">
              <Badge variant="default">Excellent</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="predictions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        {/* Predictive Analytics Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Predictive Analytics</h2>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => createPrediction('user_churn', 'churn_rate')}
                size="sm" variant="outline"
              >
                Predict Churn
              </Button>
              <Button 
                onClick={() => createPrediction('revenue_forecast', 'monthly_revenue')}
                size="sm" variant="outline"
              >
                Revenue Forecast
              </Button>
              <Button 
                onClick={() => createPrediction('growth_prediction', 'user_growth')}
                size="sm" variant="outline"
              >
                Growth Prediction
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prediction Accuracy Trends</CardTitle>
                <CardDescription>Model performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictions.slice(0, 10).map((p, i) => ({
                    name: `Model ${i + 1}`,
                    accuracy: p.confidenceScore * 100,
                    predictions: 1
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Accuracy %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prediction Confidence Distribution</CardTitle>
                <CardDescription>Confidence levels across all models</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'High (80%+)', value: predictions.filter(p => p.confidenceScore > 0.8).length, color: '#10b981' },
                        { name: 'Medium (60-80%)', value: predictions.filter(p => p.confidenceScore > 0.6 && p.confidenceScore <= 0.8).length, color: '#f59e0b' },
                        { name: 'Low (<60%)', value: predictions.filter(p => p.confidenceScore <= 0.6).length, color: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Predictions</CardTitle>
              <CardDescription>Current model predictions and their confidence levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.slice(0, 8).map((prediction) => (
                  <div key={prediction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Target className="h-5 w-5 text-blue-500" />
                        <div>
                          <h4 className="font-medium">{prediction.modelType.replace('_', ' ').toUpperCase()}</h4>
                          <p className="text-sm text-muted-foreground">
                            Target: {prediction.targetMetric} • 
                            Predicted: {prediction.predictedValue.toFixed(2)} • 
                            {new Date(prediction.predictionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {(prediction.confidenceScore * 100).toFixed(1)}% confidence
                        </p>
                        <Progress value={prediction.confidenceScore * 100} className="w-24 mt-1" />
                      </div>
                      <Badge variant={prediction.confidenceScore > 0.8 ? 'default' : 'secondary'}>
                        {prediction.confidenceScore > 0.8 ? 'High' : prediction.confidenceScore > 0.6 ? 'Medium' : 'Low'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">AI-Powered Insights</h2>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => generateInsights('content_performance')}
                disabled={activeAnalysis === 'content_performance'}
                size="sm" variant="outline"
              >
                {activeAnalysis === 'content_performance' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  'Analyze Content'
                )}
              </Button>
              <Button 
                onClick={() => generateInsights('revenue')}
                disabled={activeAnalysis === 'revenue'}
                size="sm" variant="outline"
              >
                {activeAnalysis === 'revenue' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                ) : (
                  'Revenue Analysis'
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['critical', 'high', 'medium'].map(priority => (
              <Card key={priority}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      priority === 'critical' ? 'bg-red-500' : 
                      priority === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                    }`} />
                    <span>{priority.charAt(0).toUpperCase() + priority.slice(1)} Priority</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {aiInsights
                      .filter(insight => insight.priority === priority)
                      .slice(0, 3)
                      .map((insight) => (
                        <div key={insight.id} className={`p-4 rounded-lg ${getPriorityColor(insight.priority)}`}>
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-sm">{insight.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {(insight.confidence * 100).toFixed(0)}%
                            </Badge>
                          </div>
                          <p className="text-xs mb-3">{insight.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">{insight.category}</span>
                            <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent AI Insights</CardTitle>
              <CardDescription>Latest AI-generated recommendations and opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.slice(0, 6).map((insight) => (
                  <div key={insight.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getPriorityColor(insight.priority)}`}>
                        {insight.insightType === 'opportunity' ? <Lightbulb className="h-5 w-5" /> :
                         insight.insightType === 'risk' ? <AlertTriangle className="h-5 w-5" /> :
                         insight.insightType === 'trend' ? <TrendingUp className="h-5 w-5" /> :
                         <Brain className="h-5 w-5" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{insight.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={insight.priority === 'critical' ? 'destructive' : 'secondary'}>
                            {insight.priority}
                          </Badge>
                          <Badge variant="outline">
                            {(insight.confidence * 100).toFixed(0)}% confidence
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                      {insight.actionableSteps && Object.keys(insight.actionableSteps).length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-medium">Recommended Actions:</p>
                          {insight.actionableSteps.immediate?.slice(0, 2).map((action: string, index: number) => (
                            <div key={index} className="flex items-center space-x-2 text-xs">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span>{action}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trend Analysis Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Trend Analysis</h2>
            <div className="flex items-center space-x-2">
              <Button 
                onClick={() => runTrendAnalysis('user_engagement')}
                size="sm" variant="outline"
              >
                Analyze Engagement
              </Button>
              <Button 
                onClick={() => runTrendAnalysis('revenue_growth')}
                size="sm" variant="outline"
              >
                Revenue Trends
              </Button>
              <Button 
                onClick={() => runTrendAnalysis('content_performance')}
                size="sm" variant="outline"
              >
                Content Trends
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trend Strength Distribution</CardTitle>
                <CardDescription>Analysis of trend strength across metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={trendAnalyses.slice(0, 8).map(trend => ({
                    name: trend.metricName.slice(0, 10),
                    strength: trend.strength * 100,
                    direction: trend.direction
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="strength" fill="#60B5FF" name="Trend Strength %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trend Categories</CardTitle>
                <CardDescription>Distribution of trends by category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Performance', value: trendAnalyses.filter(t => t.category === 'performance').length },
                        { name: 'User Growth', value: trendAnalyses.filter(t => t.category === 'user_growth').length },
                        { name: 'Revenue', value: trendAnalyses.filter(t => t.category === 'revenue').length },
                        { name: 'Engagement', value: trendAnalyses.filter(t => t.category === 'engagement').length },
                        { name: 'Content', value: trendAnalyses.filter(t => t.category === 'content_performance').length }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Active Trend Analysis</CardTitle>
              <CardDescription>Current trends and their characteristics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendAnalyses.slice(0, 8).map((trend) => (
                  <div key={trend.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(trend.direction)}
                        <div>
                          <h4 className="font-medium">{trend.metricName.replace('_', ' ').toUpperCase()}</h4>
                          <p className="text-sm text-muted-foreground">
                            {trend.category} • {trend.trendType} • {trend.duration} days
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Strength: {(trend.strength * 100).toFixed(1)}%</p>
                        <p className="text-xs text-muted-foreground">
                          {trend.acceleration > 0 ? 'Accelerating' : trend.acceleration < 0 ? 'Decelerating' : 'Stable'}
                        </p>
                      </div>
                      <Progress value={trend.strength * 100} className="w-24" />
                      <Badge variant={trend.strength > 0.7 ? 'default' : 'secondary'}>
                        {trend.direction}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Competitive Intelligence Tab */}
        <TabsContent value="competitors" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Competitive Intelligence</h2>
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Add competitor domain..."
                className="w-48"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const input = e.target as HTMLInputElement;
                    if (input.value.trim()) {
                      addCompetitor(input.value.trim(), input.value.trim());
                      input.value = '';
                    }
                  }
                }}
              />
              <Button size="sm">Add Competitor</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Threat Level Distribution</CardTitle>
                <CardDescription>Competitor threat assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Critical', value: competitors.filter(c => c.threatLevel === 'critical').length, color: '#ef4444' },
                        { name: 'High', value: competitors.filter(c => c.threatLevel === 'high').length, color: '#f97316' },
                        { name: 'Medium', value: competitors.filter(c => c.threatLevel === 'medium').length, color: '#eab308' },
                        { name: 'Low', value: competitors.filter(c => c.threatLevel === 'low').length, color: '#22c55e' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                    >
                      {['#ef4444', '#f97316', '#eab308', '#22c55e'].map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Position Analysis</CardTitle>
                <CardDescription>Competitive landscape overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={competitors.map(c => ({
                    x: c.marketShare || Math.random() * 20,
                    y: c.growthRate ? c.growthRate * 100 : Math.random() * 50,
                    name: c.competitorName,
                    threat: c.threatLevel
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" name="Market Share %" />
                    <YAxis dataKey="y" name="Growth Rate %" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter dataKey="y" fill="#60B5FF" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Competitor Monitoring</CardTitle>
              <CardDescription>Track competitor activities and market positioning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitors.slice(0, 8).map((competitor) => (
                  <div key={competitor.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {competitor.competitorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-medium">{competitor.competitorName}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{competitor.competitorType}</span>
                          <span>•</span>
                          <span>{competitor.marketPosition}</span>
                          {competitor.marketShare && (
                            <>
                              <span>•</span>
                              <span>{competitor.marketShare.toFixed(1)}% market share</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Threat Level</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`w-3 h-3 rounded-full ${getThreatLevelColor(competitor.threatLevel)}`} />
                          <span className="text-xs">{competitor.threatLevel.toUpperCase()}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Performance Tab */}
        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Content Performance Analytics</h2>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline">Analyze New Content</Button>
              <Button size="sm" variant="outline">Optimize Existing</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Virality Score Distribution</CardTitle>
                <CardDescription>Content viral performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={contentPerformance.slice(0, 10).map(content => ({
                    name: content.contentTitle?.slice(0, 15) || 'Content',
                    virality: content.viralityScore * 100,
                    engagement: content.engagementRate * 100
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="virality" fill="#FF9149" name="Virality Score %" />
                    <Bar dataKey="engagement" fill="#60B5FF" name="Engagement Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Type Performance</CardTitle>
                <CardDescription>Performance by content type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'YouTube Videos', value: contentPerformance.filter(c => c.contentType === 'youtube_video').length },
                        { name: 'Blog Posts', value: contentPerformance.filter(c => c.contentType === 'blog_post').length },
                        { name: 'Case Studies', value: contentPerformance.filter(c => c.contentType === 'case_study').length },
                        { name: 'Social Posts', value: contentPerformance.filter(c => c.contentType === 'social_post').length }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>Highest performing content by virality and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentPerformance
                  .sort((a, b) => b.viralityScore - a.viralityScore)
                  .slice(0, 6)
                  .map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-600 rounded-lg flex items-center justify-center text-white">
                          {content.contentType === 'youtube_video' ? '📺' : 
                           content.contentType === 'blog_post' ? '📝' : 
                           content.contentType === 'case_study' ? '📊' : '📱'}
                        </div>
                        <div>
                          <h4 className="font-medium">{content.contentTitle || 'Untitled Content'}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{content.contentType.replace('_', ' ')}</span>
                            <span>•</span>
                            <span>{formatNumber(content.views)} views</span>
                            <span>•</span>
                            <span>{(content.engagementRate * 100).toFixed(1)}% engagement</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">Virality: {(content.viralityScore * 100).toFixed(1)}%</p>
                          {content.roi && (
                            <p className="text-xs text-muted-foreground">ROI: {content.roi.toFixed(0)}%</p>
                          )}
                        </div>
                        <Progress value={content.viralityScore * 100} className="w-24" />
                        <Badge variant={content.viralityScore > 0.7 ? 'default' : 'secondary'}>
                          {content.viralityScore > 0.7 ? 'Viral' : 'Normal'}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Performance Overview</CardTitle>
                <CardDescription>Key performance indicators across all analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={[
                    { subject: 'Predictions', value: 85, fullMark: 100 },
                    { subject: 'AI Insights', value: 92, fullMark: 100 },
                    { subject: 'Trends', value: 78, fullMark: 100 },
                    { subject: 'Competitors', value: 88, fullMark: 100 },
                    { subject: 'Content', value: 95, fullMark: 100 },
                    { subject: 'Growth', value: 82, fullMark: 100 }
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Performance" dataKey="value" stroke="#60B5FF" fill="#60B5FF" fillOpacity={0.1} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health & Status</CardTitle>
                <CardDescription>Analytics platform operational status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { name: 'Predictive Models', status: 'operational', accuracy: 94 },
                    { name: 'AI Insights Engine', status: 'operational', accuracy: 91 },
                    { name: 'Trend Detection', status: 'operational', accuracy: 87 },
                    { name: 'Competitor Monitoring', status: 'operational', accuracy: 89 },
                    { name: 'Content Analysis', status: 'operational', accuracy: 96 }
                  ].map((system) => (
                    <div key={system.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="font-medium">{system.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{system.accuracy}%</span>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity & Recommendations</CardTitle>
              <CardDescription>Latest insights and recommended actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    type: 'insight',
                    title: 'User engagement shows strong upward trend',
                    description: 'AI detected 23% increase in user engagement over the past week',
                    priority: 'high',
                    action: 'Scale current content strategy'
                  },
                  {
                    type: 'prediction',
                    title: 'Revenue forecast updated',
                    description: 'Predictive model indicates 15% revenue growth next month',
                    priority: 'medium',
                    action: 'Prepare for increased demand'
                  },
                  {
                    type: 'competitor',
                    title: 'New competitor detected',
                    description: 'Emerging threat in the market with disruptive pricing strategy',
                    priority: 'high',
                    action: 'Analyze competitive response'
                  },
                  {
                    type: 'content',
                    title: 'Viral content opportunity identified',
                    description: 'Content type showing 3x higher viral potential than average',
                    priority: 'medium',
                    action: 'Increase content production'
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.type === 'insight' ? <Brain className="h-5 w-5" /> :
                         item.type === 'prediction' ? <Target className="h-5 w-5" /> :
                         item.type === 'competitor' ? <Shield className="h-5 w-5" /> :
                         <Rocket className="h-5 w-5" />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <Badge variant={item.priority === 'high' ? 'destructive' : 'secondary'}>
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                      <p className="text-xs font-medium text-blue-600">Recommended: {item.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

