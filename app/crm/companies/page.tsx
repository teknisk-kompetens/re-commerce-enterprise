

// ============================================================================
// ENTERPRISE CRM - COMPANIES MODULE
// Company Account Management Interface
// ============================================================================

import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Filter, Download, Building2, TrendingUp, Users, DollarSign, MapPin, Globe, Phone, Mail, Star, Tag, MoreHorizontal, Edit, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Companies - CRM',
  description: 'Manage company accounts and organizational relationships.'
}

// Enhanced mock data with enterprise features
const mockCompanies = [
  {
    id: '1',
    name: 'Acme Corporation',
    domain: 'acme.com',
    industry: 'Technology',
    size: '1000-5000',
    revenue: '$50M-$100M',
    status: 'customer',
    contacts: 5,
    deals: 3,
    lastActivity: '2 days ago',
    location: 'San Francisco, CA',
    phone: '+1 (555) 123-4567',
    website: 'https://acme.com',
    founded: '2015',
    employees: 2500,
    tags: ['Enterprise', 'Tech Sector', 'High Priority'],
    healthScore: 95,
    totalValue: 145000,
    nextMeeting: '2024-02-15T14:00:00',
    description: 'Leading technology solutions provider specializing in enterprise software development and cloud infrastructure.',
    socialMedia: {
      linkedin: 'acme-corp',
      twitter: '@acmecorp'
    }
  },
  {
    id: '2',
    name: 'TechStart Inc',
    domain: 'techstart.io',
    industry: 'Software',
    size: '10-50',
    revenue: '$1M-$10M',
    status: 'prospect',
    contacts: 2,
    deals: 1,
    lastActivity: '1 week ago',
    location: 'Austin, TX',
    phone: '+1 (555) 987-6543',
    website: 'https://techstart.io',
    founded: '2020',
    employees: 25,
    tags: ['SMB', 'Software', 'Hot Lead'],
    healthScore: 72,
    totalValue: 45000,
    nextMeeting: '2024-02-20T10:30:00',
    description: 'Innovative startup developing next-generation software solutions for small to medium businesses.',
    socialMedia: {
      linkedin: 'techstart-inc',
      twitter: '@techstartio'
    }
  },
  {
    id: '3',
    name: 'Enterprise Org',
    domain: 'enterprise.org',
    industry: 'Manufacturing',
    size: '5000+',
    revenue: '$100M+',
    status: 'customer',
    contacts: 12,
    deals: 8,
    lastActivity: '1 day ago',
    location: 'Chicago, IL',
    phone: '+1 (555) 456-7890',
    website: 'https://enterprise.org',
    founded: '1985',
    employees: 15000,
    tags: ['Enterprise', 'Manufacturing', 'Strategic Account'],
    healthScore: 88,
    totalValue: 680000,
    nextMeeting: '2024-02-12T16:00:00',
    description: 'Fortune 500 manufacturing company with global operations and extensive supply chain management.',
    socialMedia: {
      linkedin: 'enterprise-org',
      twitter: '@enterpriseorg'
    }
  },
  {
    id: '4',
    name: 'Global Solutions Ltd',
    domain: 'globalsolutions.com',
    industry: 'Consulting',
    size: '500-1000',
    revenue: '$25M-$50M',
    status: 'qualified',
    contacts: 7,
    deals: 4,
    lastActivity: '3 days ago',
    location: 'New York, NY',
    phone: '+1 (555) 321-0987',
    website: 'https://globalsolutions.com',
    founded: '2010',
    employees: 750,
    tags: ['Mid-Market', 'Consulting', 'Q1 Target'],
    healthScore: 83,
    totalValue: 225000,
    nextMeeting: '2024-02-18T11:00:00',
    description: 'International consulting firm providing strategic advisory services to Fortune 1000 companies.',
    socialMedia: {
      linkedin: 'global-solutions-ltd',
      twitter: '@globalsolutions'
    }
  },
  {
    id: '5',
    name: 'Innovation Labs',
    domain: 'innovationlabs.co',
    industry: 'Research & Development',
    size: '100-500',
    revenue: '$10M-$25M',
    status: 'proposal',
    contacts: 3,
    deals: 2,
    lastActivity: '5 days ago',
    location: 'Boston, MA',
    phone: '+1 (555) 654-3210',
    website: 'https://innovationlabs.co',
    founded: '2018',
    employees: 180,
    tags: ['Mid-Market', 'R&D', 'Innovation'],
    healthScore: 76,
    totalValue: 95000,
    nextMeeting: '2024-02-25T13:30:00',
    description: 'Cutting-edge research and development company focused on breakthrough technologies and innovation.',
    socialMedia: {
      linkedin: 'innovation-labs',
      twitter: '@innovationlabs'
    }
  }
]

const companyStats = {
  total: mockCompanies.length,
  customers: mockCompanies.filter(c => c.status === 'customer').length,
  prospects: mockCompanies.filter(c => c.status === 'prospect').length,
  qualified: mockCompanies.filter(c => c.status === 'qualified').length,
  totalValue: mockCompanies.reduce((sum, c) => sum + c.totalValue, 0),
  avgHealthScore: Math.round(mockCompanies.reduce((sum, c) => sum + c.healthScore, 0) / mockCompanies.length)
}

export default function CompaniesPage() {
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
                <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
                <p className="text-gray-600 mt-1">
                  Manage company accounts and organizational relationships
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
                Add Company
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Company Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Companies</p>
                  <p className="text-3xl font-bold text-blue-600">{companyStats.total}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Customers</p>
                  <p className="text-3xl font-bold text-green-600">{companyStats.customers}</p>
                </div>
                <Star className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-3xl font-bold text-purple-600">${(companyStats.totalValue / 1000000).toFixed(1)}M</p>
                </div>
                <DollarSign className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Health Score</p>
                  <p className="text-3xl font-bold text-orange-600">{companyStats.avgHealthScore}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search companies by name, domain, industry, or location..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Tag className="w-4 h-4 mr-2" />
            Tags
          </Button>
        </div>

        {/* Enhanced Companies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockCompanies.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-blue-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{company.name}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Globe className="w-3 h-3" />
                        <span>{company.domain}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{company.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <Badge className={
                      company.status === 'customer' ? 'bg-green-100 text-green-800' :
                      company.status === 'prospect' ? 'bg-blue-100 text-blue-800' :
                      company.status === 'qualified' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }>
                      {company.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Company Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Industry</p>
                    <p className="font-medium">{company.industry}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Employees</p>
                    <p className="font-medium">{company.employees?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Founded</p>
                    <p className="font-medium">{company.founded}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Revenue</p>
                    <p className="font-medium">{company.revenue}</p>
                  </div>
                </div>

                {/* Health Score */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Health Score</span>
                    <span className={`font-medium ${
                      company.healthScore >= 80 ? 'text-green-600' :
                      company.healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {company.healthScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        company.healthScore >= 80 ? 'bg-green-500' :
                        company.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${company.healthScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {company.tags?.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {company.tags && company.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{company.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Key Metrics */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{company.contacts}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{company.deals}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-3 h-3" />
                      <span>${(company.totalValue / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="w-3 h-3" />
                  </Button>
                </div>

                {/* Last Activity */}
                <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
                  Last activity: {company.lastActivity}
                  {company.nextMeeting && (
                    <span className="block mt-1 text-blue-600 font-medium">
                      Next meeting: {new Date(company.nextMeeting).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
