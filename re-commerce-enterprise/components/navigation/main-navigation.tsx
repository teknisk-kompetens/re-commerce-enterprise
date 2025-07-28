
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  ChevronDown,
  Menu,
  X,
  Shield,
  Globe,
  Command,
  Star,
  Clock,
  HelpCircle,
  LogOut,
  Building2,
  Crown,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Bootstrap imports will be handled via CSS

interface NavigationProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  description: string;
}

export function MainNavigation({ sidebarOpen, setSidebarOpen }: NavigationProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    title: string;
    href: string;
    type: 'page' | 'feature' | 'document';
    description: string;
  }>>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentTenant, setCurrentTenant] = useState('Acme Corporation');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [user, setUser] = useState({
    name: 'John Anderson',
    email: 'john.anderson@acme.com',
    role: 'Enterprise Admin',
    avatar: null
  });

  // Mock notifications
  useEffect(() => {
    setNotifications([
      {
        id: '1',
        title: 'System Health Alert',
        description: 'All systems operating normally',
        type: 'success',
        timestamp: new Date(Date.now() - 300000),
        read: false
      },
      {
        id: '2',
        title: 'Security Update',
        description: 'New security patches available',
        type: 'warning',
        timestamp: new Date(Date.now() - 900000),
        read: false
      },
      {
        id: '3',
        title: 'Performance Optimization',
        description: 'System performance improved by 15%',
        type: 'info',
        timestamp: new Date(Date.now() - 1800000),
        read: true
      }
    ]);
  }, []);

  // Mock search data
  const searchData = [
    { id: '1', title: 'Dashboard', href: '/dashboard', type: 'page' as const, description: 'Executive overview and key metrics' },
    { id: '2', title: 'Analytics', href: '/analytics', type: 'page' as const, description: 'Business intelligence and reporting' },
    { id: '3', title: 'Security Center', href: '/security-center', type: 'page' as const, description: 'Comprehensive security monitoring' },
    { id: '4', title: 'AI Command Center', href: '/ai-command-center', type: 'page' as const, description: 'AI-powered insights and automation' },
    { id: '5', title: 'Performance Center', href: '/performance-center', type: 'page' as const, description: 'System optimization and monitoring' },
    { id: '6', title: 'Integration Hub', href: '/integrations-hub', type: 'page' as const, description: 'API management and integrations' },
    { id: '7', title: 'Sales Deck', href: '/sales-deck', type: 'page' as const, description: 'Interactive sales presentations' },
    { id: '8', title: 'Demo Scenarios', href: '/demo-scenarios', type: 'page' as const, description: 'Industry-specific demo environments' },
    { id: '9', title: 'Pricing Calculator', href: '/pricing-calculator', type: 'page' as const, description: 'ROI and pricing tools' },
    { id: '10', title: 'Presentation Builder', href: '/presentation-builder', type: 'page' as const, description: 'Custom presentation creator' },
    { id: '11', title: 'Sales Enablement', href: '/sales-enablement', type: 'page' as const, description: 'Sales team dashboard and analytics' },
    { id: '12', title: 'Customer Success', href: '/customer-success', type: 'page' as const, description: 'Onboarding and support center' }
  ];

  // Enhanced search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Theme toggle functionality
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Apply theme to document
    if (typeof window !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('theme', newTheme);
    }
  };

  // Initialize theme from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme === 'dark') {
          document.documentElement.setAttribute('data-bs-theme', 'dark');
          document.documentElement.classList.add('dark');
        }
      }
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm border-bottom">
      <div className="container-fluid">
        {/* Brand and Sidebar Toggle */}
        <div className="d-flex align-items-center">
          {/* Mobile Sidebar Toggle */}
          <button
            className="btn btn-outline-secondary d-lg-none me-3"
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          
          {/* Logo */}
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <div className="position-relative me-3">
              <div className="bg-primary rounded-2 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                <span className="text-white fw-bold small">RC</span>
              </div>
              <div className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle" style={{ width: '12px', height: '12px' }}></div>
            </div>
            <div className="d-none d-sm-block">
              <h5 className="mb-0 fw-bold text-dark">Re-Commerce Enterprise</h5>
              <small className="text-muted">Day 5 Complete Platform</small>
            </div>
          </Link>
          
          {/* Tenant Selector */}
          <div className="dropdown ms-3">
            <button
              className="btn btn-light dropdown-toggle d-flex align-items-center"
              type="button"
              id="tenantDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Building2 className="h-4 w-4 me-2" />
              <span className="d-none d-md-inline">{currentTenant}</span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="tenantDropdown">
              <li className="px-3 py-2">
                <div className="fw-medium">Current Organization</div>
                <small className="text-muted">{currentTenant}</small>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a className="dropdown-item" href="#">
                  <Building2 className="h-4 w-4 me-2" />
                  Switch Organization
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <Settings className="h-4 w-4 me-2" />
                  Organization Settings
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-grow-1 mx-4" style={{ maxWidth: '500px' }}>
          <div className="position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Search features, settings, or documentation..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              style={{ paddingLeft: '40px', paddingRight: '60px' }}
            />
            <Search className="position-absolute text-muted" style={{ left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px' }} />
            <div className="position-absolute d-flex align-items-center" style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
              <kbd className="bg-light border rounded px-2 py-1" style={{ fontSize: '12px' }}>
                <Command className="h-3 w-3 me-1" />K
              </kbd>
            </div>
            
            {/* Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="position-absolute w-100 mt-2 bg-white border rounded shadow-lg" style={{ zIndex: 1050 }}>
                <div className="p-2">
                  <small className="text-muted d-block px-2 mb-2">Search Results</small>
                  {searchResults.map((result) => (
                    <Link key={result.id} href={result.href} className="text-decoration-none">
                      <div className="d-flex align-items-center p-2 rounded hover-bg-light">
                        <div className="me-3">
                          {result.type === 'page' ? (
                            <Globe className="h-4 w-4 text-primary" />
                          ) : result.type === 'feature' ? (
                            <Star className="h-4 w-4 text-success" />
                          ) : (
                            <HelpCircle className="h-4 w-4 text-muted" />
                          )}
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-medium">{result.title}</div>
                          <small className="text-muted">{result.description}</small>
                        </div>
                        <span className="badge bg-secondary">{result.type}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="d-flex align-items-center">
          {/* Notifications */}
          <div className="dropdown me-2">
            <button
              className="btn btn-light position-relative"
              type="button"
              id="notificationsDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="notificationsDropdown" style={{ width: '320px' }}>
              <div className="px-3 py-2 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Notifications</h6>
                  <span className="badge bg-secondary">{unreadCount} new</span>
                </div>
              </div>
              <div className="p-2">
                {notifications.slice(0, 3).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-2 rounded mb-2 ${
                      notification.read ? 'bg-light' : 'bg-primary bg-opacity-10'
                    }`}
                  >
                    <div className="d-flex align-items-start">
                      <span className="me-2">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-grow-1">
                        <div className="fw-medium">{notification.title}</div>
                        <small className="text-muted d-block">{notification.description}</small>
                        <small className="text-muted">{notification.timestamp.toLocaleTimeString()}</small>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="btn btn-outline-primary w-100 mt-2">View All Notifications</button>
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <button 
            className="btn btn-light me-2" 
            type="button"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          {/* Settings */}
          <button className="btn btn-light me-2" type="button">
            <Settings className="h-4 w-4" />
          </button>

          {/* User Menu */}
          <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle d-flex align-items-center"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                <span className="text-white fw-medium small">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="d-none d-lg-block text-start">
                <div className="fw-medium">{user.name}</div>
                <small className="text-muted">{user.role}</small>
              </div>
            </button>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown" style={{ width: '250px' }}>
              <li className="px-3 py-2">
                <div className="fw-medium">{user.name}</div>
                <small className="text-muted d-block">{user.email}</small>
                <span className="badge bg-secondary mt-1">{user.role}</span>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a className="dropdown-item" href="#">
                  <User className="h-4 w-4 me-2" />
                  Profile Settings
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <Clock className="h-4 w-4 me-2" />
                  Recent Activity
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <HelpCircle className="h-4 w-4 me-2" />
                  Help & Support
                </a>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a className="dropdown-item text-danger" href="#">
                  <LogOut className="h-4 w-4 me-2" />
                  Sign Out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
