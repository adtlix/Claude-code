import type { StateCreator } from 'zustand';
import type { HistoryAction } from '../../types';

const MAX_HISTORY = 50;

export interface HistorySlice {
  history: HistoryAction[];
  historyIndex: number;
  pushAction: (action: HistoryAction) => void;
  clearHistory: () => void;
}

export const createHistorySlice: StateCreator<HistorySlice, [], [], HistorySlice> = (set) => ({
  history: [],
  historyIndex: -1,

  pushAction: (action) =>
    set((state) => {
      // Truncate any redo future when a new action is pushed
      const truncated = state.history.slice(0, state.historyIndex + 1);
      const newHistory = [...truncated, action].slice(-MAX_HISTORY);
      return { history: newHistory, historyIndex: newHistory.length - 1 };
    }),

  clearHistory: () => set({ history: [], historyIndex: -1 }),
});
