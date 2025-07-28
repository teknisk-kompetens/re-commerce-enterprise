
'use client';

import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  HelpCircle,
  Lightbulb,
  X,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button-enhanced';
import { Card } from '@/components/ui/card-enhanced';
import { fadeInVariants, slideInFromLeftVariants } from '@/lib/design-system/animation-system';

// Alert Component
export type AlertVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const alertVariants = {
  default: {
    container: 'border-neutral-200 bg-neutral-50 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100',
    icon: 'text-neutral-600 dark:text-neutral-400'
  },
  success: {
    container: 'border-success-200 bg-success-50 text-success-900 dark:border-success-700 dark:bg-success-900/20 dark:text-success-100',
    icon: 'text-success-600 dark:text-success-400'
  },
  warning: {
    container: 'border-warning-200 bg-warning-50 text-warning-900 dark:border-warning-700 dark:bg-warning-900/20 dark:text-warning-100',
    icon: 'text-warning-600 dark:text-warning-400'
  },
  error: {
    container: 'border-error-200 bg-error-50 text-error-900 dark:border-error-700 dark:bg-error-900/20 dark:text-error-100',
    icon: 'text-error-600 dark:text-error-400'
  },
  info: {
    container: 'border-primary-200 bg-primary-50 text-primary-900 dark:border-primary-700 dark:bg-primary-900/20 dark:text-primary-100',
    icon: 'text-primary-600 dark:text-primary-400'
  }
};

const defaultIcons = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info
};

export function Alert({
  variant = 'default',
  title,
  children,
  dismissible = false,
  onDismiss,
  icon,
  className,
  action
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  const Icon = icon ? () => <>{icon}</> : defaultIcons[variant];
  const styles = alertVariants[variant];

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 150);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className={cn(
        'relative rounded-lg border p-4',
        styles.container,
        className
      )}
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex items-start space-x-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', styles.icon)} />
        
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold text-sm mb-1">
              {title}
            </h4>
          )}
          <div className="text-sm leading-relaxed">
            {children}
          </div>
          
          {action && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={action.onClick}
                className="h-auto p-0 font-semibold hover:underline"
              >
                {action.label}
              </Button>
            </div>
          )}
        </div>

        {dismissible && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleDismiss}
            className="flex-shrink-0 hover:bg-black/10 dark:hover:bg-white/10"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}

// Banner Component for important announcements
interface BannerProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Banner({
  variant = 'info',
  children,
  dismissible = true,
  onDismiss,
  className,
  action
}: BannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const styles = alertVariants[variant];

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 150);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            'border-b px-4 py-3',
            styles.container,
            className
          )}
          variants={slideInFromLeftVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          role="banner"
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-3">
              <div className="text-sm font-medium">
                {children}
              </div>
              {action && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={action.onClick}
                  className="h-auto p-0 font-semibold hover:underline"
                >
                  {action.label}
                </Button>
              )}
            </div>

            {dismissible && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleDismiss}
                className="flex-shrink-0"
                aria-label="Dismiss banner"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Callout Component for highlighted information
