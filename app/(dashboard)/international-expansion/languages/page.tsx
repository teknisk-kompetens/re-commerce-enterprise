
import React from 'react';
import { LanguageManagement } from '@/components/international-expansion';

export default function LanguageManagementPage() {
  // In a real app, you would get tenantId from session/auth
  const tenantId = "default-tenant-id";

  return (
    <div className="container mx-auto py-6">
      <LanguageManagement tenantId={tenantId} />
    </div>
  );
}
