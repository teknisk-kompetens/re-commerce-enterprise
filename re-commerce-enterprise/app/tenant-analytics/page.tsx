
'use client';

import React, { useState } from 'react';
import { TenantAnalyticsDashboard } from '@/components/multi-tenant/tenant-analytics-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, BarChart3 } from 'lucide-react';

export default function TenantAnalyticsPage() {
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'tenant' | 'system'>('system');

  // In a real app, this would fetch from API
  const sampleTenantId = 'tenant-demo-001';

  const handleTenantSelect = () => {
    if (searchTerm.trim()) {
      setSelectedTenantId(searchTerm.trim());
      setViewMode('tenant');
    } else {
      setSelectedTenantId(sampleTenantId);
      setViewMode('tenant');
    }
  };

  const handleSystemView = () => {
    setSelectedTenantId('');
    setViewMode('system');
  };

  if (viewMode === 'system' || !selectedTenantId) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">System Analytics</h1>
              <p className="text-gray-600 mt-2">
                System-wide analytics and tenant overview
              </p>
            </div>
            
            <Card className="w-80">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tenantSearch">Switch to Tenant View</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tenantSearch"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter tenant ID"
                        className="flex-1"
                      />
                      <Button onClick={handleTenantSelect}>
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSelectedTenantId(sampleTenantId);
                      setViewMode('tenant');
                    }}
                  >
                    Demo Tenant Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <TenantAnalyticsDashboard />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tenant Analytics</h1>
            <p className="text-gray-600 mt-2">
              Detailed analytics for tenant: {selectedTenantId}
            </p>
          </div>
          
          <Button variant="outline" onClick={handleSystemView}>
            <BarChart3 className="h-4 w-4 mr-2" />
            System View
          </Button>
        </div>

        <TenantAnalyticsDashboard tenantId={selectedTenantId} />
      </div>
    </div>
  );
}
