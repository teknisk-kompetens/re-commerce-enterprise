
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap'
})

export const metadata = {
  title: 'showcase.re-commerce.se | Enterprise Platform Innovation',
  description: 'World-class enterprise e-commerce platform by re:Commerce Enterprise. 250+ customers, 500+ projects, 15+ years of excellence. Från Digitala Arkitekter till Plattformsinnovatörer.',
  keywords: 'enterprise ecommerce, SaaS platform, digital transformation, Swedish innovation, ALMI, BIZMAKER',
  openGraph: {
    title: 'showcase.re-commerce.se | Enterprise Platform Innovation',
    description: '250+ customers, 500+ projects, 15+ years of excellence in enterprise e-commerce',
    type: 'website',
    locale: 'sv_SE',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
