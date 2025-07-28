
import { NextRequest, NextResponse } from 'next/server';
import { regulatoryReportingAutomation } from '@/lib/regulatory-reporting-automation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'metrics':
        const metrics = await regulatoryReportingAutomation.getComplianceMetrics();
        return NextResponse.json({
          success: true,
          data: metrics
        });

      case 'dashboard':
        const dashboard = await regulatoryReportingAutomation.getReportingDashboard();
        return NextResponse.json({
          success: true,
          data: dashboard
        });

      case 'schedule':
        const schedule = await regulatoryReportingAutomation.monitorSchedule();
        return NextResponse.json({
          success: true,
          data: schedule
        });

      case 'search':
        const searchFilters = {
          regulation: searchParams.get('regulation') || undefined,
          status: searchParams.get('status') || undefined,
          type: searchParams.get('type') || undefined,
          period: searchParams.get('startDate') && searchParams.get('endDate') 
            ? {
                start: new Date(searchParams.get('startDate')!),
                end: new Date(searchParams.get('endDate')!)
              }
            : undefined
        };
        const reports = await regulatoryReportingAutomation.searchReports(searchFilters);
        return NextResponse.json({
          success: true,
          data: reports
        });

      case 'automation_status':
        const automationResult = await regulatoryReportingAutomation.executeAutomationRules();
        return NextResponse.json({
          success: true,
          data: automationResult
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Regulatory reporting API error:', error);
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
      case 'generate':
        const report = await regulatoryReportingAutomation.generateReport(
          data.regulation,
          data.reportType,
          data.period
        );
        return NextResponse.json({
          success: true,
          data: report
        });

      case 'submit':
        const submissionResult = await regulatoryReportingAutomation.submitReport(data.reportId);
        return NextResponse.json({
          success: true,
          data: submissionResult
        });

      case 'create_automation_rule':
        const rule = await regulatoryReportingAutomation.createAutomationRule(data);
        return NextResponse.json({
          success: true,
          data: rule
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Regulatory reporting POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
