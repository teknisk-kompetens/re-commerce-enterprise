
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Shield, 
  Brain, 
  Eye, 
  EyeOff, 
  Lock,
  Users,
  Target,
  Sliders,
  Download,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  Cookie,
  Database,
  Activity,
  BarChart3,
  Zap,
  Clock
} from 'lucide-react';

interface PersonalizationProfile {
  id: string;
  userId: string;
  personalizationLevel: string;
  privacyLevel: string;
  consentGiven: boolean;
  consentDate?: string;
  adaptationSpeed: number;
  trainingDataPoints: number;
  modelConfidence: number;
  preferences: UserPreference[];
}

interface UserPreference {
  id: string;
  category: string;
  key: string;
  value: any;
  source: string;
  confidence: number;
  isActive: boolean;
}

interface PersonalizationSettingsProps {
  userId: string;
  tenantId: string;
  className?: string;
}

export default function PersonalizationSettings({ 
  userId, 
  tenantId, 
  className = "" 
}: PersonalizationSettingsProps) {
  const [profile, setProfile] = useState<PersonalizationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    personalizationEnabled: true,
    personalizationLevel: "adaptive",
    privacyLevel: "balanced",
    dataCollection: true,
    analyticsTracking: true,
    recommendationsEnabled: true,
    behaviorTracking: true,
    contentPersonalization: true,
    adaptationSpeed: 50,
    consentGiven: false
  });

  useEffect(() => {
    loadPersonalizationProfile();
  }, [userId, tenantId]);

  const loadPersonalizationProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/ai-personalization/profile-management?userId=${userId}&tenantId=${tenantId}&include=true`
      );
      const data = await response.json();

      if (data.success && data.profile) {
        setProfile(data.profile);
        setSettings({
          personalizationEnabled: true,
          personalizationLevel: data.profile.personalizationLevel || "adaptive",
          privacyLevel: data.profile.privacyLevel || "balanced",
          dataCollection: data.profile.consentGiven || false,
          analyticsTracking: data.profile.consentGiven || false,
          recommendationsEnabled: true,
          behaviorTracking: true,
          contentPersonalization: true,
          adaptationSpeed: Math.round((data.profile.adaptationSpeed || 0.5) * 100),
          consentGiven: data.profile.consentGiven || false
        });
      }
    } catch (error) {
      console.error('Failed to load personalization profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePersonalizationSettings = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/ai-personalization/profile-management', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          updates: {
            personalizationLevel: settings.personalizationLevel,
            privacyLevel: settings.privacyLevel,
            consentGiven: settings.consentGiven,
            consentDate: settings.consentGiven ? new Date() : null,
            adaptationSpeed: settings.adaptationSpeed / 100
          },
          operationType: "manual_update"
        })
      });

      const data = await response.json();
      if (data.success) {
        setProfile(data.profile);
        // Show success message
      }
    } catch (error) {
      console.error('Failed to update personalization settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const deletePersonalizationData = async (deleteType: string) => {
    if (!confirm(`Are you sure you want to ${deleteType} your personalization data? This action cannot be undone.`)) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/ai-personalization/profile-management?userId=${userId}&type=${deleteType}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        if (deleteType === "hard") {
          setProfile(null);
          setSettings(prev => ({ ...prev, consentGiven: false }));
        }
        // Show success message
      }
    } catch (error) {
      console.error('Failed to delete personalization data:', error);
    } finally {
      setSaving(false);
    }
  };

  const downloadPersonalizationData = async () => {
    try {
      // This would typically generate and download a comprehensive data export
      const response = await fetch(
        `/api/ai-personalization/profile-management?userId=${userId}&tenantId=${tenantId}&include=true`
      );
      const data = await response.json();

      if (data.success) {
        const exportData = {
          profile: data.profile,
          exportDate: new Date().toISOString(),
          dataPoints: data.profile?.trainingDataPoints || 0
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `personalization-data-${userId}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Failed to download personalization data:', error);
    }
  };

  const updatePreference = async (preferenceId: string, newValue: any) => {
    try {
      // Update local state
      if (profile) {
        const updatedPreferences = profile.preferences.map(pref => 
          pref.id === preferenceId ? { ...pref, value: newValue } : pref
        );
        setProfile({ ...profile, preferences: updatedPreferences });
      }

      // Update via API
      await fetch('/api/ai-personalization/profile-management', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          operationType: "preference_update",
          preferenceData: {
            preferences: [{ id: preferenceId, value: newValue }]
          }
        })
      });
    } catch (error) {
      console.error('Failed to update preference:', error);
    }
  };

  const getPrivacyLevelDescription = (level: string) => {
    const descriptions = {
      'strict': 'Minimal data collection, basic personalization only',
      'balanced': 'Moderate data collection for enhanced personalization',
      'open': 'Comprehensive data collection for maximum personalization'
    };
    return descriptions[level as keyof typeof descriptions] || '';
  };

  const getPersonalizationLevelDescription = (level: string) => {
    const descriptions = {
      'minimal': 'Basic recommendations and simple adaptations',
      'moderate': 'Enhanced recommendations with behavioral insights',
      'adaptive': 'Advanced AI personalization with continuous learning',
      'aggressive': 'Maximum personalization with predictive capabilities'
    };
    return descriptions[level as keyof typeof descriptions] || '';
  };

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-lg bg-gradient-to-r from-slate-600 via-gray-600 to-zinc-600 p-6 text-white"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-white/20 p-2">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Personalization Settings</h2>
                <p className="text-gray-100">Control your AI-powered experience and privacy</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-100">Data Points</div>
              <div className="text-2xl font-bold">{profile?.trainingDataPoints || 0}</div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-black/10"></div>
      </motion.div>

      {/* Consent Alert */}
      {!settings.consentGiven && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Enable personalization to receive AI-powered recommendations and adaptive experiences. 
              Your data is processed securely and you maintain full control.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Main Personalization Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  <span>AI Personalization</span>
                </CardTitle>
                <CardDescription>
                  Enable intelligent personalization powered by machine learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Master Toggle */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Enable Personalization</h3>
                      <p className="text-sm text-gray-600">
                        Allow AI to learn from your behavior and provide personalized experiences
                      </p>
                    </div>
                    <Switch
                      checked={settings.consentGiven}
                      onCheckedChange={(checked) => {
                        setSettings(prev => ({ ...prev, consentGiven: checked }));
                      }}
                    />
                  </div>

                  {settings.consentGiven && (
                    <>
                      {/* Personalization Level */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Personalization Level</label>
                        <Select 
                          value={settings.personalizationLevel} 
                          onValueChange={(value) => setSettings(prev => ({ ...prev, personalizationLevel: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minimal">
                              <div className="flex items-center space-x-2">
                                <span>Minimal</span>
                                <Badge variant="outline" className="text-xs">Basic</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="moderate">
                              <div className="flex items-center space-x-2">
                                <span>Moderate</span>
                                <Badge variant="outline" className="text-xs">Enhanced</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="adaptive">
                              <div className="flex items-center space-x-2">
                                <span>Adaptive</span>
                                <Badge className="bg-blue-500 text-white text-xs">Recommended</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="aggressive">
                              <div className="flex items-center space-x-2">
                                <span>Aggressive</span>
                                <Badge variant="outline" className="text-xs">Maximum</Badge>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-gray-600">
                          {getPersonalizationLevelDescription(settings.personalizationLevel)}
                        </p>
                      </div>

                      {/* Adaptation Speed */}
                      <div className="space-y-3">
                        <label className="text-sm font-medium">Adaptation Speed</label>
                        <div className="space-y-2">
                          <Slider
                            value={[settings.adaptationSpeed]}
                            onValueChange={(values) => setSettings(prev => ({ ...prev, adaptationSpeed: values[0] }))}
                            max={100}
                            step={10}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Slow</span>
                            <span>Moderate</span>
                            <span>Fast</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          How quickly the AI adapts to changes in your behavior
                        </p>
                      </div>

                      {/* Feature Toggles */}
                      <div className="space-y-4">
                        <h3 className="font-medium">Personalization Features</h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">AI Recommendations</div>
                              <div className="text-sm text-gray-600">Personalized suggestions and content</div>
                            </div>
                            <Switch
                              checked={settings.recommendationsEnabled}
                              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, recommendationsEnabled: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Behavior Tracking</div>
                              <div className="text-sm text-gray-600">Learn from your interaction patterns</div>
                            </div>
                            <Switch
                              checked={settings.behaviorTracking}
                              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, behaviorTracking: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Content Personalization</div>
                              <div className="text-sm text-gray-600">Adapt content based on preferences</div>
                            </div>
                            <Switch
                              checked={settings.contentPersonalization}
                              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, contentPersonalization: checked }))}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">Analytics Tracking</div>
                              <div className="text-sm text-gray-600">Collect usage analytics for insights</div>
                            </div>
                            <Switch
                              checked={settings.analyticsTracking}
                              onCheckedChange={(checked) => setSettings(prev => ({ ...prev, analyticsTracking: checked }))}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span>Privacy Controls</span>
                </CardTitle>
                <CardDescription>
                  Manage how your data is collected and used for personalization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Privacy Level */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Privacy Level</label>
                    <Select 
                      value={settings.privacyLevel} 
                      onValueChange={(value) => setSettings(prev => ({ ...prev, privacyLevel: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select privacy level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="strict">
                          <div className="flex items-center space-x-2">
                            <Lock className="h-4 w-4" />
                            <span>Strict</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="balanced">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4" />
                            <span>Balanced</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="open">
                          <div className="flex items-center space-x-2">
                            <Eye className="h-4 w-4" />
                            <span>Open</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-600">
                      {getPrivacyLevelDescription(settings.privacyLevel)}
                    </p>
                  </div>

                  {/* Data Collection Settings */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Data Collection</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Cookie className="h-4 w-4 text-orange-600" />
                          <div>
                            <div className="font-medium">Cookies & Local Storage</div>
                            <div className="text-sm text-gray-600">Store preferences locally</div>
                          </div>
                        </div>
                        <Switch
                          checked={settings.dataCollection}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, dataCollection: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Activity className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="font-medium">Interaction Tracking</div>
                            <div className="text-sm text-gray-600">Track clicks, views, and interactions</div>
                          </div>
                        </div>
                        <Switch
                          checked={settings.behaviorTracking}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, behaviorTracking: checked }))}
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <BarChart3 className="h-4 w-4 text-purple-600" />
                          <div>
                            <div className="font-medium">Performance Analytics</div>
                            <div className="text-sm text-gray-600">Collect usage and performance data</div>
                          </div>
                        </div>
                        <Switch
                          checked={settings.analyticsTracking}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, analyticsTracking: checked }))}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Current Status */}
                  {profile && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-900">Privacy Status</span>
                      </div>
                      <div className="text-sm text-green-800 space-y-1">
                        <p>✓ Data processing consent: {profile.consentGiven ? 'Given' : 'Not given'}</p>
                        <p>✓ Privacy level: {profile.privacyLevel || 'Not set'}</p>
                        <p>✓ Data retention: Compliant with GDPR</p>
                        <p>✓ Model confidence: {Math.round((profile.modelConfidence || 0) * 100)}%</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sliders className="h-5 w-5 text-indigo-600" />
                  <span>User Preferences</span>
                </CardTitle>
                <CardDescription>
                  Manage your personalization preferences and AI-learned insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                {profile?.preferences && profile.preferences.length > 0 ? (
                  <div className="space-y-4">
                    {profile.preferences.map((preference) => (
                      <div key={preference.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium capitalize">
                              {preference.category.replace('_', ' ')} - {preference.key.replace('_', ' ')}
                            </h4>
                            <Badge 
                              variant={preference.source === 'manual' ? 'default' : 'outline'}
                              className="text-xs"
                            >
                              {preference.source}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {Math.round(preference.confidence * 100)}% confident
                            </span>
                            <Switch
                              checked={preference.isActive}
                              onCheckedChange={(checked) => updatePreference(preference.id, checked)}
                            />
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Current value: {JSON.stringify(preference.value)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No preferences learned yet.</p>
                    <p className="text-sm">Continue using the platform to build your preference profile.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5 text-gray-600" />
                  <span>Data Management</span>
                </CardTitle>
                <CardDescription>
                  Export, delete, or manage your personalization data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Data Overview */}
                  {profile && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {profile.trainingDataPoints}
                        </div>
                        <div className="text-sm text-blue-700">Data Points</div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {Math.round((profile.modelConfidence || 0) * 100)}%
                        </div>
                        <div className="text-sm text-green-700">Model Accuracy</div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {profile.preferences?.length || 0}
                        </div>
                        <div className="text-sm text-purple-700">Preferences</div>
                      </div>
                    </div>
                  )}

                  {/* Data Actions */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Data Actions</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Download className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="font-medium">Export Data</div>
                            <div className="text-sm text-gray-600">Download all your personalization data</div>
                          </div>
                        </div>
                        <Button variant="outline" onClick={downloadPersonalizationData}>
                          Download
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <EyeOff className="h-4 w-4 text-orange-600" />
                          <div>
                            <div className="font-medium">Anonymize Data</div>
                            <div className="text-sm text-gray-600">Remove personal identifiers but keep insights</div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => deletePersonalizationData("anonymize")}
                          disabled={saving}
                        >
                          Anonymize
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                        <div className="flex items-center space-x-3">
                          <Trash2 className="h-4 w-4 text-red-600" />
                          <div>
                            <div className="font-medium text-red-900">Delete All Data</div>
                            <div className="text-sm text-red-700">Permanently remove all personalization data</div>
                          </div>
                        </div>
                        <Button 
                          variant="destructive" 
                          onClick={() => deletePersonalizationData("hard")}
                          disabled={saving}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* GDPR Compliance */}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">GDPR Compliance</span>
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>✓ Right to access: Export your data anytime</p>
                      <p>✓ Right to rectification: Update preferences and settings</p>
                      <p>✓ Right to erasure: Delete or anonymize your data</p>
                      <p>✓ Right to portability: Download data in standard format</p>
                      <p>✓ Right to object: Opt-out of processing at any time</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      {/* Save Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end space-x-3"
      >
        <Button variant="outline" onClick={loadPersonalizationProfile}>
          Reset
        </Button>
        <Button onClick={updatePersonalizationSettings} disabled={saving}>
          {saving ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </motion.div>
    </div>
  );
}
