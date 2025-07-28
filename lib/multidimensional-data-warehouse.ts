
/**
 * MULTI-DIMENSIONAL DATA WAREHOUSE
 * OLAP capabilities, data cubes, dimensional modeling,
 * advanced statistical analysis, and data mining
 */

import { prisma } from '@/lib/db';
import { eventBus } from '@/lib/event-bus-system';
import type {
  DataCube as DataCubeType,
  Dimension as DimensionType,
  Measure as MeasureType,
  Hierarchy as HierarchyType,
  ResponsiveBreakpoint,
  FilterRule
} from '@/lib/types';

export interface DataWarehouse {
  id: string;
  name: string;
  description: string;
  schema: WarehouseSchema;
  dimensions: Dimension[];
  measures: Measure[];
  cubes: DataCube[];
  hierarchies: Hierarchy[];
  partitions: Partition[];
  aggregations: Aggregation[];
  indexes: Index[];
  metadata: WarehouseMetadata;
  tenantId: string;
  createdAt: Date;
  lastUpdated: Date;
}

export interface WarehouseSchema {
  factTables: FactTable[];
  dimensionTables: DimensionTable[];
  lookupTables: LookupTable[];
  bridgeTables: BridgeTable[];
  relationships: Relationship[];
  constraints: Constraint[];
  partitioningStrategy: PartitioningStrategy;
  indexingStrategy: IndexingStrategy;
}

export interface FactTable {
  id: string;
  name: string;
  description: string;
  columns: Column[];
  measures: string[];
  dimensions: string[];
  granularity: string;
  partitionKey: string;
  distributionKey: string;
  compressionType: 'none' | 'gzip' | 'lzo' | 'snappy' | 'zstd';
  storage: StorageConfig;
  refresh: RefreshConfig;
}

export interface DimensionTable {
  id: string;
  name: string;
  description: string;
  columns: Column[];
  hierarchies: string[];
  attributes: Attribute[];
  slowlyChangingDimension: SCDConfig;
  naturalKey: string;
  surrogateKey: string;
  validFrom: string;
  validTo: string;
  currentFlag: string;
  versionNumber: string;
}

export interface Column {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'json' | 'array';
  nullable: boolean;
  primaryKey: boolean;
  foreignKey: string;
  unique: boolean;
  indexed: boolean;
  compressed: boolean;
  encrypted: boolean;
  defaultValue: any;
  constraints: string[];
  description: string;
  format: string;
}

export interface Attribute {
  name: string;
  type: 'categorical' | 'numerical' | 'temporal' | 'spatial' | 'textual';
  values: any[];
  cardinality: number;
  distribution: AttributeDistribution;
  quality: DataQuality;
  lineage: DataLineage;
}

export interface AttributeDistribution {
  min: number;
  max: number;
  mean: number;
  median: number;
  mode: any[];
  standardDeviation: number;
  skewness: number;
  kurtosis: number;
  percentiles: Record<string, number>;
  histogram: HistogramBin[];
}

export interface HistogramBin {
  range: [number, number];
  count: number;
  percentage: number;
}

export interface DataQuality {
  completeness: number;
  accuracy: number;
  consistency: number;
  validity: number;
  uniqueness: number;
  timeliness: number;
  issues: QualityIssue[];
  score: number;
}

export interface QualityIssue {
  type: 'missing' | 'invalid' | 'duplicate' | 'inconsistent' | 'outdated';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  count: number;
  percentage: number;
  examples: any[];
  suggestedFix: string;
}

export interface DataLineage {
  source: string;
  transformations: Transformation[];
  dependencies: string[];
  impact: string[];
  lastUpdated: Date;
  updateFrequency: string;
  dataflow: DataflowStep[];
}

export interface Transformation {
  id: string;
  name: string;
  type: 'extract' | 'transform' | 'load' | 'aggregate' | 'join' | 'filter' | 'clean';
  description: string;
  source: string;
  target: string;
  rules: TransformationRule[];
  validation: ValidationRule[];
  performance: TransformationPerformance;
}

export interface TransformationRule {
  condition: string;
  action: string;
  parameters: any;
  priority: number;
  enabled: boolean;
}

export interface ValidationRule {
  type: 'required' | 'range' | 'format' | 'custom';
  condition: string;
  message: string;
  severity: 'warning' | 'error';
}

export interface TransformationPerformance {
  executionTime: number;
  memoryUsage: number;
  throughput: number;
  errorRate: number;
  lastRun: Date;
  averagePerformance: number;
}

export interface DataflowStep {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime: Date;
  duration: number;
  recordsProcessed: number;
  errors: string[];
  warnings: string[];
}

export interface SCDConfig {
  type: 'type0' | 'type1' | 'type2' | 'type3' | 'type4' | 'type6';
  enabled: boolean;
  trackingColumns: string[];
  versioningStrategy: 'timestamp' | 'sequence' | 'hash';
  retentionPeriod: number;
  compressionEnabled: boolean;
}

export interface LookupTable {
  id: string;
  name: string;
  description: string;
  columns: Column[];
  keyColumn: string;
  valueColumn: string;
  cacheEnabled: boolean;
  cacheStrategy: 'memory' | 'disk' | 'distributed';
  refreshInterval: number;
}

export interface BridgeTable {
  id: string;
  name: string;
  description: string;
  leftTable: string;
  rightTable: string;
  leftKey: string;
  rightKey: string;
  relationship: 'many-to-many' | 'many-to-one' | 'one-to-many';
  effectiveDate: string;
  expirationDate: string;
  weight: number;
}

export interface Relationship {
  id: string;
  name: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many';
  parentTable: string;
  childTable: string;
  parentKey: string;
  childKey: string;
  cardinality: number;
  referentialIntegrity: boolean;
  cascadeDelete: boolean;
  cascadeUpdate: boolean;
}

export interface Constraint {
  id: string;
  name: string;
  type: 'primary_key' | 'foreign_key' | 'unique' | 'check' | 'not_null';
  table: string;
  columns: string[];
  condition: string;
  enabled: boolean;
  deferrable: boolean;
  initially: 'deferred' | 'immediate';
}

export interface PartitioningStrategy {
  type: 'range' | 'hash' | 'list' | 'composite';
  column: string;
  partitions: PartitionDefinition[];
  pruning: PartitionPruning;
  maintenance: PartitionMaintenance;
}

export interface PartitionDefinition {
  name: string;
  condition: string;
  tablespace: string;
  compressed: boolean;
  readonly: boolean;
  archiveDate: Date;
}

export interface PartitionPruning {
  enabled: boolean;
  strategy: 'static' | 'dynamic';
  conditions: string[];
  performance: PruningPerformance;
}

export interface PruningPerformance {
  eliminatedPartitions: number;
  totalPartitions: number;
  pruningTime: number;
  querySpeedup: number;
}

export interface PartitionMaintenance {
  autoCreate: boolean;
  autoArchive: boolean;
  autoDelete: boolean;
  retentionPeriod: number;
  archiveLocation: string;
  schedule: MaintenanceSchedule;
}

export interface MaintenanceSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  time: string;
  dayOfWeek: number;
  dayOfMonth: number;
  enabled: boolean;
}

export interface IndexingStrategy {
  primaryIndexes: IndexDefinition[];
  secondaryIndexes: IndexDefinition[];
  compositeIndexes: IndexDefinition[];
  partialIndexes: IndexDefinition[];
  functionIndexes: IndexDefinition[];
  spatialIndexes: IndexDefinition[];
  textIndexes: IndexDefinition[];
  maintenance: IndexMaintenance;
}

export interface IndexDefinition {
  name: string;
  table: string;
  columns: string[];
  type: 'btree' | 'hash' | 'gin' | 'gist' | 'spgist' | 'brin';
  unique: boolean;
  partial: boolean;
  condition: string;
  include: string[];
  fillfactor: number;
  tablespace: string;
  statistics: IndexStatistics;
}

export interface IndexStatistics {
  size: number;
  pages: number;
  tuples: number;
  usage: IndexUsage;
  maintenance: IndexMaintenanceStats;
}

export interface IndexUsage {
  scans: number;
  tuplesRead: number;
  tuplesReturned: number;
  selectivity: number;
  lastUsed: Date;
  frequency: number;
}

export interface IndexMaintenanceStats {
  lastVacuum: Date;
  lastAnalyze: Date;
  lastReindex: Date;
  bloatPercentage: number;
  fragmentationLevel: number;
}

export interface IndexMaintenance {
  autoVacuum: boolean;
  autoAnalyze: boolean;
  autoReindex: boolean;
  thresholds: MaintenanceThresholds;
  schedule: MaintenanceSchedule;
}

export interface MaintenanceThresholds {
  bloatThreshold: number;
  fragmentationThreshold: number;
  usageThreshold: number;
  sizeThreshold: number;
}

export interface StorageConfig {
  format: 'row' | 'column' | 'hybrid';
  compression: CompressionConfig;
  encryption: EncryptionConfig;
  replication: ReplicationConfig;
  backup: BackupConfig;
  archival: ArchivalConfig;
}

export interface CompressionConfig {
  enabled: boolean;
  algorithm: 'gzip' | 'lzo' | 'snappy' | 'zstd' | 'brotli';
  level: number;
  blockSize: number;
  ratio: number;
  savings: number;
}

export interface EncryptionConfig {
  enabled: boolean;
  algorithm: 'aes256' | 'aes128' | 'des' | 'rsa';
  keyManagement: 'internal' | 'external' | 'hsm';
  keyRotation: boolean;
  rotationInterval: number;
}

export interface ReplicationConfig {
  enabled: boolean;
  type: 'synchronous' | 'asynchronous' | 'semi-synchronous';
  replicas: ReplicaConfig[];
  failover: FailoverConfig;
  loadBalancing: LoadBalancingConfig;
}

export interface ReplicaConfig {
  id: string;
  location: string;
  priority: number;
  readonly: boolean;
  lag: number;
  status: 'healthy' | 'unhealthy' | 'syncing';
}

export interface FailoverConfig {
  enabled: boolean;
  automatic: boolean;
  threshold: number;
  cooldown: number;
  notifications: string[];
}

export interface LoadBalancingConfig {
  enabled: boolean;
  algorithm: 'round_robin' | 'least_connections' | 'weighted' | 'ip_hash';
  healthCheck: HealthCheckConfig;
  sessionAffinity: boolean;
}

export interface HealthCheckConfig {
  enabled: boolean;
  interval: number;
  timeout: number;
  threshold: number;
  path: string;
  expectedStatus: number;
}

export interface BackupConfig {
  enabled: boolean;
  type: 'full' | 'incremental' | 'differential';
  schedule: BackupSchedule;
  retention: RetentionPolicy;
  compression: boolean;
  encryption: boolean;
  verification: boolean;
  location: string;
}

export interface BackupSchedule {
  frequency: 'continuous' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  time: string;
  day: number;
  maxConcurrent: number;
  priority: number;
}

export interface RetentionPolicy {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
  archiveAfter: number;
  deleteAfter: number;
}

export interface ArchivalConfig {
  enabled: boolean;
  criteria: ArchivalCriteria;
  destination: string;
  compression: boolean;
  encryption: boolean;
  metadata: boolean;
  schedule: ArchivalSchedule;
}

export interface ArchivalCriteria {
  age: number;
  size: number;
  usage: number;
  conditions: string[];
}

export interface ArchivalSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  time: string;
  day: number;
  enabled: boolean;
}

export interface RefreshConfig {
  enabled: boolean;
  type: 'full' | 'incremental' | 'merge';
  schedule: RefreshSchedule;
  dependencies: string[];
  parallelism: number;
  timeout: number;
  retries: number;
  notifications: NotificationConfig[];
}

export interface RefreshSchedule {
  frequency: 'real-time' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  time: string;
  day: number;
  triggers: RefreshTrigger[];
  enabled: boolean;
}

export interface RefreshTrigger {
  type: 'time' | 'event' | 'data_change' | 'threshold';
  condition: string;
  enabled: boolean;
  priority: number;
}

export interface NotificationConfig {
  type: 'email' | 'slack' | 'webhook' | 'sms';
  recipients: string[];
  events: string[];
  template: string;
  enabled: boolean;
}

export interface Dimension {
  id: string;
  name: string;
  description: string;
  type: 'time' | 'geography' | 'product' | 'customer' | 'organization' | 'custom';
  table: string;
  keyColumn: string;
  nameColumn: string;
  hierarchies: string[];
  attributes: string[];
  levels: DimensionLevel[];
  slowlyChanging: boolean;
  naturalKey: string;
  surrogateKey: string;
  metadata: DimensionMetadata;
  tenantId: string;
}

export interface DimensionLevel {
  id: string;
  name: string;
  description: string;
  column: string;
  parentLevel: string;
  childLevel: string;
  cardinality: number;
  keyType: 'natural' | 'surrogate';
  orderBy: string;
  groupBy: string;
  nullable: boolean;
}

export interface DimensionMetadata {
  source: string;
  updateFrequency: string;
  lastUpdated: Date;
  recordCount: number;
  uniqueValues: number;
  nullPercentage: number;
  dataQuality: DataQuality;
}

export interface Measure {
  id: string;
  name: string;
  description: string;
  type: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'distinct_count' | 'calculated';
  column: string;
  aggregation: AggregationFunction;
  format: MeasureFormat;
  formula: string;
  dependencies: string[];
  constraints: MeasureConstraint[];
  metadata: MeasureMetadata;
  tenantId: string;
}

export interface AggregationFunction {
  type: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'median' | 'mode' | 'stddev' | 'variance';
  parameters: any;
  ignoreNulls: boolean;
  distinct: boolean;
  percentile: number;
  window: WindowFunction;
}

export interface WindowFunction {
  type: 'row' | 'range' | 'groups';
  partitionBy: string[];
  orderBy: string[];
  frame: WindowFrame;
}

export interface WindowFrame {
  type: 'rows' | 'range' | 'groups';
  start: FrameBound;
  end: FrameBound;
}

export interface FrameBound {
  type: 'unbounded_preceding' | 'preceding' | 'current_row' | 'following' | 'unbounded_following';
  offset: number;
}

export interface MeasureFormat {
  type: 'number' | 'currency' | 'percentage' | 'date' | 'time' | 'custom';
  precision: number;
  currency: string;
  locale: string;
  pattern: string;
  prefix: string;
  suffix: string;
}

export interface MeasureConstraint {
  type: 'range' | 'not_null' | 'positive' | 'custom';
  condition: string;
  message: string;
  severity: 'warning' | 'error';
}

export interface MeasureMetadata {
  source: string;
  calculation: string;
  businessDefinition: string;
  owner: string;
  lastUpdated: Date;
  usage: MeasureUsage;
  performance: MeasurePerformance;
}

export interface MeasureUsage {
  queries: number;
  reports: number;
  dashboards: number;
  lastUsed: Date;
  frequency: number;
  users: string[];
}

export interface MeasurePerformance {
  averageCalculationTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  indexUsage: number;
  optimization: OptimizationSuggestion[];
}

export interface OptimizationSuggestion {
  type: 'indexing' | 'aggregation' | 'partitioning' | 'caching' | 'materialization';
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  priority: number;
}

export interface DataCube {
  id: string;
  name: string;
  description: string;
  dimensions: string[];
  measures: string[];
  hierarchies: string[];
  aggregations: string[];
  partitions: string[];
  materializedViews: MaterializedView[];
  storage: CubeStorage;
  processing: CubeProcessing;
  security: CubeSecurity;
  metadata: CubeMetadata;
  tenantId: string;
}

export interface MaterializedView {
  id: string;
  name: string;
  description: string;
  query: string;
  dimensions: string[];
  measures: string[];
  filters: string[];
  aggregationLevel: string;
  storage: MaterializedViewStorage;
  refresh: MaterializedViewRefresh;
  usage: MaterializedViewUsage;
  performance: MaterializedViewPerformance;
}

export interface MaterializedViewStorage {
  size: number;
  rowCount: number;
  compression: boolean;
  indexing: boolean;
  partitioning: boolean;
  location: string;
}

export interface MaterializedViewRefresh {
  strategy: 'complete' | 'incremental' | 'fast' | 'force';
  schedule: RefreshSchedule;
  dependencies: string[];
  staleness: number;
  lastRefresh: Date;
  nextRefresh: Date;
}

export interface MaterializedViewUsage {
  queries: number;
  hits: number;
  hitRate: number;
  avgResponseTime: number;
  lastUsed: Date;
  users: string[];
}

export interface MaterializedViewPerformance {
  buildTime: number;
  refreshTime: number;
  querySpeedup: number;
  storageOverhead: number;
  maintenance: number;
}

export interface CubeStorage {
  type: 'molap' | 'rolap' | 'holap';
  format: 'star' | 'snowflake' | 'galaxy';
  compression: boolean;
  encryption: boolean;
  partitioning: boolean;
  clustering: boolean;
  indexing: boolean;
  caching: CubeCache;
}

export interface CubeCache {
  enabled: boolean;
  type: 'memory' | 'disk' | 'distributed';
  size: number;
  policy: 'lru' | 'lfu' | 'fifo' | 'random';
  ttl: number;
  hitRate: number;
  evictions: number;
}

export interface CubeProcessing {
  mode: 'batch' | 'streaming' | 'hybrid';
  parallelism: number;
  memory: number;
  timeout: number;
  retries: number;
  errorHandling: ErrorHandling;
  monitoring: ProcessingMonitoring;
}

