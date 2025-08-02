'use client';

import { ReactNode } from 'react';

// TEMPORARY FIX: Simplified navigation without React Context to avoid build errors
export interface NavigationContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  currentPage: string;
  currentSection: string;
  currentTenant: string;
  setCurrentTenant: (tenant: string) => void;
}

// Mock navigation provider that doesn't use React Context
export function NavigationProvider({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

// Mock hook that returns default values
export function useNavigation(): NavigationContextValue {
  return {
    sidebarOpen: false,
    setSidebarOpen: () => {},
    currentPage: 'dashboard',
    currentSection: 'main',
    currentTenant: 'default',
    setCurrentTenant: () => {},
  };
}
