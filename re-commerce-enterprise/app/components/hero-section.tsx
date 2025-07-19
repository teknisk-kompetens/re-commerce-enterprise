
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import AnimatedCounter from './animated-counter';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-400/8 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Pre-title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center space-x-2 glass-card px-6 py-3 rounded-full"
          >
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Från Digitala Arkitekter till Ekosystem-Innovatörer</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-hero font-bold max-w-4xl mx-auto"
          >
            <span className="block">re:Commerce Enterprise</span>
            <span className="gradient-text">Ecosystem</span>
            <span className="block">4 Kraftfulla System</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Complete enterprise ecosystem with BankID integration, multi-tenant architecture, and GDPR compliance. 
            Dominera svenska marknaden med 4 integrerade system för totala affärslösningar.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto my-12"
          >
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                <AnimatedCounter end={4} suffix="" />
              </div>
              <div className="text-gray-400">Integrerade System</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                <AnimatedCounter end={54} suffix="" />
              </div>
              <div className="text-gray-400">MD Dokumentation</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold gradient-text mb-2">
                <AnimatedCounter end={100} suffix="%" />
              </div>
              <div className="text-gray-400">Svenska Marknaden</div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Button size="lg" className="btn-primary group">
              Explore Ecosystem
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="btn-glass group">
              <Play className="mr-2 w-5 h-5" />
              System Demo
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="pt-12"
          >
            <p className="text-sm text-gray-500 mb-6">Trusted by industry leaders & backed by</p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              <div className="glass-card px-6 py-3 rounded-lg">
                <span className="font-semibold text-lg">ALMI</span>
              </div>
              <div className="glass-card px-6 py-3 rounded-lg">
                <span className="font-semibold text-lg">BIZMAKER</span>
              </div>
              <div className="glass-card px-6 py-3 rounded-lg">
                <span className="font-semibold text-lg">Swedish Innovation</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-blue-500 rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
