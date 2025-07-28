
/**
 * PRODUCTION MONITORING DASHBOARD
 * Performance dashboards, alerting, capacity planning, and regression testing
 */

import { EventEmitter } from 'events';
import { eventBus } from '@/lib/event-bus-system';
import { performance } from 'perf_hooks';

export interface MonitoringDashboard {
  id: string;
  name: string;
  type: 'performance' | 'infrastructure' | 'application' | 'business' | 'security';
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  permissions: string[];
  refreshInterval: number;
  enabled: boolean;
  createdAt: Date;
  lastUpdated: Date;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'alert' | 'table' | 'text' | 'gauge' | 'heatmap';
  title: string;
  description: string;
  position: WidgetPosition;
  size: WidgetSize;
  dataSource: DataSource;
  config: WidgetConfig;
  thresholds: WidgetThreshold[];
  enabled: boolean;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetSize {
  width: number;
  height: number;
}

export interface DataSource {
  type: 'metrics' | 'logs' | 'traces' | 'events' | 'custom';
  query: string;
  timeRange: TimeRange;
  refreshInterval: number;
  aggregation: 'avg' | 'sum' | 'min' | 'max' | 'count' | 'rate';
  filters: Record<string, any>;
}

export interface TimeRange {
  from: string;
  to: string;
  relative: boolean;
}

export interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'pie' | 'scatter' | 'area';
  colors?: string[];
  legend?: boolean;
  gridlines?: boolean;
  animations?: boolean;
  tooltip?: boolean;
  zoom?: boolean;
  pan?: boolean;
  customOptions?: Record<string, any>;
}

export interface WidgetThreshold {
  value: number;
  color: string;
  label: string;
  type: 'warning' | 'critical' | 'info';
}

export interface DashboardLayout {
  columns: number;
  rows: number;
  gridSize: number;
  responsive: boolean;
  breakpoints: Record<string, number>;
}

export interface AlertRule {
  id: string;
  name: string;
  description: string;
  condition: AlertCondition;
  severity: 'low' | 'medium' | 'high' | 'critical';
  frequency: number;
  enabled: boolean;
  notifications: AlertNotification[];
  suppressionRules: SuppressionRule[];
  escalationRules: EscalationRule[];
  createdAt: Date;
  lastTriggered?: Date;
}

export interface AlertCondition {
  query: string;
  threshold: number;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'ne';
  timeWindow: number;
  evaluationInterval: number;
  dataSource: string;
  aggregation: 'avg' | 'sum' | 'min' | 'max' | 'count';
}

export interface AlertNotification {
  type: 'email' | 'sms' | 'slack' | 'webhook' | 'pagerduty';
  recipients: string[];
  template: string;
  enabled: boolean;
  rateLimitMinutes: number;
}

export interface SuppressionRule {
  condition: string;
  duration: number;
  enabled: boolean;
}

export interface EscalationRule {
  delay: number;
  condition: string;
  actions: string[];
  enabled: boolean;
}

export interface CapacityPlan {
  id: string;
  name: string;
  resource: string;
  currentUsage: number;
  projectedUsage: number;
  timeHorizon: string;
  confidence: number;
  factors: CapacityFactor[];
  recommendations: CapacityRecommendation[];
  cost: CapacityCost;
  risks: CapacityRisk[];
  createdAt: Date;
  lastUpdated: Date;
}

export interface CapacityFactor {
  name: string;
  impact: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  confidence: number;
  description: string;
}

export interface CapacityRecommendation {
  type: 'scale_up' | 'scale_down' | 'optimize' | 'migrate' | 'archive';
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  timeline: string;
  cost: number;
  benefits: string[];
  risks: string[];
}

export interface CapacityCost {
  current: number;
  projected: number;
  optimized: number;
  currency: string;
  period: 'monthly' | 'yearly';
}

export interface CapacityRisk {
  type: 'performance' | 'availability' | 'cost' | 'security';
  probability: number;
  impact: number;
  description: string;
  mitigation: string;
}

export interface PerformanceTest {
  id: string;
  name: string;
  type: 'load' | 'stress' | 'spike' | 'volume' | 'endurance' | 'regression';
  config: TestConfig;
  baseline: TestBaseline;
  results: TestResult[];
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  duration: number;
  tags: string[];
}

export interface TestConfig {
  users: number;
  duration: number;
  rampUpTime: number;
  rampDownTime: number;
  scenarios: TestScenario[];
  thresholds: TestThreshold[];
  environment: string;
}

export interface TestScenario {
  name: string;
  weight: number;
  steps: TestStep[];
}

export interface TestStep {
  type: 'http' | 'websocket' | 'database' | 'custom';
  name: string;
  config: any;
  validations: StepValidation[];
}

export interface StepValidation {
  type: 'response_time' | 'status_code' | 'content' | 'size';
  condition: string;
  value: any;
}

export interface TestThreshold {
  metric: string;
  value: number;
  operator: 'lt' | 'gt' | 'eq';
  severity: 'warning' | 'error';
}

export interface TestBaseline {
  responseTime: number;
  throughput: number;
  errorRate: number;
  resourceUsage: Record<string, number>;
  timestamp: Date;
}

export interface TestResult {
  id: string;
  testId: string;
  timestamp: Date;
  duration: number;
  users: number;
  requests: number;
  errors: number;
  responseTime: ResponseTimeMetrics;
  throughput: number;
  errorRate: number;
  resourceUsage: Record<string, number>;
  passed: boolean;
  regression: boolean;
  comparison: TestComparison;
}

export interface ResponseTimeMetrics {
  min: number;
  max: number;
  avg: number;
  p50: number;
  p95: number;
  p99: number;
}

export interface TestComparison {
  baseline: TestBaseline;
  current: TestResult;
  differences: Record<string, number>;
  regressions: string[];
  improvements: string[];
}

export class ProductionMonitoringDashboard extends EventEmitter {
  private dashboards: Map<string, MonitoringDashboard> = new Map();
  private alertRules: Map<string, AlertRule> = new Map();
  private capacityPlans: Map<string, CapacityPlan> = new Map();
  private performanceTests: Map<string, PerformanceTest> = new Map();
  private activeAlerts: Map<string, any> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;
  private alertingInterval: NodeJS.Timeout | null = null;
  private capacityInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initializeMonitoringDashboard();
  }

  private async initializeMonitoringDashboard(): Promise<void> {
    await this.setupDefaultDashboards();
    await this.setupDefaultAlerts();
    await this.setupCapacityPlanning();
    await this.startMonitoring();
    await this.startAlerting();
    await this.startCapacityPlanning();
    console.log('Production Monitoring Dashboard initialized');
  }

  /**
   * DASHBOARD MANAGEMENT
   */
  private async setupDefaultDashboards(): Promise<void> {
    // Performance Dashboard
    await this.createDashboard({
      id: 'performance_overview',
      name: 'Performance Overview',
      type: 'performance',
      widgets: [
        {
          id: 'response_time_chart',
          type: 'chart',
          title: 'Response Time',
          description: 'Average response time over time',
          position: { x: 0, y: 0 },
          size: { width: 6, height: 4 },
          dataSource: {
            type: 'metrics',
            query: 'avg(response_time)',
            timeRange: { from: '1h', to: 'now', relative: true },
            refreshInterval: 30000,
            aggregation: 'avg',
            filters: {}
          },
          config: {
            chartType: 'line',
            colors: ['#3B82F6'],
            legend: true,
            gridlines: true,
            animations: true,
            tooltip: true
          },
          thresholds: [
            { value: 200, color: '#F59E0B', label: 'Warning', type: 'warning' },
            { value: 500, color: '#EF4444', label: 'Critical', type: 'critical' }
          ],
          enabled: true
        },
        {
          id: 'throughput_gauge',
          type: 'gauge',
          title: 'Throughput',
          description: 'Current request throughput',
          position: { x: 6, y: 0 },
          size: { width: 3, height: 4 },
          dataSource: {
            type: 'metrics',
            query: 'rate(requests_total)',
            timeRange: { from: '5m', to: 'now', relative: true },
            refreshInterval: 5000,
            aggregation: 'rate',
            filters: {}
          },
          config: {
            colors: ['#10B981'],
            legend: false
          },
          thresholds: [
            { value: 100, color: '#F59E0B', label: 'Low', type: 'warning' },
            { value: 500, color: '#10B981', label: 'Good', type: 'info' },
            { value: 1000, color: '#EF4444', label: 'High', type: 'critical' }
          ],
          enabled: true
        },
        {
          id: 'error_rate_metric',
          type: 'metric',
          title: 'Error Rate',
          description: 'Current error rate percentage',
          position: { x: 9, y: 0 },
          size: { width: 3, height: 4 },
          dataSource: {
            type: 'metrics',
            query: 'rate(errors_total) / rate(requests_total) * 100',
            timeRange: { from: '5m', to: 'now', relative: true },
            refreshInterval: 5000,
            aggregation: 'rate',
            filters: {}
          },
          config: {
            colors: ['#EF4444']
          },
          thresholds: [
            { value: 1, color: '#F59E0B', label: 'Warning', type: 'warning' },
            { value: 5, color: '#EF4444', label: 'Critical', type: 'critical' }
          ],
          enabled: true
        }
      ],
      layout: {
        columns: 12,
        rows: 8,
        gridSize: 100,
        responsive: true,
        breakpoints: {
          lg: 1200,
          md: 996,
          sm: 768,
          xs: 480
        }
      },
      permissions: ['admin', 'developer', 'operator'],
      refreshInterval: 30000,
      enabled: true,
      createdAt: new Date(),
      lastUpdated: new Date()
    });

    // Infrastructure Dashboard
    await this.createDashboard({
      id: 'infrastructure_overview',
      name: 'Infrastructure Overview',
      type: 'infrastructure',
      widgets: [
        {
          id: 'cpu_usage_chart',
          type: 'chart',
          title: 'CPU Usage',
          description: 'CPU utilization across all nodes',
          position: { x: 0, y: 0 },
          size: { width: 6, height: 4 },
          dataSource: {
            type: 'metrics',
            query: 'avg(cpu_usage_percent)',
            timeRange: { from: '1h', to: 'now', relative: true },
            refreshInterval: 30000,
            aggregation: 'avg',
            filters: {}
          },
          config: {
            chartType: 'area',
            colors: ['#8B5CF6'],
            legend: true,
            gridlines: true
          },
          thresholds: [
            { value: 70, color: '#F59E0B', label: 'Warning', type: 'warning' },
            { value: 90, color: '#EF4444', label: 'Critical', type: 'critical' }
          ],
          enabled: true
        },
        {
          id: 'memory_usage_chart',
          type: 'chart',
          title: 'Memory Usage',
          description: 'Memory utilization across all nodes',
          position: { x: 6, y: 0 },
          size: { width: 6, height: 4 },
          dataSource: {
            type: 'metrics',
            query: 'avg(memory_usage_percent)',
            timeRange: { from: '1h', to: 'now', relative: true },
            refreshInterval: 30000,
            aggregation: 'avg',
            filters: {}
          },
          config: {
            chartType: 'area',
            colors: ['#F59E0B'],
            legend: true,
            gridlines: true
          },
          thresholds: [
            { value: 80, color: '#F59E0B', label: 'Warning', type: 'warning' },
            { value: 95, color: '#EF4444', label: 'Critical', type: 'critical' }
          ],
          enabled: true
        }
      ],
      layout: {
        columns: 12,
        rows: 8,
        gridSize: 100,
        responsive: true,
        breakpoints: {
          lg: 1200,
          md: 996,
          sm: 768,
          xs: 480
        }
      },
      permissions: ['admin', 'operator'],
      refreshInterval: 30000,
      enabled: true,
      createdAt: new Date(),
      lastUpdated: new Date()
    });
  }

  async createDashboard(dashboard: MonitoringDashboard): Promise<void> {
    this.dashboards.set(dashboard.id, dashboard);
    
    this.emit('dashboard_created', { dashboardId: dashboard.id });
    eventBus.emit('dashboard_created', { dashboardId: dashboard.id, type: dashboard.type });
  }

  async updateDashboard(dashboardId: string, updates: Partial<MonitoringDashboard>): Promise<void> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard ${dashboardId} not found`);
    }

    const updatedDashboard = { ...dashboard, ...updates, lastUpdated: new Date() };
    this.dashboards.set(dashboardId, updatedDashboard);
    
    this.emit('dashboard_updated', { dashboardId, updates });
  }

  async getDashboardData(dashboardId: string): Promise<{
    dashboard: MonitoringDashboard;
    data: Record<string, any>;
  }> {
    const dashboard = this.dashboards.get(dashboardId);
    if (!dashboard) {
      throw new Error(`Dashboard ${dashboardId} not found`);
    }

    const data: Record<string, any> = {};
    
    // Collect data for each widget
    for (const widget of dashboard.widgets) {
      if (widget.enabled) {
        data[widget.id] = await this.getWidgetData(widget);
      }
    }

    return {
      dashboard,
      data
    };
  }

  private async getWidgetData(widget: DashboardWidget): Promise<any> {
    const startTime = performance.now();
    
    try {
      // Mock data generation based on widget type and data source
      let data: any;
      
      switch (widget.type) {
        case 'chart':
          data = await this.generateChartData(widget);
          break;
        case 'metric':
          data = await this.generateMetricData(widget);
          break;
        case 'gauge':
          data = await this.generateGaugeData(widget);
          break;
        case 'table':
          data = await this.generateTableData(widget);
          break;
        case 'alert':
          data = await this.generateAlertData(widget);
          break;
        default:
          data = { value: 0, timestamp: new Date() };
      }

      const queryTime = performance.now() - startTime;
      
      return {
        ...data,
        metadata: {
          queryTime,
          timestamp: new Date(),
          source: widget.dataSource.type
        }
      };
      
    } catch (error) {
      console.error(`Widget data generation failed for ${widget.id}:`, error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      };
    }
  }

  private async generateChartData(widget: DashboardWidget): Promise<any> {
    const points = 50;
    const data = [];
    const now = Date.now();
    
    for (let i = 0; i < points; i++) {
      const timestamp = new Date(now - (points - i) * 60000); // 1 minute intervals
      let value: number;
      
      // Generate realistic data based on query
      if (widget.dataSource.query.includes('response_time')) {
        value = Math.random() * 200 + 100 + Math.sin(i * 0.1) * 50;
      } else if (widget.dataSource.query.includes('cpu_usage')) {
        value = Math.random() * 30 + 40 + Math.sin(i * 0.2) * 20;
      } else if (widget.dataSource.query.includes('memory_usage')) {
        value = Math.random() * 20 + 60 + Math.sin(i * 0.15) * 15;
      } else {
        value = Math.random() * 100;
      }
      
      data.push({
        timestamp,
        value: Math.max(0, value)
      });
    }
    
    return {
      series: [{
        name: widget.title,
        data
      }]
    };
  }

  private async generateMetricData(widget: DashboardWidget): Promise<any> {
    let value: number;
    
    // Generate realistic metric value
    if (widget.dataSource.query.includes('error_rate')) {
      value = Math.random() * 2 + 0.5;
    } else if (widget.dataSource.query.includes('throughput')) {
      value = Math.random() * 500 + 200;
    } else {
      value = Math.random() * 100;
    }
    
    const previousValue = value * (0.9 + Math.random() * 0.2);
    const change = ((value - previousValue) / previousValue) * 100;
    
    return {
      value,
      previousValue,
      change,
      changePercent: change,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable'
    };
  }

  private async generateGaugeData(widget: DashboardWidget): Promise<any> {
    let value: number;
    let max: number;
    
    if (widget.dataSource.query.includes('throughput')) {
      value = Math.random() * 800 + 100;
      max = 1000;
    } else if (widget.dataSource.query.includes('cpu')) {
      value = Math.random() * 80 + 10;
      max = 100;
    } else {
      value = Math.random() * 80 + 10;
      max = 100;
    }
    
    return {
      value,
      max,
      percentage: (value / max) * 100,
      status: value > max * 0.8 ? 'critical' : value > max * 0.6 ? 'warning' : 'normal'
    };
  }

  private async generateTableData(widget: DashboardWidget): Promise<any> {
    const rows = [];
    const rowCount = 10;
    
    for (let i = 0; i < rowCount; i++) {
      rows.push({
        id: i + 1,
        name: `Node ${i + 1}`,
        status: Math.random() > 0.1 ? 'healthy' : 'unhealthy',
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        lastCheck: new Date()
      });
    }
    
    return {
      columns: [
        { key: 'name', title: 'Node' },
        { key: 'status', title: 'Status' },
        { key: 'cpu', title: 'CPU %' },
        { key: 'memory', title: 'Memory %' },
        { key: 'disk', title: 'Disk %' },
        { key: 'lastCheck', title: 'Last Check' }
      ],
      rows
    };
  }

  private async generateAlertData(widget: DashboardWidget): Promise<any> {
    const alerts = Array.from(this.activeAlerts.values())
      .slice(0, 10)
      .map(alert => ({
        id: alert.id,
        title: alert.title,
        severity: alert.severity,
        timestamp: alert.timestamp,
        status: alert.status
      }));
    
    return {
      alerts,
      total: this.activeAlerts.size,
      critical: alerts.filter(a => a.severity === 'critical').length,
      warning: alerts.filter(a => a.severity === 'warning').length
    };
  }

  /**
   * ALERTING SYSTEM
   */
  private async setupDefaultAlerts(): Promise<void> {
    // High Response Time Alert
    await this.createAlertRule({
      id: 'high_response_time',
      name: 'High Response Time',
      description: 'Alert when response time exceeds threshold',
      condition: {
        query: 'avg(response_time)',
        threshold: 500,
        operator: 'gt',
        timeWindow: 300000, // 5 minutes
        evaluationInterval: 30000, // 30 seconds
        dataSource: 'metrics',
        aggregation: 'avg'
      },
      severity: 'critical',
      frequency: 300000, // 5 minutes
      enabled: true,
      notifications: [
        {
          type: 'email',
          recipients: ['admin@example.com'],
          template: 'high_response_time',
          enabled: true,
          rateLimitMinutes: 30
        },
        {
          type: 'slack',
          recipients: ['#alerts'],
          template: 'slack_alert',
          enabled: true,
          rateLimitMinutes: 15
        }
      ],
      suppressionRules: [
        {
          condition: 'maintenance_mode = true',
          duration: 3600000, // 1 hour
          enabled: true
        }
      ],
      escalationRules: [
        {
          delay: 900000, // 15 minutes
          condition: 'severity = critical AND duration > 15min',
          actions: ['page_on_call', 'create_incident'],
          enabled: true
        }
      ],
      createdAt: new Date()
    });

    // High Error Rate Alert
    await this.createAlertRule({
      id: 'high_error_rate',
      name: 'High Error Rate',
      description: 'Alert when error rate exceeds threshold',
      condition: {
        query: 'rate(errors_total) / rate(requests_total) * 100',
        threshold: 5,
        operator: 'gt',
        timeWindow: 180000, // 3 minutes
        evaluationInterval: 30000,
        dataSource: 'metrics',
        aggregation: 'avg'
      },
      severity: 'high',
      frequency: 180000, // 3 minutes
      enabled: true,
      notifications: [
        {
          type: 'email',
          recipients: ['dev-team@example.com'],
          template: 'high_error_rate',
          enabled: true,
          rateLimitMinutes: 15
        }
      ],
      suppressionRules: [],
      escalationRules: [],
      createdAt: new Date()
    });

    // Resource Exhaustion Alert
    await this.createAlertRule({
      id: 'resource_exhaustion',
      name: 'Resource Exhaustion',
      description: 'Alert when system resources are critically low',
      condition: {
        query: 'avg(cpu_usage_percent) OR avg(memory_usage_percent)',
        threshold: 90,
        operator: 'gt',
        timeWindow: 600000, // 10 minutes
        evaluationInterval: 60000, // 1 minute
        dataSource: 'metrics',
        aggregation: 'avg'
      },
      severity: 'critical',
      frequency: 600000, // 10 minutes
      enabled: true,
      notifications: [
        {
          type: 'email',
          recipients: ['ops-team@example.com'],
          template: 'resource_exhaustion',
          enabled: true,
          rateLimitMinutes: 60
        },
        {
          type: 'pagerduty',
          recipients: ['ops-oncall'],
          template: 'pagerduty_alert',
          enabled: true,
          rateLimitMinutes: 30
        }
      ],
      suppressionRules: [],
      escalationRules: [
        {
          delay: 300000, // 5 minutes
          condition: 'severity = critical',
          actions: ['auto_scale', 'create_incident'],
          enabled: true
        }
      ],
      createdAt: new Date()
    });
  }

  async createAlertRule(alertRule: AlertRule): Promise<void> {
    this.alertRules.set(alertRule.id, alertRule);
    
    this.emit('alert_rule_created', { alertRuleId: alertRule.id });
    eventBus.emit('alert_rule_created', { alertRuleId: alertRule.id, severity: alertRule.severity });
  }

  private async startAlerting(): Promise<void> {
    this.alertingInterval = setInterval(() => {
      this.evaluateAlerts();
    }, 30000); // Evaluate every 30 seconds
  }

  private async evaluateAlerts(): Promise<void> {
    for (const [alertId, alertRule] of this.alertRules) {
      if (!alertRule.enabled) continue;
      
      try {
        const shouldTrigger = await this.evaluateAlertCondition(alertRule);
        
        if (shouldTrigger) {
          await this.triggerAlert(alertRule);
        }
      } catch (error) {
        console.error(`Alert evaluation failed for ${alertId}:`, error);
      }
    }
  }

  private async evaluateAlertCondition(alertRule: AlertRule): Promise<boolean> {
    const { condition } = alertRule;
    
    // Mock condition evaluation
    let currentValue: number;
    
    if (condition.query.includes('response_time')) {
      currentValue = Math.random() * 600 + 100;
    } else if (condition.query.includes('error_rate')) {
      currentValue = Math.random() * 8;
    } else if (condition.query.includes('cpu_usage')) {
      currentValue = Math.random() * 100;
    } else if (condition.query.includes('memory_usage')) {
      currentValue = Math.random() * 100;
    } else {
      currentValue = Math.random() * 100;
    }
    
    // Check if condition is met
    switch (condition.operator) {
      case 'gt':
        return currentValue > condition.threshold;
      case 'lt':
        return currentValue < condition.threshold;
      case 'eq':
        return currentValue === condition.threshold;
      case 'gte':
        return currentValue >= condition.threshold;
      case 'lte':
        return currentValue <= condition.threshold;
      case 'ne':
        return currentValue !== condition.threshold;
      default:
        return false;
    }
  }

  private async triggerAlert(alertRule: AlertRule): Promise<void> {
    const alertId = `alert_${alertRule.id}_${Date.now()}`;
    
    const alert = {
      id: alertId,
      ruleId: alertRule.id,
      title: alertRule.name,
      description: alertRule.description,
      severity: alertRule.severity,
      timestamp: new Date(),
      status: 'active'
    };

    this.activeAlerts.set(alertId, alert);
    
    // Send notifications
    for (const notification of alertRule.notifications) {
      if (notification.enabled) {
        await this.sendNotification(notification, alert);
      }
    }
    
    // Check escalation rules
    for (const escalation of alertRule.escalationRules) {
      if (escalation.enabled) {
        setTimeout(() => {
          this.escalateAlert(alert, escalation);
        }, escalation.delay);
      }
    }
    
    // Update last triggered
    alertRule.lastTriggered = new Date();
    this.alertRules.set(alertRule.id, alertRule);
    
    this.emit('alert_triggered', { alertId, alertRule });
    eventBus.emit('alert_triggered', { alertId, severity: alertRule.severity });
  }

  private async sendNotification(notification: AlertNotification, alert: any): Promise<void> {
    try {
      // Mock notification sending
      console.log(`Sending ${notification.type} notification for alert ${alert.id}`);
      
      // Rate limiting logic would go here
      
      this.emit('notification_sent', {
        alertId: alert.id,
        type: notification.type,
        recipients: notification.recipients
      });
    } catch (error) {
      console.error(`Notification failed for alert ${alert.id}:`, error);
    }
  }

  private async escalateAlert(alert: any, escalation: EscalationRule): Promise<void> {
    console.log(`Escalating alert ${alert.id} after ${escalation.delay}ms`);
    
    for (const action of escalation.actions) {
      await this.executeEscalationAction(action, alert);
    }
    
    this.emit('alert_escalated', { alertId: alert.id, actions: escalation.actions });
  }

  private async executeEscalationAction(action: string, alert: any): Promise<void> {
    switch (action) {
      case 'page_on_call':
        console.log(`Paging on-call for alert ${alert.id}`);
        break;
      case 'create_incident':
        console.log(`Creating incident for alert ${alert.id}`);
        break;
      case 'auto_scale':
        console.log(`Triggering auto-scale for alert ${alert.id}`);
        eventBus.emit('trigger_auto_scale', { alertId: alert.id });
        break;
      default:
        console.log(`Unknown escalation action: ${action}`);
    }
  }

  /**
   * CAPACITY PLANNING
   */
  private async setupCapacityPlanning(): Promise<void> {
    // Setup default capacity plans
    await this.createCapacityPlan({
      id: 'compute_capacity',
      name: 'Compute Capacity Plan',
      resource: 'cpu',
      currentUsage: 65,
      projectedUsage: 85,
      timeHorizon: '3 months',
      confidence: 0.8,
      factors: [
        {
          name: 'Traffic Growth',
          impact: 0.4,
          trend: 'increasing',
          confidence: 0.9,
          description: 'Expected 15% monthly traffic increase'
        },
        {
          name: 'New Features',
          impact: 0.3,
          trend: 'increasing',
          confidence: 0.7,
          description: 'New analytics features will increase CPU usage'
        },
        {
          name: 'Code Optimization',
          impact: -0.2,
          trend: 'stable',
          confidence: 0.6,
          description: 'Planned performance optimizations'
        }
      ],
      recommendations: [
        {
          type: 'scale_up',
          description: 'Add 2 additional compute nodes',
          impact: 'high',
          effort: 'low',
          timeline: '1 week',
          cost: 500,
          benefits: ['Improved response times', 'Better user experience'],
          risks: ['Increased operational costs']
        },
        {
          type: 'optimize',
          description: 'Implement caching layer',
          impact: 'medium',
          effort: 'medium',
          timeline: '2 weeks',
          cost: 200,
          benefits: ['Reduced CPU usage', 'Better cache hit rates'],
          risks: ['Complexity increase', 'Cache invalidation issues']
        }
      ],
      cost: {
        current: 1000,
        projected: 1500,
        optimized: 1200,
        currency: 'USD',
        period: 'monthly'
      },
      risks: [
        {
          type: 'performance',
          probability: 0.3,
          impact: 0.8,
          description: 'Performance degradation during peak hours',
          mitigation: 'Implement auto-scaling and load balancing'
        },
        {
          type: 'cost',
          probability: 0.6,
          impact: 0.5,
          description: 'Higher than expected costs',
          mitigation: 'Monitor usage and optimize regularly'
        }
      ],
      createdAt: new Date(),
      lastUpdated: new Date()
    });

    await this.createCapacityPlan({
      id: 'storage_capacity',
      name: 'Storage Capacity Plan',
      resource: 'storage',
      currentUsage: 45,
      projectedUsage: 75,
      timeHorizon: '6 months',
      confidence: 0.85,
      factors: [
        {
          name: 'Data Growth',
          impact: 0.6,
          trend: 'increasing',
          confidence: 0.95,
          description: 'Historical data shows 20% quarterly growth'
        },
        {
          name: 'Backup Requirements',
          impact: 0.2,
          trend: 'stable',
          confidence: 0.8,
          description: 'Additional backup storage needed'
        }
      ],
      recommendations: [
        {
          type: 'scale_up',
          description: 'Add 1TB storage capacity',
          impact: 'medium',
          effort: 'low',
          timeline: '3 days',
          cost: 100,
          benefits: ['Avoid storage limits', 'Better performance'],
          risks: ['Storage costs increase']
        }
      ],
      cost: {
        current: 300,
        projected: 450,
        optimized: 400,
        currency: 'USD',
        period: 'monthly'
      },
      risks: [
        {
          type: 'availability',
          probability: 0.2,
          impact: 0.9,
          description: 'Storage exhaustion leading to downtime',
          mitigation: 'Implement storage monitoring and alerts'
        }
      ],
      createdAt: new Date(),
      lastUpdated: new Date()
    });
  }

  async createCapacityPlan(plan: CapacityPlan): Promise<void> {
    this.capacityPlans.set(plan.id, plan);
    
    this.emit('capacity_plan_created', { planId: plan.id });
    eventBus.emit('capacity_plan_created', { planId: plan.id, resource: plan.resource });
  }

  private async startCapacityPlanning(): Promise<void> {
    this.capacityInterval = setInterval(() => {
      this.updateCapacityPlans();
    }, 86400000); // Update daily
  }

  private async updateCapacityPlans(): Promise<void> {
    for (const [planId, plan] of this.capacityPlans) {
      try {
        const updatedPlan = await this.recalculateCapacityPlan(plan);
        this.capacityPlans.set(planId, updatedPlan);
        
        this.emit('capacity_plan_updated', { planId });
      } catch (error) {
        console.error(`Capacity plan update failed for ${planId}:`, error);
      }
    }
  }

  private async recalculateCapacityPlan(plan: CapacityPlan): Promise<CapacityPlan> {
    // Mock recalculation
    const growthRate = 0.05; // 5% growth
    const newProjectedUsage = plan.currentUsage * (1 + growthRate);
    
    return {
      ...plan,
      projectedUsage: newProjectedUsage,
      lastUpdated: new Date()
    };
  }

  /**
   * PERFORMANCE TESTING
   */
  async createPerformanceTest(test: Omit<PerformanceTest, 'id' | 'results' | 'startTime'>): Promise<string> {
    const testId = `test_${Date.now()}`;
    
    const performanceTest: PerformanceTest = {
      id: testId,
      startTime: new Date(),
      results: [],
      ...test
    };

    this.performanceTests.set(testId, performanceTest);
    
    this.emit('performance_test_created', { testId });
    eventBus.emit('performance_test_created', { testId, type: test.type });
    
    return testId;
  }

  async runPerformanceTest(testId: string): Promise<TestResult> {
    const test = this.performanceTests.get(testId);
    if (!test) {
      throw new Error(`Performance test ${testId} not found`);
    }

    test.status = 'running';
    test.startTime = new Date();
    
    this.performanceTests.set(testId, test);
    
    try {
      // Mock test execution
      const result = await this.executeTest(test);
      
      test.status = 'completed';
      test.endTime = new Date();
      test.duration = test.endTime.getTime() - test.startTime.getTime();
      test.results.push(result);
      
      this.performanceTests.set(testId, test);
      
      // Check for regressions
      const hasRegression = await this.checkForRegression(test, result);
      result.regression = hasRegression;
      
      this.emit('performance_test_completed', { testId, result });
      
      return result;
    } catch (error) {
      test.status = 'failed';
      test.endTime = new Date();
      test.duration = test.endTime.getTime() - test.startTime.getTime();
      
      this.performanceTests.set(testId, test);
      
      this.emit('performance_test_failed', { testId, error });
      throw error;
    }
  }

  private async executeTest(test: PerformanceTest): Promise<TestResult> {
    // Mock test execution
    const { config } = test;
    
    // Simulate test execution time
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const result: TestResult = {
      id: `result_${Date.now()}`,
      testId: test.id,
      timestamp: new Date(),
      duration: config.duration,
      users: config.users,
      requests: config.users * 100, // Mock: 100 requests per user
      errors: Math.floor(Math.random() * 10),
      responseTime: {
        min: 50,
        max: 2000,
        avg: 200 + Math.random() * 300,
        p50: 180,
        p95: 500,
        p99: 800
      },
      throughput: config.users * 10,
      errorRate: Math.random() * 2,
      resourceUsage: {
        cpu: Math.random() * 80 + 20,
        memory: Math.random() * 70 + 30,
        network: Math.random() * 60 + 40
      },
      passed: true,
      regression: false,
      comparison: {
        baseline: test.baseline,
        current: {} as TestResult, // Will be filled
        differences: {},
        regressions: [],
        improvements: []
      }
    };
    
    // Fill comparison
    result.comparison.current = result;
    
    return result;
  }

  private async checkForRegression(test: PerformanceTest, result: TestResult): Promise<boolean> {
    if (!test.baseline) return false;
    
    const regressionThreshold = 0.2; // 20% regression threshold
    
    // Check response time regression
    const responseTimeRegression = (result.responseTime.avg - test.baseline.responseTime) / test.baseline.responseTime;
    if (responseTimeRegression > regressionThreshold) {
      result.comparison.regressions.push('Response time regression detected');
      return true;
    }
    
    // Check throughput regression
    const throughputRegression = (test.baseline.throughput - result.throughput) / test.baseline.throughput;
    if (throughputRegression > regressionThreshold) {
      result.comparison.regressions.push('Throughput regression detected');
      return true;
    }
    
    // Check error rate regression
    const errorRateRegression = result.errorRate - test.baseline.errorRate;
    if (errorRateRegression > 1) { // 1% error rate increase
      result.comparison.regressions.push('Error rate regression detected');
      return true;
    }
    
    return false;
  }

  /**
   * MONITORING
   */
  private async startMonitoring(): Promise<void> {
    this.monitoringInterval = setInterval(() => {
      this.collectMonitoringData();
    }, 30000); // Collect every 30 seconds
  }

  private async collectMonitoringData(): Promise<void> {
    try {
      // Update dashboard data
      for (const [dashboardId, dashboard] of this.dashboards) {
        if (dashboard.enabled) {
          await this.updateDashboardData(dashboardId);
        }
      }
      
      // Monitor system health
      await this.monitorSystemHealth();
      
      // Check capacity thresholds
      await this.checkCapacityThresholds();
      
    } catch (error) {
      console.error('Monitoring data collection failed:', error);
    }
  }

  private async updateDashboardData(dashboardId: string): Promise<void> {
    // This would update cached dashboard data
    this.emit('dashboard_data_updated', { dashboardId });
  }

  private async monitorSystemHealth(): Promise<void> {
    // Mock system health monitoring
    const healthStatus = {
      overall: 'healthy',
      services: {
        api: 'healthy',
        database: 'healthy',
        cache: 'healthy',
        queue: 'healthy'
      },
      timestamp: new Date()
    };
    
    this.emit('system_health_updated', healthStatus);
  }

  private async checkCapacityThresholds(): Promise<void> {
    for (const [planId, plan] of this.capacityPlans) {
      const utilizationThreshold = 80; // 80% utilization threshold
      
      if (plan.currentUsage > utilizationThreshold) {
        this.emit('capacity_threshold_exceeded', {
          planId,
          resource: plan.resource,
          currentUsage: plan.currentUsage,
          threshold: utilizationThreshold
        });
      }
    }
  }

  /**
   * PUBLIC API
   */
  async getDashboards(): Promise<MonitoringDashboard[]> {
    return Array.from(this.dashboards.values());
  }

  async getAlertRules(): Promise<AlertRule[]> {
    return Array.from(this.alertRules.values());
  }

  async getActiveAlerts(): Promise<any[]> {
    return Array.from(this.activeAlerts.values());
  }

  async getCapacityPlans(): Promise<CapacityPlan[]> {
    return Array.from(this.capacityPlans.values());
  }

  async getPerformanceTests(): Promise<PerformanceTest[]> {
    return Array.from(this.performanceTests.values());
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      alert.status = 'acknowledged';
      alert.acknowledgedAt = new Date();
      this.activeAlerts.set(alertId, alert);
      
      this.emit('alert_acknowledged', { alertId });
    }
  }

  async resolveAlert(alertId: string): Promise<void> {
    const alert = this.activeAlerts.get(alertId);
    if (alert) {
      alert.status = 'resolved';
      alert.resolvedAt = new Date();
      this.activeAlerts.set(alertId, alert);
      
      this.emit('alert_resolved', { alertId });
    }
  }

  // Cleanup
  async cleanup(): Promise<void> {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    if (this.alertingInterval) {
      clearInterval(this.alertingInterval);
    }
    
    if (this.capacityInterval) {
      clearInterval(this.capacityInterval);
    }
  }
}

// Export singleton instance
export const productionMonitoringDashboard = new ProductionMonitoringDashboard();
