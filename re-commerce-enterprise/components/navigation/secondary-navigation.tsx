
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown,
  BarChart3,
  Brain,
  Shield,
  ShieldCheck,
  Zap,
  Activity,
  Plug,
  Building2,
  TrendingUp,
  Cpu,
  Database,
  Briefcase,
  Settings,
  ChevronDown,
  ChevronRight,
  Star,
  Clock,
  Users,
  Globe,
  ArrowRight,
  Plus,
  Filter,
  Search,
  MoreHorizontal,
  LayoutDashboard,
  FileCheck,
  MonitorSpeaker,
  GitBranch,
  BookOpen,
  Rocket,
  TestTube,
  Blocks,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useNavigation } from './navigation-context';
import { cn } from '@/lib/utils';

interface SecondaryNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  badge?: string;
  isActive?: boolean;
  children?: SecondaryNavItem[];
}

interface SecondaryNavSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  items: SecondaryNavItem[];
  quickActions?: Array<{
    label: string;
    icon: React.ReactNode;
    href: string;
    description: string;
  }>;
}

export function SecondaryNavigation() {
  const pathname = usePathname();
  const { currentSection, getSectionFromPath, user } = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('');

  // Define contextual navigation for each section
  const navigationSections: Record<string, SecondaryNavSection> = {
    'Core Enterprise': {
      id: 'core-enterprise',
      label: 'Core Enterprise',
      icon: <Crown className="h-4 w-4" />,
      items: [
        {
          label: 'Executive Dashboard',
          href: '/dashboard',
          icon: <LayoutDashboard className="h-4 w-4" />,
          description: 'High-level KPIs and metrics'
        },
        {
          label: 'Analytics Hub',
          href: '/analytics',
          icon: <BarChart3 className="h-4 w-4" />,
          description: 'Business intelligence and reporting',
          children: [
            {
              label: 'Real-time Analytics',
              href: '/analytics/realtime',
              icon: <Activity className="h-4 w-4" />
            },
            {
              label: 'Advanced Analytics',
              href: '/advanced-analytics-dashboard',
              icon: <TrendingUp className="h-4 w-4" />
            }
          ]
        },
        {
          label: 'AI Command Center',
          href: '/ai-command-center',
          icon: <Brain className="h-4 w-4" />,
          badge: 'AI',
          description: 'AI-powered insights and automation',
          children: [
            {
              label: 'AI Analytics',
              href: '/ai-analytics',
              icon: <Brain className="h-4 w-4" />
            },
            {
              label: 'AI Insights',
              href: '/ai-insights',
              icon: <Star className="h-4 w-4" />
            },
            {
              label: 'AI Studio',
              href: '/ai-studio',
              icon: <Settings className="h-4 w-4" />
            }
          ]
        }
      ],
      quickActions: [
        {
          label: 'Create Dashboard',
          icon: <Plus className="h-4 w-4" />,
          href: '/dashboard/create',
          description: 'Build new analytics dashboard'
        },
        {
          label: 'Generate Report',
          icon: <BarChart3 className="h-4 w-4" />,
          href: '/analytics/reports/new',
          description: 'Create custom business report'
        }
      ]
    },
    'Security & Compliance': {
      id: 'security-compliance',
      label: 'Security & Compliance',
      icon: <Shield className="h-4 w-4" />,
      items: [
        {
          label: 'Security Center',
          href: '/security-center',
          icon: <Shield className="h-4 w-4" />,
          description: 'Comprehensive security monitoring'
        },
        {
          label: 'Advanced Security',
          href: '/advanced-security-center',
          icon: <ShieldCheck className="h-4 w-4" />,
          badge: 'Advanced',
          description: 'Advanced threat detection and response'
        },
        {
          label: 'Governance Center',
          href: '/governance-center',
          icon: <FileCheck className="h-4 w-4" />,
          description: 'Compliance and policy management'
        }
      ],
      quickActions: [
        {
          label: 'Security Scan',
          icon: <Shield className="h-4 w-4" />,
          href: '/security-center/scan',
          description: 'Run comprehensive security scan'
        },
        {
          label: 'Compliance Check',
          icon: <FileCheck className="h-4 w-4" />,
          href: '/governance-center/compliance',
          description: 'Verify regulatory compliance'
        }
      ]
    },
    'Performance & Operations': {
      id: 'performance-operations',
      label: 'Performance & Operations',
      icon: <Zap className="h-4 w-4" />,
      items: [
        {
          label: 'Performance Center',
          href: '/performance-center',
          icon: <Zap className="h-4 w-4" />,
          description: 'System optimization and monitoring'
        },
        {
          label: 'System Health',
          href: '/system-health',
          icon: <Activity className="h-4 w-4" />,
          badge: 'Live',
          description: 'Real-time system health monitoring'
        },
        {
          label: 'Infrastructure',
          href: '/performance-optimization',
          icon: <MonitorSpeaker className="h-4 w-4" />,
          description: 'Infrastructure management'
        }
      ],
      quickActions: [
        {
          label: 'Performance Test',
          icon: <Zap className="h-4 w-4" />,
          href: '/performance-center/test',
          description: 'Run performance benchmarks'
        },
        {
          label: 'Health Check',
          icon: <Activity className="h-4 w-4" />,
          href: '/system-health/check',
          description: 'Comprehensive system health check'
        }
      ]
    },
    'Integration & Automation': {
      id: 'integration-automation',
      label: 'Integration & Automation',
      icon: <Plug className="h-4 w-4" />,
      items: [
        {
          label: 'Integration Hub',
          href: '/integrations-hub',
          icon: <Plug className="h-4 w-4" />,
          description: 'API management and integrations'
        },
        {
          label: 'Enterprise Integrations',
          href: '/enterprise-integration-hub',
          icon: <Building2 className="h-4 w-4" />,
          description: 'CRM, ERP, and enterprise systems'
        },
        {
          label: 'Automation Workflows',
          href: '/integrations',
          icon: <GitBranch className="h-4 w-4" />,
          description: 'Automated business processes'
        }
      ],
      quickActions: [
        {
          label: 'New Integration',
          icon: <Plus className="h-4 w-4" />,
          href: '/integrations-hub/new',
          description: 'Create new API integration'
        },
        {
          label: 'Workflow Builder',
          icon: <GitBranch className="h-4 w-4" />,
          href: '/integrations/workflows/new',
          description: 'Build automation workflow'
        }
      ]
    },
    'Business Intelligence': {
      id: 'business-intelligence',
      label: 'Business Intelligence',
      icon: <TrendingUp className="h-4 w-4" />,
      items: [
        {
          label: 'Advanced Analytics',
          href: '/advanced-analytics-dashboard',
          icon: <TrendingUp className="h-4 w-4" />,
          description: 'Deep business insights and reporting'
        },
        {
          label: 'ML Operations',
          href: '/ml-ops',
          icon: <Cpu className="h-4 w-4" />,
          badge: 'ML',
          description: 'Machine learning operations'
        },
        {
          label: 'Data Warehouse',
          href: '/intelligent-bi',
          icon: <Database className="h-4 w-4" />,
          description: 'OLAP operations and data management'
        }
      ],
      quickActions: [
        {
          label: 'Create Model',
          icon: <Cpu className="h-4 w-4" />,
          href: '/ml-ops/models/new',
          description: 'Build new ML model'
        },
        {
          label: 'Data Query',
          icon: <Database className="h-4 w-4" />,
          href: '/intelligent-bi/query',
          description: 'Execute data warehouse query'
        }
      ]
    },
    'Enterprise Management': {
      id: 'enterprise-management',
      label: 'Enterprise Management',
      icon: <Briefcase className="h-4 w-4" />,
      items: [
        {
          label: 'Executive Dashboard',
          href: '/executive-dashboard',
          icon: <Crown className="h-4 w-4" />,
          badge: 'C-Suite',
          description: 'Executive-level metrics and KPIs'
        },
        {
          label: 'Documentation Center',
          href: '/documentation-center',
          icon: <BookOpen className="h-4 w-4" />,
          description: 'Comprehensive documentation'
        },
        {
          label: 'Governance Center',
          href: '/governance-center',
          icon: <Award className="h-4 w-4" />,
          description: 'Policies and compliance management'
        }
      ],
      quickActions: [
        {
          label: 'Executive Report',
          icon: <Crown className="h-4 w-4" />,
          href: '/executive-dashboard/reports/new',
          description: 'Generate executive summary'
        },
        {
          label: 'Policy Review',
          icon: <Award className="h-4 w-4" />,
          href: '/governance-center/policies',
          description: 'Review governance policies'
        }
      ]
    },
    'Developer & Admin': {
      id: 'developer-admin',
      label: 'Developer & Admin',
      icon: <Settings className="h-4 w-4" />,
      items: [
        {
          label: 'Go-Live Preparation',
          href: '/go-live-preparation',
          icon: <Rocket className="h-4 w-4" />,
          badge: 'Production',
          description: 'Production deployment readiness'
        },
        {
          label: 'Testing Center',
          href: '/testing-center',
          icon: <TestTube className="h-4 w-4" />,
          description: 'Quality assurance and testing'
        },
        {
          label: 'Widget Factory',
          href: '/widget-factory',
          icon: <Blocks className="h-4 w-4" />,
          description: 'Custom component development'
        }
      ],
      quickActions: [
        {
          label: 'Deploy',
          icon: <Rocket className="h-4 w-4" />,
          href: '/go-live-preparation/deploy',
          description: 'Deploy to production'
        },
        {
          label: 'Run Tests',
          icon: <TestTube className="h-4 w-4" />,
          href: '/testing-center/run',
          description: 'Execute test suite'
        }
      ]
    }
  };

  // Get current section navigation
  const getCurrentSection = () => {
    const section = getSectionFromPath(pathname);
    return navigationSections[section] || null;
  };

  const currentSectionNav = getCurrentSection();

  // Don't render if no current section or on home page
  if (!currentSectionNav || pathname === '/') {
    return null;
  }

  const isItemActive = (href: string) => {
    if (href === pathname) return true;
    return pathname.startsWith(href) && href !== '/';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Section Title & Icon */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {currentSectionNav.icon}
              <span className="font-medium text-gray-900">{currentSectionNav.label}</span>
            </div>
            <Separator orientation="vertical" className="h-6" />
            
            {/* Section Navigation Items */}
            <div className="hidden md:flex items-center space-x-1">
              {currentSectionNav.items.slice(0, 4).map((item) => (
                <div key={item.href} className="relative">
                  {item.children ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            'flex items-center space-x-2 h-8 px-3',
                            isItemActive(item.href) 
                              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' 
                              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                          )}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                          {item.badge && (
                            <Badge variant="outline" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-64">
                        <Link href={item.href}>
                          <DropdownMenuItem className="flex items-center space-x-2">
                            {item.icon}
                            <div>
                              <p className="font-medium">{item.label}</p>
                              <p className="text-xs text-gray-600">{item.description}</p>
                            </div>
                          </DropdownMenuItem>
                        </Link>
                        {item.children && (
                          <>
                            <DropdownMenuSeparator />
                            {item.children.map((child) => (
                              <Link key={child.href} href={child.href}>
                                <DropdownMenuItem className="flex items-center space-x-2">
                                  {child.icon}
                                  <span>{child.label}</span>
                                </DropdownMenuItem>
                              </Link>
                            ))}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Link href={item.href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          'flex items-center space-x-2 h-8 px-3',
                          isItemActive(item.href) 
                            ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' 
                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge variant="outline" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
              
              {/* More Items Dropdown */}
              {currentSectionNav.items.length > 4 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    {currentSectionNav.items.slice(4).map((item) => (
                      <Link key={item.href} href={item.href}>
                        <DropdownMenuItem className="flex items-center space-x-2">
                          {item.icon}
                          <div>
                            <p className="font-medium">{item.label}</p>
                            <p className="text-xs text-gray-600">{item.description}</p>
                          </div>
                        </DropdownMenuItem>
                      </Link>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Right Section - Quick Actions */}
          <div className="flex items-center space-x-2">
            {/* Section Search */}
            <div className="hidden lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                <Input
                  placeholder={`Search ${currentSectionNav.label.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1 h-8 w-48 text-sm bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Quick Actions */}
            {currentSectionNav.quickActions && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-3">
                    <Plus className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Quick Actions</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72" align="end">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {currentSectionNav.quickActions.map((action, index) => (
                        <Link key={index} href={action.href}>
                          <Button variant="ghost" className="w-full justify-start h-auto p-3">
                            <div className="flex items-start space-x-3">
                              {action.icon}
                              <div className="text-left">
                                <div className="font-medium">{action.label}</div>
                                <div className="text-xs text-gray-600">{action.description}</div>
                              </div>
                            </div>
                          </Button>
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                </PopoverContent>
              </Popover>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  {currentSectionNav.items.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <DropdownMenuItem className="flex items-center space-x-2">
                        {item.icon}
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-xs text-gray-600">{item.description}</p>
                        </div>
                      </DropdownMenuItem>
                    </Link>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
