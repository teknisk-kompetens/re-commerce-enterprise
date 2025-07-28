
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// BI Integration Types
export interface BIConnection {
  id: string;
  name: string;
  type: 'tableau' | 'powerbi' | 'looker' | 'qlik' | 'sisense';
  version: string;
  endpoint: string;
  credentials: Record<string, any>;
  config: Record<string, any>;
  status: string;
  lastSync?: Date;
  enabled: boolean;
}

export interface BIDashboardConfig {
  id: string;
  integrationId: string;
  dashboardId: string;
  name: string;
  description?: string;
  url?: string;
  config: Record<string, any>;
  widgets: any[];
  permissions: Record<string, any>;
  active: boolean;
}

export interface BIReportConfig {
  id: string;
  integrationId: string;
  reportId: string;
  name: string;
  description?: string;
  type: 'scheduled' | 'ad_hoc' | 'real_time';
  config: Record<string, any>;
  schedule?: string;
  recipients: any[];
  lastRun?: Date;
  nextRun?: Date;
  active: boolean;
}

export class BIIntegrationService {
  // Create BI Integration
  async createBIIntegration(data: {
    name: string;
    type: 'tableau' | 'powerbi' | 'looker' | 'qlik' | 'sisense';
    version: string;
    endpoint: string;
    credentials: Record<string, any>;
    config: Record<string, any>;
  }): Promise<BIConnection> {
    try {
      const integration = await prisma.bIIntegration.create({
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
            connectionType: 'bi',
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
      console.error('Failed to create BI integration:', error);
      throw new Error('Failed to create BI integration');
    }
  }

  // Get BI Integrations
  async getBIIntegrations(filter?: {
    type?: string;
    status?: string;
    enabled?: boolean;
  }): Promise<BIConnection[]> {
    try {
      const integrations = await prisma.bIIntegration.findMany({
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
      console.error('Failed to get BI integrations:', error);
      throw new Error('Failed to get BI integrations');
    }
  }

  // Create BI Dashboard
  async createBIDashboard(data: {
    integrationId: string;
    name: string;
    description?: string;
    url?: string;
    config: Record<string, any>;
    widgets?: any[];
    permissions?: Record<string, any>;
  }): Promise<BIDashboardConfig> {
    try {
      const dashboardId = `dash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const dashboard = await prisma.bIDashboard.create({
        data: {
          integrationId: data.integrationId,
          dashboardId,
          name: data.name,
          description: data.description,
          url: data.url,
          config: data.config,
          widgets: data.widgets || [],
          permissions: data.permissions || {},
          active: true,
          metadata: {
            createdBy: 'system',
            dashboardType: 'enterprise'
          }
        }
      });

      return {
        id: dashboard.id,
        integrationId: dashboard.integrationId,
        dashboardId: dashboard.dashboardId,
        name: dashboard.name,
        description: dashboard.description || undefined,
        url: dashboard.url || undefined,
        config: dashboard.config as Record<string, any>,
        widgets: dashboard.widgets as any[],
        permissions: dashboard.permissions as Record<string, any>,
        active: dashboard.active
      };
    } catch (error) {
      console.error('Failed to create BI dashboard:', error);
      throw new Error('Failed to create BI dashboard');
    }
  }

  // Get BI Dashboards
  async getBIDashboards(integrationId?: string): Promise<BIDashboardConfig[]> {
    try {
      const dashboards = await prisma.bIDashboard.findMany({
        where: integrationId ? { integrationId } : {},
        orderBy: { createdAt: 'desc' }
      });

      return dashboards.map(dashboard => ({
        id: dashboard.id,
        integrationId: dashboard.integrationId,
        dashboardId: dashboard.dashboardId,
        name: dashboard.name,
        description: dashboard.description || undefined,
        url: dashboard.url || undefined,
        config: dashboard.config as Record<string, any>,
        widgets: dashboard.widgets as any[],
        permissions: dashboard.permissions as Record<string, any>,
        active: dashboard.active
      }));
    } catch (error) {
      console.error('Failed to get BI dashboards:', error);
      throw new Error('Failed to get BI dashboards');
    }
  }

  // Create BI Report
  async createBIReport(data: {
    integrationId: string;
    name: string;
    description?: string;
    type: 'scheduled' | 'ad_hoc' | 'real_time';
    config: Record<string, any>;
    schedule?: string;
    recipients?: any[];
  }): Promise<BIReportConfig> {
    try {
      const reportId = `rep_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const report = await prisma.bIReport.create({
        data: {
          integrationId: data.integrationId,
          reportId,
          name: data.name,
          description: data.description,
          type: data.type,
          config: data.config,
          schedule: data.schedule,
          recipients: data.recipients || [],
          active: true,
          metadata: {
            createdBy: 'system',
            reportType: data.type
          }
        }
      });

      return {
        id: report.id,
        integrationId: report.integrationId,
        reportId: report.reportId,
        name: report.name,
        description: report.description || undefined,
        type: report.type as any,
        config: report.config as Record<string, any>,
        schedule: report.schedule || undefined,
        recipients: report.recipients as any[],
        lastRun: report.lastRun || undefined,
        nextRun: report.nextRun || undefined,
        active: report.active
      };
    } catch (error) {
      console.error('Failed to create BI report:', error);
      throw new Error('Failed to create BI report');
    }
  }

  // Get BI Reports
  async getBIReports(integrationId?: string): Promise<BIReportConfig[]> {
    try {
      const reports = await prisma.bIReport.findMany({
        where: integrationId ? { integrationId } : {},
        orderBy: { createdAt: 'desc' }
      });

      return reports.map(report => ({
        id: report.id,
        integrationId: report.integrationId,
        reportId: report.reportId,
        name: report.name,
        description: report.description || undefined,
        type: report.type as any,
        config: report.config as Record<string, any>,
        schedule: report.schedule || undefined,
        recipients: report.recipients as any[],
        lastRun: report.lastRun || undefined,
        nextRun: report.nextRun || undefined,
        active: report.active
      }));
    } catch (error) {
      console.error('Failed to get BI reports:', error);
      throw new Error('Failed to get BI reports');
    }
  }

  // Get BI Analytics
  async getBIAnalytics(integrationId?: string): Promise<{
    totalIntegrations: number;
    activeIntegrations: number;
    totalDashboards: number;
    activeDashboards: number;
    totalReports: number;
    activeReports: number;
    dashboardsByType: Record<string, number>;
    reportsByType: Record<string, number>;
    usageByPlatform: Record<string, number>;
    averageLoadTime: number;
    dataFreshness: number;
    userEngagement: number;
  }> {
    try {
      const [totalIntegrations, activeIntegrations] = await Promise.all([
        prisma.bIIntegration.count(integrationId ? { where: { id: integrationId } } : {}),
        prisma.bIIntegration.count({
          where: {
            ...(integrationId && { id: integrationId }),
            status: 'active',
            enabled: true
          }
        })
      ]);

      const [totalDashboards, activeDashboards] = await Promise.all([
        prisma.bIDashboard.count(integrationId ? { where: { integrationId } } : {}),
        prisma.bIDashboard.count({
          where: {
            ...(integrationId && { integrationId }),
            active: true
          }
        })
      ]);

      const [totalReports, activeReports] = await Promise.all([
        prisma.bIReport.count(integrationId ? { where: { integrationId } } : {}),
        prisma.bIReport.count({
          where: {
            ...(integrationId && { integrationId }),
            active: true
          }
        })
      ]);

      const [dashboards, reports, integrations] = await Promise.all([
        prisma.bIDashboard.findMany({
          where: integrationId ? { integrationId } : {},
          include: { integration: true }
        }),
        prisma.bIReport.findMany({
          where: integrationId ? { integrationId } : {},
          include: { integration: true }
        }),
        prisma.bIIntegration.findMany({
          where: integrationId ? { id: integrationId } : {}
        })
      ]);

      const dashboardsByType = dashboards.reduce((acc, dashboard) => {
        const type = dashboard.integration.type;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const reportsByType = reports.reduce((acc, report) => {
        acc[report.type] = (acc[report.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const usageByPlatform = integrations.reduce((acc, integration) => {
        acc[integration.type] = (acc[integration.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Mock performance metrics
      const averageLoadTime = Math.floor(Math.random() * 3000) + 1000; // 1-4 seconds
      const dataFreshness = Math.random() * 30 + 85; // 85-115% (freshness score)
      const userEngagement = Math.random() * 25 + 70; // 70-95%

      return {
        totalIntegrations,
        activeIntegrations,
        totalDashboards,
        activeDashboards,
        totalReports,
        activeReports,
        dashboardsByType,
        reportsByType,
        usageByPlatform,
        averageLoadTime,
        dataFreshness,
        userEngagement
      };
    } catch (error) {
      console.error('Failed to get BI analytics:', error);
      throw new Error('Failed to get BI analytics');
    }
  }

  // Execute BI Report
  async executeBIReport(reportId: string): Promise<{
    success: boolean;
    message: string;
    executionTime: number;
    dataPoints: number;
    results?: any;
  }> {
    try {
      const report = await prisma.bIReport.findUnique({
        where: { id: reportId }
      });

      if (!report) {
        return {
          success: false,
          message: 'Report not found',
          executionTime: 0,
          dataPoints: 0
        };
      }

      const startTime = Date.now();
      
      // Simulate report execution
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 3000));
      
      const executionTime = Date.now() - startTime;
      const success = Math.random() > 0.05; // 95% success rate
      const dataPoints = Math.floor(Math.random() * 10000) + 1000;

      // Update report last run
      await prisma.bIReport.update({
        where: { id: reportId },
        data: { lastRun: new Date() }
      });

      return {
        success,
        message: success ? 'Report executed successfully' : 'Report execution failed',
        executionTime,
        dataPoints,
        results: success ? {
          reportId: report.reportId,
          name: report.name,
          type: report.type,
          dataPoints,
          executionTime
        } : undefined
      };
    } catch (error) {
      console.error('Failed to execute BI report:', error);
      return {
        success: false,
        message: 'Report execution failed: ' + error?.toString(),
        executionTime: 0,
        dataPoints: 0
      };
    }
  }

  // Refresh BI Dashboard
  async refreshBIDashboard(dashboardId: string): Promise<{
    success: boolean;
    message: string;
    refreshTime: number;
    widgets: number;
    lastUpdate: Date;
  }> {
    try {
      const dashboard = await prisma.bIDashboard.findUnique({
        where: { id: dashboardId }
      });

      if (!dashboard) {
        return {
          success: false,
          message: 'Dashboard not found',
          refreshTime: 0,
          widgets: 0,
          lastUpdate: new Date()
        };
      }

      const startTime = Date.now();
      
      // Simulate dashboard refresh
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 2000));
      
      const refreshTime = Date.now() - startTime;
      const success = Math.random() > 0.02; // 98% success rate
      const widgets = (dashboard.widgets as any[]).length;

      return {
        success,
        message: success ? 'Dashboard refreshed successfully' : 'Dashboard refresh failed',
        refreshTime,
        widgets,
        lastUpdate: new Date()
      };
    } catch (error) {
      console.error('Failed to refresh BI dashboard:', error);
      return {
        success: false,
        message: 'Dashboard refresh failed: ' + error?.toString(),
        refreshTime: 0,
        widgets: 0,
        lastUpdate: new Date()
      };
    }
  }
}

export const biIntegrationService = new BIIntegrationService();
