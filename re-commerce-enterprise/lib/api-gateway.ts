
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/db';
import { rateLimit } from '@/lib/rate-limiter';

export interface ApiGatewayConfig {
  requireAuth?: boolean;
  requireTenant?: boolean;
  permissions?: string[];
  rateLimit?: {
    requests: number;
    window: number; // seconds
  };
  allowCors?: boolean;
  validateTenant?: boolean;
}

export interface ApiContext {
  user: {
    id: string;
    email: string;
    tenantId: string;
    role: string;
  } | null;
  tenant: {
    id: string;
    name: string;
    domain: string;
    plan: string;
  } | null;
  request: NextRequest;
  searchParams: URLSearchParams;
  pathParams: Record<string, string>;
}

export class ApiGateway {
  static async handler(
    request: NextRequest,
    config: ApiGatewayConfig,
    handler: (context: ApiContext) => Promise<NextResponse>
  ): Promise<NextResponse> {
    try {
      // CORS handling
      if (config.allowCors && request.method === 'OPTIONS') {
        return this.corsResponse();
      }

      // Rate limiting
      if (config.rateLimit) {
        const rateLimitResult = await this.checkRateLimit(request, config.rateLimit);
        if (!rateLimitResult.success) {
          return NextResponse.json(
            { error: 'Rate limit exceeded', retryAfter: rateLimitResult.retryAfter },
            { status: 429 }
          );
        }
      }

      // Authentication
      let user = null;
      let tenant = null;

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
        };

        // Tenant validation
        if (config.requireTenant || config.validateTenant) {
          tenant = await this.validateTenant(user.tenantId);
          if (!tenant) {
            return NextResponse.json({ error: 'Invalid or inactive tenant' }, { status: 403 });
          }
        }

        // Permission checks
        if (config.permissions && config.permissions.length > 0) {
          const hasPermission = await this.checkPermissions(user.id, user.tenantId, config.permissions);
          if (!hasPermission) {
            return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
          }
        }
      }

      // Create API context
      const url = new URL(request.url);
      const searchParams = url.searchParams;
      const pathParams = this.extractPathParams(request.url);

      const context: ApiContext = {
        user,
        tenant,
        request,
        searchParams,
        pathParams,
      };

      // Execute handler
      const response = await handler(context);

      // Add CORS headers if configured
      if (config.allowCors) {
        this.addCorsHeaders(response);
      }

      // Add security headers
      this.addSecurityHeaders(response);

      return response;
    } catch (error) {
      console.error('API Gateway Error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  private static async checkRateLimit(
    request: NextRequest,
    rateConfig: { requests: number; window: number }
  ): Promise<{ success: boolean; retryAfter?: number }> {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const endpoint = new URL(request.url).pathname;
    
    return await rateLimit({
      identifier: ip,
      endpoint,
      requests: rateConfig.requests,
      window: rateConfig.window,
    });
  }

  private static async validateTenant(tenantId: string) {
    try {
      const tenant = await prisma.tenant.findFirst({
        where: {
          id: tenantId,
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          domain: true,
          plan: true,
        },
      });

      return tenant;
    } catch (error) {
      console.error('Tenant validation error:', error);
      return null;
    }
  }

  private static async checkPermissions(
    userId: string,
    tenantId: string,
    requiredPermissions: string[]
  ): Promise<boolean> {
    try {
      // Get user permissions through roles
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

      if (!userPermissions) return false;

      // Collect all permissions
      const allPermissions = new Set<string>();

      // From roles - permissions are stored as JSON array in the role
      userPermissions.userRoles.forEach(userRole => {
        const rolePermissions = userRole.role.permissions as string[];
        rolePermissions.forEach(permission => {
          allPermissions.add(permission);
        });
      });

      // Check if user has all required permissions
      return requiredPermissions.every(permission => allPermissions.has(permission));
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  private static extractPathParams(url: string): Record<string, string> {
    // Extract dynamic route parameters
    // This is a simplified implementation - can be enhanced based on Next.js routing
    const urlObj = new URL(url);
    const segments = urlObj.pathname.split('/').filter(Boolean);
    const params: Record<string, string> = {};

    // Basic parameter extraction (can be enhanced)
    segments.forEach((segment, index) => {
      if (segment.includes('-') && segments[index - 1]) {
        params[segments[index - 1]] = segment;
      }
    });

    return params;
  }

  private static corsResponse(): NextResponse {
    const response = new NextResponse(null, { status: 200 });
    this.addCorsHeaders(response);
    return response;
  }

  private static addCorsHeaders(response: NextResponse): void {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Tenant-ID');
    response.headers.set('Access-Control-Max-Age', '86400');
  }

  private static addSecurityHeaders(response: NextResponse): void {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-Request-ID', crypto.randomUUID());
    response.headers.set('X-Response-Time', Date.now().toString());
  }
}

// Utility function for easy API route creation
export function createApiRoute(
  config: ApiGatewayConfig,
  handler: (context: ApiContext) => Promise<NextResponse | Response>
) {
  return async (request: NextRequest) => {
    return ApiGateway.handler(request, config, async (context) => {
      const result = await handler(context);
      // Convert Response to NextResponse if needed
      if (result instanceof Response && !(result instanceof NextResponse)) {
        const nextResponse = new NextResponse(result.body, {
          status: result.status,
          statusText: result.statusText,
          headers: result.headers,
        });
        return nextResponse;
      }
      return result as NextResponse;
    });
  };
}
