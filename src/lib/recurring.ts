import type { RecurringRule, Task } from '../types';
import { toISODate, addDays } from './dateUtils';

export function expandRecurring(rule: RecurringRule, weekStart: Date): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = addDays(weekStart, i);
    const dayOfWeek = d.getDay();
    if (rule.frequency === 'daily') {
      dates.push(new Date(d));
    } else if (rule.frequency === 'weekly') {
      const targetDay = rule.days?.[0] ?? 1;
      if (dayOfWeek === targetDay) dates.push(new Date(d));
    } else if (rule.frequency === 'custom' && rule.days) {
      if (rule.days.includes(dayOfWeek)) dates.push(new Date(d));
    }
  }
  return dates;
}

export function generateRecurringInstances(baseTask: Task, weekStart: Date): Task[] {
  if (!baseTask.recurring) return [];
  const dates = expandRecurring(baseTask.recurring, weekStart);
  return dates.map((d, i) => ({
    ...baseTask,
    id: `${baseTask.id}-rec-${toISODate(d)}`,
    dayId: toISODate(d),
    order: baseTask.order + i * 0.001,
    status: 'todo' as const,
    timestamp: Date.now(),
  }));
}
