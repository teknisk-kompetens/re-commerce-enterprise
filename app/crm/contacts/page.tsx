

// ============================================================================
// ENTERPRISE CRM - CONTACTS MODULE
// Contact Management Interface
// ============================================================================

import { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ContactsTable } from './components/contacts-table'
import { ContactsFilters } from './components/contacts-filters'

export const metadata: Metadata = {
  title: 'Contacts - CRM',
  description: 'Manage your business contacts with advanced search and filtering capabilities.'
}

interface ContactsPageProps {
  searchParams: {
    page?: string
    limit?: string
    query?: string
    status?: string
    source?: string
    priority?: string
    company?: string
    tags?: string
    owner?: string
    sort?: string
    order?: string
  }
}

export default function ContactsPage({ searchParams }: ContactsPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/crm">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to CRM
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
                <p className="text-gray-600 mt-1">
                  Manage and organize your business contacts
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search contacts by name, email, or company..."
              className="pl-10"
              defaultValue={searchParams.query || ''}
            />
          </div>
          <div className="flex items-center gap-2">
            <ContactsFilters searchParams={searchParams} />
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Contacts Table */}
        <Suspense fallback={<ContactsTableSkeleton />}>
          <ContactsTable searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

// Loading skeleton component
function ContactsTableSkeleton() {
  return (
    <div className="bg-white rounded-lg border">
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
