
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

// Tenant Configuration Type
export interface TenantConfig {
  id: string
  name: string
  domain: string
  subdomain: string
  isActive: boolean
  plan: string
  maxUsers: number
  settings?: any
  branding?: any
}

// Tenant Context Type
interface TenantContextType {
  tenant: TenantConfig | null
  isLoading: boolean
  error: string | null
  setTenant: (tenant: TenantConfig | null) => void
  refreshTenant: () => Promise<void>
}

// Create Tenant Context
const TenantContext = createContext<TenantContextType | undefined>(undefined)

// Custom hook to use tenant context
export const useTenant = () => {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

// Tenant Provider Component
export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<TenantConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Function to resolve tenant from current domain/subdomain
  const resolveTenant = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      // Get current hostname
      const hostname = window.location.hostname
      const fullHostname = window.location.host // includes port
      
      console.log('🔍 Resolving tenant for:', { hostname, fullHostname })
      
      // Extract subdomain and domain
      const parts = hostname.split('.')
      let subdomain = ''
      let domain = hostname

      // Handle subdomain extraction
      if (parts.length > 2) {
        subdomain = parts[0]
        domain = parts.slice(1).join('.')
      } else if (parts.length === 2 && parts[0] !== 'localhost') {
        subdomain = parts[0]
        domain = parts[1]
      }

      const requestData = { 
        hostname: fullHostname, 
        subdomain, 
        domain 
      }
      
      console.log('🌐 Tenant resolution request:', requestData)

      // Call API to resolve tenant
      const response = await fetch('/api/tenant/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      console.log('📡 API response status:', response.status)

      if (!response.ok) {
        throw new Error(`Failed to resolve tenant: ${response.status}`)
      }

      const data = await response.json()
      console.log('📦 API response data:', data)
      
      if (data.success && data.tenant) {
        console.log('✅ Tenant resolved successfully:', data.tenant.name)
        setTenant(data.tenant)
      } else {
        console.log('❌ Tenant resolution failed:', data.error)
        setError(data.error || 'Tenant not found')
      }
    } catch (err) {
      console.error('💥 Tenant resolution error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize tenant on mount
  useEffect(() => {
    resolveTenant()
  }, [])

  // Refresh tenant function
  const refreshTenant = async () => {
    await resolveTenant()
  }

  const value: TenantContextType = {
    tenant,
    isLoading,
    error,
    setTenant,
    refreshTenant,
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}

// Tenant Guard Component - Only render children if tenant is resolved
export function TenantGuard({ children }: { children: React.ReactNode }) {
  const { tenant, isLoading, error } = useTenant()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Tenant Error</h2>
          <p className="text-gray-600 mt-2">{error || 'No tenant found'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

// Tenant Info Component
export function TenantInfo() {
  const { tenant } = useTenant()
  
  if (!tenant) return null

  return (
    <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
      <span className="font-medium">{tenant.name}</span>
      <span className="text-gray-400 ml-2">({tenant.subdomain})</span>
    </div>
  )
}
