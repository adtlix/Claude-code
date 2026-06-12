import type { StateCreator } from 'zustand';
import type { Task, HistoryAction } from '../../types';
import type { HistorySlice } from './historySlice';
import { persistTask, deleteTaskFromDB, bulkPersistTasks } from '../../db/adapters';

export interface TaskSlice {
  tasks: Record<string, Task>;
  tasksByDay: Record<string, string[]>;
  loadTasks: (tasks: Task[]) => void;
  addTask: (task: Omit<Task, 'id' | 'timestamp' | 'order'>) => Task;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  moveTask: (taskId: string, toDayId: string, toIndex: number) => void;
  reorderTasks: (dayId: string, orderedIds: string[]) => void;
  undoAction: (action: HistoryAction) => void;
}

type SliceState = TaskSlice & HistorySlice;

export const createTaskSlice: StateCreator<SliceState, [], [], TaskSlice> = (set, get) => ({
  tasks: {},
  tasksByDay: {},

  loadTasks: (tasks) => {
    const taskMap: Record<string, Task> = {};
    const dayMap: Record<string, string[]> = {};
    for (const task of tasks) {
      taskMap[task.id] = task;
      (dayMap[task.dayId] ??= []).push(task.id);
    }
    for (const dayId of Object.keys(dayMap)) {
      dayMap[dayId]!.sort((a, b) => (taskMap[a]?.order ?? 0) - (taskMap[b]?.order ?? 0));
    }
    set({ tasks: taskMap, tasksByDay: dayMap });
  },

  addTask: (taskData) => {
    const dayIds = get().tasksByDay[taskData.dayId] ?? [];
    const maxOrder = dayIds.reduce((max, id) => {
      const t = get().tasks[id];
      return t ? Math.max(max, t.order) : max;
    }, -1);

    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      order: maxOrder + 1,
    };

    set((state) => ({
      tasks: { ...state.tasks, [newTask.id]: newTask },
      tasksByDay: {
        ...state.tasksByDay,
        [newTask.dayId]: [...(state.tasksByDay[newTask.dayId] ?? []), newTask.id],
      },
    }));

    get().pushAction({ type: 'create', payload: newTask, previousState: null });
    persistTask(newTask).catch(console.error);
    return newTask;
  },

  deleteTask: (id) => {
    const task = get().tasks[id];
    if (!task) return;
    get().pushAction({ type: 'delete', payload: task, previousState: task });
    set((state) => {
      const { [id]: _removed, ...rest } = state.tasks;
      return {
        tasks: rest,
        tasksByDay: {
          ...state.tasksByDay,
          [task.dayId]: (state.tasksByDay[task.dayId] ?? []).filter((tid) => tid !== id),
        },
      };
    });
    deleteTaskFromDB(id).catch(console.error);
  },

  toggleTask: (id) => {
    const task = get().tasks[id];
    if (!task) return;
    const updated: Task = { ...task, status: task.status === 'done' ? 'todo' : 'done' };
    get().pushAction({ type: 'toggle', payload: updated, previousState: task });
    set((state) => ({ tasks: { ...state.tasks, [id]: updated } }));
    persistTask(updated).catch(console.error);
  },

  moveTask: (taskId, toDayId, toIndex) => {
    const task = get().tasks[taskId];
    if (!task) return;
    const fromDayId = task.dayId;

    const toDayTasks = (get().tasksByDay[toDayId] ?? [])
      .filter((id) => id !== taskId)
      .map((id) => get().tasks[id])
      .filter((t): t is Task => t !== undefined);

    const clampedIndex = Math.min(toIndex, toDayTasks.length);
    const before = toDayTasks[clampedIndex - 1]?.order ?? -1;
    const after = toDayTasks[clampedIndex]?.order ?? before + 2;
    const newOrder = (before + after) / 2;

    const updated: Task = { ...task, dayId: toDayId, order: newOrder };
    get().pushAction({ type: 'move', payload: updated, previousState: task });

    set((state) => {
      const fromDay = (state.tasksByDay[fromDayId] ?? []).filter((id) => id !== taskId);
      const toDay = [...(state.tasksByDay[toDayId] ?? []).filter((id) => id !== taskId)];
      toDay.splice(clampedIndex, 0, taskId);
      return {
        tasks: { ...state.tasks, [taskId]: updated },
        tasksByDay: { ...state.tasksByDay, [fromDayId]: fromDay, [toDayId]: toDay },
      };
    });
    persistTask(updated).catch(console.error);
  },

  reorderTasks: (dayId, orderedIds) => {
    const updates = orderedIds
      .map((id, index) => {
        const task = get().tasks[id];
        return task ? { ...task, order: index } : null;
      })
      .filter((t): t is Task => t !== null);

    set((state) => {
      const newTasks = { ...state.tasks };
      for (const t of updates) newTasks[t.id] = t;
      return { tasks: newTasks, tasksByDay: { ...state.tasksByDay, [dayId]: orderedIds } };
    });
    bulkPersistTasks(updates).catch(console.error);
  },

  undoAction: (action) => {
    if (action.type === 'create') {
      const task = action.payload as Task;
      set((state) => {
        const { [task.id]: _removed, ...rest } = state.tasks;
        return {
          tasks: rest,
          tasksByDay: {
            ...state.tasksByDay,
            [task.dayId]: (state.tasksByDay[task.dayId] ?? []).filter((id) => id !== task.id),
          },
        };
      });
      deleteTaskFromDB(task.id).catch(console.error);
    } else if (action.previousState) {
      const prev = action.previousState as Task;
      const current = get().tasks[prev.id];

      if (action.type === 'move' && current && current.dayId !== prev.dayId) {
        set((state) => {
          const fromDay = (state.tasksByDay[current.dayId] ?? []).filter((id) => id !== prev.id);
          const toDay = [...(state.tasksByDay[prev.dayId] ?? []).filter((id) => id !== prev.id), prev.id];
          return {
            tasks: { ...state.tasks, [prev.id]: prev },
            tasksByDay: { ...state.tasksByDay, [current.dayId]: fromDay, [prev.dayId]: toDay },
          };
        });
      } else {
        set((state) => ({ tasks: { ...state.tasks, [prev.id]: prev } }));
      }
      persistTask(prev).catch(console.error);
    }
  },
});
