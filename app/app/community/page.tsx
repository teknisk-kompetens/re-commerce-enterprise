
import { Metadata } from 'next';
import Header from '@/components/header';
import Footer from '@/components/footer';
import CommunityPage from '@/components/community-page';

export const metadata: Metadata = {
  title: 'Community - Mr. RE:commerce',
  description: 'Join our community of professionals sharing knowledge and insights',
};

export default function Community() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <CommunityPage />
      </main>
      <Footer />
    </div>
  );
}
