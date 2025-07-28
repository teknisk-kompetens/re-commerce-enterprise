
// Enterprise Widget Factory Error Handling System

export class BaseError extends Error {
  public readonly timestamp: Date;
  public readonly requestId?: string;

  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly details?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      details: this.details,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
    };
  }
}

// Tenant-related errors
export class TenantError extends BaseError {
  constructor(
    message: string,
    code: string,
    public readonly tenantId?: string,
    statusCode: number = 400,
    details?: Record<string, any>
  ) {
    super(message, code, statusCode, { ...details, tenantId });
  }
}

export class TenantNotFoundError extends TenantError {
  constructor(tenantId: string) {
    super(
      `Tenant not found: ${tenantId}`,
      'TENANT_NOT_FOUND',
      tenantId,
      404
    );
  }
}

export class TenantInactiveError extends TenantError {
  constructor(tenantId: string) {
    super(
      `Tenant is inactive: ${tenantId}`,
      'TENANT_INACTIVE',
      tenantId,
      403
    );
  }
}

export class TenantLimitExceededError extends TenantError {
  constructor(tenantId: string, limitType: string, currentValue: number, maxValue: number) {
    super(
      `Tenant limit exceeded for ${limitType}: ${currentValue}/${maxValue}`,
      'TENANT_LIMIT_EXCEEDED',
      tenantId,
      429,
      { limitType, currentValue, maxValue }
    );
  }
}

// Widget-related errors
export class WidgetError extends BaseError {
  constructor(
    message: string,
    code: string,
    public readonly widgetId?: string,
    public readonly tenantId?: string,
    statusCode: number = 400,
    details?: Record<string, any>
  ) {
    super(message, code, statusCode, { ...details, widgetId, tenantId });
  }
}

export class WidgetNotFoundError extends WidgetError {
  constructor(widgetId: string, tenantId?: string) {
    super(
      `Widget not found: ${widgetId}`,
      'WIDGET_NOT_FOUND',
      widgetId,
      tenantId,
      404
    );
  }
}

export class WidgetPermissionError extends WidgetError {
  constructor(widgetId: string, permission: string, tenantId?: string) {
    super(
      `Widget permission denied: ${permission} for widget ${widgetId}`,
      'WIDGET_PERMISSION_DENIED',
      widgetId,
      tenantId,
      403,
      { permission }
    );
  }
}

export class WidgetCommunicationError extends WidgetError {
  constructor(
    fromWidget: string,
    toWidget: string,
    reason: string,
    tenantId?: string
  ) {
    super(
      `Widget communication failed from ${fromWidget} to ${toWidget}: ${reason}`,
      'WIDGET_COMMUNICATION_FAILED',
      fromWidget,
      tenantId,
      400,
      { fromWidget, toWidget, reason }
    );
  }
}

// Authentication and authorization errors
export class AuthError extends BaseError {
  constructor(
    message: string,
    code: string,
    public readonly userId?: string,
    statusCode: number = 401,
    details?: Record<string, any>
  ) {
    super(message, code, statusCode, { ...details, userId });
  }
}

export class AuthenticationRequiredError extends AuthError {
  constructor() {
    super(
      'Authentication required',
      'AUTHENTICATION_REQUIRED',
      undefined,
      401
    );
  }
}

export class InsufficientPermissionsError extends AuthError {
  constructor(requiredPermissions: string[], userId?: string) {
    super(
      `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`,
      'INSUFFICIENT_PERMISSIONS',
      userId,
      403,
      { requiredPermissions }
    );
  }
}

export class SessionExpiredError extends AuthError {
  constructor(userId?: string) {
    super(
      'Session has expired',
      'SESSION_EXPIRED',
      userId,
      401
    );
  }
}

// API Gateway errors
export class APIGatewayError extends BaseError {
  constructor(
    message: string,
    code: string,
    public readonly requestId?: string,
    statusCode: number = 500,
    details?: Record<string, any>
  ) {
    super(message, code, statusCode, { ...details, requestId });
  }
}

