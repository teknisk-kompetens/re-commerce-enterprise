
/**
 * SECURITY CENTER PAGE
 * Centraliserad säkerhetshantering och monitoring
 */

import React from 'react';
import { Metadata } from 'next';
import SecurityMonitoringDashboard from '@/components/security/security-monitoring-dashboard';

export const metadata: Metadata = {
  title: 'Security Center - Re-Commerce Enterprise',
  description: 'Centraliserad säkerhetshantering och monitoring för enterprise-plattformen',
};

export default function SecurityCenterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <SecurityMonitoringDashboard />
    </div>
  );
}
