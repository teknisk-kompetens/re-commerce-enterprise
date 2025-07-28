
/**
 * FRONTEND PERFORMANCE OPTIMIZER
 * Code splitting, lazy loading, bundle optimization, service workers, and performance budgets
 */

import { EventEmitter } from 'events';
import { eventBus } from '@/lib/event-bus-system';

export interface BundleAnalysis {
  id: string;
  name: string;
  size: number;
  gzippedSize: number;
  chunks: ChunkInfo[];
  dependencies: DependencyInfo[];
  duplicates: DuplicateInfo[];
  unusedCode: UnusedCodeInfo[];
  optimizations: OptimizationSuggestion[];
  timestamp: Date;
}

export interface ChunkInfo {
  id: string;
  name: string;
  size: number;
  gzippedSize: number;
  modules: ModuleInfo[];
  loadPriority: 'high' | 'medium' | 'low';
  cacheability: 'high' | 'medium' | 'low';
}

export interface ModuleInfo {
  id: string;
  name: string;
  size: number;
  path: string;
  imports: string[];
  exports: string[];
  usageCount: number;
  lastUsed: Date;
}

export interface DependencyInfo {
  name: string;
  version: string;
  size: number;
  impact: 'high' | 'medium' | 'low';
  alternatives: string[];
  usage: 'full' | 'partial' | 'unused';
}

export interface DuplicateInfo {
  name: string;
  locations: string[];
  totalSize: number;
  wastedSize: number;
}

export interface UnusedCodeInfo {
  file: string;
  lines: number;
  size: number;
  functions: string[];
  variables: string[];
}

export interface OptimizationSuggestion {
  type: 'code_splitting' | 'lazy_loading' | 'tree_shaking' | 'compression' | 'caching' | 'dependency';
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  estimatedSavings: number;
  implementation: string;
}

export interface LazyLoadingConfig {
  enabled: boolean;
  components: LazyComponent[];
  routes: LazyRoute[];
  assets: LazyAsset[];
  intersectionThreshold: number;
  rootMargin: string;
  preloadDistance: number;
}

export interface LazyComponent {
  name: string;
  path: string;
  priority: 'high' | 'medium' | 'low';
  preload: boolean;
  fallback: string;
  chunkName: string;
}

export interface LazyRoute {
  path: string;
  component: string;
  priority: 'high' | 'medium' | 'low';
  preload: boolean;
  chunkName: string;
}

export interface LazyAsset {
  type: 'image' | 'video' | 'audio' | 'font' | 'style' | 'script';
  src: string;
  priority: 'high' | 'medium' | 'low';
  lazy: boolean;
  preload: boolean;
  critical: boolean;
}

export interface PerformanceBudget {
  id: string;
  name: string;
  budgets: BudgetRule[];
  enabled: boolean;
  alertThreshold: number;
  failThreshold: number;
  lastCheck: Date;
  status: 'pass' | 'warning' | 'fail';
}

export interface BudgetRule {
  metric: 'bundle_size' | 'chunk_size' | 'load_time' | 'fcp' | 'lcp' | 'cls' | 'fid' | 'ttfb';
  limit: number;
  unit: 'bytes' | 'ms' | 'score';
  current: number;
  status: 'pass' | 'warning' | 'fail';
}

export interface ServiceWorkerConfig {
  enabled: boolean;
  strategies: CacheStrategy[];
  version: string;
  updateStrategy: 'immediate' | 'on_next_visit' | 'manual';
  offlinePages: string[];
  networkFirst: string[];
  cacheFirst: string[];
  staleWhileRevalidate: string[];
}

export interface CacheStrategy {
  name: string;
  pattern: string;
  strategy: 'cache_first' | 'network_first' | 'stale_while_revalidate' | 'network_only' | 'cache_only';
  maxAge: number;
  maxEntries: number;
  enabled: boolean;
}

export interface WebVitalsMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  fmp: number; // First Meaningful Paint
  timestamp: Date;
  url: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  connection: string;
}

