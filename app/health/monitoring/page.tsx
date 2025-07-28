
/**
 * SYSTEM HEALTH MONITORING PAGE
 * System health, uptime monitoring, and incident management
 */

import { Metadata } from 'next';
import { SystemHealthDashboard } from '@/components/health/system-health-dashboard';

export const metadata: Metadata = {
  title: 'System Health Monitoring | Enterprise Platform',
  description: 'Uptime monitoring, error tracking, alert management, and incident response',
};

export default function SystemHealthMonitoringPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <SystemHealthDashboard />
    </div>
  );
}
