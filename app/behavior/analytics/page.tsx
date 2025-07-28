
/**
 * USER BEHAVIOR ANALYTICS PAGE
 * Deep user behavior insights and journey analysis
 */

import { Metadata } from 'next';
import { UserBehaviorDashboard } from '@/components/behavior/user-behavior-dashboard';

export const metadata: Metadata = {
  title: 'User Behavior Analytics | Enterprise Platform',
  description: 'User journey tracking, heatmap analysis, session recording, and A/B testing',
};

export default function UserBehaviorAnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <UserBehaviorDashboard />
    </div>
  );
}
