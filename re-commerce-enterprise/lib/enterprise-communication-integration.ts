
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Communication Integration Types
export interface CommunicationConnection {
  id: string;
  name: string;
  type: 'slack' | 'teams' | 'email' | 'zoom' | 'webex';
  version: string;
  endpoint: string;
  credentials: Record<string, any>;
  config: Record<string, any>;
  status: string;
  lastSync?: Date;
  enabled: boolean;
}

export interface CommunicationChannel {
  id: string;
  integrationId: string;
  channelId: string;
  name: string;
  type: 'public' | 'private' | 'direct' | 'group';
  description?: string;
  members: any[];
  config: Record<string, any>;
  active: boolean;
}

export interface CommunicationMessage {
  id: string;
  integrationId: string;
  messageId: string;
  channelId: string;
  senderId: string;
  content: string;
  type: 'text' | 'file' | 'image' | 'audio' | 'video';
  timestamp: Date;
}

export class CommunicationIntegrationService {
  // Create Communication Integration
  async createCommunicationIntegration(data: {
    name: string;
    type: 'slack' | 'teams' | 'email' | 'zoom' | 'webex';
    version: string;
    endpoint: string;
    credentials: Record<string, any>;
    config: Record<string, any>;
  }): Promise<CommunicationConnection> {
    try {
      const integration = await prisma.communicationIntegration.create({
        data: {
          name: data.name,
          type: data.type,
          version: data.version,
          endpoint: data.endpoint,
          credentials: data.credentials,
          config: data.config,
          status: 'active',
          enabled: true,
          metadata: {
            createdBy: 'system',
            connectionType: 'communication',
            securityLevel: 'high'
          }
        }
      });

      return {
        id: integration.id,
        name: integration.name,
        type: integration.type as any,
        version: integration.version,
        endpoint: integration.endpoint,
        credentials: integration.credentials as Record<string, any>,
        config: integration.config as Record<string, any>,
        status: integration.status,
        lastSync: integration.lastSync || undefined,
        enabled: integration.enabled
      };
    } catch (error) {
      console.error('Failed to create communication integration:', error);
      throw new Error('Failed to create communication integration');
    }
  }

  // Get Communication Integrations
  async getCommunicationIntegrations(filter?: {
    type?: string;
    status?: string;
    enabled?: boolean;
  }): Promise<CommunicationConnection[]> {
    try {
      const integrations = await prisma.communicationIntegration.findMany({
        where: {
          ...(filter?.type && { type: filter.type }),
          ...(filter?.status && { status: filter.status }),
          ...(filter?.enabled !== undefined && { enabled: filter.enabled })
        },
        orderBy: { createdAt: 'desc' }
      });

      return integrations.map(integration => ({
        id: integration.id,
        name: integration.name,
        type: integration.type as any,
        version: integration.version,
        endpoint: integration.endpoint,
        credentials: integration.credentials as Record<string, any>,
        config: integration.config as Record<string, any>,
        status: integration.status,
        lastSync: integration.lastSync || undefined,
        enabled: integration.enabled
      }));
    } catch (error) {
      console.error('Failed to get communication integrations:', error);
      throw new Error('Failed to get communication integrations');
    }
  }

  // Get Communication Channels
  async getCommunicationChannels(integrationId?: string): Promise<CommunicationChannel[]> {
    try {
      const channels = await prisma.communicationChannel.findMany({
        where: integrationId ? { integrationId } : {},
        orderBy: { createdAt: 'desc' }
      });

      return channels.map(channel => ({
        id: channel.id,
        integrationId: channel.integrationId,
        channelId: channel.channelId,
        name: channel.name,
        type: channel.type as any,
        description: channel.description || undefined,
        members: channel.members as any[],
        config: channel.config as Record<string, any>,
        active: channel.active
      }));
    } catch (error) {
      console.error('Failed to get communication channels:', error);
      throw new Error('Failed to get communication channels');
    }
  }

  // Send Message
  async sendMessage(data: {
    integrationId: string;
    channelId: string;
    content: string;
    type?: 'text' | 'file' | 'image' | 'audio' | 'video';
    senderId: string;
  }): Promise<CommunicationMessage> {
    try {
      const integration = await prisma.communicationIntegration.findUnique({
        where: { id: data.integrationId }
      });

      if (!integration) {
        throw new Error('Integration not found');
      }

      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const message = await prisma.communicationMessage.create({
        data: {
          integrationId: data.integrationId,
          messageId,
          channelId: data.channelId,
          senderId: data.senderId,
          content: data.content,
          type: data.type || 'text',
          timestamp: new Date(),
          metadata: {
            platform: integration.type,
            messageType: data.type || 'text'
          }
        }
      });

      return {
        id: message.id,
        integrationId: message.integrationId,
        messageId: message.messageId,
        channelId: message.channelId,
        senderId: message.senderId,
        content: message.content,
        type: message.type as any,
        timestamp: message.timestamp
      };
    } catch (error) {
      console.error('Failed to send message:', error);
      throw new Error('Failed to send message');
    }
  }

