import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { persistTask } from '../../db/adapters';
import { RecurringPicker } from './RecurringPicker';
import type { RecurringRule } from '../../types';
import { CATEGORY_COLORS } from '../Planner/TaskCard';
import { getWeekDays } from '../../lib/dateUtils';
import { clsx } from 'clsx';

const CATEGORIES = Object.keys(CATEGORY_COLORS).filter((c) => c !== 'default');

interface TaskFormProps {
  defaultDayId?: string;
}

export function TaskForm({ defaultDayId }: TaskFormProps) {
  const editingTaskId = useAppStore((s) => s.editingTaskId);
  const tasks = useAppStore((s) => s.tasks);
  const weekOffset = useAppStore((s) => s.weekOffset);
  const addTask = useAppStore((s) => s.addTask);
  const setEditingTask = useAppStore((s) => s.setEditingTask);

  const editingTask = editingTaskId ? tasks[editingTaskId] : null;

  const days = getWeekDays(weekOffset);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('work');
  const [dayId, setDayId] = useState(defaultDayId ?? days[0]?.id ?? '');
  const [dueTime, setDueTime] = useState('');
  const [recurring, setRecurring] = useState<RecurringRule | undefined>(undefined);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setCategory(editingTask.category);
      setDayId(editingTask.dayId);
      setDueTime(editingTask.dueTime ?? '');
      setRecurring(editingTask.recurring);
    } else {
      setTitle('');
      setCategory('work');
      setDayId(defaultDayId ?? days[0]?.id ?? '');
      setDueTime('');
      setRecurring(undefined);
    }
  }, [editingTask, editingTaskId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      // Update existing task via store
      const updated = { ...editingTask, title: title.trim(), category, dayId, dueTime: dueTime || undefined, recurring };
      useAppStore.setState((s) => ({ tasks: { ...s.tasks, [updated.id]: updated } }));
      persistTask(updated).catch(console.error);
      setEditingTask(null);
    } else {
      addTask({ title: title.trim(), status: 'todo', category, dayId, dueTime: dueTime || undefined, recurring });
    }
    setTitle('');
    setDueTime('');
    setRecurring(undefined);
  };

  const isOpen = editingTaskId !== null;

  if (!isOpen && !editingTask) {
    // Inline quick-add form (always visible at bottom of sidebar)
    return (
      <form onSubmit={handleSubmit} className="space-y-3 p-4 glass rounded-xl">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add task…"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="flex-1 bg-transparent text-sm text-godmode-text placeholder:text-godmode-muted border-0 outline-none"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={!title.trim()}
            className="w-7 h-7 rounded-lg bg-godmode-accent disabled:opacity-30 flex items-center justify-center hover:bg-godmode-accentGlow transition-colors text-white text-lg leading-none"
          >
            +
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={clsx(
                'px-2 py-0.5 rounded text-xs capitalize transition-all',
                category === c ? 'text-white' : 'text-godmode-muted bg-white/5 hover:bg-white/10'
              )}
              style={category === c ? { backgroundColor: CATEGORY_COLORS[c] } : {}}
            >
              {c}
            </button>
          ))}
        </div>

        <select
          value={dayId}
          onChange={(e) => setDayId(e.target.value)}
          className="w-full bg-white/5 text-godmode-text text-sm rounded-lg px-3 py-1.5 outline-none border border-white/10"
        >
          {days.map((d) => (
            <option key={d.id} value={d.id} className="bg-godmode-surface">
              {d.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="flex-1 bg-white/5 text-godmode-text text-sm rounded-lg px-3 py-1.5 outline-none border border-white/10"
          />
        </div>

        <RecurringPicker value={recurring} onChange={setRecurring} />
      </form>
    );
  }

  // Modal edit form
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md glass-dark rounded-2xl p-6 space-y-4 shadow-2xl animate-slide-up"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-godmode-text">Edit Task</h2>
          <button
            type="button"
            onClick={() => setEditingTask(null)}
            className="text-godmode-muted hover:text-godmode-text text-xl leading-none"
          >
            ×
          </button>
        </div>

        <input
          type="text"
          placeholder="Task title…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/5 text-godmode-text text-sm rounded-xl px-4 py-2.5 border border-white/10 outline-none focus:border-godmode-accent"
          autoFocus
        />

        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={clsx(
                'px-3 py-1 rounded-lg text-xs capitalize transition-all',
                category === c ? 'text-white' : 'text-godmode-muted bg-white/5 hover:bg-white/10'
              )}
              style={category === c ? { backgroundColor: CATEGORY_COLORS[c] } : {}}
            >
              {c}
            </button>
          ))}
        </div>

        <select
          value={dayId}
          onChange={(e) => setDayId(e.target.value)}
          className="w-full bg-white/5 text-godmode-text text-sm rounded-xl px-4 py-2.5 border border-white/10 outline-none"
        >
          {days.map((d) => (
            <option key={d.id} value={d.id} className="bg-godmode-surface">
              {d.name}
            </option>
          ))}
        </select>

        <input
          type="time"
          value={dueTime}
          onChange={(e) => setDueTime(e.target.value)}
          placeholder="Due time"
          className="w-full bg-white/5 text-godmode-text text-sm rounded-xl px-4 py-2.5 border border-white/10 outline-none"
        />

        <RecurringPicker value={recurring} onChange={setRecurring} />

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setEditingTask(null)}
            className="flex-1 py-2.5 rounded-xl text-sm text-godmode-muted bg-white/5 hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm text-white bg-godmode-accent hover:bg-godmode-accentGlow transition-colors disabled:opacity-30"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