export interface PreloadStrategy {
  resources: PreloadResource[];
  priority: 'high' | 'medium' | 'low';
  timing: 'immediate' | 'on_interaction' | 'on_idle' | 'on_visible';
  enabled: boolean;
}

export interface PreloadResource {
  type: 'script' | 'style' | 'image' | 'font' | 'audio' | 'video' | 'document';
  href: string;
  as: string;
  crossorigin?: boolean;
  integrity?: string;
  media?: string;
  critical: boolean;
}

export class FrontendPerformanceOptimizer extends EventEmitter {
  private bundleAnalyses: Map<string, BundleAnalysis> = new Map();
  private performanceBudgets: Map<string, PerformanceBudget> = new Map();
  private webVitalsHistory: WebVitalsMetrics[] = [];
  private lazyLoadingConfig: LazyLoadingConfig;
  private serviceWorkerConfig: ServiceWorkerConfig;
  private preloadStrategies: Map<string, PreloadStrategy> = new Map();
  private optimizationQueue: string[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.lazyLoadingConfig = this.initializeLazyLoading();
    this.serviceWorkerConfig = this.initializeServiceWorker();
    this.initializeFrontendOptimizer();
  }

  private async initializeFrontendOptimizer(): Promise<void> {
    await this.setupPerformanceBudgets();
    await this.setupPreloadStrategies();
    await this.startPerformanceMonitoring();
    await this.analyzeBundles();
    console.log('Frontend Performance Optimizer initialized');
  }

  /**
   * BUNDLE ANALYSIS
   */
  async analyzeBundles(): Promise<BundleAnalysis> {
    const analysisId = `analysis_${Date.now()}`;
    
    const analysis: BundleAnalysis = {
      id: analysisId,
      name: 'Bundle Analysis',
      size: 0,
      gzippedSize: 0,
      chunks: [],
      dependencies: [],
      duplicates: [],
      unusedCode: [],
      optimizations: [],
      timestamp: new Date()
    };

    // Analyze chunks
    analysis.chunks = await this.analyzeChunks();
    
    // Analyze dependencies
    analysis.dependencies = await this.analyzeDependencies();
    
    // Find duplicates
    analysis.duplicates = await this.findDuplicates();
    
    // Find unused code
    analysis.unusedCode = await this.findUnusedCode();
    
    // Calculate total sizes
    analysis.size = analysis.chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    analysis.gzippedSize = analysis.chunks.reduce((sum, chunk) => sum + chunk.gzippedSize, 0);
    
    // Generate optimizations
    analysis.optimizations = await this.generateOptimizations(analysis);
    
    this.bundleAnalyses.set(analysisId, analysis);
    
    this.emit('bundle_analyzed', { analysisId, totalSize: analysis.size });
    eventBus.emit('bundle_analyzed', { analysisId, optimizations: analysis.optimizations.length });
    
    return analysis;
  }

  private async analyzeChunks(): Promise<ChunkInfo[]> {
    // Mock chunk analysis - in production this would analyze actual webpack bundles
    const chunks: ChunkInfo[] = [
      {
        id: 'main',
        name: 'main.js',
        size: 245000,
        gzippedSize: 85000,
        modules: await this.analyzeModules('main'),
        loadPriority: 'high',
        cacheability: 'high'
      },
      {
        id: 'vendor',
        name: 'vendor.js',
        size: 892000,
        gzippedSize: 312000,
        modules: await this.analyzeModules('vendor'),
        loadPriority: 'high',
        cacheability: 'high'
      },
      {
        id: 'dashboard',
        name: 'dashboard.js',
        size: 156000,
        gzippedSize: 54000,
        modules: await this.analyzeModules('dashboard'),
        loadPriority: 'medium',
        cacheability: 'medium'
      }
    ];
    
    return chunks;
  }

