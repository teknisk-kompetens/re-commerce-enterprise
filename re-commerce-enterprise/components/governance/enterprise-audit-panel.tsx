
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Search, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Shield,
  Database,
  Download
} from 'lucide-react';

interface AuditMetrics {
  policies: {
    total: number;
    active: number;
    violations: number;
    compliance: number;
  };
  audits: {
    total: number;
    high_risk: number;
    findings: number;
    resolved: number;
  };
  governance: {
    score: number;
    maturity: 'initial' | 'managed' | 'defined' | 'optimized';
    gaps: string[];
    recommendations: string[];
  };
}

export function EnterpriseAuditPanel() {
  const [metrics, setMetrics] = useState<AuditMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAuditMetrics();
  }, []);

  const fetchAuditMetrics = async () => {
    try {
      const response = await fetch('/api/enterprise-audit?action=metrics');
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch audit metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportAuditData = async (format: 'json' | 'csv' | 'xml') => {
    try {
      const response = await fetch(`/api/enterprise-audit?action=export&format=${format}`);
      const data = await response.json();
      
      if (data.success) {
        // Create and download file
        const blob = new Blob([data.data], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit-data.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to export audit data:', error);
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
          <h2 className="text-2xl font-bold">Enterprise Audit & Governance</h2>
          <p className="text-gray-600">Comprehensive audit trails and governance monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportAuditData('json')}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Governance Score</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.governance.score}</div>
            <div className="text-xs text-muted-foreground">
              {metrics?.governance.maturity} maturity
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.policies.active}</div>
            <div className="text-xs text-muted-foreground">
              of {metrics?.policies.total} total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Findings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.audits.findings}</div>
            <div className="text-xs text-muted-foreground">
              {metrics?.audits.resolved} resolved
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Events</CardTitle>
            <Database className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.audits.high_risk}</div>
            <div className="text-xs text-muted-foreground">
              Require attention
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Policy Compliance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Policies</span>
              <Badge variant="secondary">{metrics?.policies.total}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Policies</span>
              <Badge variant="default">{metrics?.policies.active}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Violations</span>
              <Badge variant={metrics?.policies.violations && metrics.policies.violations > 0 ? "destructive" : "secondary"}>
                {metrics?.policies.violations}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Compliance Rate</span>
              <Badge variant={metrics?.policies.compliance && metrics.policies.compliance >= 90 ? "default" : "secondary"}>
                {metrics?.policies.compliance}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Governance Gaps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics?.governance.gaps.map((gap, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                <Clock className="h-4 w-4 text-orange-600 flex-shrink-0" />
                <span className="text-sm">{gap}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Audit Log Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search audit logs..."
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
            Use the search functionality to find specific audit events, user actions, or policy violations.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics?.governance.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{recommendation}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
