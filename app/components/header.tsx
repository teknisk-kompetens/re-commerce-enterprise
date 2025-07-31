
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X, Shield, Users, Brain } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="relative w-12 h-8">
            <Image
              src="https://cdn.abacus.ai/images/6d229b87-5c7f-4b45-9676-c5557063f842.png"
              alt="Mr. RE:commerce"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-xl">CaaS Platform</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Hem
          </Link>
          <Link href="/consciousnesses" className="text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Medvetanden
          </Link>
          <Link href="/security" className="text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Säkerhet
          </Link>
          <Link href="/about" className="text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2">
            <Users className="w-4 h-4" />
            Om Oss
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link href="/demo">Demo</Link>
          </Button>
          <Button asChild>
            <Link href="/contact">Kontakt</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <nav className="container max-w-7xl mx-auto px-4 py-4 space-y-4">
            <Link
              href="/"
              className="block text-foreground/80 hover:text-foreground transition-colors"
              onClick={toggleMenu}
            >
              Hem
            </Link>
            <Link
              href="/consciousnesses"
              className="block text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2"
              onClick={toggleMenu}
            >
              <Brain className="w-4 h-4" />
              Medvetanden
            </Link>
            <Link
              href="/security"
              className="block text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2"
              onClick={toggleMenu}
            >
              <Shield className="w-4 h-4" />
              Säkerhet
            </Link>
            <Link
              href="/about"
              className="block text-foreground/80 hover:text-foreground transition-colors flex items-center gap-2"
              onClick={toggleMenu}
            >
              <Users className="w-4 h-4" />
              Om Oss
            </Link>
            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/demo" onClick={toggleMenu}>Demo</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/contact" onClick={toggleMenu}>Kontakt</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
