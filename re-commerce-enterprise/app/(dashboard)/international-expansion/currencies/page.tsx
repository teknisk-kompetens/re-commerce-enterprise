
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Globe,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  lastUpdated: string;
  isBaseCurrency: boolean;
  isActive: boolean;
  currentExchangeRate: number;
  lastRateUpdate: string;
}

export default function CurrencyManagementPage() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshingRates, setRefreshingRates] = useState(false);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/global-payments/currencies?active=true&includeRates=true');
      const data = await response.json();
      if (data.success) {
        setCurrencies(data.data);
      }
    } catch (error) {
      console.error('Error fetching currencies:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshExchangeRates = async () => {
    try {
      setRefreshingRates(true);
      // In a real implementation, this would call an external API
      const mockRates = [
        { currencyCode: 'EUR', rate: 0.85 },
        { currencyCode: 'GBP', rate: 0.73 },
        { currencyCode: 'SEK', rate: 10.45 },
        { currencyCode: 'NOK', rate: 10.89 },
        { currencyCode: 'DKK', rate: 6.36 },
        { currencyCode: 'JPY', rate: 110.25 },
      ];

      const response = await fetch('/api/global-payments/exchange-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rates: mockRates,
          provider: 'demo',
          baseCurrency: 'USD'
        })
      });

      const data = await response.json();
      if (data.success) {
        await fetchCurrencies();
      }
    } catch (error) {
      console.error('Error refreshing exchange rates:', error);
    } finally {
      setRefreshingRates(false);
    }
  };

  const formatCurrency = (amount: number, currency: Currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: currency.code === 'JPY' ? 0 : 2,
      maximumFractionDigits: currency.code === 'JPY' ? 0 : 4
    }).format(amount);
  };

  const getRateChange = (current: number, previous: number) => {
    if (!previous) return null;
    const change = ((current - previous) / previous) * 100;
    return {
      value: change,
      isPositive: change > 0,
      isNeutral: Math.abs(change) < 0.01
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const baseCurrency = currencies.find(c => c.isBaseCurrency);
  const activeCurrencies = currencies.filter(c => c.isActive);
  const totalCurrencies = currencies.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Currency Management</h1>
          <p className="text-gray-600 mt-2">
            Manage currencies, exchange rates, and multi-currency pricing
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={refreshExchangeRates}
            disabled={refreshingRates}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshingRates ? 'animate-spin' : ''}`} />
            {refreshingRates ? 'Refreshing...' : 'Refresh Rates'}
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Currency
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
              <CardTitle className="text-sm font-medium">Total Currencies</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCurrencies}</div>
              <p className="text-xs text-gray-600">
                {activeCurrencies.length} active
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
              <CardTitle className="text-sm font-medium">Base Currency</CardTitle>
              <Globe className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {baseCurrency?.code || 'None'}
              </div>
              <p className="text-xs text-gray-600">
                {baseCurrency?.name || 'No base currency set'}
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
              <CardTitle className="text-sm font-medium">Last Rate Update</CardTitle>
              <RefreshCw className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currencies.length > 0 
                  ? new Date(Math.max(...currencies.map(c => new Date(c.lastRateUpdate || c.lastUpdated).getTime()))).toLocaleDateString()
                  : 'Never'
                }
              </div>
              <p className="text-xs text-gray-600">
                Exchange rates updated
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
              <CardTitle className="text-sm font-medium">Rate Alerts</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-gray-600">
                No alerts active
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Currencies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Currency Exchange Rates</CardTitle>
          <CardDescription>
            Current exchange rates and currency configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currency</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Exchange Rate</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currencies.map((currency) => {
                  const rateChange = getRateChange(currency.currentExchangeRate, currency.exchangeRate);
                  
                  return (
                    <TableRow key={currency.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div>
                            <div className="font-medium">{currency.name}</div>
                            <div className="text-sm text-gray-500">
                              Symbol: {currency.symbol}
                            </div>
                          </div>
                          {currency.isBaseCurrency && (
                            <Badge variant="default" className="text-xs">Base</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium">
                        {currency.code}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {currency.isBaseCurrency 
                            ? '1.0000' 
                            : currency.currentExchangeRate?.toFixed(4) || 'N/A'
                          }
                        </div>
                        <div className="text-xs text-gray-500">
                          vs {baseCurrency?.code || 'USD'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {rateChange && !rateChange.isNeutral ? (
                          <div className={`flex items-center space-x-1 ${
                            rateChange.isPositive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {rateChange.isPositive ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            <span className="text-sm font-medium">
                              {Math.abs(rateChange.value).toFixed(2)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {currency.isActive ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(currency.lastRateUpdate || currency.lastUpdated).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {!currency.isBaseCurrency && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Exchange Rate History Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Exchange Rate Trends</CardTitle>
          <CardDescription>
            Historical exchange rate movements over the past 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Exchange rate chart coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
