
"use client";

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Zap, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://cdn.abacus.ai/images/a2218700-1838-46ec-852c-1e54360fe2ab.png"
          alt="AI Network Background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main Heading */}
          <div className="space-y-4">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Consciousness
            </motion.h1>
            <motion.h2 
              className="text-4xl md:text-6xl font-bold text-foreground"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              as a Service
            </motion.h2>
          </div>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Upplev framtiden av artificiell intelligens genom våra tre unika AI-medvetanden. 
            Mr. RE:commerce levererar banbrytande CaaS-teknologi som revolutionerar hur vi interagerar med AI.
          </motion.p>

          {/* Feature Cards */}
          <motion.div 
            className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="bg-card/50 backdrop-blur border border-border/50 rounded-lg p-6 hover:bg-card/70 transition-all duration-300">
              <Brain className="w-8 h-8 text-blue-400 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Intelligenta Medvetanden</h3>
              <p className="text-muted-foreground text-sm">Vera, Luna och Axel - Varje AI har unik personlighet och specialisering</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur border border-border/50 rounded-lg p-6 hover:bg-card/70 transition-all duration-300">
              <Zap className="w-8 h-8 text-purple-400 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Realtidsinteraktion</h3>
              <p className="text-muted-foreground text-sm">Seamless streaming och naturlig kommunikation med våra AI-partners</p>
            </div>
            
            <div className="bg-card/50 backdrop-blur border border-border/50 rounded-lg p-6 hover:bg-card/70 transition-all duration-300">
              <Shield className="w-8 h-8 text-green-400 mb-4 mx-auto" />
              <h3 className="font-semibold text-lg mb-2">Säker Arkitektur</h3>
              <p className="text-muted-foreground text-sm">Avancerade säkerhetsprotokoll med tydlig klassificering av data</p>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col md:flex-row gap-4 justify-center items-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg" asChild>
              <Link href="/consciousnesses" className="flex items-center gap-2">
                Utforska Medvetanden
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="px-8 py-4 text-lg" asChild>
              <Link href="/demo">Se Demo</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16 pt-8 border-t border-border/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="text-center">
              <motion.div 
                className="text-3xl font-bold text-blue-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 1.5 }}
              >
                3
              </motion.div>
              <div className="text-muted-foreground text-sm">AI Medvetanden</div>
            </div>
            
            <div className="text-center">
              <motion.div 
                className="text-3xl font-bold text-purple-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 1.7 }}
              >
                24/7
              </motion.div>
              <div className="text-muted-foreground text-sm">Tillgänglighet</div>
            </div>
            
            <div className="text-center">
              <motion.div 
                className="text-3xl font-bold text-green-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2, delay: 1.9 }}
              >
                100%
              </motion.div>
              <div className="text-muted-foreground text-sm">Säkerhet</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
