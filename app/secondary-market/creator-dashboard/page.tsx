import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Dashboard - Re-Commerce Enterprise',
  description: 'Manage your monetization, subscribers, and creator profile',
};

export default function CreatorDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Creator Dashboard
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Monetization Overview
          </h2>
          <p className="text-gray-600 mb-6">
            Ultra-minimal creator dashboard for testing purposes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium text-gray-800">Monthly Revenue</h3>
              <p className="text-2xl font-bold text-green-600">$8,450</p>
              <p className="text-sm text-gray-500 mt-1">+22% growth</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium text-gray-800">Subscribers</h3>
              <p className="text-2xl font-bold text-blue-600">1,240</p>
              <p className="text-sm text-gray-500 mt-1">+15% this month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
