
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  Users, 
  Shield, 
  AlertTriangle, 
  Heart, 
  BookOpen,
  Phone,
  FileText,
  TrendingUp,
  Plus,
  Search
} from 'lucide-react';

interface EthicsDashboard {
  summary: {
    activeViolations: number;
    pendingReports: number;
    trainingCompletion: number;
    ethicalClimate: number;
  };
  recentViolations: {
    id: string;
    title: string;
    category: string;
    severity: string;
    reportedAt: string;
    status: string;
  }[];
  upcomingTraining: {
    id: string;
    title: string;
    type: string;
    targetAudience: string[];
    completionRate: number;
  }[];
  alerts: string[];
  trends: {
    violations: string;
    reporting: string;
    training: string;
    culture: string;
  };
}

export function EthicsConductPanel() {
  const [dashboard, setDashboard] = useState<EthicsDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEthicsDashboard();
  }, []);

  const fetchEthicsDashboard = async () => {
    try {
      const response = await fetch('/api/ethics-conduct?action=dashboard');
      const data = await response.json();
      
      if (data.success) {
        setDashboard(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch ethics dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateEthicsReport = async () => {
    try {
      const response = await fetch('/api/ethics-conduct?action=report');
      const data = await response.json();
      
      if (data.success) {
        console.log('Ethics report generated:', data.data);
        // Handle report display or download
      }
    } catch (error) {
      console.error('Failed to generate ethics report:', error);
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
          <h2 className="text-2xl font-bold">Ethics & Conduct</h2>
          <p className="text-gray-600">Code of conduct enforcement, ethics training, and compliance monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={generateEthicsReport}>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Report Violation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Violations</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.summary.activeViolations}</div>
            <div className="text-xs text-muted-foreground">
              Require attention
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.summary.pendingReports}</div>
            <div className="text-xs text-muted-foreground">
              Under investigation
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Completion</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.summary.trainingCompletion}%</div>
            <Progress value={dashboard?.summary.trainingCompletion} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ethical Climate</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboard?.summary.ethicalClimate}%</div>
            <div className="text-xs text-muted-foreground">
              Culture score
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Recent Violations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard?.recentViolations.map((violation) => (
              <div key={violation.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    violation.severity === 'severe' ? 'bg-red-500' :
                    violation.severity === 'major' ? 'bg-orange-500' :
                    violation.severity === 'moderate' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`} />
                  <div>
                    <div className="font-medium">{violation.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {violation.category}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={
                    violation.status === 'resolved' ? 'default' :
                    violation.status === 'investigating' ? 'secondary' :
                    'destructive'
                  }>
                    {violation.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {new Date(violation.reportedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Training Programs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboard?.upcomingTraining.map((training) => (
              <div key={training.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{training.title}</span>
                  <Badge variant={
                    training.type === 'mandatory' ? 'destructive' :
                    training.type === 'recommended' ? 'secondary' :
                    'default'
                  }>
                    {training.type}
                  </Badge>
                </div>
                <Progress value={training.completionRate} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Completion: {training.completionRate}%</span>
                  <span>Target: {training.targetAudience.join(', ')}</span>
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
              <Shield className="h-5 w-5" />
              Ethical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard?.alerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{alert}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Trends Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Violations Trend</span>
              <Badge variant={
                dashboard?.trends.violations === 'improving' ? 'default' :
                dashboard?.trends.violations === 'declining' ? 'destructive' :
                'secondary'
              }>
                {dashboard?.trends.violations}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Reporting Trend</span>
              <Badge variant={
                dashboard?.trends.reporting === 'improving' ? 'default' :
                dashboard?.trends.reporting === 'declining' ? 'destructive' :
                'secondary'
              }>
                {dashboard?.trends.reporting}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Training Trend</span>
              <Badge variant={
                dashboard?.trends.training === 'improving' ? 'default' :
                dashboard?.trends.training === 'declining' ? 'destructive' :
                'secondary'
              }>
                {dashboard?.trends.training}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Culture Trend</span>
              <Badge variant={
                dashboard?.trends.culture === 'improving' ? 'default' :
                dashboard?.trends.culture === 'declining' ? 'destructive' :
                'secondary'
              }>
                {dashboard?.trends.culture}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Reporting Channels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start">
              <Phone className="h-4 w-4 mr-2" />
              Ethics Hotline
            </Button>
            <Button variant="outline" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Online Form
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manager Report
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Anonymous Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Ethics Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Code of Conduct</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Comprehensive guide to ethical behavior and company values
              </p>
              <Button variant="outline" size="sm">
                <BookOpen className="h-3 w-3 mr-1" />
                View Guide
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Training Materials</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Interactive training modules and certification programs
              </p>
              <Button variant="outline" size="sm">
                <BookOpen className="h-3 w-3 mr-1" />
                Start Training
              </Button>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Reporting Guide</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Step-by-step guide for reporting ethical concerns
              </p>
              <Button variant="outline" size="sm">
                <Shield className="h-3 w-3 mr-1" />
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
