
import { ENTERPRISE_APPLICATIONS, FEATURE_CARDS, APPLICATION_CATEGORIES } from '@/lib/applications-data';
import { ArrowRight, Search, Sparkles, Zap, Shield, Globe, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/70 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 rounded-xl">
                <span className="text-sm font-bold text-white">RE</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RE:commerce Enterprise
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link href="/docs" className="text-gray-600 hover:text-blue-600 transition-colors">
                Documentation
              </Link>
              <Link href="/enterprise" className="text-gray-600 hover:text-blue-600 transition-colors">
                Enterprise
              </Link>
              <Button variant="outline" size="sm">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600 rounded-xl mx-auto mb-4">
                <span className="text-4xl font-bold text-white">RE</span>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Enterprise Platform
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Complete enterprise transformation with {ENTERPRISE_APPLICATIONS.length} production-ready applications, 
              advanced AI capabilities, and enterprise-grade security.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder={`Search ${ENTERPRISE_APPLICATIONS.length} enterprise applications...`}
                  className="pl-12 pr-4 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500 shadow-lg"
                />
                <Button 
                  size="lg" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-8"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Stats Display */}
            <div className="flex flex-wrap justify-center gap-8 mb-16 text-center">
              <div className="bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{ENTERPRISE_APPLICATIONS.length}</div>
                <div className="text-sm text-gray-600">Enterprise Apps</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200">
                <div className="text-2xl font-bold text-purple-600">{APPLICATION_CATEGORIES.length}</div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Applications Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Enterprise Suite
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {ENTERPRISE_APPLICATIONS.length} production-ready applications covering every aspect of your enterprise needs.
            </p>
          </div>
          
          {/* Applications Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {ENTERPRISE_APPLICATIONS.map((app, index) => (
              <div
                key={app.id}
                className="group p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-2xl">{app.icon}</div>
                  <Badge variant="secondary" className="text-xs">
                    {app.category}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight group-hover:text-blue-600 transition-colors">
                  {app.name}
                </h3>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed line-clamp-2">
                  {app.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${app.status === 'active' ? 'bg-green-500' : 'bg-gray-400'} mr-2`}></div>
                    <span className="text-xs text-gray-500 capitalize">{app.status}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Load More / View All */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Showing all {ENTERPRISE_APPLICATIONS.length} enterprise applications
            </p>
            <Button variant="outline" size="lg" className="px-8">
              <Globe className="w-4 h-4 mr-2" />
              Explore All Features
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for scale, security, and performance with advanced AI integration.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURE_CARDS.map((feature, index) => (
              <div
                key={index}
                className="group p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 bg-white hover:bg-gradient-to-br hover:from-white hover:to-blue-50"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <Button variant="ghost" className="group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors p-0 h-auto">
                  Learn more
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime Guarantee</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50ms</div>
              <div className="text-blue-100">Average Response</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">128-bit</div>
              <div className="text-blue-100">Encryption</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Enterprise Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Enterprise?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Access all {ENTERPRISE_APPLICATIONS.length} applications and transform your organization today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="px-8 py-4 text-lg">
              <Globe className="w-5 h-5 mr-2" />
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 rounded-xl">
                  <span className="text-xs font-bold text-white">RE</span>
                </div>
                <span className="text-lg font-semibold">RE:commerce Enterprise</span>
              </div>
              <p className="text-gray-400">
                Enterprise-grade platform with {ENTERPRISE_APPLICATIONS.length} applications.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/guides" className="hover:text-white transition-colors">Guides</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
                <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RE:commerce Enterprise. All rights reserved. {ENTERPRISE_APPLICATIONS.length} Applications Available.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