export interface ErrorHandling {
  strategy: 'fail_fast' | 'continue' | 'retry' | 'skip';
  maxErrors: number;
  retryDelay: number;
  notifications: NotificationConfig[];
  logging: LoggingConfig;
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  destination: 'file' | 'database' | 'external';
  format: 'json' | 'text' | 'structured';
  retention: number;
  rotation: string;
}

export interface ProcessingMonitoring {
  enabled: boolean;
  metrics: ProcessingMetrics;
  alerts: ProcessingAlert[];
  dashboard: string;
  reporting: ProcessingReporting;
}

export interface ProcessingMetrics {
  throughput: number;
  latency: number;
  errorRate: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  networkUsage: number;
}

export interface ProcessingAlert {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
  enabled: boolean;
}

export interface ProcessingReporting {
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  template: string;
  metrics: string[];
  format: 'html' | 'pdf' | 'csv' | 'json';
}

export interface CubeSecurity {
  authentication: boolean;
  authorization: boolean;
  encryption: boolean;
  auditing: boolean;
  accessControl: AccessControl;
  dataPrivacy: DataPrivacy;
  compliance: Compliance;
}

export interface AccessControl {
  model: 'rbac' | 'abac' | 'dac' | 'mac';
  roles: Role[];
  permissions: Permission[];
  policies: Policy[];
  inheritance: boolean;
  delegation: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  users: string[];
  groups: string[];
  hierarchy: string;
  active: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  conditions: string[];
  effect: 'allow' | 'deny';
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  rules: PolicyRule[];
  priority: number;
  enabled: boolean;
}

export interface PolicyRule {
  condition: string;
  effect: 'allow' | 'deny';
  resources: string[];
  actions: string[];
  principal: string;
}

export interface DataPrivacy {
  anonymization: boolean;
  pseudonymization: boolean;
  encryption: boolean;
  masking: DataMasking;
  retention: DataRetention;
  consent: ConsentManagement;
}

export interface DataMasking {
  enabled: boolean;
  rules: MaskingRule[];
  techniques: MaskingTechnique[];
  formats: MaskingFormat[];
  testing: boolean;
}

export interface MaskingRule {
  id: string;
  name: string;
  description: string;
  column: string;
  technique: string;
  format: string;
  condition: string;
  enabled: boolean;
}

export interface MaskingTechnique {
  id: string;
  name: string;
  type: 'substitution' | 'shuffling' | 'nulling' | 'variance' | 'encryption';
  parameters: any;
  reversible: boolean;
  preserveFormat: boolean;
}

export interface MaskingFormat {
  id: string;
  name: string;
  pattern: string;
  example: string;
  validation: string;
  locale: string;
}

export interface DataRetention {
  enabled: boolean;
  policies: RetentionPolicy[];
  automation: boolean;
  archival: boolean;
  deletion: boolean;
  notifications: NotificationConfig[];
}

export interface ConsentManagement {
  enabled: boolean;
  purposes: ConsentPurpose[];
  legal_basis: LegalBasis[];
  tracking: ConsentTracking;
  withdrawal: ConsentWithdrawal;
}

export interface ConsentPurpose {
  id: string;
  name: string;
  description: string;
  category: string;
  required: boolean;
  lawfulBasis: string;
  retention: number;
}

export interface LegalBasis {
  id: string;
  name: string;
  description: string;
  type: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests';
  jurisdiction: string;
  reference: string;
}

export interface ConsentTracking {
  enabled: boolean;
  storage: 'database' | 'blockchain' | 'external';
  immutable: boolean;
  versioning: boolean;
  audit: boolean;
}

export interface ConsentWithdrawal {
  enabled: boolean;
  methods: string[];
  automation: boolean;
  notifications: NotificationConfig[];
  verification: boolean;
}

export interface Compliance {
  frameworks: ComplianceFramework[];
  requirements: ComplianceRequirement[];
  controls: ComplianceControl[];
  assessments: ComplianceAssessment[];
  reporting: ComplianceReporting;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  version: string;
  jurisdiction: string;
  requirements: string[];
  controls: string[];
  assessments: string[];
}

export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  framework: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'not_started' | 'in_progress' | 'completed' | 'non_compliant';
  controls: string[];
  evidence: string[];
}

export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  type: 'preventive' | 'detective' | 'corrective' | 'compensating';
  implementation: 'manual' | 'automated' | 'hybrid';
  testing: ControlTesting;
  effectiveness: ControlEffectiveness;
  monitoring: ControlMonitoring;
}

export interface ControlTesting {
  frequency: 'continuous' | 'monthly' | 'quarterly' | 'annually';
  method: 'walkthrough' | 'observation' | 'inspection' | 'reperformance';
  lastTest: Date;
  nextTest: Date;
  results: TestResult[];
}

export interface TestResult {
  date: Date;
  outcome: 'passed' | 'failed' | 'exception' | 'deficiency';
  evidence: string[];
  recommendations: string[];
  remediation: string[];
}

export interface ControlEffectiveness {
  rating: 'ineffective' | 'partially_effective' | 'effective' | 'highly_effective';
  justification: string;
  improvements: string[];
  lastAssessed: Date;
}

export interface ControlMonitoring {
  enabled: boolean;
  metrics: string[];
  thresholds: any;
  alerts: string[];
  dashboard: string;
  reporting: string;
}

export interface ComplianceAssessment {
  id: string;
  name: string;
  description: string;
  type: 'self' | 'internal' | 'external' | 'regulatory';
  framework: string;
  scope: string;
  status: 'planned' | 'in_progress' | 'completed' | 'remediation';
  schedule: AssessmentSchedule;
  findings: AssessmentFinding[];
  recommendations: string[];
  remediation: RemediationPlan;
}

export interface AssessmentSchedule {
  startDate: Date;
  endDate: Date;
  frequency: 'annual' | 'biannual' | 'quarterly' | 'monthly';
  resources: string[];
  dependencies: string[];
}

export interface AssessmentFinding {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: string;
  likelihood: string;
  risk: string;
  evidence: string[];
  recommendations: string[];
  owner: string;
  dueDate: Date;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted';
}

export interface RemediationPlan {
  id: string;
  name: string;
  description: string;
  actions: RemediationAction[];
  timeline: RemediationTimeline;
  resources: string[];
  budget: number;
  approval: string;
  tracking: RemediationTracking;
}

export interface RemediationAction {
  id: string;
  name: string;
  description: string;
  type: 'immediate' | 'short_term' | 'long_term' | 'ongoing';
  priority: 'low' | 'medium' | 'high' | 'critical';
  owner: string;
  dueDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
  dependencies: string[];
  resources: string[];
  cost: number;
}

export interface RemediationTimeline {
  startDate: Date;
  endDate: Date;
  milestones: RemediationMilestone[];
  dependencies: string[];
  criticalPath: string[];
}

export interface RemediationMilestone {
  id: string;
  name: string;
  description: string;
  date: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  deliverables: string[];
  criteria: string[];
}

export interface RemediationTracking {
  enabled: boolean;
  metrics: string[];
  reporting: string;
  dashboard: string;
  notifications: NotificationConfig[];
  escalation: EscalationPolicy;
}

export interface EscalationPolicy {
  enabled: boolean;
  levels: EscalationLevel[];
  triggers: EscalationTrigger[];
  notifications: NotificationConfig[];
}

export interface EscalationLevel {
  level: number;
  name: string;
  description: string;
  recipients: string[];
  timeframe: number;
  actions: string[];
}

export interface EscalationTrigger {
  type: 'time' | 'status' | 'metric' | 'event';
  condition: string;
  threshold: any;
  enabled: boolean;
}

export interface ComplianceReporting {
  enabled: boolean;
  reports: ComplianceReport[];
  schedule: ReportingSchedule;
  distribution: ReportDistribution;
  retention: ReportRetention;
}

export interface ComplianceReport {
  id: string;
  name: string;
  description: string;
  type: 'dashboard' | 'summary' | 'detailed' | 'exception' | 'trend';
  template: string;
  data: string[];
  filters: string[];
  format: 'html' | 'pdf' | 'csv' | 'json' | 'excel';
  frequency: 'real_time' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
}

export interface ReportingSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  time: string;
  day: number;
  timezone: string;
  enabled: boolean;
}

export interface ReportDistribution {
  channels: 'email' | 'ftp' | 'sftp' | 'api' | 'dashboard';
  recipients: string[];
  security: boolean;
  encryption: boolean;
  authentication: boolean;
}

export interface ReportRetention {
  period: number;
  location: string;
  archival: boolean;
  compression: boolean;
  encryption: boolean;
}

export interface CubeMetadata {
  version: string;
  createdBy: string;
  createdAt: Date;
  lastModifiedBy: string;
  lastModifiedAt: Date;
  documentation: string;
  tags: string[];
  categories: string[];
  owner: string;
  steward: string;
  usage: CubeUsage;
  lineage: CubeLineage;
  quality: CubeQuality;
}

export interface CubeUsage {
  queries: number;
  users: number;
  reports: number;
  dashboards: number;
  lastUsed: Date;
  peakUsage: number;
  avgResponseTime: number;
}

export interface CubeLineage {
  sources: string[];
  dependencies: string[];
  impacts: string[];
  transformations: string[];
  lastUpdated: Date;
}

export interface CubeQuality {
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
  validity: number;
  uniqueness: number;
  issues: QualityIssue[];
  score: number;
}

export interface Hierarchy {
  id: string;
  name: string;
  description: string;
  dimension: string;
  levels: HierarchyLevel[];
  type: 'balanced' | 'unbalanced' | 'ragged' | 'network';
  defaultMember: string;
  allMember: string;
  aggregation: HierarchyAggregation;
  navigation: HierarchyNavigation;
  security: HierarchySecurity;
  tenantId: string;
}

export interface HierarchyLevel {
  id: string;
  name: string;
  description: string;
  column: string;
  keyColumn: string;
  nameColumn: string;
  parentColumn: string;
  orderColumn: string;
  nullProcessing: 'error' | 'ignore' | 'preserve';
  hideMemberIf: 'never' | 'onlyChildWithNoName' | 'onlyChildWithParentName' | 'noName' | 'parentName';
  members: HierarchyMember[];
}

export interface HierarchyMember {
  id: string;
  name: string;
  key: string;
  parent: string;
  children: string[];
  level: number;
  type: 'regular' | 'all' | 'measure' | 'calculated' | 'unknown';
  formula: string;
  format: string;
  visible: boolean;
  properties: MemberProperty[];
}

export interface MemberProperty {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  value: any;
  caption: string;
  description: string;
  inherited: boolean;
}

export interface HierarchyAggregation {
  type: 'sum' | 'count' | 'min' | 'max' | 'avg' | 'none';
  ignoreUnrelatedDimensions: boolean;
  aggregateFunction: string;
  rollupType: 'full' | 'partial' | 'none';
}

export interface HierarchyNavigation {
  drillDownAction: 'expand' | 'replace' | 'new_query';
  drillUpAction: 'collapse' | 'replace' | 'new_query';
  crossDrill: boolean;
  showEmptyMembers: boolean;
  showCalculatedMembers: boolean;
  memberOrdering: 'key' | 'name' | 'break_hierarchy' | 'preserve_hierarchy';
}

export interface HierarchySecurity {
  enabled: boolean;
  defaultAccess: 'allow' | 'deny';
  memberSecurity: MemberSecurity[];
  levelSecurity: LevelSecurity[];
  dimensionSecurity: DimensionSecurity[];
}

export interface MemberSecurity {
  member: string;
  access: 'allow' | 'deny' | 'none';
  users: string[];
  roles: string[];
  conditions: string[];
}

export interface LevelSecurity {
  level: string;
  access: 'allow' | 'deny' | 'none';
  users: string[];
  roles: string[];
  conditions: string[];
}

export interface DimensionSecurity {
  dimension: string;
  access: 'allow' | 'deny' | 'none';
  users: string[];
  roles: string[];
  conditions: string[];
}

export interface Partition {
  id: string;
  name: string;
  description: string;
  type: 'fact' | 'dimension' | 'aggregate';
  table: string;
  slice: PartitionSlice;
  storage: PartitionStorage;
  processing: PartitionProcessing;
  aggregation: PartitionAggregation;
  metadata: PartitionMetadata;
}

export interface PartitionSlice {
  dimensions: SliceDimension[];
  measures: SliceMeasure[];
  filters: SliceFilter[];
  timeRange: TimeRange;
}

export interface SliceDimension {
  dimension: string;
  level: string;
  members: string[];
  hierarchy: string;
  includeChildren: boolean;
  excludeEmpty: boolean;
}

export interface SliceMeasure {
  measure: string;
  aggregation: string;
  filter: string;
  format: string;
  visibility: boolean;
}

export interface SliceFilter {
  dimension: string;
  operator: 'equals' | 'not_equals' | 'in' | 'not_in' | 'range' | 'like' | 'not_like';
  values: any[];
  caseSensitive: boolean;
}

export interface TimeRange {
  start: Date;
  end: Date;
  granularity: 'year' | 'quarter' | 'month' | 'week' | 'day' | 'hour' | 'minute';
  timezone: string;
}

export interface PartitionStorage {
  location: string;
  format: 'relational' | 'multidimensional' | 'hybrid';
  compression: boolean;
  encryption: boolean;
  indexing: boolean;
  size: number;
  rowCount: number;
}

export interface PartitionProcessing {
  mode: 'immediate' | 'lazy' | 'scheduled';
  priority: 'low' | 'normal' | 'high' | 'critical';
  parallelism: number;
  memory: number;
  timeout: number;
  dependencies: string[];
}

export interface PartitionAggregation {
  enabled: boolean;
  type: 'sum' | 'count' | 'min' | 'max' | 'avg' | 'custom';
  levels: AggregationLevel[];
  materialization: AggregationMaterialization;
  usage: AggregationUsage;
}

export interface AggregationLevel {
  dimensions: string[];
  measures: string[];
  granularity: string;
  size: number;
  buildTime: number;
  hitRate: number;
}

export interface AggregationMaterialization {
  enabled: boolean;
  strategy: 'eager' | 'lazy' | 'smart';
  threshold: number;
  storage: string;
  compression: boolean;
  indexing: boolean;
}

export interface AggregationUsage {
  queries: number;
  hits: number;
  misses: number;
  hitRate: number;
  avgResponseTime: number;
  lastUsed: Date;
}

export interface PartitionMetadata {
  createdBy: string;
  createdAt: Date;
  lastModifiedBy: string;
  lastModifiedAt: Date;
  lastProcessed: Date;
  status: 'active' | 'inactive' | 'processing' | 'error';
  errorMessage: string;
  version: string;
  checksum: string;
}

export interface Aggregation {
  id: string;
  name: string;
  description: string;
  type: 'sum' | 'count' | 'avg' | 'min' | 'max' | 'distinct_count' | 'calculated';
  dimensions: string[];
  measures: string[];
  filters: string[];
  groupBy: string[];
  having: string[];
  orderBy: string[];
  limit: number;
  materialized: boolean;
  partitioned: boolean;
  indexed: boolean;
  performance: AggregationPerformance;
  usage: AggregationUsage;
  metadata: AggregationMetadata;
}

export interface AggregationPerformance {
  buildTime: number;
  queryTime: number;
  memoryUsage: number;
  diskUsage: number;
  cpuUsage: number;
  speedup: number;
  optimization: OptimizationSuggestion[];
}

export interface AggregationMetadata {
  createdBy: string;
  createdAt: Date;
  lastModifiedBy: string;
  lastModifiedAt: Date;
  lastBuilt: Date;
  lastUsed: Date;
  status: 'active' | 'inactive' | 'building' | 'error';
  errorMessage: string;
  version: string;
  dependencies: string[];
  impacts: string[];
}

export interface Index {
  id: string;
  name: string;
  description: string;
  type: 'btree' | 'hash' | 'bitmap' | 'spatial' | 'text' | 'composite';
  table: string;
  columns: IndexColumn[];
  unique: boolean;
  clustered: boolean;
  partial: boolean;
  condition: string;
  fillfactor: number;
  statistics: IndexStatistics;
  usage: IndexUsage;
  maintenance: IndexMaintenance;
  metadata: IndexMetadata;
}

export interface IndexColumn {
  name: string;
  order: 'asc' | 'desc';
  nulls: 'first' | 'last';
  length: number;
  collation: string;
}

export interface IndexMetadata {
  createdBy: string;
  createdAt: Date;
  lastModifiedBy: string;
  lastModifiedAt: Date;
  lastRebuilt: Date;
  lastAnalyzed: Date;
  status: 'active' | 'inactive' | 'building' | 'error';
  errorMessage: string;
  version: string;
  tablespace: string;
}

export interface WarehouseMetadata {
  version: string;
  createdBy: string;
  createdAt: Date;
  lastModifiedBy: string;
  lastModifiedAt: Date;
  documentation: string;
  tags: string[];
  categories: string[];
  owner: string;
  steward: string;
  businessGlossary: BusinessGlossary;
  governance: DataGovernance;
  cataloging: DataCataloging;
}

export interface BusinessGlossary {
  enabled: boolean;
  terms: GlossaryTerm[];
  categories: GlossaryCategory[];
  relationships: GlossaryRelationship[];
  approvals: GlossaryApproval[];
}

