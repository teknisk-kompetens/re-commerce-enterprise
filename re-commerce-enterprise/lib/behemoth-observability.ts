
/**
 * BEHEMOTH OBSERVABILITY SYSTEM
 * Enterprise-grade monitoring, metrics collection, tracing,
 * and performance analytics for production systems
 */

export interface Metric {
  name: string;
  value: number;
  unit: string;
  labels: Record<string, string>;
  timestamp: Date;
  type: MetricType;
}

export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';

export interface Trace {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  operationName: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'success' | 'error' | 'timeout';
  tags: Record<string, any>;
  logs: TraceLog[];
  baggage?: Record<string, string>;
}

export interface TraceLog {
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  fields?: Record<string, any>;
}

export interface Alert {
  id: string;
  name: string;
  description: string;
  severity: AlertSeverity;
  condition: AlertCondition;
  status: AlertStatus;
  triggeredAt: Date;
  resolvedAt?: Date;
  metadata: Record<string, any>;
  actions: AlertAction[];
}

export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertStatus = 'pending' | 'firing' | 'resolved' | 'silenced';

export interface AlertCondition {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'ne' | 'gte' | 'lte';
  threshold: number;
  duration: number; // seconds
  evaluationInterval: number; // seconds
}

export interface AlertAction {
  type: 'email' | 'webhook' | 'slack' | 'pagerduty';
  endpoint: string;
  template?: string;
  enabled: boolean;
}

export interface PerformanceProfile {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  samples: PerformanceSample[];
  summary: PerformanceSummary;
  metadata: Record<string, any>;
}

export interface PerformanceSample {
  timestamp: Date;
  functionName: string;
  fileName: string;
  lineNumber: number;
  cpuUsage: number;
  memoryUsage: number;
  callCount: number;
}

export interface PerformanceSummary {
  totalCpuTime: number;
  totalMemoryUsage: number;
  hotspots: Hotspot[];
  recommendations: string[];
}

export interface Hotspot {
  functionName: string;
  cpuPercentage: number;
  memoryPercentage: number;
  callCount: number;
  averageExecutionTime: number;
}

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  message?: string;
  timestamp: Date;
  details?: Record<string, any>;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  components: HealthCheck[];
  score: number; // 0-100
  timestamp: Date;
}

export class BehemothObservability {
  private static metrics: Metric[] = [];
  private static traces: Trace[] = [];
  private static alerts: Alert[] = [];
  private static performanceProfiles: PerformanceProfile[] = [];
  private static activeSpans = new Map<string, Trace>();
  private static alertRules = new Map<string, AlertCondition>();
  
  private static config = {
    metricsRetention: 7 * 24 * 60 * 60 * 1000, // 7 days
    tracesRetention: 24 * 60 * 60 * 1000, // 24 hours
    maxMetrics: 10000,
    maxTraces: 5000,
    samplingRate: 0.1, // 10% trace sampling
    enableProfiling: true,
    alertEvaluationInterval: 60000, // 1 minute
  };

  /**
   * Initialize observability system
   */
  static initialize(config?: Partial<typeof BehemothObservability.config>): void {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    // Start background processes
    this.startMetricsCollection();
    this.startAlertEvaluation();
    this.startCleanupTasks();
    
    // Set up error handling
    this.setupGlobalErrorHandling();
    
    // Initialize performance monitoring
    if (this.config.enableProfiling) {
      this.initializePerformanceMonitoring();
    }

    console.log('Behemoth Observability System initialized');
  }

  /**
   * Record a metric
   */
  static recordMetric(
    name: string,
    value: number,
    type: MetricType = 'gauge',
    labels: Record<string, string> = {},
    unit: string = ''
  ): void {
    const metric: Metric = {
      name,
      value,
      unit,
      labels,
      timestamp: new Date(),
      type,
    };

    this.metrics.push(metric);

    // Cleanup old metrics
    if (this.metrics.length > this.config.maxMetrics) {
      this.metrics.shift();
    }

    // Check alert conditions
    this.evaluateAlerts(metric);
  }

