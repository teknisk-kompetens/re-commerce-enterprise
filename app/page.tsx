
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GlobalSearch } from '@/components/ui/search';
import { SearchCommandPalette } from '@/components/search-command-palette';
import { 
  Search,
  Zap,
  Brain,
  Shield,
  BarChart3,
  ArrowRight,
  Command,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchShortcut } from '@/hooks/use-search';

const features = [
  {
    icon: Search,
    title: 'Intelligent Sökning',
    description: 'Sök genom alla sidor och funktioner med AI-driven fuzzy search som fungerar från första bokstaven.',
    href: '/search',
    badge: 'NY'
  },
  {
    icon: Brain,
    title: 'AI Studio',
    description: 'Revolutionerande AI-automation och intelligensplattform för företag.',
    href: '/ai-studio',
    badge: 'POPULÄR'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Avancerad dataanalys och visualisering med realtidsinsikter.',
    href: '/analytics',
    badge: 'UPPDATERAD'
  },
  {
    icon: Shield,
    title: 'Security Center',
    description: 'Företagssäkerhet och hotintelligens för fullständigt skydd.',
    href: '/security-center',
    badge: 'KRITISK'
  }
];

export default function HomePage() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  
  // Setup global search shortcut
  useSearchShortcut(() => setIsCommandPaletteOpen(true));

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                <Sparkles className="h-3 w-3 mr-1" />
                Ny förbättrad sökfunktion
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Re-Commerce Enterprise
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Med Intelligent Sökning
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Upptäck vår revolutionära sökmotor som fungerar som Reddit och StackOverflow. 
              Sök genom alla sidor och funktioner från första bokstaven med AI-driven precision.
            </p>

            {/* Search Demo */}
            <div className="max-w-2xl mx-auto mb-8">
              <GlobalSearch 
                placeholder="Prova att söka efter 'dashboard', 'ai', 'security'..." 
                className="w-full"
              />
              <div className="flex items-center justify-center gap-4 mt-4 text-sm text-muted-foreground">
                <span>Eller tryck</span>
                <kbd className="px-2 py-1 bg-muted border rounded text-xs font-mono">
                  ⌘K
                </kbd>
                <span>för kommandopalett</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/search">
                  <Search className="mr-2 h-5 w-5" />
                  Utforska Sökning
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setIsCommandPaletteOpen(true)}
              >
                <Command className="mr-2 h-5 w-5" />
                Kommandopalett
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Kraftfulla Funktioner
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upptäck alla våra avancerade verktyg och funktioner genom vår intelligenta sökmotor
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Link href={feature.href}>
                  <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        {feature.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {feature.badge}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {feature.description}
                      </p>
                      <div className="flex items-center text-primary text-sm font-medium">
                        Utforska
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Search Features Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-0">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">
                    Varför vår sökmotor är revolutionerande
                  </h3>
                  <p className="text-muted-foreground">
                    Byggd med moderna teknologier för optimal användarupplevelse
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900 w-fit mx-auto mb-4">
                      <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="font-semibold mb-2">Snabb & Responsiv</h4>
                    <p className="text-sm text-muted-foreground">
                      Sök från första bokstaven med debounced input och optimerad prestanda
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900 w-fit mx-auto mb-4">
                      <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h4 className="font-semibold mb-2">AI-Driven Fuzzy Search</h4>
                    <p className="text-sm text-muted-foreground">
                      Hitta resultat även med stavfel och partiella matchningar
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900 w-fit mx-auto mb-4">
                      <Search className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h4 className="font-semibold mb-2">Omfattande Index</h4>
                    <p className="text-sm text-muted-foreground">
                      Sök genom alla sidor, funktioner, dokumentation och metadata
                    </p>
                  </div>
                </div>

                <div className="text-center mt-8">
                  <Button asChild>
                    <Link href="/search/analytics">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Se Sökanalys
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </div>

      {/* Command Palette */}
      <SearchCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </>
  );
}
