
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create platforms
  const enterpriseSuite = await prisma.platform.upsert({
    where: { slug: 'enterprise-suite' },
    update: {},
    create: {
      name: 'Enterprise Suite',
      slug: 'enterprise-suite',
      description: 'Den kompletta plattformen för datadriven e-handelstillväxt',
      status: 'coming_soon'
    }
  })

  const leadsGen = await prisma.platform.upsert({
    where: { slug: 'leadsgen' },
    update: {},
    create: {
      name: 'LeadsGen',
      slug: 'leadsgen',
      description: 'Intelligent leadgenerering och konverteringsoptimering',
      status: 'pilot'
    }
  })

  const aiSuite = await prisma.platform.upsert({
    where: { slug: 'ai-suite' },
    update: {},
    create: {
      name: 'AI Suite',
      slug: 'ai-suite',
      description: 'AI-driven automation och prediktiv analys',
      status: 'coming_soon'
    }
  })

  // Enterprise Suite features
  const enterpriseFeatures = [
    // SEO & Performance
    { title: 'Automatisk Core Web Vitals-optimering', description: 'Realtidsoptimering av laddningstider och användarupplevelse', category: 'SEO & Performance', priority: 'high' },
    { title: 'Teknisk SEO-audit', description: 'Kontinuerlig övervakning och rapportering av SEO-hälsa', category: 'SEO & Performance', priority: 'high' },
    { title: 'Prestandamonitoring', description: 'Real-time övervakning av webbplatsens prestanda', category: 'SEO & Performance', priority: 'medium' },
    { title: 'Mobiloptimering', description: 'Automatisk optimering för mobila enheter', category: 'SEO & Performance', priority: 'high' },
    { title: 'CDN-integration', description: 'Global innehållsleverans för snabbare laddningstider', category: 'SEO & Performance', priority: 'medium' },
    
    // Data & Analytics
    { title: 'Enhetlig datastruktur', description: 'Standardiserad datahantering över alla kanaler', category: 'Data & Analytics', priority: 'high' },
    { title: 'Avancerad analysrapporter', description: 'Detaljerade insikter om användarbeteende och konverteringar', category: 'Data & Analytics', priority: 'medium' },
    { title: 'Datakvalitetsövervakning', description: 'Automatisk validering och rengöring av produktdata', category: 'Data & Analytics', priority: 'medium' },
    { title: 'Custom KPI-dashboard', description: 'Anpassningsbara dashboards för viktiga affärsmått', category: 'Data & Analytics', priority: 'low' },
    
    // AI & Automation
    { title: 'Prediktiv produktrekommendation', description: 'AI-driven produktrekommendationer baserat på användarbeteende', category: 'AI & Automation', priority: 'high' },
    { title: 'Automatisk innehållsoptimering', description: 'AI-assisterad optimering av produktbeskrivningar och metadata', category: 'AI & Automation', priority: 'medium' },
    { title: 'Prisprediktionsmodeller', description: 'Intelligent prisoptimering baserat på marknadstrender', category: 'AI & Automation', priority: 'low' },
    { title: 'Chatbot-integration', description: 'AI-driven kundtjänst med natural language processing', category: 'AI & Automation', priority: 'medium' },
    
    // Integration & API
    { title: 'E-handelsplattform-integrationer', description: 'Smidiga kopplingar till Shopify, WooCommerce, Magento', category: 'Integration & API', priority: 'high' },
    { title: 'CRM-integration', description: 'Synkronisering med HubSpot, Salesforce, Pipedrive', category: 'Integration & API', priority: 'medium' }
  ]

  // LeadsGen features
  const leadsGenFeatures = [
    // Lead Generation
    { title: 'Smart lead scoring', description: 'AI-baserad poängsättning av leads baserat på beteenden', category: 'Lead Generation', priority: 'high' },
    { title: 'Dynamiska landningssidor', description: 'Personaliserade landningssidor för olika målgrupper', category: 'Lead Generation', priority: 'high' },
    { title: 'Exit-intent teknologi', description: 'Fånga besökare som är på väg att lämna sajten', category: 'Lead Generation', priority: 'medium' },
    { title: 'Progresiva formulär', description: 'Smarta formulär som samlar data över tid', category: 'Lead Generation', priority: 'medium' },
    { title: 'Social proof-widgets', description: 'Realtidsnotifikationer om andras köp och registreringar', category: 'Lead Generation', priority: 'low' },
    
    // Targeting & Personalization
    { title: 'Beteendebaserad segmentering', description: 'Automatisk gruppering av besökare baserat på interaktioner', category: 'Targeting & Personalization', priority: 'high' },
    { title: 'Geolokalisering', description: 'Anpassat innehåll baserat på användarens location', category: 'Targeting & Personalization', priority: 'medium' },
    { title: 'Tidsstämpel-triggering', description: 'Kampanjer aktiverade vid specifika tidpunkter', category: 'Targeting & Personalization', priority: 'medium' },
    { title: 'Device-specific targeting', description: 'Olika kampanjer för mobil, desktop och tablet', category: 'Targeting & Personalization', priority: 'low' },
    
    // Automation & Workflows
    { title: 'E-post automation', description: 'Automatiserade e-postsekvenser baserat på användaractions', category: 'Automation & Workflows', priority: 'high' },
    { title: 'Lead nurturing campaigns', description: 'Långsiktiga kampanjer för att utveckla leads', category: 'Automation & Workflows', priority: 'high' },
    { title: 'Slack/Teams notifikationer', description: 'Realtidsnotifikationer till teamet vid nya kvalificerade leads', category: 'Automation & Workflows', priority: 'medium' },
    { title: 'CRM auto-sync', description: 'Automatisk synkronisering av leads till CRM-system', category: 'Automation & Workflows', priority: 'medium' },
    
    // Analytics & Optimization
    { title: 'A/B-testning av kampanjer', description: 'Inbyggda verktyg för att testa olika kampanjvarianter', category: 'Analytics & Optimization', priority: 'high' },
    { title: 'Konverteringsfunnel-analys', description: 'Detaljerad analys av hela konverteringsprocessen', category: 'Analytics & Optimization', priority: 'medium' },
    { title: 'Heatmap-integration', description: 'Visualisering av användarinteraktioner på sidor', category: 'Analytics & Optimization', priority: 'low' }
  ]

  // AI Suite features
  const aiSuiteFeatures = [
    // Predictive Analytics
    { title: 'Kundlivstidsvärde-prediktioner', description: 'Förutsäg vilket värde varje kund kommer att generera', category: 'Predictive Analytics', priority: 'high' },
    { title: 'Churn-prediktionsmodeller', description: 'Identifiera kunder som riskerar att lämna', category: 'Predictive Analytics', priority: 'high' },
    { title: 'Säsongstrend-analys', description: 'Förutsäg säsongsmönster och planera därefter', category: 'Predictive Analytics', priority: 'medium' },
    { title: 'Inventarie-optimering', description: 'AI-driven lagerhållning baserat på efterfrågeprognoser', category: 'Predictive Analytics', priority: 'medium' },
    
    // Natural Language Processing
    { title: 'Sentimentanalys av recensioner', description: 'Automatisk analys av kundomdömen och feedback', category: 'Natural Language Processing', priority: 'medium' },
    { title: 'Innehållsgenerering', description: 'AI-assisterad skrivning av produktbeskrivningar', category: 'Natural Language Processing', priority: 'low' },
    { title: 'Flerspråkig översättning', description: 'Automatisk översättning av produktinformation', category: 'Natural Language Processing', priority: 'low' },
    { title: 'Keyword-extrahering', description: 'Automatisk identifiering av relevanta sökord', category: 'Natural Language Processing', priority: 'medium' },
    
    // Computer Vision
    { title: 'Automatisk bildtaggning', description: 'AI-baserad taggning och kategorisering av produktbilder', category: 'Computer Vision', priority: 'medium' },
    { title: 'Bildkvalitetsanalys', description: 'Automatisk bedömning av bildkvalitet och förslag på förbättringar', category: 'Computer Vision', priority: 'low' },
    { title: 'Visuell produktsökning', description: 'Sök efter produkter baserat på bilder', category: 'Computer Vision', priority: 'low' },
    
    // Machine Learning Operations
    { title: 'Modellövervakning', description: 'Kontinuerlig övervakning av AI-modellernas prestanda', category: 'Machine Learning Operations', priority: 'high' },
    { title: 'Automatisk modellträning', description: 'Regelbunden omträning av modeller med ny data', category: 'Machine Learning Operations', priority: 'medium' },
    { title: 'A/B-testning av AI-modeller', description: 'Testa olika AI-modeller mot varandra', category: 'Machine Learning Operations', priority: 'medium' },
    { title: 'Förklarbar AI', description: 'Insikter i hur AI-modeller fattar beslut', category: 'Machine Learning Operations', priority: 'low' }
  ]

  // Create Enterprise Suite features
  for (const feature of enterpriseFeatures) {
    const existing = await prisma.feature.findFirst({
      where: { 
        title: feature.title,
        platformId: enterpriseSuite.id
      }
    })
    
    if (!existing) {
      await prisma.feature.create({
        data: {
          ...feature,
          platformId: enterpriseSuite.id
        }
      })
    }
  }

  // Create LeadsGen features
  for (const feature of leadsGenFeatures) {
    const existing = await prisma.feature.findFirst({
      where: { 
        title: feature.title,
        platformId: leadsGen.id
      }
    })
    
    if (!existing) {
      await prisma.feature.create({
        data: {
          ...feature,
          platformId: leadsGen.id
        }
      })
    }
  }

  // Create AI Suite features
  for (const feature of aiSuiteFeatures) {
    const existing = await prisma.feature.findFirst({
      where: { 
        title: feature.title,
        platformId: aiSuite.id
      }
    })
    
    if (!existing) {
      await prisma.feature.create({
        data: {
          ...feature,
          platformId: aiSuite.id
        }
      })
    }
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
