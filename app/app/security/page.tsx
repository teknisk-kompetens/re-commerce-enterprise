
import Header from '@/components/header';
import SecurityPage from '@/components/security-page';
import Footer from '@/components/footer';

export const metadata = {
  title: 'Säkerhetsdashboard | Mr. RE:commerce CaaS Platform',
  description: 'Utforska våra avancerade säkerhetsprotokoll och klassificeringssystem för CaaS-plattformen.',
};

export default function Security() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <SecurityPage />
      </main>
      <Footer />
    </div>
  );
}
