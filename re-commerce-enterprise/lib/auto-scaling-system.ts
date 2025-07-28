
/**
 * AUTO-SCALING SYSTEM
 * Intelligent scaling based on metrics, predictive analysis, and resource optimization
 */

import { EventEmitter } from 'events';
import { eventBus } from '@/lib/event-bus-system';
import { performance } from 'perf_hooks';

export interface ScalingMetric {
  name: string;
  value: number;
  threshold: number;
  weight: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  timestamp: Date;
}

export interface ScalingRule {
  id: string;
  name: string;
  type: 'scale_up' | 'scale_down';
  conditions: ScalingCondition[];
  action: ScalingAction;
  cooldown: number;
  enabled: boolean;
  priority: number;
  lastTriggered?: Date;
}

export interface ScalingCondition {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  value: number;
  duration: number;
  aggregation: 'avg' | 'max' | 'min' | 'sum';
}

export interface ScalingAction {
  type: 'add_instances' | 'remove_instances' | 'update_resources' | 'custom';
  parameters: {
    count?: number;
    instanceType?: string;
    resourceType?: string;
    resourceValue?: number;
    customFunction?: () => Promise<void>;
  };
}

export interface ResourcePool {
  id: string;
  name: string;
  type: 'compute' | 'memory' | 'storage' | 'network';
  current: number;
  min: number;
  max: number;
  target: number;
  utilization: number;
  cost: number;
  instances: ScalingInstance[];
}

export interface ScalingInstance {
  id: string;
  type: string;
  status: 'starting' | 'running' | 'stopping' | 'stopped' | 'failed';
  metrics: Record<string, number>;
  cost: number;
  createdAt: Date;
  lastUpdated: Date;
}

export interface PredictiveModel {
  id: string;
  name: string;
  type: 'linear' | 'exponential' | 'seasonal' | 'ml';
  accuracy: number;
  lastTrained: Date;
  predictions: PredictionPoint[];
}

export interface PredictionPoint {
  timestamp: Date;
  metric: string;
  predictedValue: number;
  confidence: number;
  actualValue?: number;
}

export interface ScalingEvent {
  id: string;
  type: 'scale_up' | 'scale_down' | 'prediction' | 'optimization';
  trigger: string;
  timestamp: Date;
  details: any;
  success: boolean;
  duration: number;
}

export class AutoScalingSystem extends EventEmitter {
  private metrics: Map<string, ScalingMetric[]> = new Map();
  private rules: Map<string, ScalingRule> = new Map();
  private resourcePools: Map<string, ResourcePool> = new Map();
  private predictiveModels: Map<string, PredictiveModel> = new Map();
  private scalingEvents: ScalingEvent[] = [];
  private isScalingInProgress: boolean = false;
  private metricCollectionInterval: NodeJS.Timeout | null = null;
  private predictionInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.initializeAutoScaling();
  }

  private async initializeAutoScaling(): Promise<void> {
    await this.setupDefaultResourcePools();
    await this.setupDefaultScalingRules();
    await this.setupPredictiveModels();
    await this.startMetricCollection();
    await this.startPredictiveAnalysis();
    console.log('Auto-scaling system initialized');
  }

  /**
   * RESOURCE POOL MANAGEMENT
   */
  private async setupDefaultResourcePools(): Promise<void> {
    // Compute pool
    await this.createResourcePool({
      id: 'compute',
      name: 'Compute Instances',
      type: 'compute',
      current: 3,
      min: 2,
      max: 20,
      target: 3,
      utilization: 0,
      cost: 0,
      instances: []
    });

    // Memory pool
    await this.createResourcePool({
      id: 'memory',
      name: 'Memory Resources',
      type: 'memory',
      current: 8192, // MB
      min: 4096,
      max: 32768,
      target: 8192,
      utilization: 0,
      cost: 0,
      instances: []
    });

    // Storage pool
    await this.createResourcePool({
      id: 'storage',
      name: 'Storage Resources',
      type: 'storage',
      current: 100, // GB
      min: 50,
      max: 1000,
      target: 100,
      utilization: 0,
      cost: 0,
      instances: []
    });
  }

  async createResourcePool(pool: ResourcePool): Promise<void> {
    this.resourcePools.set(pool.id, pool);
    this.emit('resource_pool_created', { poolId: pool.id });
    eventBus.emit('resource_pool_created', { poolId: pool.id, type: pool.type });
  }

  async updateResourcePool(poolId: string, updates: Partial<ResourcePool>): Promise<void> {
    const pool = this.resourcePools.get(poolId);
    if (!pool) {
      throw new Error(`Resource pool ${poolId} not found`);
    }

    const updatedPool = { ...pool, ...updates };
    this.resourcePools.set(poolId, updatedPool);
    
    this.emit('resource_pool_updated', { poolId, updates });
  }

  /**
   * SCALING RULES MANAGEMENT
   */
  private async setupDefaultScalingRules(): Promise<void> {
    // CPU scale-up rule
    await this.createScalingRule({
      id: 'cpu_scale_up',
      name: 'CPU Scale Up',
      type: 'scale_up',
      conditions: [{
        metric: 'cpu_utilization',
        operator: 'gt',
        value: 80,
        duration: 300000, // 5 minutes
        aggregation: 'avg'
      }],
      action: {
        type: 'add_instances',
        parameters: {
          count: 2,
          instanceType: 'standard'
        }
      },
      cooldown: 600000, // 10 minutes
      enabled: true,
      priority: 9
    });

    // CPU scale-down rule
    await this.createScalingRule({
      id: 'cpu_scale_down',
      name: 'CPU Scale Down',
      type: 'scale_down',
      conditions: [{
        metric: 'cpu_utilization',
        operator: 'lt',
        value: 30,
        duration: 600000, // 10 minutes
        aggregation: 'avg'
      }],
      action: {
        type: 'remove_instances',
        parameters: {
          count: 1
        }
      },
      cooldown: 300000, // 5 minutes
      enabled: true,
      priority: 7
    });

    // Memory scale-up rule
    await this.createScalingRule({
      id: 'memory_scale_up',
      name: 'Memory Scale Up',
      type: 'scale_up',
      conditions: [{
        metric: 'memory_utilization',
        operator: 'gt',
        value: 85,
        duration: 180000, // 3 minutes
        aggregation: 'avg'
      }],
      action: {
        type: 'update_resources',
        parameters: {
          resourceType: 'memory',
          resourceValue: 2048 // Add 2GB
        }
      },
      cooldown: 900000, // 15 minutes
      enabled: true,
      priority: 8
    });

    // Response time scale-up rule
    await this.createScalingRule({
      id: 'response_time_scale_up',
      name: 'Response Time Scale Up',
      type: 'scale_up',
      conditions: [{
        metric: 'response_time',
        operator: 'gt',
        value: 500,
        duration: 120000, // 2 minutes
        aggregation: 'avg'
      }],
      action: {
        type: 'add_instances',
        parameters: {
          count: 3,
          instanceType: 'high_performance'
        }
      },
      cooldown: 300000, // 5 minutes
      enabled: true,
      priority: 10
    });
  }

  async createScalingRule(rule: ScalingRule): Promise<void> {
    this.rules.set(rule.id, rule);
    this.emit('scaling_rule_created', { ruleId: rule.id });
    eventBus.emit('scaling_rule_created', { ruleId: rule.id, type: rule.type });
  }

  async updateScalingRule(ruleId: string, updates: Partial<ScalingRule>): Promise<void> {
    const rule = this.rules.get(ruleId);
    if (!rule) {
      throw new Error(`Scaling rule ${ruleId} not found`);
    }

    const updatedRule = { ...rule, ...updates };
    this.rules.set(ruleId, updatedRule);
    
    this.emit('scaling_rule_updated', { ruleId, updates });
  }

  async deleteScalingRule(ruleId: string): Promise<void> {
    const rule = this.rules.get(ruleId);
    if (!rule) {
      throw new Error(`Scaling rule ${ruleId} not found`);
    }

    this.rules.delete(ruleId);
    this.emit('scaling_rule_deleted', { ruleId });
  }

  /**
   * METRIC COLLECTION
   */
  private async startMetricCollection(): Promise<void> {
    this.metricCollectionInterval = setInterval(() => {
      this.collectMetrics();
    }, 30000); // Collect every 30 seconds
  }

  private async collectMetrics(): Promise<void> {
    try {
      const currentMetrics = await this.gatherSystemMetrics();
      
      for (const [metricName, value] of Object.entries(currentMetrics)) {
        await this.recordMetric(metricName, value);
      }
      
      // Evaluate scaling rules
      await this.evaluateScalingRules();
      
      // Update resource pool utilization
      await this.updateResourcePoolUtilization();
      
    } catch (error) {
      console.error('Metric collection error:', error);
    }
  }

  private async gatherSystemMetrics(): Promise<Record<string, number>> {
    // Mock implementation - in production this would gather real metrics
    return {
      cpu_utilization: Math.random() * 100,
      memory_utilization: Math.random() * 100,
      disk_utilization: Math.random() * 100,
      network_utilization: Math.random() * 100,
      response_time: Math.random() * 1000,
      request_rate: Math.random() * 1000,
      error_rate: Math.random() * 10,
      active_connections: Math.floor(Math.random() * 1000),
      throughput: Math.random() * 5000
    };
  }

  private async recordMetric(name: string, value: number): Promise<void> {
    const existing = this.metrics.get(name) || [];
    
    // Calculate trend
    const trend = this.calculateTrend(existing, value);
    
    const metric: ScalingMetric = {
      name,
      value,
      threshold: this.getMetricThreshold(name),
      weight: this.getMetricWeight(name),
      trend,
      timestamp: new Date()
    };

    existing.push(metric);
    
    // Keep only last 100 measurements
    if (existing.length > 100) {
      existing.shift();
    }
    
    this.metrics.set(name, existing);
    
    this.emit('metric_recorded', { name, value, trend });
  }

  private calculateTrend(history: ScalingMetric[], currentValue: number): 'increasing' | 'decreasing' | 'stable' {
    if (history.length < 3) return 'stable';
    
    const recent = history.slice(-3);
    const avgRecent = recent.reduce((sum, m) => sum + m.value, 0) / recent.length;
    
    const diff = currentValue - avgRecent;
    const threshold = avgRecent * 0.1; // 10% threshold
    
    if (diff > threshold) return 'increasing';
    if (diff < -threshold) return 'decreasing';
    return 'stable';
  }

  private getMetricThreshold(name: string): number {
    const thresholds: Record<string, number> = {
      cpu_utilization: 80,
      memory_utilization: 85,
      response_time: 500,
      error_rate: 5
    };
    
    return thresholds[name] || 100;
  }

  private getMetricWeight(name: string): number {
    const weights: Record<string, number> = {
      cpu_utilization: 1.0,
      memory_utilization: 0.9,
      response_time: 1.2,
      error_rate: 1.5
    };
    
    return weights[name] || 1.0;
  }

  /**
   * SCALING RULE EVALUATION
   */
  private async evaluateScalingRules(): Promise<void> {
    if (this.isScalingInProgress) {
      return; // Skip if scaling is already in progress
    }

    const sortedRules = Array.from(this.rules.values())
      .filter(rule => rule.enabled)
      .sort((a, b) => b.priority - a.priority);

    for (const rule of sortedRules) {
      try {
        const shouldTrigger = await this.evaluateRule(rule);
        
        if (shouldTrigger && await this.checkCooldown(rule)) {
          await this.executeScalingAction(rule);
          break; // Execute only one rule at a time
        }
      } catch (error) {
        console.error(`Error evaluating rule ${rule.id}:`, error);
      }
    }
  }

  private async evaluateRule(rule: ScalingRule): Promise<boolean> {
    for (const condition of rule.conditions) {
      const satisfied = await this.evaluateCondition(condition);
      if (!satisfied) {
        return false; // All conditions must be satisfied
      }
    }
    
    return true;
  }

  private async evaluateCondition(condition: ScalingCondition): Promise<boolean> {
    const metricHistory = this.metrics.get(condition.metric);
    if (!metricHistory || metricHistory.length === 0) {
      return false;
    }

    // Get metrics within the duration window
    const now = Date.now();
    const windowStart = now - condition.duration;
    const windowMetrics = metricHistory.filter(m => 
      m.timestamp.getTime() >= windowStart
    );

    if (windowMetrics.length === 0) {
      return false;
    }

    // Calculate aggregated value
    let aggregatedValue: number;
    switch (condition.aggregation) {
      case 'avg':
        aggregatedValue = windowMetrics.reduce((sum, m) => sum + m.value, 0) / windowMetrics.length;
        break;
      case 'max':
        aggregatedValue = Math.max(...windowMetrics.map(m => m.value));
        break;
      case 'min':
        aggregatedValue = Math.min(...windowMetrics.map(m => m.value));
        break;
      case 'sum':
        aggregatedValue = windowMetrics.reduce((sum, m) => sum + m.value, 0);
        break;
      default:
        aggregatedValue = windowMetrics[windowMetrics.length - 1].value;
    }

    // Evaluate condition
    switch (condition.operator) {
      case 'gt':
        return aggregatedValue > condition.value;
      case 'lt':
        return aggregatedValue < condition.value;
      case 'eq':
        return aggregatedValue === condition.value;
      case 'gte':
        return aggregatedValue >= condition.value;
      case 'lte':
        return aggregatedValue <= condition.value;
      default:
        return false;
    }
  }

  private async checkCooldown(rule: ScalingRule): Promise<boolean> {
    if (!rule.lastTriggered) {
      return true;
    }

    const now = Date.now();
    const timeSinceLastTrigger = now - rule.lastTriggered.getTime();
    
    return timeSinceLastTrigger >= rule.cooldown;
  }

  /**
   * SCALING ACTION EXECUTION
   */
  private async executeScalingAction(rule: ScalingRule): Promise<void> {
    this.isScalingInProgress = true;
    const startTime = performance.now();
    
    try {
      const event: ScalingEvent = {
        id: `scale_${Date.now()}`,
        type: rule.type,
        trigger: rule.id,
        timestamp: new Date(),
        details: {
          rule: rule.name,
          action: rule.action
        },
        success: false,
        duration: 0
      };

      // Execute the scaling action
      await this.performScalingAction(rule.action);
      
      // Update rule last triggered time
      rule.lastTriggered = new Date();
      this.rules.set(rule.id, rule);
      
      event.success = true;
      event.duration = performance.now() - startTime;
      
      this.scalingEvents.push(event);
      
      this.emit('scaling_action_executed', {
        ruleId: rule.id,
        action: rule.action,
        success: true,
        duration: event.duration
      });
      
      eventBus.emit('auto_scaling_triggered', {
        type: rule.type,
        rule: rule.name,
        duration: event.duration
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Scaling action failed for rule ${rule.id}:`, error);
      
      this.emit('scaling_action_failed', {
        ruleId: rule.id,
        error: errorMessage
      });
      
    } finally {
      this.isScalingInProgress = false;
    }
  }

  private async performScalingAction(action: ScalingAction): Promise<void> {
    switch (action.type) {
      case 'add_instances':
        await this.addInstances(action.parameters);
        break;
      case 'remove_instances':
        await this.removeInstances(action.parameters);
        break;
      case 'update_resources':
        await this.updateResources(action.parameters);
        break;
      case 'custom':
        if (action.parameters.customFunction) {
          await action.parameters.customFunction();
        }
        break;
    }
  }

  private async addInstances(parameters: any): Promise<void> {
    const count = parameters.count || 1;
    const instanceType = parameters.instanceType || 'standard';
    
    const computePool = this.resourcePools.get('compute');
    if (!computePool) {
      throw new Error('Compute pool not found');
    }

    if (computePool.current + count > computePool.max) {
      throw new Error(`Cannot add ${count} instances: would exceed maximum of ${computePool.max}`);
    }

    // Create new instances
    for (let i = 0; i < count; i++) {
      const instance: ScalingInstance = {
        id: `instance_${Date.now()}_${i}`,
        type: instanceType,
        status: 'starting',
        metrics: {},
        cost: this.calculateInstanceCost(instanceType),
        createdAt: new Date(),
        lastUpdated: new Date()
      };

      computePool.instances.push(instance);
      
      // Simulate instance startup
      setTimeout(() => {
        instance.status = 'running';
        instance.lastUpdated = new Date();
      }, 30000); // 30 seconds startup time
    }

    computePool.current += count;
    computePool.cost += count * this.calculateInstanceCost(instanceType);
    
    this.resourcePools.set('compute', computePool);
    
    console.log(`Added ${count} ${instanceType} instances`);
  }

  private async removeInstances(parameters: any): Promise<void> {
    const count = parameters.count || 1;
    
    const computePool = this.resourcePools.get('compute');
    if (!computePool) {
      throw new Error('Compute pool not found');
    }

    if (computePool.current - count < computePool.min) {
      throw new Error(`Cannot remove ${count} instances: would go below minimum of ${computePool.min}`);
    }

    // Remove running instances
    const runningInstances = computePool.instances.filter(i => i.status === 'running');
    const instancesToRemove = runningInstances.slice(0, count);
    
    for (const instance of instancesToRemove) {
      instance.status = 'stopping';
      instance.lastUpdated = new Date();
      
      // Simulate instance shutdown
      setTimeout(() => {
        instance.status = 'stopped';
        instance.lastUpdated = new Date();
        
        // Remove from pool
        const index = computePool.instances.indexOf(instance);
        if (index > -1) {
          computePool.instances.splice(index, 1);
        }
      }, 15000); // 15 seconds shutdown time
    }

    computePool.current -= count;
    computePool.cost -= count * this.calculateInstanceCost('standard');
    
    this.resourcePools.set('compute', computePool);
    
    console.log(`Removed ${count} instances`);
  }

  private async updateResources(parameters: any): Promise<void> {
    const resourceType = parameters.resourceType;
    const resourceValue = parameters.resourceValue;
    
    const pool = this.resourcePools.get(resourceType);
    if (!pool) {
      throw new Error(`Resource pool ${resourceType} not found`);
    }

    const newValue = pool.current + resourceValue;
    
    if (newValue > pool.max) {
      throw new Error(`Cannot update ${resourceType}: would exceed maximum of ${pool.max}`);
    }
    
    if (newValue < pool.min) {
      throw new Error(`Cannot update ${resourceType}: would go below minimum of ${pool.min}`);
    }

    pool.current = newValue;
    pool.target = newValue;
    
    this.resourcePools.set(resourceType, pool);
    
    console.log(`Updated ${resourceType} to ${newValue}`);
  }

  private calculateInstanceCost(instanceType: string): number {
    const costs: Record<string, number> = {
      'standard': 0.10,
      'high_performance': 0.25,
      'memory_optimized': 0.20,
      'compute_optimized': 0.18
    };
    
    return costs[instanceType] || 0.10;
  }

  /**
   * PREDICTIVE SCALING
   */
  private async setupPredictiveModels(): Promise<void> {
    // Linear model for CPU prediction
    await this.createPredictiveModel({
      id: 'cpu_linear',
      name: 'CPU Linear Prediction',
      type: 'linear',
      accuracy: 0.85,
      lastTrained: new Date(),
      predictions: []
    });

    // Seasonal model for request rate
    await this.createPredictiveModel({
      id: 'request_seasonal',
      name: 'Request Rate Seasonal',
      type: 'seasonal',
      accuracy: 0.92,
      lastTrained: new Date(),
      predictions: []
    });
  }

  private async createPredictiveModel(model: PredictiveModel): Promise<void> {
    this.predictiveModels.set(model.id, model);
    this.emit('predictive_model_created', { modelId: model.id });
  }

  private async startPredictiveAnalysis(): Promise<void> {
    this.predictionInterval = setInterval(() => {
      this.performPredictiveAnalysis();
    }, 300000); // Every 5 minutes
  }

  private async performPredictiveAnalysis(): Promise<void> {
    try {
      for (const [modelId, model] of this.predictiveModels) {
        const predictions = await this.generatePredictions(model);
        
        // Update model with predictions
        model.predictions = predictions;
        model.lastTrained = new Date();
        this.predictiveModels.set(modelId, model);
        
        // Check if predictive scaling is needed
        await this.evaluatePredictiveScaling(predictions);
      }
    } catch (error) {
      console.error('Predictive analysis error:', error);
    }
  }

  private async generatePredictions(model: PredictiveModel): Promise<PredictionPoint[]> {
    // Mock implementation - in production this would use actual ML models
    const predictions: PredictionPoint[] = [];
    const now = new Date();
    
    for (let i = 1; i <= 12; i++) { // 12 predictions (1 hour ahead)
      const futureTime = new Date(now.getTime() + i * 5 * 60000); // 5 minutes ahead
      
      predictions.push({
        timestamp: futureTime,
        metric: 'cpu_utilization',
        predictedValue: Math.random() * 100,
        confidence: 0.8 + Math.random() * 0.2
      });
    }
    
    return predictions;
  }

  private async evaluatePredictiveScaling(predictions: PredictionPoint[]): Promise<void> {
    // Look for predictions that exceed thresholds
    const highConfidencePredictions = predictions.filter(p => p.confidence > 0.85);
    
    for (const prediction of highConfidencePredictions) {
      const threshold = this.getMetricThreshold(prediction.metric);
      
      if (prediction.predictedValue > threshold) {
        // Consider proactive scaling
        await this.considerProactiveScaling(prediction);
      }
    }
  }

  private async considerProactiveScaling(prediction: PredictionPoint): Promise<void> {
    // Check if we should proactively scale based on prediction
    const timeToThreshold = prediction.timestamp.getTime() - Date.now();
    const scalingLeadTime = 5 * 60000; // 5 minutes lead time
    
    if (timeToThreshold <= scalingLeadTime && prediction.confidence > 0.9) {
      // Trigger proactive scaling
      const proactiveRule: ScalingRule = {
        id: 'proactive_scale',
        name: 'Proactive Scaling',
        type: 'scale_up',
        conditions: [],
        action: {
          type: 'add_instances',
          parameters: {
            count: 1,
            instanceType: 'standard'
          }
        },
        cooldown: 300000,
        enabled: true,
        priority: 11
      };
      
      await this.executeScalingAction(proactiveRule);
      
      this.emit('proactive_scaling_triggered', {
        metric: prediction.metric,
        predictedValue: prediction.predictedValue,
        confidence: prediction.confidence
      });
    }
  }

  /**
   * RESOURCE OPTIMIZATION
   */
  private async updateResourcePoolUtilization(): Promise<void> {
    for (const [poolId, pool] of this.resourcePools) {
      const utilization = await this.calculateResourceUtilization(pool);
      pool.utilization = utilization;
      
      // Check for optimization opportunities
      await this.checkOptimizationOpportunities(pool);
      
      this.resourcePools.set(poolId, pool);
    }
  }

  private async calculateResourceUtilization(pool: ResourcePool): Promise<number> {
    // Mock calculation - in production this would use real metrics
    switch (pool.type) {
      case 'compute':
        return Math.min(100, (pool.current / pool.max) * 100);
      case 'memory':
        return Math.random() * 100;
      case 'storage':
        return Math.random() * 100;
      default:
        return 0;
    }
  }

  private async checkOptimizationOpportunities(pool: ResourcePool): Promise<void> {
    // Check for underutilized resources
    if (pool.utilization < 30 && pool.current > pool.min) {
      this.emit('optimization_opportunity', {
        poolId: pool.id,
        type: 'underutilized',
        suggestion: 'Consider scaling down',
        potentialSavings: pool.cost * 0.3
      });
    }
    
    // Check for overutilized resources
    if (pool.utilization > 90 && pool.current < pool.max) {
      this.emit('optimization_opportunity', {
        poolId: pool.id,
        type: 'overutilized',
        suggestion: 'Consider scaling up',
        riskLevel: 'high'
      });
    }
  }

  /**
   * PUBLIC API
   */
  async getScalingMetrics(): Promise<{
    rules: ScalingRule[];
    resourcePools: ResourcePool[];
    recentEvents: ScalingEvent[];
    predictions: PredictionPoint[];
  }> {
    return {
      rules: Array.from(this.rules.values()),
      resourcePools: Array.from(this.resourcePools.values()),
      recentEvents: this.scalingEvents.slice(-20), // Last 20 events
      predictions: Array.from(this.predictiveModels.values())
        .flatMap(model => model.predictions)
    };
  }

  async optimizeResources(): Promise<{
    optimizations: string[];
    estimatedSavings: number;
    performanceImpact: string;
  }> {
    const optimizations: string[] = [];
    let estimatedSavings = 0;
    
    // Analyze each resource pool
    for (const pool of this.resourcePools.values()) {
      if (pool.utilization < 40 && pool.current > pool.min) {
        const reduction = Math.floor((pool.current - pool.min) / 2);
        optimizations.push(`Scale down ${pool.name} by ${reduction} units`);
        estimatedSavings += reduction * pool.cost;
      }
    }
    
    return {
      optimizations,
      estimatedSavings,
      performanceImpact: estimatedSavings > 0 ? 'minimal' : 'none'
    };
  }

  async getResourceRecommendations(): Promise<{
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  }> {
    const immediate: string[] = [];
    const shortTerm: string[] = [];
    const longTerm: string[] = [];
    
    // Analyze current metrics and trends
    for (const [metricName, history] of this.metrics) {
      const latest = history[history.length - 1];
      
      if (latest?.trend === 'increasing' && latest.value > latest.threshold * 0.8) {
        immediate.push(`Monitor ${metricName} - approaching threshold`);
      }
      
      if (latest?.trend === 'increasing') {
        shortTerm.push(`Consider increasing capacity for ${metricName}`);
      }
    }
    
    // Long-term recommendations based on patterns
    longTerm.push('Consider implementing more sophisticated predictive models');
    longTerm.push('Evaluate cost optimization opportunities');
    
    return { immediate, shortTerm, longTerm };
  }

  // Cleanup
  async cleanup(): Promise<void> {
    if (this.metricCollectionInterval) {
      clearInterval(this.metricCollectionInterval);
    }
    
    if (this.predictionInterval) {
      clearInterval(this.predictionInterval);
    }
  }
}

// Export singleton instance
export const autoScalingSystem = new AutoScalingSystem();
