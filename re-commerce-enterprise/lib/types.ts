
export type Expense = {
  id: string
  amount: number
  category: string
  description: string
  date: Date
}

export type ExpenseFormData = Omit<Expense, 'id' | 'date'> & {
  date: string
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Other'
] as const

export type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

// DAG 3 Enterprise Types
export interface AIInsightRequest {
  type: 'predictive' | 'anomaly' | 'optimization' | 'recommendations'
  data: {
    revenue?: number
    users?: number
    efficiency?: number
    completion?: number
    [key: string]: any
  }
  prompt?: string
}

export interface AIInsightResponse {
  content: string
  type: string
  confidence: number
  timestamp: Date
}

export interface PerformanceMetrics {
  cpu: number
  memory: number
  network: number
  response: number
  timestamp: Date
}

export interface SecurityThreat {
  id: string
  type: 'login' | 'access' | 'data' | 'network'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  ip?: string
  timestamp: Date
  status: 'active' | 'resolved' | 'investigating'
}

export interface IntegrationConfig {
  id: string
  name: string
  type: 'api' | 'webhook' | 'oauth' | 'database'
  status: 'connected' | 'pending' | 'error' | 'disabled'
  settings: Record<string, any>
  lastSync?: Date
}

export interface APIKey {
  id: string
  name: string
  key: string
  permissions: string[]
  lastUsed?: Date
  expiresAt?: Date
  isActive: boolean
}

export interface WebhookConfig {
  id: string
  name: string
  url: string
  events: string[]
  active: boolean
  secret?: string
  retryCount: number
  lastDelivery?: Date
}

export interface ComplianceReport {
  standard: string
  score: number
  status: 'compliant' | 'partial' | 'non-compliant'
  lastAudit: Date
  nextAudit: Date
  requirements: {
    name: string
    status: 'met' | 'partial' | 'not-met'
    description: string
  }[]
}

export interface AnalyticsData {
  metric: string
  value: number
  timestamp: Date
  metadata?: Record<string, any>
  tenantId?: string
  userId?: string
}

export interface WorkflowExecution {
  id: string
  workflowId: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  startedAt: Date
  completedAt?: Date
  data?: Record<string, any>
  logs: string[]
  error?: string
}

// Analytics Platform Types
export interface APIAuthorization {
  enabled: boolean;
  type: 'bearer' | 'oauth' | 'apikey';
  configuration: Record<string, any>;
}

export interface APIRateLimiting {
  enabled: boolean;
  limits: Record<string, number>;
  windowMs: number;
}

export interface APICaching {
  enabled: boolean;
  ttl: number;
  strategy: 'memory' | 'redis';
}

export interface APIMonitoring {
  enabled: boolean;
  metrics: string[];
  alerting: boolean;
}

export interface APIDocumentation {
  enabled: boolean;
  format: 'swagger' | 'openapi';
  path: string;
}

export interface APIVersioning {
  enabled: boolean;
  strategy: 'header' | 'url' | 'query';
  current: string;
}

export interface APISecurity {
  enabled: boolean;
  cors: boolean;
  csrf: boolean;
  helmet: boolean;
}

export interface APIPerformance {
  enabled: boolean;
  compression: boolean;
  caching: boolean;
  monitoring: boolean;
}

export interface APIMetadata {
  title: string;
  description: string;
  version: string;
  contact: Record<string, string>;
}

export interface TransformationRule {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
}

export interface TransformationFunction {
  name: string;
  parameters: Record<string, any>;
  implementation: string;
}

export interface TransformationMapping {
  source: string;
  target: string;
  transformation: string;
}

export interface TransformationValidation {
  rules: string[];
  strict: boolean;
  onError: 'skip' | 'fail' | 'transform';
}

export interface CacheMonitoring {
  enabled: boolean;
  metrics: string[];
  alerting: boolean;
}

export interface SamplingRule {
  id: string;
  name: string;
  percentage: number;
  conditions: Record<string, any>;
}

export interface EscalationLevel {
  level: number;
  threshold: number;
  actions: string[];
}

export interface AuthorizationPolicy {
  id: string;
  name: string;
  rules: string[];
  effect: 'allow' | 'deny';
}

export interface AuthorizationPermission {
  resource: string;
  action: string;
  conditions: Record<string, any>;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  requirements: string[];
}

