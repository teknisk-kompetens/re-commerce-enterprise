
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Database, 
  Shield, 
  Users, 
  FileText, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  Lock
} from 'lucide-react';

interface DataGovernanceMetrics {
  assets: {
    total: number;
    classified: number;
    unclassified: number;
    byClassification: { [key: string]: number };
  };
  privacy: {
    requests: number;
    processed: number;
    averageProcessingTime: number;
    consentRate: number;
  };
  compliance: {
    score: number;
    violations: number;
    assessments: number;
    policies: number;
  };
  lineage: {
    traced: number;
    orphaned: number;
    confidence: number;
  };
}

export function DataGovernancePanel() {
  const [metrics, setMetrics] = useState<DataGovernanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDataGovernanceMetrics();
  }, []);

  const fetchDataGovernanceMetrics = async () => {
    try {
      const response = await fetch('/api/data-governance?action=metrics');
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch data governance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateDataMap = async () => {
    try {
      const response = await fetch('/api/data-governance?action=data_map');
      const data = await response.json();
      
      if (data.success) {
        console.log('Data map generated:', data.data);
        // Handle data map display
      }
    } catch (error) {
      console.error('Failed to generate data map:', error);
    }
  };

  const enforceRetentionPolicies = async () => {
    try {
      const response = await fetch('/api/data-governance?action=retention_enforcement');
      const data = await response.json();
      
      if (data.success) {
        console.log('Retention policies enforced:', data.data);
        // Refresh metrics after enforcement
        fetchDataGovernanceMetrics();
      }
    } catch (error) {
      console.error('Failed to enforce retention policies:', error);
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
          <h2 className="text-2xl font-bold">Data Governance & Privacy</h2>
          <p className="text-gray-600">Manage data assets, privacy, and compliance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateDataMap}>
            <Eye className="h-4 w-4 mr-2" />
            Generate Data Map
          </Button>
          <Button variant="outline" onClick={enforceRetentionPolicies}>
            <Database className="h-4 w-4 mr-2" />
            Enforce Retention
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Assets</CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.assets.total}</div>
            <div className="text-xs text-muted-foreground">
              {metrics?.assets.classified} classified
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Privacy Requests</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.privacy.requests}</div>
            <div className="text-xs text-muted-foreground">
              {metrics?.privacy.processed} processed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.compliance.score}</div>
            <div className="text-xs text-muted-foreground">
              {metrics?.compliance.violations} violations
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lineage Confidence</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.lineage.confidence}%</div>
            <div className="text-xs text-muted-foreground">
              {metrics?.lineage.traced} assets traced
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics?.assets.byClassification && Object.entries(metrics.assets.byClassification).map(([classification, count]) => (
              <div key={classification} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium capitalize">{classification}</span>
                  <Badge variant={
                    classification === 'restricted' ? 'destructive' :
                    classification === 'confidential' ? 'destructive' :
                    classification === 'internal' ? 'secondary' :
                    'default'
                  }>
                    {count}
                  </Badge>
                </div>
                <Progress value={(count / (metrics?.assets.total || 1)) * 100} className="h-2" />
              </div>
            ))}
            {metrics?.assets.unclassified && metrics.assets.unclassified > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Unclassified</span>
                  <Badge variant="destructive">{metrics.assets.unclassified}</Badge>
                </div>
                <Progress value={(metrics.assets.unclassified / metrics.assets.total) * 100} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Privacy Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Data Subject Requests</span>
              <Badge variant="secondary">{metrics?.privacy.requests}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Processed Requests</span>
              <Badge variant="default">{metrics?.privacy.processed}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Avg Processing Time</span>
              <Badge variant="secondary">{metrics?.privacy.averageProcessingTime} days</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Consent Rate</span>
              <Badge variant={metrics?.privacy.consentRate && metrics.privacy.consentRate >= 80 ? "default" : "secondary"}>
                {metrics?.privacy.consentRate}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Compliance Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Privacy Assessments</span>
              <span className="text-sm font-medium">{metrics?.compliance.assessments}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Policies</span>
              <span className="text-sm font-medium">{metrics?.compliance.policies}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Violations</span>
              <span className="text-sm font-medium text-red-600">{metrics?.compliance.violations}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Data Lineage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Traced Assets</span>
              <span className="text-sm font-medium">{metrics?.lineage.traced}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Orphaned Assets</span>
              <span className="text-sm font-medium text-orange-600">{metrics?.lineage.orphaned}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Confidence</span>
              <span className="text-sm font-medium">{metrics?.lineage.confidence}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Privacy Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Right to Access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Right to Erasure</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm">Data Portability</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm">Consent Management</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
