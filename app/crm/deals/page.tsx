

// ============================================================================
// ENTERPRISE CRM - DEALS MODULE
// Sales Pipeline Management Interface
// ============================================================================

import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Plus, Search, Filter, Download, TrendingUp, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export const metadata: Metadata = {
  title: 'Deals - CRM',
  description: 'Manage sales opportunities and track your sales pipeline.'
}

// Mock data
const mockDeals = [
  {
    id: '1',
    title: 'Enterprise License - Acme Corp',
    company: 'Acme Corporation',
    value: 125000,
    stage: 'Proposal',
    probability: 75,
    expectedClose: '2024-02-15',
    owner: 'John Smith',
    lastActivity: '2 days ago'
  },
  {
    id: '2',
    title: 'Software Implementation - TechStart',
    company: 'TechStart Inc',
    value: 45000,
    stage: 'Negotiation',
    probability: 60,
    expectedClose: '2024-02-28',
    owner: 'Sarah Johnson',
    lastActivity: '1 week ago'
  },
  {
    id: '3',
    title: 'Platform Upgrade - Enterprise Org',
    company: 'Enterprise Org',
    value: 200000,
    stage: 'Closed Won',
    probability: 100,
    expectedClose: '2024-01-30',
    owner: 'Michael Chen',
    lastActivity: '3 days ago'
  }
]

const pipelineStages = [
  { name: 'Qualified', count: 12, value: 580000 },
  { name: 'Proposal', count: 8, value: 420000 },
  { name: 'Negotiation', count: 5, value: 310000 },
  { name: 'Closed Won', count: 3, value: 285000 },
]

export default function DealsPage() {
  const totalPipelineValue = pipelineStages.reduce((sum, stage) => sum + stage.value, 0)

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
                <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
                <p className="text-gray-600 mt-1">
                  Track deals and manage your sales opportunities
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
                Add Deal
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Pipeline Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {pipelineStages.map((stage, index) => (
            <Card key={stage.name}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
                  {stage.name}
                  <Badge variant="secondary">{stage.count}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${(stage.value / 1000).toFixed(0)}K
                </div>
                <div className="flex items-center mt-2 text-sm">
                  <Progress 
                    value={(stage.value / totalPipelineValue) * 100} 
                    className="flex-1 mr-2 h-2"
                  />
                  <span className="text-gray-500">
                    {((stage.value / totalPipelineValue) * 100).toFixed(0)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search deals by title, company, or owner..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {/* Deals List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Deals ({mockDeals.length})</span>
              <div className="text-sm text-gray-500 font-normal">
                Total Pipeline Value: ${(totalPipelineValue / 1000000).toFixed(1)}M
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{deal.title}</h3>
                      <p className="text-sm text-gray-600">{deal.company}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Owner: {deal.owner} • Last activity: {deal.lastActivity}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <div className="flex items-center text-lg font-bold text-gray-900">
                        <DollarSign className="w-4 h-4" />
                        {(deal.value / 1000).toFixed(0)}K
                      </div>
                      <p className="text-xs text-gray-500">
                        Close: {new Date(deal.expectedClose).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-center">
                      <Badge className={
                        deal.stage === 'Closed Won' ? 'bg-green-100 text-green-800' :
                        deal.stage === 'Negotiation' ? 'bg-orange-100 text-orange-800' :
                        deal.stage === 'Proposal' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {deal.stage}
                      </Badge>
                      <div className="mt-2">
                        <Progress value={deal.probability} className="w-20 h-2" />
                        <p className="text-xs text-gray-500 mt-1">{deal.probability}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
