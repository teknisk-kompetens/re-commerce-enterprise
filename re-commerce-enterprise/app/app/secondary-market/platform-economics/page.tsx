
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PlatformEconomicsMonitoring from '@/components/secondary-market/platform-economics-monitoring';

export const metadata: Metadata = {
  title: 'Platform Economics - Re-Commerce Enterprise',
  description: 'Monitor platform health, performance, and economic indicators',
};

export default async function PlatformEconomicsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  // Check if user has admin permissions for platform economics
  if (!session.user?.role || session.user.role !== 'admin') {
    redirect('/secondary-market?error=unauthorized');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PlatformEconomicsMonitoring 
        tenantId={session.user.tenantId || 'default'}
        userRole={session.user.role}
      />
    </div>
  );
}