export interface GlossaryTerm {
  id: string;
  name: string;
  definition: string;
  description: string;
  synonyms: string[];
  acronyms: string[];
  category: string;
  steward: string;
  owner: string;
  status: 'draft' | 'approved' | 'published' | 'deprecated';
  createdAt: Date;
  lastModifiedAt: Date;
  version: string;
  tags: string[];
  relatedTerms: string[];
  assets: string[];
}

export interface GlossaryCategory {
  id: string;
  name: string;
  description: string;
  parent: string;
  children: string[];
  terms: string[];
  steward: string;
  owner: string;
  hierarchy: string;
}

export interface GlossaryRelationship {
  id: string;
  type: 'synonym' | 'antonym' | 'related' | 'parent' | 'child' | 'broader' | 'narrower';
  sourceType: 'term' | 'category' | 'asset';
  source: string;
  targetType: 'term' | 'category' | 'asset';
  target: string;
  description: string;
  createdBy: string;
  createdAt: Date;
}

export interface GlossaryApproval {
  id: string;
  term: string;
  type: 'create' | 'update' | 'delete' | 'publish' | 'deprecate';
  requestedBy: string;
  requestedAt: Date;
  approvers: string[];
  approvedBy: string;
  approvedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  comments: string;
  changes: any;
}

export interface DataGovernance {
  enabled: boolean;
  framework: string;
  policies: GovernancePolicy[];
  roles: GovernanceRole[];
  processes: GovernanceProcess[];
  controls: GovernanceControl[];
  metrics: GovernanceMetric[];
  reporting: GovernanceReporting;
}

export interface GovernancePolicy {
  id: string;
  name: string;
  description: string;
  type: 'data_quality' | 'data_security' | 'data_privacy' | 'data_retention' | 'data_access';
  scope: 'global' | 'domain' | 'dataset' | 'table' | 'column';
  rules: PolicyRule[];
  enforcement: PolicyEnforcement;
  exceptions: PolicyException[];
  compliance: PolicyCompliance;
  metadata: PolicyMetadata;
}

export interface PolicyEnforcement {
  enabled: boolean;
  mode: 'advisory' | 'blocking' | 'auditing';
  automated: boolean;
  triggers: EnforcementTrigger[];
  actions: EnforcementAction[];
  notifications: NotificationConfig[];
}

export interface EnforcementTrigger {
  event: 'data_access' | 'data_change' | 'schema_change' | 'policy_violation' | 'schedule';
  condition: string;
  enabled: boolean;
  priority: number;
}

export interface EnforcementAction {
  type: 'block' | 'alert' | 'log' | 'remediate' | 'escalate';
  parameters: any;
  enabled: boolean;
  priority: number;
}

export interface PolicyException {
  id: string;
  policy: string;
  requestedBy: string;
  requestedAt: Date;
  approvedBy: string;
  approvedAt: Date;
  reason: string;
  duration: number;
  conditions: string[];
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  usage: ExceptionUsage;
}

export interface ExceptionUsage {
  uses: number;
  lastUsed: Date;
  violations: number;
  monitoring: boolean;
  alerts: string[];
}

export interface PolicyCompliance {
  status: 'compliant' | 'non_compliant' | 'partially_compliant' | 'unknown';
  score: number;
  violations: PolicyViolation[];
  remediation: PolicyRemediation[];
  lastAssessed: Date;
  nextAssessment: Date;
}

export interface PolicyViolation {
  id: string;
  policy: string;
  rule: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: string;
  evidence: string[];
  detectedAt: Date;
  resolvedAt: Date;
  status: 'open' | 'acknowledged' | 'resolved' | 'false_positive';
  assignedTo: string;
  remediation: string[];
}

export interface PolicyRemediation {
  id: string;
  violation: string;
  type: 'immediate' | 'planned' | 'accepted_risk';
  description: string;
  actions: string[];
  owner: string;
  dueDate: Date;
  status: 'planned' | 'in_progress' | 'completed' | 'blocked';
  cost: number;
  effort: number;
  priority: number;
}

export interface PolicyMetadata {
  createdBy: string;
  createdAt: Date;
  lastModifiedBy: string;
  lastModifiedAt: Date;
  version: string;
  status: 'draft' | 'review' | 'approved' | 'published' | 'deprecated';
  approval: PolicyApproval;
  documentation: string;
  tags: string[];
  categories: string[];
}

export interface PolicyApproval {
  required: boolean;
  approvers: string[];
  approvedBy: string;
  approvedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  comments: string;
  expiration: Date;
}

export interface GovernanceRole {
  id: string;
  name: string;
  description: string;
  type: 'data_owner' | 'data_steward' | 'data_custodian' | 'data_user' | 'data_analyst';
  responsibilities: string[];
  permissions: string[];
  users: string[];
  groups: string[];
  delegation: RoleDelegation;
  hierarchy: string;
  metadata: RoleMetadata;
}

export interface RoleDelegation {
  enabled: boolean;
  delegateFrom: string;
  delegateTo: string;
  duration: number;
  scope: string[];
  conditions: string[];
  approval: boolean;
  notifications: NotificationConfig[];
}

export interface RoleMetadata {
  createdBy: string;
  createdAt: Date;
  lastModifiedBy: string;
  lastModifiedAt: Date;
  version: string;
  status: 'active' | 'inactive' | 'deprecated';
  approval: string;
  documentation: string;
  tags: string[];
}

export interface GovernanceProcess {
  id: string;
  name: string;
  description: string;
  type: 'data_request' | 'data_classification' | 'data_lifecycle' | 'incident_response' | 'change_management';
  steps: ProcessStep[];
  approvals: ProcessApproval[];
  automation: ProcessAutomation;
  monitoring: ProcessMonitoring;
  metadata: ProcessMetadata;
}

export interface ProcessStep {
  id: string;
  name: string;
  description: string;
  type: 'manual' | 'automated' | 'approval' | 'notification' | 'validation';
  order: number;
  required: boolean;
  owner: string;
  duration: number;
  conditions: string[];
  inputs: ProcessInput[];
  outputs: ProcessOutput[];
  automation: StepAutomation;
}

export interface ProcessInput {
  name: string;
  type: 'text' | 'number' | 'date' | 'file' | 'selection' | 'boolean';
  required: boolean;
  validation: string;
  options: string[];
  default: any;
}

export interface ProcessOutput {
  name: string;
  type: 'text' | 'number' | 'date' | 'file' | 'status' | 'decision';
  description: string;
  format: string;
  destination: string;
}

export interface StepAutomation {
  enabled: boolean;
  type: 'script' | 'workflow' | 'api' | 'rule_engine';
  configuration: any;
  triggers: AutomationTrigger[];
  conditions: AutomationCondition[];
  actions: AutomationAction[];
}

export interface AutomationTrigger {
  event: string;
  condition: string;
  enabled: boolean;
  priority: number;
}

export interface AutomationCondition {
  type: 'data' | 'time' | 'user' | 'system' | 'external';
  condition: string;
  value: any;
  operator: string;
}

export interface AutomationAction {
  type: 'approve' | 'reject' | 'notify' | 'escalate' | 'update' | 'create' | 'delete';
  parameters: any;
  enabled: boolean;
  priority: number;
}

export interface ProcessApproval {
  id: string;
  step: string;
  type: 'single' | 'multiple' | 'consensus' | 'majority' | 'quorum';
  approvers: string[];
  required: number;
  timeout: number;
  escalation: ApprovalEscalation;
  delegation: ApprovalDelegation;
  notifications: NotificationConfig[];
}

export interface ApprovalEscalation {
  enabled: boolean;
  levels: EscalationLevel[];
  timeout: number;
  conditions: string[];
  actions: EscalationAction[];
}

export interface EscalationAction {
  type: 'notify' | 'reassign' | 'auto_approve' | 'auto_reject' | 'escalate';
  parameters: any;
  enabled: boolean;
  priority: number;
}

export interface ApprovalDelegation {
  enabled: boolean;
  delegateFrom: string;
  delegateTo: string;
  duration: number;
  conditions: string[];
  approval: boolean;
  notifications: NotificationConfig[];
}

export interface ProcessAutomation {
  enabled: boolean;
  level: 'none' | 'partial' | 'full';
  triggers: AutomationTrigger[];
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  monitoring: AutomationMonitoring;
  exceptions: AutomationException[];
}

export interface AutomationMonitoring {
  enabled: boolean;
  metrics: string[];
  thresholds: any;
  alerts: string[];
  dashboard: string;
  reporting: string;
}

export interface AutomationException {
  id: string;
  type: 'error' | 'timeout' | 'condition' | 'manual_override';
  description: string;
  handling: 'stop' | 'continue' | 'retry' | 'escalate' | 'fallback';
  notifications: NotificationConfig[];
  logging: boolean;
}

export interface ProcessMonitoring {
  enabled: boolean;
  metrics: ProcessMetrics;
  alerts: ProcessAlert[];
  dashboard: string;
  reporting: ProcessReporting;
}

export interface ProcessMetrics {
  instances: number;
  completed: number;
  failed: number;
  pending: number;
  avgDuration: number;
  maxDuration: number;
  minDuration: number;
  throughput: number;
  errorRate: number;
  satisfaction: number;
}

export interface ProcessAlert {
  id: string;
  name: string;
  condition: string;
  threshold: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
  enabled: boolean;
  frequency: number;
}

export interface ProcessReporting {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  template: string;
  metrics: string[];
  format: 'html' | 'pdf' | 'csv' | 'json';
  distribution: string[];
}

export interface ProcessMetadata {
  createdBy: string;
  createdAt: Date;
  lastModifiedBy: string;
  lastModifiedAt: Date;
  version: string;
  status: 'draft' | 'review' | 'approved' | 'published' | 'deprecated';
  approval: string;
  documentation: string;
  tags: string[];
  categories: string[];
  owner: string;
  steward: string;
}

export interface GovernanceControl {
  id: string;
  name: string;
  description: string;
  type: 'preventive' | 'detective' | 'corrective' | 'directive';
  category: 'access' | 'quality' | 'security' | 'privacy' | 'compliance' | 'operational';
  implementation: 'manual' | 'automated' | 'hybrid';
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  owner: string;
  steward: string;
  testing: ControlTesting;
  effectiveness: ControlEffectiveness;
  monitoring: ControlMonitoring;
  remediation: ControlRemediation;
  metadata: ControlMetadata;
}

export interface ControlRemediation {
  enabled: boolean;
  automatic: boolean;
  actions: RemediationAction[];
  escalation: RemediationEscalation;
  notifications: NotificationConfig[];
  tracking: RemediationTracking;
}

export interface RemediationEscalation {
  enabled: boolean;
  levels: EscalationLevel[];
  conditions: string[];
  actions: EscalationAction[];
  notifications: NotificationConfig[];
}

export interface ControlMetadata {
  createdBy: string;
  createdAt: Date;
  lastModifiedBy: string;
  lastModifiedAt: Date;
  version: string;
  status: 'active' | 'inactive' | 'deprecated';
  approval: string;
  documentation: string;
  tags: string[];
  categories: string[];
  regulations: string[];
  frameworks: string[];
}

export interface GovernanceMetric {
  id: string;
  name: string;
  description: string;
  type: 'availability' | 'quality' | 'security' | 'compliance' | 'performance' | 'usage';
  category: 'leading' | 'lagging' | 'predictive';
  calculation: MetricCalculation;
  targets: MetricTarget[];
  thresholds: MetricThreshold[];
  monitoring: MetricMonitoring;
  reporting: MetricReporting;
  metadata: MetricMetadata;
}

export interface MetricCalculation {
  formula: string;
  inputs: MetricInput[];
  aggregation: string;
  frequency: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  window: number;
  filters: string[];
}

export interface MetricInput {
  name: string;
  source: string;
  type: 'dimension' | 'measure' | 'attribute' | 'calculation';
  transformation: string;
  validation: string;
}

