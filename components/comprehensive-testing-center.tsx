
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TestTube,
  Play,
  Square,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Activity,
  Shield,
  Zap,
  Target,
  BarChart3,
  Settings,
  Download,
  Upload,
  Eye,
  Calendar,
  Timer,
  Gauge,
  TrendingUp,
  TrendingDown,
  Users,
  Database,
  Globe,
  Brain,
  Plug,
  Building,
  Search,
  Filter,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Share,
  Save,
  FileText,
  AlertTriangle,
  Info,
  HelpCircle,
  Lightbulb,
  Cpu,

  HardDrive,
  Network,
  LineChart,
  PieChart,
  Layers,
  Code,
  Bug,
  Wrench,
  Flame,
  Lock,
  Key,
  UserCheck,
  ShieldCheck,
  Fingerprint,
  Radar,
  ScanLine,
  Crosshair,
  Focus,
  Microscope,
  Beaker,
  FlaskConical,
  Atom,
  Dna,
  Workflow,
  GitBranch,
  GitCommit,
  GitMerge,
  Terminal,
  Monitor,
  Server,
  CloudLightning,
  Rocket,
  Sparkles
} from 'lucide-react';

interface TestingSummary {
  totalSuites: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  averageCoverage: number;
  lastRun: Date;
  overallStatus: 'passed' | 'failed' | 'running' | 'pending';
}

interface TestSuite {
  id: string;
  name: string;
  description: string;
  category: 'unit' | 'integration' | 'e2e' | 'performance' | 'security' | 'accessibility';
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  tests: TestCase[];
  coverage: number;
  duration: number;
  lastRun: Date;
}

interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
  assertions: number;
  passed: number;
  failed: number;
}

interface PerformanceTest {
  id: string;
  name: string;
  endpoint: string;
  method: string;
  concurrency: number;
  duration: number;
  results: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    requestsPerSecond: number;
    errorRate: number;
    throughput: number;
  };
  percentiles: {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
  };
}

interface SecurityTest {
  id: string;
  name: string;
  type: 'vulnerability' | 'penetration' | 'compliance' | 'authentication' | 'authorization';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'passed' | 'failed' | 'warning';
  description: string;
  results: {
    vulnerabilities: Array<{
      id: string;
      type: string;
      severity: string;
      description: string;
      remediation: string;
    }>;
    compliance: {
      standard: string;
      score: number;
      requirements: Array<{
        id: string;
        name: string;
        status: 'compliant' | 'non-compliant' | 'partial';
      }>;
    };
  };
}

