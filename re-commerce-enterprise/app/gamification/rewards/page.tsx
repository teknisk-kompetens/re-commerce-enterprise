
import { Metadata } from 'next';
import RewardsMarketplaceDashboard from '@/components/gamification/rewards-marketplace-dashboard';

export const metadata: Metadata = {
  title: 'Rewards Marketplace | Enterprise Platform',
  description: 'Redeem your hard-earned points for premium features, cosmetics, and real-world rewards',
};

export default function RewardsMarketplacePage() {
  return <RewardsMarketplaceDashboard />;
}
