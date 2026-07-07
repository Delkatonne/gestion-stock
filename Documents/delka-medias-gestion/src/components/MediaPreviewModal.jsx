import { useState } from 'react'
import { TYPE_ICONS, TYPE_LABELS } from '../utils/mockData'

export default function MediaPreviewModal({ item, onClose, onDelete }) {
  const [deleting, setDeleting] = useState(false)

  if (!item) return null

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${item.name}" définitivement ?`)) return
    setDeleting(true)
    try {
      await onDelete(item.id)
      onClose()
    } catch (err) {
      alert('Erreur lors de la suppression : ' + err.message)
      setDeleting(false)
    }
  }

  const handleDownload = () => {
    // L'URL Cloudinary permet le téléchargement direct
    const a = document.createElement('a')
    a.href = item.url
    a.download = item.original_name || item.name
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    a.click()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">📎 {item.name}</div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">

          {/* Aperçu */}
          <div className="preview-hero">
            {item.thumbnail_url
              ? <img src={item.thumbnail_url} alt={item.name} />
              : <span>{TYPE_ICONS[item.type]}</span>
            }
          </div>

          {/* Détails */}
          <div className="preview-details">
            <div className="detail-item"><label>Nom du fichier</label><p>{item.name}</p></div>
            <div className="detail-item"><label>Type</label><p>{TYPE_LABELS[item.type]}</p></div>
            <div className="detail-item"><label>Taille</label><p>{item.size}</p></div>
            <div className="detail-item"><label>Date d'ajout</label><p>{item.date}</p></div>
            <div className="detail-item"><label>Catégorie</label><p>{item.category}</p></div>
            <div className="detail-item"><label>Identifiant</label><p>#{item.id}</p></div>
          </div>

          {/* Actions */}
          <div className="preview-actions">
            <button className="btn-action primary" onClick={handleDownload}>
              ⬇️ Télécharger
            </button>
            <button
              className="btn-action danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? '⏳ Suppression...' : '🗑️ Supprimer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
