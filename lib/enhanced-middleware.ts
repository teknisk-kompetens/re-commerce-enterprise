
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit } from '@/lib/rate-limiter';

interface TenantValidationResult {
  isValid: boolean;
  tenantId: string | null;
  domain: string | null;
  error?: string;
}

export class EnhancedMiddleware {
  static async handler(request: NextRequest): Promise<NextResponse> {
    const pathname = request.nextUrl.pathname;
    const origin = request.nextUrl.origin;

    // Skip middleware for static files and specific paths
    if (this.shouldSkipMiddleware(pathname)) {
      return NextResponse.next();
    }

    try {
      // 1. Security Headers (always apply)
      const response = NextResponse.next();
      this.addSecurityHeaders(response);

      // 2. Rate Limiting
      const rateLimitResult = await this.checkRateLimit(request);
      if (!rateLimitResult.success) {
        return NextResponse.json(
          { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
          { status: 429 }
        );
      }

      // 3. Tenant Validation for API routes
      if (pathname.startsWith('/api/')) {
        const tenantValidation = await this.validateApiTenant(request);
        if (!tenantValidation.isValid && this.requiresTenantValidation(pathname)) {
          return NextResponse.json(
            { error: tenantValidation.error || 'Tenant validation failed' },
            { status: 403 }
          );
        }

        // Add tenant context to request headers
        if (tenantValidation.tenantId) {
          response.headers.set('x-tenant-id', tenantValidation.tenantId);
          response.headers.set('x-tenant-domain', tenantValidation.domain || '');
        }
      }

      // 4. Widget Communication Security
      if (pathname.startsWith('/api/widgets/')) {
        const widgetSecurity = await this.validateWidgetSecurity(request);
        if (!widgetSecurity.isValid) {
          return NextResponse.json(
            { error: 'Widget security validation failed' },
            { status: 403 }
          );
        }
      }

      // 5. Add request tracking
      response.headers.set('x-request-id', crypto.randomUUID());
      response.headers.set('x-timestamp', new Date().toISOString());
      response.headers.set('x-middleware-version', '2.0.0');

      return response;
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.json(
        { error: 'Internal middleware error' },
        { status: 500 }
      );
    }
  }

  private static shouldSkipMiddleware(pathname: string): boolean {
    const skipPatterns = [
      '/_next',
      '/favicon.ico',
      '/api/health',
      '/api/auth',
      '/_vercel',
      '/public',
    ];

    const staticExtensions = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|webp|map)$/;

    return (
      skipPatterns.some(pattern => pathname.startsWith(pattern)) ||
      staticExtensions.test(pathname)
    );
  }

  private static async checkRateLimit(request: NextRequest): Promise<{
    success: boolean;
    retryAfter?: number;
  }> {
    try {
      const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
      const endpoint = request.nextUrl.pathname;
      
      // Different rate limits for different endpoint types
      let limits = { requests: 100, window: 60 }; // Default: 100 requests per minute

      if (endpoint.startsWith('/api/auth')) {
        limits = { requests: 10, window: 60 }; // Stricter for auth
      } else if (endpoint.startsWith('/api/widgets')) {
        limits = { requests: 200, window: 60 }; // Higher for widget communication
      } else if (endpoint.startsWith('/api/public')) {
        limits = { requests: 50, window: 60 }; // Moderate for public APIs
      }

      return await rateLimit({
        identifier: ip,
        endpoint,
        requests: limits.requests,
        window: limits.window,
      });
    } catch (error) {
      console.error('Rate limit check error:', error);
      return { success: true }; // Fail open for rate limiting
    }
  }

  private static async validateApiTenant(request: NextRequest): Promise<TenantValidationResult> {
    try {
      // Extract tenant info from various sources
      const tenantId = request.headers.get('x-tenant-id') || 
                      request.nextUrl.searchParams.get('tenantId');
      
      const domain = request.headers.get('x-tenant-domain') ||
                     request.nextUrl.searchParams.get('domain');

      if (!tenantId && !domain) {
        return {
          isValid: false,
          tenantId: null,
          domain: null,
          error: 'Tenant identification required',
        };
      }

      // For now, basic validation - can be enhanced with database checks
      if (tenantId && /^[a-zA-Z0-9_-]+$/.test(tenantId)) {
        return {
          isValid: true,
          tenantId,
          domain,
        };
      }

      return {
        isValid: false,
        tenantId: null,
        domain: null,
        error: 'Invalid tenant format',
      };
    } catch (error) {
      console.error('Tenant validation error:', error);
      return {
        isValid: false,
        tenantId: null,
        domain: null,
        error: 'Tenant validation failed',
      };
    }
  }

  private static requiresTenantValidation(pathname: string): boolean {
    const tenantRequiredPatterns = [
      '/api/tenants',
      '/api/users',
      '/api/tasks',
      '/api/projects',
      '/api/analytics',
      '/api/widgets',
    ];

    const publicEndpoints = [
      '/api/health',
      '/api/auth',
      '/api/public',
    ];

    // Skip validation for public endpoints
    if (publicEndpoints.some(pattern => pathname.startsWith(pattern))) {
      return false;
    }

    // Require validation for tenant-specific endpoints
    return tenantRequiredPatterns.some(pattern => pathname.startsWith(pattern));
  }

  private static async validateWidgetSecurity(request: NextRequest): Promise<{
    isValid: boolean;
    error?: string;
  }> {
    try {
      const widgetId = request.headers.get('x-widget-id');
      const widgetToken = request.headers.get('x-widget-token');
      const tenantId = request.headers.get('x-tenant-id');

      if (!widgetId || !tenantId) {
        return {
          isValid: false,
          error: 'Widget identification required',
        };
      }

      // Basic validation - can be enhanced with proper widget authentication
      if (widgetId.length > 0 && tenantId.length > 0) {
        return { isValid: true };
      }

      return {
        isValid: false,
        error: 'Invalid widget credentials',
      };
    } catch (error) {
      console.error('Widget security validation error:', error);
      return {
        isValid: false,
        error: 'Widget security validation failed',
      };
    }
  }

  private static addSecurityHeaders(response: NextResponse): void {
    const headers = {
      // Content Security
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN', // Changed from DENY for widget embedding
      'X-XSS-Protection': '1; mode=block',
      
      // Privacy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // HTTPS
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      
      // Cache Control for API responses
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      
      // CORS for widget communication
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Expose-Headers': 'x-request-id, x-tenant-id',
      
      // Custom headers
      'X-API-Version': '2.0.0',
      'X-Security-Level': 'enterprise',
    };

    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
}
