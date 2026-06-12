import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useWeeklyProgress(): number {
  const tasks = useAppStore((s) => Object.values(s.tasks));
  return useMemo(() => {
    if (tasks.length === 0) return 0;
    const done = tasks.filter((t) => t.status === 'done').length;
    return done / tasks.length;
  }, [tasks]);
}
