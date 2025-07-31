
import Header from '@/components/header';
import MainSearchPage from '@/components/main-search-page';
import Footer from '@/components/footer';

export const metadata = {
  title: 'Mr. RE:commerce - Intelligent Enterprise Search & Discovery Platform',
  description: 'Upptäck kunskaper med AI-driven sökning. Vera, Luna och Axel hjälper dig hitta rätt information snabbt och intelligent.',
  keywords: 'enterprise search, AI search, intelligent discovery, business knowledge, Mr. RE:commerce'
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <MainSearchPage />
      </main>
      <Footer />
    </div>
  );
}
