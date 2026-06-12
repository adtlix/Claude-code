import type { StateCreator } from 'zustand';
import type { RecurringRule, Task } from '../../types';
import type { TaskSlice } from './taskSlice';
import { generateRecurringInstances } from '../../lib/recurring';
import { getWeekStart } from '../../lib/dateUtils';
import { bulkPersistTasks } from '../../db/adapters';

export interface RecurringSlice {
  recurringRules: Record<string, RecurringRule>;
  addRecurringRule: (taskId: string, rule: RecurringRule) => void;
  removeRecurringRule: (taskId: string) => void;
  expandRecurringForWeek: (weekOffset: number) => void;
}

type SliceState = RecurringSlice & TaskSlice;

export const createRecurringSlice: StateCreator<SliceState, [], [], RecurringSlice> = (set, get) => ({
  recurringRules: {},

  addRecurringRule: (taskId, rule) =>
    set((state) => ({ recurringRules: { ...state.recurringRules, [taskId]: rule } })),

  removeRecurringRule: (taskId) =>
    set((state) => {
      const { [taskId]: _removed, ...rest } = state.recurringRules;
      return { recurringRules: rest };
    }),

  expandRecurringForWeek: (weekOffset) => {
    const weekStart = getWeekStart(weekOffset);
    const { tasks, recurringRules } = get();
    const instances: Task[] = [];

    for (const [taskId, rule] of Object.entries(recurringRules)) {
      const baseTask = tasks[taskId];
      if (!baseTask) continue;
      instances.push(...generateRecurringInstances({ ...baseTask, recurring: rule }, weekStart));
    }

    if (instances.length > 0) {
      const existing = Object.values(tasks);
      const newIds = new Set(instances.map((t) => t.id));
      const merged = [...existing.filter((t) => !newIds.has(t.id)), ...instances];
      get().loadTasks(merged);
      bulkPersistTasks(instances).catch(console.error);
    }
  },
});
