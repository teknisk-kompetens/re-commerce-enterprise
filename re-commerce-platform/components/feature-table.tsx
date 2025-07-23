
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import NetflixVoting from './netflix-voting'
import { motion } from 'framer-motion'

interface Feature {
  id: number
  title: string
  description: string
  category: string
  priority: string
  votes: {
    dislike: number
    like: number
    love: number
  }
  userVote?: string | null
}

interface FeatureTableProps {
  platformSlug: string
  features: Feature[]
}

export default function FeatureTable({ platformSlug, features }: FeatureTableProps) {
  const [featuresData, setFeaturesData] = useState(features)
  const [sessionId, setSessionId] = useState('')

  useEffect(() => {
    // Generate or get session ID
    let storedSessionId = localStorage.getItem('voting_session_id')
    if (!storedSessionId) {
      storedSessionId = Math.random().toString(36).substring(2, 15)
      localStorage.setItem('voting_session_id', storedSessionId)
    }
    setSessionId(storedSessionId)
  }, [])

  const handleVote = async (featureId: number, voteType: string) => {
    try {
      const response = await fetch('/api/features/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featureId,
          voteType,
          sessionId
        }),
      })

      if (!response.ok) {
        throw new Error('Vote failed')
      }

      const result = await response.json()
      
      // Update the feature in local state
      setFeaturesData(prev => prev.map(feature => 
        feature.id === featureId 
          ? { ...feature, votes: result.votes, userVote: result.userVote }
          : feature
      ))
    } catch (error) {
      console.error('Vote failed:', error)
      throw error
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const groupedFeatures = featuresData.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = []
    }
    acc[feature.category].push(feature)
    return acc
  }, {} as Record<string, Feature[]>)

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Rösta på funktioner</h3>
        <p className="text-gray-600">
          Hjälp oss prioritera utvecklingen genom att rösta på de funktioner du vill se först
        </p>
      </div>

      {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="text-lg capitalize">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                        <Badge className={getPriorityColor(feature.priority)}>
                          {feature.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                    <div className="ml-6">
                      <NetflixVoting
                        featureId={feature.id}
                        initialVotes={feature.votes}
                        userVote={feature.userVote}
                        onVote={(voteType) => handleVote(feature.id, voteType)}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
