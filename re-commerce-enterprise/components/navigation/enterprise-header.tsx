
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MasterNavigation } from './master-navigation';
import { 
  Search,
  Settings,
  User,
  Moon,
  Sun,
  Monitor,
  ChevronDown
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

export function EnterpriseHeader() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get current page title for breadcrumb
  const getPageTitle = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return 'Home';
    
    const pageName = pathSegments[pathSegments.length - 1];
    return pageName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const themeIcon = mounted ? (
    theme === 'dark' ? <Sun className="h-4 w-4" /> :
    theme === 'light' ? <Moon className="h-4 w-4" /> :
    <Monitor className="h-4 w-4" />
  ) : <Monitor className="h-4 w-4" />;

  return (
    <header 
      className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and Navigation */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
              aria-label="Re-Commerce Enterprise Home"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">RE</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                  Re-Commerce Enterprise
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  Cinematic Scene Experience
                </p>
              </div>
            </Link>

            {/* Master Navigation */}
            <MasterNavigation />
          </div>

          {/* Center: Breadcrumb */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Link 
              href="/" 
              className="hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none focus:underline"
            >
              Home
            </Link>
            {pathname !== '/' && (
              <>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {getPageTitle()}
                </span>
              </>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline text-xs">Search</span>
            </Button>

            {/* Theme Toggle */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark')}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'} theme`}
              >
                {themeIcon}
              </Button>
            </div>

            {/* Notifications - Disabled to prevent errors */}
            {/* <Button
              variant="ghost"
              size="sm"
              className="relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                2
              </span>
            </Button> */}

            {/* Settings */}
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* User Menu */}
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              aria-label="User menu"
            >
              <User className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile breadcrumb */}
      <div className="lg:hidden px-4 pb-2">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link 
            href="/" 
            className="hover:text-gray-700 dark:hover:text-gray-300"
          >
            Home
          </Link>
          {pathname !== '/' && (
            <>
              <span>/</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {getPageTitle()}
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
