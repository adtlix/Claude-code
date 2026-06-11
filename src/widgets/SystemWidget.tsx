import { useEffect, useRef } from 'react'
import { useOSStore } from '../store'

function getColor(v: number, base: string): string {
  if (v > 80) return '#FF4444'
  if (v > 60) return '#FFB800'
  return base
}

interface RingProps {
  name: string
  value: number
  base: string
  size?: number
}

function RingMetric({ name, value, base, size = 62 }: RingProps) {
  const color = getColor(value, base)
  const r = (size / 2) - 7
  const circ = 2 * Math.PI * r
  const filled = (Math.min(value, 100) / 100) * circ
  const cx = size / 2
  const cy = size / 2

  return (
    <div className="ring-metric">
      <svg className="ring-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="4"
        />
        {/* Progress arc */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${filled} ${circ}`}
          strokeDashoffset={circ * 0.25}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 4px ${color})`,
            transition: 'stroke-dasharray 0.8s ease',
            transformOrigin: '50% 50%',
          }}
        />
        {/* Center text */}
        <text
          x={cx} y={cy + 1}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="10" fontFamily="'JetBrains Mono', monospace"
          fontWeight="600"
          fill={color}
          style={{ filter: `drop-shadow(0 0 3px ${color})` }}
        >
          {Math.round(value)}
        </text>
      </svg>
      <div className="ring-label">{name}</div>
    </div>
  )
}

export default function SystemWidget() {
  const { cpuHistory, memHistory, netHistory, tickStats } = useOSStore()
  const gpuRef = useRef(72)

  useEffect(() => {
    const id = setInterval(tickStats, 1200)
    return () => clearInterval(id)
  }, [tickStats])

  useEffect(() => {
    const id = setInterval(() => {
      gpuRef.current = 60 + Math.sin(Date.now() / 4000) * 18
    }, 1200)
    return () => clearInterval(id)
  }, [])

  const cpu = cpuHistory.at(-1) ?? 0
  const mem = memHistory.at(-1) ?? 0
  const net = netHistory.at(-1) ?? 0
  const gpu = gpuRef.current

  return (
    <div className="widget widget-system">
      <div className="widget-header">
        <span className="widget-title">SYSTEM</span>
        <span className="widget-icon">◎</span>
      </div>
      <div className="widget-body">
        <div className="sys-rings-grid">
          <RingMetric name="CPU" value={cpu} base="var(--accent)" />
          <RingMetric name="MEM" value={mem} base="var(--violet)" />
          <RingMetric name="NET" value={net} base="var(--pink)" />
          <RingMetric name="GPU" value={gpu} base="var(--amber)" />
        </div>

        <div className="sys-info-grid">
          {[
            { k: 'PROCESSES', v: '312' },
            { k: 'THREADS',   v: '1,428' },
            { k: 'HEAP',      v: '142 MB' },
            { k: 'FPS',       v: '60' },
          ].map(({ k, v }) => (
            <div key={k} className="sys-info-cell">
              <div className="sys-info-key">{k}</div>
              <div className="sys-info-val">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
