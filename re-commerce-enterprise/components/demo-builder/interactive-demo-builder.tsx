
'use client';

import { useState, useEffect, useReducer } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Settings, 
  Palette, 
  Brain,
  Wand2,
  Monitor,
  Users,
  BarChart3,
  Layers,
  ChevronRight,
  Plus,
  Edit,
  Eye,
  Trash2,
  Copy,
  Download,
  Share,
  Sparkles
} from 'lucide-react';

import { DemoProfileManager } from './demo-profile-manager';
import { WorkflowBuilder } from './workflow-builder';
import { SlideshowPanel } from './slideshow-panel';
import { PresentationMode } from './presentation-mode';
import { AIPersonalizationEngine } from './ai-personalization-engine';
import { ComponentLibrary } from './component-library';
import { ErrorBoundary } from '@/components/error-boundary';
import { PageLoading } from '@/components/loading-states';
import type { 
  DemoBuilderState, 
  DemoBuilderAction, 
  DemoProfile,
  EnterpriseSystemComponent,
  UserPersonalizationProfile 
} from '@/lib/types';

// Demo Builder State Management
const initialState: DemoBuilderState = {
  currentProfile: undefined,
  isEditing: false,
  draggedComponent: undefined,
  selectedWorkflowStep: undefined,
  previewMode: false,
  presentationMode: false,
  isPlaying: false,
  currentSlide: 0,
  userPersonalization: undefined
};

function demoBuilderReducer(state: DemoBuilderState, action: DemoBuilderAction): DemoBuilderState {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, currentProfile: action.payload, isEditing: false };
    case 'UPDATE_SLIDE':
      return { ...state, currentSlide: action.payload };
    case 'START_PREVIEW':
      return { ...state, previewMode: true, presentationMode: false };
    case 'STOP_PREVIEW':
      return { ...state, previewMode: false };
    case 'START_PRESENTATION':
      return { ...state, presentationMode: true, previewMode: false, currentSlide: 0 };
    case 'STOP_PRESENTATION':
      return { ...state, presentationMode: false, isPlaying: false };
    case 'NEXT_SLIDE':
      return { 
        ...state, 
        currentSlide: Math.min(
          action.payload || state.currentSlide + 1, 
          (state.currentProfile?.slides?.length || 1) - 1
        ) 
      };
    case 'PREVIOUS_SLIDE':
      return { 
        ...state, 
        currentSlide: Math.max(action.payload || state.currentSlide - 1, 0) 
      };
    case 'SET_PERSONALIZATION':
      return { ...state, userPersonalization: action.payload };
    default:
      return state;
  }
}

