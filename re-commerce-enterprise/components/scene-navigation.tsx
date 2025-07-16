
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard,
  BarChart3,
  Shield,
  Zap,
  Brain,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Maximize2,
  Settings,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface Scene {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  gradient: string;
}

interface SceneNavigationProps {
  currentScene: string;
  onSceneChange: (sceneId: string) => void;
  isPlaying: boolean;
  onPlayToggle: () => void;
  className?: string;
}

const scenes: Scene[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: <LayoutDashboard className="h-4 w-4" />,
    description: 'Executive dashboard and key metrics',
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <BarChart3 className="h-4 w-4" />,
    description: 'Business intelligence and insights',
    color: 'text-green-600',
    gradient: 'from-green-500 to-green-600'
  },
  {
    id: 'security',
    label: 'Security',
    icon: <Shield className="h-4 w-4" />,
    description: 'Security monitoring and compliance',
    color: 'text-red-600',
    gradient: 'from-red-500 to-red-600'
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: <Zap className="h-4 w-4" />,
    description: 'System optimization and monitoring',
    color: 'text-yellow-600',
    gradient: 'from-yellow-500 to-yellow-600'
  },
  {
    id: 'ai',
    label: 'AI Insights',
    icon: <Brain className="h-4 w-4" />,
    description: 'AI-powered recommendations',
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600'
  }
];

