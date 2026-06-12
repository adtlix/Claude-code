export type TaskStatus = 'todo' | 'done' | 'skipped';

export interface RecurringRule {
  frequency: 'daily' | 'weekly' | 'custom';
  days?: number[]; // 0=Sun … 6=Sat
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  timestamp: number;
  category: string;
  dayId: string; // ISO date "YYYY-MM-DD"
  order: number;
  recurring?: RecurringRule;
  dueTime?: string; // "HH:MM" 24h
}

export interface Day {
  id: string; // ISO date "YYYY-MM-DD"
  name: string;
  date: string;
  tasks: Task[];
}

export interface HistoryAction {
  type: 'create' | 'delete' | 'move' | 'toggle' | 'reorder';
  payload: Task | Task[];
  previousState: Task | Task[] | null;
}

export interface DragState {
  activeId: string | null;
  delta: { x: number; y: number };
}

export type WorkerInMessage =
  | { type: 'INDEX'; tasks: Task[] }
  | { type: 'SEARCH'; query: string; requestId: string };

export type WorkerOutMessage =
  | { type: 'INDEXED'; count: number }
  | { type: 'RESULTS'; requestId: string; results: Task[] };

export interface CommandDefinition {
  id: string;
  label: string;
  shortcut?: string;
  group?: string;
  handler: () => void;
}
