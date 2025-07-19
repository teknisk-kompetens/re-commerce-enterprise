
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Award, 
  Clock, 
  DollarSign,
  Target,
  Zap
} from 'lucide-react';
import AnimatedCounter from './animated-counter';


// Sample growth data
const growthData = [
  { year: '2018', customers: 50, projects: 75, revenue: 120 },
  { year: '2019', customers: 80, projects: 130, revenue: 185 },
  { year: '2020', customers: 120, projects: 200, revenue: 280 },
  { year: '2021', customers: 160, projects: 320, revenue: 420 },
  { year: '2022', customers: 200, projects: 400, revenue: 580 },
  { year: '2023', customers: 235, projects: 470, revenue: 720 },
  { year: '2024', customers: 250, projects: 500, revenue: 850 },
];

const ecosystemMetrics = [
  {
    icon: Target,
    title: 'Integrerade System',
    value: 4,
    suffix: '',
    change: 'Complete',
    description: 'Komplett ekosystem för svenska företag',
    color: 'text-blue-400'
  },
  {
    icon: Users,
    title: 'MD Dokumentation',
    value: 54,
    suffix: '',
    change: 'AI Ready',
    description: 'Omfattande kunskapsbas för MCP',
    color: 'text-green-400'
  },
  {
    icon: Globe,
    title: 'Svenska Marknaden',
    value: 100,
    suffix: '%',
    change: 'BankID Ready',
    description: 'Komplett integration för Sverige',
    color: 'text-purple-400'
  },
  {
    icon: Award,
    title: 'GDPR Compliance',
    value: 100,
    suffix: '%',
    change: 'Certified',
    description: 'Fullständig dataskyddsefterlevnad',
    color: 'text-yellow-400'
  },
  {
    icon: Zap,
    title: 'Multi-Tenant',
    value: 100,
    suffix: '%',
    change: 'Isolated',
    description: 'Enterprise tenant-separation',
    color: 'text-cyan-400'
  },
  {
    icon: DollarSign,
    title: 'Enterprise Security',
    value: 100,
    suffix: '%',
    change: 'Bank-grade',
    description: 'OAuth 2.0, RBAC, MFA säkerhet',
    color: 'text-pink-400'
  }
];

export default function MetricsVisualization() {
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % ecosystemMetrics.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="metrics" className="py-24 bg-gradient-to-b from-black/20 to-transparent">
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
            Ekosystem <span className="gradient-text">Excellens Mätningar</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Komplett teknisk överlägenhet för svenska marknaden. 
            BankID, GDPR, multi-tenant och enterprise säkerhet som konkurrensfördelar.
          </p>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {ecosystemMetrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className={`glass-card p-6 relative overflow-hidden cursor-pointer transition-all duration-500 ${
                activeMetric === index ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
              onClick={() => setActiveMetric(index)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <metric.icon className={`w-8 h-8 ${metric.color}`} />
                  <div className={`text-sm font-medium px-2 py-1 rounded-full bg-white/10 ${metric.color}`}>
                    {metric.change}
                  </div>
                </div>
                
                <div className="mb-2">
                  <div className={`text-3xl font-bold ${metric.color} mb-1`}>
                    <AnimatedCounter 
                      end={metric.value} 
                      suffix={metric.suffix}
                      duration={2000}
                    />
                  </div>
                  <h3 className="font-semibold text-white">{metric.title}</h3>
                </div>
                
                <p className="text-sm text-gray-400">{metric.description}</p>
              </div>
              
              {/* Animated background glow */}
              {activeMetric === index && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent rounded-lg"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-card p-8 rounded-2xl"
        >
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-2">Ekosystem Evolution</h3>
            <p className="text-gray-400">Svenska marknadens mest kompletta enterprise-lösning utveckling</p>
          </div>
          
          <div className="h-80 relative">
            {/* Visual Chart Representation */}
            <div className="absolute inset-0 flex items-end justify-around p-6">
              {growthData.map((data, index) => (
                <div key={data.year} className="flex flex-col items-center space-y-2">
                  <div className="relative h-48 w-12 flex flex-col justify-end space-y-1">
                    {/* Revenue Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${(data.revenue / 10)}%` }}
                      transition={{ delay: index * 0.1, duration: 1 }}
                      viewport={{ once: true }}
                      className="w-3 bg-gradient-to-t from-teal-400 to-teal-300 rounded-sm mx-auto"
                    />
                    {/* Projects Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${(data.projects / 6)}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 1 }}
                      viewport={{ once: true }}
                      className="w-3 bg-gradient-to-t from-orange-400 to-orange-300 rounded-sm mx-auto"
                    />
                    {/* Customers Bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${(data.customers / 3)}%` }}
                      transition={{ delay: index * 0.1 + 0.4, duration: 1 }}
                      viewport={{ once: true }}
                      className="w-3 bg-gradient-to-t from-blue-400 to-blue-300 rounded-sm mx-auto"
                    />
                  </div>
                  <div className="text-xs text-gray-400 font-medium">{data.year}</div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="absolute top-4 left-4 space-y-2">
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                <span className="text-gray-400">Customers</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 bg-orange-400 rounded-sm"></div>
                <span className="text-gray-400">Projects</span>
              </div>
              <div className="flex items-center space-x-2 text-xs">
                <div className="w-3 h-3 bg-teal-400 rounded-sm"></div>
                <span className="text-gray-400">Revenue Index</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-400 mb-1">5x Growth</div>
              <div className="text-sm text-gray-500">Customer Base Expansion</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-400 mb-1">6.7x Growth</div>
              <div className="text-sm text-gray-500">Project Delivery Scale</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-teal-400 mb-1">7x Growth</div>
              <div className="text-sm text-gray-500">Revenue Performance</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
