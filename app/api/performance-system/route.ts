
/**
 * PERFORMANCE SYSTEM API
 * Unified API for all performance and scalability systems
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { advancedCachingSystem } from '@/lib/advanced-caching-system';
import { databaseOptimizationEngine } from '@/lib/database-optimization-engine';
import { autoScalingSystem } from '@/lib/auto-scaling-system';
import { eventDrivenArchitecture } from '@/lib/event-driven-architecture';
import { circuitBreakerSystem } from '@/lib/circuit-breaker-system';
import { realTimePerformanceMonitor } from '@/lib/real-time-performance-monitor';
import { frontendPerformanceOptimizer } from '@/lib/frontend-performance-optimizer';
import { productionMonitoringDashboard } from '@/lib/production-monitoring-dashboard';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const system = searchParams.get('system');
    const action = searchParams.get('action');

    switch (system) {
      case 'caching':
        return await handleCachingSystem(action);
      
      case 'database':
        return await handleDatabaseSystem(action);
      
      case 'scaling':
        return await handleScalingSystem(action);
      
      case 'events':
        return await handleEventsSystem(action);
      
      case 'circuit_breaker':
        return await handleCircuitBreakerSystem(action);
      
      case 'performance':
        return await handlePerformanceSystem(action);
      
      case 'frontend':
        return await handleFrontendSystem(action);
      
      case 'monitoring':
        return await handleMonitoringSystem(action);
      
      case 'overview':
        return await handleSystemOverview();
      
      default:
        return NextResponse.json({ error: 'Invalid system' }, { status: 400 });
    }
  } catch (error) {
    console.error('Performance system API error:', error);
    return NextResponse.json(
      { error: 'Performance system request failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { system, action, data } = await request.json();

    switch (system) {
      case 'caching':
        return await handleCachingSystemPost(action, data);
      
      case 'database':
        return await handleDatabaseSystemPost(action, data);
      
      case 'scaling':
        return await handleScalingSystemPost(action, data);
      
      case 'events':
        return await handleEventsSystemPost(action, data);
      
      case 'circuit_breaker':
        return await handleCircuitBreakerSystemPost(action, data);
      
      case 'performance':
        return await handlePerformanceSystemPost(action, data);
      
      case 'frontend':
        return await handleFrontendSystemPost(action, data);
      
      case 'monitoring':
        return await handleMonitoringSystemPost(action, data);
      
      default:
        return NextResponse.json({ error: 'Invalid system' }, { status: 400 });
    }
  } catch (error) {
    console.error('Performance system API error:', error);
    return NextResponse.json(
      { error: 'Performance system request failed' },
      { status: 500 }
    );
  }
}

/**
 * CACHING SYSTEM HANDLERS
 */
async function handleCachingSystem(action: string | null): Promise<NextResponse> {
  switch (action) {
    case 'analytics':
      const analytics = await advancedCachingSystem.getCacheAnalytics();
      return NextResponse.json(analytics);
    
    case 'layers':
      const analyticsForLayers = await advancedCachingSystem.getCacheAnalytics();
      const layers = analyticsForLayers.layers;
      return NextResponse.json({ layers });
    
    case 'recommendations':
      const analyticsForRecommendations = await advancedCachingSystem.getCacheAnalytics();
      const recommendations = analyticsForRecommendations.recommendations;
      return NextResponse.json({ recommendations });
    
    default:
      return NextResponse.json({ error: 'Invalid caching action' }, { status: 400 });
  }
}

async function handleCachingSystemPost(action: string, data: any): Promise<NextResponse> {
  switch (action) {
    case 'set':
      await advancedCachingSystem.set(data.key, data.value, data.options);
      return NextResponse.json({ success: true });
    
    case 'invalidate':
      await advancedCachingSystem.invalidate(data.pattern);
      return NextResponse.json({ success: true });
    
    case 'optimize':
      const optimizationResult = await advancedCachingSystem.optimizeCache();
      return NextResponse.json(optimizationResult);
    
    case 'warmup':
      await advancedCachingSystem.warmupCache(data.pattern);
      return NextResponse.json({ success: true });
    
    default:
      return NextResponse.json({ error: 'Invalid caching action' }, { status: 400 });
  }
}

/**
 * DATABASE SYSTEM HANDLERS
 */
