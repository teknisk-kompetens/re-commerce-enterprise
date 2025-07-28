
'use client';

import { Suspense } from 'react';
import { PresentationBuilderStudio } from '@/components/sales/presentation-builder-studio';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';

export default function PresentationBuilderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Suspense fallback={<DashboardSkeleton />}>
        <PresentationBuilderStudio />
      </Suspense>
    </div>
  );
}