interface CalloutProps {
  variant?: 'default' | 'tip' | 'warning' | 'danger' | 'note';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const calloutVariants = {
  default: {
    container: 'border-l-neutral-400 bg-neutral-50 dark:bg-neutral-800',
    title: 'text-neutral-900 dark:text-neutral-100',
    icon: Info,
    iconColor: 'text-neutral-600 dark:text-neutral-400'
  },
  tip: {
    container: 'border-l-success-400 bg-success-50 dark:bg-success-900/20',
    title: 'text-success-900 dark:text-success-100',
    icon: Lightbulb,
    iconColor: 'text-success-600 dark:text-success-400'
  },
  warning: {
    container: 'border-l-warning-400 bg-warning-50 dark:bg-warning-900/20',
    title: 'text-warning-900 dark:text-warning-100',
    icon: AlertTriangle,
    iconColor: 'text-warning-600 dark:text-warning-400'
  },
  danger: {
    container: 'border-l-error-400 bg-error-50 dark:bg-error-900/20',
    title: 'text-error-900 dark:text-error-100',
    icon: AlertCircle,
    iconColor: 'text-error-600 dark:text-error-400'
  },
  note: {
    container: 'border-l-primary-400 bg-primary-50 dark:bg-primary-900/20',
    title: 'text-primary-900 dark:text-primary-100',
    icon: Info,
    iconColor: 'text-primary-600 dark:text-primary-400'
  }
};

export function Callout({ variant = 'default', title, children, className }: CalloutProps) {
  const styles = calloutVariants[variant];
  const Icon = styles.icon;

  return (
    <motion.div
      className={cn(
        'border-l-4 rounded-r-lg p-4',
        styles.container,
        className
      )}
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-start space-x-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', styles.iconColor)} />
        <div className="flex-1">
          {title && (
            <h4 className={cn('font-semibold text-sm mb-2', styles.title)}>
              {title}
            </h4>
          )}
          <div className="text-sm leading-relaxed">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Feedback Widget for user satisfaction
interface FeedbackWidgetProps {
  onFeedback: (feedback: { type: 'positive' | 'negative'; comment?: string }) => void;
  className?: string;
  title?: string;
}

export function FeedbackWidget({ 
  onFeedback, 
  className, 
  title = "Was this helpful?" 
}: FeedbackWidgetProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<'positive' | 'negative' | null>(null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFeedbackSelect = (type: 'positive' | 'negative') => {
    setSelectedFeedback(type);
    if (type === 'positive') {
      onFeedback({ type });
      setSubmitted(true);
    } else {
      setShowComment(true);
    }
  };

  const handleSubmitComment = () => {
    onFeedback({ type: selectedFeedback!, comment });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        className={cn('text-center py-4', className)}
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        <CheckCircle2 className="h-8 w-8 text-success-600 mx-auto mb-2" />
        <p className="text-sm text-success-700 dark:text-success-300">
          Thank you for your feedback!
        </p>
      </motion.div>
    );
  }

  return (
    <Card className={cn('p-6', className)} variant="outlined">
      <motion.div variants={fadeInVariants} initial="hidden" animate="visible">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
          {title}
        </h4>

        {!showComment ? (
          <div className="flex items-center space-x-3">
            <Button
              variant={selectedFeedback === 'positive' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFeedbackSelect('positive')}
              leftIcon={<ThumbsUp className="h-4 w-4" />}
            >
              Yes
            </Button>
            <Button
              variant={selectedFeedback === 'negative' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFeedbackSelect('negative')}
              leftIcon={<ThumbsDown className="h-4 w-4" />}
            >
              No
            </Button>
          </div>
        ) : (
          <motion.div
            className="space-y-4"
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
          >
            <div>
              <label htmlFor="feedback-comment" className="sr-only">
                Tell us more about your experience
              </label>
              <textarea
                id="feedback-comment"
                placeholder="Tell us more about your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className={cn(
                  'w-full rounded-lg border border-neutral-300 bg-white px-4 py-3',
                  'text-neutral-900 placeholder-neutral-500 resize-none',
                  'focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0',
                  'dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-100',
                  'dark:focus:border-primary-400 dark:focus:ring-primary-400',
                  'transition-all duration-200'
                )}
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button size="sm" onClick={handleSubmitComment}>
                Submit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowComment(false);
                  setSelectedFeedback(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </Card>
  );
}

// Help Tooltip Component
interface HelpTooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function HelpTooltip({ 
  content, 
  children, 
  className, 
  position = 'top' 
}: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-neutral-900 dark:border-t-neutral-100',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-neutral-900 dark:border-b-neutral-100',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-neutral-900 dark:border-l-neutral-100',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-neutral-900 dark:border-r-neutral-100'
  };

  return (
    <div
      className={cn('relative inline-block', className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={cn(
              'absolute z-tooltip max-w-xs',
              positionClasses[position]
            )}
            variants={fadeInVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            role="tooltip"
          >
            <div className="rounded-md bg-neutral-900 px-3 py-2 text-xs text-white dark:bg-neutral-100 dark:text-neutral-900">
              {content}
              <div className={cn('absolute border-4 border-transparent', arrowClasses[position])} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { AlertCircle, CheckCircle2, AlertTriangle, Info, HelpCircle };
