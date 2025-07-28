
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Timer, CheckCircle, Activity } from 'lucide-react';

export function CrossRegionFailoverPanel() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failover Configs</CardTitle>
            <RefreshCw className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Active configurations</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failover Events</CardTitle>
            <Activity className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Total events</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RTO</CardTitle>
            <Timer className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52s</div>
            <p className="text-xs text-muted-foreground">Recovery time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RPO</CardTitle>
            <CheckCircle className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18s</div>
            <p className="text-xs text-muted-foreground">Recovery point</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Failover Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <RefreshCw className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">Production Failover</div>
                  <div className="text-sm text-gray-500">us-east-1 → us-west-2</div>
                </div>
              </div>
              <Badge variant="default">Ready</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <RefreshCw className="w-5 h-5 text-gray-500" />
                <div>
                  <div className="font-medium">Database Failover</div>
                  <div className="text-sm text-gray-500">Multi-master setup</div>
                </div>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">52s</div>
                <div className="text-xs text-muted-foreground">Avg RTO</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">18s</div>
                <div className="text-xs text-muted-foreground">Avg RPO</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
