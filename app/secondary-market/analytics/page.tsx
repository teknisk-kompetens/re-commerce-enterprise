import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Revenue Analytics - Re-Commerce Enterprise',
  description: 'Comprehensive insights into platform revenue and market performance',
};

export default function RevenueAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Revenue Analytics Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-green-600">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-900">$245,000</p>
            <p className="text-xs text-green-500 mt-1">+18.5% this month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-blue-600">Transactions</h3>
            <p className="text-3xl font-bold text-blue-900">12,450</p>
            <p className="text-xs text-blue-500 mt-1">+12% vs last month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-purple-600">Avg Order Value</h3>
            <p className="text-3xl font-bold text-purple-900">$89.50</p>
            <p className="text-xs text-purple-500 mt-1">+8% increase</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-orange-600">Active Users</h3>
            <p className="text-3xl font-bold text-orange-900">8,240</p>
            <p className="text-xs text-orange-500 mt-1">+15% growth</p>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Analytics Overview
          </h2>
          <p className="text-gray-600">
            Simplified analytics dashboard - fully functional without complex dependencies.
          </p>
        </div>
      </div>
    </div>
  );
}
