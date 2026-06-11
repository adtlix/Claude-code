import { useOSStore } from '../store'

export default function NotesWidget() {
  const { notes, setNotes } = useOSStore()
  const lines = notes.split('\n').length

  return (
    <div className="widget widget-notes">
      <div className="widget-header">
        <span className="widget-title">NOTES</span>
        <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          {lines}L
        </span>
        <span className="widget-icon">⬡</span>
      </div>
      <div className="widget-body" style={{ padding: '8px 12px' }}>
        <textarea
          className="notes-area"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          spellCheck={false}
        />
      </div>
    </div>
  )
}
