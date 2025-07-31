
import Header from '@/components/header';
import ConsciousnessesPage from '@/components/consciousnesses-page';
import Footer from '@/components/footer';

export const metadata = {
  title: 'AI-Medvetanden | Mr. RE:commerce CaaS Platform',
  description: 'Utforska våra tre unika AI-medvetanden: Vera (emotionell intelligens), Luna (kreativ intelligens) och Axel (teknisk expert).',
};

export default function Consciousnesses() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ConsciousnessesPage />
      </main>
      <Footer />
    </div>
  );
}
