
export const dynamic = "force-dynamic";

import { Suspense } from 'react';
import { IntegrationManagementDashboard } from '@/components/api/integration-management-dashboard';
import { RefreshCw } from 'lucide-react';

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center h-64">
      <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
    </div>
  );
}

// Mock tenant ID - in a real app, this would come from session/auth
const MOCK_TENANT_ID = "tenant_123456789";

export default function IntegrationManagementPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <IntegrationManagementDashboard tenantId={MOCK_TENANT_ID} />
    </Suspense>
  );
}
