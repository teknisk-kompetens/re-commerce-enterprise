
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { motion } from 'framer-motion'

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3']

export function DashboardCharts() {
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('/api/analytics')
        const data = await response.json()
        setChartData(data.dashboardMetrics)
      } catch (error) {
        console.error('Failed to fetch chart data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-200 rounded"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-200 rounded"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Mock data for demonstration
  const taskTrendData = [
    { date: '2024-01-01', completed: 12, total: 15 },
    { date: '2024-01-02', completed: 18, total: 20 },
    { date: '2024-01-03', completed: 22, total: 25 },
    { date: '2024-01-04', completed: 30, total: 35 },
    { date: '2024-01-05', completed: 28, total: 32 },
    { date: '2024-01-06', completed: 35, total: 40 },
    { date: '2024-01-07', completed: 42, total: 45 }
  ]

  const projectProgressData = chartData?.projectProgress?.slice(0, 6) || [
    { name: 'Website Redesign', progress: 85 },
    { name: 'Mobile App', progress: 60 },
    { name: 'API Integration', progress: 90 },
    { name: 'Database Migration', progress: 45 },
    { name: 'Security Audit', progress: 75 },
    { name: 'Performance Optimization', progress: 30 }
  ]

  const userActivityData = [
    { name: 'Active', value: chartData?.activeUsers || 45 },
    { name: 'Inactive', value: (chartData?.totalUsers || 60) - (chartData?.activeUsers || 45) }
  ]

  return (
    <div className="space-y-6">
      {/* Task Completion Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Task Completion Trend</CardTitle>
              <Badge variant="secondary">Last 7 days</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={taskTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#60B5FF" 
                  strokeWidth={3}
                  dot={{ fill: '#60B5FF', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#FF9149" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#FF9149', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Project Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Project Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectProgressData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                />
                <YAxis 
                  type="category" 
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  width={120}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px'
                  }}
                />
                <Bar 
                  dataKey="progress" 
                  fill="#60B5FF"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* User Activity Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">User Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={userActivityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {userActivityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
