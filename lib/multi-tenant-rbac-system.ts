
/**
 * MULTI-TENANT RBAC SYSTEM
 * Avancerat rollbaserat åtkomstkontrollsystem med tenant-isolering
 */

import { prisma } from '@/lib/db';
import { SecurityEventLogger } from '@/lib/security-event-logger';
import crypto from 'crypto';

export interface Permission {
  id: string;
  resource: string;
  action: string;
  conditions?: Record<string, any>;
  effect: 'allow' | 'deny';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  inheritance: string[]; // Parent role IDs
  type: 'system' | 'tenant' | 'custom';
  scope: 'global' | 'tenant' | 'user';
  active: boolean;
  tenantId?: string;
}

export interface AccessRequest {
  userId: string;
  tenantId: string;
  resource: string;
  action: string;
  context?: Record<string, any>;
  sessionId?: string;
  ipAddress?: string;
}

export interface AccessResult {
  granted: boolean;
  reason: string;
  appliedPolicies: string[];
  conditions: Record<string, any>;
  restrictions: string[];
  auditRequired: boolean;
}

export interface TenantSecurityPolicy {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  rules: SecurityRule[];
  enforcement: 'strict' | 'moderate' | 'advisory';
  active: boolean;
  priority: number;
}

export interface SecurityRule {
  id: string;
  type: 'access_control' | 'data_isolation' | 'audit_logging' | 'rate_limiting';
  condition: string;
  action: 'allow' | 'deny' | 'audit' | 'restrict';
  parameters: Record<string, any>;
}

export interface TenantIsolationContext {
  tenantId: string;
  userId: string;
  roles: string[];
  permissions: Permission[];
  securityLevel: 'standard' | 'enhanced' | 'maximum';
  restrictions: string[];
  auditLevel: 'minimal' | 'standard' | 'comprehensive';
}

export class MultiTenantRBACSystem {
  private static permissionCache = new Map<string, Permission[]>();
  private static roleCache = new Map<string, Role>();
  private static tenantPolicyCache = new Map<string, TenantSecurityPolicy[]>();

  // System-defined permissions
  private static readonly SYSTEM_PERMISSIONS = {
    // User management
    'users:create': { resource: 'users', action: 'create' },
    'users:read': { resource: 'users', action: 'read' },
    'users:update': { resource: 'users', action: 'update' },
    'users:delete': { resource: 'users', action: 'delete' },
    'users:impersonate': { resource: 'users', action: 'impersonate' },

    // Tenant management
    'tenants:create': { resource: 'tenants', action: 'create' },
    'tenants:read': { resource: 'tenants', action: 'read' },
    'tenants:update': { resource: 'tenants', action: 'update' },
    'tenants:delete': { resource: 'tenants', action: 'delete' },
    'tenants:switch': { resource: 'tenants', action: 'switch' },

    // Security management
    'security:read_logs': { resource: 'security', action: 'read_logs' },
    'security:manage_policies': { resource: 'security', action: 'manage_policies' },
    'security:audit_access': { resource: 'security', action: 'audit_access' },

    // Data access
    'data:read': { resource: 'data', action: 'read' },
    'data:write': { resource: 'data', action: 'write' },
    'data:delete': { resource: 'data', action: 'delete' },
    'data:export': { resource: 'data', action: 'export' },

    // Analytics
    'analytics:read': { resource: 'analytics', action: 'read' },
    'analytics:create': { resource: 'analytics', action: 'create' },
    'analytics:manage': { resource: 'analytics', action: 'manage' },

    // Integration
    'integrations:read': { resource: 'integrations', action: 'read' },
    'integrations:create': { resource: 'integrations', action: 'create' },
    'integrations:manage': { resource: 'integrations', action: 'manage' },
  };

