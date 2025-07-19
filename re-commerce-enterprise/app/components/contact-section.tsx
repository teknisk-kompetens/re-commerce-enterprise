
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  Sparkles,
  Building2,
  User,
  MessageSquare
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
  interest: string;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    message: '',
    interest: 'ecosystem-demo'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          company: '',
          message: '',
          interest: 'ecosystem-demo'
        });
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'contact@re-commerce.se',
      description: 'Get in touch for inquiries and support'
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+46 8 123 456 78',
      description: 'Direct line to our experts'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: 'Stockholm, Sweden',
      description: 'Headquarters in the heart of innovation'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Mon-Fri 9:00-17:00 CET',
      description: '24/7 enterprise support available'
    }
  ];

  const interestOptions = [
    { value: 'ecosystem-demo', label: '4-System Ecosystem Demo' },
    { value: 'bankid-integration', label: 'BankID Integration Solution' },
    { value: 'swedish-market', label: 'Swedish Market Dominance' },
    { value: 'investment', label: 'Investment Discussion (ALMI/BIZMAKER)' },
    { value: 'gdpr-compliance', label: 'GDPR Compliance Consultation' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-black/20 to-transparent">
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
            Dominera <span className="gradient-text">Svenska Marknaden</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Redo att leda svenska marknaden? Kontakta våra experter för en personlig konsultation 
            om vårt kompletta 4-system ekosystem med BankID och GDPR-integration.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card p-8 rounded-2xl"
          >
            {!isSubmitted ? (
              <>
                <div className="flex items-center space-x-3 mb-8">
                  <div className="p-3 bg-blue-500 rounded-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Starta Din Ekosystem-Resa</h3>
                    <p className="text-gray-400">Diskutera svenska marknadens möjligheter</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        name="name"
                        placeholder="Full Name *"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      name="company"
                      placeholder="Company Name *"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                      {interestOptions.map((option) => (
                        <option key={option.value} value={option.value} className="bg-gray-800">
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Textarea
                      name="message"
                      placeholder="Tell us about your project and requirements..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="btn-primary w-full group"
                  >
                    {isSubmitting ? (
                      'Sending...'
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By submitting this form, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex p-4 bg-green-500/20 rounded-full mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-green-400" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4">Message Sent Successfully!</h3>
                <p className="text-gray-300 mb-6">
                  Thank you for your interest. Our team will get back to you within 24 hours.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  variant="outline"
                  className="btn-glass"
                >
                  Send Another Message
                </Button>
              </div>
            )}
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 rounded-lg"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      <info.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{info.title}</h4>
                      <p className="text-blue-400 font-medium mb-1">{info.value}</p>
                      <p className="text-sm text-gray-400">{info.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Enterprise Support */}
            <div className="glass-card p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10">
              <h4 className="text-xl font-bold mb-4">Enterprise Support</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">24/7 Priority Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Dedicated Account Manager</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Custom Implementation Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300">Training & Onboarding</span>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">&lt;24h</div>
                <div className="text-xs text-gray-500">Response Time</div>
              </div>
              <div className="glass-card p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">100%</div>
                <div className="text-xs text-gray-500">Satisfaction</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
