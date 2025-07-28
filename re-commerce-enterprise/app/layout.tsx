
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Re-Commerce Enterprise - Advanced UI/UX Platform',
  description: 'Enterprise-grade platform with WCAG 2.1 accessibility, enhanced animations, mobile-first responsive design, and premium user experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Skip Link for Accessibility */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
      </head>
      <body className={inter.className}>
        <main id="main-content" role="main">
          {children}
        </main>
      </body>
    </html>
  )
}
