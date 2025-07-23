
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Users,
  Zap,
  RefreshCw,
  Mail
} from 'lucide-react'
import Link from 'next/link'

export default function HeroSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [countClients, setCountClients] = useState(0)
  const [countProjects, setCountProjects] = useState(0)
  const [countExperience, setCountExperience] = useState(0)

  useEffect(() => {
    if (inView) {
      // Animated counters
      const animateValue = (start: number, end: number, duration: number, setValue: (value: number) => void) => {
        let startTimestamp: number | null = null
        const step = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp
          const progress = Math.min((timestamp - startTimestamp) / duration, 1)
          setValue(Math.floor(progress * (end - start) + start))
          if (progress < 1) {
            window.requestAnimationFrame(step)
          }
        }
        window.requestAnimationFrame(step)
      }

      setTimeout(() => animateValue(0, 250, 2000, setCountClients), 500)
      setTimeout(() => animateValue(0, 500, 2000, setCountProjects), 700)
      setTimeout(() => animateValue(0, 15, 2000, setCountExperience), 900)
    }
  }, [inView])

  return (
    <section 
      className="relative bg-gradient-to-br from-gray-50 to-blue-50 py-16 sm:py-24 lg:py-32"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* re:commerce Explanation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200">
              <Mail className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-700">
                <strong className="text-blue-600">re:</strong> som email-prefix • 
                <strong className="text-blue-600 ml-1">re</strong>design • 
                <strong className="text-blue-600 ml-1">re</strong>build
              </span>
              <RefreshCw className="h-4 w-4 text-blue-600" aria-hidden="true" />
            </div>
          </motion.div>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
          >
            Från Digitala Arkitekter till{' '}
            <span className="text-blue-600">Plattformsinnovatörer</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600"
          >
            Vi bygger intelligenta Enterprise SaaS-plattformar som systematiskt eliminerar 
            digitalt brus och förvandlar det till mätbar vinst. Med 15+ års precision inom 
            teknisk SEO och AI-automation skapar vi fundament som inte bara fungerar—de dominerar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              asChild
            >
              <Link href="#platforms" aria-label="Utforska våra Enterprise-plattformar">
                <Sparkles className="mr-2 h-5 w-5" aria-hidden="true" />
                Utforska Plattformar
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              asChild
            >
              <Link href="#contact" aria-label="Anmäl ditt intresse för våra lösningar">
                Anmäl Intresse
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="text-3xl font-bold text-gray-900" aria-live="polite">
                {countClients}+
              </div>
              <div className="text-sm text-gray-600">Nöjda Enterprise-kunder</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="text-3xl font-bold text-gray-900" aria-live="polite">
                {countProjects}+
              </div>
              <div className="text-sm text-gray-600">Framgångsrika projekt</div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-6 w-6 text-blue-600" aria-hidden="true" />
              </div>
              <div className="text-3xl font-bold text-gray-900" aria-live="polite">
                {countExperience}+
              </div>
              <div className="text-sm text-gray-600">Års teamexpertis</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
