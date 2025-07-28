
'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { MobileNavigation } from '@/components/navigation/mobile-navigation';
import { BreadcrumbEnhanced, BreadcrumbCompact } from '@/components/navigation/breadcrumb-enhanced';
import { fadeInVariants, slideInFromLeftVariants } from '@/lib/design-system/animation-system';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
  showMobileNav?: boolean;
  className?: string;
  contentClassName?: string;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export function ResponsiveLayout({
  children,
  showBreadcrumbs = true,
  showMobileNav = true,
  className,
  contentClassName,
  user
}: ResponsiveLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile nav when screen size changes to desktop
  useEffect(() => {
    if (!isMobile && isMobileNavOpen) {
      setIsMobileNavOpen(false);
    }
  }, [isMobile, isMobileNavOpen]);

  return (
    <div className={cn('min-h-screen bg-neutral-50 dark:bg-neutral-900', className)}>
      {/* Mobile Navigation */}
      {showMobileNav && (
        <MobileNavigation
          isOpen={isMobileNavOpen}
          onToggle={() => setIsMobileNavOpen(!isMobileNavOpen)}
          user={user}
        />
      )}

      {/* Main Content Area */}
      <motion.div
        className={cn(
          'flex flex-col min-h-screen',
          'transition-all duration-300 ease-out',
          isMobileNavOpen && 'md:ml-0' // Ensure no margin on desktop
        )}
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Area */}
        <motion.header
          className={cn(
            'sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200',
            'dark:bg-neutral-900/95 dark:border-neutral-700',
            'px-4 py-4 md:px-6 lg:px-8'
          )}
          variants={slideInFromLeftVariants}
        >
          <div className="flex items-center space-x-4">
            {/* Mobile spacing for hamburger menu */}
            <div className="w-12 md:w-0" />

            {/* Breadcrumbs */}
            {showBreadcrumbs && (
              <>
                {/* Desktop breadcrumbs */}
                <div className="hidden md:block flex-1">
                  <BreadcrumbEnhanced />
                </div>
                
                {/* Mobile breadcrumbs */}
                <div className="md:hidden flex-1">
                  <BreadcrumbCompact />
                </div>
              </>
            )}

            {/* Header actions can be added here */}
            <div className="flex items-center space-x-2">
              {/* Placeholder for header actions like notifications, user menu, etc. */}
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <motion.main
          className={cn(
            'flex-1 p-4 md:p-6 lg:p-8',
            'max-w-full overflow-x-hidden',
            contentClassName
          )}
          variants={fadeInVariants}
        >
          {/* Content Container with responsive max-width */}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </motion.main>

        {/* Footer */}
        <motion.footer
          className={cn(
            'border-t border-neutral-200 dark:border-neutral-700',
            'bg-white dark:bg-neutral-900',
            'px-4 py-6 md:px-6 lg:px-8'
          )}
          variants={slideInFromLeftVariants}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                © 2024 Re-Commerce Enterprise. All rights reserved.
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <a
                  href="/privacy"
                  className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200"
                >
                  Privacy
                </a>
                <a
                  href="/terms"
                  className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200"
                >
                  Terms
                </a>
                <a
                  href="/support"
                  className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors duration-200"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        </motion.footer>
      </motion.div>

      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="skip-link"
      >
        Skip to main content
      </a>
    </div>
  );
}

// Responsive Grid Component
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
  className?: string;
}

export function ResponsiveGrid({
  children,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 6,
  className
}: ResponsiveGridProps) {
  const gridClasses = [
    `grid gap-${gap}`,
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      className={cn(gridClasses, className)}
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

// Responsive Container Component
interface ResponsiveContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function ResponsiveContainer({
  children,
  size = 'xl',
  className
}: ResponsiveContainerProps) {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      'mx-auto px-4 sm:px-6 lg:px-8',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
}

// Responsive Section Component
interface ResponsiveSectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'white' | 'neutral';
}

export function ResponsiveSection({
  children,
  className,
  spacing = 'lg',
  background = 'transparent'
}: ResponsiveSectionProps) {
  const spacingClasses = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-20',
    xl: 'py-20 md:py-24'
  };

  const backgroundClasses = {
    transparent: '',
    white: 'bg-white dark:bg-neutral-900',
    neutral: 'bg-neutral-50 dark:bg-neutral-800'
  };

  return (
    <section className={cn(
      spacingClasses[spacing],
      backgroundClasses[background],
      className
    )}>
      <ResponsiveContainer>
        {children}
      </ResponsiveContainer>
    </section>
  );
}
