
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Brain, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CONTACT_INFO = [
  {
    icon: Mail,
    title: "Email",
    content: "info@mrrecommerce.se",
    description: "Vi svarar inom 24 timmar"
  },
  {
    icon: Phone,
    title: "Telefon",
    content: "+46 8 123 456 78",
    description: "Vardagar 09:00-17:00"
  },
  {
    icon: MapPin,
    title: "Adress",
    content: "Stockholm, Sverige",
    description: "Skandinaviens AI-centrum"
  },
  {
    icon: Clock,
    title: "Öppettider",
    content: "Måndag-Fredag",
    description: "09:00-17:00 CET"
  }
];

const INQUIRY_TYPES = [
  {
    value: "demo",
    label: "Demo & Utvärdering",
    icon: Brain,
    description: "Intresserad av att testa vår CaaS-plattform"
  },
  {
    value: "integration",
    label: "Integration & Samarbete",
    icon: MessageSquare,
    description: "Diskutera teknisk integration och partnerships"
  },
  {
    value: "security",
    label: "Säkerhet & Compliance",
    icon: Shield,
    description: "Frågor om säkerhet, GDPR och compliance"
  },
  {
    value: "general",
    label: "Allmänna Frågor",
    icon: Mail,
    description: "Övriga frågor om våra tjänster"
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    inquiryType: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission - in real app, send to backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Meddelande skickat!",
        description: "Tack för ditt intresse. Vi kommer att kontakta dig inom 24 timmar.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        inquiryType: '',
        subject: '',
        message: ''
      });

    } catch (error) {
      toast({
        title: "Något gick fel",
        description: "Försök igen senare eller kontakta oss direkt via email.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Kontakta <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Oss</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Har du frågor om vår CaaS-plattform eller vill diskutera hur våra AI-medvetanden kan hjälpa ditt företag? 
              Vi ser fram emot att höra från dig.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {CONTACT_INFO.map((info, index) => {
              const Icon = info.icon;
              
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold mb-2">{info.content}</p>
                    <p className="text-muted-foreground text-sm">{info.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="p-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Skicka ett Meddelande</CardTitle>
                  <p className="text-muted-foreground">
                    Fyll i formuläret så kontaktar vi dig inom 24 timmar.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Namn *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Ditt namn"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="din@email.se"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Företag</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Ditt företag (valfritt)"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="inquiryType">Typ av förfrågan</Label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-border rounded-md bg-background"
                      >
                        <option value="">Välj typ av förfrågan</option>
                        {INQUIRY_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Ämne *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="Kort beskrivning av ditt ärende"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Meddelande *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        placeholder="Berätta mer om dina behov och frågor..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Skickar...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Skicka Meddelande
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Inquiry Types */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-2xl font-bold mb-4">Vad kan vi hjälpa dig med?</h3>
                <p className="text-muted-foreground mb-8">
                  Välj det område som bäst beskriver ditt intresse så kan vi ge dig mer riktad information.
                </p>
              </div>

              <div className="space-y-4">
                {INQUIRY_TYPES.map((type, index) => {
                  const Icon = type.icon;
                  
                  return (
                    <motion.div
                      key={type.value}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-400"
                            onClick={() => setFormData(prev => ({ ...prev, inquiryType: type.value }))}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                              <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold mb-1">{type.label}</h4>
                              <p className="text-muted-foreground text-sm">{type.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              <Card className="bg-muted/30 border-2 border-dashed border-muted-foreground/30">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Behöver du omedelbar hjälp?</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    För akuta frågor eller teknisk support, kontakta oss direkt.
                  </p>
                  <Button variant="outline" size="sm">
                    Ring +46 8 123 456 78
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
