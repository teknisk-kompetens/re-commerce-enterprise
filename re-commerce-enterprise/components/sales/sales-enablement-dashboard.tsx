
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  TrendingUp, 
  Target, 
  Calendar, 
  FileText, 
  BarChart3, 
  PieChart, 
  DollarSign, 
  Clock, 
  Award, 
  Eye, 
  Download, 
  Share2, 
  Filter, 
  Search,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  PlayCircle,
  MessageSquare,
  Mail,
  Phone,
  Star
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-enhanced';
import { Button } from '@/components/ui/button-enhanced';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface SalesMetrics {
  overview: {
    totalLeads: number;
    qualifiedLeads: number;
    conversionRate: number;
    averageDealSize: number;
    salesCycle: number;
    monthlyGrowth: number;
  };
  demographics: {
    industries: Array<{
      name: string;
      percentage: number;
      deals: number;
    }>;
    companySize: Array<{
      size: string;
      percentage: number;
      avgDeal: number;
    }>;
  };
  performance: {
    pipelineStages: Array<{
      stage: string;
      count: number;
      value: number;
    }>;
    topSalesReps: Array<{
      name: string;
      deals: number;
      revenue: number;
      conversionRate: number;
    }>;
  };
  trends: {
    monthlyRevenue: Array<{
      month: string;
      revenue: number;
      deals: number;
    }>;
    demoMetrics: {
      totalDemos: number;
      completionRate: number;
      averageScore: number;
      topScenarios: Array<{
        scenario: string;
        demos: number;
        avgScore: number;
      }>;
    };
  };
}

