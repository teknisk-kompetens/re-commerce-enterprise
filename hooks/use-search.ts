
'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  searchEngine, 
  getSuggestions, 
  searchByCategory, 
  searchByType, 
  SearchResult, 
  SearchableItem 
} from '@/lib/search-index';

export interface UseSearchOptions {
  debounceMs?: number;
  maxResults?: number;
  category?: string;
  type?: SearchableItem['type'];
  minQueryLength?: number;
}

export interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isLoading: boolean;
  hasResults: boolean;
  clearSearch: () => void;
  search: (searchQuery: string) => void;
}

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    debounceMs = 150,
    maxResults = 10,
    category,
    type,
    minQueryLength = 1
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      if (searchQuery.length < minQueryLength) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      let searchResults: SearchResult[];

      if (category) {
        searchResults = searchByCategory(searchQuery, category);
      } else if (type) {
        searchResults = searchByType(searchQuery, type);
      } else {
        searchResults = getSuggestions(searchQuery, maxResults);
      }

      setResults(searchResults.slice(0, maxResults));
      setIsLoading(false);
    }, debounceMs),
    [category, type, maxResults, minQueryLength, debounceMs]
  );

  // Handle query changes
  useEffect(() => {
    if (query.length === 0) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    if (query.length < minQueryLength) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debouncedSearch(query);
  }, [query, debouncedSearch, minQueryLength]);

  // Manual search function
  const search = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  // Clear search function
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsLoading(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    hasResults: results.length > 0,
    clearSearch,
    search
  };
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

// Hook for global search shortcut
export function useSearchShortcut(onOpen: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpen();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onOpen]);
}

export default useSearch;
