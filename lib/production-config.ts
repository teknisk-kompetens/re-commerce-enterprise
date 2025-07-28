
/**
 * BEHEMOTH PRODUCTION CONFIGURATION
 * Enterprise-grade configuration management for production deployments
 * with environment-specific settings, feature flags, and runtime configuration
 */

export interface ProductionEnvironmentConfig {
  // Environment Information
  environment: 'development' | 'staging' | 'production';
  version: string;
  buildId: string;
  deploymentId: string;
  region: string;
  availabilityZone: string;

  // Application Configuration
  application: {
    name: string;
    port: number;
    host: string;
    publicUrl: string;
    basePath: string;
    timezone: string;
    locale: string;
  };

  // Database Configuration
  database: {
    url: string;
    poolSize: number;
    connectionTimeout: number;
    queryTimeout: number;
    idleTimeout: number;
    maxLifetime: number;
    sslMode: 'disable' | 'require' | 'verify-full';
    readReplicas: string[];
    enableQueryLogging: boolean;
    enableSlowQueryLogging: boolean;
    slowQueryThreshold: number;
  };

  // Redis Configuration
  redis: {
    enabled: boolean;
    url: string;
    cluster: boolean;
    maxRetries: number;
    retryDelayOnFailover: number;
    enableOfflineQueue: boolean;
    maxRetriesPerRequest: number;
    keyPrefix: string;
  };

  // Security Configuration
  security: {
    jwtSecret: string;
    encryptionKey: string;
    hashSaltRounds: number;
    sessionTimeout: number;
    csrfProtection: boolean;
    corsOrigins: string[];
    contentSecurityPolicy: string;
    rateLimiting: {
      windowMs: number;
      maxRequests: number;
      skipSuccessfulRequests: boolean;
      skipFailedRequests: boolean;
    };
    ipWhitelist: string[];
    ipBlacklist: string[];
  };

