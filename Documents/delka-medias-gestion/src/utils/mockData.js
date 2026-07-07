export const TYPE_ICONS  = { photo: '🖼️', video: '🎬', doc: '📄' }
export const TYPE_LABELS = { photo: 'Photo', video: 'Vidéo', doc: 'Document' }
export const TYPE_BADGE  = { photo: 'type-photo', video: 'type-video', doc: 'type-doc' }

// Aucun fichier démo — galerie vide au démarrage
export const INITIAL_MEDIA = []

export function detectType(filename) {
  const ext = filename.split('.').pop().toLowerCase()
  if (['jpg','jpeg','png','gif','webp','heic','bmp','svg'].includes(ext)) return 'photo'
  if (['mp4','mov','avi','mkv','webm','flv'].includes(ext)) return 'video'
  return 'doc'
}

export function formatSize(bytes) {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' GB'
  if (bytes >= 1048576)    return (bytes / 1048576).toFixed(1)    + ' MB'
  return (bytes / 1024).toFixed(0) + ' KB'
}

export function formatDate(date = new Date()) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}
