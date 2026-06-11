import { useEffect } from 'react'
import { useOSStore } from '../store'

const CHECKS = [
  { label: 'Core systems',       detail: 'kernel v2.0.1',   status: 'ok',   delay: 1100 },
  { label: 'Neural interface',   detail: 'connecting...',   status: 'init', delay: 1250 },
  { label: 'Display subsystem',  detail: 'WebGL 2.0 OK',    status: 'ok',   delay: 1400 },
  { label: 'Memory allocator',   detail: '8192 MB free',    status: 'ok',   delay: 1550 },
  { label: 'Network stack',      detail: 'IPv6 ready',      status: 'ok',   delay: 1700 },
  { label: 'Security kernel',    detail: 'vault locked',    status: 'ok',   delay: 1850 },
  { label: 'AI runtime',         detail: 'model loaded',    status: 'ok',   delay: 2000 },
]

export default function BootScreen({ onDone, fadingOut }: { onDone: () => void; fadingOut?: boolean }) {
  const setBooted = useOSStore((s) => s.setBooted)

  useEffect(() => {
    const t = setTimeout(() => {
      setBooted()
      onDone()
    }, 3600)
    return () => clearTimeout(t)
  }, [onDone, setBooted])

  return (
    <div className={`boot-screen${fadingOut ? ' fade-out' : ''}`} id="boot-screen">
      <div className="boot-content">
        <div className="boot-logo">PERSONAL OS</div>
        <div className="boot-sub">SYSTEM v2.0 — NEURAL INTERFACE</div>
        <div className="boot-divider" />

        <div className="boot-checks">
          {CHECKS.map((c, i) => (
            <div key={i} className="boot-check">
              <span className={`boot-check-status status-${c.status}`}>
                {c.status === 'ok' ? ' OK ' : 'INIT'}
              </span>
              <span className="boot-check-text">{c.label}</span>
              <span className="boot-check-detail">{c.detail}</span>
            </div>
          ))}
        </div>

        <div className="boot-progress">
          <div className="boot-progress-bar">
            <div className="boot-progress-fill" />
          </div>
          <div className="boot-progress-text">
            <span>INITIALIZING</span>
            <span>100%</span>
          </div>
        </div>

        <div className="boot-complete">▸ BOOT SEQUENCE COMPLETE</div>
      </div>
    </div>
  )
}