  private async analyzeModules(chunkName: string): Promise<ModuleInfo[]> {
    // Mock module analysis
    const modules: ModuleInfo[] = [
      {
        id: `${chunkName}_module_1`,
        name: `${chunkName}/component.tsx`,
        size: 15000,
        path: `/src/${chunkName}/component.tsx`,
        imports: ['react', 'next'],
        exports: ['default'],
        usageCount: 5,
        lastUsed: new Date()
      },
      {
        id: `${chunkName}_module_2`,
        name: `${chunkName}/utils.ts`,
        size: 8000,
        path: `/src/${chunkName}/utils.ts`,
        imports: ['lodash'],
        exports: ['utility1', 'utility2'],
        usageCount: 3,
        lastUsed: new Date()
      }
    ];
    
    return modules;
  }

  private async analyzeDependencies(): Promise<DependencyInfo[]> {
    const dependencies: DependencyInfo[] = [
      {
        name: 'react',
        version: '18.2.0',
        size: 45000,
        impact: 'high',
        alternatives: [],
        usage: 'full'
      },
      {
        name: 'lodash',
        version: '4.17.21',
        size: 528000,
        impact: 'high',
        alternatives: ['ramda', 'native-methods'],
        usage: 'partial'
      },
      {
        name: 'moment',
        version: '2.29.4',
        size: 289000,
        impact: 'medium',
        alternatives: ['date-fns', 'dayjs'],
        usage: 'partial'
      }
    ];
    
    return dependencies;
  }

  private async findDuplicates(): Promise<DuplicateInfo[]> {
    const duplicates: DuplicateInfo[] = [
      {
        name: 'utility-function',
        locations: ['src/utils/helpers.ts', 'src/components/shared.ts'],
        totalSize: 3000,
        wastedSize: 1500
      },
      {
        name: 'validation-schema',
        locations: ['src/forms/user.ts', 'src/forms/profile.ts'],
        totalSize: 2500,
        wastedSize: 1250
      }
    ];
    
    return duplicates;
  }

  private async findUnusedCode(): Promise<UnusedCodeInfo[]> {
    const unusedCode: UnusedCodeInfo[] = [
      {
        file: 'src/legacy/old-component.tsx',
        lines: 150,
        size: 8500,
        functions: ['handleOldAction', 'formatLegacyData'],
        variables: ['LEGACY_CONSTANT', 'oldConfig']
      },
      {
        file: 'src/utils/deprecated.ts',
        lines: 85,
        size: 4200,
        functions: ['deprecatedFunction'],
        variables: ['DEPRECATED_CONFIG']
      }
    ];
    
    return unusedCode;
  }

  private async generateOptimizations(analysis: BundleAnalysis): Promise<OptimizationSuggestion[]> {
    const optimizations: OptimizationSuggestion[] = [];
    
    // Code splitting suggestions
    if (analysis.chunks.some(chunk => chunk.size > 500000)) {
      optimizations.push({
        type: 'code_splitting',
        description: 'Split large chunks into smaller, route-based chunks',
        impact: 'high',
        effort: 'medium',
        estimatedSavings: 200000,
        implementation: 'Implement dynamic imports for route components'
      });
    }
    
    // Lazy loading suggestions
    if (analysis.chunks.some(chunk => chunk.loadPriority === 'low')) {
      optimizations.push({
        type: 'lazy_loading',
        description: 'Implement lazy loading for low-priority components',
        impact: 'medium',
        effort: 'low',
        estimatedSavings: 150000,
        implementation: 'Use React.lazy() and Suspense for components'
      });
    }
    
    // Tree shaking suggestions
    if (analysis.unusedCode.length > 0) {
      const totalWasted = analysis.unusedCode.reduce((sum, code) => sum + code.size, 0);
      optimizations.push({
        type: 'tree_shaking',
        description: 'Remove unused code and optimize imports',
        impact: 'medium',
        effort: 'low',
        estimatedSavings: totalWasted,
        implementation: 'Remove unused imports and dead code'
      });
    }
    
    // Dependency optimization
    const partialDeps = analysis.dependencies.filter(dep => dep.usage === 'partial');
    if (partialDeps.length > 0) {
      optimizations.push({
        type: 'dependency',
        description: 'Optimize dependencies with partial usage',
        impact: 'high',
        effort: 'medium',
        estimatedSavings: 300000,
        implementation: 'Use specific imports and consider lighter alternatives'
      });
    }
    
    // Compression suggestions
    if (analysis.gzippedSize / analysis.size > 0.7) {
      optimizations.push({
        type: 'compression',
        description: 'Improve compression ratio with better algorithms',
        impact: 'medium',
        effort: 'low',
        estimatedSavings: 50000,
        implementation: 'Enable Brotli compression and optimize assets'
      });
    }
    
    return optimizations;
  }

