
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  FileText, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Shield,
  TrendingUp
} from 'lucide-react';

interface PolicyMetrics {
  overview: {
    totalPolicies: number;
    activePolicies: number;
    draftPolicies: number;
    expiredPolicies: number;
    averageCompliance: number;
  };
  compliance: {
    acknowledgmentRate: number;
    trainingCompletion: number;
    violations: number;
    exceptions: number;
    overduePolicies: number;
  };
  distribution: {
    departmentCoverage: number;
    roleCoverage: number;
    userCoverage: number;
  };
  enforcement: {
    monitoredPolicies: number;
    automatedChecks: number;
    manualReviews: number;
    escalations: number;
  };
}

export function PolicyManagementPanel() {
  const [metrics, setMetrics] = useState<PolicyMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPolicyMetrics();
  }, []);

  const fetchPolicyMetrics = async () => {
    try {
      const response = await fetch('/api/policy-management?action=metrics');
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch policy metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const detectViolations = async () => {
    try {
      const response = await fetch('/api/policy-management?action=violations');
      const data = await response.json();
      
      if (data.success) {
        console.log('Policy violations detected:', data.data);
        // Refresh metrics after detecting violations
        fetchPolicyMetrics();
      }
    } catch (error) {
      console.error('Failed to detect policy violations:', error);
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
          <h2 className="text-2xl font-bold">Policy Management</h2>
          <p className="text-gray-600">Centralized policy creation, distribution, and enforcement</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={detectViolations}>
            <AlertTriangle className="h-4 w-4 mr-2" />
            Detect Violations
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Policy
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.overview.totalPolicies}</div>
            <div className="text-xs text-muted-foreground">
              {metrics?.overview.activePolicies} active
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acknowledgment Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.compliance.acknowledgmentRate}%</div>
            <div className="text-xs text-muted-foreground">
              Training: {metrics?.compliance.trainingCompletion}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.compliance.violations}</div>
            <div className="text-xs text-muted-foreground">
              {metrics?.compliance.exceptions} exceptions
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coverage</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.distribution.userCoverage}%</div>
            <div className="text-xs text-muted-foreground">
              User coverage
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Policy Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Policies</span>
              <Badge variant="default">{metrics?.overview.activePolicies}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Draft Policies</span>
              <Badge variant="secondary">{metrics?.overview.draftPolicies}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Expired Policies</span>
              <Badge variant="destructive">{metrics?.overview.expiredPolicies}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Average Compliance</span>
              <Badge variant={metrics?.overview.averageCompliance && metrics.overview.averageCompliance >= 90 ? "default" : "secondary"}>
                {metrics?.overview.averageCompliance}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Enforcement Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Monitored Policies</span>
              <Badge variant="default">{metrics?.enforcement.monitoredPolicies}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Automated Checks</span>
              <Badge variant="secondary">{metrics?.enforcement.automatedChecks}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Manual Reviews</span>
              <Badge variant="secondary">{metrics?.enforcement.manualReviews}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Escalations</span>
              <Badge variant={metrics?.enforcement.escalations && metrics.enforcement.escalations > 0 ? "destructive" : "secondary"}>
                {metrics?.enforcement.escalations}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Policy Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search policies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Search for policies by name, category, status, or owner.
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Distribution Coverage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Department Coverage</span>
              <span className="text-sm font-medium">{metrics?.distribution.departmentCoverage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Role Coverage</span>
              <span className="text-sm font-medium">{metrics?.distribution.roleCoverage}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">User Coverage</span>
              <span className="text-sm font-medium">{metrics?.distribution.userCoverage}%</span>
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
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm">Overdue Policies</span>
              <Badge variant="destructive">{metrics?.compliance.overduePolicies}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Pending Reviews</span>
              <Badge variant="secondary">{metrics?.enforcement.manualReviews}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Compliance Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Acknowledgment Rate</span>
              <Badge variant="default">{metrics?.compliance.acknowledgmentRate}%</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm">Training Completion</span>
              <Badge variant="secondary">{metrics?.compliance.trainingCompletion}%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
