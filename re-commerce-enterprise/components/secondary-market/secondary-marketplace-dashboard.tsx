

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Package,
  TrendingUp,
  DollarSign,
  Users,
  Star,
  Eye,
  Heart,
  ShoppingCart,
  Filter,
  Search,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Calendar,
  Clock,
  Tag,
  MapPin,
  Award,
  Shield,
  Zap,
  Target,
  BarChart3,
  Activity,
  PieChart,
  LineChart,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ExternalLink,
  Share2,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

interface SecondaryMarketplaceDashboardProps {
  userId?: string;
  userRole?: string;
}

export default function SecondaryMarketplaceDashboard({ 
  userId, 
  userRole = "user" 
}: SecondaryMarketplaceDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState([]);
  const [marketMetrics, setMarketMetrics] = useState(null);
  const [userAssets, setUserAssets] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarketplaceData();
  }, [activeTab, sortBy, filterBy, searchQuery]);

  const fetchMarketplaceData = async () => {
    setLoading(true);
    try {
      const [listingsRes, metricsRes, assetsRes, transactionsRes] = await Promise.all([
        fetch(`/api/secondary-market/listings?sortBy=${sortBy}&limit=20`),
        fetch('/api/secondary-market/market-analytics?period=daily&limit=7'),
        userId ? fetch(`/api/secondary-market/assets?ownerId=${userId}&limit=10`) : Promise.resolve({ json: () => ({ assets: [] }) }),
        userId ? fetch(`/api/secondary-market/transactions?userId=${userId}&type=buyer&limit=10`) : Promise.resolve({ json: () => ({ transactions: [] }) }),
      ]);

      const [listingsData, metricsData, assetsData, transactionsData] = await Promise.all([
        listingsRes.json(),
        metricsRes.json(),
        assetsRes.json(),
        transactionsRes.json(),
      ]);

      setListings(listingsData.listings || []);
      setMarketMetrics(metricsData);
      setUserAssets(assetsData.assets || []);
      setRecentTransactions(transactionsData.transactions || []);
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = async (listingId: string, offerAmount: number) => {
    if (!userId) return;

    try {
      const response = await fetch('/api/secondary-market/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_offer',
          listingId,
          buyerId: userId,
          offerAmount,
          expirationHours: 48,
        }),
      });

      const data = await response.json();
      if (data.offer) {
        // Refresh listings
        fetchMarketplaceData();
      }
    } catch (error) {
      console.error('Error making offer:', error);
    }
  };

  const MarketOverview = () => (
    <div className="space-y-6">
      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Active Listings</p>
                  <p className="text-2xl font-bold text-blue-900">{listings?.length || 0}</p>
                  <p className="text-xs text-blue-500 mt-1">+12% from last week</p>
                </div>
                <Store className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Volume</p>
                  <p className="text-2xl font-bold text-green-900">
                    ${marketMetrics?.aggregatedMetrics?.totalVolume?.toLocaleString() || '0'}
                  </p>
                  <p className="text-xs text-green-500 mt-1">+24% from last month</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Average Price</p>
                  <p className="text-2xl font-bold text-purple-900">
                    ${marketMetrics?.aggregatedMetrics?.avgPrice?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-purple-500 mt-1">+8% this month</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Active Traders</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {marketMetrics?.aggregatedMetrics?.totalUsers || 0}
                  </p>
                  <p className="text-xs text-orange-500 mt-1">+15% this quarter</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Market Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-blue-500" />
            Market Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <BarChart3 className="h-16 w-16 text-gray-300" />
            <span className="ml-4">Market trends visualization would be here</span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions?.slice(0, 5).map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="font-medium">Transaction Completed</p>
                    <p className="text-sm text-gray-600">
                      Asset sold for ${transaction.salePrice}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600">
                  {transaction.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ListingCard = ({ listing, index }: { listing: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-12 w-12 text-blue-500 opacity-50" />
          </div>
          <div className="absolute top-3 right-3 flex gap-2">
            {listing.featured && (
              <Badge className="bg-yellow-500 text-white">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            <Badge variant="outline">
              {listing.assetOwnership?.assetType}
            </Badge>
          </div>
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-white/90 text-gray-900">
              ${listing.askingPrice}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
                {listing.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {listing.description?.substring(0, 80)}...
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {listing.viewCount}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {listing.favoriteCount}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {new Date(listing.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {listing.seller?.name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">
                {listing.seller?.name || 'Unknown'}
              </span>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMakeOffer(listing.id, listing.askingPrice * 0.9)}
              >
                Make Offer
              </Button>
              <Button size="sm">
                <ShoppingCart className="h-4 w-4 mr-1" />
                Buy Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const ListingsGrid = () => (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search listings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  <SelectItem value="widget">Widgets</SelectItem>
                  <SelectItem value="template">Templates</SelectItem>
                  <SelectItem value="plugin">Plugins</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price_low">Price: Low to High</SelectItem>
                  <SelectItem value="price_high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="ending_soon">Ending Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
        </CardContent>
      </Card>

      {/* Listings */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-gray-200" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {listings?.map((listing, index) => (
            <ListingCard key={listing.id} listing={listing} index={index} />
          ))}
        </div>
      )}

      {!loading && listings?.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No listings found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const MyAssets = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">My Digital Assets</h2>
        <Button>
          <Package className="h-4 w-4 mr-2" />
          List Asset for Sale
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userAssets?.map((asset, index) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">{asset.assetType}</Badge>
                  <Badge 
                    className={
                      asset.isListedForSale ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }
                  >
                    {asset.isListedForSale ? "Listed" : "Owned"}
                  </Badge>
                </div>

                <h3 className="font-semibold mb-2">
                  {asset.originalAssetDetails?.displayName || asset.assetId}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Purchase Price:</span>
                    <span>${asset.originalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Value:</span>
                    <span>${asset.currentValuation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Value:</span>
                    <span className="text-green-600">${asset.estimatedValue}</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {!asset.isListedForSale ? (
                    <Button size="sm" className="flex-1">
                      List for Sale
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="flex-1">
                      View Listing
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {userAssets?.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No assets owned</h3>
            <p className="text-gray-500 mb-4">
              Purchase assets from the primary marketplace to start trading
            </p>
            <Button>
              <ExternalLink className="h-4 w-4 mr-2" />
              Browse Primary Marketplace
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Secondary Marketplace</h1>
              <p className="text-gray-600 mt-2">
                Trade your digital assets in a secure, transparent marketplace
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Listing
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              Marketplace
            </TabsTrigger>
            {userId && (
              <TabsTrigger value="assets" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                My Assets
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview">
            <MarketOverview />
          </TabsContent>

          <TabsContent value="listings">
            <ListingsGrid />
          </TabsContent>

          {userId && (
            <TabsContent value="assets">
              <MyAssets />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

