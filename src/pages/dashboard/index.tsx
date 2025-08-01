import { useState, useEffect } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  BarChart3,
  Globe,
  Activity,
  Zap
} from 'lucide-react'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  PieChart, 
  Pie, 
  Cell,
  Area,
  AreaChart
} from 'recharts'

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-64">Loading chart...</div>
})

const colors = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#FF6363', '#80D8C3', '#A19AD3', '#72BF78']

interface DashboardData {
  overview: {
    totalSales: number
    totalOrders: number
    totalCustomers: number
    avgOrderValue: number
  }
  salesTrend: Array<{
    date: string
    sales: number
    orders: number
    customers: number
  }>
  topProducts: Array<{
    name: string
    sales: number
    revenue: number
    growth: number
  }>
  customerSegments: Array<{
    segment: string
    customers: number
    revenue: number
    avgOrder: number
  }>
  geographicData: Array<{
    country: string
    sales: number
    orders: number
  }>
  widgetInteractions: number
  sceneViews: number
  recentActivity: Array<{
    type: string
    description: string
    timestamp: string
    value?: number
  }>
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')

  useEffect(() => {
    fetchDashboardData()
  }, [selectedPeriod])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/analytics/dashboard?period=${selectedPeriod}`)
      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  if (!data) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900">Failed to load dashboard</h2>
              <button 
                onClick={fetchDashboardData}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK'
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('sv-SE').format(value)
  }

  // Prepare data for 3D surface chart
  const surfaceData = {
    z: data.salesTrend.map((_, i) => 
      data.topProducts.map((_, j) => 
        Math.sin(i / 3) * Math.cos(j / 2) * 1000 + 2000
      )
    ),
    x: data.topProducts.map(p => p.name),
    y: data.salesTrend.slice(0, 15).map(d => d.date),
    type: 'surface' as const,
    colorscale: 'YlGnBu' as any,
    hovertemplate: 'Product: %{x}<br>Date: %{y}<br>Sales: %{z}<extra></extra>',
    colorbar: {
      title: false,
      thickness: 8,
      len: 0.7
    }
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>Dashboard - RE:Commerce Enterprise</title>
        </Head>
        
        <div className="p-6 space-y-6 bg-gray-50 min-h-full">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(data.overview.totalSales)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(data.overview.totalOrders)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatNumber(data.overview.totalCustomers)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(data.overview.avgOrderValue)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
                Sales Trend
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.salesTrend.slice(-14)}>
                    <XAxis 
                      dataKey="date" 
                      tickLine={false} 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => new Date(value).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis 
                      tickLine={false} 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => `${value/1000}k`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke={colors[0]} 
                      fill={colors[0]}
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.topProducts} layout="horizontal">
                    <XAxis 
                      type="number" 
                      tickLine={false} 
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      tickLine={false} 
                      tick={{ fontSize: 10 }}
                      width={80}
                    />
                    <Bar dataKey="sales" fill={colors[1]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Segments Pie Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segments</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.customerSegments}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="customers"
                      label={({ segment, percent }) => `${segment} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                    >
                      {data.customerSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Geographic Sales */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="h-5 w-5 mr-2 text-green-600" />
                Geographic Sales
              </h3>
              <div className="space-y-3">
                {data.geographicData.map((country, index) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="text-sm font-medium text-gray-700">{country.country}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(country.sales)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {country.orders} orders
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-blue-600" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {data.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`p-1 rounded-full mr-3 ${
                      activity.type === 'sale' ? 'bg-green-100' :
                      activity.type === 'signup' ? 'bg-blue-100' :
                      activity.type === 'widget' ? 'bg-purple-100' :
                      'bg-gray-100'
                    }`}>
                      {activity.type === 'sale' ? <DollarSign className="h-3 w-3 text-green-600" /> :
                       activity.type === 'signup' ? <Users className="h-3 w-3 text-blue-600" /> :
                       activity.type === 'widget' ? <BarChart3 className="h-3 w-3 text-purple-600" /> :
                       <Zap className="h-3 w-3 text-gray-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString('sv-SE')}
                      </p>
                    </div>
                    {activity.value && (
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(activity.value)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3D Surface Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">3D Sales Surface Analysis</h3>
            <div className="h-96">
              <Plot
                data={[surfaceData]}
                layout={{
                  scene: {
                    xaxis: { 
                      showspikes: false,
                      backgroundcolor: '#f8fafc',
                      showbackground: true,
                      showgrid: true,
                      title: { text: 'Products', font: { size: 11 } }
                    },
                    yaxis: { 
                      showspikes: false,
                      backgroundcolor: '#f8fafc',
                      showbackground: true,
                      showgrid: true,
                      title: { text: 'Time', font: { size: 11 } }
                    },
                    zaxis: { 
                      showspikes: false,
                      backgroundcolor: '#f8fafc',
                      showbackground: true,
                      showgrid: true,
                      title: { text: 'Sales', font: { size: 11 } }
                    },
                    camera: { eye: { x: 1.25, y: 1.25, z: 1.25 } }
                  },
                  hovermode: 'closest',
                  hoverlabel: {
                    bgcolor: '#1f2937',
                    font: { size: 13, color: '#ffffff' }
                  },
                  title: false,
                  margin: { l: 0, r: 0, t: 0, b: 0 }
                } as any}
                config={{
                  responsive: true,
                  displaylogo: false,
                  modeBarButtonsToRemove: ["autoScale2d", "autoscale", "editInChartStudio", "editinchartstudio", "hoverCompareCartesian", "hovercompare", "lasso", "lasso2d", "orbitRotation", "orbitrotation", "pan", "pan2d", "pan3d", "resetSankeyGroup", "resetViewMap", "resetViewMapbox", "resetViews", "resetcameradefault", "resetsankeygroup", "select", "select2d", "sendDataToCloud", "senddatatocloud", "tableRotation", "tablerotation", "toggleHover", "toggleSpikelines", "togglehover", "togglespikelines", "zoom", "zoom2d", "zoom3d", "zoomIn2d", "zoomInGeo", "zoomInMap", "zoomInMapbox", "zoomOut2d", "zoomOutGeo", "zoomOutMap", "zoomOutMapbox", "zoomin", "zoomout"] as any
                }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>

          {/* System Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Widget Interactions</h3>
              <p className="text-3xl font-bold text-indigo-600">{data.widgetInteractions}</p>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Scene Views</h3>
              <p className="text-3xl font-bold text-green-600">{data.sceneViews}</p>
              <p className="text-sm text-gray-500 mt-1">This month</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">System Health</h3>
              <p className="text-3xl font-bold text-green-600">99.9%</p>
              <p className="text-sm text-gray-500 mt-1">Uptime</p>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
