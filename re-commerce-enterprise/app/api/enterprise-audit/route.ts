
import { NextRequest, NextResponse } from 'next/server';
import { enterpriseAuditGovernance } from '@/lib/enterprise-audit-governance';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const filters = Object.fromEntries(searchParams.entries());

    switch (action) {
      case 'metrics':
        const metrics = await enterpriseAuditGovernance.getGovernanceMetrics();
        return NextResponse.json({
          success: true,
          data: metrics
        });

      case 'search_logs':
        const logs = await enterpriseAuditGovernance.searchAuditLogs({
          userId: filters.userId,
          action: filters.action,
          resource: filters.resource,
          startDate: filters.startDate ? new Date(filters.startDate) : undefined,
          endDate: filters.endDate ? new Date(filters.endDate) : undefined,
          riskLevel: filters.riskLevel
        });
        return NextResponse.json({
          success: true,
          data: logs
        });

      case 'export':
        const format = filters.format || 'json';
        const exportData = await enterpriseAuditGovernance.exportAuditData(format as 'json' | 'csv' | 'xml');
        return NextResponse.json({
          success: true,
          data: exportData
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Enterprise audit API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'log_event':
        const eventId = await enterpriseAuditGovernance.logAuditEvent(data);
        return NextResponse.json({
          success: true,
          data: { eventId }
        });

      case 'log_action':
        const actionId = await enterpriseAuditGovernance.logUserAction(
          data.userId,
          data.userEmail,
          data.action,
          data.resource,
          data.details,
          data.ipAddress,
          data.userAgent
        );
        return NextResponse.json({
          success: true,
          data: { actionId }
        });

      case 'generate_report':
        const report = await enterpriseAuditGovernance.generateAuditReport(
          data.type,
          data.period,
          data.scope
        );
        return NextResponse.json({
          success: true,
          data: report
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Enterprise audit POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
