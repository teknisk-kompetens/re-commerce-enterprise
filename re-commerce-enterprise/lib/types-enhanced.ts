
export * from './types';

// Enhanced Enterprise Widget Factory Types

export interface TenantConfig {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  plan: 'basic' | 'pro' | 'enterprise';
  maxUsers: number;
  isActive: boolean;
  settings?: TenantSettings;
  branding?: TenantBranding;
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantSettings {
  features: {
    widgets: boolean;
    ai_analytics: boolean;
    security_center: boolean;
    performance_monitoring: boolean;
    custom_integrations: boolean;
  };
  limits: {
    api_requests_per_hour: number;
    storage_gb: number;
    users: number;
    widgets: number;
  };
  security: {
    mfa_required: boolean;
    session_timeout: number;
    password_policy: {
      min_length: number;
      require_special_chars: boolean;
      require_numbers: boolean;
      require_uppercase: boolean;
    };
  };
  notifications: {
    email_enabled: boolean;
    slack_webhook?: string;
    discord_webhook?: string;
  };
}

export interface TenantBranding {
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  custom_css?: string;
}

export interface WidgetDefinition {
  id: string;
  name: string;
  type: WidgetType;
  version: string;
  description: string;
  author: string;
  category: WidgetCategory;
  tags: string[];
  permissions: WidgetPermission[];
  dependencies: string[];
  config_schema: WidgetConfigSchema;
  ui_schema?: WidgetUISchema;
  api_endpoints: WidgetAPIEndpoint[];
  events: WidgetEventDefinition[];
  documentation_url?: string;
  repository_url?: string;
  license: string;
  min_platform_version: string;
  max_platform_version?: string;
  is_system_widget: boolean;
  is_tenant_specific: boolean;
  created_at: Date;
  updated_at: Date;
}

export type WidgetType = 
  | 'dashboard'
  | 'analytics'
  | 'form'
  | 'chart'
  | 'table'
  | 'map'
  | 'calendar'
  | 'notification'
  | 'integration'
  | 'ai'
  | 'security'
  | 'performance'
  | 'custom';

export type WidgetCategory = 
  | 'data_visualization'
  | 'analytics'
  | 'productivity'
  | 'communication'
  | 'integration'
  | 'security'
  | 'ai_ml'
  | 'reporting'
  | 'monitoring'
  | 'other';

export type WidgetPermission = 
  | 'read'
  | 'write'
  | 'delete'
  | 'admin'
  | 'communicate'
  | 'data_access'
  | 'api_access'
  | 'export'
  | 'import'
  | 'configure';

export interface WidgetConfigSchema {
  type: 'object';
  properties: Record<string, WidgetConfigProperty>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface WidgetConfigProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  title?: string;
  description?: string;
  default?: any;
  enum?: any[];
  format?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  items?: WidgetConfigProperty;
  properties?: Record<string, WidgetConfigProperty>;
}

export interface WidgetUISchema {
  [key: string]: {
    'ui:widget'?: string;
    'ui:options'?: Record<string, any>;
    'ui:order'?: string[];
    'ui:title'?: string;
    'ui:description'?: string;
    'ui:help'?: string;
    'ui:placeholder'?: string;
    'ui:disabled'?: boolean;
    'ui:readonly'?: boolean;
    'ui:hidden'?: boolean;
  };
}

export interface WidgetAPIEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  permissions: WidgetPermission[];
  parameters?: WidgetAPIParameter[];
  request_body?: WidgetAPIRequestBody;
  responses: Record<string, WidgetAPIResponse>;
  rate_limit?: {
    requests: number;
    window: number;
  };
}

export interface WidgetAPIParameter {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie';
  required: boolean;
  type: 'string' | 'number' | 'boolean' | 'array';
  description: string;
  default?: any;
  enum?: any[];
  format?: string;
}

export interface WidgetAPIRequestBody {
  content_type: string;
  schema: WidgetConfigSchema;
  required: boolean;
  description: string;
}

export interface WidgetAPIResponse {
  description: string;
  content_type: string;
  schema: WidgetConfigSchema;
  examples?: Record<string, any>;
}

export interface WidgetEventDefinition {
  name: string;
  description: string;
  payload_schema: WidgetConfigSchema;
  is_system_event: boolean;
  can_subscribe: boolean;
  can_publish: boolean;
}

export interface WidgetInstance {
  id: string;
  widget_id: string;
  tenant_id: string;
  user_id: string;
  name: string;
  config: Record<string, any>;
  position: WidgetPosition;
  size: WidgetSize;
  is_visible: boolean;
  is_enabled: boolean;
  permissions: WidgetPermission[];
  metadata: Record<string, any>;
  created_at: Date;
  updated_at: Date;
  last_used_at?: Date;
}

export interface WidgetPosition {
  x: number;
  y: number;
  z?: number;
}

export interface WidgetSize {
  width: number;
  height: number;
  min_width?: number;
  min_height?: number;
  max_width?: number;
  max_height?: number;
  is_resizable: boolean;
}

export interface WidgetMessage {
  id: string;
  from_widget_id: string;
  to_widget_id: string;
  message_type: string;
  payload: Record<string, any>;
  correlation_id?: string;
  reply_to?: string;
  timestamp: Date;
  tenant_id: string;
  user_id?: string;
  ttl?: number;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: Record<string, any>;
}

