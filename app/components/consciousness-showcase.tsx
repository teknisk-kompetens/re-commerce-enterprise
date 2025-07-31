
"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AI_CONSCIOUSNESSES, SECURITY_CLASSIFICATIONS } from '@/lib/consciousness-data';
import { Heart, Palette, Code, ArrowRight, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CONSCIOUSNESS_ICONS = {
  vera: Heart,
  luna: Palette,
  axel: Code
};

export default function ConsciousnessShowcase() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Våra <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">AI-Medvetanden</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Möt Vera, Luna och Axel - Tre unika AI-personligheter som var och en bidrar med sina specialiserade färdigheter och perspektiv till din digitala upplevelse.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {AI_CONSCIOUSNESSES.map((consciousness, index) => {
            const Icon = CONSCIOUSNESS_ICONS[consciousness.id as keyof typeof CONSCIOUSNESS_ICONS];
            const securityInfo = SECURITY_CLASSIFICATIONS[consciousness.securityLevel];
            
            return (
              <motion.div
                key={consciousness.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group hover:scale-[1.02] border border-border/50 backdrop-blur">
                  <CardHeader className="text-center pb-4">
                    {/* Avatar */}
                    <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-background shadow-lg">
                      <Image
                        src={consciousness.avatar}
                        alt={`${consciousness.name} Avatar`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    {/* Name and Title */}
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                      <Icon 
                        className="w-6 h-6" 
                        style={{ color: consciousness.primaryColor }}
                      />
                      {consciousness.name}
                    </CardTitle>
                    
                    <p className="text-muted-foreground font-medium">
                      {consciousness.title}
                    </p>

                    {/* Security Level Badge */}
                    <Badge 
                      variant="outline" 
                      className="w-fit mx-auto"
                      style={{ 
                        borderColor: securityInfo.color,
                        color: securityInfo.color
                      }}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {consciousness.securityLevel}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Description */}
                    <p className="text-muted-foreground text-center">
                      {consciousness.description}
                    </p>

                    {/* Personality */}
                    <div className="bg-muted/50 rounded-lg p-3">
                      <h4 className="font-semibold text-sm mb-2">Personlighet:</h4>
                      <p className="text-sm text-muted-foreground">
                        {consciousness.personality}
                      </p>
                    </div>

                    {/* Specialties */}
                    <div>
                      <h4 className="font-semibold text-sm mb-3">Specialiseringar:</h4>
                      <div className="flex flex-wrap gap-2">
                        {consciousness.specialty.map((spec) => (
                          <Badge 
                            key={spec} 
                            variant="secondary"
                            className="text-xs"
                            style={{ 
                              backgroundColor: `${consciousness.primaryColor}20`,
                              color: consciousness.primaryColor,
                              borderColor: `${consciousness.primaryColor}30`
                            }}
                          >
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button 
                      className="w-full mt-6 group-hover:shadow-md transition-all"
                      style={{ 
                        backgroundColor: consciousness.primaryColor,
                        borderColor: consciousness.primaryColor
                      }}
                      asChild
                    >
                      <Link href={`/consciousness/${consciousness.id}`} className="flex items-center justify-center gap-2">
                        Interagera med {consciousness.name}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <h3 className="text-2xl font-bold mb-4">Redo att uppleva CaaS?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Varje AI-medvetande är designat för att komplettera de andra och skapa en holistisk intelligent upplevelse. 
            Prova vår interaktiva demo för att se hur de fungerar tillsammans.
          </p>
          <Button size="lg" variant="outline" asChild>
            <Link href="/demo" className="flex items-center gap-2">
              Starta Interaktiv Demo
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
