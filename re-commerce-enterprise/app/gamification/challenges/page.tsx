
import { Metadata } from 'next';
import DailyChallengesDashboard from '@/components/gamification/daily-challenges-dashboard';

export const metadata: Metadata = {
  title: 'Daily Challenges | Enterprise Platform',
  description: 'Complete daily challenges to earn rewards, maintain your streak, and level up your skills',
};

export default function DailyChallengesPage() {
  return <DailyChallengesDashboard />;
}
