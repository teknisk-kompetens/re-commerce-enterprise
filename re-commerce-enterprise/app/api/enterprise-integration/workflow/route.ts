
import { NextRequest, NextResponse } from 'next/server';
import { workflowAutomationService } from '@/lib/enterprise-workflow-automation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const status = searchParams.get('status') || undefined;
    const enabled = searchParams.get('enabled') ? searchParams.get('enabled') === 'true' : undefined;
    const action = searchParams.get('action');
    const engineId = searchParams.get('engineId');
    const workflowId = searchParams.get('workflowId');

    switch (action) {
      case 'engines':
        const engines = await workflowAutomationService.getWorkflowEngines({ type, status, enabled });
        return NextResponse.json(engines);

      case 'workflows':
        const workflows = await workflowAutomationService.getWorkflows(engineId || undefined);
        return NextResponse.json(workflows);

      case 'executions':
        const executions = await workflowAutomationService.getWorkflowExecutions(workflowId || undefined);
        return NextResponse.json(executions);

      case 'analytics':
        const analytics = await workflowAutomationService.getWorkflowAnalytics(workflowId || undefined);
        return NextResponse.json(analytics);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Failed to get workflow data:', error);
    return NextResponse.json({ error: 'Failed to get workflow data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const workflowId = searchParams.get('workflowId');

    switch (action) {
      case 'create-engine':
        const engineData = await request.json();
        const engine = await workflowAutomationService.createWorkflowEngine(engineData);
        return NextResponse.json(engine);

      case 'create-workflow':
        const workflowData = await request.json();
        const workflow = await workflowAutomationService.createWorkflow(workflowData);
        return NextResponse.json(workflow);

      case 'execute':
        if (!workflowId) {
          return NextResponse.json({ error: 'Workflow ID is required' }, { status: 400 });
        }
        const executeData = await request.json();
        const execution = await workflowAutomationService.executeWorkflow(
          workflowId,
          executeData.triggeredBy,
          executeData.variables
        );
        return NextResponse.json(execution);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Failed to process workflow request:', error);
    return NextResponse.json({ error: 'Failed to process workflow request' }, { status: 500 });
  }
}
