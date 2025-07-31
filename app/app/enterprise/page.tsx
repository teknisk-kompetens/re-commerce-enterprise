
import { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import EnterprisePage from '@/components/enterprise-page';

export const metadata: Metadata = {
  title: 'Enterprise Solutions - Mr. RE:commerce',
  description: 'Scalable enterprise search and knowledge management solutions',
};

export default function Enterprise() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <EnterprisePage />
      </main>
      <Footer />
    </div>
  );
}
