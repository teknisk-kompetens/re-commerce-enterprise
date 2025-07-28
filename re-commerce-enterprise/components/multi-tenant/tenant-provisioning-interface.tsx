
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Plus,
  Settings,
  Database,
  Palette,
  Shield,
  Globe,
  Zap,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Play,
  History,
  FileText,
  Mail
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TenantData {
  name: string;
  domain: string;
  subdomain: string;
  plan: string;
  tier: string;
  maxUsers: number;
  storageLimit: number;
  bandwidthLimit: number;
  apiCallLimit: number;
  isolationLevel: string;
  complianceLevel: string;
  primaryRegion: string;
  features: Record<string, boolean>;
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
    loginTheme?: string;
    dashboardTheme?: string;
  };
  integrations?: Array<{
    type: string;
    name: string;
    configuration: any;
    credentials: any;
    syncFrequency: string;
  }>;
  contactEmail?: string;
}

interface ProvisioningOptions {
  createDatabase: boolean;
  setupBranding: boolean;
  configureResources: boolean;
  setupIntegrations: boolean;
  sendWelcomeEmail: boolean;
}

interface ProvisioningHistory {
  id: string;
  tenantId: string;
  tenant: {
    id: string;
    name: string;
    domain: string;
    subdomain: string;
    plan: string;
    tier: string;
    status: string;
    provisionedAt: Date;
  };
  provisionedAt: Date;
  stepsCompleted: number;
  provisioningId: string;
}

interface TenantProvisioningInterfaceProps {
  className?: string;
}

