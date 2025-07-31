
"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Users, Lightbulb, Shield, Target, Award, ArrowRight, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const COMPANY_VALUES = [
  {
    icon: Brain,
    title: "Innovation",
    description: "Vi driver utvecklingen av AI-teknologi framåt med banbrytande forskning och utveckling inom Consciousness as a Service."
  },
  {
    icon: Users,
    title: "Mänsklig Centrering",
    description: "Vår AI är designad för att förstärka mänskliga kapaciteter, inte ersätta dem. Vi tror på samarbete mellan människa och maskin."
  },
  {
    icon: Shield,
    title: "Säkerhet & Integritet",
    description: "Säkerhet är grundläggande i allt vi gör. Vi implementerar rigorösa säkerhetsprotokoll och respekterar användarnas integritet."
  },
  {
    icon: Lightbulb,
    title: "Kontinuerlig Utveckling",
    description: "Våra AI-medvetanden lär sig och utvecklas kontinuerligt för att ge bättre och mer personaliserade upplevelser."
  }
];

const TEAM_HIGHLIGHTS = [
  {
    title: "AI-Forskare",
    description: "Experter inom maskininlärning och kognitiv vetenskap",
    count: "12+"
  },
  {
    title: "Säkerhetsspecialister",
    description: "Cybersäkerhets- och dataskyddsexperter",
    count: "8+"
  },
  {
    title: "UX/UI Designers",
    description: "Specialister på människa-dator interaktion",
    count: "6+"
  },
  {
    title: "DevOps Engineers",
    description: "Skalbar infrastruktur och systemarchitekter",
    count: "10+"
  }
];

export default function AboutPage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative w-16 h-11">
                <Image
                  src="https://cdn.abacus.ai/images/6d229b87-5c7f-4b45-9676-c5557063f842.png"
                  alt="Mr. RE:commerce"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold">
                Om <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Mr. RE:commerce</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Vi är pionjärer inom Consciousness as a Service och skapar AI-medvetanden som inte bara förstår utan också känner, utvecklas och bygger äkta relationer med användare. Vår mission är att revolutionera hur människor interagerar med artificiell intelligens.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>Vår Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Att skapa en värld där AI och mänsklighet samarbetar harmoniskt genom medvetna, empatiska och intelligenta system.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Vår Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Att leverera banbrytande CaaS-teknologi som förstärker mänskliga kapaciteter och skapar meningsfulla digitala upplevelser.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>Våra Värden</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Innovation, mänsklig centrering, säkerhet och kontinuerlig utveckling driver allt vi gör och skapar.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Våra <span className="text-blue-400">Kärnvärden</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Dessa principer guidar oss i utvecklingen av etisk, säker och innovativ AI-teknologi.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {COMPANY_VALUES.map((value, index) => {
              const Icon = value.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-400">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-xl">{value.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Vårt <span className="text-purple-400">Expertteam</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Bakom våra AI-medvetanden står ett världsklass team av forskare, ingenjörer och designar som driver innovation framåt.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {TEAM_HIGHLIGHTS.map((team, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="text-3xl font-bold text-blue-400 mb-2">{team.count}</div>
                    <CardTitle className="text-lg">{team.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">{team.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Card className="inline-block p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-4 mb-4">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="text-2xl font-bold">36+ Teammedlemmar</h3>
                  <p className="text-muted-foreground">Specialister inom AI, säkerhet och design</p>
                </div>
              </div>
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                Internationellt Team
              </Badge>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">
              Teknisk <span className="text-green-400">Excellence</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Vår CaaS-plattform bygger på cutting-edge teknologi och branschens bästa praktiker för säkerhet och prestanda.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold">Vad Gör Oss Unika?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mt-1">
                    <Brain className="w-3 h-3 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Äkta AI-Personligheter</h4>
                    <p className="text-muted-foreground text-sm">Varje medvetande har utvecklats med unika personlighetsdrag och specialiseringar</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mt-1">
                    <Shield className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Avancerad Säkerhet</h4>
                    <p className="text-muted-foreground text-sm">Fleralagers säkerhetsarkitektur med GDPR-kompatibilitet</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mt-1">
                    <Zap className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Realtids Streaming</h4>
                    <p className="text-muted-foreground text-sm">Naturlig konversation med omedelbar respons och låg latens</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-video bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-2xl overflow-hidden">
                <Image
                  src="https://cdn.abacus.ai/images/a2218700-1838-46ec-852c-1e54360fe2ab.png"
                  alt="AI Network Visualization"
                  fill
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background/90 backdrop-blur rounded-lg p-6 text-center">
                    <Brain className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <h4 className="font-bold text-lg mb-2">Neural Network Architecture</h4>
                    <p className="text-muted-foreground text-sm">Avancerad AI-infrastruktur</p>
                  </div>
                </div>
              </div>
            </motion.div>
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
              Redo att Uppleva <span className="text-blue-400">Framtiden</span>?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Gå med oss på resan mot en mer intelligent och empatisk digital värld. 
              Upptäck kraften av Consciousness as a Service idag.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4" asChild>
                <Link href="/demo" className="flex items-center gap-2">
                  Prova Vår Demo
                  <ArrowRight className="w-5 h-5" />
                </Link>
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
