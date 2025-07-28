
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
  Zap,
  Brain,
  Fingerprint,
  Key,
  Network,
  Bot,
  ShieldCheck,
  AlertCircle,
  Target,
  Cpu,
  Database,
  Globe,
  Server,
  FileText,
  PlayCircle,
  Pause,
  RotateCcw,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Download,
  Upload,
  Share,
  MoreHorizontal,
  Layers,
  Workflow,
  Binary,
  Radar,
  Crosshair
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

interface SecuritySummary {
  threatIntelligence: {
    events: number
    campaigns: number
    indicators: number
    riskLevel: string
    lastUpdated: string
  }
  quantumCryptography: {
    quantumKeys: number
    homomorphicOperations: number
    tokenizations: number
    quantumReadiness: string
  }
  orchestration: {
    playbooks: number
    executions: number
    incidents: number
    automationLevel: string
  }
  securityPosture: {
    score: number
    riskLevel: string
    capabilities: {
      passwordless: boolean
      behavioralAnalytics: boolean
      aiThreatIntelligence: boolean
      quantumResistant: boolean
      selfHealing: boolean
    }
  }
}

interface ThreatIntelligenceData {
  indicators: any[]
  campaigns: any[]
  predictions: any[]
  riskAssessment: any
  recommendations: any[]
}

interface BehavioralAnalysis {
  userId: string
  riskScore: number
  confidence: number
  anomalies: any[]
  recommendations: string[]
  continuousAuthScore: number
  learningPhase: boolean
}