async function handleDatabaseSystem(action: string | null): Promise<NextResponse> {
  switch (action) {
    case 'metrics':
      const metrics = await databaseOptimizationEngine.getDatabaseMetrics();
      return NextResponse.json(metrics);
    
    case 'recommendations':
      const recommendations = await databaseOptimizationEngine.getOptimizationRecommendations();
      return NextResponse.json(recommendations);
    
    case 'connection_pool':
      const metricsForPool = await databaseOptimizationEngine.getDatabaseMetrics();
      const poolStats = metricsForPool.connectionPool;
      return NextResponse.json({ connectionPool: poolStats });
    
    default:
      return NextResponse.json({ error: 'Invalid database action' }, { status: 400 });
  }
}

async function handleDatabaseSystemPost(action: string, data: any): Promise<NextResponse> {
  switch (action) {
    case 'optimize':
      const optimizationResult = await databaseOptimizationEngine.optimizeDatabase();
      return NextResponse.json(optimizationResult);
    
    case 'analyze_query':
      const analysis = await databaseOptimizationEngine.analyzeQueryPlan(data.sql, data.params);
      return NextResponse.json(analysis);
    
    case 'apply_index':
      const indexResult = await databaseOptimizationEngine.applyIndexRecommendation(data.recommendationId);
      return NextResponse.json(indexResult);
    
    default:
      return NextResponse.json({ error: 'Invalid database action' }, { status: 400 });
  }
}

/**
 * SCALING SYSTEM HANDLERS
 */
async function handleScalingSystem(action: string | null): Promise<NextResponse> {
  switch (action) {
    case 'metrics':
      const metrics = await autoScalingSystem.getScalingMetrics();
      return NextResponse.json(metrics);
    
    case 'recommendations':
      const recommendations = await autoScalingSystem.getResourceRecommendations();
      return NextResponse.json(recommendations);
    
    case 'resource_pools':
      const metricsForPools = await autoScalingSystem.getScalingMetrics();
      const resourcePools = metricsForPools.resourcePools;
      return NextResponse.json({ resourcePools });
    
    default:
      return NextResponse.json({ error: 'Invalid scaling action' }, { status: 400 });
  }
}

async function handleScalingSystemPost(action: string, data: any): Promise<NextResponse> {
  switch (action) {
    case 'optimize':
      const optimizationResult = await autoScalingSystem.optimizeResources();
      return NextResponse.json(optimizationResult);
    
    case 'create_rule':
      await autoScalingSystem.createScalingRule(data.rule);
      return NextResponse.json({ success: true });
    
    case 'update_rule':
      await autoScalingSystem.updateScalingRule(data.ruleId, data.updates);
      return NextResponse.json({ success: true });
    
    default:
      return NextResponse.json({ error: 'Invalid scaling action' }, { status: 400 });
  }
}

/**
 * EVENTS SYSTEM HANDLERS
 */
async function handleEventsSystem(action: string | null): Promise<NextResponse> {
  switch (action) {
    case 'metrics':
      const metrics = await eventDrivenArchitecture.getEventStatistics();
      return NextResponse.json(metrics);
    
    case 'queues':
      const streams = eventDrivenArchitecture.getAllEventStreams();
      const queues = streams.map(s => ({
        id: s.aggregateId,
        type: s.aggregateType,
        eventCount: s.events.length
      }));
      return NextResponse.json({ queues });
    
    case 'sagas':
      const sagas = eventDrivenArchitecture.getAllSagas();
      return NextResponse.json({ sagas });
    
    default:
      return NextResponse.json({ error: 'Invalid events action' }, { status: 400 });
  }
}

async function handleEventsSystemPost(action: string, data: any): Promise<NextResponse> {
  switch (action) {
    case 'publish_event':
      await eventDrivenArchitecture.appendEvents(
        data.event.aggregateId,
        data.event.aggregateType,
        [data.event]
      );
      return NextResponse.json({ success: true });
    
    case 'execute_command':
      const result = await eventDrivenArchitecture.executeCommand(data.command);
      return NextResponse.json({ result });
    
    case 'execute_query':
      const queryResult = await eventDrivenArchitecture.executeQuery(data.query);
      return NextResponse.json({ result: queryResult });
    
    default:
      return NextResponse.json({ error: 'Invalid events action' }, { status: 400 });
  }
}

/**
 * CIRCUIT BREAKER SYSTEM HANDLERS
 */
async function handleCircuitBreakerSystem(action: string | null): Promise<NextResponse> {
  switch (action) {
    case 'metrics':
      const metrics = await circuitBreakerSystem.getSystemMetrics();
      return NextResponse.json(metrics);
    
    case 'circuit_breakers':
      const metricsForBreakers = await circuitBreakerSystem.getSystemMetrics();
      const circuitBreakers = metricsForBreakers.circuitBreakers;
      return NextResponse.json({ circuitBreakers });
    
    case 'bulkheads':
      const metricsForBulkheads = await circuitBreakerSystem.getSystemMetrics();
      const bulkheads = metricsForBulkheads.bulkheads;
      return NextResponse.json({ bulkheads });
    
    default:
      return NextResponse.json({ error: 'Invalid circuit breaker action' }, { status: 400 });
  }
}

