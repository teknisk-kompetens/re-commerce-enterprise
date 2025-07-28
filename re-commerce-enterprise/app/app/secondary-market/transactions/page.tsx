
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import TransactionManagementInterface from '@/components/secondary-market/transaction-management-interface';

export const metadata: Metadata = {
  title: 'Transaction Management - Re-Commerce Enterprise',
  description: 'Monitor your transactions, escrow accounts, and resolve disputes',
};

export default async function TransactionManagementPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TransactionManagementInterface 
        userId={session.user?.id}
        userRole={session.user?.role || 'user'}
      />
    </div>
  );
}

