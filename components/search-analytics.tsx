
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  TrendingUp, 
  Clock, 
  Target, 
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchAnalytics {
  totalSearches: number;
  popularQueries: Array<{
    query: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  recentSearches: Array<{
    query: string;
    timestamp: string;
    results: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    searches: number;
    percentage: number;
  }>;
  averageResultsPerSearch: number;
  searchSuccessRate: number;
}

// Mock data - in a real app, this would come from your analytics service
const mockAnalytics: SearchAnalytics = {
  totalSearches: 1247,
  popularQueries: [
    { query: 'dashboard', count: 156, trend: 'up' },
    { query: 'ai studio', count: 134, trend: 'up' },
    { query: 'analytics', count: 98, trend: 'stable' },
    { query: 'security', count: 87, trend: 'down' },
    { query: 'integrations', count: 76, trend: 'up' },
  ],
  recentSearches: [
    { query: 'performance monitoring', timestamp: '2 min ago', results: 8 },
    { query: 'ai insights', timestamp: '5 min ago', results: 12 },
    { query: 'widget factory', timestamp: '8 min ago', results: 6 },
    { query: 'governance center', timestamp: '12 min ago', results: 4 },
    { query: 'testing center', timestamp: '15 min ago', results: 9 },
  ],
  categoryBreakdown: [
    { category: 'AI & Intelligence', searches: 387, percentage: 31 },
    { category: 'Core Platform', searches: 298, percentage: 24 },
    { category: 'Security & Performance', searches: 224, percentage: 18 },
    { category: 'Integration & Operations', searches: 187, percentage: 15 },
    { category: 'Management & Governance', searches: 151, percentage: 12 },
  ],
  averageResultsPerSearch: 7.3,
  searchSuccessRate: 94.2
};

export function SearchAnalytics() {
  const [analytics, setAnalytics] = useState<SearchAnalytics>(mockAnalytics);
  const [isLoading, setIsLoading] = useState(false);

  const refreshAnalytics = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAnalytics(mockAnalytics);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sökanalys</h2>
          <p className="text-muted-foreground">
            Insikter om hur användare söker i systemet
          </p>
        </div>
        <Button
          onClick={refreshAnalytics}
          disabled={isLoading}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Uppdatera
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totala sökningar</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalSearches.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% från förra månaden
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Genomsnittliga resultat</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageResultsPerSearch}</div>
            <p className="text-xs text-muted-foreground">
              resultat per sökning
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Framgångsgrad</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.searchSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">
              sökningar med resultat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Populäraste kategori</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">AI & Intelligence</div>
            <p className="text-xs text-muted-foreground">
              {analytics.categoryBreakdown[0].percentage}% av alla sökningar
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Popular Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Populära sökningar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.popularQueries.map((query, index) => (
                <motion.div
                  key={query.query}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{index + 1}
                    </span>
                    <span className="font-medium">{query.query}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {query.count}
                    </span>
                    <Badge
                      variant={
                        query.trend === 'up' ? 'default' :
                        query.trend === 'down' ? 'destructive' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {query.trend === 'up' ? '↗' : query.trend === 'down' ? '↘' : '→'}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Searches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Senaste sökningar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.recentSearches.map((search, index) => (
                <motion.div
                  key={`${search.query}-${search.timestamp}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{search.query}</div>
                    <div className="text-sm text-muted-foreground">
                      {search.timestamp}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {search.results} resultat
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Sökningar per kategori
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.categoryBreakdown.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{category.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {category.searches} sökningar
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {category.percentage}%
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <motion.div
                    className="bg-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SearchAnalytics;
