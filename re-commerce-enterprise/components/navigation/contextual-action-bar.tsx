
'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus,
  Download,
  Upload,
  Share2,
  Settings,
  Filter,
  RefreshCw,
  MoreHorizontal,
  Edit,
  Save,
  X,
  Play,
  Pause,
  Square,
  FileText,
  Eye,
  Search,
  Calendar,
  Users,
  Shield,
  Zap,
  BarChart3,
  Brain,
  Rocket,
  TestTube,
  Blocks,
  Crown,
  Building2,
  Activity,
  Database,
  Cpu,
  Globe,
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  TrendingUp
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useNavigation } from './navigation-context';
import { cn } from '@/lib/utils';

interface ContextualAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  isPrimary?: boolean;
  disabled?: boolean;
  badge?: string;
  tooltip?: string;
  permissions?: string[];
}

interface ContextualActionGroup {
  id: string;
  label: string;
  actions: ContextualAction[];
}

interface PageContextualConfig {
  title: string;
  description?: string;
  actions: ContextualAction[];
  actionGroups?: ContextualActionGroup[];
  filters?: Array<{
    id: string;
    label: string;
    type: 'select' | 'search' | 'date';
    options?: Array<{ value: string; label: string }>;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
  }>;
  status?: {
    type: 'success' | 'warning' | 'error' | 'info';
    message: string;
  };
}

