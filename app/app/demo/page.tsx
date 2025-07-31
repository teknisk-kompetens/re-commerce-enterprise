
import Header from '@/components/header';
import DemoPage from '@/components/demo-page';
import Footer from '@/components/footer';

export const metadata = {
  title: 'Interaktiv Demo | Mr. RE:commerce CaaS Platform',
  description: 'Upplev våra AI-medvetanden i aktion. Testa Vera, Luna och Axel genom vår interaktiva demo.',
};

export default function Demo() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <DemoPage />
      </main>
      <Footer />
    </div>
  );
}
