
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2,
  Users,
  Settings,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  CreditCard,
  Database,
  Key,
  Lock,
  UserPlus,
  UserCheck,
  UserX,
  Crown,
  Star,
  Award,
  Target,
  Rocket,
  Zap,
  Brain,
  BarChart3,
  Gauge,
  Plug,
  FileText,
  Video,
  BookOpen,
  GraduationCap,
  PlayCircle,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Save,
  Send,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  Plus,
  Minus,
  Edit,
  Trash,
  Search,
  Filter,
  Calendar,
  Timer,
  Bell,
  Eye,
  EyeOff,
  Copy,
  Share,
  ExternalLink,
  Lightbulb,
  HelpCircle,
  Info
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  completed: boolean;
  required: boolean;
  estimatedTime: number;
}

interface EnterpriseProfile {
  // Company Information
  companyName: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  description: string;
  
  // Primary Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactRole: string;
  
  // Technical Requirements
  expectedUsers: number;
  regions: string[];
  compliance: string[];
  integrations: string[];
  
  // Features
  aiAnalytics: boolean;
  advancedSecurity: boolean;
  globalDeployment: boolean;
  enterpriseSupport: boolean;
  customBranding: boolean;
  
  // Billing
  billingPlan: string;
  billingContact: string;
  billingEmail: string;
}

interface UserRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  level: 'admin' | 'manager' | 'user' | 'viewer';
  badge: string;
  color: string;
}

