
import { NextRequest, NextResponse } from 'next/server';
import { enterpriseEthicsConduct } from '@/lib/enterprise-ethics-conduct';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'metrics':
        const metrics = await enterpriseEthicsConduct.getEthicsMetrics();
        return NextResponse.json({
          success: true,
          data: metrics
        });

      case 'dashboard':
        const dashboard = await enterpriseEthicsConduct.getEthicsDashboard();
        return NextResponse.json({
          success: true,
          data: dashboard
        });

      case 'search_violations':
        const violationFilters = {
          category: searchParams.get('category') || undefined,
          severity: searchParams.get('severity') || undefined,
          status: searchParams.get('status') || undefined,
          dateRange: searchParams.get('startDate') && searchParams.get('endDate')
            ? {
                start: new Date(searchParams.get('startDate')!),
                end: new Date(searchParams.get('endDate')!)
              }
            : undefined
        };
        const violations = await enterpriseEthicsConduct.searchViolations(violationFilters);
        return NextResponse.json({
          success: true,
          data: violations
        });

      case 'report':
        const ethicsReport = await enterpriseEthicsConduct.generateEthicsReport();
        return NextResponse.json({
          success: true,
          data: ethicsReport
        });

      case 'track_training':
        const userId = searchParams.get('userId');
        const trainingId = searchParams.get('trainingId');
        if (!userId || !trainingId) {
          return NextResponse.json({
            success: false,
            error: 'userId and trainingId parameters required'
          }, { status: 400 });
        }
        const trainingStatus = await enterpriseEthicsConduct.trackEthicsTraining(userId, trainingId);
        return NextResponse.json({
          success: true,
          data: trainingStatus
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Ethics conduct API error:', error);
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
      case 'report_violation':
        const violation = await enterpriseEthicsConduct.reportViolation(data);
        return NextResponse.json({
          success: true,
          data: violation
        });

      case 'start_investigation':
        await enterpriseEthicsConduct.startInvestigation(data.violationId);
        return NextResponse.json({
          success: true,
          message: 'Investigation started'
        });

      case 'complete_investigation':
        const completedInvestigation = await enterpriseEthicsConduct.completeInvestigation(
          data.violationId,
          data.findings,
          data.resolution,
          data.outcome
        );
        return NextResponse.json({
          success: true,
          data: completedInvestigation
        });

      case 'submit_whistleblower':
        const whistleblowerReport = await enterpriseEthicsConduct.submitWhistleblowerReport(data);
        return NextResponse.json({
          success: true,
          data: whistleblowerReport
        });

      case 'declare_conflict':
        const conflict = await enterpriseEthicsConduct.declareConflictOfInterest(data);
        return NextResponse.json({
          success: true,
          data: conflict
        });

      case 'review_conflict':
        const reviewedConflict = await enterpriseEthicsConduct.reviewConflictOfInterest(
          data.conflictId,
          data.decision,
          data.managementPlan
        );
        return NextResponse.json({
          success: true,
          data: reviewedConflict
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Ethics conduct POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
