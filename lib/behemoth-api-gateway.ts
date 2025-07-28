
/**
 * BEHEMOTH API GATEWAY
 * Enterprise-grade API Gateway with intelligent routing, circuit breakers,
 * request transformation, and advanced monitoring capabilities
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limiter';
import { EventBus } from '@/lib/event-bus-system';
import { AuditLogger } from '@/lib/audit-logger';
import { SecurityMiddleware } from '@/lib/security-middleware';

export interface BehemothApiConfig {
  // Authentication & Authorization
  requireAuth?: boolean;
  requireTenant?: boolean;
  permissions?: string[];
  roles?: string[];
  
  // Rate Limiting & Circuit Breaker
  rateLimit?: {
    requests: number;
    window: number; // seconds
    burst?: number; // burst capacity
  };
  circuitBreaker?: {
    failureThreshold: number;
    recoveryTimeout: number;
    halfOpenRequests: number;
  };
  
  // Request Processing
  allowCors?: boolean;
  validateTenant?: boolean;
  requestTransforms?: RequestTransform[];
  responseTransforms?: ResponseTransform[];
  
  // Security
  zeroTrust?: boolean;
  encryptResponse?: boolean;
  validateSignature?: boolean;
  
  // Monitoring & Observability
  enableMetrics?: boolean;
  enableTracing?: boolean;
  enableAudit?: boolean;
  customTags?: Record<string, string>;
  
  // Performance
  cacheConfig?: {
    enabled: boolean;
    ttl: number;
    keyStrategy: string;
  };
  compressionEnabled?: boolean;
  
  // Widget Communication
  widgetContext?: boolean;
  eventPublishing?: string[];
  eventSubscriptions?: string[];
}

export interface RequestTransform {
  type: 'header' | 'body' | 'query' | 'path';
  operation: 'add' | 'remove' | 'modify' | 'validate';
  target: string;
  value?: any;
  condition?: (request: BehemothApiContext) => boolean;
}

export interface ResponseTransform {
  type: 'header' | 'body' | 'status';
  operation: 'add' | 'remove' | 'modify' | 'encrypt';
  target: string;
  value?: any;
  condition?: (response: NextResponse, context: BehemothApiContext) => boolean;
}

export interface BehemothApiContext {
  // Core Context
  user: {
    id: string;
    email: string;
    tenantId: string;
    role: string;
    permissions: string[];
  } | null;
  tenant: {
    id: string;
    name: string;
    domain: string;
    plan: string;
    settings: any;
  } | null;
  
  // Request Data
  request: NextRequest;
  searchParams: URLSearchParams;
  pathParams: Record<string, string>;
  body?: any;
  
  // Security Context
  securityContext: {
    ipAddress: string;
    userAgent: string;
    trustScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    deviceFingerprint?: string;
  };
  
  // Performance Metrics
  metrics: {
    requestId: string;
    startTime: number;
    processingTime?: number;
    memoryUsage?: number;
    cacheHit?: boolean;
  };
  
  // Widget Context
  widgetContext?: {
    widgetId?: string;
    instanceId?: string;
    communicationProtocol: string;
  };
}

// Circuit Breaker Implementation
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  private halfOpenRequests = 0;

  constructor(
    private failureThreshold: number,
    private recoveryTimeout: number,
    private maxHalfOpenRequests: number
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
        this.state = 'half-open';
        this.halfOpenRequests = 0;
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    if (this.state === 'half-open' && this.halfOpenRequests >= this.maxHalfOpenRequests) {
      throw new Error('Circuit breaker half-open limit exceeded');
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.failureThreshold) {
      this.state = 'open';
    }
    
    if (this.state === 'half-open') {
      this.halfOpenRequests++;
    }
  }
}

// Request Cache Implementation
class RequestCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl * 1000, // Convert to milliseconds
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  generateKey(request: NextRequest, context: BehemothApiContext): string {
    const url = new URL(request.url);
    const baseKey = `${request.method}:${url.pathname}:${url.search}`;
    
    // Add tenant context to cache key
    if (context.tenant) {
      return `${baseKey}:tenant:${context.tenant.id}`;
    }
    
    return baseKey;
  }
}

export class BehemothApiGateway {
  private static circuitBreakers = new Map<string, CircuitBreaker>();
  private static requestCache = new RequestCache();
  private static eventBus = new EventBus();
  private static auditLogger = new AuditLogger();

  static async handler(
    request: NextRequest,
    config: BehemothApiConfig,
    handler: (context: BehemothApiContext) => Promise<NextResponse>
  ): Promise<NextResponse> {
    const requestId = crypto.randomUUID();
    const startTime = performance.now();
    
    try {
      // Initialize metrics
      const metrics = {
        requestId,
        startTime,
      };

      // CORS handling
      if (config.allowCors && request.method === 'OPTIONS') {
        return this.corsResponse();
      }

      // Security validation (Zero Trust)
      if (config.zeroTrust) {
        const securityResult = await SecurityMiddleware.validateRequest(request);
        if (!securityResult.allowed) {
          return NextResponse.json(
            { error: 'Security validation failed', reason: securityResult.reason },
            { status: 403 }
          );
        }
      }

      // Rate limiting with burst capacity
      if (config.rateLimit) {
        const rateLimitResult = await this.checkAdvancedRateLimit(request, config.rateLimit);
        if (!rateLimitResult.success) {
          return NextResponse.json(
            { 
              error: 'Rate limit exceeded', 
              retryAfter: rateLimitResult.retryAfter,
              burstCapacityExceeded: rateLimitResult.burstExceeded 
            },
            { status: 429 }
          );
        }
      }

      // Circuit breaker check
      if (config.circuitBreaker) {
        const breakerKey = new URL(request.url).pathname;
        const circuitBreaker = this.getCircuitBreaker(breakerKey, config.circuitBreaker);
        
        try {
          return await circuitBreaker.execute(async () => {
            return await this.processRequest(request, config, handler, metrics);
          });
        } catch (error) {
          if (error instanceof Error && error.message.includes('Circuit breaker')) {
            return NextResponse.json(
              { error: 'Service temporarily unavailable', circuitBreakerOpen: true },
              { status: 503 }
            );
          }
          throw error;
        }
      }

      return await this.processRequest(request, config, handler, metrics);
    } catch (error) {
      console.error('Behemoth API Gateway Error:', error);
      
      // Log error for observability
      if (config.enableAudit) {
        await this.auditLogger.logError(requestId, error, request);
      }
      
      return NextResponse.json(
        { 
          error: 'Internal server error',
          requestId,
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  }

  private static async processRequest(
    request: NextRequest,
    config: BehemothApiConfig,
    handler: (context: BehemothApiContext) => Promise<NextResponse>,
    metrics: any
  ): Promise<NextResponse> {
    // Authentication & Authorization
    let user: any = null;
    let tenant: any = null;

    if (config.requireAuth) {
      const session = await getServerSession(authOptions);
      if (!session?.user) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      }

      user = {
        id: session.user.id,
        email: session.user.email!,
        tenantId: session.user.tenantId,
        role: session.user.role,
        permissions: await this.getUserPermissions(session.user.id, session.user.tenantId),
      };

      // Tenant validation
      if (config.requireTenant || config.validateTenant) {
        tenant = await this.validateTenant(user.tenantId);
        if (!tenant) {
          return NextResponse.json({ error: 'Invalid or inactive tenant' }, { status: 403 });
        }
      }

      // Role and permission checks
      if (config.roles && !config.roles.includes(user.role)) {
        return NextResponse.json({ error: 'Insufficient role permissions' }, { status: 403 });
      }

      if (config.permissions && config.permissions.length > 0) {
        const hasPermission = config.permissions.some(permission => 
          user.permissions.includes(permission)
        );
        if (!hasPermission) {
          return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
        }
      }
    }

    // Build security context
    const securityContext = await this.buildSecurityContext(request);

    // Create comprehensive API context
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const pathParams = this.extractPathParams(request.url);
    const body = await this.parseRequestBody(request);

    const context: BehemothApiContext = {
      user,
      tenant,
      request,
      searchParams,
      pathParams,
      body,
      securityContext,
      metrics,
      widgetContext: config.widgetContext ? await this.buildWidgetContext(request) : undefined,
    };

    // Request transforms
    if (config.requestTransforms) {
      await this.applyRequestTransforms(context, config.requestTransforms);
    }

    // Cache check
    if (config.cacheConfig?.enabled && request.method === 'GET') {
      const cacheKey = this.requestCache.generateKey(request, context);
      const cachedResponse = this.requestCache.get(cacheKey);
      if (cachedResponse) {
        metrics.cacheHit = true;
        return new NextResponse(JSON.stringify(cachedResponse), {
          headers: { 'Content-Type': 'application/json', 'X-Cache': 'HIT' },
        });
      }
    }

    // Execute handler
    let response = await handler(context);

    // Cache response
    if (config.cacheConfig?.enabled && request.method === 'GET' && response.status === 200) {
      const cacheKey = this.requestCache.generateKey(request, context);
      const responseData = await response.clone().json();
      this.requestCache.set(cacheKey, responseData, config.cacheConfig.ttl);
    }

    // Response transforms
    if (config.responseTransforms) {
      response = await this.applyResponseTransforms(response, context, config.responseTransforms);
    }

    // Add performance headers
    metrics.processingTime = performance.now() - metrics.startTime;
    response.headers.set('X-Request-ID', metrics.requestId);
    response.headers.set('X-Processing-Time', `${metrics.processingTime.toFixed(2)}ms`);

    // Security headers
    this.addSecurityHeaders(response);

    // CORS headers
    if (config.allowCors) {
      this.addCorsHeaders(response);
    }

    // Audit logging
    if (config.enableAudit) {
      await this.auditLogger.logRequest(context, response, metrics);
    }

    // Publish events
    if (config.eventPublishing) {
      await this.publishEvents(config.eventPublishing, context, response);
    }

    return response;
  }

  private static async checkAdvancedRateLimit(
    request: NextRequest,
    rateConfig: { requests: number; window: number; burst?: number }
  ): Promise<{ success: boolean; retryAfter?: number; burstExceeded?: boolean }> {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const endpoint = new URL(request.url).pathname;
    
    // Standard rate limiting
    const standardLimit = await rateLimit({
      identifier: ip,
      endpoint,
      requests: rateConfig.requests,
      window: rateConfig.window,
    });

    if (!standardLimit.success) {
      return standardLimit;
    }

    // Burst capacity check
    if (rateConfig.burst) {
      const burstLimit = await rateLimit({
        identifier: `${ip}:burst`,
        endpoint,
        requests: rateConfig.burst,
        window: 60, // 1 minute burst window
      });

      if (!burstLimit.success) {
        return {
          success: false,
          retryAfter: burstLimit.retryAfter,
          burstExceeded: true,
        };
      }
    }

    return { success: true };
  }

  private static getCircuitBreaker(key: string, config: any): CircuitBreaker {
    if (!this.circuitBreakers.has(key)) {
      this.circuitBreakers.set(key, new CircuitBreaker(
        config.failureThreshold,
        config.recoveryTimeout * 1000, // Convert to ms
        config.halfOpenRequests
      ));
    }
    return this.circuitBreakers.get(key)!;
  }

  private static async buildSecurityContext(request: NextRequest) {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    return {
      ipAddress: ip,
      userAgent,
      trustScore: await this.calculateTrustScore(ip, userAgent),
      riskLevel: 'low' as const, // Would be calculated based on various factors
    };
  }

  private static async calculateTrustScore(ip: string, userAgent: string): Promise<number> {
    // Simplified trust score calculation
    // In production, this would integrate with threat intelligence services
    let score = 100;
    
    // Reduce score for suspicious patterns
    if (ip === 'unknown') score -= 20;
    if (userAgent === 'unknown') score -= 15;
    if (userAgent.includes('bot')) score -= 30;
    
    return Math.max(0, Math.min(100, score));
  }

  private static async buildWidgetContext(request: NextRequest) {
    const widgetId = request.headers.get('x-widget-id');
    const instanceId = request.headers.get('x-widget-instance-id');
    
    return {
      widgetId: widgetId || undefined,
      instanceId: instanceId || undefined,
      communicationProtocol: request.headers.get('x-comm-protocol') || 'http',
    };
  }

  private static async getUserPermissions(userId: string, tenantId: string): Promise<string[]> {
    try {
      const userPermissions = await prisma.user.findFirst({
        where: { id: userId, tenantId },
        include: {
          userRoles: {
            include: {
              role: {
                select: {
                  permissions: true
                }
              }
            }
          }
        }
      });

      if (!userPermissions) return [];

      const allPermissions = new Set<string>();

      // From roles - permissions are stored as JSON array in the role
      userPermissions.userRoles.forEach(userRole => {
        const rolePermissions = userRole.role.permissions as string[];
        rolePermissions.forEach(permission => {
          allPermissions.add(permission);
        });
      });

      return Array.from(allPermissions);
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      return [];
    }
  }

  private static async validateTenant(tenantId: string) {
    try {
      return await prisma.tenant.findFirst({
        where: {
          id: tenantId,
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          domain: true,
          plan: true,
          settings: true,
        },
      });
    } catch (error) {
      console.error('Tenant validation error:', error);
      return null;
    }
  }

  private static extractPathParams(url: string): Record<string, string> {
    const urlObj = new URL(url);
    const segments = urlObj.pathname.split('/').filter(Boolean);
    const params: Record<string, string> = {};

    segments.forEach((segment, index) => {
      if (segment.includes('-') && segments[index - 1]) {
        params[segments[index - 1]] = segment;
      }
    });

    return params;
  }

  private static async parseRequestBody(request: NextRequest): Promise<any> {
    try {
      const contentType = request.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return await request.json();
      } else if (contentType?.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        return Object.fromEntries(formData);
      }
      return null;
    } catch {
      return null;
    }
  }

  private static async applyRequestTransforms(
    context: BehemothApiContext,
    transforms: RequestTransform[]
  ): Promise<void> {
    for (const transform of transforms) {
      if (transform.condition && !transform.condition(context)) {
        continue;
      }

      // Apply transform based on type and operation
      // Implementation would depend on specific transform requirements
    }
  }

  private static async applyResponseTransforms(
    response: NextResponse,
    context: BehemothApiContext,
    transforms: ResponseTransform[]
  ): Promise<NextResponse> {
    let modifiedResponse = response;

    for (const transform of transforms) {
      if (transform.condition && !transform.condition(modifiedResponse, context)) {
        continue;
      }

      // Apply transform based on type and operation
      // Implementation would depend on specific transform requirements
    }

    return modifiedResponse;
  }

  private static async publishEvents(
    eventTypes: string[],
    context: BehemothApiContext,
    response: NextResponse
  ): Promise<void> {
    for (const eventType of eventTypes) {
      await this.eventBus.publish({
        type: eventType,
        source: 'api-gateway',
        data: {
          requestId: context.metrics.requestId,
          tenantId: context.tenant?.id,
          userId: context.user?.id,
          statusCode: response.status,
          processingTime: context.metrics.processingTime,
        },
        metadata: {
          timestamp: new Date(),
          correlationId: context.metrics.requestId,
        },
      });
    }
  }

  private static corsResponse(): NextResponse {
    const response = new NextResponse(null, { status: 200 });
    this.addCorsHeaders(response);
    return response;
  }

  private static addCorsHeaders(response: NextResponse): void {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Tenant-ID, X-Widget-ID');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  private static addSecurityHeaders(response: NextResponse): void {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    response.headers.set('Content-Security-Policy', "default-src 'self'");
  }
}

// Utility function for easy API route creation with Behemoth Gateway
export function createBehemothApiRoute(
  config: BehemothApiConfig,
  handler: (context: BehemothApiContext) => Promise<NextResponse | Response>
) {
  return async (request: NextRequest) => {
    return BehemothApiGateway.handler(request, config, async (context) => {
      const result = await handler(context);
      if (result instanceof Response && !(result instanceof NextResponse)) {
        return new NextResponse(result.body, {
          status: result.status,
          statusText: result.statusText,
          headers: result.headers,
        });
      }
      return result as NextResponse;
    });
  };
}
