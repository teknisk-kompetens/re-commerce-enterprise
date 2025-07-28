
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Globe,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Clock,
  Settings,
  Plus,
  Edit,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface MarketRegion {
  id: string;
  code: string;
  name: string;
  countries: string[];
  isActive: boolean;
  language: {
    code: string;
    name: string;
    nativeName: string;
  };
  currency: {
    code: string;
    name: string;
    symbol: string;
    exchangeRate: number;
  };
  paymentMethods: Array<{
    id: string;
    name: string;
    code: string;
    type: string;
  }>;
  statistics: {
    isConfiguredForTenant: boolean;
    paymentMethodsCount: number;
    hasCustomizations: boolean;
    averageValue: number;
    totalValue: number;
    dataPoints: number;
  };
}

export default function MarketRegionsPage() {
  const [marketRegions, setMarketRegions] = useState<MarketRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<MarketRegion | null>(null);

  useEffect(() => {
    fetchMarketRegions();
  }, []);

  const fetchMarketRegions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/market-regions?active=true');
      const data = await response.json();
      if (data.success) {
        setMarketRegions(data.data);
      }
    } catch (error) {
      console.error('Error fetching market regions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const configuredRegions = marketRegions.filter(r => r.statistics.isConfiguredForTenant);
  const totalCountries = [...new Set(marketRegions.flatMap(r => r.countries))].length;
  const totalPaymentMethods = marketRegions.reduce((sum, r) => sum + r.statistics.paymentMethodsCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Market Regions</h1>
          <p className="text-gray-600 mt-2">
            Configure regional settings, payment methods, and cultural adaptations
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Region Settings
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Region
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Regions</CardTitle>
              <Globe className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{marketRegions.length}</div>
              <p className="text-xs text-gray-600">
                {configuredRegions.length} configured
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries Covered</CardTitle>
              <MapPin className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCountries}</div>
              <p className="text-xs text-gray-600">
                Across all regions
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPaymentMethods}</div>
              <p className="text-xs text-gray-600">
                Total configured
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Markets</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {marketRegions.filter(r => r.isActive).length}
              </div>
              <p className="text-xs text-gray-600">
                Currently active
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Market Regions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketRegions.map((region, index) => (
          <motion.div
            key={region.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${
              region.statistics.isConfiguredForTenant ? 'border-blue-200 bg-blue-50' : ''
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{region.name}</CardTitle>
                    <CardDescription className="text-sm">
                      Code: {region.code}
                    </CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    {region.statistics.isConfiguredForTenant && (
                      <Badge variant="default" className="text-xs">Configured</Badge>
                    )}
                    {region.isActive ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Inactive</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Countries */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Countries</div>
                  <div className="flex flex-wrap gap-1">
                    {region.countries.slice(0, 6).map((country, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {country}
                      </Badge>
                    ))}
                    {region.countries.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{region.countries.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Language & Currency */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Language</div>
                    <div className="text-sm text-gray-600">
                      {region.language.name}
                      <div className="text-xs text-gray-500">
                        ({region.language.code.toUpperCase()})
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-1">Currency</div>
                    <div className="text-sm text-gray-600">
                      {region.currency.code}
                      <div className="text-xs text-gray-500">
                        {region.currency.symbol} {region.currency.name}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Payment Methods</div>
                  <div className="flex items-center space-x-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {region.statistics.paymentMethodsCount}
                    </div>
                    <div className="text-sm text-gray-500">configured</div>
                  </div>
                  {region.paymentMethods.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {region.paymentMethods.slice(0, 3).map((method) => (
                        <Badge key={method.id} variant="secondary" className="text-xs">
                          {method.name}
                        </Badge>
                      ))}
                      {region.paymentMethods.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{region.paymentMethods.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Performance Metrics */}
                {region.statistics.dataPoints > 0 && (
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Performance</div>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-gray-100 rounded p-2">
                        <div className="text-lg font-bold text-gray-900">
                          {region.statistics.totalValue.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">Total Value</div>
                      </div>
                      <div className="bg-gray-100 rounded p-2">
                        <div className="text-lg font-bold text-gray-900">
                          {region.statistics.dataPoints}
                        </div>
                        <div className="text-xs text-gray-600">Data Points</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {marketRegions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Market Regions</h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first market region to begin international expansion.
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Market Region
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
