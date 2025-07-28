
export interface WidgetConfig {
  id: string;
  name: string;
  type: string;
  version: string;
  tenantId: string;
  userId?: string;
  permissions: string[];
  settings: Record<string, any>;
  dependencies?: string[];
}

export interface WidgetMessage {
  id: string;
  from: string;
  to: string;
  type: string;
  payload: any;
  timestamp: Date;
  tenantId: string;
  correlationId?: string;
}

export interface WidgetAPI {
  // Core widget methods
  mount(container: HTMLElement, config: WidgetConfig): Promise<void>;
  unmount(): Promise<void>;
  updateConfig(config: Partial<WidgetConfig>): Promise<void>;
  
  // Communication methods
  sendMessage(message: Omit<WidgetMessage, 'id' | 'timestamp' | 'from'>): Promise<void>;
  onMessage(handler: (message: WidgetMessage) => void): void;
  
  // State management
  getState(): any;
  setState(state: any): void;
  subscribeToState(callback: (state: any) => void): () => void;
  
  // Events
  emit(event: string, data: any): void;
  on(event: string, handler: (data: any) => void): () => void;
}

export class WidgetCommunicationManager {
  private static instance: WidgetCommunicationManager;
  private widgets = new Map<string, WidgetAPI>();
  private messageHandlers = new Map<string, Set<(message: WidgetMessage) => void>>();
  private globalState = new Map<string, any>();
  private stateSubscriptions = new Map<string, Set<(state: any) => void>>();

  private constructor() {}

  static getInstance(): WidgetCommunicationManager {
    if (!WidgetCommunicationManager.instance) {
      WidgetCommunicationManager.instance = new WidgetCommunicationManager();
    }
    return WidgetCommunicationManager.instance;
  }

  // Register a widget
  registerWidget(widget: WidgetAPI, config: WidgetConfig): void {
    this.widgets.set(config.id, widget);
    
    // Set up message handling for this widget
    widget.onMessage((message) => {
      this.routeMessage(message);
    });

    // Initialize widget state
    this.globalState.set(config.id, widget.getState());
  }

  // Unregister a widget
  unregisterWidget(widgetId: string): void {
    this.widgets.delete(widgetId);
    this.messageHandlers.delete(widgetId);
    this.globalState.delete(widgetId);
    this.stateSubscriptions.delete(widgetId);
  }

  // Send message between widgets
  async sendMessage(message: WidgetMessage): Promise<void> {
    try {
      // Validate tenant isolation
      const fromWidget = this.widgets.get(message.from);
      const toWidget = this.widgets.get(message.to);

      if (!fromWidget || !toWidget) {
        throw new Error('Widget not found');
      }

      // Route the message
      await this.routeMessage(message);
      
      // Log for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Widget message routed:', message);
      }
    } catch (error) {
      console.error('Error sending widget message:', error);
      throw error;
    }
  }

  // Route message to target widget
  private async routeMessage(message: WidgetMessage): Promise<void> {
    const handlers = this.messageHandlers.get(message.to);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(message);
        } catch (error) {
          console.error('Error in message handler:', error);
        }
      }
    }
  }

  // Subscribe to messages for a widget
  subscribeToMessages(
    widgetId: string,
    handler: (message: WidgetMessage) => void
  ): () => void {
    if (!this.messageHandlers.has(widgetId)) {
      this.messageHandlers.set(widgetId, new Set());
    }
    
    const handlers = this.messageHandlers.get(widgetId)!;
    handlers.add(handler);

    // Return unsubscribe function
    return () => {
      handlers.delete(handler);
    };
  }

  // Shared state management
  getSharedState(key: string): any {
    return this.globalState.get(key);
  }

  setSharedState(key: string, state: any): void {
    this.globalState.set(key, state);
    
    // Notify subscribers
    const subscribers = this.stateSubscriptions.get(key);
    if (subscribers) {
      for (const callback of subscribers) {
        try {
          callback(state);
        } catch (error) {
          console.error('Error in state subscription callback:', error);
        }
      }
    }
  }

  subscribeToSharedState(
    key: string,
    callback: (state: any) => void
  ): () => void {
    if (!this.stateSubscriptions.has(key)) {
      this.stateSubscriptions.set(key, new Set());
    }
    
    const subscribers = this.stateSubscriptions.get(key)!;
    subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      subscribers.delete(callback);
    };
  }

  // Get all registered widgets for a tenant
  getWidgetsByTenant(tenantId: string): WidgetConfig[] {
    // This would typically query the database
    // For now, return empty array - to be implemented with proper widget registry
    return [];
  }

  // Widget permission validation
  validateWidgetPermission(
    widgetId: string,
    permission: string,
    tenantId: string
  ): boolean {
    const widget = this.widgets.get(widgetId);
    if (!widget) return false;

    // Implement permission checking logic
    // This would integrate with the RBAC system
    return true;
  }
}

