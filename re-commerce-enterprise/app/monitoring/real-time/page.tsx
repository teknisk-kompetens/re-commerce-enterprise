
/**
 * REAL-TIME MONITORING PAGE
 * Live system metrics and monitoring dashboard
 */

import { Metadata } from 'next';
import { RealtimeMonitoringDashboard } from '@/components/monitoring/real-time-monitoring-dashboard';

export const metadata: Metadata = {
  title: 'Real-time Monitoring | Enterprise Platform',
  description: 'Live system metrics, alerts, and resource usage monitoring',
};

export default function RealtimeMonitoringPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <RealtimeMonitoringDashboard />
    </div>
  );
}