export interface MetricTarget {
  name: string;
  value: number;
  unit: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  tolerance: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface MetricThreshold {
  name: string;
  value: number;
  operator: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
  severity: 'low' | 'medium' | 'high' | 'critical';
  action: 'alert' | 'escalate' | 'remediate' | 'block';
}

export interface MetricMonitoring {
  enabled: boolean;
  frequency: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  alerts: MetricAlert[];
  dashboard: string;
  automation: MetricAutomation;
}

export interface MetricAlert {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
  enabled: boolean;
  frequency: number;
  suppression: AlertSuppression;
}

export interface AlertSuppression {
  enabled: boolean;
  duration: number;
  conditions: string[];
  escalation: boolean;
}

export interface MetricAutomation {
  enabled: boolean;
  triggers: AutomationTrigger[];
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  monitoring: AutomationMonitoring;
}

export interface MetricReporting {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  recipients: string[];
  template: string;
  format: 'html' | 'pdf' | 'csv' | 'json';
  distribution: string[];
  retention: number;
}

export interface MetricMetadata {
  createdBy: string;
  createdAt: Date;
  lastModifiedBy: string;
  lastModifiedAt: Date;
  version: string;
  status: 'active' | 'inactive' | 'deprecated';
  approval: string;
  documentation: string;
  tags: string[];
  categories: string[];
  owner: string;
  steward: string;
  businessValue: string;
  technicalSpecs: string;
}

export interface GovernanceReporting {
  enabled: boolean;
  reports: GovernanceReport[];
  dashboards: GovernanceDashboard[];
  schedule: ReportingSchedule;
  distribution: ReportDistribution;
  retention: ReportRetention;
}

export interface GovernanceReport {
  id: string;
  name: string;
  description: string;
  type: 'compliance' | 'quality' | 'usage' | 'performance' | 'security' | 'privacy';
  template: string;
  data: string[];
  filters: string[];
  format: 'html' | 'pdf' | 'csv' | 'json' | 'excel';
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  automation: ReportAutomation;
}

export interface ReportAutomation {
  enabled: boolean;
  triggers: AutomationTrigger[];
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  notifications: NotificationConfig[];
}

export interface GovernanceDashboard {
  id: string;
  name: string;
  description: string;
  type: 'executive' | 'operational' | 'tactical' | 'analytical';
  widgets: DashboardWidget[];
  layout: DashboardLayout;
  filters: DashboardFilter[];
  security: DashboardSecurity;
  sharing: DashboardSharing;
}

export interface DashboardWidget {
  id: string;
  name: string;
  type: 'chart' | 'table' | 'kpi' | 'gauge' | 'text' | 'image';
  data: string;
  configuration: any;
  position: WidgetPosition;
  interactions: WidgetInteraction[];
  security: WidgetSecurity;
}

export interface WidgetPosition {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export interface WidgetInteraction {
  type: 'click' | 'hover' | 'select' | 'filter' | 'drill';
  action: 'navigate' | 'filter' | 'highlight' | 'tooltip' | 'modal';
  target: string;
  parameters: any;
}

export interface WidgetSecurity {
  enabled: boolean;
  users: string[];
  roles: string[];
  permissions: string[];
  conditions: string[];
}

export interface DashboardLayout {
  type: 'grid' | 'flow' | 'tabs' | 'accordion';
  columns: number;
  rows: number;
  gap: number;
  responsive: boolean;
  breakpoints: ResponsiveBreakpoint[];
}

export interface DashboardFilter {
  id: string;
  name: string;
  type: 'dropdown' | 'multi_select' | 'date_range' | 'text' | 'number' | 'boolean';
  data: string;
  options: FilterOption[];
  defaultValue: any;
  required: boolean;
  cascading: boolean;
  global: boolean;
}

export interface FilterOption {
  value: any;
  label: string;
  group: string;
  disabled: boolean;
  hidden: boolean;
}

export interface DashboardSecurity {
  enabled: boolean;
  users: string[];
  roles: string[];
  permissions: string[];
  conditions: string[];
  rowLevel: boolean;
  columnLevel: boolean;
}

export interface DashboardSharing {
  enabled: boolean;
  public: boolean;
  users: string[];
  roles: string[];
  permissions: string[];
  embedding: EmbeddingConfig;
  export: ExportConfig;
}

export interface EmbeddingConfig {
  enabled: boolean;
  domains: string[];
  authentication: boolean;
  parameters: any;
  customization: EmbeddingCustomization;
}

export interface EmbeddingCustomization {
  theme: string;
  colors: string[];
  fonts: string[];
  logo: string;
  branding: boolean;
  toolbar: boolean;
  filters: boolean;
}

export interface ExportConfig {
  enabled: boolean;
  formats: string[];
  schedule: ExportSchedule;
  delivery: ExportDelivery;
  security: ExportSecurity;
}

export interface ExportSchedule {
  frequency: 'manual' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  time: string;
  day: number;
  enabled: boolean;
}

export interface ExportDelivery {
  method: 'download' | 'email' | 'ftp' | 'sftp' | 'cloud';
  recipients: string[];
  location: string;
  credentials: any;
  encryption: boolean;
}

export interface ExportSecurity {
  enabled: boolean;
  watermark: boolean;
  password: boolean;
  expiration: number;
  access_log: boolean;
  audit: boolean;
}

export interface DataCataloging {
  enabled: boolean;
  catalog: DataCatalog;
  discovery: DataDiscovery;
  classification: DataClassification;
  tagging: DataTagging;
  search: DataSearch;
  lineage: DataLineageTracking;
}

export interface DataCatalog {
  id: string;
  name: string;
  description: string;
  version: string;
  assets: CatalogAsset[];
  collections: CatalogCollection[];
  relationships: CatalogRelationship[];
  metadata: CatalogMetadata;
}

export interface CatalogAsset {
  id: string;
  name: string;
  type: 'table' | 'view' | 'column' | 'schema' | 'database' | 'report' | 'dashboard' | 'model';
  description: string;
  owner: string;
  steward: string;
  tags: string[];
  categories: string[];
  classification: string;
  sensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  quality: AssetQuality;
  usage: AssetUsage;
  lineage: AssetLineage;
  metadata: AssetMetadata;
}

export interface AssetQuality {
  score: number;
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
  validity: number;
  uniqueness: number;
  issues: QualityIssue[];
  lastAssessed: Date;
}

export interface AssetUsage {
  queries: number;
  users: number;
  reports: number;
  dashboards: number;
  lastUsed: Date;
  frequency: number;
  popularity: number;
  trends: UsageTrend[];
}

export interface UsageTrend {
  date: Date;
  metric: string;
  value: number;
  change: number;
  percentage: number;
}

export interface AssetLineage {
  upstream: AssetDependency[];
  downstream: AssetDependency[];
  transformations: AssetTransformation[];
  impact: AssetImpact[];
  lastUpdated: Date;
}

export interface AssetDependency {
  asset: string;
  type: 'direct' | 'indirect' | 'conditional';
  relationship: 'source' | 'target' | 'reference' | 'lookup';
  strength: number;
  confidence: number;
}

export interface AssetTransformation {
  id: string;
  name: string;
  type: 'extract' | 'transform' | 'load' | 'aggregate' | 'join' | 'filter';
  description: string;
  source: string;
  target: string;
  logic: string;
  parameters: any;
  performance: TransformationPerformance;
}

export interface AssetImpact {
  asset: string;
  type: 'breaking' | 'non_breaking' | 'enhancement' | 'deprecation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  mitigation: string;
  notification: boolean;
}

export interface AssetMetadata {
  created_by: string;
  created_at: Date;
  last_modified_by: string;
  last_modified_at: Date;
  version: string;
  status: 'active' | 'inactive' | 'deprecated' | 'draft';
  approval: string;
  documentation: string;
  business_context: string;
  technical_specs: string;
  access_patterns: string[];
  performance_characteristics: string[];
  security_requirements: string[];
  compliance_requirements: string[];
}

export interface CatalogCollection {
  id: string;
  name: string;
  description: string;
  type: 'domain' | 'subject_area' | 'project' | 'application' | 'custom';
  assets: string[];
  subcollections: string[];
  parent: string;
  owner: string;
  steward: string;
  tags: string[];
  metadata: CollectionMetadata;
}

export interface CollectionMetadata {
  created_by: string;
  created_at: Date;
  last_modified_by: string;
  last_modified_at: Date;
  version: string;
  status: 'active' | 'inactive' | 'deprecated';
  approval: string;
  documentation: string;
  business_value: string;
  technical_architecture: string;
}

export interface CatalogRelationship {
  id: string;
  type: 'hierarchical' | 'associative' | 'dependency' | 'similarity' | 'custom';
  source_type: 'asset' | 'collection' | 'term' | 'category';
  source: string;
  target_type: 'asset' | 'collection' | 'term' | 'category';
  target: string;
  strength: number;
  confidence: number;
  description: string;
  metadata: RelationshipMetadata;
}

export interface RelationshipMetadata {
  created_by: string;
  created_at: Date;
  last_modified_by: string;
  last_modified_at: Date;
  version: string;
  status: 'active' | 'inactive' | 'deprecated';
  approval: string;
  documentation: string;
  business_context: string;
  technical_details: string;
}

export interface CatalogMetadata {
  created_by: string;
  created_at: Date;
  last_modified_by: string;
  last_modified_at: Date;
  version: string;
  status: 'active' | 'inactive' | 'deprecated';
  approval: string;
  documentation: string;
  coverage: CatalogCoverage;
  quality: CatalogQuality;
  usage: CatalogUsage;
}

export interface CatalogCoverage {
  total_assets: number;
  cataloged_assets: number;
  coverage_percentage: number;
  missing_assets: string[];
  orphaned_assets: string[];
  last_scan: Date;
}

export interface CatalogQuality {
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
  issues: QualityIssue[];
  score: number;
  last_assessed: Date;
}

export interface CatalogUsage {
  searches: number;
  users: number;
  sessions: number;
  popular_assets: string[];
  popular_searches: string[];
  last_activity: Date;
}

export interface DataDiscovery {
  enabled: boolean;
  automatic: boolean;
  scope: DiscoveryScope;
  rules: DiscoveryRule[];
  schedule: DiscoverySchedule;
  profiling: DataProfiling;
  sampling: DataSampling;
  monitoring: DiscoveryMonitoring;
}

export interface DiscoveryScope {
  databases: string[];
  schemas: string[];
  tables: string[];
  file_systems: string[];
  cloud_storage: string[];
  apis: string[];
  streams: string[];
  exclusions: string[];
}

export interface DiscoveryRule {
  id: string;
  name: string;
  description: string;
  type: 'pattern' | 'keyword' | 'regex' | 'ml' | 'custom';
  pattern: string;
  keywords: string[];
  regex: string;
  model: string;
  function: string;
  confidence: number;
  priority: number;
  enabled: boolean;
  tags: string[];
  classification: string;
  sensitivity: string;
}

export interface DiscoverySchedule {
  frequency: 'continuous' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  time: string;
  day: number;
  enabled: boolean;
  incremental: boolean;
  parallel: boolean;
  timeout: number;
}

export interface DataProfiling {
  enabled: boolean;
  depth: 'basic' | 'standard' | 'comprehensive';
  statistics: ProfilingStatistics;
  patterns: PatternAnalysis;
  relationships: RelationshipAnalysis;
  quality: QualityAnalysis;
  performance: ProfilingPerformance;
}

export interface ProfilingStatistics {
  enabled: boolean;
  row_count: boolean;
  null_count: boolean;
  unique_count: boolean;
  min_max: boolean;
  mean_median: boolean;
  std_dev: boolean;
  percentiles: boolean;
  histogram: boolean;
  cardinality: boolean;
}

export interface PatternAnalysis {
  enabled: boolean;
  format_detection: boolean;
  regex_patterns: boolean;
  data_types: boolean;
  encoding: boolean;
  language: boolean;
  sentiment: boolean;
  keywords: boolean;
}

export interface RelationshipAnalysis {
  enabled: boolean;
  primary_keys: boolean;
  foreign_keys: boolean;
  unique_constraints: boolean;
  referential_integrity: boolean;
  functional_dependencies: boolean;
  inclusion_dependencies: boolean;
  similarity: boolean;
}

export interface QualityAnalysis {
  enabled: boolean;
  completeness: boolean;
  accuracy: boolean;
  consistency: boolean;
  validity: boolean;
  uniqueness: boolean;
  timeliness: boolean;
  anomalies: boolean;
  outliers: boolean;
}

export interface ProfilingPerformance {
  execution_time: number;
  memory_usage: number;
  cpu_usage: number;
  io_operations: number;
  network_usage: number;
  parallelism: number;
  optimization: string[];
}

export interface DataSampling {
  enabled: boolean;
  method: 'random' | 'systematic' | 'stratified' | 'cluster' | 'convenience';
  size: number;
  percentage: number;
  seed: number;
  stratification: SamplingStratification;
  replacement: boolean;
  weighting: SamplingWeighting;
}

export interface SamplingStratification {
  enabled: boolean;
  columns: string[];
  proportional: boolean;
  minimum_size: number;
  maximum_size: number;
}

export interface SamplingWeighting {
  enabled: boolean;
  column: string;
  method: 'frequency' | 'inverse_frequency' | 'custom';
  weights: Record<string, number>;
}

export interface DiscoveryMonitoring {
  enabled: boolean;
  metrics: DiscoveryMetrics;
  alerts: DiscoveryAlert[];
  reporting: DiscoveryReporting;
  dashboard: string;
}

export interface DiscoveryMetrics {
  assets_discovered: number;
  assets_profiled: number;
  errors: number;
  warnings: number;
  execution_time: number;
  throughput: number;
  coverage: number;
  quality_score: number;
}

export interface DiscoveryAlert {
  id: string;
  name: string;
  condition: string;
  threshold: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
  enabled: boolean;
  frequency: number;
}

export interface DiscoveryReporting {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  template: string;
  format: 'html' | 'pdf' | 'csv' | 'json';
  content: string[];
}

export interface DataClassification {
  enabled: boolean;
  automatic: boolean;
  levels: ClassificationLevel[];
  categories: ClassificationCategory[];
  rules: ClassificationRule[];
  models: ClassificationModel[];
  validation: ClassificationValidation;
  monitoring: ClassificationMonitoring;
}

export interface ClassificationLevel {
  id: string;
  name: string;
  description: string;
  order: number;
  color: string;
  icon: string;
  policies: string[];
  controls: string[];
  retention: number;
  access: string[];
}

export interface ClassificationCategory {
  id: string;
  name: string;
  description: string;
  parent: string;
  children: string[];
  level: string;
  rules: string[];
  models: string[];
  examples: string[];
  patterns: string[];
}

export interface ClassificationRule {
  id: string;
  name: string;
  description: string;
  type: 'pattern' | 'keyword' | 'regex' | 'ml' | 'custom';
  category: string;
  level: string;
  pattern: string;
  keywords: string[];
  regex: string;
  model: string;
  function: string;
  confidence: number;
  priority: number;
  enabled: boolean;
  conditions: RuleCondition[];
  actions: RuleAction[];
}

export interface RuleCondition {
  type: 'column_name' | 'data_type' | 'data_pattern' | 'table_name' | 'schema_name' | 'custom';
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'matches' | 'not_matches';
  value: string;
  case_sensitive: boolean;
  enabled: boolean;
}

export interface RuleAction {
  type: 'classify' | 'tag' | 'mask' | 'encrypt' | 'alert' | 'log' | 'custom';
  parameters: any;
  enabled: boolean;
  priority: number;
}

export interface ClassificationModel {
  id: string;
  name: string;
  description: string;
  type: 'supervised' | 'unsupervised' | 'semi_supervised' | 'reinforcement';
  algorithm: 'naive_bayes' | 'svm' | 'random_forest' | 'neural_network' | 'deep_learning';
  features: ModelFeature[];
  training: ModelTraining;
  evaluation: ModelEvaluation;
  deployment: ModelDeployment;
  monitoring: ModelMonitoring;
}

export interface ModelFeature {
  name: string;
  type: 'categorical' | 'numerical' | 'text' | 'image' | 'audio' | 'video';
  preprocessing: string[];
  importance: number;
  correlation: number;
  distribution: any;
}

export interface ModelTraining {
  dataset: string;
  split: TrainingSplit;
  parameters: any;
  cross_validation: CrossValidation;
  regularization: Regularization;
  optimization: Optimization;
  early_stopping: EarlyStopping;
  checkpointing: Checkpointing;
}

export interface TrainingSplit {
  train: number;
  validation: number;
  test: number;
  stratified: boolean;
  random_state: number;
}

export interface CrossValidation {
  enabled: boolean;
  folds: number;
  stratified: boolean;
  shuffle: boolean;
  random_state: number;
}

export interface Regularization {
  enabled: boolean;
  type: 'l1' | 'l2' | 'elastic_net' | 'dropout' | 'batch_norm';
  strength: number;
  parameters: any;
}

export interface Optimization {
  optimizer: 'sgd' | 'adam' | 'rmsprop' | 'adagrad' | 'adadelta';
  learning_rate: number;
  momentum: number;
  weight_decay: number;
  parameters: any;
}

export interface EarlyStopping {
  enabled: boolean;
  metric: string;
  patience: number;
  min_delta: number;
  restore_best_weights: boolean;
}

export interface Checkpointing {
  enabled: boolean;
  frequency: number;
  save_best_only: boolean;
  save_weights_only: boolean;
  monitor: string;
  mode: 'min' | 'max' | 'auto';
}

export interface ModelEvaluation {
  metrics: EvaluationMetric[];
  confusion_matrix: number[][];
  roc_curve: ROCCurve;
  precision_recall: PrecisionRecall;
  feature_importance: FeatureImportance[];
  bias_fairness: BiasFairness;
  interpretability: Interpretability;
}

export interface EvaluationMetric {
  name: string;
  value: number;
  confidence_interval: [number, number];
  threshold: number;
  interpretation: string;
}

export interface ROCCurve {
  fpr: number[];
  tpr: number[];
  thresholds: number[];
  auc: number;
}

export interface PrecisionRecall {
  precision: number[];
  recall: number[];
  thresholds: number[];
  f1_score: number[];
  auc: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  rank: number;
  confidence: number;
  interpretation: string;
}

export interface BiasFairness {
  enabled: boolean;
  protected_attributes: string[];
  metrics: FairnessMetric[];
  mitigation: BiasMitigation;
  monitoring: BiasMonitoring;
}

export interface FairnessMetric {
  name: string;
  value: number;
  threshold: number;
  interpretation: string;
  status: 'pass' | 'fail' | 'warning';
}

export interface BiasMitigation {
  enabled: boolean;
  techniques: string[];
  parameters: any;
  evaluation: string[];
  monitoring: boolean;
}

export interface BiasMonitoring {
  enabled: boolean;
  frequency: 'continuous' | 'batch' | 'periodic';
  metrics: string[];
  thresholds: any;
  alerts: string[];
  remediation: string[];
}

export interface Interpretability {
  enabled: boolean;
  techniques: string[];
  global_explanations: GlobalExplanation[];
  local_explanations: LocalExplanation[];
  visualization: ExplanationVisualization;
  reporting: ExplanationReporting;
}

export interface GlobalExplanation {
  technique: string;
  importance: FeatureImportance[];
  interactions: FeatureInteraction[];
  rules: ExplanationRule[];
  visualization: any;
}

export interface FeatureInteraction {
  features: string[];
  importance: number;
  type: 'positive' | 'negative' | 'neutral';
  confidence: number;
  interpretation: string;
}

export interface ExplanationRule {
  condition: string;
  conclusion: string;
  confidence: number;
  support: number;
  lift: number;
  conviction: number;
}

export interface LocalExplanation {
  instance: string;
  technique: string;
  importance: FeatureImportance[];
  counterfactuals: Counterfactual[];
  anchors: Anchor[];
  visualization: any;
}

export interface Counterfactual {
  feature: string;
  original: any;
  modified: any;
  outcome: string;
  distance: number;
  feasibility: number;
}

export interface Anchor {
  features: string[];
  condition: string;
  precision: number;
  coverage: number;
  confidence: number;
}

export interface ExplanationVisualization {
  enabled: boolean;
  types: string[];
  interactive: boolean;
  customization: any;
  export: string[];
}

export interface ExplanationReporting {
  enabled: boolean;
  audience: string[];
  format: string[];
  frequency: string;
  distribution: string[];
  templates: string[];
}

export interface ModelDeployment {
  enabled: boolean;
  environment: 'development' | 'staging' | 'production';
  infrastructure: DeploymentInfrastructure;
  versioning: ModelVersioning;
  rollback: ModelRollback;
  monitoring: ModelMonitoring;
  scaling: ModelScaling;
  security: ModelSecurity;
}

export interface DeploymentInfrastructure {
  type: 'cloud' | 'on_premise' | 'hybrid' | 'edge';
  provider: string;
  region: string;
  compute: ComputeResources;
  storage: StorageResources;
  networking: NetworkingResources;
  containerization: Containerization;
  orchestration: Orchestration;
}

export interface ComputeResources {
  cpu: number;
  memory: number;
  gpu: number;
  storage: number;
  auto_scaling: boolean;
  spot_instances: boolean;
  reserved_instances: boolean;
}

export interface StorageResources {
  type: 'ssd' | 'hdd' | 'nvme' | 'object' | 'distributed';
  size: number;
  iops: number;
  throughput: number;
  replication: number;
  backup: boolean;
  encryption: boolean;
}

export interface NetworkingResources {
  bandwidth: number;
  latency: number;
  load_balancer: boolean;
  cdn: boolean;
  vpn: boolean;
  firewall: boolean;
  monitoring: boolean;
}

export interface Containerization {
  enabled: boolean;
  runtime: 'docker' | 'containerd' | 'cri-o' | 'podman';
  registry: string;
  image: string;
  tag: string;
  build: ContainerBuild;
  security: ContainerSecurity;
}

export interface ContainerBuild {
  dockerfile: string;
  context: string;
  args: Record<string, string>;
  labels: Record<string, string>;
  multi_stage: boolean;
  optimization: boolean;
}

export interface ContainerSecurity {
  scanning: boolean;
  signing: boolean;
  admission_control: boolean;
  runtime_protection: boolean;
  network_policies: boolean;
  secrets_management: boolean;
}

export interface Orchestration {
  enabled: boolean;
  platform: 'kubernetes' | 'docker_swarm' | 'nomad' | 'ecs' | 'aci';
  namespace: string;
  deployment: OrchestrationDeployment;
  service: OrchestrationService;
  ingress: OrchestrationIngress;
  monitoring: OrchestrationMonitoring;
}

export interface OrchestrationDeployment {
  replicas: number;
  strategy: 'rolling_update' | 'recreate' | 'blue_green' | 'canary';
  max_surge: number;
  max_unavailable: number;
  progress_deadline: number;
  revision_history_limit: number;
}

export interface OrchestrationService {
  type: 'cluster_ip' | 'node_port' | 'load_balancer' | 'external_name';
  port: number;
  target_port: number;
  protocol: 'tcp' | 'udp';
  session_affinity: 'none' | 'client_ip';
  load_balancer_source_ranges: string[];
}

export interface OrchestrationIngress {
  enabled: boolean;
  class: string;
  host: string;
  path: string;
  tls: boolean;
  annotations: Record<string, string>;
  rules: IngressRule[];
}

export interface IngressRule {
  host: string;
  paths: IngressPath[];
}

export interface IngressPath {
  path: string;
  path_type: 'exact' | 'prefix' | 'implementation_specific';
  service: string;
  port: number;
}

export interface OrchestrationMonitoring {
  enabled: boolean;
  metrics: string[];
  logs: string[];
  traces: string[];
  health_checks: HealthCheck[];
  alerting: string[];
}

export interface HealthCheck {
  type: 'http' | 'tcp' | 'exec' | 'grpc';
  path: string;
  port: number;
  command: string[];
  initial_delay: number;
  period: number;
  timeout: number;
  success_threshold: number;
  failure_threshold: number;
}

export interface ModelVersioning {
  enabled: boolean;
  strategy: 'semantic' | 'timestamp' | 'hash' | 'sequential';
  registry: string;
  metadata: VersionMetadata;
  lineage: VersionLineage;
  comparison: VersionComparison;
}

export interface VersionMetadata {
  version: string;
  name: string;
  description: string;
  author: string;
  created_at: Date;
  tags: string[];
  metrics: any;
  artifacts: string[];
  dependencies: string[];
}

export interface VersionLineage {
  parent: string;
  children: string[];
  branch: string;
  commit: string;
  dataset: string;
  experiment: string;
  pipeline: string;
}

export interface VersionComparison {
  baseline: string;
  candidate: string;
  metrics: MetricComparison[];
  performance: PerformanceComparison;
  drift: DriftComparison;
  recommendation: string;
}

export interface MetricComparison {
  metric: string;
  baseline_value: number;
  candidate_value: number;
  change: number;
  percentage_change: number;
  significance: 'significant' | 'not_significant';
  interpretation: string;
}

export interface PerformanceComparison {
  latency: MetricComparison;
  throughput: MetricComparison;
  memory: MetricComparison;
  cpu: MetricComparison;
  accuracy: MetricComparison;
  f1_score: MetricComparison;
}

export interface DriftComparison {
  data_drift: DriftMetric;
  concept_drift: DriftMetric;
  prediction_drift: DriftMetric;
  feature_drift: FeatureDrift[];
  overall_drift: DriftMetric;
}

export interface DriftMetric {
  score: number;
  threshold: number;
  status: 'no_drift' | 'drift_detected' | 'severe_drift';
  confidence: number;
  explanation: string;
}

export interface FeatureDrift {
  feature: string;
  score: number;
  threshold: number;
  status: 'no_drift' | 'drift_detected' | 'severe_drift';
  distribution: any;
  statistics: any;
}

export interface ModelRollback {
  enabled: boolean;
  strategy: 'immediate' | 'gradual' | 'conditional';
  triggers: RollbackTrigger[];
  conditions: RollbackCondition[];
  automation: RollbackAutomation;
  validation: RollbackValidation;
}

export interface RollbackTrigger {
  type: 'performance' | 'accuracy' | 'drift' | 'error_rate' | 'manual';
  condition: string;
  threshold: any;
  enabled: boolean;
  priority: number;
}

export interface RollbackCondition {
  metric: string;
  operator: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
  value: number;
  duration: number;
  enabled: boolean;
}

export interface RollbackAutomation {
  enabled: boolean;
  approval_required: boolean;
  approvers: string[];
  timeout: number;
  notifications: NotificationConfig[];
  validation: boolean;
}

export interface RollbackValidation {
  enabled: boolean;
  tests: ValidationTest[];
  metrics: string[];
  thresholds: any;
  duration: number;
  success_criteria: string;
}

export interface ValidationTest {
  name: string;
  type: 'unit' | 'integration' | 'performance' | 'security' | 'acceptance';
  command: string;
  timeout: number;
  retry: number;
  success_criteria: string;
}

export interface ModelMonitoring {
  enabled: boolean;
  metrics: MonitoringMetric[];
  alerts: MonitoringAlert[];
  dashboards: MonitoringDashboard[];
  logging: MonitoringLogging;
  tracing: MonitoringTracing;
  profiling: MonitoringProfiling;
}

export interface MonitoringMetric {
  name: string;
  type: 'gauge' | 'counter' | 'histogram' | 'summary';
  unit: string;
  description: string;
  labels: string[];
  collection_interval: number;
  retention_period: number;
  aggregation: string[];
}

export interface MonitoringAlert {
  name: string;
  condition: string;
  threshold: any;
  severity: 'info' | 'warning' | 'critical';
  duration: number;
  cooldown: number;
  channels: string[];
  escalation: AlertEscalation;
  suppression: AlertSuppression;
}

export interface AlertEscalation {
  enabled: boolean;
  delay: number;
  levels: EscalationLevel[];
  conditions: string[];
  actions: string[];
}

export interface MonitoringDashboard {
  name: string;
  description: string;
  panels: DashboardPanel[];
  layout: DashboardLayout;
  filters: DashboardFilter[];
  sharing: DashboardSharing;
  alerting: DashboardAlerting;
}

export interface DashboardPanel {
  name: string;
  type: 'graph' | 'table' | 'stat' | 'gauge' | 'heatmap' | 'logs';
  query: string;
  visualization: PanelVisualization;
  position: PanelPosition;
  interactions: PanelInteraction[];
}

export interface PanelVisualization {
  type: string;
  options: any;
  field_config: any;
  overrides: any[];
}

export interface PanelPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PanelInteraction {
  type: 'click' | 'hover' | 'select';
  action: 'drill_down' | 'filter' | 'navigate' | 'tooltip';
  target: string;
  parameters: any;
}

export interface DashboardAlerting {
  enabled: boolean;
  rules: AlertRule[];
  notifications: NotificationConfig[];
  escalation: AlertEscalation;
  suppression: AlertSuppression;
}

export interface AlertRule {
  name: string;
  query: string;
  condition: string;
  threshold: any;
  frequency: number;
  duration: number;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  tags: string[];
}

export interface MonitoringLogging {
  enabled: boolean;
  level: 'debug' | 'info' | 'warning' | 'error';
  format: 'json' | 'text' | 'structured';
  destination: 'file' | 'console' | 'elasticsearch' | 'splunk' | 'datadog';
  retention: number;
  sampling: LoggingSampling;
  filtering: LoggingFiltering;
}

export interface LoggingSampling {
  enabled: boolean;
  rate: number;
  burst: number;
  rules: SamplingRule[];
}

export interface SamplingRule {
  service: string;
  operation: string;
  rate: number;
  max_traces: number;
}

export interface LoggingFiltering {
  enabled: boolean;
  rules: FilterRule[];
  blacklist: string[];
  whitelist: string[];
}

export interface MonitoringTracing {
  enabled: boolean;
  sampler: TracingSampler;
  exporter: TracingExporter;
  instrumentation: TracingInstrumentation;
  correlation: TracingCorrelation;
}

export interface TracingSampler {
  type: 'const' | 'probabilistic' | 'rate_limiting' | 'adaptive';
  param: number;
  max_traces_per_second: number;
  strategies: SamplingStrategy[];
}

export interface SamplingStrategy {
  service: string;
  operation: string;
  type: 'probabilistic' | 'rate_limiting';
  param: number;
}

export interface TracingExporter {
  type: 'jaeger' | 'zipkin' | 'datadog' | 'new_relic' | 'honeycomb';
  endpoint: string;
  headers: Record<string, string>;
  timeout: number;
  batch_size: number;
  queue_size: number;
}

export interface TracingInstrumentation {
  enabled: boolean;
  libraries: string[];
  custom: CustomInstrumentation[];
  propagation: TracingPropagation;
}

export interface CustomInstrumentation {
  name: string;
  type: 'http' | 'database' | 'cache' | 'queue' | 'custom';
  config: any;
  enabled: boolean;
}

export interface TracingPropagation {
  formats: string[];
  baggage: boolean;
  correlation_id: boolean;
  user_id: boolean;
  tenant_id: boolean;
}

export interface TracingCorrelation {
  enabled: boolean;
  headers: string[];
  logs: boolean;
  metrics: boolean;
  dashboards: boolean;
}

export interface MonitoringProfiling {
  enabled: boolean;
  type: 'cpu' | 'memory' | 'goroutine' | 'heap' | 'allocs';
  sampling_rate: number;
  collection_interval: number;
  retention_period: number;
  analysis: ProfilingAnalysis;
  visualization: ProfilingVisualization;
}

export interface ProfilingAnalysis {
  enabled: boolean;
  algorithms: string[];
  thresholds: any;
  anomaly_detection: boolean;
  trend_analysis: boolean;
  comparative_analysis: boolean;
}

export interface ProfilingVisualization {
  enabled: boolean;
  formats: string[];
  interactive: boolean;
  sharing: boolean;
  embedding: boolean;
  export: string[];
}

export interface ModelScaling {
  enabled: boolean;
  type: 'horizontal' | 'vertical' | 'auto';
  min_instances: number;
  max_instances: number;
  target_utilization: number;
  metrics: ScalingMetric[];
  policies: ScalingPolicy[];
  cooldown: ScalingCooldown;
}

export interface ScalingMetric {
  name: string;
  type: 'cpu' | 'memory' | 'custom';
  target: number;
  aggregation: 'average' | 'max' | 'min' | 'sum';
  window: number;
  threshold: number;
}

export interface ScalingPolicy {
  name: string;
  type: 'target_tracking' | 'step_scaling' | 'simple_scaling' | 'scheduled';
  metric: string;
  target: number;
  scale_up: ScalingAction;
  scale_down: ScalingAction;
  cooldown: number;
}

export interface ScalingAction {
  adjustment: number;
  type: 'change_in_capacity' | 'exact_capacity' | 'percent_change_in_capacity';
  cooldown: number;
  min_adjustment: number;
  max_adjustment: number;
}

export interface ScalingCooldown {
  scale_up: number;
  scale_down: number;
  default: number;
}

export interface ModelSecurity {
  enabled: boolean;
  authentication: ModelAuthentication;
  authorization: ModelAuthorization;
  encryption: ModelEncryption;
  network: ModelNetworkSecurity;
  audit: ModelAudit;
  compliance: ModelCompliance;
}

export interface ModelAuthentication {
  enabled: boolean;
  methods: string[];
  providers: string[];
  tokens: TokenConfig;
  certificates: CertificateConfig;
  multi_factor: MultiFactorConfig;
}

export interface TokenConfig {
  type: 'jwt' | 'oauth' | 'api_key' | 'bearer';
  issuer: string;
  audience: string;
  expiration: number;
  refresh: boolean;
  validation: TokenValidation;
}

export interface TokenValidation {
  signature: boolean;
  expiration: boolean;
  issuer: boolean;
  audience: boolean;
  claims: string[];
  revocation: boolean;
}

export interface CertificateConfig {
  type: 'x509' | 'pem' | 'pkcs12';
  authority: string;
  validation: CertificateValidation;
  renewal: CertificateRenewal;
}

export interface CertificateValidation {
  chain: boolean;
  expiration: boolean;
  revocation: boolean;
  hostname: boolean;
  purpose: boolean;
}

export interface CertificateRenewal {
  enabled: boolean;
  threshold: number;
  automation: boolean;
  notifications: NotificationConfig[];
}

export interface MultiFactorConfig {
  enabled: boolean;
  methods: string[];
  required: boolean;
  bypass: string[];
  session: MFASession;
}

export interface MFASession {
  duration: number;
  remember_device: boolean;
  max_devices: number;
  device_trust: boolean;
}

export interface ModelAuthorization {
  enabled: boolean;
  model: 'rbac' | 'abac' | 'acl' | 'custom';
  policies: AuthorizationPolicy[];
  roles: AuthorizationRole[];
  permissions: AuthorizationPermission[];
  enforcement: AuthorizationEnforcement;
}

export interface AuthorizationPolicy {
  name: string;
  description: string;
  rules: AuthorizationRule[];
  effect: 'allow' | 'deny';
  priority: number;
  enabled: boolean;
}

export interface AuthorizationRule {
  subject: string;
  action: string;
  resource: string;
  condition: string;
  environment: string;
  time: string;
}

export interface AuthorizationRole {
  name: string;
  description: string;
  permissions: string[];
  users: string[];
  groups: string[];
  inheritance: boolean;
}

export interface AuthorizationPermission {
  name: string;
  description: string;
  actions: string[];
  resources: string[];
  conditions: string[];
  effect: 'allow' | 'deny';
}

export interface AuthorizationEnforcement {
  mode: 'permissive' | 'enforcing' | 'disabled';
  decision_point: 'gateway' | 'service' | 'hybrid';
  caching: boolean;
  logging: boolean;
  metrics: boolean;
}

export interface ModelEncryption {
  enabled: boolean;
  at_rest: EncryptionAtRest;
  in_transit: EncryptionInTransit;
  in_memory: EncryptionInMemory;
  key_management: KeyManagement;
}

export interface EncryptionAtRest {
  enabled: boolean;
  algorithm: 'aes256' | 'aes128' | 'chacha20' | 'rsa';
  key_size: number;
  mode: 'cbc' | 'gcm' | 'xts' | 'ctr';
  padding: 'pkcs7' | 'iso10126' | 'ansix923' | 'none';
}

export interface EncryptionInTransit {
  enabled: boolean;
  protocol: 'tls' | 'dtls' | 'ipsec' | 'wireguard';
  version: string;
  cipher_suites: string[];
  certificate: string;
  mutual_auth: boolean;
}

export interface EncryptionInMemory {
  enabled: boolean;
  technique: 'homomorphic' | 'secure_multiparty' | 'differential_privacy' | 'trusted_execution';
  parameters: any;
  performance_impact: number;
}

export interface KeyManagement {
  system: 'internal' | 'external' | 'hsm' | 'cloud';
  provider: string;
  rotation: KeyRotation;
  backup: KeyBackup;
  recovery: KeyRecovery;
  audit: KeyAudit;
}

export interface KeyRotation {
  enabled: boolean;
  frequency: number;
  automatic: boolean;
  grace_period: number;
  versioning: boolean;
}

export interface KeyBackup {
  enabled: boolean;
  location: string;
  encryption: boolean;
  frequency: number;
  retention: number;
  testing: boolean;
}

export interface KeyRecovery {
  enabled: boolean;
  threshold: number;
  shares: number;
  trustees: string[];
  automation: boolean;
  validation: boolean;
}

export interface KeyAudit {
  enabled: boolean;
  events: string[];
  logging: boolean;
  monitoring: boolean;
  alerting: boolean;
  reporting: boolean;
}

export interface ModelNetworkSecurity {
  enabled: boolean;
  firewall: NetworkFirewall;
  intrusion_detection: IntrusionDetection;
  ddos_protection: DDOSProtection;
  network_segmentation: NetworkSegmentation;
  vpn: VPNConfig;
}

export interface NetworkFirewall {
  enabled: boolean;
  type: 'stateful' | 'stateless' | 'application' | 'next_generation';
  rules: FirewallRule[];
  logging: boolean;
  monitoring: boolean;
  alerting: boolean;
}

export interface FirewallRule {
  name: string;
  action: 'allow' | 'deny' | 'log' | 'rate_limit';
  protocol: 'tcp' | 'udp' | 'icmp' | 'all';
  source: string;
  destination: string;
  port: string;
  enabled: boolean;
  priority: number;
}

export interface IntrusionDetection {
  enabled: boolean;
  type: 'signature' | 'anomaly' | 'hybrid';
  signatures: string[];
  machine_learning: boolean;
  real_time: boolean;
  response: IDSResponse;
}

export interface IDSResponse {
  enabled: boolean;
  actions: string[];
  automatic: boolean;
  notifications: NotificationConfig[];
  quarantine: boolean;
  blocking: boolean;
}

export interface DDOSProtection {
  enabled: boolean;
  type: 'rate_limiting' | 'behavioral' | 'signature' | 'cloud';
  thresholds: DDOSThreshold[];
  mitigation: DDOSMitigation;
  monitoring: DDOSMonitoring;
}

export interface DDOSThreshold {
  metric: string;
  threshold: number;
  window: number;
  action: string;
  priority: number;
}

export interface DDOSMitigation {
  techniques: string[];
  automatic: boolean;
  manual: boolean;
  escalation: boolean;
  notifications: NotificationConfig[];
}

export interface DDOSMonitoring {
  enabled: boolean;
  metrics: string[];
  dashboards: string[];
  alerts: string[];
  reporting: boolean;
}

export interface NetworkSegmentation {
  enabled: boolean;
  type: 'vlan' | 'subnet' | 'micro' | 'zero_trust';
  zones: NetworkZone[];
  policies: SegmentationPolicy[];
  enforcement: SegmentationEnforcement;
}

export interface NetworkZone {
  name: string;
  description: string;
  trust_level: 'trusted' | 'untrusted' | 'dmz' | 'isolated';
  resources: string[];
  policies: string[];
  monitoring: boolean;
}

export interface SegmentationPolicy {
  name: string;
  source_zone: string;
  destination_zone: string;
  action: 'allow' | 'deny' | 'inspect' | 'log';
  protocols: string[];
  ports: string[];
  conditions: string[];
}

export interface SegmentationEnforcement {
  mode: 'permissive' | 'enforcing' | 'monitoring';
  technology: 'firewall' | 'sdn' | 'proxy' | 'vpn';
  logging: boolean;
  monitoring: boolean;
  alerting: boolean;
}

export interface VPNConfig {
  enabled: boolean;
  type: 'site_to_site' | 'remote_access' | 'ssl' | 'ipsec';
  authentication: VPNAuthentication;
  encryption: VPNEncryption;
  routing: VPNRouting;
  monitoring: VPNMonitoring;
}

export interface VPNAuthentication {
  methods: string[];
  certificates: boolean;
  multi_factor: boolean;
  radius: boolean;
  ldap: boolean;
  local: boolean;
}

export interface VPNEncryption {
  protocol: 'openvpn' | 'ipsec' | 'wireguard' | 'sstp';
  cipher: string;
  authentication: string;
  pfs: boolean;
  compression: boolean;
}

export interface VPNRouting {
  type: 'static' | 'dynamic' | 'policy';
  routes: VPNRoute[];
  split_tunneling: boolean;
  dns: string[];
  domains: string[];
}

export interface VPNRoute {
  destination: string;
  gateway: string;
  metric: number;
  interface: string;
  enabled: boolean;
}

export interface VPNMonitoring {
  enabled: boolean;
  metrics: string[];
  logging: boolean;
  alerting: boolean;
  reporting: boolean;
  dashboard: string;
}

export interface ModelAudit {
  enabled: boolean;
  events: string[];
  storage: AuditStorage;
  retention: AuditRetention;
  analysis: AuditAnalysis;
  reporting: AuditReporting;
  compliance: AuditCompliance;
}

export interface AuditStorage {
  type: 'database' | 'file' | 'siem' | 'cloud';
  location: string;
  encryption: boolean;
  compression: boolean;
  replication: boolean;
  backup: boolean;
}

export interface AuditRetention {
  period: number;
  archival: boolean;
  compression: boolean;
  encryption: boolean;
  deletion: boolean;
  legal_hold: boolean;
}

export interface AuditAnalysis {
  enabled: boolean;
  real_time: boolean;
  batch: boolean;
  machine_learning: boolean;
  anomaly_detection: boolean;
  correlation: boolean;
  forensics: boolean;
}

export interface AuditReporting {
  enabled: boolean;
  frequency: 'real_time' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  format: 'html' | 'pdf' | 'csv' | 'json';
  customization: boolean;
  automation: boolean;
}

export interface AuditCompliance {
  frameworks: string[];
  requirements: string[];
  controls: string[];
  assessments: string[];
  certifications: string[];
  reporting: boolean;
}

export interface ModelCompliance {
  enabled: boolean;
  frameworks: ComplianceFramework[];
  assessments: ComplianceAssessment[];
  controls: ComplianceControl[];
  reporting: ComplianceReporting;
  certification: ComplianceCertification;
}

export interface ComplianceCertification {
  enabled: boolean;
  standards: string[];
  auditors: string[];
  schedule: CertificationSchedule;
  preparation: CertificationPreparation;
  maintenance: CertificationMaintenance;
}

export interface CertificationSchedule {
  initial: Date;
  renewal: Date;
  frequency: number;
  assessments: string[];
  audits: string[];
}

export interface CertificationPreparation {
  enabled: boolean;
  timeline: number;
  tasks: string[];
  documentation: string[];
  training: string[];
  testing: string[];
}

export interface CertificationMaintenance {
  enabled: boolean;
  monitoring: boolean;
  reporting: boolean;
  updates: boolean;
  renewals: boolean;
  changes: boolean;
}

export interface ClassificationValidation {
  enabled: boolean;
  automatic: boolean;
  manual: boolean;
  sampling: ValidationSampling;
  metrics: ValidationMetrics;
  thresholds: ValidationThresholds;
  feedback: ValidationFeedback;
}

export interface ValidationSampling {
  enabled: boolean;
  method: 'random' | 'stratified' | 'systematic';
  size: number;
  percentage: number;
  frequency: string;
}

export interface ValidationMetrics {
  accuracy: boolean;
  precision: boolean;
  recall: boolean;
  f1_score: boolean;
  confusion_matrix: boolean;
  roc_auc: boolean;
  cohen_kappa: boolean;
}

export interface ValidationThresholds {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confidence: number;
  coverage: number;
}

export interface ValidationFeedback {
  enabled: boolean;
  collection: 'automatic' | 'manual' | 'hybrid';
  storage: string;
  processing: 'batch' | 'real_time';
  learning: boolean;
  retraining: boolean;
}

export interface ClassificationMonitoring {
  enabled: boolean;
  metrics: ClassificationMetrics;
  drift: ClassificationDrift;
  performance: ClassificationPerformance;
  alerts: ClassificationAlert[];
  reporting: ClassificationReporting;
}

export interface ClassificationMetrics {
  accuracy: boolean;
  precision: boolean;
  recall: boolean;
  f1_score: boolean;
  coverage: boolean;
  confidence: boolean;
  throughput: boolean;
  latency: boolean;
}

export interface ClassificationDrift {
  enabled: boolean;
  detection: 'statistical' | 'ml' | 'rule_based';
  threshold: number;
  window: number;
  frequency: string;
  alerts: boolean;
  retraining: boolean;
}

export interface ClassificationPerformance {
  enabled: boolean;
  metrics: string[];
  benchmarks: string[];
  comparison: boolean;
  optimization: boolean;
  tuning: boolean;
}

export interface ClassificationAlert {
  name: string;
  condition: string;
  threshold: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
  enabled: boolean;
  frequency: number;
}

export interface ClassificationReporting {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  recipients: string[];
  format: 'html' | 'pdf' | 'csv' | 'json';
  content: string[];
  automation: boolean;
}

export interface DataTagging {
  enabled: boolean;
  automatic: boolean;
  manual: boolean;
  taxonomy: TagTaxonomy;
  rules: TaggingRule[];
  propagation: TagPropagation;
  management: TagManagement;
  governance: TagGovernance;
}

export interface TagTaxonomy {
  id: string;
  name: string;
  description: string;
  version: string;
  hierarchical: boolean;
  categories: TagCategory[];
  relationships: TagRelationship[];
  validation: TagValidation;
}

export interface TagCategory {
  id: string;
  name: string;
  description: string;
  parent: string;
  children: string[];
  tags: string[];
  color: string;
  icon: string;
  mandatory: boolean;
  exclusive: boolean;
}

export interface TagRelationship {
  id: string;
  type: 'parent_child' | 'synonym' | 'antonym' | 'related' | 'excludes';
  source: string;
  target: string;
  weight: number;
  bidirectional: boolean;
}

export interface TagValidation {
  enabled: boolean;
  rules: TagValidationRule[];
  enforcement: 'warning' | 'error' | 'blocking';
  reporting: boolean;
  metrics: boolean;
}

export interface TagValidationRule {
  id: string;
  name: string;
  description: string;
  type: 'required' | 'format' | 'cardinality' | 'dependency' | 'exclusion';
  condition: string;
  parameters: any;
  severity: 'warning' | 'error';
  enabled: boolean;
}

export interface TaggingRule {
  id: string;
  name: string;
  description: string;
  type: 'pattern' | 'keyword' | 'regex' | 'ml' | 'manual';
  trigger: TaggingTrigger;
  conditions: TaggingCondition[];
  actions: TaggingAction[];
  priority: number;
  enabled: boolean;
}

export interface TaggingTrigger {
  event: 'asset_created' | 'asset_updated' | 'schema_changed' | 'data_profiled' | 'manual';
  scope: 'all' | 'specific' | 'filtered';
  filters: any;
  frequency: 'immediate' | 'scheduled' | 'batch';
}

export interface TaggingCondition {
  type: 'asset_type' | 'asset_name' | 'column_name' | 'data_type' | 'data_pattern' | 'metadata';
  operator: 'equals' | 'not_equals' | 'contains' | 'matches' | 'in' | 'not_in';
  value: any;
  case_sensitive: boolean;
  enabled: boolean;
}

export interface TaggingAction {
  type: 'add_tag' | 'remove_tag' | 'replace_tag' | 'set_category' | 'update_metadata';
  parameters: any;
  overwrite: boolean;
  propagate: boolean;
  enabled: boolean;
}

export interface TagPropagation {
  enabled: boolean;
  direction: 'upstream' | 'downstream' | 'both';
  levels: number;
  rules: PropagationRule[];
  conflicts: ConflictResolution;
  audit: boolean;
}

export interface PropagationRule {
  id: string;
  name: string;
  description: string;
  source_type: 'table' | 'column' | 'schema' | 'database';
  target_type: 'table' | 'column' | 'schema' | 'database';
  tags: string[];
  conditions: string[];
  transformation: string;
  enabled: boolean;
}

export interface ConflictResolution {
  strategy: 'merge' | 'override' | 'skip' | 'manual';
  priority: 'source' | 'target' | 'latest' | 'manual';
  notification: boolean;
  escalation: boolean;
  logging: boolean;
}

export interface TagManagement {
  enabled: boolean;
  lifecycle: TagLifecycle;
  versioning: TagVersioning;
  approval: TagApproval;
  deprecation: TagDeprecation;
  cleanup: TagCleanup;
}

export interface TagLifecycle {
  states: 'proposed' | 'approved' | 'active' | 'deprecated' | 'retired';
  transitions: TagTransition[];
  automation: boolean;
  notifications: NotificationConfig[];
  audit: boolean;
}

export interface TagTransition {
  from: string;
  to: string;
  conditions: string[];
  approvals: string[];
  notifications: NotificationConfig[];
  automation: boolean;
}

export interface TagVersioning {
  enabled: boolean;
  strategy: 'semantic' | 'timestamp' | 'sequential';
  backward_compatibility: boolean;
  migration: TagMigration;
  rollback: TagRollback;
}

export interface TagMigration {
  enabled: boolean;
  automatic: boolean;
  mapping: TagMapping[];
  validation: boolean;
  rollback: boolean;
  notification: boolean;
}

export interface TagMapping {
  old_tag: string;
  new_tag: string;
  transformation: string;
  conditions: string[];
  validation: string;
}

export interface TagRollback {
  enabled: boolean;
  versions: number;
  conditions: string[];
  approval: boolean;
  notification: boolean;
  audit: boolean;
}

export interface TagApproval {
  enabled: boolean;
  workflow: ApprovalWorkflow;
  approvers: string[];
  delegation: boolean;
  escalation: boolean;
  timeout: number;
}

export interface ApprovalWorkflow {
  type: 'single' | 'parallel' | 'sequential' | 'conditional';
  steps: ApprovalStep[];
  conditions: string[];
  automation: boolean;
  notifications: NotificationConfig[];
}

export interface ApprovalStep {
  order: number;
  approver: string;
  role: string;
  conditions: string[];
  timeout: number;
  delegation: boolean;
  escalation: boolean;
}

export interface TagDeprecation {
  enabled: boolean;
  lifecycle: DeprecationLifecycle;
  migration: DeprecationMigration;
  notification: DeprecationNotification;
  cleanup: DeprecationCleanup;
}

export interface DeprecationLifecycle {
  warning_period: number;
  grace_period: number;
  retirement_date: Date;
  phases: DeprecationPhase[];
  automation: boolean;
}

export interface DeprecationPhase {
  name: string;
  duration: number;
  actions: string[];
  notifications: NotificationConfig[];
  restrictions: string[];
}

export interface DeprecationMigration {
  enabled: boolean;
  target_tags: string[];
  mapping: TagMapping[];
  validation: boolean;
  rollback: boolean;
  automation: boolean;
}

export interface DeprecationNotification {
  enabled: boolean;
  recipients: string[];
  frequency: string;
  channels: string[];
  template: string;
  escalation: boolean;
}

export interface DeprecationCleanup {
  enabled: boolean;
  automatic: boolean;
  orphaned_tags: boolean;
  unused_tags: boolean;
  references: boolean;
  archive: boolean;
}

export interface TagCleanup {
  enabled: boolean;
  automatic: boolean;
  schedule: CleanupSchedule;
  rules: CleanupRule[];
  orphaned: OrphanedTagCleanup;
  unused: UnusedTagCleanup;
  duplicates: DuplicateTagCleanup;
}

export interface CleanupSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  time: string;
  day: number;
  enabled: boolean;
  dry_run: boolean;
}

export interface CleanupRule {
  id: string;
  name: string;
  description: string;
  type: 'orphaned' | 'unused' | 'duplicate' | 'expired' | 'invalid';
  condition: string;
  action: 'delete' | 'archive' | 'merge' | 'notify';
  parameters: any;
  enabled: boolean;
}

export interface OrphanedTagCleanup {
  enabled: boolean;
  detection: 'automatic' | 'manual' | 'scheduled';
  threshold: number;
  action: 'delete' | 'archive' | 'notify';
  approval: boolean;
  notification: boolean;
}

export interface UnusedTagCleanup {
  enabled: boolean;
  threshold: number;
  period: number;
  action: 'delete' | 'archive' | 'notify';
  exceptions: string[];
  approval: boolean;
}

export interface DuplicateTagCleanup {
  enabled: boolean;
  detection: 'exact' | 'fuzzy' | 'semantic';
  threshold: number;
  action: 'merge' | 'delete' | 'notify';
  merge_strategy: 'newest' | 'oldest' | 'most_used' | 'manual';
  approval: boolean;
}

export interface TagGovernance {
  enabled: boolean;
  policies: TagPolicy[];
  compliance: TagCompliance;
  audit: TagAudit;
  reporting: TagReporting;
  metrics: TagMetrics;
}

export interface TagPolicy {
  id: string;
  name: string;
  description: string;
  type: 'mandatory' | 'prohibited' | 'restricted' | 'recommended';
  scope: 'global' | 'domain' | 'dataset' | 'asset_type';
  rules: TagPolicyRule[];
  enforcement: TagPolicyEnforcement;
  exceptions: TagPolicyException[];
}

export interface TagPolicyRule {
  condition: string;
  requirement: string;
  tags: string[];
  categories: string[];
  cardinality: TagCardinality;
  validation: string;
}

export interface TagCardinality {
  min: number;
  max: number;
  exact: number;
  per_category: Record<string, number>;
}

export interface TagPolicyEnforcement {
  mode: 'advisory' | 'warning' | 'blocking';
  automated: boolean;
  notifications: NotificationConfig[];
  escalation: boolean;
  override: boolean;
}

export interface TagPolicyException {
  id: string;
  policy: string;
  asset: string;
  justification: string;
  approver: string;
  expiration: Date;
  conditions: string[];
  monitoring: boolean;
}

export interface TagCompliance {
  enabled: boolean;
  frameworks: string[];
  requirements: TagComplianceRequirement[];
  assessments: TagComplianceAssessment[];
  reporting: TagComplianceReporting;
}

export interface TagComplianceRequirement {
  id: string;
  name: string;
  framework: string;
  description: string;
  tags: string[];
  categories: string[];
  validation: string;
  evidence: string[];
}

export interface TagComplianceAssessment {
  id: string;
  name: string;
  framework: string;
  scope: string;
  status: 'compliant' | 'non_compliant' | 'partially_compliant';
  score: number;
  findings: ComplianceFinding[];
  recommendations: string[];
}

export interface ComplianceFinding {
  requirement: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  evidence: string[];
  remediation: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface TagComplianceReporting {
  enabled: boolean;
  frequency: 'monthly' | 'quarterly' | 'annually';
  recipients: string[];
  format: 'html' | 'pdf' | 'csv' | 'json';
  content: string[];
  automation: boolean;
}

export interface TagAudit {
  enabled: boolean;
  events: string[];
  storage: string;
  retention: number;
  analysis: boolean;
  reporting: boolean;
  alerting: boolean;
}

export interface TagReporting {
  enabled: boolean;
  dashboards: TagDashboard[];
  reports: TagReport[];
  metrics: TagMetric[];
  alerting: TagAlerting;
}

export interface TagDashboard {
  id: string;
  name: string;
  description: string;
  widgets: TagWidget[];
  filters: TagFilter[];
  sharing: boolean;
  embedding: boolean;
}

export interface TagWidget {
  id: string;
  name: string;
  type: 'chart' | 'table' | 'kpi' | 'gauge' | 'map';
  data: string;
  visualization: any;
  position: WidgetPosition;
  interactions: WidgetInteraction[];
}

export interface TagFilter {
  id: string;
  name: string;
  type: 'dropdown' | 'multi_select' | 'date_range' | 'text';
  values: string[];
  default: any;
  required: boolean;
  cascading: boolean;
}

export interface TagReport {
  id: string;
  name: string;
  description: string;
  type: 'usage' | 'compliance' | 'quality' | 'lifecycle';
  schedule: TagReportSchedule;
  recipients: string[];
  format: 'html' | 'pdf' | 'csv' | 'json';
  content: string[];
}

export interface TagReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  time: string;
  day: number;
  enabled: boolean;
  automation: boolean;
}

export interface TagMetric {
  id: string;
  name: string;
  description: string;
  type: 'count' | 'percentage' | 'ratio' | 'trend';
  calculation: string;
  target: number;
  threshold: number;
  monitoring: boolean;
  alerting: boolean;
}

export interface TagAlerting {
  enabled: boolean;
  rules: TagAlertRule[];
  channels: string[];
  escalation: boolean;
  suppression: boolean;
}

export interface TagAlertRule {
  id: string;
  name: string;
  condition: string;
  threshold: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  frequency: number;
  enabled: boolean;
}

export interface TagMetrics {
  enabled: boolean;
  collection: TagMetricCollection;
  calculation: TagMetricCalculation;
  storage: TagMetricStorage;
  analysis: TagMetricAnalysis;
  visualization: TagMetricVisualization;
}

export interface TagMetricCollection {
  enabled: boolean;
  frequency: 'real_time' | 'hourly' | 'daily' | 'weekly';
  metrics: string[];
  dimensions: string[];
  filters: string[];
  sampling: boolean;
}

export interface TagMetricCalculation {
  engine: 'sql' | 'spark' | 'flink' | 'custom';
  aggregations: string[];
  functions: string[];
  windows: string[];
  partitioning: string[];
  optimization: boolean;
}

export interface TagMetricStorage {
  type: 'timeseries' | 'olap' | 'relational' | 'nosql';
  retention: number;
  compression: boolean;
  indexing: boolean;
  partitioning: boolean;
  replication: boolean;
}

export interface TagMetricAnalysis {
  enabled: boolean;
  statistical: boolean;
  trend: boolean;
  anomaly: boolean;
  correlation: boolean;
  forecasting: boolean;
  machine_learning: boolean;
}

export interface TagMetricVisualization {
  enabled: boolean;
  charts: string[];
  dashboards: string[];
  interactive: boolean;
  real_time: boolean;
  customization: boolean;
  embedding: boolean;
}

export interface DataSearch {
  enabled: boolean;
  engine: SearchEngine;
  indexing: SearchIndexing;
  querying: SearchQuerying;
  results: SearchResults;
  personalization: SearchPersonalization;
  analytics: SearchAnalytics;
}

export interface SearchEngine {
  type: 'elasticsearch' | 'solr' | 'lucene' | 'custom';
  version: string;
  configuration: SearchEngineConfig;
  clustering: SearchClustering;
  performance: SearchPerformance;
  security: SearchSecurity;
}

export interface SearchEngineConfig {
  nodes: number;
  shards: number;
  replicas: number;
  memory: string;
  storage: string;
  network: string;
  tuning: SearchTuning;
}

export interface SearchClustering {
  enabled: boolean;
  nodes: SearchNode[];
  load_balancing: boolean;
  failover: boolean;
  auto_scaling: boolean;
  monitoring: boolean;
}

export interface SearchNode {
  id: string;
  role: 'master' | 'data' | 'ingest' | 'coordinating';
  resources: NodeResources;
  status: 'healthy' | 'unhealthy' | 'starting' | 'stopping';
  load: NodeLoad;
}

export interface NodeResources {
  cpu: number;
  memory: string;
  storage: string;
  network: string;
}

export interface NodeLoad {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_usage: number;
  query_rate: number;
  indexing_rate: number;
}

export interface SearchTuning {
  query_cache: boolean;
  request_cache: boolean;
  fielddata_cache: boolean;
  circuit_breaker: boolean;
  thread_pool: ThreadPoolConfig;
  bulk_operations: BulkOperationConfig;
}

export interface ThreadPoolConfig {
  search: number;
  index: number;
  bulk: number;
  get: number;
  analyze: number;
  refresh: number;
}

export interface BulkOperationConfig {
  size: number;
  timeout: number;
  flush_threshold: number;
  concurrent_requests: number;
  retry_on_conflict: number;
}

export interface SearchPerformance {
  monitoring: boolean;
  metrics: SearchMetrics;
  optimization: SearchOptimization;
  benchmarking: SearchBenchmarking;
  profiling: SearchProfiling;
}

export interface SearchMetrics {
  query_performance: boolean;
  indexing_performance: boolean;
  cluster_health: boolean;
  resource_utilization: boolean;
  error_rates: boolean;
  throughput: boolean;
}

export interface SearchOptimization {
  enabled: boolean;
  automatic: boolean;
  techniques: string[];
  monitoring: boolean;
  reporting: boolean;
  recommendations: boolean;
}

export interface SearchBenchmarking {
  enabled: boolean;
  scenarios: BenchmarkScenario[];
  metrics: string[];
  automation: boolean;
  reporting: boolean;
  comparison: boolean;
}

export interface BenchmarkScenario {
  name: string;
  description: string;
  queries: string[];
  data_size: number;
  concurrent_users: number;
  duration: number;
  success_criteria: string;
}

export interface SearchProfiling {
  enabled: boolean;
  query_profiling: boolean;
  aggregation_profiling: boolean;
  memory_profiling: boolean;
  cpu_profiling: boolean;
  visualization: boolean;
}

export interface SearchSecurity {
  enabled: boolean;
  authentication: SearchAuthentication;
  authorization: SearchAuthorization;
  encryption: SearchEncryption;
  audit: SearchAudit;
  compliance: SearchCompliance;
}

export interface SearchAuthentication {
  enabled: boolean;
  methods: string[];
  providers: string[];
  tokens: boolean;
  certificates: boolean;
  ldap: boolean;
  saml: boolean;
}

export interface SearchAuthorization {
  enabled: boolean;
  model: 'rbac' | 'abac' | 'custom';
  roles: string[];
  permissions: string[];
  field_level: boolean;
  document_level: boolean;
}

export interface SearchEncryption {
  enabled: boolean;
  at_rest: boolean;
  in_transit: boolean;
  algorithms: string[];
  key_management: boolean;
  compliance: boolean;
}

export interface SearchAudit {
  enabled: boolean;
  events: string[];
  storage: string;
  retention: number;
  analysis: boolean;
  reporting: boolean;
}

export interface SearchCompliance {
  enabled: boolean;
  frameworks: string[];
  requirements: string[];
  assessments: string[];
  reporting: boolean;
  certification: boolean;
}

export interface SearchIndexing {
  enabled: boolean;
  automatic: boolean;
  schedule: IndexingSchedule;
  strategy: IndexingStrategy;
  mapping: IndexMapping;
  analysis: IndexAnalysis;
  monitoring: IndexingMonitoring;
}

export interface IndexingSchedule {
  frequency: 'real_time' | 'batch' | 'incremental' | 'custom';
  interval: number;
  time: string;
  enabled: boolean;
  parallel: boolean;
}

export interface IndexingStrategy {
  type: 'full' | 'incremental' | 'delta' | 'hybrid';
  change_detection: 'timestamp' | 'checksum' | 'trigger' | 'log';
  conflict_resolution: 'overwrite' | 'merge' | 'skip' | 'error';
  optimization: IndexingOptimization;
}

export interface IndexingOptimization {
  enabled: boolean;
  bulk_size: number;
  parallel_workers: number;
  memory_buffer: string;
  compression: boolean;
  deduplication: boolean;
}

export interface IndexMapping {
  enabled: boolean;
  automatic: boolean;
  fields: IndexField[];
  analyzers: IndexAnalyzer[];
  templates: IndexTemplate[];
  dynamic: boolean;
}

export interface IndexField {
  name: string;
  type: 'text' | 'keyword' | 'numeric' | 'date' | 'boolean' | 'object' | 'nested';
  analyzer: string;
  indexing: boolean;
  storing: boolean;
  searching: boolean;
  aggregating: boolean;
  sorting: boolean;
}

export interface IndexAnalyzer {
  name: string;
  type: 'standard' | 'keyword' | 'simple' | 'whitespace' | 'custom';
  tokenizer: string;
  filters: string[];
  character_filters: string[];
  normalization: boolean;
}

export interface IndexTemplate {
  name: string;
  pattern: string;
  settings: any;
  mappings: any;
  aliases: any;
  priority: number;
  version: number;
}

export interface IndexAnalysis {
  enabled: boolean;
  tokenization: boolean;
  stemming: boolean;
  synonyms: boolean;
  stopwords: boolean;
  ngrams: boolean;
  phonetic: boolean;
  language_detection: boolean;
}

export interface IndexingMonitoring {
  enabled: boolean;
  metrics: IndexingMetrics;
  alerts: IndexingAlert[];
  reporting: IndexingReporting;
  dashboard: string;
}

export interface IndexingMetrics {
  throughput: boolean;
  latency: boolean;
  error_rate: boolean;
  queue_size: boolean;
  resource_usage: boolean;
  index_size: boolean;
  document_count: boolean;
}

export interface IndexingAlert {
  name: string;
  condition: string;
  threshold: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
  enabled: boolean;
  frequency: number;
}

export interface IndexingReporting {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  format: 'html' | 'pdf' | 'csv';
  content: string[];
  automation: boolean;
}

export interface SearchQuerying {
  enabled: boolean;
  syntax: QuerySyntax;
  parsing: QueryParsing;
  execution: QueryExecution;
  optimization: QueryOptimization;
  caching: QueryCaching;
}

export interface QuerySyntax {
  supported: string[];
  default: string;
  validation: boolean;
  suggestions: boolean;
  auto_complete: boolean;
  spell_check: boolean;
}

export interface QueryParsing {
  enabled: boolean;
  strict: boolean;
  lenient: boolean;
  error_handling: 'strict' | 'lenient' | 'ignore';
  transformation: QueryTransformation;
  validation: QueryValidation;
}

export interface QueryTransformation {
  enabled: boolean;
  rules: TransformationRule[];
  synonyms: boolean;
  stemming: boolean;
  normalization: boolean;
  expansion: boolean;
}

export interface QueryValidation {
  enabled: boolean;
  syntax: boolean;
  semantics: boolean;
  permissions: boolean;
  complexity: boolean;
  resource_limits: boolean;
}

export interface QueryExecution {
  enabled: boolean;
  timeout: number;
  max_results: number;
  pagination: QueryPagination;
  sorting: QuerySorting;
  filtering: QueryFiltering;
  aggregation: QueryAggregation;
}

export interface QueryPagination {
  enabled: boolean;
  default_size: number;
  max_size: number;
  deep_pagination: boolean;
  scroll: boolean;
  search_after: boolean;
}

export interface QuerySorting {
  enabled: boolean;
  default_sort: string;
  max_sorts: number;
  custom_scoring: boolean;
  relevance_scoring: boolean;
  geo_distance: boolean;
}

export interface QueryFiltering {
  enabled: boolean;
  pre_filtering: boolean;
  post_filtering: boolean;
  aggregation_filtering: boolean;
  context_filtering: boolean;
  security_filtering: boolean;
}

export interface QueryAggregation {
  enabled: boolean;
  max_aggregations: number;
  nested_aggregations: boolean;
  pipeline_aggregations: boolean;
  custom_aggregations: boolean;
  caching: boolean;
}

export interface QueryOptimization {
  enabled: boolean;
  automatic: boolean;
  techniques: string[];
  monitoring: boolean;
  feedback: boolean;
  machine_learning: boolean;
}

export interface QueryCaching {
  enabled: boolean;
  levels: string[];
  ttl: number;
  size: string;
  eviction: 'lru' | 'lfu' | 'ttl' | 'random';
  warming: boolean;
  invalidation: boolean;
}

export interface SearchResults {
  enabled: boolean;
  formatting: ResultFormatting;
  ranking: ResultRanking;
  highlighting: ResultHighlighting;
  snippets: ResultSnippets;
  faceting: ResultFaceting;
  clustering: ResultClustering;
}

export interface ResultFormatting {
  enabled: boolean;
  formats: string[];
  default_format: string;
  custom_formats: boolean;
  templating: boolean;
  transformation: boolean;
}

export interface ResultRanking {
  enabled: boolean;
  algorithm: 'tf_idf' | 'bm25' | 'dfr' | 'lm_dirichlet' | 'custom';
  factors: RankingFactor[];
  boosting: ResultBoosting;
  personalization: boolean;
  machine_learning: boolean;
}

export interface RankingFactor {
  name: string;
  weight: number;
  type: 'relevance' | 'popularity' | 'freshness' | 'quality' | 'custom';
  enabled: boolean;
  normalization: boolean;
}

export interface ResultBoosting {
  enabled: boolean;
  field_boosting: boolean;
  query_boosting: boolean;
  function_boosting: boolean;
  decay_functions: boolean;
  custom_functions: boolean;
}

export interface ResultHighlighting {
  enabled: boolean;
  fields: string[];
  fragment_size: number;
  fragment_count: number;
  pre_tags: string[];
  post_tags: string[];
  fast_vector_highlighter: boolean;
}

export interface ResultSnippets {
  enabled: boolean;
  length: number;
  count: number;
  ellipsis: string;
  boundary: 'word' | 'sentence' | 'character';
  quality: boolean;
}

export interface ResultFaceting {
  enabled: boolean;
  fields: string[];
  max_facets: number;
  min_count: number;
  hierarchical: boolean;
  range_facets: boolean;
  date_facets: boolean;
  geo_facets: boolean;
}

export interface ResultClustering {
  enabled: boolean;
  algorithm: 'kmeans' | 'hierarchical' | 'dbscan' | 'custom';
  features: string[];
  clusters: number;
  similarity: 'cosine' | 'euclidean' | 'jaccard' | 'custom';
  labeling: boolean;
}

export interface SearchPersonalization {
  enabled: boolean;
  user_profiling: UserProfiling;
  behavioral_tracking: BehavioralTracking;
  recommendation: SearchRecommendation;
  customization: SearchCustomization;
  privacy: SearchPrivacy;
}

export interface UserProfiling {
  enabled: boolean;
  explicit: boolean;
  implicit: boolean;
  demographics: boolean;
  preferences: boolean;
  history: boolean;
  context: boolean;
}

export interface BehavioralTracking {
  enabled: boolean;
  events: string[];
  storage: string;
  retention: number;
  analysis: boolean;
  privacy: boolean;
}

export interface SearchRecommendation {
  enabled: boolean;
  query_suggestions: boolean;
  result_recommendations: boolean;
  related_searches: boolean;
  trending: boolean;
  popular: boolean;
  collaborative: boolean;
}

export interface SearchCustomization {
  enabled: boolean;
  interface: boolean;
  results: boolean;
  filters: boolean;
  sorting: boolean;
  personalization: boolean;
  saved_searches: boolean;
}

export interface SearchPrivacy {
  enabled: boolean;
  anonymization: boolean;
  pseudonymization: boolean;
  consent: boolean;
  opt_out: boolean;
  data_retention: number;
  compliance: boolean;
}

export interface SearchAnalytics {
  enabled: boolean;
  tracking: SearchTracking;
  reporting: SearchReporting;
  optimization: SearchOptimization;
  machine_learning: SearchML;
  real_time: boolean;
}

export interface SearchTracking {
  enabled: boolean;
  events: string[];
  dimensions: string[];
  metrics: string[];
  sampling: boolean;
  real_time: boolean;
  batch: boolean;
}

export interface SearchReporting {
  enabled: boolean;
  dashboards: string[];
  reports: string[];
  metrics: string[];
  automation: boolean;
  distribution: string[];
  customization: boolean;
}

export interface SearchML {
  enabled: boolean;
  query_understanding: boolean;
  intent_detection: boolean;
  entity_extraction: boolean;
  sentiment_analysis: boolean;
  recommendation: boolean;
  personalization: boolean;
}

export interface DataLineageTracking {
  enabled: boolean;
  automatic: boolean;
  manual: boolean;
  scope: LineageScope;
  collection: LineageCollection;
  analysis: LineageAnalysis;
  visualization: LineageVisualization;
  impact: LineageImpact;
  governance: LineageGovernance;
}

export interface LineageScope {
  databases: string[];
  tables: string[];
  columns: string[];
  reports: string[];
  dashboards: string[];
  pipelines: string[];
  applications: string[];
}

export interface LineageCollection {
  methods: string[];
  frequency: 'real_time' | 'batch' | 'on_demand';
  depth: 'shallow' | 'deep' | 'complete';
  metadata: LineageMetadata;
  validation: LineageValidation;
  storage: LineageStorage;
}

export interface LineageMetadata {
  technical: boolean;
  business: boolean;
  operational: boolean;
  quality: boolean;
  security: boolean;
  compliance: boolean;
}

export interface LineageValidation {
  enabled: boolean;
  accuracy: boolean;
  completeness: boolean;
  consistency: boolean;
  timeliness: boolean;
  rules: ValidationRule[];
}

export interface LineageStorage {
  type: 'graph' | 'relational' | 'document' | 'hybrid';
  format: 'native' | 'rdf' | 'json' | 'xml';
  compression: boolean;
  encryption: boolean;
  versioning: boolean;
  backup: boolean;
}

export interface LineageAnalysis {
  enabled: boolean;
  impact_analysis: boolean;
  root_cause_analysis: boolean;
  dependency_analysis: boolean;
  change_analysis: boolean;
  quality_analysis: boolean;
  security_analysis: boolean;
}

export interface LineageVisualization {
  enabled: boolean;
  types: string[];
  interactive: boolean;
  real_time: boolean;
  customization: boolean;
  export: string[];
  sharing: boolean;
}

export interface LineageImpact {
  enabled: boolean;
  analysis: ImpactAnalysis;
  assessment: ImpactAssessment;
  notification: ImpactNotification;
  mitigation: ImpactMitigation;
  reporting: ImpactReporting;
}

export interface ImpactAnalysis {
  enabled: boolean;
  scope: 'immediate' | 'extended' | 'complete';
  types: string[];
  severity: boolean;
  priority: boolean;
  automation: boolean;
}

export interface ImpactAssessment {
  enabled: boolean;
  criteria: AssessmentCriteria[];
  scoring: AssessmentScoring;
  classification: AssessmentClassification;
  validation: AssessmentValidation;
}

export interface AssessmentCriteria {
  name: string;
  type: 'business' | 'technical' | 'operational' | 'regulatory';
  weight: number;
  scoring: string;
  thresholds: any;
}

export interface AssessmentScoring {
  method: 'weighted' | 'risk_matrix' | 'custom';
  scale: string;
  normalization: boolean;
  aggregation: string;
}

export interface AssessmentClassification {
  enabled: boolean;
  categories: string[];
  rules: ClassificationRule[];
  automation: boolean;
  validation: boolean;
}

export interface AssessmentValidation {
  enabled: boolean;
  peer_review: boolean;
  expert_review: boolean;
  automated_checks: boolean;
  approval: boolean;
}

export interface ImpactNotification {
  enabled: boolean;
  channels: string[];
  recipients: string[];
  triggers: string[];
  templates: string[];
  escalation: boolean;
}

export interface ImpactMitigation {
  enabled: boolean;
  strategies: string[];
  planning: MitigationPlanning;
  execution: MitigationExecution;
  monitoring: MitigationMonitoring;
}

export interface MitigationPlanning {
  enabled: boolean;
  automatic: boolean;
  templates: string[];
  approval: boolean;
  resources: boolean;
  timeline: boolean;
}

export interface MitigationExecution {
  enabled: boolean;
  automation: boolean;
  orchestration: boolean;
  monitoring: boolean;
  rollback: boolean;
  validation: boolean;
}

export interface MitigationMonitoring {
  enabled: boolean;
  metrics: string[];
  alerts: string[];
  reporting: boolean;
  dashboard: string;
  feedback: boolean;
}

export interface ImpactReporting {
  enabled: boolean;
  frequency: 'real_time' | 'daily' | 'weekly' | 'monthly';
  recipients: string[];
  format: 'html' | 'pdf' | 'csv' | 'json';
  content: string[];
  automation: boolean;
}

export interface LineageGovernance {
  enabled: boolean;
  policies: LineagePolicy[];
  compliance: LineageCompliance;
  audit: LineageAudit;
  quality: LineageQuality;
  security: LineageSecurity;
}

export interface LineagePolicy {
  id: string;
  name: string;
  description: string;
  type: 'collection' | 'retention' | 'access' | 'quality' | 'security';
  rules: PolicyRule[];
  enforcement: PolicyEnforcement;
  monitoring: PolicyMonitoring;
}

export interface PolicyMonitoring {
  enabled: boolean;
  metrics: string[];
  alerts: string[];
  dashboard: string;
  reporting: boolean;
  automation: boolean;
}

export interface LineageCompliance {
  enabled: boolean;
  frameworks: string[];
  requirements: string[];
  controls: string[];
  assessments: string[];
  reporting: boolean;
}

export interface LineageAudit {
  enabled: boolean;
  events: string[];
  storage: string;
  retention: number;
  analysis: boolean;
  reporting: boolean;
}

export interface LineageQuality {
  enabled: boolean;
  metrics: string[];
  thresholds: any;
  monitoring: boolean;
  improvement: boolean;
  reporting: boolean;
}

export interface LineageSecurity {
  enabled: boolean;
  access_control: boolean;
  encryption: boolean;
  masking: boolean;
  audit: boolean;
  compliance: boolean;
}

export class MultiDimensionalDataWarehouse {
  private warehouses: Map<string, DataWarehouse> = new Map();
  private cubes: Map<string, DataCube> = new Map();
  private dimensions: Map<string, Dimension> = new Map();
  private measures: Map<string, Measure> = new Map();
  private hierarchies: Map<string, Hierarchy> = new Map();
  private processingQueue: any[] = [];
  private isProcessing: boolean = false;

