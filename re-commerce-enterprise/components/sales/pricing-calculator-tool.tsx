
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Building2, 
  Shield, 
  Zap, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Share2, 
  Mail,
  Phone,
  ArrowRight,
  Lightbulb,
  Target,
  Award,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-enhanced';
import { Button } from '@/components/ui/button-enhanced';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PricingConfiguration {
  users: number;
  modules: string[];
  deploymentType: 'cloud' | 'onPremise' | 'hybrid';
  supportLevel: 'basic' | 'premium' | 'enterprise';
  contractLength: 12 | 24 | 36;
  industry: string;
  companySize: 'startup' | 'smb' | 'midmarket' | 'enterprise';
}

interface PricingResult {
  pricing: {
    userCost: number;
    moduleCosts: number;
    deploymentCost: number;
    supportCost: number;
    subtotal: number;
    discounts: Record<string, number>;
    totalDiscount: number;
    finalPrice: number;
    monthlyPrice: number;
    pricePerUser: number;
  };
  roi: {
    annualSavings: number;
    threeYearSavings: number;
    roi: number;
    paybackPeriod: number;
    netPresentValue: number;
    breakEvenPoint: number;
  };
  recommendations: Array<{
    type: string;
    title: string;
    description: string;
    potential_savings?: number;
    value?: string;
    roi_impact?: string;
  }>;
  comparison: {
    reCommerce: {
      monthlyPerUser: number;
      features: string[];
      rating: number;
    };
    competitor1: {
      name: string;
      monthlyPerUser: number;
      features: string[];
      rating: number;
    };
    competitor2: {
      name: string;
      monthlyPerUser: number;
      features: string[];
      rating: number;
    };
    savings: {
      vsCompetitorA: number;
      vsCompetitorB: number;
    };
  };
}

