
/**
 * INTELLIGENT LOAD BALANCER
 * Advanced load balancing with health checks, failover, and performance optimization
 */

import { EventEmitter } from 'events';
import { eventBus } from '@/lib/event-bus-system';
import { performance } from 'perf_hooks';

export interface LoadBalancerNode {
  id: string;
  host: string;
  port: number;
  weight: number;
  healthy: boolean;
  connections: number;
  maxConnections: number;
  responseTime: number;
  cpuUsage: number;
  memoryUsage: number;
  lastHealthCheck: Date;
  metadata: Record<string, any>;
}

export interface LoadBalancingStrategy {
  name: string;
  algorithm: 'round_robin' | 'weighted_round_robin' | 'least_connections' | 'least_response_time' | 'ip_hash' | 'consistent_hash';
  config: any;
}

export interface HealthCheckConfig {
  interval: number;
  timeout: number;
  retries: number;
  path: string;
  method: string;
  expectedStatus: number;
  headers?: Record<string, string>;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
  enabled: boolean;
}

export interface LoadBalancerMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  throughput: number;
  activeConnections: number;
  healthyNodes: number;
  unhealthyNodes: number;
  circuitBreakerTrips: number;
}

export interface RequestContext {
  id: string;
  clientIp: string;
  userAgent: string;
  headers: Record<string, string>;
  timestamp: Date;
  sessionId?: string;
  userId?: string;
}

export class IntelligentLoadBalancer extends EventEmitter {
  private nodes: Map<string, LoadBalancerNode> = new Map();
  private strategy: LoadBalancingStrategy;
  private healthCheckConfig: HealthCheckConfig;
  private circuitBreakerConfig: CircuitBreakerConfig;
  private metrics: LoadBalancerMetrics;
  private circuitBreakers: Map<string, any> = new Map();
  private requestCounter: number = 0;
  private lastSelectedNode: string | null = null;
  private consistentHashRing: any[] = [];
  private sessionStore: Map<string, string> = new Map();

  constructor(
    strategy: LoadBalancingStrategy,
    healthCheckConfig: HealthCheckConfig,
    circuitBreakerConfig: CircuitBreakerConfig
  ) {
    super();
    this.strategy = strategy;
    this.healthCheckConfig = healthCheckConfig;
    this.circuitBreakerConfig = circuitBreakerConfig;
    this.metrics = this.initializeMetrics();
    this.initializeLoadBalancer();
  }

  private initializeMetrics(): LoadBalancerMetrics {
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      throughput: 0,
      activeConnections: 0,
      healthyNodes: 0,
      unhealthyNodes: 0,
      circuitBreakerTrips: 0
    };
  }

  private async initializeLoadBalancer(): Promise<void> {
    // Start health checks
    this.startHealthChecks();
    
    // Start metrics collection
    this.startMetricsCollection();
    
    // Setup circuit breaker monitoring
    this.setupCircuitBreakerMonitoring();
    
    console.log('Intelligent Load Balancer initialized');
  }

  /**
   * NODE MANAGEMENT
   */
  async addNode(node: Omit<LoadBalancerNode, 'healthy' | 'connections' | 'responseTime' | 'cpuUsage' | 'memoryUsage' | 'lastHealthCheck'>): Promise<void> {
    const fullNode: LoadBalancerNode = {
      ...node,
      healthy: true,
      connections: 0,
      responseTime: 0,
      cpuUsage: 0,
      memoryUsage: 0,
      lastHealthCheck: new Date()
    };

    this.nodes.set(node.id, fullNode);
    
    // Initialize circuit breaker for the node
    if (this.circuitBreakerConfig.enabled) {
      await this.initializeCircuitBreaker(node.id);
    }

    // Update consistent hash ring if using consistent hashing
    if (this.strategy.algorithm === 'consistent_hash') {
      await this.updateConsistentHashRing();
    }

    // Start immediate health check
    await this.performHealthCheck(node.id);
    
    this.emit('node_added', { nodeId: node.id, host: node.host });
    eventBus.emit('load_balancer_node_added', { nodeId: node.id });
  }

  async removeNode(nodeId: string): Promise<void> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    // Wait for active connections to finish
    await this.drainConnections(nodeId);
    
    // Remove from nodes
    this.nodes.delete(nodeId);
    
    // Remove circuit breaker
    this.circuitBreakers.delete(nodeId);
    
    // Update consistent hash ring
    if (this.strategy.algorithm === 'consistent_hash') {
      await this.updateConsistentHashRing();
    }

    this.emit('node_removed', { nodeId, host: node.host });
    eventBus.emit('load_balancer_node_removed', { nodeId });
  }

  async updateNode(nodeId: string, updates: Partial<LoadBalancerNode>): Promise<void> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    const updatedNode = { ...node, ...updates };
    this.nodes.set(nodeId, updatedNode);
    
    // Update consistent hash ring if weight changed
    if (updates.weight && this.strategy.algorithm === 'consistent_hash') {
      await this.updateConsistentHashRing();
    }

    this.emit('node_updated', { nodeId, updates });
  }

  /**
   * LOAD BALANCING ALGORITHMS
   */
  async selectNode(context: RequestContext): Promise<LoadBalancerNode | null> {
    const startTime = performance.now();
    
    try {
      // Get healthy nodes
      const healthyNodes = Array.from(this.nodes.values())
        .filter(node => node.healthy && !this.isCircuitBreakerOpen(node.id));

      if (healthyNodes.length === 0) {
        throw new Error('No healthy nodes available');
      }

      let selectedNode: LoadBalancerNode | null = null;

      // Apply load balancing algorithm
      switch (this.strategy.algorithm) {
        case 'round_robin':
          selectedNode = this.roundRobinSelection(healthyNodes);
          break;
        case 'weighted_round_robin':
          selectedNode = this.weightedRoundRobinSelection(healthyNodes);
          break;
        case 'least_connections':
          selectedNode = this.leastConnectionsSelection(healthyNodes);
          break;
        case 'least_response_time':
          selectedNode = this.leastResponseTimeSelection(healthyNodes);
          break;
        case 'ip_hash':
          selectedNode = this.ipHashSelection(healthyNodes, context.clientIp);
          break;
        case 'consistent_hash':
          selectedNode = this.consistentHashSelection(healthyNodes, context.clientIp);
          break;
        default:
          selectedNode = this.roundRobinSelection(healthyNodes);
      }

      if (selectedNode) {
        // Update node connections
        selectedNode.connections++;
        this.nodes.set(selectedNode.id, selectedNode);
        
        // Update metrics
        this.metrics.totalRequests++;
        this.metrics.activeConnections++;
        
        // Track session if needed
        if (context.sessionId) {
          this.sessionStore.set(context.sessionId, selectedNode.id);
        }
      }

      const selectionTime = performance.now() - startTime;
      this.emit('node_selected', { 
        nodeId: selectedNode?.id, 
        algorithm: this.strategy.algorithm,
        selectionTime,
        context 
      });

      return selectedNode;
    } catch (error) {
      this.metrics.failedRequests++;
      this.emit('node_selection_failed', { error: error instanceof Error ? error.message : 'Unknown error', context });
      throw error;
    }
  }

  private roundRobinSelection(nodes: LoadBalancerNode[]): LoadBalancerNode {
    const index = this.requestCounter % nodes.length;
    this.requestCounter++;
    return nodes[index];
  }

  private weightedRoundRobinSelection(nodes: LoadBalancerNode[]): LoadBalancerNode {
    const totalWeight = nodes.reduce((sum, node) => sum + node.weight, 0);
    const random = Math.random() * totalWeight;
    
    let currentWeight = 0;
    for (const node of nodes) {
      currentWeight += node.weight;
      if (random <= currentWeight) {
        return node;
      }
    }
    
    return nodes[0];
  }

  private leastConnectionsSelection(nodes: LoadBalancerNode[]): LoadBalancerNode {
    return nodes.reduce((min, node) => 
      node.connections < min.connections ? node : min
    );
  }

  private leastResponseTimeSelection(nodes: LoadBalancerNode[]): LoadBalancerNode {
    return nodes.reduce((min, node) => 
      node.responseTime < min.responseTime ? node : min
    );
  }

  private ipHashSelection(nodes: LoadBalancerNode[], clientIp: string): LoadBalancerNode {
    const hash = this.simpleHash(clientIp);
    const index = hash % nodes.length;
    return nodes[index];
  }

  private consistentHashSelection(nodes: LoadBalancerNode[], clientIp: string): LoadBalancerNode {
    const hash = this.simpleHash(clientIp);
    
    // Find the first node in the ring with hash >= client hash
    for (const ringNode of this.consistentHashRing) {
      if (ringNode.hash >= hash) {
        return nodes.find(n => n.id === ringNode.nodeId) || nodes[0];
      }
    }
    
    // If no node found, use the first node in the ring
    return nodes.find(n => n.id === this.consistentHashRing[0].nodeId) || nodes[0];
  }

  /**
   * HEALTH CHECKS
   */
  private startHealthChecks(): void {
    setInterval(() => {
      this.performHealthChecks();
    }, this.healthCheckConfig.interval);
  }

  private async performHealthChecks(): Promise<void> {
    const healthCheckPromises = Array.from(this.nodes.keys()).map(nodeId => 
      this.performHealthCheck(nodeId)
    );
    
    await Promise.all(healthCheckPromises);
  }

  private async performHealthCheck(nodeId: string): Promise<void> {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    const startTime = performance.now();
    
    try {
      // Perform health check
      const isHealthy = await this.checkNodeHealth(node);
      const responseTime = performance.now() - startTime;
      
      // Update node status
      node.healthy = isHealthy;
      node.responseTime = responseTime;
      node.lastHealthCheck = new Date();
      
      // Update node metrics
      await this.updateNodeMetrics(node);
      
      this.nodes.set(nodeId, node);
      
      // Emit health check event
      this.emit('health_check_completed', { 
        nodeId, 
        healthy: isHealthy, 
        responseTime 
      });
      
      // Update circuit breaker
      if (this.circuitBreakerConfig.enabled) {
        await this.updateCircuitBreaker(nodeId, isHealthy);
      }
      
    } catch (error) {
      // Mark node as unhealthy
      node.healthy = false;
      node.lastHealthCheck = new Date();
      this.nodes.set(nodeId, node);
      
      this.emit('health_check_failed', { 
        nodeId, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  private async checkNodeHealth(node: LoadBalancerNode): Promise<boolean> {
    try {
      const url = `http://${node.host}:${node.port}${this.healthCheckConfig.path}`;
      const response = await fetch(url, {
        method: this.healthCheckConfig.method,
        headers: this.healthCheckConfig.headers,
        signal: AbortSignal.timeout(this.healthCheckConfig.timeout)
      });
      
      return response.status === this.healthCheckConfig.expectedStatus;
    } catch (error) {
      return false;
    }
  }

  private async updateNodeMetrics(node: LoadBalancerNode): Promise<void> {
    // Mock implementation - in production this would gather real metrics
    node.cpuUsage = Math.random() * 100;
    node.memoryUsage = Math.random() * 100;
  }

  /**
   * CIRCUIT BREAKER
   */
  private async initializeCircuitBreaker(nodeId: string): Promise<void> {
    this.circuitBreakers.set(nodeId, {
      state: 'closed', // closed, open, half-open
      failures: 0,
      lastFailureTime: null,
      nextAttemptTime: null,
      successCount: 0
    });
  }

  private async updateCircuitBreaker(nodeId: string, success: boolean): Promise<void> {
    const breaker = this.circuitBreakers.get(nodeId);
    if (!breaker) return;

    const now = Date.now();

    if (success) {
      breaker.failures = 0;
      breaker.successCount++;
      
      if (breaker.state === 'half-open' && breaker.successCount >= 3) {
        breaker.state = 'closed';
        this.emit('circuit_breaker_closed', { nodeId });
      }
    } else {
      breaker.failures++;
      breaker.lastFailureTime = now;
      
      if (breaker.failures >= this.circuitBreakerConfig.failureThreshold) {
        breaker.state = 'open';
        breaker.nextAttemptTime = now + this.circuitBreakerConfig.resetTimeout;
        this.metrics.circuitBreakerTrips++;
        
        this.emit('circuit_breaker_opened', { nodeId });
        eventBus.emit('circuit_breaker_opened', { nodeId, failures: breaker.failures });
      }
    }

    // Check if we should transition from open to half-open
    if (breaker.state === 'open' && now >= breaker.nextAttemptTime) {
      breaker.state = 'half-open';
      breaker.successCount = 0;
      this.emit('circuit_breaker_half_open', { nodeId });
    }

    this.circuitBreakers.set(nodeId, breaker);
  }

  private isCircuitBreakerOpen(nodeId: string): boolean {
    const breaker = this.circuitBreakers.get(nodeId);
    return breaker?.state === 'open';
  }

  private setupCircuitBreakerMonitoring(): void {
    setInterval(() => {
      this.monitorCircuitBreakers();
    }, this.circuitBreakerConfig.monitoringPeriod);
  }

  private async monitorCircuitBreakers(): Promise<void> {
    for (const [nodeId, breaker] of this.circuitBreakers) {
      if (breaker.state === 'open') {
        const now = Date.now();
        if (now >= breaker.nextAttemptTime) {
          breaker.state = 'half-open';
          breaker.successCount = 0;
          this.emit('circuit_breaker_half_open', { nodeId });
        }
      }
    }
  }

  /**
   * METRICS AND MONITORING
   */
  private startMetricsCollection(): void {
    setInterval(() => {
      this.collectMetrics();
    }, 30000); // Collect every 30 seconds
  }

  private async collectMetrics(): Promise<void> {
    const nodes = Array.from(this.nodes.values());
    
    // Update node counts
    this.metrics.healthyNodes = nodes.filter(n => n.healthy).length;
    this.metrics.unhealthyNodes = nodes.filter(n => !n.healthy).length;
    
    // Calculate average response time
    const totalResponseTime = nodes.reduce((sum, node) => sum + node.responseTime, 0);
    this.metrics.averageResponseTime = nodes.length > 0 ? totalResponseTime / nodes.length : 0;
    
    // Calculate throughput
    const now = Date.now();
    this.metrics.throughput = this.metrics.totalRequests / ((now - this.startTime) / 1000);
    
    // Active connections
    this.metrics.activeConnections = nodes.reduce((sum, node) => sum + node.connections, 0);
    
    this.emit('metrics_collected', this.metrics);
  }

  /**
   * CONNECTION MANAGEMENT
   */
  async releaseConnection(nodeId: string, context: RequestContext): Promise<void> {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    // Decrement connections
    node.connections = Math.max(0, node.connections - 1);
    this.nodes.set(nodeId, node);
    
    // Update metrics
    this.metrics.activeConnections--;
    this.metrics.successfulRequests++;
    
    this.emit('connection_released', { nodeId, context });
  }

  private async drainConnections(nodeId: string): Promise<void> {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    // Wait for active connections to finish
    let attempts = 0;
    while (node.connections > 0 && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    
    if (node.connections > 0) {
      console.warn(`Node ${nodeId} still has ${node.connections} active connections after drain timeout`);
    }
  }

  /**
   * UTILITY METHODS
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private async updateConsistentHashRing(): Promise<void> {
    this.consistentHashRing = [];
    
    for (const node of this.nodes.values()) {
      // Create virtual nodes based on weight
      const virtualNodes = node.weight * 100;
      
      for (let i = 0; i < virtualNodes; i++) {
        const hash = this.simpleHash(`${node.id}-${i}`);
        this.consistentHashRing.push({
          nodeId: node.id,
          hash
        });
      }
    }
    
    // Sort by hash value
    this.consistentHashRing.sort((a, b) => a.hash - b.hash);
  }

  private startTime = Date.now();

  /**
   * PUBLIC API
   */
  getMetrics(): LoadBalancerMetrics {
    return { ...this.metrics };
  }

  getNodes(): LoadBalancerNode[] {
    return Array.from(this.nodes.values());
  }

  getHealthyNodes(): LoadBalancerNode[] {
    return Array.from(this.nodes.values()).filter(node => node.healthy);
  }

  getCircuitBreakerStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    
    for (const [nodeId, breaker] of this.circuitBreakers) {
      status[nodeId] = {
        state: breaker.state,
        failures: breaker.failures,
        successCount: breaker.successCount
      };
    }
    
    return status;
  }

  async updateStrategy(strategy: LoadBalancingStrategy): Promise<void> {
    this.strategy = strategy;
    
    // Update consistent hash ring if needed
    if (strategy.algorithm === 'consistent_hash') {
      await this.updateConsistentHashRing();
    }
    
    this.emit('strategy_updated', { strategy });
  }
}

// Export factory function
export function createLoadBalancer(
  strategy: LoadBalancingStrategy = {
    name: 'default',
    algorithm: 'round_robin',
    config: {}
  },
  healthCheckConfig: HealthCheckConfig = {
    interval: 30000,
    timeout: 5000,
    retries: 3,
    path: '/health',
    method: 'GET',
    expectedStatus: 200
  },
  circuitBreakerConfig: CircuitBreakerConfig = {
    failureThreshold: 5,
    resetTimeout: 30000,
    monitoringPeriod: 10000,
    enabled: true
  }
): IntelligentLoadBalancer {
  return new IntelligentLoadBalancer(strategy, healthCheckConfig, circuitBreakerConfig);
}
