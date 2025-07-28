
import { Metadata } from 'next';
import LeaderboardsDashboard from '@/components/gamification/leaderboards-dashboard';

export const metadata: Metadata = {
  title: 'Leaderboards & Competitions | Enterprise Platform',
  description: 'Compete with others, climb the rankings, and win amazing prizes',
};

export default function LeaderboardsPage() {
  return <LeaderboardsDashboard />;
}
