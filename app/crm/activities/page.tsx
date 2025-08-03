

// ============================================================================
// ENTERPRISE CRM - ACTIVITIES MODULE
// Activity Timeline and Task Management
// ============================================================================

import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Filter, Calendar, Phone, Mail, MessageSquare, FileText, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export const metadata: Metadata = {
  title: 'Activities - CRM',
  description: 'Track calls, meetings, emails, and other customer interactions.'
}

// Mock data
const mockActivities = [
  {
    id: '1',
    type: 'call',
    title: 'Follow-up call with John Smith',
    description: 'Discussed project requirements and timeline',
    contact: 'John Smith',
    company: 'Acme Corporation',
    date: '2024-01-15T10:30:00',
    duration: '45 min',
    owner: 'Sarah Johnson',
    status: 'completed'
  },
  {
    id: '2',
    type: 'email',
    title: 'Proposal sent to TechStart Inc',
    description: 'Sent detailed proposal with pricing and implementation timeline',
    contact: 'Michael Chen',
    company: 'TechStart Inc',
    date: '2024-01-14T14:15:00',
    owner: 'David Wilson',
    status: 'completed'
  },
  {
    id: '3',
    type: 'meeting',
    title: 'Demo presentation for Enterprise Org',
    description: 'Product demonstration and Q&A session',
    contact: 'Emily Davis',
    company: 'Enterprise Org',
    date: '2024-01-16T15:00:00',
    duration: '60 min',
    owner: 'Sarah Johnson',
    status: 'scheduled'
  },
  {
    id: '4',
    type: 'task',
    title: 'Prepare contract for Acme Corp',
    description: 'Create and review legal documents for enterprise license',
    contact: 'John Smith',
    company: 'Acme Corporation',
    date: '2024-01-17T09:00:00',
    owner: 'Michael Chen',
    status: 'pending'
  }
]

export default function ActivitiesPage() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone
      case 'email': return Mail  
      case 'meeting': return Calendar
      case 'task': return FileText
      default: return MessageSquare
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call': return 'bg-blue-100 text-blue-600'
      case 'email': return 'bg-green-100 text-green-600'
      case 'meeting': return 'bg-purple-100 text-purple-600'
      case 'task': return 'bg-orange-100 text-orange-600'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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
                <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
                <p className="text-gray-600 mt-1">
                  Track and manage all customer interactions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Calendar View
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Log Activity
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Calls</p>
                  <p className="text-2xl font-bold text-blue-600">8</p>
                </div>
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Emails Sent</p>
                  <p className="text-2xl font-bold text-green-600">24</p>
                </div>
                <Mail className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Meetings</p>
                  <p className="text-2xl font-bold text-purple-600">5</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tasks Due</p>
                  <p className="text-2xl font-bold text-orange-600">12</p>
                </div>
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search activities by title, contact, or company..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Activities Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivities.map((activity, index) => {
                const IconComponent = getActivityIcon(activity.type)
                const isLast = index === mockActivities.length - 1
                
                return (
                  <div key={activity.id} className="relative flex items-start space-x-4">
                    {/* Timeline Line */}
                    {!isLast && (
                      <div className="absolute left-6 top-12 w-px h-16 bg-gray-200"></div>
                    )}
                    
                    {/* Activity Icon */}
                    <div className={`p-3 rounded-full ${getActivityColor(activity.type)}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    
                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                          <Badge className={getStatusColor(activity.status)}>
                            {activity.status}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{activity.contact}</span>
                          <span>•</span>
                          <span>{activity.company}</span>
                          <span>•</span>
                          <span>by {activity.owner}</span>
                          {activity.duration && (
                            <>
                              <span>•</span>
                              <span>{activity.duration}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
