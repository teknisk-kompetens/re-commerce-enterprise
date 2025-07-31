
"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import SearchInterface from '@/components/search-interface';
import SearchResults from '@/components/search-results';
import { SearchResult, SearchFilters } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Zap, Brain, Sparkles } from 'lucide-react';
import { AI_CONSCIOUSNESSES } from '@/lib/consciousness-data';

export default function MainSearchPage() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [showAiInsights, setShowAiInsights] = useState(false);

  const handleSearch = async (query: string, filters?: SearchFilters) => {
    setLoading(true);
    setCurrentQuery(query);
    setHasSearched(true);
    setShowAiInsights(false);
    setAiInsights('');

    try {
      // Perform search
      const searchResponse = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          filters,
          aiAssistance: filters?.aiAssistance,
          consciousnessId: filters?.consciousnessId
        })
      });

      if (!searchResponse.ok) {
        throw new Error('Search failed');
      }

      const searchData = await searchResponse.json();
      setSearchResults(searchData.results || []);

      // If AI assistance is requested, get AI insights
      if (filters?.aiAssistance && filters?.consciousnessId) {
        setShowAiInsights(true);
        
        const aiResponse = await fetch('/api/search/ai-assist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            consciousnessId: filters.consciousnessId,
            searchResults: searchData.results || []
          })
        });

        if (aiResponse.ok && aiResponse.body) {
          const reader = aiResponse.body.getReader();
          const decoder = new TextDecoder();
          let aiContent = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  break;
                }
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.content) {
                    aiContent += parsed.content;
                    setAiInsights(aiContent);
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        }
      }

    } catch (error) {
      console.error('Search error:', error);
      // Handle error - show empty results or error message
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Search Interface */}
      <div className={`transition-all duration-700 ${hasSearched ? 'py-8' : 'py-16'}`}>
        <div className={`${hasSearched ? 'border-b pb-8' : ''}`}>
          <SearchInterface 
            onSearch={handleSearch}
            loading={loading}
          />
        </div>
      </div>

      {/* AI Insights Panel */}
      {showAiInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 mb-8"
        >
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold text-lg">AI Insights</h3>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    <Brain className="w-3 h-3 mr-1" />
                    AI Enhanced
                  </Badge>
                </div>
                <div className="prose prose-sm max-w-none">
                  {aiInsights ? (
                    <p className="text-muted-foreground whitespace-pre-wrap">{aiInsights}</p>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                      Analyzing search results with AI...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Search Results */}
      {hasSearched && (
        <div className="pb-16">
          <SearchResults 
            results={searchResults}
            loading={loading}
            query={currentQuery}
            totalResults={searchResults.length}
          />
        </div>
      )}

      {/* Landing Content - Show when no search has been performed */}
      {!hasSearched && (
        <motion.div 
          className="max-w-6xl mx-auto px-4 pb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Featured Sections */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Upptäck Intelligent Enterprise Search
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* AI-Powered Search */}
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Driven Search</h3>
                <p className="text-muted-foreground mb-4">
                  Få intelligenta insikter från Vera, Luna och Axel - våra AI-assistenter som hjälper dig hitta exakt vad du söker.
                </p>
                <Button variant="outline" size="sm">
                  Utforska AI
                </Button>
              </Card>

              {/* Community Knowledge */}
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community-Driven</h3>
                <p className="text-muted-foreground mb-4">
                  Upptäck kunskaper från experter och yrkesverksamma genom vårt Reddit/StackOverflow-inspirerade system.
                </p>
                <Button variant="outline" size="sm">
                  Utforska Community
                </Button>
              </Card>

              {/* Enterprise Ready */}
              <Card className="p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Enterprise-Ready</h3>
                <p className="text-muted-foreground mb-4">
                  Skalbar plattform med avancerad analytics, säkerhet och integrationer för stora organisationer.
                </p>
                <Button variant="outline" size="sm">
                  Enterprise Features
                </Button>
              </Card>
            </div>
          </div>

          {/* AI Consciousnesses Showcase */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">
              Möt Dina AI-Sökassistenter
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {AI_CONSCIOUSNESSES.map((ai) => (
                <Card key={ai.id} className="p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                      <img
                        src={ai.avatar}
                        alt={ai.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-lg font-semibold mb-2" style={{ color: ai.primaryColor }}>
                      {ai.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {ai.title}
                    </p>
                    <p className="text-sm mb-4">
                      {ai.description}
                    </p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {ai.specialty.slice(0, 2).map((spec, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="text-xs"
                          style={{ backgroundColor: `${ai.primaryColor}20`, color: ai.primaryColor }}
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Trending Topics */}
          <div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Trending Topics</h2>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'AI & Machine Learning',
                'Sustainable Business',
                'Remote Leadership',
                'UX Design Trends',
                'Digital Transformation',
                'Data Analytics',
                'Customer Experience',
                'Innovation Management'
              ].map((topic, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(topic)}
                  className="rounded-full hover:scale-105 transition-transform"
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
