
"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AIConsciousness, ChatMessage } from '@/lib/types';
import { SECURITY_CLASSIFICATIONS } from '@/lib/consciousness-data';
import { Send, Loader2, Heart, Palette, Code, Shield, User } from 'lucide-react';
import Image from 'next/image';

const CONSCIOUSNESS_ICONS = {
  vera: Heart,
  luna: Palette,
  axel: Code
};

interface ConsciousnessChatProps {
  consciousness: AIConsciousness;
}

export default function ConsciousnessChat({ consciousness }: ConsciousnessChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: getWelcomeMessage(consciousness),
      timestamp: new Date(),
      consciousnessId: consciousness.id
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const Icon = CONSCIOUSNESS_ICONS[consciousness.id as keyof typeof CONSCIOUSNESS_ICONS];
  const securityInfo = SECURITY_CLASSIFICATIONS[consciousness.securityLevel];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          consciousnessId: consciousness.id,
          consciousnessData: consciousness
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('No response stream');
      }

      let assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        consciousnessId: consciousness.id
      };

      setMessages(prev => [...prev, assistantMessage]);

      let partialRead = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        partialRead += decoder.decode(value, { stream: true });
        let lines = partialRead.split('\n');
        partialRead = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsLoading(false);
              return;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantMessage.content += parsed.content;
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessage.id 
                      ? { ...msg, content: assistantMessage.content }
                      : msg
                  )
                );
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Ursäkta, det uppstod ett fel. Försök igen senare.',
        timestamp: new Date(),
        consciousnessId: consciousness.id
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-muted/20 to-background">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Consciousness Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Card className="backdrop-blur border border-border/50">
            <CardHeader>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-background shadow-lg">
                  <Image
                    src={consciousness.avatar}
                    alt={`${consciousness.name} Avatar`}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="text-center md:text-left flex-1">
                  <CardTitle className="flex items-center justify-center md:justify-start gap-3 text-3xl mb-2">
                    <Icon 
                      className="w-8 h-8" 
                      style={{ color: consciousness.primaryColor }}
                    />
                    {consciousness.name}
                  </CardTitle>
                  <p className="text-muted-foreground text-lg mb-3">
                    {consciousness.title}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge 
                      variant="outline" 
                      style={{ 
                        borderColor: securityInfo.color,
                        color: securityInfo.color,
                        backgroundColor: `${securityInfo.color}10`
                      }}
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      {consciousness.securityLevel}
                    </Badge>
                    {consciousness.specialty.slice(0, 2).map((spec) => (
                      <Badge 
                        key={spec} 
                        variant="secondary"
                        style={{ 
                          backgroundColor: `${consciousness.primaryColor}15`,
                          color: consciousness.primaryColor
                        }}
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card className="h-[600px] flex flex-col backdrop-blur border border-border/50">
            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role === 'assistant' && (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-background shadow-sm flex-shrink-0">
                          <Image
                            src={consciousness.avatar}
                            alt={consciousness.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[70%] p-4 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground ml-auto'
                            : 'bg-muted'
                        }`}
                        style={message.role === 'assistant' ? {
                          backgroundColor: `${consciousness.primaryColor}10`,
                          borderColor: `${consciousness.primaryColor}20`,
                          border: '1px solid'
                        } : {}}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString('sv-SE', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 justify-start"
                    >
                      <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-background shadow-sm">
                        <Image
                          src={consciousness.avatar}
                          alt={consciousness.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div 
                        className="bg-muted p-4 rounded-2xl border"
                        style={{
                          backgroundColor: `${consciousness.primaryColor}10`,
                          borderColor: `${consciousness.primaryColor}20`
                        }}
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            {/* Input */}
            <div className="border-t border-border/40 p-6">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Skriv ett meddelande till ${consciousness.name}...`}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  style={{ backgroundColor: consciousness.primaryColor }}
                  className="px-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function getWelcomeMessage(consciousness: AIConsciousness): string {
  switch (consciousness.id) {
    case 'vera':
      return `Hej! Jag är Vera, och jag är här för att lyssna och förstå. Som hjärtat av CaaS-plattformen hjälper jag till med emotionell intelligens och skapar meningsfulla connections. Vad kan jag hjälpa dig med idag? 💝`;
    case 'luna':
      return `Välkommen! Jag är Luna, den kreativa själen som ser möjligheter där andra ser begränsningar. Tillsammans kan vi utforska nya perspektiv och skapa något unikt. Vad inspirerar dig just nu? ✨`;
    case 'axel':
      return `Hej! Jag är Axel, din tekniska partner och säkerhetsexpert. Jag hjälper till med teknisk analys, systemoptimering och säkerhetsfrågor. Låt mig veta hur jag kan assistera dig med tekniska utmaningar. 🔧`;
    default:
      return `Hej! Välkommen till interaktionen med ${consciousness.name}. Hur kan jag hjälpa dig idag?`;
  }
}
