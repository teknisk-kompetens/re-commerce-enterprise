
'use client';

import React, { useState, useEffect } from 'react';
import { Command, Search, Hash, FileText, Zap, Crown, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { 
  searchEngine, 
  getSuggestions, 
  SearchResult, 
  SearchableItem,
  searchByCategory,
  getFeaturedItems 
} from '@/lib/search-index';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

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

export function SearchCommandPalette({ isOpen, onClose }: SearchCommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  // Get categories for filtering
  const categories = Array.from(new Set(
    searchEngine.getIndex().docs?.map((doc: any) => doc.category) || []
  ));

  // Search function
  useEffect(() => {
    if (query.length === 0) {
      setResults(getFeaturedItems().slice(0, 8).map(item => ({ ...item })));
      setSelectedIndex(0);
      return;
    }

    const searchResults = selectedCategory 
      ? searchByCategory(query, selectedCategory)
      : getSuggestions(query, 10);
    
    setResults(searchResults);
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : results.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  const handleSelect = (item: SearchableItem) => {
    onClose();
    router.push(item.href);
  };

  const clearCategory = () => {
    setSelectedCategory(null);
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 transform"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-4 rounded-lg border bg-background shadow-2xl">
            {/* Header */}
            <div className="flex items-center border-b px-4 py-3">
              <Search className="mr-3 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder={selectedCategory ? `Sök i ${selectedCategory}...` : "Sök genom alla sidor och funktioner..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              {selectedCategory && (
                <button
                  onClick={clearCategory}
                  className="ml-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Rensa filter
                </button>
              )}
            </div>

            {/* Category Filters */}
            {!selectedCategory && (
              <div className="border-b p-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "rounded-full px-3 py-1 text-xs transition-colors",
                        categoryColors[category as keyof typeof categoryColors] || 'bg-gray-500/10 text-gray-700 border-gray-200'
                      )}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {results.length === 0 && query && (
                <div className="py-8 text-center text-muted-foreground">
                  <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>Inga resultat hittades för "{query}"</p>
                  <p className="text-sm mt-1">Prova att söka med andra termer</p>
                </div>
              )}

              {results.length === 0 && !query && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Populära funktioner
                  </h3>
                </div>
              )}

              {results.length > 0 && (
                <div className="p-2">
                  {!query && (
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                      Populära funktioner
                    </div>
                  )}
                  {query && (
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
                      {results.length} resultat{selectedCategory ? ` i ${selectedCategory}` : ''}
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    {results.map((result, index) => {
                      const TypeIcon = typeIcons[result.type] || FileText;
                      const categoryColor = categoryColors[result.category as keyof typeof categoryColors] || 'bg-gray-500/10 text-gray-700 border-gray-200';
                      
                      return (
                        <motion.div
                          key={result.id}
                          whileHover={{ scale: 1.01 }}
                          className={cn(
                            "flex items-center gap-3 rounded-lg p-3 cursor-pointer transition-colors",
                            selectedIndex === index ? "bg-accent" : "hover:bg-accent/50"
                          )}
                          onClick={() => handleSelect(result)}
                        >
                          <div className="flex-shrink-0">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                              <TypeIcon className="h-4 w-4 text-primary" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm truncate">{result.title}</h4>
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
                            <p className="text-xs text-muted-foreground truncate mb-1">
                              {result.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={cn("text-xs", categoryColor)}>
                                {result.category}
                              </Badge>
                              {result.score && result.score < 0.3 && (
                                <span className="text-xs text-green-600 font-medium">
                                  Exakt matchning
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex-shrink-0">
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t px-4 py-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Använd ↑↓ för att navigera, Enter för att välja</span>
                <span>ESC för att stänga</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SearchCommandPalette;