  constructor() {
    this.initializeDefaults();
    this.startProcessing();
    this.setupEventListeners();
  }

  /**
   * Initialize default configurations
   */
  private initializeDefaults(): void {
    // Implementation would initialize default warehouse configurations
  }

  /**
   * Start processing queue
   */
  private startProcessing(): void {
    setInterval(async () => {
      if (!this.isProcessing && this.processingQueue.length > 0) {
        this.isProcessing = true;
        await this.processQueueItems();
        this.isProcessing = false;
      }
    }, 1000);
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    eventBus.on('data_ingested', (data: any) => {
      this.handleDataIngestion(data);
    });

    eventBus.on('schema_changed', (data: any) => {
      this.handleSchemaChange(data);
    });

    eventBus.on('cube_refresh_requested', (data: any) => {
      this.handleCubeRefresh(data);
    });
  }

  /**
   * Process queue items
   */
  private async processQueueItems(): Promise<void> {
    const batch = this.processingQueue.splice(0, 100);
    
    for (const item of batch) {
      try {
        await this.processItem(item);
      } catch (error) {
        console.error('Queue processing error:', error);
      }
    }
  }

  /**
   * Process individual item
   */
  private async processItem(item: any): Promise<void> {
    switch (item.type) {
      case 'data_ingestion':
        await this.processDataIngestion(item.data);
        break;
      case 'cube_refresh':
        await this.processCubeRefresh(item.data);
        break;
      case 'dimension_update':
        await this.processDimensionUpdate(item.data);
        break;
      case 'measure_calculation':
        await this.processMeasureCalculation(item.data);
        break;
      default:
        console.warn('Unknown item type:', item.type);
    }
  }

