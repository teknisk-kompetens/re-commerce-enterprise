
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { Tenant } from '@prisma/client';

interface TenantContextType {
  tenant: Tenant | null;
  tenantId: string | null;
  isLoading: boolean;
  error: string | null;
  switchTenant: (tenantId: string) => Promise<void>;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export function TenantProvider({ children }: TenantProviderProps) {
  const { data: session, status } = useSession();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenant = async (tenantId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/tenants/${tenantId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tenant: ${response.statusText}`);
      }

      const tenantData = await response.json();
      setTenant(tenantData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tenant';
      setError(errorMessage);
      console.error('Tenant fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const switchTenant = async (newTenantId: string) => {
    try {
      setError(null);
      
      // Validate user has access to this tenant
      const response = await fetch('/api/tenant/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tenantId: newTenantId }),
      });

      if (!response.ok) {
        throw new Error('Failed to switch tenant');
      }

      await fetchTenant(newTenantId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to switch tenant';
      setError(errorMessage);
      throw err;
    }
  };

  const refreshTenant = async () => {
    if (session?.user?.tenantId) {
      await fetchTenant(session.user.tenantId);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.tenantId) {
      fetchTenant(session.user.tenantId);
    } else if (status === 'unauthenticated') {
      setTenant(null);
      setIsLoading(false);
    }
  }, [session?.user?.tenantId, status]);

  const contextValue: TenantContextType = {
    tenant,
    tenantId: session?.user?.tenantId || null,
    isLoading: isLoading || status === 'loading',
    error,
    switchTenant,
    refreshTenant,
  };

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

export function useTenantId(): string | null {
  const { tenantId } = useTenant();
  return tenantId;
}

export function useRequiredTenant() {
  const { tenant, tenantId, isLoading, error } = useTenant();
  
  if (isLoading) {
    throw new Error('Tenant is still loading');
  }
  
  if (error) {
    throw new Error(`Tenant error: ${error}`);
  }
  
  if (!tenant || !tenantId) {
    throw new Error('Tenant is required but not available');
  }
  
  return { tenant, tenantId };
}