  /**
   * Kontrollera åtkomst
   */
  static async checkAccess(request: AccessRequest): Promise<AccessResult> {
    try {
      const startTime = Date.now();

      // Hämta tenant isolation context
      const isolationContext = await this.getTenantIsolationContext(
        request.userId,
        request.tenantId
      );

      // Kontrollera tenant-isolering först
      const tenantCheck = await this.validateTenantAccess(request, isolationContext);
      if (!tenantCheck.allowed) {
        return this.createDeniedResult(tenantCheck.reason, [], ['tenant_isolation_violation']);
      }

      // Hämta användarens roller och permissions
      const userPermissions = await this.getUserPermissions(request.userId, request.tenantId);
      const effectivePermissions = await this.resolveEffectivePermissions(
        userPermissions,
        isolationContext
      );

      // Kontrollera direkta permissions
      const directPermission = this.findMatchingPermission(
        effectivePermissions,
        request.resource,
        request.action
      );

      if (directPermission && directPermission.effect === 'deny') {
        await this.logAccessEvent(request, false, 'explicit_deny', directPermission.id);
        return this.createDeniedResult('Explicit deny permission', [directPermission.id], []);
      }

      if (directPermission && directPermission.effect === 'allow') {
        // Kontrollera conditions
        const conditionCheck = await this.evaluateConditions(
          directPermission.conditions || {},
          request
        );

        if (!conditionCheck.satisfied) {
          await this.logAccessEvent(request, false, 'condition_failed', directPermission.id);
          return this.createDeniedResult(
            'Permission conditions not satisfied',
            [directPermission.id],
            conditionCheck.restrictions
          );
        }

        // Kontrollera tenant security policies
        const policyCheck = await this.evaluateTenantPolicies(request, isolationContext);
        if (!policyCheck.allowed) {
          await this.logAccessEvent(request, false, 'policy_violation', '');
          return this.createDeniedResult(
            policyCheck.reason,
            policyCheck.appliedPolicies,
            policyCheck.restrictions
          );
        }

        // Tillåt åtkomst
        await this.logAccessEvent(request, true, 'permission_granted', directPermission.id);
        
        return {
          granted: true,
          reason: 'Access granted by permission',
          appliedPolicies: [directPermission.id, ...policyCheck.appliedPolicies],
          conditions: directPermission.conditions || {},
          restrictions: policyCheck.restrictions,
          auditRequired: this.requiresAudit(request, isolationContext)
        };
      }

      // Ingen matching permission - default deny
      await this.logAccessEvent(request, false, 'no_permission', '');
      return this.createDeniedResult('No matching permission found', [], []);

    } catch (error) {
      console.error('Access check error:', error);
      await this.logAccessEvent(request, false, 'system_error', '');
      return this.createDeniedResult('System error during access check', [], ['system_error']);
    }
  }

  /**
   * Skapa eller uppdatera roll
   */
  static async createOrUpdateRole(
    roleData: Partial<Role>,
    tenantId: string,
    createdBy: string
  ): Promise<{ success: boolean; roleId?: string; error?: string }> {
    try {
      // Validera rolldata
      if (!roleData.name || !roleData.permissions) {
        return { success: false, error: 'Invalid role data' };
      }

      // Kontrollera att användaren har rätt att skapa/uppdatera roller
      const canManage = await this.checkAccess({
        userId: createdBy,
        tenantId,
        resource: 'roles',
        action: roleData.id ? 'update' : 'create'
      });

      if (!canManage.granted) {
        return { success: false, error: 'Insufficient permissions to manage roles' };
      }

      const roleId = roleData.id || crypto.randomUUID();
      const role: Role = {
        id: roleId,
        name: roleData.name,
        description: roleData.description || '',
        permissions: roleData.permissions || [],
        inheritance: roleData.inheritance || [],
        type: roleData.type || 'custom',
        scope: roleData.scope || 'tenant',
        active: roleData.active !== false,
        tenantId: roleData.scope === 'global' ? undefined : tenantId
      };

      // Spara i databas
      await prisma.role.upsert({
        where: { id: roleId },
        update: {
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          inheritance: role.inheritance,
          type: role.type,
          scope: role.scope,
          active: role.active,
          updatedAt: new Date(),
          metadata: { updatedBy: createdBy }
        },
        create: {
          id: roleId,
          name: role.name,
          description: role.description,
          permissions: role.permissions,
          inheritance: role.inheritance,
          type: role.type,
          scope: role.scope,
          active: role.active,
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy,
          metadata: { createdBy }
        }
      });

      // Uppdatera cache
      this.roleCache.set(roleId, role);

      // Logga händelse
      await SecurityEventLogger.logSecurityEvent({
        type: 'role_management',
        severity: 'info',
        description: `Role ${roleData.id ? 'updated' : 'created'}: ${role.name}`,
        actor: createdBy,
        target: roleId,
        metadata: {
          roleId,
          roleName: role.name,
          tenantId,
          action: roleData.id ? 'update' : 'create'
        },
        tenantId
      });

      return { success: true, roleId };

    } catch (error) {
      console.error('Role management error:', error);
      return { success: false, error: 'System error' };
    }
  }

