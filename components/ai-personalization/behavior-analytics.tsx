
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Eye, 
  Clock,
  MousePointer,
  Navigation,
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Map,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface BehaviorEvent {
  id: string;
  eventType: string;
  eventCategory: string;
  element?: string;
  pageUrl?: string;
  timeSpent?: number;
  createdAt: string;
  eventData: any;
}

interface BehaviorAnalytics {
  summary: string;
  patterns: string[];
  insights: string[];
  recommendations: string[];
  engagementLevel: string;
  churnRisk: number;
  conversionProbability: number;
}

interface BehaviorAnalyticsProps {
  userId: string;
  tenantId: string;
  className?: string;
}

export default function BehaviorAnalytics({ 
  userId, 
  tenantId, 
  className = "" 
}: BehaviorAnalyticsProps) {
  const [events, setEvents] = useState<BehaviorEvent[]>([]);
  const [analytics, setAnalytics] = useState<BehaviorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    loadBehaviorData();
  }, [userId, tenantId, timeRange]);

  const loadBehaviorData = async () => {
    try {
      setLoading(true);
      
      // Load behavior events
      const eventsResponse = await fetch(
        `/api/ai-personalization/behavior-tracking?userId=${userId}&limit=100`
      );
      const eventsData = await eventsResponse.json();

      if (eventsData.success) {
        setEvents(eventsData.events || []);
        setAnalytics(eventsData.behaviorAnalysis);
      }
    } catch (error) {
      console.error('Failed to load behavior data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = async () => {
    try {
      setLoading(true);
      
      // Trigger AI analysis
      const response = await fetch('/api/ai-personalization/behavior-tracking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          tenantId,
          sessionId: `analysis_${Date.now()}`,
          events: events.slice(0, 20).map(e => ({
            eventType: e.eventType,
            eventCategory: e.eventCategory,
            element: e.element,
            timeSpent: e.timeSpent,
            eventData: e.eventData
          }))
        })
      });

      const data = await response.json();
      if (data.success) {
        setAnalytics(data.behaviorAnalysis);
      }
    } catch (error) {
      console.error('Failed to refresh analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process data for charts
  const getEventsByHour = () => {
    const hourly = new Array(24).fill(0).map((_, i) => ({
      hour: i,
      events: 0,
      name: `${i}:00`
    }));

    events.forEach(event => {
      const hour = new Date(event.createdAt).getHours();
      hourly[hour].events++;
    });

    return hourly;
  };

  const getEventsByType = () => {
    const types = events.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(types).map(([type, count]) => ({
      name: type.replace('_', ' '),
      value: count,
      percentage: ((count / events.length) * 100).toFixed(1)
    }));
  };

  const getEventsByCategory = () => {
    const categories = events.reduce((acc, event) => {
      acc[event.eventCategory] = (acc[event.eventCategory] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([category, count]) => ({
      name: category.replace('_', ' '),
      value: count
    }));
  };

  const getEngagementTrend = () => {
    const days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayEvents = events.filter(e => {
        const eventDate = new Date(e.createdAt);
        return eventDate.toDateString() === date.toDateString();
      });
      
      const avgTimeSpent = dayEvents.reduce((sum, e) => sum + (e.timeSpent || 0), 0) / (dayEvents.length || 1);
      
      days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        events: dayEvents.length,
        avgTime: Math.round(avgTimeSpent / 1000), // Convert to seconds
        engagement: dayEvents.length > 0 ? Math.min(dayEvents.length * 10, 100) : 0
      });
    }
    
    return days;
  };

  const colors = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3', '#72BF78'];

  if (loading && events.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-lg bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-6 text-white"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-white/20 p-2">
                <Activity className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">User Behavior Analytics</h2>
                <p className="text-blue-100">AI-powered insights into user interaction patterns</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={refreshAnalytics}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Analysis
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MousePointer className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{events.length}</div>
                <div className="text-sm text-gray-600">Total Events</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold capitalize">
                  {analytics?.engagementLevel || 'Analyzing'}
                </div>
                <div className="text-sm text-gray-600">Engagement Level</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round((analytics?.churnRisk || 0) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Churn Risk</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round((analytics?.conversionProbability || 0) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Conversion Probability</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Engagement Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <LineChart className="h-5 w-5 text-blue-600" />
                  <span>7-Day Engagement Trend</span>
                </CardTitle>
                <CardDescription>
                  Daily event activity and engagement patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getEngagementTrend()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="events"
                        stroke={colors[0]}
                        fill={colors[0]}
                        fillOpacity={0.6}
                        name="Events"
                      />
                      <Area
                        type="monotone"
                        dataKey="engagement"
                        stroke={colors[1]}
                        fill={colors[1]}
                        fillOpacity={0.3}
                        name="Engagement Score"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Event Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5 text-green-600" />
                    <span>Event Types</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          dataKey="value"
                          data={getEventsByType()}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percentage }) => `${name}: ${percentage}%`}
                        >
                          {getEventsByType().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
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
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <span>Activity by Hour</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getEventsByHour()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="events" fill={colors[2]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          {analytics?.patterns && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-indigo-600" />
                    <span>Identified Behavior Patterns</span>
                  </CardTitle>
                  <CardDescription>
                    AI-detected patterns in user behavior
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.patterns.map((pattern, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3 p-4 bg-indigo-50 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-indigo-900">{pattern}</p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Event Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Navigation className="h-5 w-5 text-teal-600" />
                  <span>Event Categories</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getEventsByCategory().map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{category.name}</span>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={(category.value / events.length) * 100} 
                          className="w-24 h-2" 
                        />
                        <span className="text-sm text-gray-600 w-8">{category.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {analytics && (
            <>
              {/* AI Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <span>AI Analysis Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-purple-900">{analytics.summary}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Insights & Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Eye className="h-5 w-5 text-blue-600" />
                        <span>Key Insights</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics.insights?.map((insight, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">{insight}</p>
                          </div>
                        ))}
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
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-orange-600" />
                        <span>Recommendations</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics.recommendations?.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-gray-700">{rec}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span>Recent Activity Timeline</span>
                </CardTitle>
                <CardDescription>
                  Chronological view of user interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {events.slice(0, 20).map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start space-x-3 p-3 border-l-2 border-blue-200 bg-gray-50 rounded-r-lg"
                    >
                      <div className="flex-shrink-0">
                        <Badge variant="outline" className="text-xs">
                          {event.eventType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {event.eventCategory.replace('_', ' ')}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(event.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                        {event.element && (
                          <p className="text-xs text-gray-600 mt-1">
                            Element: {event.element}
                          </p>
                        )}
                        {event.pageUrl && (
                          <p className="text-xs text-gray-600 truncate">
                            Page: {event.pageUrl}
                          </p>
                        )}
                        {event.timeSpent && event.timeSpent > 0 && (
                          <p className="text-xs text-gray-600">
                            Time spent: {Math.round(event.timeSpent / 1000)}s
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