export function InteractiveDemoBuilder() {
  const [state, dispatch] = useReducer(demoBuilderReducer, initialState);
  const [demoProfiles, setDemoProfiles] = useState<DemoProfile[]>([]);
  const [enterpriseComponents, setEnterpriseComponents] = useState<EnterpriseSystemComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profiles');

  // Load initial data
  useEffect(() => {
    loadDemoBuilderData();
  }, []);

  const loadDemoBuilderData = async () => {
    try {
      setLoading(true);
      
      // Load demo profiles
      const profilesResponse = await fetch('/api/demo-builder/profiles');
      const profiles = await profilesResponse.json();
      setDemoProfiles(profiles);

      // Load enterprise components
      const componentsResponse = await fetch('/api/demo-builder/components');
      const components = await componentsResponse.json();
      setEnterpriseComponents(components);

      // Set default profile if none selected
      if (profiles.length > 0 && !state.currentProfile) {
        dispatch({ type: 'SET_PROFILE', payload: profiles[0] });
      }

    } catch (error) {
      console.error('Error loading demo builder data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSelect = (profile: DemoProfile) => {
    dispatch({ type: 'SET_PROFILE', payload: profile });
  };

  const handleStartPresentation = () => {
    dispatch({ type: 'START_PRESENTATION' });
  };

  const handleStopPresentation = () => {
    dispatch({ type: 'STOP_PRESENTATION' });
  };

  const handlePersonalizationUpdate = (personalization: UserPersonalizationProfile) => {
    dispatch({ type: 'SET_PERSONALIZATION', payload: personalization });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <PageLoading message="Loading Interactive Demo Builder..." />
      </div>
    );
  }

  // Presentation Mode Full Screen
  if (state.presentationMode) {
    return (
      <ErrorBoundary>
        <PresentationMode
          profile={state.currentProfile!}
          currentSlide={state.currentSlide}
          isPlaying={state.isPlaying}
          userPersonalization={state.userPersonalization}
          onSlideChange={(slide) => dispatch({ type: 'UPDATE_SLIDE', payload: slide })}
          onStop={handleStopPresentation}
          enterpriseComponents={enterpriseComponents}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white">
                <Wand2 className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Interactive Demo Builder
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Create personalized, AI-powered enterprise demonstrations
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {state.currentProfile && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => dispatch({ type: 'START_PREVIEW' })}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    onClick={handleStartPresentation}
                    className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    <Play className="h-4 w-4" />
                    PLAY Demo
                  </Button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Current Profile Status */}
        {state.currentProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-l-4 border-l-purple-500 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <Monitor className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {state.currentProfile.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {state.currentProfile.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {state.currentProfile.industry}
                    </Badge>
                    <Badge variant="outline">
                      {state.currentProfile.targetRole}
                    </Badge>
                    <Badge variant="outline">
                      {state.currentProfile.duration}min
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Panel - Builder Tools */}
          <div className="xl:col-span-1">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Layers className="h-5 w-5" />
                  Builder Tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="profiles" className="text-xs">
                      Profiles
                    </TabsTrigger>
                    <TabsTrigger value="components" className="text-xs">
                      Components
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="profiles" className="mt-4 space-y-3">
                    <DemoProfileManager
                      profiles={demoProfiles}
                      currentProfile={state.currentProfile}
                      onProfileSelect={handleProfileSelect}
                      onProfileUpdate={loadDemoBuilderData}
                    />
                  </TabsContent>
                  
                  <TabsContent value="components" className="mt-4">
                    <ComponentLibrary
                      components={enterpriseComponents}
                      onComponentDrag={(component) => 
                        dispatch({ type: 'SET_PROFILE', payload: { ...state, draggedComponent: component } })
                      }
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Main Workspace */}
          <div className="xl:col-span-2">
            <div className="space-y-6">
              {/* Slideshow Panel */}
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="h-5 w-5" />
                      Demo Slideshow
                      <Badge variant="secondary" className="ml-2">
                        {state.currentProfile?.slides?.length || 0} slides
                      </Badge>
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      Manage
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <SlideshowPanel
                    profile={state.currentProfile}
                    currentSlide={state.currentSlide}
                    isPreview={state.previewMode}
                    onSlideChange={(slide) => dispatch({ type: 'UPDATE_SLIDE', payload: slide })}
                    onSlideUpdate={loadDemoBuilderData}
                    enterpriseComponents={enterpriseComponents}
                  />
                </CardContent>
              </Card>

              {/* Workflow Builder */}
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Workflow Builder
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WorkflowBuilder
                    profile={state.currentProfile}
                    enterpriseComponents={enterpriseComponents}
                    onWorkflowUpdate={loadDemoBuilderData}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Panel - AI & Analytics */}
          <div className="xl:col-span-1">
            <div className="space-y-6">
              {/* AI Personalization Engine */}
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                    <Brain className="h-5 w-5" />
                    AI Personalization
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <AIPersonalizationEngine
                    profile={state.currentProfile}
                    userPersonalization={state.userPersonalization}
                    onPersonalizationUpdate={handlePersonalizationUpdate}
                  />
                </CardContent>
              </Card>

              {/* Demo Analytics */}
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Demo Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {state.currentProfile?.popularity || 0}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Popularity
                        </div>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {state.currentProfile?.duration || 0}m
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Duration
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Recent Executions
                      </h4>
                      <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No executions yet
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    <Button variant="outline" size="sm" className="justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      New Profile
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Share className="h-4 w-4 mr-2" />
                      Share Demo
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