  /**
   * Tilldela roll till användare
   */
  static async assignRole(
    userId: string,
    roleId: string,
    tenantId: string,
    assignedBy: string,
    expiresAt?: Date
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Kontrollera behörighet
      const canAssign = await this.checkAccess({
        userId: assignedBy,
        tenantId,
        resource: 'roles',
        action: 'assign'
      });

      if (!canAssign.granted) {
        return { success: false, error: 'Insufficient permissions to assign roles' };
      }

      // Kontrollera att rollen finns och är aktiv
      const role = await prisma.role.findUnique({
        where: { id: roleId, active: true }
      });

      if (!role) {
        return { success: false, error: 'Role not found or inactive' };
      }

      // Kontrollera tenant-isolering
      if (role.scope === 'tenant' && role.metadata && 
          (role.metadata as any).tenantId !== tenantId) {
        return { success: false, error: 'Role not available for this tenant' };
      }

      // Skapa rolltilldelning
      await prisma.userRole.create({
        data: {
          id: crypto.randomUUID(),
          userId,
          roleId,
          tenantId,
          assignedBy,
          assignedAt: new Date(),
          expiresAt,
          active: true
        }
      });

      // Rensa cache för användaren
      this.permissionCache.delete(`${userId}:${tenantId}`);

      // Logga händelse
      await SecurityEventLogger.logSecurityEvent({
        type: 'role_assigned',
        severity: 'info',
        description: `Role assigned: ${role.name}`,
        actor: assignedBy,
        target: userId,
        metadata: {
          roleId,
          roleName: role.name,
          tenantId,
          expiresAt
        },
        tenantId
      });

      return { success: true };

    } catch (error) {
      console.error('Role assignment error:', error);
      return { success: false, error: 'System error' };
    }
  }

  /**
   * Ta bort rolltilldelning
   */
  static async revokeRole(
    userId: string,
    roleId: string,
    tenantId: string,
    revokedBy: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Kontrollera behörighet
      const canRevoke = await this.checkAccess({
        userId: revokedBy,
        tenantId,
        resource: 'roles',
        action: 'revoke'
      });

      if (!canRevoke.granted) {
        return { success: false, error: 'Insufficient permissions to revoke roles' };
      }

      // Ta bort rolltilldelning
      const result = await prisma.userRole.updateMany({
        where: {
          userId,
          roleId,
          tenantId,
          active: true
        },
        data: {
          active: false,
          revokedAt: new Date(),
          revokedBy
        }
      });

      if (result.count === 0) {
        return { success: false, error: 'Role assignment not found' };
      }

      // Rensa cache
      this.permissionCache.delete(`${userId}:${tenantId}`);

      // Logga händelse
      const role = await prisma.role.findUnique({ where: { id: roleId } });
      await SecurityEventLogger.logSecurityEvent({
        type: 'role_revoked',
        severity: 'info',
        description: `Role revoked: ${role?.name || roleId}`,
        actor: revokedBy,
        target: userId,
        metadata: {
          roleId,
          roleName: role?.name,
          tenantId
        },
        tenantId
      });

      return { success: true };

    } catch (error) {
      console.error('Role revocation error:', error);
      return { success: false, error: 'System error' };
    }
  }

  /**
   * Säker tenant-switching
   */
  static async switchTenant(
    userId: string,
    fromTenantId: string,
    toTenantId: string,
    sessionId: string
  ): Promise<{ success: boolean; context?: TenantIsolationContext; error?: string }> {
    try {
      // Kontrollera att användaren har åtkomst till båda tenants
      const [fromAccess, toAccess] = await Promise.all([
        this.validateUserTenantAccess(userId, fromTenantId),
        this.validateUserTenantAccess(userId, toTenantId)
      ]);

      if (!fromAccess || !toAccess) {
        await SecurityEventLogger.logSecurityEvent({
          type: 'tenant_switch_denied',
          severity: 'medium',
          description: 'Unauthorized tenant switch attempt',
          actor: userId,
          metadata: {
            fromTenantId,
            toTenantId,
            sessionId,
            reason: !fromAccess ? 'no_access_from' : 'no_access_to'
          }
        });

        return { success: false, error: 'Access denied to one or both tenants' };
      }

      // Kontrollera tenant security policies
      const toTenant = await prisma.tenant.findUnique({
        where: { id: toTenantId }
      });

      if (!toTenant || !toTenant.isActive) {
        return { success: false, error: 'Target tenant is not active' };
      }

      // Skapa ny tenant isolation context
      const isolationContext = await this.getTenantIsolationContext(userId, toTenantId);

      // Logga framgångsrik switch
      await SecurityEventLogger.logSecurityEvent({
        type: 'tenant_switch_success',
        severity: 'info',
        description: 'Successful tenant switch',
        actor: userId,
        metadata: {
          fromTenantId,
          toTenantId,
          sessionId,
          securityLevel: isolationContext.securityLevel
        },
        tenantId: toTenantId
      });

      return { success: true, context: isolationContext };

    } catch (error) {
      console.error('Tenant switch error:', error);
      return { success: false, error: 'System error' };
    }
  }

  /**
   * Hämta tenant isolation context
   */
  private static async getTenantIsolationContext(
    userId: string,
    tenantId: string
  ): Promise<TenantIsolationContext> {
    try {
      // Hämta användarens roller och permissions
      const userRoles = await prisma.userRole.findMany({
        where: {
          userId,
          tenantId,
          active: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        },
        include: { role: true }
      });

      const roles = userRoles.map(ur => ur.roleId);
      const permissions = await this.getUserPermissions(userId, tenantId);

      // Bestäm säkerhetsnivå baserat på roller och tenant
      const securityLevel = this.determineSecurityLevel(userRoles, tenantId);

      // Hämta tenant-specifika restrictions
      const restrictions = await this.getTenantRestrictions(tenantId, userId);

      // Bestäm audit level
      const auditLevel = this.determineAuditLevel(userRoles, securityLevel);

      return {
        tenantId,
        userId,
        roles,
        permissions,
        securityLevel,
        restrictions,
        auditLevel
      };

    } catch (error) {
      console.error('Failed to get tenant isolation context:', error);
      // Return safe default context
      return {
        tenantId,
        userId,
        roles: [],
        permissions: [],
        securityLevel: 'standard',
        restrictions: ['system_error'],
        auditLevel: 'minimal'
      };
    }
  }

  /**
   * Hämta användarens permissions
   */
  private static async getUserPermissions(
    userId: string,
    tenantId: string
  ): Promise<Permission[]> {
    const cacheKey = `${userId}:${tenantId}`;
    const cached = this.permissionCache.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    try {
      // Hämta användarens aktiva roller
      const userRoles = await prisma.userRole.findMany({
        where: {
          userId,
          tenantId,
          active: true,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        },
        include: { role: true }
      });

      const permissions: Permission[] = [];
      const processedRoles = new Set<string>();

      // Bearbeta roller rekursivt (inheritance)
      const processRole = async (roleId: string) => {
        if (processedRoles.has(roleId)) return;
        processedRoles.add(roleId);

        const role = await prisma.role.findUnique({ where: { id: roleId } });
        if (!role || !role.active) return;

        // Lägg till rollens permissions
        const rolePermissions = role.permissions as Permission[];
        permissions.push(...rolePermissions);

        // Bearbeta inherited roles
        const inheritance = role.inheritance as string[];
        for (const parentRoleId of inheritance) {
          await processRole(parentRoleId);
        }
      };

      // Bearbeta alla användarens roller
      for (const userRole of userRoles) {
        await processRole(userRole.roleId);
      }

      // Cache resultatet
      this.permissionCache.set(cacheKey, permissions);

      return permissions;

    } catch (error) {
      console.error('Failed to get user permissions:', error);
      return [];
    }
  }

  /**
   * Hitta matchande permission
   */
  private static findMatchingPermission(
    permissions: Permission[],
    resource: string,
    action: string
  ): Permission | null {
    // Exact match först
    for (const permission of permissions) {
      if (permission.resource === resource && permission.action === action) {
        return permission;
      }
    }

    // Wildcard matches
    for (const permission of permissions) {
      if (permission.resource === '*' && permission.action === action) {
        return permission;
      }
      if (permission.resource === resource && permission.action === '*') {
        return permission;
      }
      if (permission.resource === '*' && permission.action === '*') {
        return permission;
      }
    }

    return null;
  }

  /**
   * Utvärdera villkor
   */
  private static async evaluateConditions(
    conditions: Record<string, any>,
    request: AccessRequest
  ): Promise<{ satisfied: boolean; restrictions: string[] }> {
    const restrictions: string[] = [];

    try {
      // Time-based conditions
      if (conditions.timeRestrictions) {
        const now = new Date();
        const currentHour = now.getHours();
        
        if (conditions.timeRestrictions.allowedHours) {
          const allowedHours = conditions.timeRestrictions.allowedHours as number[];
          if (!allowedHours.includes(currentHour)) {
            restrictions.push('time_restricted');
          }
        }
      }

      // IP-based conditions
      if (conditions.ipRestrictions && request.ipAddress) {
        const allowedIPs = conditions.ipRestrictions.allowed as string[];
        const deniedIPs = conditions.ipRestrictions.denied as string[];
        
        if (deniedIPs && deniedIPs.includes(request.ipAddress)) {
          restrictions.push('ip_denied');
        }
        
        if (allowedIPs && allowedIPs.length > 0 && !allowedIPs.includes(request.ipAddress)) {
          restrictions.push('ip_not_allowed');
        }
      }

      // Context-based conditions
      if (conditions.contextRequirements && request.context) {
        for (const [key, expectedValue] of Object.entries(conditions.contextRequirements)) {
          if (request.context[key] !== expectedValue) {
            restrictions.push(`context_mismatch_${key}`);
          }
        }
      }

      return {
        satisfied: restrictions.length === 0,
        restrictions
      };

    } catch (error) {
      console.error('Condition evaluation error:', error);
      return { satisfied: false, restrictions: ['condition_evaluation_error'] };
    }
  }

  /**
   * Skapa denied result
   */
  private static createDeniedResult(
    reason: string,
    appliedPolicies: string[],
    restrictions: string[]
  ): AccessResult {
    return {
      granted: false,
      reason,
      appliedPolicies,
      conditions: {},
      restrictions,
      auditRequired: true
    };
  }

  /**
   * Validera tenant access
   */
  private static async validateTenantAccess(
    request: AccessRequest,
    context: TenantIsolationContext
  ): Promise<{ allowed: boolean; reason: string }> {
    // Kontrollera att användaren tillhör tenant
    if (context.tenantId !== request.tenantId) {
      return { allowed: false, reason: 'User does not belong to tenant' };
    }

    // Kontrollera tenant-specific restrictions
    if (context.restrictions.includes('tenant_suspended')) {
      return { allowed: false, reason: 'Tenant is suspended' };
    }

    if (context.restrictions.includes('user_suspended')) {
      return { allowed: false, reason: 'User is suspended in this tenant' };
    }

    return { allowed: true, reason: 'Tenant access validated' };
  }

  /**
   * Validera användare-tenant access
   */
  private static async validateUserTenantAccess(
    userId: string,
    tenantId: string
  ): Promise<boolean> {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
          tenantId,
          isActive: true
        }
      });

      return !!user;
    } catch (error) {
      console.error('User tenant validation error:', error);
      return false;
    }
  }

  /**
   * Bestäm säkerhetsnivå
   */
  private static determineSecurityLevel(
    userRoles: any[],
    tenantId: string
  ): 'standard' | 'enhanced' | 'maximum' {
    // Admin roles require maximum security
    const hasAdminRole = userRoles.some(ur => 
      ur.role.name.toLowerCase().includes('admin') ||
      ur.role.type === 'system'
    );

    if (hasAdminRole) return 'maximum';

    // Check tenant security requirements
    // In production, this would check tenant-specific security policies
    return 'standard';
  }

  /**
   * Hämta tenant restrictions
   */
  private static async getTenantRestrictions(
    tenantId: string,
    userId: string
  ): Promise<string[]> {
    const restrictions: string[] = [];

    try {
      // Check tenant status
      const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId }
      });

      if (!tenant?.isActive) {
        restrictions.push('tenant_suspended');
      }

      // Check user status in tenant
      const user = await prisma.user.findFirst({
        where: { id: userId, tenantId }
      });

      if (!user?.isActive) {
        restrictions.push('user_suspended');
      }

      // Add more tenant-specific restrictions as needed

    } catch (error) {
      console.error('Failed to get tenant restrictions:', error);
      restrictions.push('system_error');
    }

    return restrictions;
  }

  /**
   * Bestäm audit level
   */
  private static determineAuditLevel(
    userRoles: any[],
    securityLevel: string
  ): 'minimal' | 'standard' | 'comprehensive' {
    if (securityLevel === 'maximum') return 'comprehensive';
    
    const hasPrivilegedRole = userRoles.some(ur => 
      ur.role.name.toLowerCase().includes('admin') ||
      ur.role.name.toLowerCase().includes('manager')
    );

    return hasPrivilegedRole ? 'standard' : 'minimal';
  }

  /**
   * Kontrollera om audit krävs
   */
  private static requiresAudit(
    request: AccessRequest,
    context: TenantIsolationContext
  ): boolean {
    // Audit sensitive resources
    const sensitiveResources = ['users', 'tenants', 'security', 'data'];
    if (sensitiveResources.includes(request.resource)) return true;

    // Audit based on security level
    if (context.securityLevel === 'maximum') return true;

    // Audit privileged actions
    const privilegedActions = ['delete', 'export', 'impersonate', 'manage'];
    if (privilegedActions.includes(request.action)) return true;

    return false;
  }

  /**
   * Logga åtkomsthändelse
   */
  private static async logAccessEvent(
    request: AccessRequest,
    granted: boolean,
    reason: string,
    policyId: string
  ): Promise<void> {
    try {
      await SecurityEventLogger.logSecurityEvent({
        type: granted ? 'access_granted' : 'access_denied',
        severity: granted ? 'info' : 'medium',
        description: `Access ${granted ? 'granted' : 'denied'}: ${request.resource}:${request.action}`,
        actor: request.userId,
        target: request.resource,
        outcome: granted ? 'success' : 'failure',
        ipAddress: request.ipAddress,
        metadata: {
          resource: request.resource,
          action: request.action,
          reason,
          policyId,
          sessionId: request.sessionId,
          context: request.context
        },
        tenantId: request.tenantId
      });

    } catch (error) {
      console.error('Failed to log access event:', error);
    }
  }

  /**
   * Utvärdera tenant policies (placeholder)
   */
  private static async evaluateTenantPolicies(
    request: AccessRequest,
    context: TenantIsolationContext
  ): Promise<{
    allowed: boolean;
    reason: string;
    appliedPolicies: string[];
    restrictions: string[];
  }> {
    // Mock implementation - in production, implement complex policy engine
    return {
      allowed: true,
      reason: 'All policies satisfied',
      appliedPolicies: [],
      restrictions: []
    };
  }

  /**
   * Lös effektiva permissions
   */
  private static async resolveEffectivePermissions(
    permissions: Permission[],
    context: TenantIsolationContext
  ): Promise<Permission[]> {
    // Apply tenant-specific filtering and enhancement
    return permissions.filter(p => {
      // Filter based on security level, restrictions, etc.
      return true; // Mock implementation
    });
  }
}
