
export const dynamic = "force-dynamic";

import { Suspense } from 'react';
import { APIExplorerDashboard } from '@/components/api/api-explorer-dashboard';
import { RefreshCw } from 'lucide-react';

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );
}

export default function APIExplorerPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <APIExplorerDashboard />
    </Suspense>
  );
}
