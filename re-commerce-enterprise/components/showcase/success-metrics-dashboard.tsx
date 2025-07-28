
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Award,
  Building2,
  Globe,
  Eye,
  Calendar,
  Filter,
  Search,
  Plus,
  Edit,
  ExternalLink,
  ChevronRight,
  Download,
  Upload,
  Settings,
  CheckCircle,
  Clock,
  Zap,
  AlertCircle,
  Activity,
  PieChart,
  LineChart,
  BarChart,
  Gauge,
  Calculator,
  Percent,
  Hash,
  Timer,
  Flag,
  Star,
  Bookmark,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Bell,
  Info,
  Users,
  Building,
  MapPin,
  Calendar as CalendarIcon
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Import recharts components for data visualization
import {
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  Bar,
  Pie,
  Area,
  AreaChart
} from 'recharts';

interface SuccessMetric {
  id: string;
  name: string;
  description?: string;
  category: string;
  type: string;
  unit?: string;
  currentValue?: number;
  previousValue?: number;
  targetValue?: number;
  baselineValue?: number;
  measurementPeriod?: string;
  periodStart?: string;
  periodEnd?: string;
  formula?: string;
  dataSource?: string;
  industryBenchmark?: number;
  peerBenchmark?: number;
  trend?: string;
  trendConfidence?: number;
  alertEnabled: boolean;
  alertThreshold?: number;
  chartType: string;
  displayFormat: string;
  visibility: string;
  featured: boolean;
  customer?: {
    companyName: string;
    industry: string;
    companySize: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ROITracking {
  id: string;
  periodType: string;
  startDate: string;
  endDate: string;
  initialInvestment: number;
  ongoingCosts: number;
  totalInvestment: number;
  directSavings: number;
  revenueIncrease: number;
  totalBenefits: number;
  netBenefit: number;
  roiPercentage: number;
  paybackPeriod?: number;
  confidenceLevel: number;
  validatedBy?: string;
  expectedROI?: number;
  currency: string;
  customer: {
    companyName: string;
    industry: string;
    companySize: string;
  };
}

interface BenchmarkComparison {
  id: string;
  benchmarkType: string;
  benchmarkName: string;
  benchmarkValue: number;
  customerValue: number;
  variance: number;
  variancePercentage: number;
  performance: string;
  percentile?: number;
  industry?: string;
  companySize?: string;
  trend?: string;
  metric: {
    name: string;
    category: string;
    type: string;
    unit?: string;
  };
}

interface IndustryPerformance {
  id: string;
  industry: string;
  year: number;
  quarter?: number;
  metrics: any[];
  averages: any;
  trends: any[];
  sampleSize?: number;
  confidence?: number;
}

const SuccessMetricsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");

  // Data states
  const [successMetrics, setSuccessMetrics] = useState<SuccessMetric[]>([]);
  const [roiData, setROIData] = useState<ROITracking[]>([]);
  const [benchmarks, setBenchmarks] = useState<BenchmarkComparison[]>([]);
  const [industryData, setIndustryData] = useState<IndustryPerformance[]>([]);
  const [stats, setStats] = useState<any>({});

  // Chart colors
  const chartColors = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', '#80D8C3', '#A19AD3', '#72BF78'];

  // Mock data for demonstration
  useEffect(() => {
    const loadData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock success metrics data
        setSuccessMetrics([
          {
            id: '1',
            name: 'Customer Acquisition Cost',
            description: 'Average cost to acquire a new customer',
            category: 'financial',
            type: 'currency',
            unit: 'USD',
            currentValue: 150,
            previousValue: 180,
            targetValue: 120,
            baselineValue: 200,
            measurementPeriod: 'monthly',
            periodStart: '2024-01-01T00:00:00Z',
            periodEnd: '2024-01-31T23:59:59Z',
            industryBenchmark: 175,
            peerBenchmark: 160,
            trend: 'improving',
            trendConfidence: 85,
            alertEnabled: true,
            alertThreshold: 180,
            chartType: 'line',
            displayFormat: 'currency',
            visibility: 'internal',
            featured: true,
            customer: {
              companyName: 'TechCorp Solutions',
              industry: 'Technology',
              companySize: 'Enterprise'
            },
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-31T00:00:00Z'
          },
          {
            id: '2',
            name: 'Customer Satisfaction Score',
            description: 'Average customer satisfaction rating',
            category: 'satisfaction',
            type: 'percentage',
            unit: '%',
            currentValue: 92,
            previousValue: 88,
            targetValue: 95,
            baselineValue: 85,
            measurementPeriod: 'quarterly',
            industryBenchmark: 87,
            peerBenchmark: 90,
            trend: 'improving',
            trendConfidence: 92,
            alertEnabled: false,
            chartType: 'gauge',
            displayFormat: 'percentage',
            visibility: 'customer',
            featured: true,
            customer: {
              companyName: 'RetailMax Inc.',
              industry: 'Retail',
              companySize: 'Large'
            },
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-31T00:00:00Z'
          },
          {
            id: '3',
            name: 'Revenue Per Customer',
            description: 'Average revenue generated per customer',
            category: 'financial',
            type: 'currency',
            unit: 'USD',
            currentValue: 2450,
            previousValue: 2200,
            targetValue: 2800,
            baselineValue: 2000,
            measurementPeriod: 'monthly',
            industryBenchmark: 2300,
            peerBenchmark: 2400,
            trend: 'improving',
            trendConfidence: 78,
            alertEnabled: false,
            chartType: 'bar',
            displayFormat: 'currency',
            visibility: 'internal',
            featured: false,
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-31T00:00:00Z'
          }
        ]);

        // Mock ROI data
        setROIData([
          {
            id: '1',
            periodType: 'annual',
            startDate: '2023-01-01T00:00:00Z',
            endDate: '2023-12-31T23:59:59Z',
            initialInvestment: 100000,
            ongoingCosts: 25000,
            totalInvestment: 125000,
            directSavings: 180000,
            revenueIncrease: 220000,
            totalBenefits: 400000,
            netBenefit: 275000,
            roiPercentage: 220,
            paybackPeriod: 6.8,
            confidenceLevel: 85,
            validatedBy: 'Finance Team',
            expectedROI: 200,
            currency: 'USD',
            customer: {
              companyName: 'TechCorp Solutions',
              industry: 'Technology',
              companySize: 'Enterprise'
            }
          },
          {
            id: '2',
            periodType: 'annual',
            startDate: '2023-01-01T00:00:00Z',
            endDate: '2023-12-31T23:59:59Z',
            initialInvestment: 75000,
            ongoingCosts: 15000,
            totalInvestment: 90000,
            directSavings: 120000,
            revenueIncrease: 95000,
            totalBenefits: 215000,
            netBenefit: 125000,
            roiPercentage: 139,
            paybackPeriod: 8.2,
            confidenceLevel: 78,
            expectedROI: 150,
            currency: 'USD',
            customer: {
              companyName: 'RetailMax Inc.',
              industry: 'Retail',
              companySize: 'Large'
            }
          }
        ]);

        // Mock benchmark data
        setBenchmarks([
          {
            id: '1',
            benchmarkType: 'industry',
            benchmarkName: 'Technology Industry Average',
            benchmarkValue: 175,
            customerValue: 150,
            variance: -25,
            variancePercentage: -14.3,
            performance: 'above',
            percentile: 75,
            industry: 'Technology',
            companySize: 'Enterprise',
            trend: 'improving',
            metric: {
              name: 'Customer Acquisition Cost',
              category: 'financial',
              type: 'currency',
              unit: 'USD'
            }
          },
          {
            id: '2',
            benchmarkType: 'peer',
            benchmarkName: 'Similar Companies',
            benchmarkValue: 90,
            customerValue: 92,
            variance: 2,
            variancePercentage: 2.2,
            performance: 'above',
            percentile: 65,
            industry: 'Retail',
            companySize: 'Large',
            trend: 'stable',
            metric: {
              name: 'Customer Satisfaction Score',
              category: 'satisfaction',
              type: 'percentage',
              unit: '%'
            }
          }
        ]);

        // Mock industry data
        setIndustryData([
          {
            id: '1',
            industry: 'Technology',
            year: 2024,
            quarter: 1,
            metrics: [
              { name: 'Customer Acquisition Cost', average: 175, median: 165, percentile90: 250 },
              { name: 'Customer Satisfaction', average: 87, median: 89, percentile90: 95 },
              { name: 'Revenue Per Customer', average: 2300, median: 2200, percentile90: 3500 }
            ],
            averages: {
              customerAcquisitionCost: 175,
              customerSatisfaction: 87,
              revenuePerCustomer: 2300
            },
            trends: [
              { metric: 'customerAcquisitionCost', direction: 'declining', confidence: 85 },
              { metric: 'customerSatisfaction', direction: 'improving', confidence: 92 }
            ],
            sampleSize: 245,
            confidence: 89
          }
        ]);

        // Mock stats
        setStats({
          totalMetrics: 47,
          featuredMetrics: 12,
          alertingMetrics: 8,
          averageROI: 185,
          bestPerformingMetric: 'Customer Satisfaction Score',
          topIndustry: 'Technology',
          metricsAboveBenchmark: 65,
          monthlyGrowth: 12.5
        });

        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredMetrics = successMetrics.filter(metric => {
    const matchesSearch = metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         metric.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         metric.customer?.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || metric.category === categoryFilter;
    const matchesType = typeFilter === "all" || metric.type === typeFilter;
    const matchesVisibility = visibilityFilter === "all" || metric.visibility === visibilityFilter;
    
    return matchesSearch && matchesCategory && matchesType && matchesVisibility;
  });

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-500" />;
      default: return <Activity className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'significantly-above': return 'bg-green-100 text-green-800';
      case 'above': return 'bg-green-50 text-green-700';
      case 'at': return 'bg-gray-100 text-gray-800';
      case 'below': return 'bg-red-50 text-red-700';
      case 'significantly-below': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatValue = (value?: number, type?: string, unit?: string) => {
    if (value === undefined || value === null) return 'N/A';
    
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', { 
          style: 'currency', 
          currency: unit || 'USD',
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value}%`;
      case 'count':
        return value.toLocaleString();
      default:
        return value.toLocaleString();
    }
  };

  // Sample chart data
  const roiTrendData = [
    { month: 'Jan', roi: 180, investment: 120000, returns: 336000 },
    { month: 'Feb', roi: 195, investment: 125000, returns: 368750 },
    { month: 'Mar', roi: 210, investment: 130000, returns: 403000 },
    { month: 'Apr', roi: 225, investment: 128000, returns: 416000 },
    { month: 'May', roi: 240, investment: 135000, returns: 459000 },
    { month: 'Jun', roi: 220, investment: 140000, returns: 448000 }
  ];

  const metricsCategoryData = [
    { name: 'Financial', value: 15, color: chartColors[0] },
    { name: 'Operational', value: 12, color: chartColors[1] },
    { name: 'Satisfaction', value: 8, color: chartColors[2] },
    { name: 'Strategic', value: 6, color: chartColors[3] },
    { name: 'Other', value: 6, color: chartColors[4] }
  ];

  const industryBenchmarkData = [
    { industry: 'Technology', customerValue: 92, benchmark: 87, difference: 5 },
    { industry: 'Retail', customerValue: 89, benchmark: 85, difference: 4 },
    { industry: 'Finance', customerValue: 94, benchmark: 90, difference: 4 },
    { industry: 'Healthcare', customerValue: 91, benchmark: 88, difference: 3 },
    { industry: 'Manufacturing', customerValue: 86, benchmark: 84, difference: 2 }
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Metrics</p>
                <p className="text-3xl font-bold text-blue-900">{stats.totalMetrics}</p>
                <p className="text-xs text-blue-500 mt-1">{stats.featuredMetrics} featured</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Average ROI</p>
                <p className="text-3xl font-bold text-green-900">{stats.averageROI}%</p>
                <p className="text-xs text-green-500 mt-1">Across all customers</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Above Benchmark</p>
                <p className="text-3xl font-bold text-purple-900">{stats.metricsAboveBenchmark}%</p>
                <p className="text-xs text-purple-500 mt-1">Of tracked metrics</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Active Alerts</p>
                <p className="text-3xl font-bold text-orange-900">{stats.alertingMetrics}</p>
                <p className="text-xs text-orange-500 mt-1">Require attention</p>
              </div>
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROI Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-blue-500" />
            ROI Trend Analysis
          </CardTitle>
          <CardDescription>Monthly ROI performance across all customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={roiTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'ROI %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <Tooltip wrapperStyle={{ fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line 
                  type="monotone" 
                  dataKey="roi" 
                  stroke={chartColors[0]} 
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Distribution and Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              Metrics by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={metricsCategoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {metricsCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip wrapperStyle={{ fontSize: 11 }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Top Performing Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMetrics.filter(m => m.featured).slice(0, 4).map((metric, index) => (
                <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{metric.name}</p>
                      <p className="text-xs text-gray-600">{metric.customer?.companyName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      {formatValue(metric.currentValue, metric.type, metric.unit)}
                    </p>
                    {metric.trend && (
                      <div className="flex items-center gap-1 justify-end">
                        {getTrendIcon(metric.trend)}
                        <span className="text-xs text-gray-500">{metric.trend}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            Recent Metric Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Customer Satisfaction Score updated</p>
                <p className="text-xs text-gray-600">TechCorp Solutions: 92% (+4% vs. last month)</p>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New ROI calculation completed</p>
                <p className="text-xs text-gray-600">RetailMax Inc.: 139% ROI validated</p>
              </div>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Alert threshold reached</p>
                <p className="text-xs text-gray-600">Customer Acquisition Cost exceeds target</p>
              </div>
              <span className="text-xs text-gray-500">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const MetricsTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search metrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="satisfaction">Satisfaction</SelectItem>
                  <SelectItem value="strategic">Strategic</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="currency">Currency</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="count">Count</SelectItem>
                  <SelectItem value="ratio">Ratio</SelectItem>
                </SelectContent>
              </Select>
              <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Visibility</SelectItem>
                  <SelectItem value="internal">Internal</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Metric
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMetrics.map((metric) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2">{metric.name}</h3>
                    {metric.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{metric.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    {metric.featured && <Star className="h-4 w-4 text-yellow-500" />}
                    {metric.alertEnabled && <Bell className="h-4 w-4 text-orange-500" />}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Value</span>
                    <span className="font-bold text-lg text-blue-600">
                      {formatValue(metric.currentValue, metric.type, metric.unit)}
                    </span>
                  </div>
                  
                  {metric.previousValue && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Previous</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {formatValue(metric.previousValue, metric.type, metric.unit)}
                        </span>
                        {metric.currentValue && metric.previousValue && (
                          <Badge className={
                            metric.currentValue > metric.previousValue 
                              ? 'bg-green-100 text-green-800' 
                              : metric.currentValue < metric.previousValue
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                          }>
                            {metric.currentValue > metric.previousValue ? '+' : ''}
                            {(((metric.currentValue - metric.previousValue) / metric.previousValue) * 100).toFixed(1)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {metric.targetValue && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Target</span>
                      <span className="text-sm font-medium">
                        {formatValue(metric.targetValue, metric.type, metric.unit)}
                      </span>
                    </div>
                  )}

                  {metric.industryBenchmark && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Industry Avg</span>
                      <span className="text-sm">
                        {formatValue(metric.industryBenchmark, metric.type, metric.unit)}
                      </span>
                    </div>
                  )}
                </div>

                {metric.currentValue && metric.targetValue && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Progress to Target</span>
                      <span>{Math.round((metric.currentValue / metric.targetValue) * 100)}%</span>
                    </div>
                    <Progress 
                      value={Math.min((metric.currentValue / metric.targetValue) * 100, 100)} 
                      className="h-2" 
                    />
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs capitalize">
                      {metric.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {metric.visibility}
                    </Badge>
                  </div>
                  {metric.trend && (
                    <div className="flex items-center gap-1">
                      {getTrendIcon(metric.trend)}
                      <span className="text-xs text-gray-500 capitalize">{metric.trend}</span>
                    </div>
                  )}
                </div>

                {metric.customer && (
                  <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-xs font-medium">{metric.customer.companyName}</p>
                      <p className="text-xs text-gray-500">{metric.customer.industry}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const ROITrackingTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">ROI Tracking & Analysis</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add ROI Calculation
        </Button>
      </div>

      {/* ROI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Average ROI</p>
                <p className="text-3xl font-bold text-green-900">
                  {Math.round(roiData.reduce((sum, roi) => sum + roi.roiPercentage, 0) / roiData.length)}%
                </p>
                <p className="text-xs text-green-500 mt-1">Across {roiData.length} customers</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Investment</p>
                <p className="text-3xl font-bold text-blue-900">
                  ${(roiData.reduce((sum, roi) => sum + roi.totalInvestment, 0) / 1000).toFixed(0)}K
                </p>
                <p className="text-xs text-blue-500 mt-1">Combined portfolio</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg Payback Period</p>
                <p className="text-3xl font-bold text-purple-900">
                  {(roiData.reduce((sum, roi) => sum + (roi.paybackPeriod || 0), 0) / roiData.length).toFixed(1)}
                </p>
                <p className="text-xs text-purple-500 mt-1">Months</p>
              </div>
              <Timer className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROI Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roiData.map((roi) => (
          <motion.div
            key={roi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{roi.customer.companyName}</h3>
                    <p className="text-sm text-gray-600">{roi.customer.industry} • {roi.customer.companySize}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(roi.startDate).toLocaleDateString()} - {new Date(roi.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 text-lg font-bold px-3 py-1">
                    {roi.roiPercentage}% ROI
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-lg font-bold text-red-600">
                      ${(roi.totalInvestment / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-red-600">Total Investment</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">
                      ${(roi.totalBenefits / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-green-600">Total Benefits</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Direct Savings</span>
                    <span className="font-medium">${(roi.directSavings / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Revenue Increase</span>
                    <span className="font-medium">${(roi.revenueIncrease / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Net Benefit</span>
                    <span className="font-bold text-green-600">${(roi.netBenefit / 1000).toFixed(0)}K</span>
                  </div>
                  {roi.paybackPeriod && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Payback Period</span>
                      <span className="font-medium">{roi.paybackPeriod} months</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {roi.confidenceLevel}% confidence
                    </Badge>
                    {roi.validatedBy && (
                      <Badge variant="secondary" className="text-xs">
                        Validated
                      </Badge>
                    )}
                  </div>
                  {roi.expectedROI && (
                    <div className="text-xs text-gray-500">
                      Expected: {roi.expectedROI}%
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const BenchmarksTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Benchmark Comparisons</h3>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Benchmark
        </Button>
      </div>

      {/* Industry Benchmark Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-blue-500" />
            Industry Performance Comparison
          </CardTitle>
          <CardDescription>Your performance vs. industry benchmarks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={industryBenchmarkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="industry" 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ value: 'Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: 11 } }}
                />
                <Tooltip wrapperStyle={{ fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="customerValue" fill={chartColors[0]} name="Your Performance" />
                <Bar dataKey="benchmark" fill={chartColors[1]} name="Industry Benchmark" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Benchmark Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {benchmarks.map((benchmark) => (
          <motion.div
            key={benchmark.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{benchmark.metric.name}</h3>
                    <p className="text-sm text-gray-600">{benchmark.benchmarkName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {benchmark.industry} • {benchmark.companySize}
                    </p>
                  </div>
                  <Badge className={getPerformanceColor(benchmark.performance)}>
                    {benchmark.performance}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">
                      {formatValue(benchmark.customerValue, benchmark.metric.type, benchmark.metric.unit)}
                    </p>
                    <p className="text-xs text-blue-600">Your Value</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg font-bold text-gray-600">
                      {formatValue(benchmark.benchmarkValue, benchmark.metric.type, benchmark.metric.unit)}
                    </p>
                    <p className="text-xs text-gray-600">Benchmark</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Variance</span>
                    <span className={`font-medium ${benchmark.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {benchmark.variance >= 0 ? '+' : ''}{formatValue(benchmark.variance, benchmark.metric.type, benchmark.metric.unit)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Variance %</span>
                    <span className={`font-medium ${benchmark.variancePercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {benchmark.variancePercentage >= 0 ? '+' : ''}{benchmark.variancePercentage.toFixed(1)}%
                    </span>
                  </div>
                  {benchmark.percentile && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Percentile Rank</span>
                      <span className="font-medium">{benchmark.percentile}th</span>
                    </div>
                  )}
                </div>

                {benchmark.trend && (
                  <div className="flex items-center gap-2 mb-4">
                    {getTrendIcon(benchmark.trend)}
                    <span className="text-sm text-gray-600 capitalize">Trend: {benchmark.trend}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const IndustryInsightsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Industry Performance Insights</h3>
        <Button className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {industryData.map((industry) => (
        <Card key={industry.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-500" />
              {industry.industry} Industry - Q{industry.quarter} {industry.year}
            </CardTitle>
            <CardDescription>
              Performance metrics and trends ({industry.sampleSize} companies, {industry.confidence}% confidence)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {industry.metrics.map((metric, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2">{metric.name}</h4>
                  <p className="text-2xl font-bold text-blue-600 mb-1">{metric.average}</p>
                  <div className="space-y-1 text-xs text-gray-600">
                    <p>Median: {metric.median}</p>
                    <p>90th Percentile: {metric.percentile90}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Key Trends</h4>
                <div className="space-y-3">
                  {industry.trends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        {getTrendIcon(trend.direction)}
                        <span className="text-sm capitalize">{trend.metric.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                      <div className="text-right">
                        <Badge className={
                          trend.direction === 'improving' ? 'bg-green-100 text-green-800' :
                          trend.direction === 'declining' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {trend.direction}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{trend.confidence}% confidence</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Industry Insights</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                    <p className="text-sm font-medium text-blue-800">Market Growth</p>
                    <p className="text-xs text-blue-600 mt-1">
                      The {industry.industry.toLowerCase()} sector shows consistent growth in customer satisfaction metrics.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                    <p className="text-sm font-medium text-green-800">Best Practices</p>
                    <p className="text-xs text-green-600 mt-1">
                      Leading companies focus on data-driven decision making and customer experience optimization.
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded border-l-4 border-orange-500">
                    <p className="text-sm font-medium text-orange-800">Recommendations</p>
                    <p className="text-xs text-orange-600 mt-1">
                      Consider investing in automation and AI technologies to stay competitive in the market.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Success Metrics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track ROI, benchmarks, and key performance indicators</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Metric
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="roi">ROI Tracking</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="industry">Industry Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab />
        </TabsContent>

        <TabsContent value="metrics">
          <MetricsTab />
        </TabsContent>

        <TabsContent value="roi">
          <ROITrackingTab />
        </TabsContent>

        <TabsContent value="benchmarks">
          <BenchmarksTab />
        </TabsContent>

        <TabsContent value="industry">
          <IndustryInsightsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuccessMetricsDashboard;
