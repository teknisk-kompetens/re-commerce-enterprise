
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Send,
  Download,
  BarChart3,
  Settings,
  Calendar
} from 'lucide-react';

interface ReportingDashboard {
  summary: {
    total_reports: number;
    pending_reports: number;
    overdue_reports: number;
    automation_rate: number;
  };
  upcoming_deadlines: {
    id: string;
    regulation: string;
    report_type: string;
    next_due: string;
    status: 'on_track' | 'at_risk' | 'overdue';
  }[];
  recent_submissions: {
    id: string;
    name: string;
    regulation: string;
    submitted_at: string;
    status: string;
  }[];
  alerts: {
    reminders: string[];
    escalations: string[];
  };
  quality_metrics: {
    average_accuracy: number;
    average_completeness: number;
    validation_pass_rate: number;
    rejection_rate: number;
  };
  efficiency_metrics: {
    average_generation_time: number;
    automation_savings: number;
    manual_effort_hours: number;
    cost_per_report: number;
  };
}

export function RegulatoryReportingPanel() {
  const [dashboard, setDashboard] = useState<ReportingDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportingDashboard();
  }, []);

  const fetchReportingDashboard = async () => {
    try {
      const response = await fetch('/api/regulatory-reporting?action=dashboard');
      const data = await response.json();
      
      if (data.success) {
        setDashboard(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch reporting dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAutomationStatus = async () => {
    try {
      const response = await fetch('/api/regulatory-reporting?action=automation_status');
      const data = await response.json();
      
      if (data.success) {
        console.log('Automation status:', data.data);
        // Refresh dashboard after checking automation
        fetchReportingDashboard();
      }
    } catch (error) {
      console.error('Failed to check automation status:', error);
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
          <h2 className="text-2xl font-bold">Regulatory Reporting</h2>
          <p className="text-gray-600">Automated regulatory report generation and submission</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={checkAutomationStatus}>
            <Settings className="h-4 w-4 mr-2" />
            Check Automation
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.summary.total_reports}</div>
            <div className="text-xs text-muted-foreground">
              All time
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.summary.pending_reports}</div>
            <div className="text-xs text-muted-foreground">
              Need attention
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.summary.overdue_reports}</div>
            <div className="text-xs text-muted-foreground">
              Require immediate action
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automation Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.summary.automation_rate}%</div>
            <Progress value={dashboard?.summary.automation_rate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard?.upcoming_deadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    deadline.status === 'overdue' ? 'bg-red-500' :
                    deadline.status === 'at_risk' ? 'bg-orange-500' :
                    'bg-green-500'
                  }`} />
                  <div>
                    <div className="font-medium">{deadline.regulation}</div>
                    <div className="text-sm text-muted-foreground">
                      {deadline.report_type}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    deadline.status === 'overdue' ? 'destructive' :
                    deadline.status === 'at_risk' ? 'destructive' :
                    'default'
                  }>
                    {deadline.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Due: {new Date(deadline.next_due).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard?.recent_submissions.map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{submission.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {submission.regulation}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    submission.status === 'accepted' ? 'default' :
                    submission.status === 'submitted' ? 'secondary' :
                    'destructive'
                  }>
                    {submission.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {new Date(submission.submitted_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alerts & Reminders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Reminders</h4>
              <div className="space-y-2">
                {dashboard?.alerts.reminders.map((reminder, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded-lg">
                    <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{reminder}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-2">Escalations</h4>
              <div className="space-y-2">
                {dashboard?.alerts.escalations.map((escalation, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{escalation}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Quality & Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Quality Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Accuracy</span>
                  <Badge variant="default">{dashboard?.quality_metrics.average_accuracy}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Completeness</span>
                  <Badge variant="default">{dashboard?.quality_metrics.average_completeness}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Validation Pass Rate</span>
                  <Badge variant="default">{dashboard?.quality_metrics.validation_pass_rate}%</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-2">Efficiency Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Generation Time</span>
                  <Badge variant="secondary">{dashboard?.efficiency_metrics.average_generation_time}h</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Automation Savings</span>
                  <Badge variant="default">{dashboard?.efficiency_metrics.automation_savings}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cost per Report</span>
                  <Badge variant="secondary">${dashboard?.efficiency_metrics.cost_per_report}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Create Report
            </Button>
            <Button variant="outline" className="justify-start">
              <Send className="h-4 w-4 mr-2" />
              Submit Report
            </Button>
            <Button variant="outline" className="justify-start">
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Automation Rules
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
