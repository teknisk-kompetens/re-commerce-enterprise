
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Marketplace Types
export interface MarketplaceAppConfig {
  id: string;
  name: string;
  description: string;
  category: 'integration' | 'automation' | 'analytics' | 'security' | 'productivity';
  publisher: string;
  version: string;
  logo?: string;
  screenshots: string[];
  pricing: Record<string, any>;
  features: string[];
  requirements: Record<string, any>;
  config: Record<string, any>;
  permissions: string[];
  status: 'pending' | 'approved' | 'rejected' | 'published' | 'deprecated';
  downloads: number;
  rating: number;
  reviews: number;
}

export interface MarketplaceInstallationConfig {
  id: string;
  appId: string;
  tenantId: string;
  userId: string;
  version: string;
  config: Record<string, any>;
  status: 'installing' | 'installed' | 'failed' | 'updating' | 'uninstalling';
  installedAt: Date;
}

export class EnterpriseMarketplaceService {
  // Create Marketplace App
  async createMarketplaceApp(data: {
    name: string;
    description: string;
    category: 'integration' | 'automation' | 'analytics' | 'security' | 'productivity';
    publisher: string;
    version: string;
    logo?: string;
    screenshots?: string[];
    pricing: Record<string, any>;
    features: string[];
    requirements: Record<string, any>;
    config: Record<string, any>;
    permissions: string[];
  }): Promise<MarketplaceAppConfig> {
    try {
      const app = await prisma.marketplaceApp.create({
        data: {
          name: data.name,
          description: data.description,
          category: data.category,
          publisher: data.publisher,
          version: data.version,
          logo: data.logo,
          screenshots: data.screenshots || [],
          pricing: data.pricing,
          features: data.features,
          requirements: data.requirements,
          config: data.config,
          permissions: data.permissions,
          status: 'pending',
          downloads: 0,
          rating: 0.0,
          reviews: 0,
          metadata: {
            createdBy: 'system',
            appType: 'enterprise',
            securityLevel: 'high'
          }
        }
      });

      return {
        id: app.id,
        name: app.name,
        description: app.description,
        category: app.category as any,
        publisher: app.publisher,
        version: app.version,
        logo: app.logo || undefined,
        screenshots: app.screenshots as string[],
        pricing: app.pricing as Record<string, any>,
        features: app.features as string[],
        requirements: app.requirements as Record<string, any>,
        config: app.config as Record<string, any>,
        permissions: app.permissions as string[],
        status: app.status as any,
        downloads: app.downloads,
        rating: app.rating,
        reviews: app.reviews
      };
    } catch (error) {
      console.error('Failed to create marketplace app:', error);
      throw new Error('Failed to create marketplace app');
    }
  }

  // Get Marketplace Apps
  async getMarketplaceApps(filter?: {
    category?: string;
    status?: string;
    publisher?: string;
    search?: string;
  }): Promise<MarketplaceAppConfig[]> {
    try {
      const apps = await prisma.marketplaceApp.findMany({
        where: {
          ...(filter?.category && { category: filter.category }),
          ...(filter?.status && { status: filter.status }),
          ...(filter?.publisher && { publisher: filter.publisher }),
          ...(filter?.search && {
            OR: [
              { name: { contains: filter.search, mode: 'insensitive' } },
              { description: { contains: filter.search, mode: 'insensitive' } }
            ]
          })
        },
        orderBy: [
          { rating: 'desc' },
          { downloads: 'desc' },
          { createdAt: 'desc' }
        ]
      });

      return apps.map(app => ({
        id: app.id,
        name: app.name,
        description: app.description,
        category: app.category as any,
        publisher: app.publisher,
        version: app.version,
        logo: app.logo || undefined,
        screenshots: app.screenshots as string[],
        pricing: app.pricing as Record<string, any>,
        features: app.features as string[],
        requirements: app.requirements as Record<string, any>,
        config: app.config as Record<string, any>,
        permissions: app.permissions as string[],
        status: app.status as any,
        downloads: app.downloads,
        rating: app.rating,
        reviews: app.reviews
      }));
    } catch (error) {
      console.error('Failed to get marketplace apps:', error);
      throw new Error('Failed to get marketplace apps');
    }
  }