export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  mandatory: boolean;
}

export interface ComplianceControl {
  id: string;
  name: string;
  type: string;
  implementation: string;
}

export interface ComplianceAssessment {
  id: string;
  framework: string;
  status: string;
  results: Record<string, any>;
}

export interface ComplianceMonitoring {
  enabled: boolean;
  frameworks: string[];
  frequency: string;
}

export interface ComplianceReporting {
  enabled: boolean;
  formats: string[];
  recipients: string[];
}

export interface ComplianceCertification {
  id: string;
  name: string;
  authority: string;
  expiresAt: Date;
}

export interface PerformanceOptimization {
  enabled: boolean;
  strategies: string[];
  thresholds: Record<string, number>;
}

export interface AuthenticationFlow {
  id: string;
  name: string;
  steps: string[];
  configuration: Record<string, any>;
}

export interface AuthenticationRule {
  id: string;
  name: string;
  conditions: Record<string, any>;
  action: string;
}

export interface AuthenticationHook {
  id: string;
  name: string;
  event: string;
  handler: string;
}

export interface LocalizationResource {
  locale: string;
  namespace: string;
  key: string;
  value: string;
}

export interface ThemeSelection {
  id: string;
  name: string;
  preview: string;
  configuration: Record<string, any>;
}

export interface ThemeCustomization {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
  branding: Record<string, any>;
}

