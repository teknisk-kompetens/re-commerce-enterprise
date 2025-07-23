
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 're:commerce - Plattformsinnovatörer för Enterprise SaaS',
  description: 'Från digitala arkitekter till plattformsinnovatörer. Vi bygger Enterprise SaaS-lösningar som förvandlar digitalt brus till mätbar vinst med 15+ års precision inom teknisk SEO och AI-automation.',
  keywords: 'Enterprise SaaS, plattformsinnovatörer, AI automation, teknisk SEO, digital transformation, LeadsGen, Enterprise Suite, AI Suite, re:commerce',
  authors: [{ name: 're:commerce Team' }],
  creator: 're:commerce',
  publisher: 're:commerce',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-token',
  },
  openGraph: {
    title: 're:commerce - Plattformsinnovatörer för Enterprise SaaS',
    description: 'Från digitala arkitekter till plattformsinnovatörer. Enterprise SaaS-lösningar som förvandlar digitalt brus till mätbar vinst.',
    type: 'website',
    locale: 'sv_SE',
    url: 'https://re-commerce.se',
    siteName: 're:commerce',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 're:commerce - Enterprise SaaS Plattformsinnovatörer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 're:commerce - Plattformsinnovatörer för Enterprise SaaS',
    description: 'Enterprise SaaS-lösningar som förvandlar digitalt brus till mätbar vinst med AI-automation och teknisk SEO.',
    images: ['/twitter-image.jpg'],
    creator: '@recommerce',
  },
  alternates: {
    canonical: 'https://re-commerce.se',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" className="scroll-smooth" dir="ltr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#1D4ED8" />
        <meta name="msapplication-TileColor" content="#1D4ED8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${poppins.className} antialiased`}>
        <div id="skip-to-content">
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Hoppa till huvudinnehåll
          </a>
        </div>
        <div id="main-content">
          {children}
        </div>
        <div id="announcements" aria-live="polite" aria-atomic="true" className="sr-only"></div>
      </body>
    </html>
  )
}
