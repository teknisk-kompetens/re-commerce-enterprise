
'use client';

import React, { useState } from 'react';
import { ResourceAllocationDashboard } from '@/components/multi-tenant/resource-allocation-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function ResourceAllocationPage() {
  const [selectedTenantId, setSelectedTenantId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // In a real app, this would fetch from API
  const sampleTenantId = 'tenant-demo-001';

  const handleTenantSelect = () => {
    if (searchTerm.trim()) {
      setSelectedTenantId(searchTerm.trim());
    } else {
      setSelectedTenantId(sampleTenantId);
    }
  };

  if (!selectedTenantId) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Resource Allocation</h1>
            <p className="text-gray-600 mt-2">
              Monitor and manage resource allocation and utilization
            </p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Select Tenant</CardTitle>
              <CardDescription>
                Enter a tenant ID to view resource allocation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tenantSearch">Tenant ID</Label>
                <div className="flex gap-2">
                  <Input
                    id="tenantSearch"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter tenant ID or use demo"
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
                onClick={() => setSelectedTenantId(sampleTenantId)}
              >
                Use Demo Tenant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      <ResourceAllocationDashboard 
        tenantId={selectedTenantId}
      />
    </div>
  );
}
