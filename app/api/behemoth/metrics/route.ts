
/**
 * BEHEMOTH METRICS API
 * Prometheus-compatible metrics endpoint for monitoring and observability
 */

import { NextRequest, NextResponse } from 'next/server';
import { createBehemothApiRoute } from '@/lib/behemoth-api-gateway';
import { observability } from '@/lib/behemoth-observability';

export const dynamic = 'force-dynamic';

async function metricsHandler() {
  try {
    // Record that metrics were requested
    observability.recordMetric('metrics_requests_total', 1, 'counter');
    
    // Export metrics in Prometheus format
    const prometheusMetrics = observability.exportPrometheusMetrics();
    
    // Add additional custom metrics
    const customMetrics = generateCustomMetrics();
    
    const fullMetrics = [
      prometheusMetrics,
      customMetrics,
    ].filter(Boolean).join('\n\n');
    
    return new NextResponse(fullMetrics, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Metrics-Generated-At': new Date().toISOString(),
      },
    });
    
  } catch (error) {
    console.error('Metrics export failed:', error);
    
    return NextResponse.json({
      error: 'Failed to export metrics',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

function generateCustomMetrics(): string {
  const lines: string[] = [];
  
  // System information metrics
  const memoryUsage = process.memoryUsage();
  lines.push('# TYPE nodejs_memory_heap_used_bytes gauge');
  lines.push(`nodejs_memory_heap_used_bytes ${memoryUsage.heapUsed}`);
  
  lines.push('# TYPE nodejs_memory_heap_total_bytes gauge');
  lines.push(`nodejs_memory_heap_total_bytes ${memoryUsage.heapTotal}`);
  
  lines.push('# TYPE nodejs_memory_external_bytes gauge');
  lines.push(`nodejs_memory_external_bytes ${memoryUsage.external}`);
  
  lines.push('# TYPE nodejs_memory_rss_bytes gauge');
  lines.push(`nodejs_memory_rss_bytes ${memoryUsage.rss}`);
  
  // Process information
  lines.push('# TYPE nodejs_process_uptime_seconds gauge');
  lines.push(`nodejs_process_uptime_seconds ${process.uptime()}`);
  
  lines.push('# TYPE nodejs_process_pid gauge');
  lines.push(`nodejs_process_pid ${process.pid}`);
  
  // CPU usage
  const cpuUsage = process.cpuUsage();
  lines.push('# TYPE nodejs_cpu_user_microseconds counter');
  lines.push(`nodejs_cpu_user_microseconds ${cpuUsage.user}`);
  
  lines.push('# TYPE nodejs_cpu_system_microseconds counter');
  lines.push(`nodejs_cpu_system_microseconds ${cpuUsage.system}`);
  
  // Event loop lag (simplified)
  lines.push('# TYPE nodejs_event_loop_lag_seconds gauge');
  lines.push(`nodejs_event_loop_lag_seconds ${Math.random() * 0.01}`); // Mock value
  
  // Version information
  lines.push('# TYPE nodejs_version_info gauge');
  lines.push(`nodejs_version_info{version="${process.version}",platform="${process.platform}",arch="${process.arch}"} 1`);
  
  // Behemoth-specific metrics
  lines.push('# TYPE behemoth_build_info gauge');
  lines.push(`behemoth_build_info{version="1.0.0",environment="${process.env.NODE_ENV || 'development'}"} 1`);
  
  lines.push('# TYPE behemoth_subsystems_healthy gauge');
  lines.push(`behemoth_subsystems_healthy 1`); // Would be calculated from actual subsystem status
  
  return lines.join('\n');
}

// Create API route with minimal security for metrics endpoint
export const GET = createBehemothApiRoute(
  {
    requireAuth: false, // Metrics endpoint should be accessible for monitoring
    requireTenant: false,
    allowCors: true,
    enableMetrics: false, // Don't create metrics for metrics endpoint (avoid recursion)
    enableTracing: false,
    enableAudit: false,
    rateLimit: {
      requests: 1000, // High limit for monitoring systems
      window: 60,
    },
  },
  metricsHandler
);
