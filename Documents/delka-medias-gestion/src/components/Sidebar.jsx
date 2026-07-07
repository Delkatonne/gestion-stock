import { useAuth } from '../context/AuthContext'
import { useMedia } from '../context/MediaContext'

function formatBytes(bytes) {
  if (!bytes) return '0 MB'
  if (bytes >= 1_073_741_824) return (bytes / 1_073_741_824).toFixed(1) + ' GB'
  if (bytes >= 1_048_576)     return (bytes / 1_048_576).toFixed(1)     + ' MB'
  return (bytes / 1024).toFixed(0) + ' KB'
}

const MAX_BYTES = 2 * 1024 * 1024 * 1024 // 2 GB par utilisateur

export default function Sidebar({ activeTab, setActiveTab, setFilter, sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useAuth()
  const { photos, videos, docs, starred, storageBytes } = useMedia()

  const pct     = Math.min((storageBytes / MAX_BYTES) * 100, 100).toFixed(1)
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const navItems = [
    { id: 'all',     icon: '🏠', label: 'Accueil',  badge: null },
    { id: 'recent',  icon: '🕐', label: 'Récents',  badge: null },
    { id: 'starred', icon: '⭐', label: 'Favoris',  badge: starred.length || null },
  ]
  const typeItems = [
    { id: 'photos', icon: '🖼️', label: 'Photos',    badge: photos.length, filter: 'photo' },
    { id: 'videos', icon: '🎬', label: 'Vidéos',    badge: videos.length, filter: 'video' },
    { id: 'docs',   icon: '📄', label: 'Documents', badge: docs.length,   filter: 'doc'   },
  ]

  return (
    <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">📁</div>
          <div>
            <div className="sidebar-brand-name">Delka Médias</div>
            <div className="sidebar-brand-sub">Gestion</div>
          </div>
        </div>
      </div>

      <div className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {navItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(item.id); setFilter('all'); setSidebarOpen(false) }}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
          </div>
        ))}

        <div className="nav-section-label">Mes médias</div>
        {typeItems.map(item => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => { setActiveTab(item.id); setFilter(item.filter); setSidebarOpen(false) }}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
            {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
          </div>
        ))}

        <div className="nav-section-label">Stockage</div>
        <div className="storage-mini">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6 }}>
            <span>{formatBytes(storageBytes)} utilisés</span>
            <span>{formatBytes(MAX_BYTES)}</span>
          </div>
          <div className="storage-bar-sm">
            <div className="storage-fill-sm" style={{ width: pct + '%' }} />
          </div>
          <div className="storage-label-sm" style={{ marginTop: 4 }}>{pct}% utilisé</div>
        </div>
      </div>

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-email">{user.email}</div>
          </div>
          <button className="logout-btn" onClick={logout} title="Se déconnecter">🚪</button>
        </div>
      </div>
    </nav>
  )
}