async function handleCircuitBreakerSystemPost(action: string, data: any): Promise<NextResponse> {
  switch (action) {
    case 'reset':
      await circuitBreakerSystem.resetCircuitBreaker(data.name);
      return NextResponse.json({ success: true });
    
    case 'update_config':
      await circuitBreakerSystem.updateCircuitBreakerConfig(data.name, data.config);
      return NextResponse.json({ success: true });
    
    case 'execute_with_breaker':
      const result = await circuitBreakerSystem.executeWithCircuitBreaker(
        data.name,
        data.operation,
        data.fallback
      );
      return NextResponse.json({ result });
    
    default:
      return NextResponse.json({ error: 'Invalid circuit breaker action' }, { status: 400 });
  }
}

/**
 * PERFORMANCE SYSTEM HANDLERS
 */
async function handlePerformanceSystem(action: string | null): Promise<NextResponse> {
  switch (action) {
    case 'metrics':
      const metrics = await realTimePerformanceMonitor.getMetrics();
      return NextResponse.json({ metrics });
    
    case 'alerts':
      const alerts = await realTimePerformanceMonitor.getAlerts();
      return NextResponse.json({ alerts });
    
    case 'bottlenecks':
      const bottlenecks = await realTimePerformanceMonitor.getBottlenecks();
      return NextResponse.json({ bottlenecks });
    
    case 'optimizations':
      const optimizations = await realTimePerformanceMonitor.getOptimizations();
      return NextResponse.json({ optimizations });
    
    default:
      return NextResponse.json({ error: 'Invalid performance action' }, { status: 400 });
  }
}

async function handlePerformanceSystemPost(action: string, data: any): Promise<NextResponse> {
  switch (action) {
    case 'start_profiling':
      const profileId = await realTimePerformanceMonitor.startProfiling(data.profile);
      return NextResponse.json({ profileId });
    
    case 'stop_profiling':
      const profile = await realTimePerformanceMonitor.stopProfiling(data.profileId);
      return NextResponse.json({ profile });
    
    case 'execute_optimization':
      await realTimePerformanceMonitor.executeOptimization(data.optimizationId);
      return NextResponse.json({ success: true });
    
    case 'predict_capacity':
      const prediction = await realTimePerformanceMonitor.predictCapacity(data.resource, data.timeframe);
      return NextResponse.json({ prediction });
    
    default:
      return NextResponse.json({ error: 'Invalid performance action' }, { status: 400 });
  }
}

/**
 * FRONTEND SYSTEM HANDLERS
 */
async function handleFrontendSystem(action: string | null): Promise<NextResponse> {
  switch (action) {
    case 'bundles':
      const bundles = await frontendPerformanceOptimizer.getBundleAnalyses();
      return NextResponse.json({ bundles });
    
    case 'budgets':
      const budgets = await frontendPerformanceOptimizer.getPerformanceBudgets();
      return NextResponse.json({ budgets });
    
    case 'vitals':
      const vitals = await frontendPerformanceOptimizer.getWebVitalsHistory();
      return NextResponse.json({ vitals });
    
    case 'recommendations':
      const recommendations = await frontendPerformanceOptimizer.getOptimizationRecommendations();
      return NextResponse.json({ recommendations });
    
    default:
      return NextResponse.json({ error: 'Invalid frontend action' }, { status: 400 });
  }
}

async function handleFrontendSystemPost(action: string, data: any): Promise<NextResponse> {
  switch (action) {
    case 'analyze_bundles':
      const analysis = await frontendPerformanceOptimizer.analyzeBundles();
      return NextResponse.json({ analysis });
    
    case 'check_budgets':
      const budgetCheck = await frontendPerformanceOptimizer.checkPerformanceBudgets();
      return NextResponse.json(budgetCheck);
    
    case 'optimize_lazy_loading':
      const lazyResult = await frontendPerformanceOptimizer.optimizeLazyLoading();
      return NextResponse.json(lazyResult);
    
    case 'generate_report':
      const report = await frontendPerformanceOptimizer.generatePerformanceReport();
      return NextResponse.json({ report });
    
    default:
      return NextResponse.json({ error: 'Invalid frontend action' }, { status: 400 });
  }
}

/**
 * MONITORING SYSTEM HANDLERS
 */
