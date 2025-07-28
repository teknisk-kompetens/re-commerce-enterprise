
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserMenu } from '@/components/dashboard/user-menu'
import { ThemeToggle } from '@/components/dashboard/theme-toggle'
import { useTenant } from '@/lib/tenant-context'
import { 
  Search, 
  Settings, 
  Menu,
  BarChart3,
  Users,
  FolderOpen,
  Workflow,
  Home
} from 'lucide-react'
import Link from 'next/link'

export function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { tenant } = useTenant()

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Tasks', href: '/dashboard/tasks', icon: BarChart3 },
    { name: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Workflows', href: '/dashboard/workflows', icon: Workflow },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Tenant Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EP</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {tenant?.name || 'Enterprise Platform'}
                </h1>
                {tenant && (
                  <Badge variant="secondary" className="text-xs">
                    {tenant.plan?.toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>

            {/* Notifications - Disabled to prevent errors */}
            {/* <NotificationDropdown /> */}

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Menu */}
            <UserMenu />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 py-2">
            <nav className="flex flex-col space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
