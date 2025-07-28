
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

import { 
  LayoutDashboard,
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
  Crown,
  Settings,
  BookOpen,
  Rocket,
  TestTube,
  Blocks,
  ChevronDown,
  ChevronRight,
  Users,
  Lock,
  Globe,
  Award,
  Briefcase,
  Command,
  Star,
  Clock,
  Target,
  HelpCircle,
  Info,
  X,
  Search,
  Heart,
  Eye,
  Webhook,
  Code,
  Store,
  MessageSquare,
  Package
} from 'lucide-react';


import { cn } from '@/lib/utils';

interface SidebarNavigationProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  description?: string;
  isNew?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
  badge?: string;
}

export function SidebarNavigation({ sidebarOpen, setSidebarOpen }: SidebarNavigationProps) {
  const pathname = usePathname();
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGroups, setFilteredGroups] = useState<NavGroup[]>([]);

  const toggleGroup = (groupLabel: string) => {
    setCollapsedGroups(prev => 
      prev.includes(groupLabel) 
        ? prev.filter(g => g !== groupLabel)
        : [...prev, groupLabel]
    );
  };

  const isGroupCollapsed = (groupLabel: string) => collapsedGroups.includes(groupLabel);

  const navigationGroups: NavGroup[] = [
    {
      label: 'Core Enterprise',
      icon: <Crown className="h-4 w-4" />,
      items: [
        {
          label: 'Dashboard',
          href: '/dashboard',
          icon: <LayoutDashboard className="h-4 w-4" />,
          description: 'Executive overview and key metrics'
        },
        {
          label: 'Analytics',
          href: '/analytics',
          icon: <BarChart3 className="h-4 w-4" />,
          description: 'Real-time business intelligence'
        },
        {
          label: 'AI Command Center',
          href: '/ai-command-center',
          icon: <Brain className="h-4 w-4" />,
          badge: 'AI',
          description: 'AI-powered insights and automation'
        }
      ]
    },
    {
      label: 'Sales & Demo Materials',
      icon: <Target className="h-4 w-4" />,
      collapsible: true,
      defaultOpen: true,
      badge: 'New',
      items: [
        {
          label: 'Sales Deck',
          href: '/sales-deck',
          icon: <Star className="h-4 w-4" />,
          description: 'Interactive sales presentations'
        },
        {
          label: 'Demo Scenarios',
          href: '/demo-scenarios',
          icon: <MonitorSpeaker className="h-4 w-4" />,
          description: 'Industry-specific demo environments'
        },
        {
          label: 'Pricing Calculator',
          href: '/pricing-calculator',
          icon: <BarChart3 className="h-4 w-4" />,
          description: 'ROI and pricing tools'
        },
        {
          label: 'Presentation Builder',
          href: '/presentation-builder',
          icon: <Blocks className="h-4 w-4" />,
          description: 'Custom presentation creator'
        },
        {
          label: 'Sales Enablement',
          href: '/sales-enablement',
          icon: <TrendingUp className="h-4 w-4" />,
          description: 'Sales team dashboard and analytics'
        },
        {
          label: 'Customer Success',
          href: '/customer-success',
          icon: <Users className="h-4 w-4" />,
          description: 'Onboarding and support center'
        }
      ]
    },
    {
      label: 'Security & Compliance',
      icon: <Shield className="h-4 w-4" />,
      collapsible: true,
      defaultOpen: true,
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
          badge: 'Day 5',
          description: 'Advanced threat detection and response'
        },
        {
          label: 'Compliance Dashboard',
          href: '/governance-center',
          icon: <FileCheck className="h-4 w-4" />,
          description: 'Regulatory compliance and governance'
        }
      ]
    },
    {
      label: 'Performance & Operations',
      icon: <Zap className="h-4 w-4" />,
      collapsible: true,
      defaultOpen: true,
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
          description: 'Infrastructure management and scaling'
        }
      ]
    },
    {
      label: 'Integration & Automation',
      icon: <Plug className="h-4 w-4" />,
      collapsible: true,
      defaultOpen: true,
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
          description: 'CRM, ERP, and enterprise system integrations'
        },
        {
          label: 'Automation Workflows',
          href: '/integrations',
          icon: <GitBranch className="h-4 w-4" />,
          description: 'Automated business processes'
        }
      ]
    },
    {
      label: 'Business Intelligence',
      icon: <TrendingUp className="h-4 w-4" />,
      collapsible: true,
      defaultOpen: true,
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
          description: 'Machine learning operations and models'
        },
        {
          label: 'Data Warehouse',
          href: '/intelligent-bi',
          icon: <Database className="h-4 w-4" />,
          description: 'OLAP operations and data management'
        }
      ]
    },
    {
      label: 'Enterprise Management',
      icon: <Briefcase className="h-4 w-4" />,
      collapsible: true,
      defaultOpen: false,
      items: [
        {
          label: 'Executive Dashboard',
          href: '/executive-dashboard',
          icon: <Crown className="h-4 w-4" />,
          badge: 'C-Suite',
          description: 'Executive-level metrics and KPIs'
        },
        {
          label: 'Governance Center',
          href: '/governance-center',
          icon: <Award className="h-4 w-4" />,
          description: 'Policies, compliance, and governance'
        },
        {
          label: 'Documentation Center',
          href: '/documentation-center',
          icon: <BookOpen className="h-4 w-4" />,
          badge: 'Day 5',
          description: 'Comprehensive documentation and guides'
        }
      ]
    },
    {
      label: 'Multi-Tenant Management',
      icon: <Building2 className="h-4 w-4" />,
      collapsible: true,
      defaultOpen: true,
      badge: 'New',
      items: [
        {
          label: 'Tenant Management',
          href: '/tenant-management',
          icon: <Building2 className="h-4 w-4" />,
          description: 'Manage all tenants and their settings'
        },
        {
          label: 'Tenant Provisioning',
          href: '/tenant-provisioning',
          icon: <Rocket className="h-4 w-4" />,
          description: 'Automated tenant creation and setup'
        },
        {
          label: 'Tenant Customization',
          href: '/tenant-customization',
          icon: <Star className="h-4 w-4" />,
          description: 'Branding, features, and workflow customization'
        },
        {
          label: 'Resource Allocation',
          href: '/resource-allocation',
          icon: <Database className="h-4 w-4" />,
          description: 'Monitor and manage resource allocation'
        },
        {
          label: 'Tenant Analytics',
          href: '/tenant-analytics',
          icon: <BarChart3 className="h-4 w-4" />,
          description: 'Analytics and insights for tenant performance'
        },
        {
          label: 'Migration Management',
          href: '/migration-management',
          icon: <GitBranch className="h-4 w-4" />,
          description: 'Manage tenant migrations and data transfers'
        }
      ]
    },
    {
      label: 'Monitoring & Analytics',
      icon: <Activity className="h-4 w-4" />,
      collapsible: true,
      defaultOpen: true,
      badge: 'CHUNK 6',
      items: [
        {
          label: 'Overview',
          href: '/monitoring/overview',
          icon: <Eye className="h-4 w-4" />,
          description: 'Comprehensive monitoring overview',
          isNew: true
        },
        {
          label: 'Real-time Monitoring',
          href: '/monitoring/real-time',
          icon: <Activity className="h-4 w-4" />,
          description: 'Live system metrics and alerts',
          isNew: true
        },
        {
          label: 'Advanced Analytics',
          href: '/analytics/advanced',
          icon: <BarChart3 className="h-4 w-4" />,
          description: 'User engagement and business intelligence',
          isNew: true
        },
        {
          label: 'Performance Metrics',
          href: '/performance/metrics',
          icon: <Zap className="h-4 w-4" />,
          description: 'APM, Web Vitals, and database performance',
          isNew: true
        },
        {
          label: 'User Behavior Analytics',
          href: '/behavior/analytics',
          icon: <Users className="h-4 w-4" />,
          description: 'Journey tracking, heatmaps, A/B testing',
          isNew: true
        },
        {
          label: 'System Health Monitoring',
          href: '/health/monitoring',
          icon: <Heart className="h-4 w-4" />,
          description: 'Uptime, error tracking, incident response',
          isNew: true
        }
      ]
    },
    {
      label: 'API & Integration Powerhouse',
      icon: <Plug className="h-4 w-4" />,
      collapsible: true,
      defaultOpen: true,
      badge: 'CHUNK 7',
      items: [
        {
          label: 'Overview',
          href: '/api-integration/overview',
          icon: <Globe className="h-4 w-4" />,
          description: 'API ecosystem overview and quick access',
          isNew: true
        },
        {
          label: 'Webhook Management',
          href: '/api-integration/webhooks',
          icon: <Webhook className="h-4 w-4" />,
          description: 'Real-time event streaming and webhook monitoring',
          isNew: true
        },
        {
          label: 'API Explorer',
          href: '/api-integration/api-explorer',
          icon: <Code className="h-4 w-4" />,
          description: 'Interactive API documentation and testing',
          isNew: true
        },
        {
          label: 'Integration Marketplace',
          href: '/api-integration/marketplace',
          icon: <Store className="h-4 w-4" />,
          description: 'Discover and install community integrations',
          isNew: true
        },
        {
          label: 'Developer Portal',
          href: '/api-integration/developer-portal',
          icon: <Users className="h-4 w-4" />,
          description: 'Tools for developers and app publishers',
          isNew: true
        },
        {
          label: 'Integration Management',
          href: '/api-integration/management',
          icon: <Settings className="h-4 w-4" />,
          description: 'Manage all platform integrations',
          isNew: true
        }
      ]
    },
    {
      label: 'Community-Driven Development',
      icon: <Users className="h-4 w-4" />,
      collapsible: true,
      defaultOpen: true,
      badge: 'CHUNK 8',
      items: [
        {
          label: 'Community Overview',
          href: '/community-overview',
          icon: <Globe className="h-4 w-4" />,
          description: 'Community platform overview and quick access',
          isNew: true
        },
        {
          label: 'Community Hub',
          href: '/community-hub',
          icon: <MessageSquare className="h-4 w-4" />,
          description: 'Forums, events, and knowledge sharing platform',
          isNew: true
        },
        {
          label: 'Plugin Marketplace',
          href: '/plugin-marketplace',
          icon: <Package className="h-4 w-4" />,
          description: 'Discover, install, and manage plugins',
          isNew: true
        },
        {
          label: 'Developer Collaboration',
          href: '/developer-collaboration',
          icon: <GitBranch className="h-4 w-4" />,
          description: 'Projects, code sharing, and mentorship',
          isNew: true
        },
        {
          label: 'Open Source Contributions',
          href: '/opensource-contributions',
          icon: <Code className="h-4 w-4" />,
          description: 'Track contributions and community impact',
          isNew: true
        },
        {
          label: 'Community Marketplace',
          href: '/community-marketplace',
          icon: <Store className="h-4 w-4" />,
          description: 'Widgets, templates, and digital assets',
          isNew: true
        }
      ]
    },
    {
      label: 'Developer & Admin',
      icon: <Settings className="h-4 w-4" />,
      collapsible: true,
      defaultOpen: false,
      badge: 'Admin',
      items: [
        {
          label: 'Go-Live Preparation',
          href: '/go-live-preparation',
          icon: <Rocket className="h-4 w-4" />,
          badge: 'Day 5',
          isNew: true,
          description: 'Production deployment readiness'
        },
        {
          label: 'Testing Center',
          href: '/testing-center',
          icon: <TestTube className="h-4 w-4" />,
          description: 'Quality assurance and testing tools'
        },
        {
          label: 'Widget Factory',
          href: '/widget-factory',
          icon: <Blocks className="h-4 w-4" />,
          description: 'Custom component development'
        }
      ]
    }
  ];

  const isItemActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Filter navigation groups based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredGroups(navigationGroups);
      return;
    }

    const filtered = navigationGroups.map(group => {
      const filteredItems = group.items.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      return {
        ...group,
        items: filteredItems
      };
    }).filter(group => group.items.length > 0);

    setFilteredGroups(filtered);
  }, [searchQuery]);

  // Initialize filtered groups
  useEffect(() => {
    setFilteredGroups(navigationGroups);
  }, []);

  // Auto-expand groups when searching
  useEffect(() => {
    if (searchQuery.trim()) {
      setCollapsedGroups([]);
    }
  }, [searchQuery]);

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="d-none d-lg-block">
        <div className="bg-white border-end sidebar-container" style={{ width: '280px', height: 'calc(100vh - 76px)', position: 'fixed', top: '76px', left: '0', zIndex: 1020, transition: 'all 0.3s ease-in-out' }}>
          <div className="d-flex flex-column h-100">
            {/* Header */}
            <div className="px-3 py-3 border-bottom">
              <h5 className="mb-0 fw-semibold">Navigation</h5>
            </div>

            {/* Search Input */}
            <div className="px-3 py-2 border-bottom">
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search navigation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '32px' }}
                />
                <Search className="position-absolute text-muted" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px' }} />
              </div>
            </div>

            {/* Navigation Content */}
            <div className="flex-grow-1 overflow-auto">
              <nav className="p-2">
                {filteredGroups.map((group) => (
                  <div key={group.label} className="mb-3">
                    {group.collapsible ? (
                      <button
                        className="btn btn-link w-100 d-flex justify-content-between align-items-center text-start p-2 text-decoration-none"
                        type="button"
                        onClick={() => toggleGroup(group.label)}
                      >
                        <div className="d-flex align-items-center">
                          {group.icon}
                          <span className="ms-2 fw-medium">{group.label}</span>
                          {group.badge && (
                            <span className="badge bg-secondary ms-2">{group.badge}</span>
                          )}
                        </div>
                        {isGroupCollapsed(group.label) ? (
                          <ChevronRight className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    ) : (
                      <div className="px-2 py-1 text-muted text-uppercase small fw-bold">
                        <div className="d-flex align-items-center">
                          {group.icon}
                          <span className="ms-2">{group.label}</span>
                        </div>
                      </div>
                    )}

                    <div className={`collapse ${!group.collapsible || !isGroupCollapsed(group.label) ? 'show' : ''}`}>
                      <div className="ms-3">
                        {group.items.map((item) => (
                          <Link key={item.href} href={item.href} className="text-decoration-none">
                            <div
                              className={`d-flex align-items-center p-2 rounded mb-1 text-decoration-none ${
                                isItemActive(item.href)
                                  ? 'bg-primary bg-opacity-10 text-primary border-start border-primary border-3'
                                  : 'text-dark hover-bg-light'
                              }`}
                            >
                              <div className="me-3">
                                {item.icon}
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center">
                                  <span className="fw-medium">{item.label}</span>
                                  {item.badge && (
                                    <span className={`badge ms-2 ${item.badge === 'Day 5' ? 'bg-primary' : 'bg-secondary'}`}>
                                      {item.badge}
                                    </span>
                                  )}
                                  {item.isNew && (
                                    <span className="badge bg-danger ms-2">New</span>
                                  )}
                                </div>
                                {item.description && (
                                  <small className="text-muted d-block">{item.description}</small>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className="border-top bg-light p-3">
              <div className="d-grid gap-2">
                <button className="btn btn-link btn-sm text-start p-2">
                  <HelpCircle className="h-4 w-4 me-2" />
                  Help & Support
                </button>
                <button className="btn btn-link btn-sm text-start p-2">
                  <Info className="h-4 w-4 me-2" />
                  What's New
                </button>
              </div>
              <div className="mt-2 text-muted small">
                <div>Day 5 Enterprise Suite</div>
                <div>Version 2.5.0</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Offcanvas */}
      <div className={`offcanvas offcanvas-start ${sidebarOpen ? 'show' : ''}`} tabIndex={-1} id="sidebarOffcanvas">
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title">Navigation</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => setSidebarOpen(false)}
          ></button>
        </div>
        <div className="offcanvas-body p-0">
          {/* Search Input */}
          <div className="px-3 py-2 border-bottom">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Search navigation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '32px' }}
              />
              <Search className="position-absolute text-muted" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px' }} />
            </div>
          </div>

          {/* Navigation Content */}
          <div className="flex-grow-1 overflow-auto">
            <nav className="p-2">
              {filteredGroups.map((group) => (
                <div key={group.label} className="mb-3">
                  {group.collapsible ? (
                    <button
                      className="btn btn-link w-100 d-flex justify-content-between align-items-center text-start p-2 text-decoration-none"
                      type="button"
                      onClick={() => toggleGroup(group.label)}
                    >
                      <div className="d-flex align-items-center">
                        {group.icon}
                        <span className="ms-2 fw-medium">{group.label}</span>
                        {group.badge && (
                          <span className="badge bg-secondary ms-2">{group.badge}</span>
                        )}
                      </div>
                      {isGroupCollapsed(group.label) ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  ) : (
                    <div className="px-2 py-1 text-muted text-uppercase small fw-bold">
                      <div className="d-flex align-items-center">
                        {group.icon}
                        <span className="ms-2">{group.label}</span>
                      </div>
                    </div>
                  )}

                  <div className={`collapse ${!group.collapsible || !isGroupCollapsed(group.label) ? 'show' : ''}`}>
                    <div className="ms-3">
                      {group.items.map((item) => (
                        <Link key={item.href} href={item.href} className="text-decoration-none" onClick={() => setSidebarOpen(false)}>
                          <div
                            className={`d-flex align-items-center p-2 rounded mb-1 text-decoration-none ${
                              isItemActive(item.href)
                                ? 'bg-primary bg-opacity-10 text-primary border-start border-primary border-3'
                                : 'text-dark hover-bg-light'
                            }`}
                          >
                            <div className="me-3">
                              {item.icon}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center">
                                <span className="fw-medium">{item.label}</span>
                                {item.badge && (
                                  <span className={`badge ms-2 ${item.badge === 'Day 5' ? 'bg-primary' : 'bg-secondary'}`}>
                                    {item.badge}
                                  </span>
                                )}
                                {item.isNew && (
                                  <span className="badge bg-danger ms-2">New</span>
                                )}
                              </div>
                              {item.description && (
                                <small className="text-muted d-block">{item.description}</small>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="offcanvas-backdrop fade show d-lg-none"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
}
