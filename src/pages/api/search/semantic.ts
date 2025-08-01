
import type { NextApiRequest, NextApiResponse } from 'next'
import { requireAuth, AuthenticatedUser } from '../../../lib/auth-server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function handler(req: NextApiRequest, res: NextApiResponse, user: AuthenticatedUser) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { query, context = 'general' } = req.body

  if (!query) {
    return res.status(400).json({ message: 'Query is required' })
  }

  try {
    // Mock search result for now - you can implement actual semantic search here
    const searchResult = {
      query,
      results: [
        {
          id: '1',
          title: `Search result for: ${query}`,
          content: `This is a mock search result for the query "${query}" in context "${context}".`,
          relevance: 0.95,
          source: 'mock'
        }
      ],
      metadata: {
        totalResults: 1,
        searchTime: '0.1s',
        context
      }
    }

    // Save search to database
    const savedSearch = await prisma.search.create({
      data: {
        query,
        results: searchResult,
        metadata: {
          context,
          resultCount: searchResult.results.length,
          searchTime: searchResult.metadata.searchTime,
          tokensUsed: 0
        },
        userId: user.id
      }
    })

    res.status(200).json({
      id: savedSearch.id,
      query,
      result: searchResult,
      createdAt: savedSearch.createdAt
    })
  } catch (error) {
    console.error('Semantic search error:', error)
    res.status(500).json({ message: 'Search failed. Please try again.' })
  }
}

export default requireAuth(handler)
