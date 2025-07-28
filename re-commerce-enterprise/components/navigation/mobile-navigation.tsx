
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu,
  X,
  Home,
  BarChart3,
  Shield,
  Settings,
  Users,
  Building,
  Zap,
  Brain,
  Globe,
  ChevronRight,
  Search,
  Bell
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button-enhanced';
import { navigationVariants, slideInFromLeftVariants, staggerContainerVariants, staggerItemVariants } from '@/lib/design-system/animation-system';
import { trapFocus, announceToScreenReader } from '@/lib/design-system/accessibility-utils';

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  children?: NavigationItem[];
}

interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="h-5 w-5" />
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="h-5 w-5" />,
    children: [
      { id: 'overview', label: 'Overview', href: '/analytics', icon: <BarChart3 className="h-4 w-4" /> },
      { id: 'advanced', label: 'Advanced Analytics', href: '/advanced-analytics-dashboard', icon: <Brain className="h-4 w-4" /> },
      { id: 'ai-insights', label: 'AI Insights', href: '/ai-insights', icon: <Zap className="h-4 w-4" /> }
    ]
  },
  {
    id: 'security',
    label: 'Security Center',
    href: '/security-center',
    icon: <Shield className="h-5 w-5" />,
    badge: '2'
  },
  {
    id: 'performance',
    label: 'Performance',
    href: '/performance-center',
    icon: <Zap className="h-5 w-5" />
  },
  {
    id: 'integrations',
    label: 'Integrations',
    href: '/integrations-hub',
    icon: <Globe className="h-5 w-5" />
  },
  {
    id: 'enterprise',
    label: 'Enterprise Hub',
    href: '/enterprise-hub',
    icon: <Building className="h-5 w-5" />
  },
  {
    id: 'users',
    label: 'Users & Teams',
    href: '/users',
    icon: <Users className="h-5 w-5" />
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />
  }
];

