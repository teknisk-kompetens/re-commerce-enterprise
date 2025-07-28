
/**
 * AI STUDIO
 * Revolutionary AI-powered automation and intelligence platform
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Bot, 
  Zap, 
  BarChart3, 
  MessageSquare,
  Cog,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Shield,
  Heart,
  Play,
  Pause,
  RefreshCw,
  Download,
  Upload,
  Settings,
  ChevronRight,
  Activity,
  Cpu,
  Database,
  LineChart,
  PieChart,
  Network,
  Layers,
  Rocket,
  Wand2,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface AIStudioData {
  automation: {
    activeWorkflows: number;
    totalOptimizations: number;
    efficiencyGain: number;
    status: 'running' | 'paused' | 'stopped';
  };
  intelligence: {
    insights: number;
    predictions: number;
    accuracy: number;
    trend: 'up' | 'down' | 'stable';
  };
  conversational: {
    totalConversations: number;
    languages: number;
    satisfaction: number;
    activeAgents: number;
  };
  mlops: {
    models: number;
    deployments: number;
    monitoring: number;
    experiments: number;
  };
  content: {
    generated: number;
    templates: number;
    personalization: number;
    engagement: number;
  };
  maintenance: {
    systems: number;
    healthScore: number;
    alerts: number;
    uptime: number;
  };
  customer: {
    segments: number;
    lifetime: number;
    churnPrevention: number;
    personalization: number;
  };
}

export default function AIStudioPage() {
  const [data, setData] = useState<AIStudioData>({
    automation: {
      activeWorkflows: 127,
      totalOptimizations: 543,
      efficiencyGain: 34.2,
      status: 'running'
    },
    intelligence: {
      insights: 892,
      predictions: 234,
      accuracy: 94.7,
      trend: 'up'
    },
    conversational: {
      totalConversations: 15623,
      languages: 24,
      satisfaction: 4.8,
      activeAgents: 12
    },
    mlops: {
      models: 45,
      deployments: 23,
      monitoring: 18,
      experiments: 67
    },
    content: {
      generated: 2341,
      templates: 89,
      personalization: 78.5,
      engagement: 23.4
    },
    maintenance: {
      systems: 156,
      healthScore: 97.3,
      alerts: 3,
      uptime: 99.94
    },
    customer: {
      segments: 12,
      lifetime: 2847,
      churnPrevention: 23.1,
      personalization: 87.2
    }
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [automationInput, setAutomationInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [streamingContent, setStreamingContent] = useState('');

  const handleAIRequest = async (endpoint: string, data: any, useStreaming = false) => {
    setIsProcessing(true);
    setResults(null);
    setStreamingContent('');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, streamResponse: useStreaming })
      });

      if (useStreaming) {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader?.read() || {};
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                if (buffer.trim()) {
                  try {
                    const finalResult = JSON.parse(buffer);
                    setResults(finalResult);
                  } catch (e) {
                    setResults({ content: buffer });
                  }
                }
                setIsProcessing(false);
                return;
              }
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  buffer += parsed.content;
                  setStreamingContent(buffer);
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      } else {
        const result = await response.json();
        setResults(result);
      }
    } catch (error) {
      console.error('AI request failed:', error);
      setResults({ error: 'Request failed' });
    } finally {
      setIsProcessing(false);
    }
  };

  const aiModules = [
    {
      id: 'automation',
      title: 'AI Automation Engine',
      icon: <Zap className="w-5 h-5" />,
      description: 'Intelligent workflow automation with machine learning',
      color: 'bg-blue-500',
      stats: [
        { label: 'Active Workflows', value: data.automation.activeWorkflows },
        { label: 'Optimizations', value: data.automation.totalOptimizations },
        { label: 'Efficiency Gain', value: `${data.automation.efficiencyGain}%` }
      ]
    },
    {
      id: 'intelligence',
      title: 'Cognitive Business Intelligence',
      icon: <Brain className="w-5 h-5" />,
      description: 'AI-powered insights and predictive analytics',
      color: 'bg-purple-500',
      stats: [
        { label: 'Insights Generated', value: data.intelligence.insights },
        { label: 'Predictions', value: data.intelligence.predictions },
        { label: 'Accuracy', value: `${data.intelligence.accuracy}%` }
      ]
    },
    {
      id: 'conversational',
      title: 'Conversational AI',
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'Advanced enterprise chatbots and voice assistants',
      color: 'bg-green-500',
      stats: [
        { label: 'Conversations', value: data.conversational.totalConversations },
        { label: 'Languages', value: data.conversational.languages },
        { label: 'Satisfaction', value: `${data.conversational.satisfaction}/5` }
      ]
    },
    {
      id: 'mlops',
      title: 'MLOps Pipeline',
      icon: <Cog className="w-5 h-5" />,
      description: 'Machine learning operations and model management',
      color: 'bg-orange-500',
      stats: [
        { label: 'Models', value: data.mlops.models },
        { label: 'Deployments', value: data.mlops.deployments },
        { label: 'Experiments', value: data.mlops.experiments }
      ]
    },
    {
      id: 'content',
      title: 'Content Generation',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'AI-powered content creation and personalization',
      color: 'bg-pink-500',
      stats: [
        { label: 'Generated', value: data.content.generated },
        { label: 'Templates', value: data.content.templates },
        { label: 'Engagement', value: `+${data.content.engagement}%` }
      ]
    },
    {
      id: 'maintenance',
      title: 'Predictive Maintenance',
      icon: <Heart className="w-5 h-5" />,
      description: 'AI-powered system health and predictive maintenance',
      color: 'bg-red-500',
      stats: [
        { label: 'Systems', value: data.maintenance.systems },
        { label: 'Health Score', value: `${data.maintenance.healthScore}%` },
        { label: 'Uptime', value: `${data.maintenance.uptime}%` }
      ]
    },
    {
      id: 'customer',
      title: 'Customer Intelligence',
      icon: <Users className="w-5 h-5" />,
      description: 'AI-powered customer behavior analysis and personalization',
      color: 'bg-cyan-500',
      stats: [
        { label: 'Segments', value: data.customer.segments },
        { label: 'Lifetime Value', value: `$${data.customer.lifetime}` },
        { label: 'Personalization', value: `${data.customer.personalization}%` }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AI Studio</h1>
              <p className="text-gray-600">Revolutionary AI-powered automation and intelligence platform</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              All Systems Operational
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
              <Rocket className="w-3 h-3 mr-1" />
              {data.automation.activeWorkflows} Active Workflows
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
              <TrendingUp className="w-3 h-3 mr-1" />
              {data.intelligence.accuracy}% Accuracy
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
            <TabsTrigger value="conversational">Conversational</TabsTrigger>
            <TabsTrigger value="mlops">MLOps</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {aiModules.map((module) => (
                <Card key={module.id} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 ${module.color} rounded-lg flex items-center justify-center text-white`}>
                        {module.icon}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {module.stats.map((stat, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-600">{stat.label}</span>
                          <span className="font-medium">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5" />
                    Quick AI Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAIRequest('/api/ai-automation', { action: 'workflow_optimization', data: { workflows: 'active' } })}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Optimize Workflows
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAIRequest('/api/ai-insights', { analysisType: 'business_intelligence', data: { period: '30d' } })}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate Business Insights
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAIRequest('/api/ai-predictions', { predictionType: 'performance_prediction', timeframe: '7d', data: { systems: 'all' } })}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Predict Performance
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Health</span>
                      <span className="font-medium">{data.maintenance.healthScore}%</span>
                    </div>
                    <Progress value={data.maintenance.healthScore} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>AI Accuracy</span>
                      <span className="font-medium">{data.intelligence.accuracy}%</span>
                    </div>
                    <Progress value={data.intelligence.accuracy} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>System Uptime</span>
                      <span className="font-medium">{data.maintenance.uptime}%</span>
                    </div>
                    <Progress value={data.maintenance.uptime} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Workflow Automation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="automation-input">Describe your automation needs</Label>
                    <Textarea
                      id="automation-input"
                      placeholder="e.g., Automate customer onboarding process with email notifications and task assignments"
                      value={automationInput}
                      onChange={(e) => setAutomationInput(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleAIRequest('/api/ai-automation', { action: 'workflow_optimization', data: { description: automationInput } })}
                      disabled={isProcessing || !automationInput}
                      className="flex-1"
                    >
                      {isProcessing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
                      Generate Automation
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleAIRequest('/api/ai-automation', { action: 'process_mining', data: { description: automationInput } })}
                      disabled={isProcessing || !automationInput}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Analyze Process
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Automation Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{data.automation.activeWorkflows}</div>
                      <div className="text-sm text-gray-600">Active Workflows</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{data.automation.efficiencyGain}%</div>
                      <div className="text-sm text-gray-600">Efficiency Gain</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Automation Success Rate</span>
                      <span className="font-medium">96.3%</span>
                    </div>
                    <Progress value={96.3} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Process Optimization</span>
                      <span className="font-medium">87.1%</span>
                    </div>
                    <Progress value={87.1} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Display */}
            {(results || streamingContent) && (
              <Card className="border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI Automation Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                    {streamingContent && (
                      <div className="whitespace-pre-wrap text-sm">
                        {streamingContent}
                        {isProcessing && <span className="animate-pulse">▊</span>}
                      </div>
                    )}
                    {results && (
                      <pre className="whitespace-pre-wrap text-sm">
                        {JSON.stringify(results, null, 2)}
                      </pre>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Intelligence Tab */}
          <TabsContent value="intelligence" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Business Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAIRequest('/api/ai-insights', { analysisType: 'business_intelligence', data: { period: '30d' } })}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate BI Report
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAIRequest('/api/ai-insights', { analysisType: 'performance_analytics', data: { systems: 'all' } })}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Performance Analysis
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAIRequest('/api/ai-insights', { analysisType: 'predictive_analytics', data: { timeframe: '90d' } })}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Predictive Analytics
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{data.intelligence.insights}</div>
                    <div className="text-sm text-gray-600">Generated Insights</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{data.intelligence.predictions}</div>
                    <div className="text-sm text-gray-600">Predictions Made</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{data.intelligence.accuracy}%</div>
                    <div className="text-sm text-gray-600">Accuracy Rate</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 bg-white/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    AI Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAIRequest('/api/ai-predictions', { predictionType: 'revenue_forecast', timeframe: '30d', data: { historical: 'data' } })}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Revenue Forecast
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAIRequest('/api/ai-predictions', { predictionType: 'customer_churn', timeframe: '90d', data: { customers: 'all' } })}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Churn Prediction
                  </Button>
                  <Button 
                    className="w-full justify-start" 
                    variant="outline"
                    onClick={() => handleAIRequest('/api/ai-predictions', { predictionType: 'demand_forecasting', timeframe: '60d', data: { products: 'all' } })}
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Demand Forecast
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Conversational Tab */}
          <TabsContent value="conversational" className="space-y-6">
            <ConversationalAIInterface />
          </TabsContent>

          {/* MLOps Tab */}
          <TabsContent value="mlops" className="space-y-6">
            <MLOpsInterface />
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <ContentGenerationInterface />
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <PredictiveMaintenanceInterface />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Conversational AI Interface Component
function ConversationalAIInterface() {
  const [message, setMessage] = useState('');
  const [conversationType, setConversationType] = useState('business_consultant');
  const [conversation, setConversation] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsProcessing(true);

    try {
      const response = await fetch('/api/ai-conversational', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationType,
          userHistory: conversation.slice(-10)
        })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      while (true) {
        const { done, value } = await reader?.read() || {};
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setConversation(prev => [...prev, { role: 'assistant', content: aiResponse }]);
              setIsProcessing(false);
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                aiResponse += parsed.content;
                setConversation(prev => {
                  const newConv = [...prev];
                  const lastMessage = newConv[newConv.length - 1];
                  if (lastMessage?.role === 'assistant') {
                    lastMessage.content = aiResponse;
                  } else {
                    newConv.push({ role: 'assistant', content: aiResponse });
                  }
                  return newConv;
                });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Conversation error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="border-0 bg-white/70 backdrop-blur-sm h-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              AI Conversation
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {conversation.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Thinking...
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask your AI assistant anything..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={isProcessing || !message.trim()}>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI Assistant Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select value={conversationType} onValueChange={setConversationType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business_consultant">Business Consultant</SelectItem>
                <SelectItem value="technical_support">Technical Support</SelectItem>
                <SelectItem value="data_analyst">Data Analyst</SelectItem>
                <SelectItem value="project_manager">Project Manager</SelectItem>
                <SelectItem value="sales_support">Sales Support</SelectItem>
                <SelectItem value="customer_success">Customer Success</SelectItem>
              </SelectContent>
            </Select>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Active Agents</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span>Languages</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span>Satisfaction</span>
                <span className="font-medium">4.8/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// MLOps Interface Component
function MLOpsInterface() {
  const [mlAction, setMlAction] = useState('model_evaluation');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleMLOpsAction = async () => {
    setIsProcessing(true);
    setResults(null);

    try {
      const response = await fetch('/api/ml-ops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: mlAction,
          data: { models: 'all', metrics: 'comprehensive' }
        })
      });

      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('MLOps error:', error);
      setResults({ error: 'MLOps request failed' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cog className="w-5 h-5" />
            MLOps Operations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select MLOps Action</Label>
            <Select value={mlAction} onValueChange={setMlAction}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="model_evaluation">Model Evaluation</SelectItem>
                <SelectItem value="model_monitoring">Model Monitoring</SelectItem>
                <SelectItem value="feature_engineering">Feature Engineering</SelectItem>
                <SelectItem value="deployment_pipeline">Deployment Pipeline</SelectItem>
                <SelectItem value="model_optimization">Model Optimization</SelectItem>
                <SelectItem value="experiment_tracking">Experiment Tracking</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleMLOpsAction} disabled={isProcessing} className="w-full">
            {isProcessing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            Execute MLOps Action
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            MLOps Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">45</div>
              <div className="text-sm text-gray-600">Models</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">23</div>
              <div className="text-sm text-gray-600">Deployments</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Model Accuracy</span>
              <span className="font-medium">94.2%</span>
            </div>
            <Progress value={94.2} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Deployment Success</span>
              <span className="font-medium">98.7%</span>
            </div>
            <Progress value={98.7} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="md:col-span-2">
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                MLOps Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Content Generation Interface Component
function ContentGenerationInterface() {
  const [contentType, setContentType] = useState('business_report');
  const [requirements, setRequirements] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleContentGeneration = async () => {
    if (!requirements.trim()) return;

    setIsProcessing(true);
    setGeneratedContent('');

    try {
      const response = await fetch('/api/ai-content-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          requirements,
          streamResponse: true
        })
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let content = '';

      while (true) {
        const { done, value } = await reader?.read() || {};
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsProcessing(false);
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                content += parsed.content;
                setGeneratedContent(content);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Content generation error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Content Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Content Type</Label>
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business_report">Business Report</SelectItem>
                <SelectItem value="marketing_content">Marketing Content</SelectItem>
                <SelectItem value="technical_documentation">Technical Documentation</SelectItem>
                <SelectItem value="presentation_content">Presentation Content</SelectItem>
                <SelectItem value="email_templates">Email Templates</SelectItem>
                <SelectItem value="social_media">Social Media</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Requirements</Label>
            <Textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Describe what content you need..."
              className="min-h-[100px]"
            />
          </div>
          <Button onClick={handleContentGeneration} disabled={isProcessing || !requirements.trim()} className="w-full">
            {isProcessing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
            Generate Content
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generated Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg h-80 overflow-y-auto">
            {generatedContent ? (
              <div className="whitespace-pre-wrap text-sm">
                {generatedContent}
                {isProcessing && <span className="animate-pulse">▊</span>}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">Generated content will appear here...</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Predictive Maintenance Interface Component
function PredictiveMaintenanceInterface() {
  const [maintenanceType, setMaintenanceType] = useState('system_health');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleMaintenanceAnalysis = async () => {
    setIsProcessing(true);
    setResults(null);

    try {
      const response = await fetch('/api/ai-predictive-maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maintenanceType,
          systemData: { systems: 'all', metrics: 'comprehensive' }
        })
      });

      const result = await response.json();
      setResults(result);
    } catch (error) {
      console.error('Predictive maintenance error:', error);
      setResults({ error: 'Predictive maintenance request failed' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Predictive Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Analysis Type</Label>
            <Select value={maintenanceType} onValueChange={setMaintenanceType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system_health">System Health</SelectItem>
                <SelectItem value="failure_prediction">Failure Prediction</SelectItem>
                <SelectItem value="anomaly_detection">Anomaly Detection</SelectItem>
                <SelectItem value="maintenance_scheduling">Maintenance Scheduling</SelectItem>
                <SelectItem value="performance_optimization">Performance Optimization</SelectItem>
                <SelectItem value="self_healing">Self-Healing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleMaintenanceAnalysis} disabled={isProcessing} className="w-full">
            {isProcessing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Heart className="w-4 h-4 mr-2" />}
            Run Analysis
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">97.3%</div>
              <div className="text-sm text-gray-600">Health Score</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Active Alerts</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>System Uptime</span>
              <span className="font-medium">99.94%</span>
            </div>
            <Progress value={99.94} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Maintenance Efficiency</span>
              <span className="font-medium">91.2%</span>
            </div>
            <Progress value={91.2} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="md:col-span-2">
          <Card className="border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Maintenance Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm">
                  {JSON.stringify(results, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
