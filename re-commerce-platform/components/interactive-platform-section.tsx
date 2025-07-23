
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FeatureTable from './feature-table'
import PlatformInterestForm from './platform-interest-form'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  ArrowRight, 
  Users, 
  Star, 
  Rocket,
  Database,
  TrendingUp,
  Brain,
  Target,
  BarChart3,
  Cpu
} from 'lucide-react'
import Image from 'next/image'

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

interface InteractivePlatformSectionProps {
  platform: Platform
  features: Feature[]
  heroImage: string
  accentColor: string
  highlights: Array<{
    icon: any
    title: string
    description: string
  }>
}

export default function InteractivePlatformSection({
  platform,
  features,
  heroImage,
  accentColor,
  highlights
}: InteractivePlatformSectionProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [activeTab, setActiveTab] = useState('overview')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return { text: 'Tillgänglig Nu', class: 'bg-green-100 text-green-800' }
      case 'pilot':
        return { text: 'Pilotfas - Begränsat Antal', class: 'bg-orange-100 text-orange-800' }
      case 'coming_soon':
        return { text: 'Lanseras Q4 2025', class: 'bg-blue-100 text-blue-800' }
      default:
        return { text: 'Kommande', class: 'bg-gray-100 text-gray-800' }
    }
  }

  const statusBadge = getStatusBadge(platform.status)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const getTotalVotes = () => {
    return features.reduce((total, feature) => {
      return total + feature.votes.dislike + feature.votes.like + feature.votes.love
    }, 0)
  }

  const getTopFeatures = () => {
    return features
      .sort((a, b) => {
        const aScore = (a.votes.like + a.votes.love * 2) - a.votes.dislike
        const bScore = (b.votes.like + b.votes.love * 2) - b.votes.dislike
        return bScore - aScore
      })
      .slice(0, 3)
  }

  return (
    <section id={platform.slug} className="section-padding">
      <div className="container">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <Badge className={`mb-4 ${statusBadge.class}`}>
              {statusBadge.text}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              {platform.name}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {platform.description}
            </p>
            
            <div className="space-y-4 mb-8">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start space-x-3"
                >
                  <highlight.icon className={`h-6 w-6 ${accentColor} mt-1`} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{highlight.title}</h3>
                    <p className="text-gray-600">{highlight.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setActiveTab('interest')}
                className={`${accentColor.replace('text-', 'bg-').replace('-600', '-600')} hover:${accentColor.replace('text-', 'bg-').replace('-600', '-700')}`}
              >
                {platform.status === 'pilot' ? 'Ansök om Pilot' : 'Bli Designpartner'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab('features')}
              >
                Se Funktioner
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={heroImage}
                alt={`${platform.name} Dashboard`}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>

        {/* Interactive Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
              <TabsTrigger value="overview">Översikt</TabsTrigger>
              <TabsTrigger value="features">
                Funktioner ({features.length})
              </TabsTrigger>
              <TabsTrigger value="interest">Anmäl Intresse</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="card-shadow">
                  <CardContent className="p-6 text-center">
                    <Star className={`h-8 w-8 ${accentColor} mx-auto mb-3`} />
                    <h3 className="font-semibold mb-2">Funktioner</h3>
                    <p className="text-2xl font-bold text-gray-900">{features.length}</p>
                    <p className="text-sm text-gray-600">Planerade features</p>
                  </CardContent>
                </Card>
                
                <Card className="card-shadow">
                  <CardContent className="p-6 text-center">
                    <Users className={`h-8 w-8 ${accentColor} mx-auto mb-3`} />
                    <h3 className="font-semibold mb-2">Röster</h3>
                    <p className="text-2xl font-bold text-gray-900">{getTotalVotes()}</p>
                    <p className="text-sm text-gray-600">Från användare</p>
                  </CardContent>
                </Card>
                
                <Card className="card-shadow">
                  <CardContent className="p-6 text-center">
                    <Rocket className={`h-8 w-8 ${accentColor} mx-auto mb-3`} />
                    <h3 className="font-semibold mb-2">Status</h3>
                    <p className="text-sm font-medium text-gray-900">{statusBadge.text}</p>
                    <p className="text-sm text-gray-600">Utvecklingsfas</p>
                  </CardContent>
                </Card>
              </div>

              {getTotalVotes() > 0 && (
                <Card className="card-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Mest Populära Funktioner</h3>
                    <div className="space-y-3">
                      {getTopFeatures().map((feature, index) => {
                        const score = (feature.votes.like + feature.votes.love * 2) - feature.votes.dislike
                        return (
                          <div key={feature.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <span className={`w-6 h-6 rounded-full ${accentColor.replace('text-', 'bg-').replace('-600', '-600')} text-white text-sm font-bold flex items-center justify-center`}>
                                {index + 1}
                              </span>
                              <div>
                                <h4 className="font-medium">{feature.title}</h4>
                                <p className="text-sm text-gray-600">{feature.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">+{score}</p>
                              <p className="text-xs text-gray-600">poäng</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="features">
              <FeatureTable
                platformSlug={platform.slug}
                features={features}
              />
            </TabsContent>

            <TabsContent value="interest">
              <div className="max-w-md mx-auto">
                <PlatformInterestForm
                  platform={platform}
                  accentColor={accentColor}
                />
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  )
}
