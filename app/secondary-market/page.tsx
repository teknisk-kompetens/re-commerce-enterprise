import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secondary Marketplace - Re-Commerce Enterprise',
  description: 'Trade your digital assets in a secure, transparent secondary marketplace',
};

export default function SecondaryMarketPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Secondary Marketplace
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Ultra-Minimal Dashboard
          </h2>
          <p className="text-gray-600">
            This is a completely simplified page to test if basic functionality works.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium text-gray-800">Revenue</h3>
              <p className="text-2xl font-bold text-green-600">$245,000</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium text-gray-800">Users</h3>
              <p className="text-2xl font-bold text-blue-600">8,240</p>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-medium text-gray-800">Transactions</h3>
              <p className="text-2xl font-bold text-purple-600">12,450</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}