  /**
   * Handle data ingestion
   */
  private async handleDataIngestion(data: any): Promise<void> {
    this.processingQueue.push({
      type: 'data_ingestion',
      data,
      timestamp: new Date()
    });
  }

  /**
   * Handle schema change
   */
  private async handleSchemaChange(data: any): Promise<void> {
    this.processingQueue.push({
      type: 'schema_change',
      data,
      timestamp: new Date()
    });
  }

  /**
   * Handle cube refresh
   */
  private async handleCubeRefresh(data: any): Promise<void> {
    this.processingQueue.push({
      type: 'cube_refresh',
      data,
      timestamp: new Date()
    });
  }

  /**
   * Process data ingestion
   */
  private async processDataIngestion(data: any): Promise<void> {
    // Implementation would process data ingestion
  }

  /**
   * Process cube refresh
   */
  private async processCubeRefresh(data: any): Promise<void> {
    // Implementation would process cube refresh
  }

  /**
   * Process dimension update
   */
  private async processDimensionUpdate(data: any): Promise<void> {
    // Implementation would process dimension update
  }

  /**
   * Process measure calculation
   */
  private async processMeasureCalculation(data: any): Promise<void> {
    // Implementation would process measure calculation
  }

  /**
   * Create data warehouse
   */
  public async createDataWarehouse(
    warehouse: Omit<DataWarehouse, 'id' | 'createdAt' | 'lastUpdated'>
  ): Promise<DataWarehouse> {
    const newWarehouse: DataWarehouse = {
      ...warehouse,
      id: `warehouse_${Date.now()}`,
      createdAt: new Date(),
      lastUpdated: new Date()
    };

    this.warehouses.set(newWarehouse.id, newWarehouse);
    
    // Initialize warehouse components
    await this.initializeWarehouseComponents(newWarehouse);
    
    return newWarehouse;
  }

