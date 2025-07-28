
import React from 'react';
import RecommendationEngine from '@/components/ai-personalization/recommendation-engine';

export const dynamic = 'force-dynamic';

interface AIRecommendationsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function AIRecommendationsPage({ 
  searchParams 
}: AIRecommendationsPageProps) {
  // In a real app, you'd get these from authentication
  const userId = searchParams?.userId as string || "user_123";
  const tenantId = searchParams?.tenantId as string || "tenant_123";
  const placement = searchParams?.placement as string || "recommendations_page";

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <RecommendationEngine 
        userId={userId}
        tenantId={tenantId}
        placement={placement}
        className="min-h-screen"
      />
    </div>
  );
}
