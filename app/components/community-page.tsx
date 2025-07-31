
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Star,
  Search,
  Filter,
  Calendar,
  User,
  ArrowUp,
  ArrowDown,
  Eye,
  Tag
} from 'lucide-react';

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Mock community data
  const communityStats = [
    { title: 'Active Members', value: '2,891', icon: Users },
    { title: 'Discussions', value: '1,247', icon: MessageCircle },
    { title: 'Questions Answered', value: '3,456', icon: Star },
    { title: 'Monthly Growth', value: '+23%', icon: TrendingUp }
  ];

  const discussions = [
    {
      id: 1,
      title: 'Best practices for implementing AI in small teams?',
      excerpt: 'We\'re a startup with 15 people looking to integrate AI into our workflow. What are the most practical first steps?',
      author: 'Sarah Chen',
      category: 'Technology',
      tags: ['AI', 'Startup', 'Implementation'],
      upvotes: 24,
      replies: 8,
      views: 156,
      createdAt: '2024-01-20',
      isAnswered: true
    },
    {
      id: 2,
      title: 'Remote team culture: How do you maintain connection?',
      excerpt: 'Our team went fully remote last year. While productivity is up, team culture seems to be suffering. Looking for practical solutions.',
      author: 'Marcus Johnson',
      category: 'Leadership',
      tags: ['Remote Work', 'Team Culture', 'Management'],
      upvotes: 31,
      replies: 12,
      views: 203,
      createdAt: '2024-01-19',
      isAnswered: false
    },
    {
      id: 3,
      title: 'UX research methods for B2B products',
      excerpt: 'Traditional UX research methods don\'t always work for enterprise B2B products. What approaches have worked for you?',
      author: 'Elena Rodriguez',
      category: 'Design',
      tags: ['UX Research', 'B2B', 'Enterprise'],
      upvotes: 18,
      replies: 6,
      views: 89,
      createdAt: '2024-01-18',
      isAnswered: true
    },
    {
      id: 4,
      title: 'Sustainable business metrics that actually matter',
      excerpt: 'Everyone talks about sustainability, but what metrics should we actually track? Looking for practical KPIs.',
      author: 'David Park',
      category: 'Business',
      tags: ['Sustainability', 'Metrics', 'KPIs'],
      upvotes: 22,
      replies: 9,
      views: 134,
      createdAt: '2024-01-17',
      isAnswered: false
    }
  ];

  const topContributors = [
    { name: 'Dr. Sarah Chen', points: 1247, answers: 89, specialty: 'AI & Technology' },
    { name: 'Marcus Johnson', points: 1156, answers: 76, specialty: 'Leadership' },
    { name: 'Elena Rodriguez', points: 987, answers: 64, specialty: 'UX Design' },
    { name: 'David Park', points: 834, answers: 52, specialty: 'Business Strategy' }
  ];

  const trendingTopics = [
    { name: 'AI Implementation', count: 234 },
    { name: 'Remote Leadership', count: 189 },
    { name: 'Sustainable Business', count: 156 },
    { name: 'UX Research', count: 134 },
    { name: 'Digital Transformation', count: 123 }
  ];

  const filters = [
    { id: 'all', label: 'All Discussions' },
    { id: 'unanswered', label: 'Unanswered' },
    { id: 'trending', label: 'Trending' },
    { id: 'recent', label: 'Recent' }
  ];

  const categories = ['Technology', 'Leadership', 'Design', 'Business', 'Innovation'];

  return (
    <div className="py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-4">Community</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with professionals, share knowledge, and get answers to your business questions
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {communityStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.title}</div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button className="shrink-0">
                  Ask Question
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={activeFilter === filter.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Discussions */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              {discussions.map((discussion, index) => (
                <Card key={discussion.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Voting */}
                      <div className="flex flex-col items-center gap-1 text-center">
                        <Button size="sm" variant="ghost" className="p-1 h-auto">
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <span className="text-sm font-medium">{discussion.upvotes}</span>
                        <Button size="sm" variant="ghost" className="p-1 h-auto">
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg hover:text-primary cursor-pointer">
                            {discussion.title}
                          </h3>
                          {discussion.isAnswered && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              ✓ Answered
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {discussion.excerpt}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {discussion.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Meta */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {discussion.author}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(discussion.createdAt).toLocaleDateString('sv-SE')}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {discussion.category}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {discussion.replies}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {discussion.views}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Contributors */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top Contributors</CardTitle>
                  <CardDescription>This month's most helpful members</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {topContributors.map((contributor, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {contributor.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{contributor.name}</div>
                        <div className="text-xs text-muted-foreground">{contributor.specialty}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{contributor.points}</div>
                        <div className="text-xs text-muted-foreground">{contributor.answers} answers</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trending Topics</CardTitle>
                  <CardDescription>Popular discussion topics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm hover:text-primary cursor-pointer">
                        {topic.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {topic.count}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                  <CardDescription>Browse by category</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category, index) => (
                    <Button 
                      key={index}
                      variant="ghost" 
                      className="w-full justify-start text-sm"
                    >
                      {category}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
