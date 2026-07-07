import MediaCard from './MediaCard'

export default function MediaGrid({ items, viewMode, onOpen, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">☁️</div>
        <div className="empty-title">Votre espace est vide</div>
        <div className="empty-text">
          Cliquez sur <strong>+ Ajouter</strong> pour sauvegarder<br />
          vos photos, vidéos et documents en toute sécurité.
        </div>
        <div style={{ marginTop: 12, fontSize: '0.78rem', color: 'var(--accent)' }}>
          Vos fichiers seront conservés pour toujours ✨
        </div>
      </div>
    )
  }

  return (
    <div className={`media-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
      {items.map(item => (
        <MediaCard key={item.id} item={item} viewMode={viewMode} onOpen={onOpen} onDelete={onDelete} />
      ))}
    </div>
  )
}
