
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain,
  Sparkles,
  User,
  Building,
  Target,
  AlertCircle,
  CheckCircle,
  Loader2,
  Wand2,
  TrendingUp,
  Eye,
  Settings,
  Zap,
  Users,
  BarChart3,
  Globe
} from 'lucide-react';
import type { 
  DemoProfile, 
  UserPersonalizationProfile,
  AIPersonalizationRequest,
  AIPersonalizationResponse 
} from '@/lib/types';

interface AIPersonalizationEngineProps {
  profile?: DemoProfile;
  userPersonalization?: UserPersonalizationProfile;
  onPersonalizationUpdate: (personalization: UserPersonalizationProfile) => void;
}

export function AIPersonalizationEngine({ 
  profile, 
  userPersonalization, 
  onPersonalizationUpdate 
}: AIPersonalizationEngineProps) {
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [personalizationResults, setPersonalizationResults] = useState<AIPersonalizationResponse | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    if (userPersonalization && profile) {
      generateAIInsights();
    }
  }, [userPersonalization, profile]);

  const generateAIInsights = async () => {
    if (!userPersonalization || !profile) return;

    try {
      setIsPersonalizing(true);
      
      const response = await fetch('/api/demo-builder/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: userPersonalization,
          demoProfile: profile,
          context: {
            currentStep: 'analysis',
            focusArea: 'personalization'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiInsights(data.insights || []);
        setConfidence(data.confidence || 0);
        setPersonalizationResults(data);
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
    } finally {
      setIsPersonalizing(false);
    }
  };

  const handlePersonalizeDemo = async () => {
    if (!userPersonalization || !profile) return;

    try {
      setIsPersonalizing(true);

      const request: AIPersonalizationRequest = {
        userProfile: userPersonalization,
        demoProfile: profile,
        context: {
          goal: 'personalize_demo_content',
          adaptationLevel: 'comprehensive'
        }
      };

      const response = await fetch('/api/demo-builder/personalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (response.ok) {
        const results = await response.json();
        setPersonalizationResults(results);
        
        // Update the demo profile with personalized content
        const updatedProfile = {
          ...profile,
          personalization: {
            ...profile.personalization,
            ...results.personalizedContent
          }
        };

        // Update user personalization confidence
        const updatedPersonalization = {
          ...userPersonalization,
          confidence: results.confidence,
          aiProfile: {
            ...userPersonalization.aiProfile,
            lastPersonalization: new Date().toISOString(),
            adaptations: results.adaptations
          }
        };

        onPersonalizationUpdate(updatedPersonalization);
      }
    } catch (error) {
      console.error('Error personalizing demo:', error);
    } finally {
      setIsPersonalizing(false);
    }
  };

  const createPersonalizationProfile = async (profileData: Partial<UserPersonalizationProfile>) => {
    try {
      const response = await fetch('/api/demo-builder/personalization-profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileData,
          sessionId: `session-${Date.now()}`,
          confidence: 0.7
        })
      });

      if (response.ok) {
        const newProfile = await response.json();
        onPersonalizationUpdate(newProfile);
        setIsEditingProfile(false);
      }
    } catch (error) {
      console.error('Error creating personalization profile:', error);
    }
  };

  if (!profile) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Select a demo profile to enable AI personalization</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Personalization Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <span className="font-medium text-gray-900 dark:text-white">AI Personalization</span>
          {confidence > 0 && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {Math.round(confidence * 100)}% confident
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* User Profile Section */}
      <Card className="border-purple-200 dark:border-purple-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
              <User className="h-4 w-4" />
              User Profile
            </h3>
            <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  {userPersonalization ? 'Edit' : 'Create'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {userPersonalization ? 'Edit' : 'Create'} Personalization Profile
                  </DialogTitle>
                </DialogHeader>
                <PersonalizationProfileForm
                  profile={userPersonalization}
                  onSubmit={createPersonalizationProfile}
                />
              </DialogContent>
            </Dialog>
          </div>

          {userPersonalization ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Industry</div>
                  <div className="font-medium flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {userPersonalization.industry || 'Not specified'}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Role</div>
                  <div className="font-medium flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {userPersonalization.role || 'Not specified'}
                  </div>
                </div>
              </div>

              {userPersonalization.company && (
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Company</div>
                  <div className="font-medium">{userPersonalization.company}</div>
                </div>
              )}

              {userPersonalization.painPoints?.length > 0 && (
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Pain Points</div>
                  <div className="flex flex-wrap gap-1">
                    {userPersonalization.painPoints.slice(0, 3).map((point, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {point}
                      </Badge>
                    ))}
                    {userPersonalization.painPoints.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{userPersonalization.painPoints.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No user profile configured</p>
              <p className="text-xs">Create a profile for personalized experiences</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-500" />
              AI Insights
            </h3>
            <div className="space-y-2">
              {aiInsights.slice(0, 3).map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-sm text-gray-600 dark:text-gray-300 p-2 bg-blue-50 dark:bg-blue-900/20 rounded"
                >
                  • {insight}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Personalization Actions */}
      <div className="space-y-3">
        <Button
          onClick={handlePersonalizeDemo}
          disabled={!userPersonalization || isPersonalizing}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          {isPersonalizing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4 mr-2" />
          )}
          {isPersonalizing ? 'Personalizing...' : 'Personalize Demo'}
        </Button>

        <Button
          variant="outline"
          onClick={generateAIInsights}
          disabled={!userPersonalization || isPersonalizing}
          className="w-full"
        >
          {isPersonalizing ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Brain className="h-4 w-4 mr-2" />
          )}
          Generate Insights
        </Button>
      </div>

      {/* Personalization Results */}
      {personalizationResults && (
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Personalization Applied
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Confidence</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {Math.round(personalizationResults.confidence * 100)}%
                </Badge>
              </div>

              {personalizationResults.suggestions?.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">Suggestions</div>
                  <div className="space-y-1">
                    {personalizationResults.suggestions.slice(0, 2).map((suggestion, index) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-300 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 dark:text-gray-400">
                Reasoning: {personalizationResults.reasoning}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Settings */}
      <AnimatePresence>
        {showAdvancedSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Advanced Settings
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <Label className="text-xs">Personalization Level</Label>
                    <Select defaultValue="moderate">
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">Focus Areas</Label>
                    <div className="grid grid-cols-2 gap-1 mt-1">
                      {['Content', 'Flow', 'Timing', 'Examples'].map(area => (
                        <label key={area} className="flex items-center space-x-1 text-xs">
                          <input type="checkbox" defaultChecked className="rounded" />
                          <span>{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="realtime" defaultChecked className="rounded" />
                    <Label htmlFor="realtime" className="text-xs">Real-time adaptation</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {profile.painPoints?.length || 0}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Pain Points</div>
        </div>
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {aiInsights.length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">AI Insights</div>
        </div>
        <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {Math.round(confidence * 100)}%
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Confidence</div>
        </div>
      </div>
    </div>
  );
}

function PersonalizationProfileForm({ 
  profile, 
  onSubmit 
}: { 
  profile?: UserPersonalizationProfile; 
  onSubmit: (data: Partial<UserPersonalizationProfile>) => void;
}) {
  const [formData, setFormData] = useState({
    industry: profile?.industry || '',
    role: profile?.role || '',
    company: profile?.company || '',
    companySize: profile?.companySize || 'sme',
    experience: profile?.experience || 'intermediate',
    painPoints: profile?.painPoints || [],
    focusAreas: profile?.focusAreas || [],
    learningStyle: profile?.learningStyle || 'visual'
  });

  const industries = [
    'banking', 'healthcare', 'retail', 'manufacturing', 'technology', 
    'insurance', 'real-estate', 'education', 'government', 'energy'
  ];

  const roles = [
    'executive', 'manager', 'analyst', 'developer', 'architect', 
    'consultant', 'director', 'specialist', 'administrator'
  ];

  const painPoints = [
    'Digital transformation', 'Operational efficiency', 'Regulatory compliance',
    'Customer experience', 'Data security', 'System integration',
    'Cost optimization', 'Scalability', 'Team productivity', 'Innovation speed'
  ];

  const focusAreas = [
    'AI and automation', 'Security and compliance', 'Analytics and insights',
    'System integration', 'Performance optimization', 'User experience',
    'Process automation', 'Real-time monitoring', 'Mobile capabilities', 'Cloud migration'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleArrayItem = (array: string[], item: string, setter: (value: string[]) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item));
    } else {
      setter([...array, item]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
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

        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          placeholder="e.g., Deutsche Bank"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="companySize">Company Size</Label>
          <Select value={formData.companySize} onValueChange={(value: any) => setFormData({ ...formData, companySize: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startup">Startup</SelectItem>
              <SelectItem value="sme">SME</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="experience">Experience Level</Label>
          <Select value={formData.experience} onValueChange={(value: any) => setFormData({ ...formData, experience: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Pain Points</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {painPoints.map(point => (
            <label key={point} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={formData.painPoints.includes(point)}
                onChange={() => toggleArrayItem(
                  formData.painPoints, 
                  point, 
                  (newPoints) => setFormData({ ...formData, painPoints: newPoints })
                )}
                className="rounded"
              />
              <span>{point}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label>Focus Areas</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {focusAreas.map(area => (
            <label key={area} className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={formData.focusAreas.includes(area)}
                onChange={() => toggleArrayItem(
                  formData.focusAreas, 
                  area, 
                  (newAreas) => setFormData({ ...formData, focusAreas: newAreas })
                )}
                className="rounded"
              />
              <span>{area}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="learningStyle">Learning Style</Label>
        <Select value={formData.learningStyle} onValueChange={(value: any) => setFormData({ ...formData, learningStyle: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="visual">Visual</SelectItem>
            <SelectItem value="hands-on">Hands-on</SelectItem>
            <SelectItem value="analytical">Analytical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-purple-500 to-blue-500">
          {profile ? 'Update' : 'Create'} Profile
        </Button>
      </div>
    </form>
  );
}
