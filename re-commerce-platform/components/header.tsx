
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Logo from '@/components/logo'
import { 
  Menu, 
  X, 
  Users, 
  Layers, 
  Settings, 
  Phone,
  LogIn 
} from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Om Oss', href: '#about', icon: Users },
    { name: 'Plattformar', href: '#platforms', icon: Layers },
    { name: 'Process', href: '#process', icon: Settings },
    { name: 'Kontakt', href: '#contact', icon: Phone },
  ]

  return (
    <header 
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200"
      role="banner"
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Huvudnavigation">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0" aria-label="Hem">
              <Logo className="h-8 w-auto" />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-label={`Gå till ${item.name}`}
                  >
                    <IconComponent className="h-4 w-4" aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button 
              variant="outline" 
              size="sm" 
              className="mr-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
              aria-label="Logga in till plattformen"
            >
              <LogIn className="h-4 w-4 mr-2" aria-hidden="true" />
              Logga in
            </Button>
            <Button 
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              asChild
            >
              <Link href="#contact" aria-label="Anmäl intresse för våra plattformar">
                Anmäl Intresse
              </Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Öppna navigationsmenyn"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigation.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label={`Gå till ${item.name}`}
                  >
                    <IconComponent className="h-4 w-4" aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <div className="pt-4 space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                  aria-label="Logga in till plattformen"
                >
                  <LogIn className="h-4 w-4 mr-2" aria-hidden="true" />
                  Logga in
                </Button>
                <Button 
                  size="sm"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500"
                  asChild
                >
                  <Link href="#contact" onClick={() => setMobileMenuOpen(false)} aria-label="Anmäl intresse för våra plattformar">
                    Anmäl Intresse
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