// Data warehouse types
export interface DataCube {
  id: string;
  name: string;
  description?: string;
  dimensions: string[];
  measures: string[];
  hierarchies?: any[];
  aggregations?: any[];
  materializedViews?: any[];
  storage?: any;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dimension {
  id: string;
  name: string;
  description?: string;
  type: string;
  hierarchy: string[];
  hierarchies?: any[];
  table?: string;
  keyColumn?: string;
  nameColumn?: string;
  attributes?: any[];
  levels?: any[];
  slowlyChanging?: boolean;
  metadata?: any;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Measure {
  id: string;
  name: string;
  description?: string;
  type: string;
  aggregation: string;
  column?: string;
  format?: string;
  formula?: string;
  dependencies?: string[];
  constraints?: any[];
  metadata?: any;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hierarchy {
  id: string;
  name: string;
  description?: string;
  dimension?: string;
  levels: string[];
  type?: string;
  defaultMember?: string;
  allMember?: string;
  aggregation?: string;
  navigation?: any;
  security?: any;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Reporting System Types
export interface ReportSecurity {
  enabled: boolean;
  encryption: boolean;
  accessControl: boolean;
}

export interface ReportScheduling {
  enabled: boolean;
  frequency: string;
  timezone: string;
}

export interface ReportDistribution {
  enabled: boolean;
  channels: string[];
  recipients: string[];
}

export interface ReportVersioning {
  enabled: boolean;
  strategy: 'timestamp' | 'incremental';
}

export interface ReportMetadata {
  title: string;
  description: string;
  author: string;
  tags: string[];
}

export interface AggregationFunction {
  name: string;
  parameters: Record<string, any>;
  implementation: string;
}

export interface WindowFunction {
  name: string;
  frame: string;
  orderBy: string[];
}

export interface ValidationRule {
  id: string;
  name: string;
  condition: string;
  message: string;
}

export interface ResponsiveBreakpoint {
  name: string;
  minWidth: number;
  maxWidth?: number;
}

export interface IndexStatistics {
  name: string;
  size: number;
  usage: number;
  lastUpdated: Date;
}

export interface IndexMetadata {
  name: string;
  type: string;
  columns: string[];
  unique: boolean;
}

export interface DataQuality {
  score: number;
  issues: string[];
  recommendations: string[];
}

export interface DataLineage {
  source: string;
  target: string;
  transformation: string;
  timestamp: Date;
}

export interface PolicyRule {
  id: string;
  name: string;
  condition: string;
  action: string;
}

export interface MaskingRule {
  id: string;
  column: string;
  type: string;
  pattern: string;
}

export interface NodeResources {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
}

export interface ScalingPolicy {
  minReplicas: number;
  maxReplicas: number;
  targetCPU: number;
  targetMemory: number;
}

export interface ScalingLimits {
  minReplicas: number;
  maxReplicas: number;
  maxCPU: number;
  maxMemory: number;
}

export interface HealthCheck {
  path: string;
  interval: number;
  timeout: number;
  retries: number;
}

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  severity: string;
}

export interface AlertEscalation {
  level: number;
  threshold: number;
  actions: string[];
}

export interface AlertSuppression {
  enabled: boolean;
  duration: number;
  conditions: string[];
}

export interface StylingResponsive {
  breakpoints: ResponsiveBreakpoint[];
  strategy: 'mobile_first' | 'desktop_first';
}

export interface StylingAccessibility {
  enabled: boolean;
  level: 'AA' | 'AAA';
  features: string[];
}

export interface StylingPrint {
  enabled: boolean;
  pageSize: string;
  margins: Record<string, string>;
}

export interface StylingInteractive {
  enabled: boolean;
  animations: boolean;
  transitions: boolean;
}

export interface StylingAnimation {
  enabled: boolean;
  duration: number;
  easing: string;
}

export interface StylingBranding {
  enabled: boolean;
  logo: string;
  colors: Record<string, string>;
}

export interface StylingCustomization {
  enabled: boolean;
  themes: string[];
  variables: Record<string, string>;
}

export interface EffectBlend {
  mode: string;
  opacity: number;
}

// ML Analytics Types
export interface TransformationStep {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
}

export interface FilteringRule {
  id: string;
  name: string;
  condition: string;
  action: string;
}

export interface StorageConfig {
  type: string;
  connection: Record<string, any>;
  settings: Record<string, any>;
}

export interface ResourceLimits {
  cpu: string;
  memory: string;
  storage: string;
}

export interface HealthCheckConfig {
  enabled: boolean;
  path: string;
  interval: number;
  timeout: number;
}

export interface IngressRule {
  host: string;
  path: string;
  service: string;
  port: number;
}

export interface ScalingMetric {
  name: string;
  target: number;
  type: string;
}

export interface MonitoringMetrics {
  enabled: boolean;
  metrics: string[];
  interval: number;
}

export interface MonitoringAlerting {
  enabled: boolean;
  rules: AlertRule[];
  channels: string[];
}

export interface MonitoringLogging {
  enabled: boolean;
  level: string;
  format: string;
}

export interface MonitoringTracing {
  enabled: boolean;
  sampler: string;
  endpoint: string;
}

export interface MonitoringProfiling {
  enabled: boolean;
  interval: number;
  duration: number;
}

export interface HealthMonitoring {
  enabled: boolean;
  checks: HealthCheck[];
  interval: number;
}

export interface PerformanceMonitoring {
  enabled: boolean;
  metrics: string[];
  thresholds: Record<string, number>;
}

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  config: Record<string, any>;
}

export interface DashboardLayout {
  id: string;
  name: string;
  widgets: DashboardWidget[];
  layout: Record<string, any>;
}

export interface GovernancePolicy {
  id: string;
  name: string;
  rules: PolicyRule[];
  enforcement: string;
}

export interface GovernanceReporting {
  enabled: boolean;
  frequency: string;
  recipients: string[];
}

export interface ApprovalWorkflow {
  id: string;
  name: string;
  steps: string[];
  approvers: string[];
}

export interface DataGovernance {
  enabled: boolean;
  policies: GovernancePolicy[];
  monitoring: boolean;
}

export interface AggregationConfig {
  functions: AggregationFunction[];
  groupBy: string[];
  having: string;
}

export interface PredictivePerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  mae: number;
  mse: number;
  r2Score: number;
  validationScore: number;
  testScore: number;
  lastEvaluated: Date;
}

export interface FilterRule {
  id: string;
  name: string;
  field: string;
  operator: string;
  value: any;
}



// Enhanced Performance Metrics
export interface EnhancedPerformanceMetrics {
  loadTime: number;
  renderTime: number;
  cacheHitRate: number;
  databaseQueryTime: number;
  networkLatency: number;
  memoryUsage: number;
  cpuUsage: number;
  timestamp: Date;
  operation?: string;
}

// Error handling
export interface ErrorDetails {
  message: string;
  code: string;
  stack?: string;
  context?: Record<string, any>;
}

// ===================================================================
// INTERACTIVE DEMO BUILDER TYPES - Revolutionary Enterprise Feature
// ===================================================================

// Demo Builder Core Types
export interface DemoProfile {
  id: string;
  name: string;
  description?: string;
  type: 'default' | 'custom' | 'template';
  industry: string;
  targetRole: string;
  painPoints: string[];
  focusAreas: string[];
  duration: number;
  interactive: boolean;
  autoPlay: boolean;
  personalization: Record<string, any>;
  slides: DemoSlide[];
  workflows: DemoWorkflowConfig[];
  isActive: boolean;
  isTemplate: boolean;
  popularity: number;
  lastUsed: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  tenantId: string;
}

export interface DemoSlide {
  id: string;
  title: string;
  description?: string;
  content: string;
  components: EnterpriseSystemComponent[];
  interactions: DemoInteraction[];
  duration?: number;
  transitionType?: 'fade' | 'slide' | 'zoom';
  background?: string;
  layout?: 'full' | 'split' | 'grid';
  aiPersonalization?: {
    prompts: string[];
    adaptations: Record<string, any>;
  };
}

export interface EnterpriseSystemComponent {
  id: string;
  name: string;
  title: string;
  description: string;
  category: 'ai' | 'security' | 'analytics' | 'integration' | 'management';
  type: 'dashboard' | 'workflow' | 'feature' | 'integration';
  icon: string;
  color: string;
  href?: string;
  demoContent: Record<string, any>;
  interactions: DemoInteraction[];
  aiPrompts: string[];
  usageCount: number;
  rating: number;
  isActive: boolean;
  isHighlighted: boolean;
  isPremium: boolean;
}

export interface DemoWorkflowConfig {
  id: string;
  name: string;
  description?: string;
  steps: DemoWorkflowStep[];
  connections: DemoWorkflowConnection[];
  variables: Record<string, any>;
  industry?: string;
  role?: string;
  adaptations: Record<string, any>;
  autoAdvance: boolean;
  timing: Record<string, number>;
  version: string;
}

export interface DemoWorkflowStep {
  id: string;
  name: string;
  title: string;
  description: string;
  type: 'component' | 'interaction' | 'ai_response' | 'data_input' | 'decision';
  componentId?: string;
  config: Record<string, any>;
  position: { x: number; y: number };
  inputs: DemoWorkflowInput[];
  outputs: DemoWorkflowOutput[];
  aiPersonalization?: {
    prompts: string[];
    conditions: Record<string, any>;
  };
}

export interface DemoWorkflowConnection {
  id: string;
  fromStep: string;
  toStep: string;
  condition?: string;
  label?: string;
}

export interface DemoWorkflowInput {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect';
  required: boolean;
  defaultValue?: any;
  options?: Array<{ label: string; value: any }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface DemoWorkflowOutput {
  id: string;
  name: string;
  type: 'data' | 'trigger' | 'redirect' | 'ai_response';
  value?: any;
  condition?: string;
}

// Demo Execution Types
export interface DemoExecution {
  id: string;
  profileId: string;
  executionId: string;
  sessionId: string;
  userId?: string;
  userRole?: string;
  userIndustry?: string;
  userPainPoints: string[];
  userFocusAreas: string[];
  startedAt: Date;
  completedAt?: Date;
  currentStep: number;
  totalSteps: number;
  interactions: DemoInteractionEvent[];
  feedbacks: DemoFeedback[];
  aiResponses: DemoAIResponse[];
  status: 'active' | 'completed' | 'abandoned' | 'paused';
  satisfaction?: number;
  completion: number;
  personalizations: Record<string, any>;
  duration?: number;
  bouncePoints: DemoBouncePoint[];
  engagementScore: number;
}

export interface DemoInteraction {
  id: string;
  name: string;
  type: 'button' | 'form' | 'data_input' | 'api_call' | 'simulation';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint?: string;
  payload: Record<string, any>;
  responseTemplate: Record<string, any>;
  triggerConditions: Record<string, any>;
  responseVariations: DemoResponseVariation[];
  aiPrompt?: string;
  personalize: boolean;
}

export interface DemoResponseVariation {
  condition: string;
  response: Record<string, any>;
  aiEnhancement?: boolean;
}

export interface DemoInteractionEvent {
  id: string;
  timestamp: Date;
  type: string;
  elementId: string;
  data: Record<string, any>;
  response?: Record<string, any>;
  duration: number;
}

export interface DemoFeedback {
  id: string;
  timestamp: Date;
  type: 'rating' | 'comment' | 'suggestion' | 'issue';
  rating?: number;
  comment?: string;
  elementId?: string;
  helpful: boolean;
}

export interface DemoAIResponse {
  id: string;
  timestamp: Date;
  prompt: string;
  response: string;
  confidence: number;
  personalizationApplied: Record<string, any>;
  processingTime: number;
}

export interface DemoBouncePoint {
  stepId: string;
  timestamp: Date;
  reason?: string;
  duration: number;
}

// User Personalization Types
export interface UserPersonalizationProfile {
  id: string;
  userId?: string;
  sessionId: string;
  industry?: string;
  role?: string;
  company?: string;
  companySize?: 'startup' | 'sme' | 'enterprise';
  experience?: 'beginner' | 'intermediate' | 'expert';
  painPoints: string[];
  focusAreas: string[];
  interests: string[];
  previousDemos: string[];
  preferences: Record<string, any>;
  learningStyle?: 'visual' | 'hands-on' | 'analytical';
  aiProfile: Record<string, any>;
  confidence: number;
}

// Demo Analytics Types
export interface DemoAnalytics {
  id: string;
  profileId: string;
  date: Date;
  period: 'daily' | 'weekly' | 'monthly';
  totalExecutions: number;
  completedExecutions: number;
  abandonedExecutions: number;
  averageDuration: number;
  averageCompletion: number;
  averageSatisfaction: number;
  engagementRate: number;
  conversionRate: number;
  popularSteps: DemoPopularStep[];
  dropOffPoints: DemoDropOffPoint[];
  commonFeedback: DemoCommonFeedback[];
  aiInsights: Record<string, any>;
  recommendations: DemoRecommendation[];
}

export interface DemoPopularStep {
  stepId: string;
  stepName: string;
  interactions: number;
  averageTimeSpent: number;
  satisfaction: number;
}

export interface DemoDropOffPoint {
  stepId: string;
  stepName: string;
  dropOffRate: number;
  commonReasons: string[];
}

export interface DemoCommonFeedback {
  type: string;
  content: string;
  frequency: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface DemoRecommendation {
  type: 'content' | 'flow' | 'personalization' | 'performance';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  aiGenerated: boolean;
}

// Demo Builder UI Types
export interface DemoBuilderState {
  currentProfile?: DemoProfile;
  isEditing: boolean;
  draggedComponent?: EnterpriseSystemComponent;
  selectedWorkflowStep?: DemoWorkflowStep;
  previewMode: boolean;
  presentationMode: boolean;
  isPlaying: boolean;
  currentSlide: number;
  userPersonalization?: UserPersonalizationProfile;
}

export interface DemoBuilderAction {
  type: 'SET_PROFILE' | 'UPDATE_SLIDE' | 'ADD_COMPONENT' | 'REMOVE_COMPONENT' | 
        'START_PREVIEW' | 'STOP_PREVIEW' | 'START_PRESENTATION' | 'STOP_PRESENTATION' |
        'NEXT_SLIDE' | 'PREVIOUS_SLIDE' | 'SET_PERSONALIZATION' | 'UPDATE_WORKFLOW';
  payload?: any;
}

// Slideshow Remote Control Types
export interface SlideshowRemoteControl {
  isActive: boolean;
  currentSlide: number;
  totalSlides: number;
  isPlaying: boolean;
  autoAdvance: boolean;
  timing: Record<string, number>;
  controls: {
    play: () => void;
    pause: () => void;
    next: () => void;
    previous: () => void;
    goToSlide: (index: number) => void;
    setAutoAdvance: (enabled: boolean) => void;
  };
}

// AI Personalization Engine Types
export interface AIPersonalizationRequest {
  userProfile: UserPersonalizationProfile;
  demoProfile: DemoProfile;
  currentStep?: string;
  context?: Record<string, any>;
}

export interface AIPersonalizationResponse {
  personalizedContent: Record<string, any>;
  adaptations: Record<string, any>;
  confidence: number;
  reasoning: string;
  suggestions: string[];
}
