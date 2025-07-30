
import Fuse from 'fuse.js';

export interface SearchableItem {
  id: string;
  title: string;
  description: string;
  content?: string;
  href: string;
  category: string;
  tags?: string[];
  type: 'page' | 'component' | 'feature' | 'documentation';
  icon?: string;
  badge?: string;
  status?: 'operational' | 'beta' | 'new';
  keywords?: string[];
}

// Comprehensive search index of all pages and features
export const searchIndex: SearchableItem[] = [
  // Core Platform
  {
    id: 'dashboard',
    title: 'Enterprise Dashboard',
    description: 'Scene-based immersive dashboard with cinematic navigation',
    content: 'dashboard analytics metrics charts graphs data visualization business intelligence',
    href: '/dashboard',
    category: 'Core Platform',
    type: 'page',
    icon: 'BarChart3',
    status: 'operational',
    tags: ['dashboard', 'analytics', 'metrics', 'charts'],
    keywords: ['dashboard', 'analytics', 'business intelligence', 'metrics', 'charts', 'data']
  },
  {
    id: 'enterprise-hub',
    title: 'Enterprise Hub',
    description: 'Unified enterprise management and control center',
    content: 'enterprise management control center unified hub administration',
    href: '/enterprise-hub',
    category: 'Core Platform',
    type: 'page',
    icon: 'Building',
    status: 'operational',
    tags: ['enterprise', 'management', 'hub', 'control'],
    keywords: ['enterprise', 'management', 'hub', 'control', 'administration']
  },
  {
    id: 'command-center',
    title: 'Command Center',
    description: 'Executive control panel with comprehensive oversight',
    content: 'command center executive control panel oversight management',
    href: '/command-center',
    category: 'Core Platform',
    type: 'page',
    icon: 'Command',
    status: 'operational',
    badge: 'EXECUTIVE',
    tags: ['command', 'executive', 'control', 'oversight'],
    keywords: ['command', 'executive', 'control', 'oversight', 'management']
  },

  // AI & Intelligence
  {
    id: 'ai-studio',
    title: 'AI Studio',
    description: 'Revolutionary AI automation and intelligence platform',
    content: 'artificial intelligence AI automation machine learning ML workflows predictions analytics',
    href: '/ai-studio',
    category: 'AI & Intelligence',
    type: 'page',
    icon: 'Brain',
    status: 'operational',
    badge: 'ADVANCED',
    tags: ['ai', 'artificial intelligence', 'automation', 'machine learning'],
    keywords: ['ai', 'artificial intelligence', 'automation', 'machine learning', 'workflows', 'predictions']
  },
  {
    id: 'ai-analytics',
    title: 'AI Analytics',
    description: 'AI-powered business analytics and insights',
    content: 'AI analytics business insights data analysis artificial intelligence',
    href: '/ai-analytics',
    category: 'AI & Intelligence',
    type: 'page',
    icon: 'TrendingUp',
    status: 'operational',
    tags: ['ai', 'analytics', 'insights', 'business'],
    keywords: ['ai', 'analytics', 'insights', 'business', 'data analysis']
  },
  {
    id: 'ai-insights',
    title: 'AI Insights',
    description: 'Intelligent business insights and recommendations',
    content: 'AI insights recommendations intelligent business analysis',
    href: '/ai-insights',
    category: 'AI & Intelligence',
    type: 'page',
    icon: 'Eye',
    status: 'operational',
    tags: ['ai', 'insights', 'recommendations', 'intelligent'],
    keywords: ['ai', 'insights', 'recommendations', 'intelligent', 'business']
  },
  {
    id: 'intelligent-bi',
    title: 'Intelligent BI',
    description: 'AI-powered business intelligence dashboards',
    content: 'intelligent business intelligence BI dashboards AI powered analytics',
    href: '/intelligent-bi',
    category: 'AI & Intelligence',
    type: 'page',
    icon: 'Gauge',
    status: 'operational',
    tags: ['bi', 'business intelligence', 'intelligent', 'dashboards'],
    keywords: ['bi', 'business intelligence', 'intelligent', 'dashboards', 'analytics']
  },
  {
    id: 'ml-ops',
    title: 'ML Operations',
    description: 'Machine learning operations and model management',
    content: 'machine learning operations MLOps model management deployment',
    href: '/ml-ops',
    category: 'AI & Intelligence',
    type: 'page',
    icon: 'Cpu',
    status: 'operational',
    tags: ['ml', 'machine learning', 'operations', 'model management'],
    keywords: ['ml', 'machine learning', 'operations', 'model', 'management', 'deployment']
  },

  // Security & Performance
  {
    id: 'security-center',
    title: 'Security Center',
    description: 'Enterprise security monitoring and threat intelligence',
    content: 'security monitoring threat intelligence cybersecurity protection firewall',
    href: '/security-center',
    category: 'Security & Performance',
    type: 'page',
    icon: 'Shield',
    status: 'operational',
    badge: 'CRITICAL',
    tags: ['security', 'monitoring', 'threat', 'intelligence'],
    keywords: ['security', 'monitoring', 'threat', 'intelligence', 'cybersecurity', 'protection']
  },
  {
    id: 'performance-center',
    title: 'Performance Center',
    description: 'Real-time performance monitoring and optimization',
    content: 'performance monitoring optimization real-time metrics speed latency',
    href: '/performance-center',
    category: 'Security & Performance',
    type: 'page',
    icon: 'Zap',
    status: 'operational',
    tags: ['performance', 'monitoring', 'optimization', 'real-time'],
    keywords: ['performance', 'monitoring', 'optimization', 'real-time', 'metrics', 'speed']
  },
  {
    id: 'system-health',
    title: 'System Health',
    description: 'Comprehensive system monitoring and diagnostics',
    content: 'system health monitoring diagnostics uptime availability status',
    href: '/system-health',
    category: 'Security & Performance',
    type: 'page',
    icon: 'Activity',
    status: 'operational',
    tags: ['system', 'health', 'monitoring', 'diagnostics'],
    keywords: ['system', 'health', 'monitoring', 'diagnostics', 'uptime', 'availability']
  },

  // Integration & Operations
  {
    id: 'widget-factory',
    title: 'Widget Factory',
    description: 'Advanced widget creation workspace with real-time collaboration',
    content: 'widget factory creation workspace collaboration components UI elements',
    href: '/widget-factory',
    category: 'Integration & Operations',
    type: 'page',
    icon: 'Palette',
    status: 'operational',
    badge: 'POPULAR',
    tags: ['widget', 'factory', 'creation', 'collaboration'],
    keywords: ['widget', 'factory', 'creation', 'collaboration', 'components', 'ui']
  },
  {
    id: 'integrations-hub',
    title: 'Integrations Hub',
    description: 'API management and third-party system integrations',
    content: 'integrations API management third-party systems webhooks connectors',
    href: '/integrations-hub',
    category: 'Integration & Operations',
    type: 'page',
    icon: 'Plug',
    status: 'operational',
    tags: ['integrations', 'api', 'management', 'third-party'],
    keywords: ['integrations', 'api', 'management', 'third-party', 'webhooks', 'connectors']
  },
  {
    id: 'analytics',
    title: 'Business Analytics',
    description: 'Comprehensive business intelligence and reporting',
    content: 'business analytics intelligence reporting data analysis metrics KPIs',
    href: '/analytics',
    category: 'Integration & Operations',
    type: 'page',
    icon: 'BarChart3',
    status: 'operational',
    tags: ['analytics', 'business', 'intelligence', 'reporting'],
    keywords: ['analytics', 'business', 'intelligence', 'reporting', 'data', 'metrics']
  },
  {
    id: 'testing-center',
    title: 'Testing Center',
    description: 'Automated testing and quality assurance',
    content: 'testing automated quality assurance QA unit tests integration tests',
    href: '/testing-center',
    category: 'Integration & Operations',
    type: 'page',
    icon: 'TestTube',
    status: 'operational',
    tags: ['testing', 'automated', 'quality', 'assurance'],
    keywords: ['testing', 'automated', 'quality', 'assurance', 'qa', 'unit tests']
  },

  // Management & Governance
  {
    id: 'executive-dashboard',
    title: 'Executive Dashboard',
    description: 'Executive-level insights and strategic overview',
    content: 'executive dashboard insights strategic overview leadership management',
    href: '/executive-dashboard',
    category: 'Management & Governance',
    type: 'page',
    icon: 'Crown',
    status: 'operational',
    badge: 'EXECUTIVE',
    tags: ['executive', 'dashboard', 'insights', 'strategic'],
    keywords: ['executive', 'dashboard', 'insights', 'strategic', 'leadership', 'management']
  },
  {
    id: 'governance-center',
    title: 'Governance Center',
    description: 'Compliance, risk management, and governance',
    content: 'governance compliance risk management policies procedures audit',
    href: '/governance-center',
    category: 'Management & Governance',
    type: 'page',
    icon: 'Globe',
    status: 'operational',
    tags: ['governance', 'compliance', 'risk', 'management'],
    keywords: ['governance', 'compliance', 'risk', 'management', 'policies', 'audit']
  },
  {
    id: 'documentation-center',
    title: 'Documentation Center',
    description: 'Comprehensive platform documentation',
    content: 'documentation center guides tutorials API docs help support',
    href: '/documentation-center',
    category: 'Management & Governance',
    type: 'page',
    icon: 'BookOpen',
    status: 'operational',
    tags: ['documentation', 'guides', 'tutorials', 'help'],
    keywords: ['documentation', 'guides', 'tutorials', 'api', 'help', 'support']
  },
  {
    id: 'go-live-preparation',
    title: 'Go-Live Preparation',
    description: 'Production readiness checklist and deployment',
    content: 'go-live preparation production readiness deployment checklist launch',
    href: '/go-live-preparation',
    category: 'Management & Governance',
    type: 'page',
    icon: 'Rocket',
    status: 'operational',
    tags: ['go-live', 'preparation', 'production', 'deployment'],
    keywords: ['go-live', 'preparation', 'production', 'deployment', 'checklist', 'launch']
  },

  // Additional Features
  {
    id: 'community-hub',
    title: 'Community Hub',
    description: 'Community engagement and collaboration platform',
    content: 'community hub engagement collaboration forums discussions social',
    href: '/community-hub',
    category: 'Community',
    type: 'page',
    icon: 'Users',
    status: 'operational',
    tags: ['community', 'engagement', 'collaboration', 'forums'],
    keywords: ['community', 'engagement', 'collaboration', 'forums', 'discussions', 'social']
  },
  {
    id: 'global-dashboard',
    title: 'Global Dashboard',
    description: 'Worldwide operations and multi-region overview',
    content: 'global dashboard worldwide operations multi-region international',
    href: '/global-dashboard',
    category: 'Global Operations',
    type: 'page',
    icon: 'Globe',
    status: 'operational',
    tags: ['global', 'dashboard', 'worldwide', 'operations'],
    keywords: ['global', 'dashboard', 'worldwide', 'operations', 'multi-region', 'international']
  },
  {
    id: 'advanced-analytics-dashboard',
    title: 'Advanced Analytics Dashboard',
    description: 'Advanced data analytics and visualization platform',
    content: 'advanced analytics dashboard data visualization charts graphs reports',
    href: '/advanced-analytics-dashboard',
    category: 'Analytics',
    type: 'page',
    icon: 'BarChart3',
    status: 'operational',
    tags: ['advanced', 'analytics', 'dashboard', 'visualization'],
    keywords: ['advanced', 'analytics', 'dashboard', 'visualization', 'charts', 'reports']
  }
];

