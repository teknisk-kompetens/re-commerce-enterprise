
import React from 'react';
import DynamicContentManager from '@/components/ai-personalization/dynamic-content-manager';

export const dynamic = 'force-dynamic';

interface ContentManagerPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ContentManagerPage({ 
  searchParams 
}: ContentManagerPageProps) {
  // In a real app, you'd get these from authentication
  const tenantId = searchParams?.tenantId as string || "tenant_123";
  const userId = searchParams?.userId as string || "user_123";

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <DynamicContentManager 
        tenantId={tenantId}
        userId={userId}
        className="min-h-screen"
      />
    </div>
  );
}
