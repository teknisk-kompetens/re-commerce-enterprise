
'use client';

import { Suspense } from 'react';
import { PricingCalculatorTool } from '@/components/sales/pricing-calculator-tool';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';

export default function PricingCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Suspense fallback={<DashboardSkeleton />}>
        <PricingCalculatorTool />
      </Suspense>
    </div>
  );
}
