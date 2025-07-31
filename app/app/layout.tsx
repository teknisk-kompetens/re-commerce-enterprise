
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Providers from '@/components/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mr. RE:commerce - Intelligent Enterprise Search Platform',
  description: 'Upptäck kunskaper med AI-driven sökning och community-baserad diskussion. Enterprise-ready sökplattform med Vera, Luna och Axel AI-assistenter.',
  keywords: 'enterprise search, AI search, intelligent discovery, business knowledge, community platform',
  authors: [{ name: 'Mr. RE:commerce Team' }],
  creator: 'Mr. RE:commerce',
  publisher: 'Mr. RE:commerce',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://mr.re-commerce.se',
    title: 'Mr. RE:commerce - Intelligent Enterprise Search Platform',
    description: 'Upptäck kunskaper med AI-driven sökning och community-baserad diskussion.',
    siteName: 'Mr. RE:commerce'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mr. RE:commerce - Intelligent Enterprise Search Platform',
    description: 'Upptäck kunskaper med AI-driven sökning och community-baserad diskussion.'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
