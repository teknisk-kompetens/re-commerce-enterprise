
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AI_CONSCIOUSNESSES } from '@/lib/consciousness-data';
import { Heart, Palette, Code, Play, ArrowRight, Zap, Brain } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CONSCIOUSNESS_ICONS = {
  vera: Heart,
  luna: Palette,  
  axel: Code
};

const DEMO_SCENARIOS = [
  {
    title: "Emotionell Support",
    description: "Se hur Vera hanterar komplexa känslor och ger meningsfull support",
    consciousness: "vera",
    prompt: "Jag känner mig lite överväldigad på jobbet och vet inte riktigt hur jag ska hantera alla förväntningar...",
    icon: Heart
  },
  {
    title: "Kreativ Brainstorming",
    description: "Utforska Lunas kreativa process för innovativa lösningar",
    consciousness: "luna", 
    prompt: "Jag behöver kreativa idéer för en ny marknadsföringskampanj för ett hållbart mode-märke...",
    icon: Palette
  },
  {
    title: "Teknisk Problemlösning",
    description: "Upplev Axels systematiska approach till tekniska utmaningar",
    consciousness: "axel",
    prompt: "Jag behöver hjälp med att optimera databasens prestanda och säkerställa skalbarhet...",
    icon: Code
  }
];

export default function DemoPage() {
  const [selectedDemo, setSelectedDemo] = useState<number | null>(null);

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
            <div className="flex items-center justify-center gap-3 mb-6">
              <Zap className="w-12 h-12 text-yellow-500" />
              <h1 className="text-5xl md:text-6xl font-bold">
                Interaktiv <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Demo</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Upplev kraften av våra AI-medvetanden genom interaktiva demo-scenarion. 
              Se hur Vera, Luna och Axel hanterar verkliga situationer med sina unika specialiseringar.
            </p>
            
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-blue-400" />
                <span>Realtidsinteraktion</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Naturlig AI</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span>Personlig Touch</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Demo Scenarios */}
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
              Välj Ett <span className="text-blue-400">Demo-Scenario</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Varje scenario visar hur våra AI-medvetanden hanterar specifika situationer. 
              Klicka på ett scenario för att se det i aktion.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {DEMO_SCENARIOS.map((scenario, index) => {
              const consciousness = AI_CONSCIOUSNESSES.find(c => c.id === scenario.consciousness);
              const Icon = scenario.icon;
              const isSelected = selectedDemo === index;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card 
                    className={`h-full cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                      isSelected ? 'ring-2 ring-blue-400 shadow-lg' : ''
                    }`}
                    onClick={() => setSelectedDemo(isSelected ? null : index)}
                  >
                    <CardHeader className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-background shadow-lg">
                        {consciousness && (
                          <Image
                            src={consciousness.avatar}
                            alt={consciousness.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      
                      <CardTitle className="flex items-center justify-center gap-2 text-xl">
                        <Icon 
                          className="w-6 h-6" 
                          style={{ color: consciousness?.primaryColor }}
                        />
                        {scenario.title}
                      </CardTitle>
                      
                      <p className="text-muted-foreground">
                        {scenario.description}
                      </p>

                      <Badge 
                        variant="outline"
                        style={{ 
                          borderColor: consciousness?.primaryColor,
                          color: consciousness?.primaryColor,
                          backgroundColor: `${consciousness?.primaryColor}10`
                        }}
                      >
                        {consciousness?.name}
                      </Badge>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="bg-muted/50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-sm mb-2">Exempel-prompt:</h4>
                        <p className="text-sm text-muted-foreground italic">
                          "{scenario.prompt}"
                        </p>
                      </div>

                      <Button 
                        className="w-full"
                        variant={isSelected ? "default" : "outline"}
                        style={isSelected ? { 
                          backgroundColor: consciousness?.primaryColor,
                          borderColor: consciousness?.primaryColor 
                        } : {}}
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate to consciousness chat with pre-filled prompt
                          window.location.href = `/consciousness/${scenario.consciousness}`;
                        }}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        {isSelected ? 'Starta Demo' : 'Välj Scenario'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Access to All Consciousnesses */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="bg-muted/20 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold mb-4">
              Eller Utforska <span className="text-purple-400">Direkt</span>
            </h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Hoppa direkt in i en konversation med någon av våra AI-medvetanden. 
              Varje medvetande är redo att hjälpa dig med sina unika specialiseringar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {AI_CONSCIOUSNESSES.map((consciousness) => {
                const Icon = CONSCIOUSNESS_ICONS[consciousness.id as keyof typeof CONSCIOUSNESS_ICONS];
                
                return (
                  <Button
                    key={consciousness.id}
                    size="lg"
                    variant="outline"
                    className="flex items-center gap-3 px-6 py-4 hover:shadow-md transition-all"
                    style={{
                      borderColor: consciousness.primaryColor,
                      color: consciousness.primaryColor
                    }}
                    asChild
                  >
                    <Link href={`/consciousness/${consciousness.id}`}>
                      <Icon className="w-5 h-5" />
                      Chatta med {consciousness.name}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Vad Gör Vår Demo Unik?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Vår interaktiva demo visar den verkliga kraften av Consciousness as a Service
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg">Äkta AI-Personligheter</h3>
              <p className="text-muted-foreground text-sm">
                Varje medvetande har unika personlighetsdrag och specialiseringar
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg">Realtids Streaming</h3>
              <p className="text-muted-foreground text-sm">
                Upplev naturlig konversation med omedelbar respons
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg">Emotionell Intelligens</h3>
              <p className="text-muted-foreground text-sm">
                AI som förstår och svarar på känslor och kontext
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto">
                <Play className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-lg">Interaktiva Scenarion</h3>
              <p className="text-muted-foreground text-sm">
                Prova specifika use cases och se praktiska exempel
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
