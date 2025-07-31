
"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, TrendingUp, Clock, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AI_CONSCIOUSNESSES } from '@/lib/consciousness-data';
import { SearchSuggestion, SearchFilters } from '@/lib/types';
import Image from 'next/image';

interface SearchInterfaceProps {
  onSearch: (query: string, filters?: SearchFilters) => void;
  suggestions?: SearchSuggestion[];
  loading?: boolean;
}

export default function SearchInterface({ onSearch, suggestions = [], loading = false }: SearchInterfaceProps) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAI, setSelectedAI] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock suggestions data
  const mockSuggestions: SearchSuggestion[] = [
    { query: 'AI implementation strategies', type: 'trending', category: 'Technology', resultsCount: 234 },
    { query: 'remote team management', type: 'trending', category: 'Leadership', resultsCount: 156 },
    { query: 'sustainable business practices', type: 'ai-suggested', category: 'Business', resultsCount: 89 },
    { query: 'UX design principles', type: 'trending', category: 'Design', resultsCount: 167 },
  ];

  const mockRecentSearches = [
    'machine learning trends',
    'project management tools',
    'customer experience optimization'
  ];

  useEffect(() => {
    setRecentSearches(mockRecentSearches);
  }, []);

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;

    const filters: SearchFilters = {
      aiAssistance: !!selectedAI,
      consciousnessId: selectedAI || undefined,
      sortBy: 'relevance'
    };

    onSearch(finalQuery, filters);

    // Add to recent searches
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== finalQuery);
      return [finalQuery, ...filtered].slice(0, 5);
    });

    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAI(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      {/* Logo Area */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Mr. RE:commerce
          </span>
        </h1>
        <p className="text-xl text-muted-foreground">
          Intelligent Enterprise Search & Discovery Platform
        </p>
      </motion.div>

      {/* AI Assistant Selection */}
      <motion.div 
        className="flex justify-center gap-3 mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {AI_CONSCIOUSNESSES.map((ai) => (
          <Card
            key={ai.id}
            className={`p-3 cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedAI === ai.id ? 'ring-2 ring-offset-2' : 'hover:scale-105'
            }`}
            style={selectedAI === ai.id ? { 
              borderColor: ai.primaryColor
            } : {}}
            onClick={() => setSelectedAI(selectedAI === ai.id ? null : ai.id)}
          >
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={ai.avatar}
                  alt={ai.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">{ai.name}</div>
                <div className="text-xs text-muted-foreground">
                  {ai.specialty[0]}
                </div>
              </div>
              {selectedAI === ai.id && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-2 h-6 w-6 p-0"
                  onClick={clearSelection}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Search Box */}
      <motion.div 
        className="relative mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <Input
            ref={inputRef}
            type="text"
            placeholder={
              selectedAI 
                ? `Ask ${AI_CONSCIOUSNESSES.find(ai => ai.id === selectedAI)?.name} anything...`
                : "Search for anything..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-12 pr-32 py-6 text-lg border-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:border-primary"
          />

          {selectedAI && (
            <div className="absolute inset-y-0 right-16 flex items-center">
              <Badge 
                variant="secondary" 
                className="flex items-center gap-1"
                style={{ backgroundColor: `${AI_CONSCIOUSNESSES.find(ai => ai.id === selectedAI)?.primaryColor}20` }}
              >
                <Sparkles className="h-3 w-3" />
                AI Assist
              </Badge>
            </div>
          )}

          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <Button
              onClick={() => handleSearch()}
              disabled={!query.trim() || loading}
              className="rounded-full px-6"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && (query.length > 0 || recentSearches.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto"
            >
              {/* Recent Searches */}
              {query.length === 0 && recentSearches.length > 0 && (
                <div className="p-4 border-b">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Recent Searches</span>
                  </div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search);
                        handleSearch(search);
                      }}
                      className="block w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              )}

              {/* Trending Suggestions */}
              {mockSuggestions.filter(s => s.query.toLowerCase().includes(query.toLowerCase())).length > 0 && (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Trending</span>
                  </div>
                  {mockSuggestions
                    .filter(s => s.query.toLowerCase().includes(query.toLowerCase()))
                    .slice(0, 5)
                    .map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(suggestion.query);
                          handleSearch(suggestion.query);
                        }}
                        className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <span>{suggestion.query}</span>
                          {suggestion.type === 'ai-suggested' && (
                            <Badge variant="secondary" className="text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />
                              AI
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {suggestion.resultsCount} results
                        </span>
                      </button>
                    ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {[
          'AI & Machine Learning',
          'Business Strategy', 
          'Design Trends',
          'Technology News',
          'Leadership Insights'
        ].map((topic, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => {
              setQuery(topic);
              handleSearch(topic);
            }}
            className="rounded-full hover:scale-105 transition-transform"
          >
            {topic}
          </Button>
        ))}
      </motion.div>

      {/* Background click to close suggestions */}
      {showSuggestions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}
