
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  ChevronLeft, 
  ChevronRight, 
  Database, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Cpu, 
  Target,
  Brain,
  Sparkles,
  Eye,
  Zap
} from 'lucide-react'
import InteractiveDashboard from './interactive-dashboard'
import FeatureTable from './feature-table'
import PlatformInterestForm from './platform-interest-form'

interface Platform {
  id: number
  name: string
  slug: string
  description: string
  status: string
}

interface Feature {
  id: number
  title: string
  description: string
  category: string
  priority: string
  votes: {
    dislike: number
    like: number
    love: number
  }
  userVote?: string | null
}

export default function PlatformSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [platforms, setPlatforms] = useState<{ [key: string]: { platform: Platform; features: Feature[] } }>({})
  const [sessionId, setSessionId] = useState('')
  const [loading, setLoading] = useState(true)
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  useEffect(() => {
    // Generate or get session ID
    let storedSessionId = localStorage.getItem('voting_session_id')
    if (!storedSessionId) {
      storedSessionId = Math.random().toString(36).substring(2, 15)
      localStorage.setItem('voting_session_id', storedSessionId)
    }
    setSessionId(storedSessionId)
  }, [])

  useEffect(() => {
    if (sessionId) {
      fetchPlatformData()
    }
  }, [sessionId])

  const fetchPlatformData = async () => {
    try {
      const platformSlugs = ['enterprise-suite', 'leadsgen', 'ai-suite']
      const platformData: { [key: string]: { platform: Platform; features: Feature[] } } = {}

      for (const slug of platformSlugs) {
        const response = await fetch(`/api/features?platform=${slug}&sessionId=${sessionId}`)
        if (response.ok) {
          const data = await response.json()
          platformData[slug] = data
        }
      }

      setPlatforms(platformData)
    } catch (error) {
      console.error('Failed to fetch platform data:', error)
    } finally {
      setLoading(false)
    }
  }

  const platformConfigs = [
    {
      slug: 'enterprise-suite',
      accentColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      highlights: [
        {
          icon: Database,
          title: 'Teknisk SEO-Arkitektur',
          description: 'Automatiserad optimering av Core Web Vitals och teknisk prestanda'
        },
        {
          icon: TrendingUp,
          title: 'AI-driven Automation',
          description: 'Intelligent optimering som lär sig från dina kunders beteenden'
        },
        {
          icon: BarChart3,
          title: 'Datastruktur & Kvalitet',
          description: 'Enhetlig datakvalitet som förbättrar alla digitala touchpoints'
        }
      ]
    },
    {
      slug: 'leadsgen',
      accentColor: 'text-green-600',
      bgColor: 'bg-green-50',
      highlights: [
        {
          icon: Users,
          title: 'Intelligent Målgruppsanalys',
          description: 'AI-driven segmentering för högre konverteringsrater'
        },
        {
          icon: Target,
          title: 'Personaliserade Kampanjer',
          description: 'Automatiserade kampanjer baserade på användarens resa'
        },
        {
          icon: Cpu,
          title: 'Realtidsoptimering',
          description: 'Kontinuerlig förbättring av leadkvalitet och kostnad per lead'
        }
      ]
    },
    {
      slug: 'ai-suite',
      accentColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      highlights: [
        {
          icon: Brain,
          title: 'Prediktiv Analys',
          description: 'Förutser kundbeteenden och optimerar användarupplevelsen i realtid'
        },
        {
          icon: Sparkles,
          title: 'Automatisk Optimering',
          description: 'Kontinuerlig förbättring av prestanda utan manuell inblandning'
        },
        {
          icon: Eye,
          title: 'Intelligent Personalisering',
          description: 'Individuell anpassning av innehåll och erbjudanden för varje besökare'
        }
      ]
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % platformConfigs.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + platformConfigs.length) % platformConfigs.length)
  }

  if (loading) {
    return (
      <section className="py-16 bg-white" id="platforms" aria-labelledby="platforms-heading">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Laddar plattformar...</p>
          </div>
        </div>
      </section>
    )
  }

  const currentConfig = platformConfigs[currentSlide]
  const currentPlatformData = platforms[currentConfig?.slug]

  return (
    <section 
      className="py-16 bg-white" 
      id="platforms" 
      aria-labelledby="platforms-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 id="platforms-heading" className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Enterprise-plattformar som levererar
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tre specialiserade plattformar som arbetar tillsammans för att skapa mätbar affärstillväxt
          </p>
        </motion.div>

        {/* Platform Navigation */}
        <div className="flex items-center justify-center mb-8 space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
            aria-label="Föregående plattform"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          
          <div className="flex space-x-2">
            {platformConfigs.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Gå till plattform ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
            aria-label="Nästa plattform"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        {/* Platform Content */}
        <AnimatePresence mode="wait">
          {currentPlatformData && (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className={`rounded-lg p-8 ${currentConfig?.bgColor || 'bg-gray-50'}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Platform Info */}
                <div>
                  <h3 className={`text-2xl font-bold mb-4 ${currentConfig?.accentColor || 'text-gray-900'}`}>
                    {currentPlatformData.platform.name}
                  </h3>
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    {currentPlatformData.platform.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-4 mb-8">
                    {currentConfig?.highlights?.map((highlight, index) => {
                      const IconComponent = highlight.icon
                      return (
                        <div key={index} className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-white flex items-center justify-center ${currentConfig?.accentColor || 'text-gray-600'}`}>
                            <IconComponent className="h-4 w-4" aria-hidden="true" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{highlight.title}</h4>
                            <p className="text-gray-600 text-sm">{highlight.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Interest Form */}
                  <PlatformInterestForm 
                    platform={currentPlatformData.platform}
                    accentColor={currentConfig?.accentColor || 'text-blue-600'}
                  />
                </div>

                {/* Right Column - Interactive Dashboard */}
                <div>
                  <InteractiveDashboard 
                    platform={currentPlatformData.platform.slug}
                    accentColor={currentConfig?.accentColor || 'text-blue-600'}
                  />
                </div>
              </div>

              {/* Features Section */}
              <div className="mt-12">
                <h4 className="text-xl font-bold mb-6 text-gray-900">
                  Funktioner & Community-röstning
                </h4>
                <p className="text-gray-600 mb-6">
                  Rösta på funktioner som är viktigast för din verksamhet. Alla besökare kan rösta!
                </p>
                <FeatureTable 
                  platformSlug={currentConfig?.slug || ''} 
                  features={currentPlatformData.features} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
