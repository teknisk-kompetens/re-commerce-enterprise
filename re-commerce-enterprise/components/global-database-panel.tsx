
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Activity, Zap, CheckCircle } from 'lucide-react';

export function GlobalDatabasePanel() {
  const clusters = [
    { id: 'cluster-001', name: 'Primary Cluster', status: 'healthy', replicas: 3, syncLag: '15ms' },
    { id: 'cluster-002', name: 'Analytics Cluster', status: 'healthy', replicas: 2, syncLag: '25ms' },
    { id: 'cluster-003', name: 'Cache Cluster', status: 'syncing', replicas: 4, syncLag: '45ms' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Clusters</CardTitle>
            <Database className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">Active clusters</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Replication Status</CardTitle>
            <Activity className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">Healthy replications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sync Lag</CardTitle>
            <Zap className="w-4 h-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25ms</div>
            <p className="text-xs text-muted-foreground">Cross-region sync</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <CheckCircle className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.4K</div>
            <p className="text-xs text-muted-foreground">Operations/sec</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Database Clusters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clusters.map((cluster) => (
              <div key={cluster.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Database className="w-5 h-5 text-gray-500" />
                  <div>
                    <div className="font-medium">{cluster.name}</div>
                    <div className="text-sm text-gray-500">{cluster.replicas} replicas</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={cluster.status === 'healthy' ? 'default' : 'secondary'}>
                    {cluster.status}
                  </Badge>
                  <span className="text-sm text-gray-500">{cluster.syncLag} lag</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
