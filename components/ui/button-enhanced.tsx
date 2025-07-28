
'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type MotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { buttonHoverVariants } from '@/lib/design-system/animation-system';

const buttonVariants = cva(
  [
    // Base styles with accessibility
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold',
    'ring-offset-background transition-all duration-200 ease-out',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
    // Touch targets - WCAG 2.1 AA compliance
    'min-h-touch-target min-w-touch-target',
    // Active state
    'active:scale-[0.98]',
    // Motion safe
    'motion-safe-animate'
  ],
  {
    variants: {
      variant: {
        default: [
          'bg-primary-600 text-white shadow-sm hover:shadow-md',
          'hover:bg-primary-700 focus-visible:ring-primary-500',
          'dark:bg-primary-600 dark:hover:bg-primary-700'
        ],
        destructive: [
          'bg-error-600 text-white shadow-sm hover:shadow-md',
          'hover:bg-error-700 focus-visible:ring-error-500',
          'dark:bg-error-600 dark:hover:bg-error-700'
        ],
        outline: [
          'border-2 border-neutral-300 bg-white text-neutral-700 shadow-sm hover:shadow-md',
          'hover:bg-neutral-50 hover:border-neutral-400 focus-visible:ring-primary-500',
          'dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200',
          'dark:hover:bg-neutral-700 dark:hover:border-neutral-500'
        ],
        secondary: [
          'bg-neutral-100 text-neutral-700 shadow-sm hover:shadow-md',
          'hover:bg-neutral-200 focus-visible:ring-primary-500',
          'dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600'
        ],
        ghost: [
          'text-neutral-700 hover:bg-neutral-100 focus-visible:ring-primary-500',
          'dark:text-neutral-200 dark:hover:bg-neutral-800'
        ],
        link: [
          'text-primary-600 underline-offset-4 hover:underline focus-visible:ring-primary-500',
          'dark:text-primary-400'
        ],
        success: [
          'bg-success-600 text-white shadow-sm hover:shadow-md',
          'hover:bg-success-700 focus-visible:ring-success-500',
          'dark:bg-success-600 dark:hover:bg-success-700'
        ],
        warning: [
          'bg-warning-600 text-white shadow-sm hover:shadow-md',
          'hover:bg-warning-700 focus-visible:ring-warning-500',
          'dark:bg-warning-600 dark:hover:bg-warning-700'
        ]
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        default: 'h-11 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-11 w-11 p-0',
        'icon-sm': 'h-9 w-9 p-0',
        'icon-lg': 'h-12 w-12 p-0'
      },
      fullWidth: {
        true: 'w-full'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  tooltip?: string;
  // Motion props
  whileHover?: MotionProps['whileHover'];
  whileTap?: MotionProps['whileTap'];
  // Accessibility props
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      loading = false,
      loadingText,
      leftIcon,
      rightIcon,
      children,
      disabled,
      whileHover,
      whileTap,
      tooltip,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : motion.button;
    const isDisabled = disabled || loading;

    // Default motion variants if not provided
    const defaultWhileHover = whileHover || (variant !== 'link' ? { scale: 1.02 } : undefined);
    const defaultWhileTap = whileTap || (variant !== 'link' ? { scale: 0.98 } : undefined);

    const buttonContent = (
      <>
        {loading && (
          <Loader2 
            className="h-4 w-4 animate-spin" 
            aria-hidden="true"
          />
        )}
        {!loading && leftIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className={cn(loading && loadingText && 'sr-only')}>
          {children}
        </span>
        {loading && loadingText && (
          <span>{loadingText}</span>
        )}
        {!loading && rightIcon && (
          <span className="flex-shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </>
    );

    const buttonElement = asChild ? (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        {...props}
      >
        {buttonContent}
      </Comp>
    ) : (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        whileHover={!isDisabled ? defaultWhileHover : undefined}
        whileTap={!isDisabled ? defaultWhileTap : undefined}
        initial="idle"
        animate="idle"
        variants={!isDisabled ? buttonHoverVariants : undefined}
        {...(props as any)}
      >
        {buttonContent}
      </Comp>
    );

    // Wrap with tooltip if provided
    if (tooltip) {
      return (
        <div className="group relative">
          {buttonElement}
          <div
            role="tooltip"
            className={cn(
              'absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform',
              'rounded-md bg-neutral-900 px-2 py-1 text-xs text-white',
              'opacity-0 transition-opacity duration-200 group-hover:opacity-100',
              'pointer-events-none z-tooltip',
              'dark:bg-neutral-100 dark:text-neutral-900'
            )}
          >
            {tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 transform">
              <div className="border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100" />
            </div>
          </div>
        </div>
      );
    }

    return buttonElement;
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
