
'use client';

import { Suspense } from 'react';
import { CustomerSuccessCenter } from '@/components/sales/customer-success-center';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';

export default function CustomerSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Suspense fallback={<DashboardSkeleton />}>
        <CustomerSuccessCenter />
      </Suspense>
    </div>
  );
}