  // Install Marketplace App
  async installMarketplaceApp(data: {
    appId: string;
    tenantId: string;
    userId: string;
    config?: Record<string, any>;
  }): Promise<MarketplaceInstallationConfig> {
    try {
      const app = await prisma.marketplaceApp.findUnique({
        where: { id: data.appId }
      });

      if (!app) {
        throw new Error('App not found');
      }

      if (app.status !== 'published') {
        throw new Error('App is not available for installation');
      }

      const installation = await prisma.marketplaceInstallation.create({
        data: {
          appId: data.appId,
          tenantId: data.tenantId,
          userId: data.userId,
          version: app.version,
          config: data.config || {},
          status: 'installing',
          installedAt: new Date(),
          metadata: {
            appName: app.name,
            appCategory: app.category,
            installationMethod: 'marketplace'
          }
        }
      });

      // Simulate installation process
      setTimeout(async () => {
        try {
          const success = Math.random() > 0.05; // 95% success rate
          
          await prisma.marketplaceInstallation.update({
            where: { id: installation.id },
            data: {
              status: success ? 'installed' : 'failed',
              updatedAt: new Date()
            }
          });

          if (success) {
            // Update app download count
            await prisma.marketplaceApp.update({
              where: { id: data.appId },
              data: {
                downloads: {
                  increment: 1
                }
              }
            });
          }
        } catch (error) {
          await prisma.marketplaceInstallation.update({
            where: { id: installation.id },
            data: {
              status: 'failed',
              updatedAt: new Date()
            }
          });
        }
      }, 3000);

      return {
        id: installation.id,
        appId: installation.appId,
        tenantId: installation.tenantId,
        userId: installation.userId,
        version: installation.version,
        config: installation.config as Record<string, any>,
        status: installation.status as any,
        installedAt: installation.installedAt
      };
    } catch (error) {
      console.error('Failed to install marketplace app:', error);
      throw new Error('Failed to install marketplace app');
    }
  }

  // Get Marketplace Installations
  async getMarketplaceInstallations(tenantId?: string): Promise<MarketplaceInstallationConfig[]> {
    try {
      const installations = await prisma.marketplaceInstallation.findMany({
        where: tenantId ? { tenantId } : {},
        include: {
          app: true
        },
        orderBy: { installedAt: 'desc' }
      });

      return installations.map(installation => ({
        id: installation.id,
        appId: installation.appId,
        tenantId: installation.tenantId,
        userId: installation.userId,
        version: installation.version,
        config: installation.config as Record<string, any>,
        status: installation.status as any,
        installedAt: installation.installedAt
      }));
    } catch (error) {
      console.error('Failed to get marketplace installations:', error);
      throw new Error('Failed to get marketplace installations');
    }
  }

