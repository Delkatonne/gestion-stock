export default function FilterBar({ filter, setFilter, viewMode, setViewMode }) {
  return (
    <div className="filter-row">
      <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Tous</button>
      <button className={`filter-btn ${filter === 'photo' ? 'active' : ''}`} onClick={() => setFilter('photo')}>🖼️ Photos</button>
      <button className={`filter-btn ${filter === 'video' ? 'active' : ''}`} onClick={() => setFilter('video')}>🎬 Vidéos</button>
      <button className={`filter-btn ${filter === 'doc' ? 'active' : ''}`} onClick={() => setFilter('doc')}>📄 Documents</button>
      <div className="view-toggle">
        <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>⊞</button>
        <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>☰</button>
      </div>
    </div>
  )
}
