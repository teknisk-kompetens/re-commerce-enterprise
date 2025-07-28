
'use client';

import { Suspense } from 'react';
import { WidgetFactoryWorkspace } from '@/components/widget-factory/widget-factory-workspace';
import { LoadingStates } from '@/components/loading-states';
import { ErrorBoundary, PageErrorFallback } from '@/components/error-boundary';

export default function WidgetFactoryPage() {
  return (
    <ErrorBoundary fallback={PageErrorFallback}>
      <div 
        className="h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 overflow-hidden"
        role="main"
        aria-label="Widget Factory - Advanced widget creation workspace"
      >
        <Suspense 
          fallback={
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto">
                  <svg 
                    className="w-8 h-8 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Initializing Widget Factory
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Setting up canvas, collaboration, and systems...
                  </p>
                </div>
                <div className="w-48 mx-auto">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <WidgetFactoryWorkspace />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
