
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

  const allFeatures: SearchResult[] = [
    {
      id: 'dashboard',
      title: 'Executive Dashboard',
      description: 'Real-time analytics and KPIs with advanced 3D visualizations',
      category: 'Analytics',
      href: '/dashboard',
      icon: BarChart3
    },
    {
      id: 'scenes',
      title: 'Scene Builder',
      description: 'Drag-and-drop interface for creating dynamic user experiences',
      category: 'Builder',
      href: '/scenes',
      icon: Layers
    },
    {
      id: 'widgets',
      title: 'Widget Factory',
      description: 'Create and customize interactive widgets with blueprint designer',
      category: 'Tools',
      href: '/widgets',
      icon: Settings
    },
    {
      id: 'canvas',
      title: 'Canvas System',
      description: 'Multi-layer canvas with real-time collaboration and connect-the-dots',
      category: 'Collaboration',
      href: '/canvas',
      icon: Grid3X3
    },
    {
      id: 'search',
      title: 'AI Search',
      description: 'Semantic search powered by advanced AI for instant insights',
      category: 'AI',
      href: '/search',
      icon: Search
    },
    {
      id: 'ai-studio',
      title: 'AI Studio',
      description: '4 AI modules: Automation, Cognitive BI, Conversational AI, ML-Ops',
      category: 'AI',
      href: '/ai-studio',
      icon: Bot
    }
  ]

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

          {/* Quick Access Buttons (när inga sökresultat) */}
          {!showResults && (
            <div className="flex flex-wrap justify-center gap-3 mb-8">
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
