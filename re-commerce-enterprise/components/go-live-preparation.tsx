
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Rocket,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Shield,
  Database,
  Globe,
  Zap,
  Users,
  Settings,
  FileText,
  Activity,
  Target,
  Award,
  Star,
  Lightbulb,
  Bell,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  Share,
  Copy,
  Edit,
  Trash,
  Save,
  RefreshCw,
  Play,
  Pause,
  Square,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  X,
  Check,
  Info,
  HelpCircle,
  ExternalLink,
  Mail,
  Phone,
  MessageCircle,
  Calendar,
  Timer,
  Gauge,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Brain,
  Code,
  Terminal,
  Monitor,
  Server,
  Cloud,
  Network,
  Cpu,
  HardDrive,
  Wifi,
  Lock,
  Key,
  UserCheck,
  ShieldCheck,
  Fingerprint,
  Building,
  Briefcase,
  MapPin,
  Home,
  Layers,
  Grid,
  Layout,
  Navigation,
  Smartphone,
  Tablet,
  Flame,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Bookmark,
  Flag,
  Hash,
  Tag,
  Link,
  Image,
  Video,
  Mic,
  Camera,
  Headphones,
  Volume2,
  VolumeX,
  Music,
  Radio,
  Tv,
  Gamepad2,
  Joystick,
  Keyboard,
  Mouse,
  Printer,
  Webcam,
  Speaker,
  Headset,
  Bluetooth,
  Usb,
  Router,
  Satellite,
  Antenna,
  Signal,
  Radar,
  Compass,
  Map,
  Route,
  Car,
  Truck,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Ambulance,
  Tractor,
  Construction,
  Forklift,
  Drill,
  Hammer,
  Wrench,
  Scissors,
  Ruler,
  Pencil,
  Pen,
  Brush,
  Palette,
  Paintbrush,
  Eraser,
  Paperclip,
  Calculator,
  Scale,
  Thermometer,
  Hourglass,
  AlarmClock,
  Watch,
  Film,
  Clapperboard,
  Tickets,
  Ticket,
  CreditCard,
  Banknote,
  Coins,
  Wallet,
  Vault,
  Receipt,
  FileSpreadsheet,
  FileBarChart,
  FileLineChart,
  FilePieChart,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileJson,
  FileArchive,
  Folder,
  FolderOpen,
  FolderClosed,
  FolderPlus,
  FolderMinus,
  FolderX,
  FolderCheck,
  FolderEdit,
  FolderSync,
  FolderSearch,
  FolderHeart,
  FolderLock,
  FolderKey,
  FolderCog,
  FolderTree,
  FolderGit,
  FolderGit2,
  Archive,
  Package,
  Package2,
  PackageOpen,
  PackageCheck,
  PackageX,
  PackagePlus,
  PackageMinus,
  PackageSearch,
  Box,
  Boxes,
  Container,
  Luggage,
  Backpack,
  ShoppingBag,
  ShoppingCart,
  ShoppingBasket,
  Store,
  Tent,
  Umbrella,
  Caravan,
  Anchor,
  Sailboat,
  Glasses,
  Telescope,
  Binoculars,
  Microscope,
  Aperture,
  Triangle,
  Circle,
  Diamond,
  Hexagon,
  Octagon,
  Pentagon,
  Cylinder,
  Cone,
  Pyramid,
  Torus,
  Gem,
  Rainbow,
  Flower,
  Leaf,
  Trees,
  Sprout,
  GitBranch,
  GitCommit
} from 'lucide-react';

interface ReadinessCheck {
  id: string;
  category: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed' | 'skipped';
  priority: 'high' | 'medium' | 'low';
  automated: boolean;
  estimatedTime: number;
  actualTime?: number;
  dependencies: string[];
  results?: {
    passed: number;
    failed: number;
    skipped: number;
    details: string[];
  };
  lastRun?: Date;
  nextRun?: Date;
}

interface ReadinessCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  checks: ReadinessCheck[];
  progress: number;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
}

