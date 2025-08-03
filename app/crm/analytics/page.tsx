
// ============================================================================
// ENTERPRISE CRM - ADVANCED ANALYTICS DASHBOARD
// Comprehensive Business Intelligence for CRM Data
// ============================================================================

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Activity, BarChart3, Brain, TrendingUp, Users, Building2, 
  DollarSign, Target, Zap, RefreshCw, Download, Settings,
  Calendar, Filter, PieChart, LineChart, Map, Globe,
  AlertTriangle, CheckCircle, Clock, ArrowRight,
  Sparkles, Eye, MessageSquare, Mail, Phone
} from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts'

export default function CRMAnalyticsPage() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [refreshing, setRefreshing] = useState(false)
  const [nlQuery, setNlQuery] = useState('')
  const [nlResponse, setNlResponse] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Enhanced CRM Analytics Data
  const salesMetrics = {
    totalRevenue: 2450000,
    monthlyGrowth: 18.5,
    dealsWon: 89,
    winRate: 68.2,
    avgDealSize: 27523,
    salesVelocity: 42,
    pipelineValue: 5600000,
    forecastAccuracy: 94.2
  }

  const revenueData = [
    { month: 'Jan', revenue: 325000, deals: 12, forecast: 340000, actual: 325000 },
    { month: 'Feb', revenue: 445000, deals: 18, forecast: 420000, actual: 445000 },
    { month: 'Mar', revenue: 567000, deals: 23, forecast: 550000, actual: 567000 },
    { month: 'Apr', revenue: 689000, deals: 28, forecast: 670000, actual: 689000 },
    { month: 'May', revenue: 745000, deals: 31, forecast: 750000, actual: 745000 },
    { month: 'Jun', revenue: 832000, deals: 36, forecast: 820000, actual: 832000 }
  ]

  const pipelineData = [
    { stage: 'Prospecting', count: 45, value: 1250000, conversion: 100 },
    { stage: 'Qualification', count: 32, value: 980000, conversion: 71 },
    { stage: 'Proposal', count: 23, value: 745000, conversion: 72 },
    { stage: 'Negotiation', count: 15, value: 520000, conversion: 65 },
    { stage: 'Closed Won', count: 12, value: 380000, conversion: 80 }
  ]

  const customerSegmentData = [
    { segment: 'Enterprise', count: 156, revenue: 1850000, growth: 22.5, color: '#3B82F6' },
    { segment: 'Mid-Market', count: 234, revenue: 980000, growth: 18.2, color: '#10B981' },
    { segment: 'SMB', count: 445, revenue: 645000, growth: 15.8, color: '#F59E0B' },
    { segment: 'Startup', count: 167, revenue: 234000, growth: 12.3, color: '#8B5CF6' }
  ]

  const activityMetrics = [
    { type: 'Calls', count: 1245, trend: 'up', growth: 8.2 },
    { type: 'Emails', count: 3456, trend: 'up', growth: 12.4 },
    { type: 'Meetings', count: 234, trend: 'up', growth: 5.7 },
    { type: 'Demos', count: 89, trend: 'up', growth: 15.2 }
  ]

  const performanceData = [
    { rep: 'Sarah Johnson', deals: 28, revenue: 345000, quota: 300000, attainment: 115 },
    { rep: 'Michael Chen', deals: 24, revenue: 298000, quota: 280000, attainment: 106 },
    { rep: 'David Wilson', deals: 19, revenue: 234000, quota: 250000, attainment: 94 },
    { rep: 'Emily Davis', deals: 22, revenue: 267000, quota: 260000, attainment: 103 }
  ]

  const churnRiskData = [
    { company: 'TechCorp Inc', risk: 85, revenue: 45000, lastContact: '14 days ago' },
    { company: 'DataSoft LLC', risk: 72, revenue: 32000, lastContact: '21 days ago' },
    { company: 'CloudBase Pro', risk: 68, revenue: 28000, lastContact: '18 days ago' }
  ]

  const forecastData = [
    { month: 'Jul', conservative: 850000, optimistic: 950000, committed: 780000 },
    { month: 'Aug', conservative: 920000, optimistic: 1050000, committed: 850000 },
    { month: 'Sep', conservative: 980000, optimistic: 1150000, committed: 920000 },
    { month: 'Oct', conservative: 1050000, optimistic: 1250000, committed: 980000 }
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const handleNaturalLanguageQuery = async () => {
    if (!nlQuery.trim()) return
    
    setIsGenerating(true)
    setNlResponse('')

    // Simulate AI response for CRM analytics
    const responses = [
      `Based on your CRM data analysis:\n\n• Your win rate of ${salesMetrics.winRate}% is above industry average\n• Top performing segment is Enterprise with $${(customerSegmentData[0].revenue/1000000).toFixed(1)}M revenue\n• Sales velocity has improved to ${salesMetrics.salesVelocity} days\n• Consider focusing on ${churnRiskData.length} at-risk accounts to prevent churn`,
      `Revenue insights for your sales team:\n\n• Monthly growth rate is ${salesMetrics.monthlyGrowth}% - exceeding targets\n• Average deal size increased to $${(salesMetrics.avgDealSize/1000).toFixed(0)}K\n• Pipeline value is healthy at $${(salesMetrics.pipelineValue/1000000).toFixed(1)}M\n• Forecast accuracy is ${salesMetrics.forecastAccuracy}% - very reliable`,
      `Performance analysis shows:\n\n• ${performanceData.filter(p => p.attainment > 100).length} reps are exceeding quota\n• Activity levels are up across all channels\n• Conversion rates are improving in qualification stage\n• Recommend increasing prospecting efforts for sustained growth`
    ]

    const response = responses[Math.floor(Math.random() * responses.length)]
    
    // Simulate streaming response
    for (let i = 0; i < response.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20))
      setNlResponse(response.substring(0, i + 1))
    }
    
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/crm">
                <Button variant="ghost" size="sm">
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Back to CRM
                </Button>
              </Link>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">CRM Analytics & Intelligence</h1>
                <p className="text-sm text-slate-600">Advanced insights • ML-powered • Real-time</p>
              </div>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                Enterprise CRM
              </Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-600">Live</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: <DollarSign className="h-8 w-8 text-green-500" />, title: "Total Revenue", value: `$${(salesMetrics.totalRevenue/1000000).toFixed(1)}M`, change: `+${salesMetrics.monthlyGrowth}%`, color: "bg-green-50 border-green-200" },
                { icon: <Target className="h-8 w-8 text-blue-500" />, title: "Win Rate", value: `${salesMetrics.winRate}%`, change: "+2.3%", color: "bg-blue-50 border-blue-200" },
                { icon: <TrendingUp className="h-8 w-8 text-purple-500" />, title: "Pipeline Value", value: `$${(salesMetrics.pipelineValue/1000000).toFixed(1)}M`, change: "+12.4%", color: "bg-purple-50 border-purple-200" },
                { icon: <Clock className="h-8 w-8 text-orange-500" />, title: "Sales Velocity", value: `${salesMetrics.salesVelocity} days`, change: "-5 days", color: "bg-orange-50 border-orange-200" }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Card className={`transition-all duration-300 hover:shadow-lg ${metric.color}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        {metric.icon}
                        <Badge variant="outline" className="text-xs text-green-700 bg-green-100">
                          {metric.change}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <LineChart className="h-5 w-5 text-blue-600" />
                    <span>Revenue Growth Trend</span>
                  </CardTitle>
                  <CardDescription>Monthly revenue performance vs forecast</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={revenueData}>
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        formatter={(value: any, name: string) => [
                          `$${(value/1000).toFixed(0)}K`, 
                          name.charAt(0).toUpperCase() + name.slice(1)
                        ]}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Actual Revenue" />
                      <Line type="monotone" dataKey="forecast" stroke="#6B7280" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Customer Segments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5 text-purple-600" />
                    <span>Customer Segments</span>
                  </CardTitle>
                  <CardDescription>Revenue distribution by customer segment</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={customerSegmentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="revenue"
                        label={({ segment, revenue }) => `${segment}: $${(revenue/1000).toFixed(0)}K`}
                      >
                        {customerSegmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`$${(value/1000).toFixed(0)}K`, 'Revenue']} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Activity Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {activityMetrics.map((activity, index) => (
                    <div key={activity.type} className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">{activity.count.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{activity.type}</div>
                      <div className="flex items-center justify-center mt-2 text-sm">
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                        <span className="text-green-600">+{activity.growth}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={revenueData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => `$${(value/1000).toFixed(0)}K`} />
                      <Area type="monotone" dataKey="revenue" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Customer Segment Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Segment Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerSegmentData.map((segment, index) => (
                      <div key={segment.segment} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{segment.segment}</span>
                          <div className="text-right">
                            <div className="font-bold">${(segment.revenue/1000).toFixed(0)}K</div>
                            <div className="text-sm text-green-600">+{segment.growth}%</div>
                          </div>
                        </div>
                        <Progress value={(segment.revenue / Math.max(...customerSegmentData.map(s => s.revenue))) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pipeline Tab */}
          <TabsContent value="pipeline" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pipeline Funnel */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Pipeline Funnel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pipelineData.map((stage, index) => (
                      <div key={stage.stage} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{stage.stage}</span>
                          <div className="text-right">
                            <div className="font-bold">{stage.count} deals</div>
                            <div className="text-sm text-gray-600">${(stage.value/1000).toFixed(0)}K</div>
                          </div>
                        </div>
                        <Progress value={stage.conversion} className="h-3" />
                        <div className="text-xs text-gray-500">{stage.conversion}% conversion</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stage Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Pipeline Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={pipelineData}>
                      <XAxis dataKey="stage" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8B5CF6" name="Pipeline Value" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Rep Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Sales Rep Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceData.map((rep, index) => (
                      <div key={rep.rep} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{rep.rep}</div>
                          <div className="text-sm text-gray-600">{rep.deals} deals • ${(rep.revenue/1000).toFixed(0)}K</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${rep.attainment >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
                            {rep.attainment}%
                          </div>
                          <div className="text-sm text-gray-600">quota attainment</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Churn Risk Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <span>Churn Risk Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {churnRiskData.map((company, index) => (
                      <div key={company.company} className="p-3 border-l-4 border-red-500 bg-red-50 rounded">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{company.company}</div>
                            <div className="text-sm text-gray-600">Last contact: {company.lastContact}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-red-600 font-bold">{company.risk}% risk</div>
                            <div className="text-sm text-gray-600">${(company.revenue/1000).toFixed(0)}K ARR</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai-insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <span>AI-Powered CRM Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ask AI about your CRM data:</label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="e.g., 'Analyze our sales performance trends' or 'Which deals need attention?'"
                      value={nlQuery}
                      onChange={(e) => setNlQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleNaturalLanguageQuery} disabled={isGenerating}>
                      {isGenerating ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      Analyze
                    </Button>
                  </div>
                </div>
                
                {nlResponse && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                    <h3 className="font-semibold text-gray-900 mb-3">AI Analysis Results:</h3>
                    <div className="whitespace-pre-wrap text-sm text-gray-700">
                      {nlResponse}
                    </div>
                  </div>
                )}
                
                {!nlResponse && !isGenerating && (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Get AI-powered insights about your CRM performance</p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        "What are our top performing sales activities?",
                        "Which customers are at risk of churning?",
                        "Show me pipeline conversion trends",
                        "Analyze our win rate by segment"
                      ].map((example, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setNlQuery(example)}
                          className="text-left justify-start"
                        >
                          {example}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forecasting Tab */}
          <TabsContent value="forecasting" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Forecast */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={forecastData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => `$${(value/1000).toFixed(0)}K`} />
                      <Legend />
                      <Line type="monotone" dataKey="conservative" stroke="#6B7280" strokeWidth={2} name="Conservative" />
                      <Line type="monotone" dataKey="optimistic" stroke="#10B981" strokeWidth={2} name="Optimistic" />
                      <Line type="monotone" dataKey="committed" stroke="#3B82F6" strokeWidth={3} name="Committed" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Forecast Accuracy */}
              <Card>
                <CardHeader>
                  <CardTitle>Forecast Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600">{salesMetrics.forecastAccuracy}%</div>
                      <div className="text-gray-600">Overall Accuracy</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Q1 Accuracy</span>
                        <span className="font-medium">96.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Q2 Accuracy</span>
                        <span className="font-medium">92.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Q3 Forecast</span>
                        <span className="font-medium text-blue-600">$2.8M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Q4 Forecast</span>
                        <span className="font-medium text-blue-600">$3.2M</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