  /**
   * LAZY LOADING
   */
  private initializeLazyLoading(): LazyLoadingConfig {
    return {
      enabled: true,
      components: [
        {
          name: 'Dashboard',
          path: '/dashboard',
          priority: 'high',
          preload: true,
          fallback: 'LoadingSpinner',
          chunkName: 'dashboard'
        },
        {
          name: 'Analytics',
          path: '/analytics',
          priority: 'medium',
          preload: false,
          fallback: 'LoadingSpinner',
          chunkName: 'analytics'
        },
        {
          name: 'Settings',
          path: '/settings',
          priority: 'low',
          preload: false,
          fallback: 'LoadingSpinner',
          chunkName: 'settings'
        }
      ],
      routes: [
        {
          path: '/dashboard',
          component: 'Dashboard',
          priority: 'high',
          preload: true,
          chunkName: 'dashboard'
        },
        {
          path: '/analytics',
          component: 'Analytics',
          priority: 'medium',
          preload: false,
          chunkName: 'analytics'
        }
      ],
      assets: [
        {
          type: 'image',
          src: '/images/hero-bg.jpg',
          priority: 'high',
          lazy: false,
          preload: true,
          critical: true
        },
        {
          type: 'image',
          src: '/images/dashboard-preview.jpg',
          priority: 'medium',
          lazy: true,
          preload: false,
          critical: false
        }
      ],
      intersectionThreshold: 0.1,
      rootMargin: '50px',
      preloadDistance: 200
    };
  }

  async optimizeLazyLoading(): Promise<{
    componentsOptimized: number;
    routesOptimized: number;
    assetsOptimized: number;
    estimatedSavings: number;
  }> {
    let componentsOptimized = 0;
    let routesOptimized = 0;
    let assetsOptimized = 0;
    let estimatedSavings = 0;
    
    // Optimize components
    for (const component of this.lazyLoadingConfig.components) {
      if (component.priority === 'low' && !component.preload) {
        // Can be lazy loaded
        componentsOptimized++;
        estimatedSavings += 50000; // Estimated savings per component
      }
    }
    
    // Optimize routes
    for (const route of this.lazyLoadingConfig.routes) {
      if (route.priority !== 'high' && !route.preload) {
        routesOptimized++;
        estimatedSavings += 75000; // Estimated savings per route
      }
    }
    
    // Optimize assets
    for (const asset of this.lazyLoadingConfig.assets) {
      if (!asset.critical && asset.lazy) {
        assetsOptimized++;
        estimatedSavings += 25000; // Estimated savings per asset
      }
    }
    
    this.emit('lazy_loading_optimized', {
      componentsOptimized,
      routesOptimized,
      assetsOptimized,
      estimatedSavings
    });
    
    return {
      componentsOptimized,
      routesOptimized,
      assetsOptimized,
      estimatedSavings
    };
  }

