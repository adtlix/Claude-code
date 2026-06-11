import { useEffect, useRef, useState } from 'react'
import { useOSStore } from '../store'

export default function NotesWidget() {
  const { notes, setNotes, notesLastSaved, touchNotesSaved } = useOSStore()
  const [saveLabel, setSaveLabel] = useState<string>('SAVED')
  const [fresh, setFresh] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const lines = notes.split('\n').length

  const handleChange = (v: string) => {
    setNotes(v)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      touchNotesSaved()
      setSaveLabel('SAVED')
      setFresh(true)
      setTimeout(() => setFresh(false), 1800)
    }, 800)
  }

  useEffect(() => {
    const ago = Math.round((Date.now() - notesLastSaved) / 1000)
    if (ago < 60) setSaveLabel('SAVED')
    else if (ago < 3600) setSaveLabel(`${Math.floor(ago / 60)}m ago`)
    else setSaveLabel(`${Math.floor(ago / 3600)}h ago`)
  }, [notesLastSaved])

  return (
    <div className="widget widget-notes">
      <div className="widget-header">
        <span className="widget-title">NOTES</span>
        <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          {lines}L
        </span>
        <span className={`notes-saved${fresh ? ' fresh' : ''}`}>{saveLabel}</span>
        <span className="widget-icon">⬡</span>
      </div>
      <div className="widget-body" style={{ padding: '8px 12px' }}>
        <textarea
          className="notes-area"
          value={notes}
          onChange={(e) => handleChange(e.target.value)}
          spellCheck={false}
        />
      </div>
    </div>
  )
}