export function TenantProvisioningInterface({ className }: TenantProvisioningInterfaceProps) {
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(false);
  const [provisioningHistory, setProvisioningHistory] = useState<ProvisioningHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Tenant configuration state
  const [tenantData, setTenantData] = useState<TenantData>({
    name: '',
    domain: '',
    subdomain: '',
    plan: 'basic',
    tier: 'standard',
    maxUsers: 100,
    storageLimit: 10737418240, // 10GB
    bandwidthLimit: 107374182400, // 100GB
    apiCallLimit: 100000,
    isolationLevel: 'shared',
    complianceLevel: 'standard',
    primaryRegion: 'eu-north-1',
    features: {
      user_management: true,
      basic_analytics: true,
      email_notifications: true,
      basic_integrations: true,
      standard_storage: true
    }
  });

  // Provisioning options
  const [provisioningOptions, setProvisioningOptions] = useState<ProvisioningOptions>({
    createDatabase: true,
    setupBranding: true,
    configureResources: true,
    setupIntegrations: false,
    sendWelcomeEmail: true
  });

  // Current provisioning status
  const [provisioningStatus, setProvisioningStatus] = useState<{
    active: boolean;
    tenantId?: string;
    tenantName?: string;
    steps: string[];
    currentStep?: string;
    progress: number;
  }>({
    active: false,
    steps: [],
    progress: 0
  });

  const { toast } = useToast();

  useEffect(() => {
    if (activeTab === 'history') {
      fetchProvisioningHistory();
    }
  }, [activeTab]);

  const fetchProvisioningHistory = async () => {
    try {
      setHistoryLoading(true);
      
      const response = await fetch('/api/tenant-provisioning?status=recent&limit=20');
      if (!response.ok) {
        throw new Error('Failed to fetch provisioning history');
      }

      const data = await response.json();
      if (data.success) {
        setProvisioningHistory(data.data.provisioningHistory || []);
      }
    } catch (err) {
      console.error('Failed to fetch provisioning history:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleTenantDataChange = (field: keyof TenantData, value: any) => {
    setTenantData(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (feature: string, enabled: boolean) => {
    setTenantData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: enabled
      }
    }));
  };

  const handleProvisioningOptionChange = (option: keyof ProvisioningOptions, value: boolean) => {
    setProvisioningOptions(prev => ({ ...prev, [option]: value }));
  };

  const validateTenantData = (): string | null => {
    if (!tenantData.name.trim()) return 'Tenant name is required';
    if (!tenantData.domain.trim()) return 'Domain is required';
    if (!tenantData.subdomain.trim()) return 'Subdomain is required';
    if (tenantData.maxUsers < 1) return 'Max users must be at least 1';
    if (tenantData.storageLimit < 1000000) return 'Storage limit must be at least 1MB';
    if (tenantData.bandwidthLimit < 1000000) return 'Bandwidth limit must be at least 1MB';
    if (tenantData.apiCallLimit < 1000) return 'API call limit must be at least 1000';
    
    // Domain validation
    const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(tenantData.domain)) return 'Invalid domain format';
    
    // Subdomain validation
    const subdomainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
    if (!subdomainRegex.test(tenantData.subdomain)) return 'Invalid subdomain format';
    
    return null;
  };

  const provisionTenant = async () => {
    try {
      const validationError = validateTenantData();
      if (validationError) {
        toast({
          title: 'Validation Error',
          description: validationError,
          variant: 'destructive'
        });
        return;
      }

      setLoading(true);
      setProvisioningStatus({
        active: true,
        steps: [
          'Validating configuration',
          'Creating tenant record',
          'Setting up database isolation',
          'Configuring branding',
          'Allocating resources',
          'Setting up integrations',
          'Initializing analytics',
          'Creating default configurations',
          'Sending welcome notification',
          'Finalizing provisioning'
        ],
        progress: 0
      });

      const response = await fetch('/api/tenant-provisioning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantData,
          provisioningOptions
        })
      });

      if (!response.ok) {
        throw new Error('Failed to provision tenant');
      }

      const data = await response.json();
      if (data.success) {
        setProvisioningStatus(prev => ({
          ...prev,
          tenantId: data.data.tenant.id,
          tenantName: data.data.tenant.name,
          progress: 100
        }));

        toast({
          title: 'Success',
          description: `Tenant "${data.data.tenant.name}" provisioned successfully!`
        });

        // Reset form after successful provisioning
        setTimeout(() => {
          setProvisioningStatus({ active: false, steps: [], progress: 0 });
          setTenantData({
            name: '',
            domain: '',
            subdomain: '',
            plan: 'basic',
            tier: 'standard',
            maxUsers: 100,
            storageLimit: 10737418240,
            bandwidthLimit: 107374182400,
            apiCallLimit: 100000,
            isolationLevel: 'shared',
            complianceLevel: 'standard',
            primaryRegion: 'eu-north-1',
            features: {
              user_management: true,
              basic_analytics: true,
              email_notifications: true,
              basic_integrations: true,
              standard_storage: true
            }
          });
        }, 3000);

      } else {
        throw new Error(data.error || 'Failed to provision tenant');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setProvisioningStatus({ active: false, steps: [], progress: 0 });
      toast({
        title: 'Provisioning Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const planLimits = {
    basic: { users: 25, storage: 5368709120, bandwidth: 53687091200, apiCalls: 25000 },
    professional: { users: 250, storage: 53687091200, bandwidth: 536870912000, apiCalls: 250000 },
    enterprise: { users: -1, storage: -1, bandwidth: -1, apiCalls: -1 }
  };

  // Update limits when plan changes
  useEffect(() => {
    const limits = planLimits[tenantData.plan as keyof typeof planLimits];
    if (limits) {
      setTenantData(prev => ({
        ...prev,
        maxUsers: limits.users === -1 ? 1000 : Math.min(prev.maxUsers, limits.users),
        storageLimit: limits.storage === -1 ? prev.storageLimit : Math.min(prev.storageLimit, limits.storage),
        bandwidthLimit: limits.bandwidth === -1 ? prev.bandwidthLimit : Math.min(prev.bandwidthLimit, limits.bandwidth),
        apiCallLimit: limits.apiCalls === -1 ? prev.apiCallLimit : Math.min(prev.apiCallLimit, limits.apiCalls)
      }));
    }
  }, [tenantData.plan]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tenant Provisioning</h2>
          <p className="text-gray-600">Automated tenant creation and configuration</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Auto-Provisioning Enabled</Badge>
        </div>
      </div>

      {/* Provisioning Status */}
      {provisioningStatus.active && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              Provisioning in Progress
            </CardTitle>
            <CardDescription>
              {provisioningStatus.tenantName 
                ? `Setting up "${provisioningStatus.tenantName}"...`
                : 'Initializing tenant provisioning...'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Progress</span>
                  <span>{provisioningStatus.progress}%</span>
                </div>
                <Progress value={provisioningStatus.progress} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Provisioning Steps:</h4>
                <div className="space-y-1">
                  {provisioningStatus.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Tenant
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Configuration */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Configure the basic tenant details and identification
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tenantName">Tenant Name *</Label>
                      <Input
                        id="tenantName"
                        value={tenantData.name}
                        onChange={(e) => handleTenantDataChange('name', e.target.value)}
                        placeholder="Acme Corporation"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={tenantData.contactEmail || ''}
                        onChange={(e) => handleTenantDataChange('contactEmail', e.target.value)}
                        placeholder="admin@acme.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="domain">Domain *</Label>
                      <Input
                        id="domain"
                        value={tenantData.domain}
                        onChange={(e) => handleTenantDataChange('domain', e.target.value)}
                        placeholder="acme.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subdomain">Subdomain *</Label>
                      <Input
                        id="subdomain"
                        value={tenantData.subdomain}
                        onChange={(e) => handleTenantDataChange('subdomain', e.target.value)}
                        placeholder="acme"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="plan">Plan</Label>
                      <Select
                        value={tenantData.plan}
                        onValueChange={(value) => handleTenantDataChange('plan', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tier">Tier</Label>
                      <Select
                        value={tenantData.tier}
                        onValueChange={(value) => handleTenantDataChange('tier', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">Primary Region</Label>
                      <Select
                        value={tenantData.primaryRegion}
                        onValueChange={(value) => handleTenantDataChange('primaryRegion', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="eu-north-1">EU North (Stockholm)</SelectItem>
                          <SelectItem value="eu-west-1">EU West (Ireland)</SelectItem>
                          <SelectItem value="us-east-1">US East (Virginia)</SelectItem>
                          <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                          <SelectItem value="ap-southeast-1">Asia Pacific (Singapore)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Resource Allocation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Resource Allocation
                  </CardTitle>
                  <CardDescription>
                    Configure resource limits and quotas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxUsers">Max Users</Label>
                      <Input
                        id="maxUsers"
                        type="number"
                        min="1"
                        max={planLimits[tenantData.plan as keyof typeof planLimits]?.users === -1 
                          ? undefined 
                          : planLimits[tenantData.plan as keyof typeof planLimits]?.users
                        }
                        value={tenantData.maxUsers}
                        onChange={(e) => handleTenantDataChange('maxUsers', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apiCallLimit">API Call Limit</Label>
                      <Input
                        id="apiCallLimit"
                        type="number"
                        min="1000"
                        value={tenantData.apiCallLimit}
                        onChange={(e) => handleTenantDataChange('apiCallLimit', parseInt(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storageLimit">
                        Storage Limit ({formatBytes(tenantData.storageLimit)})
                      </Label>
                      <Input
                        id="storageLimit"
                        type="range"
                        min="1073741824" // 1GB
                        max="1099511627776" // 1TB
                        step="1073741824" // 1GB steps
                        value={tenantData.storageLimit}
                        onChange={(e) => handleTenantDataChange('storageLimit', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bandwidthLimit">
                        Bandwidth Limit ({formatBytes(tenantData.bandwidthLimit)})
                      </Label>
                      <Input
                        id="bandwidthLimit"
                        type="range"
                        min="10737418240" // 10GB
                        max="10995116277760" // 10TB
                        step="10737418240" // 10GB steps
                        value={tenantData.bandwidthLimit}
                        onChange={(e) => handleTenantDataChange('bandwidthLimit', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security & Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security & Compliance
                  </CardTitle>
                  <CardDescription>
                    Configure security and compliance settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="isolationLevel">Isolation Level</Label>
                      <Select
                        value={tenantData.isolationLevel}
                        onValueChange={(value) => handleTenantDataChange('isolationLevel', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shared">Shared</SelectItem>
                          <SelectItem value="dedicated">Dedicated</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="complianceLevel">Compliance Level</Label>
                      <Select
                        value={tenantData.complianceLevel}
                        onValueChange={(value) => handleTenantDataChange('complianceLevel', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="enhanced">Enhanced</SelectItem>
                          <SelectItem value="maximum">Maximum</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Features
                  </CardTitle>
                  <CardDescription>
                    Enable or disable specific features for this tenant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(tenantData.features).map(([feature, enabled]) => (
                      <div key={feature} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">
                            {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getFeatureDescription(feature)}
                          </div>
                        </div>
                        <Switch
                          checked={enabled}
                          onCheckedChange={(checked) => handleFeatureToggle(feature, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Provisioning Options */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Provisioning Options</CardTitle>
                  <CardDescription>
                    Configure what should be set up during provisioning
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(provisioningOptions).map(([option, enabled]) => (
                    <div key={option} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">
                          {option.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getProvisioningOptionDescription(option)}
                        </div>
                      </div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => handleProvisioningOptionChange(option as keyof ProvisioningOptions, checked)}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={provisionTenant}
                    disabled={loading || provisioningStatus.active}
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-2" />
                    )}
                    Provision Tenant
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Save as Template
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Form
                  </Button>
                </CardContent>
              </Card>

              {/* Cost Estimate */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost Estimate</CardTitle>
                  <CardDescription>Monthly cost projection</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base Plan ({tenantData.plan})</span>
                      <span>${getBasePlanCost(tenantData.plan, tenantData.tier)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Storage ({formatBytes(tenantData.storageLimit)})</span>
                      <span>${(tenantData.storageLimit / 1073741824 * 0.1).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Users ({tenantData.maxUsers})</span>
                      <span>${(tenantData.maxUsers * 5).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total Monthly</span>
                      <span>${calculateTotalCost(tenantData)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Provisioning History
              </CardTitle>
              <CardDescription>
                Recent tenant provisioning activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="flex items-center justify-center h-32">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : provisioningHistory.length > 0 ? (
                <div className="space-y-4">
                  {provisioningHistory.map((history) => (
                    <div key={history.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{history.tenant?.name}</div>
                          <div className="text-sm text-gray-500">
                            {history.tenant?.domain} • {history.tenant?.plan}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          {new Date(history.provisionedAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {history.stepsCompleted} steps completed
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No provisioning history available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Provisioning Templates
              </CardTitle>
              <CardDescription>
                Pre-configured templates for common tenant setups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                Provisioning templates coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper functions
function getFeatureDescription(feature: string): string {
  const descriptions: Record<string, string> = {
    user_management: 'Manage users, roles, and permissions',
    basic_analytics: 'View basic usage and performance metrics',
    advanced_analytics: 'Advanced reporting and data insights',
    email_notifications: 'Send email notifications and alerts',
    basic_integrations: 'Connect with popular third-party services',
    standard_storage: 'Standard file storage capabilities'
  };
  return descriptions[feature] || 'Feature description not available';
}

function getProvisioningOptionDescription(option: string): string {
  const descriptions: Record<string, string> = {
    createDatabase: 'Set up isolated database schema',
    setupBranding: 'Apply custom branding configuration',
    configureResources: 'Allocate compute and storage resources',
    setupIntegrations: 'Configure third-party integrations',
    sendWelcomeEmail: 'Send welcome email to tenant admin'
  };
  return descriptions[option] || 'Option description not available';
}

function getBasePlanCost(plan: string, tier: string): string {
  const costs = {
    basic: { standard: 29, premium: 49 },
    professional: { standard: 99, premium: 149 },
    enterprise: { standard: 299, premium: 499 }
  };
  return (costs[plan as keyof typeof costs]?.[tier as keyof typeof costs.basic] || 0).toFixed(2);
}

function calculateTotalCost(tenantData: TenantData): string {
  const baseCost = parseFloat(getBasePlanCost(tenantData.plan, tenantData.tier));
  const storageCost = tenantData.storageLimit / 1073741824 * 0.1; // $0.1 per GB
  const userCost = tenantData.maxUsers * 5; // $5 per user
  return (baseCost + storageCost + userCost).toFixed(2);
}
