
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { EnhancedNavigation } from '@/components/enhanced-navigation';
import { ErrorBoundary } from '@/components/error-boundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Re-Commerce Enterprise - Advanced Search Platform',
  description: 'Enterprise-grade e-commerce platform with intelligent search capabilities',
  keywords: ['enterprise', 'e-commerce', 'search', 'ai', 'analytics', 'dashboard'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <div className="relative flex min-h-screen flex-col">
              <EnhancedNavigation />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
