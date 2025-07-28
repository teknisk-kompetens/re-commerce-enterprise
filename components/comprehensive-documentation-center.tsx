
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen,
  Search,
  Filter,
  Code,
  Video,
  HelpCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Clock,
  User,
  Calendar,
  Tag,
  ExternalLink,
  Copy,
  Share,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings,
  MessageCircle,
  Send,
  Heart,
  Bookmark,
  Flag,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Lightbulb,
  Info,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  Edit,
  Trash,
  Save,
  FileText,
  Image,
  Link,
  Hash,
  List,
  Quote,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table,
  Layout,
  Layers,
  Grid,
  Navigation,
  Terminal,
  Smartphone,
  Tablet,
  Monitor,
  Globe,
  Zap,
  Shield,
  Database,
  Cloud,
  Server,
  Cpu,

  HardDrive,
  Network,
  Workflow,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Gauge,
  Timer,
  Rocket,
  Sparkles,
  Brain,
  Plug,
  Building,
  Users,
  Mail,
  Phone,
  MapPin,
  Home,
  Menu,
  X
} from 'lucide-react';

interface DocumentationStats {
  totalSections: number;
  totalArticles: number;
  totalViews: number;
  totalHelpful: number;
  totalAPIEndpoints: number;
  totalVideos: number;
  totalFAQs: number;
}

interface DocumentationSection {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  articles: DocumentationArticle[];
  lastUpdated: Date;
}

interface DocumentationArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  lastUpdated: Date;
  author: string;
  views: number;
  helpful: number;
  rating: number;
}

interface APIEndpoint {
  id: string;
  method: string;
  path: string;
  description: string;
  category: string;
  parameters: any[];
  responses: any[];
  examples: any[];
  authentication: boolean;
  rateLimit: string;
  deprecated: boolean;
}

interface TutorialVideo {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  videoUrl: string;
  category: string;
  difficulty: string;
  tags: string[];
  views: number;
  likes: number;
  transcript?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  views: number;
  helpful: number;
  lastUpdated: Date;
}

