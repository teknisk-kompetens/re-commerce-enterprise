
import { prisma } from './db'
import { TenantQuery } from './tenant-utils'
import crypto from 'crypto'

export interface WebhookData {
  name: string
  url: string
  events: string[]
  secret?: string
  createdBy: string
}

export interface WebhookDeliveryData {
  webhookId: string
  event: string
  payload: any
}

export class WebhookService {
  static async createWebhook(tenantId: string, data: WebhookData): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      const webhook = await tenantQuery.webhook.create({
        data: {
          name: data.name,
          url: data.url,
          events: data.events,
          secret: data.secret || this.generateSecret(),
          createdBy: data.createdBy
        },
        include: {
          creator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      })

      return webhook
    } catch (error) {
      console.error('Failed to create webhook:', error)
      throw error
    }
  }

  static async getWebhooks(tenantId: string, options: {
    page?: number
    limit?: number
    isActive?: boolean
  } = {}): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      const { page = 1, limit = 20, isActive } = options

      const where: any = {}
      if (isActive !== undefined) where.isActive = isActive

      const [webhooks, total] = await Promise.all([
        tenantQuery.webhook.findMany({
          where,
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            deliveries: {
              select: {
                id: true,
                event: true,
                success: true,
                deliveredAt: true
              },
              orderBy: { deliveredAt: 'desc' },
              take: 5
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        tenantQuery.webhook.count({ where })
      ])

      return {
        webhooks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      console.error('Failed to get webhooks:', error)
      throw error
    }
  }

  static async deliverWebhook(tenantId: string, data: WebhookDeliveryData): Promise<void> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      // Get webhook configuration
      const webhook = await tenantQuery.webhook.findUnique({
        where: { id: data.webhookId, isActive: true }
      })

      if (!webhook) {
        throw new Error('Webhook not found or inactive')
      }

      // Check if webhook listens to this event
      if (!webhook.events.includes(data.event)) {
        return
      }

      // Prepare payload
      const payload = {
        event: data.event,
        timestamp: new Date().toISOString(),
        tenantId: tenantId,
        data: data.payload
      }

      // Create signature if secret exists
      let signature = ''
      if (webhook.secret) {
        signature = crypto
          .createHmac('sha256', webhook.secret)
          .update(JSON.stringify(payload))
          .digest('hex')
      }

      // Prepare headers
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'User-Agent': 'Enterprise-Platform-Webhook/1.0'
      }

      if (signature) {
        headers['X-Webhook-Signature'] = `sha256=${signature}`
      }

      // Deliver webhook
      let success = false
      let response: any = null
      let statusCode: number | null = null

      try {
        // Create AbortController for timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const fetchResponse = await fetch(webhook.url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal
        })

        clearTimeout(timeoutId)
        statusCode = fetchResponse.status
        response = {
          status: fetchResponse.status,
          statusText: fetchResponse.statusText,
          headers: Object.fromEntries(fetchResponse.headers.entries())
        }

        success = fetchResponse.ok
      } catch (error) {
        response = {
          error: error instanceof Error ? error.message : 'Unknown error'
        }
        success = false
      }

      // Record delivery
      await tenantQuery.webhookDelivery.create({
        data: {
          webhookId: data.webhookId,
          event: data.event,
          payload: payload,
          response: response,
          statusCode: statusCode,
          success: success
        }
      })

      // If delivery failed, implement retry logic here
      if (!success) {
        console.warn(`Webhook delivery failed for ${webhook.name}:`, response)
        // TODO: Implement retry with exponential backoff
      }
    } catch (error) {
      console.error('Failed to deliver webhook:', error)
      throw error
    }
  }

  static async getWebhookDeliveries(tenantId: string, webhookId?: string, options: {
    page?: number
    limit?: number
    success?: boolean
  } = {}): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      const { page = 1, limit = 20, success } = options

      const where: any = {}
      if (webhookId) where.webhookId = webhookId
      if (success !== undefined) where.success = success

      const [deliveries, total] = await Promise.all([
        tenantQuery.webhookDelivery.findMany({
          where,
          include: {
            webhook: {
              select: {
                id: true,
                name: true,
                url: true
              }
            }
          },
          orderBy: { deliveredAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        tenantQuery.webhookDelivery.count({ where })
      ])

      return {
        deliveries,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    } catch (error) {
      console.error('Failed to get webhook deliveries:', error)
      throw error
    }
  }

  static async updateWebhook(tenantId: string, webhookId: string, data: Partial<WebhookData>): Promise<any> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      const webhook = await tenantQuery.webhook.update({
        where: { id: webhookId },
        data: {
          name: data.name,
          url: data.url,
          events: data.events,
          secret: data.secret
        }
      })

      return webhook
    } catch (error) {
      console.error('Failed to update webhook:', error)
      throw error
    }
  }

  static async deleteWebhook(tenantId: string, webhookId: string): Promise<void> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      await tenantQuery.webhook.update({
        where: { id: webhookId },
        data: { isActive: false }
      })
    } catch (error) {
      console.error('Failed to delete webhook:', error)
      throw error
    }
  }

  private static generateSecret(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  // Event helpers
  static async triggerEvent(tenantId: string, event: string, data: any): Promise<void> {
    try {
      const tenantQuery = TenantQuery.forTenant(tenantId)
      
      // Get all webhooks listening to this event
      const webhooks = await tenantQuery.webhook.findMany({
        where: {
          isActive: true,
          events: {
            has: event
          }
        }
      })

      // Deliver to all webhooks
      const deliveryPromises = webhooks.map((webhook: any) =>
        this.deliverWebhook(tenantId, {
          webhookId: webhook.id,
          event,
          payload: data
        })
      )

      await Promise.all(deliveryPromises)
    } catch (error) {
      console.error('Failed to trigger event:', error)
      throw error
    }
  }
}