export class RateLimitExceededError extends APIGatewayError {
  constructor(
    identifier: string,
    limit: number,
    window: number,
    retryAfter: number,
    requestId?: string
  ) {
    super(
      `Rate limit exceeded for ${identifier}: ${limit} requests per ${window} seconds`,
      'RATE_LIMIT_EXCEEDED',
      requestId,
      429,
      { identifier, limit, window, retryAfter }
    );
  }
}

export class InvalidRequestError extends APIGatewayError {
  constructor(reason: string, requestId?: string) {
    super(
      `Invalid request: ${reason}`,
      'INVALID_REQUEST',
      requestId,
      400,
      { reason }
    );
  }
}

export class RequestTimeoutError extends APIGatewayError {
  constructor(timeoutMs: number, requestId?: string) {
    super(
      `Request timeout after ${timeoutMs}ms`,
      'REQUEST_TIMEOUT',
      requestId,
      408,
      { timeoutMs }
    );
  }
}

// Database errors
export class DatabaseError extends BaseError {
  constructor(
    message: string,
    code: string,
    public readonly operation?: string,
    statusCode: number = 500,
    details?: Record<string, any>
  ) {
    super(message, code, statusCode, { ...details, operation });
  }
}

export class DatabaseConnectionError extends DatabaseError {
  constructor() {
    super(
      'Database connection failed',
      'DATABASE_CONNECTION_FAILED',
      'connection',
      503
    );
  }
}

export class DatabaseTimeoutError extends DatabaseError {
  constructor(operation: string, timeoutMs: number) {
    super(
      `Database operation timeout: ${operation} after ${timeoutMs}ms`,
      'DATABASE_TIMEOUT',
      operation,
      504,
      { timeoutMs }
    );
  }
}

// Validation errors
export class ValidationError extends BaseError {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: any,
    details?: Record<string, any>
  ) {
    super(message, 'VALIDATION_ERROR', 400, { ...details, field, value });
  }
}

export class RequiredFieldError extends ValidationError {
  constructor(field: string) {
    super(
      `Required field missing: ${field}`,
      field,
      undefined
    );
  }
}

export class InvalidFieldError extends ValidationError {
  constructor(field: string, value: any, reason?: string) {
    super(
      `Invalid field value for ${field}: ${value}${reason ? ` (${reason})` : ''}`,
      field,
      value,
      { reason }
    );
  }
}

// Error handler utility
export function handleError(error: unknown): BaseError {
  if (error instanceof BaseError) {
    return error;
  }

  if (error instanceof Error) {
    return new BaseError(
      error.message,
      'INTERNAL_ERROR',
      500,
      { originalError: error.name, stack: error.stack }
    );
  }

  return new BaseError(
    'An unknown error occurred',
    'UNKNOWN_ERROR',
    500,
    { originalError: error }
  );
}

// Error response utility for API routes
export function createErrorResponse(error: BaseError | Error) {
  const handledError = handleError(error);
  
  return Response.json(
    {
      error: {
        message: handledError.message,
        code: handledError.code,
        timestamp: handledError.timestamp,
        ...(handledError.details && { details: handledError.details }),
        ...(process.env.NODE_ENV === 'development' && { stack: handledError.stack }),
      },
    },
    { 
      status: handledError.statusCode,
      headers: {
        'Content-Type': 'application/json',
        'X-Error-Code': handledError.code,
        'X-Error-Timestamp': handledError.timestamp.toISOString(),
      }
    }
  );
}

// Error logging utility
export function logError(error: BaseError | Error, context?: Record<string, any>) {
  const handledError = handleError(error);
  const logLevel = handledError.statusCode >= 500 ? 'error' : 'warn';
  
  const logData = {
    level: logLevel,
    message: handledError.message,
    code: handledError.code,
    statusCode: handledError.statusCode,
    timestamp: handledError.timestamp,
    context,
    details: handledError.details,
    stack: handledError.stack,
  };

  // In production, this would integrate with a proper logging service
  if (process.env.NODE_ENV === 'production') {
    // Replace with your logging service (e.g., Winston, Pino, etc.)
    console.error(JSON.stringify(logData));
  } else {
    console.error(logData);
  }
}
