
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Share2, 
  TrendingUp, 
  Users, 
  Target,
  Zap,
  Globe,
  Gift,
  Star,
  ArrowUpRight,
  Copy,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Network,
  Crown,
  Flame
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ViralGrowthData {
  date: string;
  viralCoefficient: number;
  k_factor: number;
  organicUsers: number;
  referredUsers: number;
  contentViews: number;
  youtubeReferrals: number;
}

interface SocialShare {
  id: string;
  contentType: string;
  contentTitle: string;
  platform: string;
  shareType: string;
  clicks: number;
  conversions: number;
  viralDepth: number;
  shareTimestamp: string;
}

interface InfluencerPartnership {
  id: string;
  influencer: {
    name: string;
    email: string;
  };
  partnershipType: string;
  status: string;
  tier: string;
  primaryPlatform: string;
  followersCount: number;
  engagementRate: number;
  totalReach: string;
  conversions: number;
  revenue: number;
}

interface ReferralProgram {
  id: string;
  name: string;
  type: string;
  status: string;
  referrerRewards: any;
  refereeRewards: any;
  totalReferrals: number;
  successfulReferrals: number;
  totalReward: number;
}

export default function ViralReferralManagement() {
  const [viralAnalytics, setViralAnalytics] = useState<ViralGrowthData[]>([]);
  const [socialShares, setSocialShares] = useState<SocialShare[]>([]);
  const [influencerPartnerships, setInfluencerPartnerships] = useState<InfluencerPartnership[]>([]);
  const [referralPrograms, setReferralPrograms] = useState<ReferralProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');
  const [viralMetrics, setViralMetrics] = useState<any>(null);
  const [shareOptimizations, setShareOptimizations] = useState<any[]>([]);

  useEffect(() => {
    fetchViralData();
  }, [selectedTimeRange]);

  const fetchViralData = async () => {
    try {
      const tenantId = "tenant-1";
      const [analyticsRes, sharesRes, influencersRes] = await Promise.all([
        fetch(`/api/viral-referrals/growth-analytics?tenantId=${tenantId}&period=daily&limit=30`),
        fetch(`/api/viral-referrals/social-sharing?tenantId=${tenantId}&limit=50`),
        fetch(`/api/viral-referrals/influencer-partnerships?tenantId=${tenantId}&status=active`)
      ]);

      const [analyticsData, sharesData, influencersData] = await Promise.all([
        analyticsRes.json(),
        sharesRes.json(),
        influencersData.json()
      ]);

      setViralAnalytics(analyticsData.analytics || []);
      setSocialShares(sharesData.shares || []);
      setInfluencerPartnerships(influencersData.partnerships || []);
      setViralMetrics(analyticsData.insights);
    } catch (error) {
      console.error('Error fetching viral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createShareContent = async (contentType: string, platforms: string[]) => {
    try {
      const response = await fetch('/api/viral-referrals/social-sharing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_share_content',
          data: {
            contentType,
            contentTitle: 'Amazing Tutorial Video',
            contentDescription: 'Learn how to create viral content that drives engagement',
            targetPlatforms: platforms,
            tone: 'engaging',
            includeHashtags: true,
            includeCallToAction: true
          }
        })
      });

      const data = await response.json();
      setShareOptimizations(data.shareContent || []);
    } catch (error) {
      console.error('Error creating share content:', error);
    }
  };

  const trackShare = async (contentId: string, platform: string) => {
    try {
      const tenantId = "tenant-1";
      await fetch('/api/viral-referrals/social-sharing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'track_share',
          data: {
            tenantId,
            contentType: 'youtube_video',
            contentId,
            contentTitle: 'Viral Tutorial',
            contentUrl: `https://youtube.com/watch?v=${contentId}`,
            platform,
            shareType: 'native_share'
          }
        })
      });

      fetchViralData(); // Refresh data
    } catch (error) {
      console.error('Error tracking share:', error);
    }
  };

  const launchInfluencerCampaign = async (partnershipId: string) => {
    try {
      // This would launch a new influencer campaign
      console.log('Launching campaign for partnership:', partnershipId);
    } catch (error) {
      console.error('Error launching campaign:', error);
    }
  };

  const formatNumber = (num: number | string) => {
    const n = typeof num === 'string' ? parseInt(num) : num;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n?.toString() || '0';
  };

  const getViralityColor = (coefficient: number) => {
    if (coefficient > 1.5) return 'text-green-600';
    if (coefficient > 1.0) return 'text-blue-600';
    if (coefficient > 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPlatformIcon = (platform: string) => {
    const icons: any = {
      facebook: '📘',
      twitter: '🐦',
      linkedin: '💼',
      instagram: '📷',
      tiktok: '🎵',
      youtube: '📺'
    };
    return icons[platform.toLowerCase()] || '🌐';
  };

  const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3'];

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
          <h1 className="text-3xl font-bold gradient-text">Viral Referral Management</h1>
          <p className="text-muted-foreground">Track viral growth, manage social sharing, and optimize referral campaigns</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => createShareContent('youtube_video', ['facebook', 'twitter', 'linkedin'])}
            className="flex items-center space-x-2"
          >
            <Zap className="h-4 w-4" />
            <span>Generate Share Content</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Viral Coefficient</p>
                <p className={`text-2xl font-bold ${getViralityColor(viralMetrics?.currentViralCoefficient || 0)}`}>
                  {(viralMetrics?.currentViralCoefficient || 0).toFixed(2)}
                </p>
              </div>
              <Network className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-4">
              <Badge variant={viralMetrics?.isViralGrowth ? 'default' : 'secondary'}>
                {viralMetrics?.isViralGrowth ? 'Viral Growth' : 'Sub-Viral'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Shares</p>
                <p className="text-2xl font-bold">{formatNumber(socialShares.length * 125)}</p>
              </div>
              <Share2 className="h-8 w-8 text-purple-600" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+24.5% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Referred Users</p>
                <p className="text-2xl font-bold">
                  {formatNumber(viralAnalytics.reduce((sum, data) => sum + data.referredUsers, 0))}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+18.2% conversion rate</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Influencers</p>
                <p className="text-2xl font-bold">{influencerPartnerships.filter(p => p.status === 'active').length}</p>
              </div>
              <Crown className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-yellow-600">High engagement rate</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analytics">Viral Analytics</TabsTrigger>
          <TabsTrigger value="sharing">Social Sharing</TabsTrigger>
          <TabsTrigger value="influencers">Influencers</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        {/* Viral Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Viral Growth Trend</CardTitle>
                <CardDescription>Viral coefficient and K-factor over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={viralAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="viralCoefficient" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      name="Viral Coefficient"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="k_factor" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="K-Factor"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Acquisition Sources</CardTitle>
                <CardDescription>Organic vs referred user growth</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={viralAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="organicUsers" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8"
                      name="Organic Users"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="referredUsers" 
                      stackId="1"
                      stroke="#82ca9d" 
                      fill="#82ca9d"
                      name="Referred Users"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Content-Driven Viral Growth</CardTitle>
              <CardDescription>YouTube content driving referral traffic</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={viralAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="contentViews" fill="#60B5FF" name="Content Views" />
                  <Bar dataKey="youtubeReferrals" fill="#FF9149" name="YouTube Referrals" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Viral Loop Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Viral Loop Performance</CardTitle>
              <CardDescription>Analysis of viral loop stages and conversion rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                  { stage: 'Exposure', rate: 85, color: 'bg-blue-500' },
                  { stage: 'Click', rate: 12, color: 'bg-purple-500' },
                  { stage: 'Sign-up', rate: 4, color: 'bg-green-500' },
                  { stage: 'Activation', rate: 3, color: 'bg-yellow-500' },
                  { stage: 'Referral', rate: 1.5, color: 'bg-red-500' }
                ].map((step, index) => (
                  <div key={step.stage} className="text-center">
                    <div className="relative">
                      <div className={`w-16 h-16 ${step.color} rounded-full mx-auto flex items-center justify-center text-white font-bold`}>
                        {step.rate}%
                      </div>
                      {index < 4 && (
                        <ArrowUpRight className="absolute -right-8 top-6 h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium">{step.stage}</p>
                    <p className="text-xs text-muted-foreground">Conversion Rate</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Sharing Tab */}
        <TabsContent value="sharing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Social Shares</CardTitle>
                <CardDescription>Track viral sharing across platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialShares.slice(0, 10).map((share) => (
                    <div key={share.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">{getPlatformIcon(share.platform)}</div>
                        <div>
                          <h4 className="font-medium">{share.contentTitle}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{share.platform}</span>
                            <span>•</span>
                            <span>Depth: {share.viralDepth}</span>
                            <span>•</span>
                            <span>{new Date(share.shareTimestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-right">
                        <div>
                          <p className="text-sm font-medium">{share.clicks} clicks</p>
                          <p className="text-xs text-muted-foreground">{share.conversions} conversions</p>
                        </div>
                        <Badge variant={share.viralDepth > 3 ? 'default' : 'secondary'}>
                          {share.viralDepth > 3 ? 'Viral' : 'Normal'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
                <CardDescription>Share distribution by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Facebook', value: 35, color: '#3b82f6' },
                        { name: 'Twitter', value: 25, color: '#10b981' },
                        { name: 'LinkedIn', value: 20, color: '#f59e0b' },
                        { name: 'Instagram', value: 15, color: '#ef4444' },
                        { name: 'TikTok', value: 5, color: '#8b5cf6' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
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

          {/* Share Content Generator */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Share Content</CardTitle>
              <CardDescription>Optimized content for different social platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {shareOptimizations.map((content, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium flex items-center">
                          <span className="mr-2">{getPlatformIcon(content.platform)}</span>
                          {content.platform}
                        </h4>
                        <Button size="sm" variant="outline">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm mb-2">{content.title}</p>
                      <p className="text-xs text-muted-foreground mb-2">{content.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {content.hashtags?.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Influencers Tab */}
        <TabsContent value="influencers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Influencer Partnerships</span>
                <Button className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Find Influencers</span>
                </Button>
              </CardTitle>
              <CardDescription>Manage your influencer collaboration campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {influencerPartnerships.map((partnership) => (
                  <Card key={partnership.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {partnership.influencer.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-medium">{partnership.influencer.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>{partnership.primaryPlatform}</span>
                              <span>•</span>
                              <span>{formatNumber(partnership.followersCount)} followers</span>
                              <span>•</span>
                              <span>{(partnership.engagementRate * 100).toFixed(1)}% engagement</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatNumber(partnership.totalReach)} reach</p>
                            <p className="text-xs text-muted-foreground">${partnership.revenue.toFixed(0)} revenue</p>
                          </div>
                          <Badge variant={partnership.tier === 'mega' ? 'default' : 'secondary'}>
                            {partnership.tier}
                          </Badge>
                          <Button 
                            size="sm" 
                            onClick={() => launchInfluencerCampaign(partnership.id)}
                            className="flex items-center space-x-1"
                          >
                            <Flame className="h-4 w-4" />
                            <span>Campaign</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Influencer Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Partnership Performance</CardTitle>
                <CardDescription>ROI and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={influencerPartnerships.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="influencer.name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversions" fill="#60B5FF" name="Conversions" />
                    <Bar dataKey="revenue" fill="#10b981" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Influencer Tiers</CardTitle>
                <CardDescription>Distribution of influencer partnerships by tier</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Nano', value: 40, color: '#60B5FF' },
                        { name: 'Micro', value: 35, color: '#FF9149' },
                        { name: 'Macro', value: 20, color: '#FF9898' },
                        { name: 'Mega', value: 5, color: '#80D8C3' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
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
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Viral Growth Recommendations</CardTitle>
              <CardDescription>AI-powered suggestions to improve viral performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {viralMetrics?.recommendations?.map((rec: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start space-x-4">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        rec.priority === 'high' ? 'bg-red-500' : 
                        rec.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{rec.category}</h4>
                          <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                            {rec.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{rec.message}</p>
                        <div className="space-y-2">
                          {rec.actions?.map((action: string, actionIndex: number) => (
                            <div key={actionIndex} className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* A/B Testing Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Recommended A/B Tests</CardTitle>
              <CardDescription>Suggested experiments to improve viral performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Share Button Placement',
                    description: 'Test share button position: top vs bottom of content',
                    impact: 'High',
                    effort: 'Low',
                    duration: '2 weeks'
                  },
                  {
                    title: 'Referral Incentives',
                    description: 'Compare monetary vs non-monetary rewards',
                    impact: 'High',
                    effort: 'Medium',
                    duration: '4 weeks'
                  },
                  {
                    title: 'Social Proof Display',
                    description: 'Test showing share counts vs hiding them',
                    impact: 'Medium',
                    effort: 'Low',
                    duration: '1 week'
                  },
                  {
                    title: 'Viral Messaging',
                    description: 'Test different call-to-action messaging',
                    impact: 'Medium',
                    effort: 'Low',
                    duration: '2 weeks'
                  }
                ].map((test, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{test.title}</h4>
                        <Badge variant={test.impact === 'High' ? 'default' : 'secondary'}>
                          {test.impact} Impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{test.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span>Effort: {test.effort}</span>
                        <span>Duration: {test.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
