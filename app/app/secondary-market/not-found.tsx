
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Store, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SecondaryMarketNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The secondary marketplace page you're looking for doesn't exist or 
            has been moved to a different location.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Store className="h-4 w-4" />
              <span className="font-medium">Available Marketplace Sections:</span>
            </div>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Browse Digital Assets</li>
              <li>• Creator Dashboard</li>
              <li>• Transaction Management</li>
              <li>• Revenue Analytics</li>
              <li>• Platform Economics</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/secondary-market">
              <Button className="flex items-center gap-2 w-full sm:w-auto">
                <Store className="h-4 w-4" />
                Go to Marketplace
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-sm text-gray-500"
        >
          <p>
            Need help finding what you're looking for?{' '}
            <Link href="/support" className="text-blue-600 hover:underline">
              Contact support
            </Link>
            {' '}for assistance.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

