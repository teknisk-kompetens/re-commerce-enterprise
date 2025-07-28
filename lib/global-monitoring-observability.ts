
/**
 * GLOBAL MONITORING & OBSERVABILITY
 * Multi-region performance monitoring, global system health, and cross-region incident response
 */

import { eventBus } from '@/lib/event-bus-system';
import { performance } from 'perf_hooks';
import { GlobalRegion } from '@/lib/global-deployment-orchestrator';

export interface GlobalMonitoringConfig {
  id: string;
  name: string;
  description: string;
  regions: MonitoringRegion[];
  metrics: GlobalMetric[];
  alerts: GlobalAlert[];
  dashboards: GlobalDashboard[];
  incidents: IncidentManagement;
  observability: ObservabilityConfig;
  compliance: MonitoringCompliance;
  retention: DataRetentionConfig;
  integrations: MonitoringIntegration[];
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

export interface MonitoringRegion {
  regionId: string;
  name: string;
  status: 'active' | 'inactive' | 'degraded' | 'failed';
  collectors: DataCollector[];
  processors: DataProcessor[];
  storage: MetricsStorage;
  alerts: RegionAlert[];
  latency: number;
  availability: number;
  lastHealthCheck: Date;
  endpoints: MonitoringEndpoint[];
  performance: RegionPerformance;
  errors: MonitoringError[];
}

export interface DataCollector {
  id: string;
  name: string;
  type: 'metrics' | 'logs' | 'traces' | 'events' | 'custom';
  source: string;
  configuration: CollectorConfig;
  status: 'active' | 'inactive' | 'error';
  throughput: number;
  latency: number;
  errors: number;
  lastCollection: Date;
  filters: CollectorFilter[];
  transformations: DataTransformation[];
}

export interface CollectorConfig {
  interval: number;
  batchSize: number;
  timeout: number;
  retries: number;
  buffer: BufferConfig;
  compression: boolean;
  encryption: boolean;
  authentication: AuthConfig;
  customSettings: Record<string, any>;
}

export interface BufferConfig {
  enabled: boolean;
  size: number;
  flushInterval: number;
  flushOnShutdown: boolean;
  persistence: boolean;
}

export interface AuthConfig {
  type: 'none' | 'basic' | 'bearer' | 'oauth2' | 'mtls';
  credentials: Record<string, any>;
  refreshInterval: number;
}

export interface CollectorFilter {
  id: string;
  name: string;
  type: 'include' | 'exclude' | 'transform';
  condition: string;
  action: string;
  priority: number;
  enabled: boolean;
}

export interface DataTransformation {
  id: string;
  name: string;
  type: 'map' | 'filter' | 'aggregate' | 'enrich' | 'custom';
  configuration: Record<string, any>;
  order: number;
  enabled: boolean;
}

export interface DataProcessor {
  id: string;
  name: string;
  type: 'aggregator' | 'enricher' | 'correlator' | 'analyzer' | 'custom';
  configuration: ProcessorConfig;
  status: 'active' | 'inactive' | 'error';
  throughput: number;
  latency: number;
  errors: number;
  lastProcessed: Date;
  rules: ProcessingRule[];
}

export interface ProcessorConfig {
  windowSize: number;
  slidingWindow: boolean;
  aggregations: string[];
  enrichments: string[];
  correlations: string[];
  customLogic: string;
}

export interface ProcessingRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  priority: number;
  enabled: boolean;
  statistics: RuleStatistics;
}

export interface RuleStatistics {
  triggered: number;
  processed: number;
  errors: number;
  lastTriggered: Date;
  averageProcessingTime: number;
}

export interface MetricsStorage {
  type: 'timeseries' | 'nosql' | 'relational' | 'hybrid';
  configuration: StorageConfig;
  status: 'active' | 'inactive' | 'degraded' | 'full';
  capacity: StorageCapacity;
  usage: StorageUsage;
  performance: StoragePerformance;
  retention: StorageRetention;
  backup: StorageBackup;
}

export interface StorageConfig {
  cluster: string;
  replication: number;
  sharding: boolean;
  compression: boolean;
  encryption: boolean;
  indexing: boolean;
  customSettings: Record<string, any>;
}

export interface StorageCapacity {
  total: number;
  available: number;
  used: number;
  reserved: number;
  growth: number;
}

export interface StorageUsage {
  reads: number;
  writes: number;
  deletes: number;
  queries: number;
  bandwidth: number;
  connections: number;
}

export interface StoragePerformance {
  readLatency: number;
  writeLatency: number;
  queryLatency: number;
  throughput: number;
  errorRate: number;
  availability: number;
}

export interface StorageRetention {
  policies: RetentionPolicy[];
  compaction: boolean;
  archiving: boolean;
  deletion: boolean;
  monitoring: boolean;
}

export interface RetentionPolicy {
  id: string;
  name: string;
  dataType: string;
  duration: number;
  action: 'delete' | 'archive' | 'compress';
  schedule: string;
  enabled: boolean;
}

export interface StorageBackup {
  enabled: boolean;
  frequency: string;
  retention: number;
  compression: boolean;
  encryption: boolean;
  crossRegion: boolean;
  verification: boolean;
  lastBackup: Date;
}

export interface RegionAlert {
  id: string;
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'suppressed';
  condition: string;
  threshold: number;
  duration: number;
  channels: string[];
  history: AlertHistory[];
  statistics: AlertStatistics;
}

export interface AlertHistory {
  timestamp: Date;
  status: 'triggered' | 'resolved' | 'suppressed';
  value: number;
  message: string;
  escalation: boolean;
}

export interface AlertStatistics {
  triggered: number;
  resolved: number;
  suppressed: number;
  averageDuration: number;
  lastTriggered: Date;
  falsePositives: number;
}

export interface MonitoringEndpoint {
  id: string;
  name: string;
  url: string;
  type: 'metrics' | 'health' | 'logs' | 'traces';
  authentication: AuthConfig;
  status: 'active' | 'inactive' | 'error';
  latency: number;
  availability: number;
  lastCheck: Date;
  errors: EndpointError[];
}

export interface EndpointError {
  timestamp: Date;
  type: 'timeout' | 'network' | 'authentication' | 'format' | 'other';
  message: string;
  details: string;
  resolved: boolean;
}

export interface RegionPerformance {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  throughput: number;
  latency: number;
  errorRate: number;
  availability: number;
  lastUpdated: Date;
}

export interface MonitoringError {
  id: string;
  type: 'collection' | 'processing' | 'storage' | 'alerting' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details: string;
  timestamp: Date;
  resolved: boolean;
  resolution: string;
}

export interface GlobalMetric {
  id: string;
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary' | 'rate';
  unit: string;
  description: string;
  labels: string[];
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'rate';
  retention: number;
  source: string;
  category: 'system' | 'application' | 'business' | 'security' | 'network' | 'database';
  priority: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  regions: string[];
  thresholds: MetricThreshold[];
  history: MetricHistory[];
  statistics: MetricStatistics;
  lastUpdated: Date;
}

export interface MetricThreshold {
  level: 'warning' | 'critical';
  operator: 'gt' | 'lt' | 'eq' | 'neq' | 'gte' | 'lte';
  value: number;
  duration: number;
  enabled: boolean;
}

export interface MetricHistory {
  timestamp: Date;
  value: number;
  region: string;
  tags: Record<string, string>;
}

export interface MetricStatistics {
  current: number;
  average: number;
  minimum: number;
  maximum: number;
  trend: 'up' | 'down' | 'stable';
  changeRate: number;
  lastCalculated: Date;
}

export interface GlobalAlert {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'suppressed' | 'pending';
  condition: AlertCondition;
  actions: AlertAction[];
  escalation: AlertEscalation;
  suppression: AlertSuppression;
  regions: string[];
  channels: NotificationChannel[];
  history: AlertHistory[];
  statistics: AlertStatistics;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AlertCondition {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'neq' | 'gte' | 'lte';
  threshold: number;
  duration: number;
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count';
  filters: ConditionFilter[];
  dependencies: string[];
}

export interface ConditionFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'regex' | 'in' | 'not_in';
  value: any;
  caseSensitive: boolean;
}

export interface AlertAction {
  id: string;
  type: 'notification' | 'webhook' | 'script' | 'api' | 'ticket' | 'escalation';
  configuration: ActionConfig;
  delay: number;
  retries: number;
  enabled: boolean;
  conditions: ActionCondition[];
}

export interface ActionConfig {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
  script?: string;
  timeout?: number;
  authentication?: AuthConfig;
  customSettings?: Record<string, any>;
}

export interface ActionCondition {
  field: string;
  operator: string;
  value: any;
  required: boolean;
}

export interface AlertEscalation {
  enabled: boolean;
  levels: EscalationLevel[];
  autoEscalate: boolean;
  maxLevel: number;
  cooldownPeriod: number;
}

export interface EscalationLevel {
  level: number;
  delay: number;
  channels: string[];
  actions: string[];
  conditions: string[];
}

export interface AlertSuppression {
  enabled: boolean;
  rules: SuppressionRule[];
  schedule: SuppressionSchedule;
  dependencies: string[];
}

export interface SuppressionRule {
  id: string;
  name: string;
  condition: string;
  duration: number;
  reason: string;
  enabled: boolean;
}

export interface SuppressionSchedule {
  enabled: boolean;
  timezone: string;
  periods: SuppressionPeriod[];
}

export interface SuppressionPeriod {
  start: string;
  end: string;
  days: number[];
  reason: string;
}

export interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'slack' | 'webhook' | 'pagerduty' | 'teams' | 'discord';
  configuration: ChannelConfig;
  enabled: boolean;
  rateLimit: ChannelRateLimit;
  formatting: MessageFormatting;
  filters: ChannelFilter[];
}

export interface ChannelConfig {
  url?: string;
  token?: string;
  recipients?: string[];
  template?: string;
  customSettings?: Record<string, any>;
}

export interface ChannelRateLimit {
  enabled: boolean;
  maxMessages: number;
  window: number;
  burst: number;
}

export interface MessageFormatting {
  template: string;
  variables: string[];
  markdown: boolean;
  html: boolean;
  customFields: Record<string, string>;
}

export interface ChannelFilter {
  severity: string[];
  regions: string[];
  categories: string[];
  tags: Record<string, string>;
}

export interface GlobalDashboard {
  id: string;
  name: string;
  description: string;
  category: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  timeRange: TimeRange;
  refreshInterval: number;
  regions: string[];
  permissions: DashboardPermission[];
  sharing: DashboardSharing;
  tags: string[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardLayout {
  type: 'grid' | 'flex' | 'custom';
  columns: number;
  rows: number;
  responsive: boolean;
  breakpoints: Record<string, number>;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'text' | 'map' | 'custom';
  title: string;
  configuration: WidgetConfig;
  position: WidgetPosition;
  size: WidgetSize;
  data: WidgetData;
  refresh: WidgetRefresh;
  interactions: WidgetInteraction[];
  permissions: string[];
  enabled: boolean;
}

export interface WidgetConfig {
  chartType?: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'gauge';
  metrics: string[];
  dimensions: string[];
  aggregations: string[];
  filters: Record<string, any>;
  colors: string[];
  legend: boolean;
  axes: AxisConfig[];
  customSettings: Record<string, any>;
}

export interface AxisConfig {
  type: 'x' | 'y' | 'z';
  label: string;
  scale: 'linear' | 'log' | 'time';
  min?: number;
  max?: number;
  format: string;
}

export interface WidgetPosition {
  x: number;
  y: number;
  z: number;
}

export interface WidgetSize {
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
}

export interface WidgetData {
  source: string;
  query: string;
  parameters: Record<string, any>;
  cache: boolean;
  cacheDuration: number;
  lastUpdated: Date;
}

export interface WidgetRefresh {
  enabled: boolean;
  interval: number;
  onView: boolean;
  onFilter: boolean;
  onTimeRange: boolean;
}

export interface WidgetInteraction {
  type: 'click' | 'hover' | 'select' | 'drill' | 'filter';
  action: string;
  target: string;
  parameters: Record<string, any>;
  enabled: boolean;
}

export interface DashboardFilter {
  id: string;
  name: string;
  type: 'select' | 'multiselect' | 'text' | 'date' | 'range' | 'boolean';
  field: string;
  options: FilterOption[];
  defaultValue: any;
  required: boolean;
  cascading: boolean;
  dependencies: string[];
}

export interface FilterOption {
  label: string;
  value: any;
  selected: boolean;
  disabled: boolean;
}

export interface TimeRange {
  start: Date;
  end: Date;
  relative: boolean;
  preset: string;
  timezone: string;
}

export interface DashboardPermission {
  user: string;
  role: string;
  permissions: string[];
  restrictions: string[];
}

export interface DashboardSharing {
  enabled: boolean;
  public: boolean;
  token: string;
  expiration: Date;
  permissions: string[];
}

export interface IncidentManagement {
  enabled: boolean;
  workflow: IncidentWorkflow;
  classification: IncidentClassification;
  notification: IncidentNotification;
  escalation: IncidentEscalation;
  resolution: IncidentResolution;
  postMortem: PostMortemConfig;
  integration: IncidentIntegration;
}

export interface IncidentWorkflow {
  states: WorkflowState[];
  transitions: WorkflowTransition[];
  automation: WorkflowAutomation;
  approval: WorkflowApproval;
}

export interface WorkflowState {
  id: string;
  name: string;
  description: string;
  type: 'initial' | 'intermediate' | 'final';
  actions: string[];
  notifications: string[];
  duration: number;
  escalation: boolean;
}

export interface WorkflowTransition {
  from: string;
  to: string;
  condition: string;
  action: string;
  automatic: boolean;
  permissions: string[];
}

export interface WorkflowAutomation {
  enabled: boolean;
  rules: AutomationRule[];
  triggers: AutomationTrigger[];
  actions: AutomationAction[];
}

export interface AutomationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  priority: number;
  enabled: boolean;
}

export interface AutomationTrigger {
  id: string;
  type: 'alert' | 'metric' | 'event' | 'schedule' | 'manual';
  configuration: Record<string, any>;
  enabled: boolean;
}

export interface AutomationAction {
  id: string;
  type: 'notification' | 'escalation' | 'remediation' | 'documentation';
  configuration: Record<string, any>;
  enabled: boolean;
}

export interface WorkflowApproval {
  required: boolean;
  approvers: string[];
  threshold: number;
  timeout: number;
  escalation: boolean;
}

export interface IncidentClassification {
  severity: SeverityLevel[];
  priority: PriorityLevel[];
  category: CategoryLevel[];
  impact: ImpactLevel[];
  urgency: UrgencyLevel[];
  automation: boolean;
}

export interface SeverityLevel {
  level: number;
  name: string;
  description: string;
  color: string;
  sla: number;
  escalation: boolean;
}

export interface PriorityLevel {
  level: number;
  name: string;
  description: string;
  color: string;
  sla: number;
}

export interface CategoryLevel {
  id: string;
  name: string;
  description: string;
  parent?: string;
  workflows: string[];
  teams: string[];
}

export interface ImpactLevel {
  level: number;
  name: string;
  description: string;
  scope: string;
  users: number;
  revenue: number;
}

export interface UrgencyLevel {
  level: number;
  name: string;
  description: string;
  timeframe: string;
  escalation: boolean;
}

export interface IncidentNotification {
  channels: NotificationChannel[];
  templates: NotificationTemplate[];
  escalation: NotificationEscalation;
  filtering: NotificationFiltering;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'slack' | 'webhook';
  template: string;
  variables: string[];
  conditions: string[];
  enabled: boolean;
}

export interface NotificationEscalation {
  enabled: boolean;
  levels: EscalationLevel[];
  timeout: number;
  maxLevel: number;
}

export interface NotificationFiltering {
  enabled: boolean;
  rules: FilterRule[];
  suppression: FilterSuppression;
}

export interface FilterRule {
  id: string;
  name: string;
  condition: string;
  action: 'allow' | 'deny' | 'modify';
  priority: number;
  enabled: boolean;
}

export interface FilterSuppression {
  enabled: boolean;
  duration: number;
  conditions: string[];
  exceptions: string[];
}

export interface IncidentEscalation {
  enabled: boolean;
  rules: EscalationRule[];
  levels: EscalationLevel[];
  automation: boolean;
  notifications: boolean;
}

export interface EscalationRule {
  id: string;
  name: string;
  condition: string;
  level: number;
  delay: number;
  enabled: boolean;
}

export interface IncidentResolution {
  workflow: ResolutionWorkflow;
  validation: ResolutionValidation;
  documentation: ResolutionDocumentation;
  communication: ResolutionCommunication;
}

export interface ResolutionWorkflow {
  steps: ResolutionStep[];
  approval: boolean;
  validation: boolean;
  documentation: boolean;
  communication: boolean;
}

export interface ResolutionStep {
  id: string;
  name: string;
  description: string;
  type: 'manual' | 'automated';
  action: string;
  validation: string;
  required: boolean;
  order: number;
}

export interface ResolutionValidation {
  enabled: boolean;
  checks: ValidationCheck[];
  timeout: number;
  retries: number;
}

export interface ValidationCheck {
  id: string;
  name: string;
  type: 'metric' | 'endpoint' | 'script' | 'manual';
  configuration: Record<string, any>;
  threshold: number;
  enabled: boolean;
}

export interface ResolutionDocumentation {
  required: boolean;
  template: string;
  fields: DocumentationField[];
  approval: boolean;
  sharing: boolean;
}

export interface DocumentationField {
  name: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'file';
  required: boolean;
  validation: string;
  options?: string[];
}

export interface ResolutionCommunication {
  enabled: boolean;
  channels: string[];
  template: string;
  audience: string[];
  approval: boolean;
}

export interface PostMortemConfig {
  enabled: boolean;
  trigger: PostMortemTrigger;
  template: PostMortemTemplate;
  process: PostMortemProcess;
  tracking: PostMortemTracking;
}

export interface PostMortemTrigger {
  automatic: boolean;
  conditions: string[];
  delay: number;
  assignment: string;
}

export interface PostMortemTemplate {
  sections: TemplateSection[];
  questions: TemplateQuestion[];
  attachments: boolean;
  collaboration: boolean;
}

export interface TemplateSection {
  id: string;
  name: string;
  description: string;
  required: boolean;
  order: number;
}

export interface TemplateQuestion {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'boolean';
  required: boolean;
  section: string;
  order: number;
}

export interface PostMortemProcess {
  review: boolean;
  approval: boolean;
  sharing: boolean;
  actionItems: boolean;
  tracking: boolean;
}

export interface PostMortemTracking {
  enabled: boolean;
  metrics: string[];
  reporting: boolean;
  integration: boolean;
}

export interface IncidentIntegration {
  ticketing: TicketingIntegration;
  communication: CommunicationIntegration;
  monitoring: MonitoringIntegration;
  automation: AutomationIntegration;
}

export interface TicketingIntegration {
  enabled: boolean;
  system: string;
  configuration: Record<string, any>;
  mapping: FieldMapping[];
  synchronization: boolean;
}

export interface FieldMapping {
  source: string;
  target: string;
  transformation: string;
  required: boolean;
}

export interface CommunicationIntegration {
  enabled: boolean;
  platforms: string[];
  templates: Record<string, string>;
  automation: boolean;
}

export interface MonitoringIntegration {
  enabled: boolean;
  systems: string[];
  correlation: boolean;
  enrichment: boolean;
}

export interface AutomationIntegration {
  enabled: boolean;
  tools: string[];
  workflows: string[];
  orchestration: boolean;
}

export interface ObservabilityConfig {
  tracing: TracingConfig;
  logging: LoggingConfig;
  metrics: MetricsConfig;
  profiling: ProfilingConfig;
  correlation: CorrelationConfig;
  analytics: AnalyticsConfig;
}

export interface TracingConfig {
  enabled: boolean;
  sampling: SamplingConfig;
  exporters: TracingExporter[];
  processors: TracingProcessor[];
  resources: TracingResource[];
  baggage: boolean;
  correlation: boolean;
}

export interface SamplingConfig {
  strategy: 'probabilistic' | 'rate-limiting' | 'adaptive' | 'custom';
  rate: number;
  maxTraces: number;
  rules: SamplingRule[];
}

export interface SamplingRule {
  service: string;
  operation: string;
  rate: number;
  conditions: string[];
  priority: number;
  enabled: boolean;
}

export interface TracingExporter {
  type: 'jaeger' | 'zipkin' | 'otlp' | 'custom';
  endpoint: string;
  configuration: Record<string, any>;
  enabled: boolean;
}

export interface TracingProcessor {
  type: 'batch' | 'simple' | 'sampling' | 'custom';
  configuration: Record<string, any>;
  enabled: boolean;
}

export interface TracingResource {
  name: string;
  value: string;
  type: 'static' | 'dynamic';
}

export interface LoggingConfig {
  enabled: boolean;
  level: 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  structured: boolean;
  correlation: boolean;
  sampling: LogSamplingConfig;
  processors: LogProcessor[];
  exporters: LogExporter[];
  retention: LogRetentionConfig;
}

export interface LogSamplingConfig {
  enabled: boolean;
  rate: number;
  rules: LogSamplingRule[];
}

export interface LogSamplingRule {
  level: string;
  service: string;
  rate: number;
  conditions: string[];
  enabled: boolean;
}

export interface LogProcessor {
  type: 'filter' | 'transform' | 'enrich' | 'custom';
  configuration: Record<string, any>;
  enabled: boolean;
}

export interface LogExporter {
  type: 'console' | 'file' | 'elasticsearch' | 'splunk' | 'custom';
  endpoint: string;
  configuration: Record<string, any>;
  enabled: boolean;
}

export interface LogRetentionConfig {
  enabled: boolean;
  duration: number;
  compression: boolean;
  archiving: boolean;
  policies: LogRetentionPolicy[];
}

export interface LogRetentionPolicy {
  level: string;
  service: string;
  duration: number;
  action: 'delete' | 'archive' | 'compress';
  enabled: boolean;
}

export interface MetricsConfig {
  enabled: boolean;
  collection: MetricsCollection;
  aggregation: MetricsAggregation;
  exporters: MetricsExporter[];
  retention: MetricsRetention;
}

export interface MetricsCollection {
  interval: number;
  timeout: number;
  retries: number;
  buffering: boolean;
  compression: boolean;
}

export interface MetricsAggregation {
  enabled: boolean;
  window: number;
  functions: string[];
  dimensions: string[];
}

export interface MetricsExporter {
  type: 'prometheus' | 'graphite' | 'influxdb' | 'custom';
  endpoint: string;
  configuration: Record<string, any>;
  enabled: boolean;
}

export interface MetricsRetention {
  enabled: boolean;
  duration: number;
  downsampling: boolean;
  policies: MetricsRetentionPolicy[];
}

export interface MetricsRetentionPolicy {
  metric: string;
  duration: number;
  resolution: number;
  aggregation: string;
  enabled: boolean;
}

export interface ProfilingConfig {
  enabled: boolean;
  types: string[];
  sampling: ProfilingSampling;
  exporters: ProfilingExporter[];
  analysis: ProfilingAnalysis;
}

export interface ProfilingSampling {
  cpu: number;
  memory: number;
  goroutine: number;
  block: number;
  mutex: number;
}

export interface ProfilingExporter {
  type: 'pprof' | 'jaeger' | 'custom';
  endpoint: string;
  configuration: Record<string, any>;
  enabled: boolean;
}

export interface ProfilingAnalysis {
  enabled: boolean;
  algorithms: string[];
  thresholds: Record<string, number>;
  reporting: boolean;
}

export interface CorrelationConfig {
  enabled: boolean;
  identifiers: string[];
  propagation: boolean;
  enrichment: boolean;
  analysis: CorrelationAnalysis;
}

export interface CorrelationAnalysis {
  enabled: boolean;
  algorithms: string[];
  timeWindow: number;
  confidence: number;
  reporting: boolean;
}

export interface AnalyticsConfig {
  enabled: boolean;
  engines: AnalyticsEngine[];
  models: AnalyticsModel[];
  reporting: AnalyticsReporting;
  alerting: AnalyticsAlerting;
}

export interface AnalyticsEngine {
  type: 'ml' | 'statistical' | 'rule-based' | 'custom';
  configuration: Record<string, any>;
  enabled: boolean;
}

export interface AnalyticsModel {
  id: string;
  name: string;
  type: 'anomaly-detection' | 'forecasting' | 'classification' | 'clustering';
  configuration: Record<string, any>;
  training: ModelTraining;
  validation: ModelValidation;
  enabled: boolean;
}

export interface ModelTraining {
  data: string;
  features: string[];
  algorithm: string;
  parameters: Record<string, any>;
  schedule: string;
  validation: number;
}

export interface ModelValidation {
  enabled: boolean;
  metrics: string[];
  threshold: number;
  frequency: string;
  alerts: boolean;
}

export interface AnalyticsReporting {
  enabled: boolean;
  frequency: string;
  recipients: string[];
  templates: string[];
  dashboards: string[];
}

export interface AnalyticsAlerting {
  enabled: boolean;
  models: string[];
  thresholds: Record<string, number>;
  channels: string[];
  suppression: boolean;
}

export interface MonitoringCompliance {
  regulations: ComplianceRegulation[];
  auditing: ComplianceAuditing;
  reporting: ComplianceReporting;
  retention: ComplianceRetention;
}

export interface ComplianceRegulation {
  id: string;
  name: string;
  requirements: string[];
  controls: string[];
  monitoring: boolean;
  reporting: boolean;
  enabled: boolean;
}

export interface ComplianceAuditing {
  enabled: boolean;
  frequency: string;
  scope: string[];
  automation: boolean;
  reporting: boolean;
}

export interface ComplianceReporting {
  enabled: boolean;
  regulations: string[];
  frequency: string;
  recipients: string[];
  templates: string[];
}

export interface ComplianceRetention {
  enabled: boolean;
  regulations: string[];
  duration: number;
  encryption: boolean;
  immutability: boolean;
}

export interface DataRetentionConfig {
  enabled: boolean;
  policies: DataRetentionPolicy[];
  automation: boolean;
  monitoring: boolean;
  reporting: boolean;
}

export interface DataRetentionPolicy {
  id: string;
  name: string;
  dataType: string;
  duration: number;
  action: 'delete' | 'archive' | 'compress';
  conditions: string[];
  enabled: boolean;
}

export interface MonitoringIntegration {
  id: string;
  name: string;
  type: 'metrics' | 'logs' | 'traces' | 'events' | 'tickets' | 'communication';
  configuration: IntegrationConfig;
  authentication: AuthConfig;
  mapping: IntegrationMapping;
  synchronization: IntegrationSync;
  enabled: boolean;
}

export interface IntegrationConfig {
  endpoint: string;
  method: string;
  format: string;
  compression: boolean;
  encryption: boolean;
  customSettings: Record<string, any>;
}

export interface IntegrationMapping {
  fields: FieldMapping[];
  transformations: DataTransformation[];
  enrichments: DataEnrichment[];
  filtering: DataFiltering;
}

export interface DataEnrichment {
  id: string;
  name: string;
  type: 'lookup' | 'calculation' | 'external' | 'custom';
  configuration: Record<string, any>;
  enabled: boolean;
}

export interface DataFiltering {
  enabled: boolean;
  rules: FilterRule[];
  defaultAction: 'allow' | 'deny';
}

export interface IntegrationSync {
  enabled: boolean;
  frequency: string;
  batchSize: number;
  retries: number;
  errorHandling: string;
}

export class GlobalMonitoringObservability {
  private static instance: GlobalMonitoringObservability;
  private configurations: Map<string, GlobalMonitoringConfig> = new Map();
  private activeAlerts: Map<string, GlobalAlert[]> = new Map();
  private metrics: Map<string, MetricHistory[]> = new Map();
  private dashboards: Map<string, GlobalDashboard> = new Map();

  private constructor() {
    this.initializeDefaultConfig();
    this.startMonitoring();
  }

  public static getInstance(): GlobalMonitoringObservability {
    if (!GlobalMonitoringObservability.instance) {
      GlobalMonitoringObservability.instance = new GlobalMonitoringObservability();
    }
    return GlobalMonitoringObservability.instance;
  }

  private initializeDefaultConfig(): void {
    const defaultConfig: GlobalMonitoringConfig = {
      id: 'global-monitoring',
      name: 'Global Monitoring & Observability',
      description: 'Comprehensive global monitoring and observability system',
      regions: [],
      metrics: [],
      alerts: [],
      dashboards: [],
      incidents: {
        enabled: true,
        workflow: {
          states: [],
          transitions: [],
          automation: {
            enabled: true,
            rules: [],
            triggers: [],
            actions: []
          },
          approval: {
            required: false,
            approvers: [],
            threshold: 1,
            timeout: 3600,
            escalation: true
          }
        },
        classification: {
          severity: [
            { level: 1, name: 'Critical', description: 'System down', color: '#FF0000', sla: 15, escalation: true },
            { level: 2, name: 'High', description: 'Major impact', color: '#FF8C00', sla: 60, escalation: true },
            { level: 3, name: 'Medium', description: 'Minor impact', color: '#FFD700', sla: 240, escalation: false },
            { level: 4, name: 'Low', description: 'Minimal impact', color: '#32CD32', sla: 1440, escalation: false }
          ],
          priority: [
            { level: 1, name: 'Urgent', description: 'Immediate action required', color: '#FF0000', sla: 30 },
            { level: 2, name: 'High', description: 'Action required soon', color: '#FF8C00', sla: 120 },
            { level: 3, name: 'Medium', description: 'Action required', color: '#FFD700', sla: 480 },
            { level: 4, name: 'Low', description: 'Action when convenient', color: '#32CD32', sla: 2880 }
          ],
          category: [],
          impact: [
            { level: 1, name: 'Widespread', description: 'Affects all users', scope: 'global', users: 1000000, revenue: 100000 },
            { level: 2, name: 'Significant', description: 'Affects many users', scope: 'regional', users: 100000, revenue: 10000 },
            { level: 3, name: 'Moderate', description: 'Affects some users', scope: 'local', users: 10000, revenue: 1000 },
            { level: 4, name: 'Minor', description: 'Affects few users', scope: 'individual', users: 1000, revenue: 100 }
          ],
          urgency: [
            { level: 1, name: 'Immediate', description: 'Fix now', timeframe: '15 minutes', escalation: true },
            { level: 2, name: 'Soon', description: 'Fix within hour', timeframe: '1 hour', escalation: true },
            { level: 3, name: 'Later', description: 'Fix within day', timeframe: '24 hours', escalation: false },
            { level: 4, name: 'Eventually', description: 'Fix when convenient', timeframe: '1 week', escalation: false }
          ],
          automation: true
        },
        notification: {
          channels: [],
          templates: [],
          escalation: {
            enabled: true,
            levels: [],
            timeout: 3600,
            maxLevel: 3
          },
          filtering: {
            enabled: true,
            rules: [],
            suppression: {
              enabled: true,
              duration: 300,
              conditions: [],
              exceptions: []
            }
          }
        },
        escalation: {
          enabled: true,
          rules: [],
          levels: [],
          automation: true,
          notifications: true
        },
        resolution: {
          workflow: {
            steps: [],
            approval: false,
            validation: true,
            documentation: true,
            communication: true
          },
          validation: {
            enabled: true,
            checks: [],
            timeout: 300,
            retries: 3
          },
          documentation: {
            required: true,
            template: 'default',
            fields: [],
            approval: false,
            sharing: true
          },
          communication: {
            enabled: true,
            channels: [],
            template: 'default',
            audience: [],
            approval: false
          }
        },
        postMortem: {
          enabled: true,
          trigger: {
            automatic: true,
            conditions: ['severity <= 2'],
            delay: 3600,
            assignment: 'auto'
          },
          template: {
            sections: [],
            questions: [],
            attachments: true,
            collaboration: true
          },
          process: {
            review: true,
            approval: true,
            sharing: true,
            actionItems: true,
            tracking: true
          },
          tracking: {
            enabled: true,
            metrics: [],
            reporting: true,
            integration: true
          }
        },
        integration: {
          ticketing: {
            enabled: false,
            system: '',
            configuration: {},
            mapping: [],
            synchronization: false
          },
          communication: {
            enabled: true,
            platforms: [],
            templates: {},
            automation: true
          },
          monitoring: {
            enabled: true,
            systems: [],
            correlation: true,
            enrichment: true
          },
          automation: {
            enabled: true,
            tools: [],
            workflows: [],
            orchestration: true
          }
        }
      },
      observability: {
        tracing: {
          enabled: true,
          sampling: {
            strategy: 'probabilistic',
            rate: 0.1,
            maxTraces: 10000,
            rules: []
          },
          exporters: [],
          processors: [],
          resources: [],
          baggage: true,
          correlation: true
        },
        logging: {
          enabled: true,
          level: 'info',
          structured: true,
          correlation: true,
          sampling: {
            enabled: true,
            rate: 1.0,
            rules: []
          },
          processors: [],
          exporters: [],
          retention: {
            enabled: true,
            duration: 30,
            compression: true,
            archiving: true,
            policies: []
          }
        },
        metrics: {
          enabled: true,
          collection: {
            interval: 60,
            timeout: 30,
            retries: 3,
            buffering: true,
            compression: true
          },
          aggregation: {
            enabled: true,
            window: 300,
            functions: ['avg', 'sum', 'min', 'max', 'count'],
            dimensions: ['region', 'service', 'instance']
          },
          exporters: [],
          retention: {
            enabled: true,
            duration: 90,
            downsampling: true,
            policies: []
          }
        },
        profiling: {
          enabled: false,
          types: ['cpu', 'memory', 'goroutine'],
          sampling: {
            cpu: 100,
            memory: 10,
            goroutine: 1,
            block: 1,
            mutex: 1
          },
          exporters: [],
          analysis: {
            enabled: true,
            algorithms: ['flamegraph', 'topk'],
            thresholds: {},
            reporting: true
          }
        },
        correlation: {
          enabled: true,
          identifiers: ['trace_id', 'span_id', 'correlation_id'],
          propagation: true,
          enrichment: true,
          analysis: {
            enabled: true,
            algorithms: ['temporal', 'causal'],
            timeWindow: 300,
            confidence: 0.8,
            reporting: true
          }
        },
        analytics: {
          enabled: true,
          engines: [],
          models: [],
          reporting: {
            enabled: true,
            frequency: 'daily',
            recipients: [],
            templates: [],
            dashboards: []
          },
          alerting: {
            enabled: true,
            models: [],
            thresholds: {},
            channels: [],
            suppression: true
          }
        }
      },
      compliance: {
        regulations: [],
        auditing: {
          enabled: true,
          frequency: 'monthly',
          scope: [],
          automation: true,
          reporting: true
        },
        reporting: {
          enabled: true,
          regulations: [],
          frequency: 'monthly',
          recipients: [],
          templates: []
        },
        retention: {
          enabled: true,
          regulations: [],
          duration: 2555,
          encryption: true,
          immutability: true
        }
      },
      retention: {
        enabled: true,
        policies: [],
        automation: true,
        monitoring: true,
        reporting: true
      },
      integrations: [],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.configurations.set('global-monitoring', defaultConfig);
  }

  private startMonitoring(): void {
    setInterval(() => {
      this.collectGlobalMetrics();
      this.evaluateAlerts();
      this.updateDashboards();
    }, 30000); // Every 30 seconds
  }

  private async collectGlobalMetrics(): Promise<void> {
    const startTime = performance.now();
    
    try {
      for (const [configId, config] of this.configurations) {
        for (const metric of config.metrics) {
          const metricData = await this.generateMetricData(metric);
          
          if (!this.metrics.has(metric.id)) {
            this.metrics.set(metric.id, []);
          }
          
          const history = this.metrics.get(metric.id)!;
          history.push(metricData);
          
          // Keep only last 1000 data points
          if (history.length > 1000) {
            history.shift();
          }
          
          // Update metric statistics
          metric.statistics = this.calculateMetricStatistics(history);
          metric.lastUpdated = new Date();
        }
      }
    } catch (error) {
      console.error('Global metrics collection failed:', error);
    }
    
    const duration = performance.now() - startTime;
    eventBus.emit('global-metrics-collected', { duration });
  }

  private async generateMetricData(metric: GlobalMetric): Promise<MetricHistory> {
    // Generate realistic metric data based on type
    let value: number;
    
    switch (metric.type) {
      case 'counter':
        value = Math.floor(Math.random() * 1000) + 100;
        break;
      case 'gauge':
        value = Math.floor(Math.random() * 100);
        break;
      case 'histogram':
        value = Math.floor(Math.random() * 500) + 50;
        break;
      case 'rate':
        value = Math.random() * 10;
        break;
      default:
        value = Math.floor(Math.random() * 100);
    }
    
    return {
      timestamp: new Date(),
      value,
      region: metric.regions[Math.floor(Math.random() * metric.regions.length)] || 'global',
      tags: {
        category: metric.category,
        priority: metric.priority,
        source: metric.source
      }
    };
  }

  private calculateMetricStatistics(history: MetricHistory[]): MetricStatistics {
    if (history.length === 0) {
      return {
        current: 0,
        average: 0,
        minimum: 0,
        maximum: 0,
        trend: 'stable',
        changeRate: 0,
        lastCalculated: new Date()
      };
    }
    
    const values = history.map(h => h.value);
    const current = values[values.length - 1];
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;
    const minimum = Math.min(...values);
    const maximum = Math.max(...values);
    
    // Calculate trend
    const recentValues = values.slice(-10);
    const olderValues = values.slice(-20, -10);
    
    const recentAvg = recentValues.reduce((sum, val) => sum + val, 0) / recentValues.length;
    const olderAvg = olderValues.reduce((sum, val) => sum + val, 0) / olderValues.length;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    let changeRate = 0;
    
    if (recentValues.length > 0 && olderValues.length > 0) {
      changeRate = ((recentAvg - olderAvg) / olderAvg) * 100;
      
      if (changeRate > 5) {
        trend = 'up';
      } else if (changeRate < -5) {
        trend = 'down';
      }
    }
    
    return {
      current,
      average,
      minimum,
      maximum,
      trend,
      changeRate,
      lastCalculated: new Date()
    };
  }

  private async evaluateAlerts(): Promise<void> {
    const startTime = performance.now();
    
    try {
      for (const [configId, config] of this.configurations) {
        for (const alert of config.alerts) {
          if (!alert.enabled) continue;
          
          const shouldTrigger = await this.evaluateAlertCondition(alert);
          
          if (shouldTrigger && alert.status !== 'active') {
            await this.triggerAlert(alert);
          } else if (!shouldTrigger && alert.status === 'active') {
            await this.resolveAlert(alert);
          }
        }
      }
    } catch (error) {
      console.error('Alert evaluation failed:', error);
    }
    
    const duration = performance.now() - startTime;
    eventBus.emit('alerts-evaluated', { duration });
  }

  private async evaluateAlertCondition(alert: GlobalAlert): Promise<boolean> {
    const metric = await this.getMetricByName(alert.condition.metric);
    if (!metric) return false;
    
    const history = this.metrics.get(metric.id);
    if (!history || history.length === 0) return false;
    
    const recentValues = history.slice(-Math.max(1, Math.floor(alert.condition.duration / 60)));
    
    let aggregatedValue: number;
    
    switch (alert.condition.aggregation) {
      case 'avg':
        aggregatedValue = recentValues.reduce((sum, h) => sum + h.value, 0) / recentValues.length;
        break;
      case 'sum':
        aggregatedValue = recentValues.reduce((sum, h) => sum + h.value, 0);
        break;
      case 'min':
        aggregatedValue = Math.min(...recentValues.map(h => h.value));
        break;
      case 'max':
        aggregatedValue = Math.max(...recentValues.map(h => h.value));
        break;
      case 'count':
        aggregatedValue = recentValues.length;
        break;
      default:
        aggregatedValue = recentValues[recentValues.length - 1]?.value || 0;
    }
    
    switch (alert.condition.operator) {
      case 'gt':
        return aggregatedValue > alert.condition.threshold;
      case 'lt':
        return aggregatedValue < alert.condition.threshold;
      case 'gte':
        return aggregatedValue >= alert.condition.threshold;
      case 'lte':
        return aggregatedValue <= alert.condition.threshold;
      case 'eq':
        return aggregatedValue === alert.condition.threshold;
      case 'neq':
        return aggregatedValue !== alert.condition.threshold;
      default:
        return false;
    }
  }

  private async getMetricByName(name: string): Promise<GlobalMetric | null> {
    for (const [configId, config] of this.configurations) {
      const metric = config.metrics.find(m => m.name === name);
      if (metric) return metric;
    }
    return null;
  }

  private async triggerAlert(alert: GlobalAlert): Promise<void> {
    alert.status = 'active';
    
    const alertHistory: AlertHistory = {
      timestamp: new Date(),
      status: 'triggered',
      value: 0, // Would be populated with actual metric value
      message: `Alert ${alert.name} triggered`,
      escalation: false
    };
    
    alert.history.push(alertHistory);
    alert.statistics.triggered++;
    alert.statistics.lastTriggered = new Date();
    
    // Execute alert actions
    for (const action of alert.actions) {
      if (action.enabled) {
        await this.executeAlertAction(action, alert);
      }
    }
    
    eventBus.emit('alert-triggered', { alertId: alert.id, name: alert.name, severity: alert.severity });
  }

  private async resolveAlert(alert: GlobalAlert): Promise<void> {
    alert.status = 'resolved';
    
    const alertHistory: AlertHistory = {
      timestamp: new Date(),
      status: 'resolved',
      value: 0, // Would be populated with actual metric value
      message: `Alert ${alert.name} resolved`,
      escalation: false
    };
    
    alert.history.push(alertHistory);
    alert.statistics.resolved++;
    
    // Calculate duration
    const lastTriggered = alert.history.slice().reverse().find(h => h.status === 'triggered');
    if (lastTriggered) {
      const duration = new Date().getTime() - lastTriggered.timestamp.getTime();
      alert.statistics.averageDuration = (alert.statistics.averageDuration + duration) / 2;
    }
    
    eventBus.emit('alert-resolved', { alertId: alert.id, name: alert.name, severity: alert.severity });
  }

  private async executeAlertAction(action: AlertAction, alert: GlobalAlert): Promise<void> {
    try {
      switch (action.type) {
        case 'notification':
          await this.sendNotification(action, alert);
          break;
        case 'webhook':
          await this.callWebhook(action, alert);
          break;
        case 'script':
          await this.executeScript(action, alert);
          break;
        case 'api':
          await this.callAPI(action, alert);
          break;
        case 'ticket':
          await this.createTicket(action, alert);
          break;
        case 'escalation':
          await this.escalateAlert(action, alert);
          break;
      }
    } catch (error) {
      console.error(`Alert action ${action.type} failed:`, error);
    }
  }

  private async sendNotification(action: AlertAction, alert: GlobalAlert): Promise<void> {
    // Simulate notification sending
    await new Promise(resolve => setTimeout(resolve, 100));
    eventBus.emit('notification-sent', { alertId: alert.id, action: action.type });
  }

  private async callWebhook(action: AlertAction, alert: GlobalAlert): Promise<void> {
    // Simulate webhook call
    await new Promise(resolve => setTimeout(resolve, 200));
    eventBus.emit('webhook-called', { alertId: alert.id, url: action.configuration.url });
  }

  private async executeScript(action: AlertAction, alert: GlobalAlert): Promise<void> {
    // Simulate script execution
    await new Promise(resolve => setTimeout(resolve, 500));
    eventBus.emit('script-executed', { alertId: alert.id, script: action.configuration.script });
  }

  private async callAPI(action: AlertAction, alert: GlobalAlert): Promise<void> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    eventBus.emit('api-called', { alertId: alert.id, url: action.configuration.url });
  }

  private async createTicket(action: AlertAction, alert: GlobalAlert): Promise<void> {
    // Simulate ticket creation
    await new Promise(resolve => setTimeout(resolve, 400));
    eventBus.emit('ticket-created', { alertId: alert.id, system: 'ticketing' });
  }

  private async escalateAlert(action: AlertAction, alert: GlobalAlert): Promise<void> {
    // Simulate alert escalation
    await new Promise(resolve => setTimeout(resolve, 150));
    eventBus.emit('alert-escalated', { alertId: alert.id, level: alert.escalation.levels.length + 1 });
  }

  private async updateDashboards(): Promise<void> {
    const startTime = performance.now();
    
    try {
      for (const [dashboardId, dashboard] of this.dashboards) {
        if (!dashboard.enabled) continue;
        
        for (const widget of dashboard.widgets) {
          if (widget.enabled && widget.refresh.enabled) {
            await this.updateWidget(widget);
          }
        }
      }
    } catch (error) {
      console.error('Dashboard update failed:', error);
    }
    
    const duration = performance.now() - startTime;
    eventBus.emit('dashboards-updated', { duration });
  }

  private async updateWidget(widget: DashboardWidget): Promise<void> {
    // Simulate widget data update
    widget.data.lastUpdated = new Date();
    eventBus.emit('widget-updated', { widgetId: widget.id, type: widget.type });
  }

  public async createGlobalMonitoringConfig(config: Omit<GlobalMonitoringConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const startTime = performance.now();
    const configId = `monitoring-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const monitoringConfig: GlobalMonitoringConfig = {
        ...config,
        id: configId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.configurations.set(configId, monitoringConfig);
      
      const duration = performance.now() - startTime;
      eventBus.emit('global-monitoring-config-created', { configId, duration });
      
      return configId;
    } catch (error) {
      const duration = performance.now() - startTime;
      eventBus.emit('global-monitoring-config-creation-failed', { error: error.message, duration });
      throw error;
    }
  }

  public async getGlobalMonitoringConfig(configId: string): Promise<GlobalMonitoringConfig | null> {
    return this.configurations.get(configId) || null;
  }

  public async listGlobalMonitoringConfigs(): Promise<GlobalMonitoringConfig[]> {
    return Array.from(this.configurations.values());
  }

  public async getActiveAlerts(configId?: string): Promise<GlobalAlert[]> {
    const allAlerts: GlobalAlert[] = [];
    
    for (const [id, config] of this.configurations) {
      if (configId && id !== configId) continue;
      
      const activeAlerts = config.alerts.filter(alert => alert.status === 'active');
      allAlerts.push(...activeAlerts);
    }
    
    return allAlerts;
  }

  public async getMetricHistory(metricId: string, timeRange?: { start: Date; end: Date }): Promise<MetricHistory[]> {
    const history = this.metrics.get(metricId) || [];
    
    if (!timeRange) {
      return history;
    }
    
    return history.filter(h => 
      h.timestamp >= timeRange.start && h.timestamp <= timeRange.end
    );
  }

  public async createGlobalDashboard(dashboard: Omit<GlobalDashboard, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const startTime = performance.now();
    const dashboardId = `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const globalDashboard: GlobalDashboard = {
        ...dashboard,
        id: dashboardId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.dashboards.set(dashboardId, globalDashboard);
      
      const duration = performance.now() - startTime;
      eventBus.emit('global-dashboard-created', { dashboardId, duration });
      
      return dashboardId;
    } catch (error) {
      const duration = performance.now() - startTime;
      eventBus.emit('global-dashboard-creation-failed', { error: error.message, duration });
      throw error;
    }
  }

  public async getGlobalDashboard(dashboardId: string): Promise<GlobalDashboard | null> {
    return this.dashboards.get(dashboardId) || null;
  }

  public async listGlobalDashboards(): Promise<GlobalDashboard[]> {
    return Array.from(this.dashboards.values());
  }

  public async getGlobalMonitoringMetrics(): Promise<{
    totalConfigurations: number;
    activeConfigurations: number;
    totalMetrics: number;
    activeAlerts: number;
    totalDashboards: number;
    regionStatus: Record<string, string>;
    systemHealth: number;
    averageLatency: number;
  }> {
    const configurations = Array.from(this.configurations.values());
    const totalConfigurations = configurations.length;
    const activeConfigurations = configurations.filter(c => c.status === 'active').length;
    
    let totalMetrics = 0;
    let activeAlerts = 0;
    const regionStatus: Record<string, string> = {};
    
    for (const config of configurations) {
      totalMetrics += config.metrics.length;
      activeAlerts += config.alerts.filter(a => a.status === 'active').length;
      
      for (const region of config.regions) {
        regionStatus[region.regionId] = region.status;
      }
    }
    
    const totalDashboards = this.dashboards.size;
    
    // Calculate system health (percentage of healthy regions)
    const regionStatuses = Object.values(regionStatus);
    const healthyRegions = regionStatuses.filter(status => status === 'active').length;
    const systemHealth = regionStatuses.length > 0 ? (healthyRegions / regionStatuses.length) * 100 : 100;
    
    // Calculate average latency
    const averageLatency = configurations.reduce((sum, config) => {
      const regionLatencies = config.regions.map(r => r.latency);
      const configAvg = regionLatencies.reduce((s, l) => s + l, 0) / regionLatencies.length;
      return sum + (configAvg || 0);
    }, 0) / configurations.length;
    
    return {
      totalConfigurations,
      activeConfigurations,
      totalMetrics,
      activeAlerts,
      totalDashboards,
      regionStatus,
      systemHealth,
      averageLatency
    };
  }
}

export const globalMonitoringObservability = GlobalMonitoringObservability.getInstance();