interface ProductionReadiness {
  overall: {
    progress: number;
    status: 'not-ready' | 'partially-ready' | 'ready' | 'go-live';
    readyForLaunch: boolean;
    criticalIssues: number;
    estimatedTimeToReady: number;
  };
  categories: ReadinessCategory[];
  recommendations: {
    id: string;
    title: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    category: string;
    action: string;
    estimatedTime: number;
  }[];
  deploymentPlan: {
    phases: {
      name: string;
      description: string;
      duration: number;
      tasks: string[];
      dependencies: string[];
      rollbackPlan: string;
    }[];
    timeline: {
      phase: string;
      startDate: Date;
      endDate: Date;
      status: 'pending' | 'in-progress' | 'completed' | 'delayed';
    }[];
  };
}

export function GoLivePreparation() {
  const [readiness, setReadiness] = useState<ProductionReadiness | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    loadReadinessData();
  }, []);

  const loadReadinessData = async () => {
    try {
      setLoading(true);
      
      // Simulate loading production readiness data
      const mockData: ProductionReadiness = {
        overall: {
          progress: 87,
          status: 'partially-ready',
          readyForLaunch: false,
          criticalIssues: 3,
          estimatedTimeToReady: 48
        },
        categories: [
          {
            id: 'infrastructure',
            name: 'Infrastructure',
            description: 'Core infrastructure and deployment readiness',
            icon: Server,
            color: 'bg-blue-500',
            progress: 92,
            status: 'completed',
            checks: [
              {
                id: 'kubernetes-cluster',
                category: 'infrastructure',
                name: 'Kubernetes Cluster',
                description: 'Production Kubernetes cluster setup and configuration',
                status: 'completed',
                priority: 'high',
                automated: true,
                estimatedTime: 30,
                actualTime: 25,
                dependencies: [],
                results: {
                  passed: 15,
                  failed: 0,
                  skipped: 0,
                  details: ['Cluster nodes healthy', 'Resource quotas configured', 'Network policies applied']
                },
                lastRun: new Date(Date.now() - 3600000)
              },
              {
                id: 'load-balancer',
                category: 'infrastructure',
                name: 'Load Balancer',
                description: 'Production load balancer configuration and SSL certificates',
                status: 'completed',
                priority: 'high',
                automated: true,
                estimatedTime: 20,
                actualTime: 18,
                dependencies: ['kubernetes-cluster'],
                results: {
                  passed: 8,
                  failed: 0,
                  skipped: 0,
                  details: ['SSL certificates valid', 'Health checks configured', 'Failover tested']
                },
                lastRun: new Date(Date.now() - 7200000)
              }
            ]
          },
          {
            id: 'security',
            name: 'Security',
            description: 'Security hardening and compliance verification',
            icon: Shield,
            color: 'bg-red-500',
            progress: 78,
            status: 'in-progress',
            checks: [
              {
                id: 'vulnerability-scan',
                category: 'security',
                name: 'Vulnerability Scanning',
                description: 'Comprehensive security vulnerability assessment',
                status: 'failed',
                priority: 'high',
                automated: true,
                estimatedTime: 45,
                actualTime: 40,
                dependencies: [],
                results: {
                  passed: 187,
                  failed: 8,
                  skipped: 2,
                  details: ['8 medium-severity vulnerabilities found', '2 high-severity issues', 'Remediation required']
                },
                lastRun: new Date(Date.now() - 1800000)
              },
              {
                id: 'penetration-test',
                category: 'security',
                name: 'Penetration Testing',
                description: 'External security penetration testing',
                status: 'in-progress',
                priority: 'high',
                automated: false,
                estimatedTime: 120,
                dependencies: ['vulnerability-scan'],
                lastRun: new Date(Date.now() - 3600000)
              }
            ]
          },
          {
            id: 'performance',
            name: 'Performance',
            description: 'Performance testing and optimization verification',
            icon: Gauge,
            color: 'bg-green-500',
            progress: 95,
            status: 'completed',
            checks: [
              {
                id: 'load-testing',
                category: 'performance',
                name: 'Load Testing',
                description: 'Application load testing under expected traffic',
                status: 'completed',
                priority: 'high',
                automated: true,
                estimatedTime: 60,
                actualTime: 55,
                dependencies: ['infrastructure'],
                results: {
                  passed: 12,
                  failed: 0,
                  skipped: 0,
                  details: ['Response time < 200ms', 'Zero errors under load', 'Auto-scaling working']
                },
                lastRun: new Date(Date.now() - 5400000)
              }
            ]
          },
          {
            id: 'monitoring',
            name: 'Monitoring',
            description: 'Monitoring and observability systems verification',
            icon: Activity,
            color: 'bg-purple-500',
            progress: 85,
            status: 'in-progress',
            checks: [
              {
                id: 'alerting-system',
                category: 'monitoring',
                name: 'Alerting System',
                description: 'Production alerting and notification system',
                status: 'completed',
                priority: 'high',
                automated: true,
                estimatedTime: 30,
                actualTime: 25,
                dependencies: [],
                results: {
                  passed: 10,
                  failed: 0,
                  skipped: 0,
                  details: ['All critical alerts configured', 'Escalation policies active', 'Notifications working']
                },
                lastRun: new Date(Date.now() - 2700000)
              }
            ]
          },
          {
            id: 'backup',
            name: 'Backup & Recovery',
            description: 'Backup and disaster recovery procedures',
            icon: Database,
            color: 'bg-yellow-500',
            progress: 90,
            status: 'completed',
            checks: [
              {
                id: 'backup-testing',
                category: 'backup',
                name: 'Backup Testing',
                description: 'Backup and restore procedures verification',
                status: 'completed',
                priority: 'high',
                automated: true,
                estimatedTime: 90,
                actualTime: 85,
                dependencies: [],
                results: {
                  passed: 6,
                  failed: 0,
                  skipped: 0,
                  details: ['Automated backups working', 'Restore procedures tested', 'RTO/RPO targets met']
                },
                lastRun: new Date(Date.now() - 10800000)
              }
            ]
          },
          {
            id: 'compliance',
            name: 'Compliance',
            description: 'Regulatory compliance and audit readiness',
            icon: FileText,
            color: 'bg-indigo-500',
            progress: 82,
            status: 'in-progress',
            checks: [
              {
                id: 'gdpr-compliance',
                category: 'compliance',
                name: 'GDPR Compliance',
                description: 'General Data Protection Regulation compliance verification',
                status: 'in-progress',
                priority: 'high',
                automated: false,
                estimatedTime: 180,
                dependencies: ['security'],
                lastRun: new Date(Date.now() - 7200000)
              }
            ]
          }
        ],
        recommendations: [
          {
            id: 'rec-1',
            title: 'Fix Security Vulnerabilities',
            description: 'Address 8 medium-severity and 2 high-severity vulnerabilities found in security scan',
            priority: 'critical',
            category: 'security',
            action: 'Update dependencies and apply security patches',
            estimatedTime: 4
          },
          {
            id: 'rec-2',
            title: 'Complete Penetration Testing',
            description: 'Finish external penetration testing and address any findings',
            priority: 'high',
            category: 'security',
            action: 'Work with security team to complete testing',
            estimatedTime: 8
          },
          {
            id: 'rec-3',
            title: 'Finalize GDPR Compliance',
            description: 'Complete GDPR compliance documentation and procedures',
            priority: 'high',
            category: 'compliance',
            action: 'Review data processing procedures and privacy policies',
            estimatedTime: 12
          }
        ],
        deploymentPlan: {
          phases: [
            {
              name: 'Pre-deployment',
              description: 'Final preparation and verification',
              duration: 4,
              tasks: ['Security patches', 'Final testing', 'Documentation review'],
              dependencies: [],
              rollbackPlan: 'Abort deployment if critical issues found'
            },
            {
              name: 'Blue-Green Deployment',
              description: 'Deploy to production environment',
              duration: 2,
              tasks: ['Deploy to green environment', 'Smoke testing', 'Traffic switch'],
              dependencies: ['Pre-deployment'],
              rollbackPlan: 'Switch traffic back to blue environment'
            },
            {
              name: 'Post-deployment',
              description: 'Monitoring and validation',
              duration: 6,
              tasks: ['Performance monitoring', 'Error rate monitoring', 'User feedback collection'],
              dependencies: ['Blue-Green Deployment'],
              rollbackPlan: 'Rollback to previous version if issues detected'
            }
          ],
          timeline: [
            {
              phase: 'Pre-deployment',
              startDate: new Date(Date.now() + 86400000), // Tomorrow
              endDate: new Date(Date.now() + 432000000), // 5 days from now
              status: 'pending'
            },
            {
              phase: 'Blue-Green Deployment',
              startDate: new Date(Date.now() + 432000000), // 5 days from now
              endDate: new Date(Date.now() + 604800000), // 7 days from now
              status: 'pending'
            },
            {
              phase: 'Post-deployment',
              startDate: new Date(Date.now() + 604800000), // 7 days from now
              endDate: new Date(Date.now() + 1209600000), // 14 days from now
              status: 'pending'
            }
          ]
        }
      };

      setReadiness(mockData);
    } catch (error) {
      console.error('Failed to load readiness data:', error);
    } finally {
      setLoading(false);
    }
  };

  const runReadinessCheck = async (categoryId?: string) => {
    setRunning(true);
    try {
      // Simulate running readiness checks
      await new Promise(resolve => setTimeout(resolve, 3000));
      await loadReadinessData();
    } catch (error) {
      console.error('Failed to run readiness check:', error);
    } finally {
      setRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'failed':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getReadinessStatus = (progress: number) => {
    if (progress >= 95) return 'ready';
    if (progress >= 80) return 'partially-ready';
    return 'not-ready';
  };

  const getReadinessColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'text-green-600 bg-green-100';
      case 'partially-ready':
        return 'text-yellow-600 bg-yellow-100';
      case 'not-ready':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-lg font-medium">Loading Production Readiness...</div>
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
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Go-Live Preparation
                  </h1>
                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                    Production Readiness Assessment
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="outline" 
                  className={`${getReadinessColor(readiness?.overall.status || 'not-ready')} border-0`}
                >
                  <Target className="w-4 h-4 mr-1" />
                  {readiness?.overall.progress}% Ready
                </Badge>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {readiness?.overall.estimatedTimeToReady}h remaining
                </span>
              </div>
              
              <Button
                onClick={() => runReadinessCheck()}
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
                    Run All Checks
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
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-1 rounded-lg">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="checks" className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Readiness Checks</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="deployment" className="flex items-center space-x-2">
              <Rocket className="w-4 h-4" />
              <span className="hidden sm:inline">Deployment Plan</span>
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
                {/* Overall Status */}
                <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <span>Production Readiness Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          {readiness?.overall.progress}%
                        </div>
                        <div className="text-lg text-muted-foreground mb-4">
                          {readiness?.overall.readyForLaunch ? 'Ready for Launch!' : 'Preparation in Progress'}
                        </div>
                        <Progress value={readiness?.overall.progress} className="h-3" />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {readiness?.overall.criticalIssues}
                          </div>
                          <div className="text-sm text-muted-foreground">Critical Issues</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-yellow-600">
                            {readiness?.overall.estimatedTimeToReady}h
                          </div>
                          <div className="text-sm text-muted-foreground">Time to Ready</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {readiness?.categories.filter(c => c.status === 'completed').length}
                          </div>
                          <div className="text-sm text-muted-foreground">Completed Categories</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {readiness?.categories.length}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Categories</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {readiness?.categories.map((category) => (
                    <Card key={category.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                              <category.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{category.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{category.description}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className={`${getStatusColor(category.status)} border-0`}>
                            {getStatusIcon(category.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Progress</span>
                            <span className="text-sm">{category.progress}%</span>
                          </div>
                          <Progress value={category.progress} />
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>{category.checks.length} checks</span>
                            <span>{category.checks.filter(c => c.status === 'completed').length} completed</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Critical Issues Alert */}
                {readiness?.overall.criticalIssues && readiness.overall.criticalIssues > 0 && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700 dark:text-red-300">
                      <strong>{readiness.overall.criticalIssues} critical issues</strong> must be resolved before production deployment.
                      Review the recommendations tab for required actions.
                    </AlertDescription>
                  </Alert>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="checks" className="space-y-6">
              <motion.div
                key="checks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  {readiness?.categories.map((category) => (
                    <Card key={category.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                              <category.icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{category.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{category.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={`${getStatusColor(category.status)} border-0`}>
                              {getStatusIcon(category.status)}
                              <span className="ml-1 capitalize">{category.status}</span>
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => runReadinessCheck(category.id)}
                              disabled={running}
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Run
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {category.checks.map((check) => (
                            <div key={check.id} className="p-4 border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-medium">{check.name}</h3>
                                  <Badge variant="outline" className={`${getPriorityColor(check.priority)} border-0 text-xs`}>
                                    {check.priority}
                                  </Badge>
                                  {check.automated && (
                                    <Badge variant="outline" className="text-xs">
                                      Automated
                                    </Badge>
                                  )}
                                </div>
                                <Badge variant="outline" className={`${getStatusColor(check.status)} border-0`}>
                                  {getStatusIcon(check.status)}
                                  <span className="ml-1 capitalize">{check.status}</span>
                                </Badge>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3">{check.description}</p>
                              
                              {check.results && (
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center space-x-1">
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                      <span>Passed: {check.results.passed}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <XCircle className="w-4 h-4 text-red-600" />
                                      <span>Failed: {check.results.failed}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                      <span>Skipped: {check.results.skipped}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    {check.results.details.map((detail, index) => (
                                      <div key={index} className="text-xs text-muted-foreground">
                                        • {detail}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs text-muted-foreground">
                                <div className="flex items-center space-x-4">
                                  <span>Est. Time: {check.estimatedTime}min</span>
                                  {check.actualTime && (
                                    <span>Actual: {check.actualTime}min</span>
                                  )}
                                </div>
                                {check.lastRun && (
                                  <span>Last run: {check.lastRun.toLocaleString()}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <motion.div
                key="recommendations"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-4">
                  {readiness?.recommendations.map((rec) => (
                    <Card key={rec.id} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Lightbulb className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{rec.title}</CardTitle>
                              <p className="text-sm text-muted-foreground">{rec.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className={`${getPriorityColor(rec.priority)} border-0`}>
                              {rec.priority}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {rec.estimatedTime}h
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm">{rec.description}</p>
                          
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                              Recommended Action:
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              {rec.action}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="deployment" className="space-y-6">
              <motion.div
                key="deployment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  {/* Deployment Timeline */}
                  <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span>Deployment Timeline</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {readiness?.deploymentPlan.timeline.map((phase, index) => (
                          <div key={phase.phase} className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 text-sm font-bold">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{phase.phase}</h3>
                                <Badge variant="outline" className={`${getStatusColor(phase.status)} border-0 text-xs`}>
                                  {phase.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {phase.startDate.toLocaleDateString()} - {phase.endDate.toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Deployment Phases */}
                  <div className="space-y-4">
                    {readiness?.deploymentPlan.phases.map((phase, index) => (
                      <Card key={phase.name} className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                        <CardHeader>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-bold">{index + 1}</span>
                            </div>
                            <div>
                              <CardTitle className="text-lg">{phase.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">{phase.description}</p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Tasks</h4>
                                <ul className="space-y-1">
                                  {phase.tasks.map((task, taskIndex) => (
                                    <li key={taskIndex} className="text-sm flex items-center space-x-2">
                                      <CheckCircle className="w-3 h-3 text-green-600" />
                                      <span>{task}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Rollback Plan</h4>
                                <p className="text-sm text-muted-foreground">{phase.rollbackPlan}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t">
                              <span className="text-sm text-muted-foreground">
                                Duration: {phase.duration} hours
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Dependencies: {phase.dependencies.length > 0 ? phase.dependencies.join(', ') : 'None'}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
