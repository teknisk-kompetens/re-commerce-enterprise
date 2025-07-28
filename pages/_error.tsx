
/**
 * CHUNK 1: ERROR HANDLING
 * Custom error page with logging
 */

import React from 'react';
import { NextPageContext } from 'next';
import { logger } from '@/lib/error-handling/logger';
import { DefaultErrorFallback } from '@/lib/error-handling/error-boundary';

interface ErrorProps {
  statusCode?: number;
  hasGetInitialPropsRun?: boolean;
  err?: Error;
}

function ErrorPage({ statusCode, hasGetInitialPropsRun, err }: ErrorProps) {
  if (!hasGetInitialPropsRun && err) {
    logger.error('Client-side error occurred', err, {
      component: 'ErrorPage',
      statusCode,
    });
  }

  return (
    <DefaultErrorFallback
      error={err}
      resetError={() => {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }}
    />
  );
}

ErrorPage.getInitialProps = async ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  if (err) {
    logger.error('Server-side error occurred', err, {
      component: 'ErrorPage',
      statusCode,
    });
  }

  return {
    statusCode,
    hasGetInitialPropsRun: true,
  };
};

export default ErrorPage;