export function MobileNavigation({ isOpen, onToggle, user }: MobileNavigationProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = React.useRef<HTMLDivElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  // Trap focus when menu is open
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const cleanup = trapFocus(menuRef.current);
      
      // Focus search input when menu opens
      setTimeout(() => {
        searchRef.current?.focus();
      }, 100);

      // Announce to screen readers
      announceToScreenReader('Navigation menu opened');

      return cleanup;
    }
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    if (isOpen && pathname) {
      onToggle();
    }
  }, [pathname, isOpen, onToggle]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle();
        announceToScreenReader('Navigation menu closed');
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onToggle]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const filteredItems = navigationItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          'md:hidden fixed top-4 left-4 z-50 bg-white/90 backdrop-blur-md shadow-lg',
          'border border-neutral-200 hover:bg-white',
          'dark:bg-neutral-800/90 dark:border-neutral-700 dark:hover:bg-neutral-800'
        )}
        onClick={onToggle}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </motion.div>
      </Button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onToggle}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Navigation Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-navigation"
            className={cn(
              'fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] z-50',
              'bg-white border-r border-neutral-200 shadow-xl',
              'dark:bg-neutral-900 dark:border-neutral-700',
              'flex flex-col md:hidden'
            )}
            variants={navigationVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
            role="navigation"
            aria-label="Main navigation"
          >
            {/* Header */}
            <motion.div
              className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700"
              variants={slideInFromLeftVariants}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">RC</span>
                </div>
                <div>
                  <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Re-Commerce
                  </h2>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    Enterprise Platform
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onToggle}
                aria-label="Close navigation menu"
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>

            {/* User Info */}
            {user && (
              <motion.div
                className="p-4 border-b border-neutral-200 dark:border-neutral-700"
                variants={slideInFromLeftVariants}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Search */}
            <motion.div
              className="p-4 border-b border-neutral-200 dark:border-neutral-700"
              variants={slideInFromLeftVariants}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search navigation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 rounded-lg border border-neutral-300',
                    'bg-white text-neutral-900 placeholder-neutral-500',
                    'focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                    'dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100',
                    'dark:focus:border-primary-400 dark:focus:ring-primary-400',
                    'transition-all duration-200 min-h-touch-target'
                  )}
                  aria-label="Search navigation items"
                />
              </div>
            </motion.div>

            {/* Navigation Items */}
            <motion.div
              className="flex-1 overflow-y-auto py-2"
              variants={staggerContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <nav className="px-4 space-y-1" role="list">
                {filteredItems.map((item) => (
                  <NavigationItem
                    key={item.id}
                    item={item}
                    pathname={pathname}
                    expandedItems={expandedItems}
                    onToggleExpanded={toggleExpanded}
                    onNavigate={onToggle}
                  />
                ))}
              </nav>
            </motion.div>

            {/* Footer Actions */}
            <motion.div
              className="p-4 border-t border-neutral-200 dark:border-neutral-700 space-y-2"
              variants={slideInFromLeftVariants}
            >
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                leftIcon={<Bell className="h-4 w-4" />}
                className="justify-start"
              >
                Notifications
              </Button>
              <Button
                variant="ghost" 
                size="sm"
                fullWidth
                leftIcon={<Settings className="h-4 w-4" />}
                className="justify-start"
              >
                Settings
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Navigation Item Component
interface NavigationItemProps {
  item: NavigationItem;
  pathname: string;
  expandedItems: Set<string>;
  onToggleExpanded: (itemId: string) => void;
  onNavigate?: () => void;
  level?: number;
}

function NavigationItem({ 
  item, 
  pathname, 
  expandedItems, 
  onToggleExpanded, 
  onNavigate,
  level = 0 
}: NavigationItemProps) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
  const isExpanded = expandedItems.has(item.id);
  const hasChildren = item.children && item.children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      onToggleExpanded(item.id);
    } else {
      onNavigate?.();
    }
  };

  return (
    <motion.div variants={staggerItemVariants} role="listitem">
      {hasChildren ? (
        <button
          className={cn(
            'w-full flex items-center justify-between p-3 rounded-lg text-left',
            'transition-all duration-200 min-h-touch-target',
            'hover:bg-neutral-100 dark:hover:bg-neutral-800',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            isActive && 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
            level > 0 && 'ml-4'
          )}
          onClick={handleClick}
          aria-expanded={isExpanded}
          aria-controls={`submenu-${item.id}`}
        >
          <div className="flex items-center space-x-3">
            <span className={cn(
              'text-neutral-600 dark:text-neutral-400',
              isActive && 'text-primary-600 dark:text-primary-400'
            )}>
              {item.icon}
            </span>
            <span className={cn(
              'font-medium text-neutral-900 dark:text-neutral-100',
              isActive && 'text-primary-700 dark:text-primary-400'
            )}>
              {item.label}
            </span>
            {item.badge && (
              <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="h-4 w-4 text-neutral-400" />
          </motion.div>
        </button>
      ) : (
        <Link
          href={item.href}
          className={cn(
            'flex items-center space-x-3 p-3 rounded-lg',
            'transition-all duration-200 min-h-touch-target',
            'hover:bg-neutral-100 dark:hover:bg-neutral-800',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            isActive && 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
            level > 0 && 'ml-4'
          )}
          aria-current={isActive ? 'page' : undefined}
        >
          <span className={cn(
            'text-neutral-600 dark:text-neutral-400',
            isActive && 'text-primary-600 dark:text-primary-400'
          )}>
            {item.icon}
          </span>
          <span className={cn(
            'font-medium text-neutral-900 dark:text-neutral-100',
            isActive && 'text-primary-700 dark:text-primary-400'
          )}>
            {item.label}
          </span>
          {item.badge && (
            <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
              {item.badge}
            </span>
          )}
        </Link>
      )}

      {/* Submenu */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            id={`submenu-${item.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-4 space-y-1 mt-2">
              {item.children?.map((child) => (
                <NavigationItem
                  key={child.id}
                  item={child}
                  pathname={pathname}
                  expandedItems={expandedItems}
                  onToggleExpanded={onToggleExpanded}
                  onNavigate={onNavigate}
                  level={level + 1}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
