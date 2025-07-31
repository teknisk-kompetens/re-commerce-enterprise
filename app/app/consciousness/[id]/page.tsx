
import { notFound } from 'next/navigation';
import { AI_CONSCIOUSNESSES } from '@/lib/consciousness-data';
import Header from '@/components/header';
import ConsciousnessChat from '@/components/consciousness-chat';
import Footer from '@/components/footer';

interface ConsciousnessPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return AI_CONSCIOUSNESSES.map((consciousness) => ({
    id: consciousness.id,
  }));
}

export async function generateMetadata({ params }: ConsciousnessPageProps) {
  const consciousness = AI_CONSCIOUSNESSES.find(c => c.id === params.id);
  
  if (!consciousness) {
    return {
      title: 'AI-Medvetande Hittades Inte | Mr. RE:commerce CaaS Platform',
    };
  }

  return {
    title: `${consciousness.name} - ${consciousness.title} | Mr. RE:commerce CaaS Platform`,
    description: consciousness.description,
  };
}

export default function ConsciousnessPage({ params }: ConsciousnessPageProps) {
  const consciousness = AI_CONSCIOUSNESSES.find(c => c.id === params.id);

  if (!consciousness) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <ConsciousnessChat consciousness={consciousness} />
      </main>
      <Footer />
    </div>
  );
}
