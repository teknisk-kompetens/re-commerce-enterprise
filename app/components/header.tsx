
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Menu, 
  X, 
  Brain, 
  BarChart3, 
  Users, 
  Settings,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigation = [
    { name: 'Search', href: '/', icon: Search },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'AI Assistants', href: '/consciousnesses', icon: Brain },
    { name: 'Community', href: '/community', icon: Users },
    { name: 'Enterprise', href: '/enterprise', icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative w-10 h-10 rounded overflow-hidden">
              <Image
                src="https://cdn.abacus.ai/images/a2218700-1838-46ec-852c-1e54360fe2ab.png"
                alt="Mr. RE:commerce Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Mr. RE:commerce
              </div>
              <div className="text-xs text-muted-foreground -mt-1">
                Intelligent Search Platform
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Button key={item.name} variant="ghost" asChild className="gap-2">
                  <Link href={item.href}>
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex gap-2">
              <Link href="/auth/login">
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            </Button>
            <Button size="sm" asChild className="gap-2">
              <Link href="/auth/signup">
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Up</span>
              </Link>
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t py-4"
          >
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    asChild
                    className="justify-start gap-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href={item.href}>
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
              
              {/* Mobile Auth */}
              <div className="border-t pt-2 mt-2">
                <Button variant="ghost" asChild className="justify-start gap-3 w-full">
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
}
