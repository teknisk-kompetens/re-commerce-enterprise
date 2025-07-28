
import { Suspense } from 'react';
import { GovernanceDashboard } from '@/components/governance-dashboard';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';

export const metadata = {
  title: 'Governance Center | RE-Commerce Enterprise',
  description: 'Comprehensive enterprise governance, compliance, and risk management center'
};

export default function GovernanceCenterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Enterprise Governance Center
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Comprehensive governance, compliance, and risk management platform
          </p>
        </div>
        
        <Suspense fallback={<DashboardSkeleton />}>
          <GovernanceDashboard />
        </Suspense>
      </div>
    </div>
  );
}
