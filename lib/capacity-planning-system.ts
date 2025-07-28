
/**
 * CAPACITY PLANNING & PREDICTION SYSTEM
 * AI-powered capacity forecasting, resource optimization, and predictive scaling
 */

import { eventBus } from '@/lib/event-bus-system';
import { performance } from 'perf_hooks';

export interface CapacityMetric {
  id: string;
  name: string;
  resourceType: 'cpu' | 'memory' | 'storage' | 'network' | 'database' | 'custom';
  unit: string;
  currentValue: number;
  capacity: number;
  utilization: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  growthRate: number;
  seasonality: SeasonalityPattern;
  dataPoints: CapacityDataPoint[];
  lastUpdated: Date;
}

export interface CapacityDataPoint {
  timestamp: Date;
  value: number;
  capacity: number;
  utilization: number;
  metadata?: Record<string, any>;
}

export interface SeasonalityPattern {
  detected: boolean;
  pattern: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  peaks: TimeWindow[];
  valleys: TimeWindow[];
  amplitude: number;
  confidence: number;
}

export interface TimeWindow {
  start: string; // Time format: HH:mm or day of week
  end: string;
  averageMultiplier: number;
  description: string;
}

export interface CapacityForecast {
  id: string;
  resourceType: string;
  metric: string;
  timeHorizon: number; // days
  algorithm: 'linear' | 'exponential' | 'polynomial' | 'arima' | 'neural_network' | 'ensemble';
  predictions: ForecastPoint[];
  confidence: number;
  accuracy: number;
  parameters: Record<string, any>;
  generated: Date;
  lastUpdated: Date;
}

export interface ForecastPoint {
  timestamp: Date;
  predictedValue: number;
  predictedCapacity: number;
  predictedUtilization: number;
  confidence: number;
  lowerBound: number;
  upperBound: number;
}

export interface CapacityRecommendation {
  id: string;
  type: 'scale_up' | 'scale_down' | 'optimize' | 'alert' | 'maintenance';
  resourceType: string;
  metric: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  reasoning: string;
  actions: RecommendationAction[];
  timeframe: string;
  costImpact: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  created: Date;
  implemented: boolean;
  implementedAt?: Date;
}

export interface RecommendationAction {
  id: string;
  type: 'scale_resource' | 'add_instance' | 'remove_instance' | 'optimize_config' | 'schedule_maintenance';
  description: string;
  parameters: Record<string, any>;
  estimatedCost: number;
  estimatedBenefit: number;
  riskLevel: 'low' | 'medium' | 'high';
  automatable: boolean;
  dependencies: string[];
}

