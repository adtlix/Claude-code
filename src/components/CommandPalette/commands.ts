import type { CommandDefinition } from '../../types';
import { useAppStore } from '../../store/useAppStore';

export function getCommands(): CommandDefinition[] {
  return [
    {
      id: 'undo',
      label: 'Undo last action',
      shortcut: '⌘Z',
      group: 'Actions',
      handler: () => {
        const { history, historyIndex, undoAction } = useAppStore.getState();
        if (historyIndex >= 0) {
          const action = history[historyIndex];
          if (action) {
            undoAction(action);
            useAppStore.setState({ historyIndex: historyIndex - 1 });
          }
        }
      },
    },
    {
      id: 'go-prev-week',
      label: 'Go to previous week',
      shortcut: '←',
      group: 'Navigation',
      handler: () => {
        const { weekOffset, setWeekOffset } = useAppStore.getState();
        setWeekOffset(weekOffset - 1);
      },
    },
    {
      id: 'go-next-week',
      label: 'Go to next week',
      shortcut: '→',
      group: 'Navigation',
      handler: () => {
        const { weekOffset, setWeekOffset } = useAppStore.getState();
        setWeekOffset(weekOffset + 1);
      },
    },
    {
      id: 'go-this-week',
      label: 'Jump to this week',
      group: 'Navigation',
      handler: () => useAppStore.getState().setWeekOffset(0),
    },
    {
      id: 'clear-done',
      label: 'Delete all completed tasks',
      group: 'Actions',
      handler: () => {
        const { tasks, deleteTask } = useAppStore.getState();
        for (const task of Object.values(tasks)) {
          if (task.status === 'done') deleteTask(task.id);
        }
      },
    },
  ];
}
