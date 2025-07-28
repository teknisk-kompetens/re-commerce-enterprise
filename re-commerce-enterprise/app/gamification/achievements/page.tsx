
import { Metadata } from 'next';
import AchievementShowcaseDashboard from '@/components/gamification/achievement-showcase-dashboard';

export const metadata: Metadata = {
  title: 'Achievements | Enterprise Platform',
  description: 'Discover, unlock, and showcase your achievements. Track your progress and compete with others.',
};

export default function AchievementsPage() {
  return <AchievementShowcaseDashboard />;
}
