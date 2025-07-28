
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { fadeInVariants } from '@/lib/design-system/animation-system';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  // Accessibility
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'false' | 'true' | 'grammar' | 'spelling';
  'aria-required'?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      labelClassName,
      type = 'text',
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      showPasswordToggle,
      id,
      disabled,
      required,
      'aria-describedby': ariaDescribedBy,
      'aria-invalid': ariaInvalid,
      'aria-required': ariaRequired,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const successId = `${inputId}-success`;
    const helperId = `${inputId}-helper`;

    // Determine input type
    const inputType = showPasswordToggle && type === 'password' 
      ? (showPassword ? 'text' : 'password') 
      : type;

    // Build aria-describedby
    const describedByIds = [
      ariaDescribedBy,
      error && errorId,
      success && successId,
      helperText && helperId
    ].filter(Boolean).join(' ');

    // Input state
    const hasError = Boolean(error);
    const hasSuccess = Boolean(success) && !hasError;
    const isPasswordType = type === 'password' && showPasswordToggle;

    return (
      <motion.div
        className={cn('space-y-2', containerClassName)}
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-sm font-semibold text-neutral-700 dark:text-neutral-300',
              'motion-safe-animate',
              disabled && 'text-neutral-400 dark:text-neutral-600',
              required && "after:content-['*'] after:ml-0.5 after:text-error-500",
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className={cn(
                'text-neutral-400 dark:text-neutral-500',
                hasError && 'text-error-400',
                hasSuccess && 'text-success-400',
                isFocused && !hasError && !hasSuccess && 'text-primary-400'
              )}>
                {leftIcon}
              </span>
            </div>
          )}

          {/* Input Field */}
          <input
            type={inputType}
            className={cn(
              // Base styles
              'flex h-11 w-full rounded-lg border bg-white px-4 py-3 text-sm text-neutral-900',
              'placeholder:text-neutral-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all duration-200 ease-out motion-safe-animate',
              // Touch target compliance
              'min-h-touch-target',
              // Focus states
              'focus:ring-2 focus:ring-offset-0',
              // Default border and focus
              !hasError && !hasSuccess && [
                'border-neutral-300 focus:border-primary-500 focus:ring-primary-500',
                'dark:border-neutral-600 dark:focus:border-primary-400 dark:focus:ring-primary-400'
              ],
              // Error state
              hasError && [
                'border-error-500 focus:border-error-500 focus:ring-error-500',
                'dark:border-error-400 dark:focus:border-error-400 dark:focus:ring-error-400'
              ],
              // Success state
              hasSuccess && [
                'border-success-500 focus:border-success-500 focus:ring-success-500',
                'dark:border-success-400 dark:focus:border-success-400 dark:focus:ring-success-400'
              ],
              // Dark mode
              'dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-400',
              // Disabled state
              'disabled:bg-neutral-50 disabled:text-neutral-500 dark:disabled:bg-neutral-900',
              // Icon padding
              leftIcon && 'pl-10',
              (rightIcon || isPasswordType || hasError || hasSuccess) && 'pr-10',
              className
            )}
            id={inputId}
            ref={ref}
            disabled={disabled}
            required={required}
            aria-invalid={hasError || ariaInvalid}
            aria-required={required || ariaRequired}
            aria-describedby={describedByIds || undefined}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />

          {/* Right Side Icons */}
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1">
            {/* Status Icons */}
            {hasError && (
              <AlertCircle className="h-5 w-5 text-error-500 dark:text-error-400" aria-hidden="true" />
            )}
            {hasSuccess && (
              <CheckCircle2 className="h-5 w-5 text-success-500 dark:text-success-400" aria-hidden="true" />
            )}

            {/* Password Toggle */}
            {isPasswordType && (
              <button
                type="button"
                className={cn(
                  'p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                  'text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300',
                  'transition-colors duration-200'
                )}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && !hasError && !hasSuccess && (
              <span className={cn(
                'text-neutral-400 dark:text-neutral-500',
                isFocused && 'text-primary-400'
              )}>
                {rightIcon}
              </span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-1">
          {/* Error Message */}
          {error && (
            <motion.p
              id={errorId}
              className="text-sm text-error-600 dark:text-error-400 flex items-center gap-1"
              role="alert"
              aria-live="polite"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              {error}
            </motion.p>
          )}

          {/* Success Message */}
          {success && !error && (
            <motion.p
              id={successId}
              className="text-sm text-success-600 dark:text-success-400 flex items-center gap-1"
              role="status"
              aria-live="polite"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
            >
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              {success}
            </motion.p>
          )}

          {/* Helper Text */}
          {helperText && !error && !success && (
            <p
              id={helperId}
              className="text-sm text-neutral-600 dark:text-neutral-400"
            >
              {helperText}
            </p>
          )}
        </div>
      </motion.div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