// Fuse.js configuration for optimal search experience
export const fuseOptions: Fuse.IFuseOptions<SearchableItem> = {
  keys: [
    { name: 'title', weight: 0.3 },
    { name: 'description', weight: 0.2 },
    { name: 'content', weight: 0.15 },
    { name: 'tags', weight: 0.15 },
    { name: 'keywords', weight: 0.1 },
    { name: 'category', weight: 0.1 }
  ],
  threshold: 0.3, // Lower = more strict matching
  distance: 100,
  minMatchCharLength: 1, // Allow searching from first character
  includeScore: true,
  includeMatches: true,
  shouldSort: true,
  findAllMatches: true,
  ignoreLocation: true
};

// Create and export the search instance
export const searchEngine = new Fuse(searchIndex, fuseOptions);

// Helper function to format search results
export interface SearchResult extends SearchableItem {
  score?: number;
  matches?: Fuse.FuseResultMatch[];
}

export function formatSearchResults(results: Fuse.FuseResult<SearchableItem>[]): SearchResult[] {
  return results.map(result => ({
    ...result.item,
    score: result.score,
    matches: result.matches
  }));
}

// Category-based search
export function searchByCategory(query: string, category?: string): SearchResult[] {
  const results = searchEngine.search(query);
  
  if (category) {
    return formatSearchResults(
      results.filter(result => result.item.category === category)
    );
  }
  
  return formatSearchResults(results);
}

// Type-based search
export function searchByType(query: string, type?: SearchableItem['type']): SearchResult[] {
  const results = searchEngine.search(query);
  
  if (type) {
    return formatSearchResults(
      results.filter(result => result.item.type === type)
    );
  }
  
  return formatSearchResults(results);
}

// Get suggestions based on partial input
export function getSuggestions(query: string, limit: number = 10): SearchResult[] {
  if (!query || query.length === 0) {
    return [];
  }
  
  const results = searchEngine.search(query);
  return formatSearchResults(results.slice(0, limit));
}

// Get popular/featured items
export function getFeaturedItems(): SearchableItem[] {
  return searchIndex.filter(item => 
    item.badge === 'POPULAR' || 
    item.badge === 'ADVANCED' || 
    item.badge === 'EXECUTIVE'
  );
}

// Get items by status
export function getItemsByStatus(status: SearchableItem['status']): SearchableItem[] {
  return searchIndex.filter(item => item.status === status);
}
