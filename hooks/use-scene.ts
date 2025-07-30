
import { useCallback, useMemo } from 'react'
import { useSceneStore, Scene, SceneCategory } from '@/lib/stores/scene-store'
import { toast } from 'sonner'

/**
 * Custom hook för scene-hantering
 * Tillhandahåller en enkel API för att interagera med scene store
 */
export const useScene = () => {
  const store = useSceneStore()
  
  // Memoized selectors för bättre performance
  const currentScene = useMemo(() => store.currentScene, [store.currentScene])
  const scenes = useMemo(() => store.scenes, [store.scenes])
  const visibleScenes = useMemo(() => store.getVisibleScenes(), [store.visibleScenes, store.scenes])
  const filteredScenes = useMemo(() => store.getFilteredScenes(), [store.scenes, store.activeCategory, store.searchQuery, store.sortBy, store.sortOrder])
  
  // Navigation helpers
  const canGoBack = useMemo(() => store.historyIndex > 0, [store.historyIndex])
  const canGoForward = useMemo(() => store.historyIndex < store.history.length - 1, [store.historyIndex, store.history.length])
  
  // Scene operations med error handling och notifications
  const navigateToScene = useCallback(async (id: string, context?: Record<string, any>) => {
    try {
      const scene = scenes[id]
      if (!scene) {
        toast.error('Scene not found')
        return false
      }
      
      store.navigateToScene(id, context)
      toast.success(`Navigated to ${scene.metadata.title}`)
      return true
    } catch (error) {
      toast.error('Failed to navigate to scene')
      console.error('Navigation error:', error)
      return false
    }
  }, [scenes, store])
  
  const showScene = useCallback((id: string) => {
    try {
      const scene = scenes[id]
      if (!scene) {
        toast.error('Scene not found')
        return false
      }
      
      store.showScene(id)
      toast.success(`${scene.metadata.title} is now visible`)
      return true
    } catch (error) {
      toast.error('Failed to show scene')
      console.error('Show scene error:', error)
      return false
    }
  }, [scenes, store])
  
  const hideScene = useCallback((id: string) => {
    try {
      const scene = scenes[id]
      if (!scene) {
        toast.error('Scene not found')
        return false
      }
      
      store.hideScene(id)
      toast.success(`${scene.metadata.title} is now hidden`)
      return true
    } catch (error) {
      toast.error('Failed to hide scene')
      console.error('Hide scene error:', error)
      return false
    }
  }, [scenes, store])
  
  const toggleSceneVisibility = useCallback((id: string) => {
    const isVisible = store.visibleScenes.has(id)
    return isVisible ? hideScene(id) : showScene(id)
  }, [store.visibleScenes, hideScene, showScene])
  
  const refreshScene = useCallback(async (id: string) => {
    try {
      const scene = scenes[id]
      if (!scene) {
        toast.error('Scene not found')
        return false
      }
      
      await store.refreshScene(id)
      toast.success(`${scene.metadata.title} refreshed`)
      return true
    } catch (error) {
      toast.error('Failed to refresh scene')
      console.error('Refresh scene error:', error)
      return false
    }
  }, [scenes, store])
  
  const bookmarkScene = useCallback((id: string) => {
    try {
      const scene = scenes[id]
      if (!scene) {
        toast.error('Scene not found')
        return false
      }
      
      const isBookmarked = scene.metadata.isBookmarked
      if (isBookmarked) {
        store.unbookmarkScene(id)
        toast.success(`Removed ${scene.metadata.title} from bookmarks`)
      } else {
        store.bookmarkScene(id)
        toast.success(`Added ${scene.metadata.title} to bookmarks`)
      }
      return true
    } catch (error) {
      toast.error('Failed to update bookmark')
      console.error('Bookmark error:', error)
      return false
    }
  }, [scenes, store])
  
  const duplicateScene = useCallback((id: string, newTitle?: string) => {
    try {
      const scene = scenes[id]
      if (!scene) {
        toast.error('Scene not found')
        return null
      }
      
      const newId = store.duplicateScene(id, newTitle)
      toast.success(`Duplicated ${scene.metadata.title}`)
      return newId
    } catch (error) {
      toast.error('Failed to duplicate scene')
      console.error('Duplicate scene error:', error)
      return null
    }
  }, [scenes, store])
  
  const removeScene = useCallback((id: string) => {
    try {
      const scene = scenes[id]
      if (!scene) {
        toast.error('Scene not found')
        return false
      }
      
      store.removeScene(id)
      toast.success(`Removed ${scene.metadata.title}`)
      return true
    } catch (error) {
      toast.error('Failed to remove scene')
      console.error('Remove scene error:', error)
      return false
    }
  }, [scenes, store])
  
  // Bulk operations
  const showMultipleScenes = useCallback((ids: string[]) => {
    try {
      const validIds = ids.filter(id => scenes[id])
      if (validIds.length === 0) {
        toast.error('No valid scenes found')
        return false
      }
      
      store.showMultipleScenes(validIds)
      toast.success(`Showing ${validIds.length} scenes`)
      return true
    } catch (error) {
      toast.error('Failed to show scenes')
      console.error('Show multiple scenes error:', error)
      return false
    }
  }, [scenes, store])
  
  const hideAllScenes = useCallback(() => {
    try {
      store.hideAllScenes()
      toast.success('All scenes hidden')
      return true
    } catch (error) {
      toast.error('Failed to hide all scenes')
      console.error('Hide all scenes error:', error)
      return false
    }
  }, [store])
  
  // Utility functions
  const getScenesByCategory = useCallback((category: SceneCategory) => {
    return store.getScenesByCategory(category)
  }, [store])
  
  const isSceneVisible = useCallback((id: string) => {
    return store.visibleScenes.has(id)
  }, [store.visibleScenes])
  
  const getSceneStatus = useCallback((id: string) => {
    return scenes[id]?.status || 'inactive'
  }, [scenes])
  
  const isSceneBookmarked = useCallback((id: string) => {
    return scenes[id]?.metadata.isBookmarked || false
  }, [scenes])
  
  // Search and filter helpers
  const searchScenes = useCallback((query: string) => {
    store.setSearchQuery(query)
  }, [store])
  
  const filterByCategory = useCallback((category: SceneCategory | 'all') => {
    store.setActiveCategory(category)
  }, [store])
  
  const sortScenes = useCallback((sortBy: 'title' | 'lastAccessed' | 'priority' | 'category', order: 'asc' | 'desc' = 'asc') => {
    store.setSortBy(sortBy)
    store.setSortOrder(order)
  }, [store])
  
  // Export/Import
  const exportScenes = useCallback((ids?: string[]) => {
    try {
      const data = store.exportScenes(ids)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `scenes-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success('Scenes exported successfully')
      return true
    } catch (error) {
      toast.error('Failed to export scenes')
      console.error('Export error:', error)
      return false
    }
  }, [store])
  
  const importScenes = useCallback((file: File) => {
    return new Promise<boolean>((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = e.target?.result as string
          store.importScenes(data)
          toast.success('Scenes imported successfully')
          resolve(true)
        } catch (error) {
          toast.error('Failed to import scenes')
          console.error('Import error:', error)
          resolve(false)
        }
      }
      reader.onerror = () => {
        toast.error('Failed to read file')
        resolve(false)
      }
      reader.readAsText(file)
    })
  }, [store])
  
  return {
    // State
    currentScene,
    scenes,
    visibleScenes,
    filteredScenes,
    isLoading: store.isLoading,
    error: store.error,
    
    // Navigation
    canGoBack,
    canGoForward,
    goBack: store.goBack,
    goForward: store.goForward,
    clearHistory: store.clearHistory,
    
    // Scene operations
    navigateToScene,
    showScene,
    hideScene,
    toggleSceneVisibility,
    refreshScene,
    bookmarkScene,
    duplicateScene,
    removeScene,
    
    // Bulk operations
    showMultipleScenes,
    hideAllScenes,
    
    // Utility
    getScenesByCategory,
    isSceneVisible,
    getSceneStatus,
    isSceneBookmarked,
    
    // Search and filter
    searchScenes,
    filterByCategory,
    sortScenes,
    activeCategory: store.activeCategory,
    searchQuery: store.searchQuery,
    sortBy: store.sortBy,
    sortOrder: store.sortOrder,
    
    // UI state
    viewMode: store.viewMode,
    setViewMode: store.setViewMode,
    sidebarCollapsed: store.sidebarCollapsed,
    toggleSidebar: store.toggleSidebar,
    
    // Export/Import
    exportScenes,
    importScenes,
    
    // Store actions (för avancerad användning)
    store
  }
}

/**
 * Hook för att få en specifik scene
 */
export const useSceneById = (id: string) => {
  const scene = useSceneStore(state => state.scenes[id])
  const isVisible = useSceneStore(state => state.visibleScenes.has(id))
  const isCurrent = useSceneStore(state => state.currentScene?.id === id)
  
  return {
    scene,
    isVisible,
    isCurrent,
    exists: !!scene
  }
}

/**
 * Hook för scene kategorier
 */
export const useSceneCategories = () => {
  const scenes = useSceneStore(state => state.scenes)
  
  const categories = useMemo(() => {
    const categoryMap = new Map<SceneCategory, number>()
    
    Object.values(scenes).forEach(scene => {
      const count = categoryMap.get(scene.metadata.category) || 0
      categoryMap.set(scene.metadata.category, count + 1)
    })
    
    return Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
      label: category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')
    }))
  }, [scenes])
  
  return categories
}

/**
 * Hook för bookmarkade scener
 */
export const useBookmarkedScenes = () => {
  const scenes = useSceneStore(state => state.scenes)
  
  const bookmarkedScenes = useMemo(() => {
    return Object.values(scenes)
      .filter(scene => scene.metadata.isBookmarked)
      .sort((a, b) => {
        const aTime = a.metadata.lastAccessed?.getTime() || 0
        const bTime = b.metadata.lastAccessed?.getTime() || 0
        return bTime - aTime
      })
  }, [scenes])
  
  return bookmarkedScenes
}

/**
 * Hook för recent scenes
 */
export const useRecentScenes = (limit: number = 5) => {
  const scenes = useSceneStore(state => state.scenes)
  
  const recentScenes = useMemo(() => {
    return Object.values(scenes)
      .filter(scene => scene.metadata.lastAccessed)
      .sort((a, b) => {
        const aTime = a.metadata.lastAccessed?.getTime() || 0
        const bTime = b.metadata.lastAccessed?.getTime() || 0
        return bTime - aTime
      })
      .slice(0, limit)
  }, [scenes, limit])
  
  return recentScenes
}
