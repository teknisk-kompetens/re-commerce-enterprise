
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Globe, Server, Activity, TrendingUp, Users, Cloud } from 'lucide-react';

interface Deployment {
  id: string;
  name: string;
  status: string;
  region: string;
  services: number;
}

export function GlobalDeploymentPanel() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demo
    setDeployments([
      { id: 'dep-001', name: 'Production US-East', status: 'active', region: 'us-east-1', services: 15 },
      { id: 'dep-002', name: 'Production EU-West', status: 'active', region: 'eu-west-1', services: 12 },
      { id: 'dep-003', name: 'Production AP-South', status: 'deploying', region: 'ap-south-1', services: 8 }
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deployments</CardTitle>
            <Globe className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">Across 12 regions</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CDN Configurations</CardTitle>
            <Cloud className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Global distribution</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tenants</CardTitle>
            <Users className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Multi-tenant architecture</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Deployments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {deployments.map((deployment) => (
              <div key={deployment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Server className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium">{deployment.name}</div>
                    <div className="text-sm text-gray-500">{deployment.region}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={deployment.status === 'active' ? 'default' : 'secondary'}>
                    {deployment.status}
                  </Badge>
                  <span className="text-sm text-gray-500">{deployment.services} services</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
