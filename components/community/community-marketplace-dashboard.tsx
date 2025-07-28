
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Package,
  Layout,
  Download,
  Star,
  Eye,
  Heart,
  DollarSign,
  TrendingUp,
  Users,
  Award,
  Search,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  ExternalLink,
  Github,
  ShoppingCart,
  Bookmark,
  Share,
  PlayCircle,
  FileText,
  Code,
  Palette,
  Zap,
  Target
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MarketplaceStats {
  totalWidgets: number;
  totalTemplates: number;
  totalDownloads: number;
  totalCreators: number;
  totalRevenue: number;
  averageRating: number;
  monthlyGrowth: number;
}

interface MarketplaceWidget {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  subcategory?: string;
  creator: {
    name: string;
    email: string;
  };
  widgetType: string;
  previewImage?: string;
  screenshots: string[];
  demoUrl?: string;
  status: string;
  visibility: string;
  tags: string[];
  price?: number;
  currency: string;
  licenseType: string;
  isOpenSource: boolean;
  downloadCount: number;
  usageCount: number;
  rating?: number;
  reviewCount: number;
  favoriteCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface MarketplaceTemplate {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  subcategory?: string;
  creator: {
    name: string;
    email: string;
  };
  previewImage?: string;
  screenshots: string[];
  demoUrl?: string;
  pages: string[];
  components: string[];
  industries: string[];
  difficulty: string;
  status: string;
  visibility: string;
  tags: string[];
  price?: number;
  currency: string;
  licenseType: string;
  isOpenSource: boolean;
  downloadCount: number;
  usageCount: number;
  rating?: number;
  reviewCount: number;
  favoriteCount: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface Review {
  id: string;
  user: {
    name: string;
    email: string;
  };
  rating: number;
  title?: string;
  content?: string;
  pros: string[];
  cons: string[];
  verified: boolean;
  helpful: number;
  createdAt: string;
}

interface Transaction {
  id: string;
  itemType: string;
  itemId: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  buyer: {
    name: string;
    email: string;
  };
  seller: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function CommunityMarketplaceDashboard() {
  const [activeTab, setActiveTab] = useState("marketplace");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [widgets, setWidgets] = useState<MarketplaceWidget[]>([]);
  const [templates, setTemplates] = useState<MarketplaceTemplate[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockStats: MarketplaceStats = {
        totalWidgets: 234,
        totalTemplates: 89,
        totalDownloads: 15600,
        totalCreators: 156,
        totalRevenue: 45780,
        averageRating: 4.4,
        monthlyGrowth: 18.7,
      };

      const mockWidgets: MarketplaceWidget[] = [
        {
          id: "1",
          name: "advanced-chart-widget",
          displayName: "Advanced Chart Widget",
          description: "Powerful charting widget with real-time data support and customizable visualizations",
          category: "chart",
          creator: { name: "Sarah Johnson", email: "sarah@example.com" },
          widgetType: "react_component",
          previewImage: "/images/widgets/chart-widget-preview.png",
          screenshots: ["/images/widgets/chart-1.png", "/images/widgets/chart-2.png"],
          demoUrl: "https://demo.example.com/chart-widget",
          status: "published",
          visibility: "public",
          tags: ["charts", "visualization", "real-time", "data"],
          price: 29.99,
          currency: "USD",
          licenseType: "Commercial",
          isOpenSource: false,
          downloadCount: 1245,
          usageCount: 890,
          rating: 4.8,
          reviewCount: 67,
          favoriteCount: 234,
          publishedAt: "2024-01-10T12:00:00Z",
          createdAt: "2024-01-08T14:20:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          name: "contact-form-builder",
          displayName: "Contact Form Builder",
          description: "Drag-and-drop form builder with validation, styling options, and integration capabilities",
          category: "form",
          creator: { name: "Mike Chen", email: "mike@example.com" },
          widgetType: "react_component",
          previewImage: "/images/widgets/form-builder-preview.png",
          screenshots: ["/images/widgets/form-1.png", "/images/widgets/form-2.png"],
          status: "published",
          visibility: "public",
          tags: ["forms", "builder", "validation", "integration"],
          price: 0,
          currency: "USD",
          licenseType: "MIT",
          isOpenSource: true,
          downloadCount: 892,
          usageCount: 567,
          rating: 4.5,
          reviewCount: 43,
          favoriteCount: 156,
          publishedAt: "2024-01-12T09:15:00Z",
          createdAt: "2024-01-10T16:45:00Z",
          updatedAt: "2024-01-14T11:20:00Z",
        },
        {
          id: "3",
          name: "user-dashboard-widget",
          displayName: "User Dashboard Widget",
          description: "Comprehensive user dashboard with profile management, activity tracking, and analytics",
          category: "dashboard",
          creator: { name: "Alex Johnson", email: "alex@example.com" },
          widgetType: "react_component",
          previewImage: "/images/widgets/dashboard-preview.png",
          screenshots: ["/images/widgets/dashboard-1.png"],
          status: "published",
          visibility: "public",
          tags: ["dashboard", "user", "profile", "analytics"],
          price: 19.99,
          currency: "USD",
          licenseType: "Commercial",
          isOpenSource: false,
          downloadCount: 634,
          usageCount: 445,
          rating: 4.3,
          reviewCount: 28,
          favoriteCount: 89,
          publishedAt: "2024-01-05T15:30:00Z",
          createdAt: "2024-01-03T12:00:00Z",
          updatedAt: "2024-01-13T14:15:00Z",
        },
      ];

      const mockTemplates: MarketplaceTemplate[] = [
        {
          id: "1",
          name: "ecommerce-dashboard",
          displayName: "E-commerce Dashboard Template",
          description: "Complete e-commerce dashboard with product management, orders, analytics, and customer management",
          category: "ecommerce",
          creator: { name: "Emma Davis", email: "emma@example.com" },
          previewImage: "/images/templates/ecommerce-preview.png",
          screenshots: ["/images/templates/ecommerce-1.png", "/images/templates/ecommerce-2.png"],
          demoUrl: "https://demo.example.com/ecommerce-template",
          pages: ["Dashboard", "Products", "Orders", "Customers", "Analytics", "Settings"],
          components: ["ProductCard", "OrderTable", "CustomerProfile", "AnalyticsChart"],
          industries: ["Retail", "E-commerce", "Online Store"],
          difficulty: "intermediate",
          status: "published",
          visibility: "public",
          tags: ["ecommerce", "dashboard", "analytics", "management"],
          price: 79.99,
          currency: "USD",
          licenseType: "Commercial",
          isOpenSource: false,
          downloadCount: 456,
          usageCount: 234,
          rating: 4.7,
          reviewCount: 34,
          favoriteCount: 123,
          publishedAt: "2024-01-08T10:00:00Z",
          createdAt: "2024-01-05T14:30:00Z",
          updatedAt: "2024-01-12T16:20:00Z",
        },
        {
          id: "2",
          name: "blog-template",
          displayName: "Modern Blog Template",
          description: "Clean and modern blog template with article management, categories, and responsive design",
          category: "blog",
          creator: { name: "James Wilson", email: "james@example.com" },
          previewImage: "/images/templates/blog-preview.png",
          screenshots: ["/images/templates/blog-1.png", "/images/templates/blog-2.png"],
          demoUrl: "https://demo.example.com/blog-template",
          pages: ["Home", "Articles", "Categories", "About", "Contact"],
          components: ["ArticleCard", "CategoryList", "AuthorProfile", "CommentSection"],
          industries: ["Publishing", "Media", "Personal"],
          difficulty: "beginner",
          status: "published",
          visibility: "public",
          tags: ["blog", "articles", "responsive", "clean"],
          price: 0,
          currency: "USD",
          licenseType: "MIT",
          isOpenSource: true,
          downloadCount: 1123,
          usageCount: 678,
          rating: 4.6,
          reviewCount: 89,
          favoriteCount: 345,
          publishedAt: "2024-01-06T12:30:00Z",
          createdAt: "2024-01-04T09:15:00Z",
          updatedAt: "2024-01-11T13:45:00Z",
        },
      ];

      const mockTransactions: Transaction[] = [
        {
          id: "1",
          itemType: "widget",
          itemId: "1",
          amount: 29.99,
          currency: "USD",
          type: "purchase",
          status: "completed",
          buyer: { name: "John Doe", email: "john@example.com" },
          seller: { name: "Sarah Johnson", email: "sarah@example.com" },
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          id: "2",
          itemType: "template",
          itemId: "1",
          amount: 79.99,
          currency: "USD",
          type: "purchase",
          status: "completed",
          buyer: { name: "Jane Smith", email: "jane@example.com" },
          seller: { name: "Emma Davis", email: "emma@example.com" },
          createdAt: "2024-01-14T14:20:00Z",
        },
      ];

      setStats(mockStats);
      setWidgets(mockWidgets);
      setTemplates(mockTemplates);
      setTransactions(mockTransactions);
    } catch (error) {
      console.error("Error loading marketplace data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("sv-SE", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      chart: "bg-blue-100 text-blue-800",
      form: "bg-green-100 text-green-800",
      dashboard: "bg-purple-100 text-purple-800",
      navigation: "bg-orange-100 text-orange-800",
      data: "bg-indigo-100 text-indigo-800",
      utility: "bg-gray-100 text-gray-800",
      ecommerce: "bg-pink-100 text-pink-800",
      blog: "bg-yellow-100 text-yellow-800",
      landing: "bg-teal-100 text-teal-800",
      admin: "bg-red-100 text-red-800",
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

  const getStatusColor = (status: string) => {
    const colors = {
      published: "bg-green-100 text-green-800",
      draft: "bg-gray-100 text-gray-800",
      review: "bg-yellow-100 text-yellow-800",
      deprecated: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const filteredWidgets = widgets.filter((widget) => {
    const matchesSearch = widget.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         widget.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || widget.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Community Marketplace</h1>
          <p className="text-gray-600">Discover and share widgets, templates, and digital assets</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ShoppingCart className="h-4 w-4 mr-2" />
            My Purchases
          </Button>
          <Button size="sm">
            <Package className="h-4 w-4 mr-2" />
            Sell Items
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Widgets</p>
                  <p className="text-2xl font-bold">{stats.totalWidgets}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Templates</p>
                  <p className="text-2xl font-bold">{stats.totalTemplates}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Downloads</p>
                  <p className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Creators</p>
                  <p className="text-2xl font-bold">{stats.totalCreators}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold">{stats.averageRating}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Growth</p>
                  <p className="text-2xl font-bold">+{stats.monthlyGrowth}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="widgets">Widgets</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
        </TabsList>

        {/* Marketplace Overview Tab */}
        <TabsContent value="marketplace" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Featured Widgets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Featured Widgets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {widgets.slice(0, 3).map((widget) => (
                  <div key={widget.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{widget.displayName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getCategoryColor(widget.category)}>
                          {widget.category}
                        </Badge>
                        {widget.price && widget.price > 0 ? (
                          <Badge variant="outline">{formatCurrency(widget.price, widget.currency)}</Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-600">Free</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {widget.downloadCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {widget.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {widget.favoriteCount}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Popular Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5" />
                  Popular Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {templates.slice(0, 3).map((template) => (
                  <div key={template.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <Layout className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{template.displayName}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                        <Badge className={getDifficultyColor(template.difficulty)}>
                          {template.difficulty}
                        </Badge>
                        {template.price && template.price > 0 ? (
                          <Badge variant="outline">{formatCurrency(template.price, template.currency)}</Badge>
                        ) : (
                          <Badge variant="outline" className="text-green-600">Free</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          {template.downloadCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {template.rating}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {template.favoriteCount}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Widgets Tab */}
        <TabsContent value="widgets" className="space-y-6">
          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search widgets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="chart">Charts</SelectItem>
                <SelectItem value="form">Forms</SelectItem>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="navigation">Navigation</SelectItem>
                <SelectItem value="data">Data</SelectItem>
                <SelectItem value="utility">Utility</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="downloads">Downloads</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Widgets Grid/List */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredWidgets.map((widget) => (
              <motion.div
                key={widget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: viewMode === "grid" ? 1.05 : 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Widget Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{widget.displayName}</h3>
                            <p className="text-sm text-gray-600">by {widget.creator.name}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bookmark className="h-4 w-4 mr-2" />
                              Add to Favorites
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="h-4 w-4 mr-2" />
                              Share Widget
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Widget Info */}
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 line-clamp-2">{widget.description}</p>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(widget.category)}>
                            {widget.category}
                          </Badge>
                          <Badge className={getStatusColor(widget.status)}>
                            {widget.status}
                          </Badge>
                          {widget.isOpenSource && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Open Source
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            {widget.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span>{widget.rating}</span>
                                <span className="text-gray-500">({widget.reviewCount})</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4 text-gray-400" />
                              <span>{widget.downloadCount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4 text-gray-400" />
                              <span>{widget.favoriteCount}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Updated {formatDate(widget.updatedAt)}</span>
                          <span>{widget.licenseType}</span>
                        </div>
                      </div>

                      {/* Price and Action */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-lg font-bold">
                          {widget.price && widget.price > 0 ? (
                            formatCurrency(widget.price, widget.currency)
                          ) : (
                            <span className="text-green-600">Free</span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {widget.demoUrl && (
                            <Button variant="outline" size="sm">
                              <PlayCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            {widget.price && widget.price > 0 ? "Buy" : "Download"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="landing">Landing</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="dashboard">Dashboard</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="downloads">Downloads</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Templates Grid/List */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredTemplates.map((template) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: viewMode === "grid" ? 1.05 : 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Template Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                            <Layout className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{template.displayName}</h3>
                            <p className="text-sm text-gray-600">by {template.creator.name}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Bookmark className="h-4 w-4 mr-2" />
                              Add to Favorites
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="h-4 w-4 mr-2" />
                              Share Template
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Template Info */}
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 line-clamp-2">{template.description}</p>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                          <Badge className={getDifficultyColor(template.difficulty)}>
                            {template.difficulty}
                          </Badge>
                          {template.isOpenSource && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Open Source
                            </Badge>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Includes:</h4>
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center gap-1 mb-1">
                              <FileText className="h-3 w-3" />
                              <span>{template.pages.length} pages</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Code className="h-3 w-3" />
                              <span>{template.components.length} components</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            {template.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span>{template.rating}</span>
                                <span className="text-gray-500">({template.reviewCount})</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4 text-gray-400" />
                              <span>{template.downloadCount.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4 text-gray-400" />
                              <span>{template.favoriteCount}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Updated {formatDate(template.updatedAt)}</span>
                          <span>{template.licenseType}</span>
                        </div>
                      </div>

                      {/* Price and Action */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-lg font-bold">
                          {template.price && template.price > 0 ? (
                            formatCurrency(template.price, template.currency)
                          ) : (
                            <span className="text-green-600">Free</span>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          {template.demoUrl && (
                            <Button variant="outline" size="sm">
                              <PlayCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            {template.price && template.price > 0 ? "Buy" : "Download"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid gap-4">
            {transactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {transaction.itemType === "widget" ? "Widget" : "Template"} Purchase
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Buyer: {transaction.buyer.name}</span>
                            <span>Seller: {transaction.seller.name}</span>
                            <span>Type: {transaction.type}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {formatCurrency(transaction.amount, transaction.currency)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </div>
                        </div>
                        
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
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
