
'use client';

import { NavigationProvider } from '@/components/navigation/navigation-context';
import { UpdatedMainNavigation } from '@/components/navigation/updated-main-navigation';
import { SecondaryNavigation } from '@/components/navigation/secondary-navigation';
import { BreadcrumbNavigation } from '@/components/navigation/breadcrumb-navigation';
import { ContextualActionBar } from '@/components/navigation/contextual-action-bar';
import { BootstrapClient } from '@/components/bootstrap-client';

interface NewEnterpriseLayoutProps {
  children: React.ReactNode;
  useSceneNavigation?: boolean;
}

function NewEnterpriseLayoutContent({ children, useSceneNavigation = false }: NewEnterpriseLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Bootstrap Client Component */}
      <BootstrapClient />
      
      {/* Main Navigation Header - No sidebar references */}
      <UpdatedMainNavigation />
      
      {/* Secondary Contextual Navigation - Only if not using scene navigation */}
      {!useSceneNavigation && <SecondaryNavigation />}
      
      {/* Main Content Area - Full width without sidebar margin */}
      <div className="w-full">
        {!useSceneNavigation && (
          <>
            {/* Breadcrumb Navigation */}
            <BreadcrumbNavigation />
            
            {/* Contextual Action Bar */}
            <ContextualActionBar />
            
            {/* Page Content with traditional layout */}
            <main className="bg-white" style={{ minHeight: 'calc(100vh - 160px)' }}>
              {children}
            </main>
          </>
        )}
        
        {/* Scene-based content - full screen */}
        {useSceneNavigation && (
          <main className="w-full">
            {children}
          </main>
        )}
      </div>
    </div>
  );
}

export function NewEnterpriseLayout({ children, useSceneNavigation = false }: NewEnterpriseLayoutProps) {
  return (
    <NavigationProvider>
      <NewEnterpriseLayoutContent useSceneNavigation={useSceneNavigation}>
        {children}
      </NewEnterpriseLayoutContent>
    </NavigationProvider>
  );
}
