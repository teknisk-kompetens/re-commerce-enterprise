
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  TrendingUp, 
  Users, 
  Quote,
  Star,
  Award,
  CheckCircle
} from 'lucide-react';

const customerStories = [
  {
    id: 1,
    company: 'Nordic Retail Group',
    industry: 'Retail & E-commerce',
    location: 'Stockholm, Sweden',
    size: '500+ employees',
    results: [
      { metric: 'Revenue Growth', value: '+45%', period: '12 months' },
      { metric: 'Order Processing', value: '3x faster', period: 'efficiency gain' },
      { metric: 'Customer Satisfaction', value: '98%', period: 'rating' }
    ],
    testimonial: "re:Commerce Enterprise Ecosystem revolutionerade vår verksamhet. BankID-integrationen gav oss konkurrensfördelar på svenska marknaden och GDPR-efterlevnaden skapade kundförtroende.",
    author: 'Maria Andersson',
    position: 'Chief Technology Officer',
    logo: 'https://i.pinimg.com/736x/06/af/8f/06af8fff2c908216b054152fd7454115.jpg',
    image: 'https://static.vecteezy.com/system/resources/previews/026/932/322/large_2x/ai-generative-smiling-beautiful-female-professional-manager-standing-with-arms-crossed-looking-at-camera-happy-confident-business-woman-corporate-leader-boss-ceo-posing-in-office-headshot-close-photo.jpg'
  },
  {
    id: 2,
    company: 'TechFlow Solutions',
    industry: 'Technology Services',
    location: 'Gothenburg, Sweden',
    size: '250+ employees',
    results: [
      { metric: 'Implementation Time', value: '60% reduction', period: 'vs previous solution' },
      { metric: 'System Uptime', value: '99.97%', period: 'availability' },
      { metric: 'Development Speed', value: '4x faster', period: 'feature delivery' }
    ],
    testimonial: "Det integrerade 4-system ekosystemet med multi-tenant arkitektur och ROBIN deployment system accelererade vår utveckling. 54 MD dokumentationsfiler gav vårt AI-team perfekt kunskapsbas.",
    author: 'Erik Johansson',
    position: 'Head of Engineering',
    logo: 'https://i.pinimg.com/736x/3c/4d/dc/3c4ddc369add7df5414171508f099c9a.jpg',
    image: 'https://images.squarespace-cdn.com/content/v1/651998e05a97287d391f2a87/1697150729283-FSJD8QE0RFXIMZ3U707L/Headshot-backgrounds-karenVaisman-Photography-Nearme-Malibu-LosAngeles-ThousandOaks-WoodlandHills-tp.jpg'
  },
  {
    id: 3,
    company: 'Scandinavian Manufacturing Co.',
    industry: 'Manufacturing',
    location: 'Malmö, Sweden',
    size: '1200+ employees',
    results: [
      { metric: 'Operational Efficiency', value: '+35%', period: 'improvement' },
      { metric: 'Supply Chain Visibility', value: '100%', period: 'real-time tracking' },
      { metric: 'Cost Reduction', value: '28%', period: 'yearly savings' }
    ],
    testimonial: "Övergången till re:Commerce Enterprise Ecosystem med Mina Sidor white-label portaler och komplett BankID integration transformerade våra kundrelationer. Svenska standarder mötte enterprise-krav perfekt.",
    author: 'Anna Lindberg',
    position: 'Digital Transformation Director',
    logo: 'https://i.pinimg.com/originals/73/f7/74/73f774aadea99db40027979c2081bad8.png',
    image: 'https://i.pinimg.com/originals/e7/07/63/e70763a81a9b6b5dcbefd57bad17ab5f.jpg'
  }
];

const metrics = [
  { label: 'Customer Retention', value: '96%', icon: Users },
  { label: 'Average ROI', value: '340%', icon: TrendingUp },
  { label: 'Implementation Success', value: '100%', icon: CheckCircle },
  { label: 'Support Rating', value: '4.9/5', icon: Star }
];

export default function CustomerShowcase() {
  const [activeStory, setActiveStory] = useState(0);

  return (
    <section id="customers" className="py-24 bg-gradient-to-b from-transparent to-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-section font-bold mb-6">
            Ekosystem <span className="gradient-text">Framgångssagor</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Svenska företag som dominerar sina marknader med vårt kompletta ekosystem. 
            BankID integration, GDPR-efterlevnad och enterprise-säkerhet.
          </p>
        </motion.div>

        {/* Success Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {metrics.map((metric, index) => (
            <div key={metric.label} className="glass-card p-6 text-center">
              <metric.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-400 mb-1">{metric.value}</div>
              <div className="text-sm text-gray-400">{metric.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Customer Stories */}
        <div className="space-y-8">
          {/* Story Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {customerStories.map((story, index) => (
              <button
                key={story.id}
                onClick={() => setActiveStory(index)}
                className={`glass-card p-4 rounded-lg transition-all duration-300 ${
                  activeStory === index ? 'ring-2 ring-blue-500 bg-blue-500/10' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <img 
                    src={story.logo}
                    alt={story.company}
                    className="w-8 h-8 rounded"
                  />
                  <div className="text-left">
                    <div className="font-medium text-sm">{story.company}</div>
                    <div className="text-xs text-gray-400">{story.industry}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Story */}
          <motion.div
            key={activeStory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 rounded-2xl"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Company Info & Results */}
              <div className="lg:col-span-2 space-y-8">
                {/* Company Header */}
                <div className="flex items-start space-x-4">
                  <img 
                    src={customerStories[activeStory].logo}
                    alt={customerStories[activeStory].company}
                    className="w-16 h-16 rounded-lg bg-white/10 p-2"
                  />
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {customerStories[activeStory].company}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Building2 className="w-4 h-4" />
                        <span>{customerStories[activeStory].industry}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{customerStories[activeStory].location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{customerStories[activeStory].size}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {customerStories[activeStory].results.map((result, index) => (
                    <div key={index} className="bg-white/5 p-6 rounded-lg text-center">
                      <div className="text-3xl font-bold gradient-text mb-2">
                        {result.value}
                      </div>
                      <div className="font-medium mb-1">{result.metric}</div>
                      <div className="text-sm text-gray-400">{result.period}</div>
                    </div>
                  ))}
                </div>

                {/* Testimonial */}
                <div className="relative">
                  <Quote className="w-8 h-8 text-blue-400 mb-4" />
                  <p className="text-lg text-gray-300 leading-relaxed mb-6 italic">
                    "{customerStories[activeStory].testimonial}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={customerStories[activeStory].image}
                      alt={customerStories[activeStory].author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{customerStories[activeStory].author}</div>
                      <div className="text-sm text-gray-400">{customerStories[activeStory].position}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Elements */}
              <div className="space-y-6">
                <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 flex items-center justify-center">
                  <div className="text-center">
                    <Award className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <div className="text-lg font-semibold mb-2">Success Story</div>
                    <div className="text-sm text-gray-400">Enterprise Transformation</div>
                  </div>
                </div>
                
                <div className="glass-card p-6 text-center">
                  <div className="text-2xl font-bold text-green-400 mb-2">Project Complete</div>
                  <div className="text-sm text-gray-400 mb-4">On-time delivery</div>
                  <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