  // API Configuration
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
    retryDelay: number;
    enableCompression: boolean;
    maxRequestSize: number;
    enableApiKeyAuth: boolean;
    enableJwtAuth: boolean;
    enableOAuth: boolean;
    webhookSecret: string;
  };

  // Caching Configuration
  caching: {
    enabled: boolean;
    provider: 'memory' | 'redis' | 'memcached';
    defaultTtl: number;
    maxSize: number;
    enableEtags: boolean;
    enableGzip: boolean;
    enableBrotli: boolean;
    cdnEnabled: boolean;
    cdnUrl?: string;
    cacheHeaders: {
      maxAge: number;
      sMaxAge: number;
      mustRevalidate: boolean;
    };
  };

  // Logging Configuration
  logging: {
    level: 'error' | 'warn' | 'info' | 'debug' | 'trace';
    format: 'json' | 'text';
    enableConsole: boolean;
    enableFile: boolean;
    enableRemote: boolean;
    fileConfig?: {
      filename: string;
      maxSize: string;
      maxFiles: number;
      rotate: boolean;
    };
    remoteConfig?: {
      endpoint: string;
      apiKey: string;
      index: string;
    };
    sensitiveFields: string[];
    enableRequestLogging: boolean;
    enableErrorTracking: boolean;
  };

  // Monitoring Configuration
  monitoring: {
    enabled: boolean;
    provider: 'prometheus' | 'datadog' | 'newrelic' | 'custom';
    endpoint: string;
    apiKey?: string;
    interval: number;
    enableHealthChecks: boolean;
    enablePerformanceMonitoring: boolean;
    enableErrorTracking: boolean;
    enableBusinessMetrics: boolean;
    customMetrics: CustomMetric[];
    alerts: AlertConfig[];
  };

  // Email Configuration
  email: {
    enabled: boolean;
    provider: 'sendgrid' | 'ses' | 'smtp' | 'postmark';
    config: {
      apiKey?: string;
      region?: string;
      host?: string;
      port?: number;
      secure?: boolean;
      auth?: {
        user: string;
        pass: string;
      };
    };
    templates: {
      welcome: string;
      passwordReset: string;
      notification: string;
    };
    defaultFrom: string;
    replyTo: string;
  };

  // Storage Configuration
  storage: {
    provider: 'local' | 's3' | 'gcs' | 'azure';
    config: {
      bucket?: string;
      region?: string;
      accessKey?: string;
      secretKey?: string;
      endpoint?: string;
    };
    enableCdn: boolean;
    cdnUrl?: string;
    maxFileSize: number;
    allowedFileTypes: string[];
    enableImageOptimization: boolean;
    imageOptimization: {
      quality: number;
      formats: string[];
      sizes: number[];
    };
  };

  // Feature Flags
  features: {
    enableMaintenanceMode: boolean;
    enableSignups: boolean;
    enablePasswordReset: boolean;
    enableEmailVerification: boolean;
    enableTwoFactorAuth: boolean;
    enableApiRateLimiting: boolean;
    enableAdvancedAnalytics: boolean;
    enableRealTimeFeatures: boolean;
    enableWebhooks: boolean;
    enableFileUploads: boolean;
    enableIntegrations: boolean;
    enableAiFeatures: boolean;
    maxTeamSize: number;
    maxProjects: number;
    maxStoragePerUser: number;
  };

  // Performance Configuration
  performance: {
    enableMinification: boolean;
    enableTreeShaking: boolean;
    enableCodeSplitting: boolean;
    enableLazyLoading: boolean;
    enableServiceWorker: boolean;
    enableHttp2: boolean;
    enablePreloading: boolean;
    maxConcurrentRequests: number;
    requestTimeout: number;
    keepAliveTimeout: number;
    compressionLevel: number;
  };

  // Third-party Integrations
  integrations: {
    stripe?: {
      publishableKey: string;
      secretKey: string;
      webhookSecret: string;
      enableTestMode: boolean;
    };
    slack?: {
      clientId: string;
      clientSecret: string;
      signingSecret: string;
      botToken: string;
    };
    google?: {
      clientId: string;
      clientSecret: string;
      apiKey: string;
      serviceAccountKey: string;
    };
    github?: {
      clientId: string;
      clientSecret: string;
      webhookSecret: string;
    };
    analytics?: {
      googleAnalyticsId: string;
      mixpanelToken: string;
      segmentWriteKey: string;
    };
  };
}

export interface CustomMetric {
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
  description: string;
  labels: string[];
  enabled: boolean;
}

export interface AlertConfig {
  name: string;
  description: string;
  metric: string;
  condition: string;
  threshold: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  channels: string[];
}

export class ProductionConfig {
  private static config: ProductionEnvironmentConfig | null = null;
  private static configOverrides: Partial<ProductionEnvironmentConfig> = {};

