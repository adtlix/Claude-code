import { useAppStore } from '../store/useAppStore';

export function useWeeklyProgress(): number {
  return useAppStore((s) => {
    const taskValues = Object.values(s.tasks);
    if (taskValues.length === 0) return 0;
    const done = taskValues.filter((t) => t.status === 'done').length;
    return done / taskValues.length;
  });
}
