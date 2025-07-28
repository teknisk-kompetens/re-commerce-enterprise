import { Suspense } from 'react';
import { ComprehensiveDocumentationCenter } from '@/components/comprehensive-documentation-center';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';

export default function DocumentationCenterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Suspense fallback={<DashboardSkeleton />}>
        <ComprehensiveDocumentationCenter />
      </Suspense>
    </div>
  );
}