export function ComprehensiveTestingCenter() {
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState<TestingSummary | null>(null);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [performanceTests, setPerformanceTests] = useState<PerformanceTest[]>([]);
  const [securityTests, setSecurityTests] = useState<SecurityTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [selectedSuite, setSelectedSuite] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadTestingData();
  }, []);

  const loadTestingData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/testing/comprehensive');
      const data = await response.json();
      
      setSummary(data.summary);
      setTestSuites(data.testSuites || []);
      setPerformanceTests(data.performanceTests || []);
      setSecurityTests(data.securityTests || []);
    } catch (error) {
      console.error('Failed to load testing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runTests = async (suiteId?: string) => {
    try {
      setRunning(true);
      const response = await fetch('/api/testing/comprehensive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run', suiteId })
      });
      
      const data = await response.json();
      
      // Simulate test execution
      setTimeout(() => {
        setRunning(false);
        loadTestingData();
      }, 3000);
    } catch (error) {
      console.error('Failed to run tests:', error);
      setRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'running':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'skipped':
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'running':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'skipped':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'unit':
        return <TestTube className="w-5 h-5" />;
      case 'integration':
        return <Plug className="w-5 h-5" />;
      case 'e2e':
        return <Workflow className="w-5 h-5" />;
      case 'performance':
        return <Gauge className="w-5 h-5" />;
      case 'security':
        return <Shield className="w-5 h-5" />;
      case 'accessibility':
        return <Users className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'unit':
        return 'bg-blue-500';
      case 'integration':
        return 'bg-green-500';
      case 'e2e':
        return 'bg-purple-500';
      case 'performance':
        return 'bg-yellow-500';
      case 'security':
        return 'bg-red-500';
      case 'accessibility':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'high':
        return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const filteredTestSuites = testSuites.filter(suite => {
    const categoryMatch = filterCategory === 'all' || suite.category === filterCategory;
    const statusMatch = filterStatus === 'all' || suite.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-lg font-medium">Loading Testing Center...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <TestTube className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Testing Center
                  </h1>
                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                    Comprehensive Quality Assurance
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  className={`${getStatusColor(summary?.overallStatus || 'pending')} border-0`}
                >
                  {getStatusIcon(summary?.overallStatus || 'pending')}
                  <span className="ml-1 capitalize">{summary?.overallStatus}</span>
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {summary?.averageCoverage}% coverage
                </span>
              </div>
              
              <Button
                onClick={() => runTests()}
                disabled={running}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white"
              >
                {running ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run All Tests
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-1 rounded-lg">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="suites" className="flex items-center space-x-2">
              <TestTube className="w-4 h-4" />
              <span className="hidden sm:inline">Test Suites</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center space-x-2">
              <Gauge className="w-4 h-4" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" className="space-y-6">
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                      <TestTube className="w-4 h-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{summary?.totalTests}</div>
                      <p className="text-xs text-muted-foreground">
                        {summary?.totalSuites} test suites
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Passed</CardTitle>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{summary?.passedTests}</div>
                      <p className="text-xs text-muted-foreground">
                        {summary?.passedTests && summary?.totalTests ? 
                          Math.round((summary.passedTests / summary.totalTests) * 100) : 0}% success rate
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Failed</CardTitle>
                      <XCircle className="w-4 h-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{summary?.failedTests}</div>
                      <p className="text-xs text-muted-foreground">
                        {summary?.failedTests && summary?.totalTests ? 
                          Math.round((summary.failedTests / summary.totalTests) * 100) : 0}% failure rate
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Coverage</CardTitle>
                      <Target className="w-4 h-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">{summary?.averageCoverage}%</div>
                      <Progress value={summary?.averageCoverage} className="mt-2" />
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Last Run</CardTitle>
                      <Clock className="w-4 h-4 text-gray-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-gray-600">
                        {summary?.lastRun ? new Date(summary.lastRun).toLocaleTimeString() : 'Never'}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {summary?.lastRun ? new Date(summary.lastRun).toLocaleDateString() : 'Not run yet'}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Test Suites Overview */}
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TestTube className="w-5 h-5 text-blue-600" />
                      <span>Test Suites Overview</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {testSuites.slice(0, 6).map((suite) => (
                        <motion.div
                          key={suite.id}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 border rounded-lg hover:shadow-md transition-all"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColor(suite.category)}`}>
                                {getCategoryIcon(suite.category)}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{suite.name}</div>
                                <div className="text-xs text-muted-foreground capitalize">{suite.category}</div>
                              </div>
                            </div>
                            <Badge variant="outline" className={`${getStatusColor(suite.status)} border-0 text-xs`}>
                              {getStatusIcon(suite.status)}
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Tests: {suite.tests.length}</span>
                              <span>Coverage: {suite.coverage}%</span>
                            </div>
                            <Progress value={suite.coverage} className="h-1" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-green-600" />
                      <span>Recent Test Activity</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Global Deployment Tests completed</div>
                          <div className="text-xs text-muted-foreground">All 75 tests passed • 2 minutes ago</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">AI Analytics Tests completed</div>
                          <div className="text-xs text-muted-foreground">115 tests passed, 3 failed • 5 minutes ago</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Security Tests completed</div>
                          <div className="text-xs text-muted-foreground">223 tests passed, 7 failed • 8 minutes ago</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">Performance Tests completed</div>
                          <div className="text-xs text-muted-foreground">135 tests passed, 2 failed • 12 minutes ago</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="suites" className="space-y-6">
              <motion.div
                key="suites"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Filters */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <Label>Category:</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="unit">Unit</SelectItem>
                        <SelectItem value="integration">Integration</SelectItem>
                        <SelectItem value="e2e">E2E</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label>Status:</Label>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="passed">Passed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="running">Running</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Test Suites */}
                <div className="space-y-4">
                  {filteredTestSuites.map((suite) => (
                    <Card key={suite.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(suite.category)}`}>
                              {getCategoryIcon(suite.category)}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{suite.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{suite.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={`${getStatusColor(suite.status)} border-0`}>
                              {getStatusIcon(suite.status)}
                              <span className="ml-1 capitalize">{suite.status}</span>
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => runTests(suite.id)}
                              disabled={running}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Run
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{suite.tests.length}</div>
                              <div className="text-xs text-muted-foreground">Total Tests</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {suite.tests.filter(t => t.status === 'passed').length}
                              </div>
                              <div className="text-xs text-muted-foreground">Passed</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-600">
                                {suite.tests.filter(t => t.status === 'failed').length}
                              </div>
                              <div className="text-xs text-muted-foreground">Failed</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">{suite.coverage}%</div>
                              <div className="text-xs text-muted-foreground">Coverage</div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Test Coverage</span>
                              <span>{suite.coverage}%</span>
                            </div>
                            <Progress value={suite.coverage} />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Recent Test Cases</div>
                            {suite.tests.slice(0, 3).map((test) => (
                              <div key={test.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(test.status)}
                                  <span className="text-sm">{test.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-muted-foreground">{test.duration}ms</span>
                                  {test.error && (
                                    <Button variant="ghost" size="sm">
                                      <Eye className="w-3 h-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <motion.div
                key="performance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {performanceTests.map((test) => (
                    <Card key={test.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Gauge className="w-5 h-5 text-yellow-600" />
                          <span>{test.name}</span>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {test.method} {test.endpoint} • {test.concurrency} concurrent users
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {test.results.averageResponseTime.toFixed(1)}ms
                              </div>
                              <div className="text-xs text-muted-foreground">Avg Response Time</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {test.results.requestsPerSecond.toFixed(1)}
                              </div>
                              <div className="text-xs text-muted-foreground">Requests/sec</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">
                                {test.results.errorRate.toFixed(2)}%
                              </div>
                              <div className="text-xs text-muted-foreground">Error Rate</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-orange-600">
                                {test.results.throughput.toFixed(1)}MB/s
                              </div>
                              <div className="text-xs text-muted-foreground">Throughput</div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Response Time Percentiles</div>
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <div>
                                <div className="text-sm font-bold">{test.percentiles.p50}ms</div>
                                <div className="text-xs text-muted-foreground">50th</div>
                              </div>
                              <div>
                                <div className="text-sm font-bold">{test.percentiles.p90}ms</div>
                                <div className="text-xs text-muted-foreground">90th</div>
                              </div>
                              <div>
                                <div className="text-sm font-bold">{test.percentiles.p95}ms</div>
                                <div className="text-xs text-muted-foreground">95th</div>
                              </div>
                              <div>
                                <div className="text-sm font-bold">{test.percentiles.p99}ms</div>
                                <div className="text-xs text-muted-foreground">99th</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  {securityTests.map((test) => (
                    <Card key={test.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <Shield className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{test.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{test.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={`${getSeverityColor(test.severity)} border-0`}>
                              {test.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className={`${getStatusColor(test.status)} border-0`}>
                              {getStatusIcon(test.status)}
                              <span className="ml-1 capitalize">{test.status}</span>
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-3">Vulnerabilities</h4>
                              {test.results.vulnerabilities.length > 0 ? (
                                <div className="space-y-2">
                                  {test.results.vulnerabilities.map((vuln) => (
                                    <div key={vuln.id} className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium">{vuln.type}</span>
                                        <Badge variant="outline" className={`${getSeverityColor(vuln.severity)} border-0 text-xs`}>
                                          {vuln.severity}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground mb-2">{vuln.description}</p>
                                      <p className="text-xs text-blue-600">{vuln.remediation}</p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-green-600">No vulnerabilities found</p>
                              )}
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-3">Compliance ({test.results.compliance.standard})</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Overall Score</span>
                                  <span className="text-lg font-bold text-blue-600">{test.results.compliance.score}%</span>
                                </div>
                                <Progress value={test.results.compliance.score} className="mb-3" />
                                
                                <div className="space-y-1">
                                  {test.results.compliance.requirements.map((req) => (
                                    <div key={req.id} className="flex items-center justify-between">
                                      <span className="text-xs">{req.name}</span>
                                      <Badge variant="outline" className={`${getStatusColor(req.status)} border-0 text-xs`}>
                                        {req.status}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <motion.div
                key="reports"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span>Test Reports & Analytics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <Download className="w-6 h-6 text-green-600" />
                          <h3 className="font-medium">Test Summary Report</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Comprehensive overview of all test results
                        </p>
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </Card>

                      <Card className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <BarChart3 className="w-6 h-6 text-blue-600" />
                          <h3 className="font-medium">Coverage Report</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Detailed code coverage analysis
                        </p>
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Online
                        </Button>
                      </Card>

                      <Card className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <Shield className="w-6 h-6 text-red-600" />
                          <h3 className="font-medium">Security Report</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          Security vulnerabilities and compliance
                        </p>
                        <Button variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download JSON
                        </Button>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Settings className="w-5 h-5 text-gray-600" />
                      <span>Testing Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-4">Test Execution Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="parallel">Parallel Execution</Label>
                            <Select defaultValue="4">
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 thread</SelectItem>
                                <SelectItem value="2">2 threads</SelectItem>
                                <SelectItem value="4">4 threads</SelectItem>
                                <SelectItem value="8">8 threads</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="timeout">Test Timeout (seconds)</Label>
                            <Input id="timeout" type="number" defaultValue="30" className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="retries">Max Retries</Label>
                            <Input id="retries" type="number" defaultValue="3" className="mt-1" />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-4">Reporting Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="format">Report Format</Label>
                            <Select defaultValue="html">
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="html">HTML</SelectItem>
                                <SelectItem value="json">JSON</SelectItem>
                                <SelectItem value="xml">XML</SelectItem>
                                <SelectItem value="pdf">PDF</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="coverage">Coverage Threshold (%)</Label>
                            <Input id="coverage" type="number" defaultValue="80" className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="notifications">Email Notifications</Label>
                            <Input id="notifications" type="email" placeholder="admin@company.com" className="mt-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