  /**
   * PERFORMANCE BUDGETS
   */
  private async setupPerformanceBudgets(): Promise<void> {
    // Main bundle budget
    await this.createPerformanceBudget({
      id: 'main_bundle',
      name: 'Main Bundle Size',
      budgets: [
        {
          metric: 'bundle_size',
          limit: 250000, // 250KB
          unit: 'bytes',
          current: 245000,
          status: 'pass'
        },
        {
          metric: 'chunk_size',
          limit: 100000, // 100KB per chunk
          unit: 'bytes',
          current: 85000,
          status: 'pass'
        }
      ],
      enabled: true,
      alertThreshold: 80, // 80% of budget
      failThreshold: 100, // 100% of budget
      lastCheck: new Date(),
      status: 'pass'
    });
    
    // Performance metrics budget
    await this.createPerformanceBudget({
      id: 'web_vitals',
      name: 'Web Vitals',
      budgets: [
        {
          metric: 'fcp',
          limit: 1800, // 1.8s
          unit: 'ms',
          current: 1200,
          status: 'pass'
        },
        {
          metric: 'lcp',
          limit: 2500, // 2.5s
          unit: 'ms',
          current: 1800,
          status: 'pass'
        },
        {
          metric: 'fid',
          limit: 100, // 100ms
          unit: 'ms',
          current: 45,
          status: 'pass'
        },
        {
          metric: 'cls',
          limit: 0.1, // 0.1 score
          unit: 'score',
          current: 0.05,
          status: 'pass'
        }
      ],
      enabled: true,
      alertThreshold: 80,
      failThreshold: 100,
      lastCheck: new Date(),
      status: 'pass'
    });
  }

  async createPerformanceBudget(budget: PerformanceBudget): Promise<void> {
    this.performanceBudgets.set(budget.id, budget);
    this.emit('performance_budget_created', { budgetId: budget.id });
  }

  async checkPerformanceBudgets(): Promise<{
    budgets: PerformanceBudget[];
    violations: string[];
    warnings: string[];
  }> {
    const violations: string[] = [];
    const warnings: string[] = [];
    
    for (const [budgetId, budget] of this.performanceBudgets) {
      if (!budget.enabled) continue;
      
      for (const rule of budget.budgets) {
        const usage = (rule.current / rule.limit) * 100;
        
        if (usage >= budget.failThreshold) {
          violations.push(`${budget.name}: ${rule.metric} exceeded budget (${usage.toFixed(1)}%)`);
          rule.status = 'fail';
        } else if (usage >= budget.alertThreshold) {
          warnings.push(`${budget.name}: ${rule.metric} approaching budget (${usage.toFixed(1)}%)`);
          rule.status = 'warning';
        } else {
          rule.status = 'pass';
        }
      }
      
      // Update overall budget status
      const hasFailures = budget.budgets.some(rule => rule.status === 'fail');
      const hasWarnings = budget.budgets.some(rule => rule.status === 'warning');
      
      if (hasFailures) {
        budget.status = 'fail';
      } else if (hasWarnings) {
        budget.status = 'warning';
      } else {
        budget.status = 'pass';
      }
      
      budget.lastCheck = new Date();
      this.performanceBudgets.set(budgetId, budget);
    }
    
    const budgets = Array.from(this.performanceBudgets.values());
    
    this.emit('performance_budgets_checked', {
      violations: violations.length,
      warnings: warnings.length
    });
    
    return {
      budgets,
      violations,
      warnings
    };
  }

  /**
   * SERVICE WORKER
   */
  private initializeServiceWorker(): ServiceWorkerConfig {
    return {
      enabled: true,
      strategies: [
        {
          name: 'Static Assets',
          pattern: '\\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$',
          strategy: 'cache_first',
          maxAge: 86400000, // 24 hours
          maxEntries: 100,
          enabled: true
        },
        {
          name: 'API Calls',
          pattern: '^/api/',
          strategy: 'network_first',
          maxAge: 300000, // 5 minutes
          maxEntries: 50,
          enabled: true
        },
        {
          name: 'HTML Pages',
          pattern: '\\.(html)$',
          strategy: 'stale_while_revalidate',
          maxAge: 3600000, // 1 hour
          maxEntries: 20,
          enabled: true
        }
      ],
      version: '1.0.0',
      updateStrategy: 'on_next_visit',
      offlinePages: ['/offline'],
      networkFirst: ['/api/'],
      cacheFirst: ['/static/', '/images/'],
      staleWhileRevalidate: ['/', '/dashboard', '/analytics']
    };
  }

