import { useState, useRef, useEffect } from 'react'
import { useOSStore, PlannerEvent } from '../store'

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
const COLORS: PlannerEvent['color'][] = ['cyan', 'violet', 'amber', 'pink']

function getTodayDow(): number {
  const d = new Date().getDay()
  return d === 0 ? 6 : d - 1
}

interface ActiveCell { day: number; hour: number }

export default function WeekPlanner() {
  const { plannerEvents, addPlannerEvent, removePlannerEvent } = useOSStore()
  const [activeCell, setActiveCell] = useState<ActiveCell | null>(null)
  const [inputVal, setInputVal] = useState('')
  const [colorIdx, setColorIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const todayDow = getTodayDow()

  useEffect(() => {
    if (activeCell && inputRef.current) {
      inputRef.current.focus()
    }
  }, [activeCell])

  const openCell = (day: number, hour: number) => {
    setActiveCell({ day, hour })
    setInputVal('')
  }

  const commit = () => {
    if (!activeCell || !inputVal.trim()) {
      setActiveCell(null)
      return
    }
    addPlannerEvent({
      day: activeCell.day,
      hour: activeCell.hour,
      title: inputVal.trim(),
      color: COLORS[colorIdx],
    })
    setActiveCell(null)
    setInputVal('')
  }

  const getEvent = (day: number, hour: number) =>
    plannerEvents.find((e) => e.day === day && e.hour === hour)

  return (
    <div className="widget widget-planner">
      <div className="widget-header">
        <span className="widget-title">WEEK PLANNER</span>
        <span style={{ fontSize: 9, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          {plannerEvents.length} EVENTS
        </span>
        <span className="widget-icon">⬦</span>
      </div>
      <div className="widget-body" style={{ padding: '6px 10px 6px 8px' }}>
        <div className="planner-grid">
          {/* Header row */}
          <div className="planner-header">
            <div />
            {DAYS.map((d, i) => (
              <div key={d} className={`planner-header-cell${i === todayDow ? ' today' : ''}`}>
                {d}
              </div>
            ))}
          </div>

          {/* Body */}
          <div className="planner-body">
            {HOURS.map((h) => (
              <>
                <div key={`lbl-${h}`} className="planner-hour-label">
                  {h < 10 ? `0${h}` : h}
                </div>
                {DAYS.map((_, d) => {
                  const ev = getEvent(d, h)
                  const isActive = activeCell?.day === d && activeCell?.hour === h

                  return (
                    <div
                      key={`${d}-${h}`}
                      className={`planner-cell${d === todayDow ? ' today-col' : ''}`}
                      onClick={() => {
                        if (!ev && !isActive) openCell(d, h)
                      }}
                    >
                      {isActive && (
                        <div className="planner-add-form" onClick={(e) => e.stopPropagation()}>
                          <div className="planner-color-picker">
                            {COLORS.map((c, ci) => (
                              <div
                                key={c}
                                className={`planner-color-dot c-${c}${ci === colorIdx ? ' selected' : ''}`}
                                onClick={() => setColorIdx(ci)}
                              />
                            ))}
                          </div>
                          <input
                            ref={inputRef}
                            className="planner-add-input"
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') commit()
                              if (e.key === 'Escape') setActiveCell(null)
                            }}
                            onBlur={commit}
                            placeholder="event..."
                          />
                        </div>
                      )}
                      {ev && !isActive && (
                        <div
                          className={`planner-event color-${ev.color}`}
                          title={`${ev.title} — click to remove`}
                          onClick={(e) => {
                            e.stopPropagation()
                            removePlannerEvent(ev.id)
                          }}
                        >
                          {ev.title}
                        </div>
                      )}
                    </div>
                  )
                })}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
