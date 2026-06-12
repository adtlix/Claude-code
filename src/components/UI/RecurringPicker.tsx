import type { RecurringRule } from '../../types';
import { clsx } from 'clsx';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface RecurringPickerProps {
  value: RecurringRule | undefined;
  onChange: (rule: RecurringRule | undefined) => void;
}

export function RecurringPicker({ value, onChange }: RecurringPickerProps) {
  const freq = value?.frequency;

  const handleFrequency = (f: RecurringRule['frequency'] | 'none') => {
    if (f === 'none') { onChange(undefined); return; }
    onChange({ frequency: f, days: freq === 'custom' ? value?.days : undefined });
  };

  const toggleDay = (day: number) => {
    const currentDays = value?.days ?? [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day].sort((a, b) => a - b);
    onChange({ frequency: 'custom', days: newDays });
  };

  const btn = (label: string, active: boolean, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'px-3 py-1 rounded-lg text-xs font-medium transition-all',
        active
          ? 'bg-godmode-accent text-white'
          : 'bg-white/5 text-godmode-muted hover:bg-white/10'
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {btn('None', !freq, () => handleFrequency('none'))}
        {btn('Daily', freq === 'daily', () => handleFrequency('daily'))}
        {btn('Weekly', freq === 'weekly', () => handleFrequency('weekly'))}
        {btn('Custom', freq === 'custom', () => handleFrequency('custom'))}
      </div>
      {freq === 'custom' && (
        <div className="flex gap-1 flex-wrap">
          {DAY_LABELS.map((label, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleDay(i)}
              className={clsx(
                'w-9 h-9 rounded-full text-xs font-medium transition-all',
                value?.days?.includes(i)
                  ? 'bg-godmode-accent text-white'
                  : 'bg-white/5 text-godmode-muted hover:bg-white/10'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
