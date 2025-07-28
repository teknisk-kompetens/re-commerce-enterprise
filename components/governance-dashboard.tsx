
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  FileText, 
  Database, 
  ClipboardList, 
  Workflow,
  AlertTriangle,
  BarChart3,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

import { RegulatoryCompliancePanel } from '@/components/governance/regulatory-compliance-panel';
import { EnterpriseAuditPanel } from '@/components/governance/enterprise-audit-panel';
import { DataGovernancePanel } from '@/components/governance/data-governance-panel';
import { PolicyManagementPanel } from '@/components/governance/policy-management-panel';
import { ComplianceWorkflowPanel } from '@/components/governance/compliance-workflow-panel';
import { RiskManagementPanel } from '@/components/governance/risk-management-panel';
import { RegulatoryReportingPanel } from '@/components/governance/regulatory-reporting-panel';
import { EthicsConductPanel } from '@/components/governance/ethics-conduct-panel';

interface GovernanceMetrics {
  compliance: {
    overall_score: number;
    violations: number;
    pending_actions: number;
    trend: 'improving' | 'stable' | 'declining';
  };
  risk: {
    critical_risks: number;
    high_risks: number;
    total_risks: number;
    mitigation_rate: number;
  };
  policies: {
    active_policies: number;
    acknowledgment_rate: number;
    violations: number;
  };
  ethics: {
    open_cases: number;
    training_completion: number;
    culture_score: number;
  };
  audit: {
    findings: number;
    resolved: number;
    pending: number;
  };
  reporting: {
    due_reports: number;
    submitted_reports: number;
    automation_rate: number;
  };
}

export function GovernanceDashboard() {
  const [metrics, setMetrics] = useState<GovernanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchGovernanceMetrics();
  }, []);

  const fetchGovernanceMetrics = async () => {
    try {
      // Simulate fetching metrics from multiple governance systems
      const mockMetrics: GovernanceMetrics = {
        compliance: {
          overall_score: 92,
          violations: 5,
          pending_actions: 12,
          trend: 'improving'
        },
        risk: {
          critical_risks: 2,
          high_risks: 8,
          total_risks: 45,
          mitigation_rate: 78
        },
        policies: {
          active_policies: 156,
          acknowledgment_rate: 94,
          violations: 3
        },
        ethics: {
          open_cases: 4,
          training_completion: 88,
          culture_score: 85
        },
        audit: {
          findings: 15,
          resolved: 12,
          pending: 3
        },
        reporting: {
          due_reports: 8,
          submitted_reports: 24,
          automation_rate: 75
        }
      };
      
      setMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to fetch governance metrics:', error);
    } finally {
      setLoading(false);
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="audit">Audit</TabsTrigger>
          <TabsTrigger value="data">Data Gov</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="reporting">Reporting</TabsTrigger>
          <TabsTrigger value="ethics">Ethics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                <Shield className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.compliance.overall_score}%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  {metrics?.compliance.trend}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical Risks</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.risk.critical_risks}</div>
                <div className="text-xs text-muted-foreground">
                  {metrics?.risk.total_risks} total risks
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Policy Compliance</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.policies.acknowledgment_rate}%</div>
                <div className="text-xs text-muted-foreground">
                  {metrics?.policies.active_policies} active policies
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ethics Score</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics?.ethics.culture_score}%</div>
                <div className="text-xs text-muted-foreground">
                  {metrics?.ethics.open_cases} open cases
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Governance Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Compliance Violations</span>
                    <Badge variant={metrics?.compliance.violations && metrics.compliance.violations > 0 ? "destructive" : "secondary"}>
                      {metrics?.compliance.violations || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Audit Findings</span>
                    <Badge variant={metrics?.audit.findings && metrics.audit.findings > 0 ? "destructive" : "secondary"}>
                      {metrics?.audit.findings || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Policy Violations</span>
                    <Badge variant={metrics?.policies.violations && metrics.policies.violations > 0 ? "destructive" : "secondary"}>
                      {metrics?.policies.violations || 0}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Ethics Cases</span>
                    <Badge variant={metrics?.ethics.open_cases && metrics.ethics.open_cases > 0 ? "destructive" : "secondary"}>
                      {metrics?.ethics.open_cases || 0}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Pending Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Compliance Actions</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{metrics?.compliance.pending_actions}</span>
                      <Clock className="h-3 w-3 text-orange-500" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Audit Reviews</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{metrics?.audit.pending}</span>
                      <Clock className="h-3 w-3 text-orange-500" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Due Reports</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{metrics?.reporting.due_reports}</span>
                      <Clock className="h-3 w-3 text-orange-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="justify-start" onClick={() => setActiveTab('compliance')}>
                  <Shield className="h-4 w-4 mr-2" />
                  Run Compliance Check
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => setActiveTab('risk')}>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Assess Risks
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => setActiveTab('policies')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Review Policies
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => setActiveTab('reporting')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <RegulatoryCompliancePanel />
        </TabsContent>

        <TabsContent value="audit">
          <EnterpriseAuditPanel />
        </TabsContent>

        <TabsContent value="data">
          <DataGovernancePanel />
        </TabsContent>

        <TabsContent value="policies">
          <PolicyManagementPanel />
        </TabsContent>

        <TabsContent value="workflow">
          <ComplianceWorkflowPanel />
        </TabsContent>

        <TabsContent value="risk">
          <RiskManagementPanel />
        </TabsContent>

        <TabsContent value="reporting">
          <RegulatoryReportingPanel />
        </TabsContent>

        <TabsContent value="ethics">
          <EthicsConductPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}
