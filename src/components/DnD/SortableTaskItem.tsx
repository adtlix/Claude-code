import { useSortable } from '@dnd-kit/sortable';

interface SortableTaskItemProps {
  taskId: string;
}

export function SortableTaskItem({ taskId }: SortableTaskItemProps) {
  const { attributes, listeners, setNodeRef } = useSortable({ id: taskId });

  // Invisible drag handle — visual card is rendered entirely in the 3D canvas
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        width: '100%',
        height: '1px',
        cursor: 'grab',
        touchAction: 'none',
      }}
      aria-label={`Drag task ${taskId}`}
    />
  );
}
