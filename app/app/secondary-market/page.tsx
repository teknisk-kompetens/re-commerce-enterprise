
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import SecondaryMarketplaceDashboard from '@/components/secondary-market/secondary-marketplace-dashboard';

export const metadata: Metadata = {
  title: 'Secondary Marketplace - Re-Commerce Enterprise',
  description: 'Trade your digital assets in a secure, transparent secondary marketplace',
};

export default async function SecondaryMarketPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SecondaryMarketplaceDashboard 
        userId={session.user?.id}
        userRole={session.user?.role || 'user'}
      />
    </div>
  );
}

