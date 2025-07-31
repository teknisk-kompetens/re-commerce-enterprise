
import Header from '@/components/header';
import ContactPage from '@/components/contact-page';
import Footer from '@/components/footer';

export const metadata = {
  title: 'Kontakt | Mr. RE:commerce CaaS Platform',
  description: 'Kontakta Mr. RE:commerce för frågor om vår CaaS-plattform och AI-medvetanden. Vi hjälper dig gärna.',
};

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <ContactPage />
      </main>
      <Footer />
    </div>
  );
}
