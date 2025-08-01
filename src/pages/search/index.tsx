
'use client'

import { useState, useEffect } from 'react'
import Head from 'next/head'
import { Search, Sparkles, Clock, Filter, BookOpen, TrendingUp, Users, ShoppingCart } from 'lucide-react'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import toast from 'react-hot-toast'

interface SearchResult {
  id: string
  query: string
  result: string
  context: string
  timestamp: string
}

const searchContexts = [
  { value: 'general', label: 'General', icon: BookOpen, description: 'General business questions' },
  { value: 'analytics', label: 'Analytics', icon: TrendingUp, description: 'Data insights and metrics' },
  { value: 'customers', label: 'Customers', icon: Users, description: 'Customer behavior and segmentation' },
  { value: 'products', label: 'Products', icon: ShoppingCart, description: 'Product performance and trends' }
]

export default function AISearch() {
  const [query, setQuery] = useState('')
  const [context, setContext] = useState('general')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([])

  useEffect(() => {
    fetchRecentSearches()
  }, [])

  const fetchRecentSearches = async () => {
    try {
      const response = await fetch('/api/search/history')
      if (response.ok) {
        const searches = await response.json()
        setRecentSearches(searches.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching recent searches:', error)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch('/api/search/semantic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query, context })
      })

      if (response.ok) {
        const result = await response.json()
        setResults(prev => [result, ...prev])
        setRecentSearches(prev => [result, ...prev.slice(0, 4)])
        toast.success('Search completed!')
      } else {
        toast.error('Search failed. Please try again.')
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const formatResult = (text: string) => {
    // Simple formatting for search results
    return text.split('\n').map((line, index) => {
      if (line.startsWith('##')) {
        return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-gray-900">{line.replace('##', '').trim()}</h3>
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={index} className="font-medium text-gray-800 mt-2">{line.replace(/\*\*/g, '').trim()}</p>
      } else if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 text-gray-700">{line.replace('- ', '').trim()}</li>
      } else if (line.trim()) {
        return <p key={index} className="text-gray-700 mt-2">{line.trim()}</p>
      }
      return null
    })
  }

  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>AI Search - RE:Commerce Enterprise</title>
        </Head>
        
        <div className="h-full flex flex-col bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center mb-6">
                <Sparkles className="h-8 w-8 text-indigo-600 mr-3" />
                <h1 className="text-3xl font-bold text-gray-900">AI-Powered Search</h1>
              </div>
              
              {/* Search form */}
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask anything about your business, analytics, customers, or products..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={isSearching}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching || !query.trim()}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                </div>
                
                {/* Context selection */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Context:</span>
                  <div className="flex space-x-2">
                    {searchContexts.map((ctx) => (
                      <button
                        key={ctx.value}
                        type="button"
                        onClick={() => setContext(ctx.value)}
                        className={`flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          context === ctx.value
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <ctx.icon className="h-3 w-3 mr-1" />
                        {ctx.label}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <div className="max-w-4xl mx-auto p-6 h-full">
              {results.length === 0 ? (
                <div className="h-full flex flex-col">
                  {/* Search suggestions */}
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Try asking about:</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchContexts.map((ctx) => (
                        <div key={ctx.value} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                          <div className="flex items-start">
                            <ctx.icon className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
                            <div>
                              <h3 className="font-medium text-gray-900">{ctx.label}</h3>
                              <p className="text-sm text-gray-600 mt-1">{ctx.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        Recent Searches
                      </h2>
                      <div className="space-y-3">
                        {recentSearches.map((search) => (
                          <button
                            key={search.id}
                            onClick={() => {
                              setQuery(search.query)
                              setContext(search.context)
                            }}
                            className="w-full text-left bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">{search.query}</p>
                              <span className="text-xs text-gray-500">
                                {new Date(search.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 capitalize">{search.context}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6 h-full overflow-y-auto">
                  {results.map((result) => (
                    <div key={result.id} className="bg-white rounded-lg border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">{result.query}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-xs mr-2">
                            {result.context}
                          </span>
                          <span>{new Date(result.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="prose prose-sm max-w-none text-gray-700">
                        {formatResult(result.result)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
