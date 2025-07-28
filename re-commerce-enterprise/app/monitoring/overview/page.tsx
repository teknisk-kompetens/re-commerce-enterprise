
/**
 * MONITORING OVERVIEW PAGE
 * Comprehensive overview of all monitoring and analytics systems
 */

import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Activity,
  BarChart3,
  Clock,
  Eye,
  Heart,
  TrendingUp,
  Users,
  Zap,
  Database,
  AlertTriangle,
  MousePointer
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Monitoring Overview | Enterprise Platform',
  description: 'Comprehensive overview of all monitoring and analytics systems',
};

export default function MonitoringOverviewPage() {
  const monitoringCards = [
    {
      title: 'Real-time Monitoring',
      description: 'Live system metrics, alerts, and resource usage monitoring',
      icon: <Activity className="h-8 w-8 text-blue-600" />,
      href: '/monitoring/real-time',
      color: 'border-blue-200 bg-blue-50',
      features: ['Live System Metrics', 'Resource Usage Tracking', 'Real-time Alerts', 'Performance Monitoring']
    },
    {
      title: 'Advanced Analytics',
      description: 'User engagement, feature usage, and business intelligence',
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      href: '/analytics/advanced',
      color: 'border-green-200 bg-green-50',
      features: ['User Engagement Analytics', 'Feature Usage Statistics', 'Conversion Funnels', 'Revenue Analytics']
    },
    {
      title: 'Performance Metrics',
      description: 'APM, Core Web Vitals, and database performance tracking',
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      href: '/performance/metrics',
      color: 'border-yellow-200 bg-yellow-50',
      features: ['APM Metrics', 'Core Web Vitals', 'Database Performance', 'Error Tracking']
    },
    {
      title: 'User Behavior Analytics',
      description: 'Journey tracking, heatmaps, and A/B testing insights',
      icon: <Eye className="h-8 w-8 text-purple-600" />,
      href: '/behavior/analytics',
      color: 'border-purple-200 bg-purple-50',
      features: ['User Journey Tracking', 'Heatmap Analysis', 'Session Recording', 'A/B Testing']
    },
    {
      title: 'System Health Monitoring',
      description: 'Uptime monitoring, error tracking, and incident response',
      icon: <Heart className="h-8 w-8 text-red-600" />,
      href: '/health/monitoring',
      color: 'border-red-200 bg-red-50',
      features: ['Uptime Monitoring', 'Error Rate Tracking', 'Alert Management', 'Incident Response']
    }
  ];

  const quickStats = [
    {
      title: 'System Health',
      value: '98.7%',
      icon: <Heart className="h-5 w-5 text-green-600" />,
      description: 'Overall system health score'
    },
    {
      title: 'Uptime',
      value: '99.95%',
      icon: <Clock className="h-5 w-5 text-blue-600" />,
      description: 'Last 30 days uptime'
    },
    {
      title: 'Active Users',
      value: '12.5K',
      icon: <Users className="h-5 w-5 text-purple-600" />,
      description: 'Monthly active users'
    },
    {
      title: 'Error Rate',
      value: '0.02%',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
      description: 'Current error rate'
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Monitoring & Analytics Overview</h2>
          <p className="text-muted-foreground">
            Comprehensive monitoring and analytics platform for system health, performance, and user insights
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-opacity-10 bg-gray-100">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monitoring Dashboards */}
      <div>
        <h3 className="text-2xl font-semibold mb-4">Monitoring Dashboards</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {monitoringCards.map((card, index) => (
            <Card key={index} className={`transition-all duration-200 hover:shadow-lg ${card.color}`}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {card.icon}
                  <div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {card.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {card.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-current opacity-60" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href={card.href}>
                  <Button className="w-full">
                    View Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Key Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center space-x-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span>Real-time Monitoring</span>
              </h4>
              <p className="text-sm text-muted-foreground pl-6">
                Live system metrics with 100+ data points, real-time alerts, and resource usage tracking
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-green-600" />
                <span>Advanced Analytics</span>
              </h4>
              <p className="text-sm text-muted-foreground pl-6">
                User behavior analysis, conversion tracking, and business intelligence dashboards
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center space-x-2">
                <Database className="h-4 w-4 text-purple-600" />
                <span>Performance Optimization</span>
              </h4>
              <p className="text-sm text-muted-foreground pl-6">
                APM monitoring, Core Web Vitals tracking, and database performance analysis
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MousePointer className="h-5 w-5" />
              <span>Getting Started</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <h4 className="font-medium">1. System Health Check</h4>
              <p className="text-sm text-muted-foreground">
                Start with the System Health Monitoring dashboard to get an overview of your infrastructure
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">2. Performance Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Review Performance Metrics to identify optimization opportunities
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">3. User Insights</h4>
              <p className="text-sm text-muted-foreground">
                Explore User Behavior Analytics to understand user engagement patterns
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">4. Business Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Dive into Advanced Analytics for business intelligence and revenue insights
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
