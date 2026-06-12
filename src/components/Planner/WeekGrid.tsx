import { useAppStore, useDayTasks } from '../../store/useAppStore';
import { DayColumn } from './DayColumn';
import { getWeekDays } from '../../lib/dateUtils';

const COLUMN_SPACING = 2.3;

interface WeekGridProps {
  dropTargetDayId: string | null;
}

function DayColumnConnected({
  dayId,
  name,
  index,
  dropTargetDayId,
}: {
  dayId: string;
  name: string;
  index: number;
  dropTargetDayId: string | null;
}) {
  const tasks = useDayTasks(dayId);
  return (
    <DayColumn
      dayId={dayId}
      name={name}
      tasks={tasks}
      positionX={(index - 3) * COLUMN_SPACING}
      isDropTarget={dropTargetDayId === dayId}
    />
  );
}

export function WeekGrid({ dropTargetDayId }: WeekGridProps) {
  const weekOffset = useAppStore((s) => s.weekOffset);
  const days = getWeekDays(weekOffset);

  return (
    <group>
      {days.map((day, i) => (
        <DayColumnConnected
          key={day.id}
          dayId={day.id}
          name={day.name}
          index={i}
          dropTargetDayId={dropTargetDayId}
        />
      ))}
    </group>
  );
}
