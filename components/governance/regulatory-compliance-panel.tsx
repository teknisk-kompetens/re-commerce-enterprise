
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  RefreshCw
} from 'lucide-react';

interface ComplianceMetrics {
  overall: {
    score: number;
    compliantRules: number;
    totalRules: number;
    violations: number;
    trend: 'improving' | 'declining' | 'stable';
  };
  byRegulation: {
    [key: string]: {
      score: number;
      compliantRules: number;
      totalRules: number;
      violations: number;
      lastAudit: string;
    };
  };
  riskAreas: {
    category: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    violations: number;
    trend: 'improving' | 'declining' | 'stable';
  }[];
}

export function RegulatoryCompliancePanel() {
  const [metrics, setMetrics] = useState<ComplianceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetchComplianceMetrics();
  }, []);

  const fetchComplianceMetrics = async () => {
    try {
      const response = await fetch('/api/regulatory-compliance?action=metrics');
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch compliance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const runComplianceCheck = async () => {
    setChecking(true);
    try {
      const response = await fetch('/api/regulatory-compliance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'check'
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Failed to run compliance check:', error);
    } finally {
      setChecking(false);
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
          <h2 className="text-2xl font-bold">Regulatory Compliance</h2>
          <p className="text-gray-600">Monitor and manage regulatory compliance across all frameworks</p>
        </div>
        <Button onClick={runComplianceCheck} disabled={checking}>
          {checking ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Run Compliance Check
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.overall.score}%</div>
            <Progress value={metrics?.overall.score} className="mt-2" />
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              {metrics?.overall.trend}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant Rules</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.overall.compliantRules}</div>
            <div className="text-xs text-muted-foreground">
              of {metrics?.overall.totalRules} total rules
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.overall.violations}</div>
            <div className="text-xs text-muted-foreground">
              Active violations
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Areas</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.riskAreas.length}</div>
            <div className="text-xs text-muted-foreground">
              Areas need attention
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Compliance by Regulation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics?.byRegulation && Object.entries(metrics.byRegulation).map(([regulation, data]) => (
              <div key={regulation} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{regulation}</span>
                  <Badge variant={data.score >= 90 ? "default" : data.score >= 70 ? "secondary" : "destructive"}>
                    {data.score}%
                  </Badge>
                </div>
                <Progress value={data.score} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{data.compliantRules}/{data.totalRules} rules</span>
                  <span>{data.violations} violations</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Areas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {metrics?.riskAreas.map((area, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    area.riskLevel === 'critical' ? 'bg-red-500' :
                    area.riskLevel === 'high' ? 'bg-orange-500' :
                    area.riskLevel === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <div>
                    <div className="font-medium">{area.category}</div>
                    <div className="text-sm text-muted-foreground">
                      {area.violations} violations
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    area.riskLevel === 'critical' ? 'destructive' :
                    area.riskLevel === 'high' ? 'destructive' :
                    area.riskLevel === 'medium' ? 'secondary' :
                    'default'
                  }>
                    {area.riskLevel}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {area.trend === 'improving' ? '↗' : area.trend === 'declining' ? '↘' : '→'}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
