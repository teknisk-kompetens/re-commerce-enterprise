
/**
 * ADVANCED MONITORING DASHBOARD SYSTEM
 * Real-time metrics, alerting, visualization, and intelligent insights
 */

import { EventEmitter } from 'events';
import { eventBus } from '@/lib/event-bus-system';
import { performance } from 'perf_hooks';

export interface MetricDataPoint {
  timestamp: Date;
  value: number;
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
}

export interface Metric {
  id: string;
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary' | 'rate';
  unit: string;
  description: string;
  labels: string[];
  dataPoints: MetricDataPoint[];
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'rate';
  retention: number; // in seconds
  source: string;
  category: 'system' | 'application' | 'business' | 'security' | 'network' | 'database';
  priority: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  lastUpdated: Date;
}

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  category: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  timeRange: TimeRange;
  refreshInterval: number;
  permissions: DashboardPermission[];
  tags: string[];
  created: Date;
  lastModified: Date;
  owner: string;
  shared: boolean;
  favorite: boolean;
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  grid: boolean;
  responsive: boolean;
  theme: 'light' | 'dark' | 'auto';
  density: 'compact' | 'normal' | 'spacious';
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'table' | 'stat' | 'gauge' | 'heatmap' | 'logs' | 'alert' | 'iframe';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  config: WidgetConfig;
  queries: MetricQuery[];
  alerts: AlertRule[];
  enabled: boolean;
  loading: boolean;
  error?: string;
  lastUpdated: Date;
}

export interface WidgetConfig {
  visualization: {
    type: 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'table' | 'number' | 'gauge';
    options: Record<string, any>;
  };
  data: {
    maxDataPoints: number;
    aggregation: string;
    fillMissing: 'null' | 'previous' | 'zero' | 'interpolate';
  };
  display: {
    showLegend: boolean;
    showTooltip: boolean;
    showGrid: boolean;
    colors: string[];
    thresholds: Threshold[];
  };
  interaction: {
    zoomable: boolean;
    selectable: boolean;
    drilldown: boolean;
  };
}

export interface MetricQuery {
  id: string;
  metric: string;
  filters: Record<string, string>;
  groupBy: string[];
  aggregation: string;
  timeRange: TimeRange;
  step: number;
  alias?: string;
  enabled: boolean;
}

export interface TimeRange {
  from: Date | string;
  to: Date | string;
  relative?: string; // '1h', '24h', '7d', etc.
  timezone?: string;
}

export interface Threshold {
  value: number;
  color: string;
  condition: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  label?: string;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  metric: string;
  condition: AlertCondition;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  frequency: number;
  notifications: NotificationChannel[];
  enabled: boolean;
  muted: boolean;
  lastTriggered?: Date;
  triggerCount: number;
  created: Date;
  lastModified: Date;
}

export interface AlertCondition {
  type: 'threshold' | 'anomaly' | 'change' | 'forecast';
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'between' | 'outside';
  value: number | number[];
  duration: number;
  aggregation: 'avg' | 'sum' | 'min' | 'max' | 'count';
  timeWindow: number;
}

export interface NotificationChannel {
  id: string;
  type: 'email' | 'slack' | 'webhook' | 'pager' | 'sms';
  config: Record<string, any>;
  enabled: boolean;
}

export interface DashboardFilter {
  id: string;
  name: string;
  type: 'dropdown' | 'multiselect' | 'text' | 'date' | 'range';
  options: string[];
  value: any;
  required: boolean;
  enabled: boolean;
}

export interface DashboardPermission {
  user: string;
  role: 'viewer' | 'editor' | 'admin';
  granted: Date;
  grantedBy: string;
}

export interface MonitoringInsight {
  id: string;
  type: 'trend' | 'anomaly' | 'correlation' | 'prediction' | 'recommendation';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  metrics: string[];
  timeRange: TimeRange;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  actionable: boolean;
  recommendations: string[];
  data: any;
  created: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

export interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'critical' | 'unknown';
  score: number;
  components: ComponentHealth[];
  incidents: HealthIncident[];
  sla: SLAStatus;
  lastChecked: Date;
  trends: {
    '1h': number;
    '24h': number;
    '7d': number;
    '30d': number;
  };
}

export interface ComponentHealth {
  name: string;
  status: 'healthy' | 'degraded' | 'critical' | 'unknown';
  score: number;
  metrics: {
    availability: number;
    latency: number;
    errorRate: number;
    throughput: number;
  };
  dependencies: string[];
  lastChecked: Date;
  incidents: number;
}

export interface HealthIncident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'investigating' | 'identified' | 'monitoring' | 'resolved';
  components: string[];
  startTime: Date;
  endTime?: Date;
  duration?: number;
  impact: string;
  rootCause?: string;
  resolution?: string;
  updates: IncidentUpdate[];
}

export interface IncidentUpdate {
  id: string;
  message: string;
  timestamp: Date;
  author: string;
  type: 'update' | 'resolution' | 'escalation';
}

export interface SLAStatus {
  availability: {
    target: number;
    current: number;
    remaining: number;
    trend: 'improving' | 'stable' | 'degrading';
  };
  latency: {
    target: number;
    current: number;
    p95: number;
    p99: number;
    trend: 'improving' | 'stable' | 'degrading';
  };
  errorRate: {
    target: number;
    current: number;
    trend: 'improving' | 'stable' | 'degrading';
  };
  period: 'daily' | 'weekly' | 'monthly';
  lastUpdated: Date;
}

