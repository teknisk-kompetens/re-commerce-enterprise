
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Database, 
  TrendingUp, 
  Users, 
  BarChart3, 
  Cpu, 
  Target,
  ArrowRight,
  Calendar,
  Brain
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Image from 'next/image'

export default function ProductSections() {
  const [ref1, inView1] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [ref2, inView2] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [ref3, inView3] = useInView({ triggerOnce: true, threshold: 0.1 })

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Enterprise Suite Section */}
      <section id="enterprise-suite" className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              ref={ref1}
              initial={{ opacity: 0, x: -20 }}
              animate={inView1 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="order-2 lg:order-1"
            >
              <Badge className="mb-4 bg-blue-100 text-blue-800">
                Lanseras Q4 2025
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                re:commerce Enterprise Suite
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Den kompletta plattformen för datadriven e-handelstillväxt. 
                Byggd på beprövad teknologi och över 15 års samlad expertis från vårt team.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <Database className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Teknisk SEO-Arkitektur</h3>
                    <p className="text-gray-600">Automatiserad optimering av Core Web Vitals och teknisk prestanda</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">AI-driven Automation</h3>
                    <p className="text-gray-600">Intelligent optimering som lär sig från dina kunders beteenden</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BarChart3 className="h-6 w-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Datastruktur & Kvalitet</h3>
                    <p className="text-gray-600">Enhetlig datakvalitet som förbättrar alla digitala touchpoints</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => scrollToSection('contact')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Bli Designpartner
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => scrollToSection('contact')}
                >
                  Läs mer
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView1 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="https://i.pinimg.com/originals/5a/af/19/5aaf19ee113741efd08b3bba52752dcd.jpg"
                  alt="re:commerce Enterprise Suite Dashboard"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* LeadsGen Section */}
      <section id="leadsgen" className="section-padding bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              ref={ref2}
              initial={{ opacity: 0, x: -20 }}
              animate={inView2 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="https://remote-tools-images.s3.amazonaws.com/lead-funnel/lead-funnel-1.jpg"
                  alt="LeadsGen Platform Interface"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView2 ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="mb-4 bg-green-100 text-green-800">
                Pilotfas - Begränsat Antal Kunder
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                LeadsGen
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Specialiserad lösning för intelligent leadgenerering och 
                konverteringsoptimering. Tillgänglig nu för kvalificerade pilotkunder.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Intelligent Målgruppsanalys</h3>
                    <p className="text-gray-600">AI-driven segmentering för högre konverteringsrater</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Target className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Personaliserade Kampanjer</h3>
                    <p className="text-gray-600">Automatiserade kampanjer baserade på användarens resa</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Cpu className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Realtidsoptimering</h3>
                    <p className="text-gray-600">Kontinuerlig förbättring av leadkvalitet och kostnad per lead</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => scrollToSection('contact')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Ansök om Pilot
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => scrollToSection('contact')}
                >
                  Anmäl Intresse
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* AI Focus Section */}
      <section id="ai-focus" className="section-padding">
        <div className="container">
          <motion.div
            ref={ref3}
            initial={{ opacity: 0, y: 20 }}
            animate={inView3 ? { opacity: 1, y: 0 } : {}}
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
                description: 'Förutser kundbeteenden och optimerar användarupplevelsen i realtid.'
              },
              {
                icon: TrendingUp,
                title: 'Automatisk Optimering',
                description: 'Kontinuerlig förbättring av prestanda utan manuell inblandning.'
              },
              {
                icon: Users,
                title: 'Personalisering',
                description: 'Individuell anpassning av innehåll och erbjudanden för varje besökare.'
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView3 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="card-shadow hover:shadow-lg transition-all duration-300 border-0 bg-white">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
                      <item.icon className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
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
