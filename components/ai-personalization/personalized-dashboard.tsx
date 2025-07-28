
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Sparkles, 
  Eye,
  Clock,
  BarChart3,
  Lightbulb,
  PersonStanding,
  Zap,
  Star,
  ArrowRight,
  Settings,
  Shield,
  Activity
} from 'lucide-react';

interface PersonalizationProfile {
  id: string;
  userId: string;
  primarySegment: string;
  userLifecycleStage: string;
  engagementScore: number;
  churnProbability: number;
  lifetimeValueTier: string;
  modelConfidence: number;
  personalizationLevel: string;
  privacyLevel: string;
}

interface PersonalizedRecommendation {
  id: string;
  title: string;
  description: string;
  recommendationType: string;
  confidenceScore: number;
  relevanceScore: number;
  priority: number;
  context: any;
}

interface PersonalizedDashboardProps {
  userId: string;
  tenantId: string;
  className?: string;
}

export default function PersonalizedDashboard({ 
  userId, 
  tenantId, 
  className = "" 
}: PersonalizedDashboardProps) {
  const [profile, setProfile] = useState<PersonalizationProfile | null>(null);
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [context, setContext] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [personalizations, setPersonalizations] = useState<any[]>([]);

  useEffect(() => {
    loadPersonalizationData();
    initializePersonalizationContext();
  }, [userId, tenantId]);

  const loadPersonalizationData = async () => {
    try {
      setLoading(true);

      // Load profile with relations
      const profileResponse = await fetch(
        `/api/ai-personalization/profile-management?userId=${userId}&tenantId=${tenantId}&include=true`
      );
      const profileData = await profileResponse.json();

      if (profileData.success) {
        setProfile(profileData.profile);
      }

      // Load AI recommendations
      const recommendationsResponse = await fetch(
        `/api/ai-personalization/recommendations?userId=${userId}&tenantId=${tenantId}&limit=8`
      );
      const recommendationsData = await recommendationsResponse.json();

      if (recommendationsData.success) {
        setRecommendations(recommendationsData.recommendations || []);
      }

      // Load ML insights
      const insightsResponse = await fetch(
        `/api/ai-personalization/ml-insights?userId=${userId}&tenantId=${tenantId}&type=all`
      );
      const insightsData = await insightsResponse.json();

      if (insightsData.success) {
        setInsights(insightsData.insights);
      }

    } catch (error) {
      console.error('Failed to load personalization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializePersonalizationContext = async () => {
    try {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const contextResponse = await fetch('/api/ai-personalization/context', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId,
          pageUrl: window?.location?.href,
          userAgent: navigator?.userAgent,
          deviceType: getDeviceType(),
          initialContext: { tenantId }
        })
      });

      const contextData = await contextResponse.json();
      if (contextData.success) {
        setContext(contextData.context);
      }
    } catch (error) {
      console.error('Failed to initialize personalization context:', error);
    }
  };

  const trackRecommendationInteraction = async (
    recommendationId: string, 
    interactionType: string,
    feedback?: string
  ) => {
    try {
      await fetch('/api/ai-personalization/recommendations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendationId,
          interactionType,
          feedback,
          context: { sessionId: context?.sessionId }
        })
      });

      // Reload recommendations to get updated data
      const response = await fetch(
        `/api/ai-personalization/recommendations?userId=${userId}&tenantId=${tenantId}&limit=8`
      );
      const data = await response.json();
      if (data.success) {
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Failed to track recommendation interaction:', error);
    }
  };

  const generateNewRecommendations = async () => {
    try {
      const response = await fetch('/api/ai-personalization/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          tenantId,
          recommendationType: "all",
          context: {
            currentPage: window?.location?.pathname,
            timestamp: new Date().toISOString()
          },
          triggerEvent: "manual_refresh",
          placementLocation: "dashboard_main"
        })
      });

      const data = await response.json();
      if (data.success) {
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Failed to generate new recommendations:', error);
    }
  };

  const getSegmentColor = (segment: string) => {
    const colors = {
      'power_user': 'bg-purple-500',
      'enterprise_user': 'bg-blue-500',
      'casual_user': 'bg-green-500',
      'new_user': 'bg-yellow-500',
      'at_risk_user': 'bg-red-500',
      'churned_user': 'bg-gray-500'
    };
    return colors[segment as keyof typeof colors] || 'bg-gray-400';
  };

  const getLifecycleIcon = (stage: string) => {
    const icons = {
      'new': PersonStanding,
      'active': Activity,
      'engaged': TrendingUp,
      'power': Star,
      'at_risk': Shield,
      'dormant': Clock,
      'churned': Eye
    };
    return icons[stage as keyof typeof icons] || PersonStanding;
  };

  const getEngagementLevel = (score: number) => {
    if (score >= 0.8) return { level: "Very High", color: "text-green-600" };
    if (score >= 0.6) return { level: "High", color: "text-blue-600" };
    if (score >= 0.4) return { level: "Medium", color: "text-yellow-600" };
    if (score >= 0.2) return { level: "Low", color: "text-orange-600" };
    return { level: "Very Low", color: "text-red-600" };
  };

  const getDeviceType = () => {
    const width = window?.innerWidth || 1024;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const engagement = profile ? getEngagementLevel(profile.engagementScore) : { level: "Unknown", color: "text-gray-500" };
  const LifecycleIcon = profile ? getLifecycleIcon(profile.userLifecycleStage) : PersonStanding;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AI Personalization Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-white/20 p-2">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI-Powered Personalization</h2>
                <p className="text-blue-100">Tailored experience powered by machine learning</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Model Confidence</div>
              <div className="text-2xl font-bold">{Math.round((profile?.modelConfidence || 0) * 100)}%</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-white/5"></div>
      </motion.div>

      {/* User Profile Overview */}
      {profile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span>Personalization Profile</span>
              </CardTitle>
              <CardDescription>
                AI-analyzed user characteristics and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Segment & Lifecycle */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`${getSegmentColor(profile.primarySegment)} text-white`}>
                        {profile.primarySegment.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <LifecycleIcon className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-600 capitalize">
                        {profile.userLifecycleStage.replace('_', ' ')} Stage
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Value Tier</div>
                    <Badge variant="outline" className="capitalize">
                      {profile.lifetimeValueTier}
                    </Badge>
                  </div>
                </div>

                {/* Engagement Metrics */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Engagement Score</span>
                      <span className={`text-sm font-medium ${engagement.color}`}>
                        {engagement.level}
                      </span>
                    </div>
                    <Progress value={profile.engagementScore * 100} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Churn Risk</span>
                      <span className="text-sm font-medium">
                        {Math.round(profile.churnProbability * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={profile.churnProbability * 100} 
                      className="h-2"
                      // Invert color scheme for risk
                      style={{ 
                        backgroundColor: profile.churnProbability > 0.7 ? '#fef2f2' : 
                                       profile.churnProbability > 0.3 ? '#fffbeb' : '#f0fdf4' 
                      }}
                    />
                  </div>
                </div>

                {/* Personalization Settings */}
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Personalization Level</div>
                    <Badge variant="outline" className="capitalize">
                      {profile.personalizationLevel}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Privacy Level</div>
                    <Badge variant="outline" className="capitalize">
                      {profile.privacyLevel}
                    </Badge>
                  </div>
                  
                  <Button variant="outline" size="sm" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Customize Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="insights">ML Insights</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  <span>Personalized Quick Actions</span>
                </CardTitle>
                <CardDescription>
                  AI-recommended actions based on your behavior patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recommendations.slice(0, 4).map((rec) => (
                    <motion.div
                      key={rec.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                      onClick={() => trackRecommendationInteraction(rec.id, "click")}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-blue-600" />
                        <Badge variant="outline" className="text-xs">
                          {Math.round(rec.confidenceScore * 100)}% match
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{rec.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2">{rec.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Context Information */}
          {context && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <span>Real-time Context</span>
                  </CardTitle>
                  <CardDescription>
                    Current session insights and predictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {context.pageViews || 0}
                      </div>
                      <div className="text-sm text-blue-700">Page Views</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {context.engagementLevel || 'Normal'}
                      </div>
                      <div className="text-sm text-green-700">Engagement</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.round((context.conversionProbability || 0) * 100)}%
                      </div>
                      <div className="text-sm text-purple-700">Conversion Probability</div>
                    </div>
                  </div>
                  
                  {context.inferredIntent && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Inferred Intent</div>
                      <div className="font-medium capitalize">
                        {context.inferredIntent.replace('_', ' ')}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      <span>AI-Powered Recommendations</span>
                    </CardTitle>
                    <CardDescription>
                      Personalized suggestions based on your behavior and preferences
                    </CardDescription>
                  </div>
                  <Button onClick={generateNewRecommendations} variant="outline">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {recommendations.map((rec, index) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.1 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge className="text-xs">
                                {rec.recommendationType.replace('_', ' ')}
                              </Badge>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-500" />
                                <span className="text-xs text-gray-600">
                                  {Math.round(rec.relevanceScore * 100)}% relevant
                                </span>
                              </div>
                            </div>
                            <h4 className="font-medium mb-1">{rec.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{rec.description}</p>
                            
                            {rec.context && rec.context.reasoning && (
                              <div className="text-xs text-gray-500 mb-3">
                                <strong>Why this matters:</strong> {rec.context.reasoning}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex space-x-2 ml-4">
                            <Button
                              size="sm"
                              onClick={() => trackRecommendationInteraction(rec.id, "click", "positive")}
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => trackRecommendationInteraction(rec.id, "dismiss", "negative")}
                            >
                              Dismiss
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Confidence: {Math.round(rec.confidenceScore * 100)}%</span>
                            <span>Priority: {rec.priority}/100</span>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => trackRecommendationInteraction(rec.id, "feedback", "helpful")}
                            >
                              👍 Helpful
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => trackRecommendationInteraction(rec.id, "feedback", "not_helpful")}
                            >
                              👎 Not helpful
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {recommendations.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No recommendations available yet.</p>
                      <p className="text-sm">Continue using the platform to receive personalized suggestions.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {insights && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                    <span>Machine Learning Insights</span>
                  </CardTitle>
                  <CardDescription>
                    Advanced AI analysis of your behavior patterns and predictions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Behavior Predictions */}
                    {insights.behaviorPredictions && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <span>Behavior Predictions</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm text-blue-700 mb-1">Next Actions</div>
                            <div className="text-blue-900">
                              {insights.behaviorPredictions.nextActions?.join(', ') || 'Analyzing...'}
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <div className="text-sm text-green-700 mb-1">Conversion Probability</div>
                            <div className="text-green-900 font-medium">
                              {Math.round((insights.behaviorPredictions.conversionProbability || 0) * 100)}%
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Key Insights */}
                    {insights.keyInsights && insights.keyInsights.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center space-x-2">
                          <Lightbulb className="h-4 w-4 text-yellow-600" />
                          <span>Key Insights</span>
                        </h4>
                        <div className="space-y-2">
                          {insights.keyInsights.map((insight: string, index: number) => (
                            <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-sm text-gray-700">{insight}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actionable Recommendations */}
                    {insights.actionableRecommendations && insights.actionableRecommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center space-x-2">
                          <Target className="h-4 w-4 text-purple-600" />
                          <span>Actionable Recommendations</span>
                        </h4>
                        <div className="space-y-2">
                          {insights.actionableRecommendations.map((rec: string, index: number) => (
                            <div key={index} className="flex items-start space-x-2 p-3 bg-purple-50 rounded-lg">
                              <ArrowRight className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-purple-900">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-teal-600" />
                  <span>Personalization Analytics</span>
                </CardTitle>
                <CardDescription>
                  Track the effectiveness of AI-powered personalization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-teal-50 rounded-lg">
                    <div className="text-2xl font-bold text-teal-600">
                      {profile?.trainingDataPoints || 0}
                    </div>
                    <div className="text-sm text-teal-700">Data Points</div>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {recommendations.length}
                    </div>
                    <div className="text-sm text-blue-700">Active Recommendations</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round((profile?.personalizationROI || 0) * 100)}%
                    </div>
                    <div className="text-sm text-purple-700">Personalization ROI</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {profile?.modelVersion || "1.0"}
                    </div>
                    <div className="text-sm text-green-700">Model Version</div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Personalization Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Model Accuracy</span>
                      <span className="font-medium">{Math.round((profile?.modelConfidence || 0) * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Adaptation Speed</span>
                      <span className="font-medium">{Math.round((profile?.adaptationSpeed || 0) * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Privacy Compliance</span>
                      <span className="font-medium text-green-600">✓ Compliant</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
