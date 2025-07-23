
export interface CampaignLevel {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  description: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    gradient: string;
  };
  features: string[];
  cta: string;
  heroImage: string;
}

export const campaignLevels: CampaignLevel[] = [
  {
    id: 1,
    key: "verktygslada",
    title: "KOMPLETT EKOSYSTEM",
    subtitle: "4 kraftfulla system som dominerar svenska marknaden 🇸🇪",
    description: "re:Commerce Enterprise – komplett ekosystem med BankID-integration, GDPR-compliance och multi-tenant arkitektur. Inte bara en plattform, utan fyra sammankopplade system för svensk enterprise-dominans.",
    theme: {
      primary: "#1e40af",
      secondary: "#3b82f6", 
      accent: "#60a5fa",
      background: "#f8fafc",
      gradient: "from-blue-50 via-white to-blue-50"
    },
    features: [
      "🏢 re:Commerce Enterprise Platform (Multi-tenant E-handel)",
      "🔐 BankID Integration Suite (Svenska marknaden)",
      "👥 Mina Sidor White-Label Platform (Kundportaler)",
      "🚀 ROBIN Deployment System (Enterprise deployment)",
      "🛡️ GDPR-compliance & Enterprise säkerhet",
      "📊 54 MD-filer utvecklingsdokumentation"
    ],
    cta: "Utforska Ekosystemet",
    heroImage: "https://thumbs.dreamstime.com/b/roller-paints-wall-colors-swedish-flag-travel-concept-sweden-d-render-roller-paints-wall-colors-swedish-flag-254357212.jpg"
  },
  {
    id: 2,
    key: "hjalten",
    title: "SVENSKA MARKNADEN HJÄLTE",
    subtitle: "Bli hjälten med BankID-integration och GDPR compliance 🏆",
    description: "Förvandla dig till den tekniska hjälten svenska företag behöver. Med BankID-integration får du omedelbar konkurrensfördel och GDPR-compliance bygger förtroende som ingen annan kan matcha.",
    theme: {
      primary: "#d97706",
      secondary: "#f59e0b",
      accent: "#fbbf24", 
      background: "#fffbeb",
      gradient: "from-amber-50 via-yellow-50 to-orange-50"
    },
    features: [
      "🔐 BankID-integration för svensk legitimering",
      "🛡️ GDPR-compliance som förtroendebyggare",
      "🇸🇪 Svenska tillgänglighetskrav (WCAG)",
      "⚡ Enterprise-grade säkerhetslösningar",
      "📈 Konkurrensfördel genom teknisk excellens",
      "🎯 Specialiserad svensk marknadskunskap"
    ],
    cta: "Bli Svenska Marknaden Hjälte",
    heroImage: "https://i.ytimg.com/vi/g2zP0j-uuUg/maxresdefault.jpg"
  },
  {
    id: 3,
    key: "imperium",
    title: "TEKNISKT IMPERIUM", 
    subtitle: "Bygg tekniskt imperium med multi-tenant arkitektur och ROBIN deployment 🏛️",
    description: "Skapa ditt tekniska imperium med enterprise-grade arkitektur. Multi-tenant skalbarhet och automatiserad ROBIN deployment ger dig makten att hantera obegränsat antal kunder med teknisk perfektion.",
    theme: {
      primary: "#7c3aed",
      secondary: "#8b5cf6",
      accent: "#a78bfa",
      background: "#faf5ff", 
      gradient: "from-purple-50 via-violet-50 to-purple-50"
    },
    features: [
      "🏗️ Multi-tenant arkitektur för skalbarhet",
      "🤖 ROBIN Deployment automation",
      "⚙️ Enterprise-grade systemarkitektur",
      "🔧 Avancerad utvecklingsstack",
      "📡 MCP (Model Context Protocol) potential",
      "👑 VIP teknisk support & expert-träning"
    ],
    cta: "Bygg Tekniskt Imperium",
    heroImage: "https://i.ytimg.com/vi/W6NGVLSZiZE/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYACkgWKAgwIABABGH8gFygXMA8=&rs=AOn4CLA42Ldp5ZZjq4rVQxyL9LOMnL23LQ"
  },
  {
    id: 4,
    key: "onestopshop", 
    title: "SVENSKA ENTERPRISE DOMINANS",
    subtitle: "Total dominans av svenska enterprise-marknaden med komplett ekosystem 👑",
    description: "Uppnå total dominans av svenska enterprise-marknaden. Alla fyra system integrerade, BankID + GDPR + Multi-tenant + ROBIN = Ointaglig position som Sveriges ledande enterprise-teknologileverantör.",
    theme: {
      primary: "#1e293b",
      secondary: "#475569",
      accent: "#64748b",
      background: "#f8fafc",
      gradient: "from-slate-50 via-blue-50 to-slate-50"
    },
    features: [
      "🇸🇪 Total svenska enterprise-marknadscontrol",
      "🔗 Alla 4 system fullt integrerade",
      "🏆 Branschledande BankID + GDPR-lösning",
      "🌐 Multi-tenant global skalbarhet",
      "⚡ ROBIN automatiserad deployment",
      "👑 Sveriges #1 Enterprise Ecosystem"
    ],
    cta: "Dominera Svenska Marknaden",
    heroImage: "https://i.ytimg.com/vi/9Poey4_Xeto/maxres2.jpg?sqp=-oaymwEoCIAKENAF8quKqQMcGADwAQH4Ac4FgAKACooCDAgAEAEYciBHKEwwDw==&rs=AOn4CLBJk6Z6a2eKAVE6uVXrHR07eGveEA"
  }
];

