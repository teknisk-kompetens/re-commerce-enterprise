
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
  Monitor,
  Clock,
  Users,
  Star,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  BarChart3,
  Brain,
  Layers,
  Zap,
  Eye,
  MousePointer,
  Presentation
} from 'lucide-react';
import type { 
  DemoProfile, 
  DemoSlide, 
  EnterpriseSystemComponent,
  UserPersonalizationProfile,
  DemoInteraction 
} from '@/lib/types';

interface PresentationModeProps {
  profile: DemoProfile;
  currentSlide: number;
  isPlaying: boolean;
  userPersonalization?: UserPersonalizationProfile;
  onSlideChange: (slide: number) => void;
  onStop: () => void;
  enterpriseComponents: EnterpriseSystemComponent[];
}

export function PresentationMode({
  profile,
  currentSlide,
  isPlaying: externalIsPlaying,
  userPersonalization,
  onSlideChange,
  onStop,
  enterpriseComponents
}: PresentationModeProps) {
  const [internalIsPlaying, setInternalIsPlaying] = useState(externalIsPlaying);
  const [autoAdvance, setAutoAdvance] = useState(profile.autoPlay);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [interactions, setInteractions] = useState<DemoInteraction[]>([]);
  const [personalizedContent, setPersonalizedContent] = useState<Record<string, any>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [executionId] = useState(`exec-${Date.now()}`);

  const slides = profile.slides || [];
  const currentSlideData = slides[currentSlide];
  const totalSlides = slides.length;
  const slideDuration = currentSlideData?.duration || 5;

  // Auto-hide controls
  useEffect(() => {
    if (internalIsPlaying) {
      const timer = setTimeout(() => setShowControls(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [internalIsPlaying, showControls]);

  // Progress tracking
  useEffect(() => {
    if (internalIsPlaying && autoAdvance) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (slideDuration * 10));
          
          if (newProgress >= 100) {
            if (currentSlide < totalSlides - 1) {
              onSlideChange(currentSlide + 1);
              return 0;
            } else {
              setInternalIsPlaying(false);
              return 100;
            }
          }
          
          return newProgress;
        });
        
        setTimeRemaining(prev => Math.max(0, prev - 0.1));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [internalIsPlaying, autoAdvance, slideDuration, currentSlide, totalSlides, onSlideChange]);

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0);
    setTimeRemaining(slideDuration);
  }, [currentSlide, slideDuration]);

  // Load personalized content
  useEffect(() => {
    if (userPersonalization && currentSlideData) {
      loadPersonalizedContent();
    }
  }, [currentSlide, userPersonalization]);

  // Track demo execution
  useEffect(() => {
    if (currentSlide === 0) {
      trackDemoStart();
    }
  }, []);

  const loadPersonalizedContent = async () => {
    try {
      const response = await fetch('/api/demo-builder/personalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: userPersonalization,
          demoProfile: profile,
          currentSlide: currentSlideData?.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPersonalizedContent(data.personalizedContent || {});
      }
    } catch (error) {
      console.error('Error loading personalized content:', error);
    }
  };

  const trackDemoStart = async () => {
    try {
      await fetch('/api/demo-builder/executions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          executionId,
          profileId: profile.id,
          sessionId: userPersonalization?.sessionId || `session-${Date.now()}`,
          userPersonalization,
          totalSteps: totalSlides
        })
      });
    } catch (error) {
      console.error('Error tracking demo start:', error);
    }
  };

  const trackInteraction = async (interaction: Partial<DemoInteraction>) => {
    try {
      await fetch('/api/demo-builder/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          executionId,
          slideId: currentSlideData?.id,
          ...interaction
        })
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const handlePlay = () => {
    setInternalIsPlaying(true);
    setShowControls(true);
  };

  const handlePause = () => {
    setInternalIsPlaying(false);
    setShowControls(true);
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      onSlideChange(currentSlide - 1);
      setInternalIsPlaying(false);
      setShowControls(true);
    }
  };

  const handleNext = () => {
    if (currentSlide < totalSlides - 1) {
      onSlideChange(currentSlide + 1);
      setInternalIsPlaying(false);
      setShowControls(true);
    } else {
      // Demo completed
      handleStop();
    }
  };

  const handleStop = () => {
    // Track demo completion
    trackDemoCompletion();
    onStop();
  };

  const trackDemoCompletion = async () => {
    try {
      await fetch(`/api/demo-builder/executions/${executionId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completion: ((currentSlide + 1) / totalSlides) * 100,
          interactions
        })
      });
    } catch (error) {
      console.error('Error tracking demo completion:', error);
    }
  };

  const handleComponentInteraction = async (component: EnterpriseSystemComponent, interactionType: string) => {
    const interactionEvent = {
      componentId: component.id,
      type: 'button' as const,
      timestamp: new Date(),
      data: { componentName: component.name, slideId: currentSlideData?.id }
    };

    // Create a proper DemoInteraction object
    const demoInteraction: DemoInteraction = {
      id: `interaction-${Date.now()}`,
      name: `${component.name}-${interactionType}`,
      type: 'api_call' as const,
      method: 'GET' as const,
      endpoint: component.href || '',
      payload: {},
      responseTemplate: {},
      triggerConditions: {},
      responseVariations: [],
      personalize: true
    };

    setInteractions(prev => [...prev, demoInteraction]);
    await trackInteraction(interactionEvent);

    // Simulate component interaction with AI response
    if (userPersonalization) {
      try {
        const response = await fetch('/api/demo-builder/ai-interact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            component,
            userPersonalization,
            interactionType,
            context: personalizedContent
          })
        });

        if (response.ok) {
          const data = await response.json();
          // Show AI response (could be a toast, modal, or inline content)
          console.log('AI Response:', data.response);
        }
      } catch (error) {
        console.error('Error getting AI response:', error);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  if (!currentSlideData) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center text-white">
        <div className="text-center">
          <Presentation className="h-16 w-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Demo Completed</h2>
          <p className="text-gray-300 mb-6">Thank you for viewing our presentation</p>
          <Button onClick={handleStop} variant="outline" className="text-black">
            Exit Presentation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black text-white z-50 overflow-hidden"
      onMouseMove={() => setShowControls(true)}
      onClick={() => setShowControls(true)}
    >
      {/* Main Slide Content */}
      <div className="h-full flex flex-col">
        {/* Slide Header */}
        <div className="relative z-10 p-8 bg-gradient-to-b from-black/80 to-transparent">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            key={currentSlide}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">
                  {personalizedContent.title || currentSlideData.title}
                </h1>
                {currentSlideData.description && (
                  <p className="text-xl text-gray-300">
                    {personalizedContent.description || currentSlideData.description}
                  </p>
                )}
              </div>
              
              {/* Slide Counter */}
              <div className="text-right">
                <div className="text-sm text-gray-400">
                  Slide {currentSlide + 1} of {totalSlides}
                </div>
                {userPersonalization && (
                  <Badge variant="outline" className="mt-1">
                    {userPersonalization.industry} • {userPersonalization.role}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Slide Content */}
        <div className="flex-1 px-8 pb-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="h-full"
            >
              {/* Main Content */}
              <div className="mb-8">
                <div className="prose prose-xl prose-invert max-w-none">
                  <p className="text-2xl leading-relaxed">
                    {personalizedContent.content || currentSlideData.content}
                  </p>
                </div>
              </div>

              {/* Enterprise Components Showcase */}
              {currentSlideData.components && currentSlideData.components.length > 0 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold flex items-center gap-3">
                    <Layers className="h-8 w-8" />
                    Featured Capabilities
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentSlideData.components.map((componentName, index) => {
                      const component = enterpriseComponents.find(c => c.id === (componentName as any).id || c.name === (componentName as any).name || c.name === componentName);
                      if (!component) return null;

                      return (
                        <motion.div
                          key={component.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2 }}
                        >
                          <Card 
                            className="bg-gray-900/50 border-gray-700 hover:border-purple-500 transition-all duration-300 cursor-pointer group"
                            onClick={() => handleComponentInteraction(component, 'view')}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-lg ${component.color} text-white group-hover:scale-110 transition-transform`}>
                                  <Layers className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-xl font-semibold text-white mb-2">
                                    {component.title}
                                  </h3>
                                  <p className="text-gray-300 mb-4 line-clamp-3">
                                    {personalizedContent[`component_${component.name}_description`] || component.description}
                                  </p>
                                  
                                  {/* Component Metrics */}
                                  {component.demoContent && (
                                    <div className="space-y-2">
                                      {Object.entries(component.demoContent).slice(0, 2).map(([key, value]: [string, any]) => (
                                        <div key={key} className="flex justify-between text-sm">
                                          <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                          <span className="text-white">
                                            {typeof value === 'object' ? JSON.stringify(value).slice(0, 20) + '...' : String(value)}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Interactive Elements */}
                                  <div className="mt-4 flex gap-2">
                                    <Button
                                      size="sm"
                                      className="bg-purple-600 hover:bg-purple-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleComponentInteraction(component, 'interact');
                                      }}
                                    >
                                      <MousePointer className="h-4 w-4 mr-2" />
                                      Try It
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleComponentInteraction(component, 'learn_more');
                                      }}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      Learn More
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Personalized Insights */}
              {personalizedContent.insights && (
                <div className="mt-8 p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg border border-purple-500/30">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Brain className="h-6 w-6 text-purple-400" />
                    AI Insights for {userPersonalization?.company || 'Your Organization'}
                  </h3>
                  <div className="space-y-2">
                    {personalizedContent.insights.map((insight: string, index: number) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-gray-300"
                      >
                        • {insight}
                      </motion.p>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        {autoAdvance && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
            <motion.div
              className="h-full bg-purple-500"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}
      </div>

      {/* Control Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Top Controls */}
            <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-auto">
              <div className="flex items-center gap-4 bg-black/70 backdrop-blur-sm rounded-lg p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleStop}
                  className="text-white hover:text-red-400"
                >
                  <X className="h-5 w-5" />
                </Button>
                <div className="text-sm text-gray-300">
                  {profile.name}
                </div>
              </div>

              <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-lg p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAutoAdvance(!autoAdvance)}
                  className={`text-white ${autoAdvance ? 'text-green-400' : 'text-gray-400'}`}
                >
                  {autoAdvance ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
                {autoAdvance && (
                  <div className="text-sm text-gray-300 ml-2">
                    {Math.ceil(timeRemaining)}s
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-auto">
              <div className="flex items-center gap-4 bg-black/70 backdrop-blur-sm rounded-lg p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentSlide === 0}
                  className="text-white disabled:text-gray-600"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={internalIsPlaying ? handlePause : handlePlay}
                  className="text-white"
                >
                  {internalIsPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  className="text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>

                <div className="text-sm text-gray-300 ml-4">
                  {currentSlide + 1} / {totalSlides}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide Thumbnails (bottom) */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
        <div className="flex justify-center">
          <div className="flex gap-2 bg-black/70 backdrop-blur-sm rounded-lg p-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => onSlideChange(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-purple-500'
                    : index < currentSlide
                    ? 'bg-green-500'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
