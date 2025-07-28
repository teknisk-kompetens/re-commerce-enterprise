
'use client';

import * as React from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button-enhanced';
import { toastVariants } from '@/lib/design-system/animation-system';
import { announceToScreenReader } from '@/lib/design-system/accessibility-utils';

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
}

// Toast Context
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider
interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

export function ToastProvider({ 
  children, 
  position = 'top-right',
  maxToasts = 5 
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast
    };

    setToasts(prev => {
      const updated = [...prev, newToast];
      // Remove oldest toasts if exceeding maxToasts
      if (updated.length > maxToasts) {
        return updated.slice(-maxToasts);
      }
      return updated;
    });

    // Announce to screen readers
    const announcement = `${toast.type} notification: ${toast.title}${toast.description ? `. ${toast.description}` : ''}`;
    announceToScreenReader(announcement, toast.type === 'error' ? 'assertive' : 'polite');

    // Auto remove toast if not persistent
    if (!toast.persistent && toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2'
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      
      {/* Toast Container */}
      <div
        className={cn(
          'fixed z-toast pointer-events-none',
          positionClasses[position]
        )}
        aria-live="polite"
        aria-label="Notifications"
      >
        <div className="flex flex-col space-y-2 w-full max-w-sm">
          <AnimatePresence mode="popLayout">
            {toasts.map((toast) => (
              <ToastItem
                key={toast.id}
                toast={toast}
                onRemove={removeToast}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </ToastContext.Provider>
  );
}

// Toast Item Component
interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => onRemove(toast.id), 150);
  };

  const iconMap = {
    success: CheckCircle2,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const Icon = iconMap[toast.type];

  const colorClasses = {
    success: 'bg-success-50 border-success-200 text-success-800 dark:bg-success-900/20 dark:border-success-700 dark:text-success-200',
    error: 'bg-error-50 border-error-200 text-error-800 dark:bg-error-900/20 dark:border-error-700 dark:text-error-200',
    warning: 'bg-warning-50 border-warning-200 text-warning-800 dark:bg-warning-900/20 dark:border-warning-700 dark:text-warning-200',
    info: 'bg-primary-50 border-primary-200 text-primary-800 dark:bg-primary-900/20 dark:border-primary-700 dark:text-primary-200'
  };

  const iconColorClasses = {
    success: 'text-success-500',
    error: 'text-error-500',
    warning: 'text-warning-500',
    info: 'text-primary-500'
  };

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="hidden"
      animate={isRemoving ? "exit" : "visible"}
      exit="exit"
      className={cn(
        'relative rounded-lg border p-4 shadow-lg backdrop-blur-sm pointer-events-auto',
        'transition-all duration-200',
        colorClasses[toast.type]
      )}
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
    >
      <div className="flex items-start space-x-3">
        <Icon 
          className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconColorClasses[toast.type])} 
          aria-hidden="true" 
        />
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm leading-5">
            {toast.title}
          </h4>
          {toast.description && (
            <p className="mt-1 text-sm opacity-90 leading-relaxed">
              {toast.description}
            </p>
          )}
          
          {toast.action && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toast.action.onClick}
                className="h-auto p-0 font-semibold hover:underline"
              >
                {toast.action.label}
              </Button>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleRemove}
          className="flex-shrink-0 hover:bg-black/10 dark:hover:bg-white/10"
          aria-label={`Dismiss ${toast.type} notification`}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress bar for timed toasts */}
      {!toast.persistent && toast.duration && toast.duration > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-current rounded-b-lg opacity-30"
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
        />
      )}
    </motion.div>
  );
}

// Toast Hook Functions
export const toast = {
  success: (title: string, description?: string, options?: Partial<Toast>) => {
    // This will be bound to the context when used
    return { type: 'success' as const, title, description, ...options };
  },
  error: (title: string, description?: string, options?: Partial<Toast>) => {
    return { type: 'error' as const, title, description, ...options };
  },
  warning: (title: string, description?: string, options?: Partial<Toast>) => {
    return { type: 'warning' as const, title, description, ...options };
  },
  info: (title: string, description?: string, options?: Partial<Toast>) => {
    return { type: 'info' as const, title, description, ...options };
  }
};
