
/**
 * BEHEMOTH ADMIN CONFIGURATION API
 * Administrative endpoint for viewing and managing Behemoth configuration
 */

import { NextRequest, NextResponse } from 'next/server';
import { createBehemothApiRoute } from '@/lib/behemoth-api-gateway';
import { getBehemothConfig, updateBehemothConfig, getBehemothSystemStatus } from '@/lib/behemoth-middleware';
import { ProductionConfig } from '@/lib/production-config';

export const dynamic = 'force-dynamic';

async function getConfigHandler() {
  try {
    // Get current Behemoth configuration
    const behemothConfig = getBehemothConfig();
    
    // Get production configuration (sanitized)
    const prodConfigJson = ProductionConfig.export(false); // Exclude sensitive fields
    const prodConfig = JSON.parse(prodConfigJson);
    
    // Get system status
    const systemStatus = await getBehemothSystemStatus();
    
    const response = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      
      // Behemoth Middleware Configuration
      behemothConfig,
      
      // Production Configuration (sanitized)
      productionConfig: prodConfig,
      
      // System Status
      systemStatus,
      
      // Runtime Information
      runtime: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
      
      // Environment Variables (filtered)
      environmentVariables: getFilteredEnvironmentVariables(),
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Admin-Endpoint': 'config',
      },
    });
    
  } catch (error) {
    console.error('Failed to get admin config:', error);
    
    return NextResponse.json({
      error: 'Failed to retrieve configuration',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

async function updateConfigHandler(context: any) {
  try {
    const body = context.request.body;
    
    if (!body) {
      return NextResponse.json({
        error: 'Request body is required',
      }, { status: 400 });
    }
    
    // Update Behemoth configuration
    updateBehemothConfig(body);
    
    // Get updated configuration
    const updatedConfig = getBehemothConfig();
    
    return NextResponse.json({
      success: true,
      message: 'Configuration updated successfully',
      updatedConfig,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Failed to update config:', error);
    
    return NextResponse.json({
      error: 'Failed to update configuration',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

function getFilteredEnvironmentVariables() {
  const filtered: Record<string, string> = {};
  const allowedPrefixes = ['NODE_', 'NEXT_', 'VERCEL_', 'APP_', 'BEHEMOTH_'];
  const sensitiveKeywords = ['secret', 'key', 'token', 'password', 'private'];
  
  Object.keys(process.env).forEach(key => {
    // Only include environment variables with allowed prefixes
    if (allowedPrefixes.some(prefix => key.startsWith(prefix))) {
      // Check if the key contains sensitive information
      const isSensitive = sensitiveKeywords.some(keyword => 
        key.toLowerCase().includes(keyword)
      );
      
      if (isSensitive) {
        filtered[key] = '[REDACTED]';
      } else {
        filtered[key] = process.env[key] || '';
      }
    }
  });
  
  return filtered;
}

// GET endpoint for retrieving configuration
export const GET = createBehemothApiRoute(
  {
    requireAuth: true,
    requireTenant: false,
    permissions: ['admin', 'system:read'],
    allowCors: true,
    enableMetrics: true,
    enableTracing: true,
    enableAudit: true,
    rateLimit: {
      requests: 50,
      window: 300, // 50 requests per 5 minutes for admin endpoints
    },
  },
  getConfigHandler
);

// POST endpoint for updating configuration
export const POST = createBehemothApiRoute(
  {
    requireAuth: true,
    requireTenant: false,
    permissions: ['admin', 'system:write'],
    allowCors: true,
    enableMetrics: true,
    enableTracing: true,
    enableAudit: true,
    rateLimit: {
      requests: 10,
      window: 300, // 10 updates per 5 minutes
    },
  },
  updateConfigHandler
);
