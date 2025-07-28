
import { NextRequest, NextResponse } from 'next/server';
import { etlIntegrationService } from '@/lib/enterprise-etl-integration';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;
    const enabled = searchParams.get('enabled') ? searchParams.get('enabled') === 'true' : undefined;
    const action = searchParams.get('action');
    const pipelineId = searchParams.get('pipelineId');

    switch (action) {
      case 'analytics':
        const analytics = await etlIntegrationService.getETLAnalytics(pipelineId || undefined);
        return NextResponse.json(analytics);

      case 'runs':
        const runs = await etlIntegrationService.getETLRuns(pipelineId || undefined);
        return NextResponse.json(runs);

      default:
        const pipelines = await etlIntegrationService.getETLPipelines({ type, status, enabled });
        return NextResponse.json(pipelines);
    }
  } catch (error) {
    console.error('Failed to get ETL pipelines:', error);
    return NextResponse.json({ error: 'Failed to get ETL pipelines' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const pipelineId = searchParams.get('pipelineId');

    switch (action) {
      case 'create':
        const createData = await request.json();
        const pipeline = await etlIntegrationService.createETLPipeline(createData);
        return NextResponse.json(pipeline);

      case 'run':
        if (!pipelineId) {
          return NextResponse.json({ error: 'Pipeline ID is required' }, { status: 400 });
        }
        const runData = await request.json();
        const runResult = await etlIntegrationService.runETLPipeline(pipelineId, runData.options);
        return NextResponse.json(runResult);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Failed to process ETL pipeline request:', error);
    return NextResponse.json({ error: 'Failed to process ETL pipeline request' }, { status: 500 });
  }
}
