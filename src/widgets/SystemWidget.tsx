import { useEffect } from 'react'
import { useOSStore } from '../store'

interface MetricProps {
  name: string
  value: number
  history: number[]
  unit?: string
}

function getColor(v: number): string {
  if (v > 80) return '#FF4444'
  if (v > 60) return '#FFB800'
  return '#00FF41'
}

function Metric({ name, value, history, unit = '%' }: MetricProps) {
  const color = getColor(value)
  const max = Math.max(...history, 1)

  return (
    <div className="sys-metric">
      <div className="sys-metric-header">
        <span className="sys-metric-name">{name}</span>
        <span className="sys-metric-val" style={{ color }}>
          {Math.round(value)}{unit}
        </span>
      </div>
      <div className="sys-bar">
        <div
          className="sys-bar-fill"
          style={{
            width: `${value}%`,
            background: `linear-gradient(90deg, ${color}44, ${color})`,
            boxShadow: `0 0 6px ${color}66`,
          }}
        />
      </div>
      <div className="sys-mini-chart">
        {history.map((v, i) => (
          <div
            key={i}
            className="sys-mini-bar"
            style={{
              height: `${(v / max) * 100}%`,
              background: i === history.length - 1 ? color : `${color}44`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function SystemWidget() {
  const { cpuHistory, memHistory, netHistory, tickStats } = useOSStore()

  useEffect(() => {
    const id = setInterval(tickStats, 1200)
    return () => clearInterval(id)
  }, [tickStats])

  const cpu = cpuHistory.at(-1) ?? 0
  const mem = memHistory.at(-1) ?? 0
  const net = netHistory.at(-1) ?? 0
  const gpu = 72 + Math.sin(Date.now() / 4000) * 12

  return (
    <div className="widget widget-system">
      <div className="widget-header">
        <span className="widget-title">SYSTEM</span>
        <span className="widget-icon">◎</span>
      </div>
      <div className="widget-body">
        <div className="sys-row">
          <Metric name="CPU" value={cpu} history={cpuHistory} />
          <Metric name="MEM" value={mem} history={memHistory} />
          <Metric name="NET" value={net} history={netHistory} />
          <Metric name="GPU" value={gpu} history={memHistory.map((v) => v * 0.9)} />
        </div>

        <div style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: '1px solid var(--border)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 6,
        }}>
          {[
            { k: 'PROCESSES', v: '312' },
            { k: 'THREADS', v: '1,428' },
            { k: 'HEAP', v: '142 MB' },
            { k: 'FPS', v: '60' },
          ].map(({ k, v }) => (
            <div key={k} style={{
              background: 'rgba(0,255,65,0.02)',
              border: '1px solid var(--border)',
              borderRadius: 5,
              padding: '5px 8px',
            }}>
              <div style={{ fontSize: 8, letterSpacing: '0.12em', color: 'var(--text-muted)', marginBottom: 2 }}>{k}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-bright)' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
