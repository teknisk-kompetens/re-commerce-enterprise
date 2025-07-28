
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Share2, 
  Download, 
  Eye, 
  BarChart3, 
  Users, 
  Shield, 
  Zap, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  Star,
  Building2,
  DollarSign,
  Clock,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-enhanced';
import { Button } from '@/components/ui/button-enhanced';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SlideData {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  type: 'hero' | 'problem' | 'solution' | 'demo' | 'features' | 'case-study' | 'pricing' | 'cta';
  duration?: number;
}

export function InteractiveSalesDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [viewerEngagement, setViewerEngagement] = useState({
    timeOnSlide: 0,
    totalTime: 0,
    interactions: 0
  });

  const slides: SlideData[] = [
    {
      id: 'hero',
      type: 'hero',
      title: 'Transform Your Enterprise',
      subtitle: 'The Complete Re-Commerce Platform for Modern Businesses',
      content: (
        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-6">
              Enterprise Re-Commerce Platform
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Unify your commerce operations with AI-powered insights, advanced analytics, 
              and enterprise-grade security. Join 500+ companies already transforming their business.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <Card variant="elevated" className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold mb-2">Revenue Growth</h3>
                <p className="text-2xl font-bold text-primary-600">+127%</p>
                <p className="text-sm text-neutral-600">Average increase</p>
              </CardContent>
            </Card>
            <Card variant="elevated" className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-success-600" />
                </div>
                <h3 className="font-semibold mb-2">Time to Value</h3>
                <p className="text-2xl font-bold text-success-600">2 weeks</p>
                <p className="text-sm text-neutral-600">Implementation</p>
              </CardContent>
            </Card>
            <Card variant="elevated" className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-warning-600" />
                </div>
                <h3 className="font-semibold mb-2">Customer Rating</h3>
                <p className="text-2xl font-bold text-warning-600">4.9/5</p>
                <p className="text-sm text-neutral-600">Enterprise reviews</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )
    },
    {
      id: 'problem',
      type: 'problem',
      title: 'The Enterprise Challenge',
      subtitle: 'Modern businesses face complex operational hurdles',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                Key Business Challenges
              </h3>
              <div className="space-y-4">
                {[
                  { title: 'Fragmented Data Sources', impact: '40% productivity loss', icon: BarChart3 },
                  { title: 'Manual Processes', impact: '$2.1M annual cost', icon: Users },
                  { title: 'Security Vulnerabilities', impact: '73% compliance risk', icon: Shield },
                  { title: 'Limited Scalability', impact: '3x slower growth', icon: TrendingUp }
                ].map((challenge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start space-x-4 p-4 bg-error-50 dark:bg-error-900/20 rounded-lg border border-error-200 dark:border-error-800"
                  >
                    <challenge.icon className="h-5 w-5 text-error-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {challenge.title}
                      </p>
                      <p className="text-sm text-error-600 dark:text-error-400">
                        {challenge.impact}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <Card variant="elevated" className="p-8">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-error-100 rounded-full flex items-center justify-center mx-auto">
                  <Target className="h-10 w-10 text-error-600" />
                </div>
                <h4 className="text-xl font-bold">The Cost of Inaction</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-error-600">-23%</p>
                    <p className="text-sm text-neutral-600">Revenue Impact</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-error-600">+156%</p>
                    <p className="text-sm text-neutral-600">Operational Costs</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )
    },
    {
      id: 'solution',
      type: 'solution',
      title: 'The Re-Commerce Solution',
      subtitle: 'Unified platform for enterprise success',
      content: (
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h3 className="text-2xl font-bold mb-4">Complete Enterprise Platform</h3>
            <p className="text-lg text-neutral-600 dark:text-neutral-300">
              Our integrated solution addresses every aspect of your enterprise operations, 
              from data analytics to security compliance.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'AI-Powered Analytics',
                description: 'Real-time insights and predictive modeling',
                icon: BarChart3,
                color: 'primary'
              },
              {
                title: 'Advanced Security',
                description: 'Enterprise-grade protection and compliance',
                icon: Shield,
                color: 'success'
              },
              {
                title: 'Scalable Architecture',
                description: 'Handle growth from startup to enterprise',
                icon: Zap,
                color: 'warning'
              },
              {
                title: 'Global Operations',
                description: 'Multi-region deployment and support',
                icon: Building2,
                color: 'error'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card variant="elevated" className="h-full text-center hover:shadow-lg transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                      <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                    </div>
                    <h4 className="font-semibold mb-2">{feature.title}</h4>
                    <p className="text-sm text-neutral-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <h4 className="text-xl font-bold mb-4">Ready to See It in Action?</h4>
                <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                  Experience our platform with a personalized demo tailored to your industry and use case.
                </p>
                <Button size="lg" className="w-full md:w-auto">
                  Schedule Live Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-white dark:bg-neutral-800 rounded-full px-4 py-2 shadow-sm">
                  <Star className="h-4 w-4 text-warning-500 fill-current" />
                  <span className="font-medium">4.9/5 Customer Rating</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            handleNextSlide();
            return 0;
          }
          return prev + 1;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSlide]);

  const handleNextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
    setProgress(0);
    setViewerEngagement(prev => ({ ...prev, interactions: prev.interactions + 1 }));
  };

  const handlePrevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
    setViewerEngagement(prev => ({ ...prev, interactions: prev.interactions + 1 }));
  };

  const handleSlideSelect = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
    setViewerEngagement(prev => ({ ...prev, interactions: prev.interactions + 1 }));
  };

  return (
    <div className={`min-h-screen ${fullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-neutral-900' : ''}`}>
      {/* Header Controls */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Interactive Sales Deck</h1>
            <Badge variant="secondary">
              {currentSlide + 1} / {slides.length}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center space-x-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </Button>
            
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFullscreen(!fullscreen)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <Progress value={progress} className="h-1" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Slide Thumbnails */}
        <div className="w-64 bg-neutral-50 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 p-4 space-y-2">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => handleSlideSelect(index)}
              className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-300'
                  : 'bg-white dark:bg-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-600 border border-neutral-200 dark:border-neutral-600'
              }`}
            >
              <div className="text-sm font-medium">{slide.title}</div>
              {slide.subtitle && (
                <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  {slide.subtitle}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Main Slide Area */}
        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col"
            >
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">{slides[currentSlide].title}</h2>
                {slides[currentSlide].subtitle && (
                  <p className="text-lg text-neutral-600 dark:text-neutral-300">
                    {slides[currentSlide].subtitle}
                  </p>
                )}
              </div>
              
              <div className="flex-1">
                {slides[currentSlide].content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevSlide}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-neutral-600">
              <Eye className="h-4 w-4" />
              <span>Engagement: {viewerEngagement.interactions} interactions</span>
            </div>
          </div>
          
          <Button
            onClick={handleNextSlide}
            disabled={currentSlide === slides.length - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
