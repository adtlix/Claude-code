export function getWeekStartOf(d: Date): Date {
  const result = new Date(d);
  result.setHours(0, 0, 0, 0);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diff);
  return result;
}

export function getWeekStart(offset = 0): Date {
  const start = getWeekStartOf(new Date());
  start.setDate(start.getDate() + offset * 7);
  return start;
}

export function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDayName(isoDate: string): string {
  const date = new Date(isoDate + 'T12:00:00');
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

export function addDays(d: Date, n: number): Date {
  const result = new Date(d);
  result.setDate(d.getDate() + n);
  return result;
}

export function getWeekDays(offset = 0): Array<{ id: string; name: string; date: string }> {
  const start = getWeekStart(offset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(start, i);
    const id = toISODate(d);
    return { id, name: getDayName(id), date: id };
  });
}

export function formatTime(isoDate: string): string {
  const date = new Date(isoDate + 'T12:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