  /**
   * Start a new trace span
   */
  static startSpan(
    operationName: string,
    parentSpanId?: string,
    tags: Record<string, any> = {}
  ): string {
    // Skip tracing if sampling decides so
    if (Math.random() > this.config.samplingRate && !parentSpanId) {
      return '';
    }

    const traceId = parentSpanId ? 
      this.findTraceId(parentSpanId) : 
      crypto.randomUUID();
    const spanId = crypto.randomUUID();

    const trace: Trace = {
      traceId,
      spanId,
      parentSpanId,
      operationName,
      startTime: new Date(),
      status: 'success',
      tags,
      logs: [],
    };

    this.activeSpans.set(spanId, trace);
    return spanId;
  }

  /**
   * Finish a trace span
   */
  static finishSpan(
    spanId: string,
    status: 'success' | 'error' | 'timeout' = 'success',
    tags: Record<string, any> = {}
  ): void {
    if (!spanId) return;

    const trace = this.activeSpans.get(spanId);
    if (!trace) return;

    trace.endTime = new Date();
    trace.duration = trace.endTime.getTime() - trace.startTime.getTime();
    trace.status = status;
    trace.tags = { ...trace.tags, ...tags };

    this.activeSpans.delete(spanId);
    this.traces.push(trace);

    // Cleanup old traces
    if (this.traces.length > this.config.maxTraces) {
      this.traces.shift();
    }

    // Record span duration as metric
    this.recordMetric(
      'span_duration',
      trace.duration,
      'histogram',
      {
        operation: trace.operationName,
        status: trace.status,
      },
      'ms'
    );
  }

  /**
   * Add log to current span
   */
  static logToSpan(
    spanId: string,
    level: TraceLog['level'],
    message: string,
    fields?: Record<string, any>
  ): void {
    if (!spanId) return;

    const trace = this.activeSpans.get(spanId);
    if (!trace) return;

    trace.logs.push({
      timestamp: new Date(),
      level,
      message,
      fields,
    });
  }

  /**
   * Create instrumented function wrapper
   */
  static instrument<T extends (...args: any[]) => any>(
    name: string,
    fn: T,
    tags?: Record<string, any>
  ): T {
    return ((...args: any[]) => {
      const spanId = this.startSpan(name, undefined, tags);
      const startTime = performance.now();

      try {
        const result = fn(...args);

        // Handle async functions
        if (result && typeof result.then === 'function') {
          return result
            .then((value: any) => {
              this.finishSpan(spanId, 'success');
              this.recordMetric('function_execution_time', performance.now() - startTime, 'histogram', { function: name }, 'ms');
              return value;
            })
            .catch((error: any) => {
              this.finishSpan(spanId, 'error', { error: error.message });
              this.recordMetric('function_execution_time', performance.now() - startTime, 'histogram', { function: name, status: 'error' }, 'ms');
              throw error;
            });
        }

        // Handle sync functions
        this.finishSpan(spanId, 'success');
        this.recordMetric('function_execution_time', performance.now() - startTime, 'histogram', { function: name }, 'ms');
        return result;

      } catch (error) {
        this.finishSpan(spanId, 'error', { error: error instanceof Error ? error.message : String(error) });
        this.recordMetric('function_execution_time', performance.now() - startTime, 'histogram', { function: name, status: 'error' }, 'ms');
        throw error;
      }
    }) as T;
  }

  /**
   * Add alert rule
   */
  static addAlertRule(
    name: string,
    condition: AlertCondition,
    actions: AlertAction[]
  ): void {
    this.alertRules.set(name, condition);
    console.log(`Alert rule '${name}' added`);
  }

  /**
   * Remove alert rule
   */
  static removeAlertRule(name: string): void {
    this.alertRules.delete(name);
  }

  /**
   * Get current metrics
   */
  static getMetrics(
    name?: string,
    labels?: Record<string, string>,
    timeRange?: { start: Date; end: Date }
  ): Metric[] {
    let filteredMetrics = [...this.metrics];

    if (name) {
      filteredMetrics = filteredMetrics.filter(m => m.name === name);
    }

    if (labels) {
      filteredMetrics = filteredMetrics.filter(m => 
        Object.entries(labels).every(([key, value]) => m.labels[key] === value)
      );
    }

    if (timeRange) {
      filteredMetrics = filteredMetrics.filter(m => 
        m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
      );
    }

    return filteredMetrics;
  }

