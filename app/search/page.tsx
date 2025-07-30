
'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  SortAsc, 
  Grid, 
  List,
  ArrowRight,
  FileText,
  Zap,
  Hash,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '@/hooks/use-search';
import { SearchResult, SearchableItem } from '@/lib/search-index';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const categoryColors = {
  'Core Platform': 'bg-blue-500/10 text-blue-700 border-blue-200',
  'AI & Intelligence': 'bg-purple-500/10 text-purple-700 border-purple-200',
  'Security & Performance': 'bg-red-500/10 text-red-700 border-red-200',
  'Integration & Operations': 'bg-green-500/10 text-green-700 border-green-200',
  'Management & Governance': 'bg-orange-500/10 text-orange-700 border-orange-200',
  'Community': 'bg-pink-500/10 text-pink-700 border-pink-200',
  'Global Operations': 'bg-cyan-500/10 text-cyan-700 border-cyan-200',
  'Analytics': 'bg-indigo-500/10 text-indigo-700 border-indigo-200'
};

const typeIcons = {
  'page': FileText,
  'component': Zap,
  'feature': Hash,
  'documentation': FileText
};

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<SearchableItem['type'] | ''>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'relevance' | 'title' | 'category'>('relevance');

  const { 
    query, 
    setQuery, 
    results, 
    isLoading, 
    hasResults 
  } = useSearch({
    debounceMs: 200,
    maxResults: 50,
    category: selectedCategory || undefined,
    type: selectedType || undefined
  });

  // Set initial query from URL params
  useEffect(() => {
    if (initialQuery && !query) {
      setQuery(initialQuery);
    }
  }, [initialQuery, query, setQuery]);

  // Get unique categories and types from results
  const categories = Array.from(new Set(results.map(r => r.category)));
  const types = Array.from(new Set(results.map(r => r.type)));

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'category':
        return a.category.localeCompare(b.category);
      case 'relevance':
      default:
        return (a.score || 0) - (b.score || 0);
    }
  });

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Sök i Re-Commerce Enterprise
        </h1>
        <p className="text-muted-foreground">
          Hitta sidor, funktioner och dokumentation snabbt och enkelt
        </p>
      </div>

      {/* Search Input */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Sök genom alla sidor och funktioner..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 text-lg h-12"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-medium mb-3">Kategori</h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === '' ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory('')}
                  >
                    Alla kategorier
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <h3 className="font-medium mb-3">Typ</h3>
                <div className="space-y-2">
                  <Button
                    variant={selectedType === '' ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => setSelectedType('')}
                  >
                    Alla typer
                  </Button>
                  {types.map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? 'default' : 'ghost'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setSelectedType(type)}
                    >
                      {type === 'page' ? 'Sidor' :
                       type === 'component' ? 'Komponenter' :
                       type === 'feature' ? 'Funktioner' : 'Dokumentation'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(selectedCategory || selectedType) && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedType('');
                  }}
                >
                  Rensa filter
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Söker...
                  </div>
                ) : hasResults ? (
                  `${results.length} resultat${query ? ` för "${query}"` : ''}`
                ) : query ? (
                  `Inga resultat för "${query}"`
                ) : (
                  'Ange en sökterm för att börja'
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="relevance">Relevans</option>
                <option value="title">Titel</option>
                <option value="category">Kategori</option>
              </select>

              {/* View Mode */}
              <div className="flex border rounded">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results List */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </CardContent>
                  </Card>
                ))}
              </motion.div>
            ) : hasResults ? (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn(
                  viewMode === 'grid' 
                    ? "grid gap-4 md:grid-cols-2" 
                    : "space-y-4"
                )}
              >
                {sortedResults.map((result, index) => (
                  <SearchResultCard
                    key={result.id}
                    result={result}
                    index={index}
                    viewMode={viewMode}
                  />
                ))}
              </motion.div>
            ) : query ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Inga resultat hittades</h3>
                <p className="text-muted-foreground mb-4">
                  Prova att söka med andra termer eller rensa filtren
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery('');
                    setSelectedCategory('');
                    setSelectedType('');
                  }}
                >
                  Rensa sökning
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Börja söka</h3>
                <p className="text-muted-foreground">
                  Ange en sökterm för att hitta sidor, funktioner och dokumentation
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface SearchResultCardProps {
  result: SearchResult;
  index: number;
  viewMode: 'grid' | 'list';
}

function SearchResultCard({ result, index, viewMode }: SearchResultCardProps) {
  const TypeIcon = typeIcons[result.type] || FileText;
  const categoryColor = categoryColors[result.category as keyof typeof categoryColors] || 'bg-gray-500/10 text-gray-700 border-gray-200';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={result.href}>
        <Card className="h-full transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <TypeIcon className="h-5 w-5 text-primary" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg truncate">{result.title}</h3>
                  {result.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {result.badge}
                    </Badge>
                  )}
                  {result.status === 'beta' && (
                    <Badge variant="outline" className="text-xs">
                      BETA
                    </Badge>
                  )}
                  {result.status === 'new' && (
                    <Badge className="text-xs bg-green-100 text-green-700">
                      NY
                    </Badge>
                  )}
                </div>

                <p className="text-muted-foreground mb-3 line-clamp-2">
                  {result.description}
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={cn("text-xs", categoryColor)}>
                    {result.category}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {result.type === 'page' ? 'Sida' :
                     result.type === 'component' ? 'Komponent' :
                     result.type === 'feature' ? 'Funktion' : 'Dokumentation'}
                  </Badge>
                  {result.score && result.score < 0.3 && (
                    <Badge className="text-xs bg-green-100 text-green-700">
                      Exakt matchning
                    </Badge>
                  )}
                </div>

                {result.tags && result.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {result.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                    {result.tags.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{result.tags.length - 3} fler
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-shrink-0">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
