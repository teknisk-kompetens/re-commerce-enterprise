
/**
 * PERFORMANCE METRICS PAGE
 * Application performance monitoring and optimization insights
 */

import { Metadata } from 'next';
import { PerformanceMetricsDashboard } from '@/components/performance/performance-metrics-dashboard';

export const metadata: Metadata = {
  title: 'Performance Metrics | Enterprise Platform',
  description: 'APM metrics, Core Web Vitals, database performance, and error tracking',
};

export default function PerformanceMetricsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <PerformanceMetricsDashboard />
    </div>
  );
}
