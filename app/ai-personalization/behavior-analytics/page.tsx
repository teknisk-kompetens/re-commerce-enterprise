
import React from 'react';
import BehaviorAnalytics from '@/components/ai-personalization/behavior-analytics';

export const dynamic = 'force-dynamic';

interface BehaviorAnalyticsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function BehaviorAnalyticsPage({ 
  searchParams 
}: BehaviorAnalyticsPageProps) {
  // In a real app, you'd get these from authentication
  const userId = searchParams?.userId as string || "user_123";
  const tenantId = searchParams?.tenantId as string || "tenant_123";

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <BehaviorAnalytics 
        userId={userId}
        tenantId={tenantId}
        className="min-h-screen"
      />
    </div>
  );
}