  /**
   * Initialize warehouse components
   */
  private async initializeWarehouseComponents(warehouse: DataWarehouse): Promise<void> {
    // Create dimensions
    for (const dimension of warehouse.dimensions) {
      await this.createDimension(dimension);
    }

    // Create measures
    for (const measure of warehouse.measures) {
      await this.createMeasure(measure);
    }

    // Create cubes
    for (const cube of warehouse.cubes) {
      await this.createDataCube(cube);
    }

    // Create hierarchies
    for (const hierarchy of warehouse.hierarchies) {
      await this.createHierarchy(hierarchy);
    }
  }

  /**
   * Create dimension
   */
  public async createDimension(dimension: Dimension): Promise<Dimension> {
    this.dimensions.set(dimension.id, dimension);
    
    // Build dimension table
    await this.buildDimensionTable(dimension);
    
    // Create indexes
    await this.createDimensionIndexes(dimension);
    
    return dimension;
  }

  /**
   * Build dimension table
   */
  private async buildDimensionTable(dimension: Dimension): Promise<void> {
    // Implementation would build dimension table
  }

  /**
   * Create dimension indexes
   */
  private async createDimensionIndexes(dimension: Dimension): Promise<void> {
    // Implementation would create dimension indexes
  }

  /**
   * Create measure
   */
  public async createMeasure(measure: Measure): Promise<Measure> {
    this.measures.set(measure.id, measure);
    
    // Validate measure dependencies
    await this.validateMeasureDependencies(measure);
    
    // Create measure calculations
    await this.createMeasureCalculations(measure);
    
    return measure;
  }

