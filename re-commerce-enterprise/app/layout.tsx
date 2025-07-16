
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { EnterpriseLayoutWrapper } from '@/components/enterprise-layout-wrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Re-Commerce Enterprise - Cinematic Scene Experience',
  description: 'Enterprise-grade platform with accessibility-first design, dark mode support, and immersive scene-based navigation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <EnterpriseLayoutWrapper>
            {children}
          </EnterpriseLayoutWrapper>
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
