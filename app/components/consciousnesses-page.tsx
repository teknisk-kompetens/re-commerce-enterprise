
"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AI_CONSCIOUSNESSES, SECURITY_CLASSIFICATIONS } from '@/lib/consciousness-data';
import { Heart, Palette, Code, ArrowRight, Shield, Star, Clock, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CONSCIOUSNESS_ICONS = {
  vera: Heart,
  luna: Palette,
  axel: Code
};

export default function ConsciousnessesPage() {
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
              AI-<span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Medvetanden</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Tre unika AI-personligheter som vardera bidrar med sina specialiserade färdigheter. 
              Varje medvetande har utvecklats för att komplettera de andra och skapa en holistisk intelligent upplevelse.
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">3</div>
                <div className="text-sm text-muted-foreground">Medvetanden</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">24/7</div>
                <div className="text-sm text-muted-foreground">Tillgängliga</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">∞</div>
                <div className="text-sm text-muted-foreground">Möjligheter</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Consciousnesses Grid */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {AI_CONSCIOUSNESSES.map((consciousness, index) => {
              const Icon = CONSCIOUSNESS_ICONS[consciousness.id as keyof typeof CONSCIOUSNESS_ICONS];
              const securityInfo = SECURITY_CLASSIFICATIONS[consciousness.securityLevel];
              
              return (
                <motion.div
                  key={consciousness.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.03] border border-border/50 backdrop-blur overflow-hidden">
                    {/* Header with gradient background */}
                    <div 
                      className="h-32 bg-gradient-to-br opacity-20"
                      style={{
                        background: `linear-gradient(135deg, ${consciousness.primaryColor}40, ${consciousness.accentColor}40)`
                      }}
                    />
                    
                    <CardHeader className="text-center pb-4 -mt-16 relative z-10">
                      {/* Avatar */}
                      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-background shadow-xl">
                        <Image
                          src={consciousness.avatar}
                          alt={`${consciousness.name} Avatar`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      
                      {/* Name and Title */}
                      <CardTitle className="flex items-center justify-center gap-3 text-3xl mb-2">
                        <Icon 
                          className="w-8 h-8" 
                          style={{ color: consciousness.primaryColor }}
                        />
                        {consciousness.name}
                      </CardTitle>
                      
                      <p className="text-muted-foreground font-medium text-lg">
                        {consciousness.title}
                      </p>

                      {/* Security Level Badge */}
                      <Badge 
                        variant="outline" 
                        className="w-fit mx-auto mt-2"
                        style={{ 
                          borderColor: securityInfo.color,
                          color: securityInfo.color,
                          backgroundColor: `${securityInfo.color}10`
                        }}
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {consciousness.securityLevel}
                      </Badge>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed">
                        {consciousness.description}
                      </p>

                      {/* Personality */}
                      <div className="bg-muted/50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <h4 className="font-semibold">Personlighet:</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {consciousness.personality}
                        </p>
                      </div>

                      {/* Specialties */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Specialiseringar:
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {consciousness.specialty.map((spec) => (
                            <Badge 
                              key={spec} 
                              variant="secondary"
                              className="text-xs justify-center py-2"
                              style={{ 
                                backgroundColor: `${consciousness.primaryColor}15`,
                                color: consciousness.primaryColor,
                                borderColor: `${consciousness.primaryColor}30`
                              }}
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Features */}
                      <div className="space-y-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Funktioner:
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Realtidsinteraktion via streaming</li>
                          <li>• Naturlig språkförståelse</li>
                          <li>• Kontextuell medvetenhet</li>
                          <li>• Säker datahantering</li>
                        </ul>
                      </div>

                      {/* CTA Button */}
                      <Button 
                        className="w-full mt-6 group-hover:shadow-lg transition-all h-12 text-base"
                        style={{ 
                          backgroundColor: consciousness.primaryColor,
                          borderColor: consciousness.primaryColor
                        }}
                        asChild
                      >
                        <Link href={`/consciousness/${consciousness.id}`} className="flex items-center justify-center gap-2">
                          Chatta med {consciousness.name}
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Upplev Kraften av <span className="text-blue-400">Kollektiv Intelligens</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Varje AI-medvetande är utformat för att samverka och komplettera de andra. 
              Tillsammans skapar de en mäktig och mångseidig intelligent partner för dina behov.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4" asChild>
                <Link href="/demo">Prova Interaktiv Demo</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4" asChild>
                <Link href="/contact">Kontakta Oss</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
