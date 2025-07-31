
import Header from '@/components/header';
import AboutPage from '@/components/about-page';
import Footer from '@/components/footer';

export const metadata = {
  title: 'Om Oss | Mr. RE:commerce CaaS Platform',
  description: 'Lär dig mer om Mr. RE:commerce och vår vision för Consciousness as a Service. Pionjärer inom AI-medvetanden och intelligent teknologi.',
};

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <AboutPage />
      </main>
      <Footer />
    </div>
  );
}
