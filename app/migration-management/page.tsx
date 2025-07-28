
import React from 'react';
import { MigrationManagementInterface } from '@/components/multi-tenant/migration-management-interface';

export const dynamic = 'force-dynamic';

export default function MigrationManagementPage() {
  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <MigrationManagementInterface />
    </div>
  );
}