export function SceneNavigation({ 
  currentScene, 
  onSceneChange, 
  isPlaying, 
  onPlayToggle,
  className 
}: SceneNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const currentSceneIndex = scenes.findIndex(scene => scene.id === currentScene);
  const currentSceneData = scenes[currentSceneIndex];

  const handlePrevious = () => {
    const prevIndex = currentSceneIndex > 0 ? currentSceneIndex - 1 : scenes.length - 1;
    onSceneChange(scenes[prevIndex].id);
    announceSceneChange(scenes[prevIndex].label);
  };

  const handleNext = () => {
    const nextIndex = currentSceneIndex < scenes.length - 1 ? currentSceneIndex + 1 : 0;
    onSceneChange(scenes[nextIndex].id);
    announceSceneChange(scenes[nextIndex].label);
  };

  const announceSceneChange = (sceneName: string) => {
    // Screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = `Switched to ${sceneName} scene`;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  const filteredScenes = scenes.filter(scene =>
    scene.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    scene.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNext();
          break;
        case 'Enter':
        case ' ':
          if (event.target === containerRef.current) {
            event.preventDefault();
            onPlayToggle();
          }
          break;
        case 'Escape':
          event.preventDefault();
          setIsExpanded(false);
          containerRef.current?.focus();
          break;
        case '/':
          event.preventDefault();
          setIsExpanded(true);
          setTimeout(() => searchInputRef.current?.focus(), 100);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentSceneIndex, onPlayToggle]);

  return (
    <motion.nav
      ref={containerRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-24 left-1/2 transform -translate-x-1/2 z-50",
        "bg-background/95 backdrop-blur-xl border border-border/50",
        "rounded-2xl shadow-2xl px-6 py-4",
        "transition-all duration-300 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isExpanded ? "w-96" : "w-80",
        className
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      tabIndex={0}
      role="navigation"
      aria-label="Scene navigation controls"
      aria-expanded={isExpanded}
      aria-describedby="scene-navigation-help"
    >
      {/* Scene Controls */}
      <div className="flex items-center justify-between mb-4" role="group" aria-label="Scene navigation controls">
        <div className="flex items-center space-x-3">
          {/* Previous Scene */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            title="Previous Scene (Arrow Left)"
            aria-label={`Go to previous scene. Currently on ${currentSceneData?.label} scene, ${currentSceneIndex + 1} of ${scenes.length}`}
          >
            <SkipBack className="h-4 w-4 text-muted-foreground" />
          </motion.button>

          {/* Play/Pause */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayToggle}
            className={cn(
              "p-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
              isPlaying 
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg focus:ring-blue-400" 
                : "bg-muted hover:bg-muted/80 text-muted-foreground focus:ring-primary"
            )}
            title={isPlaying ? "Pause Slideshow (Space)" : "Start Slideshow (Space)"}
            aria-label={`${isPlaying ? 'Pause' : 'Start'} automatic scene slideshow`}
            aria-pressed={isPlaying}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4" aria-hidden="true" />
            )}
          </motion.button>

          {/* Next Scene */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            title="Next Scene (Arrow Right)"
            aria-label={`Go to next scene. Currently on ${currentSceneData?.label} scene, ${currentSceneIndex + 1} of ${scenes.length}`}
          >
            <SkipForward className="h-4 w-4 text-muted-foreground" />
          </motion.button>
        </div>

        {/* Current Scene Info */}
        <div className="flex items-center space-x-3" aria-live="polite" aria-atomic="true">
          <div className={cn("p-2 rounded-lg bg-gradient-to-r", currentSceneData?.gradient)} aria-hidden="true">
            <div className="text-white">
              {currentSceneData?.icon}
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-foreground">
              {currentSceneData?.label}
            </div>
            <div className="text-xs text-muted-foreground">
              Scene {currentSceneIndex + 1} of {scenes.length}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Search Bar */}
            <div className="relative mb-4">
              <label htmlFor="scene-search" className="sr-only">
                Search scenes by name or description
              </label>
              <input
                ref={searchInputRef}
                id="scene-search"
                type="text"
                placeholder="Search scenes... (Press / to focus)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
                aria-describedby="search-help"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <div id="search-help" className="sr-only">
                Use this search to filter scenes by name or description. Press Escape to close.
              </div>
            </div>

            {/* Scene Grid */}
            <div 
              className="grid grid-cols-5 gap-2 mb-4" 
              role="grid" 
              aria-label="Scene selection grid"
            >
              {filteredScenes.map((scene, index) => (
                <motion.button
                  key={scene.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onSceneChange(scene.id);
                    announceSceneChange(scene.label);
                  }}
                  className={cn(
                    "p-3 rounded-xl transition-all duration-300 text-center",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2",
                    currentScene === scene.id
                      ? `bg-gradient-to-r ${scene.gradient} text-white shadow-lg focus:ring-white`
                      : "bg-muted hover:bg-muted/80 text-muted-foreground focus:ring-primary"
                  )}
                  title={scene.description}
                  aria-label={`Switch to ${scene.label} scene. ${scene.description}`}
                  aria-pressed={currentScene === scene.id}
                  role="gridcell"
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span aria-hidden="true">{scene.icon}</span>
                    <span className="text-xs font-medium">{scene.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="relative" role="progressbar" aria-label="Scene navigation progress" aria-valuenow={currentSceneIndex + 1} aria-valuemin={1} aria-valuemax={scenes.length}>
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  className={cn("h-2 rounded-full bg-gradient-to-r", currentSceneData?.gradient)}
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentSceneIndex + 1) / scenes.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  aria-hidden="true"
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round(((currentSceneIndex + 1) / scenes.length) * 100)}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scene Description */}
      <motion.div
        key={currentScene}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-3 text-center"
        id="current-scene-description"
      >
        <p className="text-sm text-muted-foreground">
          {currentSceneData?.description}
        </p>
      </motion.div>

      {/* Keyboard Shortcuts Help */}
      <div 
        id="scene-navigation-help" 
        className="sr-only"
        aria-live="polite"
      >
        Keyboard shortcuts: Arrow Left/Right to navigate scenes, Space or Enter to toggle slideshow, 
        Forward slash (/) to search scenes, Escape to close expanded view. 
        Currently on {currentSceneData?.label} scene, {currentSceneIndex + 1} of {scenes.length}.
      </div>

      {/* Visible Keyboard Hints */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="mt-3 pt-3 border-t border-border"
        >
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <div className="flex justify-center items-center space-x-4">
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs">←</kbd>
                <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs">→</kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs">Space</kbd>
                <span>Play/Pause</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded text-xs">/</kbd>
                <span>Search</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
