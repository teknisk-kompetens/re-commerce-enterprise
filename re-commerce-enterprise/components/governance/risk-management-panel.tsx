
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  Eye, 
  Activity,
  Target,
  BarChart3,
  Plus
} from 'lucide-react';

interface RiskDashboard {
  summary: {
    totalRisks: number;
    criticalRisks: number;
    highRisks: number;
    recentEvents: number;
  };
  alerts: string[];
  trends: string[];
  topRisks: {
    id: string;
    name: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;
    owner: string;
  }[];
  indicators: {
    id: string;
    name: string;
    status: 'green' | 'yellow' | 'red';
    currentValue: number;
    targetValue: number;
    trend: 'improving' | 'stable' | 'deteriorating';
  }[];
}

export function RiskManagementPanel() {
  const [dashboard, setDashboard] = useState<RiskDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiskDashboard();
  }, []);

  const fetchRiskDashboard = async () => {
    try {
      const response = await fetch('/api/risk-management?action=dashboard');
      const data = await response.json();
      
      if (data.success) {
        setDashboard(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch risk dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const monitorRisks = async () => {
    try {
      const response = await fetch('/api/risk-management?action=monitor');
      const data = await response.json();
      
      if (data.success) {
        console.log('Risk monitoring results:', data.data);
        // Refresh dashboard after monitoring
        fetchRiskDashboard();
      }
    } catch (error) {
      console.error('Failed to monitor risks:', error);
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
          <h2 className="text-2xl font-bold">Risk Management</h2>
          <p className="text-gray-600">Comprehensive risk assessment, monitoring, and mitigation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={monitorRisks}>
            <Activity className="h-4 w-4 mr-2" />
            Monitor Risks
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Assess Risk
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Risks</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.summary.totalRisks}</div>
            <div className="text-xs text-muted-foreground">
              Active risks
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.summary.criticalRisks}</div>
            <div className="text-xs text-muted-foreground">
              Require immediate attention
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risks</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.summary.highRisks}</div>
            <div className="text-xs text-muted-foreground">
              Need monitoring
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Events</CardTitle>
            <Activity className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.summary.recentEvents}</div>
            <div className="text-xs text-muted-foreground">
              Last 7 days
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Top Risks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboard?.topRisks.map((risk) => (
              <div key={risk.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    risk.riskLevel === 'critical' ? 'bg-red-500' :
                    risk.riskLevel === 'high' ? 'bg-orange-500' :
                    risk.riskLevel === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <div>
                    <div className="font-medium">{risk.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Owner: {risk.owner}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    risk.riskLevel === 'critical' ? 'destructive' :
                    risk.riskLevel === 'high' ? 'destructive' :
                    risk.riskLevel === 'medium' ? 'secondary' :
                    'default'
                  }>
                    {risk.riskLevel}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Score: {risk.riskScore}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Risk Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboard?.indicators.map((indicator) => (
              <div key={indicator.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{indicator.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      indicator.status === 'green' ? 'default' :
                      indicator.status === 'yellow' ? 'secondary' :
                      'destructive'
                    }>
                      {indicator.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {indicator.trend === 'improving' ? '↗' : 
                       indicator.trend === 'deteriorating' ? '↘' : '→'}
                    </div>
                  </div>
                </div>
                <Progress 
                  value={(indicator.currentValue / indicator.targetValue) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {indicator.currentValue}</span>
                  <span>Target: {indicator.targetValue}</span>
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
              <Activity className="h-5 w-5" />
              Risk Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard?.alerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{alert}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Risk Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard?.trends.map((trend, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{trend}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Create Risk Assessment
            </Button>
            <Button variant="outline" className="justify-start">
              <Activity className="h-4 w-4 mr-2" />
              Record Risk Event
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Update Mitigation
            </Button>
            <Button variant="outline" className="justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
