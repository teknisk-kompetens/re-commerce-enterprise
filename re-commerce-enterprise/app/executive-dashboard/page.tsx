
import { Suspense } from 'react';
import { ExecutiveDashboard } from '@/components/executive-dashboard';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';

export default function ExecutiveDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Suspense fallback={<DashboardSkeleton />}>
        <ExecutiveDashboard />
      </Suspense>
    </div>
  );
}
