import { useTime, pad, formatDate } from '../hooks/useTime'

export default function ClockWidget() {
  const now = useTime()
  const h = pad(now.getHours())
  const m = pad(now.getMinutes())
  const s = now.getSeconds()
  const secPct = (s / 60) * 100

  const uptime = Math.floor((Date.now() - performance.timeOrigin) / 1000)
  const uptimeStr = `${pad(Math.floor(uptime / 3600))}:${pad(Math.floor((uptime % 3600) / 60))}:${pad(uptime % 60)}`

  return (
    <div className="widget widget-clock">
      <div className="widget-header">
        <span className="widget-title">CLOCK</span>
        <span className="widget-icon">◉</span>
      </div>
      <div className="widget-body">
        <div className="clock-time">
          {h}<span className="sep">:</span>{m}
        </div>

        <div className="clock-seconds">
          <div className="clock-sec-bar">
            <div className="clock-sec-fill" style={{ width: `${secPct}%` }} />
          </div>
          <span className="clock-sec-label">{pad(s)}</span>
        </div>

        <div className="clock-date">
          <div>{formatDate(now)}</div>
          <div className="accent">WEEK {getWeek(now)} · Q{Math.ceil((now.getMonth() + 1) / 3)}</div>
        </div>

        <div className="clock-stats">
          <div className="clock-stat">
            <div className="clock-stat-label">UPTIME</div>
            <div className="clock-stat-value" style={{ fontSize: 11 }}>{uptimeStr}</div>
          </div>
          <div className="clock-stat">
            <div className="clock-stat-label">UTC OFFSET</div>
            <div className="clock-stat-value">{getUTCOffset()}</div>
          </div>
          <div className="clock-stat">
            <div className="clock-stat-label">DAY OF YEAR</div>
            <div className="clock-stat-value">{getDayOfYear(now)}</div>
          </div>
          <div className="clock-stat">
            <div className="clock-stat-label">UNIX TIME</div>
            <div className="clock-stat-value" style={{ fontSize: 10, letterSpacing: '-0.02em' }}>
              {Math.floor(Date.now() / 1000)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getWeek(d: Date): number {
  const onejan = new Date(d.getFullYear(), 0, 1)
  return Math.ceil((((d.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7)
}

function getDayOfYear(d: Date): number {
  const start = new Date(d.getFullYear(), 0, 0)
  return Math.floor((d.getTime() - start.getTime()) / 86400000)
}

function getUTCOffset(): string {
  const o = -new Date().getTimezoneOffset()
  const sign = o >= 0 ? '+' : '-'
  return `UTC${sign}${pad(Math.floor(Math.abs(o) / 60))}`
}
