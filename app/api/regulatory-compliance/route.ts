
import { NextRequest, NextResponse } from 'next/server';
import { regulatoryComplianceAutomation } from '@/lib/regulatory-compliance-automation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const regulation = searchParams.get('regulation');

    switch (action) {
      case 'metrics':
        const metrics = await regulatoryComplianceAutomation.performComplianceCheck(regulation || undefined);
        return NextResponse.json({
          success: true,
          data: metrics
        });

      case 'report':
        const report = await regulatoryComplianceAutomation.generateComplianceReport(regulation || undefined);
        return NextResponse.json({
          success: true,
          data: report
        });

      case 'updates':
        const updates = await regulatoryComplianceAutomation.getRegulatoryUpdates();
        return NextResponse.json({
          success: true,
          data: updates
        });

      case 'deadlines':
        const deadlines = await regulatoryComplianceAutomation.trackComplianceDeadlines();
        return NextResponse.json({
          success: true,
          data: deadlines
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Regulatory compliance API error:', error);
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
      case 'check':
        const checkResult = await regulatoryComplianceAutomation.performComplianceCheck(data.regulation);
        return NextResponse.json({
          success: true,
          data: checkResult
        });

      case 'generate_report':
        const reportResult = await regulatoryComplianceAutomation.generateComplianceReport(data.regulation);
        return NextResponse.json({
          success: true,
          data: reportResult
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Regulatory compliance POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
