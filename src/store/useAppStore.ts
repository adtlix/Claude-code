import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createTaskSlice, type TaskSlice } from './slices/taskSlice';
import { createHistorySlice, type HistorySlice } from './slices/historySlice';
import { createUISlice, type UISlice } from './slices/uiSlice';
import { createRecurringSlice, type RecurringSlice } from './slices/recurringSlice';
import type { Task } from '../types';

export type AppStore = TaskSlice & HistorySlice & UISlice & RecurringSlice;

export const useAppStore = create<AppStore>()(
  devtools(
    (...a) => ({
      ...createTaskSlice(...a),
      ...createHistorySlice(...a),
      ...createUISlice(...a),
      ...createRecurringSlice(...a),
    }),
    { name: 'GodModePlanner', enabled: import.meta.env.DEV }
  )
);

// Fine-grained selectors
export const useTask = (id: string): Task | undefined =>
  useAppStore((s) => s.tasks[id]);

export const useDayTasks = (dayId: string): Task[] =>
  useAppStore((s) => {
    const ids = s.tasksByDay[dayId] ?? [];
    return ids.map((id) => s.tasks[id]).filter((t): t is Task => t !== undefined);
  });
