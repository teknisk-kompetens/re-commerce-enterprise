
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Youtube, 
  TrendingUp, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Share2,
  DollarSign,
  Users,
  Clock,
  Target,
  Upload,
  Settings,
  BarChart3,
  Search,
  Play,
  Calendar,
  Star,
  Zap
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface YouTubeChannel {
  id: string;
  channelId: string;
  channelName: string;
  channelHandle?: string;
  description?: string;
  thumbnailUrl?: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: string;
  syncStatus: string;
  monetizationEnabled: boolean;
  revenueShare: number;
  lastSync?: string;
  videos?: YouTubeVideo[];
  analytics?: YouTubeAnalytics[];
}

interface YouTubeVideo {
  id: string;
  videoId: string;
  title: string;
  viewCount: string;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  duration?: number;
  monetized: boolean;
  revenue: number;
  seoScore: number;
}

interface YouTubeAnalytics {
  id: string;
  date: string;
  subscribersGained: number;
  watchTimeMinutes: string;
  estimatedRevenue: number;
}

interface SEOOptimization {
  videoId: string;
  seoScore: number;
  targetKeywords: string[];
  titleSuggestions: string[];
  aiRecommendations: any;
}

export default function YouTubeCreatorDashboard() {
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<YouTubeChannel | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [seoOptimizations, setSeoOptimizations] = useState<SEOOptimization[]>([]);
  const [loading, setLoading] = useState(true);
  const [newChannelUrl, setNewChannelUrl] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    if (selectedChannel) {
      fetchChannelDetails(selectedChannel.id);
    }
  }, [selectedChannel]);

  const fetchChannels = async () => {
    try {
      const tenantId = "tenant-1"; // Get from context
      const response = await fetch(`/api/youtube-integration/channels?tenantId=${tenantId}`);
      const data = await response.json();
      
      if (data.channels) {
        setChannels(data.channels);
        if (data.channels.length > 0 && !selectedChannel) {
          setSelectedChannel(data.channels[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannelDetails = async (channelId: string) => {
    try {
      const tenantId = "tenant-1";
      const [videosRes, analyticsRes, seoRes] = await Promise.all([
        fetch(`/api/youtube-integration/videos?tenantId=${tenantId}&channelId=${channelId}`),
        fetch(`/api/youtube-integration/analytics?tenantId=${tenantId}&channelId=${channelId}`),
        fetch(`/api/youtube-integration/seo-optimization?tenantId=${tenantId}&channelId=${channelId}`)
      ]);

      const [videosData, analyticsData, seoData] = await Promise.all([
        videosRes.json(),
        analyticsRes.json(),
        seoRes.json()
      ]);

      setVideos(videosData.videos || []);
      setAnalytics(analyticsData);
      setSeoOptimizations(seoData.optimizations || []);
    } catch (error) {
      console.error('Error fetching channel details:', error);
    }
  };

  const connectChannel = async () => {
    if (!newChannelUrl.trim()) return;

    try {
      const tenantId = "tenant-1";
      const response = await fetch('/api/youtube-integration/channels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          channelId: extractChannelId(newChannelUrl),
          channelName: 'New Channel',
          accessToken: 'mock-token' // In production, this would come from OAuth
        })
      });

      if (response.ok) {
        const data = await response.json();
        setChannels(prev => [...prev, data]);
        setNewChannelUrl('');
      }
    } catch (error) {
      console.error('Error connecting channel:', error);
    }
  };

  const optimizeVideo = async (videoId: string) => {
    try {
      const tenantId = "tenant-1";
      const response = await fetch('/api/youtube-integration/seo-optimization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'optimize_video',
          data: {
            tenantId,
            videoId,
            targetKeywords: ['tutorial', 'guide', 'how to'],
            focusKeyword: 'tutorial'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSeoOptimizations(prev => [...prev, data.optimization]);
      }
    } catch (error) {
      console.error('Error optimizing video:', error);
    }
  };

  const syncAnalytics = async () => {
    if (!selectedChannel) return;

    try {
      const tenantId = "tenant-1";
      await fetch('/api/youtube-integration/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync_analytics',
          data: {
            tenantId,
            channelId: selectedChannel.id,
            period: 'monthly'
          }
        })
      });

      fetchChannelDetails(selectedChannel.id);
    } catch (error) {
      console.error('Error syncing analytics:', error);
    }
  };

  const extractChannelId = (url: string) => {
    // Extract channel ID from YouTube URL
    const match = url.match(/(?:youtube\.com\/channel\/|youtube\.com\/c\/|youtube\.com\/@)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : url;
  };

  const formatNumber = (num: number | string) => {
    const n = typeof num === 'string' ? parseInt(num) : num;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n?.toString() || '0';
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

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
          <h1 className="text-3xl font-bold gradient-text">YouTube Creator Dashboard</h1>
          <p className="text-muted-foreground">Manage your YouTube channels and optimize content performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={syncAnalytics} variant="outline" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Sync Analytics</span>
          </Button>
          <Button onClick={() => setActiveTab('connect')} className="flex items-center space-x-2">
            <Youtube className="h-4 w-4" />
            <span>Connect Channel</span>
          </Button>
        </div>
      </div>

      {/* Channel Selector */}
      {channels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Youtube className="h-5 w-5 text-red-600" />
              <span>Your Channels</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {channels.map((channel) => (
                <Card 
                  key={channel.id} 
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedChannel?.id === channel.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedChannel(channel)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      {channel.thumbnailUrl && (
                        <img 
                          src={channel.thumbnailUrl} 
                          alt={channel.channelName}
                          className="w-12 h-12 rounded-full"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">{channel.channelName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(channel.subscriberCount)} subscribers
                        </p>
                      </div>
                      <Badge variant={channel.syncStatus === 'active' ? 'default' : 'secondary'}>
                        {channel.syncStatus}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="seo">SEO Tools</TabsTrigger>
          <TabsTrigger value="monetization">Monetization</TabsTrigger>
          <TabsTrigger value="connect">Connect</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {selectedChannel && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Subscribers</p>
                        <p className="text-2xl font-bold">{formatNumber(selectedChannel.subscriberCount)}</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500">+12.5% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                        <p className="text-2xl font-bold">{formatNumber(selectedChannel.viewCount)}</p>
                      </div>
                      <Eye className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500">+8.2% from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Videos</p>
                        <p className="text-2xl font-bold">{selectedChannel.videoCount}</p>
                      </div>
                      <Play className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <Calendar className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-blue-500">3 this month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Est. Revenue</p>
                        <p className="text-2xl font-bold">
                          ${analytics?.summary?.totalRevenue?.toFixed(0) || '0'}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="mt-4 flex items-center text-sm">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500">+15.3% from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Analytics Charts */}
              {analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Subscriber Growth</CardTitle>
                      <CardDescription>Monthly subscriber growth trend</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={analytics.analytics || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Area 
                            type="monotone" 
                            dataKey="subscribersGained" 
                            stroke="#3b82f6" 
                            fill="#3b82f6" 
                            fillOpacity={0.1}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Trend</CardTitle>
                      <CardDescription>Monthly estimated revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.analytics || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="estimatedRevenue" 
                            stroke="#10b981" 
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Top Performing Videos */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Videos</CardTitle>
                  <CardDescription>Your best performing content this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {videos.slice(0, 5).map((video) => (
                      <div key={video.id} className="flex items-center space-x-4 p-4 rounded-lg border hover:bg-muted/50">
                        <div className="flex-1">
                          <h4 className="font-medium">{video.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {formatNumber(video.viewCount)}
                            </span>
                            <span className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {formatNumber(video.likeCount)}
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {formatNumber(video.commentCount)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={video.monetized ? 'default' : 'secondary'}>
                            {video.monetized ? 'Monetized' : 'Not Monetized'}
                          </Badge>
                          <div className="text-right">
                            <p className="text-sm font-medium">${video.revenue.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">Revenue</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Video Library</span>
                <Button size="sm" className="flex items-center space-x-2">
                  <Upload className="h-4 w-4" />
                  <span>Upload Video</span>
                </Button>
              </CardTitle>
              <CardDescription>Manage and optimize your YouTube videos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {videos.map((video) => (
                  <Card key={video.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium">{video.title}</h3>
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground mt-2">
                            <span className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {formatNumber(video.viewCount)} views
                            </span>
                            <span className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              {formatNumber(video.likeCount)} likes
                            </span>
                            <span className="flex items-center">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              {formatNumber(video.commentCount)} comments
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatDuration(video.duration)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">SEO Score:</span>
                              <Progress value={video.seoScore} className="w-24" />
                              <span className="text-sm font-medium">{video.seoScore}%</span>
                            </div>
                            <Badge variant={video.monetized ? 'default' : 'secondary'}>
                              {video.monetized ? 'Monetized' : 'Not Monetized'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => optimizeVideo(video.id)}
                            className="flex items-center space-x-1"
                          >
                            <Target className="h-4 w-4" />
                            <span>Optimize</span>
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tools Tab */}
        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Optimization Tools</CardTitle>
              <CardDescription>Improve your video discoverability and rankings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {seoOptimizations.map((seo) => (
                  <Card key={seo.videoId} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium">Video SEO Analysis</h3>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{seo.seoScore}/100</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Target Keywords</h4>
                          <div className="flex flex-wrap gap-2">
                            {seo.targetKeywords.map((keyword) => (
                              <Badge key={keyword} variant="outline">{keyword}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Title Suggestions</h4>
                          <div className="space-y-2">
                            {seo.titleSuggestions.slice(0, 3).map((suggestion, index) => (
                              <p key={index} className="text-sm text-muted-foreground">
                                • {suggestion}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>

                      {seo.aiRecommendations && (
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <h4 className="font-medium mb-2 flex items-center">
                            <Zap className="h-4 w-4 mr-2 text-blue-500" />
                            AI Recommendations
                          </h4>
                          <div className="space-y-2">
                            {seo.aiRecommendations.actions?.slice(0, 3).map((action: string, index: number) => (
                              <p key={index} className="text-sm">• {action}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connect Channel Tab */}
        <TabsContent value="connect" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connect YouTube Channel</CardTitle>
              <CardDescription>
                Add a new YouTube channel to your dashboard for management and optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Input
                  placeholder="Enter YouTube channel URL or ID"
                  value={newChannelUrl}
                  onChange={(e) => setNewChannelUrl(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={connectChannel} disabled={!newChannelUrl.trim()}>
                  Connect Channel
                </Button>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium mb-2">How to connect your channel:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Go to your YouTube channel page</li>
                  <li>Copy the channel URL from your browser</li>
                  <li>Paste it in the field above and click "Connect Channel"</li>
                  <li>Complete the OAuth authorization process</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