export default function AdvancedSecurityCenter() {
  const [summary, setSummary] = useState<SecuritySummary | null>(null)
  const [threatIntelligence, setThreatIntelligence] = useState<ThreatIntelligenceData | null>(null)
  const [behavioralAnalysis, setBehavioralAnalysis] = useState<BehavioralAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadSecurityData()
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadSecurityData, 30000)
    setRefreshInterval(interval)
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [])

  const loadSecurityData = async () => {
    try {
      setLoading(true)
      
      const [summaryRes, threatRes, behavioralRes] = await Promise.all([
        fetch('/api/advanced-security/summary'),
        fetch('/api/advanced-security/threat-intelligence'),
        fetch('/api/advanced-security/behavioral-analytics?userId=user123')
      ])
      
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json()
        setSummary(summaryData)
      }
      
      if (threatRes.ok) {
        const threatData = await threatRes.json()
        setThreatIntelligence(threatData)
      }
      
      if (behavioralRes.ok) {
        const behavioralData = await behavioralRes.json()
        setBehavioralAnalysis(behavioralData)
      }
    } catch (error) {
      console.error('Error loading security data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-500'
      case 'active': return 'text-green-500'
      case 'high': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'critical': return 'text-red-500'
      case 'not_ready': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  if (loading && !summary) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white">Loading Advanced Security Center...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Shield className="h-8 w-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Advanced Security Center</h1>
                <p className="text-gray-300">Military-grade AI-powered security command center</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={loadSecurityData}
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Badge variant="outline" className="border-green-500 text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                LIVE
              </Badge>
            </div>
          </div>

          {/* Security Posture Overview */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Security Score</p>
                      <p className="text-2xl font-bold text-white">{summary.securityPosture.score}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${getSeverityColor(summary.securityPosture.riskLevel)}/20`}>
                      <Shield className={`h-5 w-5 ${getStatusColor(summary.securityPosture.riskLevel)}`} />
                    </div>
                  </div>
                  <Progress value={summary.securityPosture.score} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Active Threats</p>
                      <p className="text-2xl font-bold text-white">{summary.threatIntelligence.events}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {summary.threatIntelligence.campaigns} APT campaigns
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Quantum Ready</p>
                      <p className="text-2xl font-bold text-white">{summary.quantumCryptography.quantumKeys}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-500/20">
                      <Binary className="h-5 w-5 text-purple-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {summary.quantumCryptography.quantumReadiness}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Automation</p>
                      <p className="text-2xl font-bold text-white">{summary.orchestration.playbooks}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-500/20">
                      <Bot className="h-5 w-5 text-blue-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    {summary.orchestration.automationLevel} level
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="authentication" className="data-[state=active]:bg-blue-500">
              <Fingerprint className="h-4 w-4 mr-2" />
              Auth
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="data-[state=active]:bg-blue-500">
              <Brain className="h-4 w-4 mr-2" />
              Intelligence
            </TabsTrigger>
            <TabsTrigger value="crypto" className="data-[state=active]:bg-blue-500">
              <Key className="h-4 w-4 mr-2" />
              Crypto
            </TabsTrigger>
            <TabsTrigger value="orchestration" className="data-[state=active]:bg-blue-500">
              <Workflow className="h-4 w-4 mr-2" />
              Orchestration
            </TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:bg-blue-500">
              <FileText className="h-4 w-4 mr-2" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-500">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Security Capabilities */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <ShieldCheck className="h-5 w-5 mr-2 text-blue-400" />
                    Security Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {summary && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Fingerprint className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-gray-300">Passwordless Auth</span>
                        </div>
                        {summary.securityPosture.capabilities.passwordless ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Brain className="h-4 w-4 text-purple-400" />
                          <span className="text-sm text-gray-300">Behavioral Analytics</span>
                        </div>
                        {summary.securityPosture.capabilities.behavioralAnalytics ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-orange-400" />
                          <span className="text-sm text-gray-300">AI Threat Intelligence</span>
                        </div>
                        {summary.securityPosture.capabilities.aiThreatIntelligence ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Binary className="h-4 w-4 text-purple-400" />
                          <span className="text-sm text-gray-300">Quantum Resistant</span>
                        </div>
                        {summary.securityPosture.capabilities.quantumResistant ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <RotateCcw className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-gray-300">Self-Healing</span>
                        </div>
                        {summary.securityPosture.capabilities.selfHealing ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Real-time Threat Feed */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-red-400" />
                    Live Threat Feed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-red-400">High</span>
                      </div>
                      <span className="text-xs text-gray-400">2 min ago</span>
                    </div>
                    <p className="text-sm text-gray-300">Suspicious IP activity detected</p>
                    
                    <div className="flex items-center justify-between p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-yellow-400">Medium</span>
                      </div>
                      <span className="text-xs text-gray-400">5 min ago</span>
                    </div>
                    <p className="text-sm text-gray-300">Unusual network traffic pattern</p>
                    
                    <div className="flex items-center justify-between p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-orange-400">High</span>
                      </div>
                      <span className="text-xs text-gray-400">8 min ago</span>
                    </div>
                    <p className="text-sm text-gray-300">Behavioral anomaly detected</p>
                  </div>
                </CardContent>
              </Card>

              {/* AI Security Assistant */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-blue-400" />
                    AI Security Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Bot className="h-4 w-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">AI Recommendation</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        Consider enabling additional MFA for accounts with elevated privileges based on recent threat intelligence.
                      </p>
                    </div>
                    
                    <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">Action Completed</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        Quantum-resistant keys rotated successfully. Your cryptographic infrastructure is now future-proof.
                      </p>
                    </div>
                    
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                      <Brain className="h-4 w-4 mr-2" />
                      Ask AI Assistant
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Security Metrics Chart */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Security Metrics Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={generateSecurityMetrics()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="time" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }} 
                      />
                      <Line type="monotone" dataKey="threats" stroke="#EF4444" strokeWidth={2} />
                      <Line type="monotone" dataKey="security" stroke="#10B981" strokeWidth={2} />
                      <Line type="monotone" dataKey="compliance" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Authentication Tab */}
          <TabsContent value="authentication" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Fingerprint className="h-5 w-5 mr-2 text-blue-400" />
                    Passwordless Authentication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center justify-between">
                          <Key className="h-5 w-5 text-blue-400" />
                          <span className="text-2xl font-bold text-white">247</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">WebAuthn Keys</p>
                      </div>
                      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center justify-between">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <span className="text-2xl font-bold text-white">98.7%</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Success Rate</p>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                      <Key className="h-4 w-4 mr-2" />
                      Configure WebAuthn
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-purple-400" />
                    Behavioral Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {behavioralAnalysis && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                          <div className="flex items-center justify-between">
                            <Brain className="h-5 w-5 text-purple-400" />
                            <span className="text-2xl font-bold text-white">{behavioralAnalysis.riskScore}</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">Risk Score</p>
                        </div>
                        <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                          <div className="flex items-center justify-between">
                            <Activity className="h-5 w-5 text-green-400" />
                            <span className="text-2xl font-bold text-white">{Math.round(behavioralAnalysis.confidence * 100)}%</span>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">Confidence</p>
                        </div>
                      </div>
                    )}
                    
                    <Button className="w-full bg-purple-500 hover:bg-purple-600">
                      <Brain className="h-4 w-4 mr-2" />
                      View Behavioral Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Threat Intelligence Tab */}
          <TabsContent value="intelligence" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="h-5 w-5 mr-2 text-red-400" />
                    Threat Indicators
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Active Indicators</span>
                      <Badge variant="destructive">1,247</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">IP Addresses</span>
                      <span className="text-sm text-white">892</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Domains</span>
                      <span className="text-sm text-white">203</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">File Hashes</span>
                      <span className="text-sm text-white">152</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Crosshair className="h-5 w-5 mr-2 text-orange-400" />
                    APT Campaigns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-red-400">APT29</span>
                        <Badge variant="destructive">Active</Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Cozy Bear - Russian state-sponsored</p>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-yellow-400">APT28</span>
                        <Badge variant="outline">Monitoring</Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Fancy Bear - Military intelligence</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-blue-400" />
                    AI Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-400">Phishing Campaign</span>
                        <span className="text-sm text-white">78%</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Next 24 hours</p>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-400">Malware Outbreak</span>
                        <span className="text-sm text-white">34%</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Next 7 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Radar className="h-5 w-5 mr-2 text-green-400" />
                  Threat Hunting Console
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter hunting query..."
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Button className="bg-green-500 hover:bg-green-600">
                      <Search className="h-4 w-4 mr-2" />
                      Hunt
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <Button variant="outline" className="border-gray-600 text-gray-300">
                      <Target className="h-4 w-4 mr-2" />
                      IOC Hunt
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-300">
                      <Activity className="h-4 w-4 mr-2" />
                      Behavior Hunt
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-300">
                      <Network className="h-4 w-4 mr-2" />
                      Network Hunt
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quantum Cryptography Tab */}
          <TabsContent value="crypto" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Binary className="h-5 w-5 mr-2 text-purple-400" />
                    Quantum-Resistant Cryptography
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="flex items-center justify-between">
                          <Key className="h-5 w-5 text-purple-400" />
                          <span className="text-2xl font-bold text-white">47</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Quantum Keys</p>
                      </div>
                      <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <div className="flex items-center justify-between">
                          <Cpu className="h-5 w-5 text-blue-400" />
                          <span className="text-2xl font-bold text-white">1,234</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Homomorphic Ops</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Kyber768</span>
                        <Badge variant="outline" className="border-green-500 text-green-400">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Dilithium3</span>
                        <Badge variant="outline" className="border-green-500 text-green-400">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">SPHINCS+</span>
                        <Badge variant="outline" className="border-yellow-500 text-yellow-400">Pending</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Database className="h-5 w-5 mr-2 text-green-400" />
                    Data Protection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <div className="flex items-center justify-between">
                          <Shield className="h-5 w-5 text-green-400" />
                          <span className="text-2xl font-bold text-white">5.2K</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Tokenizations</p>
                      </div>
                      <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                        <div className="flex items-center justify-between">
                          <Eye className="h-5 w-5 text-purple-400" />
                          <span className="text-2xl font-bold text-white">89%</span>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">Privacy Score</p>
                      </div>
                    </div>
                    
                    <Button className="w-full bg-purple-500 hover:bg-purple-600">
                      <Database className="h-4 w-4 mr-2" />
                      Manage Encryption
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Orchestration Tab */}
          <TabsContent value="orchestration" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <PlayCircle className="h-5 w-5 mr-2 text-blue-400" />
                    Security Playbooks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Active Playbooks</span>
                      <Badge variant="outline" className="border-blue-500 text-blue-400">12</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Executions Today</span>
                      <span className="text-sm text-white">34</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Success Rate</span>
                      <span className="text-sm text-green-400">94.7%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <RotateCcw className="h-5 w-5 mr-2 text-green-400" />
                    Self-Healing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Auto-Remediation</span>
                      <Badge variant="outline" className="border-green-500 text-green-400">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Issues Resolved</span>
                      <span className="text-sm text-white">127</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Avg Resolution Time</span>
                      <span className="text-sm text-green-400">2.3 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Bot className="h-5 w-5 mr-2 text-purple-400" />
                    AI Decisions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">AI Confidence</span>
                      <span className="text-sm text-purple-400">92.4%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Decisions Made</span>
                      <span className="text-sm text-white">1,892</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Human Override</span>
                      <span className="text-sm text-yellow-400">3.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-400" />
                    Compliance Frameworks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">SOC 2 Type II</span>
                      <Badge variant="outline" className="border-green-500 text-green-400">Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">ISO 27001</span>
                      <Badge variant="outline" className="border-green-500 text-green-400">Compliant</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">GDPR</span>
                      <Badge variant="outline" className="border-yellow-500 text-yellow-400">Review</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">HIPAA</span>
                      <Badge variant="outline" className="border-green-500 text-green-400">Compliant</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                    Compliance Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">94.7%</div>
                      <p className="text-sm text-gray-400">Overall Compliance</p>
                    </div>
                    <Progress value={94.7} className="h-2" />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Controls</span>
                      <span>247/261</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Security Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={generateSecurityAnalytics()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area type="monotone" dataKey="incidents" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="resolved" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Helper functions for generating mock data
function generateSecurityMetrics() {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    threats: Math.floor(Math.random() * 50) + 10,
    security: Math.floor(Math.random() * 30) + 70,
    compliance: Math.floor(Math.random() * 20) + 80,
  }))
}

function generateSecurityAnalytics() {
  return Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    incidents: Math.floor(Math.random() * 10) + 2,
    resolved: Math.floor(Math.random() * 8) + 5,
  }))
}
