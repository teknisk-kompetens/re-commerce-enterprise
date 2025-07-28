
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ProductionConfig } from '@/lib/production-config';

export const dynamic = 'force-dynamic';

// GET /api/health - System health check
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const healthCheck = {
    status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: ProductionConfig.getEnvironment(),
    checks: {
      database: { status: 'unknown' as 'healthy' | 'unhealthy', latency: 0, error: null as string | null },
      api: { status: 'healthy' as 'healthy' | 'unhealthy', latency: 0 },
      memory: { status: 'unknown' as 'healthy' | 'degraded' | 'unhealthy', usage: 0, limit: 0 },
      uptime: { status: 'healthy' as 'healthy' | 'unhealthy', seconds: 0 },
    },
    meta: {
      node_version: process.version,
      platform: process.platform,
      arch: process.arch,
      pid: process.pid,
    },
  };

  try {
    // Database health check
    const dbStart = Date.now();
    try {
      await prisma.$queryRaw`SELECT 1`;
      healthCheck.checks.database.status = 'healthy';
      healthCheck.checks.database.latency = Date.now() - dbStart;
    } catch (error) {
      healthCheck.checks.database.status = 'unhealthy';
      healthCheck.checks.database.error = error instanceof Error ? error.message : 'Database connection failed';
      healthCheck.status = 'unhealthy';
    }

    // Memory health check
    if (typeof process.memoryUsage === 'function') {
      const memUsage = process.memoryUsage();
      const totalMem = memUsage.heapTotal;
      const usedMem = memUsage.heapUsed;
      const memoryUsagePercent = (usedMem / totalMem) * 100;

      healthCheck.checks.memory.usage = usedMem;
      healthCheck.checks.memory.limit = totalMem;

      if (memoryUsagePercent > 90) {
        healthCheck.checks.memory.status = 'unhealthy';
        healthCheck.status = 'degraded';
      } else if (memoryUsagePercent > 80) {
        healthCheck.checks.memory.status = 'degraded';
        if (healthCheck.status === 'healthy') {
          healthCheck.status = 'degraded';
        }
      } else {
        healthCheck.checks.memory.status = 'healthy';
      }
    }

    // Uptime check
    if (typeof process.uptime === 'function') {
      const uptimeSeconds = Math.floor(process.uptime());
      healthCheck.checks.uptime.seconds = uptimeSeconds;
      healthCheck.checks.uptime.status = uptimeSeconds > 0 ? 'healthy' : 'unhealthy';
    }

    // API latency
    healthCheck.checks.api.latency = Date.now() - startTime;

    // Determine overall status
    if (healthCheck.checks.database.status === 'unhealthy') {
      healthCheck.status = 'unhealthy';
    } else if (
      healthCheck.checks.memory.status === 'degraded' ||
      healthCheck.checks.api.latency > 1000
    ) {
      if (healthCheck.status === 'healthy') {
        healthCheck.status = 'degraded';
      }
    }

    // Return appropriate HTTP status
    const httpStatus = healthCheck.status === 'healthy' ? 200 :
                      healthCheck.status === 'degraded' ? 200 : 503;

    return NextResponse.json(healthCheck, { 
      status: httpStatus,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'X-Health-Check': 'true',
        'X-Response-Time': `${Date.now() - startTime}ms`,
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Health check failed',
      latency: Date.now() - startTime,
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Health-Check': 'true',
      }
    });
  }
}

// HEAD /api/health - Quick health check (no body)
export async function HEAD(request: NextRequest) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return new NextResponse(null, { 
      status: 200,
      headers: {
        'X-Health-Status': 'healthy',
        'Cache-Control': 'no-cache',
      }
    });
  } catch (error) {
    return new NextResponse(null, { 
      status: 503,
      headers: {
        'X-Health-Status': 'unhealthy',
        'Cache-Control': 'no-cache',
      }
    });
  }
}