  /**
   * Load configuration from environment variables and config files
   */
  static load(): ProductionEnvironmentConfig {
    if (this.config) {
      return this.config;
    }

    const environment = (process.env.NODE_ENV || 'development') as ProductionEnvironmentConfig['environment'];
    
    this.config = {
      // Environment Information
      environment,
      version: process.env.APP_VERSION || '1.0.0',
      buildId: process.env.BUILD_ID || 'dev-build',
      deploymentId: process.env.DEPLOYMENT_ID || crypto.randomUUID(),
      region: process.env.REGION || 'us-east-1',
      availabilityZone: process.env.AZ || 'us-east-1a',

      // Application Configuration
      application: {
        name: process.env.APP_NAME || 'Behemoth Enterprise Platform',
        port: parseInt(process.env.PORT || '3000'),
        host: process.env.HOST || '0.0.0.0',
        publicUrl: process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || '3000'}`,
        basePath: process.env.BASE_PATH || '/',
        timezone: process.env.TIMEZONE || 'UTC',
        locale: process.env.LOCALE || 'en-US',
      },

      // Database Configuration
      database: {
        url: process.env.DATABASE_URL || 'postgresql://localhost:5432/behemoth',
        poolSize: parseInt(process.env.DB_POOL_SIZE || '20'),
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000'),
        queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT || '30000'),
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '300000'),
        maxLifetime: parseInt(process.env.DB_MAX_LIFETIME || '3600000'),
        sslMode: (process.env.DB_SSL_MODE || 'disable') as any,
        readReplicas: process.env.DB_READ_REPLICAS?.split(',') || [],
        enableQueryLogging: process.env.DB_ENABLE_QUERY_LOGGING === 'true',
        enableSlowQueryLogging: process.env.DB_ENABLE_SLOW_QUERY_LOGGING === 'true',
        slowQueryThreshold: parseInt(process.env.DB_SLOW_QUERY_THRESHOLD || '1000'),
      },

      // Redis Configuration
      redis: {
        enabled: process.env.REDIS_ENABLED === 'true',
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        cluster: process.env.REDIS_CLUSTER === 'true',
        maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || '3'),
        retryDelayOnFailover: parseInt(process.env.REDIS_RETRY_DELAY || '100'),
        enableOfflineQueue: process.env.REDIS_ENABLE_OFFLINE_QUEUE !== 'false',
        maxRetriesPerRequest: parseInt(process.env.REDIS_MAX_RETRIES_PER_REQUEST || '3'),
        keyPrefix: process.env.REDIS_KEY_PREFIX || 'behemoth:',
      },

      // Security Configuration
      security: {
        jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret-change-in-production',
        encryptionKey: process.env.ENCRYPTION_KEY || 'default-encryption-key-change-in-production',
        hashSaltRounds: parseInt(process.env.HASH_SALT_ROUNDS || '12'),
        sessionTimeout: parseInt(process.env.SESSION_TIMEOUT || '3600'),
        csrfProtection: process.env.CSRF_PROTECTION !== 'false',
        corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
        contentSecurityPolicy: process.env.CSP || "default-src 'self'",
        rateLimiting: {
          windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
          maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100'),
          skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESS === 'true',
          skipFailedRequests: process.env.RATE_LIMIT_SKIP_FAILED === 'true',
        },
        ipWhitelist: process.env.IP_WHITELIST?.split(',') || [],
        ipBlacklist: process.env.IP_BLACKLIST?.split(',') || [],
      },

      // API Configuration
      api: {
        baseUrl: process.env.API_BASE_URL || '/api',
        timeout: parseInt(process.env.API_TIMEOUT || '30000'),
        retries: parseInt(process.env.API_RETRIES || '3'),
        retryDelay: parseInt(process.env.API_RETRY_DELAY || '1000'),
        enableCompression: process.env.API_ENABLE_COMPRESSION !== 'false',
        maxRequestSize: parseInt(process.env.API_MAX_REQUEST_SIZE || '10485760'), // 10MB
        enableApiKeyAuth: process.env.API_ENABLE_API_KEY_AUTH === 'true',
        enableJwtAuth: process.env.API_ENABLE_JWT_AUTH !== 'false',
        enableOAuth: process.env.API_ENABLE_OAUTH === 'true',
        webhookSecret: process.env.WEBHOOK_SECRET || 'default-webhook-secret',
      },

      // Caching Configuration
      caching: {
        enabled: process.env.CACHING_ENABLED !== 'false',
        provider: (process.env.CACHE_PROVIDER || 'memory') as any,
        defaultTtl: parseInt(process.env.CACHE_DEFAULT_TTL || '3600'),
        maxSize: parseInt(process.env.CACHE_MAX_SIZE || '100'),
        enableEtags: process.env.CACHE_ENABLE_ETAGS !== 'false',
        enableGzip: process.env.CACHE_ENABLE_GZIP !== 'false',
        enableBrotli: process.env.CACHE_ENABLE_BROTLI === 'true',
        cdnEnabled: process.env.CDN_ENABLED === 'true',
        cdnUrl: process.env.CDN_URL,
        cacheHeaders: {
          maxAge: parseInt(process.env.CACHE_MAX_AGE || '3600'),
          sMaxAge: parseInt(process.env.CACHE_S_MAX_AGE || '86400'),
          mustRevalidate: process.env.CACHE_MUST_REVALIDATE === 'true',
        },
      },

      // Logging Configuration
      logging: {
        level: (process.env.LOG_LEVEL || 'info') as any,
        format: (process.env.LOG_FORMAT || 'json') as any,
        enableConsole: process.env.LOG_ENABLE_CONSOLE !== 'false',
        enableFile: process.env.LOG_ENABLE_FILE === 'true',
        enableRemote: process.env.LOG_ENABLE_REMOTE === 'true',
        fileConfig: process.env.LOG_ENABLE_FILE === 'true' ? {
          filename: process.env.LOG_FILENAME || 'behemoth.log',
          maxSize: process.env.LOG_MAX_SIZE || '100m',
          maxFiles: parseInt(process.env.LOG_MAX_FILES || '5'),
          rotate: process.env.LOG_ROTATE !== 'false',
        } : undefined,
        remoteConfig: process.env.LOG_ENABLE_REMOTE === 'true' ? {
          endpoint: process.env.LOG_REMOTE_ENDPOINT || '',
          apiKey: process.env.LOG_REMOTE_API_KEY || '',
          index: process.env.LOG_REMOTE_INDEX || 'behemoth-logs',
        } : undefined,
        sensitiveFields: process.env.LOG_SENSITIVE_FIELDS?.split(',') || ['password', 'token', 'secret', 'key'],
        enableRequestLogging: process.env.LOG_ENABLE_REQUEST_LOGGING !== 'false',
        enableErrorTracking: process.env.LOG_ENABLE_ERROR_TRACKING !== 'false',
      },

      // Monitoring Configuration
      monitoring: {
        enabled: process.env.MONITORING_ENABLED !== 'false',
        provider: (process.env.MONITORING_PROVIDER || 'prometheus') as any,
        endpoint: process.env.MONITORING_ENDPOINT || '/metrics',
        apiKey: process.env.MONITORING_API_KEY,
        interval: parseInt(process.env.MONITORING_INTERVAL || '60000'),
        enableHealthChecks: process.env.MONITORING_ENABLE_HEALTH_CHECKS !== 'false',
        enablePerformanceMonitoring: process.env.MONITORING_ENABLE_PERFORMANCE !== 'false',
        enableErrorTracking: process.env.MONITORING_ENABLE_ERROR_TRACKING !== 'false',
        enableBusinessMetrics: process.env.MONITORING_ENABLE_BUSINESS_METRICS === 'true',
        customMetrics: this.parseCustomMetrics(process.env.MONITORING_CUSTOM_METRICS),
        alerts: this.parseAlertConfig(process.env.MONITORING_ALERTS),
      },

      // Email Configuration
      email: {
        enabled: process.env.EMAIL_ENABLED === 'true',
        provider: (process.env.EMAIL_PROVIDER || 'smtp') as any,
        config: {
          apiKey: process.env.EMAIL_API_KEY,
          region: process.env.EMAIL_REGION,
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : undefined,
          secure: process.env.EMAIL_SECURE === 'true',
          auth: process.env.EMAIL_USER && process.env.EMAIL_PASS ? {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          } : undefined,
        },
        templates: {
          welcome: process.env.EMAIL_TEMPLATE_WELCOME || 'welcome',
          passwordReset: process.env.EMAIL_TEMPLATE_PASSWORD_RESET || 'password-reset',
          notification: process.env.EMAIL_TEMPLATE_NOTIFICATION || 'notification',
        },
        defaultFrom: process.env.EMAIL_FROM || 'noreply@behemoth.ai',
        replyTo: process.env.EMAIL_REPLY_TO || 'support@behemoth.ai',
      },

      // Storage Configuration
      storage: {
        provider: (process.env.STORAGE_PROVIDER || 'local') as any,
        config: {
          bucket: process.env.STORAGE_BUCKET,
          region: process.env.STORAGE_REGION,
          accessKey: process.env.STORAGE_ACCESS_KEY,
          secretKey: process.env.STORAGE_SECRET_KEY,
          endpoint: process.env.STORAGE_ENDPOINT,
        },
        enableCdn: process.env.STORAGE_ENABLE_CDN === 'true',
        cdnUrl: process.env.STORAGE_CDN_URL,
        maxFileSize: parseInt(process.env.STORAGE_MAX_FILE_SIZE || '10485760'), // 10MB
        allowedFileTypes: process.env.STORAGE_ALLOWED_TYPES?.split(',') || ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
        enableImageOptimization: process.env.STORAGE_ENABLE_IMAGE_OPTIMIZATION === 'true',
        imageOptimization: {
          quality: parseInt(process.env.STORAGE_IMAGE_QUALITY || '80'),
          formats: process.env.STORAGE_IMAGE_FORMATS?.split(',') || ['webp', 'jpeg'],
          sizes: process.env.STORAGE_IMAGE_SIZES?.split(',').map(s => parseInt(s)) || [150, 300, 600, 1200],
        },
      },

      // Feature Flags
      features: {
        enableMaintenanceMode: process.env.FEATURE_MAINTENANCE_MODE === 'true',
        enableSignups: process.env.FEATURE_ENABLE_SIGNUPS !== 'false',
        enablePasswordReset: process.env.FEATURE_ENABLE_PASSWORD_RESET !== 'false',
        enableEmailVerification: process.env.FEATURE_ENABLE_EMAIL_VERIFICATION === 'true',
        enableTwoFactorAuth: process.env.FEATURE_ENABLE_2FA === 'true',
        enableApiRateLimiting: process.env.FEATURE_ENABLE_API_RATE_LIMITING !== 'false',
        enableAdvancedAnalytics: process.env.FEATURE_ENABLE_ADVANCED_ANALYTICS === 'true',
        enableRealTimeFeatures: process.env.FEATURE_ENABLE_REALTIME !== 'false',
        enableWebhooks: process.env.FEATURE_ENABLE_WEBHOOKS === 'true',
        enableFileUploads: process.env.FEATURE_ENABLE_FILE_UPLOADS === 'true',
        enableIntegrations: process.env.FEATURE_ENABLE_INTEGRATIONS === 'true',
        enableAiFeatures: process.env.FEATURE_ENABLE_AI === 'true',
        maxTeamSize: parseInt(process.env.FEATURE_MAX_TEAM_SIZE || '100'),
        maxProjects: parseInt(process.env.FEATURE_MAX_PROJECTS || '1000'),
        maxStoragePerUser: parseInt(process.env.FEATURE_MAX_STORAGE_PER_USER || '1073741824'), // 1GB
      },

      // Performance Configuration
      performance: {
        enableMinification: process.env.PERF_ENABLE_MINIFICATION !== 'false',
        enableTreeShaking: process.env.PERF_ENABLE_TREE_SHAKING !== 'false',
        enableCodeSplitting: process.env.PERF_ENABLE_CODE_SPLITTING !== 'false',
        enableLazyLoading: process.env.PERF_ENABLE_LAZY_LOADING !== 'false',
        enableServiceWorker: process.env.PERF_ENABLE_SERVICE_WORKER === 'true',
        enableHttp2: process.env.PERF_ENABLE_HTTP2 === 'true',
        enablePreloading: process.env.PERF_ENABLE_PRELOADING !== 'false',
        maxConcurrentRequests: parseInt(process.env.PERF_MAX_CONCURRENT_REQUESTS || '100'),
        requestTimeout: parseInt(process.env.PERF_REQUEST_TIMEOUT || '30000'),
        keepAliveTimeout: parseInt(process.env.PERF_KEEP_ALIVE_TIMEOUT || '65000'),
        compressionLevel: parseInt(process.env.PERF_COMPRESSION_LEVEL || '6'),
      },

      // Third-party Integrations
      integrations: {
        stripe: process.env.STRIPE_PUBLISHABLE_KEY ? {
          publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
          secretKey: process.env.STRIPE_SECRET_KEY || '',
          webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
          enableTestMode: process.env.STRIPE_TEST_MODE === 'true',
        } : undefined,
        slack: process.env.SLACK_CLIENT_ID ? {
          clientId: process.env.SLACK_CLIENT_ID,
          clientSecret: process.env.SLACK_CLIENT_SECRET || '',
          signingSecret: process.env.SLACK_SIGNING_SECRET || '',
          botToken: process.env.SLACK_BOT_TOKEN || '',
        } : undefined,
        google: process.env.GOOGLE_CLIENT_ID ? {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
          apiKey: process.env.GOOGLE_API_KEY || '',
          serviceAccountKey: process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '',
        } : undefined,
        github: process.env.GITHUB_CLIENT_ID ? {
          clientId: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
          webhookSecret: process.env.GITHUB_WEBHOOK_SECRET || '',
        } : undefined,
        analytics: process.env.GOOGLE_ANALYTICS_ID ? {
          googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,
          mixpanelToken: process.env.MIXPANEL_TOKEN || '',
          segmentWriteKey: process.env.SEGMENT_WRITE_KEY || '',
        } : undefined,
      },
    };

    // Apply environment-specific overrides
    this.applyEnvironmentOverrides();

    // Apply manual overrides
    if (Object.keys(this.configOverrides).length > 0) {
      this.config = this.mergeConfigs(this.config, this.configOverrides);
    }

    // Validate configuration
    this.validateConfig();

    return this.config;
  }

  /**
   * Get configuration value by path
   */
  static get<T = any>(path: string, defaultValue?: T): T {
    const config = this.load();
    const keys = path.split('.');
    let current: any = config;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue as T;
      }
    }

    return current as T;
  }

  /**
   * Set configuration override
   */
  static set(path: string, value: any): void {
    const keys = path.split('.');
    let current: any = this.configOverrides;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;

    // Reload configuration with new overrides
    this.config = null;
    this.load();
  }

  /**
   * Check if feature is enabled
   */
  static isFeatureEnabled(feature: keyof ProductionEnvironmentConfig['features']): boolean {
    return this.get(`features.${feature}`, false);
  }

  /**
   * Get environment
   */
  static getEnvironment(): ProductionEnvironmentConfig['environment'] {
    return this.get('environment', 'development');
  }

  /**
   * Check if running in production
   */
  static isProduction(): boolean {
    return this.getEnvironment() === 'production';
  }

  /**
   * Check if running in development
   */
  static isDevelopment(): boolean {
    return this.getEnvironment() === 'development';
  }

  /**
   * Get database URL
   */
  static getDatabaseUrl(): string {
    return this.get('database.url', 'postgresql://localhost:5432/behemoth');
  }

  /**
   * Get Redis URL
   */
  static getRedisUrl(): string | null {
    return this.get('redis.enabled', false) ? this.get('redis.url', null) : null;
  }

  /**
   * Export configuration as JSON
   */
  static export(includeSensitive = false): string {
    const config = this.load();
    
    if (!includeSensitive) {
      // Remove sensitive fields
      const sanitized = JSON.parse(JSON.stringify(config));
      this.removeSensitiveFields(sanitized);
      return JSON.stringify(sanitized, null, 2);
    }

    return JSON.stringify(config, null, 2);
  }

  /**
   * Parse custom metrics from environment variable
   */
  private static parseCustomMetrics(envVar?: string): CustomMetric[] {
    if (!envVar) return [];
    
    try {
      return JSON.parse(envVar);
    } catch (error) {
      console.warn('Failed to parse custom metrics configuration:', error);
      return [];
    }
  }

  /**
   * Parse alert configuration from environment variable
   */
  private static parseAlertConfig(envVar?: string): AlertConfig[] {
    if (!envVar) return [];
    
    try {
      return JSON.parse(envVar);
    } catch (error) {
      console.warn('Failed to parse alert configuration:', error);
      return [];
    }
  }

  /**
   * Apply environment-specific overrides
   */
  private static applyEnvironmentOverrides(): void {
    if (!this.config) return;

    switch (this.config.environment) {
      case 'production':
        // Production overrides
        this.config.logging.level = 'info';
        this.config.security.csrfProtection = true;
        this.config.performance.enableMinification = true;
        this.config.features.enableMaintenanceMode = false;
        break;

      case 'staging':
        // Staging overrides
        this.config.logging.level = 'debug';
        this.config.monitoring.interval = 30000; // More frequent monitoring
        break;

      case 'development':
        // Development overrides
        this.config.logging.level = 'debug';
        this.config.security.csrfProtection = false;
        this.config.performance.enableMinification = false;
        this.config.caching.enabled = false;
        break;
    }
  }

  /**
   * Merge configuration objects deeply
   */
  private static mergeConfigs(
    base: ProductionEnvironmentConfig,
    override: Partial<ProductionEnvironmentConfig>
  ): ProductionEnvironmentConfig {
    const result = JSON.parse(JSON.stringify(base));
    
    const merge = (target: any, source: any) => {
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          if (!target[key]) target[key] = {};
          merge(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      }
    };

    merge(result, override);
    return result;
  }

  /**
   * Validate configuration
   */
  private static validateConfig(): void {
    if (!this.config) return;

    const errors: string[] = [];

    // Validate required fields in production
    if (this.config.environment === 'production') {
      if (this.config.security.jwtSecret === 'default-jwt-secret-change-in-production') {
        errors.push('JWT_SECRET must be set in production');
      }
      
      if (this.config.security.encryptionKey === 'default-encryption-key-change-in-production') {
        errors.push('ENCRYPTION_KEY must be set in production');
      }

      if (!this.config.database.url.includes('postgresql://')) {
        errors.push('DATABASE_URL must be a valid PostgreSQL connection string');
      }
    }

    // Validate port range
    if (this.config.application.port < 1 || this.config.application.port > 65535) {
      errors.push('Port must be between 1 and 65535');
    }

    // Validate cache configuration
    if (this.config.caching.enabled && this.config.caching.provider === 'redis' && !this.config.redis.enabled) {
      errors.push('Redis must be enabled when using Redis as cache provider');
    }

    if (errors.length > 0) {
      console.error('Configuration validation errors:');
      errors.forEach(error => console.error(`  - ${error}`));
      
      if (this.config.environment === 'production') {
        throw new Error('Configuration validation failed in production');
      }
    }
  }

  /**
   * Remove sensitive fields from configuration
   */
  private static removeSensitiveFields(obj: any): void {
    const sensitiveFields = [
      'jwtSecret',
      'encryptionKey',
      'password',
      'secret',
      'key',
      'token',
      'apiKey',
      'secretKey',
      'webhookSecret',
      'clientSecret',
      'serviceAccountKey',
    ];

    const removeFields = (target: any) => {
      if (typeof target !== 'object' || target === null) return;

      Object.keys(target).forEach(key => {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
          target[key] = '[REDACTED]';
        } else if (typeof target[key] === 'object') {
          removeFields(target[key]);
        }
      });
    };

    removeFields(obj);
  }

  /**
   * Reset configuration (for testing)
   */
  static reset(): void {
    this.config = null;
    this.configOverrides = {};
  }
}

// Export singleton instance and utility functions
export const prodConfig = ProductionConfig;
export const getConfig = ProductionConfig.get;
export const setConfig = ProductionConfig.set;
export const isFeatureEnabled = ProductionConfig.isFeatureEnabled;
export const isProduction = ProductionConfig.isProduction;
export const isDevelopment = ProductionConfig.isDevelopment;