  // Get Marketplace Analytics
  async getMarketplaceAnalytics(): Promise<{
    totalApps: number;
    publishedApps: number;
    pendingApps: number;
    totalInstallations: number;
    totalDownloads: number;
    averageRating: number;
    topApps: Array<{
      name: string;
      downloads: number;
      rating: number;
      category: string;
    }>;
    appsByCategory: Record<string, number>;
    installationsByMonth: Array<{
      month: string;
      installations: number;
    }>;
    topPublishers: Array<{
      publisher: string;
      apps: number;
      downloads: number;
    }>;
  }> {
    try {
      const [totalApps, publishedApps, pendingApps] = await Promise.all([
        prisma.marketplaceApp.count(),
        prisma.marketplaceApp.count({ where: { status: 'published' } }),
        prisma.marketplaceApp.count({ where: { status: 'pending' } })
      ]);

      const totalInstallations = await prisma.marketplaceInstallation.count();

      const apps = await prisma.marketplaceApp.findMany({
        orderBy: { downloads: 'desc' }
      });

      const totalDownloads = apps.reduce((sum, app) => sum + app.downloads, 0);
      const averageRating = apps.length > 0 
        ? apps.reduce((sum, app) => sum + app.rating, 0) / apps.length
        : 0;

      const topApps = apps.slice(0, 10).map(app => ({
        name: app.name,
        downloads: app.downloads,
        rating: app.rating,
        category: app.category
      }));

      const appsByCategory = apps.reduce((acc, app) => {
        acc[app.category] = (acc[app.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Mock installation trends (last 12 months)
      const installationsByMonth = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return {
          month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
          installations: Math.floor(Math.random() * 200) + 50
        };
      }).reverse();

      // Top publishers
      const publisherStats = apps.reduce((acc, app) => {
        if (!acc[app.publisher]) {
          acc[app.publisher] = { apps: 0, downloads: 0 };
        }
        acc[app.publisher].apps += 1;
        acc[app.publisher].downloads += app.downloads;
        return acc;
      }, {} as Record<string, { apps: number; downloads: number }>);

      const topPublishers = Object.entries(publisherStats)
        .sort(([, a], [, b]) => b.downloads - a.downloads)
        .slice(0, 5)
        .map(([publisher, stats]) => ({
          publisher,
          apps: stats.apps,
          downloads: stats.downloads
        }));

      return {
        totalApps,
        publishedApps,
        pendingApps,
        totalInstallations,
        totalDownloads,
        averageRating: Math.round(averageRating * 100) / 100,
        topApps,
        appsByCategory,
        installationsByMonth,
        topPublishers
      };
    } catch (error) {
      console.error('Failed to get marketplace analytics:', error);
      throw new Error('Failed to get marketplace analytics');
    }
  }

  // Uninstall Marketplace App
  async uninstallMarketplaceApp(installationId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const installation = await prisma.marketplaceInstallation.findUnique({
        where: { id: installationId }
      });

      if (!installation) {
        return {
          success: false,
          message: 'Installation not found'
        };
      }

      // Update installation status
      await prisma.marketplaceInstallation.update({
        where: { id: installationId },
        data: {
          status: 'uninstalling',
          updatedAt: new Date()
        }
      });

      // Simulate uninstallation process
      setTimeout(async () => {
        try {
          await prisma.marketplaceInstallation.delete({
            where: { id: installationId }
          });
        } catch (error) {
          await prisma.marketplaceInstallation.update({
            where: { id: installationId },
            data: {
              status: 'failed',
              updatedAt: new Date()
            }
          });
        }
      }, 2000);

      return {
        success: true,
        message: 'Uninstallation started successfully'
      };
    } catch (error) {
      console.error('Failed to uninstall marketplace app:', error);
      return {
        success: false,
        message: 'Failed to uninstall app: ' + error?.toString()
      };
    }
  }

  // Update App Rating
  async updateAppRating(appId: string, rating: number): Promise<{
    success: boolean;
    newRating: number;
    totalReviews: number;
  }> {
    try {
      const app = await prisma.marketplaceApp.findUnique({
        where: { id: appId }
      });

      if (!app) {
        return {
          success: false,
          newRating: 0,
          totalReviews: 0
        };
      }

      // Calculate new rating (simple average)
      const currentTotal = app.rating * app.reviews;
      const newTotal = currentTotal + rating;
      const newReviews = app.reviews + 1;
      const newRating = newTotal / newReviews;

      await prisma.marketplaceApp.update({
        where: { id: appId },
        data: {
          rating: newRating,
          reviews: newReviews
        }
      });

      return {
        success: true,
        newRating: Math.round(newRating * 100) / 100,
        totalReviews: newReviews
      };
    } catch (error) {
      console.error('Failed to update app rating:', error);
      return {
        success: false,
        newRating: 0,
        totalReviews: 0
      };
    }
  }
}

export const enterpriseMarketplaceService = new EnterpriseMarketplaceService();
