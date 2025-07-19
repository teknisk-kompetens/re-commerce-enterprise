
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Command, 
  Settings, 
  Database, 
  Shield, 
  Zap, 
  Users,
  BarChart3,
  Globe,
  ArrowRight,
  Play
} from 'lucide-react';

const ecosystemSystems = [
  {
    id: 're-commerce-platform',
    title: 're:Commerce Enterprise Platform',
    description: 'Multi-tenant e-commerce med Next.js, PostgreSQL och enterprise-säkerhet',
    icon: Database,
    image: 'https://i.pinimg.com/originals/d1/49/42/d1494260de65055dfcaa384a20a01920.jpg',
    details: [
      'Multi-tenant arkitektur',
      'OAuth 2.0 & RBAC',
      'PostgreSQL databas',
      'Enterprise-skalbarhet'
    ]
  },
  {
    id: 'bankid-suite',
    title: 'BankID Integration Suite',
    description: 'Komplett BankID-integration för svenska marknaden med testcertifikat',
    icon: Shield,
    image: 'https://www.slideteam.net/wp/wp-content/uploads/2022/12/Cybersecurity-Dashboard-with-Risk-and-Compliance.png',
    details: [
      'BankID autentisering',
      'Test-certifikat klara',
      'GDPR-efterlevnad',
      'Svenska standarder'
    ]
  },
  {
    id: 'mina-sidor',
    title: 'Mina Sidor White-Label',
    description: 'Anpassningsbara kundportaler med widget- och fullskärmslägen',
    icon: Users,
    image: 'https://blog.n8n.io/content/images/size/w800/2024/10/ai-workflow-automationA--1-.png',
    details: [
      'White-label portaler',
      'Widget & fullskärm',
      'API-kommunikation',
      '1-veckas roadmap'
    ]
  },
  {
    id: 'robin-deployment',
    title: 'ROBIN Deployment System',
    description: 'Enterprise deployment och orkestrering för Windows/Linux miljöer',
    icon: Settings,
    image: 'http://infoscience.co/images/the-power-of-visual-analytics-unlocking-insights-through-data-visualization.jpg',
    details: [
      'Cross-platform deployment',
      'Automatiserad installation',
      'Lokal & cloud support',
      'Enterprise orkestrering'
    ]
  }
];

export default function PlatformShowcase() {
  const [activeSystem, setActiveSystem] = useState(ecosystemSystems[0]);

  return (
    <section id="platform" className="py-24 bg-gradient-to-b from-transparent to-black/20">
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
            Svenska Marknadens <span className="gradient-text">Mest Kompletta Ekosystem</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            4 integrerade system som dominerar svenska företagsmarknaden. 
            BankID, GDPR, multi-tenant arkitektur och enterprise-säkerhet.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {ecosystemSystems.map((system, index) => (
              <motion.div
                key={system.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className={`glass-card p-6 cursor-pointer transition-all duration-300 ${
                  activeSystem.id === system.id ? 'ring-2 ring-blue-500 bg-blue-500/10' : ''
                }`}
                onClick={() => setActiveSystem(system)}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${
                    activeSystem.id === system.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white/10 text-blue-400'
                  }`}>
                    <system.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{system.title}</h3>
                    <p className="text-gray-400 mb-4">{system.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {system.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center text-sm text-gray-500">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Display */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Main Display */}
            <div className="glass-card p-8 rounded-2xl">
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-6 relative overflow-hidden">
                <img 
                  src={activeSystem.image}
                  alt={activeSystem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                  <Button size="lg" className="btn-glass group">
                    <Play className="mr-2 w-5 h-5" />
                    System Demo
                  </Button>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-3 gradient-text">
                {activeSystem.title}
              </h3>
              <p className="text-gray-300 mb-6">
                {activeSystem.description}
              </p>
              
              <Button className="btn-primary group">
                Explore System
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">BankID</div>
                <div className="text-xs text-gray-500">Integration</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">GDPR</div>
                <div className="text-xs text-gray-500">Compliant</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">Multi</div>
                <div className="text-xs text-gray-500">Tenant</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
