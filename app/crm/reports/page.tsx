

// ============================================================================
// ENTERPRISE CRM - REPORTS MODULE
// Analytics and Performance Insights
// ============================================================================

import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Download, TrendingUp, Users, Building2, DollarSign, Calendar, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export const metadata: Metadata = {
  title: 'Reports - CRM',
  description: 'Analytics and performance insights for your CRM data.'
}

// Mock data for reports
const salesMetrics = {
  monthlyRevenue: 485000,
  revenueGrowth: 18.5,
  dealsWon: 23,
  winRate: 68.2,
  avgDealSize: 21087,
  salesCycle: 42
}

const topPerformers = [
  { name: 'Sarah Johnson', deals: 12, revenue: 145000, winRate: 75 },
  { name: 'Michael Chen', deals: 9, revenue: 118000, winRate: 72 },
  { name: 'David Wilson', deals: 8, revenue: 95000, winRate: 67 },
  { name: 'Emily Davis', deals: 6, revenue: 78000, winRate: 65 }
]

const conversionFunnel = [
  { stage: 'Leads', count: 450, conversion: 100 },
  { stage: 'Qualified', count: 315, conversion: 70 },
  { stage: 'Proposal', count: 189, conversion: 60 },
  { stage: 'Negotiation', count: 94, conversion: 50 },
  { stage: 'Closed Won', count: 47, conversion: 50 }
]

export default function ReportsPage() {
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
                <h1 className="text-3xl font-bold text-gray-900">CRM Reports</h1>
                <p className="text-gray-600 mt-1">
                  Analytics and performance insights for your sales team
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                Monthly Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                ${(salesMetrics.monthlyRevenue / 1000).toFixed(0)}K
              </div>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600">+{salesMetrics.revenueGrowth}%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Deals Won
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {salesMetrics.dealsWon}
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-gray-600">Win Rate:</span>
                <span className="text-blue-600 ml-1 font-medium">{salesMetrics.winRate}%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Avg Deal Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                ${(salesMetrics.avgDealSize / 1000).toFixed(0)}K
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-gray-600">Sales Cycle:</span>
                <span className="text-purple-600 ml-1 font-medium">{salesMetrics.salesCycle} days</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div key={performer.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{performer.name}</p>
                        <p className="text-sm text-gray-500">{performer.deals} deals</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(performer.revenue / 1000).toFixed(0)}K
                      </p>
                      <p className="text-sm text-gray-500">{performer.winRate}% win rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionFunnel.map((stage) => (
                  <div key={stage.stage} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{stage.count}</span>
                        <Badge variant="secondary" className="text-xs">
                          {stage.conversion}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={stage.conversion} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Monthly Sales Report - January 2024', date: '2024-01-31', type: 'Sales', size: '2.3 MB' },
                { name: 'Lead Generation Analysis - Q4 2023', date: '2024-01-15', type: 'Marketing', size: '1.8 MB' },
                { name: 'Customer Retention Report', date: '2024-01-10', type: 'Customer Success', size: '1.2 MB' },
                { name: 'Pipeline Forecast - February 2024', date: '2024-01-08', type: 'Forecast', size: '956 KB' }
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{report.name}</p>
                      <p className="text-sm text-gray-500">
                        {report.type} • {report.date} • {report.size}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
