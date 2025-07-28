
/**
 * BLUEPRINT SYSTEM
 * Advanced template and schema system for rapid widget creation,
 * inheritance patterns, and dynamic composition
 */

import { prisma } from '@/lib/db';
import { eventBus } from '@/lib/event-bus-system';
import { WidgetDefinition, WidgetConfigSchema, WidgetInstance } from '@/lib/widget-registry';

export interface BlueprintDefinition {
  id: string;
  name: string;
  version: string;
  description: string;
  category: string;
  author: string;
  tags: string[];
  
  // Blueprint type and composition
  type: 'widget' | 'layout' | 'page' | 'application';
  composition: {
    widgets: BlueprintWidget[];
    layouts: BlueprintLayout[];
    connections: BlueprintConnection[];
    dataFlow: BlueprintDataFlow[];
  };
  
  // Schema and validation
  schema: BlueprintSchema;
  validation: {
    rules: ValidationRule[];
    customValidators?: string[];
  };
  
  // Inheritance and extension
  inheritance: {
    parentBlueprint?: string;
    extends: string[];
    overrides: Record<string, any>;
    abstracts: string[];
  };
  
  // Configuration and customization
  configuration: {
    parameters: BlueprintParameter[];
    variants: BlueprintVariant[];
    themes: BlueprintTheme[];
  };
  
  // Preview and documentation
  preview: {
    thumbnail?: string;
    screenshots: string[];
    demoUrl?: string;
    description: string;
  };
  
  // Metadata and versioning
  metadata: {
    created: Date;
    updated: Date;
    published?: Date;
    deprecated?: Date;
    tenantId?: string;
    isPublic: boolean;
    downloads: number;
    rating: number;
    status: 'draft' | 'published' | 'deprecated' | 'archived';
    changeLog: ChangeLogEntry[];
  };
}

export interface BlueprintWidget {
  id: string;
  widgetId: string;
  name: string;
  position: { x: number; y: number; z: number };
  size: { width: number; height: number };
  config: any;
  constraints?: {
    locked?: boolean;
    resizable?: boolean;
    draggable?: boolean;
    deletable?: boolean;
  };
  binding?: {
    dataSource?: string;
    eventHandlers?: Record<string, string>;
    stateMapping?: Record<string, string>;
  };
}

export interface BlueprintLayout {
  id: string;
  type: 'grid' | 'flexbox' | 'absolute' | 'flow';
  config: any;
  children: string[];
  responsive?: {
    breakpoints: Record<string, any>;
    adaptiveLayout: boolean;
  };
}

export interface BlueprintConnection {
  id: string;
  source: { widgetId: string; port: string };
  target: { widgetId: string; port: string };
  type: 'data' | 'event' | 'style';
  config?: any;
  conditional?: {
    condition: string;
    trueAction: any;
    falseAction?: any;
  };
}

export interface BlueprintDataFlow {
  id: string;
  name: string;
  source: string;
  transformations: DataTransformation[];
  destinations: string[];
  triggers: DataTrigger[];
}

export interface DataTransformation {
  id: string;
  type: 'map' | 'filter' | 'reduce' | 'validate' | 'format';
  config: any;
  function?: string; // Custom transformation function
}

export interface DataTrigger {
  event: string;
  condition?: string;
  debounce?: number;
  throttle?: number;
}

export interface BlueprintSchema {
  type: 'object';
  properties: Record<string, BlueprintProperty>;
  required?: string[];
  dependencies?: Record<string, string[]>;
  conditionalProperties?: ConditionalProperty[];
}

export interface BlueprintProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'widget' | 'layout';
  title: string;
  description?: string;
  default?: any;
  enum?: any[];
  minimum?: number;
  maximum?: number;
  pattern?: string;
  format?: string;
  items?: BlueprintProperty;
  properties?: Record<string, BlueprintProperty>;
  validation?: string;
  widget?: {
    type: string;
    config?: any;
  };
}

export interface ConditionalProperty {
  condition: string;
  properties: Record<string, BlueprintProperty>;
  required?: string[];
}

