
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb,
  Target,
  BarChart3,
  RefreshCw,
  Download,
  Settings,
  ArrowRight,
  Zap,
  Activity,
  Users,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';

interface AiInsight {
  id: number;
  type: string;
  category: string;
  title: string;
  description: string;
  confidence: number;
  impact: string;
  status: string;
}

export default function AiAnalyticsPage() {
  const [insights, setInsights] = useState<AiInsight[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState('');

  // Sample data for charts
  const analyticsData = [
    { time: '00:00', users: 120, revenue: 1250, engagement: 78 },
    { time: '04:00', users: 89, revenue: 980, engagement: 65 },
    { time: '08:00', users: 245, revenue: 2890, engagement: 82 },
    { time: '12:00', users: 389, revenue: 4567, engagement: 91 },
    { time: '16:00', users: 567, revenue: 6789, engagement: 88 },
    { time: '20:00', users: 423, revenue: 5234, engagement: 85 },
  ];

  const predictiveData = [
    { month: 'Jan', actual: 45000, predicted: 46200 },
    { month: 'Feb', actual: 52000, predicted: 51800 },
    { month: 'Mar', actual: 48000, predicted: 48500 },
    { month: 'Apr', actual: 61000, predicted: 60200 },
    { month: 'May', actual: 55000, predicted: 56100 },
    { month: 'Jun', actual: 67000, predicted: 66800 },
    { month: 'Jul', actual: null, predicted: 72500 },
    { month: 'Aug', actual: null, predicted: 75200 },
  ];

  const insightCategories = [
    { name: 'Performance', value: 35, color: '#3B82F6' },
    { name: 'Security', value: 25, color: '#EF4444' },
    { name: 'Business', value: 28, color: '#10B981' },
    { name: 'User Behavior', value: 12, color: '#F59E0B' },
  ];

  const sampleInsights = [
    {
      id: 1,
      type: 'predictive',
      category: 'business',
      title: 'Revenue Growth Opportunity',
      description: 'AI detects 15% revenue increase potential through user engagement optimization',
      confidence: 0.89,
      impact: 'high',
      status: 'active'
    },
    {
      id: 2,
      type: 'optimization',
      category: 'performance',
      title: 'Database Query Optimization',
      description: 'Reduce response time by 40ms with index optimization on user queries',
      confidence: 0.92,
      impact: 'medium',
      status: 'active'
    },
    {
      id: 3,
      type: 'alert',
      category: 'security',
      title: 'Anomalous Login Pattern',
      description: 'Unusual login spikes from new geographic regions detected',
      confidence: 0.76,
      impact: 'high',
      status: 'active'
    }
  ];

  useEffect(() => {
    setInsights(sampleInsights);
  }, []);

  const generateRecommendations = async () => {
    setIsGenerating(true);
    setRecommendations('');

    try {
      const response = await fetch('/api/ai-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context: 'Enterprise analytics dashboard performance and user behavior analysis',
          dataPoints: analyticsData,
          analysisType: 'optimization'
        })
      });

      if (!response.ok) throw new Error('Failed to generate recommendations');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                setIsGenerating(false);
                return;
              }
              try {
                const parsed = JSON.parse(data);
                const content = parsed.content || '';
                if (content) {
                  setRecommendations(prev => prev + content);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">AI-Powered Analytics</h1>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                DAG 4 ENTERPRISE
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={generateRecommendations} disabled={isGenerating}>
                {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Brain className="h-4 w-4 mr-2" />}
                Generate AI Insights
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Report
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
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-purple-900">
                    Advanced AI Analytics & Intelligence
                  </CardTitle>
                  <p className="text-purple-700 mt-2">
                    Harness the power of artificial intelligence for predictive insights, optimization recommendations, and real-time analytics
                  </p>
                </div>
                <Brain className="h-12 w-12 text-purple-600" />
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* AI Insights Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: <Brain className="h-8 w-8 text-purple-500" />, title: "Active Insights", value: 12, change: "+3", color: "bg-purple-50 border-purple-200" },
            { icon: <TrendingUp className="h-8 w-8 text-green-500" />, title: "Predictions Made", value: 34, change: "+8", color: "bg-green-50 border-green-200" },
            { icon: <Target className="h-8 w-8 text-blue-500" />, title: "Accuracy Rate", value: "92.5%", change: "+2.1%", color: "bg-blue-50 border-blue-200" },
            { icon: <Zap className="h-8 w-8 text-yellow-500" />, title: "Optimizations", value: 8, change: "+5", color: "bg-yellow-50 border-yellow-200" }
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

        {/* Main Analytics Content */}
        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="analytics">Real-time Analytics</TabsTrigger>
            <TabsTrigger value="intelligence">Intelligence Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="insights">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* AI Insights List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                      Active AI Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {insights.map((insight, index) => (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 bg-gradient-to-r from-white to-gray-50 rounded-lg border hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}>
                              {insight.impact}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {Math.round(insight.confidence * 100)}% confidence
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {insight.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {insight.type}
                            </Badge>
                          </div>
                          <Button size="sm" variant="ghost">
                            View Details
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Insight Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                    Insight Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={insightCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {insightCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {insightCategories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{category.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictions">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                    Predictive Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={predictiveData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="actual" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                      <Area type="monotone" dataKey="predicted" stackId="2" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} strokeDasharray="5 5" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-500" />
                  AI-Generated Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recommendations ? (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                    <div className="whitespace-pre-wrap text-sm text-gray-700">
                      {recommendations}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Recommendations</h3>
                    <p className="text-gray-600 mb-6">Click "Generate AI Insights" to get personalized recommendations based on your data</p>
                    <Button onClick={generateRecommendations} disabled={isGenerating} className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                      {isGenerating ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Brain className="h-4 w-4 mr-2" />}
                      Generate AI Recommendations
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-blue-500" />
                    Real-time Analytics Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
                      <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="engagement" stroke="#F59E0B" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="intelligence">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-indigo-500" />
                    Intelligence Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">AI Processing Efficiency</span>
                      <span className="text-sm text-gray-600">94.2%</span>
                    </div>
                    <Progress value={94.2} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Prediction Accuracy</span>
                      <span className="text-sm text-gray-600">89.7%</span>
                    </div>
                    <Progress value={89.7} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Model Performance</span>
                      <span className="text-sm text-gray-600">96.1%</span>
                    </div>
                    <Progress value={96.1} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-green-500" />
                    Recent AI Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { time: '2 min ago', action: 'Generated performance optimization insights' },
                      { time: '15 min ago', action: 'Completed predictive analysis for Q4' },
                      { time: '1 hour ago', action: 'Detected anomaly in user behavior patterns' },
                      { time: '3 hours ago', action: 'Updated machine learning models' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
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
