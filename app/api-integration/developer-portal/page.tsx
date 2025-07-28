
export const dynamic = "force-dynamic";

import { Suspense } from 'react';
import { DeveloperPortalDashboard } from '@/components/api/developer-portal-dashboard';
import { RefreshCw } from 'lucide-react';

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );
}

// Mock developer ID - in a real app, this would come from session/auth
const MOCK_DEVELOPER_ID = "dev_123456789";

export default function DeveloperPortalPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <DeveloperPortalDashboard developerId={MOCK_DEVELOPER_ID} />
    </Suspense>
  );
}
