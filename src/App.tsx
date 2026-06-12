import { useEffect, useState, useCallback, useRef } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, useDndMonitor, closestCorners, type DragStartEvent, type DragMoveEvent, type DragEndEvent, type DragOverEvent } from '@dnd-kit/core';
import { useAppStore } from './store/useAppStore';
import { getWeekTasks } from './db/adapters';
import { getWeekDays } from './lib/dateUtils';
import { PlannerScene } from './components/Planner/PlannerScene';
import { Toolbar } from './components/UI/Toolbar';
import { TaskForm } from './components/UI/TaskForm';
import { CommandPalette } from './components/CommandPalette/CommandPalette';
import { DroppableColumn } from './components/DnD/DroppableColumn';
import { useWeeklyProgress } from './hooks/useWeeklyProgress';
import { useUndoRedo } from './hooks/useUndoRedo';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useNotifications } from './hooks/useNotifications';
import { ErrorBoundary } from './components/ErrorBoundary';

// Bridge: syncs @dnd-kit events → Zustand dragState (for 3D tilt)
function DndBridge() {
  const setDragState = useAppStore((s) => s.setDragState);
  useDndMonitor({
    onDragStart: (e: DragStartEvent) =>
      setDragState({ activeId: String(e.active.id), delta: { x: 0, y: 0 } }),
    onDragMove: (e: DragMoveEvent) =>
      setDragState({ activeId: String(e.active.id), delta: { x: e.delta.x, y: e.delta.y } }),
    onDragEnd: () => setDragState({ activeId: null, delta: { x: 0, y: 0 } }),
    onDragCancel: () => setDragState({ activeId: null, delta: { x: 0, y: 0 } }),
  });
  return null;
}

// Invisible 7-column droppable overlay (matches 3D layout order)
function DndColumnsOverlay({ weekOffset }: { weekOffset: number }) {
  const days = getWeekDays(weekOffset);
  return (
    <div
      className="absolute inset-0 flex"
      style={{ pointerEvents: 'none' }}
    >
      {days.map((day) => (
        <div key={day.id} style={{ flex: 1, pointerEvents: 'auto' }}>
          <DroppableColumn dayId={day.id} tasks={[]} />
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const loadTasks = useAppStore((s) => s.loadTasks);
  const moveTask = useAppStore((s) => s.moveTask);
  const reorderTasks = useAppStore((s) => s.reorderTasks);
  const expandRecurringForWeek = useAppStore((s) => s.expandRecurringForWeek);
  const weekOffset = useAppStore((s) => s.weekOffset);
  const commandPaletteOpen = useAppStore((s) => s.commandPaletteOpen);
  const progress = useWeeklyProgress();

  const [dropTargetDayId, setDropTargetDayId] = useState<string | null>(null);
  const { scheduleNotification } = useNotifications();

  useUndoRedo();
  useKeyboardShortcuts();

  // Load tasks from IndexedDB on mount and when week changes
  useEffect(() => {
    const days = getWeekDays(weekOffset);
    const dayIds = days.map((d) => d.id);
    getWeekTasks(dayIds).then((tasks) => {
      loadTasks(tasks);
      expandRecurringForWeek(weekOffset);
      for (const task of tasks) {
        if (task.dueTime) scheduleNotification(task);
      }
    }).catch(console.error);
  }, [weekOffset, loadTasks, expandRecurringForWeek, scheduleNotification]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragOver = useCallback((e: DragOverEvent) => {
    const overId = e.over?.id;
    setDropTargetDayId(overId ? String(overId) : null);
  }, []);

  const handleDragEnd = useCallback(
    (e: DragEndEvent) => {
      setDropTargetDayId(null);
      if (!e.over) return;

      const taskId = String(e.active.id);
      const overId = String(e.over.id);
      const store = useAppStore.getState();
      const task = store.tasks[taskId];
      if (!task) return;

      const dayIds = getWeekDays(weekOffset).map((d) => d.id);

      if (dayIds.includes(overId)) {
        // Dropped on a day zone
        if (overId !== task.dayId) {
          const toDay = store.tasksByDay[overId] ?? [];
          moveTask(taskId, overId, toDay.length);
        }
      } else {
        // Dropped on another task (same or different column)
        const overTask = store.tasks[overId];
        if (!overTask) return;
        if (overTask.dayId === task.dayId) {
          const dayTasks = [...(store.tasksByDay[task.dayId] ?? [])];
          const oldIdx = dayTasks.indexOf(taskId);
          const newIdx = dayTasks.indexOf(overId);
          if (oldIdx !== -1 && newIdx !== -1 && oldIdx !== newIdx) {
            dayTasks.splice(oldIdx, 1);
            dayTasks.splice(newIdx, 0, taskId);
            reorderTasks(task.dayId, dayTasks);
          }
        } else {
          const toDayTasks = store.tasksByDay[overTask.dayId] ?? [];
          moveTask(taskId, overTask.dayId, toDayTasks.indexOf(overId));
        }
      }
    },
    [weekOffset, moveTask, reorderTasks]
  );

  const sidebarRef = useRef<HTMLDivElement>(null);

  return (
    <ErrorBoundary>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <DndBridge />

        <div className="relative w-full h-screen overflow-hidden">
          {/* 3D Scene (base layer) */}
          <PlannerScene
            progress={progress}
            dropTargetDayId={dropTargetDayId}
            interactionDisabled={commandPaletteOpen}
          />

          {/* Invisible DnD column drop zones */}
          <DndColumnsOverlay weekOffset={weekOffset} />

          {/* Toolbar (top) */}
          <Toolbar />

          {/* Sidebar — task creation */}
          <div
            ref={sidebarRef}
            className="absolute right-4 top-20 bottom-4 w-72 flex flex-col gap-3 overflow-y-auto"
            style={{ pointerEvents: 'auto' }}
          >
            <TaskForm />
          </div>

          {/* Command Palette (top z-index) */}
          <CommandPalette />
        </div>
      </DndContext>
    </ErrorBoundary>
  );
}
