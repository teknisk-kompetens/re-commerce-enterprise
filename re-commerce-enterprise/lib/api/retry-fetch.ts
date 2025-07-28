
/**
 * CHUNK 1: ERROR HANDLING
 * Retry logic for API calls with exponential backoff
 */

import { logger } from '../error-handling/logger';

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  retryCondition?: (error: any) => boolean;
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryCondition: (error) => {
    // Retry on network errors and 5xx status codes
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  },
};

export async function retryFetch<T>(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<T> {
  const config = { ...defaultOptions, ...retryOptions };
  let lastError: any;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).response = response;
        throw error;
      }

      const data = await response.json();
      
      if (attempt > 0) {
        logger.info(`Request succeeded after ${attempt} retries`, {
          url,
          attempt,
          component: 'retry-fetch',
        });
      }

      return data;
    } catch (error) {
      lastError = error;
      
      if (attempt === config.maxRetries || !config.retryCondition(error)) {
        logger.error(`Request failed after ${attempt} attempts`, error as Error, {
          url,
          attempts: attempt + 1,
          component: 'retry-fetch',
        });
        throw error;
      }

      const delay = Math.min(
        config.baseDelay * Math.pow(config.backoffFactor, attempt),
        config.maxDelay
      );

      logger.warn(`Request failed, retrying in ${delay}ms`, {
        url,
        attempt: attempt + 1,
        delay,
        error: (error as Error).message,
        component: 'retry-fetch',
      });

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Specialized API client for widget factory
export class WidgetFactoryAPI {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async saveWidget(widgetData: any): Promise<any> {
    return retryFetch(`${this.baseUrl}/widgets`, {
      method: 'POST',
      body: JSON.stringify(widgetData),
    });
  }

  async updateWidget(id: string, widgetData: any): Promise<any> {
    return retryFetch(`${this.baseUrl}/widgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(widgetData),
    });
  }

  async deleteWidget(id: string): Promise<void> {
    return retryFetch(`${this.baseUrl}/widgets/${id}`, {
      method: 'DELETE',
    });
  }

  async getWidgets(tenantId: string): Promise<any[]> {
    return retryFetch(`${this.baseUrl}/widgets?tenantId=${tenantId}`);
  }
}

export const widgetAPI = new WidgetFactoryAPI();