export interface CapacityAlert {
  id: string;
  type: 'threshold_exceeded' | 'forecast_warning' | 'recommendation_urgent' | 'anomaly_detected';
  severity: 'info' | 'warning' | 'error' | 'critical';
  resourceType: string;
  metric: string;
  message: string;
  details: string;
  threshold: number;
  currentValue: number;
  predictedValue?: number;
  timeToThreshold?: number;
  recommendations: string[];
  created: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

export interface ResourcePool {
  id: string;
  name: string;
  type: string;
  resources: PoolResource[];
  totalCapacity: number;
  usedCapacity: number;
  availableCapacity: number;
  utilizationTarget: number;
  costPerUnit: number;
  scalingPolicy: ScalingPolicy;
  lastOptimized: Date;
}

export interface PoolResource {
  id: string;
  name: string;
  type: string;
  capacity: number;
  utilization: number;
  cost: number;
  status: 'active' | 'inactive' | 'maintenance' | 'failed';
  location: string;
  tags: Record<string, string>;
  lastUpdated: Date;
}

export interface ScalingPolicy {
  enabled: boolean;
  minCapacity: number;
  maxCapacity: number;
  targetUtilization: number;
  scaleUpThreshold: number;
  scaleDownThreshold: number;
  cooldownPeriod: number;
  predictiveScaling: boolean;
  scheduledScaling: ScheduledScaling[];
}

export interface ScheduledScaling {
  id: string;
  name: string;
  schedule: string; // cron expression
  targetCapacity: number;
  duration: number;
  enabled: boolean;
  recurring: boolean;
}

export interface CapacityOptimization {
  id: string;
  name: string;
  type: 'resource_consolidation' | 'workload_distribution' | 'capacity_rightsizing' | 'cost_optimization';
  scope: 'global' | 'regional' | 'datacenter' | 'pool';
  resourceTypes: string[];
  parameters: Record<string, any>;
  objectives: OptimizationObjective[];
  constraints: OptimizationConstraint[];
  results: OptimizationResult[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  created: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

export interface OptimizationObjective {
  type: 'minimize_cost' | 'maximize_performance' | 'minimize_waste' | 'maximize_availability';
  weight: number;
  target?: number;
  priority: number;
}

export interface OptimizationConstraint {
  type: 'max_cost' | 'min_performance' | 'availability_requirement' | 'geographic_distribution';
  value: number;
  unit: string;
  enforced: boolean;
}

export interface OptimizationResult {
  id: string;
  type: string;
  resourceType: string;
  action: string;
  parameters: Record<string, any>;
  estimatedImpact: {
    cost: number;
    performance: number;
    availability: number;
  };
  confidence: number;
  implemented: boolean;
}

export interface CapacityReport {
  id: string;
  name: string;
  type: 'utilization' | 'forecast' | 'optimization' | 'cost_analysis' | 'comprehensive';
  scope: 'global' | 'regional' | 'datacenter' | 'pool';
  timeRange: {
    from: Date;
    to: Date;
  };
  data: any;
  insights: ReportInsight[];
  recommendations: CapacityRecommendation[];
  generated: Date;
  format: 'json' | 'pdf' | 'csv' | 'excel';
}

export interface ReportInsight {
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk';
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  data: any;
  actionable: boolean;
}

export class CapacityPlanningSystem {
  private capacityMetrics: Map<string, CapacityMetric> = new Map();
  private forecasts: Map<string, CapacityForecast> = new Map();
  private recommendations: Map<string, CapacityRecommendation> = new Map();
  private alerts: Map<string, CapacityAlert> = new Map();
  private resourcePools: Map<string, ResourcePool> = new Map();
  private optimizations: Map<string, CapacityOptimization> = new Map();
  private reports: Map<string, CapacityReport> = new Map();
  private forecastingInterval: NodeJS.Timeout | null = null;
  private analysisInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initializeCapacityPlanningSystem();
  }

  private async initializeCapacityPlanningSystem(): Promise<void> {
    await this.setupDefaultMetrics();
    await this.setupResourcePools();
    await this.startForecastingEngine();
    await this.startAnalysisEngine();
    await this.setupCapacityAlerts();
    console.log('Capacity Planning System initialized');
  }

  /**
   * CAPACITY METRICS MANAGEMENT
   */
  private async setupDefaultMetrics(): Promise<void> {
    const defaultMetrics: Omit<CapacityMetric, 'id' | 'dataPoints' | 'lastUpdated'>[] = [
      {
        name: 'CPU Utilization',
        resourceType: 'cpu',
        unit: '%',
        currentValue: 65,
        capacity: 100,
        utilization: 65,
        trend: 'increasing',
        growthRate: 2.5,
        seasonality: {
          detected: true,
          pattern: 'daily',
          peaks: [
            { start: '09:00', end: '11:00', averageMultiplier: 1.3, description: 'Morning peak' },
            { start: '14:00', end: '16:00', averageMultiplier: 1.2, description: 'Afternoon peak' }
          ],
          valleys: [
            { start: '01:00', end: '05:00', averageMultiplier: 0.4, description: 'Night valley' }
          ],
          amplitude: 0.6,
          confidence: 0.85
        }
      },
      {
        name: 'Memory Usage',
        resourceType: 'memory',
        unit: 'GB',
        currentValue: 48,
        capacity: 64,
        utilization: 75,
        trend: 'stable',
        growthRate: 1.2,
        seasonality: {
          detected: false,
          pattern: 'daily',
          peaks: [],
          valleys: [],
          amplitude: 0.1,
          confidence: 0.3
        }
      },
      {
        name: 'Storage Usage',
        resourceType: 'storage',
        unit: 'TB',
        currentValue: 2.8,
        capacity: 5.0,
        utilization: 56,
        trend: 'increasing',
        growthRate: 8.5,
        seasonality: {
          detected: false,
          pattern: 'monthly',
          peaks: [],
          valleys: [],
          amplitude: 0.05,
          confidence: 0.2
        }
      },
      {
        name: 'Network Throughput',
        resourceType: 'network',
        unit: 'Gbps',
        currentValue: 1.2,
        capacity: 2.0,
        utilization: 60,
        trend: 'increasing',
        growthRate: 3.8,
        seasonality: {
          detected: true,
          pattern: 'weekly',
          peaks: [
            { start: 'Monday', end: 'Friday', averageMultiplier: 1.2, description: 'Business days' }
          ],
          valleys: [
            { start: 'Saturday', end: 'Sunday', averageMultiplier: 0.7, description: 'Weekend' }
          ],
          amplitude: 0.4,
          confidence: 0.78
        }
      },
      {
        name: 'Database Connections',
        resourceType: 'database',
        unit: 'connections',
        currentValue: 85,
        capacity: 100,
        utilization: 85,
        trend: 'increasing',
        growthRate: 4.2,
        seasonality: {
          detected: true,
          pattern: 'daily',
          peaks: [
            { start: '08:00', end: '18:00', averageMultiplier: 1.1, description: 'Business hours' }
          ],
          valleys: [
            { start: '22:00', end: '06:00', averageMultiplier: 0.6, description: 'Off hours' }
          ],
          amplitude: 0.3,
          confidence: 0.72
        }
      }
    ];

    for (const metricData of defaultMetrics) {
      const metric: CapacityMetric = {
        id: `metric_${metricData.name.toLowerCase().replace(/\s+/g, '_')}`,
        dataPoints: this.generateHistoricalData(metricData),
        lastUpdated: new Date(),
        ...metricData
      };
      
      this.capacityMetrics.set(metric.id, metric);
    }
  }

  private generateHistoricalData(metric: Omit<CapacityMetric, 'id' | 'dataPoints' | 'lastUpdated'>): CapacityDataPoint[] {
    const dataPoints: CapacityDataPoint[] = [];
    const now = new Date();
    const daysBack = 30;
    
    for (let i = daysBack; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      
      // Generate realistic data with seasonality and trend
      let baseValue = metric.currentValue;
      
      // Apply trend
      const trendImpact = (metric.growthRate / 100) * (daysBack - i) / 30;
      baseValue *= (1 + trendImpact);
      
      // Apply seasonality
      if (metric.seasonality.detected) {
        const seasonalImpact = this.calculateSeasonalImpact(timestamp, metric.seasonality);
        baseValue *= seasonalImpact;
      }
      
      // Add some randomness
      const randomFactor = 0.9 + Math.random() * 0.2;
      const value = baseValue * randomFactor;
      
      dataPoints.push({
        timestamp,
        value,
        capacity: metric.capacity,
        utilization: (value / metric.capacity) * 100,
        metadata: {
          trend: metric.trend,
          seasonalImpact: metric.seasonality.detected ? true : false
        }
      });
    }
    
    return dataPoints;
  }

  private calculateSeasonalImpact(timestamp: Date, seasonality: SeasonalityPattern): number {
    if (!seasonality.detected) return 1;
    
    let impact = 1;
    
    if (seasonality.pattern === 'daily') {
      const hour = timestamp.getHours();
      const timeStr = `${hour.toString().padStart(2, '0')}:00`;
      
      // Check peaks
      for (const peak of seasonality.peaks) {
        const startHour = parseInt(peak.start.split(':')[0]);
        const endHour = parseInt(peak.end.split(':')[0]);
        
        if (hour >= startHour && hour <= endHour) {
          impact = peak.averageMultiplier;
          break;
        }
      }
      
      // Check valleys
      for (const valley of seasonality.valleys) {
        const startHour = parseInt(valley.start.split(':')[0]);
        const endHour = parseInt(valley.end.split(':')[0]);
        
        if (hour >= startHour && hour <= endHour) {
          impact = valley.averageMultiplier;
          break;
        }
      }
    } else if (seasonality.pattern === 'weekly') {
      const day = timestamp.getDay();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = dayNames[day];
      
      // Check peaks
      for (const peak of seasonality.peaks) {
        if (peak.start === dayName || (peak.start === 'Monday' && day >= 1 && day <= 5)) {
          impact = peak.averageMultiplier;
          break;
        }
      }
      
      // Check valleys
      for (const valley of seasonality.valleys) {
        if (valley.start === dayName || (valley.start === 'Saturday' && (day === 0 || day === 6))) {
          impact = valley.averageMultiplier;
          break;
        }
      }
    }
    
    return impact;
  }

  async recordCapacityMetric(
    metricId: string,
    value: number,
    capacity: number,
    metadata?: Record<string, any>
  ): Promise<void> {
    const metric = this.capacityMetrics.get(metricId);
    if (!metric) return;

    const dataPoint: CapacityDataPoint = {
      timestamp: new Date(),
      value,
      capacity,
      utilization: (value / capacity) * 100,
      metadata
    };

    metric.dataPoints.push(dataPoint);
    
    // Keep only last 90 days of data
    const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    metric.dataPoints = metric.dataPoints.filter(dp => 
      dp.timestamp.getTime() > ninetyDaysAgo
    );

    // Update current values
    metric.currentValue = value;
    metric.capacity = capacity;
    metric.utilization = (value / capacity) * 100;
    metric.lastUpdated = new Date();

    // Update trend
    await this.updateMetricTrend(metric);

    this.capacityMetrics.set(metricId, metric);
    
    eventBus.emit('capacity_metric_recorded', {
      metricId,
      value,
      capacity,
      utilization: metric.utilization,
      timestamp: new Date()
    });
  }

  private async updateMetricTrend(metric: CapacityMetric): Promise<void> {
    if (metric.dataPoints.length < 10) return;

    const recent = metric.dataPoints.slice(-10);
    const older = metric.dataPoints.slice(-20, -10);

    const recentAvg = recent.reduce((sum, dp) => sum + dp.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, dp) => sum + dp.value, 0) / older.length;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (change > 5) {
      metric.trend = 'increasing';
    } else if (change < -5) {
      metric.trend = 'decreasing';
    } else {
      metric.trend = 'stable';
    }

    // Update growth rate
    const timeSpan = recent[recent.length - 1].timestamp.getTime() - recent[0].timestamp.getTime();
    const dailyGrowthRate = (change / (timeSpan / (24 * 60 * 60 * 1000))) * 100;
    metric.growthRate = dailyGrowthRate;
  }

