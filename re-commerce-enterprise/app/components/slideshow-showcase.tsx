
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  BarChart3,
  Users,
  Shield,
  Zap,
  Globe,
  Award
} from 'lucide-react';

const slides = [
  {
    id: 1,
    title: 'Enterprise Dashboard',
    subtitle: 'Command Center Overview',
    description: 'Comprehensive platform overview with real-time metrics, system health, and performance analytics.',
    image: 'https://i.pinimg.com/originals/d1/49/42/d1494260de65055dfcaa384a20a01920.jpg',
    features: ['Real-time monitoring', 'Multi-tenant overview', 'Performance metrics', 'Alert management'],
    icon: BarChart3
  },
  {
    id: 2,
    title: 'Customer Management',
    subtitle: 'Enterprise CRM Suite',
    description: 'Advanced customer relationship management with 360-degree customer views and automation.',
    image: 'https://i.ytimg.com/vi/srU1zDw-EcU/maxresdefault.jpg',
    features: ['360° customer view', 'Automated workflows', 'Segmentation tools', 'Communication hub'],
    icon: Users
  },
  {
    id: 3,
    title: 'Security Center',
    subtitle: 'Enterprise-Grade Protection',
    description: 'Comprehensive security monitoring with threat detection and compliance management.',
    image: 'https://www.slideteam.net/wp/wp-content/uploads/2022/12/Cybersecurity-Dashboard-with-Risk-and-Compliance.png',
    features: ['Threat detection', 'Access control', 'Audit trails', 'Compliance monitoring'],
    icon: Shield
  },
  {
    id: 4,
    title: 'Automation Engine',
    subtitle: 'Workflow Optimization',
    description: 'Intelligent automation for complex business processes and workflow optimization.',
    image: 'https://www.slideteam.net/media/catalog/product/cache/1280x720/w/o/workflow_automation_flowchart_for_business_process_improvement_slide01.jpg',
    features: ['Process automation', 'Rule engine', 'API orchestration', 'Event triggers'],
    icon: Zap
  },
  {
    id: 5,
    title: 'Global Operations',
    subtitle: 'Multi-Region Management',
    description: 'Manage operations across multiple regions with localized insights and global oversight.',
    image: 'https://i.ytimg.com/vi/kIZDb_pHvX0/maxresdefault.jpg',
    features: ['Multi-region support', 'Localization tools', 'Global analytics', 'Regional compliance'],
    icon: Globe
  },
  {
    id: 6,
    title: 'Performance Analytics',
    subtitle: 'Advanced Reporting Suite',
    description: 'Deep insights with AI-powered analytics and predictive reporting capabilities.',
    image: 'https://thumbs.dreamstime.com/b/advanced-data-analytics-dashboard-features-interactive-graphs-visualizations-better-insights-futuristic-358777669.jpg',
    features: ['Predictive analytics', 'Custom reports', 'Data visualization', 'Business intelligence'],
    icon: Award
  }
];

export default function SlideshowShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((curr) => (curr + 1) % slides.length);
          return 0;
        }
        return prev + 1;
      });
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-black/30 to-transparent">
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
            Platform <span className="gradient-text">Showcase</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the comprehensive features and capabilities of our enterprise platform 
            through this interactive presentation.
          </p>
        </motion.div>

        <div className="glass-card p-8 rounded-2xl">
          {/* Main Slideshow */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid lg:grid-cols-2 gap-8 items-center"
              >
                {/* Content */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-500 rounded-lg">
                      {(() => {
                        const IconComponent = slides[currentSlide].icon;
                        return <IconComponent className="w-6 h-6 text-white" />;
                      })()}
                    </div>
                    <div>
                      <div className="text-sm text-blue-400 font-medium">
                        {slides[currentSlide].subtitle}
                      </div>
                      <h3 className="text-2xl font-bold">
                        {slides[currentSlide].title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {slides[currentSlide].description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {slides[currentSlide].features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        <span className="text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button className="btn-primary">
                      <Play className="mr-2 w-4 h-4" />
                      View Live Demo
                    </Button>
                    <Button variant="outline" className="btn-glass">
                      Learn More
                    </Button>
                  </div>
                </div>

                {/* Image */}
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden">
                    <img 
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  
                  {/* Slide Counter */}
                  <div className="absolute top-4 right-4 glass-card px-3 py-1 rounded-full">
                    <span className="text-sm font-medium">
                      {currentSlide + 1} / {slides.length}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                size="sm"
                variant="outline"
                className="btn-glass -ml-4"
                onClick={prevSlide}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                size="sm"
                variant="outline"
                className="btn-glass -mr-4"
                onClick={nextSlide}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 space-y-6">
            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-blue-500 h-1 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Slide Indicators & Controls */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'bg-blue-500 scale-125' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
              
              <Button
                size="sm"
                variant="outline"
                className="btn-glass"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
