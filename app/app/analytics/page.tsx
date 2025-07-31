
import { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import AnalyticsDashboard from '@/components/analytics-dashboard';

export const metadata: Metadata = {
  title: 'Analytics Dashboard - Mr. RE:commerce',
  description: 'Comprehensive analytics and insights for your enterprise search platform',
};

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-8">
        <AnalyticsDashboard />
      </main>
      <Footer />
    </div>
  );
}
