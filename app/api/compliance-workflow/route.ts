
import { NextRequest, NextResponse } from 'next/server';
import { complianceWorkflowAutomation } from '@/lib/compliance-workflow-automation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'metrics':
        const workflowId = searchParams.get('workflowId') || undefined;
        const metrics = await complianceWorkflowAutomation.getWorkflowMetrics(workflowId);
        return NextResponse.json({
          success: true,
          data: metrics
        });

      case 'deadlines':
        const deadlines = await complianceWorkflowAutomation.trackDeadlines();
        return NextResponse.json({
          success: true,
          data: deadlines
        });

      case 'assignee_tasks':
        const assignee = searchParams.get('assignee');
        if (!assignee) {
          return NextResponse.json({
            success: false,
            error: 'Assignee parameter required'
          }, { status: 400 });
        }
        const tasks = await complianceWorkflowAutomation.getTasksByAssignee(assignee);
        return NextResponse.json({
          success: true,
          data: tasks
        });

      case 'search':
        const filters = {
          status: searchParams.get('status') || undefined,
          priority: searchParams.get('priority') || undefined,
          category: searchParams.get('category') || undefined,
          regulation: searchParams.get('regulation') || undefined,
          assignedTo: searchParams.get('assignedTo') || undefined,
          dueDate: searchParams.get('dueDate') ? new Date(searchParams.get('dueDate')!) : undefined
        };
        const searchResults = await complianceWorkflowAutomation.searchTasks(filters);
        return NextResponse.json({
          success: true,
          data: searchResults
        });

      case 'escalate':
        const escalationResult = await complianceWorkflowAutomation.escalateOverdueTasks();
        return NextResponse.json({
          success: true,
          data: escalationResult
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Compliance workflow API error:', error);
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
      case 'create_task':
        const newTask = await complianceWorkflowAutomation.createTask(data);
        return NextResponse.json({
          success: true,
          data: newTask
        });

      case 'update_status':
        const updatedTask = await complianceWorkflowAutomation.updateTaskStatus(
          data.taskId,
          data.status,
          data.notes
        );
        return NextResponse.json({
          success: true,
          data: updatedTask
        });

      case 'add_evidence':
        const evidence = await complianceWorkflowAutomation.addEvidence(data.taskId, data.evidence);
        return NextResponse.json({
          success: true,
          data: evidence
        });

      case 'verify_evidence':
        const verifiedEvidence = await complianceWorkflowAutomation.verifyEvidence(
          data.evidenceId,
          data.verifiedBy
        );
        return NextResponse.json({
          success: true,
          data: verifiedEvidence
        });

      case 'generate_report':
        const report = await complianceWorkflowAutomation.generateComplianceReport(
          data.type,
          data.period
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
    console.error('Compliance workflow POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
