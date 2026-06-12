import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTaskItem } from './SortableTaskItem';
import type { Task } from '../../types';

interface DroppableColumnProps {
  dayId: string;
  tasks: Task[];
}

export function DroppableColumn({ dayId, tasks }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: dayId });
  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      data-over={isOver}
      style={{
        flex: 1,
        height: '100%',
        position: 'relative',
        // Visual drop feedback is entirely handled by the 3D scene
        // This is an invisible interaction zone
      }}
    >
      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <SortableTaskItem key={task.id} taskId={task.id} />
        ))}
      </SortableContext>
    </div>
  );
}