  /**
   * Get traces
   */
  static getTraces(
    operationName?: string,
    timeRange?: { start: Date; end: Date }
  ): Trace[] {
    let filteredTraces = [...this.traces];

    if (operationName) {
      filteredTraces = filteredTraces.filter(t => t.operationName === operationName);
    }

    if (timeRange) {
      filteredTraces = filteredTraces.filter(t => 
        t.startTime >= timeRange.start && 
        (!t.endTime || t.endTime <= timeRange.end)
      );
    }

    return filteredTraces;
  }

  /**
   * Get active alerts
   */
  static getAlerts(status?: AlertStatus): Alert[] {
    if (status) {
      return this.alerts.filter(a => a.status === status);
    }
    return [...this.alerts];
  }

  /**
   * Perform system health check
   */
  static async performHealthCheck(): Promise<SystemHealth> {
    const checks: HealthCheck[] = [];

    // Database health
    try {
      const dbStartTime = performance.now();
      // Simulate database ping
      await new Promise(resolve => setTimeout(resolve, 10));
      const dbResponseTime = performance.now() - dbStartTime;

      checks.push({
        name: 'database',
        status: 'healthy',
        responseTime: dbResponseTime,
        timestamp: new Date(),
      });
    } catch (error) {
      checks.push({
        name: 'database',
        status: 'unhealthy',
        responseTime: 0,
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
      });
    }

    // API health
    checks.push({
      name: 'api',
      status: 'healthy',
      responseTime: 15,
      timestamp: new Date(),
    });

    // Memory usage
    const memoryUsage = this.getMemoryUsage();
    checks.push({
      name: 'memory',
      status: memoryUsage > 0.8 ? 'degraded' : 'healthy',
      responseTime: 0,
      timestamp: new Date(),
      details: { usage: memoryUsage },
    });

    // Calculate overall health
    const healthyCount = checks.filter(c => c.status === 'healthy').length;
    const degradedCount = checks.filter(c => c.status === 'degraded').length;
    const unhealthyCount = checks.filter(c => c.status === 'unhealthy').length;

    let overall: SystemHealth['overall'] = 'healthy';
    if (unhealthyCount > 0) {
      overall = 'unhealthy';
    } else if (degradedCount > 0) {
      overall = 'degraded';
    }

    const score = Math.round(
      (healthyCount + degradedCount * 0.5) / checks.length * 100
    );

    return {
      overall,
      components: checks,
      score,
      timestamp: new Date(),
    };
  }

  /**
   * Start performance profiling
   */
  static startProfiling(name: string): string {
    const profileId = crypto.randomUUID();
    
    const profile: PerformanceProfile = {
      id: profileId,
      name,
      startTime: new Date(),
      endTime: new Date(),
      samples: [],
      summary: {
        totalCpuTime: 0,
        totalMemoryUsage: 0,
        hotspots: [],
        recommendations: [],
      },
      metadata: {},
    };

    this.performanceProfiles.push(profile);
    return profileId;
  }

  /**
   * Stop performance profiling
   */
  static stopProfiling(profileId: string): PerformanceProfile | null {
    const profile = this.performanceProfiles.find(p => p.id === profileId);
    if (!profile) return null;

    profile.endTime = new Date();
    
    // Analyze performance data
    this.analyzePerformanceProfile(profile);
    
    return profile;
  }

  /**
   * Export metrics in Prometheus format
   */
  static exportPrometheusMetrics(): string {
    const output: string[] = [];
    const metricsByName = new Map<string, Metric[]>();

    // Group metrics by name
    this.metrics.forEach(metric => {
      if (!metricsByName.has(metric.name)) {
        metricsByName.set(metric.name, []);
      }
      metricsByName.get(metric.name)!.push(metric);
    });

    // Generate Prometheus format
    metricsByName.forEach((metrics, name) => {
      const latestMetric = metrics[metrics.length - 1];
      
      output.push(`# TYPE ${name} ${latestMetric.type}`);
      
      metrics.forEach(metric => {
        const labelStr = Object.entries(metric.labels)
          .map(([key, value]) => `${key}="${value}"`)
          .join(',');
        
        output.push(`${name}${labelStr ? `{${labelStr}}` : ''} ${metric.value} ${metric.timestamp.getTime()}`);
      });
    });

    return output.join('\n');
  }

