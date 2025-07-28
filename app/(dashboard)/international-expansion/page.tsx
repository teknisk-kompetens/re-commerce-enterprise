
import React from 'react';
import { InternationalDashboard } from '@/components/international-expansion';

export default function InternationalExpansionPage() {
  // In a real app, you would get tenantId from session/auth
  const tenantId = "default-tenant-id";

  return (
    <div className="container mx-auto py-6">
      <InternationalDashboard tenantId={tenantId} />
    </div>
  );
}
