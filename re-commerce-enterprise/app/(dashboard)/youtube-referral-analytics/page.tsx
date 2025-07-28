
import React from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Youtube, 
  Share2, 
  Brain, 
  TrendingUp, 
  Users, 
  Zap,
  ArrowRight,
  BarChart3,
  Target,
  Crown,
  Rocket,
  Play,
  Eye,
  ThumbsUp,
  MessageCircle,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'YouTube/Referral Analytics & Insights | Re-Commerce Enterprise',
  description: 'Advanced YouTube creator dashboard, viral referral management, and AI-powered analytics platform for maximizing growth and engagement.',
};

export default function YouTubeReferralAnalyticsPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text">
          YouTube/Referral Analytics & Insights
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive platform for YouTube creator success, viral referral management, and AI-powered analytics 
          to maximize content performance and growth.
        </p>
        <div className="flex justify-center space-x-4">
          <Badge variant="secondary" className="px-4 py-2">
            <Youtube className="h-4 w-4 mr-2" />
            YouTube Creator Tools
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <Share2 className="h-4 w-4 mr-2" />
            Viral Growth Engine
          </Badge>
          <Badge variant="secondary" className="px-4 py-2">
            <Brain className="h-4 w-4 mr-2" />
            AI-Powered Insights
          </Badge>
        </div>
      </div>

      {/* Key Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Youtube className="h-6 w-6 text-red-600" />
              <span>YouTube Creator Hub</span>
            </CardTitle>
            <CardDescription>
              Complete YouTube channel management and content optimization platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                Channel Analytics & Performance Tracking
              </div>
              <div className="flex items-center text-sm">
                <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                AI-Powered SEO Optimization
              </div>
              <div className="flex items-center text-sm">
                <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                Content Syndication Automation
              </div>
              <div className="flex items-center text-sm">
                <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                Monetization & Revenue Tracking
              </div>
            </div>
            <Link href="/youtube-referral-analytics/creator-dashboard">
              <Button className="w-full">
                Launch Creator Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Share2 className="h-6 w-6 text-purple-600" />
              <span>Viral Referral Engine</span>
            </CardTitle>
            <CardDescription>
              Advanced viral growth tracking and social sharing optimization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                Viral Coefficient & K-Factor Analysis
              </div>
              <div className="flex items-center text-sm">
                <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                Social Platform Optimization
              </div>
              <div className="flex items-center text-sm">
                <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                Influencer Partnership Management
              </div>
              <div className="flex items-center text-sm">
                <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                Content-Driven Growth Tracking
              </div>
            </div>
            <Link href="/youtube-referral-analytics/viral-referrals">
              <Button className="w-full">
                Launch Viral Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-blue-600" />
              <span>AI Analytics Platform</span>
            </CardTitle>
            <CardDescription>
              Predictive analytics, AI insights, and competitive intelligence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                Predictive Performance Models
              </div>
              <div className="flex items-center text-sm">
                <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                AI-Generated Insights & Recommendations
              </div>
              <div className="flex items-center text-sm">
                <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                Real-Time Trend Analysis
              </div>
              <div className="flex items-center text-sm">
                <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                Competitive Intelligence Monitoring
              </div>
            </div>
            <Link href="/youtube-referral-analytics/analytics-platform">
              <Button className="w-full">
                Launch Analytics Platform
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Platform Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance Overview</CardTitle>
          <CardDescription>Real-time insights across all analytics components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-2 mx-auto">
                <Youtube className="h-6 w-6 text-red-600" />
              </div>
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-muted-foreground">Connected Channels</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-2 mx-auto">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold">1.8M</p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-2 mx-auto">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold">45K</p>
              <p className="text-sm text-muted-foreground">Referred Users</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-2 mx-auto">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold">89%</p>
              <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-2 mx-auto">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">AI Insights</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-lg mb-2 mx-auto">
                <Rocket className="h-6 w-6 text-pink-600" />
              </div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Viral Content</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Advanced Features</span>
            </CardTitle>
            <CardDescription>Cutting-edge capabilities for maximum growth</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">AI Content Optimization</span>
                </div>
                <Badge variant="default">New</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Predictive Performance</span>
                </div>
                <Badge variant="secondary">89% Accuracy</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Share2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Viral Loop Optimization</span>
                </div>
                <Badge variant="outline">Live</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Crown className="h-5 w-5 text-orange-600" />
                  <span className="font-medium">Influencer Matching</span>
                </div>
                <Badge variant="secondary">AI-Powered</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <span>Performance Metrics</span>
            </CardTitle>
            <CardDescription>Real-time performance across all platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Total Views Growth</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">+23.5%</p>
                  <p className="text-xs text-muted-foreground">vs last month</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ThumbsUp className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Engagement Rate</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">+18.2%</p>
                  <p className="text-xs text-muted-foreground">vs last month</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Viral Coefficient</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">1.34</p>
                  <p className="text-xs text-muted-foreground">Above viral threshold</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">Revenue Growth</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">+31.7%</p>
                  <p className="text-xs text-muted-foreground">vs last month</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features and tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/youtube-referral-analytics/creator-dashboard">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2">
                <Youtube className="h-6 w-6" />
                <span className="text-sm">Creator Dashboard</span>
              </Button>
            </Link>
            <Link href="/youtube-referral-analytics/viral-referrals">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2">
                <Share2 className="h-6 w-6" />
                <span className="text-sm">Viral Tracking</span>
              </Button>
            </Link>
            <Link href="/youtube-referral-analytics/analytics-platform">
              <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2">
                <Brain className="h-6 w-6" />
                <span className="text-sm">AI Analytics</span>
              </Button>
            </Link>
            <Button variant="outline" className="w-full h-20 flex flex-col items-center space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Success Stories */}
      <Card>
        <CardHeader>
          <CardTitle>Success Stories</CardTitle>
          <CardDescription>Recent achievements from our platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto">
                <Youtube className="h-8 w-8 text-red-600" />
              </div>
              <h4 className="font-semibold">TechReviewer Pro</h4>
              <p className="text-sm text-muted-foreground">
                Increased subscribers by 340% using AI-optimized content strategy
              </p>
              <Badge variant="secondary">3.4M views/month</Badge>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto">
                <Share2 className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold">LifestyleHub</h4>
              <p className="text-sm text-muted-foreground">
                Achieved viral coefficient of 2.1 with optimized sharing strategy
              </p>
              <Badge variant="secondary">150K referrals</Badge>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold">EduCreator</h4>
              <p className="text-sm text-muted-foreground">
                Doubled revenue through predictive analytics-driven content planning
              </p>
              <Badge variant="secondary">$45K/month</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardContent className="p-8 text-center space-y-4">
          <h2 className="text-2xl font-bold">Ready to Maximize Your Growth?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of creators and businesses using our AI-powered analytics platform 
            to achieve viral growth and maximize their content performance.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/youtube-referral-analytics/creator-dashboard">
              <Button size="lg" className="flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Start Creating</span>
              </Button>
            </Link>
            <Link href="/youtube-referral-analytics/analytics-platform">
              <Button size="lg" variant="outline" className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Explore Analytics</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
