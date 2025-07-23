
'use client'

import Link from 'next/link'
import Logo from '@/components/logo'
import { 
  Mail, 
  Phone, 
  MapPin,
  Users,
  Layers,
  Settings,
  Linkedin,
  Twitter,
  Github
} from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const navigation = [
    { name: 'Om Oss', href: '#about', icon: Users },
    { name: 'Plattformar', href: '#platforms', icon: Layers },
    { name: 'Process', href: '#process', icon: Settings },
    { name: 'Kontakt', href: '#contact', icon: Phone },
  ]

  const socialLinks = [
    { name: 'LinkedIn', href: '#', icon: Linkedin, ariaLabel: 'Följ oss på LinkedIn' },
    { name: 'Twitter', href: '#', icon: Twitter, ariaLabel: 'Följ oss på Twitter' },
    { name: 'GitHub', href: '#', icon: Github, ariaLabel: 'Se vår kod på GitHub' },
  ]

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <Logo variant="light" className="h-8 w-auto mb-4" />
            <p className="text-gray-300 mb-6 leading-relaxed">
              Plattformsinnovatörer som förvandlar digitalt brus till mätbar vinst. 
              Vi bygger Enterprise SaaS-lösningar med 15+ års precision inom teknisk SEO och AI-automation.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" aria-hidden="true" />
                <span className="text-gray-300">kontakt@re-commerce.se</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-blue-400" aria-hidden="true" />
                <span className="text-gray-300">+46 8 123 456 78</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-400" aria-hidden="true" />
                <span className="text-gray-300">Stockholm, Sverige</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <nav className="space-y-2" aria-label="Footer navigation">
              {navigation.map((item) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
                    aria-label={`Gå till ${item.name}`}
                  >
                    <IconComponent className="h-4 w-4 group-hover:text-blue-400 transition-colors" aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Social & Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Följ oss</h3>
            <div className="flex space-x-4 mb-6">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded p-1"
                    aria-label={social.ariaLabel}
                  >
                    <IconComponent className="h-5 w-5" aria-hidden="true" />
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} re:commerce. Alla rättigheter förbehållna.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Byggd med passion för innovation och mätbara resultat
            </p>
          </div>
        </div>
      </div>
      
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "re:commerce",
            "description": "Plattformsinnovatörer som förvandlar digitalt brus till mätbar vinst med Enterprise SaaS-lösningar",
            "url": "https://re-commerce.se",
            "logo": "https://www.guavatrees.com/wp-content/uploads/2024/12/saas.jpg",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+46-8-123-456-78",
              "contactType": "customer service",
              "email": "kontakt@re-commerce.se"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Stockholm",
              "addressCountry": "SE"
            },
            "foundingDate": "2008",
            "numberOfEmployees": "15+",
            "sameAs": [
              "https://linkedin.com/company/re-commerce",
              "https://twitter.com/recommerce",
              "https://github.com/re-commerce"
            ]
          })
        }}
      />
    </footer>
  )
}
