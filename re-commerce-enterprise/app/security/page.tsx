
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Users, 
  Activity,
  TrendingUp,
  BarChart3,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Zap
} from 'lucide-react'

interface SecurityMetrics {
  securityScore: number
  activeThreats: number
  blockedAttacks: number
  complianceScore: number
  alertsToday: number
  incidentsOpen: number
}

interface SecurityEvent {
  id: string
  timestamp: string
  type: string
  severity: string
  description: string
  source: string
  status: string
}

interface SecurityAlert {
  id: string
  title: string
  severity: string
  timestamp: string
  status: string
  source: string
}

export default function SecurityDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [alerts, setAlerts] = useState<SecurityAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSecurityData()
  }, [])

  const loadSecurityData = async () => {
    try {
      setLoading(true)
      
      // Mock data - in production, this would fetch from the SIEM API
      setMetrics({
        securityScore: 92,
        activeThreats: 3,
        blockedAttacks: 156,
        complianceScore: 88,
        alertsToday: 12,
        incidentsOpen: 2
      })

      setEvents([
        {
          id: '1',
          timestamp: new Date().toISOString(),
          type: 'authentication',
          severity: 'medium',
          description: 'Multiple failed login attempts detected',
          source: '192.168.1.100',
          status: 'investigating'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'network',
          severity: 'high',
          description: 'Suspicious network traffic from external IP',
          source: '203.0.113.42',
          status: 'blocked'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          type: 'application',
          severity: 'low',
          description: 'WAF rule triggered for SQL injection attempt',
          source: '198.51.100.15',
          status: 'resolved'
        }
      ])

      setAlerts([
        {
          id: '1',
          title: 'Critical Security Alert: Potential Data Breach',
          severity: 'critical',
          timestamp: new Date().toISOString(),
          status: 'active',
          source: 'threat_detection'
        },
        {
          id: '2',
          title: 'High Risk User Behavior Detected',
          severity: 'high',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          status: 'acknowledged',
          source: 'behavioral_analytics'
        },
        {
          id: '3',
          title: 'Failed Compliance Check: GDPR Data Retention',
          severity: 'medium',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'in_progress',
          source: 'compliance_monitor'
        }
      ])

    } catch (error) {
      console.error('Error loading security data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'investigating':
        return <Clock className="h-4 w-4" />
      case 'resolved':
      case 'blocked':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'acknowledged':
      case 'in_progress':
        return <Activity className="h-4 w-4 text-yellow-500" />
      default:
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Security Center</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold">Security Center</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Comprehensive security monitoring and threat detection
              </p>
            </div>
          </div>
          <Button className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Configure</span>
          </Button>
        </div>

        {/* Security Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Security Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="text-3xl font-bold text-green-600">{metrics?.securityScore}%</div>
                <div className="flex-1">
                  <Progress value={metrics?.securityScore || 0} className="h-2" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">↑ 2% from last week</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Threats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-8 w-8 text-red-500" />
                <div>
                  <div className="text-3xl font-bold">{metrics?.activeThreats}</div>
                  <p className="text-xs text-gray-500">Critical: 1, High: 2</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Blocked Attacks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-blue-500" />
                <div>
                  <div className="text-3xl font-bold">{metrics?.blockedAttacks}</div>
                  <p className="text-xs text-gray-500">Last 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Compliance Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className="text-3xl font-bold text-yellow-600">{metrics?.complianceScore}%</div>
                <div className="flex-1">
                  <Progress value={metrics?.complianceScore || 0} className="h-2" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">GDPR, SOC 2, ISO 27001</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="alerts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Events</span>
            </TabsTrigger>
            <TabsTrigger value="threats" className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Threats</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="access" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Access</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Security Alerts</h2>
              <div className="flex space-x-2">
                <Button variant="outline">Filter</Button>
                <Button variant="outline">Export</Button>
              </div>
            </div>
            
            <div className="grid gap-4">
              {alerts.map((alert) => (
                <Card key={alert.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge variant={getSeverityBadgeVariant(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{alert.source}</Badge>
                          {getStatusIcon(alert.status)}
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{alert.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          Status: {alert.status}
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Acknowledge</Button>
                        <Button size="sm">Investigate</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Security Events</h2>
              <div className="flex space-x-2">
                <Button variant="outline">Real-time</Button>
                <Button variant="outline">Export</Button>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
                <CardDescription>
                  Real-time monitoring of security events across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(event.severity)}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline" className="text-xs">{event.type}</Badge>
                          <Badge variant={getSeverityBadgeVariant(event.severity)} className="text-xs">
                            {event.severity}
                          </Badge>
                        </div>
                        <p className="font-medium">{event.description}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Source: {event.source} • {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(event.status)}
                        <Badge variant="outline" className="text-xs">
                          {event.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="threats" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Threat Intelligence</h2>
              <div className="flex space-x-2">
                <Button variant="outline">Threat Hunt</Button>
                <Button variant="outline">IOC Analysis</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Threat Trends</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SQL Injection Attempts</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full w-3/4"></div>
                        </div>
                        <span className="text-sm font-medium">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Brute Force Attacks</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full w-1/2"></div>
                        </div>
                        <span className="text-sm font-medium">50%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">XSS Attempts</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full w-1/4"></div>
                        </div>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Attack Sources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">203.0.113.0/24</span>
                      <Badge variant="destructive" className="text-xs">High Risk</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">198.51.100.0/24</span>
                      <Badge variant="secondary" className="text-xs">Medium Risk</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">192.0.2.0/24</span>
                      <Badge variant="outline" className="text-xs">Low Risk</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Compliance Status</h2>
              <div className="flex space-x-2">
                <Button variant="outline">Generate Report</Button>
                <Button variant="outline">Schedule Audit</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">GDPR Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <Progress value={95} className="mb-2" />
                  <p className="text-sm text-gray-600">Last assessment: 2 days ago</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">SOC 2 Type II</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-2xl font-bold text-yellow-600">78%</div>
                    <Clock className="h-6 w-6 text-yellow-500" />
                  </div>
                  <Progress value={78} className="mb-2" />
                  <p className="text-sm text-gray-600">In progress</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">ISO 27001</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-2xl font-bold text-green-600">92%</div>
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <Progress value={92} className="mb-2" />
                  <p className="text-sm text-gray-600">Certified</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Access Control</h2>
              <div className="flex space-x-2">
                <Button variant="outline">Access Review</Button>
                <Button variant="outline">JIT Requests</Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Access Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Admin access granted</p>
                        <p className="text-sm text-gray-600">john@company.com</p>
                      </div>
                      <Badge variant="outline">Approved</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Privileged access request</p>
                        <p className="text-sm text-gray-600">jane@company.com</p>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">Role modification</p>
                        <p className="text-sm text-gray-600">mike@company.com</p>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Security Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Sessions</span>
                      <span className="font-medium">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Failed Login Attempts</span>
                      <span className="font-medium text-red-600">23</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">MFA Enabled Users</span>
                      <span className="font-medium text-green-600">94%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Privileged Accounts</span>
                      <span className="font-medium">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex flex-col space-y-2">
                <Shield className="h-6 w-6" />
                <span className="text-sm">Run Security Scan</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col space-y-2">
                <Eye className="h-6 w-6" />
                <span className="text-sm">Threat Hunt</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col space-y-2">
                <Lock className="h-6 w-6" />
                <span className="text-sm">Policy Review</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col space-y-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">Access Audit</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
