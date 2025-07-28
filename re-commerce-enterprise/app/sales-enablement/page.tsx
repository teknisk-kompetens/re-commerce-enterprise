
'use client';

import { Suspense } from 'react';
import { SalesEnablementDashboard } from '@/components/sales/sales-enablement-dashboard';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';

export default function SalesEnablementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Suspense fallback={<DashboardSkeleton />}>
        <SalesEnablementDashboard />
      </Suspense>
    </div>
  );
}
