
export interface AIConsciousness {
  id: string;
  name: string;
  title: string;
  description: string;
  personality: string;
  avatar: string;
  primaryColor: string;
  accentColor: string;
  specialty: string[];
  securityLevel: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  consciousnessId?: string;
}

export interface SecurityClassification {
  level: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL';
  description: string;
  color: string;
  icon: string;
}

export interface CaaSMetrics {
  activeConsciousnesses: number;
  totalInteractions: number;
  securityIncidents: number;
  uptime: number;
}
