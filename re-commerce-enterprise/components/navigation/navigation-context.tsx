
'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationContextValue {
  // Sidebar state
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  
  // Current navigation state
  currentPage: string;
  currentSection: string;
  
  // Multi-tenant context
  currentTenant: string;
  setCurrentTenant: (tenant: string) => void;
  
  // User context
  user: {
    name: string;
    email: string;
    role: string;
    permissions: string[];
  };
  
  // Navigation helpers
  isPageActive: (href: string) => boolean;
  getSectionFromPath: (path: string) => string;
  
  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Favorites
  favorites: string[];
  toggleFavorite: (href: string) => void;
  
  // Recent pages
  recentPages: Array<{
    href: string;
    title: string;
    timestamp: Date;
  }>;
  addToRecent: (href: string, title: string) => void;
}

const NavigationContext = createContext<NavigationContextValue | undefined>(undefined);

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTenant, setCurrentTenant] = useState('Acme Corporation');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentPages, setRecentPages] = useState<Array<{
    href: string;
    title: string;
    timestamp: Date;
  }>>([]);

  // Mock user data - in production, this would come from auth context
  const user = useMemo(() => ({
    name: 'John Anderson',
    email: 'john.anderson@acme.com',
    role: 'Enterprise Admin',
    permissions: [
      'admin',
      'analytics',
      'security',
      'integrations',
      'ai',
      'performance',
      'governance',
      'developer'
    ]
  }), []);

  // Memoized section mapping to prevent recreating on every render
  const sectionMap = useMemo(() => ({
    '/dashboard': 'Core Enterprise',
    '/analytics': 'Core Enterprise',
    '/ai-command-center': 'Core Enterprise',
    '/ai-analytics': 'Core Enterprise',
    '/ai-insights': 'Core Enterprise',
    '/ai-studio': 'Core Enterprise',
    
    '/security': 'Security & Compliance',
    '/security-center': 'Security & Compliance',
    '/advanced-security-center': 'Security & Compliance',
    '/governance-center': 'Security & Compliance',
    
    '/performance': 'Performance & Operations',
    '/performance-center': 'Performance & Operations',
    '/performance-optimization': 'Performance & Operations',
    '/system-health': 'Performance & Operations',
    
    '/integrations': 'Integration & Automation',
    '/integrations-hub': 'Integration & Automation',
    '/enterprise-integration-hub': 'Integration & Automation',
    '/enterprise-hub': 'Integration & Automation',
    
    '/advanced-analytics-dashboard': 'Business Intelligence',
    '/advanced-features': 'Business Intelligence',
    '/ml-ops': 'Business Intelligence',
    '/intelligent-bi': 'Business Intelligence',
    
    '/executive-dashboard': 'Enterprise Management',
    '/command-center': 'Enterprise Management',
    '/documentation-center': 'Enterprise Management',
    
    '/go-live-preparation': 'Developer & Admin',
    '/testing-center': 'Developer & Admin',
    '/widget-factory': 'Developer & Admin'
  }), []);

  // Memoized route mapping for titles
  const routeMapping = useMemo(() => ({
    '/dashboard': 'Dashboard',
    '/analytics': 'Analytics',
    '/ai-command-center': 'AI Command Center',
    '/ai-analytics': 'AI Analytics',
    '/security-center': 'Security Center',
    '/performance-center': 'Performance Center',
    '/integrations-hub': 'Integration Hub',
  }), []);

  // Memoized navigation helpers
  const getSectionFromPath = useCallback((path: string): string => {
    return sectionMap[path] || 'Other';
  }, [sectionMap]);

  const isPageActive = useCallback((href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }, [pathname]);

  // Get current page and section from pathname
  const currentPage = pathname;
  const currentSection = useMemo(() => getSectionFromPath(pathname), [pathname, getSectionFromPath]);

  // Favorites management
  const toggleFavorite = useCallback((href: string) => {
    setFavorites(prev => 
      prev.includes(href) 
        ? prev.filter(f => f !== href)
        : [...prev, href]
    );
  }, []);

  // Recent pages management
  const addToRecent = useCallback((href: string, title: string) => {
    setRecentPages(prev => {
      const filtered = prev.filter(p => p.href !== href);
      return [
        { href, title, timestamp: new Date() },
        ...filtered
      ].slice(0, 10); // Keep only last 10 pages
    });
  }, []);

  // Load favorites from localStorage (only once)
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('navigation-favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }, []);

  // Save favorites to localStorage (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('navigation-favorites', JSON.stringify(favorites));
      } catch (error) {
        console.error('Failed to save favorites:', error);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [favorites]);

  // Load recent pages from localStorage (only once)
  useEffect(() => {
    try {
      const savedRecent = localStorage.getItem('navigation-recent');
      if (savedRecent) {
        const parsed = JSON.parse(savedRecent);
        setRecentPages(parsed.map((p: any) => ({
          ...p,
          timestamp: new Date(p.timestamp)
        })));
      }
    } catch (error) {
      console.error('Failed to load recent pages:', error);
    }
  }, []);

  // Save recent pages to localStorage (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        localStorage.setItem('navigation-recent', JSON.stringify(recentPages));
      } catch (error) {
        console.error('Failed to save recent pages:', error);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [recentPages]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Add current page to recent pages (debounced to prevent infinite loops)
  useEffect(() => {
    if (pathname !== '/') {
      const timeoutId = setTimeout(() => {
        const getPageTitle = (path: string) => {
          return routeMapping[path] || path.split('/').pop()?.replace(/-/g, ' ') || 'Unknown';
        };

        const title = getPageTitle(pathname);
        addToRecent(pathname, title);
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [pathname, addToRecent, routeMapping]);

  const value: NavigationContextValue = useMemo(() => ({
    sidebarOpen,
    setSidebarOpen,
    currentPage,
    currentSection,
    currentTenant,
    setCurrentTenant,
    user,
    isPageActive,
    getSectionFromPath,
    searchQuery,
    setSearchQuery,
    favorites,
    toggleFavorite,
    recentPages,
    addToRecent
  }), [
    sidebarOpen,
    currentPage,
    currentSection,
    currentTenant,
    user,
    isPageActive,
    getSectionFromPath,
    searchQuery,
    favorites,
    recentPages,
    toggleFavorite,
    addToRecent
  ]);

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}
