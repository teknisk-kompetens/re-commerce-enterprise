
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  BarChart3,
  Share2,
  Download,
  Eye,
  Star,
  Award,
  Calendar,
  Clock,
  Filter,
  Search,
  Plus,
  Edit,
  ExternalLink,
  ChevronRight,
  Upload,
  Settings,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  Bookmark,
  Copy,
  Building2,
  Globe,
  TrendingUp,
  Activity,
  MessageSquare,
  ThumbsUp,
  Heart,
  Flag,
  Code,
  Layers,
  PieChart,
  LineChart,
  PlayCircle,
  Pause,
  Send,
  Mail,
  Phone,
  MapPin,
  Hash,
  Percent,
  DollarSign,
  Timer,
  RefreshCw,
  Sparkles,
  Rocket,
  Lightbulb,
  Palette,
  Layout,
  Image,
  Video,
  Mic,
  Link,
  GitBranch,
  GitCommit,
  Users2,
  Crown,
  Medal,
  Trophy,
  Coins
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Import recharts for data visualization
import {
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  Bar,
  Pie,
  Area,
  AreaChart
} from 'recharts';

interface CaseStudyTemplate {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  useCase?: string;
  companySize?: string;
  templateType: string;
  difficulty: string;
  estimatedTime?: string;
  usageCount: number;
  rating: number;
  ratingCount: number;
  featured: boolean;
  public: boolean;
  premium: boolean;
  price: number;
  currency: string;
  version: string;
  sections: any[];
  fields: any[];
  layout: any;
  previewImages: string[];
  tags: string[];
  _count: {
    collaborations: number;
    analytics: number;
    distributions: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface CaseStudyCollaboration {
  id: string;
  title: string;
  description?: string;
  objective?: string;
  type: string;
  accessLevel: string;
  contentStatus: string;
  currentVersion: string;
  progress: number;
  participants: any[];
  status: 'active' | 'paused' | 'completed' | 'cancelled';
  targetCompletion?: string;
  actualCompletion?: string;
  template?: {
    name: string;
    industry?: string;
    templateType: string;
  };
  initiator: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CaseStudyAnalytics {
  id: string;
  templateId?: string;
  collaborationId?: string;
  viewCount: number;
  downloadCount: number;
  shareCount: number;
  completionRate: number;
  averageRating: number;
  conversionRate: number;
  engagementScore: number;
  bounceRate: number;
  timeSpent: number;
  demographics: any;
  sources: any[];
  devices: any[];
  geography: any[];
  period: string;
  startDate: string;
  endDate: string;
}

interface CaseStudyDistribution {
  id: string;
  title: string;
  description?: string;
  channels: string[];
  status: 'draft' | 'scheduled' | 'published' | 'paused';
  publishedAt?: string;
  scheduledFor?: string;
  impressions: number;
  clicks: number;
  conversions: number;
  engagement: number;
  reach: number;
  socialShares: number;
  emailOpens: number;
  websiteViews: number;
  leadGeneration: number;
}

const CaseStudyMarketplaceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Data states
  const [templates, setTemplates] = useState<CaseStudyTemplate[]>([]);
  const [collaborations, setCollaborations] = useState<CaseStudyCollaboration[]>([]);
  const [analytics, setAnalytics] = useState<CaseStudyAnalytics[]>([]);
  const [distributions, setDistributions] = useState<CaseStudyDistribution[]>([]);
  const [stats, setStats] = useState<any>({});

  // Chart colors
  const chartColors = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', '#80D8C3', '#A19AD3', '#72BF78'];

  // Mock data for demonstration
  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock templates data
        setTemplates([
          {
            id: '1',
            name: 'Enterprise Digital Transformation Case Study',
            description: 'Comprehensive template for documenting digital transformation initiatives',
            industry: 'Technology',
            useCase: 'Digital Transformation',
            companySize: 'Enterprise',
            templateType: 'comprehensive',
            difficulty: 'medium',
            estimatedTime: '2-3 hours',
            usageCount: 45,
            rating: 4.8,
            ratingCount: 23,
            featured: true,
            public: true,
            premium: false,
            price: 0,
            currency: 'USD',
            version: '2.1',
            sections: [
              'Executive Summary',
              'Challenge Overview',
              'Solution Implementation',
              'Results & Metrics',
              'Lessons Learned'
            ],
            fields: ['industry', 'companySize', 'timeline', 'budget', 'roi'],
            layout: { type: 'structured', columns: 2 },
            previewImages: [
              'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400',
              'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'
            ],
            tags: ['digital-transformation', 'enterprise', 'technology'],
            _count: {
              collaborations: 12,
              analytics: 8,
              distributions: 15
            },
            createdAt: '2023-09-15T00:00:00Z',
            updatedAt: '2024-01-10T00:00:00Z'
          },
          {
            id: '2',
            name: 'Retail Customer Experience Optimization',
            description: 'Template for retail customer experience improvement projects',
            industry: 'Retail',
            useCase: 'Customer Experience',
            companySize: 'Large',
            templateType: 'focused',
            difficulty: 'easy',
            estimatedTime: '1-2 hours',
            usageCount: 28,
            rating: 4.5,
            ratingCount: 16,
            featured: false,
            public: true,
            premium: true,
            price: 99,
            currency: 'USD',
            version: '1.3',
            sections: [
              'Current State Analysis',
              'Customer Journey Mapping',
              'Implementation Strategy',
              'Impact Measurement'
            ],
            fields: ['customerSatisfaction', 'conversionRate', 'revenue'],
            layout: { type: 'visual', columns: 1 },
            previewImages: [
              'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
            ],
            tags: ['retail', 'customer-experience', 'optimization'],
            _count: {
              collaborations: 8,
              analytics: 5,
              distributions: 12
            },
            createdAt: '2023-11-20T00:00:00Z',
            updatedAt: '2024-01-05T00:00:00Z'
          },
          {
            id: '3',
            name: 'Startup Growth Strategy Case Study',
            description: 'Template for documenting startup growth and scaling initiatives',
            industry: 'Technology',
            useCase: 'Growth Strategy',
            companySize: 'Startup',
            templateType: 'agile',
            difficulty: 'hard',
            estimatedTime: '3-4 hours',
            usageCount: 15,
            rating: 4.9,
            ratingCount: 12,
            featured: true,
            public: true,
            premium: true,
            price: 149,
            currency: 'USD',
            version: '1.0',
            sections: [
              'Market Analysis',
              'Growth Hypothesis',
              'Experiment Design',
              'Results & Scaling'
            ],
            fields: ['marketSize', 'growthRate', 'userAcquisition', 'retention'],
            layout: { type: 'dynamic', columns: 3 },
            previewImages: [
              'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400'
            ],
            tags: ['startup', 'growth', 'strategy', 'scaling'],
            _count: {
              collaborations: 5,
              analytics: 3,
              distributions: 8
            },
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z'
          }
        ]);

        // Mock collaborations data
        setCollaborations([
          {
            id: '1',
            title: 'TechCorp Digital Transformation Case Study',
            description: 'Documenting TechCorp\'s complete digital transformation journey',
            objective: 'Create comprehensive case study for marketing and sales enablement',
            type: 'customer',
            accessLevel: 'private',
            contentStatus: 'in-progress',
            currentVersion: '1.2',
            progress: 65,
            participants: [
              { name: 'Sarah Johnson', role: 'Customer Success Manager', avatar: 'SJ' },
              { name: 'Mike Chen', role: 'Technical Writer', avatar: 'MC' },
              { name: 'Lisa Wang', role: 'Designer', avatar: 'LW' }
            ],
            status: 'active',
            targetCompletion: '2024-02-15T00:00:00Z',
            template: {
              name: 'Enterprise Digital Transformation Case Study',
              industry: 'Technology',
              templateType: 'comprehensive'
            },
            initiator: {
              name: 'Sarah Johnson',
              email: 'sarah@company.com'
            },
            createdAt: '2024-01-10T00:00:00Z',
            updatedAt: '2024-01-20T14:30:00Z'
          },
          {
            id: '2',
            title: 'RetailMax Customer Experience Case Study',
            description: 'Showcasing RetailMax\'s customer experience optimization results',
            objective: 'Demonstrate platform impact on customer satisfaction and revenue',
            type: 'internal',
            accessLevel: 'team',
            contentStatus: 'review',
            currentVersion: '2.0',
            progress: 90,
            participants: [
              { name: 'John Smith', role: 'Account Manager', avatar: 'JS' },
              { name: 'Emma Davis', role: 'Content Strategist', avatar: 'ED' }
            ],
            status: 'active',
            targetCompletion: '2024-01-30T00:00:00Z',
            template: {
              name: 'Retail Customer Experience Optimization',
              industry: 'Retail',
              templateType: 'focused'
            },
            initiator: {
              name: 'John Smith',
              email: 'john@company.com'
            },
            createdAt: '2023-12-15T00:00:00Z',
            updatedAt: '2024-01-18T16:45:00Z'
          }
        ]);

        // Mock analytics data
        setAnalytics([
          {
            id: '1',
            templateId: '1',
            viewCount: 1250,
            downloadCount: 89,
            shareCount: 34,
            completionRate: 72,
            averageRating: 4.8,
            conversionRate: 15.6,
            engagementScore: 78,
            bounceRate: 22,
            timeSpent: 12.5,
            demographics: {
              industries: { Technology: 45, Retail: 25, Finance: 20, Other: 10 },
              companySizes: { Enterprise: 35, Large: 30, Medium: 25, Small: 10 }
            },
            sources: [
              { source: 'Website', visits: 450 },
              { source: 'Email', visits: 320 },
              { source: 'Social', visits: 280 },
              { source: 'Direct', visits: 200 }
            ],
            devices: [
              { device: 'Desktop', percentage: 65 },
              { device: 'Mobile', percentage: 25 },
              { device: 'Tablet', percentage: 10 }
            ],
            geography: [
              { country: 'United States', visits: 500 },
              { country: 'Canada', visits: 200 },
              { country: 'United Kingdom', visits: 180 },
              { country: 'Germany', visits: 150 }
            ],
            period: 'monthly',
            startDate: '2024-01-01T00:00:00Z',
            endDate: '2024-01-31T23:59:59Z'
          }
        ]);

        // Mock distributions data
        setDistributions([
          {
            id: '1',
            title: 'TechCorp Success Story - Multi-Channel Campaign',
            description: 'Comprehensive distribution of TechCorp\'s digital transformation case study',
            channels: ['website', 'email', 'social', 'sales-enablement'],
            status: 'published',
            publishedAt: '2024-01-15T10:00:00Z',
            impressions: 15400,
            clicks: 1850,
            conversions: 245,
            engagement: 8.2,
            reach: 12500,
            socialShares: 156,
            emailOpens: 3200,
            websiteViews: 890,
            leadGeneration: 67
          },
          {
            id: '2',
            title: 'Retail Excellence Showcase',
            description: 'Targeted distribution of retail customer experience case studies',
            channels: ['website', 'linkedin', 'industry-publications'],
            status: 'scheduled',
            scheduledFor: '2024-02-01T09:00:00Z',
            impressions: 0,
            clicks: 0,
            conversions: 0,
            engagement: 0,
            reach: 0,
            socialShares: 0,
            emailOpens: 0,
            websiteViews: 0,
            leadGeneration: 0
          }
        ]);

        // Mock stats
        setStats({
          totalTemplates: 24,
          featuredTemplates: 8,
          totalCollaborations: 15,
          activeCollaborations: 12,
          totalViews: 45600,
          totalDownloads: 2340,
          averageRating: 4.6,
          conversionRate: 14.2,
          monthlyGrowth: 22.5,
          premiumRevenue: 12450,
          topTemplate: 'Enterprise Digital Transformation Case Study',
          topIndustry: 'Technology'
        });

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesIndustry = industryFilter === "all" || template.industry === industryFilter;
    const matchesType = typeFilter === "all" || template.templateType === typeFilter;
    const matchesDifficulty = difficultyFilter === "all" || template.difficulty === difficultyFilter;
    
    return matchesSearch && matchesIndustry && matchesType && matchesDifficulty;
  });

