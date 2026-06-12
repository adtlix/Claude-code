import { db } from './database';
import type { Task } from '../types';

export async function getWeekTasks(weekDayIds: string[]): Promise<Task[]> {
  if (weekDayIds.length === 0) return [];
  return db.tasks.where('dayId').anyOf(weekDayIds).sortBy('order');
}

export async function persistTask(task: Task): Promise<void> {
  await db.tasks.put(task);
}

export async function deleteTaskFromDB(id: string): Promise<void> {
  await db.tasks.delete(id);
}

export async function bulkPersistTasks(tasks: Task[]): Promise<void> {
  if (tasks.length === 0) return;
  await db.transaction('rw', db.tasks, () => db.tasks.bulkPut(tasks));
}

export async function getAllTasks(): Promise<Task[]> {
  return db.tasks.toArray();
}

export async function clearAndImportTasks(tasks: Task[]): Promise<void> {
  await db.transaction('rw', db.tasks, async () => {
    await db.tasks.clear();
    await db.tasks.bulkAdd(tasks);
  });
}
