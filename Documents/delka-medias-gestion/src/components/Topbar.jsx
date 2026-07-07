const TITLES = {
  all: '🏠 Tous mes médias',
  recent: '🕐 Récents',
  starred: '⭐ Favoris',
  photos: '🖼️ Photos',
  videos: '🎬 Vidéos',
  docs: '📄 Documents',
}

export default function Topbar({ activeTab, search, setSearch, onUploadClick, onMenuClick }) {
  return (
    <div className="topbar">
      <button
        className="logout-btn"
        style={{ display: 'none' }}
        onClick={onMenuClick}
        aria-label="Menu"
      >☰</button>
      <div className="topbar-title">{TITLES[activeTab] || 'Delka Médias'}</div>
      <div className="search-bar">
        <span>🔍</span>
        <input
          placeholder="Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <button className="btn-upload" onClick={onUploadClick}>+ Ajouter</button>
    </div>
  )
}