  async generateServiceWorker(): Promise<string> {
    const serviceWorkerCode = `
// Service Worker for Performance Optimization
const CACHE_NAME = 'performance-cache-v${this.serviceWorkerConfig.version}';
const OFFLINE_URL = '${this.serviceWorkerConfig.offlinePages[0]}';

// Cache strategies
const strategies = ${JSON.stringify(this.serviceWorkerConfig.strategies)};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([
        ${this.serviceWorkerConfig.cacheFirst.map(url => `'${url}'`).join(',\n        ')}
      ]))
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Find matching strategy
  const strategy = strategies.find(s => 
    s.enabled && new RegExp(s.pattern).test(request.url)
  );
  
  if (strategy) {
    event.respondWith(handleRequest(request, strategy));
  }
});

async function handleRequest(request, strategy) {
  const cache = await caches.open(CACHE_NAME);
  
  switch (strategy.strategy) {
    case 'cache_first':
      return cacheFirst(request, cache);
    case 'network_first':
      return networkFirst(request, cache);
    case 'stale_while_revalidate':
      return staleWhileRevalidate(request, cache);
    default:
      return fetch(request);
  }
}

async function cacheFirst(request, cache) {
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  cache.put(request, networkResponse.clone());
  return networkResponse;
}

async function networkFirst(request, cache) {
  try {
    const networkResponse = await fetch(request);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request, cache) {
  const cachedResponse = await cache.match(request);
  
  const networkPromise = fetch(request).then(response => {
    cache.put(request, response.clone());
    return response;
  });
  
  return cachedResponse || networkPromise;
}
`;
    
    return serviceWorkerCode;
  }

  /**
   * PRELOAD STRATEGIES
   */
  private async setupPreloadStrategies(): Promise<void> {
    // Critical resources preload
    await this.createPreloadStrategy('critical', {
      resources: [
        {
          type: 'style',
          href: '/styles/critical.css',
          as: 'style',
          critical: true
        },
        {
          type: 'script',
          href: '/scripts/main.js',
          as: 'script',
          critical: true
        },
        {
          type: 'font',
          href: '/fonts/main.woff2',
          as: 'font',
          crossorigin: true,
          critical: true
        }
      ],
      priority: 'high',
      timing: 'immediate',
      enabled: true
    });
    
    // Route-based preload
    await this.createPreloadStrategy('routes', {
      resources: [
        {
          type: 'script',
          href: '/chunks/dashboard.js',
          as: 'script',
          critical: false
        },
        {
          type: 'script',
          href: '/chunks/analytics.js',
          as: 'script',
          critical: false
        }
      ],
      priority: 'medium',
      timing: 'on_interaction',
      enabled: true
    });
  }

  async createPreloadStrategy(name: string, strategy: PreloadStrategy): Promise<void> {
    this.preloadStrategies.set(name, strategy);
    this.emit('preload_strategy_created', { name });
  }

  async generatePreloadLinks(): Promise<string[]> {
    const preloadLinks: string[] = [];
    
    for (const [name, strategy] of this.preloadStrategies) {
      if (!strategy.enabled) continue;
      
      for (const resource of strategy.resources) {
        if (resource.critical || strategy.timing === 'immediate') {
          let link = `<link rel="preload" href="${resource.href}" as="${resource.as}"`;
          
          if (resource.crossorigin) {
            link += ' crossorigin';
          }
          
          if (resource.integrity) {
            link += ` integrity="${resource.integrity}"`;
          }
          
          if (resource.media) {
            link += ` media="${resource.media}"`;
          }
          
          link += '>';
          preloadLinks.push(link);
        }
      }
    }
    
    return preloadLinks;
  }

