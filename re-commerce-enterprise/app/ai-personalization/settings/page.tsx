
import React from 'react';
import PersonalizationSettings from '@/components/ai-personalization/personalization-settings';

export const dynamic = 'force-dynamic';

interface PersonalizationSettingsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function PersonalizationSettingsPage({ 
  searchParams 
}: PersonalizationSettingsPageProps) {
  // In a real app, you'd get these from authentication
  const userId = searchParams?.userId as string || "user_123";
  const tenantId = searchParams?.tenantId as string || "tenant_123";

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PersonalizationSettings 
        userId={userId}
        tenantId={tenantId}
        className="min-h-screen"
      />
    </div>
  );
}
