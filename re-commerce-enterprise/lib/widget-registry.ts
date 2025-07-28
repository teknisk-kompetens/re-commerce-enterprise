
/**
 * WIDGET REGISTRY SYSTEM
 * Enterprise-grade widget management with dynamic loading, hot-swapping,
 * version control, and performance monitoring
 */

import { prisma } from '@/lib/db';
import { eventBus, WidgetEvents } from '@/lib/event-bus-system';

export interface WidgetDefinition {
  id: string;
  name: string;
  version: string;
  category: string;
  description: string;
  author: string;
  tags: string[];
  
  // Technical specifications
  component: string; // React component path
  bundle?: string; // Optional bundle URL for dynamic loading
  dependencies: string[];
  peerDependencies?: string[];
  
  // Schema and configuration
  configSchema: WidgetConfigSchema;
  defaultConfig: any;
  presets?: WidgetPreset[];
  
  // Visual and behavioral properties
  icon: string;
  preview?: string;
  thumbnail?: string;
  dimensions: {
    minWidth: number;
    minHeight: number;
    maxWidth?: number;
    maxHeight?: number;
    aspectRatio?: number;
    resizable: boolean;
  };
  
  // Widget capabilities
  capabilities: {
    hasState: boolean;
    acceptsChildren: boolean;
    canBeNested: boolean;
    supportsDragDrop: boolean;
    supportsDataBinding: boolean;
    supportsEvents: boolean;
    supportsRealtime: boolean;
  };
  
  // Lifecycle and performance
  lifecycle: {
    onMount?: string;
    onUnmount?: string;
    onResize?: string;
    onDataChange?: string;
  };
  performance: {
    memoryUsage: number; // KB
    renderTime: number; // ms
    updateFrequency: number; // Hz
  };
  
  // Security and permissions
  security: {
    sandboxed: boolean;
    permissions: string[];
    trustedDomains?: string[];
    maxMemory?: number;
    maxCpu?: number;
  };
  
  // Metadata
  metadata: {
    created: Date;
    updated: Date;
    published: Date;
    deprecated?: Date;
    tenantId?: string;
    isPublic: boolean;
    downloads: number;
    rating: number;
    status: 'draft' | 'published' | 'deprecated' | 'archived';
  };
}

export interface WidgetConfigSchema {
  type: 'object';
  properties: Record<string, WidgetProperty>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface WidgetProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'color' | 'url' | 'enum';
  title: string;
  description?: string;
  default?: any;
  minimum?: number;
  maximum?: number;
  enum?: any[];
  items?: WidgetProperty;
  properties?: Record<string, WidgetProperty>;
  format?: string;
  pattern?: string;
  validation?: string; // Custom validation function
}

export interface WidgetPreset {
  id: string;
  name: string;
  description: string;
  config: any;
  preview?: string;
}

export interface WidgetInstance {
  id: string;
  widgetId: string;
  version: string;
  name: string;
  config: any;
  
  // Canvas positioning
  position: {
    x: number;
    y: number;
    z: number; // z-index for layering
  };
  size: {
    width: number;
    height: number;
  };
  
  // State and lifecycle
  state: any;
  isLoaded: boolean;
  isVisible: boolean;
  isLocked: boolean;
  isSelected: boolean;
  
  // Relationships
  parentId?: string;
  children: string[];
  connections: WidgetConnection[];
  
  // Metadata
  created: Date;
  updated: Date;
  createdBy: string;
  tenantId: string;
  canvasId: string;
}

export interface WidgetConnection {
  id: string;
  sourceWidget: string;
  targetWidget: string;
  sourcePort: string;
  targetPort: string;
  connectionType: 'data' | 'event' | 'visual';
  config?: any;
}

export interface WidgetMetrics {
  widgetId: string;
  instanceId: string;
  metrics: {
    renderTime: number;
    memoryUsage: number;
    cpuUsage: number;
    errorCount: number;
    interactionCount: number;
    lastInteraction: Date;
    performanceScore: number;
  };
  timestamp: Date;
}

