
'use client';

import { usePathname } from 'next/navigation';
import { EnterpriseHeader } from '@/components/navigation/enterprise-header';
import { ErrorBoundary } from '@/components/error-boundary';
import { BootstrapClient } from '@/components/bootstrap-client';

interface EnterpriseLayoutWrapperProps {
  children: React.ReactNode;
}

// Scene-based pages that should have full-screen layout
const sceneBasedPages = [
  '/dashboard'
];

// Pages that should have minimal header only
const minimalHeaderPages = [
  '/widget-factory'
];

export function EnterpriseLayoutWrapper({ children }: EnterpriseLayoutWrapperProps) {
  const pathname = usePathname();
  
  const isScenePage = sceneBasedPages.some(page => pathname.startsWith(page));
  const isMinimalPage = minimalHeaderPages.some(page => pathname.startsWith(page));

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Bootstrap Client for enterprise features */}
        <BootstrapClient />
        
        {/* Enterprise Header - Always show unless it's a scene-based page */}
        {!isScenePage && <EnterpriseHeader />}
        
        {/* Main Content */}
        <main className={`${
          isScenePage 
            ? 'h-screen w-full' 
            : isMinimalPage 
              ? 'min-h-screen' 
              : 'min-h-[calc(100vh-4rem)]'
        }`}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        
        {/* Footer for non-scene pages */}
        {!isScenePage && !isMinimalPage && (
          <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    © 2024 Re-Commerce Enterprise. All rights reserved.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 dark:text-green-400">
                      All Systems Operational
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Enterprise Platform v2.0</span>
                  <span>•</span>
                  <span>WCAG 2.1 AA Compliant</span>
                </div>
              </div>
            </div>
          </footer>
        )}
      </div>
    </ErrorBoundary>
  );
}
