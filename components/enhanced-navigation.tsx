
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { GlobalSearch } from '@/components/ui/search';
import { SearchCommandPalette } from '@/components/search-command-palette';
import { useSearchShortcut } from '@/hooks/use-search';

interface NavigationItem {
  title: string;
  href: string;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  { title: 'Dashboard', href: '/dashboard', description: 'Huvudöversikt' },
  { title: 'AI Studio', href: '/ai-studio', description: 'AI-verktyg' },
  { title: 'Analytics', href: '/analytics', description: 'Dataanalys' },
  { title: 'Security', href: '/security-center', description: 'Säkerhet' },
  { title: 'Integrations', href: '/integrations-hub', description: 'Integrationer' },
];

export function EnhancedNavigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const pathname = usePathname();

  // Setup global search shortcut
  useSearchShortcut(() => setIsCommandPaletteOpen(true));

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          {/* Logo */}
          <div className="mr-6 flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">RE</span>
              </div>
              <span className="hidden font-bold sm:inline-block">
                Re-Commerce Enterprise
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Search */}
            <div className="flex items-center space-x-4">
              <div className="w-64">
                <GlobalSearch />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCommandPaletteOpen(true)}
                className="hidden lg:flex"
              >
                <Command className="h-4 w-4 mr-2" />
                Kommandopalett
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex flex-1 items-center justify-end md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="mr-2"
            >
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t md:hidden">
            <div className="container py-4">
              <nav className="flex flex-col space-y-3">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "block px-3 py-2 text-base font-medium transition-colors hover:text-foreground/80",
                      pathname === item.href ? "text-foreground" : "text-foreground/60"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div>
                      {item.title}
                      {item.description && (
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </nav>
              
              <div className="mt-4 pt-4 border-t">
                <GlobalSearch className="w-full" />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Command Palette */}
      <SearchCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
}

export default EnhancedNavigation;
