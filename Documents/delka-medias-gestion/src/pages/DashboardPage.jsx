import { useState } from 'react'
import { useMedia } from '../context/MediaContext'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import StatsGrid from '../components/StatsGrid'
import FilterBar from '../components/FilterBar'
import MediaGrid from '../components/MediaGrid'
import MediaPreviewModal from '../components/MediaPreviewModal'
import UploadModal from '../components/UploadModal'
import Toast from '../components/Toast'

export default function DashboardPage() {
  const { media, loading, error, addMedia, deleteMedia, fetchMedia } = useMedia()

  const [activeTab, setActiveTab]   = useState('all')
  const [filter, setFilter]         = useState('all')
  const [viewMode, setViewMode]     = useState('grid')
  const [search, setSearch]         = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [showUpload, setShowUpload] = useState(false)
  const [toast, setToast]           = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleDelete = async (id) => {
    await deleteMedia(id)
    showToast('Fichier supprimé définitivement.')
  }

  const handleUpload = (item) => {
    addMedia(item)
    showToast(`"${item.name}" sauvegardé avec succès ! ✨`)
  }

  const filtered = media.filter(m => {
    if (filter !== 'all' && m.type !== filter) return false
    if (activeTab === 'starred' && !m.starred) return false
    if (search) {
      const q = search.toLowerCase()
      if (!m.name.toLowerCase().includes(q) && !(m.category || '').toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <div className="app-layout">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setFilter={setFilter}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="main-content">
        <Topbar
          activeTab={activeTab}
          search={search}
          setSearch={setSearch}
          onUploadClick={() => setShowUpload(true)}
          onMenuClick={() => setSidebarOpen(o => !o)}
        />

        <div className="content-area">
          <StatsGrid />

          {/* États de chargement / erreur */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
              ⏳ Chargement de vos médias…
            </div>
          )}
          {error && !loading && (
            <div className="alert alert-error" style={{ marginBottom: 20 }}>
              ⚠️ {error}
              <button
                onClick={fetchMedia}
                style={{ marginLeft: 12, background: 'none', border: 'none', color: 'var(--primary-light)', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                Réessayer
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              <FilterBar filter={filter} setFilter={setFilter} viewMode={viewMode} setViewMode={setViewMode} />
              <MediaGrid items={filtered} viewMode={viewMode} onOpen={setSelectedItem} onDelete={handleDelete} />
            </>
          )}
        </div>
      </div>

      {selectedItem && (
        <MediaPreviewModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onDelete={handleDelete}
        />
      )}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
        />
      )}
      <Toast toast={toast} />
    </div>
  )
}
