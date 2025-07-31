
"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowUp, 
  ArrowDown, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Eye,
  Calendar,
  User,
  Tag,
  Filter,
  SortAsc,
  Grid,
  List
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SearchResult, SearchFilters } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { sv } from 'date-fns/locale';

interface SearchResultsProps {
  results: SearchResult[];
  loading?: boolean;
  query?: string;
  filters?: SearchFilters;
  onFilterChange?: (filters: SearchFilters) => void;
  totalResults?: number;
}

export default function SearchResults({ 
  results, 
  loading = false, 
  query = '',
  filters = {},
  onFilterChange,
  totalResults = 0
}: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState(filters.sortBy || 'relevance');

  // Mock results if none provided
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Implementing AI in Enterprise: A Complete Guide',
      content: 'Learn how to successfully implement artificial intelligence solutions in your enterprise environment. This comprehensive guide covers strategy, tools, and best practices...',
      excerpt: 'A comprehensive guide covering AI implementation strategies, tools selection, and best practices for enterprise environments.',
      type: 'ARTICLE',
      slug: 'implementing-ai-enterprise-guide',
      score: 95.5,
      views: 2456,
      upvotes: 189,
      downvotes: 12,
      createdAt: new Date('2024-01-15'),
      category: { id: '1', name: 'Technology', slug: 'technology', color: '#3B82F6', contentCount: 234 },
      tags: [
        { id: '1', name: 'AI', slug: 'ai', color: '#8B5CF6', usageCount: 456 },
        { id: '2', name: 'Enterprise', slug: 'enterprise', color: '#10B981', usageCount: 234 },
        { id: '3', name: 'Strategy', slug: 'strategy', color: '#F59E0B', usageCount: 167 }
      ],
      author: 'Dr. Sarah Chen',
      commentsCount: 23
    },
    {
      id: '2',
      title: 'Remote Team Management: Best Practices for 2024',
      content: 'Managing remote teams effectively requires new approaches and tools. Discover the latest strategies that top companies use to maintain productivity and culture...',
      excerpt: 'Explore proven strategies and tools for effective remote team management in the modern workplace.',
      type: 'DISCUSSION',
      slug: 'remote-team-management-2024',
      score: 87.2,
      views: 1834,
      upvotes: 142,
      downvotes: 8,
      createdAt: new Date('2024-01-20'),
      category: { id: '2', name: 'Leadership', slug: 'leadership', color: '#EF4444', contentCount: 156 },
      tags: [
        { id: '4', name: 'Remote Work', slug: 'remote-work', color: '#06B6D4', usageCount: 289 },
        { id: '5', name: 'Management', slug: 'management', color: '#84CC16', usageCount: 345 },
        { id: '6', name: 'Productivity', slug: 'productivity', color: '#F97316', usageCount: 234 }
      ],
      author: 'Marcus Johnson',
      commentsCount: 31
    },
    {
      id: '3',
      title: 'UX Design Trends That Will Shape 2024',
      content: 'User experience design continues to evolve rapidly. Here are the key trends that will define digital experiences in 2024, from AI-powered interfaces to sustainable design...',
      excerpt: 'Discover the UX design trends that will define digital experiences in 2024.',
      type: 'TUTORIAL',
      slug: 'ux-design-trends-2024',
      score: 82.8,
      views: 1567,
      upvotes: 124,
      downvotes: 5,
      createdAt: new Date('2024-01-18'),
      category: { id: '3', name: 'Design', slug: 'design', color: '#8B5CF6', contentCount: 189 },
      tags: [
        { id: '7', name: 'UX Design', slug: 'ux-design', color: '#EC4899', usageCount: 234 },
        { id: '8', name: 'Trends', slug: 'trends', color: '#14B8A6', usageCount: 167 },
        { id: '9', name: '2024', slug: '2024', color: '#F59E0B', usageCount: 89 }
      ],
      author: 'Elena Rodriguez',
      commentsCount: 18
    }
  ];

  const displayResults = results.length > 0 ? results : mockResults;

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort as 'relevance' | 'date' | 'votes' | 'views');
    onFilterChange?.({ ...filters, sortBy: newSort as 'relevance' | 'date' | 'votes' | 'views' });
  };

  const handleVote = (resultId: string, voteType: 'up' | 'down') => {
    // In a real app, this would make an API call
    console.log(`Voting ${voteType} on result ${resultId}`);
  };

  const handleBookmark = (resultId: string) => {
    console.log(`Bookmarking result ${resultId}`);
  };

  const handleShare = (result: SearchResult) => {
    if (navigator.share) {
      navigator.share({
        title: result.title,
        text: result.excerpt || result.content.substring(0, 200),
        url: `/content/${result.slug}`
      });
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
              <div className="h-3 bg-muted rounded w-full mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Results Header */}
      <motion.div 
        className="flex items-center justify-between mb-6 pb-4 border-b"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h2 className="text-lg font-semibold">
            {query && (
              <>
                Results for "<span className="text-primary">{query}</span>"
              </>
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            {totalResults || displayResults.length} results found
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-40">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="date">Newest</SelectItem>
              <SelectItem value="votes">Most Voted</SelectItem>
              <SelectItem value="views">Most Viewed</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-r-none"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-l-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Results Grid/List */}
      <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-6'}>
        <AnimatePresence>
          {displayResults.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300 group">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors cursor-pointer">
                      {result.title}
                    </h3>
                    
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {result.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(result.createdAt, { locale: sv, addSuffix: true })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {result.views}
                      </div>
                    </div>
                  </div>

                  {/* Type Badge */}
                  <Badge variant="secondary">
                    {result.type}
                  </Badge>
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {result.excerpt || result.content.substring(0, 200) + '...'}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {result.tags.slice(0, 3).map((tag) => (
                    <Badge 
                      key={tag.id} 
                      variant="outline" 
                      className="text-xs"
                      style={{ borderColor: tag.color, color: tag.color }}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag.name}
                    </Badge>
                  ))}
                  {result.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{result.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Voting */}
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleVote(result.id, 'up')}
                        className="p-1 h-auto hover:text-green-600"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        {result.upvotes - result.downvotes}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleVote(result.id, 'down')}
                        className="p-1 h-auto hover:text-red-600"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Comments */}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageCircle className="w-4 h-4" />
                      {result.commentsCount}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleBookmark(result.id)}
                      className="p-2 h-auto"
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleShare(result)}
                      className="p-2 h-auto"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More */}
      {displayResults.length > 0 && (
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button variant="outline" size="lg">
            Load More Results
          </Button>
        </motion.div>
      )}
    </div>
  );
}
