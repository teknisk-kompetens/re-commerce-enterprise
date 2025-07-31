// Legacy CaaS Types (repurposed for search assistance)
export interface AIConsciousness {
  id: string;
  name: string;
  title: string;
  description: string;
  personality: string;
  avatar: string;
  primaryColor: string;
  accentColor: string;
  specialty: string[];
  securityLevel: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL';
  searchSpecialization?: string; // New: what this AI helps search for
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  consciousnessId?: string;
}

export interface SecurityClassification {
  level: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL';
  description: string;
  color: string;
  icon: string;
}

// New Enterprise Search Types
export interface SearchResult {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  type: 'DISCUSSION' | 'QUESTION' | 'ARTICLE' | 'TUTORIAL' | 'NEWS' | 'REVIEW';
  slug: string;
  score: number;
  views: number;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  category?: Category;
  tags: Tag[];
  author?: string;
  commentsCount?: number;
}

export interface SearchFilters {
  type?: string[];
  category?: string[];
  tags?: string[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  sortBy?: 'relevance' | 'date' | 'votes' | 'views';
  aiAssistance?: boolean;
  consciousnessId?: string;
}

export interface SearchSuggestion {
  query: string;
  type: 'recent' | 'trending' | 'ai-suggested';
  category?: string;
  resultsCount?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  icon?: string;
  contentCount: number;
  children?: Category[];
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  usageCount: number;
}

export interface SearchQuery {
  id: string;
  query: string;
  filters?: SearchFilters;
  resultsCount: number;
  aiAssistance: boolean;
  consciousnessId?: string;
  createdAt: Date;
}

// Enterprise Analytics Types
export interface SearchAnalytics {
  totalSearches: number;
  uniqueUsers: number;
  averageResultsPerSearch: number;
  topQueries: Array<{
    query: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }>;
  topCategories: Array<{
    category: string;
    searches: number;
    engagement: number;
  }>;
  aiUsageStats: {
    totalAiQueries: number;
    byConsciousness: Record<string, number>;
    satisfactionRate: number;
  };
}

export interface EnterpriseMetrics {
  searches: SearchAnalytics;
  content: {
    totalItems: number;
    byType: Record<string, number>;
    engagement: number;
    qualityScore: number;
  };
  users: {
    active: number;
    newSignups: number;
    retention: number;
  };
  performance: {
    searchLatency: number;
    uptime: number;
    errorRate: number;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'USER' | 'ADMIN' | 'ENTERPRISE' | 'SUPER_ADMIN';
  company?: Company;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  plan: 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  isActive: boolean;
  users: User[];
}
