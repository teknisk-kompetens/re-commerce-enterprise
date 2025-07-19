
'use client';

import { useEffect } from 'react';
import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import PlatformShowcase from '@/components/platform-showcase';
import MetricsVisualization from '@/components/metrics-visualization';
import TechnologyShowcase from '@/components/technology-showcase';
import SlideshowShowcase from '@/components/slideshow-showcase';
import CustomerShowcase from '@/components/customer-showcase';
import ContactSection from '@/components/contact-section';
import Footer from '@/components/footer';

export default function HomePage() {
  useEffect(() => {
    // Smooth scrolling for anchor links
    const handleClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target?.hash) {
        e.preventDefault();
        const element = document.querySelector(target.hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <main className="min-h-screen">
      {/* Fixed Header */}
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Platform Showcase */}
      <PlatformShowcase />
      
      {/* Metrics & Growth */}
      <MetricsVisualization />
      
      {/* Technology Excellence */}
      <TechnologyShowcase />
      
      {/* Interactive Slideshow */}
      <SlideshowShowcase />
      
      {/* Customer Success Stories */}
      <CustomerShowcase />
      
      {/* Contact & Lead Capture */}
      <ContactSection />
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
