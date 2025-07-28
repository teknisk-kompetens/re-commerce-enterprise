
'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Store,
  Award,
  CreditCard,
  BarChart3,
  Building,
  ChevronRight,
  Home,
  ArrowLeft,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SecondaryMarketLayoutProps {
  children: React.ReactNode;
}

export default function SecondaryMarketLayout({ children }: SecondaryMarketLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Marketplace',
      href: '/secondary-market',
      icon: Store,
      description: 'Browse and trade digital assets',
      roles: ['user', 'creator', 'admin'],
    },
    {
      name: 'Creator Dashboard',
      href: '/secondary-market/creator-dashboard',
      icon: Award,
      description: 'Manage monetization and subscriptions',
      roles: ['creator', 'admin'],
    },
    {
      name: 'Transactions',
      href: '/secondary-market/transactions',
      icon: CreditCard,
      description: 'Monitor transactions and escrow',
      roles: ['user', 'creator', 'admin'],
    },
    {
      name: 'Analytics',
      href: '/secondary-market/analytics',
      icon: BarChart3,
      description: 'Revenue and market analytics',
      roles: ['creator', 'admin', 'analyst'],
    },
    {
      name: 'Platform Economics',
      href: '/secondary-market/platform-economics',
      icon: Building,
      description: 'Platform health monitoring',
      roles: ['admin'],
    },
  ];

  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(session?.user?.role || 'user')
  );

  const currentPage = navigation.find(item => item.href === pathname);

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { name: 'Home', href: '/', icon: Home },
      { name: 'Secondary Market', href: '/secondary-market', icon: Store },
    ];

    if (currentPage && currentPage.href !== '/secondary-market') {
      breadcrumbs.push({
        name: currentPage.name,
        href: currentPage.href,
        icon: currentPage.icon,
      });
    }

    return breadcrumbs;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-2 text-sm">
              {getBreadcrumbs().map((item, index) => (
                <React.Fragment key={item.href}>
                  {index > 0 && (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 hover:text-blue-600 transition-colors ${
                      pathname === item.href
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-600'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                </React.Fragment>
              ))}
            </nav>

            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Main App
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      {pathname === '/secondary-market' && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Secondary Marketplace
              </h1>
              <p className="text-gray-600">
                Trade your digital assets in a secure, transparent marketplace
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredNavigation.slice(1).map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={item.href}>
                    <div className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all duration-200 group cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <item.icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </h3>
                          {item.roles.includes('admin') && (
                            <Badge variant="outline" className="text-xs">
                              Admin Only
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}

