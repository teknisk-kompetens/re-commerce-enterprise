
'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { TenantProvider } from '@/lib/tenant-context-enhanced';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider
        refetchInterval={5 * 60} // Refetch session every 5 minutes
        refetchOnWindowFocus={true}
      >
        <TenantProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                duration: 4000,
                className: 'toast',
              }}
            />
          </ThemeProvider>
        </TenantProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
