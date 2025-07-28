
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  ShoppingCart, 
  Heart, 
  DollarSign, 
  Factory, 
  Code, 
  Building, 
  Calendar, 
  Users, 
  BarChart3, 
  Shield, 
  Settings, 
  Eye, 
  Share2, 
  BookOpen, 
  CheckCircle2,
  ArrowRight,
  Clock,
  Star,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-enhanced';
import { Button } from '@/components/ui/button-enhanced';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface DemoScenario {
  id: string;
  title: string;
  industry: string;
  description: string;
  duration: number; // minutes
  features: string[];
  metrics: {
    completion_rate: number;
    avg_score: number;
    views: number;
  };
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  highlights: string[];
}

export function IndustryDemoScenarios() {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario | null>(null);
  const [demoProgress, setDemoProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedIndustry, setSelectedIndustry] = useState('all');

  const scenarios: DemoScenario[] = [
    {
      id: 'retail-analytics',
      title: 'Retail Analytics & Inventory Optimization',
      industry: 'retail',
      description: 'Discover how our platform transforms retail operations with real-time inventory tracking, customer behavior analytics, and predictive demand forecasting.',
      duration: 12,
      features: [
        'Real-time inventory tracking',
        'Customer behavior analytics',
        'Predictive demand forecasting',
        'Multi-channel sales optimization',
        'Automated reordering system'
      ],
      metrics: {
        completion_rate: 89.5,
        avg_score: 8.7,
        views: 2847
      },
      difficulty: 'intermediate',
      icon: ShoppingCart,
      color: 'primary',
      highlights: [
        'Reduce inventory costs by 34%',
        'Increase sales conversion by 28%',
        'Automate 85% of reordering decisions'
      ]
    },
    {
      id: 'healthcare-compliance',
      title: 'Healthcare Compliance & Patient Data Security',
      industry: 'healthcare',
      description: 'Explore comprehensive healthcare solutions including HIPAA compliance, patient data management, and clinical workflow optimization.',
      duration: 15,
      features: [
        'HIPAA-compliant data handling',
        'Patient record management',
        'Clinical workflow automation',
        'Audit trail tracking',
        'Regulatory reporting'
      ],
      metrics: {
        completion_rate: 92.3,
        avg_score: 9.1,
        views: 1923
      },
      difficulty: 'advanced',
      icon: Heart,
      color: 'success',
      highlights: [
        '100% HIPAA compliance',
        'Reduce documentation time by 45%',
        'Improve patient satisfaction by 32%'
      ]
    },
    {
      id: 'financial-risk',
      title: 'Financial Services & Risk Management',
      industry: 'finance',
      description: 'Learn how financial institutions leverage our platform for risk assessment, fraud detection, and regulatory compliance.',
      duration: 18,
      features: [
        'Real-time fraud detection',
        'Risk assessment algorithms',
        'Regulatory compliance automation',
        'Transaction monitoring',
        'Credit scoring models'
      ],
      metrics: {
        completion_rate: 87.1,
        avg_score: 8.9,
        views: 1654
      },
      difficulty: 'advanced',
      icon: DollarSign,
      color: 'warning',
      highlights: [
        'Detect fraud 99.7% accuracy',
        'Reduce compliance costs by 52%',
        'Process transactions 10x faster'
      ]
    },
    {
      id: 'manufacturing-ops',
      title: 'Manufacturing Operations & Supply Chain',
      industry: 'manufacturing',
      description: 'Optimize manufacturing processes with IoT integration, predictive maintenance, and supply chain visibility.',
      duration: 20,
      features: [
        'IoT sensor integration',
        'Predictive maintenance',
        'Supply chain visibility',
        'Quality control automation',
        'Production optimization'
      ],
      metrics: {
        completion_rate: 84.7,
        avg_score: 8.4,
        views: 1432
      },
      difficulty: 'advanced',
      icon: Factory,
      color: 'error',
      highlights: [
        'Reduce downtime by 67%',
        'Improve quality scores by 41%',
        'Optimize supply chain efficiency'
      ]
    },
    {
      id: 'tech-scaling',
      title: 'Technology Startup Scaling Solutions',
      industry: 'technology',
      description: 'Scale your tech startup with automated infrastructure, analytics, and growth optimization tools.',
      duration: 10,
      features: [
        'Auto-scaling infrastructure',
        'Growth analytics',
        'User behavior tracking',
        'A/B testing framework',
        'Performance monitoring'
      ],
      metrics: {
        completion_rate: 91.8,
        avg_score: 8.6,
        views: 2156
      },
      difficulty: 'beginner',
      icon: Code,
      color: 'primary',
      highlights: [
        'Scale to 10M+ users',
        'Reduce infrastructure costs by 43%',
        'Accelerate development by 60%'
      ]
    }
  ];

  const industries = [
    { id: 'all', name: 'All Industries', count: scenarios.length },
    { id: 'retail', name: 'Retail & E-commerce', count: scenarios.filter(s => s.industry === 'retail').length },
    { id: 'healthcare', name: 'Healthcare', count: scenarios.filter(s => s.industry === 'healthcare').length },
    { id: 'finance', name: 'Financial Services', count: scenarios.filter(s => s.industry === 'finance').length },
    { id: 'manufacturing', name: 'Manufacturing', count: scenarios.filter(s => s.industry === 'manufacturing').length },
    { id: 'technology', name: 'Technology', count: scenarios.filter(s => s.industry === 'technology').length }
  ];

  const filteredScenarios = selectedIndustry === 'all' 
    ? scenarios 
    : scenarios.filter(s => s.industry === selectedIndustry);

  const startDemo = (scenario: DemoScenario) => {
    setSelectedScenario(scenario);
    setDemoProgress(0);
    setCompletedSteps([]);
    setIsRunning(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'secondary';
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && selectedScenario) {
      interval = setInterval(() => {
        setDemoProgress(prev => {
          if (prev >= 100) {
            setIsRunning(false);
            return 100;
          }
          return prev + 1;
        });
      }, (selectedScenario.duration * 1000) / 100); // Convert minutes to milliseconds and divide by 100 for smooth progress
    }
    return () => clearInterval(interval);
  }, [isRunning, selectedScenario]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-4">
              Interactive Demo Scenarios
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Experience our platform through industry-specific scenarios. See how Re-Commerce 
              transforms operations across different business verticals.
            </p>
          </motion.div>
        </div>

        {/* Industry Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {industries.map((industry) => (
              <Button
                key={industry.id}
                variant={selectedIndustry === industry.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedIndustry(industry.id)}
                className="flex items-center space-x-2"
              >
                <span>{industry.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {industry.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Demo Running View */}
        {selectedScenario && isRunning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card variant="elevated" className="p-8">
              <div className="text-center mb-6">
                <div className={`w-16 h-16 bg-${selectedScenario.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <selectedScenario.icon className={`h-8 w-8 text-${selectedScenario.color}-600`} />
                </div>
                <h3 className="text-2xl font-bold mb-2">{selectedScenario.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Demo in progress... ({Math.round(demoProgress)}% complete)
                </p>
              </div>
              
              <Progress value={demoProgress} className="h-3 mb-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedScenario.highlights.map((highlight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: demoProgress > (index + 1) * 25 ? 1 : 0.3, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="text-center"
                  >
                    <CheckCircle2 className={`h-8 w-8 mx-auto mb-2 ${demoProgress > (index + 1) * 25 ? 'text-success-600' : 'text-neutral-300'}`} />
                    <p className="font-medium">{highlight}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="text-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsRunning(false)}
                >
                  Stop Demo
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Scenarios Grid */}
        {!isRunning && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  variant="elevated" 
                  interactive
                  className="h-full hover:shadow-xl transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-${scenario.color}-100 rounded-lg flex items-center justify-center`}>
                        <scenario.icon className={`h-6 w-6 text-${scenario.color}-600`} />
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge variant={getDifficultyColor(scenario.difficulty) as any}>
                          {scenario.difficulty}
                        </Badge>
                        <div className="flex items-center space-x-1 text-sm text-neutral-600">
                          <Clock className="h-3 w-3" />
                          <span>{scenario.duration}min</span>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight">{scenario.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                      {scenario.description}
                    </p>
                    
                    {/* Key Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
                        Key Features
                      </h4>
                      <div className="space-y-2">
                        {scenario.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-sm">
                            <CheckCircle2 className="h-3 w-3 text-success-600 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {scenario.features.length > 3 && (
                          <div className="text-sm text-neutral-500">
                            +{scenario.features.length - 3} more features
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-6 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                      <div className="text-center">
                        <div className="text-sm font-bold text-primary-600">{scenario.metrics.completion_rate}%</div>
                        <div className="text-xs text-neutral-600">Completion</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-success-600 flex items-center justify-center">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {scenario.metrics.avg_score}
                        </div>
                        <div className="text-xs text-neutral-600">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-warning-600 flex items-center justify-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {scenario.metrics.views.toLocaleString()}
                        </div>
                        <div className="text-xs text-neutral-600">Views</div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => startDemo(scenario)}
                        className="flex-1"
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Demo
                      </Button>
                      <Button variant="outline" size="sm">
                        <BookOpen className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Card variant="elevated" className="p-8 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Need a Custom Demo?</h3>
              <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                Our team can create a personalized demonstration tailored specifically 
                to your industry requirements and business objectives.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Custom Demo
                </Button>
                <Button variant="outline" size="lg">
                  <Users className="h-4 w-4 mr-2" />
                  Contact Sales Team
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
