
import React from 'react';
import { TenantManagementDashboard } from '@/components/multi-tenant/tenant-management-dashboard';

export const dynamic = 'force-dynamic';

export default function TenantManagementPage() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <TenantManagementDashboard />
    </div>
  );
}