export interface WidgetEvent {
  id: string;
  event_type: string;
  source_widget_id: string;
  target_widget_id?: string;
  payload: Record<string, any>;
  timestamp: Date;
  tenant_id: string;
  user_id?: string;
  correlation_id?: string;
  metadata?: Record<string, any>;
}

export interface APIGatewayRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  query_params: Record<string, string>;
  path_params: Record<string, string>;
  body?: any;
  tenant_id?: string;
  user_id?: string;
  widget_id?: string;
  permissions: string[];
  rate_limit_key: string;
}

export interface APIGatewayResponse {
  status: number;
  headers: Record<string, string>;
  body: any;
  metadata: {
    request_id: string;
    processing_time_ms: number;
    rate_limit_remaining: number;
    rate_limit_reset: Date;
  };
}

export interface EventBusSubscription {
  id: string;
  subscriber_id: string;
  event_types: string[];
  filter?: EventFilter;
  webhook_url?: string;
  is_active: boolean;
  created_at: Date;
  last_triggered_at?: Date;
  total_events_received: number;
}

export interface EventFilter {
  tenant_id?: string;
  source_widget_id?: string;
  target_widget_id?: string;
  user_id?: string;
  payload_conditions?: Record<string, any>;
}

export interface WidgetCommunicationProtocol {
  version: string;
  supported_message_types: string[];
  supported_event_types: string[];
  authentication_methods: string[];
  encryption_enabled: boolean;
  compression_enabled: boolean;
  max_message_size: number;
  max_events_per_second: number;
  heartbeat_interval_ms: number;
  connection_timeout_ms: number;
}

export interface WidgetSecurityPolicy {
  tenant_id: string;
  widget_type: WidgetType;
  allowed_origins: string[];
  allowed_permissions: WidgetPermission[];
  rate_limits: Record<string, { requests: number; window: number }>;
  data_retention_days: number;
  encryption_required: boolean;
  audit_level: 'none' | 'basic' | 'detailed' | 'full';
  sandbox_enabled: boolean;
  network_restrictions: {
    allowed_domains: string[];
    blocked_domains: string[];
    allow_external_requests: boolean;
  };
}

export interface WidgetAnalytics {
  widget_id: string;
  tenant_id: string;
  time_period: {
    start: Date;
    end: Date;
  };
  usage_stats: {
    total_loads: number;
    unique_users: number;
    average_session_duration_ms: number;
    total_interactions: number;
    error_count: number;
    performance_metrics: {
      avg_load_time_ms: number;
      avg_response_time_ms: number;
      memory_usage_mb: number;
      cpu_usage_percent: number;
    };
  };
  communication_stats: {
    messages_sent: number;
    messages_received: number;
    events_published: number;
    events_subscribed: number;
    failed_communications: number;
  };
  security_events: {
    authentication_failures: number;
    permission_violations: number;
    rate_limit_violations: number;
    suspicious_activity_count: number;
  };
}

// Production Configuration Types
export interface ProductionConfig {
  environment: 'development' | 'staging' | 'production';
  debug_mode: boolean;
  logging: {
    level: 'error' | 'warn' | 'info' | 'debug';
    structured_logging: boolean;
    log_retention_days: number;
    sensitive_data_masking: boolean;
  };
  security: {
    csrf_protection: boolean;
    cors_enabled: boolean;
    allowed_origins: string[];
    api_key_required: boolean;
    jwt_secret: string;
    encryption_key: string;
    session_timeout_minutes: number;
  };
  performance: {
    enable_caching: boolean;
    cache_ttl_seconds: number;
    max_concurrent_requests: number;
    request_timeout_seconds: number;
    compression_enabled: boolean;
  };
  monitoring: {
    health_check_enabled: boolean;
    metrics_collection: boolean;
    error_tracking: boolean;
    performance_monitoring: boolean;
    uptime_monitoring: boolean;
  };
  database: {
    connection_pool_size: number;
    query_timeout_seconds: number;
    connection_retry_attempts: number;
    backup_enabled: boolean;
    backup_frequency_hours: number;
  };
}

// Error Types
export class WidgetError extends Error {
  constructor(
    message: string,
    public code: string,
    public widget_id?: string,
    public tenant_id?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'WidgetError';
  }
}

export class TenantError extends Error {
  constructor(
    message: string,
    public code: string,
    public tenant_id?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'TenantError';
  }
}

export class APIGatewayError extends Error {
  constructor(
    message: string,
    public code: string,
    public status_code: number,
    public request_id?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'APIGatewayError';
  }
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Runtime validation helpers
export function isWidgetMessage(obj: any): obj is WidgetMessage {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.from_widget_id === 'string' &&
    typeof obj.to_widget_id === 'string' &&
    typeof obj.message_type === 'string' &&
    typeof obj.payload === 'object' &&
    obj.timestamp instanceof Date &&
    typeof obj.tenant_id === 'string'
  );
}

export function isWidgetEvent(obj: any): obj is WidgetEvent {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.event_type === 'string' &&
    typeof obj.source_widget_id === 'string' &&
    typeof obj.payload === 'object' &&
    obj.timestamp instanceof Date &&
    typeof obj.tenant_id === 'string'
  );
}

export function isTenantConfig(obj: any): obj is TenantConfig {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.domain === 'string' &&
    typeof obj.subdomain === 'string' &&
    ['basic', 'pro', 'enterprise'].includes(obj.plan) &&
    typeof obj.maxUsers === 'number' &&
    typeof obj.isActive === 'boolean'
  );
}