  /**
   * Validate measure dependencies
   */
  private async validateMeasureDependencies(measure: Measure): Promise<void> {
    // Implementation would validate measure dependencies
  }

  /**
   * Create measure calculations
   */
  private async createMeasureCalculations(measure: Measure): Promise<void> {
    // Implementation would create measure calculations
  }

  /**
   * Create data cube
   */
  public async createDataCube(cube: DataCube): Promise<DataCube> {
    this.cubes.set(cube.id, cube);
    
    // Build cube structure
    await this.buildCubeStructure(cube);
    
    // Create materialized views
    await this.createMaterializedViews(cube);
    
    // Build aggregations
    await this.buildAggregations(cube);
    
    return cube;
  }

  /**
   * Build cube structure
   */
  private async buildCubeStructure(cube: DataCube): Promise<void> {
    // Implementation would build cube structure
  }

  /**
   * Create materialized views
   */
  private async createMaterializedViews(cube: DataCube): Promise<void> {
    for (const view of cube.materializedViews || []) {
      await this.createMaterializedView(view);
    }
  }

  /**
   * Create materialized view
   */
  private async createMaterializedView(view: MaterializedView): Promise<void> {
    // Implementation would create materialized view
  }

  /**
   * Build aggregations
   */
  private async buildAggregations(cube: DataCube): Promise<void> {
    // Implementation would build aggregations
  }

  /**
   * Create hierarchy
   */
  public async createHierarchy(hierarchy: Hierarchy): Promise<Hierarchy> {
    this.hierarchies.set(hierarchy.id, hierarchy);
    
    // Build hierarchy structure
    await this.buildHierarchyStructure(hierarchy);
    
    // Create hierarchy indexes
    await this.createHierarchyIndexes(hierarchy);
    
    return hierarchy;
  }

  /**
   * Build hierarchy structure
   */
  private async buildHierarchyStructure(hierarchy: Hierarchy): Promise<void> {
    // Implementation would build hierarchy structure
  }

  /**
   * Create hierarchy indexes
   */
  private async createHierarchyIndexes(hierarchy: Hierarchy): Promise<void> {
    // Implementation would create hierarchy indexes
  }

  /**
   * Execute OLAP query
   */
  public async executeOLAPQuery(query: any): Promise<any> {
    // Parse query
    const parsedQuery = await this.parseOLAPQuery(query);
    
    // Optimize query
    const optimizedQuery = await this.optimizeQuery(parsedQuery);
    
    // Execute query
    const results = await this.executeQuery(optimizedQuery);
    
    // Format results
    const formattedResults = await this.formatResults(results);
    
    return formattedResults;
  }

  /**
   * Parse OLAP query
   */
  private async parseOLAPQuery(query: any): Promise<any> {
    // Implementation would parse OLAP query
    return query;
  }

  /**
   * Optimize query
   */
  private async optimizeQuery(query: any): Promise<any> {
    // Implementation would optimize query
    return query;
  }

  /**
   * Execute query
   */
  private async executeQuery(query: any): Promise<any> {
    // Implementation would execute query
    return {};
  }

  /**
   * Format results
   */
  private async formatResults(results: any): Promise<any> {
    // Implementation would format results
    return results;
  }

  /**
   * Perform drill down operation
   */
  public async drillDown(
    cubeId: string,
    dimension: string,
    level: string,
    member: string
  ): Promise<any> {
    const cube = this.cubes.get(cubeId);
    if (!cube) {
      throw new Error(`Cube ${cubeId} not found`);
    }

    // Implementation would perform drill down
    return {};
  }

  /**
   * Perform drill up operation
   */
  public async drillUp(
    cubeId: string,
    dimension: string,
    level: string
  ): Promise<any> {
    const cube = this.cubes.get(cubeId);
    if (!cube) {
      throw new Error(`Cube ${cubeId} not found`);
    }

    // Implementation would perform drill up
    return {};
  }

  /**
   * Perform slice operation
   */
  public async slice(
    cubeId: string,
    dimension: string,
    value: any
  ): Promise<any> {
    const cube = this.cubes.get(cubeId);
    if (!cube) {
      throw new Error(`Cube ${cubeId} not found`);
    }

    // Implementation would perform slice
    return {};
  }

  /**
   * Perform dice operation
   */
  public async dice(
    cubeId: string,
    filters: Record<string, any>
  ): Promise<any> {
    const cube = this.cubes.get(cubeId);
    if (!cube) {
      throw new Error(`Cube ${cubeId} not found`);
    }

    // Implementation would perform dice
    return {};
  }

  /**
   * Perform pivot operation
   */
  public async pivot(
    cubeId: string,
    rowDimensions: string[],
    columnDimensions: string[],
    measures: string[]
  ): Promise<any> {
    const cube = this.cubes.get(cubeId);
    if (!cube) {
      throw new Error(`Cube ${cubeId} not found`);
    }

    // Implementation would perform pivot
    return {};
  }

  /**
   * Get warehouse
   */
  public getWarehouse(id: string): DataWarehouse | undefined {
    return this.warehouses.get(id);
  }

  /**
   * Get all warehouses
   */
  public getWarehouses(): DataWarehouse[] {
    return Array.from(this.warehouses.values());
  }

  /**
   * Get cube
   */
  public getCube(id: string): DataCube | undefined {
    return this.cubes.get(id);
  }

  /**
   * Get all cubes
   */
  public getCubes(): DataCube[] {
    return Array.from(this.cubes.values());
  }

  /**
   * Get dimension
   */
  public getDimension(id: string): Dimension | undefined {
    return this.dimensions.get(id);
  }

  /**
   * Get all dimensions
   */
  public getDimensions(): Dimension[] {
    return Array.from(this.dimensions.values());
  }

  /**
   * Get measure
   */
  public getMeasure(id: string): Measure | undefined {
    return this.measures.get(id);
  }

  /**
   * Get all measures
   */
  public getMeasures(): Measure[] {
    return Array.from(this.measures.values());
  }

  /**
   * Get hierarchy
   */
  public getHierarchy(id: string): Hierarchy | undefined {
    return this.hierarchies.get(id);
  }

  /**
   * Get all hierarchies
   */
  public getHierarchies(): Hierarchy[] {
    return Array.from(this.hierarchies.values());
  }

  /**
   * Refresh cube
   */
  public async refreshCube(cubeId: string): Promise<void> {
    const cube = this.cubes.get(cubeId);
    if (!cube) {
      throw new Error(`Cube ${cubeId} not found`);
    }

    // Add to processing queue
    this.processingQueue.push({
      type: 'cube_refresh',
      data: { cubeId },
      timestamp: new Date()
    });
  }

  /**
   * Get warehouse statistics
   */
  public async getWarehouseStatistics(warehouseId: string): Promise<any> {
    const warehouse = this.warehouses.get(warehouseId);
    if (!warehouse) {
      throw new Error(`Warehouse ${warehouseId} not found`);
    }

    return {
      dimensions: warehouse.dimensions.length,
      measures: warehouse.measures.length,
      cubes: warehouse.cubes.length,
      hierarchies: warehouse.hierarchies.length,
      lastUpdated: warehouse.lastUpdated,
      dataSize: 0, // Implementation would calculate data size
      queryCount: 0, // Implementation would get query count
      averageQueryTime: 0 // Implementation would calculate average query time
    };
  }

  /**
   * Optimize warehouse
   */
  public async optimizeWarehouse(warehouseId: string): Promise<void> {
    const warehouse = this.warehouses.get(warehouseId);
    if (!warehouse) {
      throw new Error(`Warehouse ${warehouseId} not found`);
    }

    // Implementation would optimize warehouse
    // - Rebuild indexes
    // - Update statistics
    // - Optimize aggregations
    // - Partition management
    // - Cache optimization
  }

  /**
   * Monitor warehouse performance
   */
  public async monitorWarehousePerformance(warehouseId: string): Promise<any> {
    const warehouse = this.warehouses.get(warehouseId);
    if (!warehouse) {
      throw new Error(`Warehouse ${warehouseId} not found`);
    }

    return {
      queryPerformance: {
        averageResponseTime: 0,
        slowQueries: [],
        errorRate: 0,
        throughput: 0
      },
      storagePerformance: {
        diskUsage: 0,
        indexEfficiency: 0,
        compressionRatio: 0,
        fragmentationLevel: 0
      },
      systemPerformance: {
        cpuUsage: 0,
        memoryUsage: 0,
        ioThroughput: 0,
        networkLatency: 0
      }
    };
  }
}

export const dataWarehouse = new MultiDimensionalDataWarehouse();
