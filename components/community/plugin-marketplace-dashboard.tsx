
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Download,
  Star,
  Shield,
  Zap,
  TrendingUp,
  Search,
  Filter,
  Grid,
  List,
  MoreHorizontal,
  ExternalLink,
  Github,
  FileText,
  DollarSign,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PluginStats {
  totalPlugins: number;
  totalDownloads: number;
  totalDevelopers: number;
  averageRating: number;
  monthlyGrowth: number;
  activeInstalls: number;
}

interface Plugin {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  type: string;
  status: string;
  developer: {
    name: string;
    email: string;
  };
  downloadCount: number;
  installCount: number;
  rating?: number;
  reviewCount: number;
  price?: number;
  currency: string;
  licenseType: string;
  publishedAt?: string;
  lastUpdated: string;
  securityScanStatus: string;
  qualityScore?: number;
  tags: string[];
}

interface Installation {
  id: string;
  plugin: {
    name: string;
    displayName: string;
    category: string;
  };
  status: string;
  installMethod: string;
  installedAt: string;
  lastUsed?: string;
  usageCount: number;
  errorCount: number;
}

export default function PluginMarketplaceDashboard() {
  const [activeTab, setActiveTab] = useState("marketplace");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [stats, setStats] = useState<PluginStats | null>(null);
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPluginData();
  }, []);

  const loadPluginData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockStats: PluginStats = {
        totalPlugins: 145,
        totalDownloads: 25600,
        totalDevelopers: 89,
        averageRating: 4.3,
        monthlyGrowth: 12.5,
        activeInstalls: 8750,
      };

      const mockPlugins: Plugin[] = [
        {
          id: "1",
          name: "advanced-analytics-widget",
          displayName: "Advanced Analytics Widget",
          description: "Beautiful analytics dashboard with real-time data visualization and customizable charts.",
          category: "analytics",
          type: "official",
          status: "approved",
          developer: { name: "Analytics Team", email: "team@analytics.com" },
          downloadCount: 2450,
          installCount: 1890,
          rating: 4.8,
          reviewCount: 124,
          price: 0,
          currency: "USD",
          licenseType: "MIT",
          publishedAt: "2024-01-10T12:00:00Z",
          lastUpdated: "2024-01-15T10:30:00Z",
          securityScanStatus: "passed",
          qualityScore: 9.2,
          tags: ["analytics", "charts", "dashboard", "real-time"],
        },
        {
          id: "2",
          name: "form-builder-pro",
          displayName: "Form Builder Pro",
          description: "Drag-and-drop form builder with advanced validation, conditional logic, and integration support.",
          category: "widget",
          type: "verified",
          status: "approved",
          developer: { name: "FormCraft Inc", email: "hello@formcraft.com" },
          downloadCount: 1870,
          installCount: 1320,
          rating: 4.6,
          reviewCount: 89,
          price: 29.99,
          currency: "USD",
          licenseType: "Commercial",
          publishedAt: "2024-01-08T14:20:00Z",
          lastUpdated: "2024-01-14T16:45:00Z",
          securityScanStatus: "passed",
          qualityScore: 8.7,
          tags: ["forms", "builder", "validation", "integration"],
        },
        {
          id: "3",
          name: "notification-center",
          displayName: "Notification Center",
          description: "Comprehensive notification system with real-time alerts, email integration, and custom templates.",
          category: "integration",
          type: "community",
          status: "approved",
          developer: { name: "Alex Johnson", email: "alex@example.com" },
          downloadCount: 950,
          installCount: 680,
          rating: 4.2,
          reviewCount: 34,
          price: 0,
          currency: "USD",
          licenseType: "Apache-2.0",
          publishedAt: "2024-01-05T09:15:00Z",
          lastUpdated: "2024-01-12T11:20:00Z",
          securityScanStatus: "pending",
          qualityScore: 7.8,
          tags: ["notifications", "alerts", "email", "templates"],
        },
      ];

      const mockInstallations: Installation[] = [
        {
          id: "1",
          plugin: {
            name: "advanced-analytics-widget",
            displayName: "Advanced Analytics Widget",
            category: "analytics",
          },
          status: "active",
          installMethod: "marketplace",
          installedAt: "2024-01-10T12:00:00Z",
          lastUsed: "2024-01-15T09:30:00Z",
          usageCount: 145,
          errorCount: 0,
        },
        {
          id: "2",
          plugin: {
            name: "form-builder-pro",
            displayName: "Form Builder Pro",
            category: "widget",
          },
          status: "active",
          installMethod: "marketplace",
          installedAt: "2024-01-12T15:20:00Z",
          lastUsed: "2024-01-14T14:15:00Z",
          usageCount: 67,
          errorCount: 2,
        },
      ];

      setStats(mockStats);
      setPlugins(mockPlugins);
      setInstallations(mockInstallations);
    } catch (error) {
      console.error("Error loading plugin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInstallPlugin = async (pluginId: string) => {
    try {
      // Mock installation - replace with actual API call
      console.log("Installing plugin:", pluginId);
      // Update UI or reload data
    } catch (error) {
      console.error("Error installing plugin:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      widget: "bg-blue-100 text-blue-800",
      integration: "bg-green-100 text-green-800",
      theme: "bg-purple-100 text-purple-800",
      automation: "bg-orange-100 text-orange-800",
      analytics: "bg-indigo-100 text-indigo-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getTypeColor = (type: string) => {
    const colors = {
      official: "bg-green-100 text-green-800",
      verified: "bg-blue-100 text-blue-800",
      community: "bg-purple-100 text-purple-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      updating: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getSecurityStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Shield className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredPlugins = plugins.filter((plugin) => {
    const matchesSearch = plugin.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || plugin.category === categoryFilter;
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
          <h1 className="text-3xl font-bold text-gray-900">Plugin Marketplace</h1>
          <p className="text-gray-600">Discover, install, and manage plugins for your platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Package className="h-4 w-4 mr-2" />
            My Plugins
          </Button>
          <Button size="sm">
            <Zap className="h-4 w-4 mr-2" />
            Publish Plugin
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
                <Package className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Plugins</p>
                  <p className="text-2xl font-bold">{stats.totalPlugins.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-green-600" />
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
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Developers</p>
                  <p className="text-2xl font-bold">{stats.totalDevelopers}</p>
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
                <Activity className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Installs</p>
                  <p className="text-2xl font-bold">{stats.activeInstalls.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="installed">Installed</TabsTrigger>
          <TabsTrigger value="develop">Develop</TabsTrigger>
        </TabsList>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-6">
          {/* Filters and Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search plugins..."
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
                <SelectItem value="widget">Widgets</SelectItem>
                <SelectItem value="integration">Integrations</SelectItem>
                <SelectItem value="theme">Themes</SelectItem>
                <SelectItem value="automation">Automation</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="downloads">Downloads</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="updated">Recently Updated</SelectItem>
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

          {/* Plugin Grid/List */}
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredPlugins.map((plugin) => (
              <motion.div
                key={plugin.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: viewMode === "grid" ? 1.05 : 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Plugin Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{plugin.displayName}</h3>
                            <p className="text-sm text-gray-600">by {plugin.developer.name}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Visit Repository</DropdownMenuItem>
                            <DropdownMenuItem>Report Plugin</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Plugin Info */}
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600 line-clamp-2">{plugin.description}</p>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={getCategoryColor(plugin.category)}>
                            {plugin.category}
                          </Badge>
                          <Badge className={getTypeColor(plugin.type)}>
                            {plugin.type}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4">
                            {plugin.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span>{plugin.rating}</span>
                                <span className="text-gray-500">({plugin.reviewCount})</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4 text-gray-400" />
                              <span>{plugin.downloadCount.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getSecurityStatusIcon(plugin.securityScanStatus)}
                            {plugin.qualityScore && (
                              <span className="text-xs text-gray-500">
                                Q: {plugin.qualityScore}/10
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>Updated {formatDate(plugin.lastUpdated)}</span>
                          <span>•</span>
                          <span>{plugin.licenseType}</span>
                          {plugin.price && plugin.price > 0 && (
                            <>
                              <span>•</span>
                              <span className="font-medium">${plugin.price}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          className="flex-1"
                          onClick={() => handleInstallPlugin(plugin.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {plugin.price && plugin.price > 0 ? `Buy $${plugin.price}` : "Install"}
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Github className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Installed Tab */}
        <TabsContent value="installed" className="space-y-6">
          <div className="grid gap-4">
            {installations.map((installation) => (
              <motion.div
                key={installation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{installation.plugin.displayName}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <Badge className={getCategoryColor(installation.plugin.category)}>
                              {installation.plugin.category}
                            </Badge>
                            <span>Installed {formatDate(installation.installedAt)}</span>
                            {installation.lastUsed && (
                              <span>Last used {formatDate(installation.lastUsed)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right text-sm">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(installation.status)}>
                              {installation.status}
                            </Badge>
                          </div>
                          <div className="text-gray-500 mt-1">
                            {installation.usageCount} uses
                            {installation.errorCount > 0 && (
                              <span className="text-red-500 ml-2">
                                {installation.errorCount} errors
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Configure</DropdownMenuItem>
                            <DropdownMenuItem>Update</DropdownMenuItem>
                            <DropdownMenuItem>View Logs</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Uninstall</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Develop Tab */}
        <TabsContent value="develop" className="space-y-6">
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Plugin Development Center</h3>
            <p className="text-gray-600 mb-6">Create and publish your own plugins for the community</p>
            <div className="flex gap-4 justify-center">
              <Button>
                <Zap className="h-4 w-4 mr-2" />
                Create New Plugin
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Developer Docs
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
