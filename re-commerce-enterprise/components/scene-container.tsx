
'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SceneNavigation } from './scene-navigation';
import { ErrorBoundary } from './error-boundary';
import { ComponentLoading } from './loading-states';
import { OverviewScene } from './scenes/overview-scene';
import { AnalyticsScene } from './scenes/analytics-scene';
import { SecurityScene } from './scenes/security-scene';
import { PerformanceScene } from './scenes/performance-scene';
import { AIScene } from './scenes/ai-scene';

const scenes = [
  { id: 'overview', component: OverviewScene },
  { id: 'analytics', component: AnalyticsScene },
  { id: 'security', component: SecurityScene },
  { id: 'performance', component: PerformanceScene },
  { id: 'ai', component: AIScene }
];

interface SceneContainerProps {
  initialScene?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function SceneContainer({ 
  initialScene = 'overview', 
  autoPlay = false, 
  autoPlayInterval = 8000 
}: SceneContainerProps) {
  const [currentScene, setCurrentScene] = useState(initialScene);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingScene, setLoadingScene] = useState<string | null>(null);

  const currentSceneIndex = scenes.findIndex(scene => scene.id === currentScene);
  const CurrentSceneComponent = scenes[currentSceneIndex]?.component;
  const currentSceneData = scenes[currentSceneIndex];

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Auto-advance scenes when playing
  useEffect(() => {
    if (!isPlaying || isLoading) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentScene(prevScene => {
        const currentIndex = scenes.findIndex(scene => scene.id === prevScene);
        const nextIndex = (currentIndex + 1) % scenes.length;
        return scenes[nextIndex].id;
      });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, autoPlayInterval, isLoading]);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isLoading) return;
      
      const currentIndex = scenes.findIndex(scene => scene.id === currentScene);
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : scenes.length - 1;
          handleSceneChange(scenes[prevIndex].id);
          break;
        case 'ArrowRight':
          event.preventDefault();
          const nextIndex = currentIndex < scenes.length - 1 ? currentIndex + 1 : 0;
          handleSceneChange(scenes[nextIndex].id);
          break;
        case ' ':
          event.preventDefault();
          handlePlayToggle();
          break;
        case 'Escape':
          event.preventDefault();
          setIsPlaying(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentScene, isLoading]);

  const handleSceneChange = (sceneId: string) => {
    if (isLoading) return;
    
    const newIndex = scenes.findIndex(scene => scene.id === sceneId);
    const oldIndex = scenes.findIndex(scene => scene.id === currentScene);
    
    // Show loading state for scene transition
    setLoadingScene(sceneId);
    setDirection(newIndex > oldIndex ? 1 : -1);
    
    // Simulate scene loading time
    setTimeout(() => {
      setCurrentScene(sceneId);
      setLoadingScene(null);
    }, 300);
  };

  const handlePlayToggle = () => {
    if (isLoading) return;
    setIsPlaying(!isPlaying);
  };

  // Scene transition variants
  const sceneVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 25 : -25
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 25 : -25
    })
  };

  const sceneTransition = {
    x: { type: "spring", stiffness: 300, damping: 30 },
    opacity: { duration: 0.3 },
    scale: { duration: 0.4 },
    rotateY: { duration: 0.4 }
  };

  // Show initial loading screen
  if (isLoading) {
    return (
      <ErrorBoundary>
        <ComponentLoading />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div 
        className="relative min-h-screen overflow-hidden"
        role="application"
        aria-label="Scene-based enterprise dashboard"
      >
        {/* Skip Link for Accessibility */}
        <a 
          href="#main-content" 
          className="skip-link focus:top-6"
          aria-label="Skip to main content"
        >
          Skip to main content
        </a>

        {/* Scene Navigation */}
        <ErrorBoundary
          fallback={({ error, retry }) => (
            <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-background border border-border rounded-lg p-4">
              <p className="text-muted-foreground text-sm">Navigation temporarily unavailable</p>
            </div>
          )}
        >
          <SceneNavigation
            currentScene={currentScene}
            onSceneChange={handleSceneChange}
            isPlaying={isPlaying}
            onPlayToggle={handlePlayToggle}
          />
        </ErrorBoundary>

        {/* Main Scene Content */}
        <main 
          id="main-content"
          className="relative focus:outline-none" 
          style={{ perspective: '1000px' }}
          tabIndex={-1}
          aria-live="polite"
          aria-busy={loadingScene !== null}
        >
          {loadingScene ? (
            <ComponentLoading 
              className="min-h-[600px]"
            />
          ) : (
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentScene}
                custom={direction}
                variants={sceneVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={sceneTransition}
                className="w-full"
              >
                <ErrorBoundary>
                  <Suspense fallback={<ComponentLoading />}>
                    {CurrentSceneComponent && <CurrentSceneComponent />}
                  </Suspense>
                </ErrorBoundary>
              </motion.div>
            </AnimatePresence>
          )}
        </main>

        {/* Background Gradient Overlay */}
        <motion.div
          key={`bg-${currentScene}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`fixed inset-0 pointer-events-none ${
            currentScene === 'overview' ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10' :
            currentScene === 'analytics' ? 'bg-gradient-to-br from-green-500/10 to-teal-500/10' :
            currentScene === 'security' ? 'bg-gradient-to-br from-red-500/10 to-pink-500/10' :
            currentScene === 'performance' ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10' :
            'bg-gradient-to-br from-purple-500/10 to-pink-500/10'
          }`}
          style={{ zIndex: -1 }}
          aria-hidden="true"
        />

        {/* Scene Progress Indicator */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-border"
            role="progressbar"
            aria-label="Scene navigation progress"
            aria-valuenow={currentSceneIndex + 1}
            aria-valuemin={1}
            aria-valuemax={scenes.length}
          >
            <div className="flex items-center space-x-2">
              {scenes.map((scene, index) => (
                <div
                  key={scene.id}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    scene.id === currentScene 
                      ? 'bg-primary w-8' 
                      : 'bg-muted'
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Keyboard Navigation Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="fixed bottom-6 right-6 z-40"
          aria-live="polite"
        >
          <div className="bg-background/90 border border-border text-foreground text-xs px-3 py-2 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <kbd className="bg-muted border border-border px-1 rounded text-xs">←</kbd>
              <kbd className="bg-muted border border-border px-1 rounded text-xs">→</kbd>
              <span>Navigate scenes</span>
            </div>
          </div>
        </motion.div>

        {/* Screen Reader Scene Announcements */}
        <div 
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
          key={`announcement-${currentScene}`}
        >
          Now viewing {currentSceneData?.id} scene. Scene {currentSceneIndex + 1} of {scenes.length}.
          {isPlaying ? ' Auto-advance is enabled.' : ' Auto-advance is paused.'}
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Keyboard navigation
export function useSceneKeyboardNavigation(
  currentScene: string,
  onSceneChange: (sceneId: string) => void
) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const currentIndex = scenes.findIndex(scene => scene.id === currentScene);
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : scenes.length - 1;
          onSceneChange(scenes[prevIndex].id);
          break;
        case 'ArrowRight':
          event.preventDefault();
          const nextIndex = currentIndex < scenes.length - 1 ? currentIndex + 1 : 0;
          onSceneChange(scenes[nextIndex].id);
          break;
        case ' ':
          event.preventDefault();
          // Space bar could toggle autoplay
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentScene, onSceneChange]);
}
