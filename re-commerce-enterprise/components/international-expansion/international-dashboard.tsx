
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Languages,
  DollarSign,
  MapPin,
  TrendingUp,
  Users,
  CreditCard,
  BarChart3,
  Target,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InternationalConfig {
  languages: {
    configured: number;
    default: string;
    completeness: number;
  };
  currencies: {
    configured: number;
    default: string;
    totalVolume: number;
  };
  markets: {
    configured: number;
    launched: number;
    countriesCovered: number;
  };
  payments: {
    configured: number;
    active: number;
    types: string[];
  };
  expansion: {
    total: number;
    active: number;
    launched: number;
  };
  support: {
    multilingual: number;
    regions: number;
    openTickets: number;
  };
}

interface InternationalizationScore {
  languageScore: number;
  marketScore: number;
  paymentScore: number;
  expansionScore: number;
  overallScore: number;
}

interface Recommendation {
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
}

interface DashboardProps {
  tenantId: string;
}

export default function InternationalDashboard({ tenantId }: DashboardProps) {
  const [config, setConfig] = useState<InternationalConfig | null>(null);
  const [score, setScore] = useState<InternationalizationScore | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchInternationalConfig();
  }, [tenantId]);

  const fetchInternationalConfig = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tenant-international-config?tenantId=${tenantId}`);
      const data = await response.json();
      
      if (data.success) {
        setConfig(data.configuration);
        setScore(data.score);
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Error fetching international config:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!config || !score) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load international configuration</p>
        <Button onClick={fetchInternationalConfig} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">International Expansion</h1>
          <p className="text-gray-600 mt-2">
            Manage global markets, languages, currencies, and cultural customizations
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Target className="w-4 h-4 mr-2" />
            Expansion Roadmap
          </Button>
          <Button>
            <Globe className="w-4 h-4 mr-2" />
            Add New Market
          </Button>
        </div>
      </div>

      {/* International Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-blue-900">Internationalization Score</CardTitle>
                <CardDescription className="text-blue-700">
                  Overall readiness for global expansion
                </CardDescription>
              </div>
              <div className={`text-4xl font-bold ${getScoreColor(score.overallScore)}`}>
                {score.overallScore}%
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Languages</span>
                  <span className="font-medium">{score.languageScore}%</span>
                </div>
                <Progress value={score.languageScore} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Markets</span>
                  <span className="font-medium">{score.marketScore}%</span>
                </div>
                <Progress value={score.marketScore} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Payments</span>
                  <span className="font-medium">{score.paymentScore}%</span>
                </div>
                <Progress value={score.paymentScore} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Expansion</span>
                  <span className="font-medium">{score.expansionScore}%</span>
                </div>
                <Progress value={score.expansionScore} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Configuration Overview */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="markets">Markets</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="expansion">Expansion</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Languages</CardTitle>
                  <Languages className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{config.languages.configured}</div>
                  <p className="text-xs text-gray-600">
                    Default: {config.languages.default?.toUpperCase()}
                  </p>
                  <div className="mt-2">
                    <Progress value={config.languages.completeness} className="h-1" />
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(config.languages.completeness)}% translated
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Currencies</CardTitle>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{config.currencies.configured}</div>
                  <p className="text-xs text-gray-600">
                    Base: {config.currencies.default}
                  </p>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">
                      Total volume: ${config.currencies.totalVolume.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Markets</CardTitle>
                  <MapPin className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{config.markets.configured}</div>
                  <p className="text-xs text-gray-600">
                    {config.markets.launched} launched
                  </p>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">
                      {config.markets.countriesCovered} countries covered
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
                  <CreditCard className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{config.payments.configured}</div>
                  <p className="text-xs text-gray-600">
                    {config.payments.active} active
                  </p>
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {config.payments.types.slice(0, 3).map((type, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
                          {type}
                        </Badge>
                      ))}
                      {config.payments.types.length > 3 && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          +{config.payments.types.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                    Recommendations
                  </CardTitle>
                  <CardDescription>
                    Actions to improve your international presence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 rounded-lg border bg-gray-50"
                      >
                        <div className="flex-shrink-0">
                          {rec.priority === 'critical' ? (
                            <AlertCircle className="w-5 h-5 text-red-600" />
                          ) : rec.priority === 'high' ? (
                            <Clock className="w-5 h-5 text-orange-600" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm font-medium text-gray-900">{rec.title}</h4>
                            <Badge
                              variant="outline"
                              className={`text-xs ${getPriorityColor(rec.priority)}`}
                            >
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common international management tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Languages className="w-6 h-6 mb-2" />
                  <span className="text-sm">Manage Languages</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <DollarSign className="w-6 h-6 mb-2" />
                  <span className="text-sm">Currency Settings</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <MapPin className="w-6 h-6 mb-2" />
                  <span className="text-sm">Market Regions</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BarChart3 className="w-6 h-6 mb-2" />
                  <span className="text-sm">Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="markets">
          {/* Markets content will be implemented in separate components */}
          <Card>
            <CardHeader>
              <CardTitle>Market Regions</CardTitle>
              <CardDescription>Manage your global market presence</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Market regions management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization">
          {/* Localization content */}
          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
              <CardDescription>Languages, translations, and cultural adaptations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Localization management interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expansion">
          {/* Expansion content */}
          <Card>
            <CardHeader>
              <CardTitle>Expansion Roadmap</CardTitle>
              <CardDescription>Plan and track international expansion initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Expansion roadmap interface coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Support Tickets Summary */}
      {config.support.openTickets > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-900">International Support</CardTitle>
            <CardDescription className="text-orange-700">
              Active support tickets requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-orange-900">
                {config.support.openTickets}
              </div>
              <div className="text-sm text-orange-700">
                Open tickets across {config.support.regions} regions in {config.support.multilingual} languages
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                View Tickets
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
