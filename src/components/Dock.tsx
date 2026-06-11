const APPS = [
  { icon: '⬡', label: 'Dashboard' },
  { icon: '◈', label: 'Terminal' },
  { icon: '◉', label: 'Monitor' },
  { icon: '⬟', label: 'Network' },
  { icon: '◎', label: 'Files' },
  { icon: '⬦', label: 'Settings' },
]

const UTILS = [
  { icon: '⬮', label: 'Notifications' },
  { icon: '⬭', label: 'Power' },
]

export default function Dock() {
  return (
    <nav className="dock">
      {APPS.map((app) => (
        <div key={app.label} className="dock-item">
          <span>{app.icon}</span>
          <span className="dock-label">{app.label}</span>
        </div>
      ))}
      <div className="dock-separator" />
      {UTILS.map((u) => (
        <div key={u.label} className="dock-item">
          <span>{u.icon}</span>
          <span className="dock-label">{u.label}</span>
        </div>
      ))}
    </nav>
  )
}
