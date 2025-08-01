
import { useAuth } from '../lib/auth'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Search, 
  Grid3X3, 
  BarChart3, 
  Settings,
  ArrowDownRight,
  Layers,
  Bot,
  Sparkles,
  Users
} from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  href: string
  icon: any
}

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'cards' | 'list'>('grid')
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  // Import all 84 enterprise applications
  const enterpriseApps = [
    {"id": "advanced-features_enterprise_re-commerce_se_advanced_analytics_dashboard_1753813837577", "title": "Advanced Analytics Dashboard", "category": "Advanced Features", "href": "/dashboard", "description": "Real-time analytics and KPIs with advanced 3D visualizations"},
    {"id": "advanced-features_enterprise_re-commerce_se_advanced_features_1753813837579", "title": "Advanced Features Hub", "category": "Advanced Features", "href": "/advanced", "description": "Access to premium enterprise features"},
    {"id": "advanced-features_enterprise_re-commerce_se_advanced_security_center_1753813852170", "title": "Advanced Security Center", "category": "Security", "href": "/security", "description": "Enterprise-grade security management"},
    {"id": "ai-features_enterprise_re-commerce_se_ai_analytics_1753813708233", "title": "AI Analytics", "category": "AI Features", "href": "/ai/analytics", "description": "Artificial intelligence powered analytics"},
    {"id": "ai-features_enterprise_re-commerce_se_ai_command_center_1753813693348", "title": "AI Command Center", "category": "AI Features", "href": "/ai/command", "description": "Central AI operations management"},
    {"id": "ai-features_enterprise_re-commerce_se_ai_insights_1753813693339", "title": "AI Insights", "category": "AI Features", "href": "/ai/insights", "description": "Intelligent business insights"},
    {"id": "ai-features_enterprise_re-commerce_se_ai_personalization_behavior_analytics_1753813654344", "title": "AI Behavior Analytics", "category": "AI Features", "href": "/ai/behavior", "description": "Advanced user behavior analysis"},
    {"id": "ai-features_enterprise_re-commerce_se_ai_personalization_content_manager_1753813693329", "title": "AI Content Manager", "category": "AI Features", "href": "/ai/content", "description": "Intelligent content management"},
    {"id": "ai-features_enterprise_re-commerce_se_ai_personalization_overview_1753813654345", "title": "AI Personalization", "category": "AI Features", "href": "/ai/personalization", "description": "Personalized user experiences"},
    {"id": "ai-features_enterprise_re-commerce_se_ai_personalization_recommendations_1753813654348", "title": "AI Recommendations", "category": "AI Features", "href": "/ai/recommendations", "description": "Smart recommendation engine"},
    {"id": "ai-features_enterprise_re-commerce_se_ai_personalization_settings_1753813654347", "title": "AI Settings", "category": "AI Features", "href": "/ai/settings", "description": "Configure AI parameters"},
    {"id": "ai-features_enterprise_re-commerce_se_ai_studio_1753813693344", "title": "AI Studio", "category": "AI Features", "href": "/ai/studio", "description": "4 AI modules: Automation, Cognitive BI, Conversational AI, ML-Ops"},
    {"id": "analytics_enterprise_re-commerce_se_analytics_1753813708227", "title": "Analytics Dashboard", "category": "Analytics", "href": "/analytics", "description": "Comprehensive analytics platform"},
    {"id": "analytics_enterprise_re-commerce_se_analytics_advanced_1753813708232", "title": "Advanced Analytics", "category": "Analytics", "href": "/analytics/advanced", "description": "Deep dive analytics tools"},
    {"id": "analytics_enterprise_re-commerce_se_behavior_analytics_1753813721959", "title": "Behavior Analytics", "category": "Analytics", "href": "/analytics/behavior", "description": "User behavior tracking and analysis"},
    {"id": "analytics_enterprise_re-commerce_se_youtube_referral_analytics_1753813837575", "title": "YouTube Analytics", "category": "Analytics", "href": "/analytics/youtube", "description": "YouTube referral analytics"},
    {"id": "analytics_enterprise_re-commerce_se_youtube_referral_analytics_analytics_platform_1753813721966", "title": "YouTube Analytics Platform", "category": "Analytics", "href": "/analytics/youtube/platform", "description": "Complete YouTube analytics platform"},
    {"id": "analytics_enterprise_re-commerce_se_youtube_referral_analytics_creator_dashboard_1753813837570", "title": "Creator Dashboard", "category": "Analytics", "href": "/analytics/creator", "description": "Content creator analytics dashboard"},
    {"id": "analytics_enterprise_re-commerce_se_youtube_referral_analytics_viral_referrals_1753813837576", "title": "Viral Referrals", "category": "Analytics", "href": "/analytics/viral", "description": "Track viral content performance"},
    {"id": "authentication_enterprise_re-commerce_se_auth_signin_1753813708235", "title": "Authentication", "category": "Authentication", "href": "/auth", "description": "Enterprise authentication system"},
    {"id": "business-intelligence_enterprise_re-commerce_se_intelligent_bi_1753813867050", "title": "Business Intelligence", "category": "Business Intelligence", "href": "/bi", "description": "Intelligent BI platform"},
    {"id": "community-features_enterprise_re-commerce_se_community_hub_1753813750260", "title": "Community Hub", "category": "Community", "href": "/community", "description": "Central community management"},
    {"id": "community-features_enterprise_re-commerce_se_community_marketplace_1753813750262", "title": "Community Marketplace", "category": "Community", "href": "/community/marketplace", "description": "Community-driven marketplace"},
    {"id": "community-features_enterprise_re-commerce_se_community_overview_1753813763837", "title": "Community Overview", "category": "Community", "href": "/community/overview", "description": "Community statistics and insights"},
    {"id": "core-features_enterprise_re-commerce_se_ai_personalization_dashboard_1753813654338", "title": "Personalization Dashboard", "category": "Core Features", "href": "/core/personalization", "description": "User personalization dashboard"},
    {"id": "core-features_enterprise_re-commerce_se_command_center_1753813708236", "title": "Command Center", "category": "Core Features", "href": "/core/command", "description": "Central operations command center"},
    {"id": "core-features_enterprise_re-commerce_se_dashboard_1753813721963", "title": "Core Dashboard", "category": "Core Features", "href": "/core/dashboard", "description": "Main enterprise dashboard"},
    {"id": "dashboards_enterprise_re-commerce_se_scene_dashboard_1753813896877", "title": "Scene Dashboard", "category": "Dashboards", "href": "/dashboards/scene", "description": "Scene management dashboard"},
    {"id": "demo-tools_enterprise_re-commerce_se_demo_builder_1753813852176", "title": "Demo Builder", "category": "Demo Tools", "href": "/demo/builder", "description": "Build interactive demos"},
    {"id": "demo-tools_enterprise_re-commerce_se_demo_scenarios_1753813867043", "title": "Demo Scenarios", "category": "Demo Tools", "href": "/demo/scenarios", "description": "Pre-built demo scenarios"},
    {"id": "deployment-tools_enterprise_re-commerce_se_go_live_preparation_1753813881938", "title": "Go Live Preparation", "category": "Deployment", "href": "/deployment/golive", "description": "Deployment preparation tools"},
    {"id": "developer-tools_enterprise_re-commerce_se_developer_collaboration_1753813852177", "title": "Developer Collaboration", "category": "Developer Tools", "href": "/dev/collaboration", "description": "Developer collaboration platform"},
    {"id": "development-platforms_www_github_com__1753811575505", "title": "GitHub Integration", "category": "Development", "href": "/dev/github", "description": "GitHub development platform"},
    {"id": "development-platforms_www_stackoverflow_com__1753811575506", "title": "StackOverflow Integration", "category": "Development", "href": "/dev/stackoverflow", "description": "StackOverflow integration"},
    {"id": "documentation_enterprise_re-commerce_se_documentation_center_1753813852179", "title": "Documentation Center", "category": "Documentation", "href": "/docs", "description": "Comprehensive documentation hub"},
    {"id": "engagement-tools_enterprise_re-commerce_se_gamification_achievements_1753813763845", "title": "Achievements", "category": "Engagement", "href": "/engagement/achievements", "description": "User achievement system"},
    {"id": "engagement-tools_enterprise_re-commerce_se_gamification_challenges_1753813763848", "title": "Challenges", "category": "Engagement", "href": "/engagement/challenges", "description": "User challenge system"},
    {"id": "engagement-tools_enterprise_re-commerce_se_gamification_leaderboards_1753813779144", "title": "Leaderboards", "category": "Engagement", "href": "/engagement/leaderboards", "description": "Competitive leaderboards"},
    {"id": "engagement-tools_enterprise_re-commerce_se_gamification_overview_1753813779149", "title": "Gamification Overview", "category": "Engagement", "href": "/engagement/overview", "description": "Gamification system overview"},
    {"id": "engagement-tools_enterprise_re-commerce_se_gamification_rewards_1753813779152", "title": "Rewards System", "category": "Engagement", "href": "/engagement/rewards", "description": "User rewards management"},
    {"id": "enterprise-tools_enterprise_re-commerce_se_enterprise_hub_1753813763844", "title": "Enterprise Hub", "category": "Enterprise", "href": "/enterprise/hub", "description": "Central enterprise management"},
    {"id": "enterprise-tools_enterprise_re-commerce_se_enterprise_integration_hub_1753813763846", "title": "Integration Hub", "category": "Enterprise", "href": "/enterprise/integrations", "description": "Enterprise integrations"},
    {"id": "executive-tools_enterprise_re-commerce_se_executive_dashboard_1753813721964", "title": "Executive Dashboard", "category": "Executive", "href": "/executive/dashboard", "description": "Executive-level insights"},
    {"id": "expansion-tools_enterprise_re-commerce_se_international_expansion_1753813793813", "title": "International Expansion", "category": "Expansion", "href": "/expansion/international", "description": "Global expansion tools"},
    {"id": "expansion-tools_enterprise_re-commerce_se_international_expansion_currencies_1753813793816", "title": "Currency Management", "category": "Expansion", "href": "/expansion/currencies", "description": "Multi-currency support"},
    {"id": "expansion-tools_enterprise_re-commerce_se_international_expansion_languages_1753813793815", "title": "Language Management", "category": "Expansion", "href": "/expansion/languages", "description": "Multi-language support"},
    {"id": "expansion-tools_enterprise_re-commerce_se_international_expansion_market_regions_1753813793817", "title": "Market Regions", "category": "Expansion", "href": "/expansion/regions", "description": "Regional market analysis"},
    {"id": "governance-tools_enterprise_re-commerce_se_governance_center_1753813867047", "title": "Governance Center", "category": "Governance", "href": "/governance", "description": "Enterprise governance tools"},
    {"id": "homepage_enterprise_re-commerce_se__1753813693337", "title": "Homepage", "category": "Core", "href": "/", "description": "Main application homepage"},
    {"id": "integrations_enterprise_re-commerce_se_api_integration_api_explorer_1753813735915", "title": "API Explorer", "category": "Integrations", "href": "/integrations/api/explorer", "description": "Interactive API explorer"},
    {"id": "integrations_enterprise_re-commerce_se_api_integration_developer_portal_1753813735917", "title": "Developer Portal", "category": "Integrations", "href": "/integrations/developer", "description": "Developer integration portal"},
    {"id": "integrations_enterprise_re-commerce_se_api_integration_management_1753813721967", "title": "API Management", "category": "Integrations", "href": "/integrations/api", "description": "API integration management"},
    {"id": "integrations_enterprise_re-commerce_se_api_integration_marketplace_1753813735908", "title": "API Marketplace", "category": "Integrations", "href": "/integrations/marketplace", "description": "API marketplace"},
    {"id": "integrations_enterprise_re-commerce_se_api_integration_overview_1753813735912", "title": "Integration Overview", "category": "Integrations", "href": "/integrations/overview", "description": "Integration platform overview"},
    {"id": "integrations_enterprise_re-commerce_se_api_integration_webhooks_1753813735914", "title": "Webhooks", "category": "Integrations", "href": "/integrations/webhooks", "description": "Webhook management"},
    {"id": "integrations_enterprise_re-commerce_se_integrations_1753813793808", "title": "Integrations Hub", "category": "Integrations", "href": "/integrations", "description": "Central integrations hub"},
    {"id": "integrations_enterprise_re-commerce_se_integrations_hub_1753813779151", "title": "Integration Center", "category": "Integrations", "href": "/integrations/center", "description": "Integration management center"},
    {"id": "migration-tools_enterprise_re-commerce_se_migration_management_1753813750253", "title": "Migration Management", "category": "Migration", "href": "/migration", "description": "Data migration tools"},
    {"id": "ml-tools_enterprise_re-commerce_se_ml_ops_1753813867054", "title": "ML-Ops", "category": "Machine Learning", "href": "/ml/ops", "description": "Machine learning operations"},
    {"id": "monitoring_enterprise_re-commerce_se_health_monitoring_1753813779154", "title": "System Health", "category": "Monitoring", "href": "/monitoring/health", "description": "System health monitoring"},
    {"id": "monitoring_enterprise_re-commerce_se_monitoring_overview_1753813823251", "title": "Monitoring Overview", "category": "Monitoring", "href": "/monitoring", "description": "System monitoring overview"},
    {"id": "monitoring_enterprise_re-commerce_se_monitoring_real_time_1753813808620", "title": "Real-time Monitoring", "category": "Monitoring", "href": "/monitoring/realtime", "description": "Real-time system monitoring"},
    {"id": "monitoring_enterprise_re-commerce_se_performance_1753813808629", "title": "Performance Monitor", "category": "Monitoring", "href": "/monitoring/performance", "description": "Performance monitoring"},
    {"id": "monitoring_enterprise_re-commerce_se_performance_center_1753813808628", "title": "Performance Center", "category": "Monitoring", "href": "/monitoring/performance/center", "description": "Performance management center"},
    {"id": "monitoring_enterprise_re-commerce_se_performance_metrics_1753813808627", "title": "Performance Metrics", "category": "Monitoring", "href": "/monitoring/metrics", "description": "Performance metrics dashboard"},
    {"id": "monitoring_enterprise_re-commerce_se_performance_optimization_1753813808626", "title": "Performance Optimization", "category": "Monitoring", "href": "/monitoring/optimization", "description": "Performance optimization tools"},
    {"id": "monitoring_enterprise_re-commerce_se_system_health_1753813896878", "title": "System Health Dashboard", "category": "Monitoring", "href": "/monitoring/health/dashboard", "description": "System health dashboard"},
    {"id": "onboarding_enterprise_re-commerce_se_onboarding_1753813867056", "title": "Onboarding", "category": "Onboarding", "href": "/onboarding", "description": "User onboarding system"},
    {"id": "opensource_enterprise_re-commerce_se_opensource_contributions_1753813881933", "title": "Open Source", "category": "Open Source", "href": "/opensource", "description": "Open source contributions"},
    {"id": "plugins_enterprise_re-commerce_se_plugin_marketplace_1753813881940", "title": "Plugin Marketplace", "category": "Plugins", "href": "/plugins", "description": "Plugin marketplace"},
    {"id": "presentation-tools_enterprise_re-commerce_se_presentation_builder_1753813881945", "title": "Presentation Builder", "category": "Presentation", "href": "/presentation", "description": "Presentation building tools"},
    {"id": "pricing-tools_enterprise_re-commerce_se_pricing_calculator_1753813881941", "title": "Pricing Calculator", "category": "Pricing", "href": "/pricing", "description": "Pricing calculation tools"},
    {"id": "resource-management_enterprise_re-commerce_se_resource_allocation_1753813896874", "title": "Resource Allocation", "category": "Resources", "href": "/resources", "description": "Resource management tools"},
    {"id": "sales-tools_enterprise_re-commerce_se_sales_deck_1753813896870", "title": "Sales Deck", "category": "Sales", "href": "/sales/deck", "description": "Sales presentation tools"},
    {"id": "sales-tools_enterprise_re-commerce_se_sales_enablement_1753813896876", "title": "Sales Enablement", "category": "Sales", "href": "/sales", "description": "Sales enablement platform"},
    {"id": "security_enterprise_re-commerce_se_security_1753813823259", "title": "Security Dashboard", "category": "Security", "href": "/security/dashboard", "description": "Security management dashboard"},
    {"id": "security_enterprise_re-commerce_se_security_center_1753813823257", "title": "Security Center", "category": "Security", "href": "/security/center", "description": "Enterprise security center"},
    {"id": "support-tools_enterprise_re-commerce_se_customer_success_1753813852175", "title": "Customer Success", "category": "Support", "href": "/support", "description": "Customer success platform"},
    {"id": "tenant-management_enterprise_re-commerce_se_tenant_analytics_1753813823260", "title": "Tenant Analytics", "category": "Tenant Management", "href": "/tenants/analytics", "description": "Multi-tenant analytics"},
    {"id": "tenant-management_enterprise_re-commerce_se_tenant_customization_1753813823262", "title": "Tenant Customization", "category": "Tenant Management", "href": "/tenants/customization", "description": "Tenant customization tools"},
    {"id": "tenant-management_enterprise_re-commerce_se_tenant_management_1753813750258", "title": "Tenant Management", "category": "Tenant Management", "href": "/tenants", "description": "Multi-tenant management"},
    {"id": "tenant-management_enterprise_re-commerce_se_tenant_provisioning_1753813750259", "title": "Tenant Provisioning", "category": "Tenant Management", "href": "/tenants/provisioning", "description": "Tenant provisioning system"},
    {"id": "testing-tools_enterprise_re-commerce_se_testing_center_1753813910794", "title": "Testing Center", "category": "Testing", "href": "/testing", "description": "Enterprise testing tools"},
    {"id": "widgets_enterprise_re-commerce_se_widget_factory_1753813910799", "title": "Widget Factory", "category": "Widgets", "href": "/widgets", "description": "Create and customize interactive widgets"}
  ]

  const allFeatures: SearchResult[] = enterpriseApps.map(app => ({
    ...app,
    icon: getIconForCategory(app.category)
  }))

  function getIconForCategory(category: string) {
    switch (category.toLowerCase()) {
      case 'analytics': return BarChart3
      case 'ai features': return Bot
      case 'security': return Settings
      case 'monitoring': return Search
      case 'dashboards': return Grid3X3
      case 'core features': return Layers
      case 'widgets': return Settings
      default: return Sparkles
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      const filtered = allFeatures.filter(feature =>
        feature.title.toLowerCase().includes(query.toLowerCase()) ||
        feature.description.toLowerCase().includes(query.toLowerCase()) ||
        feature.category.toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(filtered)
      setShowResults(true)
    } else {
      setSearchResults([])
      setShowResults(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to dashboard
  }

  return (
    <>
      <Head>
        <title>Mr. RE:commerce - Enterprise Search & Discovery Platform</title>
        <meta name="description" content="Connect the dots - AI-powered enterprise search with canvas visualization" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-white">
        {/* Google-Inspired Header */}
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          {/* Logo Section */}
          <div className="mb-8">
            <div className="relative w-48 h-48 mb-4">
              <Image
                src="/mr-recommerce-logo.png"
                alt="Mr. RE:commerce"
                fill
                className="object-contain"
                priority
              />
            </div>
            {/* Connect-the-dots arrow */}
            <div className="flex justify-center">
              <ArrowDownRight className="w-8 h-8 text-blue-500 animate-bounce" />
            </div>
          </div>

          {/* Search Interface */}
          <div className="w-full max-w-2xl mb-8">
            <div className="relative">
              <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-shadow duration-200 px-6 py-4">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Sök efter enterprise funktioner..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="flex-1 outline-none text-lg"
                />
                {/* View Mode Switcher */}
                <div className="flex gap-2 ml-4 border-l pl-4">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`p-2 rounded ${viewMode === 'cards' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Layers className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <BarChart3 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas-Style Results */}
          {showResults && searchResults.length > 0 && (
            <div className="w-full max-w-6xl mb-8">
              <div className="text-sm text-gray-600 mb-4">
                Cirka {searchResults.length} resultat ({Math.random().toFixed(2)} sekunder)
              </div>
              
              {/* Kakel-plattor (Tiles) Layout */}
              <div className={`grid gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                viewMode === 'cards' ? 'grid-cols-1 md:grid-cols-2' :
                'grid-cols-1'
              }`}>
                {searchResults.map((result, index) => (
                  <div
                    key={result.id}
                    className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Connect-the-dots indicator */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                          <result.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600">
                            {result.title}
                          </h3>
                          <span className="text-sm text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                            {result.category}
                          </span>
                        </div>
                      </div>
                      <ArrowDownRight className="w-5 h-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {result.description}
                    </p>
                    
                    <Link
                      href={result.href}
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
                    >
                      Öppna modul
                      <ArrowDownRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
              
              {/* Connect-the-dots visualization */}
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Canvas System</span>
                  </div>
                  <ArrowDownRight className="w-4 h-4" />
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>AI Search</span>
                  </div>
                  <ArrowDownRight className="w-4 h-4" />
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Enterprise</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alla 84 Enterprise Applikationer - Visas alltid */}
          {!showResults && (
            <div className="w-full max-w-7xl mb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Enterprise Applications ({allFeatures.length} Available)
                </h2>
                <p className="text-gray-600">Upptäck och utforska alla enterprise-funktioner</p>
              </div>
              
              {/* Grid med alla 84 applikationer */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {allFeatures.map((app) => (
                  <Link
                    key={app.id}
                    href={app.href}
                    className="group bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors mb-3">
                        <app.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-sm text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-2">
                        {app.title}
                      </h3>
                      <span className="text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full mb-2">
                        {app.category}
                      </span>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {app.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Quick Search Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                {[
                  'Canvas System',
                  'AI Search', 
                  'Executive Dashboard',
                  'Scene Builder',
                  'Widget Factory',
                  'AI Studio'
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleSearch(item)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 hover:shadow-md transition-all duration-200 transform hover:scale-105"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Login Prompt */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Redo att utforska världens bästa enterprise-plattform?
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/auth/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Logga in
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-gray-500 border-t">
          <p>&copy; 2025 Mr. RE:commerce Enterprise. Certifierad plattläggare av kakel-plattor.</p>
        </footer>
      </div>
    </>
  )
}
