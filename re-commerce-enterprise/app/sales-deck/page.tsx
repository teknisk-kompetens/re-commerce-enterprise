
'use client';

import { Suspense } from 'react';
import { InteractiveSalesDeck } from '@/components/sales/interactive-sales-deck';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';

export default function SalesDeckPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Suspense fallback={<DashboardSkeleton />}>
        <InteractiveSalesDeck />
      </Suspense>
    </div>
  );
}
