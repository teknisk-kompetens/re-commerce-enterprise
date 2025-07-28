
import React from 'react';
import PersonalizedDashboard from '@/components/ai-personalization/personalized-dashboard';

export const dynamic = 'force-dynamic';

interface AIPersonalizationDashboardPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function AIPersonalizationDashboardPage({ 
  searchParams 
}: AIPersonalizationDashboardPageProps) {
  // In a real app, you'd get these from authentication
  const userId = searchParams?.userId as string || "user_123";
  const tenantId = searchParams?.tenantId as string || "tenant_123";

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <PersonalizedDashboard 
        userId={userId}
        tenantId={tenantId}
        className="min-h-screen"
      />
    </div>
  );
}