  // Get Messages
  async getMessages(integrationId?: string, channelId?: string): Promise<CommunicationMessage[]> {
    try {
      const messages = await prisma.communicationMessage.findMany({
        where: {
          ...(integrationId && { integrationId }),
          ...(channelId && { channelId })
        },
        orderBy: { timestamp: 'desc' },
        take: 100
      });

      return messages.map(message => ({
        id: message.id,
        integrationId: message.integrationId,
        messageId: message.messageId,
        channelId: message.channelId,
        senderId: message.senderId,
        content: message.content,
        type: message.type as any,
        timestamp: message.timestamp
      }));
    } catch (error) {
      console.error('Failed to get messages:', error);
      throw new Error('Failed to get messages');
    }
  }

  // Get Communication Analytics
  async getCommunicationAnalytics(integrationId?: string): Promise<{
    totalIntegrations: number;
    activeIntegrations: number;
    totalChannels: number;
    activeChannels: number;
    totalMessages: number;
    messagesByType: Record<string, number>;
    messagesByPlatform: Record<string, number>;
    messagesByHour: Array<{ hour: number; count: number }>;
    topChannels: Array<{ name: string; messageCount: number }>;
    averageResponseTime: number;
    engagementScore: number;
  }> {
    try {
      const [totalIntegrations, activeIntegrations] = await Promise.all([
        prisma.communicationIntegration.count(integrationId ? { where: { id: integrationId } } : {}),
        prisma.communicationIntegration.count({
          where: {
            ...(integrationId && { id: integrationId }),
            status: 'active',
            enabled: true
          }
        })
      ]);

      const [totalChannels, activeChannels] = await Promise.all([
        prisma.communicationChannel.count(integrationId ? { where: { integrationId } } : {}),
        prisma.communicationChannel.count({
          where: {
            ...(integrationId && { integrationId }),
            active: true
          }
        })
      ]);

      const totalMessages = await prisma.communicationMessage.count(
        integrationId ? { where: { integrationId } } : {}
      );

      const messages = await prisma.communicationMessage.findMany({
        where: integrationId ? { integrationId } : {},
        include: { integration: true },
        orderBy: { timestamp: 'desc' },
        take: 1000
      });

      const messagesByType = messages.reduce((acc, message) => {
        acc[message.type] = (acc[message.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const messagesByPlatform = messages.reduce((acc, message) => {
        acc[message.integration.type] = (acc[message.integration.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const messagesByHour = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: messages.filter(message => message.timestamp.getHours() === hour).length
      }));

      const channelCounts = messages.reduce((acc, message) => {
        acc[message.channelId] = (acc[message.channelId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const channels = await prisma.communicationChannel.findMany({
        where: integrationId ? { integrationId } : {}
      });

      const topChannels = Object.entries(channelCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([channelId, count]) => {
          const channel = channels.find(c => c.channelId === channelId);
          return {
            name: channel?.name || channelId,
            messageCount: count
          };
        });

      // Mock metrics
      const averageResponseTime = Math.floor(Math.random() * 300) + 60; // 1-5 minutes
      const engagementScore = Math.random() * 30 + 70; // 70-100

      return {
        totalIntegrations,
        activeIntegrations,
        totalChannels,
        activeChannels,
        totalMessages,
        messagesByType,
        messagesByPlatform,
        messagesByHour,
        topChannels,
        averageResponseTime,
        engagementScore
      };
    } catch (error) {
      console.error('Failed to get communication analytics:', error);
      throw new Error('Failed to get communication analytics');
    }
  }

  // Create Channel
  async createChannel(data: {
    integrationId: string;
    name: string;
    type: 'public' | 'private' | 'direct' | 'group';
    description?: string;
    members?: any[];
    config?: Record<string, any>;
  }): Promise<CommunicationChannel> {
    try {
      const channelId = `ch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const channel = await prisma.communicationChannel.create({
        data: {
          integrationId: data.integrationId,
          channelId,
          name: data.name,
          type: data.type,
          description: data.description,
          members: data.members || [],
          config: data.config || {},
          active: true,
          metadata: {
            createdBy: 'system',
            channelType: data.type
          }
        }
      });

      return {
        id: channel.id,
        integrationId: channel.integrationId,
        channelId: channel.channelId,
        name: channel.name,
        type: channel.type as any,
        description: channel.description || undefined,
        members: channel.members as any[],
        config: channel.config as Record<string, any>,
        active: channel.active
      };
    } catch (error) {
      console.error('Failed to create channel:', error);
      throw new Error('Failed to create channel');
    }
  }

  // Test Communication Integration
  async testCommunicationIntegration(integrationId: string): Promise<{
    success: boolean;
    message: string;
    responseTime: number;
    details?: any;
  }> {
    try {
      const integration = await prisma.communicationIntegration.findUnique({
        where: { id: integrationId }
      });

      if (!integration) {
        return {
          success: false,
          message: 'Integration not found',
          responseTime: 0
        };
      }

      const startTime = Date.now();
      
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      const responseTime = Date.now() - startTime;
      const success = Math.random() > 0.05; // 95% success rate

      return {
        success,
        message: success ? 'Connection successful' : 'Connection failed: Authentication error',
        responseTime,
        details: {
          endpoint: integration.endpoint,
          type: integration.type,
          version: integration.version,
          lastSync: integration.lastSync
        }
      };
    } catch (error) {
      console.error('Failed to test communication integration:', error);
      return {
        success: false,
        message: 'Connection test failed: ' + error?.toString(),
        responseTime: 0
      };
    }
  }
}

export const communicationIntegrationService = new CommunicationIntegrationService();
