
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
import { Separator } from '@/components/ui/separator';
import { 
  Palette,
  Type,
  Settings,
  Workflow,
  Plug,
  Bell,
  Eye,
  Save,
  RefreshCw,
  Upload,
  Download,
  Code,
  Monitor,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Zap,
  Plus
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TenantBranding {
  id?: string;
  tenantId: string;
  brandName?: string;
  logoUrl?: string;
  logoUrlDark?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  customCSS?: string;
  customJS?: string;
  customHTML?: string;
  loginTheme: string;
  dashboardTheme: string;
  isActive: boolean;
}

interface TenantFeatures {
  currentFeatures: Record<string, boolean>;
  availableFeatures: string[];
  plan: string;
  tier: string;
}

interface TenantWorkflow {
  id?: string;
  name: string;
  description?: string;
  trigger: any;
  conditions: any[];
  actions: any[];
  isActive: boolean;
  category: string;
  priority: number;
}

interface TenantCustomizationEngineProps {
  tenantId: string;
  className?: string;
}

export function TenantCustomizationEngine({ tenantId, className }: TenantCustomizationEngineProps) {
  const [activeTab, setActiveTab] = useState('branding');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Branding state
  const [branding, setBranding] = useState<TenantBranding>({
    tenantId,
    primaryColor: '#0066cc',
    secondaryColor: '#666666',
    accentColor: '#0099ff',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    fontFamily: 'Inter',
    loginTheme: 'default',
    dashboardTheme: 'light',
    isActive: true
  });

  // Features state
  const [features, setFeatures] = useState<TenantFeatures>({
    currentFeatures: {},
    availableFeatures: [],
    plan: 'basic',
    tier: 'standard'
  });

  // Workflows state
  const [workflows, setWorkflows] = useState<TenantWorkflow[]>([]);
  const [newWorkflow, setNewWorkflow] = useState<Partial<TenantWorkflow>>({
    name: '',
    description: '',
    trigger: {},
    conditions: [],
    actions: [],
    isActive: true,
    category: 'general',
    priority: 0
  });

  const { toast } = useToast();

  useEffect(() => {
    if (tenantId) {
      fetchCustomizationData();
    }
  }, [tenantId, activeTab]);

  const fetchCustomizationData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/tenant-customization?tenantId=${tenantId}&type=${activeTab}`);
      if (!response.ok) {
        throw new Error('Failed to fetch customization data');
      }

      const data = await response.json();
      if (data.success) {
        switch (activeTab) {
          case 'branding':
            if (data.data) {
              setBranding({ ...branding, ...data.data });
            }
            break;
          case 'features':
            setFeatures(data.data);
            break;
          case 'workflows':
            setWorkflows(data.data || []);
            break;
        }
      } else {
        throw new Error(data.error || 'Failed to fetch data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const saveCustomization = async (type: string, data: any) => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/tenant-customization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          type,
          data
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save customization');
      }

      const result = await response.json();
      if (result.success) {
        toast({
          title: 'Success',
          description: result.message || 'Customization saved successfully'
        });
        
        // Refresh data after save
        fetchCustomizationData();
      } else {
        throw new Error(result.error || 'Failed to save');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleBrandingChange = (field: keyof TenantBranding, value: any) => {
    setBranding(prev => ({ ...prev, [field]: value }));
  };

  const handleFeatureToggle = (featureName: string, enabled: boolean) => {
    setFeatures(prev => ({
      ...prev,
      currentFeatures: {
        ...prev.currentFeatures,
        [featureName]: enabled
      }
    }));
  };

  const handleWorkflowSave = async () => {
    if (!newWorkflow.name || !newWorkflow.trigger) {
      toast({
        title: 'Validation Error',
        description: 'Name and trigger are required',
        variant: 'destructive'
      });
      return;
    }

    await saveCustomization('workflow', newWorkflow);
    setNewWorkflow({
      name: '',
      description: '',
      trigger: {},
      conditions: [],
      actions: [],
      isActive: true,
      category: 'general', 
      priority: 0
    });
  };

  const renderBrandingTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Brand Identity
          </CardTitle>
          <CardDescription>
            Customize your tenant's visual identity and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  value={branding.brandName || ''}
                  onChange={(e) => handleBrandingChange('brandName', e.target.value)}
                  placeholder="Enter brand name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo URL</Label>
                <Input
                  id="logoUrl"
                  value={branding.logoUrl || ''}
                  onChange={(e) => handleBrandingChange('logoUrl', e.target.value)}
                  placeholder="https://i.pinimg.com/originals/35/6c/1a/356c1a7a9d155244573a37010eb471cd.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faviconUrl">Favicon URL</Label>
                <Input
                  id="faviconUrl"
                  value={branding.faviconUrl || ''}
                  onChange={(e) => handleBrandingChange('faviconUrl', e.target.value)}
                  placeholder="https://i.pinimg.com/originals/10/82/4d/10824d576fd7de6c4dd7d44e6e28caee.png"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Color Palette</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor" className="text-sm">Primary</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="primaryColor"
                        value={branding.primaryColor}
                        onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                        className="w-12 h-10 rounded border"
                      />
                      <Input
                        value={branding.primaryColor}
                        onChange={(e) => handleBrandingChange('primaryColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor" className="text-sm">Secondary</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="secondaryColor"
                        value={branding.secondaryColor}
                        onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                        className="w-12 h-10 rounded border"
                      />
                      <Input
                        value={branding.secondaryColor}
                        onChange={(e) => handleBrandingChange('secondaryColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accentColor" className="text-sm">Accent</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="accentColor"
                        value={branding.accentColor}
                        onChange={(e) => handleBrandingChange('accentColor', e.target.value)}
                        className="w-12 h-10 rounded border"
                      />
                      <Input
                        value={branding.accentColor}
                        onChange={(e) => handleBrandingChange('accentColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor" className="text-sm">Background</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="backgroundColor"
                        value={branding.backgroundColor}
                        onChange={(e) => handleBrandingChange('backgroundColor', e.target.value)}
                        className="w-12 h-10 rounded border"
                      />
                      <Input
                        value={branding.backgroundColor}
                        onChange={(e) => handleBrandingChange('backgroundColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select
                  value={branding.fontFamily}
                  onValueChange={(value) => handleBrandingChange('fontFamily', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginTheme">Login Theme</Label>
                <Select
                  value={branding.loginTheme}
                  onValueChange={(value) => handleBrandingChange('loginTheme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="branded">Branded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dashboardTheme">Dashboard Theme</Label>
                <Select
                  value={branding.dashboardTheme}
                  onValueChange={(value) => handleBrandingChange('dashboardTheme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="brandingActive"
                  checked={branding.isActive}
                  onCheckedChange={(checked) => handleBrandingChange('isActive', checked)}
                />
                <Label htmlFor="brandingActive">Enable Custom Branding</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <span className="text-sm text-gray-600">Preview on desktop and mobile</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => fetchCustomizationData()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => saveCustomization('branding', branding)} disabled={saving}>
                {saving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Changes
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom CSS/JS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Custom Code
          </CardTitle>
          <CardDescription>
            Add custom CSS and JavaScript for advanced customization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customCSS">Custom CSS</Label>
            <Textarea
              id="customCSS"
              value={branding.customCSS || ''}
              onChange={(e) => handleBrandingChange('customCSS', e.target.value)}
              placeholder="/* Your custom CSS here */"
              className="h-32 font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customJS">Custom JavaScript</Label>
            <Textarea
              id="customJS"
              value={branding.customJS || ''}
              onChange={(e) => handleBrandingChange('customJS', e.target.value)}
              placeholder="// Your custom JavaScript here"
              className="h-32 font-mono text-sm"
            />
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Custom code will be injected into all pages. Ensure your code is secure and tested.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Feature Configuration
          </CardTitle>
          <CardDescription>
            Enable or disable features based on your plan: {features.plan} ({features.tier})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.availableFeatures.map((feature) => (
              <Card key={feature} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">
                      {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getFeatureDescription(feature)}
                    </div>
                  </div>
                  <Switch
                    checked={features.currentFeatures[feature] || false}
                    onCheckedChange={(checked) => handleFeatureToggle(feature, checked)}
                  />
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={() => saveCustomization('features', { features: features.currentFeatures })} disabled={saving}>
              {saving ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Features
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderWorkflowsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" />
            Automation Workflows
          </CardTitle>
          <CardDescription>
            Create automated workflows to streamline your operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Workflows */}
          <div className="space-y-4">
            <h4 className="font-medium">Active Workflows</h4>
            {workflows.length > 0 ? (
              <div className="space-y-3">
                {workflows.map((workflow) => (
                  <Card key={workflow.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{workflow.name}</span>
                          <Badge variant={workflow.isActive ? 'default' : 'secondary'}>
                            {workflow.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline">{workflow.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{workflow.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Delete</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No workflows configured yet
              </div>
            )}
          </div>

          <Separator />

          {/* New Workflow Form */}
          <div className="space-y-4">
            <h4 className="font-medium">Create New Workflow</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workflowName">Workflow Name</Label>
                <Input
                  id="workflowName"
                  value={newWorkflow.name || ''}
                  onChange={(e) => setNewWorkflow(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter workflow name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workflowCategory">Category</Label>
                <Select
                  value={newWorkflow.category || 'general'}
                  onValueChange={(value) => setNewWorkflow(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="user_management">User Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workflowDescription">Description</Label>
              <Textarea
                id="workflowDescription"
                value={newWorkflow.description || ''}
                onChange={(e) => setNewWorkflow(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this workflow does"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="workflowActive"
                  checked={newWorkflow.isActive || true}
                  onCheckedChange={(checked) => setNewWorkflow(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="workflowActive">Enable workflow</Label>
              </div>
              <Button onClick={handleWorkflowSave} disabled={saving}>
                {saving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Create Workflow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const getFeatureDescription = (feature: string): string => {
    const descriptions: Record<string, string> = {
      user_management: 'Manage users, roles, and permissions',
      basic_analytics: 'View basic usage and performance metrics',
      advanced_analytics: 'Advanced reporting and data insights',
      email_notifications: 'Send email notifications and alerts',
      multi_notifications: 'Multiple notification channels',
      basic_integrations: 'Connect with popular third-party services',
      advanced_integrations: 'Enterprise-grade integrations and APIs',
      custom_branding: 'Customize colors, logos, and themes',
      white_labeling: 'Full white-label customization',
      api_access: 'REST API access for developers',
      custom_workflows: 'Create automated business workflows',
      audit_logs: 'Detailed activity and security logs',
      priority_support: 'Priority customer support',
      dedicated_support: 'Dedicated support representative'
    };
    
    return descriptions[feature] || 'Feature description not available';
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tenant Customization</h2>
          <p className="text-gray-600">Customize branding, features, and workflows for your tenant</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Tenant ID: {tenantId}</Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="branding" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          {renderBrandingTab()}
        </TabsContent>

        <TabsContent value="features">
          {renderFeaturesTab()}
        </TabsContent>

        <TabsContent value="workflows">
          {renderWorkflowsTab()}
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5" />
                Integration Management
              </CardTitle>
              <CardDescription>
                Manage third-party integrations and API connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                Integration management coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
