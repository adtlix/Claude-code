import { useState, useCallback } from 'react';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDndMonitor,
  closestCenter,
  type DragStartEvent,
  type DragMoveEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useAppStore, useDayTasks } from '../../store/useAppStore';
import { DroppableColumn } from './DroppableColumn';
import { getWeekDays } from '../../lib/dateUtils';

// Inner component uses useDndMonitor to bridge DnD state → 3D tilt
function DndMonitorBridge() {
  const setDragState = useAppStore((s) => s.setDragState);

  useDndMonitor({
    onDragStart: (e: DragStartEvent) => {
      setDragState({ activeId: String(e.active.id), delta: { x: 0, y: 0 } });
    },
    onDragMove: (e: DragMoveEvent) => {
      setDragState({
        activeId: String(e.active.id),
        delta: { x: e.delta.x, y: e.delta.y },
      });
    },
    onDragEnd: () => {
      setDragState({ activeId: null, delta: { x: 0, y: 0 } });
    },
    onDragCancel: () => {
      setDragState({ activeId: null, delta: { x: 0, y: 0 } });
    },
  });

  return null;
}

interface DayColumnDndProps {
  dayId: string;
  onDropTargetChange: (dayId: string | null) => void;
}

function DayColumnDnd({ dayId, onDropTargetChange: _onChange }: DayColumnDndProps) {
  const tasks = useDayTasks(dayId);
  return <DroppableColumn dayId={dayId} tasks={tasks} />;
}

interface DndProviderProps {
  weekOffset: number;
  onDropTargetChange: (dayId: string | null) => void;
}

export function DndOverlay({ weekOffset, onDropTargetChange }: DndProviderProps) {
  const days = getWeekDays(weekOffset);
  return (
    <>
      {days.map((day) => (
        <DayColumnDnd key={day.id} dayId={day.id} onDropTargetChange={onDropTargetChange} />
      ))}
    </>
  );
}

interface DndRootProps {
  children: React.ReactNode;
}

export function DndRoot({ children }: DndRootProps) {
  const [dropTargetDayId, setDropTargetDayId] = useState<string | null>(null);
  const weekOffset = useAppStore((s) => s.weekOffset);
  const moveTask = useAppStore((s) => s.moveTask);
  const reorderTasks = useAppStore((s) => s.reorderTasks);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragOver = useCallback((e: DragOverEvent) => {
    const overId = e.over?.id;
    if (overId) setDropTargetDayId(String(overId));
    else setDropTargetDayId(null);
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

      // Determine if dropped on a day column or a task (same-day reorder)
      const dayIds = getWeekDays(weekOffset).map((d) => d.id);

      if (dayIds.includes(overId)) {
        // Dropped on a day column header → move to end
        if (overId !== task.dayId) {
          const toDay = store.tasksByDay[overId] ?? [];
          moveTask(taskId, overId, toDay.length);
        }
      } else {
        // Dropped on another task → reorder or cross-column move
        const overTask = store.tasks[overId];
        if (!overTask) return;

        if (overTask.dayId === task.dayId) {
          // Same column reorder
          const dayTasks = store.tasksByDay[task.dayId] ?? [];
          const oldIndex = dayTasks.indexOf(taskId);
          const newIndex = dayTasks.indexOf(overId);
          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            const reordered = [...dayTasks];
            reordered.splice(oldIndex, 1);
            reordered.splice(newIndex, 0, taskId);
            reorderTasks(task.dayId, reordered);
          }
        } else {
          // Cross-column move, insert at over task's position
          const toDayTasks = store.tasksByDay[overTask.dayId] ?? [];
          const toIndex = toDayTasks.indexOf(overId);
          moveTask(taskId, overTask.dayId, toIndex);
        }
      }
    },
    [weekOffset, moveTask, reorderTasks]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <DndMonitorBridge />
      {typeof children === 'function'
        ? (children as (props: { dropTargetDayId: string | null }) => React.ReactNode)({ dropTargetDayId })
        : children}
    </DndContext>
  );
}