export const getThemeClasses = (level: CampaignLevel) => ({
  background: `bg-gradient-to-br ${level.theme.gradient}`,
  card: `bg-white/80 backdrop-blur-sm border border-white/20`,
  text: {
    primary: `text-${level.key === 'onestopshop' ? 'slate' : level.key === 'imperium' ? 'purple' : level.key === 'hjalten' ? 'amber' : 'blue'}-900`,
    secondary: `text-${level.key === 'onestopshop' ? 'slate' : level.key === 'imperium' ? 'purple' : level.key === 'hjalten' ? 'amber' : 'blue'}-700`,
    accent: `text-${level.key === 'onestopshop' ? 'slate' : level.key === 'imperium' ? 'purple' : level.key === 'hjalten' ? 'amber' : 'blue'}-600`
  },
  button: {
    primary: `bg-gradient-to-r from-${level.key === 'onestopshop' ? 'slate' : level.key === 'imperium' ? 'purple' : level.key === 'hjalten' ? 'amber' : 'blue'}-600 to-${level.key === 'onestopshop' ? 'slate' : level.key === 'imperium' ? 'purple' : level.key === 'hjalten' ? 'amber' : 'blue'}-700 hover:from-${level.key === 'onestopshop' ? 'slate' : level.key === 'imperium' ? 'purple' : level.key === 'hjalten' ? 'amber' : 'blue'}-700 hover:to-${level.key === 'onestopshop' ? 'slate' : level.key === 'imperium' ? 'purple' : level.key === 'hjalten' ? 'amber' : 'blue'}-800`,
    secondary: `border-2 border-${level.key === 'onestopshop' ? 'slate' : level.key === 'imperium' ? 'purple' : level.key === 'hjalten' ? 'amber' : 'blue'}-600 text-${level.key === 'onestopshop' ? 'slate' : level.key === 'imperium' ? 'purple' : level.key === 'hjalten' ? 'amber' : 'blue'}-600 hover:bg-${level.key === 'onestopshop' ? 'slate' : level.key === 'imperium' ? 'purple' : level.key === 'hjalten' ? 'amber' : 'blue'}-600 hover:text-white`
  }
});
