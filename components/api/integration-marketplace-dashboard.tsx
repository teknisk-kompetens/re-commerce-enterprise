
'use client';

import { useState, useEffect } from 'react';
import { 
  Store, 
  Search, 
  Filter, 
  Star, 
  Download, 
  Heart, 
  Settings, 
  Eye, 
  TrendingUp,
  Package,
  Users,
  DollarSign,
  Calendar,
  ShoppingCart,
  Play,
  Pause,
  MoreHorizontal,
  Shield,
  Plus,
  Grid,
  List,
  CheckCircle,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface MarketplaceApp {
  id: string;
  name: string;
  description: string;
  category: string;
  publisher: string;
  version: string;
  logo?: string;
  screenshots: string[];
  pricing: {
    type: 'free' | 'paid' | 'freemium';
    price?: number;
    currency?: string;
  };
  features: string[];
  requirements: any;
  downloads: number;
  rating: number;
  reviews: number;
  status: 'published' | 'pending' | 'rejected' | 'deprecated';
  createdAt: string;
  updatedAt: string;
  metrics: {
    activeInstalls: number;
    totalReviews: number;
    totalInstalls: number;
    currentRevenue: number;
    avgRating: number;
    recentReviews: any[];
  };
}

interface MarketplaceCategory {
  category: string;
  _count: number;
}

export function IntegrationMarketplaceDashboard({ tenantId }: { tenantId?: string }) {
  const [activeTab, setActiveTab] = useState('browse');
  const [apps, setApps] = useState<MarketplaceApp[]>([]);
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('downloads');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedApp, setSelectedApp] = useState<MarketplaceApp | null>(null);

  useEffect(() => {
    fetchApps();
  }, [searchQuery, selectedCategory, sortBy]);

  const fetchApps = async () => {
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        sortBy,
        ...(selectedCategory !== 'all' && { category: selectedCategory })
      });

      const response = await fetch(`/api/integrations/marketplace?${params}`);
      const data = await response.json();
      
      setApps(data.apps || []);
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Failed to fetch marketplace apps:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInstallApp = async (appId: string) => {
    if (!tenantId) {
      alert('Please login to install apps');
      return;
    }

    try {
      const response = await fetch('/api/integrations/marketplace/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId, tenantId })
      });

      if (response.ok) {
        alert('App installed successfully!');
        fetchApps(); // Refresh the list
      } else {
        alert('Failed to install app');
      }
    } catch (error) {
      console.error('Failed to install app:', error);
      alert('Failed to install app');
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      integration: Package,
      automation: Settings,
      analytics: TrendingUp,
      security: Shield,
      productivity: Users,
      marketing: TrendingUp,
      ecommerce: ShoppingCart
    };
    return icons[category] || Package;
  };

  const formatPrice = (pricing: MarketplaceApp['pricing']) => {
    if (pricing.type === 'free') return 'Free';
    if (pricing.type === 'freemium') return 'Freemium';
    return `$${pricing.price}/${pricing.currency || 'month'}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integration Marketplace</h1>
          <p className="text-gray-600 mt-1">Discover and install integrations to extend your platform</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Heart className="h-4 w-4 mr-2" />
            Wishlist
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Submit App
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Apps</p>
                <p className="text-3xl font-bold text-gray-900">{apps.length}</p>
              </div>
              <Store className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-3xl font-bold text-gray-900">
                  {apps.reduce((sum, app) => sum + app.downloads, 0).toLocaleString()}
                </p>
              </div>
              <Download className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900">
                  {apps.length > 0 ? (apps.reduce((sum, app) => sum + app.rating, 0) / apps.length).toFixed(1) : '0.0'}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.category} value={cat.category}>
                  {cat.category.charAt(0).toUpperCase() + cat.category.slice(1)} ({cat._count})
                </option>
              ))}
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <option value="downloads">Most Downloaded</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="name">Name A-Z</option>
            </Select>

            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {apps.map((app) => {
          const CategoryIcon = getCategoryIcon(app.category);
          
          if (viewMode === 'list') {
            return (
              <Card key={app.id} className="p-6">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={app.logo} alt={app.name} />
                      <AvatarFallback>
                        <CategoryIcon className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{app.name}</h3>
                        <Badge className="bg-blue-100 text-blue-800">{app.category}</Badge>
                        <Badge variant="outline">{formatPrice(app.pricing)}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">{app.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>By {app.publisher}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{app.rating.toFixed(1)}</span>
                          <span>({app.reviews})</span>
                        </div>
                        <span>•</span>
                        <span>{app.downloads.toLocaleString()} downloads</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleInstallApp(app.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Install
                    </Button>
                  </div>
                </div>
              </Card>
            );
          }

          return (
            <Card key={app.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <CategoryIcon className="h-12 w-12 text-blue-500" />
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{app.name}</CardTitle>
                    <CardDescription className="text-sm">By {app.publisher}</CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">{app.category}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{app.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{app.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">({app.reviews})</span>
                  </div>
                  <Badge variant="outline">{formatPrice(app.pricing)}</Badge>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{app.downloads.toLocaleString()} downloads</span>
                  <span>v{app.version}</span>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setSelectedApp(app)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleInstallApp(app.id)}
                  >
                    Install
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* App Detail Modal would go here */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedApp.logo} alt={selectedApp.name} />
                    <AvatarFallback>
                      {getCategoryIcon(selectedApp.category)({ className: "h-8 w-8" })}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedApp.name}</h2>
                    <p className="text-gray-600">By {selectedApp.publisher}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge>{selectedApp.category}</Badge>
                      <Badge variant="outline">{formatPrice(selectedApp.pricing)}</Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{selectedApp.rating.toFixed(1)}</span>
                        <span className="text-gray-500">({selectedApp.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedApp(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Description</h3>
                      <p className="text-gray-600">{selectedApp.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Features</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedApp.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedApp.screenshots.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Screenshots</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedApp.screenshots.map((screenshot, index) => (
                            <img
                              key={index}
                              src={screenshot}
                              alt={`Screenshot ${index + 1}`}
                              className="rounded-lg border"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Card>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleInstallApp(selectedApp.id)}
                        >
                          Install App
                        </Button>
                        
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Version:</span>
                            <span>v{selectedApp.version}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Downloads:</span>
                            <span>{selectedApp.downloads.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Active Installs:</span>
                            <span>{selectedApp.metrics.activeInstalls.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Updated:</span>
                            <span>{new Date(selectedApp.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
