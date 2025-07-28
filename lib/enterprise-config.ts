
import { prisma } from './db'

export interface SystemConfigValue {
  key: string
  value: string
  type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON'
  description?: string
  isSecret: boolean
}

export class EnterpriseConfig {
  private static cache = new Map<string, any>()
  private static cacheTimeout = 5 * 60 * 1000 // 5 minutes
  private static cacheTimestamps = new Map<string, number>()

  /**
   * Get system configuration value
   */
  static async get(key: string, defaultValue?: any): Promise<any> {
    // Check cache first
    const cached = this.getFromCache(key)
    if (cached !== undefined) {
      return cached
    }

    // Skip database operations during build process
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      return defaultValue
    }

    try {
      const config = await prisma.systemConfig.findUnique({
        where: { key }
      })

      if (!config) {
        this.setCache(key, defaultValue)
        return defaultValue
      }

      const value = this.parseValue(config.value, config.type)
      this.setCache(key, value)
      return value
    } catch (error) {
      console.error(`Failed to get config ${key}:`, error)
      // Return default value if database connection fails
      this.setCache(key, defaultValue)
      return defaultValue
    }
  }

  /**
   * Set system configuration value
   */
  static async set(key: string, value: any, type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON' = 'STRING', description?: string, isSecret = false): Promise<void> {
    // Skip database operations during build process
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      this.setCache(key, value)
      return
    }

    const stringValue = this.stringifyValue(value, type)

    try {
      await prisma.systemConfig.upsert({
        where: { key },
        create: {
          key,
          value: stringValue,
          type,
          description,
          isSecret
        },
        update: {
          value: stringValue,
          type,
          description,
          isSecret
        }
      })
    } catch (error) {
      console.error(`Failed to set config ${key}:`, error)
    }

    // Update cache
    this.setCache(key, value)
  }

  /**
   * Delete system configuration
   */
  static async delete(key: string): Promise<void> {
    // Skip database operations during build process
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      this.cache.delete(key)
      this.cacheTimestamps.delete(key)
      return
    }

    try {
      await prisma.systemConfig.delete({
        where: { key }
      })
    } catch (error) {
      console.error(`Failed to delete config ${key}:`, error)
    }

    // Remove from cache
    this.cache.delete(key)
    this.cacheTimestamps.delete(key)
  }

  /**
   * Get all system configurations
   */
  static async getAll(includeSecrets = false): Promise<SystemConfigValue[]> {
    // Skip database operations during build process
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'phase-production-build') {
      return []
    }

    try {
      const configs = await prisma.systemConfig.findMany({
        where: includeSecrets ? {} : { isSecret: false },
        orderBy: { key: 'asc' }
      })

      return configs.map((config: any) => ({
        key: config.key,
        value: config.value,
        type: config.type as any,
        description: config.description || undefined,
        isSecret: config.isSecret
      }))
    } catch (error) {
      console.error('Failed to get all configs:', error)
      return []
    }
  }

  /**
   * Initialize default system configurations
   */
  static async initializeDefaults(): Promise<void> {
    const defaults = [
      { key: 'app.name', value: 'Enterprise Platform', type: 'STRING', description: 'Application name' },
      { key: 'app.version', value: '1.0.0', type: 'STRING', description: 'Application version' },
      { key: 'security.session_timeout', value: '3600', type: 'NUMBER', description: 'Session timeout in seconds' },
      { key: 'security.max_login_attempts', value: '5', type: 'NUMBER', description: 'Maximum login attempts before lockout' },
      { key: 'security.lockout_duration', value: '900', type: 'NUMBER', description: 'Account lockout duration in seconds' },
      { key: 'security.password_min_length', value: '8', type: 'NUMBER', description: 'Minimum password length' },
      { key: 'security.require_mfa', value: 'false', type: 'BOOLEAN', description: 'Require MFA for all users' },
      { key: 'rate_limit.api_requests_per_minute', value: '100', type: 'NUMBER', description: 'API requests per minute per IP' },
      { key: 'rate_limit.login_attempts_per_minute', value: '5', type: 'NUMBER', description: 'Login attempts per minute per IP' },
      { key: 'audit.retention_days', value: '90', type: 'NUMBER', description: 'Audit log retention period in days' },
      { key: 'audit.log_level', value: 'INFO', type: 'STRING', description: 'Audit log level (DEBUG, INFO, WARN, ERROR)' },
      { key: 'features.user_registration', value: 'true', type: 'BOOLEAN', description: 'Allow user self-registration' },
      { key: 'features.email_verification', value: 'true', type: 'BOOLEAN', description: 'Require email verification' },
      { key: 'features.password_reset', value: 'true', type: 'BOOLEAN', description: 'Allow password reset' },
      { key: 'smtp.enabled', value: 'false', type: 'BOOLEAN', description: 'Enable SMTP email sending' },
      { key: 'smtp.host', value: '', type: 'STRING', description: 'SMTP server hostname' },
      { key: 'smtp.port', value: '587', type: 'NUMBER', description: 'SMTP server port' },
      { key: 'smtp.user', value: '', type: 'STRING', description: 'SMTP username' },
      { key: 'smtp.password', value: '', type: 'STRING', description: 'SMTP password', isSecret: true },
      { key: 'backup.enabled', value: 'false', type: 'BOOLEAN', description: 'Enable automatic backups' },
      { key: 'backup.retention_days', value: '30', type: 'NUMBER', description: 'Backup retention period in days' },
      { key: 'monitoring.enabled', value: 'true', type: 'BOOLEAN', description: 'Enable system monitoring' },
      { key: 'monitoring.alert_email', value: '', type: 'STRING', description: 'Email for system alerts' }
    ]

    for (const config of defaults) {
      await this.set(config.key, config.value, config.type as any, config.description, config.isSecret)
    }
  }

  /**
   * Get from cache
   */
  private static getFromCache(key: string): any {
    const timestamp = this.cacheTimestamps.get(key)
    if (!timestamp || Date.now() - timestamp > this.cacheTimeout) {
      this.cache.delete(key)
      this.cacheTimestamps.delete(key)
      return undefined
    }

    return this.cache.get(key)
  }

  /**
   * Set cache
   */
  private static setCache(key: string, value: any): void {
    this.cache.set(key, value)
    this.cacheTimestamps.set(key, Date.now())
  }

  /**
   * Parse value based on type
   */
  private static parseValue(value: string, type: string): any {
    switch (type) {
      case 'NUMBER':
        return parseFloat(value)
      case 'BOOLEAN':
        return value.toLowerCase() === 'true'
      case 'JSON':
        try {
          return JSON.parse(value)
        } catch {
          return value
        }
      default:
        return value
    }
  }

  /**
   * Stringify value based on type
   */
  private static stringifyValue(value: any, type: string): string {
    switch (type) {
      case 'JSON':
        return JSON.stringify(value)
      case 'BOOLEAN':
        return value ? 'true' : 'false'
      case 'NUMBER':
        return value.toString()
      default:
        return String(value)
    }
  }
}
