import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { mediaAPI } from '../utils/api'
import { useAuth } from './AuthContext'

const MediaContext = createContext(null)

export function MediaProvider({ children }) {
  const { user } = useAuth()
  const [media, setMedia] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [storageBytes, setStorageBytes] = useState(0)

  // Charger les médias depuis le backend au montage
  const fetchMedia = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const data = await mediaAPI.list()
      setMedia(data.media || [])
      setStorageBytes(data.total_bytes || 0)
    } catch (err) {
      setError(err.message || 'Impossible de charger les médias.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchMedia() }, [fetchMedia])

  const addMedia = (item) => setMedia(prev => [item, ...prev])

  const deleteMedia = async (id) => {
    await mediaAPI.delete(id)
    setMedia(prev => prev.filter(m => m.id !== id))
  }

  const renameMedia = async (id, name) => {
    const data = await mediaAPI.rename(id, name)
    setMedia(prev => prev.map(m => m.id === id ? data.media : m))
  }

  const toggleStar = async (id) => {
    const item = media.find(m => m.id === id)
    if (!item) return
    const data = await mediaAPI.rename(id, item.name, { starred: !item.starred })
    setMedia(prev => prev.map(m => m.id === id ? { ...m, starred: !m.starred } : m))
  }

  const photos  = media.filter(m => m.type === 'photo')
  const videos  = media.filter(m => m.type === 'video')
  const docs    = media.filter(m => m.type === 'doc')
  const starred = media.filter(m => m.starred)

  return (
    <MediaContext.Provider value={{
      media, loading, error, storageBytes,
      photos, videos, docs, starred,
      addMedia, deleteMedia, renameMedia, toggleStar, fetchMedia,
    }}>
      {children}
    </MediaContext.Provider>
  )
}

export function useMedia() {
  const ctx = useContext(MediaContext)
  if (!ctx) throw new Error('useMedia must be used inside MediaProvider')
  return ctx
}
