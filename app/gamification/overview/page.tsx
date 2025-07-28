
import { Metadata } from 'next';
import GamificationOverviewDashboard from '@/components/gamification/gamification-overview-dashboard';

export const metadata: Metadata = {
  title: 'Gamification Overview | Enterprise Platform',
  description: 'Track your progress, earn rewards, and compete with others in our comprehensive gamification system',
};

export default function GamificationOverviewPage() {
  return <GamificationOverviewDashboard />;
}
