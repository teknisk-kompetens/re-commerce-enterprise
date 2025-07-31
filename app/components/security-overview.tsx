
"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SECURITY_CLASSIFICATIONS } from '@/lib/consciousness-data';
import { Shield, Lock, Eye, Globe, Building, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

const SECURITY_ICONS = {
  PUBLIC: Globe,
  INTERNAL: Building,
  CONFIDENTIAL: Lock
};

export default function SecurityOverview() {
  return (
    <section className="py-20">
      <div className="container max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative w-12 h-12">
              <Image
                src="https://cdn.abacus.ai/images/3cb69c84-1290-4d7d-953f-0b975b9692a8.png"
                alt="Security Icon"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Säkerhetsprotokoll</span>
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Vår CaaS-plattform implementerar rigorösa säkerhetsklassificeringar för att säkerställa att rätt information når rätt personer vid rätt tid.
          </p>
        </motion.div>

        {/* Security Classifications */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {Object.values(SECURITY_CLASSIFICATIONS).map((classification, index) => {
            const Icon = SECURITY_ICONS[classification.level];
            
            return (
              <motion.div
                key={classification.level}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4" 
                      style={{ borderLeftColor: classification.color }}>
                  <CardHeader className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <Icon 
                        className="w-6 h-6" 
                        style={{ color: classification.color }}
                      />
                      <CardTitle className="text-xl">{classification.level}</CardTitle>
                    </div>
                    <Badge 
                      variant="outline"
                      style={{ 
                        borderColor: classification.color,
                        color: classification.color,
                        backgroundColor: `${classification.color}10`
                      }}
                    >
                      Säkerhetsnivå
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center">
                      {classification.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Security Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="bg-muted/20 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Säkerhetsfunktioner</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold">End-to-End Kryptering</h4>
              <p className="text-sm text-muted-foreground">All kommunikation krypteras från början till slut</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold">Åtkomstloggning</h4>
              <p className="text-sm text-muted-foreground">Fullständig loggning av alla interaktioner</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold">Rollbaserad Åtkomst</h4>
              <p className="text-sm text-muted-foreground">Begränsad åtkomst baserat på användarroll</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-semibold">Realtidsövervakning</h4>
              <p className="text-sm text-muted-foreground">Kontinuerlig övervakning av säkerhetshot</p>
            </div>
          </div>
        </motion.div>

        {/* Compliance Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12 p-6 bg-card border border-border/50 rounded-lg"
        >
          <Shield className="w-8 h-8 text-green-500 mx-auto mb-4" />
          <h4 className="font-semibold text-lg mb-2">GDPR & Säkerhetsstandard Kompatibel</h4>
          <p className="text-muted-foreground">
            Vår CaaS-plattform följer strikta europeiska dataskyddregler och branschstandarder för säkerhet. 
            All data behandlas enligt GDPR-principer med fullständig transparens och användarkontroll.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