  /**
   * FORECASTING ENGINE
   */
  private async startForecastingEngine(): Promise<void> {
    // Generate forecasts every hour
    this.forecastingInterval = setInterval(() => {
      this.generateForecasts();
    }, 3600000);

    // Generate initial forecasts
    await this.generateForecasts();
  }

  private async generateForecasts(): Promise<void> {
    try {
      for (const metric of this.capacityMetrics.values()) {
        await this.generateForecast(metric);
      }
    } catch (error) {
      console.error('Forecasting error:', error);
    }
  }

  private async generateForecast(metric: CapacityMetric): Promise<void> {
    const forecastId = `forecast_${metric.id}`;
    const timeHorizon = 30; // 30 days
    
    // Choose algorithm based on data characteristics
    let algorithm: CapacityForecast['algorithm'] = 'linear';
    
    if (metric.seasonality.detected && metric.seasonality.confidence > 0.7) {
      algorithm = 'arima';
    } else if (metric.trend === 'increasing' && metric.growthRate > 5) {
      algorithm = 'exponential';
    }

    const predictions = await this.generatePredictions(metric, timeHorizon, algorithm);
    
    const forecast: CapacityForecast = {
      id: forecastId,
      resourceType: metric.resourceType,
      metric: metric.name,
      timeHorizon,
      algorithm,
      predictions,
      confidence: this.calculateForecastConfidence(metric, predictions),
      accuracy: this.calculateForecastAccuracy(metric, predictions),
      parameters: {
        seasonality: metric.seasonality,
        trend: metric.trend,
        growthRate: metric.growthRate
      },
      generated: new Date(),
      lastUpdated: new Date()
    };

    this.forecasts.set(forecastId, forecast);
    
    // Generate recommendations based on forecast
    await this.generateForecastRecommendations(forecast, metric);
    
    eventBus.emit('forecast_generated', {
      forecastId,
      resourceType: metric.resourceType,
      metric: metric.name,
      timeHorizon,
      algorithm,
      timestamp: new Date()
    });
  }

