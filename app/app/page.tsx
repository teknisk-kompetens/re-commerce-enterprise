
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import ConsciousnessShowcase from '@/components/consciousness-showcase';
import SecurityOverview from '@/components/security-overview';
import Footer from '@/components/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ConsciousnessShowcase />
        <SecurityOverview />
      </main>
      <Footer />
    </div>
  );
}
