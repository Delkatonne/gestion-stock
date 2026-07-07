import { useRef, useState } from 'react'
import { mediaAPI } from '../utils/api'
import { detectType } from '../utils/mockData'

export default function UploadModal({ onClose, onUpload }) {
  const [dragging, setDragging] = useState(false)
  const [uploads, setUploads] = useState([])
  const [category, setCategory] = useState('Général')
  const fileRef = useRef()

  const uploadFiles = async (files) => {
    const items = Array.from(files).map(f => ({
      file: f,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'pending', // pending | uploading | done | error
      error: null,
    }))
    setUploads(items)

    for (const item of items) {
      // Marquer comme en cours
      setUploads(prev => prev.map(u => u.id === item.id ? { ...u, status: 'uploading', progress: 30 } : u))

      try {
        const data = await mediaAPI.upload(item.file, category)

        setUploads(prev => prev.map(u => u.id === item.id ? { ...u, status: 'done', progress: 100 } : u))
        onUpload(data.media)
      } catch (err) {
        setUploads(prev => prev.map(u =>
          u.id === item.id ? { ...u, status: 'error', progress: 0, error: err.message } : u
        ))
      }
    }
  }

  const statusIcon = (u) => {
    if (u.status === 'done')     return '✅'
    if (u.status === 'error')    return '❌'
    if (u.status === 'uploading') return `${u.progress}%`
    return '⏳'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">📤 Ajouter des médias</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">

          {/* Catégorie */}
          <div className="field-group" style={{ marginBottom: 16 }}>
            <label className="field-label">Catégorie</label>
            <select
              className="field-input"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option>Général</option>
              <option>Famille</option>
              <option>Voyages</option>
              <option>Événements</option>
              <option>Professionnel</option>
              <option>Académique</option>
              <option>Documents</option>
            </select>
          </div>

          {/* Zone de drop */}
          <div
            className={`drop-zone ${dragging ? 'dragging' : ''}`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); uploadFiles(e.dataTransfer.files) }}
            onClick={() => fileRef.current.click()}
          >
            <div className="drop-zone-icon">📂</div>
            <div className="drop-zone-title">Glissez vos fichiers ici</div>
            <div className="drop-zone-sub">Photos, vidéos, documents · Max 500 MB par fichier</div>
            <input
              ref={fileRef} type="file" multiple style={{ display: 'none' }}
              onChange={e => uploadFiles(e.target.files)}
            />
          </div>

          {/* Progression */}
          {uploads.length > 0 && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: 10, fontSize: '0.85rem' }}>
                Importation en cours…
              </div>
              {uploads.map(u => (
                <div key={u.id} className="upload-progress">
                  <div className="upload-progress-icon">
                    {detectType(u.file.name) === 'photo' ? '🖼️' : detectType(u.file.name) === 'video' ? '🎬' : '📄'}
                  </div>
                  <div className="upload-progress-info">
                    <div className="upload-progress-name">{u.file.name}</div>
                    {u.status === 'error'
                      ? <div style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>{u.error}</div>
                      : <div className="progress-bar">
                          <div className="progress-fill" style={{ width: u.progress + '%' }} />
                        </div>
                    }
                  </div>
                  <div className="upload-progress-pct">{statusIcon(u)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
