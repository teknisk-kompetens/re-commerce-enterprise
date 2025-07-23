
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Brain, Layers, Palette } from 'lucide-react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function FeaturesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const features = [
    {
      icon: Brain,
      title: 'AI-drivna Insikter',
      description: 'Prediktiv analys och personalisering som ökar konverteringsraten automatiskt.'
    },
    {
      icon: Layers,
      title: 'Skalbar Plattform',
      description: 'Modulär arkitektur som växer med ditt företag - från startup till enterprise.'
    },
    {
      icon: Palette,
      title: 'White-Label Lösningar',
      description: 'Anpassa plattformen under ditt eget varumärke för dina kunder.'
    }
  ]

  return (
    <section className="section-padding bg-gray-50">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Teknologi som levererar resultat
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Byggd på över 15 års samlad expertis inom digital optimering, 
            nu paketerat i en intelligent och skalbar plattform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="card-shadow hover:shadow-lg transition-all duration-300 border-0 bg-white">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
