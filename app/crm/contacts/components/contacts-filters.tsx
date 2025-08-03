

// ============================================================================
// CONTACTS FILTERS COMPONENT
// Filter controls for contacts table
// ============================================================================

'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { X } from 'lucide-react'

interface ContactsFiltersProps {
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

export function ContactsFilters({ searchParams }: ContactsFiltersProps) {
  const activeFilters = []
  
  if (searchParams.status) activeFilters.push({ key: 'status', value: searchParams.status })
  if (searchParams.priority) activeFilters.push({ key: 'priority', value: searchParams.priority })
  if (searchParams.company) activeFilters.push({ key: 'company', value: searchParams.company })
  if (searchParams.tags) activeFilters.push({ key: 'tags', value: searchParams.tags })

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Status Filter */}
      <Select defaultValue={searchParams.status || 'all'}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="prospect">Prospect</SelectItem>
          <SelectItem value="customer">Customer</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>

      {/* Priority Filter */}
      <Select defaultValue={searchParams.priority || 'all'}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Priority</SelectItem>
          <SelectItem value="high">High</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="low">Low</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort Filter */}
      <Select defaultValue={searchParams.sort || 'name'}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="company">Company</SelectItem>
          <SelectItem value="created">Created</SelectItem>
          <SelectItem value="updated">Updated</SelectItem>
        </SelectContent>
      </Select>

      {/* Active Filter Tags */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-1">
          {activeFilters.map((filter) => (
            <Badge key={`${filter.key}-${filter.value}`} variant="secondary" className="flex items-center gap-1">
              {filter.key}: {filter.value}
              <Button variant="ghost" size="sm" className="h-auto p-0 w-4 h-4">
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" className="text-xs">
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}