export function PricingCalculatorTool() {
  const [config, setConfig] = useState<PricingConfiguration>({
    users: 50,
    modules: ['analytics'],
    deploymentType: 'cloud',
    supportLevel: 'premium',
    contractLength: 24,
    industry: 'technology',
    companySize: 'smb'
  });

  const [result, setResult] = useState<PricingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [activeTab, setActiveTab] = useState('configurator');

  const availableModules = [
    { id: 'analytics', name: 'Advanced Analytics', price: 15000, description: 'Business intelligence and reporting' },
    { id: 'ai-insights', name: 'AI Insights', price: 25000, description: 'Machine learning and predictive analytics' },
    { id: 'security', name: 'Enterprise Security', price: 18000, description: 'Advanced security and compliance' },
    { id: 'integration', name: 'API Integration', price: 12000, description: 'Third-party system integrations' },
    { id: 'automation', name: 'Workflow Automation', price: 20000, description: 'Business process automation' },
    { id: 'compliance', name: 'Compliance Suite', price: 14000, description: 'Regulatory compliance tools' },
    { id: 'mobile', name: 'Mobile Platform', price: 8000, description: 'Mobile apps and responsive design' },
    { id: 'api-access', name: 'API Access', price: 10000, description: 'Full API access and webhooks' }
  ];

  const industries = [
    'technology', 'retail', 'healthcare', 'finance', 'manufacturing', 
    'education', 'government', 'nonprofit', 'consulting', 'media'
  ];

  const calculatePricing = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/pricing-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Pricing calculation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculatePricing();
  }, [config]);

  const handleModuleToggle = (moduleId: string) => {
    setConfig(prev => ({
      ...prev,
      modules: prev.modules.includes(moduleId)
        ? prev.modules.filter(m => m !== moduleId)
        : [...prev.modules, moduleId]
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-4">
              Enterprise Pricing Calculator
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Configure your perfect solution and see real-time pricing with ROI calculations. 
              Get an instant quote tailored to your business needs.
            </p>
          </motion.div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="configurator">Configuration</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          {/* Configuration Tab */}
          <TabsContent value="configurator" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Configuration Panel */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Configuration */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Basic Configuration</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Number of Users */}
                    <div className="space-y-3">
                      <Label className="text-base font-medium">Number of Users</Label>
                      <div className="space-y-2">
                        <Slider
                          value={[config.users]}
                          onValueChange={(value) => setConfig(prev => ({ ...prev, users: value[0] }))}
                          max={2000}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-neutral-600">
                          <span>1 user</span>
                          <span className="font-medium">{config.users} users</span>
                          <span>2000+ users</span>
                        </div>
                      </div>
                    </div>

                    {/* Company Size & Industry */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company Size</Label>
                        <Select
                          value={config.companySize}
                          onValueChange={(value: any) => setConfig(prev => ({ ...prev, companySize: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="startup">Startup (&lt;10 employees)</SelectItem>
                            <SelectItem value="smb">Small Business (10-99)</SelectItem>
                            <SelectItem value="midmarket">Mid-Market (100-999)</SelectItem>
                            <SelectItem value="enterprise">Enterprise (1000+)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Industry</Label>
                        <Select
                          value={config.industry}
                          onValueChange={(value) => setConfig(prev => ({ ...prev, industry: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map(industry => (
                              <SelectItem key={industry} value={industry}>
                                {industry.charAt(0).toUpperCase() + industry.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Module Selection */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5" />
                      <span>Feature Modules</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableModules.map((module) => (
                        <div
                          key={module.id}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            config.modules.includes(module.id)
                              ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700'
                          }`}
                          onClick={() => handleModuleToggle(module.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium mb-1">{module.name}</h4>
                              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                                {module.description}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {formatCurrency(module.price)}/year
                              </Badge>
                            </div>
                            <div className="ml-4">
                              <Switch
                                checked={config.modules.includes(module.id)}
                                onCheckedChange={() => handleModuleToggle(module.id)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Deployment & Support */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5" />
                      <span>Deployment & Support</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label>Deployment Type</Label>
                        <div className="space-y-2">
                          {[
                            { value: 'cloud', label: 'Cloud Hosted', description: 'Fully managed cloud solution' },
                            { value: 'onPremise', label: 'On-Premise', description: 'Self-hosted infrastructure' },
                            { value: 'hybrid', label: 'Hybrid', description: 'Mixed cloud and on-premise' }
                          ].map((option) => (
                            <div
                              key={option.value}
                              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                config.deploymentType === option.value
                                  ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20'
                                  : 'border-neutral-200 hover:border-neutral-300'
                              }`}
                              onClick={() => setConfig(prev => ({ ...prev, deploymentType: option.value as any }))}
                            >
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-neutral-600">{option.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Support Level</Label>
                        <div className="space-y-2">
                          {[
                            { value: 'basic', label: 'Basic Support', description: 'Email support, documentation' },
                            { value: 'premium', label: 'Premium Support', description: '24/7 phone & email support' },
                            { value: 'enterprise', label: 'Enterprise Support', description: 'Dedicated success manager' }
                          ].map((option) => (
                            <div
                              key={option.value}
                              className={`p-3 border rounded-lg cursor-pointer transition-all ${
                                config.supportLevel === option.value
                                  ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20'
                                  : 'border-neutral-200 hover:border-neutral-300'
                              }`}
                              onClick={() => setConfig(prev => ({ ...prev, supportLevel: option.value as any }))}
                            >
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-neutral-600">{option.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Contract Length</Label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 12, label: '1 Year', discount: '0%' },
                          { value: 24, label: '2 Years', discount: '8%' },
                          { value: 36, label: '3 Years', discount: '15%' }
                        ].map((option) => (
                          <div
                            key={option.value}
                            className={`p-4 border rounded-lg cursor-pointer text-center transition-all ${
                              config.contractLength === option.value
                                ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-neutral-200 hover:border-neutral-300'
                            }`}
                            onClick={() => setConfig(prev => ({ ...prev, contractLength: option.value as any }))}
                          >
                            <div className="font-medium">{option.label}</div>
                            <Badge variant="secondary" className="mt-1">
                              {option.discount} discount
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Real-time Pricing Summary */}
              <div className="space-y-6">
                <Card variant="elevated" className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Calculator className="h-5 w-5" />
                      <span>Pricing Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="space-y-4">
                        <div className="animate-pulse">
                          <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ) : result ? (
                      <div className="space-y-4">
                        <div className="text-center pb-4 border-b border-neutral-200 dark:border-neutral-700">
                          <div className="text-3xl font-bold text-primary-600">
                            {formatCurrency(result.pricing.finalPrice)}
                          </div>
                          <div className="text-sm text-neutral-600">
                            Total ({config.contractLength} months)
                          </div>
                          <div className="text-lg font-semibold mt-2">
                            {formatCurrency(result.pricing.monthlyPrice)}/month
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Base Cost</span>
                            <span>{formatCurrency(result.pricing.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-success-600">
                            <span>Total Savings</span>
                            <span>-{formatCurrency(result.pricing.totalDiscount)}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-lg pt-2 border-t border-neutral-200">
                            <span>Final Price</span>
                            <span>{formatCurrency(result.pricing.finalPrice)}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                          <div className="text-center text-sm text-neutral-600 mb-3">
                            Per user per month
                          </div>
                          <div className="text-center text-2xl font-bold text-success-600">
                            {formatCurrency(result.pricing.pricePerUser)}
                          </div>
                        </div>

                        <Button 
                          className="w-full" 
                          size="lg"
                          onClick={() => setActiveTab('pricing')}
                        >
                          View Detailed Pricing
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Pricing Details Tab */}
          <TabsContent value="pricing" className="space-y-8">
            {result && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pricing Breakdown */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Detailed Pricing Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>User Licenses ({config.users} users)</span>
                        <span>{formatCurrency(result.pricing.userCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Feature Modules ({config.modules.length})</span>
                        <span>{formatCurrency(result.pricing.moduleCosts)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Deployment ({config.deploymentType})</span>
                        <span>{formatCurrency(result.pricing.deploymentCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Support ({config.supportLevel})</span>
                        <span>{formatCurrency(result.pricing.supportCost)}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Subtotal</span>
                        <span>{formatCurrency(result.pricing.subtotal)}</span>
                      </div>
                    </div>

                    {/* Discounts */}
                    <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                      <h4 className="font-semibold mb-3 text-success-600">Applied Discounts</h4>
                      <div className="space-y-2">
                        {Object.entries(result.pricing.discounts).map(([type, amount]) => (
                          <div key={type} className="flex justify-between text-success-600">
                            <span className="capitalize">{type.replace(/([A-Z])/g, ' $1')}</span>
                            <span>-{formatCurrency(amount as number)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-semibold pt-2 border-t text-success-600">
                          <span>Total Savings</span>
                          <span>-{formatCurrency(result.pricing.totalDiscount)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Final Price</span>
                        <span className="text-primary-600">{formatCurrency(result.pricing.finalPrice)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5" />
                      <span>Optimization Recommendations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {result.recommendations.map((rec, index) => (
                        <div key={index} className="p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200 dark:border-warning-800">
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-warning-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold text-warning-900 dark:text-warning-100">
                                {rec.title}
                              </h4>
                              <p className="text-sm text-warning-700 dark:text-warning-300 mt-1">
                                {rec.description}
                              </p>
                              {rec.potential_savings && (
                                <Badge variant="outline" className="mt-2">
                                  Save {formatCurrency(rec.potential_savings)}
                                </Badge>
                              )}
                              {rec.roi_impact && (
                                <Badge variant="outline" className="mt-2">
                                  {rec.roi_impact}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* ROI Analysis Tab */}
          <TabsContent value="roi" className="space-y-8">
            {result && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ROI Metrics */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Return on Investment</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-success-50 dark:bg-success-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-success-600">
                          {result.roi.roi}%
                        </div>
                        <div className="text-sm text-success-700 dark:text-success-300">
                          3-Year ROI
                        </div>
                      </div>
                      
                      <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                        <div className="text-3xl font-bold text-primary-600">
                          {result.roi.paybackPeriod}
                        </div>
                        <div className="text-sm text-primary-700 dark:text-primary-300">
                          Months to Payback
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4">
                      <div className="flex justify-between">
                        <span>Annual Savings</span>
                        <span className="font-semibold text-success-600">
                          {formatCurrency(result.roi.annualSavings)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>3-Year Savings</span>
                        <span className="font-semibold text-success-600">
                          {formatCurrency(result.roi.threeYearSavings)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Net Present Value</span>
                        <span className="font-semibold">
                          {formatCurrency(result.roi.netPresentValue)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Business Impact */}
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Business Impact Projection</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        { 
                          title: 'Productivity Increase', 
                          value: '+25%', 
                          description: 'Employee efficiency improvement',
                          icon: Users
                        },
                        { 
                          title: 'Process Automation', 
                          value: '85%', 
                          description: 'Manual tasks automated',
                          icon: Zap
                        },
                        { 
                          title: 'Decision Speed', 
                          value: '10x faster', 
                          description: 'Data-driven decisions',
                          icon: Clock
                        },
                        { 
                          title: 'Compliance Score', 
                          value: '99.9%', 
                          description: 'Regulatory adherence',
                          icon: Shield
                        }
                      ].map((impact, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <impact.icon className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{impact.title}</span>
                              <span className="text-lg font-bold text-primary-600">
                                {impact.value}
                              </span>
                            </div>
                            <div className="text-sm text-neutral-600">
                              {impact.description}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-8">
            {result && (
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Competitive Comparison</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-neutral-200 dark:border-neutral-700">
                          <th className="text-left py-3 px-4">Solution</th>
                          <th className="text-center py-3 px-4">Monthly Cost/User</th>
                          <th className="text-center py-3 px-4">Rating</th>
                          <th className="text-left py-3 px-4">Key Features</th>
                          <th className="text-center py-3 px-4">Annual Savings</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-neutral-200 dark:border-neutral-700 bg-primary-50 dark:bg-primary-900/20">
                          <td className="py-4 px-4 font-semibold">
                            <div className="flex items-center space-x-2">
                              <Award className="h-5 w-5 text-primary-600" />
                              <span>Re-Commerce Enterprise</span>
                              <Badge variant="default">Recommended</Badge>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center font-semibold text-primary-600">
                            {formatCurrency(result.comparison.reCommerce.monthlyPerUser)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(result.comparison.reCommerce.rating)
                                      ? 'text-warning-500 fill-current'
                                      : 'text-neutral-300'
                                  }`}
                                >
                                  ⭐
                                </div>
                              ))}
                              <span className="ml-1 text-sm">
                                {result.comparison.reCommerce.rating}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1">
                              {result.comparison.reCommerce.features.map((feature, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center font-semibold text-success-600">
                            Baseline
                          </td>
                        </tr>
                        
                        <tr className="border-b border-neutral-200 dark:border-neutral-700">
                          <td className="py-4 px-4">{result.comparison.competitor1.name}</td>
                          <td className="py-4 px-4 text-center">
                            {formatCurrency(result.comparison.competitor1.monthlyPerUser)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(result.comparison.competitor1.rating)
                                      ? 'text-warning-500 fill-current'
                                      : 'text-neutral-300'
                                  }`}
                                >
                                  ⭐
                                </div>
                              ))}
                              <span className="ml-1 text-sm">
                                {result.comparison.competitor1.rating}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1">
                              {result.comparison.competitor1.features.map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center font-semibold text-success-600">
                            +{formatCurrency(result.comparison.savings.vsCompetitorA)}
                          </td>
                        </tr>
                        
                        <tr className="border-b border-neutral-200 dark:border-neutral-700">
                          <td className="py-4 px-4">{result.comparison.competitor2.name}</td>
                          <td className="py-4 px-4 text-center">
                            {formatCurrency(result.comparison.competitor2.monthlyPerUser)}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(result.comparison.competitor2.rating)
                                      ? 'text-warning-500 fill-current'
                                      : 'text-neutral-300'
                                  }`}
                                >
                                  ⭐
                                </div>
                              ))}
                              <span className="ml-1 text-sm">
                                {result.comparison.competitor2.rating}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-wrap gap-1">
                              {result.comparison.competitor2.features.map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center font-semibold text-success-600">
                            +{formatCurrency(result.comparison.savings.vsCompetitorB)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16"
        >
          <Card variant="elevated" className="p-8 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-8">
                Get a personalized quote and speak with our enterprise specialists about your specific requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" onClick={() => setShowQuoteForm(true)}>
                  <Mail className="h-4 w-4 mr-2" />
                  Request Custom Quote
                </Button>
                <Button variant="outline" size="lg">
                  <Phone className="h-4 w-4 mr-2" />
                  Schedule Demo Call
                </Button>
                <Button variant="outline" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
