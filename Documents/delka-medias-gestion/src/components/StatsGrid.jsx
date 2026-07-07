import { useMedia } from '../context/MediaContext'

export default function StatsGrid() {
  const { media, photos, videos, docs } = useMedia()

  // Calcul réel de la taille totale (sera connecté à l'API plus tard)
  const totalFiles = media.length

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">🖼️</div>
        <div className="stat-value">{photos.length}</div>
        <div className="stat-label">Photos</div>
        <div className="stat-accent">{photos.length === 0 ? 'Aucune photo' : 'Sauvegardées'}</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">🎬</div>
        <div className="stat-value">{videos.length}</div>
        <div className="stat-label">Vidéos</div>
        <div className="stat-accent">{videos.length === 0 ? 'Aucune vidéo' : 'Sauvegardées'}</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📄</div>
        <div className="stat-value">{docs.length}</div>
        <div className="stat-label">Documents</div>
        <div className="stat-accent">{docs.length === 0 ? 'Aucun document' : 'Sécurisés'}</div>
      </div>
      <div className="stat-card">
        <div className="stat-icon">📦</div>
        <div className="stat-value">{totalFiles}</div>
        <div className="stat-label">Total fichiers</div>
        <div className="stat-accent">{totalFiles === 0 ? 'Commencez à uploader !' : 'Fichiers stockés'}</div>
      </div>
    </div>
  )
}
