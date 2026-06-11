import { useState, useEffect } from 'react'

export function useTime(interval = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), interval)
    return () => clearInterval(id)
  }, [interval])
  return now
}

export function pad(n: number) { return String(n).padStart(2, '0') }

const DAYS = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY']
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

export function formatDate(d: Date) {
  return `${DAYS[d.getDay()]}  ${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}
