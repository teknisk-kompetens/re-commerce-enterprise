
/**
 * ADVANCED ANALYTICS PAGE
 * Comprehensive analytics dashboard with user engagement and business metrics
 */

import { Metadata } from 'next';
import { AdvancedAnalyticsDashboard } from '@/components/analytics/advanced-analytics-dashboard';

export const metadata: Metadata = {
  title: 'Advanced Analytics | Enterprise Platform',
  description: 'User engagement, feature usage, conversion funnels, and revenue analytics',
};

export default function AdvancedAnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <AdvancedAnalyticsDashboard />
    </div>
  );
}