  /**
   * WEB VITALS MONITORING
   */
  private async startPerformanceMonitoring(): Promise<void> {
    // Start monitoring interval
    this.monitoringInterval = setInterval(() => {
      this.collectWebVitals();
    }, 30000); // Every 30 seconds
    
    // Setup performance observer (mock)
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.setupPerformanceObserver();
    }
  }

  private async collectWebVitals(): Promise<void> {
    // Mock web vitals collection
    const vitals: WebVitalsMetrics = {
      fcp: Math.random() * 2000 + 500, // 500-2500ms
      lcp: Math.random() * 3000 + 1000, // 1000-4000ms
      fid: Math.random() * 100 + 10, // 10-110ms
      cls: Math.random() * 0.2, // 0-0.2
      ttfb: Math.random() * 500 + 100, // 100-600ms
      fmp: Math.random() * 2500 + 800, // 800-3300ms
      timestamp: new Date(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      deviceType: this.getDeviceType(),
      connection: this.getConnectionType()
    };
    
    this.webVitalsHistory.push(vitals);
    
    // Keep only last 100 measurements
    if (this.webVitalsHistory.length > 100) {
      this.webVitalsHistory.shift();
    }
    
    // Update performance budgets
    await this.updateBudgetMetrics(vitals);
    
    this.emit('web_vitals_collected', vitals);
  }

  private setupPerformanceObserver(): void {
    // Setup performance observers for real metrics
    // This is a simplified version - in production you'd use web-vitals library
    
    try {
      // FCP observer
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            this.emit('fcp_measured', { value: entry.startTime });
          }
        }
      });
      
      fcpObserver.observe({ entryTypes: ['paint'] });
      
      // LCP observer
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.emit('lcp_measured', { value: lastEntry.startTime });
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      
    } catch (error) {
      console.error('Performance observer setup failed:', error);
    }
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    if (typeof window === 'undefined') return 'desktop';
    
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getConnectionType(): string {
    if (typeof navigator === 'undefined') return 'unknown';
    
    const connection = (navigator as any).connection;
    return connection ? connection.effectiveType || 'unknown' : 'unknown';
  }

  private async updateBudgetMetrics(vitals: WebVitalsMetrics): Promise<void> {
    const webVitalsBudget = this.performanceBudgets.get('web_vitals');
    if (!webVitalsBudget) return;
    
    // Update budget rules with current metrics
    for (const rule of webVitalsBudget.budgets) {
      switch (rule.metric) {
        case 'fcp':
          rule.current = vitals.fcp;
          break;
        case 'lcp':
          rule.current = vitals.lcp;
          break;
        case 'fid':
          rule.current = vitals.fid;
          break;
        case 'cls':
          rule.current = vitals.cls;
          break;
        case 'ttfb':
          rule.current = vitals.ttfb;
          break;
      }
    }
    
    this.performanceBudgets.set('web_vitals', webVitalsBudget);
  }

  /**
   * OPTIMIZATION EXECUTION
   */
  async executeOptimizations(optimizations: string[]): Promise<{
    executed: string[];
    failed: string[];
    totalSavings: number;
  }> {
    const executed: string[] = [];
    const failed: string[] = [];
    let totalSavings = 0;
    
    for (const optimizationId of optimizations) {
      try {
        const savings = await this.executeOptimization(optimizationId);
        executed.push(optimizationId);
        totalSavings += savings;
      } catch (error) {
        failed.push(optimizationId);
        console.error(`Optimization ${optimizationId} failed:`, error);
      }
    }
    
    this.emit('optimizations_executed', {
      executed: executed.length,
      failed: failed.length,
      totalSavings
    });
    
    return {
      executed,
      failed,
      totalSavings
    };
  }

  private async executeOptimization(optimizationId: string): Promise<number> {
    // Mock optimization execution
    switch (optimizationId) {
      case 'code_splitting':
        return await this.implementCodeSplitting();
      case 'lazy_loading':
        return await this.implementLazyLoading();
      case 'tree_shaking':
        return await this.implementTreeShaking();
      case 'compression':
        return await this.implementCompression();
      case 'dependency':
        return await this.optimizeDependencies();
      default:
        throw new Error(`Unknown optimization: ${optimizationId}`);
    }
  }

  private async implementCodeSplitting(): Promise<number> {
    // Mock implementation
    console.log('Implementing code splitting...');
    return 200000; // 200KB saved
  }

  private async implementLazyLoading(): Promise<number> {
    // Mock implementation
    console.log('Implementing lazy loading...');
    return 150000; // 150KB saved
  }

  private async implementTreeShaking(): Promise<number> {
    // Mock implementation
    console.log('Implementing tree shaking...');
    return 75000; // 75KB saved
  }

  private async implementCompression(): Promise<number> {
    // Mock implementation
    console.log('Implementing compression...');
    return 50000; // 50KB saved
  }

  private async optimizeDependencies(): Promise<number> {
    // Mock implementation
    console.log('Optimizing dependencies...');
    return 300000; // 300KB saved
  }

  /**
   * PUBLIC API
   */
  async getBundleAnalyses(): Promise<BundleAnalysis[]> {
    return Array.from(this.bundleAnalyses.values());
  }

  async getPerformanceBudgets(): Promise<PerformanceBudget[]> {
    return Array.from(this.performanceBudgets.values());
  }

  async getWebVitalsHistory(): Promise<WebVitalsMetrics[]> {
    return [...this.webVitalsHistory];
  }

  async getOptimizationRecommendations(): Promise<OptimizationSuggestion[]> {
    const latestAnalysis = Array.from(this.bundleAnalyses.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    
    return latestAnalysis?.optimizations || [];
  }

  async generatePerformanceReport(): Promise<{
    bundleSize: number;
    webVitals: WebVitalsMetrics;
    budgetStatus: string;
    optimizations: OptimizationSuggestion[];
    recommendations: string[];
  }> {
    const latestAnalysis = Array.from(this.bundleAnalyses.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())[0];
    
    const latestVitals = this.webVitalsHistory[this.webVitalsHistory.length - 1];
    
    const budgetCheck = await this.checkPerformanceBudgets();
    const budgetStatus = budgetCheck.violations.length > 0 ? 'fail' : 
                        budgetCheck.warnings.length > 0 ? 'warning' : 'pass';
    
    const recommendations = this.generateRecommendations(latestAnalysis, latestVitals);
    
    return {
      bundleSize: latestAnalysis?.size || 0,
      webVitals: latestVitals,
      budgetStatus,
      optimizations: latestAnalysis?.optimizations || [],
      recommendations
    };
  }

  private generateRecommendations(analysis?: BundleAnalysis, vitals?: WebVitalsMetrics): string[] {
    const recommendations: string[] = [];
    
    if (analysis) {
      if (analysis.size > 1000000) {
        recommendations.push('Bundle size is over 1MB - consider aggressive code splitting');
      }
      
      if (analysis.duplicates.length > 0) {
        recommendations.push('Remove duplicate code to reduce bundle size');
      }
      
      if (analysis.unusedCode.length > 0) {
        recommendations.push('Remove unused code to improve performance');
      }
    }
    
    if (vitals) {
      if (vitals.fcp > 2500) {
        recommendations.push('First Contentful Paint is slow - optimize critical resources');
      }
      
      if (vitals.lcp > 4000) {
        recommendations.push('Largest Contentful Paint is slow - optimize main content loading');
      }
      
      if (vitals.fid > 100) {
        recommendations.push('First Input Delay is high - optimize JavaScript execution');
      }
      
      if (vitals.cls > 0.1) {
        recommendations.push('Cumulative Layout Shift is high - stabilize layout');
      }
    }
    
    return recommendations;
  }

  // Cleanup
  async cleanup(): Promise<void> {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  }
}

// Export singleton instance
export const frontendPerformanceOptimizer = new FrontendPerformanceOptimizer();