export function ComprehensiveDocumentationCenter() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DocumentationStats | null>(null);
  const [sections, setSections] = useState<DocumentationSection[]>([]);
  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([]);
  const [tutorialVideos, setTutorialVideos] = useState<TutorialVideo[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<DocumentationArticle | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  useEffect(() => {
    loadDocumentationData();
  }, []);

  const loadDocumentationData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/documentation-center');
      const data = await response.json();
      
      setStats(data.stats);
      setSections(data.sections || []);
      setApiEndpoints(data.apiEndpoints || []);
      setTutorialVideos(data.tutorialVideos || []);
      setFaqs(data.faqs || []);
    } catch (error) {
      console.error('Failed to load documentation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadDocumentationData();
      return;
    }

    try {
      const response = await fetch(`/api/documentation-center?search=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      setSections(data.sections || []);
      setFaqs(data.faqs || []);
    } catch (error) {
      console.error('Failed to search documentation:', error);
    }
  };

  const markAsHelpful = async (articleId: string) => {
    try {
      await fetch('/api/documentation-center', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'helpful', articleId })
      });
      
      // Update local state
      setSections(sections.map(section => ({
        ...section,
        articles: section.articles.map(article => 
          article.id === articleId 
            ? { ...article, helpful: article.helpful + 1 }
            : article
        )
      })));
    } catch (error) {
      console.error('Failed to mark as helpful:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'advanced':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'getting-started':
        return <Rocket className="w-5 h-5" />;
      case 'user-guide':
        return <BookOpen className="w-5 h-5" />;
      case 'api':
        return <Code className="w-5 h-5" />;
      case 'developer':
        return <Terminal className="w-5 h-5" />;
      case 'admin':
        return <Settings className="w-5 h-5" />;
      case 'troubleshooting':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'POST':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'PUT':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'DELETE':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'PATCH':
        return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-lg font-medium">Loading Documentation Center...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Documentation Center
                  </h1>
                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                    Complete Knowledge Base
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 pr-4 py-2 w-64"
                />
              </div>
              
              <Button
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-1 rounded-lg">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Guides</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center space-x-2">
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline">Videos</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center space-x-2">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Support</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="space-y-6">
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Documentation</CardTitle>
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{stats?.totalArticles}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats?.totalSections} sections
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">API Endpoints</CardTitle>
                      <Code className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{stats?.totalAPIEndpoints}</div>
                      <p className="text-xs text-muted-foreground">
                        Complete reference
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Video Tutorials</CardTitle>
                      <Video className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">{stats?.totalVideos}</div>
                      <p className="text-xs text-muted-foreground">
                        Step-by-step guides
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                      <Eye className="w-4 h-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        {stats?.totalViews?.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Community engagement
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Popular Sections */}
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <span>Popular Documentation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {sections.slice(0, 6).map((section) => (
                        <motion.div
                          key={section.id}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                          onClick={() => setActiveTab('guides')}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              {getCategoryIcon(section.category)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{section.title}</div>
                              <div className="text-xs text-muted-foreground">{section.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{section.articles.length} articles</span>
                            <span>{new Date(section.lastUpdated).toLocaleDateString()}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <span>Quick Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                        onClick={() => setActiveTab('guides')}
                      >
                        <Rocket className="w-6 h-6 text-blue-600" />
                        <span className="text-sm">Quick Start</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                        onClick={() => setActiveTab('api')}
                      >
                        <Code className="w-6 h-6 text-green-600" />
                        <span className="text-sm">API Reference</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                        onClick={() => setActiveTab('videos')}
                      >
                        <Video className="w-6 h-6 text-purple-600" />
                        <span className="text-sm">Video Tutorials</span>
                      </Button>
                      <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center space-y-2"
                        onClick={() => setActiveTab('support')}
                      >
                        <MessageCircle className="w-6 h-6 text-orange-600" />
                        <span className="text-sm">Get Support</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="guides" className="space-y-6">
              <motion.div
                key="guides"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                  {/* Sidebar */}
                  <div className="lg:col-span-1">
                    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg sticky top-24">
                      <CardHeader>
                        <CardTitle className="text-sm">Documentation Sections</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {sections.map((section) => (
                            <div
                              key={section.id}
                              className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                            >
                              <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                {getCategoryIcon(section.category)}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium">{section.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {section.articles.length} articles
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Main Content */}
                  <div className="lg:col-span-3">
                    <div className="space-y-6">
                      {sections.map((section) => (
                        <Card key={section.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                          <CardHeader>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                {getCategoryIcon(section.category)}
                              </div>
                              <div>
                                <CardTitle className="text-lg">{section.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">{section.description}</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {section.articles.map((article) => (
                                <motion.div
                                  key={article.id}
                                  whileHover={{ scale: 1.01 }}
                                  className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
                                  onClick={() => setSelectedArticle(article)}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <h3 className="font-medium text-sm">{article.title}</h3>
                                        <Badge variant="outline" className={`${getDifficultyColor(article.difficulty)} border-0 text-xs`}>
                                          {article.difficulty}
                                        </Badge>
                                      </div>
                                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                        <div className="flex items-center space-x-1">
                                          <Clock className="w-3 h-3" />
                                          <span>{article.estimatedTime} min</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Eye className="w-3 h-3" />
                                          <span>{article.views}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <ThumbsUp className="w-3 h-3" />
                                          <span>{article.helpful}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Star className="w-3 h-3" />
                                          <span>{article.rating}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-400" />
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <motion.div
                key="api"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  {apiEndpoints.map((endpoint) => (
                    <Card key={endpoint.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className={`${getMethodColor(endpoint.method)} border-0 font-mono`}>
                              {endpoint.method}
                            </Badge>
                            <code className="text-lg font-mono">{endpoint.path}</code>
                          </div>
                          <div className="flex items-center space-x-2">
                            {endpoint.authentication && (
                              <Badge variant="outline" className="text-xs">
                                <Shield className="w-3 h-3 mr-1" />
                                Auth Required
                              </Badge>
                            )}
                            {endpoint.deprecated && (
                              <Badge variant="outline" className="text-xs text-red-600">
                                Deprecated
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {/* Parameters */}
                          {endpoint.parameters.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-3">Parameters</h4>
                              <div className="space-y-2">
                                {endpoint.parameters.map((param, index) => (
                                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                                    <div className="flex items-center justify-between mb-1">
                                      <code className="text-sm font-mono">{param.name}</code>
                                      <div className="flex items-center space-x-2">
                                        <Badge variant="outline" className="text-xs">
                                          {param.type}
                                        </Badge>
                                        {param.required && (
                                          <Badge variant="outline" className="text-xs text-red-600">
                                            Required
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{param.description}</p>
                                    {param.example && (
                                      <code className="text-xs text-blue-600">
                                        Example: {JSON.stringify(param.example)}
                                      </code>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Examples */}
                          {endpoint.examples.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-3">Examples</h4>
                              <div className="space-y-4">
                                {endpoint.examples.map((example, index) => (
                                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded">
                                    <h5 className="font-medium mb-2">{example.title}</h5>
                                    <p className="text-sm text-muted-foreground mb-3">{example.description}</p>
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                      <div>
                                        <h6 className="text-sm font-medium mb-2">Request</h6>
                                        <pre className="text-xs bg-black text-green-400 p-3 rounded overflow-x-auto">
                                          <code>
{`${example.request.method} ${example.request.url}
${example.request.headers ? Object.entries(example.request.headers).map(([key, value]) => `${key}: ${value}`).join('\n') : ''}
${example.request.body ? '\n' + JSON.stringify(example.request.body, null, 2) : ''}`}
                                          </code>
                                        </pre>
                                      </div>
                                      <div>
                                        <h6 className="text-sm font-medium mb-2">Response</h6>
                                        <pre className="text-xs bg-black text-blue-400 p-3 rounded overflow-x-auto">
                                          <code>
{`HTTP ${example.response.status}
${example.response.headers ? Object.entries(example.response.headers).map(([key, value]) => `${key}: ${value}`).join('\n') : ''}

${JSON.stringify(example.response.body, null, 2)}`}
                                          </code>
                                        </pre>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="videos" className="space-y-6">
              <motion.div
                key="videos"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tutorialVideos.map((video) => (
                    <Card key={video.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="relative">
                          <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                            <Play className="w-12 h-12 text-gray-600" />
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                            {formatDuration(video.duration)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h3 className="font-medium text-sm mb-1">{video.title}</h3>
                            <p className="text-xs text-muted-foreground">{video.description}</p>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>{video.views.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <ThumbsUp className="w-3 h-3" />
                              <span>{video.likes.toLocaleString()}</span>
                            </div>
                            <Badge variant="outline" className={`${getDifficultyColor(video.difficulty)} border-0 text-xs`}>
                              {video.difficulty}
                            </Badge>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {video.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <Button className="w-full mt-3" size="sm">
                            <Play className="w-4 h-4 mr-2" />
                            Watch Tutorial
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
              <motion.div
                key="faq"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <Card key={faq.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader
                        className="cursor-pointer"
                        onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <HelpCircle className="w-5 h-5 text-blue-600" />
                            <h3 className="font-medium">{faq.question}</h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Eye className="w-3 h-3" />
                              <span>{faq.views}</span>
                              <ThumbsUp className="w-3 h-3" />
                              <span>{faq.helpful}</span>
                            </div>
                            {expandedFAQ === faq.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <AnimatePresence>
                        {expandedFAQ === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CardContent>
                              <div className="pt-0">
                                <p className="text-sm text-muted-foreground mb-4">{faq.answer}</p>
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-wrap gap-1">
                                    {faq.tags.map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                  <Button variant="ghost" size="sm">
                                    <ThumbsUp className="w-4 h-4 mr-2" />
                                    Helpful
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="support" className="space-y-6">
              <motion.div
                key="support"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                        <span>Contact Support</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="subject">Subject</Label>
                          <Input id="subject" placeholder="Brief description of your issue" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="category">Category</Label>
                          <Select defaultValue="question">
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bug">Bug Report</SelectItem>
                              <SelectItem value="feature">Feature Request</SelectItem>
                              <SelectItem value="question">Question</SelectItem>
                              <SelectItem value="integration">Integration Issue</SelectItem>
                              <SelectItem value="performance">Performance Issue</SelectItem>
                              <SelectItem value="security">Security Concern</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Please describe your issue in detail..."
                            rows={6}
                            className="mt-1"
                          />
                        </div>
                        <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                          <Send className="w-4 h-4 mr-2" />
                          Submit Ticket
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Phone className="w-5 h-5 text-green-600" />
                        <span>Support Options</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Live Chat</h3>
                            <p className="text-sm text-muted-foreground">Available 24/7 for enterprise customers</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Email Support</h3>
                            <p className="text-sm text-muted-foreground">support@re-commerce-enterprise.com</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Phone className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Phone Support</h3>
                            <p className="text-sm text-muted-foreground">+1-800-ENTERPRISE</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Users className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">Community Forum</h3>
                            <p className="text-sm text-muted-foreground">Connect with other enterprise users</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t">
                          <h4 className="font-medium mb-2">Enterprise Support</h4>
                          <p className="text-sm text-muted-foreground">
                            Dedicated support team with guaranteed response times and priority handling.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-bold">{selectedArticle.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{selectedArticle.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{selectedArticle.estimatedTime} min read</span>
                  </div>
                  <Badge variant="outline" className={`${getDifficultyColor(selectedArticle.difficulty)} border-0`}>
                    {selectedArticle.difficulty}
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedArticle(null)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedArticle.content.replace(/\n/g, '<br>') }} />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-6 border-t">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAsHelpful(selectedArticle.id)}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Helpful ({selectedArticle.helpful})
                </Button>
                <Button variant="outline" size="sm">
                  <Star className="w-4 h-4 mr-2" />
                  Rate ({selectedArticle.rating})
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
