import Dexie, { type Table } from 'dexie';
import type { Task } from '../types';

class GodModeDB extends Dexie {
  tasks!: Table<Task>;

  constructor() {
    super('GodModeDB');
    this.version(1).stores({
      // id is the primary key; index dayId, status, timestamp, and compound [dayId+order]
      tasks: 'id, dayId, status, timestamp, [dayId+order]',
    });
  }
}

export const db = new GodModeDB();
