

// ============================================================================
// ENTERPRISE CRM MODULE - MAIN PAGE
// Integrated Customer Relationship Management System
// ============================================================================

import { Metadata } from 'next'
import Link from 'next/link'
import { Users, Building2, FileText, Calendar, TrendingUp, Plus, ArrowUpRight, BarChart3, Hash } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'CRM - Customer Relationship Management',
  description: 'Comprehensive CRM system for managing contacts, companies, deals, and customer relationships.'
}

// Mock data for demonstration - will be replaced with real data
const mockMetrics = {
  totalContacts: 2847,
  totalCompanies: 452,
  totalDeals: 89,
  totalRevenue: 2450000,
  recentActivities: [
    { id: 1, type: 'contact', title: 'New contact added: John Smith', time: '2 hours ago' },
    { id: 2, type: 'deal', title: 'Deal updated: Enterprise License', time: '4 hours ago' },
    { id: 3, type: 'company', title: 'Company added: Acme Corp', time: '1 day ago' },
  ]
}

const crmModules = [
  {
    id: 'contacts',
    title: 'Contacts',
    description: 'Manage individual contacts and prospects',
    icon: Users,
    href: '/crm/contacts',
    count: mockMetrics.totalContacts,
    color: 'blue'
  },
  {
    id: 'companies',
    title: 'Companies',
    description: 'Manage company accounts and organizations',
    icon: Building2,
    href: '/crm/companies', 
    count: mockMetrics.totalCompanies,
    color: 'green'
  },
  {
    id: 'deals',
    title: 'Sales Pipeline',
    description: 'Track sales opportunities and pipeline',
    icon: TrendingUp,
    href: '/crm/deals',
    count: mockMetrics.totalDeals,
    color: 'purple'
  },
  {
    id: 'activities',
    title: 'Activities',
    description: 'Track calls, meetings, and interactions',
    icon: Calendar,
    href: '/crm/activities',
    count: 156,
    color: 'orange'
  },
  {
    id: 'analytics',
    title: 'Analytics Dashboard',
    description: 'Advanced insights and business intelligence',
    icon: BarChart3,
    href: '/crm/analytics',
    count: 'Live',
    color: 'indigo'
  },
  {
    id: 'tags',
    title: 'Tags Management',
    description: 'Organize and categorize CRM data',
    icon: Hash,
    href: '/crm/tags',
    count: 26,
    color: 'pink'
  },
  {
    id: 'reports',
    title: 'Reports',
    description: 'Performance reports and analytics',
    icon: FileText,
    href: '/crm/reports',
    count: 12,
    color: 'red'
  }
]

export default function CRMPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Customer Relationship Management
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive CRM system for managing your customer relationships and sales pipeline
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Quick Add
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{mockMetrics.totalContacts.toLocaleString()}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{mockMetrics.totalCompanies.toLocaleString()}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{mockMetrics.totalDeals}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pipeline Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                ${(mockMetrics.totalRevenue / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +22% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CRM Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {crmModules.map((module) => {
            const IconComponent = module.icon
            return (
              <Link key={module.id} href={module.href}>
                <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-200">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg bg-${module.color}-100 group-hover:bg-${module.color}-200 transition-colors`}>
                        <IconComponent className={`w-6 h-6 text-${module.color}-600`} />
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {module.count.toLocaleString()}
                      </Badge>
                    </div>
                    <CardTitle className="group-hover:text-blue-600 transition-colors">
                      {module.title}
                    </CardTitle>
                    <CardDescription>
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="w-full justify-between group-hover:bg-blue-50">
                      Open {module.title}
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Activities
              <Link href="/crm/activities">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardTitle>
            <CardDescription>
              Latest updates and activities across your CRM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMetrics.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'contact' ? 'bg-blue-500' : 
                      activity.type === 'deal' ? 'bg-purple-500' : 'bg-green-500'
                    }`}></div>
                    <span className="text-sm text-gray-900">{activity.title}</span>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
