

// ============================================================================
// CONTACTS TABLE COMPONENT
// Data table for displaying and managing contacts
// ============================================================================

'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MoreHorizontal, Mail, Phone, Building2, Star, Edit, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  position?: string
  status: 'active' | 'inactive' | 'prospect' | 'customer'
  priority: 'low' | 'medium' | 'high'
  lastContact?: Date
  avatar?: string
  tags: string[]
}

// Mock data - will be replaced with real data fetching
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@acme.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corporation',
    position: 'CEO',
    status: 'customer',
    priority: 'high',
    lastContact: new Date('2024-01-15'),
    tags: ['VIP', 'Enterprise']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@techstart.io',
    phone: '+1 (555) 987-6543',
    company: 'TechStart Inc',
    position: 'CTO',
    status: 'prospect',
    priority: 'medium',
    lastContact: new Date('2024-01-10'),
    tags: ['Lead', 'Technology']
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'michael.chen@innovate.com',
    phone: '+1 (555) 456-7890',
    company: 'Innovate Solutions',
    position: 'VP Marketing',
    status: 'active',
    priority: 'medium',
    lastContact: new Date('2024-01-08'),
    tags: ['Marketing', 'Partnership']
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@startup.co',
    company: 'Startup Co',
    position: 'Founder',
    status: 'prospect',
    priority: 'high',
    tags: ['Founder', 'Early Stage']
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david.wilson@enterprise.org',
    phone: '+1 (555) 234-5678',
    company: 'Enterprise Org',
    position: 'Director of Sales',
    status: 'customer',
    priority: 'low',
    lastContact: new Date('2024-01-05'),
    tags: ['Sales', 'Long-term']
  }
]

interface ContactsTableProps {
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

export function ContactsTable({ searchParams }: ContactsTableProps) {
  const [contacts] = useState(mockContacts)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'customer': return 'bg-green-100 text-green-800'
      case 'prospect': return 'bg-blue-100 text-blue-800'
      case 'active': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Contacts ({contacts.length})</span>
          <div className="text-sm text-gray-500 font-normal">
            Showing {contacts.length} of {contacts.length} contacts
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.avatar} alt={contact.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getInitials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                    <Star className={`w-4 h-4 ${getPriorityColor(contact.priority)}`} fill="currentColor" />
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>{contact.email}</span>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3 h-3" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                    {contact.company && (
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-3 h-3" />
                        <span>{contact.company}</span>
                      </div>
                    )}
                  </div>
                  {contact.position && (
                    <p className="text-sm text-gray-500 mt-1">{contact.position}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <Badge className={getStatusColor(contact.status)}>
                    {contact.status}
                  </Badge>
                  {contact.lastContact && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last contact: {contact.lastContact.toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {contact.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {contact.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{contact.tags.length - 2}
                    </Badge>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Contact
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Contact
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
