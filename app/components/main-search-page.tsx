
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

  // Alla 84 enterprise appar från gallery_fixed
  const enterpriseApps = [
    { name: 'Advanced Analytics Dashboard', category: 'advanced-features', icon: BarChart3, color: '#3B82F6' },
    { name: 'Advanced Features', category: 'advanced-features', icon: Sparkles, color: '#8B5CF6' },
    { name: 'Advanced Security Center', category: 'advanced-features', icon: Users, color: '#EF4444' },
    { name: 'AI Analytics', category: 'ai-features', icon: Sparkles, color: '#10B981' },
    { name: 'AI Command Center', category: 'ai-features', icon: Zap, color: '#F59E0B' },
    { name: 'AI Insights', category: 'ai-features', icon: TrendingUp, color: '#6366F1' },
    { name: 'AI Behavior Analytics', category: 'ai-features', icon: Users, color: '#EC4899' },
    { name: 'AI Content Manager', category: 'ai-features', icon: MessageSquare, color: '#14B8A6' },
    { name: 'AI Personalization Overview', category: 'ai-features', icon: Sparkles, color: '#F97316' },
    { name: 'AI Recommendations', category: 'ai-features', icon: TrendingUp, color: '#8B5CF6' },
    { name: 'AI Personalization Settings', category: 'ai-features', icon: Users, color: '#EF4444' },
    { name: 'AI Studio', category: 'ai-features', icon: Zap, color: '#3B82F6' },
    { name: 'Analytics Dashboard', category: 'analytics', icon: BarChart3, color: '#10B981' },
    { name: 'Advanced Analytics', category: 'analytics', icon: TrendingUp, color: '#F59E0B' },
    { name: 'Behavior Analytics', category: 'analytics', icon: Users, color: '#6366F1' },
    { name: 'YouTube Referral Analytics', category: 'analytics', icon: BarChart3, color: '#EC4899' },
    { name: 'Analytics Platform', category: 'analytics', icon: Database, color: '#14B8A6' },
    { name: 'Creator Dashboard', category: 'analytics', icon: Users, color: '#F97316' },
    { name: 'Viral Referrals', category: 'analytics', icon: TrendingUp, color: '#8B5CF6' },
    { name: 'Authentication Signin', category: 'authentication', icon: Users, color: '#EF4444' },
    { name: 'Intelligent BI', category: 'business-intelligence', icon: BarChart3, color: '#3B82F6' },
    { name: 'Community Hub', category: 'community-features', icon: Users, color: '#10B981' },
    { name: 'Community Marketplace', category: 'community-features', icon: Database, color: '#F59E0B' },
    { name: 'Community Overview', category: 'community-features', icon: MessageSquare, color: '#6366F1' },
    { name: 'AI Personalization Dashboard', category: 'core-features', icon: Sparkles, color: '#EC4899' },
    { name: 'Command Center', category: 'core-features', icon: Zap, color: '#14B8A6' },
    { name: 'Main Dashboard', category: 'core-features', icon: BarChart3, color: '#F97316' },
    { name: 'Scene Dashboard', category: 'dashboards', icon: TrendingUp, color: '#8B5CF6' },
    { name: 'Demo Builder', category: 'demo-tools', icon: Sparkles, color: '#EF4444' },
    { name: 'Demo Scenarios', category: 'demo-tools', icon: Users, color: '#3B82F6' },
    { name: 'Go Live Preparation', category: 'deployment-tools', icon: Zap, color: '#10B981' },
    { name: 'Developer Collaboration', category: 'developer-tools', icon: MessageSquare, color: '#F59E0B' },
    { name: 'GitHub Integration', category: 'development-platforms', icon: Database, color: '#6366F1' },
    { name: 'StackOverflow Integration', category: 'development-platforms', icon: Users, color: '#EC4899' },
    { name: 'Documentation Center', category: 'documentation', icon: BarChart3, color: '#14B8A6' },
    { name: 'Gamification Achievements', category: 'engagement-tools', icon: TrendingUp, color: '#F97316' },
    { name: 'Gamification Challenges', category: 'engagement-tools', icon: Sparkles, color: '#8B5CF6' },
    { name: 'Gamification Leaderboards', category: 'engagement-tools', icon: Users, color: '#EF4444' },
    { name: 'Gamification Overview', category: 'engagement-tools', icon: Zap, color: '#3B82F6' },
    { name: 'Gamification Rewards', category: 'engagement-tools', icon: MessageSquare, color: '#10B981' },
    { name: 'Enterprise Hub', category: 'enterprise-tools', icon: Database, color: '#F59E0B' },
    { name: 'Enterprise Integration Hub', category: 'enterprise-tools', icon: BarChart3, color: '#6366F1' },
    { name: 'Executive Dashboard', category: 'executive-tools', icon: TrendingUp, color: '#EC4899' },
    { name: 'International Expansion', category: 'expansion-tools', icon: Sparkles, color: '#14B8A6' },
    { name: 'Expansion Currencies', category: 'expansion-tools', icon: Users, color: '#F97316' },
    { name: 'Expansion Languages', category: 'expansion-tools', icon: Zap, color: '#8B5CF6' },
    { name: 'Market Regions', category: 'expansion-tools', icon: MessageSquare, color: '#EF4444' },
    { name: 'Governance Center', category: 'governance-tools', icon: Database, color: '#3B82F6' },
    { name: 'Homepage', category: 'homepage', icon: BarChart3, color: '#10B981' },
    { name: 'API Explorer', category: 'integrations', icon: TrendingUp, color: '#F59E0B' },
    { name: 'Developer Portal', category: 'integrations', icon: Sparkles, color: '#6366F1' },
    { name: 'API Management', category: 'integrations', icon: Users, color: '#EC4899' },
    { name: 'API Marketplace', category: 'integrations', icon: Zap, color: '#14B8A6' },
    { name: 'API Overview', category: 'integrations', icon: MessageSquare, color: '#F97316' },
    { name: 'API Webhooks', category: 'integrations', icon: Database, color: '#8B5CF6' },
    { name: 'Integrations Main', category: 'integrations', icon: BarChart3, color: '#EF4444' },
    { name: 'Integrations Hub', category: 'integrations', icon: TrendingUp, color: '#3B82F6' },
    { name: 'Migration Management', category: 'migration-tools', icon: Sparkles, color: '#10B981' },
    { name: 'ML Ops', category: 'ml-tools', icon: Users, color: '#F59E0B' },
    { name: 'Health Monitoring', category: 'monitoring', icon: Zap, color: '#6366F1' },
    { name: 'Monitoring Overview', category: 'monitoring', icon: MessageSquare, color: '#EC4899' },
    { name: 'Real Time Monitoring', category: 'monitoring', icon: Database, color: '#14B8A6' },
    { name: 'Performance Dashboard', category: 'monitoring', icon: BarChart3, color: '#F97316' },
    { name: 'Performance Center', category: 'monitoring', icon: TrendingUp, color: '#8B5CF6' },
    { name: 'Performance Metrics', category: 'monitoring', icon: Sparkles, color: '#EF4444' },
    { name: 'Performance Optimization', category: 'monitoring', icon: Users, color: '#3B82F6' },
    { name: 'System Health', category: 'monitoring', icon: Zap, color: '#10B981' },
    { name: 'Onboarding Portal', category: 'onboarding', icon: MessageSquare, color: '#F59E0B' },
    { name: 'Opensource Contributions', category: 'opensource', icon: Database, color: '#6366F1' },
    { name: 'Plugin Marketplace', category: 'plugins', icon: BarChart3, color: '#EC4899' },
    { name: 'Presentation Builder', category: 'presentation-tools', icon: TrendingUp, color: '#14B8A6' },
    { name: 'Pricing Calculator', category: 'pricing-tools', icon: Sparkles, color: '#F97316' },
    { name: 'Resource Allocation', category: 'resource-management', icon: Users, color: '#8B5CF6' },
    { name: 'Sales Deck', category: 'sales-tools', icon: Zap, color: '#EF4444' },
    { name: 'Sales Enablement', category: 'sales-tools', icon: MessageSquare, color: '#3B82F6' },
    { name: 'Security Center', category: 'security', icon: Database, color: '#10B981' },
    { name: 'Security Main', category: 'security', icon: BarChart3, color: '#F59E0B' },
    { name: 'Customer Success', category: 'support-tools', icon: TrendingUp, color: '#6366F1' },
    { name: 'Tenant Analytics', category: 'tenant-management', icon: Sparkles, color: '#EC4899' },
    { name: 'Tenant Customization', category: 'tenant-management', icon: Users, color: '#14B8A6' },
    { name: 'Tenant Management', category: 'tenant-management', icon: Zap, color: '#F97316' },
    { name: 'Tenant Provisioning', category: 'tenant-management', icon: MessageSquare, color: '#8B5CF6' },
    { name: 'Testing Center', category: 'testing-tools', icon: Database, color: '#EF4444' },
    { name: 'Widget Factory', category: 'widgets', icon: BarChart3, color: '#3B82F6' }
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
          <div className="mx-auto mb-6 h-24 w-24 bg-black rounded-full border-4 border-gray-800 flex items-center justify-center relative">
            <div className="text-center">
              <div className="text-white text-xs font-bold mb-1 leading-none">HIGH SIERRA</div>
              <div className="text-white text-xs font-bold mb-1 leading-none">FOR ALL</div>
              <div className="w-8 h-8 bg-white rounded-sm mx-auto mb-1 flex items-center justify-center">
                <div className="w-6 h-6 bg-black rounded-sm flex items-center justify-center">
                  <div className="text-white text-xs">👨</div>
                </div>
              </div>
              <div className="text-white text-xs font-bold leading-none">MR.</div>
              <div className="text-white text-xs font-bold leading-none">REPLACEMENT</div>
            </div>
          </div>
          <h1 className="text-4xl font-light text-gray-800 mb-2">
            Mr. Replacement
          </h1>
          <p className="text-lg text-gray-600">
            High Sierra For All - Enterprise Search & Discovery Platform
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

      {/* Enterprise Apps Grid - Alla 84 appar */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Enterprise Applications ({enterpriseApps.length} Available)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {enterpriseApps.map((app, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-105 bg-white border border-gray-200">
              <CardContent className="p-4">
                <div 
                  className="h-12 w-12 mx-auto mb-3 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: app.color + '20' }}
                >
                  <app.icon className="h-6 w-6" style={{ color: app.color }} />
                </div>
                <h3 className="font-medium text-gray-800 mb-1 text-xs leading-tight">
                  {app.name}
                </h3>
                <Badge 
                  variant="outline" 
                  className="text-xs px-2 py-1" 
                  style={{ 
                    borderColor: app.color + '50',
                    color: app.color,
                    backgroundColor: app.color + '10'
                  }}
                >
                  {app.category.replace(/-/g, ' ')}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Connect the Dots Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
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
