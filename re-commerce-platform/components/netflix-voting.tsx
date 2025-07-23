
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ThumbsDown, ThumbsUp, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NetflixVotingProps {
  featureId: number
  initialVotes: {
    dislike: number
    like: number
    love: number
  }
  userVote?: string | null
  onVote: (voteType: string) => void
}

export default function NetflixVoting({ 
  featureId, 
  initialVotes, 
  userVote, 
  onVote 
}: NetflixVotingProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [currentVote, setCurrentVote] = useState(userVote)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (voteType: string) => {
    if (isVoting) return
    
    setIsVoting(true)
    const previousVote = currentVote
    const previousVotes = { ...votes }

    try {
      // Optimistically update UI
      const newVotes = { ...votes }
      
      // Remove previous vote
      if (previousVote) {
        newVotes[previousVote as keyof typeof newVotes]--
      }
      
      // Add new vote or remove if same
      if (previousVote === voteType) {
        setCurrentVote(null)
      } else {
        newVotes[voteType as keyof typeof newVotes]++
        setCurrentVote(voteType)
      }
      
      setVotes(newVotes)
      
      // Send to API
      await onVote(previousVote === voteType ? 'remove' : voteType)
      
    } catch (error) {
      // Revert on error
      setVotes(previousVotes)
      setCurrentVote(previousVote)
      console.error('Vote failed:', error)
    } finally {
      setIsVoting(false)
    }
  }

  const getButtonClass = (voteType: string) => {
    const isActive = currentVote === voteType
    const baseClass = "h-10 w-10 p-0 rounded-full transition-all duration-200 hover:scale-110"
    
    switch (voteType) {
      case 'dislike':
        return `${baseClass} ${isActive 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'}`
      case 'like':
        return `${baseClass} ${isActive 
          ? 'bg-blue-500 text-white hover:bg-blue-600' 
          : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-500'}`
      case 'love':
        return `${baseClass} ${isActive 
          ? 'bg-pink-500 text-white hover:bg-pink-600' 
          : 'bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-500'}`
      default:
        return baseClass
    }
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className={getButtonClass('dislike')}
          onClick={() => handleVote('dislike')}
          disabled={isVoting}
        >
          <ThumbsDown className="h-4 w-4" />
        </Button>
        <AnimatePresence mode="wait">
          <motion.span
            key={votes.dislike}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-sm font-medium text-gray-600 min-w-[20px] text-center"
          >
            {votes.dislike}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className={getButtonClass('like')}
          onClick={() => handleVote('like')}
          disabled={isVoting}
        >
          <ThumbsUp className="h-4 w-4" />
        </Button>
        <AnimatePresence mode="wait">
          <motion.span
            key={votes.like}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-sm font-medium text-gray-600 min-w-[20px] text-center"
          >
            {votes.like}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          className={getButtonClass('love')}
          onClick={() => handleVote('love')}
          disabled={isVoting}
        >
          <Heart className="h-4 w-4" />
        </Button>
        <AnimatePresence mode="wait">
          <motion.span
            key={votes.love}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-sm font-medium text-gray-600 min-w-[20px] text-center"
          >
            {votes.love}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}
