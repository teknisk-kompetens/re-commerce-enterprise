
'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button-enhanced';
import { modalBackdropVariants, modalContentVariants } from '@/lib/design-system/animation-system';
import { trapFocus, announceToScreenReader, KeyboardKeys } from '@/lib/design-system/accessibility-utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  preventBodyScroll?: boolean;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  description,
  size = 'md',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
  overlayClassName,
  preventBodyScroll = true,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  // Handle body scroll prevention
  useEffect(() => {
    if (isOpen && preventBodyScroll) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      
      // Announce modal opening
      announceToScreenReader('Dialog opened', 'assertive');
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, preventBodyScroll]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const cleanup = trapFocus(modalRef.current);
      
      // Focus the modal container
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);

      return cleanup;
    }
  }, [isOpen]);

  // Restore focus when modal closes
  useEffect(() => {
    if (!isOpen && previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === KeyboardKeys.ESCAPE && isOpen && closeOnEscape) {
        onClose();
        announceToScreenReader('Dialog closed');
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnBackdropClick) {
      onClose();
      announceToScreenReader('Dialog closed');
    }
  };

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-modal">
          {/* Backdrop */}
          <motion.div
            className={cn(
              'fixed inset-0 bg-black/50 backdrop-blur-sm',
              overlayClassName
            )}
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              ref={modalRef}
              className={cn(
                'relative bg-white rounded-xl shadow-xl w-full',
                'dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700',
                sizeClasses[size],
                size === 'full' ? 'h-full' : 'max-h-[90vh]',
                className
              )}
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? (ariaLabelledBy || titleId) : ariaLabelledBy}
              aria-describedby={description ? (ariaDescribedBy || descriptionId) : ariaDescribedBy}
              tabIndex={-1}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                  <div className="flex-1 min-w-0">
                    {title && (
                      <h2
                        id={ariaLabelledBy || titleId}
                        className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 pr-8"
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p
                        id={ariaDescribedBy || descriptionId}
                        className="mt-1 text-sm text-neutral-600 dark:text-neutral-400"
                      >
                        {description}
                      </p>
                    )}
                  </div>
                  
                  {showCloseButton && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="absolute top-4 right-4"
                      aria-label="Close dialog"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className={cn(
                'overflow-y-auto',
                size === 'full' ? 'flex-1' : 'max-h-[70vh]',
                (title || showCloseButton) ? 'p-6 pt-0' : 'p-6'
              )}>
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Modal Header Component
export function ModalHeader({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn('mb-6', className)}>
      {children}
    </div>
  );
}

// Modal Footer Component
export function ModalFooter({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn(
      'flex items-center justify-end space-x-3 pt-6 mt-6',
      'border-t border-neutral-200 dark:border-neutral-700',
      className
    )}>
      {children}
    </div>
  );
}

// Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  loading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="sm"
    >
      <ModalFooter>
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          variant={variant === 'destructive' ? 'destructive' : 'default'}
          onClick={handleConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
}

// Alert Modal Component
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  variant?: 'info' | 'warning' | 'error' | 'success';
  buttonText?: string;
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  description,
  variant = 'info',
  buttonText = 'OK'
}: AlertModalProps) {
  const variantStyles = {
    info: 'text-primary-600',
    success: 'text-success-600',
    warning: 'text-warning-600',
    error: 'text-error-600'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center">
        <h3 className={cn('text-lg font-semibold mb-2', variantStyles[variant])}>
          {title}
        </h3>
        {description && (
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {description}
          </p>
        )}
        <Button onClick={onClose} fullWidth>
          {buttonText}
        </Button>
      </div>
    </Modal>
  );
}

// Custom Hook for Modal State
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen
  };
}
