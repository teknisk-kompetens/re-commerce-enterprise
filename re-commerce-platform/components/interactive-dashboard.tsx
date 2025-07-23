
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  BarChart3, 
  Target,
  Brain,
  Zap,
  RefreshCw,
  Eye,
  DollarSign,
  Clock,
  Activity
} from 'lucide-react'

interface DashboardProps {
  platform: string
  accentColor?: string
}

export default function InteractiveDashboard({ platform, accentColor = 'text-blue-600' }: DashboardProps) {
  const [activeMetric, setActiveMetric] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Mock data that updates based on platform
  const getDashboardData = () => {
    switch (platform) {
      case 'enterprise-suite':
        return {
          title: 'Enterprise SEO Dashboard',
          metrics: [
            { icon: TrendingUp, label: 'Organic Traffic', value: '245%', trend: '+12%', color: 'text-green-600' },
            { icon: BarChart3, label: 'Core Web Vitals', value: '98/100', trend: '+15%', color: 'text-blue-600' },
            { icon: Users, label: 'Conversion Rate', value: '4.8%', trend: '+0.7%', color: 'text-purple-600' },
            { icon: DollarSign, label: 'Revenue Impact', value: '€2.1M', trend: '+28%', color: 'text-green-600' }
          ],
          chart: {
            title: 'SEO Performance Trend',
            data: [65, 78, 82, 89, 95, 98]
          }
        }
      case 'leadsgen':
        return {
          title: 'LeadsGen Analytics Dashboard',
          metrics: [
            { icon: Target, label: 'Lead Quality Score', value: '9.2/10', trend: '+1.1', color: 'text-green-600' },
            { icon: Users, label: 'Qualified Leads', value: '1,247', trend: '+34%', color: 'text-blue-600' },
            { icon: DollarSign, label: 'Cost per Lead', value: '€23', trend: '-18%', color: 'text-green-600' },
            { icon: Activity, label: 'Conversion Rate', value: '7.3%', trend: '+2.1%', color: 'text-purple-600' }
          ],
          chart: {
            title: 'Lead Generation Trend',
            data: [420, 512, 634, 789, 945, 1247]
          }
        }
      case 'ai-suite':
        return {
          title: 'AI Analytics Dashboard',
          metrics: [
            { icon: Brain, label: 'Prediction Accuracy', value: '94.2%', trend: '+3.1%', color: 'text-purple-600' },
            { icon: Zap, label: 'Automation Rate', value: '87%', trend: '+12%', color: 'text-blue-600' },
            { icon: Eye, label: 'Personalization', value: '8.9/10', trend: '+0.8', color: 'text-green-600' },
            { icon: Clock, label: 'Response Time', value: '0.23s', trend: '-15%', color: 'text-green-600' }
          ],
          chart: {
            title: 'AI Performance Metrics',
            data: [78, 82, 87, 89, 92, 94]
          }
        }
      default:
        return {
          title: 'Platform Dashboard',
          metrics: [],
          chart: { title: 'Performance', data: [] }
        }
    }
  }

  const dashboardData = getDashboardData()

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1500)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % dashboardData.metrics.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [dashboardData.metrics.length])

  return (
    <Card className="h-full bg-white shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            {dashboardData.title}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Uppdatera dashboard"
          >
            <RefreshCw 
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} 
              aria-hidden="true" 
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {dashboardData.metrics.map((metric, index) => {
            const IconComponent = metric.icon
            const isActive = index === activeMetric
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0.7, scale: 0.95 }}
                animate={{ 
                  opacity: isActive ? 1 : 0.7, 
                  scale: isActive ? 1 : 0.95,
                  borderColor: isActive ? '#3B82F6' : '#E5E7EB'
                }}
                transition={{ duration: 0.3 }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isActive ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <IconComponent 
                    className={`h-4 w-4 ${metric.color}`} 
                    aria-hidden="true" 
                  />
                  <span className="text-xs font-medium text-gray-600">
                    {metric.label}
                  </span>
                </div>
                <div className="mt-1">
                  <div className="text-lg font-bold text-gray-900">
                    {metric.value}
                  </div>
                  <div className={`text-xs ${metric.color}`}>
                    {metric.trend}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Mini Chart */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {dashboardData.chart.title}
          </h4>
          <div className="flex items-end space-x-1 h-16">
            {dashboardData.chart.data.map((value, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${(value / 100) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-blue-500 rounded-t flex-1 min-w-0"
                style={{ opacity: 0.7 + (value / 100) * 0.3 }}
                aria-label={`Data point ${index + 1}: ${value}%`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>6 månader sedan</span>
            <span>Nu</span>
          </div>
        </div>

        {/* Interactive Elements */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs border-gray-300 hover:bg-gray-50"
            aria-label="Visa detaljerad rapport"
          >
            Detaljerad rapport
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs border-gray-300 hover:bg-gray-50"
            aria-label="Exportera data"
          >
            Exportera data
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
