
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Users,
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  PlusCircle,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Heart,
  MessageCircle,
  Star,
  Clock,
  MapPin,
  Tag
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CommunityStats {
  totalForums: number;
  totalThreads: number;
  totalMembers: number;
  activeEvents: number;
  monthlyGrowth: number;
  engagementRate: number;
}

interface Forum {
  id: string;
  name: string;
  description: string;
  category: string;
  postCount: number;
  memberCount: number;
  lastActivity: string;
  isPrivate: boolean;
}

interface Event {
  id: string;
  title: string;
  type: string;
  startTime: string;
  location?: string;
  attendeeCount: number;
  maxAttendees?: number;
  imageUrl?: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    email: string;
  };
  category: string;
  difficulty: string;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
  estimatedReadTime?: number;
}

export default function CommunityPlatformDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [forums, setForums] = useState<Forum[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockStats: CommunityStats = {
        totalForums: 25,
        totalThreads: 1250,
        totalMembers: 8900,
        activeEvents: 12,
        monthlyGrowth: 15.8,
        engagementRate: 78.5,
      };

      const mockForums: Forum[] = [
        {
          id: "1",
          name: "General Discussion",
          description: "Open discussions about platform features and updates",
          category: "general",
          postCount: 450,
          memberCount: 1200,
          lastActivity: "2024-01-15T10:30:00Z",
          isPrivate: false,
        },
        {
          id: "2",
          name: "Developer Help",
          description: "Get help with development questions and debugging",
          category: "development",
          postCount: 320,
          memberCount: 850,
          lastActivity: "2024-01-15T09:15:00Z",
          isPrivate: false,
        },
        {
          id: "3",
          name: "Feature Requests",
          description: "Suggest new features and improvements",
          category: "feedback",
          postCount: 180,
          memberCount: 650,
          lastActivity: "2024-01-15T08:45:00Z",
          isPrivate: false,
        },
      ];

      const mockEvents: Event[] = [
        {
          id: "1",
          title: "Community Hackathon 2024",
          type: "hackathon",
          startTime: "2024-02-01T09:00:00Z",
          location: "Virtual Event",
          attendeeCount: 245,
          maxAttendees: 500,
        },
        {
          id: "2",
          title: "Weekly Developer Meetup",
          type: "meetup",
          startTime: "2024-01-20T14:00:00Z",
          location: "Stockholm, Sweden",
          attendeeCount: 45,
          maxAttendees: 100,
        },
        {
          id: "3",
          title: "API Workshop Series",
          type: "workshop",
          startTime: "2024-01-25T16:00:00Z",
          location: "Virtual Event",
          attendeeCount: 120,
          maxAttendees: 200,
        },
      ];

      const mockArticles: Article[] = [
        {
          id: "1",
          title: "Getting Started with Community Contributions",
          excerpt: "Learn how to make your first contribution to open source projects in our community.",
          author: { name: "Sarah Johnson", email: "sarah@example.com" },
          category: "tutorial",
          difficulty: "beginner",
          viewCount: 1250,
          likeCount: 89,
          publishedAt: "2024-01-10T12:00:00Z",
          estimatedReadTime: 8,
        },
        {
          id: "2",
          title: "Advanced API Integration Patterns",
          excerpt: "Explore complex integration patterns for building scalable applications.",
          author: { name: "Mike Chen", email: "mike@example.com" },
          category: "advanced",
          difficulty: "expert",
          viewCount: 890,
          likeCount: 156,
          publishedAt: "2024-01-12T15:30:00Z",
          estimatedReadTime: 15,
        },
      ];

      setStats(mockStats);
      setForums(mockForums);
      setEvents(mockEvents);
      setArticles(mockArticles);
    } catch (error) {
      console.error("Error loading community data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      general: "bg-blue-100 text-blue-800",
      development: "bg-green-100 text-green-800",
      feedback: "bg-purple-100 text-purple-800",
      support: "bg-yellow-100 text-yellow-800",
      tutorial: "bg-indigo-100 text-indigo-800",
      advanced: "bg-red-100 text-red-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-orange-100 text-orange-800",
      expert: "bg-red-100 text-red-800",
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Platform</h1>
          <p className="text-gray-600">Manage forums, events, and knowledge sharing</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Forums</p>
                  <p className="text-2xl font-bold">{stats.totalForums.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Threads</p>
                  <p className="text-2xl font-bold">{stats.totalThreads.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Members</p>
                  <p className="text-2xl font-bold">{stats.totalMembers.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Events</p>
                  <p className="text-2xl font-bold">{stats.activeEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Growth</p>
                  <p className="text-2xl font-bold">+{stats.monthlyGrowth}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Engagement</p>
                  <p className="text-2xl font-bold">{stats.engagementRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="forums">Forums</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Forums */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Active Forums
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {forums.slice(0, 3).map((forum) => (
                  <div key={forum.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{forum.name}</h4>
                      <p className="text-sm text-gray-600">{forum.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{forum.postCount} posts</span>
                        <span>{forum.memberCount} members</span>
                      </div>
                    </div>
                    <Badge className={getCategoryColor(forum.category)}>
                      {forum.category}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {events.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {formatDate(event.startTime)}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {event.attendeeCount} attendees
                        {event.maxAttendees && ` / ${event.maxAttendees} max`}
                      </p>
                    </div>
                    <Badge variant="outline">{event.type}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Forums Tab */}
        <TabsContent value="forums" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search forums..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Forum
            </Button>
          </div>

          <div className="grid gap-4">
            {forums.map((forum) => (
              <motion.div
                key={forum.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{forum.name}</h3>
                          <Badge className={getCategoryColor(forum.category)}>
                            {forum.category}
                          </Badge>
                          {forum.isPrivate && (
                            <Badge variant="secondary">Private</Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-4">{forum.description}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {forum.postCount} posts
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {forum.memberCount} members
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(forum.lastActivity)}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Forum</DropdownMenuItem>
                          <DropdownMenuItem>Edit Settings</DropdownMenuItem>
                          <DropdownMenuItem>Manage Moderators</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Archive Forum</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <Badge variant="outline">{event.type}</Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Event</DropdownMenuItem>
                            <DropdownMenuItem>Edit Event</DropdownMenuItem>
                            <DropdownMenuItem>Manage Attendees</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Cancel Event</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {formatDate(event.startTime)}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {event.location}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {event.attendeeCount} attendees
                            {event.maxAttendees && ` / ${event.maxAttendees} max`}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: event.maxAttendees
                                  ? `${Math.min((event.attendeeCount / event.maxAttendees) * 100, 100)}%`
                                  : "100%",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </div>

          <div className="grid gap-6">
            {articles.map((article) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{article.title}</h3>
                          <Badge className={getCategoryColor(article.category)}>
                            {article.category}
                          </Badge>
                          <Badge className={getDifficultyColor(article.difficulty)}>
                            {article.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{article.excerpt}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {article.viewCount} views
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4" />
                              {article.likeCount} likes
                            </div>
                            {article.estimatedReadTime && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {article.estimatedReadTime} min read
                              </div>
                            )}
                          </div>
                          
                          <div className="text-sm text-gray-500">
                            By {article.author.name} • {formatDate(article.publishedAt)}
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Article</DropdownMenuItem>
                          <DropdownMenuItem>Edit Article</DropdownMenuItem>
                          <DropdownMenuItem>Analytics</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Archive Article</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