export function SalesEnablementDashboard() {
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchSalesAnalytics();
  }, [selectedTimeframe, selectedSegment]);

  const fetchSalesAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/sales-analytics?timeframe=${selectedTimeframe}&segment=${selectedSegment}`);
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch sales analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading || !metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-lg font-medium">Loading sales analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Sales Enablement Dashboard
            </h1>
            <p className="text-neutral-600 dark:text-neutral-300 mt-2">
              Comprehensive analytics and tools for sales team performance
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={fetchSalesAnalytics}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="demos">Demo Analytics</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {[
                {
                  title: 'Total Leads',
                  value: metrics.overview.totalLeads.toLocaleString(),
                  change: '+12.5%',
                  icon: Users,
                  color: 'primary'
                },
                {
                  title: 'Qualified Leads',
                  value: metrics.overview.qualifiedLeads.toLocaleString(),
                  change: '+8.2%',
                  icon: Target,
                  color: 'success'
                },
                {
                  title: 'Conversion Rate',
                  value: `${metrics.overview.conversionRate}%`,
                  change: '+2.1%',
                  icon: TrendingUp,
                  color: 'warning'
                },
                {
                  title: 'Avg Deal Size',
                  value: formatCurrency(metrics.overview.averageDealSize),
                  change: '+15.3%',
                  icon: DollarSign,
                  color: 'success'
                },
                {
                  title: 'Sales Cycle',
                  value: `${metrics.overview.salesCycle} days`,
                  change: '-5.2%',
                  icon: Clock,
                  color: 'primary'
                },
                {
                  title: 'Monthly Growth',
                  value: formatPercentage(metrics.overview.monthlyGrowth),
                  change: '+3.4%',
                  icon: Award,
                  color: 'error'
                }
              ].map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="elevated">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className={`w-10 h-10 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                          <metric.icon className={`h-5 w-5 text-${metric.color}-600`} />
                        </div>
                        <div className={`flex items-center text-sm ${
                          metric.change.startsWith('+') ? 'text-success-600' : 'text-error-600'
                        }`}>
                          {metric.change.startsWith('+') ? (
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          )}
                          {metric.change}
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                          {metric.title}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Revenue Trend */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Monthly Revenue Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.trends.monthlyRevenue.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-sm font-medium">{item.month}</div>
                          <Badge variant="outline">{item.deals} deals</Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(item.revenue)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pipeline Stages */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5" />
                    <span>Sales Pipeline</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.performance.pipelineStages.map((stage, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{stage.stage}</span>
                          <span>{formatCurrency(stage.value)}</span>
                        </div>
                        <Progress 
                          value={(stage.count / metrics.overview.totalLeads) * 100} 
                          className="h-2"
                        />
                        <div className="text-xs text-neutral-600 text-right">
                          {stage.count} opportunities
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Industry Demographics */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4">By Industry</h4>
                    <div className="space-y-3">
                      {metrics.demographics.industries.map((industry, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{industry.name}</span>
                              <span>{industry.percentage}%</span>
                            </div>
                            <Progress value={industry.percentage} className="h-2" />
                          </div>
                          <Badge variant="outline" className="ml-4">
                            {industry.deals} deals
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4">By Company Size</h4>
                    <div className="space-y-3">
                      {metrics.demographics.companySize.map((size, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{size.size}</span>
                              <span>{size.percentage}%</span>
                            </div>
                            <Progress value={size.percentage} className="h-2" />
                          </div>
                          <div className="ml-4 text-sm text-neutral-600">
                            {formatCurrency(size.avgDeal)} avg
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-8">
            {/* Top Performers */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Top Sales Representatives</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metrics.performance.topSalesReps.map((rep, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-primary-600">
                            {rep.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold">{rep.name}</div>
                          <div className="text-sm text-neutral-600">
                            {rep.deals} deals closed
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold text-lg">
                          {formatCurrency(rep.revenue)}
                        </div>
                        <div className="text-sm text-success-600">
                          {rep.conversionRate}% conversion
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Materials Tab */}
          <TabsContent value="materials" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'Sales Presentations',
                  count: 24,
                  icon: FileText,
                  description: 'Industry-specific pitch decks',
                  action: 'View Library'
                },
                {
                  title: 'Case Studies',
                  count: 12,
                  icon: Award,
                  description: 'Customer success stories',
                  action: 'Browse Cases'
                },
                {
                  title: 'Product Demos',
                  count: 8,
                  icon: PlayCircle,
                  description: 'Interactive demonstrations',
                  action: 'Launch Demo'
                },
                {
                  title: 'Competitive Analysis',
                  count: 6,
                  icon: BarChart3,
                  description: 'Market comparison sheets',
                  action: 'View Analysis'
                },
                {
                  title: 'Pricing Calculators',
                  count: 3,
                  icon: DollarSign,
                  description: 'ROI and pricing tools',
                  action: 'Open Calculator'
                },
                {
                  title: 'Email Templates',
                  count: 18,
                  icon: Mail,
                  description: 'Follow-up sequences',
                  action: 'Browse Templates'
                }
              ].map((material, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="elevated" interactive className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <material.icon className="h-6 w-6 text-primary-600" />
                        </div>
                        <Badge variant="secondary">{material.count}</Badge>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{material.title}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                        {material.description}
                      </p>
                      
                      <Button size="sm" className="w-full">
                        {material.action}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Demo Analytics Tab */}
          <TabsContent value="demos" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Demo Overview */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Demo Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600">
                        {metrics.trends.demoMetrics.totalDemos.toLocaleString()}
                      </div>
                      <div className="text-sm text-neutral-600">Total Demos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-success-600">
                        {metrics.trends.demoMetrics.completionRate}%
                      </div>
                      <div className="text-sm text-neutral-600">Completion Rate</div>
                    </div>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-warning-600 flex items-center justify-center">
                      <Star className="h-6 w-6 mr-2 fill-current" />
                      {metrics.trends.demoMetrics.averageScore}
                    </div>
                    <div className="text-sm text-neutral-600">Average Score</div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Demo Scenarios */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Top Demo Scenarios</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.trends.demoMetrics.topScenarios.map((scenario, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium">{scenario.scenario}</div>
                          <div className="text-sm text-neutral-600">
                            {scenario.demos} demos completed
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-warning-600">
                            <Star className="h-4 w-4 mr-1 fill-current" />
                            <span className="font-semibold">{scenario.avgScore}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Team Overview */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Team Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Active Reps</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Avg Performance</span>
                      <span className="font-semibold text-success-600">87%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Team Quota</span>
                      <span className="font-semibold">{formatCurrency(2400000)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>YTD Achievement</span>
                      <span className="font-semibold text-success-600">112%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Team Meeting
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Send Team Update
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'Demo completed', user: 'Sarah Chen', time: '2 hours ago', status: 'success' },
                      { action: 'Proposal sent', user: 'Mike Rodriguez', time: '4 hours ago', status: 'warning' },
                      { action: 'Deal closed', user: 'Emily Johnson', time: '1 day ago', status: 'success' },
                      { action: 'Follow-up scheduled', user: 'David Kim', time: '2 days ago', status: 'info' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.status === 'success' ? 'bg-success-500' :
                          activity.status === 'warning' ? 'bg-warning-500' :
                          'bg-primary-500'
                        }`} />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{activity.action}</div>
                          <div className="text-xs text-neutral-600">
                            {activity.user} • {activity.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
