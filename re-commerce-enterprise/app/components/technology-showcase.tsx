
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Code2, 
  Database, 
  Cpu, 
  Shield, 
  Layers, 
  Terminal,
  ToggleLeft,
  ToggleRight,
  Play,
  Copy,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const ecosystemSystems = [
  {
    id: 're-commerce-platform',
    title: 're:Commerce Enterprise',
    description: 'Multi-tenant e-commerce med Next.js och PostgreSQL',
    icon: Database,
    category: 'Core Platform',
    features: [
      { name: 'Multi-tenant Architecture', status: 'active', compliance: 'Enterprise' },
      { name: 'OAuth 2.0 & RBAC', status: 'active', compliance: 'Security' },
      { name: 'PostgreSQL Database', status: 'active', compliance: 'Data' },
      { name: 'Tenant Isolation', status: 'active', compliance: 'Privacy' }
    ]
  },
  {
    id: 'bankid-suite',
    title: 'BankID Integration',
    description: 'Komplett svensk BankID-integration med testcertifikat',
    icon: Shield,
    category: 'Swedish Market',
    certifications: [
      { name: 'BankID Test Certificates', status: 'verified', standard: 'Swedish Banking' },
      { name: 'GDPR Compliance', status: 'verified', standard: 'EU Regulation' },
      { name: 'Svensk Accessibility', status: 'verified', standard: 'WCAG 2.1' },
      { name: 'Svenska Standards', status: 'verified', standard: 'National' }
    ]
  },
  {
    id: 'mina-sidor',
    title: 'Mina Sidor Portal',
    description: 'White-label kundportaler med flexibel deployment',
    icon: Layers,
    category: 'Customer Experience',
    deployments: [
      { mode: 'Widget Integration', usage: '85%', flexibility: 'High' },
      { mode: 'Fullscreen Portal', usage: '78%', flexibility: 'Complete' },
      { mode: 'API Communication', usage: '92%', flexibility: 'Bidirectional' },
      { mode: 'Custom Branding', usage: '96%', flexibility: 'White-label' }
    ]
  },
  {
    id: 'robin-deployment',
    title: 'ROBIN Deployment',
    description: 'Enterprise deployment och orkestrering cross-platform',
    icon: Cpu,
    category: 'DevOps Infrastructure',
    capabilities: [
      { platform: 'Windows Enterprise', support: 'full', automation: '100%' },
      { platform: 'Linux Enterprise', support: 'full', automation: '100%' },
      { platform: 'Cloud Deployment', support: 'full', automation: '95%' },
      { platform: 'Local Installation', support: 'full', automation: '90%' }
    ]
  }
];

export default function TechnologyShowcase() {
  const [activeTab, setActiveTab] = useState(ecosystemSystems[0]);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const sampleCode = `// BankID Integration Example
import { useBankID } from '@re-commerce/bankid';

function SwedishLoginComponent() {
  const { authenticate, status } = useBankID();
  
  return (
    <div>
      <button onClick={() => authenticate()}>
        Logga in med BankID
      </button>
      {status === 'authenticated' && (
        <WelcomePortal />
      )}
    </div>
  );
}`;

  return (
    <section id="technology" className="py-24 bg-gradient-to-b from-transparent to-black/30">
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
            Integrerad <span className="gradient-text">4-System Arkitektur</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Svenska marknadens mest avancerade enterprise-ekosystem. 
            BankID integration, GDPR-efterlevnad och multi-tenant säkerhet.
          </p>
        </motion.div>

        {/* Technology Tabs */}
        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          {ecosystemSystems.map((tech, index) => (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className={`glass-card p-6 cursor-pointer transition-all duration-300 ${
                activeTab.id === tech.id ? 'ring-2 ring-blue-500 bg-blue-500/10' : ''
              }`}
              onClick={() => setActiveTab(tech)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-center">
                <div className={`inline-flex p-4 rounded-lg mb-4 ${
                  activeTab.id === tech.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 text-blue-400'
                }`}>
                  <tech.icon className="w-8 h-8" />
                </div>
                <h3 className="font-semibold mb-2">{tech.title}</h3>
                <div className="text-xs text-blue-400 mb-3">{tech.category}</div>
                <p className="text-sm text-gray-400">{tech.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technology Detail Display */}
        <motion.div
          key={activeTab.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 rounded-2xl"
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Interactive Demo/Details */}
            <div>
              <h3 className="text-2xl font-bold mb-6 gradient-text">
                {activeTab.title}
              </h3>
              
              {activeTab.id === 're-commerce-platform' && (
                <div className="space-y-4">
                  <h4 className="font-semibold mb-4">Core Platform Features</h4>
                  {activeTab.features?.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <div className="font-medium">{feature.name}</div>
                        <div className="text-sm text-gray-400">Compliance: {feature.compliance}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="text-xs px-2 py-1 rounded-full bg-green-400/20 text-green-400">
                          {feature.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab.id === 'bankid-suite' && (
                <div className="space-y-4">
                  <h4 className="font-semibold mb-4">Svenska Marknaden Certifieringar</h4>
                  {activeTab.certifications?.map((cert, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{cert.name}</div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-blue-400" />
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-400/20 text-blue-400">
                            {cert.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-400">Standard: {cert.standard}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab.id === 'mina-sidor' && (
                <div className="space-y-4">
                  <h4 className="font-semibold mb-4">Deployment Modes</h4>
                  {activeTab.deployments?.map((deployment, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{deployment.mode}</div>
                        <div className="text-sm text-purple-400">{deployment.usage} adoption</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="w-full bg-gray-700 rounded-full h-2 mr-4">
                          <div 
                            className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                            style={{ width: deployment.usage }}
                          />
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-400/20 text-purple-400">
                          {deployment.flexibility}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab.id === 'robin-deployment' && (
                <div className="space-y-4">
                  <h4 className="font-semibold mb-4">Platform Support</h4>
                  {activeTab.capabilities?.map((capability, index) => (
                    <div key={index} className="p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{capability.platform}</div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-cyan-400" />
                          <span className="text-sm capitalize">{capability.support}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        Automation: {capability.automation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Code Example */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Implementation Example</h4>
                <Button
                  size="sm"
                  variant="outline"
                  className="btn-glass"
                  onClick={() => copyToClipboard(sampleCode)}
                >
                  {copiedCode ? (
                    <CheckCircle className="mr-2 w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="mr-2 w-4 h-4" />
                  )}
                  {copiedCode ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              
              <div className="bg-black/40 rounded-lg p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300 whitespace-pre-wrap">{sampleCode}</pre>
              </div>
              
              <div className="mt-6 space-y-4">
                <Button className="btn-primary w-full group">
                  <Play className="mr-2 w-4 h-4" />
                  Test BankID Integration
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="btn-glass">
                    <Shield className="mr-2 w-4 h-4" />
                    GDPR Docs
                  </Button>
                  <Button variant="outline" className="btn-glass">
                    <Database className="mr-2 w-4 h-4" />
                    Architecture
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
