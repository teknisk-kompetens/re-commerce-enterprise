
/**
 * CIRCUIT BREAKER SYSTEM
 * Fault tolerance, resilience patterns, and failure isolation
 */

import { EventEmitter } from 'events';
import { eventBus } from '@/lib/event-bus-system';
import { performance } from 'perf_hooks';

export interface CircuitBreakerConfig {
  name: string;
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  resetTimeout: number;
  monitoringPeriod: number;
  volumeThreshold: number;
  errorThresholdPercentage: number;
  slowCallDurationThreshold: number;
  slowCallRateThreshold: number;
  enabled: boolean;
}

export interface CircuitBreakerState {
  state: 'closed' | 'open' | 'half-open';
  failureCount: number;
  successCount: number;
  lastFailureTime: Date | null;
  lastSuccessTime: Date | null;
  nextAttemptTime: Date | null;
  totalCalls: number;
  slowCalls: number;
  callsInWindow: CallRecord[];
  metrics: CircuitBreakerMetrics;
}

export interface CallRecord {
  timestamp: Date;
  duration: number;
  success: boolean;
  error?: string;
}

export interface CircuitBreakerMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  rejectedRequests: number;
  averageResponseTime: number;
  failureRate: number;
  slowCallRate: number;
  lastStateChange: Date;
  stateChanges: StateChange[];
  resourceUtilization: number;
}

export interface StateChange {
  from: string;
  to: string;
  timestamp: Date;
  reason: string;
  metrics: any;
}

export interface BulkheadConfig {
  name: string;
  maxConcurrentCalls: number;
  maxWaitTime: number;
  queueCapacity: number;
  enabled: boolean;
}

export interface BulkheadState {
  activeCalls: number;
  queuedCalls: number;
  totalCalls: number;
  rejectedCalls: number;
  timeoutCalls: number;
  queue: QueuedCall[];
  metrics: BulkheadMetrics;
}

export interface QueuedCall {
  id: string;
  timestamp: Date;
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
}

export interface BulkheadMetrics {
  totalRequests: number;
  completedRequests: number;
  rejectedRequests: number;
  timeoutRequests: number;
  averageWaitTime: number;
  maxWaitTime: number;
  queueUtilization: number;
  resourceUtilization: number;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffStrategy: 'fixed' | 'linear' | 'exponential' | 'exponential-jitter';
  retryableErrors: string[];
  retryableStatusCodes: number[];
  enabled: boolean;
}

export interface RetryState {
  currentRetry: number;
  lastAttempt: Date;
  nextAttempt: Date;
  totalAttempts: number;
  success: boolean;
  error?: Error;
}

export class CircuitBreakerSystem extends EventEmitter {
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
  private circuitBreakerConfigs: Map<string, CircuitBreakerConfig> = new Map();
  private bulkheads: Map<string, BulkheadState> = new Map();
  private bulkheadConfigs: Map<string, BulkheadConfig> = new Map();
  private retryConfigs: Map<string, RetryConfig> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initializeCircuitBreakerSystem();
  }

  private async initializeCircuitBreakerSystem(): Promise<void> {
    await this.setupDefaultCircuitBreakers();
    await this.setupDefaultBulkheads();
    await this.setupDefaultRetryPolicies();
    await this.startMonitoring();
    console.log('Circuit Breaker System initialized');
  }

  /**
   * CIRCUIT BREAKER MANAGEMENT
   */
  private async setupDefaultCircuitBreakers(): Promise<void> {
    // Database circuit breaker
    await this.createCircuitBreaker('database', {
      name: 'Database Circuit Breaker',
      failureThreshold: 5,
      successThreshold: 3,
      timeout: 30000,
      resetTimeout: 60000,
      monitoringPeriod: 300000,
      volumeThreshold: 10,
      errorThresholdPercentage: 50,
      slowCallDurationThreshold: 5000,
      slowCallRateThreshold: 50,
      enabled: true
    });

    // External API circuit breaker
    await this.createCircuitBreaker('external_api', {
      name: 'External API Circuit Breaker',
      failureThreshold: 3,
      successThreshold: 2,
      timeout: 10000,
      resetTimeout: 30000,
      monitoringPeriod: 180000,
      volumeThreshold: 5,
      errorThresholdPercentage: 60,
      slowCallDurationThreshold: 2000,
      slowCallRateThreshold: 30,
      enabled: true
    });

    // Cache circuit breaker
    await this.createCircuitBreaker('cache', {
      name: 'Cache Circuit Breaker',
      failureThreshold: 2,
      successThreshold: 1,
      timeout: 5000,
      resetTimeout: 15000,
      monitoringPeriod: 60000,
      volumeThreshold: 20,
      errorThresholdPercentage: 25,
      slowCallDurationThreshold: 1000,
      slowCallRateThreshold: 10,
      enabled: true
    });
  }

  async createCircuitBreaker(name: string, config: CircuitBreakerConfig): Promise<void> {
    this.circuitBreakerConfigs.set(name, config);
    
    const state: CircuitBreakerState = {
      state: 'closed',
      failureCount: 0,
      successCount: 0,
      lastFailureTime: null,
      lastSuccessTime: null,
      nextAttemptTime: null,
      totalCalls: 0,
      slowCalls: 0,
      callsInWindow: [],
      metrics: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        rejectedRequests: 0,
        averageResponseTime: 0,
        failureRate: 0,
        slowCallRate: 0,
        lastStateChange: new Date(),
        stateChanges: [],
        resourceUtilization: 0
      }
    };

    this.circuitBreakers.set(name, state);
    
    this.emit('circuit_breaker_created', { name, config });
    eventBus.emit('circuit_breaker_created', { name, state: state.state });
  }

  async executeWithCircuitBreaker<T>(
    name: string,
    operation: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    const config = this.circuitBreakerConfigs.get(name);
    const state = this.circuitBreakers.get(name);
    
    if (!config || !state) {
      throw new Error(`Circuit breaker ${name} not found`);
    }

    if (!config.enabled) {
      return await operation();
    }

    // Check circuit breaker state
    const canExecute = await this.canExecute(name);
    if (!canExecute) {
      state.metrics.rejectedRequests++;
      
      if (fallback) {
        return await fallback();
      }
      
      throw new Error(`Circuit breaker ${name} is open`);
    }

    const startTime = performance.now();
    const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const result = await this.executeWithTimeout(operation, config.timeout);
      const duration = performance.now() - startTime;
      
      await this.recordSuccess(name, duration);
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      await this.recordFailure(name, duration, error as Error);
      
      if (fallback) {
        try {
          return await fallback();
        } catch (fallbackError) {
          throw error; // Throw original error if fallback fails
        }
      }
      
      throw error;
    }
  }

  private async canExecute(name: string): Promise<boolean> {
    const state = this.circuitBreakers.get(name);
    if (!state) return false;

    const now = Date.now();
    
    switch (state.state) {
      case 'closed':
        return true;
      
      case 'open':
        if (state.nextAttemptTime && now >= state.nextAttemptTime.getTime()) {
          await this.transitionToHalfOpen(name);
          return true;
        }
        return false;
      
      case 'half-open':
        return true;
      
      default:
        return false;
    }
  }

  private async executeWithTimeout<T>(
    operation: () => Promise<T>,
    timeout: number
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Operation timeout'));
      }, timeout);

      operation()
        .then(result => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }

  private async recordSuccess(name: string, duration: number): Promise<void> {
    const state = this.circuitBreakers.get(name);
    const config = this.circuitBreakerConfigs.get(name);
    
    if (!state || !config) return;

    const now = new Date();
    
    // Record call
    const callRecord: CallRecord = {
      timestamp: now,
      duration,
      success: true
    };
    
    state.callsInWindow.push(callRecord);
    state.totalCalls++;
    state.successCount++;
    state.lastSuccessTime = now;
    
    // Check if it's a slow call
    if (duration > config.slowCallDurationThreshold) {
      state.slowCalls++;
    }

    // Update metrics
    state.metrics.totalRequests++;
    state.metrics.successfulRequests++;
    state.metrics.averageResponseTime = 
      (state.metrics.averageResponseTime + duration) / 2;

    // State transitions
    if (state.state === 'half-open') {
      if (state.successCount >= config.successThreshold) {
        await this.transitionToClosed(name);
      }
    }

    // Clean old calls
    await this.cleanOldCalls(name);
    
    this.circuitBreakers.set(name, state);
    
    this.emit('circuit_breaker_success', { name, duration });
  }

  private async recordFailure(name: string, duration: number, error: Error): Promise<void> {
    const state = this.circuitBreakers.get(name);
    const config = this.circuitBreakerConfigs.get(name);
    
    if (!state || !config) return;

    const now = new Date();
    
    // Record call
    const callRecord: CallRecord = {
      timestamp: now,
      duration,
      success: false,
      error: error.message
    };
    
    state.callsInWindow.push(callRecord);
    state.totalCalls++;
    state.failureCount++;
    state.lastFailureTime = now;

    // Update metrics
    state.metrics.totalRequests++;
    state.metrics.failedRequests++;
    state.metrics.averageResponseTime = 
      (state.metrics.averageResponseTime + duration) / 2;

    // Check for state transitions
    await this.checkStateTransitions(name);
    
    // Clean old calls
    await this.cleanOldCalls(name);
    
    this.circuitBreakers.set(name, state);
    
    this.emit('circuit_breaker_failure', { name, duration, error: error.message });
  }

  private async checkStateTransitions(name: string): Promise<void> {
    const state = this.circuitBreakers.get(name);
    const config = this.circuitBreakerConfigs.get(name);
    
    if (!state || !config) return;

    const now = Date.now();
    const windowStart = now - config.monitoringPeriod;
    
    // Get calls in monitoring window
    const recentCalls = state.callsInWindow.filter(call => 
      call.timestamp.getTime() >= windowStart
    );

    if (recentCalls.length < config.volumeThreshold) {
      return; // Not enough volume to make decision
    }

    // Calculate failure rate
    const failedCalls = recentCalls.filter(call => !call.success);
    const failureRate = (failedCalls.length / recentCalls.length) * 100;
    
    // Calculate slow call rate
    const slowCalls = recentCalls.filter(call => 
      call.duration > config.slowCallDurationThreshold
    );
    const slowCallRate = (slowCalls.length / recentCalls.length) * 100;

    // Update metrics
    state.metrics.failureRate = failureRate;
    state.metrics.slowCallRate = slowCallRate;

    // Check for transition to open
    if (state.state === 'closed' || state.state === 'half-open') {
      const shouldOpen = failureRate >= config.errorThresholdPercentage || 
                        slowCallRate >= config.slowCallRateThreshold ||
                        state.failureCount >= config.failureThreshold;
      
      if (shouldOpen) {
        await this.transitionToOpen(name);
      }
    }
  }

  private async transitionToOpen(name: string): Promise<void> {
    const state = this.circuitBreakers.get(name);
    const config = this.circuitBreakerConfigs.get(name);
    
    if (!state || !config) return;

    const now = new Date();
    
    const stateChange: StateChange = {
      from: state.state,
      to: 'open',
      timestamp: now,
      reason: `Failure threshold exceeded`,
      metrics: { ...state.metrics }
    };

    state.state = 'open';
    state.nextAttemptTime = new Date(now.getTime() + config.resetTimeout);
    state.metrics.lastStateChange = now;
    state.metrics.stateChanges.push(stateChange);

    this.circuitBreakers.set(name, state);
    
    this.emit('circuit_breaker_opened', { name, reason: stateChange.reason });
    eventBus.emit('circuit_breaker_opened', { name, state: 'open' });
  }

  private async transitionToHalfOpen(name: string): Promise<void> {
    const state = this.circuitBreakers.get(name);
    
    if (!state) return;

    const now = new Date();
    
    const stateChange: StateChange = {
      from: state.state,
      to: 'half-open',
      timestamp: now,
      reason: 'Reset timeout expired',
      metrics: { ...state.metrics }
    };

    state.state = 'half-open';
    state.successCount = 0;
    state.failureCount = 0;
    state.nextAttemptTime = null;
    state.metrics.lastStateChange = now;
    state.metrics.stateChanges.push(stateChange);

    this.circuitBreakers.set(name, state);
    
    this.emit('circuit_breaker_half_opened', { name });
    eventBus.emit('circuit_breaker_half_opened', { name, state: 'half-open' });
  }

  private async transitionToClosed(name: string): Promise<void> {
    const state = this.circuitBreakers.get(name);
    
    if (!state) return;

    const now = new Date();
    
    const stateChange: StateChange = {
      from: state.state,
      to: 'closed',
      timestamp: now,
      reason: 'Success threshold reached',
      metrics: { ...state.metrics }
    };

    state.state = 'closed';
    state.successCount = 0;
    state.failureCount = 0;
    state.metrics.lastStateChange = now;
    state.metrics.stateChanges.push(stateChange);

    this.circuitBreakers.set(name, state);
    
    this.emit('circuit_breaker_closed', { name });
    eventBus.emit('circuit_breaker_closed', { name, state: 'closed' });
  }

  private async cleanOldCalls(name: string): Promise<void> {
    const state = this.circuitBreakers.get(name);
    const config = this.circuitBreakerConfigs.get(name);
    
    if (!state || !config) return;

    const now = Date.now();
    const windowStart = now - config.monitoringPeriod;
    
    state.callsInWindow = state.callsInWindow.filter(call => 
      call.timestamp.getTime() >= windowStart
    );
  }

  /**
   * BULKHEAD PATTERN
   */
  private async setupDefaultBulkheads(): Promise<void> {
    // Database bulkhead
    await this.createBulkhead('database', {
      name: 'Database Bulkhead',
      maxConcurrentCalls: 10,
      maxWaitTime: 30000,
      queueCapacity: 50,
      enabled: true
    });

    // External API bulkhead
    await this.createBulkhead('external_api', {
      name: 'External API Bulkhead',
      maxConcurrentCalls: 5,
      maxWaitTime: 10000,
      queueCapacity: 20,
      enabled: true
    });
  }

  async createBulkhead(name: string, config: BulkheadConfig): Promise<void> {
    this.bulkheadConfigs.set(name, config);
    
    const state: BulkheadState = {
      activeCalls: 0,
      queuedCalls: 0,
      totalCalls: 0,
      rejectedCalls: 0,
      timeoutCalls: 0,
      queue: [],
      metrics: {
        totalRequests: 0,
        completedRequests: 0,
        rejectedRequests: 0,
        timeoutRequests: 0,
        averageWaitTime: 0,
        maxWaitTime: 0,
        queueUtilization: 0,
        resourceUtilization: 0
      }
    };

    this.bulkheads.set(name, state);
    
    this.emit('bulkhead_created', { name, config });
  }

  async executeWithBulkhead<T>(
    name: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const config = this.bulkheadConfigs.get(name);
    const state = this.bulkheads.get(name);
    
    if (!config || !state) {
      throw new Error(`Bulkhead ${name} not found`);
    }

    if (!config.enabled) {
      return await operation();
    }

    const startTime = performance.now();
    
    // Check if we can execute immediately
    if (state.activeCalls < config.maxConcurrentCalls) {
      return await this.executeImmediately(name, operation, startTime);
    }

    // Check if we can queue
    if (state.queue.length >= config.queueCapacity) {
      state.rejectedCalls++;
      state.metrics.rejectedRequests++;
      throw new Error(`Bulkhead ${name} queue is full`);
    }

    // Queue the call
    return await this.queueCall(name, operation, startTime);
  }

  private async executeImmediately<T>(
    name: string,
    operation: () => Promise<T>,
    startTime: number
  ): Promise<T> {
    const state = this.bulkheads.get(name);
    if (!state) throw new Error(`Bulkhead ${name} not found`);

    state.activeCalls++;
    state.totalCalls++;
    state.metrics.totalRequests++;

    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      state.metrics.completedRequests++;
      state.metrics.averageWaitTime = 
        (state.metrics.averageWaitTime + duration) / 2;
      
      return result;
    } catch (error) {
      throw error;
    } finally {
      state.activeCalls--;
      await this.processQueue(name);
    }
  }

  private async queueCall<T>(
    name: string,
    operation: () => Promise<T>,
    startTime: number
  ): Promise<T> {
    const config = this.bulkheadConfigs.get(name);
    const state = this.bulkheads.get(name);
    
    if (!config || !state) {
      throw new Error(`Bulkhead ${name} not found`);
    }

    return new Promise((resolve, reject) => {
      const callId = `call_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const timeout = setTimeout(() => {
        // Remove from queue
        const index = state.queue.findIndex(call => call.id === callId);
        if (index > -1) {
          state.queue.splice(index, 1);
        }
        
        state.timeoutCalls++;
        state.metrics.timeoutRequests++;
        
        reject(new Error(`Bulkhead ${name} call timeout`));
      }, config.maxWaitTime);

      const queuedCall: QueuedCall = {
        id: callId,
        timestamp: new Date(),
        resolve: async (value: any) => {
          clearTimeout(timeout);
          try {
            const result = await operation();
            const duration = performance.now() - startTime;
            
            state.metrics.completedRequests++;
            state.metrics.averageWaitTime = 
              (state.metrics.averageWaitTime + duration) / 2;
            
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            state.activeCalls--;
            await this.processQueue(name);
          }
        },
        reject,
        timeout
      };

      state.queue.push(queuedCall);
      state.queuedCalls++;
    });
  }

  private async processQueue(name: string): Promise<void> {
    const config = this.bulkheadConfigs.get(name);
    const state = this.bulkheads.get(name);
    
    if (!config || !state || state.queue.length === 0) {
      return;
    }

    while (state.activeCalls < config.maxConcurrentCalls && state.queue.length > 0) {
      const queuedCall = state.queue.shift();
      if (queuedCall) {
        state.activeCalls++;
        state.queuedCalls--;
        queuedCall.resolve(undefined);
      }
    }
  }

  /**
   * RETRY PATTERN
   */
  private async setupDefaultRetryPolicies(): Promise<void> {
    // Database retry policy
    this.retryConfigs.set('database', {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffStrategy: 'exponential',
      retryableErrors: ['connection_error', 'timeout', 'deadlock'],
      retryableStatusCodes: [503, 504, 429],
      enabled: true
    });

    // External API retry policy
    this.retryConfigs.set('external_api', {
      maxRetries: 5,
      baseDelay: 500,
      maxDelay: 5000,
      backoffStrategy: 'exponential-jitter',
      retryableErrors: ['network_error', 'timeout'],
      retryableStatusCodes: [429, 502, 503, 504],
      enabled: true
    });
  }

  async executeWithRetry<T>(
    name: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const config = this.retryConfigs.get(name);
    
    if (!config || !config.enabled) {
      return await operation();
    }

    const state: RetryState = {
      currentRetry: 0,
      lastAttempt: new Date(),
      nextAttempt: new Date(),
      totalAttempts: 0,
      success: false
    };

    while (state.currentRetry <= config.maxRetries) {
      try {
        const result = await operation();
        state.success = true;
        
        this.emit('retry_success', { 
          name, 
          attempt: state.currentRetry,
          totalAttempts: state.totalAttempts 
        });
        
        return result;
      } catch (error) {
        state.error = error as Error;
        state.totalAttempts++;
        
        if (state.currentRetry >= config.maxRetries) {
          this.emit('retry_exhausted', { 
            name, 
            attempts: state.totalAttempts,
            error: (error as Error).message
          });
          throw error;
        }

        if (!this.isRetryableError(error as Error, config)) {
          this.emit('retry_non_retryable', { 
            name, 
            error: (error as Error).message 
          });
          throw error;
        }

        const delay = this.calculateDelay(state.currentRetry, config);
        
        this.emit('retry_attempt', { 
          name, 
          attempt: state.currentRetry,
          delay,
          error: (error as Error).message
        });

        await this.sleep(delay);
        
        state.currentRetry++;
        state.lastAttempt = new Date();
      }
    }

    throw state.error;
  }

  private isRetryableError(error: Error, config: RetryConfig): boolean {
    return config.retryableErrors.some(retryableError => 
      error.message.includes(retryableError) || 
      error.name.includes(retryableError)
    );
  }

  private calculateDelay(attempt: number, config: RetryConfig): number {
    let delay: number;
    
    switch (config.backoffStrategy) {
      case 'fixed':
        delay = config.baseDelay;
        break;
      case 'linear':
        delay = config.baseDelay * (attempt + 1);
        break;
      case 'exponential':
        delay = config.baseDelay * Math.pow(2, attempt);
        break;
      case 'exponential-jitter':
        delay = config.baseDelay * Math.pow(2, attempt);
        delay += Math.random() * 1000; // Add jitter
        break;
      default:
        delay = config.baseDelay;
    }
    
    return Math.min(delay, config.maxDelay);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * MONITORING
   */
  private async startMonitoring(): Promise<void> {
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, 30000); // Every 30 seconds
  }

  private async collectMetrics(): Promise<void> {
    // Update circuit breaker metrics
    for (const [name, state] of this.circuitBreakers) {
      const config = this.circuitBreakerConfigs.get(name);
      if (!config) continue;

      // Update utilization metrics
      state.metrics.resourceUtilization = 
        (state.metrics.totalRequests / (state.metrics.totalRequests + state.metrics.rejectedRequests)) * 100;
    }

    // Update bulkhead metrics
    for (const [name, state] of this.bulkheads) {
      const config = this.bulkheadConfigs.get(name);
      if (!config) continue;

      state.metrics.queueUtilization = 
        (state.queue.length / config.queueCapacity) * 100;
      state.metrics.resourceUtilization = 
        (state.activeCalls / config.maxConcurrentCalls) * 100;
    }

    this.emit('metrics_collected', {
      circuitBreakers: this.circuitBreakers.size,
      bulkheads: this.bulkheads.size,
      retryPolicies: this.retryConfigs.size
    });
  }

  /**
   * PUBLIC API
   */
  async getSystemMetrics(): Promise<{
    circuitBreakers: { name: string; state: string; metrics: CircuitBreakerMetrics }[];
    bulkheads: { name: string; metrics: BulkheadMetrics }[];
    retryPolicies: { name: string; config: RetryConfig }[];
  }> {
    const circuitBreakers = Array.from(this.circuitBreakers.entries()).map(([name, state]) => ({
      name,
      state: state.state,
      metrics: state.metrics
    }));

    const bulkheads = Array.from(this.bulkheads.entries()).map(([name, state]) => ({
      name,
      metrics: state.metrics
    }));

    const retryPolicies = Array.from(this.retryConfigs.entries()).map(([name, config]) => ({
      name,
      config
    }));

    return {
      circuitBreakers,
      bulkheads,
      retryPolicies
    };
  }

  async resetCircuitBreaker(name: string): Promise<void> {
    const state = this.circuitBreakers.get(name);
    if (!state) {
      throw new Error(`Circuit breaker ${name} not found`);
    }

    await this.transitionToClosed(name);
    
    this.emit('circuit_breaker_reset', { name });
  }

  async updateCircuitBreakerConfig(name: string, config: Partial<CircuitBreakerConfig>): Promise<void> {
    const existingConfig = this.circuitBreakerConfigs.get(name);
    if (!existingConfig) {
      throw new Error(`Circuit breaker ${name} not found`);
    }

    const updatedConfig = { ...existingConfig, ...config };
    this.circuitBreakerConfigs.set(name, updatedConfig);
    
    this.emit('circuit_breaker_config_updated', { name, config: updatedConfig });
  }

  // Cleanup
  async cleanup(): Promise<void> {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    
    // Clear all queued calls
    for (const state of this.bulkheads.values()) {
      for (const call of state.queue) {
        clearTimeout(call.timeout);
        call.reject(new Error('System shutdown'));
      }
    }
  }
}

// Export singleton instance
export const circuitBreakerSystem = new CircuitBreakerSystem();
