
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { spinnerVariants, fadeInVariants } from '@/lib/design-system/animation-system';

// Loading Spinner Component
const spinnerVariants2 = cva(
  'animate-spin rounded-full border-2',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border-2',
        default: 'h-6 w-6 border-2',
        lg: 'h-8 w-8 border-2',
        xl: 'h-12 w-12 border-4'
      },
      variant: {
        default: 'border-neutral-300 border-t-primary-600 dark:border-neutral-600 dark:border-t-primary-400',
        primary: 'border-primary-200 border-t-primary-600 dark:border-primary-800 dark:border-t-primary-400',
        white: 'border-white/30 border-t-white',
        neutral: 'border-neutral-300 border-t-neutral-600 dark:border-neutral-600 dark:border-t-neutral-300'
      }
    },
    defaultVariants: {
      size: 'default',
      variant: 'default'
    }
  }
);

export interface LoadingSpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants2> {
  'aria-label'?: string;
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size, variant, 'aria-label': ariaLabel, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(spinnerVariants2({ size, variant }), className)}
        variants={spinnerVariants}
        animate="rotate"
        role="status"
        aria-label={ariaLabel || 'Loading'}
        {...(props as any)}
      >
        <span className="sr-only">{ariaLabel || 'Loading...'}</span>
      </motion.div>
    );
  }
);
LoadingSpinner.displayName = 'LoadingSpinner';

// Skeleton Component
const skeletonVariants = cva(
  'animate-pulse rounded bg-neutral-200 dark:bg-neutral-700',
  {
    variants: {
      variant: {
        default: 'bg-neutral-200 dark:bg-neutral-700',
        circular: 'rounded-full bg-neutral-200 dark:bg-neutral-700',
        text: 'h-4 bg-neutral-200 dark:bg-neutral-700',
        heading: 'h-6 bg-neutral-200 dark:bg-neutral-700'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        aria-hidden="true"
        {...(props as any)}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';

// Progress Bar Component
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  indeterminate?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      indeterminate = false,
      size = 'default',
      variant = 'default',
      showLabel = false,
      label,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizeClasses = {
      sm: 'h-1',
      default: 'h-2',
      lg: 'h-3'
    };

    const variantClasses = {
      default: 'bg-primary-600',
      success: 'bg-success-600',
      warning: 'bg-warning-600',
      error: 'bg-error-600'
    };

    return (
      <div className="space-y-2">
        {(showLabel || label) && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-neutral-700 dark:text-neutral-300">
              {label || 'Progress'}
            </span>
            {!indeterminate && (
              <span className="text-neutral-600 dark:text-neutral-400">
                {Math.round(percentage)}%
              </span>
            )}
          </div>
        )}
        <div
          ref={ref}
          className={cn(
            'w-full bg-neutral-200 rounded-full overflow-hidden dark:bg-neutral-700',
            sizeClasses[size],
            className
          )}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
          {...props}
        >
          {indeterminate ? (
            <motion.div
              className={cn(
                'h-full rounded-full',
                variantClasses[variant]
              )}
              animate={{
                x: [-100, 100],
                transition: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: 'easeInOut'
                }
              }}
              style={{ width: '30%' }}
            />
          ) : (
            <motion.div
              className={cn(
                'h-full rounded-full transition-all duration-500 ease-out',
                variantClasses[variant]
              )}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          )}
        </div>
      </div>
    );
  }
);
Progress.displayName = 'Progress';

// Loading States Component
export interface LoadingStateProps {
  loading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  spinner?: boolean;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  children,
  fallback,
  spinner = true,
  className
}) => {
  if (loading) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <motion.div
        className={cn(
          'flex items-center justify-center p-8',
          className
        )}
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        {spinner && <LoadingSpinner />}
      </motion.div>
    );
  }

  return <>{children}</>;
};

// Content Skeleton Templates
const ContentSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('space-y-4', className)}>
    <Skeleton variant="heading" className="w-3/4" />
    <div className="space-y-2">
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-5/6" />
      <Skeleton variant="text" className="w-4/5" />
    </div>
  </div>
);

const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 space-y-4', className)}>
    <div className="flex items-center space-x-4">
      <Skeleton variant="circular" className="w-12 h-12" />
      <div className="space-y-2 flex-1">
        <Skeleton variant="heading" className="w-1/2" />
        <Skeleton variant="text" className="w-1/3" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-3/4" />
    </div>
  </div>
);

const TableSkeleton: React.FC<{ rows?: number; columns?: number; className?: string }> = ({ 
  rows = 5, 
  columns = 4, 
  className 
}) => (
  <div className={cn('space-y-3', className)}>
    {/* Header */}
    <div className="flex space-x-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} variant="text" className="flex-1 h-5" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton key={colIndex} variant="text" className="flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export {
  LoadingSpinner,
  Skeleton,
  Progress,
  LoadingState,
  ContentSkeleton,
  CardSkeleton,
  TableSkeleton
};