export function EnterpriseOnboardingSystem() {
  const [activeStep, setActiveStep] = useState(0);
  const [profile, setProfile] = useState<EnterpriseProfile>({
    companyName: '',
    industry: '',
    size: '',
    location: '',
    website: '',
    description: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    contactRole: '',
    expectedUsers: 0,
    regions: [],
    compliance: [],
    integrations: [],
    aiAnalytics: false,
    advancedSecurity: false,
    globalDeployment: false,
    enterpriseSupport: false,
    customBranding: false,
    billingPlan: '',
    billingContact: '',
    billingEmail: ''
  });
  
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'company-info',
      title: 'Company Information',
      description: 'Basic company details and contact information',
      icon: Building2,
      completed: false,
      required: true,
      estimatedTime: 5
    },
    {
      id: 'technical-requirements',
      title: 'Technical Requirements',
      description: 'Define your technical needs and compliance requirements',
      icon: Settings,
      completed: false,
      required: true,
      estimatedTime: 10
    },
    {
      id: 'feature-selection',
      title: 'Feature Selection',
      description: 'Choose the enterprise features you need',
      icon: Star,
      completed: false,
      required: true,
      estimatedTime: 8
    },
    {
      id: 'user-management',
      title: 'User Management',
      description: 'Set up users, roles, and permissions',
      icon: Users,
      completed: false,
      required: true,
      estimatedTime: 15
    },
    {
      id: 'security-setup',
      title: 'Security Configuration',
      description: 'Configure security policies and access controls',
      icon: Shield,
      completed: false,
      required: true,
      estimatedTime: 12
    },
    {
      id: 'billing-setup',
      title: 'Billing & Subscription',
      description: 'Set up billing information and subscription plan',
      icon: CreditCard,
      completed: false,
      required: true,
      estimatedTime: 7
    },
    {
      id: 'training-resources',
      title: 'Training & Resources',
      description: 'Access training materials and documentation',
      icon: GraduationCap,
      completed: false,
      required: false,
      estimatedTime: 20
    },
    {
      id: 'final-verification',
      title: 'Final Verification',
      description: 'Review and complete your enterprise setup',
      icon: CheckCircle,
      completed: false,
      required: true,
      estimatedTime: 5
    }
  ];

  const userRoles: UserRole[] = [
    {
      id: 'enterprise-admin',
      name: 'Enterprise Admin',
      description: 'Full access to all enterprise features and settings',
      permissions: ['*'],
      level: 'admin',
      badge: 'Admin',
      color: 'bg-red-500'
    },
    {
      id: 'it-manager',
      name: 'IT Manager',
      description: 'Manage technical infrastructure and security',
      permissions: ['system:*', 'security:*', 'users:manage'],
      level: 'manager',
      badge: 'IT Manager',
      color: 'bg-blue-500'
    },
    {
      id: 'business-manager',
      name: 'Business Manager',
      description: 'Access analytics and business intelligence features',
      permissions: ['analytics:*', 'reports:*', 'dashboards:*'],
      level: 'manager',
      badge: 'Manager',
      color: 'bg-green-500'
    },
    {
      id: 'developer',
      name: 'Developer',
      description: 'Access development tools and API management',
      permissions: ['api:*', 'integrations:*', 'widgets:*'],
      level: 'user',
      badge: 'Developer',
      color: 'bg-purple-500'
    },
    {
      id: 'analyst',
      name: 'Data Analyst',
      description: 'Access analytics and reporting features',
      permissions: ['analytics:read', 'reports:read', 'dashboards:read'],
      level: 'user',
      badge: 'Analyst',
      color: 'bg-yellow-500'
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Read-only access to dashboards and reports',
      permissions: ['dashboards:read', 'reports:read'],
      level: 'viewer',
      badge: 'Viewer',
      color: 'bg-gray-500'
    }
  ];

  useEffect(() => {
    loadOnboardingData();
  }, []);

  const loadOnboardingData = async () => {
    try {
      // Load existing onboarding data
      setRoles(userRoles);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load onboarding data:', error);
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep < onboardingSteps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save onboarding data
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mark current step as completed
      onboardingSteps[activeStep].completed = true;
      setSaving(false);
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
      setSaving(false);
    }
  };

  const getProgress = () => {
    const completedSteps = onboardingSteps.filter(step => step.completed).length;
    return (completedSteps / onboardingSteps.length) * 100;
  };

  const getTotalEstimatedTime = () => {
    return onboardingSteps.reduce((total, step) => total + step.estimatedTime, 0);
  };

  const getRemainingTime = () => {
    const remainingSteps = onboardingSteps.filter(step => !step.completed);
    return remainingSteps.reduce((total, step) => total + step.estimatedTime, 0);
  };

  const addUser = () => {
    const newUser = {
      id: Date.now().toString(),
      name: '',
      email: '',
      role: 'viewer',
      status: 'pending',
      invitedAt: new Date()
    };
    setUsers([...users, newUser]);
  };

  const removeUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const updateUser = (userId: string, updates: any) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-lg font-medium">Loading Enterprise Onboarding...</div>
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
                    Enterprise Onboarding
                  </h1>
                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                    Welcome to Re:Commerce Enterprise
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Timer className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {getRemainingTime()}min remaining
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {Math.round(getProgress())}% complete
                </span>
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span>Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {onboardingSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all ${
                        index === activeStep
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setActiveStep(index)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        step.completed
                          ? 'bg-green-500 text-white'
                          : index === activeStep
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                      }`}>
                        {step.completed ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <step.icon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${
                          index === activeStep ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center space-x-2">
                          <Timer className="w-3 h-3" />
                          <span>{step.estimatedTime}min</span>
                          {step.required && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        {(() => {
                          const IconComponent = onboardingSteps[activeStep].icon;
                          return <IconComponent className="w-6 h-6 text-white" />;
                        })()}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{onboardingSteps[activeStep].title}</CardTitle>
                        <p className="text-gray-600">{onboardingSteps[activeStep].description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <Timer className="w-3 h-3" />
                      <span>{onboardingSteps[activeStep].estimatedTime}min</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Step Content */}
                  {activeStep === 0 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="companyName">Company Name *</Label>
                          <Input
                            id="companyName"
                            value={profile.companyName}
                            onChange={(e) => setProfile({...profile, companyName: e.target.value})}
                            placeholder="Enter company name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="industry">Industry *</Label>
                          <Select value={profile.industry} onValueChange={(value) => setProfile({...profile, industry: value})}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="government">Government</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="size">Company Size *</Label>
                          <Select value={profile.size} onValueChange={(value) => setProfile({...profile, size: value})}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                              <SelectItem value="small">Small (11-50 employees)</SelectItem>
                              <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                              <SelectItem value="large">Large (201-1000 employees)</SelectItem>
                              <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="location">Location *</Label>
                          <Input
                            id="location"
                            value={profile.location}
                            onChange={(e) => setProfile({...profile, location: e.target.value})}
                            placeholder="Company location"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            value={profile.website}
                            onChange={(e) => setProfile({...profile, website: e.target.value})}
                            placeholder="https://company.com"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactName">Primary Contact Name *</Label>
                          <Input
                            id="contactName"
                            value={profile.contactName}
                            onChange={(e) => setProfile({...profile, contactName: e.target.value})}
                            placeholder="Contact person name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactEmail">Contact Email *</Label>
                          <Input
                            id="contactEmail"
                            type="email"
                            value={profile.contactEmail}
                            onChange={(e) => setProfile({...profile, contactEmail: e.target.value})}
                            placeholder="contact@company.com"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactPhone">Contact Phone</Label>
                          <Input
                            id="contactPhone"
                            value={profile.contactPhone}
                            onChange={(e) => setProfile({...profile, contactPhone: e.target.value})}
                            placeholder="+1 (555) 123-4567"
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Company Description</Label>
                        <Textarea
                          id="description"
                          value={profile.description}
                          onChange={(e) => setProfile({...profile, description: e.target.value})}
                          placeholder="Brief description of your company..."
                          rows={4}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="expectedUsers">Expected Users *</Label>
                          <Input
                            id="expectedUsers"
                            type="number"
                            value={profile.expectedUsers}
                            onChange={(e) => setProfile({...profile, expectedUsers: parseInt(e.target.value)})}
                            placeholder="Number of expected users"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label>Deployment Regions *</Label>
                          <div className="mt-2 space-y-2">
                            {['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'].map((region) => (
                              <div key={region} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={region}
                                  checked={profile.regions.includes(region)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setProfile({...profile, regions: [...profile.regions, region]});
                                    } else {
                                      setProfile({...profile, regions: profile.regions.filter(r => r !== region)});
                                    }
                                  }}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <Label htmlFor={region} className="text-sm">{region}</Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Compliance Requirements</Label>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                          {['GDPR', 'SOC 2', 'HIPAA', 'PCI DSS', 'ISO 27001', 'FedRAMP'].map((compliance) => (
                            <div key={compliance} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={compliance}
                                checked={profile.compliance.includes(compliance)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setProfile({...profile, compliance: [...profile.compliance, compliance]});
                                  } else {
                                    setProfile({...profile, compliance: profile.compliance.filter(c => c !== compliance)});
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <Label htmlFor={compliance} className="text-sm">{compliance}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label>Required Integrations</Label>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                          {['Salesforce', 'SAP', 'Oracle', 'Microsoft 365', 'Slack', 'Jira', 'AWS', 'Azure', 'Google Cloud'].map((integration) => (
                            <div key={integration} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={integration}
                                checked={profile.integrations.includes(integration)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setProfile({...profile, integrations: [...profile.integrations, integration]});
                                  } else {
                                    setProfile({...profile, integrations: profile.integrations.filter(i => i !== integration)});
                                  }
                                }}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <Label htmlFor={integration} className="text-sm">{integration}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Brain className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">AI Analytics</h3>
                                  <p className="text-sm text-gray-600">Advanced AI-powered insights</p>
                                </div>
                                <Switch
                                  checked={profile.aiAnalytics}
                                  onCheckedChange={(checked) => setProfile({...profile, aiAnalytics: checked})}
                                />
                              </div>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <Shield className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">Advanced Security</h3>
                                  <p className="text-sm text-gray-600">Zero-trust security architecture</p>
                                </div>
                                <Switch
                                  checked={profile.advancedSecurity}
                                  onCheckedChange={(checked) => setProfile({...profile, advancedSecurity: checked})}
                                />
                              </div>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Globe className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">Global Deployment</h3>
                                  <p className="text-sm text-gray-600">Multi-region architecture</p>
                                </div>
                                <Switch
                                  checked={profile.globalDeployment}
                                  onCheckedChange={(checked) => setProfile({...profile, globalDeployment: checked})}
                                />
                              </div>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">Enterprise Support</h3>
                                  <p className="text-sm text-gray-600">24/7 dedicated support</p>
                                </div>
                                <Switch
                                  checked={profile.enterpriseSupport}
                                  onCheckedChange={(checked) => setProfile({...profile, enterpriseSupport: checked})}
                                />
                              </div>
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                              <Star className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">Custom Branding</h3>
                                  <p className="text-sm text-gray-600">White-label customization</p>
                                </div>
                                <Switch
                                  checked={profile.customBranding}
                                  onCheckedChange={(checked) => setProfile({...profile, customBranding: checked})}
                                />
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">User Management</h3>
                        <Button onClick={addUser} className="flex items-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>Add User</span>
                        </Button>
                      </div>

                      {/* Role Definitions */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {roles.map((role) => (
                          <Card key={role.id} className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className={`w-8 h-8 ${role.color} rounded-lg flex items-center justify-center`}>
                                <Crown className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-medium">{role.name}</h4>
                                <p className="text-xs text-gray-600">{role.description}</p>
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {role.permissions.length} permissions
                                </Badge>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>

                      {/* User List */}
                      <div className="space-y-4">
                        {users.map((user) => (
                          <Card key={user.id} className="p-4">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-600" />
                              </div>
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <Input
                                  placeholder="Full Name"
                                  value={user.name}
                                  onChange={(e) => updateUser(user.id, { name: e.target.value })}
                                />
                                <Input
                                  placeholder="Email"
                                  type="email"
                                  value={user.email}
                                  onChange={(e) => updateUser(user.id, { email: e.target.value })}
                                />
                                <Select value={user.role} onValueChange={(value) => updateUser(user.id, { role: value })}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {roles.map((role) => (
                                      <SelectItem key={role.id} value={role.id}>
                                        {role.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs">
                                    {user.status}
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeUser(user.id)}
                                  >
                                    <Trash className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeStep === 4 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-4">
                          <h3 className="font-medium mb-4">Multi-Factor Authentication</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Enable MFA for all users</span>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Enforce MFA for admins</span>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">SMS authentication</span>
                              <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Authenticator apps</span>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h3 className="font-medium mb-4">Password Policy</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Minimum 12 characters</span>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Require uppercase</span>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Require numbers</span>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Require special characters</span>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h3 className="font-medium mb-4">Session Management</h3>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                              <Input id="sessionTimeout" type="number" defaultValue="30" className="mt-1" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Force re-authentication</span>
                              <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Single sign-on (SSO)</span>
                              <Switch />
                            </div>
                          </div>
                        </Card>

                        <Card className="p-4">
                          <h3 className="font-medium mb-4">Access Control</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">IP whitelist</span>
                              <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Device restrictions</span>
                              <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Time-based access</span>
                              <Switch />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Failed login lockout</span>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  )}

                  {activeStep === 5 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="billingPlan">Billing Plan *</Label>
                          <Select value={profile.billingPlan} onValueChange={(value) => setProfile({...profile, billingPlan: value})}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select billing plan" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="starter">Starter - $99/month</SelectItem>
                              <SelectItem value="professional">Professional - $299/month</SelectItem>
                              <SelectItem value="enterprise">Enterprise - $999/month</SelectItem>
                              <SelectItem value="custom">Custom - Contact Sales</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="billingContact">Billing Contact *</Label>
                          <Input
                            id="billingContact"
                            value={profile.billingContact}
                            onChange={(e) => setProfile({...profile, billingContact: e.target.value})}
                            placeholder="Billing contact name"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingEmail">Billing Email *</Label>
                          <Input
                            id="billingEmail"
                            type="email"
                            value={profile.billingEmail}
                            onChange={(e) => setProfile({...profile, billingEmail: e.target.value})}
                            placeholder="billing@company.com"
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <Card className="p-6">
                        <h3 className="font-medium mb-4">Subscription Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Base Plan</span>
                            <span className="font-medium">$999/month</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Additional Users (50)</span>
                            <span className="font-medium">$500/month</span>
                          </div>
                          <div className="flex justify-between">
                            <span>AI Analytics Add-on</span>
                            <span className="font-medium">$299/month</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Advanced Security Add-on</span>
                            <span className="font-medium">$199/month</span>
                          </div>
                          <div className="border-t pt-3">
                            <div className="flex justify-between font-bold">
                              <span>Total</span>
                              <span>$1,997/month</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}

                  {activeStep === 6 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <PlayCircle className="w-6 h-6 text-blue-600" />
                            <h3 className="font-medium">Quick Start Guide</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Get started with the platform in 10 minutes
                          </p>
                          <Button variant="outline" className="w-full">
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Watch Video (10 min)
                          </Button>
                        </Card>

                        <Card className="p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <BookOpen className="w-6 h-6 text-green-600" />
                            <h3 className="font-medium">User Manual</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Comprehensive user documentation
                          </p>
                          <Button variant="outline" className="w-full">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Read Documentation
                          </Button>
                        </Card>

                        <Card className="p-6">
                          <div className="flex items-center space-x-3 mb-4">
                            <GraduationCap className="w-6 h-6 text-purple-600" />
                            <h3 className="font-medium">Training Course</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Interactive training for your team
                          </p>
                          <Button variant="outline" className="w-full">
                            <GraduationCap className="w-4 h-4 mr-2" />
                            Start Training
                          </Button>
                        </Card>
                      </div>

                      <Card className="p-6">
                        <h3 className="font-medium mb-4">Recommended Learning Path</h3>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span className="text-sm">Platform Overview (5 min)</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span className="text-sm">User Management (10 min)</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span className="text-sm">Security Configuration (15 min)</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span className="text-sm">Advanced Features (20 min)</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )}

                  {activeStep === 7 && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Setup Complete!</h3>
                        <p className="text-gray-600 mb-6">
                          Your enterprise environment is ready to use
                        </p>
                      </div>

                      <Card className="p-6">
                        <h3 className="font-medium mb-4">Setup Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Company</span>
                            <span className="font-medium">{profile.companyName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Users</span>
                            <span className="font-medium">{users.length} configured</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Regions</span>
                            <span className="font-medium">{profile.regions.length} selected</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Features</span>
                            <span className="font-medium">
                              {[profile.aiAnalytics, profile.advancedSecurity, profile.globalDeployment].filter(Boolean).length} enabled
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Plan</span>
                            <span className="font-medium">{profile.billingPlan}</span>
                          </div>
                        </div>
                      </Card>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="p-6">
                          <h3 className="font-medium mb-4">Next Steps</h3>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Send user invitations</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Configure integrations</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Set up monitoring</span>
                            </li>
                            <li className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Schedule training</span>
                            </li>
                          </ul>
                        </Card>

                        <Card className="p-6">
                          <h3 className="font-medium mb-4">Support</h3>
                          <p className="text-sm text-gray-600 mb-4">
                            Need help? Our enterprise support team is ready to assist you.
                          </p>
                          <Button className="w-full">
                            <Mail className="w-4 h-4 mr-2" />
                            Contact Support
                          </Button>
                        </Card>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={activeStep === 0}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Progress</span>
                    </>
                  )}
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={activeStep === onboardingSteps.length - 1}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                >
                  <span>{activeStep === onboardingSteps.length - 1 ? 'Complete' : 'Next'}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
