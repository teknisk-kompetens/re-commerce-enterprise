
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Home, 
  ChevronRight, 
  Crown,
  BarChart3,
  Brain,
  Shield,
  ShieldCheck,
  FileCheck,
  Zap,
  Activity,
  MonitorSpeaker,
  Plug,
  Building2,
  GitBranch,
  TrendingUp,
  Cpu,
  Database,
  BookOpen,
  Rocket,
  TestTube,
  Blocks,
  Award,
  Settings,
  LayoutDashboard,
  Star,
  Share2,
  MoreHorizontal,
  Clock,
  Eye,
  Copy,
  Link as LinkIcon,
  Bookmark,
  History,
  Navigation
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useNavigation } from './navigation-context';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  current?: boolean;
  description?: string;
  lastVisited?: Date;
  visitCount?: number;
}

interface BreadcrumbNavigationProps {
  className?: string;
}

export function BreadcrumbNavigation({ className }: BreadcrumbNavigationProps) {
  const pathname = usePathname();
  const { 
    favorites, 
    toggleFavorite, 
    recentPages, 
    addToRecent,
    user 
  } = useNavigation();
  
  const [showQuickNav, setShowQuickNav] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const maxBreadcrumbDepth = 4; // Maximum visible breadcrumbs before truncation

  // Route mapping for breadcrumbs
  const routeMapping: Record<string, { label: string; icon?: React.ReactNode; parent?: string }> = {
    '/': { label: 'Home', icon: <Home className="h-4 w-4" /> },
    '/dashboard': { label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />, parent: '/' },
    '/analytics': { label: 'Analytics', icon: <BarChart3 className="h-4 w-4" />, parent: '/' },
    '/ai-command-center': { label: 'AI Command Center', icon: <Brain className="h-4 w-4" />, parent: '/' },
    '/ai-analytics': { label: 'AI Analytics', icon: <Brain className="h-4 w-4" />, parent: '/' },
    '/ai-insights': { label: 'AI Insights', icon: <Brain className="h-4 w-4" />, parent: '/' },
    '/ai-studio': { label: 'AI Studio', icon: <Brain className="h-4 w-4" />, parent: '/' },
    
    // Security & Compliance
    '/security': { label: 'Security', icon: <Shield className="h-4 w-4" />, parent: '/' },
    '/security-center': { label: 'Security Center', icon: <Shield className="h-4 w-4" />, parent: '/' },
    '/advanced-security-center': { label: 'Advanced Security', icon: <ShieldCheck className="h-4 w-4" />, parent: '/' },
    '/governance-center': { label: 'Governance Center', icon: <FileCheck className="h-4 w-4" />, parent: '/' },
    
    // Performance & Operations
    '/performance': { label: 'Performance', icon: <Zap className="h-4 w-4" />, parent: '/' },
    '/performance-center': { label: 'Performance Center', icon: <Zap className="h-4 w-4" />, parent: '/' },
    '/performance-optimization': { label: 'Performance Optimization', icon: <Zap className="h-4 w-4" />, parent: '/' },
    '/system-health': { label: 'System Health', icon: <Activity className="h-4 w-4" />, parent: '/' },
    
    // Integration & Automation
    '/integrations': { label: 'Integrations', icon: <Plug className="h-4 w-4" />, parent: '/' },
    '/integrations-hub': { label: 'Integration Hub', icon: <Plug className="h-4 w-4" />, parent: '/' },
    '/enterprise-integration-hub': { label: 'Enterprise Integration Hub', icon: <Building2 className="h-4 w-4" />, parent: '/' },
    '/enterprise-hub': { label: 'Enterprise Hub', icon: <Building2 className="h-4 w-4" />, parent: '/' },
    
    // Business Intelligence
    '/advanced-analytics-dashboard': { label: 'Advanced Analytics', icon: <TrendingUp className="h-4 w-4" />, parent: '/' },
    '/advanced-features': { label: 'Advanced Features', icon: <TrendingUp className="h-4 w-4" />, parent: '/' },
    '/ml-ops': { label: 'ML Operations', icon: <Cpu className="h-4 w-4" />, parent: '/' },
    '/intelligent-bi': { label: 'Intelligent BI', icon: <Database className="h-4 w-4" />, parent: '/' },
    
    // Enterprise Management
    '/executive-dashboard': { label: 'Executive Dashboard', icon: <Crown className="h-4 w-4" />, parent: '/' },
    '/command-center': { label: 'Command Center', icon: <Crown className="h-4 w-4" />, parent: '/' },
    '/documentation-center': { label: 'Documentation Center', icon: <BookOpen className="h-4 w-4" />, parent: '/' },
    
    // Developer & Admin
    '/go-live-preparation': { label: 'Go-Live Preparation', icon: <Rocket className="h-4 w-4" />, parent: '/' },
    '/testing-center': { label: 'Testing Center', icon: <TestTube className="h-4 w-4" />, parent: '/' },
    '/widget-factory': { label: 'Widget Factory', icon: <Blocks className="h-4 w-4" />, parent: '/' },
    
    // Other routes
    '/onboarding': { label: 'Onboarding', icon: <Settings className="h-4 w-4" />, parent: '/' },
    '/auth/signin': { label: 'Sign In', icon: <Settings className="h-4 w-4" />, parent: '/' }
  };

  const generateBreadcrumbs = (currentPath: string): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [];
    let path = currentPath;

    // Build breadcrumb trail by following parent relationships
    while (path && routeMapping[path]) {
      const route = routeMapping[path];
      const recentPage = recentPages.find(p => p.href === path);
      
      breadcrumbs.unshift({
        label: route.label,
        href: path,
        icon: route.icon,
        current: path === currentPath,
        description: `Navigate to ${route.label}`,
        lastVisited: recentPage?.timestamp,
        visitCount: recentPages.filter(p => p.href === path).length
      });
      path = route.parent || '';
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs(pathname);

  // Handle breadcrumb truncation for deep navigation
  const getTruncatedBreadcrumbs = (breadcrumbs: BreadcrumbItem[]) => {
    if (breadcrumbs.length <= maxBreadcrumbDepth) {
      return breadcrumbs;
    }

    // Always show home, then truncation indicator, then last 2 levels
    const firstBreadcrumb = breadcrumbs[0];
    const lastBreadcrumbs = breadcrumbs.slice(-2);
    const truncatedBreadcrumbs = breadcrumbs.slice(1, -2);

    return {
      visible: [firstBreadcrumb, ...lastBreadcrumbs],
      truncated: truncatedBreadcrumbs
    };
  };

  const breadcrumbData = getTruncatedBreadcrumbs(breadcrumbs);
  const visibleBreadcrumbs = Array.isArray(breadcrumbData) ? breadcrumbData : breadcrumbData.visible;
  const truncatedBreadcrumbs = Array.isArray(breadcrumbData) ? [] : breadcrumbData.truncated;

  // Don't show breadcrumbs on home page
  if (pathname === '/' || breadcrumbs.length <= 1) {
    return null;
  }

  const currentPage = breadcrumbs[breadcrumbs.length - 1];
  const isCurrentPageFavorited = favorites.includes(currentPage.href);

  // Handle sharing/copying URL
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  // Handle sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentPage.label,
          text: currentPage.description || `Check out ${currentPage.label}`,
          url: window.location.href
        });
      } catch (err) {
        console.error('Failed to share:', err);
      }
    } else {
      handleCopyUrl();
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center space-x-1 px-4 py-3 text-sm text-gray-600 bg-gray-50 border-b border-gray-200',
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            )}
            
            {item.current ? (
              <span className="flex items-center space-x-2 font-medium text-gray-900">
                {item.icon}
                <span>{item.label}</span>
              </span>
            ) : (
              <Link href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 h-auto p-1 text-gray-600 hover:text-gray-900"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </motion.nav>
  );
}
