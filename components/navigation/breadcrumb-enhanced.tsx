
'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

import { cn } from '@/lib/utils';
import { slideInFromLeftVariants, staggerContainerVariants, staggerItemVariants } from '@/lib/design-system/animation-system';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  separator?: React.ReactNode;
}

// Default breadcrumb mapping based on pathname
const getDefaultBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Route mapping
  const routeMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'analytics': 'Analytics',
    'advanced-analytics-dashboard': 'Advanced Analytics',
    'ai-insights': 'AI Insights', 
    'ai-command-center': 'AI Command Center',
    'security-center': 'Security Center',
    'performance-center': 'Performance Center',
    'integrations-hub': 'Integrations Hub',
    'enterprise-hub': 'Enterprise Hub',
    'widget-factory': 'Widget Factory',
    'demo-builder': 'Demo Builder',
    'ml-ops': 'ML Operations',
    'intelligent-bi': 'Intelligent BI',
    'system-health': 'System Health',
    'testing-center': 'Testing Center',
    'documentation-center': 'Documentation Center',
    'governance-center': 'Governance Center',
    'go-live-preparation': 'Go Live Preparation',
    'settings': 'Settings',
    'users': 'Users'
  };

  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const label = routeMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    
    breadcrumbs.push({
      label,
      href: index === segments.length - 1 ? undefined : currentPath // Last item has no href
    });
  });

  return breadcrumbs;
};

export function BreadcrumbEnhanced({ 
  items, 
  className, 
  showHome = true, 
  separator = <ChevronRight className="h-4 w-4" /> 
}: BreadcrumbProps) {
  const pathname = usePathname();
  const breadcrumbItems = items || getDefaultBreadcrumbs(pathname || '');

  // Don't show breadcrumbs on home page
  if (!pathname || pathname === '/' || pathname === '/dashboard') {
    return null;
  }

  return (
    <motion.nav
      className={cn('flex items-center space-x-1 text-sm', className)}
      aria-label="Breadcrumb navigation"
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <ol className="flex items-center space-x-1" role="list">
        {/* Home Link */}
        {showHome && (
          <motion.li variants={staggerItemVariants} role="listitem">
            <Link
              href="/dashboard"
              className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded-md text-neutral-600 hover:text-neutral-900',
                'dark:text-neutral-400 dark:hover:text-neutral-100',
                'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
                'transition-all duration-200'
              )}
              aria-label="Home"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </motion.li>
        )}

        {/* Separator after home */}
        {showHome && breadcrumbItems.length > 0 && (
          <motion.li
            className="flex items-center text-neutral-400 dark:text-neutral-600"
            variants={staggerItemVariants}
            aria-hidden="true"
          >
            {separator}
          </motion.li>
        )}

        {/* Breadcrumb Items */}
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <motion.li variants={staggerItemVariants} role="listitem">
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-2 py-1 rounded-md text-neutral-600 hover:text-neutral-900',
                    'dark:text-neutral-400 dark:hover:text-neutral-100',
                    'hover:bg-neutral-100 dark:hover:bg-neutral-800',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
                    'transition-all duration-200'
                  )}
                >
                  {item.icon && (
                    <span aria-hidden="true">{item.icon}</span>
                  )}
                  <span className="truncate max-w-32 sm:max-w-none">
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span
                  className={cn(
                    'flex items-center gap-1.5 px-2 py-1 font-medium text-neutral-900 dark:text-neutral-100',
                    'truncate max-w-32 sm:max-w-none'
                  )}
                  aria-current="page"
                >
                  {item.icon && (
                    <span aria-hidden="true">{item.icon}</span>
                  )}
                  {item.label}
                </span>
              )}
            </motion.li>

            {/* Separator */}
            {index < breadcrumbItems.length - 1 && (
              <motion.li
                className="flex items-center text-neutral-400 dark:text-neutral-600"
                variants={staggerItemVariants}
                aria-hidden="true"
              >
                {separator}
              </motion.li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </motion.nav>
  );
}

// Compact breadcrumb for mobile
export function BreadcrumbCompact({ className }: { className?: string }) {
  const pathname = usePathname();
  const breadcrumbItems = getDefaultBreadcrumbs(pathname || '');
  
  if (!pathname || pathname === '/' || pathname === '/dashboard' || breadcrumbItems.length === 0) {
    return null;
  }

  const currentPage = breadcrumbItems[breadcrumbItems.length - 1];
  const parentPage = breadcrumbItems.length > 1 ? breadcrumbItems[breadcrumbItems.length - 2] : null;

  return (
    <motion.nav
      className={cn('flex items-center space-x-2 text-sm md:hidden', className)}
      aria-label="Breadcrumb navigation"
      variants={slideInFromLeftVariants}
      initial="hidden"
      animate="visible"
    >
      {parentPage?.href && (
        <>
          <Link
            href={parentPage.href}
            className={cn(
              'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100',
              'hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              'transition-all duration-200'
            )}
          >
            {parentPage.label}
          </Link>
          <ChevronRight className="h-4 w-4 text-neutral-400" aria-hidden="true" />
        </>
      )}
      <span
        className="font-medium text-neutral-900 dark:text-neutral-100 truncate"
        aria-current="page"
      >
        {currentPage.label}
      </span>
    </motion.nav>
  );
}
