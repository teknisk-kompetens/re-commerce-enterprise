
'use client';

import React, { useState } from 'react';
import {
  Store,
  Package,
  TrendingUp,
  DollarSign,
  Users,
  Star,
  ShoppingCart,
  Search,
  Filter,
  Grid,
  List,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SecondaryMarketplaceDashboardProps {
  marketplaceData?: any;
}

export default function SecondaryMarketplaceDashboard({ 
  marketplaceData 
}: SecondaryMarketplaceDashboardProps) {
  const [activeTab, setActiveTab] = useState("browse");
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const mockAssets = [
    {
      id: 1,
      name: "Digital Art Collection #1",
      price: 150,
      originalPrice: 200,
      seller: "ArtistName",
      rating: 4.8,
      sales: 45,
      category: "Art"
    },
    {
      id: 2,
      name: "Premium Template Pack",
      price: 89,
      originalPrice: 120,
      seller: "DesignPro",
      rating: 4.9,
      sales: 152,
      category: "Templates"
    },
    {
      id: 3,
      name: "Photography Bundle",
      price: 75,
      originalPrice: 100,
      seller: "PhotoMaster",
      rating: 4.7,
      sales: 89,
      category: "Photography"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Secondary Marketplace
          </h1>
          <p className="text-gray-600">Discover and trade digital assets</p>
        </div>

        {/* Marketplace Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Assets</p>
                    <p className="text-2xl font-bold text-blue-900">12,450</p>
                    <p className="text-xs text-blue-500 mt-1">+340 this week</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Volume</p>
                    <p className="text-2xl font-bold text-green-900">$2.4M</p>
                    <p className="text-xs text-green-500 mt-1">+18% this month</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Active Traders</p>
                    <p className="text-2xl font-bold text-purple-900">8,240</p>
                    <p className="text-xs text-purple-500 mt-1">+12% growth</p>
                  </div>
                  <Users className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Avg Rating</p>
                    <p className="text-2xl font-bold text-orange-900">4.8</p>
                    <p className="text-xs text-orange-500 mt-1">High quality</p>
                  </div>
                  <Star className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="my-assets">My Assets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search digital assets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
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

            {/* Asset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockAssets.map((asset, index) => (
                <div key={asset.id}>
                  <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <CardContent className="p-0">
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg flex items-center justify-center">
                        <Package className="h-16 w-16 text-gray-400" />
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {asset.name}
                          </h3>
                          <Badge variant="secondary">{asset.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">by {asset.seller}</p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-green-600">${asset.price}</span>
                            <span className="text-sm text-gray-500 line-through">${asset.originalPrice}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{asset.rating}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{asset.sales} sales</span>
                          <Button size="sm">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <Card>
              <CardHeader>
                <CardTitle>Trending Assets</CardTitle>
                <CardDescription>Most popular assets this week</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Trending assets will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-assets">
            <Card>
              <CardHeader>
                <CardTitle>My Digital Assets</CardTitle>
                <CardDescription>Assets you own or are selling</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Your personal asset collection will be shown here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Marketplace Analytics</CardTitle>
                <CardDescription>Insights into market trends and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Detailed analytics and charts will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
