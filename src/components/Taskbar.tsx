import { useTime, pad } from '../hooks/useTime'

const TAGS = [
  { label: 'WORKSPACE', active: true },
  { label: 'TERMINAL' },
  { label: 'MONITOR' },
  { label: 'NETWORK' },
]

export default function Taskbar() {
  const now = useTime()
  const h = pad(now.getHours())
  const m = pad(now.getMinutes())
  const s = pad(now.getSeconds())

  return (
    <header className="taskbar">
      <div className="taskbar-logo">
        <div className="taskbar-logo-icon" />
        <span>POS</span>
      </div>

      <div className="taskbar-center">
        {TAGS.map((t) => (
          <span key={t.label} className={`taskbar-tag${t.active ? ' active' : ''}`}>
            {t.label}
          </span>
        ))}
      </div>

      <div className="taskbar-right">
        <div className="taskbar-status">
          <div className="status-dot" />
          <span className="status-label">ONLINE</span>
        </div>
        <div className="taskbar-clock">
          {h}<span>:</span>{m}<span>:</span>{s}
        </div>
      </div>
    </header>
  )
}
