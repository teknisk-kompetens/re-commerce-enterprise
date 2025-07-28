
'use client';

import * as React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

// Enhanced theme configuration
export type ThemeMode = 'light' | 'dark' | 'system';
export type ContrastMode = 'normal' | 'high';
export type MotionMode = 'full' | 'reduced';

interface EnhancedThemeContextType {
  // Theme modes
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  resolvedTheme: 'light' | 'dark';
  
  // Accessibility preferences
  contrastMode: ContrastMode;
  setContrastMode: (mode: ContrastMode) => void;
  motionMode: MotionMode;
  setMotionMode: (mode: MotionMode) => void;
  
  // Font size scaling for accessibility
  fontScale: number;
  setFontScale: (scale: number) => void;
  
  // Color theme variants
  colorScheme: 'default' | 'colorblind' | 'monochrome';
  setColorScheme: (scheme: 'default' | 'colorblind' | 'monochrome') => void;
  
  // UI density
  density: 'compact' | 'comfortable' | 'spacious';
  setDensity: (density: 'compact' | 'comfortable' | 'spacious') => void;
}

const EnhancedThemeContext = createContext<EnhancedThemeContextType>({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: 'light',
  contrastMode: 'normal',
  setContrastMode: () => {},
  motionMode: 'full',
  setMotionMode: () => {},
  fontScale: 1,
  setFontScale: () => {},
  colorScheme: 'default',
  setColorScheme: () => {},
  density: 'comfortable',
  setDensity: () => {}
});

export const useEnhancedTheme = () => {
  const context = useContext(EnhancedThemeContext);
  if (!context) {
    throw new Error('useEnhancedTheme must be used within an EnhancedThemeProvider');
  }
  return context;
};

interface EnhancedThemeProviderProps extends ThemeProviderProps {
  children: React.ReactNode;
}

export function EnhancedThemeProvider({ children, ...props }: EnhancedThemeProviderProps) {
  // State for all theme preferences
  const [theme, setTheme] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [contrastMode, setContrastMode] = useState<ContrastMode>('normal');
  const [motionMode, setMotionMode] = useState<MotionMode>('full');
  const [fontScale, setFontScale] = useState(1);
  const [colorScheme, setColorScheme] = useState<'default' | 'colorblind' | 'monochrome'>('default');
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [mounted, setMounted] = useState(false);

  // Initialize preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load saved preferences
      const savedContrastMode = localStorage.getItem('theme-contrast') as ContrastMode;
      const savedMotionMode = localStorage.getItem('theme-motion') as MotionMode;
      const savedFontScale = localStorage.getItem('theme-font-scale');
      const savedColorScheme = localStorage.getItem('theme-color-scheme') as 'default' | 'colorblind' | 'monochrome';
      const savedDensity = localStorage.getItem('theme-density') as 'compact' | 'comfortable' | 'spacious';

      if (savedContrastMode) setContrastMode(savedContrastMode);
      if (savedMotionMode) setMotionMode(savedMotionMode);
      if (savedFontScale) setFontScale(parseFloat(savedFontScale));
      if (savedColorScheme) setColorScheme(savedColorScheme);
      if (savedDensity) setDensity(savedDensity);

      // Detect system preferences
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (!savedMotionMode && prefersReducedMotion) {
        setMotionMode('reduced');
      }
      
      if (!savedContrastMode && prefersHighContrast) {
        setContrastMode('high');
      }

      setResolvedTheme(prefersDark ? 'dark' : 'light');
      setMounted(true);
    }
  }, []);

  // Apply theme preferences to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // Apply contrast mode
    root.setAttribute('data-contrast', contrastMode);
    
    // Apply motion preference
    root.setAttribute('data-motion', motionMode);
    
    // Apply font scaling
    root.style.setProperty('--font-scale', fontScale.toString());
    
    // Apply color scheme
    root.setAttribute('data-color-scheme', colorScheme);
    
    // Apply density
    root.setAttribute('data-density', density);
    
    // Apply CSS classes for different modes
    root.classList.toggle('high-contrast', contrastMode === 'high');
    root.classList.toggle('reduced-motion', motionMode === 'reduced');
    root.classList.toggle('compact-density', density === 'compact');
    root.classList.toggle('spacious-density', density === 'spacious');

  }, [mounted, contrastMode, motionMode, fontScale, colorScheme, density]);

  // Save preferences to localStorage
  const handleContrastModeChange = (mode: ContrastMode) => {
    setContrastMode(mode);
    localStorage.setItem('theme-contrast', mode);
  };

  const handleMotionModeChange = (mode: MotionMode) => {
    setMotionMode(mode);
    localStorage.setItem('theme-motion', mode);
  };

  const handleFontScaleChange = (scale: number) => {
    setFontScale(scale);
    localStorage.setItem('theme-font-scale', scale.toString());
  };

  const handleColorSchemeChange = (scheme: 'default' | 'colorblind' | 'monochrome') => {
    setColorScheme(scheme);
    localStorage.setItem('theme-color-scheme', scheme);
  };

  const handleDensityChange = (newDensity: 'compact' | 'comfortable' | 'spacious') => {
    setDensity(newDensity);
    localStorage.setItem('theme-density', newDensity);
  };

  const contextValue: EnhancedThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
    contrastMode,
    setContrastMode: handleContrastModeChange,
    motionMode,
    setMotionMode: handleMotionModeChange,
    fontScale,
    setFontScale: handleFontScaleChange,
    colorScheme,
    setColorScheme: handleColorSchemeChange,
    density,
    setDensity: handleDensityChange
  };

  // Show nothing until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <NextThemesProvider {...props}>
      <EnhancedThemeContext.Provider value={contextValue}>
        {children}
      </EnhancedThemeContext.Provider>
    </NextThemesProvider>
  );
}

// Utility hook for theme-aware components
export function useThemeAwareStyles() {
  const { resolvedTheme, contrastMode, motionMode, fontScale, density } = useEnhancedTheme();
  
  return {
    isDark: resolvedTheme === 'dark',
    isHighContrast: contrastMode === 'high',
    isReducedMotion: motionMode === 'reduced',
    fontScale,
    density,
    getTransitionClass: (duration: 'fast' | 'normal' | 'slow' = 'normal') => {
      if (motionMode === 'reduced') return '';
      const durations = { fast: 'duration-150', normal: 'duration-300', slow: 'duration-500' };
      return `transition-all ${durations[duration]} ease-out`;
    },
    getContrastAwareColor: (baseColor: string, highContrastColor: string) => {
      return contrastMode === 'high' ? highContrastColor : baseColor;
    }
  };
}
