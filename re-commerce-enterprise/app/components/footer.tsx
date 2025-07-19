
'use client';

import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github,
  Award,
  Shield,
  Globe
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Enterprise Dashboard', href: '#platform' },
        { name: 'Technology Stack', href: '#technology' },
        { name: 'Security & Compliance', href: '#security' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About re:Commerce', href: '#about' },
        { name: 'Customer Stories', href: '#customers' },
        { name: 'Contact Us', href: '#contact' }
      ]
    }
  ];

  const certifications = [
    { name: 'ISO 27001', icon: Shield },
    { name: 'GDPR Compliant', icon: Globe },
    { name: 'SOC 2 Type II', icon: Award }
  ];

  return (
    <footer className="bg-gradient-to-t from-black to-transparent pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">re:</span>
              </div>
              <div>
                <div className="text-xl font-bold gradient-text">Commerce Enterprise</div>
                <div className="text-sm text-gray-400">Från Digitala Arkitekter till Plattformsinnovatörer</div>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-gray-300 max-w-md leading-relaxed"
            >
              World-class enterprise e-commerce platform trusted by 250+ customers across 15+ years 
              of innovation. Swedish precision meets global ambition.
            </motion.p>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>contact@re-commerce.se</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+46 8 123 456 78</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Stockholm, Sweden</span>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (index + 1) * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h4 className="font-semibold text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-blue-400 transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h4 className="font-semibold text-white mb-6 text-center">Security & Compliance</h4>
          <div className="flex flex-wrap justify-center gap-6">
            {certifications.map((cert, index) => (
              <div key={cert.name} className="glass-card p-4 rounded-lg flex items-center space-x-3">
                <cert.icon className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-300">{cert.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-white/10 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} re:Commerce Enterprise. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com/company/re-commerce"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-gray-400 hover:text-blue-400" />
              </a>
              <a
                href="https://github.com/re-commerce"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Github className="w-5 h-5 text-gray-400 hover:text-white" />
              </a>
            </div>

            {/* Made in Sweden */}
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>🇸🇪</span>
              <span>Made in Sweden</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
