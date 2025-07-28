
/**
 * CHUNK 1: ERROR HANDLING
 * React Error Boundaries for comprehensive error catching
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from './logger';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  resetError: () => void;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Error Boundary caught an error', error, {
      component: 'ErrorBoundary',
      errorInfo: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
        />
      );
    }

    return this.props.children;
  }
}

// Default error fallback component
export function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-red-900 dark:text-red-100">
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            We encountered an unexpected error. Our team has been notified and is working on a fix.
          </p>
          
          {process.env.NODE_ENV === 'development' && error && (
            <details className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                Error Details
              </summary>
              <pre className="mt-2 text-xs text-red-600 dark:text-red-400 overflow-auto">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}
          
          <div className="flex gap-2">
            <Button onClick={resetError} className="flex-1">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Widget-specific error fallback
export function WidgetErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="w-full h-32 border-2 border-dashed border-red-300 dark:border-red-700 rounded-lg flex items-center justify-center bg-red-50 dark:bg-red-900/10">
      <div className="text-center space-y-2">
        <AlertTriangle className="h-6 w-6 text-red-500 mx-auto" />
        <p className="text-sm text-red-700 dark:text-red-400">Widget Error</p>
        <Button size="sm" variant="outline" onClick={resetError}>
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      </div>
    </div>
  );
}

// HOC for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<ErrorFallbackProps>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}
