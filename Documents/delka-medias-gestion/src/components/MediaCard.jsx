import { TYPE_ICONS, TYPE_LABELS, TYPE_BADGE } from '../utils/mockData'

export default function MediaCard({ item, viewMode, onOpen, onDelete }) {
  if (viewMode === 'list') {
    return (
      <div className="media-card list-view" onClick={() => onOpen(item)}>
        <div className="media-thumbnail">
          <span>{item.emoji || TYPE_ICONS[item.type]}</span>
        </div>
        <div className="media-info">
          <div className="media-name">{item.name}</div>
          <span className={`media-type-badge ${TYPE_BADGE[item.type]}`}>{TYPE_LABELS[item.type]}</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.size}</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.date}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="media-card" onClick={() => onOpen(item)}>
      <div className="media-thumbnail">
        <span>{item.emoji || TYPE_ICONS[item.type]}</span>
        <div className="media-thumbnail-overlay">
          <button className="overlay-btn" onClick={e => { e.stopPropagation(); onOpen(item) }}>👁️ Voir</button>
          <button className="overlay-btn" onClick={e => { e.stopPropagation(); onDelete(item.id) }}>🗑️</button>
        </div>
      </div>
      <div className="media-info">
        <div className="media-name">{item.name}</div>
        <div className="media-meta">
          <span className={`media-type-badge ${TYPE_BADGE[item.type]}`}>{TYPE_LABELS[item.type]}</span>
          <span>{item.size}</span>
        </div>
      </div>
    </div>
  )
}
