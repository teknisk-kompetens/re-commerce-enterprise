
'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller, type FieldValues, type Control, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input-enhanced';
import { Button } from '@/components/ui/button-enhanced';
import { fadeInVariants, staggerContainerVariants, staggerItemVariants } from '@/lib/design-system/animation-system';

// Form Field Component
interface FormFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  helperText?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  helperText,
  type = 'text',
  required,
  disabled,
  className,
  leftIcon,
  rightIcon,
  showPasswordToggle
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <motion.div variants={staggerItemVariants}>
          <Input
            {...field}
            type={type}
            label={label}
            placeholder={placeholder}
            helperText={helperText}
            error={error?.message}
            required={required}
            disabled={disabled}
            leftIcon={leftIcon}
            rightIcon={rightIcon}
            showPasswordToggle={showPasswordToggle}
            className={className}
            aria-invalid={!!error}
          />
        </motion.div>
      )}
    />
  );
}

// Enhanced Form Component
interface EnhancedFormProps<T extends z.ZodType<any, any, any>> {
  schema: T;
  onSubmit: (data: z.infer<T>) => Promise<void> | void;
  children: (methods: {
    control: Control<z.infer<T>>;
    formState: ReturnType<typeof useForm<z.infer<T>>>['formState'];
    reset: ReturnType<typeof useForm<z.infer<T>>>['reset'];
    setValue: ReturnType<typeof useForm<z.infer<T>>>['setValue'];
    watch: ReturnType<typeof useForm<z.infer<T>>>['watch'];
  }) => React.ReactNode;
  defaultValues?: Partial<z.infer<T>>;
  className?: string;
  loading?: boolean;
}

export function EnhancedForm<T extends z.ZodType<any, any, any>>({
  schema,
  onSubmit,
  children,
  defaultValues,
  className,
  loading = false
}: EnhancedFormProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange'
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={cn('space-y-6', className)}
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      noValidate
    >
      {children({
        control: form.control,
        formState: form.formState,
        reset: form.reset,
        setValue: form.setValue,
        watch: form.watch
      })}
    </motion.form>
  );
}

// Form Section Component
interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <motion.div
      className={cn('space-y-4', className)}
      variants={staggerItemVariants}
    >
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );
}

// Form Actions Component
interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}

export function FormActions({ children, className, align = 'right' }: FormActionsProps) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  };

  return (
    <motion.div
      className={cn(
        'flex items-center gap-3 pt-6',
        alignClasses[align],
        className
      )}
      variants={staggerItemVariants}
    >
      {children}
    </motion.div>
  );
}

// Multi-step Form Component
interface Step {
  id: string;
  title: string;
  description?: string;
  optional?: boolean;
}

interface MultiStepFormProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  children: React.ReactNode;
  className?: string;
}

export function MultiStepForm({
  steps,
  currentStep,
  onStepChange,
  children,
  className
}: MultiStepFormProps) {
  return (
    <div className={cn('space-y-8', className)}>
      {/* Step Indicator */}
      <motion.div
        className="flex items-center justify-between"
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
      >
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center space-y-2">
              <button
                type="button"
                onClick={() => onStepChange(index)}
                className={cn(
                  'w-10 h-10 rounded-full border-2 flex items-center justify-center',
                  'transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary-500',
                  index < currentStep && [
                    'bg-primary-600 border-primary-600 text-white',
                    'hover:bg-primary-700 hover:border-primary-700'
                  ],
                  index === currentStep && [
                    'border-primary-600 text-primary-600',
                    'hover:bg-primary-50 dark:hover:bg-primary-900/20'
                  ],
                  index > currentStep && [
                    'border-neutral-300 text-neutral-400',
                    'dark:border-neutral-600 dark:text-neutral-500'
                  ]
                )}
                aria-current={index === currentStep ? 'step' : undefined}
              >
                <span className="text-sm font-medium">
                  {index + 1}
                </span>
              </button>
              <div className="text-center">
                <p className={cn(
                  'text-sm font-medium',
                  index <= currentStep ? 'text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'
                )}>
                  {step.title}
                </p>
                {step.optional && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Optional
                  </p>
                )}
              </div>
            </div>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={cn(
                'flex-1 h-0.5 mx-4',
                index < currentStep ? 'bg-primary-600' : 'bg-neutral-300 dark:bg-neutral-600'
              )} />
            )}
          </React.Fragment>
        ))}
      </motion.div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        variants={fadeInVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {children}
      </motion.div>
    </div>
  );
}

// Form Error Summary Component
interface FormErrorSummaryProps {
  errors: Record<string, { message?: string }>;
  className?: string;
}

export function FormErrorSummary({ errors, className }: FormErrorSummaryProps) {
  const errorEntries = Object.entries(errors).filter(([, error]) => error?.message);

  if (errorEntries.length === 0) return null;

  return (
    <motion.div
      className={cn(
        'rounded-lg border border-error-200 bg-error-50 p-4',
        'dark:border-error-700 dark:bg-error-900/20',
        className
      )}
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      role="alert"
      aria-live="polite"
    >
      <h3 className="text-sm font-semibold text-error-800 dark:text-error-200 mb-2">
        Please correct the following errors:
      </h3>
      <ul className="text-sm text-error-700 dark:text-error-300 space-y-1">
        {errorEntries.map(([field, error]) => (
          <li key={field} className="flex items-start">
            <span className="mr-2">•</span>
            <span>{error.message}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// Form Success Message Component
interface FormSuccessProps {
  message: string;
  className?: string;
}

export function FormSuccess({ message, className }: FormSuccessProps) {
  return (
    <motion.div
      className={cn(
        'rounded-lg border border-success-200 bg-success-50 p-4',
        'dark:border-success-700 dark:bg-success-900/20',
        className
      )}
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
      role="status"
      aria-live="polite"
    >
      <p className="text-sm text-success-800 dark:text-success-200">
        {message}
      </p>
    </motion.div>
  );
}
