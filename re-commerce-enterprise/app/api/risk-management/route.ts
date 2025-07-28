
import { NextRequest, NextResponse } from 'next/server';
import { enterpriseRiskManagement } from '@/lib/enterprise-risk-management';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'dashboard':
        const dashboard = await enterpriseRiskManagement.getRiskDashboard();
        return NextResponse.json({
          success: true,
          data: dashboard
        });

      case 'monitor':
        const monitoring = await enterpriseRiskManagement.monitorRiskIndicators();
        return NextResponse.json({
          success: true,
          data: monitoring
        });

      case 'search':
        const searchFilters = {
          type: searchParams.get('type') || undefined,
          riskLevel: searchParams.get('riskLevel') || undefined,
          status: searchParams.get('status') || undefined,
          owner: searchParams.get('owner') || undefined
        };
        const risks = await enterpriseRiskManagement.searchRisks(searchFilters);
        return NextResponse.json({
          success: true,
          data: risks
        });

      case 'report':
        const reportType = searchParams.get('reportType') || 'dashboard';
        const report = await enterpriseRiskManagement.generateRiskReport(reportType as any);
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
    console.error('Risk management API error:', error);
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
      case 'assess':
        const assessment = await enterpriseRiskManagement.assessRisk(data);
        return NextResponse.json({
          success: true,
          data: assessment
        });

      case 'update':
        const updatedRisk = await enterpriseRiskManagement.updateRiskAssessment(data.riskId, data.updates);
        return NextResponse.json({
          success: true,
          data: updatedRisk
        });

      case 'implement_mitigation':
        const implementedAction = await enterpriseRiskManagement.implementMitigationAction(
          data.riskId,
          data.actionId
        );
        return NextResponse.json({
          success: true,
          data: implementedAction
        });

      case 'record_event':
        const event = await enterpriseRiskManagement.recordRiskEvent(data);
        return NextResponse.json({
          success: true,
          data: event
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Risk management POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
