
import React from 'react';
import { TenantProvisioningInterface } from '@/components/multi-tenant/tenant-provisioning-interface';

export const dynamic = 'force-dynamic';

export default function TenantProvisioningPage() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <TenantProvisioningInterface />
    </div>
  );
}
