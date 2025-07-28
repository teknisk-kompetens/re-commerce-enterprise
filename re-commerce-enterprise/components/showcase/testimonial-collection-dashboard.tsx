
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Star,
  Video,
  Mic,
  Image,
  FileText,
  Users,
  TrendingUp,
  Award,
  Building2,
  Globe,
  Eye,
  Share2,
  Heart,
  Camera,
  Calendar,
  Filter,
  Search,
  Plus,
  Edit,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Download,
  Upload,
  Settings,
  CheckCircle,
  Clock,
  Target,
  Zap,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Play,
  Pause,
  Send,
  Mail,
  Code,
  Smartphone,
  Monitor,
  Globe2,
  Flag
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface Testimonial {
  id: string;
  content: string;
  rating?: number;
  headline?: string;
  authorName: string;
  authorTitle?: string;
  authorCompany?: string;
  authorEmail?: string;
  authorImage?: string;
  type: 'text' | 'video' | 'audio';
  format: 'short' | 'medium' | 'long' | 'case-study';
  videoUrl?: string;
  audioUrl?: string;
  imageUrl?: string;
  collectionMethod?: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs-review';
  featured: boolean;
  published: boolean;
  publishedAt?: string;
  viewCount: number;
  shareCount: number;
  likeCount: number;
  category?: string;
  tags: string[];
  widgetEnabled: boolean;
  customer?: {
    companyName: string;
    logoUrl?: string;
    industry: string;
    companySize: string;
  };
  story?: {
    title: string;
    industry: string;
    useCase: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface TestimonialCampaign {
  id: string;
  name: string;
  description?: string;
  purpose?: string;
  type: 'email' | 'survey' | 'form' | 'interview';
  method: 'automated' | 'manual' | 'hybrid';
  startDate: string;
  endDate?: string;
  automated: boolean;
  sent: number;
  opened: number;
  responded: number;
  completed: number;
  approved: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
}

interface TestimonialWidget {
  id: string;
  name: string;
  description?: string;
  type: 'slider' | 'grid' | 'list' | 'single' | 'popup';
  displayCount: number;
  autoRotate: boolean;
  rotateInterval: number;
  theme: string;
  primaryColor: string;
  backgroundColor: string;
  websiteUrl?: string;
  installCount: number;
  viewCount: number;
  active: boolean;
  published: boolean;
  embedCode?: string;
}

interface TestimonialModeration {
  id: string;
  action: string;
  status: 'pending' | 'completed' | 'escalated';
  reason?: string;
  notes?: string;
  qualityScore?: number;
  credibilityScore?: number;
  usabilityScore?: number;
  testimonial: {
    content: string;
    authorName: string;
    authorCompany?: string;
    rating?: number;
    type: string;
  };
  moderator: {
    name: string;
    email: string;
  };
  createdAt: string;
}

const TestimonialCollectionDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");

  // Data states
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [campaigns, setCampaigns] = useState<TestimonialCampaign[]>([]);
  const [widgets, setWidgets] = useState<TestimonialWidget[]>([]);
  const [moderations, setModerations] = useState<TestimonialModeration[]>([]);
  const [stats, setStats] = useState<any>({});

  // Mock data for demonstration
  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock testimonials data
        setTestimonials([
          {
            id: '1',
            content: 'This platform has completely transformed how we handle our data analytics. The insights we get are incredible and have directly contributed to a 40% increase in our quarterly revenue.',
            rating: 5,
            headline: 'Game-changing analytics platform',
            authorName: 'Sarah Johnson',
            authorTitle: 'Chief Technology Officer',
            authorCompany: 'TechCorp Solutions',
            authorEmail: 'sarah@techcorp.com',
            authorImage: 'https://i.pinimg.com/originals/cc/07/83/cc0783c056d228fb5ea99d0993e54cde.jpg',
            type: 'text',
            format: 'medium',
            collectionMethod: 'email',
            status: 'approved',
            featured: true,
            published: true,
            publishedAt: '2024-01-15T10:00:00Z',
            viewCount: 1542,
            shareCount: 78,
            likeCount: 156,
            category: 'product',
            tags: ['analytics', 'revenue', 'insights'],
            widgetEnabled: true,
            customer: {
              companyName: 'TechCorp Solutions',
              logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100',
              industry: 'Technology',
              companySize: 'Enterprise'
            },
            story: {
              title: 'TechCorp\'s Digital Transformation',
              industry: 'Technology',
              useCase: 'Analytics'
            },
            createdAt: '2024-01-10T09:00:00Z',
            updatedAt: '2024-01-15T10:00:00Z'
          },
          {
            id: '2',
            content: 'The customer support team is exceptional. They helped us implement the solution in record time and provided ongoing support that exceeded our expectations.',
            rating: 5,
            authorName: 'Michael Chen',
            authorTitle: 'Operations Manager',
            authorCompany: 'RetailMax Inc.',
            authorEmail: 'michael@retailmax.com',
            authorImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
            type: 'video',
            format: 'short',
            videoUrl: 'https://example.com/testimonial2.mp4',
            collectionMethod: 'interview',
            status: 'pending',
            featured: false,
            published: false,
            viewCount: 0,
            shareCount: 0,
            likeCount: 0,
            category: 'support',
            tags: ['support', 'implementation', 'service'],
            widgetEnabled: false,
            customer: {
              companyName: 'RetailMax Inc.',
              logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100',
              industry: 'Retail',
              companySize: 'Large'
            },
            createdAt: '2024-01-20T14:30:00Z',
            updatedAt: '2024-01-20T14:30:00Z'
          }
        ]);

        // Mock campaigns data
        setCampaigns([
          {
            id: '1',
            name: 'Q1 2024 Customer Feedback Campaign',
            description: 'Collecting testimonials from enterprise customers for marketing materials',
            purpose: 'website-refresh',
            type: 'email',
            method: 'automated',
            startDate: '2024-01-01T00:00:00Z',
            endDate: '2024-03-31T23:59:59Z',
            automated: true,
            sent: 250,
            opened: 178,
            responded: 67,
            completed: 45,
            approved: 32,
            status: 'active'
          },
          {
            id: '2',
            name: 'New Feature Launch Testimonials',
            description: 'Gathering feedback on our latest AI features',
            purpose: 'product-launch',
            type: 'survey',
            method: 'manual',
            startDate: '2024-02-01T00:00:00Z',
            endDate: '2024-02-29T23:59:59Z',
            automated: false,
            sent: 100,
            opened: 85,
            responded: 42,
            completed: 38,
            approved: 25,
            status: 'completed'
          }
        ]);

        // Mock widgets data
        setWidgets([
          {
            id: '1',
            name: 'Homepage Testimonial Slider',
            description: 'Main testimonial carousel for the homepage',
            type: 'slider',
            displayCount: 3,
            autoRotate: true,
            rotateInterval: 5000,
            theme: 'modern',
            primaryColor: '#0066cc',
            backgroundColor: '#ffffff',
            websiteUrl: 'https://example.com',
            installCount: 1,
            viewCount: 15678,
            active: true,
            published: true,
            embedCode: '<script src="https://example.com/testimonial-widget.js" data-widget-id="1"></script>'
          },
          {
            id: '2',
            name: 'Product Page Grid',
            description: 'Grid layout for product-specific testimonials',
            type: 'grid',
            displayCount: 6,
            autoRotate: false,
            rotateInterval: 0,
            theme: 'minimal',
            primaryColor: '#22c55e',
            backgroundColor: '#f9fafb',
            installCount: 0,
            viewCount: 0,
            active: false,
            published: false
          }
        ]);

        // Mock moderations data
        setModerations([
          {
            id: '1',
            action: 'approve',
            status: 'completed',
            reason: 'High quality testimonial with verified metrics',
            notes: 'Excellent testimonial showcasing clear ROI',
            qualityScore: 9,
            credibilityScore: 10,
            usabilityScore: 8,
            testimonial: {
              content: 'This platform has completely transformed...',
              authorName: 'Sarah Johnson',
              authorCompany: 'TechCorp Solutions',
              rating: 5,
              type: 'text'
            },
            moderator: {
              name: 'John Admin',
              email: 'john@example.com'
            },
            createdAt: '2024-01-15T09:00:00Z'
          }
        ]);

        // Mock stats
        setStats({
          totalTestimonials: 156,
          pendingReview: 23,
          approvedTestimonials: 108,
          averageRating: 4.7,
          totalCampaigns: 8,
          activeCampaigns: 3,
          totalWidgets: 12,
          activeWidgets: 7,
          totalViews: 45678,
          conversionRate: 18.5,
          satisfactionScore: 92
        });

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimonial.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimonial.authorCompany?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || testimonial.status === statusFilter;
    const matchesType = typeFilter === "all" || testimonial.type === typeFilter;
    const matchesRating = ratingFilter === "all" || 
                         (ratingFilter === "5" && testimonial.rating === 5) ||
                         (ratingFilter === "4" && testimonial.rating === 4) ||
                         (ratingFilter === "3" && testimonial.rating && testimonial.rating <= 3);
    
    return matchesSearch && matchesStatus && matchesType && matchesRating;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'needs-review': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Mic className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Testimonials</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalTestimonials}</p>
                <p className="text-xs text-blue-500 mt-1">{stats.pendingReview} pending review</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Average Rating</p>
                <p className="text-3xl font-bold text-green-900">{stats.averageRating}</p>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3 w-3 ${i < Math.floor(stats.averageRating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
              <Star className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Active Campaigns</p>
                <p className="text-3xl font-bold text-purple-900">{stats.activeCampaigns}</p>
                <p className="text-xs text-purple-500 mt-1">{stats.totalCampaigns} total campaigns</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-orange-900">{stats.conversionRate}%</p>
                <p className="text-xs text-orange-500 mt-1">Collection to approval</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Testimonials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Recent Testimonials
          </CardTitle>
          <CardDescription>Latest customer feedback and testimonials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testimonials.slice(0, 3).map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {testimonial.authorImage && (
                    <img
                      src={testimonial.authorImage}
                      alt={testimonial.authorName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-semibold text-sm">{testimonial.authorName}</h4>
                        {testimonial.authorTitle && (
                          <p className="text-xs text-gray-600">{testimonial.authorTitle}</p>
                        )}
                        {testimonial.authorCompany && (
                          <p className="text-xs text-gray-500">{testimonial.authorCompany}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {testimonial.rating && (
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-3 w-3 ${i < testimonial.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        )}
                        <Badge className={getStatusColor(testimonial.status)}>
                          {testimonial.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">{testimonial.content}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        {getTypeIcon(testimonial.type)}
                        {testimonial.type}
                      </span>
                      <span>{new Date(testimonial.createdAt).toLocaleDateString()}</span>
                      {testimonial.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-500" />
              Campaign Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.slice(0, 2).map((campaign) => (
                <div key={campaign.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">{campaign.name}</h4>
                    <Badge className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{campaign.sent}</p>
                      <p className="text-xs text-gray-600">Sent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{campaign.responded}</p>
                      <p className="text-xs text-gray-600">Responded</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{campaign.approved}</p>
                      <p className="text-xs text-gray-600">Approved</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Response Rate</span>
                      <span>{Math.round((campaign.responded / campaign.sent) * 100)}%</span>
                    </div>
                    <Progress value={(campaign.responded / campaign.sent) * 100} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-green-500" />
              Widget Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {widgets.filter(w => w.active).map((widget) => (
                <div key={widget.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm">{widget.name}</h4>
                    <Badge className="bg-blue-100 text-blue-800">{widget.type}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-xl font-bold text-blue-600">{widget.viewCount.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">Views</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-green-600">{widget.installCount}</p>
                      <p className="text-xs text-gray-600">Installs</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const TestimonialsTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search testimonials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="needs-review">Needs Review</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars & Below</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Testimonial
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTestimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {testimonial.authorImage && (
                      <img
                        src={testimonial.authorImage}
                        alt={testimonial.authorName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-sm">{testimonial.authorName}</h3>
                      {testimonial.authorTitle && (
                        <p className="text-xs text-gray-600">{testimonial.authorTitle}</p>
                      )}
                      {testimonial.authorCompany && (
                        <p className="text-xs text-gray-500">{testimonial.authorCompany}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(testimonial.type)}
                    <Badge className={getStatusColor(testimonial.status)}>
                      {testimonial.status}
                    </Badge>
                  </div>
                </div>

                {testimonial.headline && (
                  <h4 className="font-semibold text-sm mb-2">{testimonial.headline}</h4>
                )}

                <blockquote className="text-sm text-gray-700 line-clamp-4 mb-4 italic">
                  "{testimonial.content}"
                </blockquote>

                {testimonial.rating && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < testimonial.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{testimonial.rating}/5</span>
                  </div>
                )}

                {testimonial.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {testimonial.tags.slice(0, 3).map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {testimonial.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {testimonial.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      {testimonial.shareCount}
                    </span>
                  </div>
                  <span className="text-xs">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {testimonial.status === 'pending' && (
                    <Button variant="outline" size="sm">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const CampaignsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Testimonial Campaigns</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{campaign.name}</h3>
                    {campaign.description && (
                      <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                    )}
                  </div>
                  <Badge className={campaign.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {campaign.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Type</p>
                    <div className="flex items-center gap-2">
                      {campaign.type === 'email' && <Mail className="h-4 w-4 text-blue-500" />}
                      {campaign.type === 'survey' && <FileText className="h-4 w-4 text-green-500" />}
                      <span className="text-sm font-medium capitalize">{campaign.type}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Method</p>
                    <div className="flex items-center gap-2">
                      {campaign.automated && <Zap className="h-4 w-4 text-yellow-500" />}
                      <span className="text-sm font-medium capitalize">{campaign.method}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{campaign.sent}</p>
                    <p className="text-xs text-blue-600">Sent</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{campaign.responded}</p>
                    <p className="text-xs text-green-600">Responded</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">{campaign.completed}</p>
                    <p className="text-xs text-purple-600">Completed</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-lg font-bold text-orange-600">{campaign.approved}</p>
                    <p className="text-xs text-orange-600">Approved</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span>Response Rate</span>
                    <span>{Math.round((campaign.responded / campaign.sent) * 100)}%</span>
                  </div>
                  <Progress value={(campaign.responded / campaign.sent) * 100} className="h-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span>Completion Rate</span>
                    <span>{Math.round((campaign.completed / campaign.responded) * 100)}%</span>
                  </div>
                  <Progress value={(campaign.completed / campaign.responded) * 100} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Started: {new Date(campaign.startDate).toLocaleDateString()}</span>
                  {campaign.endDate && (
                    <span>Ends: {new Date(campaign.endDate).toLocaleDateString()}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const WidgetsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Testimonial Widgets</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Widget
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {widgets.map((widget) => (
          <motion.div
            key={widget.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{widget.name}</h3>
                    {widget.description && (
                      <p className="text-sm text-gray-600 mt-1">{widget.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={widget.type === 'slider' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                      {widget.type}
                    </Badge>
                    <Badge className={widget.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {widget.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">{widget.viewCount.toLocaleString()}</p>
                    <p className="text-xs text-blue-600">Views</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{widget.installCount}</p>
                    <p className="text-xs text-green-600">Installs</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Display Count</span>
                    <span className="font-medium">{widget.displayCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Auto Rotate</span>
                    <Badge variant={widget.autoRotate ? "default" : "secondary"}>
                      {widget.autoRotate ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Theme</span>
                    <span className="font-medium capitalize">{widget.theme}</span>
                  </div>
                </div>

                {widget.websiteUrl && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-600 mb-1">Website</p>
                    <p className="text-sm text-blue-600 truncate">{widget.websiteUrl}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Code className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const ModerationTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Testimonial Moderation</h3>
        <div className="flex items-center gap-2">
          <Badge className="bg-yellow-100 text-yellow-800">
            {stats.pendingReview} Pending Review
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {moderations.map((moderation) => (
          <motion.div
            key={moderation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-sm">
                          {moderation.testimonial.authorName}
                          {moderation.testimonial.authorCompany && (
                            <span className="text-gray-500"> • {moderation.testimonial.authorCompany}</span>
                          )}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {getTypeIcon(moderation.testimonial.type)}
                          <span className="text-xs text-gray-600 capitalize">{moderation.testimonial.type}</span>
                          {moderation.testimonial.rating && (
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-3 w-3 ${i < moderation.testimonial.rating! ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge className={moderation.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {moderation.status}
                      </Badge>
                    </div>

                    <blockquote className="text-sm text-gray-700 italic mb-3 line-clamp-3">
                      "{moderation.testimonial.content}"
                    </blockquote>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      {moderation.qualityScore && (
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <p className="text-lg font-bold text-blue-600">{moderation.qualityScore}</p>
                          <p className="text-xs text-blue-600">Quality</p>
                        </div>
                      )}
                      {moderation.credibilityScore && (
                        <div className="text-center p-2 bg-green-50 rounded">
                          <p className="text-lg font-bold text-green-600">{moderation.credibilityScore}</p>
                          <p className="text-xs text-green-600">Credibility</p>
                        </div>
                      )}
                      {moderation.usabilityScore && (
                        <div className="text-center p-2 bg-purple-50 rounded">
                          <p className="text-lg font-bold text-purple-600">{moderation.usabilityScore}</p>
                          <p className="text-xs text-purple-600">Usability</p>
                        </div>
                      )}
                    </div>

                    {moderation.notes && (
                      <div className="bg-gray-50 rounded p-3 mb-3">
                        <p className="text-xs text-gray-600 mb-1">Moderator Notes</p>
                        <p className="text-sm">{moderation.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Moderated by {moderation.moderator.name}</span>
                      <span>{new Date(moderation.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Testimonial Collection System</h1>
          <p className="text-gray-600 mt-2">Collect, manage, and showcase customer testimonials</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="testimonials">
          <TestimonialsTab />
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignsTab />
        </TabsContent>

        <TabsContent value="widgets">
          <WidgetsTab />
        </TabsContent>

        <TabsContent value="moderation">
          <ModerationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestimonialCollectionDashboard;
