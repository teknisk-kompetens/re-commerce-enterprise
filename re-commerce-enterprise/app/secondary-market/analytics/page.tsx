
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-config';
import RevenueAnalyticsDashboard from '@/components/secondary-market/revenue-analytics-dashboard-simple';

export const metadata: Metadata = {
  title: 'Revenue Analytics - Re-Commerce Enterprise',
  description: 'Comprehensive insights into platform revenue and market performance',
};

export default async function RevenueAnalyticsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  // Check if user has analytics permissions
  if (!session.user?.role || !['creator', 'admin', 'analyst'].includes(session.user.role)) {
    redirect('/secondary-market?error=unauthorized');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <RevenueAnalyticsDashboard 
        userId={session.user.id}
        userRole={session.user.role}
        tenantId={session.user.tenantId || 'default'}
      />
    </div>
  );
}

