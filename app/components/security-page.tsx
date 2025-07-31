
"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AI_CONSCIOUSNESSES, SECURITY_CLASSIFICATIONS } from '@/lib/consciousness-data';
import { 
  Shield, 
  Lock, 
  Eye, 
  Globe, 
  Building, 
  AlertTriangle,
  CheckCircle,
  Activity,
  Clock,
  Users,
  Database,
  Server,
  Zap
} from 'lucide-react';
import Image from 'next/image';

const SECURITY_METRICS = {
  uptime: 99.9,
  activeUsers: 1247,
  securityIncidents: 0,
  dataPoints: 2847329,
  encryptionLevel: 100,
  complianceScore: 98
};

const SECURITY_FEATURES = [
  {
    icon: Shield,
    title: "End-to-End Kryptering",
    description: "AES-256 kryptering för all datakommunikation",
    status: "active",
    details: "Alla meddelanden och data krypteras med militärstandard"
  },
  {
    icon: Eye,
    title: "Realtidsövervakning",
    description: "24/7 säkerhetsövervakning och hotidentifiering",
    status: "active",
    details: "AI-driven säkerhetsanalys upptäcker avvikelser omedelbart"
  },
  {
    icon: Lock,
    title: "Multifaktor Autentisering",
    description: "Förstärkt åtkomstkontroll för alla användare",
    status: "active",
    details: "Kombinerar lösenord, biometri och enhetsverifiering"
  },
  {
    icon: Database,
    title: "Säker Datalagring",
    description: "Krypterad lagring med geografisk redundans",
    status: "active",
    details: "Data replikeras säkert över flera datacenter"
  },
  {
    icon: AlertTriangle,
    title: "Hotidentifiering",
    description: "Avancerad ML-baserad hotdetektion",
    status: "active",
    details: "Maskinlärning identifierar och neutraliserar hot proaktivt"
  },
  {
    icon: CheckCircle,
    title: "GDPR Compliance",
    description: "Fullständig efterföljd av europeiska dataskyddregler",
    status: "verified",
    details: "Certifierad efterföljd av alla relevanta regelverk"
  }
];

const AUDIT_LOGS = [
  { timestamp: "2025-01-31 14:32:15", event: "User Authentication", level: "INFO", details: "Successful login from Stockholm, SE" },
  { timestamp: "2025-01-31 14:28:03", event: "Data Backup", level: "SUCCESS", details: "Automated backup completed successfully" },
  { timestamp: "2025-01-31 14:15:22", event: "Security Scan", level: "INFO", details: "Routine security scan - no threats detected" },
  { timestamp: "2025-01-31 13:45:18", event: "API Access", level: "INFO", details: "AI Consciousness API accessed - Vera interaction" },
  { timestamp: "2025-01-31 13:32:07", event: "System Health", level: "SUCCESS", details: "All systems operational - 99.9% uptime maintained" }
];

export default function SecurityPage() {
  const [securityMetrics, setSecurityMetrics] = useState(SECURITY_METRICS);
  const [isLive, setIsLive] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set client-side flag to prevent hydration mismatch
    setIsClient(true);
    
    // Simulate live updates
    const interval = setInterval(() => {
      setSecurityMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5) - 2,
        dataPoints: prev.dataPoints + Math.floor(Math.random() * 100) + 50
      }));
    }, 3000);

    setIsLive(true);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <Image
                  src="https://cdn.abacus.ai/images/3cb69c84-1290-4d7d-953f-0b975b9692a8.png"
                  alt="Security Dashboard"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold">
                Säkerhets<span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">dashboard</span>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              Realtidsövervakning av säkerhetsstatusen på vår CaaS-plattform. 
              Här kan administratörer övervaka säkerhetsklassificeringar, system-hälsa och compliance-status.
            </p>
            
            <div className="flex items-center justify-center gap-2 mt-6">
              {isClient && isLive && (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400 font-medium">LIVE</span>
                </>
              )}
            </div>
          </motion.div>

          {/* Real-time Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            <Card className="border-l-4 border-l-green-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                <Activity className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{securityMetrics.uptime}%</div>
                <p className="text-xs text-muted-foreground">+0.1% från förra månaden</p>
                <Progress value={securityMetrics.uptime} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aktiva Användare</CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">
                  {isClient ? securityMetrics.activeUsers.toLocaleString() : SECURITY_METRICS.activeUsers.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Realtidsanslutningar</p>
                {isClient && (
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
                    <span className="text-xs text-blue-400">Live</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-400">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Datahantering</CardTitle>
                <Database className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">
                  {isClient ? securityMetrics.dataPoints.toLocaleString() : SECURITY_METRICS.dataPoints.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Säkra datapunkter</p>
                {isClient && (
                  <div className="text-xs text-green-400 mt-1">+{Math.floor(Math.random() * 100) + 50} senaste timmen</div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Security Classifications */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-6">
              Säkerhets<span className="text-blue-400">klassificering</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Våra AI-medvetanden följer strikta säkerhetsklassificeringar för att säkerställa rätt nivå av åtkomst och skydd.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {Object.values(SECURITY_CLASSIFICATIONS).map((classification, index) => {
              const consciousnessCount = AI_CONSCIOUSNESSES.filter(c => c.securityLevel === classification.level).length;
              const IconComponent = classification.level === 'PUBLIC' ? Globe : 
                                  classification.level === 'INTERNAL' ? Building : Lock;
              
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
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <IconComponent 
                            className="w-8 h-8" 
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
                          {consciousnessCount} AI
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {classification.description}
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Aktiva Medvetanden:</h4>
                        {AI_CONSCIOUSNESSES
                          .filter(c => c.securityLevel === classification.level)
                          .map(consciousness => (
                            <div key={consciousness.id} className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full overflow-hidden">
                                <Image
                                  src={consciousness.avatar}
                                  alt={consciousness.name}
                                  width={24}
                                  height={24}
                                  className="object-cover"
                                />
                              </div>
                              <span className="text-sm">{consciousness.name}</span>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-6">
              Säkerhets<span className="text-green-400">funktioner</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Avancerade säkerhetslager som skyddar vår CaaS-plattform och dina data.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECURITY_FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              const statusColor = feature.status === 'active' ? 'green' : 
                                 feature.status === 'verified' ? 'blue' : 'yellow';
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-${statusColor}-100 dark:bg-${statusColor}-900/30 rounded-full flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 text-${statusColor}-600 dark:text-${statusColor}-400`} />
                          </div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 bg-${statusColor}-400 rounded-full animate-pulse`} />
                          <span className={`text-xs text-${statusColor}-400 uppercase font-medium`}>
                            {feature.status}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-3">
                        {feature.description}
                      </p>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground">
                          {feature.details}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Audit Logs */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-4xl font-bold">
                Säkerhets<span className="text-orange-400">logg</span>
              </h2>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Senaste aktiviteter</span>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Realtidsloggning av alla säkerhetsrelaterade händelser på plattformen.
            </p>
          </motion.div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Säkerhetsaktiviteter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {AUDIT_LOGS.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <Badge 
                        variant={log.level === 'SUCCESS' ? 'default' : 'outline'}
                        className={
                          log.level === 'SUCCESS' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          log.level === 'INFO' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        }
                      >
                        {log.level}
                      </Badge>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{log.event}</span>
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.details}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