  private async generatePredictions(
    metric: CapacityMetric,
    timeHorizon: number,
    algorithm: CapacityForecast['algorithm']
  ): Promise<ForecastPoint[]> {
    const predictions: ForecastPoint[] = [];
    const now = new Date();
    
    for (let i = 1; i <= timeHorizon; i++) {
      const timestamp = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      
      let predictedValue: number;
      
      switch (algorithm) {
        case 'linear':
          predictedValue = this.linearForecast(metric, i);
          break;
        case 'exponential':
          predictedValue = this.exponentialForecast(metric, i);
          break;
        case 'arima':
          predictedValue = this.arimaForecast(metric, i);
          break;
        default:
          predictedValue = this.linearForecast(metric, i);
      }
      
      // Apply seasonality
      if (metric.seasonality.detected) {
        const seasonalImpact = this.calculateSeasonalImpact(timestamp, metric.seasonality);
        predictedValue *= seasonalImpact;
      }
      
      // Calculate confidence intervals
      const uncertainty = Math.min(i * 0.02, 0.3); // Uncertainty increases with time
      const confidenceInterval = predictedValue * uncertainty;
      
      predictions.push({
        timestamp,
        predictedValue,
        predictedCapacity: metric.capacity,
        predictedUtilization: (predictedValue / metric.capacity) * 100,
        confidence: Math.max(0.5, 1 - uncertainty),
        lowerBound: predictedValue - confidenceInterval,
        upperBound: predictedValue + confidenceInterval
      });
    }
    
    return predictions;
  }

  private linearForecast(metric: CapacityMetric, daysAhead: number): number {
    const dailyChange = (metric.growthRate / 100) * metric.currentValue / 30;
    return metric.currentValue + dailyChange * daysAhead;
  }

  private exponentialForecast(metric: CapacityMetric, daysAhead: number): number {
    const dailyGrowthRate = metric.growthRate / 100 / 30;
    return metric.currentValue * Math.pow(1 + dailyGrowthRate, daysAhead);
  }

  private arimaForecast(metric: CapacityMetric, daysAhead: number): number {
    // Simplified ARIMA - in production this would use proper statistical methods
    const seasonalComponent = metric.seasonality.amplitude * Math.sin(2 * Math.PI * daysAhead / 7);
    const trendComponent = this.linearForecast(metric, daysAhead);
    
    return trendComponent + seasonalComponent * metric.currentValue;
  }

  private calculateForecastConfidence(metric: CapacityMetric, predictions: ForecastPoint[]): number {
    // Base confidence on data quality and seasonality detection
    let confidence = 0.7;
    
    if (metric.dataPoints.length > 60) confidence += 0.1;
    if (metric.seasonality.detected) confidence += 0.1;
    if (metric.trend === 'stable') confidence += 0.05;
    
    return Math.min(confidence, 0.95);
  }

  private calculateForecastAccuracy(metric: CapacityMetric, predictions: ForecastPoint[]): number {
    // Mock accuracy calculation - in production this would use historical forecast validation
    return 0.85 + Math.random() * 0.1;
  }

  private async generateForecastRecommendations(forecast: CapacityForecast, metric: CapacityMetric): Promise<void> {
    const recommendations: CapacityRecommendation[] = [];
    
    // Check for capacity threshold breaches
    const utilizationThreshold = 85;
    const criticalThreshold = 95;
    
    for (const prediction of forecast.predictions) {
      if (prediction.predictedUtilization > criticalThreshold) {
        const timeToThreshold = prediction.timestamp.getTime() - Date.now();
        const daysToThreshold = Math.floor(timeToThreshold / (24 * 60 * 60 * 1000));
        
        recommendations.push({
          id: `rec_${forecast.id}_critical_${Date.now()}`,
          type: 'scale_up',
          resourceType: metric.resourceType,
          metric: metric.name,
          priority: 'critical',
          impact: 'critical',
          description: `Critical capacity threshold will be exceeded in ${daysToThreshold} days`,
          reasoning: `Forecast shows ${metric.name} will reach ${prediction.predictedUtilization.toFixed(1)}% utilization`,
          actions: [
            {
              id: `action_${Date.now()}`,
              type: 'scale_resource',
              description: `Scale ${metric.resourceType} capacity by 50%`,
              parameters: {
                resourceType: metric.resourceType,
                scalePercent: 50,
                targetUtilization: 70
              },
              estimatedCost: 5000,
              estimatedBenefit: 15000,
              riskLevel: 'low',
              automatable: true,
              dependencies: []
            }
          ],
          timeframe: `${daysToThreshold} days`,
          costImpact: 5000,
          riskLevel: 'high',
          confidence: prediction.confidence,
          created: new Date(),
          implemented: false
        });
        
        break; // Only create one critical recommendation per forecast
      } else if (prediction.predictedUtilization > utilizationThreshold) {
        const timeToThreshold = prediction.timestamp.getTime() - Date.now();
        const daysToThreshold = Math.floor(timeToThreshold / (24 * 60 * 60 * 1000));
        
        recommendations.push({
          id: `rec_${forecast.id}_warning_${Date.now()}`,
          type: 'scale_up',
          resourceType: metric.resourceType,
          metric: metric.name,
          priority: 'high',
          impact: 'medium',
          description: `Capacity threshold will be exceeded in ${daysToThreshold} days`,
          reasoning: `Forecast shows ${metric.name} will reach ${prediction.predictedUtilization.toFixed(1)}% utilization`,
          actions: [
            {
              id: `action_${Date.now()}`,
              type: 'scale_resource',
              description: `Scale ${metric.resourceType} capacity by 25%`,
              parameters: {
                resourceType: metric.resourceType,
                scalePercent: 25,
                targetUtilization: 70
              },
              estimatedCost: 2500,
              estimatedBenefit: 8000,
              riskLevel: 'low',
              automatable: true,
              dependencies: []
            }
          ],
          timeframe: `${daysToThreshold} days`,
          costImpact: 2500,
          riskLevel: 'medium',
          confidence: prediction.confidence,
          created: new Date(),
          implemented: false
        });
        
        break;
      }
    }
    
    // Store recommendations
    for (const recommendation of recommendations) {
      this.recommendations.set(recommendation.id, recommendation);
      
      eventBus.emit('capacity_recommendation_generated', {
        recommendationId: recommendation.id,
        type: recommendation.type,
        priority: recommendation.priority,
        resourceType: recommendation.resourceType,
        timestamp: new Date()
      });
    }
  }

  /**
   * RESOURCE POOLS MANAGEMENT
   */
  private async setupResourcePools(): Promise<void> {
    // Compute pool
    await this.createResourcePool('compute-pool', {
      name: 'Compute Pool',
      type: 'compute',
      resources: [
        {
          id: 'compute-1',
          name: 'Compute Node 1',
          type: 'cpu',
          capacity: 16,
          utilization: 65,
          cost: 0.50,
          status: 'active',
          location: 'us-east-1a',
          tags: { environment: 'production', tier: 'standard' },
          lastUpdated: new Date()
        },
        {
          id: 'compute-2',
          name: 'Compute Node 2',
          type: 'cpu',
          capacity: 16,
          utilization: 72,
          cost: 0.50,
          status: 'active',
          location: 'us-east-1b',
          tags: { environment: 'production', tier: 'standard' },
          lastUpdated: new Date()
        }
      ],
      totalCapacity: 32,
      usedCapacity: 22,
      availableCapacity: 10,
      utilizationTarget: 70,
      costPerUnit: 0.50,
      scalingPolicy: {
        enabled: true,
        minCapacity: 16,
        maxCapacity: 64,
        targetUtilization: 70,
        scaleUpThreshold: 80,
        scaleDownThreshold: 50,
        cooldownPeriod: 300,
        predictiveScaling: true,
        scheduledScaling: []
      },
      lastOptimized: new Date()
    });

    // Memory pool
    await this.createResourcePool('memory-pool', {
      name: 'Memory Pool',
      type: 'memory',
      resources: [
        {
          id: 'memory-1',
          name: 'Memory Bank 1',
          type: 'memory',
          capacity: 64,
          utilization: 75,
          cost: 0.10,
          status: 'active',
          location: 'us-east-1a',
          tags: { environment: 'production', tier: 'standard' },
          lastUpdated: new Date()
        }
      ],
      totalCapacity: 64,
      usedCapacity: 48,
      availableCapacity: 16,
      utilizationTarget: 75,
      costPerUnit: 0.10,
      scalingPolicy: {
        enabled: true,
        minCapacity: 32,
        maxCapacity: 128,
        targetUtilization: 75,
        scaleUpThreshold: 85,
        scaleDownThreshold: 60,
        cooldownPeriod: 600,
        predictiveScaling: true,
        scheduledScaling: []
      },
      lastOptimized: new Date()
    });

    // Storage pool
    await this.createResourcePool('storage-pool', {
      name: 'Storage Pool',
      type: 'storage',
      resources: [
        {
          id: 'storage-1',
          name: 'Storage Volume 1',
          type: 'storage',
          capacity: 1000,
          utilization: 56,
          cost: 0.023,
          status: 'active',
          location: 'us-east-1a',
          tags: { environment: 'production', tier: 'standard' },
          lastUpdated: new Date()
        }
      ],
      totalCapacity: 1000,
      usedCapacity: 560,
      availableCapacity: 440,
      utilizationTarget: 80,
      costPerUnit: 0.023,
      scalingPolicy: {
        enabled: true,
        minCapacity: 500,
        maxCapacity: 5000,
        targetUtilization: 80,
        scaleUpThreshold: 90,
        scaleDownThreshold: 70,
        cooldownPeriod: 1800,
        predictiveScaling: true,
        scheduledScaling: []
      },
      lastOptimized: new Date()
    });
  }

  async createResourcePool(id: string, pool: Omit<ResourcePool, 'id'>): Promise<void> {
    const resourcePool: ResourcePool = {
      id,
      ...pool
    };

    this.resourcePools.set(id, resourcePool);
    
    eventBus.emit('resource_pool_created', {
      poolId: id,
      name: pool.name,
      type: pool.type,
      totalCapacity: pool.totalCapacity,
      timestamp: new Date()
    });
  }

  /**
   * ANALYSIS ENGINE
   */
  private async startAnalysisEngine(): Promise<void> {
    // Run analysis every 30 minutes
    this.analysisInterval = setInterval(() => {
      this.runCapacityAnalysis();
    }, 1800000);

    // Run initial analysis
    await this.runCapacityAnalysis();
  }

  private async runCapacityAnalysis(): Promise<void> {
    try {
      await this.analyzeCapacityUtilization();
      await this.analyzeCapacityTrends();
      await this.analyzeResourceEfficiency();
      await this.generateOptimizationRecommendations();
    } catch (error) {
      console.error('Capacity analysis error:', error);
    }
  }

  private async analyzeCapacityUtilization(): Promise<void> {
    for (const metric of this.capacityMetrics.values()) {
      // Check for immediate capacity issues
      if (metric.utilization > 90) {
        await this.createCapacityAlert({
          id: `alert_${metric.id}_critical_${Date.now()}`,
          type: 'threshold_exceeded',
          severity: 'critical',
          resourceType: metric.resourceType,
          metric: metric.name,
          message: `${metric.name} utilization is critical`,
          details: `Current utilization: ${metric.utilization.toFixed(1)}%`,
          threshold: 90,
          currentValue: metric.utilization,
          recommendations: [
            'Scale up resources immediately',
            'Review recent usage patterns',
            'Consider load balancing options'
          ],
          created: new Date(),
          acknowledged: false
        });
      } else if (metric.utilization > 80) {
        await this.createCapacityAlert({
          id: `alert_${metric.id}_warning_${Date.now()}`,
          type: 'threshold_exceeded',
          severity: 'warning',
          resourceType: metric.resourceType,
          metric: metric.name,
          message: `${metric.name} utilization is high`,
          details: `Current utilization: ${metric.utilization.toFixed(1)}%`,
          threshold: 80,
          currentValue: metric.utilization,
          recommendations: [
            'Monitor closely for further increases',
            'Prepare scaling plans',
            'Review capacity planning'
          ],
          created: new Date(),
          acknowledged: false
        });
      }
    }
  }

  private async analyzeCapacityTrends(): Promise<void> {
    for (const metric of this.capacityMetrics.values()) {
      if (metric.trend === 'increasing' && metric.growthRate > 10) {
        await this.createCapacityAlert({
          id: `alert_${metric.id}_trend_${Date.now()}`,
          type: 'forecast_warning',
          severity: 'warning',
          resourceType: metric.resourceType,
          metric: metric.name,
          message: `${metric.name} showing rapid growth`,
          details: `Growth rate: ${metric.growthRate.toFixed(1)}% per month`,
          threshold: 10,
          currentValue: metric.growthRate,
          recommendations: [
            'Review growth drivers',
            'Plan capacity expansion',
            'Consider optimization opportunities'
          ],
          created: new Date(),
          acknowledged: false
        });
      }
    }
  }

  private async analyzeResourceEfficiency(): Promise<void> {
    for (const pool of this.resourcePools.values()) {
      const efficiency = this.calculateResourceEfficiency(pool);
      
      if (efficiency < 0.6) {
        await this.createCapacityAlert({
          id: `alert_${pool.id}_efficiency_${Date.now()}`,
          type: 'recommendation_urgent',
          severity: 'info',
          resourceType: pool.type,
          metric: 'efficiency',
          message: `${pool.name} has low efficiency`,
          details: `Current efficiency: ${(efficiency * 100).toFixed(1)}%`,
          threshold: 60,
          currentValue: efficiency * 100,
          recommendations: [
            'Optimize resource allocation',
            'Consider resource consolidation',
            'Review utilization patterns'
          ],
          created: new Date(),
          acknowledged: false
        });
      }
    }
  }

  private calculateResourceEfficiency(pool: ResourcePool): number {
    const utilizationEfficiency = pool.usedCapacity / pool.totalCapacity;
    const costEfficiency = pool.usedCapacity * pool.costPerUnit;
    
    // Simple efficiency calculation
    return (utilizationEfficiency + (1 - costEfficiency / 1000)) / 2;
  }

  private async generateOptimizationRecommendations(): Promise<void> {
    // Generate recommendations for resource optimization
    for (const pool of this.resourcePools.values()) {
      const recommendations = await this.analyzePoolOptimization(pool);
      
      for (const recommendation of recommendations) {
        this.recommendations.set(recommendation.id, recommendation);
        
        eventBus.emit('optimization_recommendation_generated', {
          recommendationId: recommendation.id,
          poolId: pool.id,
          type: recommendation.type,
          priority: recommendation.priority,
          timestamp: new Date()
        });
      }
    }
  }

  private async analyzePoolOptimization(pool: ResourcePool): Promise<CapacityRecommendation[]> {
    const recommendations: CapacityRecommendation[] = [];
    
    // Check for over-provisioning
    if (pool.usedCapacity / pool.totalCapacity < 0.5) {
      recommendations.push({
        id: `rec_${pool.id}_downsize_${Date.now()}`,
        type: 'scale_down',
        resourceType: pool.type,
        metric: 'utilization',
        priority: 'medium',
        impact: 'medium',
        description: `${pool.name} is over-provisioned`,
        reasoning: `Current utilization is only ${((pool.usedCapacity / pool.totalCapacity) * 100).toFixed(1)}%`,
        actions: [
          {
            id: `action_${Date.now()}`,
            type: 'remove_instance',
            description: `Remove ${Math.floor(pool.resources.length * 0.25)} instances`,
            parameters: {
              instanceCount: Math.floor(pool.resources.length * 0.25),
              targetUtilization: 70
            },
            estimatedCost: -2000,
            estimatedBenefit: 2000,
            riskLevel: 'low',
            automatable: true,
            dependencies: []
          }
        ],
        timeframe: '1 week',
        costImpact: -2000,
        riskLevel: 'low',
        confidence: 0.85,
        created: new Date(),
        implemented: false
      });
    }
    
    // Check for consolidation opportunities
    if (pool.resources.length > 2) {
      const lowUtilizationResources = pool.resources.filter(r => r.utilization < 30);
      
      if (lowUtilizationResources.length > 1) {
        recommendations.push({
          id: `rec_${pool.id}_consolidate_${Date.now()}`,
          type: 'optimize',
          resourceType: pool.type,
          metric: 'efficiency',
          priority: 'medium',
          impact: 'medium',
          description: `${pool.name} has consolidation opportunities`,
          reasoning: `${lowUtilizationResources.length} resources are under-utilized`,
          actions: [
            {
              id: `action_${Date.now()}`,
              type: 'optimize_config',
              description: `Consolidate ${lowUtilizationResources.length} under-utilized resources`,
              parameters: {
                resourceIds: lowUtilizationResources.map(r => r.id),
                consolidationTarget: 75
              },
              estimatedCost: 500,
              estimatedBenefit: 1500,
              riskLevel: 'medium',
              automatable: false,
              dependencies: []
            }
          ],
          timeframe: '2 weeks',
          costImpact: 500,
          riskLevel: 'medium',
          confidence: 0.75,
          created: new Date(),
          implemented: false
        });
      }
    }
    
    return recommendations;
  }

  /**
   * CAPACITY ALERTS
   */
  private async setupCapacityAlerts(): Promise<void> {
    // Setup alert monitoring
    setInterval(() => {
      this.processCapacityAlerts();
    }, 60000); // Check every minute
  }

  private async processCapacityAlerts(): Promise<void> {
    // Process forecast-based alerts
    for (const forecast of this.forecasts.values()) {
      const nearTermPredictions = forecast.predictions.filter(p => {
        const daysAhead = (p.timestamp.getTime() - Date.now()) / (24 * 60 * 60 * 1000);
        return daysAhead <= 7;
      });
      
      for (const prediction of nearTermPredictions) {
        if (prediction.predictedUtilization > 85) {
          const daysAhead = Math.floor((prediction.timestamp.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
          
          await this.createCapacityAlert({
            id: `alert_forecast_${forecast.id}_${Date.now()}`,
            type: 'forecast_warning',
            severity: 'warning',
            resourceType: forecast.resourceType,
            metric: forecast.metric,
            message: `${forecast.metric} forecast shows capacity issues`,
            details: `Predicted utilization: ${prediction.predictedUtilization.toFixed(1)}% in ${daysAhead} days`,
            threshold: 85,
            currentValue: prediction.predictedUtilization,
            predictedValue: prediction.predictedUtilization,
            timeToThreshold: daysAhead * 24 * 60 * 60 * 1000,
            recommendations: [
              'Plan capacity expansion',
              'Review growth drivers',
              'Consider optimization opportunities'
            ],
            created: new Date(),
            acknowledged: false
          });
        }
      }
    }
  }

  private async createCapacityAlert(alert: CapacityAlert): Promise<void> {
    // Check if similar alert already exists
    const existingAlert = Array.from(this.alerts.values()).find(a => 
      a.resourceType === alert.resourceType &&
      a.metric === alert.metric &&
      a.type === alert.type &&
      !a.acknowledged
    );
    
    if (existingAlert) return;

    this.alerts.set(alert.id, alert);
    
    eventBus.emit('capacity_alert_created', {
      alertId: alert.id,
      type: alert.type,
      severity: alert.severity,
      resourceType: alert.resourceType,
      metric: alert.metric,
      timestamp: new Date()
    });
  }

  /**
   * REPORTING
   */
  async generateCapacityReport(
    type: CapacityReport['type'],
    scope: CapacityReport['scope'],
    timeRange: { from: Date; to: Date },
    format: CapacityReport['format'] = 'json'
  ): Promise<CapacityReport> {
    const reportId = `report_${type}_${Date.now()}`;
    
    const report: CapacityReport = {
      id: reportId,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      type,
      scope,
      timeRange,
      data: await this.generateReportData(type, scope, timeRange),
      insights: await this.generateReportInsights(type, scope, timeRange),
      recommendations: Array.from(this.recommendations.values()),
      generated: new Date(),
      format
    };

    this.reports.set(reportId, report);
    
    eventBus.emit('capacity_report_generated', {
      reportId,
      type,
      scope,
      format,
      timestamp: new Date()
    });

    return report;
  }

  private async generateReportData(
    type: CapacityReport['type'],
    scope: CapacityReport['scope'],
    timeRange: { from: Date; to: Date }
  ): Promise<any> {
    const data: any = {
      summary: {
        totalMetrics: this.capacityMetrics.size,
        totalPools: this.resourcePools.size,
        totalForecasts: this.forecasts.size,
        totalRecommendations: this.recommendations.size,
        totalAlerts: this.alerts.size
      },
      metrics: {},
      pools: {},
      forecasts: {},
      recommendations: {},
      alerts: {}
    };

    // Add metrics data
    for (const metric of this.capacityMetrics.values()) {
      const filteredDataPoints = metric.dataPoints.filter(dp => 
        dp.timestamp >= timeRange.from && dp.timestamp <= timeRange.to
      );
      
      data.metrics[metric.id] = {
        name: metric.name,
        resourceType: metric.resourceType,
        currentValue: metric.currentValue,
        capacity: metric.capacity,
        utilization: metric.utilization,
        trend: metric.trend,
        growthRate: metric.growthRate,
        seasonality: metric.seasonality,
        dataPoints: filteredDataPoints
      };
    }

    // Add pools data
    for (const pool of this.resourcePools.values()) {
      data.pools[pool.id] = {
        name: pool.name,
        type: pool.type,
        totalCapacity: pool.totalCapacity,
        usedCapacity: pool.usedCapacity,
        utilization: (pool.usedCapacity / pool.totalCapacity) * 100,
        efficiency: this.calculateResourceEfficiency(pool),
        cost: pool.usedCapacity * pool.costPerUnit,
        resources: pool.resources.map(r => ({
          id: r.id,
          name: r.name,
          capacity: r.capacity,
          utilization: r.utilization,
          cost: r.cost,
          status: r.status
        }))
      };
    }

    // Add forecasts data
    for (const forecast of this.forecasts.values()) {
      data.forecasts[forecast.id] = {
        resourceType: forecast.resourceType,
        metric: forecast.metric,
        algorithm: forecast.algorithm,
        confidence: forecast.confidence,
        accuracy: forecast.accuracy,
        predictions: forecast.predictions.filter(p => 
          p.timestamp >= timeRange.from && p.timestamp <= timeRange.to
        )
      };
    }

    return data;
  }

  private async generateReportInsights(
    type: CapacityReport['type'],
    scope: CapacityReport['scope'],
    timeRange: { from: Date; to: Date }
  ): Promise<ReportInsight[]> {
    const insights: ReportInsight[] = [];

    // Growth trends insight
    const growingMetrics = Array.from(this.capacityMetrics.values())
      .filter(m => m.trend === 'increasing' && m.growthRate > 5);
    
    if (growingMetrics.length > 0) {
      insights.push({
        type: 'trend',
        title: 'Rapid Growth Detected',
        description: `${growingMetrics.length} resources showing rapid growth`,
        impact: 'high',
        data: {
          metrics: growingMetrics.map(m => ({
            name: m.name,
            growthRate: m.growthRate,
            currentUtilization: m.utilization
          }))
        },
        actionable: true
      });
    }

    // Efficiency opportunities
    const inefficientPools = Array.from(this.resourcePools.values())
      .filter(p => this.calculateResourceEfficiency(p) < 0.7);
    
    if (inefficientPools.length > 0) {
      insights.push({
        type: 'opportunity',
        title: 'Optimization Opportunities',
        description: `${inefficientPools.length} resource pools have optimization potential`,
        impact: 'medium',
        data: {
          pools: inefficientPools.map(p => ({
            name: p.name,
            efficiency: this.calculateResourceEfficiency(p),
            utilization: (p.usedCapacity / p.totalCapacity) * 100
          }))
        },
        actionable: true
      });
    }

    // Critical alerts
    const criticalAlerts = Array.from(this.alerts.values())
      .filter(a => a.severity === 'critical' && !a.acknowledged);
    
    if (criticalAlerts.length > 0) {
      insights.push({
        type: 'risk',
        title: 'Critical Capacity Issues',
        description: `${criticalAlerts.length} critical capacity alerts require immediate attention`,
        impact: 'critical',
        data: {
          alerts: criticalAlerts.map(a => ({
            resourceType: a.resourceType,
            metric: a.metric,
            message: a.message,
            created: a.created
          }))
        },
        actionable: true
      });
    }

    return insights;
  }

  /**
   * PUBLIC API
   */
  getCapacityMetric(id: string): CapacityMetric | undefined {
    return this.capacityMetrics.get(id);
  }

  getAllCapacityMetrics(): CapacityMetric[] {
    return Array.from(this.capacityMetrics.values());
  }

  getForecast(id: string): CapacityForecast | undefined {
    return this.forecasts.get(id);
  }

  getAllForecasts(): CapacityForecast[] {
    return Array.from(this.forecasts.values());
  }

  getRecommendation(id: string): CapacityRecommendation | undefined {
    return this.recommendations.get(id);
  }

  getAllRecommendations(): CapacityRecommendation[] {
    return Array.from(this.recommendations.values());
  }

  getRecommendationsByPriority(priority: CapacityRecommendation['priority']): CapacityRecommendation[] {
    return Array.from(this.recommendations.values()).filter(r => r.priority === priority);
  }

  getAlert(id: string): CapacityAlert | undefined {
    return this.alerts.get(id);
  }

  getAllAlerts(): CapacityAlert[] {
    return Array.from(this.alerts.values());
  }

  getActiveAlerts(): CapacityAlert[] {
    return Array.from(this.alerts.values()).filter(a => !a.acknowledged);
  }

  getResourcePool(id: string): ResourcePool | undefined {
    return this.resourcePools.get(id);
  }

  getAllResourcePools(): ResourcePool[] {
    return Array.from(this.resourcePools.values());
  }

  getReport(id: string): CapacityReport | undefined {
    return this.reports.get(id);
  }

  getAllReports(): CapacityReport[] {
    return Array.from(this.reports.values());
  }

  async acknowledgeAlert(alertId: string, acknowledgedBy: string): Promise<void> {
    const alert = this.alerts.get(alertId);
    if (!alert) return;

    alert.acknowledged = true;
    alert.acknowledgedBy = acknowledgedBy;
    alert.acknowledgedAt = new Date();

    this.alerts.set(alertId, alert);
    
    eventBus.emit('capacity_alert_acknowledged', {
      alertId,
      acknowledgedBy,
      timestamp: new Date()
    });
  }

  async implementRecommendation(recommendationId: string): Promise<void> {
    const recommendation = this.recommendations.get(recommendationId);
    if (!recommendation) return;

    recommendation.implemented = true;
    recommendation.implementedAt = new Date();

    this.recommendations.set(recommendationId, recommendation);
    
    eventBus.emit('capacity_recommendation_implemented', {
      recommendationId,
      type: recommendation.type,
      resourceType: recommendation.resourceType,
      timestamp: new Date()
    });
  }

  async getCapacityOverview(): Promise<{
    summary: any;
    metrics: any;
    forecasts: any;
    recommendations: any;
    alerts: any;
  }> {
    const summary = {
      totalMetrics: this.capacityMetrics.size,
      totalPools: this.resourcePools.size,
      totalForecasts: this.forecasts.size,
      totalRecommendations: this.recommendations.size,
      totalAlerts: this.alerts.size,
      activeAlerts: this.getActiveAlerts().length,
      criticalAlerts: this.getActiveAlerts().filter(a => a.severity === 'critical').length,
      highPriorityRecommendations: this.getRecommendationsByPriority('high').length
    };

    const metrics = Array.from(this.capacityMetrics.values()).map(m => ({
      id: m.id,
      name: m.name,
      resourceType: m.resourceType,
      utilization: m.utilization,
      trend: m.trend,
      growthRate: m.growthRate
    }));

    const forecasts = Array.from(this.forecasts.values()).map(f => ({
      id: f.id,
      resourceType: f.resourceType,
      metric: f.metric,
      algorithm: f.algorithm,
      confidence: f.confidence,
      nextWeekPrediction: f.predictions.find(p => {
        const daysAhead = (p.timestamp.getTime() - Date.now()) / (24 * 60 * 60 * 1000);
        return daysAhead <= 7;
      })
    }));

    const recommendations = Array.from(this.recommendations.values())
      .filter(r => !r.implemented)
      .map(r => ({
        id: r.id,
        type: r.type,
        priority: r.priority,
        resourceType: r.resourceType,
        description: r.description,
        costImpact: r.costImpact,
        timeframe: r.timeframe
      }));

    const alerts = this.getActiveAlerts().map(a => ({
      id: a.id,
      type: a.type,
      severity: a.severity,
      resourceType: a.resourceType,
      message: a.message,
      created: a.created
    }));

    return {
      summary,
      metrics,
      forecasts,
      recommendations,
      alerts
    };
  }

  // Cleanup method
  async cleanup(): Promise<void> {
    if (this.forecastingInterval) {
      clearInterval(this.forecastingInterval);
    }
    
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
    }
    
    console.log('Capacity Planning System cleaned up');
  }
}

// Export singleton instance
export const capacityPlanningSystem = new CapacityPlanningSystem();