async function handleMonitoringSystem(action: string | null): Promise<NextResponse> {
  switch (action) {
    case 'dashboards':
      const dashboards = await productionMonitoringDashboard.getDashboards();
      return NextResponse.json({ dashboards });
    
    case 'alerts':
      const alerts = await productionMonitoringDashboard.getActiveAlerts();
      return NextResponse.json({ alerts });
    
    case 'capacity':
      const capacity = await productionMonitoringDashboard.getCapacityPlans();
      return NextResponse.json({ capacity });
    
    case 'tests':
      const tests = await productionMonitoringDashboard.getPerformanceTests();
      return NextResponse.json({ tests });
    
    default:
      return NextResponse.json({ error: 'Invalid monitoring action' }, { status: 400 });
  }
}

async function handleMonitoringSystemPost(action: string, data: any): Promise<NextResponse> {
  switch (action) {
    case 'create_dashboard':
      await productionMonitoringDashboard.createDashboard(data.dashboard);
      return NextResponse.json({ success: true });
    
    case 'get_dashboard_data':
      const dashboardData = await productionMonitoringDashboard.getDashboardData(data.dashboardId);
      return NextResponse.json(dashboardData);
    
    case 'create_test':
      const testId = await productionMonitoringDashboard.createPerformanceTest(data.test);
      return NextResponse.json({ testId });
    
    case 'run_test':
      const testResult = await productionMonitoringDashboard.runPerformanceTest(data.testId);
      return NextResponse.json({ result: testResult });
    
    default:
      return NextResponse.json({ error: 'Invalid monitoring action' }, { status: 400 });
  }
}

/**
 * SYSTEM OVERVIEW HANDLER
 */
async function handleSystemOverview(): Promise<NextResponse> {
  try {
    // Collect overview data from all systems
    const cachingAnalytics = await advancedCachingSystem.getCacheAnalytics();
    const databaseMetrics = await databaseOptimizationEngine.getDatabaseMetrics();
    const scalingMetrics = await autoScalingSystem.getScalingMetrics();
    const eventsMetrics = await eventDrivenArchitecture.getEventStatistics();
    const circuitBreakerMetrics = await circuitBreakerSystem.getSystemMetrics();
    const performanceMetrics = await realTimePerformanceMonitor.getMetrics();
    const frontendBudgets = await frontendPerformanceOptimizer.getPerformanceBudgets();
    const activeAlerts = await productionMonitoringDashboard.getActiveAlerts();

    const overview = {
      timestamp: new Date(),
      systems: {
        caching: {
          totalHitRate: cachingAnalytics.totalHitRate,
          totalMemoryUsage: cachingAnalytics.totalMemoryUsage,
          layers: cachingAnalytics.layers.length,
          performance: cachingAnalytics.performance
        },
        database: {
          connectionPool: databaseMetrics.connectionPool,
          performance: databaseMetrics.performance,
          indexRecommendations: databaseMetrics.indexes.missingEstimated
        },
        scaling: {
          resourcePools: scalingMetrics.resourcePools.length,
          rules: scalingMetrics.rules.length,
          recentEvents: scalingMetrics.recentEvents.length
        },
        events: {
          totalEvents: eventsMetrics.totalEvents,
          totalStreams: eventsMetrics.totalStreams,
          totalSagas: eventsMetrics.totalSagas
        },
        circuitBreaker: {
          circuitBreakers: circuitBreakerMetrics.circuitBreakers.length,
          bulkheads: circuitBreakerMetrics.bulkheads.length,
          retryPolicies: circuitBreakerMetrics.retryPolicies.length
        },
        performance: {
          totalMetrics: performanceMetrics.length,
          activeBottlenecks: (await realTimePerformanceMonitor.getBottlenecks()).filter(b => !b.resolved).length,
          optimizations: (await realTimePerformanceMonitor.getOptimizations()).length
        },
        frontend: {
          budgets: frontendBudgets.length,
          budgetStatus: frontendBudgets.filter(b => b.status === 'pass').length,
          vitals: (await frontendPerformanceOptimizer.getWebVitalsHistory()).length
        },
        monitoring: {
          dashboards: (await productionMonitoringDashboard.getDashboards()).length,
          activeAlerts: activeAlerts.length,
          capacityPlans: (await productionMonitoringDashboard.getCapacityPlans()).length
        }
      },
      health: {
        overall: 'healthy',
        issues: activeAlerts.filter(a => a.severity === 'critical').length,
        warnings: activeAlerts.filter(a => a.severity === 'warning').length
      }
    };

    return NextResponse.json(overview);
  } catch (error) {
    console.error('System overview error:', error);
    return NextResponse.json(
      { error: 'Failed to generate system overview' },
      { status: 500 }
    );
  }
}