  const filteredCollaborations = collaborations.filter(collaboration => {
    const matchesSearch = collaboration.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         collaboration.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || collaboration.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      case 'expert': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Sample chart data
  const templateUsageData = [
    { month: 'Sep', downloads: 120, views: 1800, collaborations: 8 },
    { month: 'Oct', downloads: 145, views: 2200, collaborations: 12 },
    { month: 'Nov', downloads: 180, views: 2800, collaborations: 15 },
    { month: 'Dec', downloads: 220, views: 3400, collaborations: 18 },
    { month: 'Jan', downloads: 280, views: 4200, collaborations: 22 }
  ];

  const industryDistributionData = [
    { industry: 'Technology', count: 12, color: chartColors[0] },
    { industry: 'Retail', count: 8, color: chartColors[1] },
    { industry: 'Finance', count: 6, color: chartColors[2] },
    { industry: 'Healthcare', count: 4, color: chartColors[3] },
    { industry: 'Manufacturing', count: 3, color: chartColors[4] },
    { industry: 'Other', count: 3, color: chartColors[5] }
  ];

  const collaborationProgressData = [
    { stage: 'Planning', completed: 15, total: 15 },
    { stage: 'Content Creation', completed: 12, total: 15 },
    { stage: 'Review', completed: 8, total: 15 },
    { stage: 'Approval', completed: 5, total: 15 },
    { stage: 'Distribution', completed: 3, total: 15 }
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Templates</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalTemplates}</p>
                <p className="text-xs text-blue-500 mt-1">{stats.featuredTemplates} featured</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Active Collaborations</p>
                <p className="text-3xl font-bold text-green-900">{stats.activeCollaborations}</p>
                <p className="text-xs text-green-500 mt-1">{stats.totalCollaborations} total</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Total Views</p>
                <p className="text-3xl font-bold text-purple-900">{(stats.totalViews / 1000).toFixed(0)}K</p>
                <p className="text-xs text-purple-500 mt-1">{stats.totalDownloads} downloads</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-orange-900">{stats.conversionRate}%</p>
                <p className="text-xs text-orange-500 mt-1">View to download</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Template Usage Trends
          </CardTitle>
          <CardDescription>Monthly template downloads, views, and collaboration starts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={templateUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  yAxisId="usage"
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Usage Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <YAxis 
                  yAxisId="views"
                  orientation="right"
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Views', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <Tooltip wrapperStyle={{ fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line 
                  yAxisId="usage"
                  type="monotone" 
                  dataKey="downloads" 
                  stroke={chartColors[0]} 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line 
                  yAxisId="usage"
                  type="monotone" 
                  dataKey="collaborations" 
                  stroke={chartColors[1]} 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line 
                  yAxisId="views"
                  type="monotone" 
                  dataKey="views" 
                  stroke={chartColors[2]} 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Industry Distribution and Collaboration Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              Templates by Industry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={industryDistributionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                    label={({ industry, count, percent }) => `${industry}: ${count} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {industryDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip wrapperStyle={{ fontSize: 11 }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Collaboration Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {collaborationProgressData.map((stage, index) => (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{stage.completed}/{stage.total}</span>
                      <Badge variant="secondary" className="text-xs">
                        {Math.round((stage.completed / stage.total) * 100)}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={(stage.completed / stage.total) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Featured Templates
          </CardTitle>
          <CardDescription>Most popular and highest-rated case study templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {templates.filter(t => t.featured).slice(0, 3).map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-sm line-clamp-2">{template.name}</h4>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-xs font-medium">{template.rating}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 mb-3">{template.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">{template.industry}</Badge>
                  <Badge className={getDifficultyColor(template.difficulty)} size="sm">
                    {template.difficulty}
                  </Badge>
                  {template.premium && (
                    <Badge className="bg-purple-100 text-purple-800 text-xs">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{template.usageCount} uses</span>
                  <span>{template.estimatedTime}</span>
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
            <Clock className="h-5 w-5 text-gray-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New template published</p>
                <p className="text-xs text-gray-600">Startup Growth Strategy Case Study template now available</p>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Collaboration completed</p>
                <p className="text-xs text-gray-600">RetailMax Customer Experience Case Study ready for distribution</p>
              </div>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">High engagement detected</p>
                <p className="text-xs text-gray-600">Enterprise Digital Transformation template reached 1K views</p>
              </div>
              <span className="text-xs text-gray-500">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const TemplatesTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
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
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive</SelectItem>
                  <SelectItem value="focused">Focused</SelectItem>
                  <SelectItem value="agile">Agile</SelectItem>
                  <SelectItem value="visual">Visual</SelectItem>
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow h-full">
              <div className="relative">
                {template.previewImages.length > 0 && (
                  <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={template.previewImages[0]}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      {template.featured && (
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {template.premium && (
                        <Badge className="bg-purple-500 text-white">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold line-clamp-2 flex-1">{template.name}</h3>
                  <div className="flex items-center gap-1 ml-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{template.rating}</span>
                    <span className="text-xs text-gray-500">({template.ratingCount})</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{template.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {template.industry && (
                    <Badge variant="outline" className="text-xs">{template.industry}</Badge>
                  )}
                  <Badge className={getDifficultyColor(template.difficulty)} size="sm">
                    {template.difficulty}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {template.templateType}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="text-sm font-bold text-blue-600">{template.usageCount}</p>
                    <p className="text-xs text-blue-600">Uses</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded">
                    <p className="text-sm font-bold text-green-600">{template._count.collaborations}</p>
                    <p className="text-xs text-green-600">Collaborations</p>
                  </div>
                  <div className="p-2 bg-purple-50 rounded">
                    <p className="text-sm font-bold text-purple-600">{template._count.distributions}</p>
                    <p className="text-xs text-purple-600">Distributions</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Version {template.version}</span>
                  <span>{template.estimatedTime}</span>
                  {template.premium && (
                    <span className="font-medium text-purple-600">${template.price}</span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const CollaborationTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search collaborations..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Start Collaboration
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Collaborations List */}
      <div className="space-y-6">
        {filteredCollaborations.map((collaboration) => (
          <motion.div
            key={collaboration.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{collaboration.title}</h3>
                    {collaboration.description && (
                      <p className="text-sm text-gray-600 mb-2">{collaboration.description}</p>
                    )}
                    {collaboration.objective && (
                      <p className="text-xs text-gray-500">{collaboration.objective}</p>
                    )}
                  </div>
                  <Badge className={getStatusColor(collaboration.status)}>
                    {collaboration.status}
                  </Badge>
                </div>

                {collaboration.template && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{collaboration.template.name}</p>
                      <p className="text-xs text-gray-500">
                        {collaboration.template.industry} • {collaboration.template.templateType}
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Progress</p>
                    <div className="flex items-center gap-2">
                      <Progress value={collaboration.progress} className="flex-1 h-2" />
                      <span className="text-sm font-medium">{collaboration.progress}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Participants</p>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {collaboration.participants.slice(0, 4).map((participant, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white"
                            title={participant.name}
                          >
                            {participant.avatar}
                          </div>
                        ))}
                        {collaboration.participants.length > 4 && (
                          <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                            +{collaboration.participants.length - 4}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">{collaboration.participants.length} members</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-2">Timeline</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>Started</span>
                        <span>{new Date(collaboration.createdAt).toLocaleDateString()}</span>
                      </div>
                      {collaboration.targetCompletion && (
                        <div className="flex items-center justify-between text-xs">
                          <span>Target</span>
                          <span>{new Date(collaboration.targetCompletion).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="text-xs capitalize">
                    {collaboration.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {collaboration.accessLevel}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    v{collaboration.currentVersion}
                  </Badge>
                  <Badge className={
                    collaboration.contentStatus === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    collaboration.contentStatus === 'review' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {collaboration.contentStatus}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Collaboration
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4" />
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
    </div>
  );

  const AnalyticsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Case Study Analytics</h3>
        <Button className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {analytics.map((analytic) => (
        <Card key={analytic.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Template Performance Analytics
            </CardTitle>
            <CardDescription>
              Performance metrics for the period: {new Date(analytic.startDate).toLocaleDateString()} - {new Date(analytic.endDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{analytic.viewCount.toLocaleString()}</p>
                <p className="text-sm text-blue-600">Total Views</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{analytic.downloadCount}</p>
                <p className="text-sm text-green-600">Downloads</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{analytic.conversionRate}%</p>
                <p className="text-sm text-purple-600">Conversion Rate</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{analytic.engagementScore}</p>
                <p className="text-sm text-orange-600">Engagement Score</p>
              </div>
            </div>

            {/* Detailed Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Traffic Sources</h4>
                <div className="space-y-3">
                  {analytic.sources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{source.source}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{source.visits}</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(source.visits / Math.max(...analytic.sources.map(s => s.visits))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Device Breakdown</h4>
                <div className="space-y-3">
                  {analytic.devices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{device.device}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{device.percentage}%</span>
                        <Progress value={device.percentage} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Industry Demographics</h4>
                <div className="space-y-3">
                  {Object.entries(analytic.demographics.industries).map(([industry, count]) => (
                    <div key={industry} className="flex items-center justify-between">
                      <span className="text-sm">{industry}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{count}%</span>
                        <Progress value={count as number} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Top Countries</h4>
                <div className="space-y-3">
                  {analytic.geography.slice(0, 4).map((geo, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{geo.country}</span>
                      <span className="text-sm text-gray-600">{geo.visits} visits</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <p className="text-lg font-bold">{analytic.completionRate}%</p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-lg font-bold">{analytic.bounceRate}%</p>
                <p className="text-sm text-gray-600">Bounce Rate</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <p className="text-lg font-bold">{analytic.timeSpent} min</p>
                <p className="text-sm text-gray-600">Avg. Time Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const DistributionTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Case Study Distribution</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Distribution
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {distributions.map((distribution) => (
          <motion.div
            key={distribution.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{distribution.title}</h3>
                    {distribution.description && (
                      <p className="text-sm text-gray-600 mt-1">{distribution.description}</p>
                    )}
                  </div>
                  <Badge className={getStatusColor(distribution.status)}>
                    {distribution.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {distribution.channels.map((channel, index) => (
                    <Badge key={index} variant="outline" className="text-xs capitalize">
                      {channel.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>

                {distribution.status === 'published' && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-lg font-bold text-blue-600">{distribution.impressions.toLocaleString()}</p>
                      <p className="text-xs text-blue-600">Impressions</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-lg font-bold text-green-600">{distribution.clicks}</p>
                      <p className="text-xs text-green-600">Clicks</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-lg font-bold text-purple-600">{distribution.conversions}</p>
                      <p className="text-xs text-purple-600">Conversions</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-lg font-bold text-orange-600">{distribution.leadGeneration}</p>
                      <p className="text-xs text-orange-600">Leads</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2 mb-4 text-sm">
                  {distribution.publishedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Published</span>
                      <span>{new Date(distribution.publishedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {distribution.scheduledFor && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Scheduled</span>
                      <span>{new Date(distribution.scheduledFor).toLocaleDateString()}</span>
                    </div>
                  )}
                  {distribution.status === 'published' && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">CTR</span>
                        <span>{distribution.impressions > 0 ? ((distribution.clicks / distribution.impressions) * 100).toFixed(2) : 0}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Conversion Rate</span>
                        <span>{distribution.clicks > 0 ? ((distribution.conversions / distribution.clicks) * 100).toFixed(2) : 0}%</span>
                      </div>
                    </>
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
          <h1 className="text-3xl font-bold text-gray-900">Case Study Marketplace</h1>
          <p className="text-gray-600 mt-2">Create, collaborate, and distribute compelling case studies</p>
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
            Create Template
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="templates">
          <TemplatesTab />
        </TabsContent>

        <TabsContent value="collaboration">
          <CollaborationTab />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>

        <TabsContent value="distribution">
          <DistributionTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaseStudyMarketplaceDashboard;
