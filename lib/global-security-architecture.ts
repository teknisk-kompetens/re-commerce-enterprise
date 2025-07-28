
/**
 * GLOBAL SECURITY ARCHITECTURE
 * Multi-region security monitoring, global identity management, and cross-region security coordination
 */

import { eventBus } from '@/lib/event-bus-system';
import { performance } from 'perf_hooks';
import { GlobalRegion } from '@/lib/global-deployment-orchestrator';

export interface GlobalSecurityConfig {
  id: string;
  name: string;
  description: string;
  regions: SecurityRegion[];
  identity: GlobalIdentityManagement;
  threatDetection: ThreatDetectionSystem;
  compliance: ComplianceFramework;
  encryption: EncryptionManagement;
  monitoring: SecurityMonitoring;
  incident: IncidentResponse;
  governance: SecurityGovernance;
  policies: SecurityPolicy[];
  controls: SecurityControl[];
  assessments: SecurityAssessment[];
  status: 'active' | 'inactive' | 'updating' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

export interface SecurityRegion {
  regionId: string;
  name: string;
  provider: string;
  status: 'active' | 'inactive' | 'degraded' | 'compromised';
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  threats: ThreatLevel[];
  vulnerabilities: VulnerabilityLevel[];
  controls: RegionSecurityControl[];
  monitoring: RegionSecurityMonitoring;
  compliance: RegionCompliance;
  incidents: SecurityIncident[];
  metrics: SecurityMetrics;
  lastAssessment: Date;
  nextAssessment: Date;
  certifications: SecurityCertification[];
  policies: RegionSecurityPolicy[];
}

export interface ThreatLevel {
  type: 'malware' | 'phishing' | 'ddos' | 'intrusion' | 'data-breach' | 'insider' | 'supply-chain';
  level: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  sources: string[];
  indicators: ThreatIndicator[];
  mitigations: string[];
  lastUpdated: Date;
  active: boolean;
}

export interface ThreatIndicator {
  type: 'ip' | 'domain' | 'hash' | 'url' | 'email' | 'pattern' | 'behavior';
  value: string;
  confidence: number;
  source: string;
  firstSeen: Date;
  lastSeen: Date;
  count: number;
  context: Record<string, any>;
}

export interface VulnerabilityLevel {
  id: string;
  cve: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  category: 'software' | 'configuration' | 'network' | 'physical' | 'process';
  description: string;
  impact: string;
  exploitability: number;
  remediation: string;
  status: 'open' | 'patched' | 'mitigated' | 'accepted';
  discoveredAt: Date;
  patchedAt?: Date;
  affectedSystems: string[];
  references: string[];
}

export interface RegionSecurityControl {
  id: string;
  name: string;
  type: 'preventive' | 'detective' | 'corrective' | 'compensating';
  category: 'access' | 'network' | 'data' | 'application' | 'infrastructure';
  implementation: 'manual' | 'automated' | 'hybrid';
  status: 'active' | 'inactive' | 'degraded' | 'failed';
  effectiveness: number;
  coverage: number;
  lastTested: Date;
  nextTest: Date;
  configuration: ControlConfiguration;
  metrics: ControlMetrics;
  dependencies: string[];
}

export interface ControlConfiguration {
  enabled: boolean;
  parameters: Record<string, any>;
  thresholds: Record<string, number>;
  actions: string[];
  notifications: string[];
  automation: boolean;
  logging: boolean;
  monitoring: boolean;
}

export interface ControlMetrics {
  activations: number;
  blocks: number;
  alerts: number;
  falsePositives: number;
  falseNegatives: number;
  effectiveness: number;
  latency: number;
  throughput: number;
  errors: number;
  lastUpdated: Date;
}

export interface RegionSecurityMonitoring {
  enabled: boolean;
  sensors: SecuritySensor[];
  analytics: SecurityAnalytics;
  alerting: SecurityAlerting;
  reporting: SecurityReporting;
  integration: SecurityIntegration;
  automation: SecurityAutomation;
}

export interface SecuritySensor {
  id: string;
  name: string;
  type: 'network' | 'endpoint' | 'application' | 'database' | 'cloud' | 'custom';
  status: 'active' | 'inactive' | 'error';
  location: string;
  configuration: SensorConfiguration;
  metrics: SensorMetrics;
  data: SensorData[];
  alerts: SensorAlert[];
  lastHeartbeat: Date;
}

export interface SensorConfiguration {
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high';
  filters: SensorFilter[];
  rules: SensorRule[];
  actions: SensorAction[];
  retention: number;
  compression: boolean;
  encryption: boolean;
}

export interface SensorFilter {
  id: string;
  name: string;
  type: 'include' | 'exclude' | 'transform';
  condition: string;
  action: string;
  enabled: boolean;
}

export interface SensorRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  statistics: RuleStatistics;
}

export interface RuleStatistics {
  triggers: number;
  matches: number;
  falsePositives: number;
  lastTriggered: Date;
  averageLatency: number;
}

export interface SensorAction {
  id: string;
  type: 'alert' | 'block' | 'quarantine' | 'log' | 'notify' | 'remediate';
  configuration: Record<string, any>;
  enabled: boolean;
  priority: number;
}

export interface SensorMetrics {
  events: number;
  alerts: number;
  blocks: number;
  throughput: number;
  latency: number;
  errors: number;
  uptime: number;
  lastUpdated: Date;
}

export interface SensorData {
  timestamp: Date;
  type: string;
  source: string;
  data: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
  processed: boolean;
  archived: boolean;
}

export interface SensorAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
  assignee: string;
  context: Record<string, any>;
}

export interface SecurityAnalytics {
  enabled: boolean;
  engines: AnalyticsEngine[];
  models: AnalyticsModel[];
  pipelines: AnalyticsPipeline[];
  correlation: AnalyticsCorrelation;
  prediction: AnalyticsPrediction;
  reporting: AnalyticsReporting;
}

export interface AnalyticsEngine {
  id: string;
  name: string;
  type: 'rule-based' | 'ml' | 'statistical' | 'behavior' | 'signature';
  status: 'active' | 'inactive' | 'training' | 'error';
  configuration: EngineConfiguration;
  performance: EnginePerformance;
  results: AnalyticsResult[];
  lastRun: Date;
  nextRun: Date;
}

export interface EngineConfiguration {
  enabled: boolean;
  parameters: Record<string, any>;
  thresholds: Record<string, number>;
  training: TrainingConfiguration;
  evaluation: EvaluationConfiguration;
  deployment: DeploymentConfiguration;
}

export interface TrainingConfiguration {
  enabled: boolean;
  schedule: string;
  datasets: string[];
  validation: number;
  features: string[];
  algorithms: string[];
  hyperparameters: Record<string, any>;
}

export interface EvaluationConfiguration {
  enabled: boolean;
  metrics: string[];
  thresholds: Record<string, number>;
  validation: ValidationConfiguration;
  testing: TestingConfiguration;
}

export interface ValidationConfiguration {
  enabled: boolean;
  method: 'holdout' | 'k-fold' | 'bootstrap';
  ratio: number;
  stratified: boolean;
  shuffle: boolean;
}

export interface TestingConfiguration {
  enabled: boolean;
  datasets: string[];
  scenarios: string[];
  adversarial: boolean;
  performance: boolean;
}

export interface DeploymentConfiguration {
  enabled: boolean;
  strategy: 'blue-green' | 'canary' | 'rolling';
  rollback: boolean;
  monitoring: boolean;
  approval: boolean;
}

export interface EnginePerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  latency: number;
  throughput: number;
  lastEvaluated: Date;
}

export interface AnalyticsResult {
  id: string;
  type: 'anomaly' | 'threat' | 'vulnerability' | 'compliance' | 'risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  description: string;
  evidence: ResultEvidence[];
  recommendations: string[];
  timestamp: Date;
  status: 'new' | 'investigating' | 'confirmed' | 'false-positive' | 'resolved';
  assignee: string;
  resolution: string;
}

export interface ResultEvidence {
  type: 'log' | 'metric' | 'event' | 'indicator' | 'correlation';
  source: string;
  data: Record<string, any>;
  timestamp: Date;
  relevance: number;
}

export interface AnalyticsModel {
  id: string;
  name: string;
  type: 'classification' | 'regression' | 'clustering' | 'anomaly-detection' | 'forecasting';
  algorithm: string;
  version: string;
  status: 'active' | 'inactive' | 'training' | 'evaluating' | 'deployed';
  features: ModelFeature[];
  performance: ModelPerformance;
  training: ModelTraining;
  deployment: ModelDeployment;
  monitoring: ModelMonitoring;
}

export interface ModelFeature {
  name: string;
  type: 'numeric' | 'categorical' | 'text' | 'boolean' | 'datetime';
  importance: number;
  transformation: string;
  encoding: string;
  scaling: boolean;
}

export interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  confusionMatrix: number[][];
  featureImportance: Record<string, number>;
  lastEvaluated: Date;
}

export interface ModelTraining {
  dataset: string;
  algorithm: string;
  hyperparameters: Record<string, any>;
  validation: ValidationConfiguration;
  startTime: Date;
  endTime: Date;
  duration: number;
  iterations: number;
  loss: number;
  convergence: boolean;
}

export interface ModelDeployment {
  environment: 'development' | 'staging' | 'production';
  strategy: 'immediate' | 'gradual' | 'canary';
  rollback: boolean;
  monitoring: boolean;
  approval: boolean;
  deployedAt: Date;
  version: string;
  endpoints: string[];
}

export interface ModelMonitoring {
  enabled: boolean;
  drift: DriftMonitoring;
  performance: PerformanceMonitoring;
  alerts: ModelAlert[];
  retraining: RetrainingConfiguration;
}

export interface DriftMonitoring {
  enabled: boolean;
  threshold: number;
  window: number;
  methods: string[];
  alerts: boolean;
  retraining: boolean;
}

export interface PerformanceMonitoring {
  enabled: boolean;
  metrics: string[];
  thresholds: Record<string, number>;
  alerts: boolean;
  dashboards: string[];
}

export interface ModelAlert {
  id: string;
  type: 'drift' | 'performance' | 'error' | 'resource';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
}

export interface RetrainingConfiguration {
  enabled: boolean;
  trigger: 'scheduled' | 'drift' | 'performance' | 'manual';
  schedule: string;
  thresholds: Record<string, number>;
  approval: boolean;
  automation: boolean;
}

export interface AnalyticsPipeline {
  id: string;
  name: string;
  description: string;
  stages: PipelineStage[];
  schedule: string;
  status: 'active' | 'inactive' | 'running' | 'error';
  lastRun: Date;
  nextRun: Date;
  metrics: PipelineMetrics;
  configuration: PipelineConfiguration;
}

export interface PipelineStage {
  id: string;
  name: string;
  type: 'ingestion' | 'transformation' | 'enrichment' | 'analysis' | 'output';
  configuration: Record<string, any>;
  dependencies: string[];
  timeout: number;
  retries: number;
  enabled: boolean;
  metrics: StageMetrics;
}

export interface StageMetrics {
  executions: number;
  successes: number;
  failures: number;
  averageDuration: number;
  throughput: number;
  errors: StageError[];
  lastExecution: Date;
}

export interface StageError {
  timestamp: Date;
  type: string;
  message: string;
  stack: string;
  context: Record<string, any>;
  resolved: boolean;
}

export interface PipelineMetrics {
  executions: number;
  successes: number;
  failures: number;
  averageDuration: number;
  throughput: number;
  dataProcessed: number;
  alertsGenerated: number;
  lastExecution: Date;
}

export interface PipelineConfiguration {
  enabled: boolean;
  parallelism: number;
  retries: number;
  timeout: number;
  resources: ResourceConfiguration;
  monitoring: boolean;
  logging: boolean;
  alerting: boolean;
}

export interface ResourceConfiguration {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
  scaling: boolean;
  limits: ResourceLimits;
}

export interface ResourceLimits {
  maxCpu: number;
  maxMemory: number;
  maxStorage: number;
  maxNetwork: number;
  maxDuration: number;
}

export interface AnalyticsCorrelation {
  enabled: boolean;
  engines: CorrelationEngine[];
  rules: CorrelationRule[];
  patterns: CorrelationPattern[];
  results: CorrelationResult[];
  configuration: CorrelationConfiguration;
}

export interface CorrelationEngine {
  id: string;
  name: string;
  type: 'temporal' | 'spatial' | 'causal' | 'statistical' | 'semantic';
  status: 'active' | 'inactive' | 'error';
  configuration: Record<string, any>;
  performance: CorrelationPerformance;
  results: CorrelationResult[];
}

export interface CorrelationPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  latency: number;
  throughput: number;
  correlationsFound: number;
  falsePositives: number;
  lastEvaluated: Date;
}

export interface CorrelationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  timeWindow: number;
  threshold: number;
  enabled: boolean;
  statistics: CorrelationStatistics;
}

export interface CorrelationStatistics {
  triggers: number;
  matches: number;
  correlations: number;
  falsePositives: number;
  lastTriggered: Date;
  averageLatency: number;
}

export interface CorrelationPattern {
  id: string;
  name: string;
  pattern: string;
  confidence: number;
  support: number;
  events: string[];
  timeWindow: number;
  discovered: Date;
  lastSeen: Date;
  frequency: number;
}

export interface CorrelationResult {
  id: string;
  type: 'incident' | 'campaign' | 'pattern' | 'anomaly';
  events: string[];
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timeline: CorrelationTimeline[];
  indicators: string[];
  recommendations: string[];
  timestamp: Date;
  status: 'new' | 'investigating' | 'confirmed' | 'false-positive' | 'resolved';
}

export interface CorrelationTimeline {
  timestamp: Date;
  event: string;
  source: string;
  data: Record<string, any>;
  relevance: number;
}

export interface CorrelationConfiguration {
  enabled: boolean;
  timeWindow: number;
  threshold: number;
  maxEvents: number;
  algorithms: string[];
  optimization: boolean;
  caching: boolean;
  persistence: boolean;
}

export interface AnalyticsPrediction {
  enabled: boolean;
  models: PredictionModel[];
  forecasts: PredictionForecast[];
  recommendations: PredictionRecommendation[];
  configuration: PredictionConfiguration;
}

export interface PredictionModel {
  id: string;
  name: string;
  type: 'threat' | 'vulnerability' | 'incident' | 'compliance' | 'risk';
  algorithm: string;
  horizon: number;
  confidence: number;
  accuracy: number;
  features: string[];
  training: PredictionTraining;
  deployment: PredictionDeployment;
}

export interface PredictionTraining {
  dataset: string;
  features: string[];
  target: string;
  algorithm: string;
  hyperparameters: Record<string, any>;
  validation: ValidationConfiguration;
  performance: PredictionPerformance;
}

export interface PredictionPerformance {
  mse: number;
  rmse: number;
  mae: number;
  r2: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface PredictionDeployment {
  environment: string;
  endpoint: string;
  version: string;
  status: 'active' | 'inactive' | 'updating';
  monitoring: boolean;
  alerts: boolean;
  deployedAt: Date;
}

export interface PredictionForecast {
  id: string;
  type: string;
  horizon: number;
  confidence: number;
  predictions: PredictionValue[];
  features: Record<string, any>;
  model: string;
  timestamp: Date;
  status: 'active' | 'expired' | 'invalidated';
}

export interface PredictionValue {
  timestamp: Date;
  value: number;
  confidence: number;
  bounds: PredictionBounds;
}

export interface PredictionBounds {
  lower: number;
  upper: number;
  probability: number;
}

export interface PredictionRecommendation {
  id: string;
  type: 'prevention' | 'mitigation' | 'response' | 'recovery';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  actions: string[];
  timeline: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  confidence: number;
  evidence: string[];
  timestamp: Date;
  status: 'new' | 'reviewing' | 'approved' | 'rejected' | 'implemented';
}

export interface PredictionConfiguration {
  enabled: boolean;
  horizon: number;
  confidence: number;
  updateFrequency: number;
  retraining: boolean;
  monitoring: boolean;
  alerting: boolean;
}

export interface AnalyticsReporting {
  enabled: boolean;
  reports: AnalyticsReport[];
  dashboards: AnalyticsDashboard[];
  exports: AnalyticsExport[];
  configuration: ReportingConfiguration;
}

export interface AnalyticsReport {
  id: string;
  name: string;
  type: 'summary' | 'detailed' | 'trend' | 'compliance' | 'executive';
  schedule: string;
  recipients: string[];
  format: 'html' | 'pdf' | 'json' | 'csv';
  content: ReportContent;
  lastGenerated: Date;
  nextGeneration: Date;
  status: 'active' | 'inactive' | 'error';
}

export interface ReportContent {
  sections: ReportSection[];
  metrics: ReportMetric[];
  charts: ReportChart[];
  tables: ReportTable[];
  filters: ReportFilter[];
  timeRange: ReportTimeRange;
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'metric' | 'chart' | 'table' | 'alert';
  order: number;
  enabled: boolean;
}

export interface ReportMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  target: number;
  threshold: number;
  status: 'good' | 'warning' | 'critical';
}

export interface ReportChart {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap';
  title: string;
  data: Record<string, any>;
  configuration: Record<string, any>;
  enabled: boolean;
}

export interface ReportTable {
  id: string;
  title: string;
  columns: TableColumn[];
  data: Record<string, any>[];
  pagination: boolean;
  sorting: boolean;
  filtering: boolean;
}

export interface TableColumn {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'link';
  sortable: boolean;
  filterable: boolean;
  format: string;
}

export interface ReportFilter {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect';
  options: string[];
  default: any;
  required: boolean;
}

export interface ReportTimeRange {
  start: Date;
  end: Date;
  preset: string;
  timezone: string;
}

export interface AnalyticsDashboard {
  id: string;
  name: string;
  type: 'overview' | 'detailed' | 'executive' | 'operational';
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  layout: DashboardLayout;
  permissions: DashboardPermission[];
  sharing: DashboardSharing;
  enabled: boolean;
}

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'alert' | 'text';
  title: string;
  configuration: Record<string, any>;
  position: WidgetPosition;
  size: WidgetSize;
  enabled: boolean;
}

export interface WidgetPosition {
  x: number;
  y: number;
  z: number;
}

export interface WidgetSize {
  width: number;
  height: number;
}

export interface DashboardFilter {
  id: string;
  name: string;
  type: 'text' | 'select' | 'date' | 'range';
  options: string[];
  default: any;
  global: boolean;
  required: boolean;
}

export interface DashboardLayout {
  type: 'grid' | 'flex' | 'absolute';
  columns: number;
  rows: number;
  gap: number;
  responsive: boolean;
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

export interface AnalyticsExport {
  id: string;
  name: string;
  type: 'data' | 'report' | 'dashboard' | 'model';
  format: 'json' | 'csv' | 'xml' | 'pdf';
  schedule: string;
  destination: string;
  configuration: ExportConfiguration;
  lastExported: Date;
  nextExport: Date;
  status: 'active' | 'inactive' | 'error';
}

export interface ExportConfiguration {
  enabled: boolean;
  compression: boolean;
  encryption: boolean;
  retention: number;
  filters: Record<string, any>;
  transformation: string;
  validation: boolean;
}

export interface ReportingConfiguration {
  enabled: boolean;
  timezone: string;
  locale: string;
  branding: BrandingConfiguration;
  distribution: DistributionConfiguration;
  storage: StorageConfiguration;
  security: ReportingSecurityConfiguration;
}

export interface BrandingConfiguration {
  enabled: boolean;
  logo: string;
  colors: Record<string, string>;
  fonts: Record<string, string>;
  header: string;
  footer: string;
  customCSS: string;
}

export interface DistributionConfiguration {
  enabled: boolean;
  channels: string[];
  templates: Record<string, string>;
  scheduling: boolean;
  batching: boolean;
  prioritization: boolean;
}

export interface StorageConfiguration {
  enabled: boolean;
  type: 'local' | 'cloud' | 'hybrid';
  retention: number;
  compression: boolean;
  encryption: boolean;
  backup: boolean;
}

export interface ReportingSecurityConfiguration {
  enabled: boolean;
  authentication: boolean;
  authorization: boolean;
  encryption: boolean;
  auditing: boolean;
  compliance: string[];
}

export interface SecurityAlerting {
  enabled: boolean;
  rules: SecurityAlertRule[];
  channels: AlertChannel[];
  escalation: AlertEscalation;
  suppression: AlertSuppression;
  automation: AlertAutomation;
}

export interface SecurityAlertRule {
  id: string;
  name: string;
  type: 'threshold' | 'anomaly' | 'correlation' | 'pattern' | 'ml';
  condition: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  threshold: number;
  timeWindow: number;
  enabled: boolean;
  channels: string[];
  actions: AlertAction[];
  suppression: AlertSuppressionRule;
  statistics: AlertRuleStatistics;
}

export interface AlertAction {
  id: string;
  type: 'notification' | 'email' | 'webhook' | 'ticket' | 'remediation' | 'escalation';
  configuration: Record<string, any>;
  delay: number;
  conditions: string[];
  enabled: boolean;
}

export interface AlertSuppressionRule {
  enabled: boolean;
  duration: number;
  conditions: string[];
  exceptions: string[];
  schedule: SuppressionSchedule;
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

export interface AlertRuleStatistics {
  triggers: number;
  alerts: number;
  falsePositives: number;
  suppressions: number;
  lastTriggered: Date;
  averageLatency: number;
}

export interface AlertChannel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'slack' | 'webhook' | 'pagerduty' | 'teams';
  configuration: ChannelConfiguration;
  enabled: boolean;
  filters: ChannelFilter[];
  formatting: ChannelFormatting;
  rateLimit: ChannelRateLimit;
}

export interface ChannelConfiguration {
  endpoint: string;
  credentials: Record<string, string>;
  headers: Record<string, string>;
  timeout: number;
  retries: number;
  customSettings: Record<string, any>;
}

export interface ChannelFilter {
  severity: string[];
  types: string[];
  sources: string[];
  regions: string[];
  tags: Record<string, string>;
  enabled: boolean;
}

export interface ChannelFormatting {
  template: string;
  variables: string[];
  markdown: boolean;
  html: boolean;
  truncation: boolean;
  customFields: Record<string, string>;
}

export interface ChannelRateLimit {
  enabled: boolean;
  limit: number;
  window: number;
  burst: number;
  queueing: boolean;
}

export interface AlertEscalation {
  enabled: boolean;
  levels: EscalationLevel[];
  timeout: number;
  maxLevel: number;
  automation: boolean;
}

export interface EscalationLevel {
  level: number;
  delay: number;
  channels: string[];
  actions: string[];
  conditions: string[];
  approval: boolean;
}

export interface AlertSuppression {
  enabled: boolean;
  rules: AlertSuppressionRule[];
  global: GlobalSuppression;
  dependencies: SuppressionDependency[];
}

export interface GlobalSuppression {
  enabled: boolean;
  maintenance: boolean;
  schedule: SuppressionSchedule;
  override: boolean;
  approval: boolean;
}

export interface SuppressionDependency {
  id: string;
  name: string;
  type: 'service' | 'region' | 'system' | 'custom';
  condition: string;
  impact: 'full' | 'partial' | 'none';
  enabled: boolean;
}

export interface AlertAutomation {
  enabled: boolean;
  rules: AutomationRule[];
  workflows: AutomationWorkflow[];
  actions: AutomationAction[];
  monitoring: AutomationMonitoring;
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  priority: number;
  enabled: boolean;
  statistics: AutomationStatistics;
}

export interface AutomationStatistics {
  triggers: number;
  executions: number;
  successes: number;
  failures: number;
  averageLatency: number;
  lastExecution: Date;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  triggers: string[];
  conditions: string[];
  approval: boolean;
  enabled: boolean;
  statistics: WorkflowStatistics;
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'action' | 'condition' | 'loop' | 'delay' | 'approval';
  configuration: Record<string, any>;
  timeout: number;
  retries: number;
  dependencies: string[];
  enabled: boolean;
}

export interface WorkflowStatistics {
  executions: number;
  successes: number;
  failures: number;
  averageDuration: number;
  lastExecution: Date;
  stepStatistics: Record<string, StepStatistics>;
}

export interface StepStatistics {
  executions: number;
  successes: number;
  failures: number;
  averageDuration: number;
  lastExecution: Date;
}

export interface AutomationAction {
  id: string;
  name: string;
  type: 'remediation' | 'containment' | 'investigation' | 'notification' | 'escalation';
  configuration: Record<string, any>;
  timeout: number;
  retries: number;
  rollback: boolean;
  enabled: boolean;
  statistics: ActionStatistics;
}

export interface ActionStatistics {
  executions: number;
  successes: number;
  failures: number;
  averageDuration: number;
  lastExecution: Date;
  errorRate: number;
}

export interface AutomationMonitoring {
  enabled: boolean;
  metrics: string[];
  alerts: string[];
  dashboards: string[];
  logging: boolean;
  auditing: boolean;
}

export interface SecurityReporting {
  enabled: boolean;
  reports: SecurityReport[];
  dashboards: SecurityDashboard[];
  exports: SecurityExport[];
  compliance: ComplianceReporting;
  executive: ExecutiveReporting;
}

export interface SecurityReport {
  id: string;
  name: string;
  type: 'incident' | 'vulnerability' | 'compliance' | 'threat' | 'performance';
  schedule: string;
  recipients: string[];
  format: 'html' | 'pdf' | 'json' | 'csv';
  template: string;
  filters: Record<string, any>;
  automation: boolean;
  approval: boolean;
  distribution: ReportDistribution;
  retention: number;
  encryption: boolean;
}

export interface ReportDistribution {
  enabled: boolean;
  channels: string[];
  conditions: string[];
  scheduling: boolean;
  batching: boolean;
  prioritization: boolean;
}

export interface SecurityDashboard {
  id: string;
  name: string;
  type: 'overview' | 'operational' | 'tactical' | 'strategic';
  audience: 'analyst' | 'manager' | 'executive' | 'auditor';
  widgets: SecurityWidget[];
  filters: SecurityFilter[];
  permissions: SecurityPermission[];
  realTime: boolean;
  refresh: number;
  customization: boolean;
}

export interface SecurityWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'map' | 'timeline' | 'alert';
  title: string;
  data: string;
  configuration: Record<string, any>;
  position: WidgetPosition;
  size: WidgetSize;
  refresh: number;
  enabled: boolean;
}

export interface SecurityFilter {
  id: string;
  name: string;
  type: 'text' | 'select' | 'date' | 'range' | 'multi';
  options: string[];
  default: any;
  required: boolean;
  dependencies: string[];
}

export interface SecurityPermission {
  user: string;
  role: string;
  permissions: string[];
  restrictions: string[];
  conditions: string[];
}

export interface SecurityExport {
  id: string;
  name: string;
  type: 'data' | 'report' | 'logs' | 'metrics';
  format: 'json' | 'csv' | 'xml' | 'siem';
  schedule: string;
  destination: string;
  transformation: string;
  encryption: boolean;
  compression: boolean;
  retention: number;
  approval: boolean;
}

export interface ComplianceReporting {
  enabled: boolean;
  frameworks: string[];
  reports: ComplianceReport[];
  audits: ComplianceAudit[];
  certifications: ComplianceCertification[];
  assessments: ComplianceAssessment[];
}

export interface ComplianceReport {
  id: string;
  framework: string;
  type: 'status' | 'gaps' | 'remediation' | 'evidence';
  schedule: string;
  recipients: string[];
  format: 'html' | 'pdf' | 'json';
  automation: boolean;
  approval: boolean;
  retention: number;
}

export interface ComplianceAudit {
  id: string;
  type: 'internal' | 'external' | 'regulatory' | 'certification';
  framework: string;
  scope: string[];
  schedule: string;
  auditor: string;
  status: 'planned' | 'in-progress' | 'completed' | 'failed';
  findings: AuditFinding[];
  recommendations: AuditRecommendation[];
  evidence: AuditEvidence[];
}

export interface AuditFinding {
  id: string;
  type: 'gap' | 'weakness' | 'violation' | 'opportunity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  remediation: string;
  responsible: string;
  deadline: Date;
  status: 'open' | 'in-progress' | 'resolved' | 'accepted';
}

export interface AuditRecommendation {
  id: string;
  type: 'improvement' | 'enhancement' | 'best-practice' | 'optimization';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  benefits: string[];
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  responsible: string;
  status: 'new' | 'reviewing' | 'approved' | 'implemented' | 'rejected';
}

export interface AuditEvidence {
  id: string;
  type: 'document' | 'log' | 'screenshot' | 'configuration' | 'interview';
  description: string;
  source: string;
  collected: Date;
  collector: string;
  verified: boolean;
  retention: number;
}

export interface ComplianceCertification {
  id: string;
  name: string;
  framework: string;
  issuer: string;
  issued: Date;
  expires: Date;
  status: 'active' | 'expired' | 'revoked' | 'pending';
  scope: string[];
  evidence: string[];
  renewal: CertificationRenewal;
}

export interface CertificationRenewal {
  required: boolean;
  deadline: Date;
  process: string[];
  responsible: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'failed';
  reminders: RenewalReminder[];
}

export interface RenewalReminder {
  date: Date;
  type: 'email' | 'notification' | 'task';
  recipient: string;
  message: string;
  sent: boolean;
}

export interface ComplianceAssessment {
  id: string;
  name: string;
  framework: string;
  type: 'self' | 'third-party' | 'regulatory';
  scope: string[];
  schedule: string;
  assessor: string;
  status: 'planned' | 'in-progress' | 'completed' | 'failed';
  score: number;
  maturity: number;
  gaps: AssessmentGap[];
  recommendations: AssessmentRecommendation[];
}

export interface AssessmentGap {
  id: string;
  control: string;
  current: number;
  target: number;
  gap: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  remediation: string;
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  responsible: string;
}

export interface AssessmentRecommendation {
  id: string;
  type: 'quick-win' | 'improvement' | 'transformation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  benefits: string[];
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  dependencies: string[];
  responsible: string;
}

export interface ExecutiveReporting {
  enabled: boolean;
  reports: ExecutiveReport[];
  dashboards: ExecutiveDashboard[];
  briefings: ExecutiveBriefing[];
  scorecards: ExecutiveScorecard[];
}

export interface ExecutiveReport {
  id: string;
  name: string;
  type: 'summary' | 'trends' | 'risks' | 'investments' | 'strategy';
  audience: 'ceo' | 'cto' | 'ciso' | 'board' | 'executives';
  schedule: string;
  format: 'executive-summary' | 'detailed-analysis' | 'visual-dashboard';
  content: ExecutiveContent;
  distribution: ExecutiveDistribution;
  approval: boolean;
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
}

export interface ExecutiveContent {
  summary: string;
  keyMetrics: ExecutiveMetric[];
  trends: ExecutiveTrend[];
  risks: ExecutiveRisk[];
  investments: ExecutiveInvestment[];
  recommendations: ExecutiveRecommendation[];
}

export interface ExecutiveMetric {
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  target: number;
  status: 'on-track' | 'at-risk' | 'off-track';
  impact: 'low' | 'medium' | 'high' | 'critical';
}

export interface ExecutiveTrend {
  name: string;
  direction: 'increasing' | 'decreasing' | 'stable' | 'volatile';
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  timeframe: string;
  implications: string[];
}

export interface ExecutiveRisk {
  name: string;
  category: 'operational' | 'strategic' | 'financial' | 'reputational' | 'regulatory';
  probability: 'low' | 'medium' | 'high' | 'very-high';
  impact: 'low' | 'medium' | 'high' | 'critical';
  velocity: 'slow' | 'medium' | 'fast' | 'immediate';
  mitigation: string[];
  owner: string;
  status: 'identified' | 'analyzing' | 'mitigating' | 'monitoring' | 'closed';
}

export interface ExecutiveInvestment {
  name: string;
  type: 'technology' | 'process' | 'people' | 'compliance' | 'infrastructure';
  amount: number;
  timeline: string;
  roi: number;
  benefits: string[];
  risks: string[];
  status: 'proposed' | 'approved' | 'in-progress' | 'completed' | 'cancelled';
  justification: string;
}

export interface ExecutiveRecommendation {
  id: string;
  type: 'strategic' | 'operational' | 'tactical' | 'immediate';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  rationale: string;
  benefits: string[];
  costs: string[];
  timeline: string;
  dependencies: string[];
  responsible: string;
  approval: boolean;
}

export interface ExecutiveDashboard {
  id: string;
  name: string;
  audience: 'ceo' | 'cto' | 'ciso' | 'board' | 'executives';
  type: 'real-time' | 'daily' | 'weekly' | 'monthly';
  widgets: ExecutiveWidget[];
  layout: ExecutiveLayout;
  permissions: ExecutivePermission[];
  customization: boolean;
  mobile: boolean;
}

export interface ExecutiveWidget {
  id: string;
  type: 'kpi' | 'trend' | 'risk' | 'status' | 'alert';
  title: string;
  data: string;
  visualization: 'number' | 'gauge' | 'chart' | 'table' | 'map';
  size: 'small' | 'medium' | 'large';
  priority: number;
  refresh: number;
  enabled: boolean;
}

export interface ExecutiveLayout {
  type: 'grid' | 'masonry' | 'custom';
  columns: number;
  spacing: number;
  responsive: boolean;
  themes: string[];
}

export interface ExecutivePermission {
  user: string;
  role: string;
  widgets: string[];
  actions: string[];
  restrictions: string[];
}

export interface ExecutiveBriefing {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'ad-hoc';
  audience: string[];
  content: BriefingContent;
  delivery: BriefingDelivery;
  approval: boolean;
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
}

export interface BriefingContent {
  summary: string;
  highlights: string[];
  concerns: string[];
  recommendations: string[];
  metrics: BriefingMetric[];
  attachments: string[];
}

export interface BriefingMetric {
  name: string;
  value: string;
  change: string;
  significance: 'low' | 'medium' | 'high' | 'critical';
  context: string;
}

export interface BriefingDelivery {
  method: 'email' | 'presentation' | 'document' | 'dashboard';
  schedule: string;
  template: string;
  format: 'html' | 'pdf' | 'ppt' | 'dashboard';
  distribution: string[];
  reminders: boolean;
}

export interface ExecutiveScorecard {
  id: string;
  name: string;
  type: 'balanced' | 'security' | 'compliance' | 'risk' | 'performance';
  perspectives: ScorecardPerspective[];
  objectives: ScorecardObjective[];
  measures: ScorecardMeasure[];
  targets: ScorecardTarget[];
  initiatives: ScorecardInitiative[];
  owner: string;
  reviewCycle: string;
  lastReview: Date;
  nextReview: Date;
}

export interface ScorecardPerspective {
  id: string;
  name: string;
  description: string;
  weight: number;
  color: string;
  icon: string;
  objectives: string[];
}

export interface ScorecardObjective {
  id: string;
  name: string;
  description: string;
  perspective: string;
  weight: number;
  measures: string[];
  owner: string;
  status: 'on-track' | 'at-risk' | 'off-track';
}

export interface ScorecardMeasure {
  id: string;
  name: string;
  description: string;
  type: 'leading' | 'lagging';
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  source: string;
  calculation: string;
  target: ScorecardTarget;
  actual: number;
  variance: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ScorecardTarget {
  id: string;
  measure: string;
  type: 'absolute' | 'percentage' | 'ratio';
  value: number;
  threshold: number;
  timeframe: string;
  owner: string;
  rationale: string;
}

export interface ScorecardInitiative {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  owner: string;
  budget: number;
  timeline: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  progress: number;
  milestones: InitiativeMilestone[];
}

export interface InitiativeMilestone {
  id: string;
  name: string;
  description: string;
  deadline: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  deliverables: string[];
  dependencies: string[];
}

export interface SecurityIntegration {
  enabled: boolean;
  platforms: SecurityPlatform[];
  apis: SecurityAPI[];
  feeds: SecurityFeed[];
  orchestration: SecurityOrchestration;
  automation: SecurityAutomation;
}

export interface SecurityPlatform {
  id: string;
  name: string;
  type: 'siem' | 'soar' | 'edr' | 'ndr' | 'vulnerability' | 'threat-intelligence';
  vendor: string;
  version: string;
  status: 'connected' | 'disconnected' | 'error';
  configuration: PlatformConfiguration;
  capabilities: string[];
  metrics: PlatformMetrics;
  lastSync: Date;
  errors: PlatformError[];
}

export interface PlatformConfiguration {
  endpoint: string;
  authentication: AuthenticationConfiguration;
  dataMapping: DataMappingConfiguration;
  synchronization: SynchronizationConfiguration;
  monitoring: PlatformMonitoringConfiguration;
}

export interface AuthenticationConfiguration {
  type: 'api-key' | 'oauth2' | 'basic' | 'certificate' | 'saml';
  credentials: Record<string, string>;
  refreshToken: boolean;
  expiration: number;
  rotation: boolean;
}

export interface DataMappingConfiguration {
  enabled: boolean;
  fields: FieldMapping[];
  transformations: DataTransformation[];
  validation: ValidationConfiguration;
  enrichment: EnrichmentConfiguration;
}

export interface FieldMapping {
  source: string;
  target: string;
  type: 'direct' | 'computed' | 'lookup' | 'default';
  transformation: string;
  required: boolean;
  validation: string;
}

export interface DataTransformation {
  id: string;
  name: string;
  type: 'format' | 'normalize' | 'aggregate' | 'filter' | 'enrich';
  configuration: Record<string, any>;
  enabled: boolean;
  order: number;
}

export interface EnrichmentConfiguration {
  enabled: boolean;
  sources: string[];
  fields: string[];
  caching: boolean;
  timeout: number;
  fallback: boolean;
}

export interface SynchronizationConfiguration {
  enabled: boolean;
  mode: 'pull' | 'push' | 'bidirectional';
  frequency: number;
  batchSize: number;
  incremental: boolean;
  conflict: 'source' | 'target' | 'manual';
}

export interface PlatformMonitoringConfiguration {
  enabled: boolean;
  metrics: string[];
  alerts: string[];
  healthCheck: boolean;
  logging: boolean;
  performance: boolean;
}

export interface PlatformMetrics {
  requests: number;
  responses: number;
  errors: number;
  latency: number;
  throughput: number;
  dataVolume: number;
  lastSync: Date;
  uptime: number;
}

export interface PlatformError {
  timestamp: Date;
  type: 'connection' | 'authentication' | 'data' | 'timeout' | 'rate-limit';
  message: string;
  details: string;
  resolved: boolean;
  resolution: string;
}

export interface SecurityAPI {
  id: string;
  name: string;
  type: 'rest' | 'graphql' | 'webhook' | 'streaming';
  endpoint: string;
  authentication: AuthenticationConfiguration;
  rateLimit: APIRateLimit;
  monitoring: APIMonitoring;
  documentation: APIDocumentation;
  versioning: APIVersioning;
}

export interface APIRateLimit {
  enabled: boolean;
  requests: number;
  window: number;
  burst: number;
  strategy: 'sliding' | 'fixed' | 'token-bucket';
  headers: boolean;
  retry: boolean;
}

export interface APIMonitoring {
  enabled: boolean;
  metrics: string[];
  logging: boolean;
  tracing: boolean;
  alerts: string[];
  healthCheck: boolean;
}

export interface APIDocumentation {
  enabled: boolean;
  format: 'openapi' | 'swagger' | 'postman' | 'custom';
  url: string;
  version: string;
  examples: boolean;
  testing: boolean;
}

export interface APIVersioning {
  enabled: boolean;
  strategy: 'url' | 'header' | 'parameter';
  current: string;
  supported: string[];
  deprecated: string[];
  migration: boolean;
}

export interface SecurityFeed {
  id: string;
  name: string;
  type: 'threat-intelligence' | 'vulnerability' | 'malware' | 'reputation' | 'indicators';
  provider: string;
  format: 'json' | 'xml' | 'csv' | 'stix' | 'taxii';
  endpoint: string;
  authentication: AuthenticationConfiguration;
  schedule: string;
  processing: FeedProcessing;
  quality: FeedQuality;
  metrics: FeedMetrics;
  lastUpdate: Date;
  errors: FeedError[];
}

export interface FeedProcessing {
  enabled: boolean;
  validation: boolean;
  normalization: boolean;
  enrichment: boolean;
  deduplication: boolean;
  filtering: FeedFiltering;
  transformation: FeedTransformation;
}

export interface FeedFiltering {
  enabled: boolean;
  rules: FilterRule[];
  whitelist: string[];
  blacklist: string[];
  confidence: number;
  relevance: number;
}

export interface FilterRule {
  id: string;
  name: string;
  condition: string;
  action: 'include' | 'exclude' | 'flag';
  enabled: boolean;
  statistics: FilterStatistics;
}

export interface FilterStatistics {
  processed: number;
  matched: number;
  included: number;
  excluded: number;
  flagged: number;
}

export interface FeedTransformation {
  enabled: boolean;
  mappings: FieldMapping[];
  enrichments: DataEnrichment[];
  validations: ValidationRule[];
  outputs: OutputFormat[];
}

export interface ValidationRule {
  id: string;
  name: string;
  field: string;
  type: 'required' | 'format' | 'range' | 'custom';
  condition: string;
  message: string;
  enabled: boolean;
}

export interface OutputFormat {
  id: string;
  name: string;
  format: 'json' | 'xml' | 'csv' | 'stix';
  destination: string;
  enabled: boolean;
  transformation: string;
}

export interface FeedQuality {
  score: number;
  accuracy: number;
  completeness: number;
  timeliness: number;
  reliability: number;
  relevance: number;
  lastAssessed: Date;
  issues: QualityIssue[];
}

export interface QualityIssue {
  type: 'accuracy' | 'completeness' | 'timeliness' | 'format' | 'duplication';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  recommendation: string;
  status: 'open' | 'investigating' | 'resolved';
}

export interface FeedMetrics {
  records: number;
  processed: number;
  errors: number;
  latency: number;
  throughput: number;
  quality: number;
  usage: number;
  lastUpdate: Date;
}

export interface FeedError {
  timestamp: Date;
  type: 'connection' | 'format' | 'validation' | 'processing' | 'storage';
  message: string;
  details: string;
  record: string;
  resolved: boolean;
  resolution: string;
}

export interface SecurityOrchestration {
  enabled: boolean;
  workflows: OrchestrationWorkflow[];
  playbooks: SecurityPlaybook[];
  automation: OrchestrationAutomation;
  integration: OrchestrationIntegration;
  monitoring: OrchestrationMonitoring;
}

export interface OrchestrationWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  steps: OrchestrationStep[];
  conditions: WorkflowCondition[];
  variables: WorkflowVariable[];
  outputs: WorkflowOutput[];
  status: 'active' | 'inactive' | 'draft' | 'error';
  version: string;
  lastRun: Date;
  statistics: WorkflowStatistics;
}

export interface WorkflowTrigger {
  type: 'manual' | 'scheduled' | 'event' | 'alert' | 'api' | 'webhook';
  configuration: Record<string, any>;
  conditions: string[];
  enabled: boolean;
  priority: number;
}

export interface OrchestrationStep {
  id: string;
  name: string;
  type: 'action' | 'condition' | 'loop' | 'parallel' | 'delay' | 'approval';
  configuration: Record<string, any>;
  inputs: StepInput[];
  outputs: StepOutput[];
  conditions: string[];
  timeout: number;
  retries: number;
  onError: string;
  enabled: boolean;
  statistics: StepStatistics;
}

export interface StepInput {
  name: string;
  type: 'static' | 'variable' | 'output' | 'user';
  value: any;
  required: boolean;
  validation: string;
}

export interface StepOutput {
  name: string;
  type: 'variable' | 'result' | 'log' | 'metric';
  value: any;
  scope: 'step' | 'workflow' | 'global';
  persistent: boolean;
}

export interface WorkflowCondition {
  id: string;
  name: string;
  expression: string;
  type: 'pre' | 'post' | 'guard' | 'loop';
  enabled: boolean;
  priority: number;
}

export interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  value: any;
  scope: 'workflow' | 'global';
  persistent: boolean;
  encrypted: boolean;
}

export interface WorkflowOutput {
  name: string;
  type: 'result' | 'log' | 'metric' | 'artifact';
  value: any;
  format: string;
  destination: string;
  enabled: boolean;
}

export interface SecurityPlaybook {
  id: string;
  name: string;
  description: string;
  type: 'incident' | 'threat' | 'vulnerability' | 'compliance' | 'investigation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  procedures: PlaybookProcedure[];
  roles: PlaybookRole[];
  resources: PlaybookResource[];
  metrics: PlaybookMetrics;
  approval: boolean;
  version: string;
  lastUsed: Date;
  effectiveness: number;
}

export interface PlaybookProcedure {
  id: string;
  name: string;
  description: string;
  type: 'manual' | 'automated' | 'hybrid';
  steps: ProcedureStep[];
  roles: string[];
  duration: number;
  priority: number;
  dependencies: string[];
  enabled: boolean;
  statistics: ProcedureStatistics;
}

export interface ProcedureStep {
  id: string;
  name: string;
  description: string;
  type: 'action' | 'decision' | 'communication' | 'documentation' | 'approval';
  instructions: string;
  automation: string;
  roles: string[];
  duration: number;
  required: boolean;
  verification: string;
  outputs: string[];
}

export interface ProcedureStatistics {
  executions: number;
  successes: number;
  failures: number;
  averageDuration: number;
  lastExecution: Date;
  effectiveness: number;
}

export interface PlaybookRole {
  id: string;
  name: string;
  description: string;
  responsibilities: string[];
  permissions: string[];
  contacts: RoleContact[];
  escalation: string[];
  backup: string[];
}

export interface RoleContact {
  name: string;
  email: string;
  phone: string;
  type: 'primary' | 'backup' | 'escalation';
  availability: string;
  timezone: string;
}

export interface PlaybookResource {
  id: string;
  name: string;
  type: 'tool' | 'document' | 'contact' | 'system' | 'service';
  description: string;
  location: string;
  access: string[];
  availability: string;
  dependencies: string[];
}

export interface PlaybookMetrics {
  executions: number;
  successes: number;
  failures: number;
  averageDuration: number;
  mttr: number;
  effectiveness: number;
  lastExecution: Date;
  feedback: PlaybookFeedback[];
}

export interface PlaybookFeedback {
  id: string;
  type: 'improvement' | 'issue' | 'compliment' | 'suggestion';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  submitter: string;
  timestamp: Date;
  status: 'open' | 'reviewing' | 'implemented' | 'rejected';
  resolution: string;
}

export interface OrchestrationAutomation {
  enabled: boolean;
  triggers: AutomationTrigger[];
  rules: AutomationRule[];
  actions: AutomationAction[];
  conditions: AutomationCondition[];
  monitoring: AutomationMonitoring;
  approval: AutomationApproval;
}

export interface AutomationTrigger {
  id: string;
  name: string;
  type: 'event' | 'schedule' | 'threshold' | 'pattern' | 'anomaly';
  configuration: Record<string, any>;
  conditions: string[];
  enabled: boolean;
  priority: number;
  cooldown: number;
}

export interface AutomationCondition {
  id: string;
  name: string;
  expression: string;
  type: 'pre' | 'post' | 'guard' | 'approval';
  enabled: boolean;
  priority: number;
  timeout: number;
}

export interface AutomationApproval {
  required: boolean;
  approvers: string[];
  threshold: number;
  timeout: number;
  escalation: boolean;
  override: boolean;
  audit: boolean;
}

export interface OrchestrationIntegration {
  enabled: boolean;
  platforms: string[];
  apis: string[];
  protocols: string[];
  authentication: IntegrationAuthentication;
  monitoring: IntegrationMonitoring;
  security: IntegrationSecurity;
}

export interface IntegrationSecurity {
  encryption: boolean;
  authentication: boolean;
  authorization: boolean;
  auditing: boolean;
  compliance: string[];
  validation: boolean;
}

export interface OrchestrationMonitoring {
  enabled: boolean;
  metrics: string[];
  alerts: string[];
  dashboards: string[];
  logging: boolean;
  auditing: boolean;
  performance: boolean;
}

export interface GlobalIdentityManagement {
  enabled: boolean;
  providers: IdentityProvider[];
  federation: IdentityFederation;
  sso: SingleSignOn;
  mfa: MultiFactorAuth;
  governance: IdentityGovernance;
  lifecycle: IdentityLifecycle;
  access: AccessManagement;
  monitoring: IdentityMonitoring;
}

export interface IdentityProvider {
  id: string;
  name: string;
  type: 'internal' | 'ldap' | 'ad' | 'saml' | 'oauth2' | 'oidc';
  configuration: ProviderConfiguration;
  status: 'active' | 'inactive' | 'error';
  users: number;
  groups: number;
  lastSync: Date;
  metrics: ProviderMetrics;
  errors: ProviderError[];
}

export interface ProviderConfiguration {
  endpoint: string;
  authentication: AuthenticationConfiguration;
  attributes: AttributeMapping[];
  synchronization: SynchronizationConfiguration;
  filtering: ProviderFiltering;
  transformation: ProviderTransformation;
}

export interface AttributeMapping {
  source: string;
  target: string;
  type: 'direct' | 'computed' | 'lookup' | 'default';
  transformation: string;
  required: boolean;
  validation: string;
}

export interface ProviderFiltering {
  enabled: boolean;
  rules: FilterRule[];
  groups: string[];
  attributes: string[];
  exclusions: string[];
}

export interface ProviderTransformation {
  enabled: boolean;
  mappings: AttributeMapping[];
  enrichments: DataEnrichment[];
  validations: ValidationRule[];
  normalizations: NormalizationRule[];
}

export interface NormalizationRule {
  id: string;
  name: string;
  field: string;
  type: 'case' | 'format' | 'encoding' | 'custom';
  transformation: string;
  enabled: boolean;
}

export interface ProviderMetrics {
  authentications: number;
  authorizations: number;
  synchronizations: number;
  errors: number;
  latency: number;
  throughput: number;
  availability: number;
  lastSync: Date;
}

export interface ProviderError {
  timestamp: Date;
  type: 'connection' | 'authentication' | 'authorization' | 'sync' | 'validation';
  message: string;
  details: string;
  user: string;
  resolved: boolean;
  resolution: string;
}

export interface IdentityFederation {
  enabled: boolean;
  providers: string[];
  trust: TrustRelationship[];
  mapping: FederationMapping;
  security: FederationSecurity;
  monitoring: FederationMonitoring;
}

export interface TrustRelationship {
  id: string;
  name: string;
  type: 'inbound' | 'outbound' | 'bidirectional';
  provider: string;
  certificate: string;
  metadata: string;
  claims: ClaimMapping[];
  enabled: boolean;
  lastValidated: Date;
}

export interface ClaimMapping {
  source: string;
  target: string;
  type: 'direct' | 'computed' | 'lookup' | 'default';
  transformation: string;
  required: boolean;
  validation: string;
}

export interface FederationMapping {
  enabled: boolean;
  rules: MappingRule[];
  defaults: Record<string, any>;
  transformations: FederationTransformation[];
}

export interface MappingRule {
  id: string;
  name: string;
  condition: string;
  mapping: Record<string, string>;
  priority: number;
  enabled: boolean;
}

export interface FederationTransformation {
  id: string;
  name: string;
  type: 'attribute' | 'role' | 'group' | 'permission';
  source: string;
  target: string;
  logic: string;
  enabled: boolean;
}

export interface FederationSecurity {
  encryption: boolean;
  signing: boolean;
  validation: boolean;
  certificates: CertificateManagement;
  auditing: boolean;
  compliance: string[];
}

export interface CertificateManagement {
  enabled: boolean;
  certificates: SecurityCertificate[];
  validation: CertificateValidation;
  rotation: CertificateRotation;
  monitoring: CertificateMonitoring;
}

export interface SecurityCertificate {
  id: string;
  name: string;
  type: 'x509' | 'pkcs12' | 'pem' | 'der';
  usage: 'signing' | 'encryption' | 'authentication';
  issuer: string;
  subject: string;
  serialNumber: string;
  issued: Date;
  expires: Date;
  status: 'valid' | 'expired' | 'revoked' | 'pending';
  fingerprint: string;
  publicKey: string;
  privateKey?: string;
  chain: string[];
}

export interface CertificateValidation {
  enabled: boolean;
  chain: boolean;
  revocation: boolean;
  crl: boolean;
  ocsp: boolean;
  timestamp: boolean;
  alerts: boolean;
}

export interface CertificateRotation {
  enabled: boolean;
  schedule: string;
  threshold: number;
  automation: boolean;
  approval: boolean;
  backup: boolean;
  notifications: boolean;
}

export interface CertificateMonitoring {
  enabled: boolean;
  expiration: boolean;
  usage: boolean;
  revocation: boolean;
  alerts: boolean;
  reporting: boolean;
}

export interface FederationMonitoring {
  enabled: boolean;
  metrics: string[];
  alerts: string[];
  logging: boolean;
  auditing: boolean;
  performance: boolean;
}

export interface SingleSignOn {
  enabled: boolean;
  protocols: string[];
  providers: string[];
  configuration: SSOConfiguration;
  session: SessionManagement;
  security: SSOSecurity;
  monitoring: SSOMonitoring;
}

export interface SSOConfiguration {
  defaultProvider: string;
  fallback: string;
  timeout: number;
  redirects: string[];
  attributes: string[];
  claims: string[];
  customization: SSOCustomization;
}

export interface SSOCustomization {
  enabled: boolean;
  branding: BrandingConfiguration;
  themes: string[];
  languages: string[];
  templates: Record<string, string>;
}

export interface SessionManagement {
  enabled: boolean;
  timeout: number;
  renewal: boolean;
  concurrent: number;
  tracking: boolean;
  security: SessionSecurity;
  storage: SessionStorage;
}

export interface SessionSecurity {
  encryption: boolean;
  signing: boolean;
  validation: boolean;
  csrf: boolean;
  samesite: boolean;
  secure: boolean;
  httponly: boolean;
}

export interface SessionStorage {
  type: 'memory' | 'database' | 'redis' | 'file';
  encryption: boolean;
  compression: boolean;
  replication: boolean;
  backup: boolean;
  cleanup: boolean;
}

export interface SSOSecurity {
  encryption: boolean;
  signing: boolean;
  validation: boolean;
  certificates: boolean;
  auditing: boolean;
  compliance: string[];
}

export interface SSOMonitoring {
  enabled: boolean;
  metrics: string[];
  alerts: string[];
  logging: boolean;
  auditing: boolean;
  performance: boolean;
}

export interface MultiFactorAuth {
  enabled: boolean;
  methods: MFAMethod[];
  policies: MFAPolicy[];
  providers: MFAProvider[];
  backup: MFABackup;
  monitoring: MFAMonitoring;
}

export interface MFAMethod {
  id: string;
  name: string;
  type: 'totp' | 'sms' | 'email' | 'push' | 'hardware' | 'biometric';
  enabled: boolean;
  priority: number;
  configuration: MFAConfiguration;
  security: MFASecurity;
  usability: MFAUsability;
}

export interface MFAConfiguration {
  enabled: boolean;
  required: boolean;
  optional: boolean;
  fallback: boolean;
  timeout: number;
  retries: number;
  customization: Record<string, any>;
}

export interface MFASecurity {
  encryption: boolean;
  validation: boolean;
  rate_limiting: boolean;
  fraud_detection: boolean;
  backup_codes: boolean;
  device_binding: boolean;
}

export interface MFAUsability {
  remember_device: boolean;
  trust_duration: number;
  offline_support: boolean;
  accessibility: boolean;
  user_enrollment: boolean;
  self_service: boolean;
}

export interface MFAPolicy {
  id: string;
  name: string;
  description: string;
  conditions: MFACondition[];
  actions: MFAAction[];
  enabled: boolean;
  priority: number;
  enforcement: 'required' | 'optional' | 'disabled';
  exceptions: string[];
}

export interface MFACondition {
  type: 'user' | 'group' | 'role' | 'location' | 'device' | 'risk' | 'time';
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'contains' | 'regex';
  value: any;
  enabled: boolean;
}

export interface MFAAction {
  type: 'require' | 'skip' | 'challenge' | 'block' | 'log' | 'notify';
  configuration: Record<string, any>;
  enabled: boolean;
  priority: number;
}

export interface MFAProvider {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'cloud' | 'on-premise';
  methods: string[];
  configuration: ProviderConfiguration;
  status: 'active' | 'inactive' | 'error';
  metrics: ProviderMetrics;
  costs: ProviderCosts;
}

export interface ProviderCosts {
  setup: number;
  monthly: number;
  perUser: number;
  perTransaction: number;
  overage: number;
  currency: string;
}

export interface MFABackup {
  enabled: boolean;
  methods: string[];
  codes: BackupCodes;
  recovery: RecoveryProcess;
  administrator: AdministratorOverride;
}

export interface BackupCodes {
  enabled: boolean;
  count: number;
  length: number;
  expiration: number;
  regeneration: boolean;
  usage_limit: number;
}

export interface RecoveryProcess {
  enabled: boolean;
  methods: string[];
  verification: string[];
  approval: boolean;
  documentation: boolean;
  notifications: boolean;
}

export interface AdministratorOverride {
  enabled: boolean;
  administrators: string[];
  approval: boolean;
  documentation: boolean;
  notifications: boolean;
  auditing: boolean;
}

export interface MFAMonitoring {
  enabled: boolean;
  metrics: string[];
  alerts: string[];
  logging: boolean;
  auditing: boolean;
  fraud_detection: boolean;
  user_behavior: boolean;
}

export interface IdentityGovernance {
  enabled: boolean;
  policies: GovernancePolicy[];
  controls: GovernanceControl[];
  compliance: GovernanceCompliance;
  reporting: GovernanceReporting;
  automation: GovernanceAutomation;
}

export interface GovernancePolicy {
  id: string;
  name: string;
  description: string;
  type: 'access' | 'segregation' | 'approval' | 'review' | 'lifecycle';
  scope: string[];
  rules: PolicyRule[];
  enforcement: 'advisory' | 'mandatory';
  exceptions: PolicyException[];
  enabled: boolean;
  version: string;
  lastReview: Date;
  nextReview: Date;
}

export interface PolicyRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  parameters: Record<string, any>;
  enabled: boolean;
  priority: number;
  statistics: PolicyRuleStatistics;
}

export interface PolicyRuleStatistics {
  evaluations: number;
  violations: number;
  enforcements: number;
  exceptions: number;
  lastTriggered: Date;
  effectiveness: number;
}

export interface PolicyException {
  id: string;
  type: 'permanent' | 'temporary' | 'conditional';
  reason: string;
  justification: string;
  approver: string;
  approved: Date;
  expires?: Date;
  conditions: string[];
  monitoring: boolean;
  review: boolean;
}

export interface GovernanceControl {
  id: string;
  name: string;
  description: string;
  type: 'preventive' | 'detective' | 'corrective' | 'compensating';
  category: 'access' | 'segregation' | 'approval' | 'review' | 'monitoring';
  implementation: 'manual' | 'automated' | 'hybrid';
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  owner: string;
  status: 'active' | 'inactive' | 'testing' | 'failed';
  effectiveness: number;
  lastTest: Date;
  nextTest: Date;
  evidence: ControlEvidence[];
}

export interface ControlEvidence {
  id: string;
  type: 'log' | 'report' | 'screenshot' | 'document' | 'attestation';
  description: string;
  source: string;
  collected: Date;
  collector: string;
  verified: boolean;
  retention: number;
  location: string;
}

export interface GovernanceCompliance {
  enabled: boolean;
  frameworks: string[];
  requirements: ComplianceRequirement[];
  controls: ComplianceControl[];
  assessments: ComplianceAssessment[];
  reporting: ComplianceReporting;
  monitoring: ComplianceMonitoring;
}

export interface ComplianceRequirement {
  id: string;
  framework: string;
  control: string;
  description: string;
  type: 'mandatory' | 'recommended' | 'optional';
  scope: string[];
  implementation: RequirementImplementation;
  testing: RequirementTesting;
  status: 'compliant' | 'non-compliant' | 'partial' | 'not-applicable';
  lastAssessed: Date;
  nextAssessment: Date;
}

export interface RequirementImplementation {
  status: 'implemented' | 'partial' | 'not-implemented';
  controls: string[];
  evidence: string[];
  gaps: string[];
  remediation: string[];
  timeline: string;
  responsible: string;
}

export interface RequirementTesting {
  enabled: boolean;
  frequency: 'continuous' | 'monthly' | 'quarterly' | 'annually';
  methods: string[];
  automation: boolean;
  sampling: boolean;
  documentation: boolean;
  reporting: boolean;
}

export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  framework: string;
  requirement: string;
  type: 'technical' | 'administrative' | 'physical';
  category: 'access' | 'encryption' | 'monitoring' | 'logging' | 'backup';
  implementation: ControlImplementation;
  testing: ControlTesting;
  monitoring: ControlMonitoring;
  effectiveness: number;
  maturity: number;
}

export interface ControlImplementation {
  status: 'designed' | 'implemented' | 'operating' | 'effective';
  method: 'manual' | 'automated' | 'hybrid';
  frequency: 'continuous' | 'periodic' | 'on-demand';
  documentation: string[];
  evidence: string[];
  responsible: string;
  lastUpdate: Date;
}

export interface ControlTesting {
  enabled: boolean;
  methods: string[];
  frequency: 'continuous' | 'monthly' | 'quarterly' | 'annually';
  automation: boolean;
  sampling: TestingSampling;
  documentation: boolean;
  reporting: boolean;
  lastTest: Date;
  nextTest: Date;
}

export interface TestingSampling {
  enabled: boolean;
  method: 'random' | 'systematic' | 'stratified' | 'judgmental';
  size: number;
  confidence: number;
  coverage: number;
  rationale: string;
}

export interface ControlMonitoring {
  enabled: boolean;
  metrics: string[];
  alerts: string[];
  dashboards: string[];
  automation: boolean;
  reporting: boolean;
  escalation: boolean;
}

export interface ComplianceMonitoring {
  enabled: boolean;
  frameworks: string[];
  requirements: string[];
  controls: string[];
  metrics: string[];
  alerts: string[];
  reporting: boolean;
  automation: boolean;
}

export interface GovernanceReporting {
  enabled: boolean;
  reports: GovernanceReport[];
  dashboards: GovernanceDashboard[];
  metrics: GovernanceMetric[];
  automation: boolean;
  distribution: ReportDistribution;
}

export interface GovernanceReport {
  id: string;
  name: string;
  type: 'compliance' | 'risk' | 'control' | 'exception' | 'violation';
  scope: string[];
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  format: 'html' | 'pdf' | 'excel' | 'csv';
  recipients: string[];
  automation: boolean;
  approval: boolean;
  classification: 'public' | 'internal' | 'confidential' | 'restricted';
}

export interface GovernanceDashboard {
  id: string;
  name: string;
  type: 'executive' | 'operational' | 'compliance' | 'risk';
  audience: string[];
  widgets: GovernanceWidget[];
  permissions: GovernancePermission[];
  customization: boolean;
  realtime: boolean;
}

export interface GovernanceWidget {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'gauge' | 'alert';
  title: string;
  data: string;
  configuration: Record<string, any>;
  position: WidgetPosition;
  size: WidgetSize;
  enabled: boolean;
}

export interface GovernancePermission {
  user: string;
  role: string;
  permissions: string[];
  restrictions: string[];
  conditions: string[];
}

export interface GovernanceMetric {
  id: string;
  name: string;
  description: string;
  type: 'compliance' | 'risk' | 'control' | 'exception' | 'violation';
  calculation: string;
  frequency: 'realtime' | 'daily' | 'weekly' | 'monthly';
  target: number;
  threshold: number;
  owner: string;
  status: 'active' | 'inactive';
}

export interface GovernanceAutomation {
  enabled: boolean;
  workflows: string[];
  triggers: string[];
  actions: string[];
  approval: boolean;
  monitoring: boolean;
  auditing: boolean;
}

export interface IdentityLifecycle {
  enabled: boolean;
  stages: LifecycleStage[];
  workflows: LifecycleWorkflow[];
  automation: LifecycleAutomation;
  monitoring: LifecycleMonitoring;
  compliance: LifecycleCompliance;
}

export interface LifecycleStage {
  id: string;
  name: string;
  description: string;
  type: 'creation' | 'provisioning' | 'modification' | 'review' | 'deprovisioning' | 'deletion';
  sequence: number;
  duration: number;
  approval: boolean;
  automation: boolean;
  requirements: StageRequirement[];
  actions: StageAction[];
  validations: StageValidation[];
}

export interface StageRequirement {
  id: string;
  name: string;
  type: 'mandatory' | 'optional' | 'conditional';
  description: string;
  validation: string;
  source: string;
  default: any;
}

export interface StageAction {
  id: string;
  name: string;
  type: 'create' | 'update' | 'delete' | 'notify' | 'approve' | 'validate';
  target: string;
  parameters: Record<string, any>;
  conditions: string[];
  automation: boolean;
  rollback: boolean;
}

export interface StageValidation {
  id: string;
  name: string;
  type: 'format' | 'business' | 'security' | 'compliance';
  rule: string;
  message: string;
  severity: 'warning' | 'error' | 'critical';
  blocking: boolean;
}

export interface LifecycleWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: 'manual' | 'scheduled' | 'event' | 'condition';
  stages: string[];
  parallel: boolean;
  conditions: string[];
  approval: WorkflowApproval;
  automation: WorkflowAutomation;
  monitoring: WorkflowMonitoring;
  rollback: WorkflowRollback;
}

export interface WorkflowApproval {
  required: boolean;
  stages: string[];
  approvers: string[];
  escalation: boolean;
  timeout: number;
  delegation: boolean;
  parallel: boolean;
}

export interface WorkflowAutomation {
  enabled: boolean;
  stages: string[];
  conditions: string[];
  fallback: boolean;
  monitoring: boolean;
  rollback: boolean;
}

export interface WorkflowMonitoring {
  enabled: boolean;
  metrics: string[];
  alerts: string[];
  logging: boolean;
  auditing: boolean;
  reporting: boolean;
}

export interface WorkflowRollback {
  enabled: boolean;
  stages: string[];
  conditions: string[];
  automation: boolean;
  approval: boolean;
  monitoring: boolean;
}

export interface LifecycleAutomation {
  enabled: boolean;
  rules: LifecycleRule[];
  triggers: LifecycleTrigger[];
  actions: LifecycleAction[];
  conditions: LifecycleCondition[];
  monitoring: LifecycleMonitoringConfig;
}

export interface LifecycleRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  enabled: boolean;
  priority: number;
  statistics: LifecycleRuleStatistics;
}

export interface LifecycleRuleStatistics {
  executions: number;
  successes: number;
  failures: number;
  averageDuration: number;
  lastExecution: Date;
  effectiveness: number;
}

export interface LifecycleTrigger {
  id: string;
  name: string;
  type: 'user' | 'system' | 'schedule' | 'event' | 'condition';
  configuration: Record<string, any>;
  conditions: string[];
  enabled: boolean;
  priority: number;
}

export interface LifecycleAction {
  id: string;
  name: string;
  type: 'provision' | 'modify' | 'suspend' | 'restore' | 'deprovision' | 'notify';
  target: string;
  parameters: Record<string, any>;
  conditions: string[];
  rollback: boolean;
  monitoring: boolean;
}

export interface LifecycleCondition {
  id: string;
  name: string;
  expression: string;
  type: 'business' | 'security' | 'compliance' | 'technical';
  enabled: boolean;
  priority: number;
}

export interface LifecycleMonitoringConfig {
  enabled: boolean;
  metrics: string[];
  alerts: string[];
  dashboards: string[];
  logging: boolean;
  auditing: boolean;
  reporting: boolean;
}

export interface LifecycleCompliance {
  enabled: boolean;
  frameworks: string[];
  requirements: string[];
  controls: string[];
  auditing: boolean;
  reporting: boolean;
  monitoring: boolean;
}

export interface AccessManagement {
  enabled: boolean;
  rbac: RoleBasedAccessControl;
  abac: AttributeBasedAccessControl;
  entitlements: EntitlementManagement;
  privileged: PrivilegedAccessManagement;
  just_in_time: JustInTimeAccess;
  monitoring: AccessMonitoring;
}

export interface RoleBasedAccessControl {
  enabled: boolean;
  roles: AccessRole[];
  permissions: AccessPermission[];
  assignments: RoleAssignment[];
  hierarchy: RoleHierarchy;
  delegation: RoleDelegation;
  monitoring: RBACMonitoring;
}

export interface AccessRole {
  id: string;
  name: string;
  description: string;
  type: 'functional' | 'organizational' | 'technical' | 'emergency';
  scope: string[];
  permissions: string[];
  constraints: RoleConstraint[];
  approval: boolean;
  temporary: boolean;
  delegation: boolean;
  monitoring: boolean;
}

export interface RoleConstraint {
  id: string;
  name: string;
  type: 'time' | 'location' | 'device' | 'risk' | 'segregation';
  condition: string;
  enforcement: 'advisory' | 'mandatory';
  exceptions: string[];
  monitoring: boolean;
}

export interface AccessPermission {
  id: string;
  name: string;
  description: string;
  type: 'read' | 'write' | 'execute' | 'delete' | 'admin' | 'custom';
  resource: string;
  actions: string[];
  conditions: string[];
  constraints: PermissionConstraint[];
  delegation: boolean;
  temporary: boolean;
}

export interface PermissionConstraint {
  id: string;
  name: string;
  type: 'time' | 'location' | 'device' | 'risk' | 'data';
  condition: string;
  enforcement: 'advisory' | 'mandatory';
  exceptions: string[];
  monitoring: boolean;
}

export interface RoleAssignment {
  id: string;
  user: string;
  role: string;
  effective: Date;
  expires?: Date;
  conditions: string[];
  approver: string;
  approved: Date;
  reason: string;
  status: 'active' | 'inactive' | 'expired' | 'revoked';
  monitoring: boolean;
}

export interface RoleHierarchy {
  enabled: boolean;
  relationships: RoleRelationship[];
  inheritance: RoleInheritance;
  constraints: HierarchyConstraint[];
  monitoring: boolean;
}

export interface RoleRelationship {
  id: string;
  parent: string;
  child: string;
  type: 'inheritance' | 'delegation' | 'constraint';
  conditions: string[];
  enabled: boolean;
}

export interface RoleInheritance {
  enabled: boolean;
  permissions: boolean;
  constraints: boolean;
  temporary: boolean;
  delegation: boolean;
  monitoring: boolean;
}

export interface HierarchyConstraint {
  id: string;
  name: string;
  type: 'segregation' | 'cardinality' | 'prerequisite' | 'mutual-exclusion';
  condition: string;
  enforcement: 'advisory' | 'mandatory';
  exceptions: string[];
  monitoring: boolean;
}

export interface RoleDelegation {
  enabled: boolean;
  rules: DelegationRule[];
  approval: boolean;
  monitoring: boolean;
  auditing: boolean;
  constraints: DelegationConstraint[];
}

export interface DelegationRule {
  id: string;
  name: string;
  delegator: string;
  delegate: string;
  roles: string[];
  permissions: string[];
  conditions: string[];
  duration: number;
  approval: boolean;
  monitoring: boolean;
}

export interface DelegationConstraint {
  id: string;
  name: string;
  type: 'time' | 'approval' | 'segregation' | 'cardinality';
  condition: string;
  enforcement: 'advisory' | 'mandatory';
  exceptions: string[];
  monitoring: boolean;
}

export interface RBACMonitoring {
  enabled: boolean;
  metrics: string[];
  alerts: string[];
  violations: boolean;
  usage: boolean;
  effectiveness: boolean;
  reporting: boolean;
}

export interface AttributeBasedAccessControl {
  enabled: boolean;
  attributes: AccessAttribute[];
  policies: ABACPolicy[];
  rules: ABACRule[];
  evaluation: PolicyEvaluation;
  monitoring: ABACMonitoring;
}

export interface AccessAttribute {
  id: string;
  name: string;
  description: string;
  type: 'subject' | 'object' | 'action' | 'environment' | 'resource';
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'list' | 'object';
  source: 'user' | 'system' | 'external' | 'computed';
  values: any[];
  constraints: AttributeConstraint[];
  dynamic: boolean;
  cacheable: boolean;
}

export interface AttributeConstraint {
  id: string;
  name: string;
  type: 'format' | 'range' | 'enumeration' | 'dependency';
  condition: string;
  enforcement: 'advisory' | 'mandatory';
  exceptions: string[];
  monitoring: boolean;
}

export interface ABACPolicy {
  id: string;
  name: string;
  description: string;
  type: 'permit' | 'deny' | 'indeterminate';
  target: PolicyTarget;
  condition: PolicyCondition;
  obligations: PolicyObligation[];
  advice: PolicyAdvice[];
  combining: 'deny-overrides' | 'permit-overrides' | 'first-applicable' | 'deny-unless-permit';
  enabled: boolean;
  version: string;
  effective: Date;
  expires?: Date;
}

export interface PolicyTarget {
  subjects: TargetMatch[];
  objects: TargetMatch[];
  actions: TargetMatch[];
  environments: TargetMatch[];
  resources: TargetMatch[];
}

export interface TargetMatch {
  attribute: string;
  operator: 'equals' | 'not-equals' | 'in' | 'not-in' | 'contains' | 'regex';
  value: any;
  caseSensitive: boolean;
}

export interface PolicyCondition {
  expression: string;
  attributes: string[];
  functions: string[];
  operators: string[];
  evaluation: 'lazy' | 'eager';
}

export interface PolicyObligation {
  id: string;
  name: string;
  type: 'logging' | 'notification' | 'encryption' | 'monitoring' | 'custom';
  fulfillment: 'pre' | 'post' | 'ongoing';
  parameters: Record<string, any>;
  enforcement: 'advisory' | 'mandatory';
  enabled: boolean;
}

export interface PolicyAdvice {
  id: string;
  name: string;
  type: 'warning' | 'recommendation' | 'information' | 'custom';
  message: string;
  parameters: Record<string, any>;
  enabled: boolean;
}

export interface ABACRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  effect: 'permit' | 'deny' | 'indeterminate';
  priority: number;
  enabled: boolean;
  statistics: ABACRuleStatistics;
}

export interface ABACRuleStatistics {
  evaluations: number;
  permits: number;
  denies: number;
  indeterminates: number;
  averageLatency: number;
  lastEvaluated: Date;
}

export interface PolicyEvaluation {
  enabled: boolean;
  engine: 'xacml' | 'cedar' | 'opa' | 'custom';
  caching: boolean;
  optimization: boolean;
  monitoring: boolean;
  auditing: boolean;
  performance: EvaluationPerformance;
}

export interface EvaluationPerformance {
  latency: number;
  throughput: number;
  cacheHitRate: number;
  errorRate: number;
  optimization: boolean;
  monitoring: boolean;
}

export interface ABACMonitoring {
  enabled: boolean;
  metrics: string[];
  alerts: string[];
  violations: boolean;
  performance: boolean;
  usage: boolean;
  effectiveness: boolean;
  reporting: boolean;
}

export interface EntitlementManagement {
  enabled: boolean;
  catalogs: AccessCatalog[];
  requests: AccessRequest[];
  approvals: AccessApproval[];
  reviews: AccessReview[];
  analytics: EntitlementAnalytics;
  automation: EntitlementAutomation;
}

export interface AccessCatalog {
  id: string;
  name: string;
  description: string;
  type: 'application' | 'resource' | 'role' | 'group' | 'entitlement';
  items: CatalogItem[];
  categories: CatalogCategory[];
  access: CatalogAccess;
  approval: CatalogApproval;
  monitoring: boolean;
}

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  type: 'application' | 'resource' | 'role' | 'group' | 'permission';
  category: string;
  owner: string;
  manager: string;
  approval: ItemApproval;
  risk: ItemRisk;
  compliance: ItemCompliance;
  usage: ItemUsage;
  access: ItemAccess;
  constraints: ItemConstraint[];
}

export interface ItemApproval {
  required: boolean;
  approvers: string[];
  escalation: boolean;
  timeout: number;
  delegation: boolean;
  parallel: boolean;
}

export interface ItemRisk {
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  score: number;
  assessment: Date;
  assessor: string;
  mitigation: string[];
}

export interface ItemCompliance {
  frameworks: string[];
  requirements: string[];
  controls: string[];
  attestation: boolean;
  monitoring: boolean;
  reporting: boolean;
}

export interface ItemUsage {
  users: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'rarely';
  lastUsed: Date;
  trending: 'up' | 'down' | 'stable';
  analytics: boolean;
}

export interface ItemAccess {
  direct: boolean;
  inherited: boolean;
  delegated: boolean;
  temporary: boolean;
  emergency: boolean;
  scheduled: boolean;
}

export interface ItemConstraint {
  id: string;
  name: string;
  type: 'time' | 'location' | 'device' | 'risk' | 'segregation';
  condition: string;
  enforcement: 'advisory' | 'mandatory';
  exceptions: string[];
  monitoring: boolean;
}

export interface CatalogCategory {
  id: string;
  name: string;
  description: string;
  parent?: string;
  items: string[];
  access: CategoryAccess;
  approval: CategoryApproval;
  monitoring: boolean;
}

export interface CategoryAccess {
  users: string[];
  groups: string[];
  roles: string[];
  conditions: string[];
  exceptions: string[];
}

export interface CategoryApproval {
  required: boolean;
  approvers: string[];
  escalation: boolean;
  timeout: number;
  delegation: boolean;
}

export interface CatalogAccess {
  users: string[];
  groups: string[];
  roles: string[];
  conditions: string[];
  exceptions: string[];
  selfService: boolean;
  delegation: boolean;
}

export interface CatalogApproval {
  required: boolean;
  approvers: string[];
  escalation: boolean;
  timeout: number;
  delegation: boolean;
  parallel: boolean;
}

export interface AccessRequest {
  id: string;
  type: 'access' | 'modification' | 'removal' | 'renewal' | 'emergency';
  requestor: string;
  beneficiary: string;
  items: RequestItem[];
  justification: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  duration: number;
  conditions: string[];
  approval: RequestApproval;
  status: 'submitted' | 'pending' | 'approved' | 'rejected' | 'expired' | 'cancelled';
  created: Date;
  modified: Date;
  effective?: Date;
  expires?: Date;
}

export interface RequestItem {
  id: string;
  catalog: string;
  item: string;
  type: 'add' | 'remove' | 'modify';
  justification: string;
  duration: number;
  conditions: string[];
  approval: RequestApproval;
  status: 'pending' | 'approved' | 'rejected';
}

export interface RequestApproval {
  required: boolean;
  approvers: string[];
  current: string;
  completed: ApprovalStep[];
  pending: ApprovalStep[];
  escalation: boolean;
  timeout: number;
  delegation: boolean;
}

export interface ApprovalStep {
  id: string;
  approver: string;
  decision: 'approved' | 'rejected' | 'delegated';
  timestamp: Date;
  comments: string;
  conditions: string[];
  delegation?: string;
}

export interface AccessApproval {
  id: string;
  request: string;
  approver: string;
  decision: 'approved' | 'rejected' | 'delegated';
  timestamp: Date;
  comments: string;
  conditions: string[];
  delegation?: string;
  escalation?: boolean;
  timeout?: Date;
}

export interface AccessReview {
  id: string;
  name: string;
  type: 'user' | 'role' | 'resource' | 'entitlement' | 'segregation';
  scope: ReviewScope;
  schedule: ReviewSchedule;
  reviewers: string[];
  items: ReviewItem[];
  decisions: ReviewDecision[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  created: Date;
  started?: Date;
  completed?: Date;
  effectiveness: ReviewEffectiveness;
}

export interface ReviewScope {
  users: string[];
  groups: string[];
  roles: string[];
  resources: string[];
  applications: string[];
  conditions: string[];
  exclusions: string[];
}

export interface ReviewSchedule {
  type: 'one-time' | 'recurring';
  frequency: 'monthly' | 'quarterly' | 'semi-annually' | 'annually';
  start: Date;
  end?: Date;
  reminders: boolean;
  escalation: boolean;
  automation: boolean;
}

export interface ReviewItem {
  id: string;
  type: 'user-access' | 'role-assignment' | 'resource-permission' | 'entitlement';
  subject: string;
  object: string;
  access: string[];
  risk: 'low' | 'medium' | 'high' | 'critical';
  lastUsed: Date;
  justification: string;
  reviewer: string;
  decision: ReviewDecision;
  status: 'pending' | 'reviewed' | 'approved' | 'revoked' | 'modified';
}

export interface ReviewDecision {
  id: string;
  item: string;
  reviewer: string;
  decision: 'approve' | 'revoke' | 'modify' | 'transfer' | 'escalate';
  timestamp: Date;
  comments: string;
  conditions: string[];
  rationale: string;
  evidence: string[];
}

export interface ReviewEffectiveness {
  completion: number;
  timeliness: number;
  accuracy: number;
  coverage: number;
  efficiency: number;
  satisfaction: number;
  improvements: string[];
}

export interface EntitlementAnalytics {
  enabled: boolean;
  metrics: AnalyticsMetric[];
  reports: AnalyticsReport[];
  dashboards: AnalyticsDashboard[];
  insights: AnalyticsInsight[];
  predictions: AnalyticsPrediction[];
  recommendations: AnalyticsRecommendation[];
}

export interface AnalyticsMetric {
  id: string;
  name: string;
  type: 'access' | 'usage' | 'risk' | 'compliance' | 'efficiency';
  calculation: string;
  frequency: 'realtime' | 'daily' | 'weekly' | 'monthly';
  target: number;
  threshold: number;
  trend: 'up' | 'down' | 'stable';
  significance: 'low' | 'medium' | 'high' | 'critical';
}

export interface AnalyticsInsight {
  id: string;
  type: 'pattern' | 'anomaly' | 'trend' | 'correlation' | 'prediction';
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  evidence: string[];
  recommendations: string[];
  timestamp: Date;
  status: 'new' | 'investigating' | 'confirmed' | 'resolved';
}

export interface AnalyticsRecommendation {
  id: string;
  type: 'optimization' | 'risk-reduction' | 'compliance' | 'efficiency' | 'security';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  rationale: string;
  benefits: string[];
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  dependencies: string[];
  implementation: string[];
  measurement: string[];
}

export interface EntitlementAutomation {
  enabled: boolean;
  workflows: EntitlementWorkflow[];
  rules: EntitlementRule[];
  policies: EntitlementPolicy[];
  monitoring: EntitlementMonitoring;
  governance: EntitlementGovernance;
}

export interface EntitlementWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: 'manual' | 'scheduled' | 'event' | 'condition';
  steps: EntitlementStep[];
  approval: boolean;
  monitoring: boolean;
  auditing: boolean;
  rollback: boolean;
}

export interface EntitlementStep {
  id: string;
  name: string;
  type: 'provision' | 'deprovision' | 'modify' | 'review' | 'approve' | 'notify';
  configuration: Record<string, any>;
  conditions: string[];
  approval: boolean;
  automation: boolean;
  rollback: boolean;
}

export interface EntitlementRule {
  id: string;
  name: string;
  description: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  enabled: boolean;
  priority: number;
  statistics: EntitlementRuleStatistics;
}

export interface EntitlementRuleStatistics {
  executions: number;
  successes: number;
  failures: number;
  provisions: number;
  deprovisions: number;
  modifications: number;
  averageLatency: number;
  lastExecution: Date;
}

export interface EntitlementPolicy {
  id: string;
  name: string;
  description: string;
  type: 'provisioning' | 'deprovisioning' | 'review' | 'approval' | 'segregation';
  scope: string[];
  rules: string[];
  enforcement: 'advisory' | 'mandatory';
  exceptions: string[];
  monitoring: boolean;
  reporting: boolean;
}

export interface EntitlementMonitoring {
  enabled: boolean;
  metrics: string[];
  alerts: string[];
  violations: boolean;
  usage: boolean;
  effectiveness: boolean;
  reporting: boolean;
  auditing: boolean;
}

export interface EntitlementGovernance {
  enabled: boolean;
  policies: string[];
  controls: string[];
  compliance: string[];
  auditing: boolean;
  reporting: boolean;
  monitoring: boolean;
}

export interface PrivilegedAccessManagement {
  enabled: boolean;
  accounts: PrivilegedAccount[];
  sessions: PrivilegedSession[];
  vaults: PasswordVault[];
  discovery: AccountDiscovery;
  rotation: PasswordRotation;
  monitoring: PAMMonitoring;
  compliance: PAMCompliance;
}

export interface PrivilegedAccount {
  id: string;
  name: string;
  type: 'shared' | 'service' | 'emergency' | 'application' | 'system';
  system: string;
  domain: string;
  privileges: string[];
  password: AccountPassword;
  access: AccountAccess;
  monitoring: AccountMonitoring;
  compliance: AccountCompliance;
  status: 'active' | 'inactive' | 'locked' | 'expired';
  created: Date;
  modified: Date;
  lastUsed: Date;
  lastRotated: Date;
}

export interface AccountPassword {
  value: string;
  complexity: PasswordComplexity;
  expiration: Date;
  history: PasswordHistory[];
  rotation: PasswordRotationConfig;
  encrypted: boolean;
  hashed: boolean;
}

export interface PasswordComplexity {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  dictionary: boolean;
  patterns: boolean;
}

export interface PasswordHistory {
  password: string;
  changed: Date;
  changedBy: string;
  reason: string;
}

export interface PasswordRotationConfig {
  enabled: boolean;
  frequency: number;
  automatic: boolean;
  notification: boolean;
  validation: boolean;
  rollback: boolean;
}

export interface AccountAccess {
  users: string[];
  groups: string[];
  roles: string[];
  conditions: string[];
  approval: boolean;
  emergency: boolean;
  scheduled: boolean;
  temporary: boolean;
}

export interface AccountMonitoring {
  enabled: boolean;
  logging: boolean;
  recording: boolean;
  alerting: boolean;
  reporting: boolean;
  analytics: boolean;
}

export interface AccountCompliance {
  frameworks: string[];
  requirements: string[];
  controls: string[];
  attestation: boolean;
  monitoring: boolean;
  reporting: boolean;
}

export interface PrivilegedSession {
  id: string;
  user: string;
  account: string;
  system: string;
  protocol: 'ssh' | 'rdp' | 'telnet' | 'https' | 'database' | 'custom';
  started: Date;
  ended?: Date;
  duration: number;
  activities: SessionActivity[];
  recording: SessionRecording;
  monitoring: SessionMonitoring;
  compliance: SessionCompliance;
  status: 'active' | 'completed' | 'terminated' | 'suspended';
}

export interface SessionActivity {
  id: string;
  timestamp: Date;
  type: 'login' | 'logout' | 'command' | 'file' | 'network' | 'screen' | 'keyboard' | 'mouse';
  data: Record<string, any>;
  risk: 'low' | 'medium' | 'high' | 'critical';
  blocked: boolean;
  reason: string;
}

export interface SessionRecording {
  enabled: boolean;
  video: boolean;
  audio: boolean;
  keystrokes: boolean;
  files: boolean;
  network: boolean;
  location: string;
  encrypted: boolean;
  retention: number;
  analytics: boolean;
}

export interface SessionMonitoring {
  enabled: boolean;
  realtime: boolean;
  alerting: boolean;
  intervention: boolean;
  termination: boolean;
  reporting: boolean;
  analytics: boolean;
}

export interface SessionCompliance {
  frameworks: string[];
  requirements: string[];
  controls: string[];
  attestation: boolean;
  monitoring: boolean;
  reporting: boolean;
}

export interface PasswordVault {
  id: string;
  name: string;
  type: 'shared' | 'personal' | 'service' | 'emergency';
  encryption: VaultEncryption;
  access: VaultAccess;
  policies: VaultPolicy[];
  accounts: string[];
  monitoring: VaultMonitoring;
  compliance: VaultCompliance;
  backup: VaultBackup;
  status: 'active' | 'inactive' | 'locked' | 'compromised';
}

export interface VaultEncryption {
  algorithm: string;
  keyLength: number;
  keyRotation: boolean;
  hardware: boolean;
  fips: boolean;
  backup: boolean;
}

export interface VaultAccess {
  users: string[];
  groups: string[];
  roles: string[];
  conditions: string[];
  approval: boolean;
  mfa: boolean;
  emergency: boolean;
  audit: boolean;
}

export interface VaultPolicy {
  id: string;
  name: string;
  type: 'access' | 'password' | 'rotation' | 'monitoring' | 'compliance';
  rules: string[];
  enforcement: 'advisory' | 'mandatory';
  exceptions: string[];
  monitoring: boolean;
}

export interface VaultMonitoring {
  enabled: boolean;
  access: boolean;
  changes: boolean;
  rotation: boolean;
  alerts: boolean;
  reporting: boolean;
  analytics: boolean;
}

export interface VaultCompliance {
  frameworks: string[];
  requirements: string[];
  controls: string[];
  attestation: boolean;
  monitoring: boolean;
  reporting: boolean;
}

export interface VaultBackup {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  retention: number;
  encryption: boolean;
  verification: boolean;
  offsite: boolean;
  testing: boolean;
}

export interface AccountDiscovery {
  enabled: boolean;
  targets: DiscoveryTarget[];
  methods: DiscoveryMethod[];
  schedule: DiscoverySchedule;
  rules: DiscoveryRule[];
  results: DiscoveryResult[];
  monitoring: DiscoveryMonitoring;
}

export interface DiscoveryTarget {
  id: string;
  name: string;
  type: 'domain' | 'network' | 'system' | 'application' | 'database';
  address: string;
  credentials: string;
  protocols: string[];
  ports: number[];
  enabled: boolean;
  lastScan: Date;
  nextScan: Date;
}

export interface DiscoveryMethod {
  id: string;
  name: string;
  type: 'network' | 'directory' | 'registry' | 'file' | 'database' | 'api';
  configuration: Record<string, any>;
  enabled: boolean;
  priority: number;
  timeout: number;
  retries: number;
}

export interface DiscoverySchedule {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  timezone: string;
  notification: boolean;
  escalation: boolean;
}

export interface DiscoveryRule {
  id: string;
  name: string;
  condition: string;
  action: 'include' | 'exclude' | 'flag' | 'onboard';
  priority: number;
  enabled: boolean;
  statistics: DiscoveryRuleStatistics;
}

export interface DiscoveryRuleStatistics {
  processed: number;
  matched: number;
  included: number;
  excluded: number;
  flagged: number;
  onboarded: number;
}

export interface DiscoveryResult {
  id: string;
  target: string;
  method: string;
  account: string;
  type: 'local' | 'domain' | 'service' | 'application' | 'shared';
  privileges: string[];
  status: 'new' | 'managed' | 'orphaned' | 'inactive' | 'flagged';
  risk: 'low' | 'medium' | 'high' | 'critical';
  discovered: Date;
  lastSeen: Date;
  actions: string[];
}

export interface DiscoveryMonitoring {
  enabled: boolean;
  metrics: string[];
  alerts: string[];
  reporting: boolean;
  analytics: boolean;
  trends: boolean;
}

export interface PasswordRotation {
  enabled: boolean;
  policies: RotationPolicy[];
  schedule: RotationSchedule;
  automation: RotationAutomation;
  verification: RotationVerification;
  rollback: RotationRollback;
  monitoring: RotationMonitoring;
}

export interface RotationPolicy {
  id: string;
  name: string;
  scope: string[];
  frequency: number;
  complexity: PasswordComplexity;
  verification: boolean;
  notification: boolean;
  rollback: boolean;
  exceptions: string[];
  enabled: boolean;
}

export interface RotationSchedule {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  time: string;
  timezone: string;
  batch: boolean;
  notification: boolean;
  escalation: boolean;
}

export interface RotationAutomation {
  enabled: boolean;
  triggers: string[];
  conditions: string[];
  actions: string[];
  approval: boolean;
  rollback: boolean;
  monitoring: boolean;
}

export interface RotationVerification {
  enabled: boolean;
  methods: string[];
  timeout: number;
  retries: number;
  rollback: boolean;
  notification: boolean;
}

export interface RotationRollback {
  enabled: boolean;
  conditions: string[];
  timeout: number;
  notification: boolean;
  approval: boolean;
  monitoring: boolean;
}

export interface RotationMonitoring {
  enabled: boolean;
  success: boolean;
  failure: boolean;
  latency: boolean;
  verification: boolean;
  rollback: boolean;
  reporting: boolean;
}

export interface PAMMonitoring {
  enabled: boolean;
  accounts: boolean;
  sessions: boolean;
  access: boolean;
  activities: boolean;
  policies: boolean;
  compliance: boolean;
  reporting: boolean;
}

export interface PAMCompliance {
  enabled: boolean;
  frameworks: string[];
  requirements: string[];
  controls: string[];
  attestation: boolean;
  monitoring: boolean;
  reporting: boolean;
}

export interface JustInTimeAccess {
  enabled: boolean;
  policies: JITPolicy[];
  requests: JITRequest[];
  approvals: JITApproval[];
  sessions: JITSession[];
  monitoring: JITMonitoring;
  automation: JITAutomation;
}

export interface JITPolicy {
  id: string;
  name: string;
  description: string;
  scope: string[];
  duration: number;
  approval: boolean;
  conditions: string[];
  monitoring: boolean;
  automation: boolean;
  enabled: boolean;
}

export interface JITRequest {
  id: string;
  user: string;
  resource: string;
  access: string[];
  justification: string;
  duration: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  approval: RequestApproval;
  conditions: string[];
  status: 'submitted' | 'pending' | 'approved' | 'rejected' | 'expired';
  created: Date;
  effective?: Date;
  expires?: Date;
}

export interface JITApproval {
  id: string;
  request: string;
  approver: string;
  decision: 'approved' | 'rejected' | 'delegated';
  timestamp: Date;
  comments: string;
  conditions: string[];
  delegation?: string;
}

export interface JITSession {
  id: string;
  user: string;
  resource: string;
  access: string[];
  started: Date;
  expires: Date;
  ended?: Date;
  activities: SessionActivity[];
  monitoring: SessionMonitoring;
  status: 'active' | 'expired' | 'revoked' | 'completed';
}

export interface JITMonitoring {
  enabled: boolean;
  requests: boolean;
  approvals: boolean;
  sessions: boolean;
  activities: boolean;
  violations: boolean;
  reporting: boolean;
}

export interface JITAutomation {
  enabled: boolean;
  approval: boolean;
  provisioning: boolean;
  deprovisioning: boolean;
  monitoring: boolean;
  compliance: boolean;
}

export interface AccessMonitoring {
  enabled: boolean;
  realtime: boolean;
  behavioral: boolean;
  anomaly: boolean;
  risk: boolean;
  compliance: boolean;
  reporting: boolean;
  analytics: boolean;
}

export interface IdentityMonitoring {
  enabled: boolean;
  authentication: boolean;
  authorization: boolean;
  provisioning: boolean;
  deprovisioning: boolean;
  access: boolean;
  compliance: boolean;
  reporting: boolean;
}

export interface ThreatDetectionSystem {
  enabled: boolean;
  engines: ThreatEngine[];
  feeds: ThreatFeed[];
  hunting: ThreatHunting;
  intelligence: ThreatIntelligence;
  response: ThreatResponse;
  sharing: ThreatSharing;
  monitoring: ThreatMonitoring;
}

export interface ThreatEngine {
  id: string;
  name: string;
  type: 'signature' | 'behavior' | 'anomaly' | 'ml' | 'heuristic' | 'reputation';
  status: 'active' | 'inactive' | 'updating' | 'error';
  configuration: ThreatEngineConfiguration;
  rules: ThreatRule[];
  models: ThreatModel[];
  performance: ThreatEnginePerformance;
  results: ThreatDetectionResult[];
  lastUpdate: Date;
}

export interface ThreatEngineConfiguration {
  enabled: boolean;
  sensitivity: 'low' | 'medium' | 'high' | 'paranoid';
  thresholds: Record<string, number>;
  whitelist: string[];
  blacklist: string[];
  learning: boolean;
  feedback: boolean;
  tuning: boolean;
}

export interface ThreatRule {
  id: string;
  name: string;
  type: 'signature' | 'behavior' | 'anomaly' | 'correlation' | 'custom';
  pattern: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  categories: string[];
  tactics: string[];
  techniques: string[];
  mitigations: string[];
  references: string[];
  enabled: boolean;
  statistics: ThreatRuleStatistics;
}

export interface ThreatRuleStatistics {
  detections: number;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  accuracy: number;
  precision: number;
  recall: number;
  lastDetection: Date;
}

export interface ThreatModel {
  id: string;
  name: string;
  type: 'classification' | 'regression' | 'clustering' | 'anomaly' | 'forecasting';
  algorithm: string;
  features: string[];
  training: ThreatModelTraining;
  performance: ThreatModelPerformance;
  deployment: ThreatModelDeployment;
  monitoring: ThreatModelMonitoring;
  version: string;
  status: 'active' | 'inactive' | 'training' | 'evaluating' | 'deployed';
}

export interface ThreatModelTraining {
  dataset: string;
  features: string[];
  labels: string[];
  algorithm: string;
  parameters: Record<string, any>;
  epochs: number;
  batchSize: number;
  learningRate: number;
  validationSplit: number;
  earlyStoppingPatience: number;
  metrics: string[];
  crossValidation: {
    enabled: boolean;
    folds: number;
    strategy: string;
  };
  hyperparameterTuning: {
    enabled: boolean;
    method: string;
    searchSpace: Record<string, any>;
    maxTrials: number;
  };
}

export interface ThreatModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  confusionMatrix: number[][];
  featureImportance: Record<string, number>;
  validationMetrics: Record<string, number>;
}

export interface ThreatModelDeployment {
  environment: string;
  endpoint: string;
  scaling: {
    minInstances: number;
    maxInstances: number;
    targetUtilization: number;
  };
  monitoring: {
    enabled: boolean;
    alerting: boolean;
    dashboard: string;
  };
}

export interface ThreatModelMonitoring {
  drift: {
    enabled: boolean;
    threshold: number;
    alerting: boolean;
  };
  performance: {
    enabled: boolean;
    metrics: string[];
    alerting: boolean;
  };
  feedback: {
    enabled: boolean;
    collection: string;
    retraining: boolean;
  };
}
