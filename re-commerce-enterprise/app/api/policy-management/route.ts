
import { NextRequest, NextResponse } from 'next/server';
import { enterprisePolicyManagement } from '@/lib/enterprise-policy-management';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'metrics':
        const metrics = await enterprisePolicyManagement.getPolicyMetrics();
        return NextResponse.json({
          success: true,
          data: metrics
        });

      case 'violations':
        const violations = await enterprisePolicyManagement.detectPolicyViolations();
        return NextResponse.json({
          success: true,
          data: violations
        });

      case 'search':
        const searchQuery = {
          name: searchParams.get('name') || undefined,
          category: searchParams.get('category') || undefined,
          status: searchParams.get('status') || undefined,
          owner: searchParams.get('owner') || undefined,
          effectiveDate: searchParams.get('effectiveDate') ? new Date(searchParams.get('effectiveDate')!) : undefined
        };
        const policies = await enterprisePolicyManagement.searchPolicies(searchQuery);
        return NextResponse.json({
          success: true,
          data: policies
        });

      case 'report':
        const policyId = searchParams.get('policyId') || undefined;
        const report = await enterprisePolicyManagement.generatePolicyReport(policyId);
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
    console.error('Policy management API error:', error);
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
      case 'create':
        const newPolicy = await enterprisePolicyManagement.createPolicy(data);
        return NextResponse.json({
          success: true,
          data: newPolicy
        });

      case 'update':
        const updatedPolicy = await enterprisePolicyManagement.updatePolicy(data.policyId, data.updates);
        return NextResponse.json({
          success: true,
          data: updatedPolicy
        });

      case 'approve':
        const approvedPolicy = await enterprisePolicyManagement.approvePolicy(data.policyId, data.approver);
        return NextResponse.json({
          success: true,
          data: approvedPolicy
        });

      case 'distribute':
        const distributionResult = await enterprisePolicyManagement.distributePolicy(data.policyId);
        return NextResponse.json({
          success: true,
          data: distributionResult
        });

      case 'acknowledge':
        const acknowledgment = await enterprisePolicyManagement.acknowledgePolicyByUser(data.policyId, data.userId);
        return NextResponse.json({
          success: true,
          data: acknowledgment
        });

      case 'request_exception':
        const exception = await enterprisePolicyManagement.requestPolicyException(
          data.policyId,
          data.requester,
          data.justification,
          data.riskAssessment,
          new Date(data.validUntil)
        );
        return NextResponse.json({
          success: true,
          data: exception
        });

      case 'approve_exception':
        const approvedException = await enterprisePolicyManagement.approveException(data.exceptionId, data.approver);
        return NextResponse.json({
          success: true,
          data: approvedException
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Policy management POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
