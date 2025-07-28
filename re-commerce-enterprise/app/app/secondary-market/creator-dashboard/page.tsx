
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import CreatorMonetizationDashboard from '@/components/secondary-market/creator-monetization-dashboard';

export const metadata: Metadata = {
  title: 'Creator Dashboard - Re-Commerce Enterprise',
  description: 'Manage your monetization, subscribers, and creator profile',
};

export default async function CreatorDashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  // Check if user has creator permissions
  if (!session.user?.role || !['creator', 'admin'].includes(session.user.role)) {
    redirect('/secondary-market?error=unauthorized');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CreatorMonetizationDashboard 
        creatorId={session.user.id}
      />
    </div>
  );
}

