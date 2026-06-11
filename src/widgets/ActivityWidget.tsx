import { useEffect, useCallback } from 'react'
import { useOSStore, ActivityEntry } from '../store'

const TYPE_COLORS: Record<ActivityEntry['type'], string> = {
  deploy: '#00F5FF',
  commit: '#8B5CF6',
  test:   '#00F5FF',
  build:  '#FFB800',
  pr:     '#F0ABFC',
  alert:  '#FF4444',
}

function ago(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 60)   return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  return `${Math.floor(s / 3600)}h ago`
}

const FAKE_EVENTS: Omit<ActivityEntry, 'id' | 'ts'>[] = [
  { type: 'commit', message: 'commit:pushed',  detail: 'refactor/scene-graph' },
  { type: 'build',  message: 'build:started',  detail: 'ci/cd pipeline' },
  { type: 'test',   message: 'tests:running',  detail: '98 tests queued' },
  { type: 'deploy', message: 'deploy:queued',  detail: 'staging → preview' },
  { type: 'pr',     message: 'pr:reviewed',    detail: 'feature/widgets #151' },
]

export default function ActivityWidget() {
  const { activity, pushActivity } = useOSStore()

  const injectEvent = useCallback(() => {
    const e = FAKE_EVENTS[Math.floor(Math.random() * FAKE_EVENTS.length)]
    pushActivity(e)
  }, [pushActivity])

  useEffect(() => {
    const min = 5000
    const max = 14000
    let timer: ReturnType<typeof setTimeout>
    const schedule = () => {
      timer = setTimeout(() => { injectEvent(); schedule() }, min + Math.random() * (max - min))
    }
    schedule()
    return () => clearTimeout(timer)
  }, [injectEvent])

  return (
    <div className="widget widget-activity">
      <div className="widget-header">
        <span className="widget-title">ACTIVITY</span>
        <span style={{ fontSize: 9, color: 'var(--accent)', letterSpacing: '0.1em' }}>LIVE</span>
        <div style={{
          width: 5, height: 5, borderRadius: '50%',
          background: 'var(--accent)',
          boxShadow: '0 0 8px rgba(0,245,255,0.9)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
        <span className="widget-icon">⬦</span>
      </div>
      <div className="widget-body" style={{ padding: '0 14px' }}>
        <div className="activity-list">
          {activity.slice(0, 8).map((entry) => (
            <div key={entry.id} className="activity-item">
              <div
                className="activity-dot"
                style={{
                  background: TYPE_COLORS[entry.type],
                  boxShadow: `0 0 5px ${TYPE_COLORS[entry.type]}88`,
                }}
              />
              <div className="activity-content">
                <div className="activity-msg">{entry.message}</div>
                <div className="activity-detail">{entry.detail}</div>
              </div>
              <div className="activity-time">{ago(entry.ts)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
