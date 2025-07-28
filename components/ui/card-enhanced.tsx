
'use client';

import * as React from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { cardHoverVariants, fadeInVariants } from '@/lib/design-system/animation-system';

const cardVariants = cva(
  [
    'rounded-xl border bg-card text-card-foreground shadow-sm',
    'transition-all duration-300 ease-out motion-safe-animate'
  ],
  {
    variants: {
      variant: {
        default: 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800',
        elevated: [
          'border-neutral-200 bg-white shadow-md hover:shadow-lg',
          'dark:border-neutral-700 dark:bg-neutral-800'
        ],
        outlined: [
          'border-2 border-primary-200 bg-primary-50/30',
          'dark:border-primary-700 dark:bg-primary-900/20'
        ],
        success: [
          'border-success-200 bg-success-50/30',
          'dark:border-success-700 dark:bg-success-900/20'
        ],
        warning: [
          'border-warning-200 bg-warning-50/30',
          'dark:border-warning-700 dark:bg-warning-900/20'
        ],
        error: [
          'border-error-200 bg-error-50/30',
          'dark:border-error-700 dark:bg-error-900/20'
        ],
        ghost: 'border-transparent bg-transparent shadow-none'
      },
      size: {
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
        xl: 'p-10'
      },
      interactive: {
        true: [
          'cursor-pointer hover:-translate-y-1 hover:shadow-lg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'active:scale-[0.99]'
        ],
        false: ''
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      interactive: false
    }
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
  // Motion props
  whileHover?: MotionProps['whileHover'];
  whileTap?: MotionProps['whileTap'];
  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      size,
      interactive,
      whileHover,
      whileTap,
      children,
      ...props
    },
    ref
  ) => {
    // Default motion variants for interactive cards
    const defaultWhileHover = whileHover || (interactive ? { y: -4 } : undefined);
    const defaultWhileTap = whileTap || (interactive ? { scale: 0.99 } : undefined);

    return (
      <motion.div
        className={cn(cardVariants({ variant, size, interactive, className }))}
        ref={ref}
        whileHover={defaultWhileHover}
        whileTap={defaultWhileTap}
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        tabIndex={interactive ? 0 : undefined}
        role={interactive ? 'button' : undefined}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xl font-semibold leading-none tracking-tight text-neutral-900 dark:text-neutral-100',
      className
    )}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed',
      className
    )}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-6', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
