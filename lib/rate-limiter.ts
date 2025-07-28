
import { prisma } from '@/lib/db';

export interface RateLimitConfig {
  identifier: string;
  endpoint?: string;
  requests: number;
  window: number; // seconds
  type?: 'ip' | 'user' | 'tenant' | 'endpoint';
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: Date;
  retryAfter?: number;
}

export async function rateLimit(config: RateLimitConfig): Promise<RateLimitResult> {
  const {
    identifier,
    endpoint = 'global',
    requests,
    window,
    type = 'ip'
  } = config;

  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() - (window * 1000));
    const windowEnd = new Date(now.getTime() + (window * 1000));

    // Clean up expired rate limit records
    await prisma.rateLimit.deleteMany({
      where: {
        windowEnd: {
          lt: now
        }
      }
    });

    // Get or create rate limit record
    const existingRecord = await prisma.rateLimit.findFirst({
      where: {
        identifier,
        type,
        endpoint,
        windowEnd: {
          gt: now
        }
      }
    });

    if (existingRecord) {
      // Check if limit exceeded
      if (existingRecord.requests >= requests) {
        const retryAfter = Math.ceil((existingRecord.windowEnd.getTime() - now.getTime()) / 1000);
        return {
          success: false,
          remaining: 0,
          reset: existingRecord.windowEnd,
          retryAfter
        };
      }

      // Increment request count
      const updatedRecord = await prisma.rateLimit.update({
        where: { id: existingRecord.id },
        data: {
          requests: existingRecord.requests + 1
        }
      });

      return {
        success: true,
        remaining: requests - updatedRecord.requests,
        reset: updatedRecord.windowEnd
      };
    } else {
      // Create new rate limit record
      const newRecord = await prisma.rateLimit.create({
        data: {
          identifier,
          type,
          endpoint,
          requests: 1,
          windowStart,
          windowEnd,
          tenantId: type === 'tenant' ? identifier : 'system'
        }
      });

      return {
        success: true,
        remaining: requests - 1,
        reset: newRecord.windowEnd
      };
    }
  } catch (error) {
    console.error('Rate limit error:', error);
    // Fail open - allow request if rate limiting fails
    return {
      success: true,
      remaining: requests - 1,
      reset: new Date(Date.now() + (window * 1000))
    };
  }
}

// Enhanced rate limiting with different strategies
export class RateLimiter {
  private static instance: RateLimiter;
  private memoryStore = new Map<string, { count: number; resetTime: number }>();

  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }

  // Memory-based rate limiting for high-frequency checks
  async checkMemoryLimit(
    identifier: string,
    requests: number,
    windowSeconds: number
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const key = identifier;
    const existing = this.memoryStore.get(key);

    if (!existing || now > existing.resetTime) {
      // Create new window
      this.memoryStore.set(key, {
        count: 1,
        resetTime: now + (windowSeconds * 1000)
      });

      return {
        success: true,
        remaining: requests - 1,
        reset: new Date(now + (windowSeconds * 1000))
      };
    }

    if (existing.count >= requests) {
      const retryAfter = Math.ceil((existing.resetTime - now) / 1000);
      return {
        success: false,
        remaining: 0,
        reset: new Date(existing.resetTime),
        retryAfter
      };
    }

    // Increment count
    existing.count++;
    this.memoryStore.set(key, existing);

    return {
      success: true,
      remaining: requests - existing.count,
      reset: new Date(existing.resetTime)
    };
  }

  // Database-based rate limiting for persistent tracking
  async checkDatabaseLimit(config: RateLimitConfig): Promise<RateLimitResult> {
    return rateLimit(config);
  }

  // Hybrid approach - use memory for short windows, database for longer ones
  async checkHybridLimit(config: RateLimitConfig): Promise<RateLimitResult> {
    const { window } = config;

    // Use memory store for windows <= 60 seconds
    if (window <= 60) {
      return this.checkMemoryLimit(config.identifier, config.requests, config.window);
    }

    // Use database for longer windows
    return this.checkDatabaseLimit(config);
  }

  // Clean up expired memory entries
  private cleanupMemory(): void {
    const now = Date.now();
    for (const [key, value] of this.memoryStore.entries()) {
      if (now > value.resetTime) {
        this.memoryStore.delete(key);
      }
    }
  }

  // Start cleanup interval
  startCleanup(intervalMs = 60000): void {
    setInterval(() => {
      this.cleanupMemory();
    }, intervalMs);
  }
}

// Rate limiting presets for different use cases
export const RateLimitPresets = {
  // Authentication endpoints
  AUTH_LOGIN: { requests: 5, window: 300 }, // 5 requests per 5 minutes
  AUTH_REGISTER: { requests: 3, window: 3600 }, // 3 requests per hour
  AUTH_PASSWORD_RESET: { requests: 3, window: 3600 }, // 3 requests per hour

  // API endpoints
  API_READ: { requests: 100, window: 60 }, // 100 requests per minute
  API_WRITE: { requests: 20, window: 60 }, // 20 requests per minute
  API_DELETE: { requests: 10, window: 60 }, // 10 requests per minute

  // Widget communication
  WIDGET_MESSAGE: { requests: 200, window: 60 }, // 200 messages per minute
  WIDGET_EVENT: { requests: 300, window: 60 }, // 300 events per minute
  WIDGET_AUTH: { requests: 10, window: 300 }, // 10 auth requests per 5 minutes

  // Tenant operations
  TENANT_SWITCH: { requests: 10, window: 60 }, // 10 switches per minute
  TENANT_UPDATE: { requests: 5, window: 300 }, // 5 updates per 5 minutes

  // Public endpoints
  PUBLIC_API: { requests: 50, window: 60 }, // 50 requests per minute
  HEALTH_CHECK: { requests: 1000, window: 60 }, // 1000 requests per minute (high for monitoring)
} as const;

// Utility function to create rate limit key
export function createRateLimitKey(
  identifier: string,
  endpoint: string,
  type: string = 'general'
): string {
  return `${type}:${identifier}:${endpoint}`;
}

// Export the singleton instance
export const rateLimiter = RateLimiter.getInstance();