export function ContextualActionBar() {
  const pathname = usePathname();
  const { user, currentSection } = useNavigation();

  // Define contextual actions for each page
  const pageConfigs: Record<string, PageContextualConfig> = {
    '/dashboard': {
      title: 'Executive Dashboard',
      description: 'High-level overview of key business metrics',
      actions: [
        {
          id: 'create-dashboard',
          label: 'Create Dashboard',
          icon: <Plus className="h-4 w-4" />,
          variant: 'default',
          isPrimary: true,
          permissions: ['admin', 'analytics']
        },
        {
          id: 'export-data',
          label: 'Export',
          icon: <Download className="h-4 w-4" />,
          variant: 'outline'
        },
        {
          id: 'refresh',
          label: 'Refresh',
          icon: <RefreshCw className="h-4 w-4" />,
          variant: 'ghost'
        }
      ],
      filters: [
        {
          id: 'time-range',
          label: 'Time Range',
          type: 'select',
          options: [
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
            { value: '90d', label: 'Last 90 days' },
            { value: '1y', label: 'Last year' }
          ]
        },
        {
          id: 'department',
          label: 'Department',
          type: 'select',
          options: [
            { value: 'all', label: 'All Departments' },
            { value: 'sales', label: 'Sales' },
            { value: 'marketing', label: 'Marketing' },
            { value: 'operations', label: 'Operations' }
          ]
        }
      ]
    },
    '/analytics': {
      title: 'Analytics Center',
      description: 'Comprehensive business intelligence and reporting',
      actions: [
        {
          id: 'new-report',
          label: 'New Report',
          icon: <Plus className="h-4 w-4" />,
          variant: 'default',
          isPrimary: true,
          permissions: ['analytics']
        },
        {
          id: 'schedule-report',
          label: 'Schedule',
          icon: <Calendar className="h-4 w-4" />,
          variant: 'outline'
        },
        {
          id: 'export-analytics',
          label: 'Export',
          icon: <Download className="h-4 w-4" />,
          variant: 'outline'
        }
      ],
      filters: [
        {
          id: 'report-type',
          label: 'Report Type',
          type: 'select',
          options: [
            { value: 'all', label: 'All Reports' },
            { value: 'sales', label: 'Sales Reports' },
            { value: 'performance', label: 'Performance Reports' },
            { value: 'financial', label: 'Financial Reports' }
          ]
        },
        {
          id: 'search-reports',
          label: 'Search',
          type: 'search',
          placeholder: 'Search reports...'
        }
      ]
    },
    '/security-center': {
      title: 'Security Center',
      description: 'Comprehensive security monitoring and threat detection',
      actions: [
        {
          id: 'security-scan',
          label: 'Run Scan',
          icon: <Shield className="h-4 w-4" />,
          variant: 'default',
          isPrimary: true,
          permissions: ['security']
        },
        {
          id: 'incident-response',
          label: 'Incident Response',
          icon: <AlertTriangle className="h-4 w-4" />,
          variant: 'destructive',
          permissions: ['security']
        },
        {
          id: 'security-report',
          label: 'Generate Report',
          icon: <FileText className="h-4 w-4" />,
          variant: 'outline'
        }
      ],
      status: {
        type: 'success',
        message: 'All security systems operational'
      }
    },
    '/ai-command-center': {
      title: 'AI Command Center',
      description: 'AI-powered insights and automation hub',
      actions: [
        {
          id: 'new-ai-model',
          label: 'New Model',
          icon: <Plus className="h-4 w-4" />,
          variant: 'default',
          isPrimary: true,
          permissions: ['ai']
        },
        {
          id: 'train-model',
          label: 'Train Model',
          icon: <Brain className="h-4 w-4" />,
          variant: 'outline',
          permissions: ['ai']
        },
        {
          id: 'deploy-model',
          label: 'Deploy',
          icon: <Rocket className="h-4 w-4" />,
          variant: 'outline',
          permissions: ['ai']
        }
      ],
      filters: [
        {
          id: 'model-status',
          label: 'Status',
          type: 'select',
          options: [
            { value: 'all', label: 'All Models' },
            { value: 'training', label: 'Training' },
            { value: 'deployed', label: 'Deployed' },
            { value: 'inactive', label: 'Inactive' }
          ]
        }
      ]
    },
    '/performance-center': {
      title: 'Performance Center',
      description: 'System optimization and performance monitoring',
      actions: [
        {
          id: 'performance-test',
          label: 'Run Test',
          icon: <Play className="h-4 w-4" />,
          variant: 'default',
          isPrimary: true,
          permissions: ['performance']
        },
        {
          id: 'optimize-system',
          label: 'Optimize',
          icon: <Zap className="h-4 w-4" />,
          variant: 'outline',
          permissions: ['performance']
        },
        {
          id: 'performance-report',
          label: 'Generate Report',
          icon: <BarChart3 className="h-4 w-4" />,
          variant: 'outline'
        }
      ],
      status: {
        type: 'info',
        message: 'System performance: 95% optimal'
      }
    },
    '/integrations-hub': {
      title: 'Integration Hub',
      description: 'API management and system integrations',
      actions: [
        {
          id: 'new-integration',
          label: 'New Integration',
          icon: <Plus className="h-4 w-4" />,
          variant: 'default',
          isPrimary: true,
          permissions: ['integrations']
        },
        {
          id: 'test-connections',
          label: 'Test Connections',
          icon: <TestTube className="h-4 w-4" />,
          variant: 'outline',
          permissions: ['integrations']
        },
        {
          id: 'sync-data',
          label: 'Sync Data',
          icon: <RefreshCw className="h-4 w-4" />,
          variant: 'outline'
        }
      ],
      filters: [
        {
          id: 'integration-type',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'all', label: 'All Integrations' },
            { value: 'api', label: 'API Integrations' },
            { value: 'database', label: 'Database Connections' },
            { value: 'webhook', label: 'Webhooks' }
          ]
        }
      ]
    },
    '/go-live-preparation': {
      title: 'Go-Live Preparation',
      description: 'Production deployment readiness and validation',
      actions: [
        {
          id: 'deploy-production',
          label: 'Deploy to Production',
          icon: <Rocket className="h-4 w-4" />,
          variant: 'default',
          isPrimary: true,
          permissions: ['admin', 'developer']
        },
        {
          id: 'run-checks',
          label: 'Run Checks',
          icon: <CheckCircle className="h-4 w-4" />,
          variant: 'outline',
          permissions: ['developer']
        },
        {
          id: 'rollback-plan',
          label: 'Rollback Plan',
          icon: <Shield className="h-4 w-4" />,
          variant: 'outline',
          permissions: ['admin']
        }
      ],
      status: {
        type: 'warning',
        message: 'Pre-deployment validation in progress'
      }
    }
  };

  const currentPageConfig = pageConfigs[pathname];

  // Check if user has required permissions for an action
  const hasPermission = (permissions?: string[]) => {
    if (!permissions || permissions.length === 0) return true;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  // Don't render if no configuration for current page
  if (!currentPageConfig) {
    return null;
  }

  // Filter actions based on permissions
  const visibleActions = currentPageConfig.actions.filter(action => 
    hasPermission(action.permissions)
  );

  // Split actions into primary and secondary
  const primaryActions = visibleActions.filter(action => action.isPrimary);
  const secondaryActions = visibleActions.filter(action => !action.isPrimary);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{currentPageConfig.title}</h1>
                {currentPageConfig.description && (
                  <p className="text-sm text-gray-600 mt-1">{currentPageConfig.description}</p>
                )}
              </div>
              
              {/* Status Badge */}
              {currentPageConfig.status && (
                <Badge 
                  variant={currentPageConfig.status.type === 'success' ? 'default' : 
                           currentPageConfig.status.type === 'warning' ? 'secondary' : 
                           currentPageConfig.status.type === 'error' ? 'destructive' : 'outline'}
                  className="flex items-center space-x-1"
                >
                  {currentPageConfig.status.type === 'success' && <CheckCircle className="h-3 w-3" />}
                  {currentPageConfig.status.type === 'warning' && <AlertTriangle className="h-3 w-3" />}
                  {currentPageConfig.status.type === 'error' && <X className="h-3 w-3" />}
                  {currentPageConfig.status.type === 'info' && <Activity className="h-3 w-3" />}
                  <span>{currentPageConfig.status.message}</span>
                </Badge>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between">
              {/* Filters */}
              <div className="flex items-center space-x-3">
                {currentPageConfig.filters?.map((filter) => (
                  <div key={filter.id} className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">{filter.label}:</span>
                    {filter.type === 'select' && (
                      <Select defaultValue={filter.options?.[0]?.value}>
                        <SelectTrigger className="w-40 h-8">
                          <SelectValue placeholder={filter.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {filter.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {filter.type === 'search' && (
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                        <Input
                          placeholder={filter.placeholder}
                          className="pl-9 w-48 h-8"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {/* Primary Actions */}
                {primaryActions.map((action) => (
                  <Button
                    key={action.id}
                    variant={action.variant}
                    size="sm"
                    disabled={action.disabled}
                    onClick={action.onClick}
                    className="flex items-center space-x-2"
                  >
                    {action.icon}
                    <span>{action.label}</span>
                    {action.badge && (
                      <Badge variant="outline" className="text-xs ml-2">
                        {action.badge}
                      </Badge>
                    )}
                  </Button>
                ))}

                {/* Secondary Actions */}
                {secondaryActions.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {secondaryActions.map((action) => (
                        <DropdownMenuItem
                          key={action.id}
                          onClick={action.onClick}
                          disabled={action.disabled}
                          className="flex items-center space-x-2"
                        >
                          {action.icon}
                          <span>{action.label}</span>
                          {action.badge && (
                            <Badge variant="outline" className="text-xs ml-auto">
                              {action.badge}
                            </Badge>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
