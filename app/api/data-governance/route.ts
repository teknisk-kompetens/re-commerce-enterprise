
import { NextRequest, NextResponse } from 'next/server';
import { dataGovernancePrivacy } from '@/lib/data-governance-privacy';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'metrics':
        const metrics = await dataGovernancePrivacy.getGovernanceMetrics();
        return NextResponse.json({
          success: true,
          data: metrics
        });

      case 'data_map':
        const dataMap = await dataGovernancePrivacy.generateDataMap();
        return NextResponse.json({
          success: true,
          data: dataMap
        });

      case 'retention_enforcement':
        const retentionResult = await dataGovernancePrivacy.enforceRetentionPolicies();
        return NextResponse.json({
          success: true,
          data: retentionResult
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Data governance API error:', error);
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
      case 'classify_asset':
        await dataGovernancePrivacy.classifyDataAsset(data.assetId, data.classification);
        return NextResponse.json({
          success: true,
          message: 'Asset classified successfully'
        });

      case 'track_lineage':
        const lineage = await dataGovernancePrivacy.trackDataLineage(data.assetId);
        return NextResponse.json({
          success: true,
          data: lineage
        });

      case 'privacy_assessment':
        const assessment = await dataGovernancePrivacy.conductPrivacyImpactAssessment(
          data.projectName,
          data.dataTypes,
          data.personalDataProcessing
        );
        return NextResponse.json({
          success: true,
          data: assessment
        });

      case 'subject_request':
        const request = await dataGovernancePrivacy.processDataSubjectRequest(
          data.type,
          data.requesterId,
          data.requesterEmail,
          data.description
        );
        return NextResponse.json({
          success: true,
          data: request
        });

      case 'manage_consent':
        const consent = await dataGovernancePrivacy.manageConsent(
          data.userId,
          data.purpose,
          data.lawfulBasis,
          data.consentGiven,
          data.source
        );
        return NextResponse.json({
          success: true,
          data: consent
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Data governance POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