  /**
   * Start background metrics collection
   */
  private static startMetricsCollection(): void {
    setInterval(() => {
      // Collect system metrics
      this.collectSystemMetrics();
    }, 30000); // Every 30 seconds
  }

  /**
   * Collect system metrics
   */
  private static collectSystemMetrics(): void {
    // Memory usage
    const memoryUsage = this.getMemoryUsage();
    this.recordMetric('system_memory_usage', memoryUsage, 'gauge', {}, 'ratio');

    // Active traces count
    this.recordMetric('active_traces_count', this.activeSpans.size, 'gauge');

    // Metrics count
    this.recordMetric('metrics_count', this.metrics.length, 'gauge');

    // Alert count by status
    const alertsByStatus = this.alerts.reduce((acc, alert) => {
      acc[alert.status] = (acc[alert.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(alertsByStatus).forEach(([status, count]) => {
      this.recordMetric('alerts_count', count, 'gauge', { status });
    });
  }

  /**
   * Get memory usage (simplified)
   */
  private static getMemoryUsage(): number {
    // In a real implementation, this would use actual memory APIs
    // For browser: performance.memory (if available)
    // For Node.js: process.memoryUsage()
    return Math.random() * 0.5 + 0.1; // Mock: 10-60% usage
  }

  /**
   * Start alert evaluation
   */
  private static startAlertEvaluation(): void {
    setInterval(() => {
      this.evaluateAllAlerts();
    }, this.config.alertEvaluationInterval);
  }

  /**
   * Evaluate all alert rules
   */
  private static evaluateAllAlerts(): void {
    this.alertRules.forEach((condition, name) => {
      this.evaluateAlertRule(name, condition);
    });
  }

  /**
   * Evaluate specific alert rule
   */
  private static evaluateAlertRule(name: string, condition: AlertCondition): void {
    const recentMetrics = this.getMetrics(
      condition.metric,
      undefined,
      {
        start: new Date(Date.now() - condition.duration * 1000),
        end: new Date(),
      }
    );

    if (recentMetrics.length === 0) return;

    const latestValue = recentMetrics[recentMetrics.length - 1].value;
    let conditionMet = false;

    switch (condition.operator) {
      case 'gt': conditionMet = latestValue > condition.threshold; break;
      case 'lt': conditionMet = latestValue < condition.threshold; break;
      case 'eq': conditionMet = latestValue === condition.threshold; break;
      case 'ne': conditionMet = latestValue !== condition.threshold; break;
      case 'gte': conditionMet = latestValue >= condition.threshold; break;
      case 'lte': conditionMet = latestValue <= condition.threshold; break;
    }

    if (conditionMet) {
      this.fireAlert(name, condition, latestValue);
    }
  }

  /**
   * Fire an alert
   */
  private static fireAlert(name: string, condition: AlertCondition, value: number): void {
    // Check if alert already exists
    const existingAlert = this.alerts.find(a => a.name === name && a.status === 'firing');
    if (existingAlert) return;

    const alert: Alert = {
      id: crypto.randomUUID(),
      name,
      description: `${condition.metric} ${condition.operator} ${condition.threshold}`,
      severity: this.determineSeverity(condition, value),
      condition,
      status: 'firing',
      triggeredAt: new Date(),
      metadata: { value },
      actions: [], // Would be loaded from configuration
    };

    this.alerts.push(alert);
    console.warn(`Alert fired: ${name}`, alert);
  }

  /**
   * Determine alert severity
   */
  private static determineSeverity(condition: AlertCondition, value: number): AlertSeverity {
    const deviation = Math.abs(value - condition.threshold) / condition.threshold;
    
    if (deviation > 0.5) return 'critical';
    if (deviation > 0.2) return 'warning';
    return 'info';
  }

  /**
   * Evaluate alerts for new metric
   */
  private static evaluateAlerts(metric: Metric): void {
    this.alertRules.forEach((condition, name) => {
      if (condition.metric === metric.name) {
        // Quick evaluation for real-time alerts
        let conditionMet = false;
        switch (condition.operator) {
          case 'gt': conditionMet = metric.value > condition.threshold; break;
          case 'lt': conditionMet = metric.value < condition.threshold; break;
          case 'eq': conditionMet = metric.value === condition.threshold; break;
          case 'ne': conditionMet = metric.value !== condition.threshold; break;
          case 'gte': conditionMet = metric.value >= condition.threshold; break;
          case 'lte': conditionMet = metric.value <= condition.threshold; break;
        }

        if (conditionMet) {
          this.fireAlert(name, condition, metric.value);
        }
      }
    });
  }

  /**
   * Start cleanup tasks
   */
  private static startCleanupTasks(): void {
    setInterval(() => {
      this.cleanupOldData();
    }, 60 * 60 * 1000); // Every hour
  }

  /**
   * Clean up old data
   */
  private static cleanupOldData(): void {
    const now = Date.now();

    // Clean old metrics
    this.metrics = this.metrics.filter(
      m => now - m.timestamp.getTime() < this.config.metricsRetention
    );

    // Clean old traces
    this.traces = this.traces.filter(
      t => now - t.startTime.getTime() < this.config.tracesRetention
    );

    // Clean resolved alerts older than 24 hours
    this.alerts = this.alerts.filter(
      a => a.status !== 'resolved' || 
           (a.resolvedAt && now - a.resolvedAt.getTime() < 24 * 60 * 60 * 1000)
    );
  }

  /**
   * Find trace ID for a span
   */
  private static findTraceId(spanId: string): string {
    const trace = this.activeSpans.get(spanId);
    return trace?.traceId || crypto.randomUUID();
  }

  /**
   * Setup global error handling
   */
  private static setupGlobalErrorHandling(): void {
    // Browser error handling
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.recordMetric('javascript_errors', 1, 'counter', {
          file: event.filename || 'unknown',
          line: String(event.lineno || 0),
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        this.recordMetric('unhandled_promise_rejections', 1, 'counter');
      });
    }

    // Node.js error handling
    if (typeof process !== 'undefined') {
      process.on('uncaughtException', (error) => {
        this.recordMetric('uncaught_exceptions', 1, 'counter', {
          error: error.name,
        });
      });

      process.on('unhandledRejection', (reason) => {
        this.recordMetric('unhandled_promise_rejections', 1, 'counter');
      });
    }
  }

  /**
   * Initialize performance monitoring
   */
  private static initializePerformanceMonitoring(): void {
    // Set up performance observers if available
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          this.recordMetric('performance_entry', entry.duration, 'histogram', {
            type: entry.entryType,
            name: entry.name,
          }, 'ms');
        });
      });

      observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
    }
  }

  /**
   * Analyze performance profile
   */
  private static analyzePerformanceProfile(profile: PerformanceProfile): void {
    // Analyze samples to find hotspots
    const functionStats = new Map<string, {
      totalTime: number;
      callCount: number;
      memoryUsage: number;
    }>();

    profile.samples.forEach(sample => {
      const key = `${sample.functionName}:${sample.fileName}:${sample.lineNumber}`;
      const stats = functionStats.get(key) || { totalTime: 0, callCount: 0, memoryUsage: 0 };
      
      stats.callCount += sample.callCount;
      stats.memoryUsage += sample.memoryUsage;
      functionStats.set(key, stats);
    });

    // Generate hotspots
    const hotspots: Hotspot[] = Array.from(functionStats.entries())
      .map(([key, stats]) => {
        const [functionName] = key.split(':');
        return {
          functionName,
          cpuPercentage: (stats.totalTime / profile.summary.totalCpuTime) * 100,
          memoryPercentage: (stats.memoryUsage / profile.summary.totalMemoryUsage) * 100,
          callCount: stats.callCount,
          averageExecutionTime: stats.totalTime / stats.callCount,
        };
      })
      .sort((a, b) => b.cpuPercentage - a.cpuPercentage)
      .slice(0, 10);

    profile.summary.hotspots = hotspots;

    // Generate recommendations
    const recommendations: string[] = [];
    
    hotspots.forEach(hotspot => {
      if (hotspot.cpuPercentage > 20) {
        recommendations.push(`Consider optimizing ${hotspot.functionName} - using ${hotspot.cpuPercentage.toFixed(1)}% CPU`);
      }
      if (hotspot.memoryPercentage > 15) {
        recommendations.push(`Memory usage in ${hotspot.functionName} is high - ${hotspot.memoryPercentage.toFixed(1)}%`);
      }
    });

    profile.summary.recommendations = recommendations;
  }
}

// Export singleton instance
export const observability = BehemothObservability;
