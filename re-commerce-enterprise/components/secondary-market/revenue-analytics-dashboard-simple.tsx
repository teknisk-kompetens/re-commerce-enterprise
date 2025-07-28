
'use client';

import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface RevenueAnalyticsDashboardProps {
  userId?: string;
  userRole?: string;
  tenantId?: string;
}

export default function RevenueAnalyticsDashboard({ 
  userId, 
  userRole, 
  tenantId 
}: RevenueAnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeframe, setTimeframe] = useState("monthly");

  const mockRevenueData = {
    totalRevenue: 245000,
    monthlyGrowth: 18.5,
    totalTransactions: 12450,
    averageOrderValue: 89.50,
    topCategories: [
      { name: "Digital Art", revenue: 85000, percentage: 35 },
      { name: "Templates", revenue: 62000, percentage: 25 },
      { name: "Photography", revenue: 48000, percentage: 20 },
      { name: "Music", revenue: 50000, percentage: 20 }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Revenue Analytics Dashboard
          </h1>
          <p className="text-gray-600">Comprehensive insights into platform revenue and market performance</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-900">
                      ${mockRevenueData.totalRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-green-500 mt-1">
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      +{mockRevenueData.monthlyGrowth}% this month
                    </p>
                  </div>
                  <DollarSign className="h-10 w-10 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Transactions</p>
                    <p className="text-3xl font-bold text-blue-900">
                      {mockRevenueData.totalTransactions.toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">
                      <Activity className="h-3 w-3 inline mr-1" />
                      +12% vs last month
                    </p>
                  </div>
                  <BarChart3 className="h-10 w-10 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Avg Order Value</p>
                    <p className="text-3xl font-bold text-purple-900">
                      ${mockRevenueData.averageOrderValue}
                    </p>
                    <p className="text-xs text-purple-500 mt-1">
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      +8% increase
                    </p>
                  </div>
                  <PieChart className="h-10 w-10 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Active Users</p>
                    <p className="text-3xl font-bold text-orange-900">8,240</p>
                    <p className="text-xs text-orange-500 mt-1">
                      <Users className="h-3 w-3 inline mr-1" />
                      +15% growth
                    </p>
                  </div>
                  <Users className="h-10 w-10 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {timeframe}
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Revenue Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly revenue performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-blue-600">Revenue Chart</p>
                    <p className="text-sm text-blue-500">Interactive chart will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Categories</CardTitle>
                <CardDescription>Revenue breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRevenueData.topCategories.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{category.name}</h4>
                          <p className="text-sm text-gray-500">{category.percentage}% of total revenue</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          ${category.revenue.toLocaleString()}
                        </p>
                        <Progress value={category.percentage} className="w-24 mt-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends Analysis</CardTitle>
                <CardDescription>Detailed trend analysis and forecasting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <TrendingUp className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-green-600">Trend Analysis</p>
                    <p className="text-sm text-green-500">Advanced trend charts and predictions will be shown here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Detailed breakdown by product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <PieChart className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-lg font-semibold text-purple-600">Category Analytics</p>
                    <p className="text-sm text-purple-500">Detailed category performance metrics will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Reports</CardTitle>
                <CardDescription>Generate and download detailed revenue reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <Download className="h-6 w-6 mb-2" />
                    <span>Monthly Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <Download className="h-6 w-6 mb-2" />
                    <span>Quarterly Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <Download className="h-6 w-6 mb-2" />
                    <span>Annual Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <Download className="h-6 w-6 mb-2" />
                    <span>Category Report</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <Download className="h-6 w-6 mb-2" />
                    <span>User Analytics</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                    <Download className="h-6 w-6 mb-2" />
                    <span>Custom Report</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
