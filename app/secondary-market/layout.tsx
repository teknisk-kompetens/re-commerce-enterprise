
import React from 'react';

interface SecondaryMarketLayoutProps {
  children: React.ReactNode;
}

export default function SecondaryMarketLayout({ children }: SecondaryMarketLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Secondary Market Platform
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}

