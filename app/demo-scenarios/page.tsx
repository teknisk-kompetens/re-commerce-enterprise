
'use client';

import { Suspense } from 'react';
import { IndustryDemoScenarios } from '@/components/sales/industry-demo-scenarios';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';

export default function DemoScenariosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Suspense fallback={<DashboardSkeleton />}>
        <IndustryDemoScenarios />
      </Suspense>
    </div>
  );
}
