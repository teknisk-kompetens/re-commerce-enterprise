
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, Zap, Users, TrendingUp, Database, BarChart3, MessageSquare } from 'lucide-react';
import SearchResults from '@/components/search-results';
import PowerModeStatus from '@/components/powermode-status';
import { getPowerModeInstance, activatePowerMode } from '@/lib/powermode-honest';
import { SearchResult } from '@/lib/types';

export default function MainSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [powerModeActive, setPowerModeActive] = useState(false);

  useEffect(() => {
    // Check if PowerMode is active on mount
    const powerMode = getPowerModeInstance();
    setPowerModeActive(powerMode.isActiveMode());
  }, []);

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock search results - in real app, this would call an API
    const mockResults: SearchResult[] = [
      {
        id: '1',
        title: 'Enterprise Dashboard Analytics',
        content: 'Comprehensive analytics dashboard for enterprise data visualization and insights.',
        excerpt: 'Analytics dashboard for enterprise data visualization.',
        type: 'ARTICLE',
        slug: 'enterprise-dashboard-analytics',
        score: 95,
        views: 1250,
        upvotes: 42,
        downvotes: 2,
        createdAt: new Date(),
        tags: [{ id: '1', name: 'analytics', slug: 'analytics', color: '#3B82F6', usageCount: 125 }],
        commentsCount: 15
      },
      {
        id: '2', 
        title: 'AI-Powered Search Documentation',
        content: 'Documentation for implementing AI-powered search capabilities in enterprise applications.',
        excerpt: 'AI-powered search implementation guide.',
        type: 'TUTORIAL',
        slug: 'ai-powered-search-documentation',
        score: 88,
        views: 890,
        upvotes: 35,
        downvotes: 1,
        createdAt: new Date(),
        tags: [{ id: '2', name: 'ai-search', slug: 'ai-search', color: '#10B981', usageCount: 89 }],
        commentsCount: 8
      },
      {
        id: '3',
        title: 'User Management System',
        content: 'Complete user management and authentication system with role-based access control.',
        excerpt: 'User management with role-based access.',
        type: 'DISCUSSION',
        slug: 'user-management-system',
        score: 82,
        views: 654,
        upvotes: 28,
        downvotes: 3,
        createdAt: new Date(),
        tags: [{ id: '3', name: 'user-management', slug: 'user-management', color: '#F59E0B', usageCount: 67 }],
        commentsCount: 12
      }
    ];

    setSearchResults(mockResults);
    setIsSearching(false);

    // If PowerMode is active, create workflow for search
    if (powerModeActive) {
      const powerMode = getPowerModeInstance();
      await powerMode.organizeWorkflow(`Search and analyze: ${searchTerm}`, {
        searchTerm,
        resultCount: mockResults.length,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleActivatePowerMode = () => {
    const success = activatePowerMode();
    if (success) {
      setPowerModeActive(true);
      console.log('🎯 PowerMode activated from main search page!');
    }
  };

  const quickSearches = [
    'Enterprise Analytics Dashboard',
    'User Management System', 
    'AI Search Documentation',
    'Database Schema Design',
    'API Integration Guide'
  ];

  const connectTheDots = [
    { icon: Users, label: 'Users', count: '2.5K+' },
    { icon: Database, label: 'Data Sources', count: '150+' },
    { icon: BarChart3, label: 'Analytics', count: '95+' },
    { icon: MessageSquare, label: 'Conversations', count: '10K+' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Google-inspired centered search */}
      <div className="text-center mb-12">
        <div className="mb-8">
          <div className="mx-auto mb-6 h-20 w-72 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-2xl">Mr. RE:commerce</span>
          </div>
          <h1 className="text-4xl font-light text-gray-800 mb-2">
            Mr. RE:commerce
          </h1>
          <p className="text-lg text-gray-600">
            Intelligent Enterprise Search & Discovery Platform
          </p>
        </div>

        {/* Main Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for knowledge, insights, and enterprise resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 focus:border-blue-500"
            />
          </div>
          
          <div className="flex justify-center gap-4 mt-6">
            <Button 
              onClick={() => handleSearch()} 
              disabled={isSearching}
              className="px-6 py-2 rounded-full"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery('')}
              className="px-6 py-2 rounded-full"
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Quick Search Suggestions */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {quickSearches.map((suggestion, index) => (
            <Badge 
              key={index}
              variant="secondary" 
              className="cursor-pointer hover:bg-blue-100 transition-colors px-3 py-1"
              onClick={() => handleSearch(suggestion)}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      </div>

      {/* PowerMode Status - Always visible */}
      <div className="mb-8">
        <PowerModeStatus />
        
        {!powerModeActive && (
          <Card className="mt-4 border-dashed border-2 border-blue-300 bg-blue-50">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Activate PowerMode 3.0 Honest Edition
              </h3>
              <p className="text-blue-600 mb-4">
                Enable structured workflow organization and transparent progress tracking
              </p>
              <Button onClick={handleActivatePowerMode} className="bg-blue-600 hover:bg-blue-700">
                <Zap className="h-4 w-4 mr-2" />
                Activate PowerMode
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Connect the Dots - Visual Network */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Connect the Dots
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {connectTheDots.map((item, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <item.icon className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-800 mb-1">{item.label}</h3>
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  {item.count}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mb-12">
          <SearchResults results={searchResults} />
        </div>
      )}

      {/* Enterprise Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Sparkles className="h-8 w-8 text-purple-500 mr-3" />
              <h3 className="text-xl font-semibold">AI-Powered Search</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Discover insights with intelligent search capabilities powered by advanced AI algorithms.
            </p>
            <Button variant="outline" size="sm">Learn More</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="text-xl font-semibold">Analytics Dashboard</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Comprehensive analytics and reporting tools for data-driven decision making.
            </p>
            <Button variant="outline" size="sm">Explore Analytics</Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-blue-500 mr-3" />
              <h3 className="text-xl font-semibold">Enterprise Ready</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Built for enterprise scale with security, compliance, and integration features.
            </p>
            <Button variant="outline" size="sm">View Features</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