// Widget base class for easier implementation
export abstract class BaseWidget implements WidgetAPI {
  protected config: WidgetConfig;
  protected container: HTMLElement | null = null;
  protected messageHandlers: ((message: WidgetMessage) => void)[] = [];
  protected eventHandlers = new Map<string, ((data: any) => void)[]>();
  protected state: any = {};
  protected stateSubscriptions: ((state: any) => void)[] = [];

  constructor(config: WidgetConfig) {
    this.config = config;
  }

  async mount(container: HTMLElement, config: WidgetConfig): Promise<void> {
    this.container = container;
    this.config = { ...this.config, ...config };
    
    // Register with communication manager
    WidgetCommunicationManager.getInstance().registerWidget(this, this.config);
    
    // Implement widget-specific mounting logic
    await this.onMount();
  }

  async unmount(): Promise<void> {
    // Unregister from communication manager
    WidgetCommunicationManager.getInstance().unregisterWidget(this.config.id);
    
    // Implement widget-specific cleanup
    await this.onUnmount();
    
    this.container = null;
    this.messageHandlers = [];
    this.eventHandlers.clear();
    this.stateSubscriptions = [];
  }

  async updateConfig(config: Partial<WidgetConfig>): Promise<void> {
    this.config = { ...this.config, ...config };
    await this.onConfigUpdate(config);
  }

  async sendMessage(message: Omit<WidgetMessage, 'id' | 'timestamp' | 'from'>): Promise<void> {
    const fullMessage: WidgetMessage = {
      ...message,
      id: crypto.randomUUID(),
      from: this.config.id,
      timestamp: new Date(),
    };

    await WidgetCommunicationManager.getInstance().sendMessage(fullMessage);
  }

  onMessage(handler: (message: WidgetMessage) => void): void {
    this.messageHandlers.push(handler);
  }

  getState(): any {
    return this.state;
  }

  setState(state: any): void {
    this.state = { ...this.state, ...state };
    
    // Notify subscribers
    this.stateSubscriptions.forEach(callback => {
      try {
        callback(this.state);
      } catch (error) {
        console.error('Error in state subscription:', error);
      }
    });
  }

  subscribeToState(callback: (state: any) => void): () => void {
    this.stateSubscriptions.push(callback);
    
    return () => {
      const index = this.stateSubscriptions.indexOf(callback);
      if (index > -1) {
        this.stateSubscriptions.splice(index, 1);
      }
    };
  }

  emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error('Error in event handler:', error);
        }
      });
    }
  }

  on(event: string, handler: (data: any) => void): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    
    const handlers = this.eventHandlers.get(event)!;
    handlers.push(handler);

    return () => {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    };
  }

  // Abstract methods to be implemented by specific widgets
  protected abstract onMount(): Promise<void>;
  protected abstract onUnmount(): Promise<void>;
  protected abstract onConfigUpdate(config: Partial<WidgetConfig>): Promise<void>;
}

// Export singleton instance
export const widgetCommunicationManager = WidgetCommunicationManager.getInstance();