export interface ValidationRule {
  id: string;
  property: string;
  rule: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface BlueprintParameter {
  id: string;
  name: string;
  type: string;
  description: string;
  default?: any;
  required: boolean;
  validation?: ValidationRule[];
  widget?: {
    type: string;
    config?: any;
  };
}

export interface BlueprintVariant {
  id: string;
  name: string;
  description: string;
  config: any;
  preview?: string;
  isDefault?: boolean;
}

export interface BlueprintTheme {
  id: string;
  name: string;
  description: string;
  variables: Record<string, any>;
  styles: any;
  preview?: string;
}

export interface ChangeLogEntry {
  version: string;
  date: Date;
  changes: string[];
  author: string;
  breaking?: boolean;
}

export interface BlueprintInstance {
  id: string;
  blueprintId: string;
  version: string;
  name: string;
  config: any;
  
  // Generated content
  widgets: WidgetInstance[];
  canvasId: string;
  
  // State and lifecycle
  state: any;
  isBuilt: boolean;
  buildErrors?: string[];
  
  // Metadata
  created: Date;
  updated: Date;
  createdBy: string;
  tenantId: string;
}

export class BlueprintSystem {
  private static blueprints = new Map<string, BlueprintDefinition>();
  private static instances = new Map<string, BlueprintInstance>();
  private static validators = new Map<string, Function>();

  /**
   * Register a new blueprint definition
   */
  static async registerBlueprint(blueprint: BlueprintDefinition): Promise<void> {
    try {
      // Validate blueprint
      await this.validateBlueprint(blueprint);
      
      // Check inheritance dependencies
      await this.validateInheritance(blueprint);
      
      // Store in memory cache
      this.blueprints.set(blueprint.id, blueprint);
      
      // Persist to database
      await this.persistBlueprint(blueprint);
      
      // Publish registration event
      await eventBus.publish({
        type: 'blueprint.registered',
        source: 'blueprint-system',
        data: { blueprintId: blueprint.id, version: blueprint.version },
        metadata: {
          tenantId: blueprint.metadata.tenantId,
          timestamp: new Date(),
        },
      });
      
      console.log(`Blueprint registered: ${blueprint.name} v${blueprint.version}`);
    } catch (error) {
      console.error('Error registering blueprint:', error);
      throw error;
    }
  }

  /**
   * Get blueprint by ID and version
   */
  static async getBlueprint(id: string, version?: string): Promise<BlueprintDefinition | null> {
    const cacheKey = version ? `${id}:${version}` : id;
    
    // Check memory cache first
    let blueprint = this.blueprints.get(cacheKey);
    if (blueprint) return blueprint;
    
    // Load from database
    const loadedBlueprint = await this.loadBlueprintFromDatabase(id, version);
    if (loadedBlueprint) {
      this.blueprints.set(cacheKey, loadedBlueprint);
      return loadedBlueprint;
    }
    
    return null;
  }

  /**
   * Search blueprints with filters
   */
  static async searchBlueprints(filters: {
    category?: string;
    type?: string;
    tags?: string[];
    tenantId?: string;
    isPublic?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ blueprints: BlueprintDefinition[]; total: number }> {
    try {
      const where: any = {};
      
      if (filters.category) where.category = filters.category;
      if (filters.type) where.type = filters.type;
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

      const [blueprints, total] = await Promise.all([
        prisma.blueprintDefinition.findMany({
          where,
          take: filters.limit || 50,
          skip: filters.offset || 0,
          orderBy: { updatedAt: 'desc' },
        }),
        prisma.blueprintDefinition.count({ where }),
      ]);

      return {
        blueprints: blueprints.map(b => this.parseBlueprintFromDatabase(b)),
        total,
      };
    } catch (error) {
      console.error('Error searching blueprints:', error);
      return { blueprints: [], total: 0 };
    }
  }

  /**
   * Create blueprint instance
   */
  static async createInstance(
    blueprintId: string,
    canvasId: string,
    config: {
      name: string;
      parameters?: any;
      variant?: string;
      theme?: string;
      tenantId: string;
      createdBy: string;
    }
  ): Promise<BlueprintInstance> {
    try {
      const blueprint = await this.getBlueprint(blueprintId);
      if (!blueprint) {
        throw new Error(`Blueprint ${blueprintId} not found`);
      }

      const instance: BlueprintInstance = {
        id: crypto.randomUUID(),
        blueprintId,
        version: blueprint.version,
        name: config.name,
        config: {
          parameters: config.parameters || {},
          variant: config.variant,
          theme: config.theme,
        },
        widgets: [],
        canvasId,
        state: {},
        isBuilt: false,
        created: new Date(),
        updated: new Date(),
        createdBy: config.createdBy,
        tenantId: config.tenantId,
      };

      // Store instance
      this.instances.set(instance.id, instance);
      
      // Build blueprint content
      await this.buildBlueprintInstance(instance, blueprint);
      
      // Persist to database
      await this.persistBlueprintInstance(instance);
      
      // Publish creation event
      await eventBus.publish({
        type: 'blueprint.instance_created',
        source: 'blueprint-system',
        data: { instance },
        metadata: {
          tenantId: instance.tenantId,
          timestamp: new Date(),
        },
      });

      return instance;
    } catch (error) {
      console.error('Error creating blueprint instance:', error);
      throw error;
    }
  }

  /**
   * Build blueprint instance (generate widgets and layouts)
   */
  static async buildBlueprintInstance(
    instance: BlueprintInstance,
    blueprint: BlueprintDefinition
  ): Promise<void> {
    try {
      const { widgetRegistry } = await import('@/lib/widget-registry');
      const { canvasSystem } = await import('@/lib/canvas-system');
      const buildErrors: string[] = [];

      // Apply inheritance and extensions
      const resolvedBlueprint = await this.resolveInheritance(blueprint);
      
      // Process parameters and variants
      const processedConfig = this.processConfiguration(
        resolvedBlueprint,
        instance.config
      );

      // Generate widgets
      for (const blueprintWidget of resolvedBlueprint.composition.widgets) {
        try {
          // Apply parameter substitution
          const widgetConfig = this.substituteParameters(
            blueprintWidget.config,
            processedConfig.parameters
          );

          // Create widget instance
          const widgetInstance = await widgetRegistry.createInstance(
            blueprintWidget.widgetId,
            instance.canvasId,
            {
              name: blueprintWidget.name,
              config: widgetConfig,
              position: blueprintWidget.position,
              size: blueprintWidget.size,
              tenantId: instance.tenantId,
              createdBy: instance.createdBy,
            }
          );

          instance.widgets.push(widgetInstance);
          
          // Add to canvas layer
          canvasSystem.addWidgetToLayer(instance.canvasId, widgetInstance.id);

        } catch (error) {
          const errorMsg = `Failed to create widget ${blueprintWidget.name}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`;
          buildErrors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      // Process data flows and connections
      await this.setupBlueprintConnections(instance, resolvedBlueprint);
      
      // Apply layout configurations
      await this.applyLayoutConfigurations(instance, resolvedBlueprint);

      // Mark as built
      instance.isBuilt = buildErrors.length === 0;
      instance.buildErrors = buildErrors.length > 0 ? buildErrors : undefined;
      instance.updated = new Date();

      // Publish build completion event
      await eventBus.publish({
        type: instance.isBuilt ? 'blueprint.build_success' : 'blueprint.build_error',
        source: 'blueprint-system',
        target: instance.id,
        data: { 
          instance,
          errors: buildErrors,
          widgetCount: instance.widgets.length 
        },
        metadata: {
          tenantId: instance.tenantId,
          timestamp: new Date(),
        },
      });

    } catch (error) {
      console.error('Error building blueprint instance:', error);
      instance.isBuilt = false;
      instance.buildErrors = [error instanceof Error ? error.message : 'Unknown error'];
      throw error;
    }
  }

  /**
   * Validate blueprint configuration
   */
  static async validateBlueprintConfig(
    blueprintId: string,
    config: any
  ): Promise<{ valid: boolean; errors: string[] }> {
    try {
      const blueprint = await this.getBlueprint(blueprintId);
      if (!blueprint) {
        return { valid: false, errors: ['Blueprint not found'] };
      }

      const errors: string[] = [];

      // Validate against schema
      const schemaErrors = this.validateAgainstSchema(config, blueprint.schema);
      errors.push(...schemaErrors);

      // Run custom validation rules
      for (const rule of blueprint.validation.rules) {
        const ruleErrors = this.validateRule(config, rule);
        errors.push(...ruleErrors);
      }

      // Run custom validators
      if (blueprint.validation.customValidators) {
        for (const validatorName of blueprint.validation.customValidators) {
          const validator = this.validators.get(validatorName);
          if (validator) {
            try {
              const result = await validator(config, blueprint);
              if (result !== true && typeof result === 'string') {
                errors.push(result);
              } else if (Array.isArray(result)) {
                errors.push(...result);
              }
            } catch (error) {
              errors.push(`Custom validator ${validatorName} failed: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`);
            }
          }
        }
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    } catch (error) {
      console.error('Error validating blueprint config:', error);
      return {
        valid: false,
        errors: [error instanceof Error ? error.message : 'Validation failed'],
      };
    }
  }

  /**
   * Register custom validator
   */
  static registerValidator(name: string, validator: Function): void {
    this.validators.set(name, validator);
  }

  /**
   * Clone blueprint for customization
   */
  static async cloneBlueprint(
    blueprintId: string,
    config: {
      name: string;
      version: string;
      author: string;
      tenantId: string;
      modifications?: any;
    }
  ): Promise<BlueprintDefinition> {
    try {
      const original = await this.getBlueprint(blueprintId);
      if (!original) {
        throw new Error(`Blueprint ${blueprintId} not found`);
      }

      const cloned: BlueprintDefinition = {
        ...original,
        id: crypto.randomUUID(),
        name: config.name,
        version: config.version,
        author: config.author,
        inheritance: {
          ...original.inheritance,
          parentBlueprint: blueprintId,
        },
        metadata: {
          ...original.metadata,
          created: new Date(),
          updated: new Date(),
          published: undefined,
          tenantId: config.tenantId,
          isPublic: false,
          downloads: 0,
          rating: 0,
          status: 'draft',
          changeLog: [],
        },
      };

      // Apply modifications if provided
      if (config.modifications) {
        this.applyModifications(cloned, config.modifications);
      }

      // Register the cloned blueprint
      await this.registerBlueprint(cloned);

      return cloned;
    } catch (error) {
      console.error('Error cloning blueprint:', error);
      throw error;
    }
  }

  // Private helper methods
  private static async validateBlueprint(blueprint: BlueprintDefinition): Promise<void> {
    // Validate required fields
    if (!blueprint.id || !blueprint.name || !blueprint.version) {
      throw new Error('Blueprint missing required fields');
    }

    // Validate schema
    if (!blueprint.schema || typeof blueprint.schema !== 'object') {
      throw new Error('Invalid blueprint schema');
    }

    // Validate composition
    if (!blueprint.composition || !Array.isArray(blueprint.composition.widgets)) {
      throw new Error('Invalid blueprint composition');
    }
  }

  private static async validateInheritance(blueprint: BlueprintDefinition): Promise<void> {
    if (blueprint.inheritance.parentBlueprint) {
      const parent = await this.getBlueprint(blueprint.inheritance.parentBlueprint);
      if (!parent) {
        throw new Error(`Parent blueprint ${blueprint.inheritance.parentBlueprint} not found`);
      }
    }

    for (const extendedId of blueprint.inheritance.extends) {
      const extended = await this.getBlueprint(extendedId);
      if (!extended) {
        throw new Error(`Extended blueprint ${extendedId} not found`);
      }
    }
  }

  private static async resolveInheritance(blueprint: BlueprintDefinition): Promise<BlueprintDefinition> {
    // Start with base blueprint
    let resolved = { ...blueprint };

    // Apply parent inheritance
    if (blueprint.inheritance.parentBlueprint) {
      const parent = await this.getBlueprint(blueprint.inheritance.parentBlueprint);
      if (parent) {
        const resolvedParent = await this.resolveInheritance(parent);
        resolved = this.mergeBlueprints(resolvedParent, resolved);
      }
    }

    // Apply extensions
    for (const extendedId of blueprint.inheritance.extends) {
      const extended = await this.getBlueprint(extendedId);
      if (extended) {
        const resolvedExtended = await this.resolveInheritance(extended);
        resolved = this.mergeBlueprints(resolved, resolvedExtended);
      }
    }

    // Apply overrides
    if (blueprint.inheritance.overrides) {
      resolved = this.applyOverrides(resolved, blueprint.inheritance.overrides);
    }

    return resolved;
  }

  private static mergeBlueprints(base: BlueprintDefinition, overlay: BlueprintDefinition): BlueprintDefinition {
    // Deep merge logic for blueprint composition
    return {
      ...base,
      ...overlay,
      composition: {
        widgets: [...base.composition.widgets, ...overlay.composition.widgets],
        layouts: [...base.composition.layouts, ...overlay.composition.layouts],
        connections: [...base.composition.connections, ...overlay.composition.connections],
        dataFlow: [...base.composition.dataFlow, ...overlay.composition.dataFlow],
      },
      schema: {
        ...base.schema,
        ...overlay.schema,
        properties: {
          ...base.schema.properties,
          ...overlay.schema.properties,
        },
      },
      configuration: {
        parameters: [...base.configuration.parameters, ...overlay.configuration.parameters],
        variants: [...base.configuration.variants, ...overlay.configuration.variants],
        themes: [...base.configuration.themes, ...overlay.configuration.themes],
      },
    };
  }

  private static applyOverrides(blueprint: BlueprintDefinition, overrides: Record<string, any>): BlueprintDefinition {
    // Apply overrides to blueprint configuration
    const result = { ...blueprint };
    
    for (const [path, value] of Object.entries(overrides)) {
      this.setDeepProperty(result, path, value);
    }
    
    return result;
  }

  private static setDeepProperty(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
  }

  private static processConfiguration(
    blueprint: BlueprintDefinition,
    config: any
  ): { parameters: any; variant: any; theme: any } {
    // Process parameters with defaults
    const parameters = { ...config.parameters };
    for (const param of blueprint.configuration.parameters) {
      if (!(param.name in parameters)) {
        parameters[param.name] = param.default;
      }
    }

    // Get variant configuration
    const variant = config.variant
      ? blueprint.configuration.variants.find(v => v.id === config.variant)?.config
      : blueprint.configuration.variants.find(v => v.isDefault)?.config || {};

    // Get theme configuration
    const theme = config.theme
      ? blueprint.configuration.themes.find(t => t.id === config.theme)
      : blueprint.configuration.themes[0] || {};

    return { parameters, variant, theme };
  }

  private static substituteParameters(template: any, parameters: any): any {
    if (typeof template === 'string') {
      return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return parameters[key] !== undefined ? parameters[key] : match;
      });
    } else if (Array.isArray(template)) {
      return template.map(item => this.substituteParameters(item, parameters));
    } else if (template && typeof template === 'object') {
      const result: any = {};
      for (const [key, value] of Object.entries(template)) {
        result[key] = this.substituteParameters(value, parameters);
      }
      return result;
    }
    return template;
  }

  private static async setupBlueprintConnections(
    instance: BlueprintInstance,
    blueprint: BlueprintDefinition
  ): Promise<void> {
    // Setup data flows and widget connections
    for (const connection of blueprint.composition.connections) {
      // Implementation would setup actual widget-to-widget connections
      await eventBus.publish({
        type: 'blueprint.connection_established',
        source: 'blueprint-system',
        data: { instanceId: instance.id, connection },
        metadata: {
          tenantId: instance.tenantId,
          timestamp: new Date(),
        },
      });
    }
  }

  private static async applyLayoutConfigurations(
    instance: BlueprintInstance,
    blueprint: BlueprintDefinition
  ): Promise<void> {
    // Apply layout configurations to widgets
    for (const layout of blueprint.composition.layouts) {
      // Implementation would apply layout rules to widgets
      await eventBus.publish({
        type: 'blueprint.layout_applied',
        source: 'blueprint-system',
        data: { instanceId: instance.id, layout },
        metadata: {
          tenantId: instance.tenantId,
          timestamp: new Date(),
        },
      });
    }
  }

  private static validateAgainstSchema(config: any, schema: BlueprintSchema): string[] {
    const errors: string[] = [];
    
    // Basic schema validation
    if (schema.required) {
      for (const requiredField of schema.required) {
        if (!(requiredField in config)) {
          errors.push(`Required field '${requiredField}' is missing`);
        }
      }
    }

    // Property validation
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      if (propName in config) {
        const propErrors = this.validateProperty(config[propName], propSchema, propName);
        errors.push(...propErrors);
      }
    }

    return errors;
  }

  private static validateProperty(value: any, schema: BlueprintProperty, path: string): string[] {
    const errors: string[] = [];

    // Type validation
    if (schema.type === 'string' && typeof value !== 'string') {
      errors.push(`Property '${path}' must be a string`);
    } else if (schema.type === 'number' && typeof value !== 'number') {
      errors.push(`Property '${path}' must be a number`);
    } else if (schema.type === 'boolean' && typeof value !== 'boolean') {
      errors.push(`Property '${path}' must be a boolean`);
    }

    // Range validation
    if (schema.minimum !== undefined && typeof value === 'number' && value < schema.minimum) {
      errors.push(`Property '${path}' must be at least ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && typeof value === 'number' && value > schema.maximum) {
      errors.push(`Property '${path}' must be at most ${schema.maximum}`);
    }

    // Pattern validation
    if (schema.pattern && typeof value === 'string' && !new RegExp(schema.pattern).test(value)) {
      errors.push(`Property '${path}' does not match required pattern`);
    }

    return errors;
  }

  private static validateRule(config: any, rule: ValidationRule): string[] {
    const errors: string[] = [];
    const value = this.getDeepProperty(config, rule.property);

    switch (rule.rule) {
      case 'required':
        if (value === undefined || value === null) {
          errors.push(rule.message);
        }
        break;
      case 'min':
        if (typeof value === 'number' && value < rule.value) {
          errors.push(rule.message);
        }
        break;
      case 'max':
        if (typeof value === 'number' && value > rule.value) {
          errors.push(rule.message);
        }
        break;
      case 'pattern':
        if (typeof value === 'string' && !new RegExp(rule.value).test(value)) {
          errors.push(rule.message);
        }
        break;
    }

    return errors;
  }

  private static getDeepProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private static applyModifications(blueprint: BlueprintDefinition, modifications: any): void {
    // Apply modifications to cloned blueprint
    for (const [path, value] of Object.entries(modifications)) {
      this.setDeepProperty(blueprint, path, value);
    }
  }

  private static async persistBlueprint(blueprint: BlueprintDefinition): Promise<void> {
    try {
      await prisma.blueprintDefinition.upsert({
        where: { 
          id: blueprint.id
        },
        update: {
          name: blueprint.name,
          description: blueprint.description,
          category: blueprint.category,
          author: blueprint.author,
          tags: blueprint.tags,
          type: blueprint.type,
          composition: blueprint.composition as any,
          schema: blueprint.schema as any,
          validation: blueprint.validation as any,
          inheritance: blueprint.inheritance as any,
          configuration: blueprint.configuration as any,
          metadata: blueprint.metadata as any,
          updatedAt: new Date(),
        },
        create: {
          id: blueprint.id,
          version: blueprint.version,
          name: blueprint.name,
          description: blueprint.description,
          category: blueprint.category,
          author: blueprint.author,
          tags: blueprint.tags,
          type: blueprint.type,
          composition: blueprint.composition as any,
          schema: blueprint.schema as any,
          validation: blueprint.validation as any,
          inheritance: blueprint.inheritance as any,
          configuration: blueprint.configuration as any,
          metadata: blueprint.metadata as any,
        },
      });
    } catch (error) {
      console.error('Error persisting blueprint:', error);
    }
  }

  private static async persistBlueprintInstance(instance: BlueprintInstance): Promise<void> {
    try {
      await prisma.blueprintInstance.upsert({
        where: { id: instance.id },
        update: {
          name: instance.name,
          config: instance.config as any,
          state: instance.state as any,
          isBuilt: instance.isBuilt,
          buildErrors: instance.buildErrors,
          updatedAt: instance.updated,
        },
        create: {
          id: instance.id,
          definitionId: instance.blueprintId,
          blueprintId: instance.blueprintId,
          version: instance.version,
          name: instance.name,
          config: instance.config as any,
          canvasId: instance.canvasId,
          state: instance.state as any,
          isBuilt: instance.isBuilt,
          buildErrors: instance.buildErrors,
          createdBy: instance.createdBy,
          tenantId: instance.tenantId,
          createdAt: instance.created,
          updatedAt: instance.updated,
        },
      });
    } catch (error) {
      console.error('Error persisting blueprint instance:', error);
    }
  }

  private static async loadBlueprintFromDatabase(id: string, version?: string): Promise<BlueprintDefinition | null> {
    try {
      const where: any = { id };
      if (version) where.version = version;

      const blueprint = await prisma.blueprintDefinition.findFirst({
        where,
        orderBy: version ? undefined : { updatedAt: 'desc' },
      });

      return blueprint ? this.parseBlueprintFromDatabase(blueprint) : null;
    } catch (error) {
      console.error('Error loading blueprint from database:', error);
      return null;
    }
  }

  private static parseBlueprintFromDatabase(dbBlueprint: any): BlueprintDefinition {
    return {
      id: dbBlueprint.id,
      version: dbBlueprint.version,
      name: dbBlueprint.name,
      description: dbBlueprint.description,
      category: dbBlueprint.category,
      author: dbBlueprint.author,
      tags: dbBlueprint.tags || [],
      type: dbBlueprint.type,
      composition: dbBlueprint.composition,
      schema: dbBlueprint.schema,
      validation: dbBlueprint.validation,
      inheritance: dbBlueprint.inheritance,
      configuration: dbBlueprint.configuration,
      preview: dbBlueprint.preview,
      metadata: dbBlueprint.metadata,
    };
  }
}

// Singleton export
export const blueprintSystem = BlueprintSystem;
