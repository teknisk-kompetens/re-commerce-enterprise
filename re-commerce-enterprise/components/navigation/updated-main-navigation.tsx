
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

interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: Date;
  read: boolean;
}

export function UpdatedMainNavigation() {
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
    { id: '6', title: 'Integration Hub', href: '/integrations-hub', type: 'page' as const, description: 'API management and integrations' }
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
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="navbar navbar-expand-lg navbar-light bg-white/95 backdrop-blur-xl sticky-top shadow-lg border-bottom-0"
      style={{ zIndex: 1040 }}
    >
      <div className="container-fluid">
        {/* Brand */}
        <div className="d-flex align-items-center">
          {/* Logo */}
          <Link href="/dashboard" className="navbar-brand d-flex align-items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="position-relative me-3"
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <span className="text-white fw-bold">RC</span>
              </div>
              <div className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle" style={{ width: '12px', height: '12px' }}></div>
            </motion.div>
            <div className="d-none d-sm-block">
              <h4 className="mb-0 fw-bold text-dark">Re-Commerce Enterprise</h4>
              <small className="text-muted">Cinematic Scene Experience</small>
            </div>
          </Link>
          
          {/* Tenant Selector */}
          <div className="dropdown ms-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-light dropdown-toggle d-flex align-items-center border shadow-sm"
              type="button"
              id="tenantDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <Building2 className="h-4 w-4 me-2 text-blue-500" />
              <span className="d-none d-md-inline fw-medium">{currentTenant}</span>
            </motion.button>
            <ul className="dropdown-menu shadow-lg border-0" aria-labelledby="tenantDropdown">
              <li className="px-3 py-2">
                <div className="fw-medium">Current Organization</div>
                <small className="text-muted">{currentTenant}</small>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <Building2 className="h-4 w-4 me-2" />
                  Switch Organization
                </a>
              </li>
              <li>
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <Settings className="h-4 w-4 me-2" />
                  Organization Settings
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="flex-grow-1 mx-4" style={{ maxWidth: '600px' }}>
          <div className="position-relative">
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              className="form-control form-control-lg shadow-sm border-0 bg-gray-50"
              placeholder="Search enterprise features, settings, or documentation..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              style={{ 
                paddingLeft: '50px', 
                paddingRight: '80px',
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
              }}
            />
            <Search className="position-absolute text-muted" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px' }} />
            <div className="position-absolute d-flex align-items-center" style={{ right: '16px', top: '50%', transform: 'translateY(-50%)' }}>
              <kbd className="bg-white border rounded px-2 py-1 shadow-sm" style={{ fontSize: '11px' }}>
                <Command className="h-3 w-3 me-1" />⌘K
              </kbd>
            </div>
            
            {/* Enhanced Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="position-absolute w-100 mt-2 bg-white border-0 rounded-3 shadow-lg"
                style={{ zIndex: 1050 }}
              >
                <div className="p-3">
                  <small className="text-muted d-block px-3 mb-3 fw-medium">Search Results</small>
                  {searchResults.map((result) => (
                    <Link key={result.id} href={result.href} className="text-decoration-none">
                      <motion.div
                        whileHover={{ scale: 1.02, backgroundColor: '#f8f9fa' }}
                        className="d-flex align-items-center p-3 rounded-2 mb-2"
                      >
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
                        <span className="badge bg-light text-dark">{result.type}</span>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="d-flex align-items-center">
          {/* Notifications */}
          <div className="dropdown me-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-light position-relative border shadow-sm"
              type="button"
              id="notificationsDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ borderRadius: '50%', width: '44px', height: '44px' }}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow">
                  {unreadCount}
                </span>
              )}
            </motion.button>
            <div className="dropdown-menu dropdown-menu-end shadow-lg border-0" aria-labelledby="notificationsDropdown" style={{ width: '360px' }}>
              <div className="px-3 py-3 border-bottom bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold">Notifications</h6>
                  <span className="badge bg-primary">{unreadCount} new</span>
                </div>
              </div>
              <div className="p-2">
                {notifications.slice(0, 3).map((notification) => (
                  <motion.div
                    key={notification.id}
                    whileHover={{ backgroundColor: '#f8f9fa' }}
                    className={`p-3 rounded mb-2 ${
                      notification.read ? 'bg-light' : 'bg-primary bg-opacity-10'
                    }`}
                  >
                    <div className="d-flex align-items-start">
                      <span className="me-2 fs-5">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-grow-1">
                        <div className="fw-medium">{notification.title}</div>
                        <small className="text-muted d-block">{notification.description}</small>
                        <small className="text-muted">{notification.timestamp.toLocaleTimeString()}</small>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <button className="btn btn-primary w-100 mt-2 rounded-pill">View All Notifications</button>
              </div>
            </div>
          </div>

          {/* Theme Toggle */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-light me-3 border shadow-sm" 
            type="button"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            style={{ borderRadius: '50%', width: '44px', height: '44px' }}
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </motion.button>

          {/* Settings */}
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-light me-3 border shadow-sm" 
            type="button"
            style={{ borderRadius: '50%', width: '44px', height: '44px' }}
          >
            <Settings className="h-4 w-4" />
          </motion.button>

          {/* User Menu */}
          <div className="dropdown">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-light dropdown-toggle d-flex align-items-center border shadow-sm"
              type="button"
              id="userDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ borderRadius: '25px', padding: '8px 16px' }}
            >
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
                <span className="text-white fw-medium small">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="d-none d-lg-block text-start">
                <div className="fw-medium">{user.name}</div>
                <small className="text-muted">{user.role}</small>
              </div>
            </motion.button>
            <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0" aria-labelledby="userDropdown" style={{ width: '280px' }}>
              <li className="px-3 py-3 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="fw-medium">{user.name}</div>
                <small className="text-muted d-block">{user.email}</small>
                <span className="badge bg-primary mt-2">{user.role}</span>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <User className="h-4 w-4 me-2" />
                  Profile Settings
                </a>
              </li>
              <li>
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <Clock className="h-4 w-4 me-2" />
                  Recent Activity
                </a>
              </li>
              <li>
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <HelpCircle className="h-4 w-4 me-2" />
                  Help & Support
                </a>
              </li>
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a className="dropdown-item text-danger d-flex align-items-center" href="#">
                  <LogOut className="h-4 w-4 me-2" />
                  Sign Out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
