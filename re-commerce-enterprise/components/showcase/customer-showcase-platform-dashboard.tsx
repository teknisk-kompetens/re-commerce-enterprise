
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Star,
  TrendingUp,
  Award,
  Building2,
  Globe,
  Eye,
  Share2,
  Heart,
  Camera,
  Video,
  FileText,
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
  Lightbulb,
  PlayCircle,
  Image
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CustomerSuccessStory {
  id: string;
  title: string;
  description: string;
  industry: string;
  companySize: string;
  useCase: string;
  heroImage?: string;
  videoUrl?: string;
  featured: boolean;
  verified: boolean;
  published: boolean;
  viewCount: number;
  shareCount: number;
  likeCount: number;
  keyMetrics: any[];
  customer?: {
    companyName: string;
    logoUrl?: string;
    industry: string;
    companySize: string;
  };
  author?: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CustomerProfile {
  id: string;
  companyName: string;
  industry: string;
  companySize: string;
  logoUrl?: string;
  advocacyScore: number;
  allowShowcase: boolean;
  allowTestimonials: boolean;
  allowCaseStudies: boolean;
  _count: {
    successStories: number;
    testimonials: number;
    referrals: number;
    achievements: number;
  };
}

interface CustomerSpotlight {
  id: string;
  title: string;
  description: string;
  heroImage?: string;
  quote?: string;
  quotee?: string;
  quoteeTitle?: string;
  scheduledFor?: string;
  publishedAt?: string;
  featured: boolean;
  published: boolean;
  customer: {
    companyName: string;
    logoUrl?: string;
    industry: string;
  };
}

interface IndustryShowcase {
  id: string;
  industry: string;
  title: string;
  description: string;
  marketSize?: string;
  growthRate?: string;
  averageROI?: number;
  heroImage?: string;
  featured: boolean;
  published: boolean;
  viewCount: number;
}

const CustomerShowcasePlatformDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [sizeFilter, setSizeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Data states
  const [successStories, setSuccessStories] = useState<CustomerSuccessStory[]>([]);
  const [customerProfiles, setCustomerProfiles] = useState<CustomerProfile[]>([]);
  const [spotlights, setSpotlights] = useState<CustomerSpotlight[]>([]);
  const [industryShowcases, setIndustryShowcases] = useState<IndustryShowcase[]>([]);
  const [stats, setStats] = useState<any>({});

  // Mock data for demonstration
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API calls
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock success stories data
        setSuccessStories([
          {
            id: '1',
            title: 'TechCorp Increases Revenue by 250% with AI-Powered Analytics',
            description: 'How TechCorp transformed their business operations using our platform',
            industry: 'Technology',
            companySize: 'Enterprise',
            useCase: 'Business Intelligence',
            heroImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
            videoUrl: 'https://example.com/video1',
            featured: true,
            verified: true,
            published: true,
            viewCount: 2847,
            shareCount: 156,
            likeCount: 89,
            keyMetrics: [
              { metric: 'Revenue Growth', value: '+250%', period: '12 months' },
              { metric: 'Efficiency Gain', value: '+85%', period: '6 months' },
              { metric: 'ROI', value: '380%', period: 'Annual' }
            ],
            customer: {
              companyName: 'TechCorp Solutions',
              logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
              industry: 'Technology',
              companySize: 'Enterprise'
            },
            author: { name: 'Sarah Johnson', email: 'sarah@example.com' },
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-01-20T14:30:00Z'
          },
          {
            id: '2',
            title: 'RetailMax Optimizes Supply Chain, Saves $2.3M Annually',
            description: 'Supply chain transformation delivers massive cost savings',
            industry: 'Retail',
            companySize: 'Large',
            useCase: 'Supply Chain',
            heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
            featured: false,
            verified: true,
            published: true,
            viewCount: 1965,
            shareCount: 78,
            likeCount: 45,
            keyMetrics: [
              { metric: 'Cost Savings', value: '$2.3M', period: 'Annual' },
              { metric: 'Delivery Time', value: '-40%', period: 'Average' },
              { metric: 'Inventory Reduction', value: '-25%', period: 'Overall' }
            ],
            customer: {
              companyName: 'RetailMax Inc.',
              logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200',
              industry: 'Retail',
              companySize: 'Large'
            },
            author: { name: 'Mike Chen', email: 'mike@example.com' },
            createdAt: '2024-01-10T09:15:00Z',
            updatedAt: '2024-01-18T16:45:00Z'
          }
        ]);

        // Mock customer profiles data
        setCustomerProfiles([
          {
            id: '1',
            companyName: 'TechCorp Solutions',
            industry: 'Technology',
            companySize: 'Enterprise',
            logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
            advocacyScore: 92,
            allowShowcase: true,
            allowTestimonials: true,
            allowCaseStudies: true,
            _count: { successStories: 3, testimonials: 8, referrals: 5, achievements: 12 }
          },
          {
            id: '2',
            companyName: 'RetailMax Inc.',
            industry: 'Retail',
            companySize: 'Large',
            logoUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=200',
            advocacyScore: 85,
            allowShowcase: true,
            allowTestimonials: false,
            allowCaseStudies: true,
            _count: { successStories: 2, testimonials: 3, referrals: 2, achievements: 7 }
          }
        ]);

        // Mock spotlights data
        setSpotlights([
          {
            id: '1',
            title: 'Customer Spotlight: TechCorp\'s Digital Transformation',
            description: 'Featuring TechCorp\'s journey to becoming a data-driven organization',
            heroImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
            quote: 'This platform has revolutionized how we make decisions. The insights we get are incredible.',
            quotee: 'John Smith',
            quoteeTitle: 'CTO',
            scheduledFor: '2024-02-01T10:00:00Z',
            featured: true,
            published: false,
            customer: {
              companyName: 'TechCorp Solutions',
              logoUrl: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
              industry: 'Technology'
            }
          }
        ]);

        // Mock industry showcases data
        setIndustryShowcases([
          {
            id: '1',
            industry: 'Technology',
            title: 'Technology Sector Transformation',
            description: 'How technology companies are leveraging our platform for growth',
            marketSize: '$2.5T',
            growthRate: '15.2%',
            averageROI: 285,
            heroImage: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800',
            featured: true,
            published: true,
            viewCount: 3456
          },
          {
            id: '2',
            industry: 'Retail',
            title: 'Retail Innovation Hub',
            description: 'Retail industry success stories and transformation case studies',
            marketSize: '$1.8T',
            growthRate: '8.7%',
            averageROI: 195,
            heroImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800',
            featured: false,
            published: true,
            viewCount: 2134
          }
        ]);

        // Mock stats
        setStats({
          totalStories: 247,
          totalCustomers: 89,
          totalViews: 156789,
          averageROI: 285,
          featuredStories: 15,
          verifiedStories: 198,
          industryCount: 12,
          monthlyGrowth: 23.5
        });

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredStories = successStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.customer?.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = !industryFilter || story.industry === industryFilter;
    const matchesSize = !sizeFilter || story.companySize === sizeFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "featured" && story.featured) ||
                         (statusFilter === "verified" && story.verified) ||
                         (statusFilter === "published" && story.published);
    
    return matchesSearch && matchesIndustry && matchesSize && matchesStatus;
  });

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Success Stories</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalStories}</p>
                <p className="text-xs text-blue-500 mt-1">+{stats.monthlyGrowth}% this month</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Customer Profiles</p>
                <p className="text-3xl font-bold text-green-900">{stats.totalCustomers}</p>
                <p className="text-xs text-green-500 mt-1">{stats.industryCount} industries</p>
              </div>
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Views</p>
                <p className="text-3xl font-bold text-purple-900">{stats.totalViews?.toLocaleString()}</p>
                <p className="text-xs text-purple-500 mt-1">Avg {Math.round(stats.totalViews / stats.totalStories)} per story</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Average ROI</p>
                <p className="text-3xl font-bold text-orange-900">{stats.averageROI}%</p>
                <p className="text-xs text-orange-500 mt-1">Across all stories</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Success Stories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Featured Success Stories
          </CardTitle>
          <CardDescription>Our most impactful customer success stories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {successStories.filter(story => story.featured).map((story) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {story.heroImage && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={story.heroImage}
                        alt={story.title}
                        className="w-full h-full object-cover"
                      />
                      {story.videoUrl && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <PlayCircle className="h-6 w-6 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm line-clamp-2">{story.title}</h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {story.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {story.featured && <Star className="h-4 w-4 text-yellow-500" />}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{story.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {story.viewCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {story.likeCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        {story.shareCount}
                      </span>
                    </div>
                    {story.keyMetrics && story.keyMetrics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {story.keyMetrics.slice(0, 2).map((metric, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {metric.metric}: {metric.value}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New success story published</p>
                <p className="text-xs text-gray-600">TechCorp's AI transformation story went live</p>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Customer spotlight scheduled</p>
                <p className="text-xs text-gray-600">RetailMax spotlight scheduled for next week</p>
              </div>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Industry showcase updated</p>
                <p className="text-xs text-gray-600">Technology sector metrics refreshed</p>
              </div>
              <span className="text-xs text-gray-500">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SuccessStoriesTab = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search success stories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Company Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Sizes</SelectItem>
                  <SelectItem value="Startup">Startup</SelectItem>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Large">Large</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stories</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Story
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Success Stories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStories.map((story) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow h-full">
              <div className="relative">
                {story.heroImage && (
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={story.heroImage}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    {story.videoUrl && (
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                        <PlayCircle className="h-12 w-12 text-white" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                      {story.featured && (
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {story.verified && (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-semibold line-clamp-2 flex-1">{story.title}</h3>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{story.description}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  {story.customer?.logoUrl && (
                    <img
                      src={story.customer.logoUrl}
                      alt={story.customer.companyName}
                      className="w-8 h-8 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">{story.customer?.companyName}</p>
                    <p className="text-xs text-gray-500">{story.industry} • {story.companySize}</p>
                  </div>
                </div>

                {story.keyMetrics && story.keyMetrics.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {story.keyMetrics.slice(0, 2).map((metric, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{metric.metric}</span>
                        <span className="font-semibold text-green-600">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {story.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      {story.likeCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-4 w-4" />
                      {story.shareCount}
                    </span>
                  </div>
                  <span className="text-xs">
                    {new Date(story.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredStories.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No success stories found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms.</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Success Story
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const CustomerProfilesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {customerProfiles.map((profile) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {profile.logoUrl && (
                      <img
                        src={profile.logoUrl}
                        alt={profile.companyName}
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{profile.companyName}</h3>
                      <p className="text-sm text-gray-600">{profile.industry}</p>
                    </div>
                  </div>
                  <Badge variant={profile.advocacyScore >= 80 ? "default" : "secondary"}>
                    {profile.advocacyScore}/100
                  </Badge>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Advocacy Score</span>
                    <span className="font-medium">{profile.advocacyScore}%</span>
                  </div>
                  <Progress value={profile.advocacyScore} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{profile._count.successStories}</p>
                    <p className="text-xs text-blue-600">Success Stories</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{profile._count.testimonials}</p>
                    <p className="text-xs text-green-600">Testimonials</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{profile._count.referrals}</p>
                    <p className="text-xs text-purple-600">Referrals</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{profile._count.achievements}</p>
                    <p className="text-xs text-orange-600">Achievements</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Showcase Allowed</span>
                    <Badge variant={profile.allowShowcase ? "default" : "secondary"}>
                      {profile.allowShowcase ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Testimonials</span>
                    <Badge variant={profile.allowTestimonials ? "default" : "secondary"}>
                      {profile.allowTestimonials ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Case Studies</span>
                    <Badge variant={profile.allowCaseStudies ? "default" : "secondary"}>
                      {profile.allowCaseStudies ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
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

  const SpotlightsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {spotlights.map((spotlight) => (
          <motion.div
            key={spotlight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <div className="relative">
                {spotlight.heroImage && (
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={spotlight.heroImage}
                      alt={spotlight.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      {spotlight.featured && (
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">{spotlight.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{spotlight.description}</p>
                
                {spotlight.quote && (
                  <blockquote className="border-l-4 border-blue-500 pl-4 mb-4">
                    <p className="text-sm italic text-gray-700">"{spotlight.quote}"</p>
                    {spotlight.quotee && (
                      <footer className="text-xs text-gray-500 mt-2">
                        — {spotlight.quotee}
                        {spotlight.quoteeTitle && `, ${spotlight.quoteeTitle}`}
                      </footer>
                    )}
                  </blockquote>
                )}

                <div className="flex items-center gap-2 mb-4">
                  {spotlight.customer.logoUrl && (
                    <img
                      src={spotlight.customer.logoUrl}
                      alt={spotlight.customer.companyName}
                      className="w-8 h-8 rounded object-cover"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium">{spotlight.customer.companyName}</p>
                    <p className="text-xs text-gray-500">{spotlight.customer.industry}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {spotlight.scheduledFor ? (
                      <span>Scheduled: {new Date(spotlight.scheduledFor).toLocaleDateString()}</span>
                    ) : (
                      <span>Draft</span>
                    )}
                  </div>
                  <Badge variant={spotlight.published ? "default" : "secondary"}>
                    {spotlight.published ? "Published" : "Draft"}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const IndustryShowcasesTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {industryShowcases.map((showcase) => (
          <motion.div
            key={showcase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <div className="relative">
                {showcase.heroImage && (
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={showcase.heroImage}
                      alt={showcase.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      {showcase.featured && (
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{showcase.title}</h3>
                  <Badge variant="outline">{showcase.industry}</Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">{showcase.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {showcase.marketSize && (
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{showcase.marketSize}</p>
                      <p className="text-xs text-blue-600">Market Size</p>
                    </div>
                  )}
                  {showcase.growthRate && (
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{showcase.growthRate}</p>
                      <p className="text-xs text-green-600">Growth Rate</p>
                    </div>
                  )}
                  {showcase.averageROI && (
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">{showcase.averageROI}%</p>
                      <p className="text-xs text-purple-600">Avg ROI</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{showcase.viewCount} views</span>
                  </div>
                  <Badge variant={showcase.published ? "default" : "secondary"}>
                    {showcase.published ? "Published" : "Draft"}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Showcase
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
          <h1 className="text-3xl font-bold text-gray-900">Customer Showcase Platform</h1>
          <p className="text-gray-600 mt-2">Manage success stories, customer profiles, and industry showcases</p>
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
            Create Content
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stories">Success Stories</TabsTrigger>
          <TabsTrigger value="customers">Customer Profiles</TabsTrigger>
          <TabsTrigger value="spotlights">Spotlights</TabsTrigger>
          <TabsTrigger value="industry">Industry Showcases</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="stories">
          <SuccessStoriesTab />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerProfilesTab />
        </TabsContent>

        <TabsContent value="spotlights">
          <SpotlightsTab />
        </TabsContent>

        <TabsContent value="industry">
          <IndustryShowcasesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerShowcasePlatformDashboard;
