
'use client'

import { useState, useEffect } from 'react'
import InteractivePlatformSection from './interactive-platform-section'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
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

export default function InteractiveProductSections() {
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

  if (loading) {
    return (
      <div className="section-padding">
        <div className="container text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Laddar plattformar...</p>
        </div>
      </div>
    )
  }

  const platformConfigs = {
    'enterprise-suite': {
      heroImage: "https://www.geckoboard.com/uploads/Ecommerce-KPI-dashboard.png",
      accentColor: 'text-blue-600',
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
    'leadsgen': {
      heroImage: "https://www.geckoboard.com/uploads/Lead-capture-dashboard.png",
      accentColor: 'text-green-600',
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
    'ai-suite': {
      heroImage: "https://www.slideteam.net/media/catalog/product/cache/1280x720/p/r/predictive_analytics_model_performance_tracking_dashboard_estimation_model_it_slide01.jpg",
      accentColor: 'text-purple-600',
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
  }

  return (
    <>
      {/* Enterprise Suite */}
      {platforms['enterprise-suite'] && (
        <InteractivePlatformSection
          platform={platforms['enterprise-suite'].platform}
          features={platforms['enterprise-suite'].features}
          {...platformConfigs['enterprise-suite']}
        />
      )}

      {/* LeadsGen */}
      {platforms['leadsgen'] && (
        <div className="bg-gray-50">
          <InteractivePlatformSection
            platform={platforms['leadsgen'].platform}
            features={platforms['leadsgen'].features}
            {...platformConfigs['leadsgen']}
          />
        </div>
      )}

      {/* AI Suite */}
      {platforms['ai-suite'] && (
        <InteractivePlatformSection
          platform={platforms['ai-suite'].platform}
          features={platforms['ai-suite'].features}
          {...platformConfigs['ai-suite']}
        />
      )}

      {/* AI Focus Summary Section */}
      <section className="section-padding bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="container">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              AI som skapar värde, inte bara hype
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Vår AI-teknologi fokuserar på mätbara resultat. Ingen teknik för teknikens skull - 
              endast intelligent automation som direkt påverkar din bottom line.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Prediktiv Analys',
                description: 'Förutser kundbeteenden och optimerar användarupplevelsen i realtid.',
                color: 'bg-purple-100 text-purple-600'
              },
              {
                icon: Zap,
                title: 'Automatisk Optimering',
                description: 'Kontinuerlig förbättring av prestanda utan manuell inblandning.',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                icon: Users,
                title: 'Personalisering',
                description: 'Individuell anpassning av innehåll och erbjudanden för varje besökare.',
                color: 'bg-green-100 text-green-600'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="card-shadow hover:shadow-lg transition-all duration-300 border-0 bg-white h-full">
                  <CardContent className="p-8 text-center h-full flex flex-col">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${item.color} mb-6`}>
                      <item.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed flex-1">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
