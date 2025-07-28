
'use client';

import React from 'react';

interface MinimalDashboardProps {
  title: string;
  userId?: string;
  userRole?: string;
  tenantId?: string;
}

export default function MinimalDashboard({ 
  title,
  userId, 
  userRole, 
  tenantId 
}: MinimalDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {title}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Revenue</h3>
            <p className="text-2xl font-bold text-green-600">$245,000</p>
            <p className="text-sm text-gray-500 mt-1">+18% this month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Users</h3>
            <p className="text-2xl font-bold text-blue-600">8,240</p>
            <p className="text-sm text-gray-500 mt-1">+12% growth</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Transactions</h3>
            <p className="text-2xl font-bold text-purple-600">12,450</p>
            <p className="text-sm text-gray-500 mt-1">+15% increase</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dashboard Content</h2>
          <p className="text-gray-600 mb-4">
            This is a simplified dashboard component designed to work reliably in all environments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-800">User Info</h4>
              <p className="text-sm text-gray-600">User ID: {userId || 'N/A'}</p>
              <p className="text-sm text-gray-600">Role: {userRole || 'N/A'}</p>
              <p className="text-sm text-gray-600">Tenant: {tenantId || 'N/A'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h4 className="font-medium text-gray-800">Quick Actions</h4>
              <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2 mb-2">
                View Reports
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded mr-2 mb-2">
                Export Data
              </button>
              <button className="bg-purple-500 text-white px-4 py-2 rounded mr-2 mb-2">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
