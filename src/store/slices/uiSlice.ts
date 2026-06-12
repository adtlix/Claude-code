import type { StateCreator } from 'zustand';
import type { DragState } from '../../types';

export interface UISlice {
  commandPaletteOpen: boolean;
  editingTaskId: string | null;
  weekOffset: number;
  dragState: DragState;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  setWeekOffset: (n: number) => void;
  setEditingTask: (id: string | null) => void;
  setDragState: (state: DragState) => void;
}

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  commandPaletteOpen: false,
  editingTaskId: null,
  weekOffset: 0,
  dragState: { activeId: null, delta: { x: 0, y: 0 } },
  openCommandPalette: () => set({ commandPaletteOpen: true }),
  closeCommandPalette: () => set({ commandPaletteOpen: false }),
  setWeekOffset: (n) => set({ weekOffset: n }),
  setEditingTask: (id) => set({ editingTaskId: id }),
  setDragState: (dragState) => set({ dragState }),
});