export class AdvancedMonitoringDashboard extends EventEmitter {
  private metrics: Map<string, Metric> = new Map();
  private dashboards: Map<string, Dashboard> = new Map();
  private alertRules: Map<string, AlertRule> = new Map();
  private insights: Map<string, MonitoringInsight> = new Map();
  private systemHealth: SystemHealth;
  private notificationChannels: Map<string, NotificationChannel> = new Map();
  private metricsBuffer: Map<string, MetricDataPoint[]> = new Map();
  private processingInterval: NodeJS.Timeout | null = null;
  private insightGenerationInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.systemHealth = this.initializeSystemHealth();
    this.initializeMonitoringDashboard();
  }

  private async initializeMonitoringDashboard(): Promise<void> {
    await this.setupDefaultMetrics();
    await this.setupDefaultDashboards();
    await this.setupDefaultAlerts();
    await this.setupNotificationChannels();
    await this.startMetricsProcessing();
    await this.startInsightGeneration();
    await this.startHealthChecks();
    console.log('Advanced Monitoring Dashboard initialized');
  }

  private initializeSystemHealth(): SystemHealth {
    return {
      overall: 'healthy',
      score: 100,
      components: [
        {
          name: 'Web Application',
          status: 'healthy',
          score: 100,
          metrics: { availability: 99.9, latency: 120, errorRate: 0.1, throughput: 1500 },
          dependencies: ['Database', 'Cache', 'CDN'],
          lastChecked: new Date(),
          incidents: 0
        },
        {
          name: 'Database',
          status: 'healthy',
          score: 98,
          metrics: { availability: 99.8, latency: 25, errorRate: 0.2, throughput: 2000 },
          dependencies: ['Storage'],
          lastChecked: new Date(),
          incidents: 0
        },
        {
          name: 'Cache',
          status: 'healthy',
          score: 99,
          metrics: { availability: 99.9, latency: 5, errorRate: 0.05, throughput: 5000 },
          dependencies: [],
          lastChecked: new Date(),
          incidents: 0
        }
      ],
      incidents: [],
      sla: {
        availability: { target: 99.9, current: 99.95, remaining: 0.05, trend: 'stable' },
        latency: { target: 200, current: 150, p95: 250, p99: 500, trend: 'improving' },
        errorRate: { target: 1.0, current: 0.2, trend: 'improving' },
        period: 'monthly',
        lastUpdated: new Date()
      },
      lastChecked: new Date(),
      trends: {
        '1h': 100,
        '24h': 99.8,
        '7d': 99.5,
        '30d': 99.2
      }
    };
  }

  /**
   * METRICS MANAGEMENT
   */
  private async setupDefaultMetrics(): Promise<void> {
    const defaultMetrics: Omit<Metric, 'id' | 'dataPoints' | 'lastUpdated'>[] = [
      {
        name: 'system_cpu_usage',
        type: 'gauge',
        unit: '%',
        description: 'CPU usage percentage',
        labels: ['host', 'cpu'],
        aggregation: 'avg',
        retention: 86400,
        source: 'system',
        category: 'system',
        priority: 'high',
        enabled: true
      },
      {
        name: 'system_memory_usage',
        type: 'gauge',
        unit: 'bytes',
        description: 'Memory usage in bytes',
        labels: ['host', 'type'],
        aggregation: 'avg',
        retention: 86400,
        source: 'system',
        category: 'system',
        priority: 'high',
        enabled: true
      },
      {
        name: 'http_requests_total',
        type: 'counter',
        unit: 'requests',
        description: 'Total HTTP requests',
        labels: ['method', 'status', 'endpoint'],
        aggregation: 'sum',
        retention: 86400,
        source: 'application',
        category: 'application',
        priority: 'high',
        enabled: true
      },
      {
        name: 'http_request_duration',
        type: 'histogram',
        unit: 'ms',
        description: 'HTTP request duration',
        labels: ['method', 'endpoint'],
        aggregation: 'avg',
        retention: 86400,
        source: 'application',
        category: 'application',
        priority: 'high',
        enabled: true
      },
      {
        name: 'database_connections',
        type: 'gauge',
        unit: 'connections',
        description: 'Active database connections',
        labels: ['database', 'pool'],
        aggregation: 'sum',
        retention: 86400,
        source: 'database',
        category: 'database',
        priority: 'medium',
        enabled: true
      },
      {
        name: 'business_revenue',
        type: 'counter',
        unit: 'usd',
        description: 'Total revenue generated',
        labels: ['currency', 'region'],
        aggregation: 'sum',
        retention: 604800,
        source: 'business',
        category: 'business',
        priority: 'critical',
        enabled: true
      }
    ];

    for (const metricData of defaultMetrics) {
      const metric: Metric = {
        id: `metric_${metricData.name}`,
        dataPoints: [],
        lastUpdated: new Date(),
        ...metricData
      };
      
      this.metrics.set(metric.id, metric);
    }
  }

  async registerMetric(metric: Omit<Metric, 'id' | 'dataPoints' | 'lastUpdated'>): Promise<string> {
    const metricId = `metric_${metric.name}_${Date.now()}`;
    
    const fullMetric: Metric = {
      id: metricId,
      dataPoints: [],
      lastUpdated: new Date(),
      ...metric
    };

    this.metrics.set(metricId, fullMetric);
    
    eventBus.emit('metric_registered', {
      metricId,
      name: metric.name,
      type: metric.type,
      category: metric.category,
      timestamp: new Date()
    });

    return metricId;
  }

  async recordMetric(metricId: string, value: number, tags?: Record<string, string>): Promise<void> {
    const metric = this.metrics.get(metricId);
    if (!metric || !metric.enabled) return;

    const dataPoint: MetricDataPoint = {
      timestamp: new Date(),
      value,
      tags,
      metadata: {
        source: 'monitoring-dashboard',
        recorded: new Date()
      }
    };

    // Add to buffer first
    const buffer = this.metricsBuffer.get(metricId) || [];
    buffer.push(dataPoint);
    this.metricsBuffer.set(metricId, buffer);

    // Process immediately if buffer is full
    if (buffer.length >= 100) {
      await this.processMetricBuffer(metricId);
    }

    this.emit('metric_recorded', { metricId, value, tags });
  }

  async recordMetricByName(name: string, value: number, tags?: Record<string, string>): Promise<void> {
    const metric = Array.from(this.metrics.values()).find(m => m.name === name);
    if (metric) {
      await this.recordMetric(metric.id, value, tags);
    }
  }

  private async processMetricBuffer(metricId: string): Promise<void> {
    const buffer = this.metricsBuffer.get(metricId);
    if (!buffer || buffer.length === 0) return;

    const metric = this.metrics.get(metricId);
    if (!metric) return;

    // Add buffered data points to metric
    metric.dataPoints.push(...buffer);
    
    // Apply retention policy
    const retentionTime = Date.now() - (metric.retention * 1000);
    metric.dataPoints = metric.dataPoints.filter(dp => dp.timestamp.getTime() > retentionTime);
    
    // Sort by timestamp
    metric.dataPoints.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    metric.lastUpdated = new Date();
    this.metrics.set(metricId, metric);

    // Clear buffer
    this.metricsBuffer.delete(metricId);

    // Check alert rules
    await this.checkAlertRules(metric);
  }

  /**
   * DASHBOARD MANAGEMENT
   */
  private async setupDefaultDashboards(): Promise<void> {
    // System Overview Dashboard
    await this.createDashboard('system-overview', {
      name: 'System Overview',
      description: 'High-level system metrics and health status',
      category: 'system',
      layout: {
        columns: 12,
        rows: 8,
        grid: true,
        responsive: true,
        theme: 'dark',
        density: 'normal'
      },
      widgets: [
        {
          id: 'cpu-usage',
          type: 'chart',
          title: 'CPU Usage',
          position: { x: 0, y: 0, w: 6, h: 3 },
          config: {
            visualization: {
              type: 'line',
              options: { smooth: true, showPoints: false }
            },
            data: {
              maxDataPoints: 100,
              aggregation: 'avg',
              fillMissing: 'interpolate'
            },
            display: {
              showLegend: true,
              showTooltip: true,
              showGrid: true,
              colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
              thresholds: [
                { value: 80, color: '#ff6b6b', condition: 'gt', label: 'High' },
                { value: 60, color: '#feca57', condition: 'gt', label: 'Medium' }
              ]
            },
            interaction: {
              zoomable: true,
              selectable: true,
              drilldown: false
            }
          },
          queries: [
            {
              id: 'cpu-query',
              metric: 'system_cpu_usage',
              filters: {},
              groupBy: ['host'],
              aggregation: 'avg',
              timeRange: { from: '1h', to: 'now' },
              step: 60,
              enabled: true
            }
          ],
          alerts: [],
          enabled: true,
          loading: false,
          lastUpdated: new Date()
        },
        {
          id: 'memory-usage',
          type: 'chart',
          title: 'Memory Usage',
          position: { x: 6, y: 0, w: 6, h: 3 },
          config: {
            visualization: {
              type: 'area',
              options: { stacked: true }
            },
            data: {
              maxDataPoints: 100,
              aggregation: 'avg',
              fillMissing: 'zero'
            },
            display: {
              showLegend: true,
              showTooltip: true,
              showGrid: true,
              colors: ['#a8e6cf', '#7fcdcd', '#81ecec'],
              thresholds: [
                { value: 8589934592, color: '#ff6b6b', condition: 'gt', label: '8GB' } // 8GB in bytes
              ]
            },
            interaction: {
              zoomable: true,
              selectable: true,
              drilldown: false
            }
          },
          queries: [
            {
              id: 'memory-query',
              metric: 'system_memory_usage',
              filters: {},
              groupBy: ['host', 'type'],
              aggregation: 'avg',
              timeRange: { from: '1h', to: 'now' },
              step: 60,
              enabled: true
            }
          ],
          alerts: [],
          enabled: true,
          loading: false,
          lastUpdated: new Date()
        },
        {
          id: 'request-rate',
          type: 'stat',
          title: 'Request Rate',
          position: { x: 0, y: 3, w: 3, h: 2 },
          config: {
            visualization: {
              type: 'number',
              options: { sparkline: true, trend: true }
            },
            data: {
              maxDataPoints: 1,
              aggregation: 'rate',
              fillMissing: 'zero'
            },
            display: {
              showLegend: false,
              showTooltip: false,
              showGrid: false,
              colors: ['#74b9ff'],
              thresholds: [
                { value: 1000, color: '#00b894', condition: 'gt', label: 'High' },
                { value: 500, color: '#fdcb6e', condition: 'gt', label: 'Medium' }
              ]
            },
            interaction: {
              zoomable: false,
              selectable: false,
              drilldown: true
            }
          },
          queries: [
            {
              id: 'request-rate-query',
              metric: 'http_requests_total',
              filters: {},
              groupBy: [],
              aggregation: 'rate',
              timeRange: { from: '5m', to: 'now' },
              step: 60,
              enabled: true
            }
          ],
          alerts: [],
          enabled: true,
          loading: false,
          lastUpdated: new Date()
        },
        {
          id: 'error-rate',
          type: 'gauge',
          title: 'Error Rate',
          position: { x: 3, y: 3, w: 3, h: 2 },
          config: {
            visualization: {
              type: 'gauge',
              options: { min: 0, max: 10, unit: '%' }
            },
            data: {
              maxDataPoints: 1,
              aggregation: 'avg',
              fillMissing: 'zero'
            },
            display: {
              showLegend: false,
              showTooltip: true,
              showGrid: false,
              colors: ['#00b894', '#fdcb6e', '#e17055'],
              thresholds: [
                { value: 5, color: '#e17055', condition: 'gt', label: 'Critical' },
                { value: 2, color: '#fdcb6e', condition: 'gt', label: 'Warning' }
              ]
            },
            interaction: {
              zoomable: false,
              selectable: false,
              drilldown: true
            }
          },
          queries: [
            {
              id: 'error-rate-query',
              metric: 'http_requests_total',
              filters: { status: '5xx' },
              groupBy: [],
              aggregation: 'rate',
              timeRange: { from: '5m', to: 'now' },
              step: 60,
              enabled: true
            }
          ],
          alerts: [],
          enabled: true,
          loading: false,
          lastUpdated: new Date()
        }
      ],
      filters: [
        {
          id: 'time-filter',
          name: 'Time Range',
          type: 'dropdown',
          options: ['1h', '6h', '24h', '7d', '30d'],
          value: '1h',
          required: true,
          enabled: true
        },
        {
          id: 'host-filter',
          name: 'Host',
          type: 'multiselect',
          options: ['host-1', 'host-2', 'host-3'],
          value: [],
          required: false,
          enabled: true
        }
      ],
      timeRange: { from: '1h', to: 'now' },
      refreshInterval: 30000,
      permissions: [],
      tags: ['system', 'overview', 'default'],
      owner: 'system',
      shared: true,
      favorite: false
    });

    // Application Performance Dashboard
    await this.createDashboard('app-performance', {
      name: 'Application Performance',
      description: 'Application-specific performance metrics',
      category: 'application',
      layout: {
        columns: 12,
        rows: 8,
        grid: true,
        responsive: true,
        theme: 'light',
        density: 'normal'
      },
      widgets: [
        {
          id: 'response-time',
          type: 'chart',
          title: 'Response Time',
          position: { x: 0, y: 0, w: 8, h: 4 },
          config: {
            visualization: {
              type: 'line',
              options: { smooth: true, showPoints: true }
            },
            data: {
              maxDataPoints: 200,
              aggregation: 'avg',
              fillMissing: 'interpolate'
            },
            display: {
              showLegend: true,
              showTooltip: true,
              showGrid: true,
              colors: ['#6c5ce7', '#a29bfe', '#fd79a8'],
              thresholds: [
                { value: 500, color: '#e84393', condition: 'gt', label: 'Slow' },
                { value: 200, color: '#fdcb6e', condition: 'gt', label: 'Medium' }
              ]
            },
            interaction: {
              zoomable: true,
              selectable: true,
              drilldown: true
            }
          },
          queries: [
            {
              id: 'response-time-query',
              metric: 'http_request_duration',
              filters: {},
              groupBy: ['endpoint'],
              aggregation: 'avg',
              timeRange: { from: '1h', to: 'now' },
              step: 60,
              enabled: true
            }
          ],
          alerts: [],
          enabled: true,
          loading: false,
          lastUpdated: new Date()
        },
        {
          id: 'throughput',
          type: 'chart',
          title: 'Request Throughput',
          position: { x: 8, y: 0, w: 4, h: 4 },
          config: {
            visualization: {
              type: 'bar',
              options: { horizontal: false }
            },
            data: {
              maxDataPoints: 50,
              aggregation: 'rate',
              fillMissing: 'zero'
            },
            display: {
              showLegend: true,
              showTooltip: true,
              showGrid: true,
              colors: ['#00b894', '#00cec9', '#55efc4'],
              thresholds: []
            },
            interaction: {
              zoomable: true,
              selectable: true,
              drilldown: true
            }
          },
          queries: [
            {
              id: 'throughput-query',
              metric: 'http_requests_total',
              filters: {},
              groupBy: ['endpoint'],
              aggregation: 'rate',
              timeRange: { from: '1h', to: 'now' },
              step: 300,
              enabled: true
            }
          ],
          alerts: [],
          enabled: true,
          loading: false,
          lastUpdated: new Date()
        }
      ],
      filters: [],
      timeRange: { from: '1h', to: 'now' },
      refreshInterval: 30000,
      permissions: [],
      tags: ['application', 'performance'],
      owner: 'system',
      shared: true,
      favorite: false
    });

    // Business Metrics Dashboard
    await this.createDashboard('business-metrics', {
      name: 'Business Metrics',
      description: 'Key business performance indicators',
      category: 'business',
      layout: {
        columns: 12,
        rows: 6,
        grid: true,
        responsive: true,
        theme: 'auto',
        density: 'spacious'
      },
      widgets: [
        {
          id: 'revenue',
          type: 'stat',
          title: 'Total Revenue',
          position: { x: 0, y: 0, w: 4, h: 2 },
          config: {
            visualization: {
              type: 'number',
              options: { format: 'currency', sparkline: true }
            },
            data: {
              maxDataPoints: 1,
              aggregation: 'sum',
              fillMissing: 'zero'
            },
            display: {
              showLegend: false,
              showTooltip: false,
              showGrid: false,
              colors: ['#00b894'],
              thresholds: [
                { value: 1000000, color: '#00b894', condition: 'gt', label: 'Target' }
              ]
            },
            interaction: {
              zoomable: false,
              selectable: false,
              drilldown: true
            }
          },
          queries: [
            {
              id: 'revenue-query',
              metric: 'business_revenue',
              filters: {},
              groupBy: [],
              aggregation: 'sum',
              timeRange: { from: '24h', to: 'now' },
              step: 3600,
              enabled: true
            }
          ],
          alerts: [],
          enabled: true,
          loading: false,
          lastUpdated: new Date()
        }
      ],
      filters: [],
      timeRange: { from: '24h', to: 'now' },
      refreshInterval: 300000,
      permissions: [],
      tags: ['business', 'revenue', 'kpi'],
      owner: 'system',
      shared: true,
      favorite: false
    });
  }

  async createDashboard(id: string, dashboard: Omit<Dashboard, 'id' | 'created' | 'lastModified'>): Promise<void> {
    const fullDashboard: Dashboard = {
      id,
      created: new Date(),
      lastModified: new Date(),
      ...dashboard
    };

    this.dashboards.set(id, fullDashboard);
    
    eventBus.emit('dashboard_created', {
      dashboardId: id,
      name: dashboard.name,
      category: dashboard.category,
      widgetCount: dashboard.widgets.length,
      timestamp: new Date()
    });
  }

  async updateDashboard(id: string, updates: Partial<Dashboard>): Promise<void> {
    const dashboard = this.dashboards.get(id);
    if (!dashboard) {
      throw new Error(`Dashboard ${id} not found`);
    }

    const updatedDashboard = {
      ...dashboard,
      ...updates,
      lastModified: new Date()
    };

    this.dashboards.set(id, updatedDashboard);
    
    eventBus.emit('dashboard_updated', {
      dashboardId: id,
      updates: Object.keys(updates),
      timestamp: new Date()
    });
  }

  async deleteDashboard(id: string): Promise<void> {
    const dashboard = this.dashboards.get(id);
    if (!dashboard) {
      throw new Error(`Dashboard ${id} not found`);
    }

    this.dashboards.delete(id);
    
    eventBus.emit('dashboard_deleted', {
      dashboardId: id,
      name: dashboard.name,
      timestamp: new Date()
    });
  }

  /**
   * ALERT MANAGEMENT
   */
  private async setupDefaultAlerts(): Promise<void> {
    // High CPU usage alert
    await this.createAlertRule('high-cpu', {
      name: 'High CPU Usage',
      description: 'CPU usage is above 80% for more than 5 minutes',
      metric: 'system_cpu_usage',
      condition: {
        type: 'threshold',
        operator: 'gt',
        value: 80,
        duration: 300,
        aggregation: 'avg',
        timeWindow: 300
      },
      threshold: 80,
      severity: 'high',
      frequency: 60,
      notifications: [],
      enabled: true,
      muted: false,
      triggerCount: 0,
      created: new Date(),
      lastModified: new Date()
    });

    // High memory usage alert
    await this.createAlertRule('high-memory', {
      name: 'High Memory Usage',
      description: 'Memory usage is above 85% for more than 3 minutes',
      metric: 'system_memory_usage',
      condition: {
        type: 'threshold',
        operator: 'gt',
        value: 85,
        duration: 180,
        aggregation: 'avg',
        timeWindow: 180
      },
      threshold: 85,
      severity: 'high',
      frequency: 60,
      notifications: [],
      enabled: true,
      muted: false,
      triggerCount: 0,
      created: new Date(),
      lastModified: new Date()
    });

    // High error rate alert
    await this.createAlertRule('high-error-rate', {
      name: 'High Error Rate',
      description: 'Error rate is above 5% for more than 2 minutes',
      metric: 'http_requests_total',
      condition: {
        type: 'threshold',
        operator: 'gt',
        value: 5,
        duration: 120,
        aggregation: 'avg',
        timeWindow: 120
      },
      threshold: 5,
      severity: 'critical',
      frequency: 30,
      notifications: [],
      enabled: true,
      muted: false,
      triggerCount: 0,
      created: new Date(),
      lastModified: new Date()
    });
  }

  async createAlertRule(id: string, rule: Omit<AlertRule, 'id'>): Promise<void> {
    const alertRule: AlertRule = {
      id,
      ...rule
    };

    this.alertRules.set(id, alertRule);
    
    eventBus.emit('alert_rule_created', {
      alertId: id,
      name: rule.name,
      metric: rule.metric,
      severity: rule.severity,
      timestamp: new Date()
    });
  }

  private async checkAlertRules(metric: Metric): Promise<void> {
    for (const [alertId, rule] of this.alertRules) {
      if (!rule.enabled || rule.muted) continue;
      
      // Check if this alert applies to this metric
      if (rule.metric !== metric.name) continue;

      const shouldTrigger = await this.evaluateAlertCondition(rule, metric);
      
      if (shouldTrigger) {
        await this.triggerAlert(alertId, rule, metric);
      }
    }
  }

  private async evaluateAlertCondition(rule: AlertRule, metric: Metric): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - (rule.condition.timeWindow * 1000);
    
    // Get data points in the time window
    const windowData = metric.dataPoints.filter(dp => 
      dp.timestamp.getTime() >= windowStart && dp.timestamp.getTime() <= now
    );

    if (windowData.length === 0) return false;

    // Calculate aggregated value
    let aggregatedValue: number;
    switch (rule.condition.aggregation) {
      case 'avg':
        aggregatedValue = windowData.reduce((sum, dp) => sum + dp.value, 0) / windowData.length;
        break;
      case 'sum':
        aggregatedValue = windowData.reduce((sum, dp) => sum + dp.value, 0);
        break;
      case 'min':
        aggregatedValue = Math.min(...windowData.map(dp => dp.value));
        break;
      case 'max':
        aggregatedValue = Math.max(...windowData.map(dp => dp.value));
        break;
      case 'count':
        aggregatedValue = windowData.length;
        break;
      default:
        aggregatedValue = windowData[windowData.length - 1].value;
    }

    // Evaluate condition
    switch (rule.condition.operator) {
      case 'gt':
        return aggregatedValue > (Array.isArray(rule.condition.value) ? rule.condition.value[0] : rule.condition.value);
      case 'lt':
        return aggregatedValue < (Array.isArray(rule.condition.value) ? rule.condition.value[0] : rule.condition.value);
      case 'eq':
        return aggregatedValue === (Array.isArray(rule.condition.value) ? rule.condition.value[0] : rule.condition.value);
      case 'gte':
        return aggregatedValue >= (Array.isArray(rule.condition.value) ? rule.condition.value[0] : rule.condition.value);
      case 'lte':
        return aggregatedValue <= (Array.isArray(rule.condition.value) ? rule.condition.value[0] : rule.condition.value);
      case 'between':
        const [min, max] = Array.isArray(rule.condition.value) ? rule.condition.value : [0, rule.condition.value];
        return aggregatedValue >= min && aggregatedValue <= max;
      case 'outside':
        const [minOut, maxOut] = Array.isArray(rule.condition.value) ? rule.condition.value : [0, rule.condition.value];
        return aggregatedValue < minOut || aggregatedValue > maxOut;
      default:
        return false;
    }
  }

  private async triggerAlert(alertId: string, rule: AlertRule, metric: Metric): Promise<void> {
    const now = new Date();
    
    // Check if alert was recently triggered (respect frequency)
    if (rule.lastTriggered && (now.getTime() - rule.lastTriggered.getTime()) < (rule.frequency * 1000)) {
      return;
    }

    // Update rule
    rule.lastTriggered = now;
    rule.triggerCount++;
    this.alertRules.set(alertId, rule);

    // Send notifications
    for (const channel of rule.notifications) {
      await this.sendNotification(channel, rule, metric);
    }

    // Emit alert event
    eventBus.emit('alert_triggered', {
      alertId,
      name: rule.name,
      metric: metric.name,
      severity: rule.severity,
      timestamp: now
    });

    this.emit('alert_triggered', {
      alertId,
      rule,
      metric,
      timestamp: now
    });
  }

  private async sendNotification(channel: NotificationChannel, rule: AlertRule, metric: Metric): Promise<void> {
    if (!channel.enabled) return;

    try {
      // Mock notification sending
      console.log(`Sending ${channel.type} notification for alert: ${rule.name}`);
      
      // In production, this would integrate with actual notification services
      switch (channel.type) {
        case 'email':
          // Send email notification
          break;
        case 'slack':
          // Send Slack notification
          break;
        case 'webhook':
          // Send webhook notification
          break;
        case 'pager':
          // Send pager notification
          break;
        case 'sms':
          // Send SMS notification
          break;
      }
    } catch (error) {
      console.error(`Failed to send notification via ${channel.type}:`, error);
    }
  }

  /**
   * NOTIFICATION CHANNELS
   */
  private async setupNotificationChannels(): Promise<void> {
    // Email notification
    await this.createNotificationChannel('email-alerts', {
      type: 'email',
      config: {
        smtp: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'alerts@behemoth.ai',
            pass: 'alert-password'
          }
        },
        from: 'alerts@behemoth.ai',
        to: ['admin@behemoth.ai', 'devops@behemoth.ai']
      },
      enabled: true
    });

    // Slack notification
    await this.createNotificationChannel('slack-alerts', {
      type: 'slack',
      config: {
        webhook: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
        channel: '#alerts',
        username: 'Behemoth Alerts',
        iconEmoji: ':warning:'
      },
      enabled: true
    });

    // Webhook notification
    await this.createNotificationChannel('webhook-alerts', {
      type: 'webhook',
      config: {
        url: 'https://api.behemoth.ai/alerts/webhook',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer webhook-token'
        }
      },
      enabled: true
    });
  }

  async createNotificationChannel(id: string, channel: Omit<NotificationChannel, 'id'>): Promise<void> {
    const notificationChannel: NotificationChannel = {
      id,
      ...channel
    };

    this.notificationChannels.set(id, notificationChannel);
    
    eventBus.emit('notification_channel_created', {
      channelId: id,
      type: channel.type,
      timestamp: new Date()
    });
  }

  /**
   * METRICS PROCESSING
   */
  private async startMetricsProcessing(): Promise<void> {
    this.processingInterval = setInterval(() => {
      this.processAllMetricBuffers();
    }, 30000); // Process every 30 seconds
  }

  private async processAllMetricBuffers(): Promise<void> {
    try {
      for (const metricId of this.metricsBuffer.keys()) {
        await this.processMetricBuffer(metricId);
      }
    } catch (error) {
      console.error('Metrics processing error:', error);
    }
  }

  /**
   * INSIGHT GENERATION
   */
  private async startInsightGeneration(): Promise<void> {
    this.insightGenerationInterval = setInterval(() => {
      this.generateInsights();
    }, 300000); // Generate insights every 5 minutes
  }

  private async generateInsights(): Promise<void> {
    try {
      // Generate trend insights
      await this.generateTrendInsights();
      
      // Generate anomaly insights
      await this.generateAnomalyInsights();
      
      // Generate correlation insights
      await this.generateCorrelationInsights();
      
      // Generate recommendation insights
      await this.generateRecommendationInsights();
    } catch (error) {
      console.error('Insight generation error:', error);
    }
  }

  private async generateTrendInsights(): Promise<void> {
    for (const metric of this.metrics.values()) {
      if (metric.dataPoints.length < 10) continue;

      const trend = this.calculateTrend(metric.dataPoints);
      
      if (Math.abs(trend.slope) > 0.1) {
        const insight: MonitoringInsight = {
          id: `trend_${metric.id}_${Date.now()}`,
          type: 'trend',
          title: `${metric.name} Trend Detected`,
          description: `${metric.name} is ${trend.direction} with a slope of ${trend.slope.toFixed(2)}`,
          severity: Math.abs(trend.slope) > 0.5 ? 'warning' : 'info',
          metrics: [metric.name],
          timeRange: { from: '1h', to: 'now' },
          confidence: trend.confidence,
          impact: Math.abs(trend.slope) > 0.5 ? 'medium' : 'low',
          actionable: true,
          recommendations: this.generateTrendRecommendations(metric, trend),
          data: { trend },
          created: new Date(),
          acknowledged: false
        };

        this.insights.set(insight.id, insight);
        
        eventBus.emit('insight_generated', {
          insightId: insight.id,
          type: insight.type,
          severity: insight.severity,
          timestamp: new Date()
        });
      }
    }
  }

  private calculateTrend(dataPoints: MetricDataPoint[]): { slope: number; direction: string; confidence: number } {
    if (dataPoints.length < 2) return { slope: 0, direction: 'stable', confidence: 0 };

    const n = dataPoints.length;
    const x = dataPoints.map((_, i) => i);
    const y = dataPoints.map(dp => dp.value);

    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumXX = x.reduce((sum, val) => sum + val * val, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const direction = slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable';
    const confidence = Math.min(Math.abs(slope) * 100, 100);

    return { slope, direction, confidence };
  }

  private generateTrendRecommendations(metric: Metric, trend: any): string[] {
    const recommendations: string[] = [];

    if (trend.direction === 'increasing' && metric.category === 'system') {
      recommendations.push('Consider scaling up resources');
      recommendations.push('Investigate potential performance bottlenecks');
    } else if (trend.direction === 'decreasing' && metric.category === 'business') {
      recommendations.push('Review recent changes that might impact business metrics');
      recommendations.push('Consider promotional campaigns to boost performance');
    }

    return recommendations;
  }

  private async generateAnomalyInsights(): Promise<void> {
    // Simple anomaly detection based on standard deviation
    for (const metric of this.metrics.values()) {
      if (metric.dataPoints.length < 20) continue;

      const recent = metric.dataPoints.slice(-10);
      const historical = metric.dataPoints.slice(-50, -10);
      
      const historicalMean = historical.reduce((sum, dp) => sum + dp.value, 0) / historical.length;
      const historicalStd = Math.sqrt(
        historical.reduce((sum, dp) => sum + Math.pow(dp.value - historicalMean, 2), 0) / historical.length
      );

      const anomalies = recent.filter(dp => 
        Math.abs(dp.value - historicalMean) > 2 * historicalStd
      );

      if (anomalies.length > 0) {
        const insight: MonitoringInsight = {
          id: `anomaly_${metric.id}_${Date.now()}`,
          type: 'anomaly',
          title: `${metric.name} Anomaly Detected`,
          description: `${anomalies.length} anomalous values detected in ${metric.name}`,
          severity: anomalies.length > 3 ? 'error' : 'warning',
          metrics: [metric.name],
          timeRange: { from: '10m', to: 'now' },
          confidence: Math.min(anomalies.length * 20, 100),
          impact: anomalies.length > 3 ? 'high' : 'medium',
          actionable: true,
          recommendations: [
            'Investigate recent changes or deployments',
            'Check for external factors affecting the system',
            'Review logs for error patterns'
          ],
          data: { anomalies, historicalMean, historicalStd },
          created: new Date(),
          acknowledged: false
        };

        this.insights.set(insight.id, insight);
        
        eventBus.emit('insight_generated', {
          insightId: insight.id,
          type: insight.type,
          severity: insight.severity,
          timestamp: new Date()
        });
      }
    }
  }

  private async generateCorrelationInsights(): Promise<void> {
    // Simple correlation analysis between metrics
    const metricPairs = this.getMetricPairs();
    
    for (const [metric1, metric2] of metricPairs) {
      if (metric1.dataPoints.length < 10 || metric2.dataPoints.length < 10) continue;

      const correlation = this.calculateCorrelation(metric1, metric2);
      
      if (Math.abs(correlation) > 0.7) {
        const insight: MonitoringInsight = {
          id: `correlation_${metric1.id}_${metric2.id}_${Date.now()}`,
          type: 'correlation',
          title: `Correlation between ${metric1.name} and ${metric2.name}`,
          description: `Strong ${correlation > 0 ? 'positive' : 'negative'} correlation (${correlation.toFixed(2)}) detected`,
          severity: 'info',
          metrics: [metric1.name, metric2.name],
          timeRange: { from: '1h', to: 'now' },
          confidence: Math.abs(correlation) * 100,
          impact: 'medium',
          actionable: true,
          recommendations: [
            'Consider this correlation when making capacity planning decisions',
            'Monitor both metrics together for better insights',
            'Investigate the underlying relationship between these metrics'
          ],
          data: { correlation, metric1: metric1.name, metric2: metric2.name },
          created: new Date(),
          acknowledged: false
        };

        this.insights.set(insight.id, insight);
      }
    }
  }

  private getMetricPairs(): Array<[Metric, Metric]> {
    const metrics = Array.from(this.metrics.values());
    const pairs: Array<[Metric, Metric]> = [];
    
    for (let i = 0; i < metrics.length; i++) {
      for (let j = i + 1; j < metrics.length; j++) {
        pairs.push([metrics[i], metrics[j]]);
      }
    }
    
    return pairs;
  }

  private calculateCorrelation(metric1: Metric, metric2: Metric): number {
    const minLength = Math.min(metric1.dataPoints.length, metric2.dataPoints.length);
    const data1 = metric1.dataPoints.slice(-minLength).map(dp => dp.value);
    const data2 = metric2.dataPoints.slice(-minLength).map(dp => dp.value);
    
    const mean1 = data1.reduce((sum, val) => sum + val, 0) / data1.length;
    const mean2 = data2.reduce((sum, val) => sum + val, 0) / data2.length;
    
    const numerator = data1.reduce((sum, val, i) => sum + (val - mean1) * (data2[i] - mean2), 0);
    const denominator = Math.sqrt(
      data1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) *
      data2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0)
    );
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private async generateRecommendationInsights(): Promise<void> {
    // Generate actionable recommendations based on current metrics
    const recommendations = await this.analyzeSystemForRecommendations();
    
    for (const recommendation of recommendations) {
      const insight: MonitoringInsight = {
        id: `recommendation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'recommendation',
        title: recommendation.title,
        description: recommendation.description,
        severity: 'info',
        metrics: recommendation.metrics,
        timeRange: { from: '1h', to: 'now' },
        confidence: recommendation.confidence,
        impact: recommendation.impact,
        actionable: true,
        recommendations: recommendation.actions,
        data: recommendation.data,
        created: new Date(),
        acknowledged: false
      };

      this.insights.set(insight.id, insight);
    }
  }

  private async analyzeSystemForRecommendations(): Promise<Array<{
    title: string;
    description: string;
    metrics: string[];
    confidence: number;
    impact: 'low' | 'medium' | 'high' | 'critical';
    actions: string[];
    data: any;
  }>> {
    const recommendations = [];

    // Check for resource utilization recommendations
    const cpuMetric = Array.from(this.metrics.values()).find(m => m.name === 'system_cpu_usage');
    if (cpuMetric && cpuMetric.dataPoints.length > 0) {
      const avgCpu = cpuMetric.dataPoints.slice(-10).reduce((sum, dp) => sum + dp.value, 0) / 10;
      
      if (avgCpu > 80) {
        recommendations.push({
          title: 'High CPU Usage Detected',
          description: 'System is running at high CPU utilization',
          metrics: ['system_cpu_usage'],
          confidence: 90,
          impact: 'high' as const,
          actions: [
            'Consider scaling up CPU resources',
            'Optimize application performance',
            'Review recent deployments for performance regressions'
          ],
          data: { avgCpu }
        });
      } else if (avgCpu < 20) {
        recommendations.push({
          title: 'Low CPU Usage Detected',
          description: 'System resources may be over-provisioned',
          metrics: ['system_cpu_usage'],
          confidence: 75,
          impact: 'medium' as const,
          actions: [
            'Consider scaling down CPU resources to reduce costs',
            'Evaluate if resources can be better utilized',
            'Review resource allocation strategy'
          ],
          data: { avgCpu }
        });
      }
    }

    return recommendations;
  }

  /**
   * HEALTH CHECKS
   */
  private async startHealthChecks(): Promise<void> {
    // Check system health every 30 seconds
    setInterval(() => {
      this.updateSystemHealth();
    }, 30000);
  }

  private async updateSystemHealth(): Promise<void> {
    try {
      let totalScore = 0;
      let componentCount = 0;

      for (const component of this.systemHealth.components) {
        const health = await this.checkComponentHealth(component);
        component.status = health.status;
        component.score = health.score;
        component.metrics = health.metrics;
        component.lastChecked = new Date();
        
        totalScore += health.score;
        componentCount++;
      }

      // Calculate overall health
      this.systemHealth.score = componentCount > 0 ? totalScore / componentCount : 0;
      
      if (this.systemHealth.score >= 95) {
        this.systemHealth.overall = 'healthy';
      } else if (this.systemHealth.score >= 80) {
        this.systemHealth.overall = 'degraded';
      } else {
        this.systemHealth.overall = 'critical';
      }

      this.systemHealth.lastChecked = new Date();
      
      // Update trends
      this.updateHealthTrends();
      
      // Update SLA status
      await this.updateSLAStatus();
      
      eventBus.emit('system_health_updated', {
        overall: this.systemHealth.overall,
        score: this.systemHealth.score,
        componentCount,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Health check error:', error);
    }
  }

  private async checkComponentHealth(component: ComponentHealth): Promise<{
    status: ComponentHealth['status'];
    score: number;
    metrics: ComponentHealth['metrics'];
  }> {
    // Mock health check - in production this would perform actual health checks
    const baseScore = 95 + (Math.random() * 10 - 5); // 90-100 range
    const score = Math.max(0, Math.min(100, baseScore));
    
    let status: ComponentHealth['status'] = 'healthy';
    if (score < 70) {
      status = 'critical';
    } else if (score < 85) {
      status = 'degraded';
    }

    const metrics: ComponentHealth['metrics'] = {
      availability: Math.max(90, score + Math.random() * 5),
      latency: Math.max(1, 50 + Math.random() * 100),
      errorRate: Math.max(0, (100 - score) / 50 + Math.random() * 0.5),
      throughput: Math.max(100, 1000 + Math.random() * 2000)
    };

    return { status, score, metrics };
  }

  private updateHealthTrends(): void {
    // Update health trends
    this.systemHealth.trends['30d'] = this.systemHealth.trends['7d'];
    this.systemHealth.trends['7d'] = this.systemHealth.trends['24h'];
    this.systemHealth.trends['24h'] = this.systemHealth.trends['1h'];
    this.systemHealth.trends['1h'] = this.systemHealth.score;
  }

  private async updateSLAStatus(): Promise<void> {
    // Update SLA metrics based on current system state
    const sla = this.systemHealth.sla;
    
    // Calculate availability from component health
    const avgAvailability = this.systemHealth.components.reduce(
      (sum, comp) => sum + comp.metrics.availability, 0
    ) / this.systemHealth.components.length;
    
    sla.availability.current = avgAvailability;
    sla.availability.remaining = Math.max(0, sla.availability.target - avgAvailability);
    sla.availability.trend = avgAvailability > 99.5 ? 'improving' : avgAvailability < 99.0 ? 'degrading' : 'stable';
    
    // Calculate latency from component health
    const avgLatency = this.systemHealth.components.reduce(
      (sum, comp) => sum + comp.metrics.latency, 0
    ) / this.systemHealth.components.length;
    
    sla.latency.current = avgLatency;
    sla.latency.p95 = avgLatency * 1.5;
    sla.latency.p99 = avgLatency * 2.5;
    sla.latency.trend = avgLatency < 100 ? 'improving' : avgLatency > 300 ? 'degrading' : 'stable';
    
    // Calculate error rate from component health
    const avgErrorRate = this.systemHealth.components.reduce(
      (sum, comp) => sum + comp.metrics.errorRate, 0
    ) / this.systemHealth.components.length;
    
    sla.errorRate.current = avgErrorRate;
    sla.errorRate.trend = avgErrorRate < 0.5 ? 'improving' : avgErrorRate > 2.0 ? 'degrading' : 'stable';
    
    sla.lastUpdated = new Date();
  }

  /**
   * PUBLIC API
   */
  getMetric(id: string): Metric | undefined {
    return this.metrics.get(id);
  }

  getMetricByName(name: string): Metric | undefined {
    return Array.from(this.metrics.values()).find(m => m.name === name);
  }

  getAllMetrics(): Metric[] {
    return Array.from(this.metrics.values());
  }

  getDashboard(id: string): Dashboard | undefined {
    return this.dashboards.get(id);
  }

  getAllDashboards(): Dashboard[] {
    return Array.from(this.dashboards.values());
  }

  getDashboardsByCategory(category: string): Dashboard[] {
    return Array.from(this.dashboards.values()).filter(d => d.category === category);
  }

  getAlertRule(id: string): AlertRule | undefined {
    return this.alertRules.get(id);
  }

  getAllAlertRules(): AlertRule[] {
    return Array.from(this.alertRules.values());
  }

  getActiveAlerts(): AlertRule[] {
    return Array.from(this.alertRules.values()).filter(r => r.enabled && !r.muted);
  }

  getInsight(id: string): MonitoringInsight | undefined {
    return this.insights.get(id);
  }

  getAllInsights(): MonitoringInsight[] {
    return Array.from(this.insights.values());
  }

  getInsightsByType(type: MonitoringInsight['type']): MonitoringInsight[] {
    return Array.from(this.insights.values()).filter(i => i.type === type);
  }

  getSystemHealth(): SystemHealth {
    return { ...this.systemHealth };
  }

  getNotificationChannel(id: string): NotificationChannel | undefined {
    return this.notificationChannels.get(id);
  }

  getAllNotificationChannels(): NotificationChannel[] {
    return Array.from(this.notificationChannels.values());
  }

  async acknowledgeInsight(insightId: string, acknowledgedBy: string): Promise<void> {
    const insight = this.insights.get(insightId);
    if (!insight) return;

    insight.acknowledged = true;
    insight.acknowledgedBy = acknowledgedBy;
    insight.acknowledgedAt = new Date();

    this.insights.set(insightId, insight);
    
    eventBus.emit('insight_acknowledged', {
      insightId,
      acknowledgedBy,
      timestamp: new Date()
    });
  }

  async muteAlertRule(ruleId: string, duration?: number): Promise<void> {
    const rule = this.alertRules.get(ruleId);
    if (!rule) return;

    rule.muted = true;
    
    if (duration) {
      setTimeout(() => {
        rule.muted = false;
        this.alertRules.set(ruleId, rule);
        
        eventBus.emit('alert_rule_unmuted', {
          ruleId,
          timestamp: new Date()
        });
      }, duration);
    }

    this.alertRules.set(ruleId, rule);
    
    eventBus.emit('alert_rule_muted', {
      ruleId,
      duration,
      timestamp: new Date()
    });
  }

  async queryMetrics(
    metricName: string,
    timeRange: TimeRange,
    aggregation: 'avg' | 'sum' | 'min' | 'max' | 'count' = 'avg',
    groupBy: string[] = [],
    filters: Record<string, string> = {}
  ): Promise<MetricDataPoint[]> {
    const metric = this.getMetricByName(metricName);
    if (!metric) return [];

    let dataPoints = metric.dataPoints;

    // Apply time range filter
    if (timeRange.from && timeRange.to) {
      const from = typeof timeRange.from === 'string' ? new Date(timeRange.from) : timeRange.from;
      const to = typeof timeRange.to === 'string' ? new Date(timeRange.to) : timeRange.to;
      
      dataPoints = dataPoints.filter(dp => 
        dp.timestamp >= from && dp.timestamp <= to
      );
    }

    // Apply tag filters
    if (Object.keys(filters).length > 0) {
      dataPoints = dataPoints.filter(dp => {
        if (!dp.tags) return false;
        
        return Object.entries(filters).every(([key, value]) => 
          dp.tags![key] === value
        );
      });
    }

    // Apply grouping and aggregation
    if (groupBy.length > 0) {
      // Group by tags and apply aggregation
      const groups = new Map<string, MetricDataPoint[]>();
      
      for (const dp of dataPoints) {
        const groupKey = groupBy.map(tag => dp.tags?.[tag] || 'unknown').join('|');
        
        if (!groups.has(groupKey)) {
          groups.set(groupKey, []);
        }
        
        groups.get(groupKey)!.push(dp);
      }

      // Apply aggregation within each group
      const result: MetricDataPoint[] = [];
      
      for (const [groupKey, groupData] of groups) {
        const groupTags = groupBy.reduce((tags, tag, index) => {
          tags[tag] = groupKey.split('|')[index];
          return tags;
        }, {} as Record<string, string>);

        let aggregatedValue: number;
        switch (aggregation) {
          case 'avg':
            aggregatedValue = groupData.reduce((sum, dp) => sum + dp.value, 0) / groupData.length;
            break;
          case 'sum':
            aggregatedValue = groupData.reduce((sum, dp) => sum + dp.value, 0);
            break;
          case 'min':
            aggregatedValue = Math.min(...groupData.map(dp => dp.value));
            break;
          case 'max':
            aggregatedValue = Math.max(...groupData.map(dp => dp.value));
            break;
          case 'count':
            aggregatedValue = groupData.length;
            break;
        }

        result.push({
          timestamp: new Date(), // Use current timestamp for aggregated result
          value: aggregatedValue,
          tags: groupTags,
          metadata: { aggregation, groupBy, originalCount: groupData.length }
        });
      }

      return result;
    }

    return dataPoints;
  }

  async generateReport(
    dashboardId: string,
    timeRange: TimeRange,
    format: 'json' | 'pdf' | 'csv' = 'json'
  ): Promise<{
    dashboard: Dashboard;
    data: any;
    format: string;
    generated: Date;
  }> {
    const dashboard = this.getDashboard(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard ${dashboardId} not found`);
    }

    const reportData: any = {
      dashboard: {
        id: dashboard.id,
        name: dashboard.name,
        description: dashboard.description,
        category: dashboard.category
      },
      timeRange,
      widgets: []
    };

    // Generate data for each widget
    for (const widget of dashboard.widgets) {
      const widgetData = {
        id: widget.id,
        title: widget.title,
        type: widget.type,
        queries: []
      };

      // Execute queries for this widget
      for (const query of widget.queries) {
        if (!query.enabled) continue;

        const data = await this.queryMetrics(
          query.metric,
          timeRange,
          query.aggregation as any,
          query.groupBy,
          query.filters
        );

        (widgetData.queries as any[]).push({
          id: query.id,
          metric: query.metric,
          data,
          aggregation: query.aggregation,
          groupBy: query.groupBy,
          filters: query.filters
        });
      }

      reportData.widgets.push(widgetData);
    }

    return {
      dashboard,
      data: reportData,
      format,
      generated: new Date()
    };
  }

  // Cleanup method
  async cleanup(): Promise<void> {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }
    
    if (this.insightGenerationInterval) {
      clearInterval(this.insightGenerationInterval);
    }
    
    console.log('Advanced Monitoring Dashboard cleaned up');
  }
}

// Export singleton instance
export const advancedMonitoringDashboard = new AdvancedMonitoringDashboard();
