
'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Loader2, Brain, Shield, Zap, Database, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

// Page-level loading component
export function PageLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 mx-auto"
        >
          <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </motion.div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {message}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Please wait while we prepare your experience...
          </p>
        </div>
      </div>
    </div>
  );
}

// Component-level loading with skeleton
export function ComponentLoading({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

// Card loading skeleton
export function CardLoading({ count = 1 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Dashboard loading with multiple sections
export function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Metrics skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          
          <Card className="animate-pulse">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Table loading skeleton
export function TableLoading({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-20" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Progressive loading with stages
export function ProgressiveLoading({ 
  stages = [
    'Initializing platform...',
    'Loading enterprise features...',
    'Configuring security...',
    'Preparing dashboard...',
    'Almost ready...'
  ],
  currentStage = 0 
}: { 
  stages?: string[]; 
  currentStage?: number; 
}) {
  const progress = ((currentStage + 1) / stages.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            {/* Loading animation */}
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 mx-auto mb-4"
              >
                <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full"></div>
              </motion.div>
            </div>

            {/* Progress */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Loading Enterprise Platform
              </h3>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stages[currentStage]}
              </p>
            </div>

            {/* Stage indicators */}
            <div className="flex justify-center space-x-2">
              {stages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStage 
                      ? 'bg-blue-600 dark:bg-blue-400' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Feature-specific loading states
export function AIStudioLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 flex items-center justify-center">
      <div className="text-center space-y-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto"
        >
          <Brain className="w-8 h-8 text-white" />
        </motion.div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Initializing AI Studio
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Setting up AI automation and intelligence platform...
          </p>
        </div>
      </div>
    </div>
  );
}

export function SecurityCenterLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 flex items-center justify-center">
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto"
        >
          <Shield className="w-8 h-8 text-white" />
        </motion.div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Security Center
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Initializing security monitoring and threat intelligence...
          </p>
        </div>
      </div>
    </div>
  );
}

// Export all loading states as a namespace
export const LoadingStates = {
  PageLoading,
  ComponentLoading,
  CardLoading,
  DashboardLoading,
  TableLoading,
  ProgressiveLoading,
  AIStudioLoading,
  SecurityCenterLoading
};
