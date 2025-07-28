
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Filter, 
  TrendingUp, 
  Star, 
  Sparkles, 
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Target,
  Lightbulb,
  Eye,
  BarChart3,
  Sliders,
  Search,
  ArrowRight,
  Clock,
  Zap
} from 'lucide-react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  recommendationType: string;
  recommendedItemId: string;
  recommendedItemType: string;
  algorithmUsed: string;
  confidenceScore: number;
  relevanceScore: number;
  diversityScore: number;
  noveltyScore: number;
  context: any;
  triggerEvent?: string;
  placementLocation?: string;
  priority: number;
  impressions: number;
  clicks: number;
  conversions: number;
  clickThroughRate: number;
  conversionRate: number;
  userFeedback?: string;
  status: string;
  createdAt: string;
}

interface RecommendationEngineProps {
  userId: string;
  tenantId: string;
  placement?: string;
  className?: string;
}

export default function RecommendationEngine({ 
  userId, 
  tenantId, 
  placement = "default",
  className = "" 
}: RecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [feedbackState, setFeedbackState] = useState<Record<string, string>>({});

  useEffect(() => {
    loadRecommendations();
  }, [userId, tenantId]);

  useEffect(() => {
    filterAndSortRecommendations();
  }, [recommendations, activeTab, searchQuery, filterType, sortBy]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/ai-personalization/recommendations?userId=${userId}&tenantId=${tenantId}&limit=20`
      );
      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async (type: string = "all", trigger: string = "manual") => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai-personalization/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          tenantId,
          recommendationType: type,
          context: {
            placement,
            timestamp: new Date().toISOString(),
            currentFilter: filterType,
            searchQuery
          },
          triggerEvent: trigger,
          placementLocation: placement
        })
      });

      const data = await response.json();
      if (data.success) {
        // Merge new recommendations with existing ones
        const newRecs = data.recommendations || [];
        setRecommendations(prev => {
          const combined = [...newRecs, ...prev];
          // Remove duplicates based on ID
          const unique = combined.filter((rec, index, arr) => 
            arr.findIndex(r => r.id === rec.id) === index
          );
          return unique;
        });
      }
    } catch (error) {
      console.error('Failed to generate recommendations:', error);
    } finally {
      setLoading(false);
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
          feedbackReason: feedback,
          context: {
            placement,
            timestamp: new Date().toISOString()
          }
        })
      });

      // Update local state
      setRecommendations(prev => prev.map(rec => {
        if (rec.id === recommendationId) {
          const updates: any = { ...rec };
          
          if (interactionType === "view") {
            updates.impressions = rec.impressions + 1;
          } else if (interactionType === "click") {
            updates.clicks = rec.clicks + 1;
            updates.clickThroughRate = (rec.clicks + 1) / Math.max(rec.impressions, 1);
          } else if (interactionType === "convert") {
            updates.conversions = rec.conversions + 1;
            updates.status = "converted";
          } else if (interactionType === "dismiss") {
            updates.status = "dismissed";
          }

          if (feedback) {
            updates.userFeedback = feedback;
            setFeedbackState(prev => ({ ...prev, [recommendationId]: feedback }));
          }

          return updates;
        }
        return rec;
      }));
    } catch (error) {
      console.error('Failed to track recommendation interaction:', error);
    }
  };

  const filterAndSortRecommendations = () => {
    let filtered = recommendations;

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(rec => rec.recommendationType === activeTab);
    }

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(rec => rec.recommendedItemType === filterType);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(rec => 
        rec.title.toLowerCase().includes(query) ||
        rec.description.toLowerCase().includes(query) ||
        rec.recommendationType.toLowerCase().includes(query)
      );
    }

    // Sort recommendations
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "relevance":
          return b.relevanceScore - a.relevanceScore;
        case "confidence":
          return b.confidenceScore - a.confidenceScore;
        case "priority":
          return b.priority - a.priority;
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "performance":
          return (b.clickThroughRate || 0) - (a.clickThroughRate || 0);
        default:
          return b.relevanceScore - a.relevanceScore;
      }
    });

    setFilteredRecommendations(filtered);
  };

  const getRecommendationIcon = (type: string) => {
    const icons = {
      'widget': Sliders,
      'content': Eye,
      'feature': Star,
      'action': Zap,
      'product': Target
    };
    return icons[type as keyof typeof icons] || Lightbulb;
  };

  const getAlgorithmBadgeColor = (algorithm: string) => {
    const colors = {
      'collaborative': 'bg-blue-500',
      'content_based': 'bg-green-500',
      'hybrid': 'bg-purple-500',
      'deep_learning': 'bg-red-500',
      'contextual_ai': 'bg-yellow-500',
      'ai_hybrid': 'bg-indigo-500'
    };
    return colors[algorithm as keyof typeof colors] || 'bg-gray-500';
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "text-green-600";
    if (score >= 0.6) return "text-blue-600";
    if (score >= 0.4) return "text-yellow-600";
    return "text-gray-600";
  };

  const getUniqueTypes = () => {
    const types = [...new Set(recommendations.map(rec => rec.recommendationType))];
    return types;
  };

  if (loading && recommendations.length === 0) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
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
        className="relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-6 text-white"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-white/20 p-2">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">AI Recommendation Engine</h2>
                <p className="text-blue-100">Intelligent suggestions powered by machine learning</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => generateRecommendations("all", "refresh")}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => generateRecommendations("contextual", "generate_new")}
                disabled={loading}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate New
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search recommendations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Type Filter</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="widget">Widgets</SelectItem>
                    <SelectItem value="feature">Features</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="action">Actions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Relevance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="confidence">Confidence</SelectItem>
                    <SelectItem value="priority">Priority</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Quick Actions</label>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateRecommendations("widget", "widget_focus")}
                  >
                    Widgets
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateRecommendations("feature", "feature_focus")}
                  >
                    Features
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({recommendations.length})</TabsTrigger>
          {getUniqueTypes().slice(0, 5).map(type => {
            const count = recommendations.filter(rec => rec.recommendationType === type).length;
            return (
              <TabsTrigger key={type} value={type} className="capitalize">
                {type.replace('_', ' ')} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <AnimatePresence>
            {filteredRecommendations.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-500"
              >
                <Brain className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No recommendations found</h3>
                <p className="mb-4">Try adjusting your filters or generate new recommendations.</p>
                <Button onClick={() => generateRecommendations("all", "no_results")}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Recommendations
                </Button>
              </motion.div>
            ) : (
              filteredRecommendations.map((rec, index) => {
                const IconComponent = getRecommendationIcon(rec.recommendedItemType);
                
                return (
                  <motion.div
                    key={rec.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border rounded-lg p-6 hover:shadow-lg transition-all ${
                      rec.status === "dismissed" ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="rounded-full bg-blue-50 p-2">
                            <IconComponent className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              className={`${getAlgorithmBadgeColor(rec.algorithmUsed)} text-white text-xs`}
                            >
                              {rec.algorithmUsed.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {rec.recommendationType.replace('_', ' ')}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs text-gray-600">
                                {Math.round(rec.relevanceScore * 100)}% match
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-semibold mb-2">{rec.title}</h3>
                        <p className="text-gray-600 mb-4">{rec.description}</p>

                        {/* Context & Reasoning */}
                        {rec.context && rec.context.reasoning && (
                          <div className="bg-blue-50 rounded-lg p-3 mb-4">
                            <div className="flex items-start space-x-2">
                              <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-blue-900 mb-1">Why this recommendation?</div>
                                <p className="text-sm text-blue-800">{rec.context.reasoning}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Scores */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(rec.confidenceScore)}`}>
                              {Math.round(rec.confidenceScore * 100)}%
                            </div>
                            <div className="text-xs text-gray-500">Confidence</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(rec.relevanceScore)}`}>
                              {Math.round(rec.relevanceScore * 100)}%
                            </div>
                            <div className="text-xs text-gray-500">Relevance</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(rec.diversityScore)}`}>
                              {Math.round(rec.diversityScore * 100)}%
                            </div>
                            <div className="text-xs text-gray-500">Diversity</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-lg font-bold ${getScoreColor(rec.noveltyScore)}`}>
                              {Math.round(rec.noveltyScore * 100)}%
                            </div>
                            <div className="text-xs text-gray-500">Novelty</div>
                          </div>
                        </div>

                        {/* Performance Metrics */}
                        {(rec.impressions > 0 || rec.clicks > 0) && (
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{rec.impressions} views</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <TrendingUp className="h-3 w-3" />
                              <span>{rec.clicks} clicks</span>
                            </div>
                            {rec.clickThroughRate > 0 && (
                              <div className="flex items-center space-x-1">
                                <BarChart3 className="h-3 w-3" />
                                <span>{Math.round(rec.clickThroughRate * 100)}% CTR</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2 ml-6">
                        <Button
                          onClick={() => trackRecommendationInteraction(rec.id, "click")}
                          disabled={rec.status === "dismissed"}
                          className="min-w-[120px]"
                        >
                          <ArrowRight className="h-4 w-4 mr-2" />
                          Try It
                        </Button>
                        
                        {rec.status !== "dismissed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => trackRecommendationInteraction(rec.id, "dismiss")}
                          >
                            Dismiss
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Feedback Section */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>Priority: {rec.priority}/100</span>
                        {rec.triggerEvent && (
                          <>
                            <span>•</span>
                            <span>Triggered by: {rec.triggerEvent.replace('_', ' ')}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Helpful?</span>
                        <Button
                          size="sm"
                          variant={feedbackState[rec.id] === "helpful" ? "default" : "ghost"}
                          onClick={() => trackRecommendationInteraction(rec.id, "feedback", "helpful")}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant={feedbackState[rec.id] === "not_helpful" ? "default" : "ghost"}
                          onClick={() => trackRecommendationInteraction(rec.id, "feedback", "not_helpful")}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>

          {/* Load More */}
          {filteredRecommendations.length > 0 && filteredRecommendations.length % 10 === 0 && (
            <div className="text-center pt-6">
              <Button
                variant="outline"
                onClick={() => generateRecommendations(activeTab === "all" ? "all" : activeTab, "load_more")}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Load More Recommendations
                  </>
                )}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