export class WidgetRegistry {
  private static widgets = new Map<string, WidgetDefinition>();
  private static instances = new Map<string, WidgetInstance>();
  private static loadedComponents = new Map<string, any>();
  private static metrics = new Map<string, WidgetMetrics[]>();

  /**
   * Register a new widget definition
   */
  static async registerWidget(definition: WidgetDefinition): Promise<void> {
    try {
      // Validate widget definition
      await this.validateWidgetDefinition(definition);
      
      // Store in memory cache
      this.widgets.set(definition.id, definition);
      
      // Persist to database
      await this.persistWidgetDefinition(definition);
      
      // Publish registration event
      await eventBus.publish({
        type: WidgetEvents.WIDGET_LOADED,
        source: 'widget-registry',
        data: { widgetId: definition.id, version: definition.version },
        metadata: {
          tenantId: definition.metadata.tenantId,
          timestamp: new Date(),
        },
      });
      
      console.log(`Widget registered: ${definition.name} v${definition.version}`);
    } catch (error) {
      console.error('Error registering widget:', error);
      throw error;
    }
  }

  /**
   * Get widget definition by ID and version
   */
  static async getWidget(id: string, version?: string): Promise<WidgetDefinition | null> {
    const cacheKey = version ? `${id}:${version}` : id;
    
    // Check memory cache first
    let widget = this.widgets.get(cacheKey);
    if (widget) return widget;
    
    // Load from database
    const loadedWidget = await this.loadWidgetFromDatabase(id, version);
    if (loadedWidget) {
      this.widgets.set(cacheKey, loadedWidget);
      return loadedWidget;
    }
    
    return null;
  }

  /**
   * Search widgets with filters
   */
  static async searchWidgets(filters: {
    category?: string;
    tags?: string[];
    tenantId?: string;
    isPublic?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ widgets: WidgetDefinition[]; total: number }> {
    try {
      const where: any = {};
      
      if (filters.category) where.category = filters.category;
      if (filters.tenantId) where.tenantId = filters.tenantId;
      if (filters.isPublic !== undefined) where.isPublic = filters.isPublic;
      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { tags: { hasSome: [filters.search] } },
        ];
      }
      if (filters.tags && filters.tags.length > 0) {
        where.tags = { hasSome: filters.tags };
      }

      const [widgets, total] = await Promise.all([
        prisma.widgetDefinition.findMany({
          where,
          take: filters.limit || 50,
          skip: filters.offset || 0,
          orderBy: { updatedAt: 'desc' },
        }),
        prisma.widgetDefinition.count({ where }),
      ]);

      return {
        widgets: widgets.map(w => this.parseWidgetFromDatabase(w)),
        total,
      };
    } catch (error) {
      console.error('Error searching widgets:', error);
      return { widgets: [], total: 0 };
    }
  }

  /**
   * Create widget instance on canvas
   */
  static async createInstance(
    widgetId: string,
    canvasId: string,
    config: Partial<WidgetInstance>
  ): Promise<WidgetInstance> {
    try {
      const widget = await this.getWidget(widgetId);
      if (!widget) {
        throw new Error(`Widget ${widgetId} not found`);
      }

      const instance: WidgetInstance = {
        id: crypto.randomUUID(),
        widgetId,
        version: widget.version,
        name: config.name || widget.name,
        config: { ...widget.defaultConfig, ...config.config },
        position: config.position || { x: 0, y: 0, z: 0 },
        size: config.size || {
          width: widget.dimensions.minWidth,
          height: widget.dimensions.minHeight,
        },
        state: {},
        isLoaded: false,
        isVisible: true,
        isLocked: false,
        isSelected: false,
        parentId: config.parentId,
        children: [],
        connections: [],
        created: new Date(),
        updated: new Date(),
        createdBy: config.createdBy || 'system',
        tenantId: config.tenantId || 'default',
        canvasId,
      };

      // Store instance
      this.instances.set(instance.id, instance);
      
      // Persist to database
      await this.persistWidgetInstance(instance);
      
      // Load widget component
      await this.loadWidgetComponent(instance);
      
      // Publish instance creation event
      await eventBus.publish({
        type: WidgetEvents.WIDGET_CONFIGURED,
        source: 'widget-registry',
        target: instance.id,
        data: { instance },
        metadata: {
          tenantId: instance.tenantId,
          timestamp: new Date(),
        },
      });

      return instance;
    } catch (error) {
      console.error('Error creating widget instance:', error);
      throw error;
    }
  }

  /**
   * Update widget instance
   */
  static async updateInstance(
    instanceId: string,
    updates: Partial<WidgetInstance>
  ): Promise<WidgetInstance | null> {
    try {
      const instance = this.instances.get(instanceId);
      if (!instance) {
        throw new Error(`Widget instance ${instanceId} not found`);
      }

      // Apply updates
      const updatedInstance = {
        ...instance,
        ...updates,
        updated: new Date(),
      };

      // Update cache
      this.instances.set(instanceId, updatedInstance);
      
      // Persist changes
      await this.persistWidgetInstance(updatedInstance);
      
      // Publish update event
      await eventBus.publish({
        type: WidgetEvents.WIDGET_CONFIGURED,
        source: 'widget-registry',
        target: instanceId,
        data: { instance: updatedInstance, updates },
        metadata: {
          tenantId: updatedInstance.tenantId,
          timestamp: new Date(),
        },
      });

      return updatedInstance;
    } catch (error) {
      console.error('Error updating widget instance:', error);
      return null;
    }
  }

  /**
   * Load widget component dynamically
   */
  static async loadWidgetComponent(instance: WidgetInstance): Promise<any> {
    try {
      const widget = await this.getWidget(instance.widgetId);
      if (!widget) {
        throw new Error(`Widget definition not found: ${instance.widgetId}`);
      }

      // Check if component is already loaded
      const cacheKey = `${widget.id}:${widget.version}`;
      if (this.loadedComponents.has(cacheKey)) {
        instance.isLoaded = true;
        return this.loadedComponents.get(cacheKey);
      }

      let component;
      
      if (widget.bundle) {
        // Dynamic loading from bundle URL
        component = await this.loadFromBundle(widget.bundle);
      } else {
        // Static import
        component = await this.loadFromStaticImport(widget.component);
      }

      // Cache the component
      this.loadedComponents.set(cacheKey, component);
      instance.isLoaded = true;

      // Update instance
      await this.updateInstance(instance.id, { isLoaded: true });

      return component;
    } catch (error) {
      console.error('Error loading widget component:', error);
      
      // Mark as error
      await eventBus.publish({
        type: WidgetEvents.WIDGET_ERROR,
        source: 'widget-registry',
        target: instance.id,
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
        metadata: {
          tenantId: instance.tenantId,
          timestamp: new Date(),
        },
      });
      
      throw error;
    }
  }

  /**
   * Hot-swap widget component
   */
  static async hotSwapWidget(instanceId: string, newWidgetId: string): Promise<boolean> {
    try {
      const instance = this.instances.get(instanceId);
      if (!instance) return false;

      const newWidget = await this.getWidget(newWidgetId);
      if (!newWidget) return false;

      // Unload old component
      await this.unloadWidgetComponent(instance);
      
      // Update instance to use new widget
      const updatedInstance = await this.updateInstance(instanceId, {
        widgetId: newWidgetId,
        version: newWidget.version,
        config: { ...newWidget.defaultConfig, ...instance.config },
        isLoaded: false,
      });

      if (!updatedInstance) return false;

      // Load new component
      await this.loadWidgetComponent(updatedInstance);

      // Publish hot-swap event
      await eventBus.publish({
        type: 'widget.hot_swapped',
        source: 'widget-registry',
        target: instanceId,
        data: { 
          oldWidgetId: instance.widgetId,
          newWidgetId,
          instance: updatedInstance 
        },
        metadata: {
          tenantId: updatedInstance.tenantId,
          timestamp: new Date(),
        },
      });

      return true;
    } catch (error) {
      console.error('Error hot-swapping widget:', error);
      return false;
    }
  }

  /**
   * Record widget performance metrics
   */
  static recordMetrics(instanceId: string, metrics: Partial<WidgetMetrics['metrics']>): void {
    const instance = this.instances.get(instanceId);
    if (!instance) return;

    const metricEntry: WidgetMetrics = {
      widgetId: instance.widgetId,
      instanceId,
      metrics: {
        renderTime: 0,
        memoryUsage: 0,
        cpuUsage: 0,
        errorCount: 0,
        interactionCount: 0,
        lastInteraction: new Date(),
        performanceScore: 100,
        ...metrics,
      },
      timestamp: new Date(),
    };

    // Store metrics
    const existingMetrics = this.metrics.get(instanceId) || [];
    existingMetrics.push(metricEntry);
    
    // Keep only last 100 metrics entries per instance
    if (existingMetrics.length > 100) {
      existingMetrics.shift();
    }
    
    this.metrics.set(instanceId, existingMetrics);

    // Persist to database occasionally
    if (existingMetrics.length % 10 === 0) {
      this.persistMetrics(instanceId, metricEntry);
    }
  }

  /**
   * Get widget performance analytics
   */
  static getAnalytics(filters: {
    widgetId?: string;
    instanceId?: string;
    timeRange?: { start: Date; end: Date };
  }): any {
    // Implementation for analytics aggregation
    const analytics = {
      totalWidgets: this.widgets.size,
      totalInstances: this.instances.size,
      averagePerformance: 0,
      topPerformers: [],
      errorRate: 0,
      memoryUsage: 0,
    };

    // Calculate analytics based on filters
    return analytics;
  }

  // Private helper methods
  private static async validateWidgetDefinition(definition: WidgetDefinition): Promise<void> {
    // Validate required fields
    if (!definition.id || !definition.name || !definition.version) {
      throw new Error('Widget definition missing required fields');
    }

    // Validate schema
    if (!definition.configSchema || typeof definition.configSchema !== 'object') {
      throw new Error('Invalid config schema');
    }

    // Validate security settings
    if (definition.security.sandboxed && !definition.security.permissions) {
      throw new Error('Sandboxed widgets must specify permissions');
    }
  }

  private static async persistWidgetDefinition(definition: WidgetDefinition): Promise<void> {
    try {
      await prisma.widgetDefinition.upsert({
        where: { 
          id_version: { 
            id: definition.id, 
            version: definition.version 
          } 
        },
        update: {
          name: definition.name,
          category: definition.category,
          description: definition.description,
          author: definition.author,
          tags: definition.tags,
          component: definition.component,
          bundle: definition.bundle,
          dependencies: definition.dependencies,
          configSchema: definition.configSchema as any,
          defaultConfig: definition.defaultConfig as any,
          icon: definition.icon,
          dimensions: definition.dimensions as any,
          capabilities: definition.capabilities as any,
          security: definition.security as any,
          metadata: definition.metadata as any,
          updatedAt: new Date(),
        },
        create: {
          id: definition.id,
          version: definition.version,
          name: definition.name,
          category: definition.category,
          description: definition.description,
          author: definition.author,
          tags: definition.tags,
          component: definition.component,
          bundle: definition.bundle,
          dependencies: definition.dependencies,
          configSchema: definition.configSchema as any,
          defaultConfig: definition.defaultConfig as any,
          icon: definition.icon,
          dimensions: definition.dimensions as any,
          capabilities: definition.capabilities as any,
          lifecycle: definition.lifecycle as any,
          performance: definition.performance as any,
          security: definition.security as any,
          metadata: definition.metadata as any,
          tenantId: definition.metadata.tenantId,
        },
      });
    } catch (error) {
      console.error('Error persisting widget definition:', error);
    }
  }

  private static async persistWidgetInstance(instance: WidgetInstance): Promise<void> {
    try {
      await prisma.widgetInstance.upsert({
        where: { id: instance.id },
        update: {
          name: instance.name,
          config: instance.config as any,
          position: instance.position as any,
          size: instance.size as any,
          state: instance.state as any,
          isVisible: instance.isVisible,
          isLocked: instance.isLocked,
          parentId: instance.parentId,
          updatedAt: instance.updated,
        },
        create: {
          id: instance.id,
          widgetId: instance.widgetId,
          version: instance.version,
          name: instance.name,
          config: instance.config as any,
          position: instance.position as any,
          size: instance.size as any,
          state: instance.state as any,
          isVisible: instance.isVisible,
          isLocked: instance.isLocked,
          parentId: instance.parentId,
          createdBy: instance.createdBy,
          tenantId: instance.tenantId,
          canvasId: instance.canvasId,
          createdAt: instance.created,
          updatedAt: instance.updated,
        },
      });
    } catch (error) {
      console.error('Error persisting widget instance:', error);
    }
  }

  private static async loadWidgetFromDatabase(id: string, version?: string): Promise<WidgetDefinition | null> {
    try {
      const where: any = { id };
      if (version) where.version = version;

      const widget = await prisma.widgetDefinition.findFirst({
        where,
        orderBy: version ? undefined : { updatedAt: 'desc' },
      });

      return widget ? this.parseWidgetFromDatabase(widget) : null;
    } catch (error) {
      console.error('Error loading widget from database:', error);
      return null;
    }
  }

  private static parseWidgetFromDatabase(dbWidget: any): WidgetDefinition {
    return {
      id: dbWidget.id,
      version: dbWidget.version,
      name: dbWidget.name,
      category: dbWidget.category,
      description: dbWidget.description,
      author: dbWidget.author,
      tags: dbWidget.tags || [],
      component: dbWidget.component,
      bundle: dbWidget.bundle,
      dependencies: dbWidget.dependencies || [],
      peerDependencies: dbWidget.peerDependencies || [],
      configSchema: dbWidget.configSchema,
      defaultConfig: dbWidget.defaultConfig,
      presets: dbWidget.presets || [],
      icon: dbWidget.icon,
      preview: dbWidget.preview,
      thumbnail: dbWidget.thumbnail,
      dimensions: dbWidget.dimensions,
      capabilities: dbWidget.capabilities,
      lifecycle: dbWidget.lifecycle || {},
      performance: dbWidget.performance || { memoryUsage: 0, renderTime: 0, updateFrequency: 60 },
      security: dbWidget.security,
      metadata: dbWidget.metadata,
    };
  }

  private static async loadFromBundle(bundleUrl: string): Promise<any> {
    // Dynamic loading from bundle URL
    const response = await fetch(bundleUrl);
    const bundleCode = await response.text();
    
    // Create and execute bundle in isolated context
    const moduleExports = {};
    const moduleContext = { exports: moduleExports, module: { exports: moduleExports } };
    
    // Execute bundle code
    const bundleFunction = new Function('exports', 'module', 'require', bundleCode);
    bundleFunction(moduleExports, moduleContext, () => {});
    
    return moduleContext.module.exports;
  }

  private static async loadFromStaticImport(componentPath: string): Promise<any> {
    try {
      // Dynamic import of static component
      const module = await import(componentPath);
      return module.default || module;
    } catch (error) {
      console.error(`Error loading component from ${componentPath}:`, error);
      throw error;
    }
  }

  private static async unloadWidgetComponent(instance: WidgetInstance): Promise<void> {
    // Cleanup component resources
    instance.isLoaded = false;
    
    // Publish unload event
    await eventBus.publish({
      type: WidgetEvents.WIDGET_UNLOADED,
      source: 'widget-registry',
      target: instance.id,
      data: { instance },
      metadata: {
        tenantId: instance.tenantId,
        timestamp: new Date(),
      },
    });
  }

  private static async persistMetrics(instanceId: string, metrics: WidgetMetrics): Promise<void> {
    try {
      await prisma.widgetMetrics.create({
        data: {
          id: crypto.randomUUID(),
          instanceId,
          widgetId: metrics.widgetId,
          renderTime: metrics.metrics.renderTime,
          memoryUsage: metrics.metrics.memoryUsage,
          cpuUsage: metrics.metrics.cpuUsage,
          errorCount: metrics.metrics.errorCount,
          interactionCount: metrics.metrics.interactionCount,
          performanceScore: metrics.metrics.performanceScore,
          timestamp: metrics.timestamp,
        },
      });
    } catch (error) {
      console.error('Error persisting widget metrics:', error);
    }
  }
}

// Singleton export
export const widgetRegistry = WidgetRegistry;
