
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  MessageSquare,
  Calendar,
  BookOpen,
  Package,
  GitBranch,
  Store,
  Award,
  TrendingUp,
  Activity,
  ArrowRight,
  Zap,
  Target,
  Heart,
  Star,
  Eye,
  Download,
  Code,
  Rocket,
  Layout
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CommunityOverviewStats {
  totalMembers: number;
  activeForums: number;
  monthlyEvents: number;
  knowledgeArticles: number;
  totalPlugins: number;
  openSourceProjects: number;
  marketplaceItems: number;
  monthlyContributions: number;
  communityGrowth: number;
  engagementRate: number;
}

interface QuickStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: string;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  user: string;
  time: string;
  icon: React.ElementType;
  color: string;
}

interface FeaturedItem {
  id: string;
  type: string;
  title: string;
  description: string;
  author: string;
  stats: {
    views?: number;
    downloads?: number;
    stars?: number;
    likes?: number;
  };
  badge?: string;
  href: string;
}

export default function CommunityOverviewPage() {
  const [stats, setStats] = useState<CommunityOverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOverviewData();
  }, []);

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockStats: CommunityOverviewStats = {
        totalMembers: 8945,
        activeForums: 25,
        monthlyEvents: 12,
        knowledgeArticles: 234,
        totalPlugins: 156,
        openSourceProjects: 89,
        marketplaceItems: 234,
        monthlyContributions: 1456,
        communityGrowth: 15.8,
        engagementRate: 78.5,
      };

      setStats(mockStats);
    } catch (error) {
      console.error("Error loading overview data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickStats: QuickStat[] = [
    {
      label: "Community Members",
      value: stats?.totalMembers.toLocaleString() || "0",
      change: `+${stats?.communityGrowth || 0}%`,
      trend: "up",
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Monthly Contributions",
      value: stats?.monthlyContributions.toLocaleString() || "0",
      change: "+23.4%",
      trend: "up",
      icon: Activity,
      color: "text-green-600",
    },
    {
      label: "Active Projects",
      value: stats?.openSourceProjects.toString() || "0",
      change: "+12.8%",
      trend: "up",
      icon: GitBranch,
      color: "text-purple-600",
    },
    {
      label: "Marketplace Items",
      value: stats?.marketplaceItems.toString() || "0",
      change: "+18.7%",
      trend: "up",
      icon: Store,
      color: "text-orange-600",
    },
  ];

  const recentActivity: ActivityItem[] = [
    {
      id: "1",
      type: "forum_post",
      title: "New discussion: Best practices for React optimization",
      user: "Sarah Johnson",
      time: "2 minutes ago",
      icon: MessageSquare,
      color: "text-blue-600",
    },
    {
      id: "2",
      type: "plugin_release",
      title: "Advanced Analytics Widget v2.1 released",
      user: "Mike Chen",
      time: "15 minutes ago",
      icon: Package,
      color: "text-green-600",
    },
    {
      id: "3",
      type: "contribution",
      title: "Contributed to react-components-library",
      user: "Alex Johnson",
      time: "1 hour ago",
      icon: GitBranch,
      color: "text-purple-600",
    },
    {
      id: "4",
      type: "knowledge_article",
      title: "Published: Advanced TypeScript Patterns",
      user: "Emma Davis",
      time: "2 hours ago",
      icon: BookOpen,
      color: "text-indigo-600",
    },
    {
      id: "5",
      type: "event_registration",
      title: "Registered for Community Hackathon 2024",
      user: "James Wilson",
      time: "3 hours ago",
      icon: Calendar,
      color: "text-pink-600",
    },
  ];

  const featuredItems: FeaturedItem[] = [
    {
      id: "1",
      type: "plugin",
      title: "Advanced Analytics Widget",
      description: "Powerful charting widget with real-time data support",
      author: "Sarah Johnson",
      stats: { downloads: 1245, stars: 89 },
      badge: "Featured",
      href: "/plugin-marketplace",
    },
    {
      id: "2",
      type: "project",
      title: "React Components Library",
      description: "Comprehensive library of reusable React components",
      author: "Community Team",
      stats: { stars: 567, views: 2340 },
      badge: "Popular",
      href: "/opensource-contributions",
    },
    {
      id: "3",
      type: "template",
      title: "E-commerce Dashboard",
      description: "Complete dashboard template for e-commerce platforms",
      author: "Emma Davis",
      stats: { downloads: 456, likes: 123 },
      badge: "New",
      href: "/community-marketplace",
    },
    {
      id: "4",
      type: "article",
      title: "Advanced TypeScript Patterns",
      description: "In-depth guide to advanced TypeScript patterns and best practices",
      author: "Mike Chen",
      stats: { views: 3450, likes: 234 },
      badge: "Trending",
      href: "/community-hub",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          <Rocket className="h-4 w-4" />
          Community-Driven Development
        </div>
        <h1 className="text-4xl font-bold text-gray-900">Welcome to Our Community</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Join thousands of developers, share knowledge, collaborate on projects, and build amazing things together.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {quickStats.map((stat, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className={`h-4 w-4 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                    <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Community Platforms */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Platforms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Community Hub */}
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Community Hub</h3>
                      <p className="text-sm text-gray-600">Forums, events & knowledge</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Active Forums</span>
                      <span className="font-medium">{stats?.activeForums}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Monthly Events</span>
                      <span className="font-medium">{stats?.monthlyEvents}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Knowledge Articles</span>
                      <span className="font-medium">{stats?.knowledgeArticles}</span>
                    </div>
                  </div>
                  <Link href="/community-hub">
                    <Button className="w-full mt-4 group-hover:bg-blue-700">
                      Explore Hub
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Plugin Marketplace */}
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Package className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Plugin Marketplace</h3>
                      <p className="text-sm text-gray-600">Discover & install plugins</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Available Plugins</span>
                      <span className="font-medium">{stats?.totalPlugins}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Active Installs</span>
                      <span className="font-medium">8.7K</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Rating</span>
                      <span className="font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        4.3
                      </span>
                    </div>
                  </div>
                  <Link href="/plugin-marketplace">
                    <Button className="w-full mt-4 group-hover:bg-green-700">
                      Browse Plugins
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Developer Collaboration */}
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <GitBranch className="h-8 w-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Developer Collaboration</h3>
                      <p className="text-sm text-gray-600">Projects & code sharing</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Active Projects</span>
                      <span className="font-medium">45</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Code Shares</span>
                      <span className="font-medium">89</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Mentorships</span>
                      <span className="font-medium">8</span>
                    </div>
                  </div>
                  <Link href="/developer-collaboration">
                    <Button className="w-full mt-4 group-hover:bg-purple-700">
                      Start Collaborating
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Community Marketplace */}
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Store className="h-8 w-8 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Community Marketplace</h3>
                      <p className="text-sm text-gray-600">Widgets & templates</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Widgets</span>
                      <span className="font-medium">234</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Templates</span>
                      <span className="font-medium">89</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Downloads</span>
                      <span className="font-medium">15.6K</span>
                    </div>
                  </div>
                  <Link href="/community-marketplace">
                    <Button className="w-full mt-4 group-hover:bg-orange-700">
                      Browse Marketplace
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Featured Items */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {item.type}
                        </Badge>
                        {item.badge && (
                          <Badge variant="outline" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                      <p className="text-xs text-gray-500 mb-4">by {item.author}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        {item.stats.views && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{item.stats.views.toLocaleString()}</span>
                          </div>
                        )}
                        {item.stats.downloads && (
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            <span>{item.stats.downloads.toLocaleString()}</span>
                          </div>
                        )}
                        {item.stats.stars && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>{item.stats.stars}</span>
                          </div>
                        )}
                        {item.stats.likes && (
                          <div className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            <span>{item.stats.likes}</span>
                          </div>
                        )}
                      </div>
                      
                      <Link href={item.href}>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                          <ArrowRight className="h-3 w-3 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-600">{activity.user}</p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Community Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Community Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Monthly Contributors</span>
                  <span>342/500</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Open Source Projects</span>
                  <span>89/100</span>
                </div>
                <Progress value={89} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Community Events</span>
                  <span>12/15</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Knowledge Articles</span>
                  <span>234/300</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/opensource-contributions">
                <Button variant="outline" className="w-full justify-start">
                  <GitBranch className="h-4 w-4 mr-2" />
                  View Open Source
                </Button>
              </Link>
              <Link href="/community-hub">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Join Discussion
                </Button>
              </Link>
              <Link href="/developer-collaboration">
                <Button variant="outline" className="w-full justify-start">
                  <Code className="h-4 w-4 mr-2" />
                  Share Code
                </Button>
              </Link>
              <Link href="/plugin-marketplace">
                <Button variant="outline" className="w-full justify-start">
                  <Package className="h-4 w-4 mr-2" />
                  Create Plugin
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
