
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Workflow, 
  Play, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users,
  BarChart3,
  Filter,
  Plus
} from 'lucide-react';

interface WorkflowMetrics {
  total: number;
  completed: number;
  overdue: number;
  inProgress: number;
  completionRate: number;
  avgCompletionTime: number;
  onTimeRate: number;
  workloadTrend: string;
  bottlenecks: string[];
  recommendations: string[];
}

export function ComplianceWorkflowPanel() {
  const [metrics, setMetrics] = useState<WorkflowMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflowMetrics();
  }, []);

  const fetchWorkflowMetrics = async () => {
    try {
      const response = await fetch('/api/compliance-workflow?action=metrics');
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch workflow metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const escalateOverdueTasks = async () => {
    try {
      const response = await fetch('/api/compliance-workflow?action=escalate');
      const data = await response.json();
      
      if (data.success) {
        console.log('Escalation results:', data.data);
        // Refresh metrics after escalation
        fetchWorkflowMetrics();
      }
    } catch (error) {
      console.error('Failed to escalate overdue tasks:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Compliance Workflow Automation</h2>
          <p className="text-gray-600">Automated compliance task assignment, tracking, and workflow management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={escalateOverdueTasks}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Escalate Overdue
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Workflow className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total}</div>
            <div className="text-xs text-muted-foreground">
              {metrics?.completed} completed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.completionRate}%</div>
            <Progress value={metrics?.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <Clock className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.overdue}</div>
            <div className="text-xs text-muted-foreground">
              Require attention
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.onTimeRate}%</div>
            <div className="text-xs text-muted-foreground">
              Avg: {metrics?.avgCompletionTime} days
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Workflow Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completed</span>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{metrics?.completed}</Badge>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <Progress value={metrics?.completed && metrics?.total ? (metrics.completed / metrics.total) * 100 : 0} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">In Progress</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{metrics?.inProgress}</Badge>
                  <Play className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <Progress value={metrics?.inProgress && metrics?.total ? (metrics.inProgress / metrics.total) * 100 : 0} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Overdue</span>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">{metrics?.overdue}</Badge>
                  <Clock className="h-4 w-4 text-red-600" />
                </div>
              </div>
              <Progress value={metrics?.overdue && metrics?.total ? (metrics.overdue / metrics.total) * 100 : 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Bottlenecks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics?.bottlenecks.map((bottleneck, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                <span className="text-sm">{bottleneck}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Task Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start">
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              Completed Tasks
            </Button>
            <Button variant="outline" className="justify-start">
              <Clock className="h-4 w-4 mr-2 text-red-600" />
              Overdue Tasks
            </Button>
            <Button variant="outline" className="justify-start">
              <Play className="h-4 w-4 mr-2 text-blue-600" />
              In Progress
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="h-4 w-4 mr-2 text-purple-600" />
              My Tasks
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Completion Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Completion Time</span>
                  <Badge variant="secondary">{metrics?.avgCompletionTime} days</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">On-Time Completion Rate</span>
                  <Badge variant={metrics?.onTimeRate && metrics.onTimeRate >= 80 ? "default" : "secondary"}>
                    {metrics?.onTimeRate}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Workload Trend</span>
                  <Badge variant="secondary">{metrics?.workloadTrend}</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Recommendations</h4>
              <div className="space-y-2">
                {metrics?.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{recommendation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
