
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ArrowRight, Hash, FileText, Zap, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  searchEngine, 
  getSuggestions, 
  SearchResult, 
  SearchableItem,
  getFeaturedItems 
} from '@/lib/search-index';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchProps {
  className?: string;
  placeholder?: string;
  showShortcut?: boolean;
  onSelect?: (item: SearchableItem) => void;
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

export function GlobalSearch({ 
  className, 
  placeholder = "Sök genom alla sidor och funktioner...", 
  showShortcut = true,
  onSelect 
}: SearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.length === 0) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      const searchResults = getSuggestions(searchQuery, 12);
      setResults(searchResults);
      setSelectedIndex(-1);
      setIsLoading(false);
    }, 150),
    []
  );

  // Handle input changes
  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) {
        // Global shortcut to open search (Cmd/Ctrl + K)
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }
        return;
      }

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setQuery('');
          setResults([]);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
          } else if (results.length > 0) {
            handleSelect(results[0]);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  // Handle item selection
  const handleSelect = (item: SearchableItem) => {
    setIsOpen(false);
    setQuery('');
    setResults([]);
    setSelectedIndex(-1);
    
    if (onSelect) {
      onSelect(item);
    } else {
      router.push(item.href);
    }
  };

  // Get featured items when no query
  const featuredItems = getFeaturedItems();

  return (
    <>
      {/* Search Trigger */}
      <div className={cn("relative", className)}>
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground hover:bg-accent"
          onClick={() => setIsOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span className="flex-1 text-left">{placeholder}</span>
          {showShortcut && (
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </Button>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Search Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 transform"
            >
              <Card className="mx-4 shadow-2xl">
                <div className="flex items-center border-b px-4 py-3">
                  <Search className="mr-3 h-5 w-5 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                    autoFocus
                  />
                  {query && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setQuery('');
                        setResults([]);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <CardContent className="max-h-96 overflow-y-auto p-0">
                  {isLoading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  )}

                  {!isLoading && query && results.length === 0 && (
                    <div className="py-8 text-center text-muted-foreground">
                      <Search className="mx-auto h-8 w-8 mb-2 opacity-50" />
                      <p>Inga resultat hittades för "{query}"</p>
                      <p className="text-sm mt-1">Prova att söka med andra termer</p>
                    </div>
                  )}

                  {!isLoading && !query && featuredItems.length > 0 && (
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">
                        Populära funktioner
                      </h3>
                      <div className="space-y-1">
                        {featuredItems.slice(0, 6).map((item, index) => (
                          <SearchResultItem
                            key={item.id}
                            item={item}
                            isSelected={selectedIndex === index}
                            onClick={() => handleSelect(item)}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {!isLoading && results.length > 0 && (
                    <div className="p-4">
                      <div className="space-y-1">
                        {results.map((result, index) => (
                          <SearchResultItem
                            key={result.id}
                            item={result}
                            isSelected={selectedIndex === index}
                            onClick={() => handleSelect(result)}
                            score={result.score}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* Footer */}
                <div className="border-t px-4 py-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Använd ↑↓ för att navigera, Enter för att välja</span>
                    <span>ESC för att stänga</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface SearchResultItemProps {
  item: SearchableItem;
  isSelected: boolean;
  onClick: () => void;
  score?: number;
}

function SearchResultItem({ item, isSelected, onClick, score }: SearchResultItemProps) {
  const TypeIcon = typeIcons[item.type] || FileText;
  const categoryColor = categoryColors[item.category as keyof typeof categoryColors] || 'bg-gray-500/10 text-gray-700 border-gray-200';

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={cn(
        "flex items-center gap-3 rounded-lg p-3 cursor-pointer transition-colors",
        isSelected ? "bg-accent" : "hover:bg-accent/50"
      )}
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
          <TypeIcon className="h-4 w-4 text-primary" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-sm truncate">{item.title}</h4>
          {item.badge && (
            <Badge variant="secondary" className="text-xs">
              {item.badge}
            </Badge>
          )}
          {item.status === 'beta' && (
            <Badge variant="outline" className="text-xs">
              BETA
            </Badge>
          )}
          {item.status === 'new' && (
            <Badge className="text-xs bg-green-100 text-green-700">
              NY
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate mb-1">
          {item.description}
        </p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("text-xs", categoryColor)}>
            {item.category}
          </Badge>
          {score && score < 0.3 && (
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
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default GlobalSearch;
