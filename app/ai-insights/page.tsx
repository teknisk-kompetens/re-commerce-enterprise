
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Lightbulb,
  MessageCircle,
  FileText,
  Search,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AIInsightsPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeInsight, setActiveInsight] = useState<string | null>(null);

  const insights = [
    {
      id: 'predictive',
      title: 'Predictive Analytics',
      description: 'Forecast trends and identify opportunities',
      icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'anomaly',
      title: 'Anomaly Detection',
      description: 'Detect unusual patterns in your data',
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      color: 'bg-red-50 border-red-200'
    },
    {
      id: 'optimization',
      title: 'Performance Optimization',
      description: 'Recommendations to improve efficiency',
      icon: <Target className="h-6 w-6 text-green-500" />,
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'recommendations',
      title: 'Smart Recommendations',
      description: 'AI-driven suggestions for better outcomes',
      icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
      color: 'bg-yellow-50 border-yellow-200'
    }
  ];

  const handleAskAI = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setResponse('');
    
    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: query,
          context: 'enterprise-insights'
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get AI response');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

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
                setResponse(buffer);
                return;
              }
              try {
                const parsed = JSON.parse(data);
                buffer += parsed.content;
                setResponse(buffer);
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error asking AI:', error);
      setResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsight = async (type: string) => {
    setActiveInsight(type);
    setIsLoading(true);
    setResponse('');
    
    const prompts = {
      predictive: 'Analyze the current business trends and provide predictive insights for the next quarter. Focus on revenue growth, user engagement, and potential opportunities.',
      anomaly: 'Examine the recent data patterns and identify any anomalies or unusual trends that might require attention.',
      optimization: 'Provide recommendations for optimizing business performance, improving efficiency, and reducing costs.',
      recommendations: 'Generate actionable recommendations based on current business metrics and industry best practices.'
    };

    try {
      const res = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type,
          prompt: prompts[type as keyof typeof prompts],
          data: {
            // Sample business data
            revenue: 348000,
            users: 1520,
            efficiency: 98.5,
            completion: 94.2
          }
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate insight');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

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
                setResponse(buffer);
                return;
              }
              try {
                const parsed = JSON.parse(data);
                buffer += parsed.content;
                setResponse(buffer);
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating insight:', error);
      setResponse('Unable to generate insight at this time. Please try again.');
    } finally {
      setIsLoading(false);
      setActiveInsight(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">AI Insights</h1>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                DAG 3 AI
              </Badge>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Insight Types */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-500" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.map((insight) => (
                  <motion.div
                    key={insight.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${insight.color} ${
                      activeInsight === insight.id ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => generateInsight(insight.id)}
                  >
                    <div className="flex items-start space-x-3">
                      {insight.icon}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">AI Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Insights Generated</span>
                    <span className="text-sm font-semibold">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Accuracy Rate</span>
                    <span className="text-sm font-semibold">97.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm font-semibold">1.2s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Chat & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Chat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Ask AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Ask me anything about your business data, trends, or insights..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Button 
                    onClick={handleAskAI}
                    disabled={isLoading || !query.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Ask AI
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Response */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-500" />
                  AI Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-slate-50 to-purple-50 border border-purple-200 rounded-lg p-6 min-h-[400px]">
                  {response ? (
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-gray-800">{response}</div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <Brain className="h-16 w-16 mx-auto text-purple-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          AI Assistant Ready
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Choose an insight type or ask a specific question to get started
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <Badge variant="outline">Predictive Analytics</Badge>
                          <Badge variant="outline">Anomaly Detection</Badge>
                          <Badge variant="outline">Performance Optimization</Badge>
                          <Badge variant="outline">Smart Recommendations</Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
