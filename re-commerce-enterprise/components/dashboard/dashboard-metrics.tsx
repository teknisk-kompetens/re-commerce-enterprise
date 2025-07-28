
'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  CheckCircle2, 
  FolderOpen,
  Clock,
  Target,
  Activity
} from 'lucide-react'
import { motion } from 'framer-motion'

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon: React.ElementType
  color: string
  index: number
}

function MetricCard({ title, value, change, trend, icon: Icon, color, index }: MetricCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const numericValue = typeof value === 'string' ? parseInt(value) || 0 : value
    const duration = 2000
    const steps = 60
    const increment = numericValue / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        setAnimatedValue(numericValue)
        clearInterval(timer)
      } else {
        setAnimatedValue(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow">
        <div className={`absolute inset-0 ${color} opacity-5 group-hover:opacity-10 transition-opacity`} />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {title}
          </CardTitle>
          <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
            <Icon className={`h-4 w-4 ${color.replace('bg-', 'text-')}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {typeof value === 'string' ? value : animatedValue.toLocaleString()}
          </div>
          {change !== undefined && (
            <div className="flex items-center space-x-2 mt-2">
              {trend === 'up' && (
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className="text-xs">+{change}%</span>
                </div>
              )}
              {trend === 'down' && (
                <div className="flex items-center text-red-600">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  <span className="text-xs">-{change}%</span>
                </div>
              )}
              {trend === 'neutral' && (
                <Badge variant="secondary" className="text-xs">
                  {change}%
                </Badge>
              )}
              <span className="text-xs text-slate-500 dark:text-slate-400">
                vs last month
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/analytics')
        const data = await response.json()
        setMetrics(data.dashboardMetrics)
      } catch (error) {
        console.error('Failed to fetch metrics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const metricCards = [
    {
      title: 'Total Tasks',
      value: metrics?.totalTasks || 0,
      change: 12,
      trend: 'up' as const,
      icon: CheckCircle2,
      color: 'bg-blue-500'
    },
    {
      title: 'Completed Tasks',
      value: metrics?.completedTasks || 0,
      change: 8,
      trend: 'up' as const,
      icon: Target,
      color: 'bg-green-500'
    },
    {
      title: 'Active Users',
      value: metrics?.activeUsers || 0,
      change: 3,
      trend: 'up' as const,
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Projects',
      value: metrics?.totalProjects || 0,
      change: 15,
      trend: 'up' as const,
      icon: FolderOpen,
      color: 'bg-orange-500'
    },
    {
      title: 'Completion Rate',
      value: `${metrics?.completionRate || 0}%`,
      change: 5,
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'bg-cyan-500'
    },
    {
      title: 'Average Task Time',
      value: `${metrics?.averageTaskTime || 0}h`,
      change: 2,
      trend: 'down' as const,
      icon: Clock,
      color: 'bg-pink-500'
    },
    {
      title: 'Total Users',
      value: metrics?.totalUsers || 0,
      change: 7,
      trend: 'up' as const,
      icon: Activity,
      color: 'bg-indigo-500'
    },
    {
      title: 'Success Rate',
      value: '94%',
      change: 1,
      trend: 'up' as const,
      icon: CheckCircle2,
      color: 'bg-emerald-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, index) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          trend={metric.trend}
          icon={metric.icon}
          color={metric.color}
          index={index}
        />
      ))}
    </div>
  )
}
