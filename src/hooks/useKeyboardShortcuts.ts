import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      const isCtrl = e.ctrlKey || e.metaKey;

      // Cmd/Ctrl + K → toggle command palette
      if (isCtrl && e.key === 'k') {
        e.preventDefault();
        const { commandPaletteOpen, openCommandPalette, closeCommandPalette } = useAppStore.getState();
        if (commandPaletteOpen) closeCommandPalette();
        else openCommandPalette();
        return;
      }

      // Escape → close palette / stop editing
      if (e.key === 'Escape' && !inInput) {
        const { commandPaletteOpen, closeCommandPalette, setEditingTask } = useAppStore.getState();
        if (commandPaletteOpen) closeCommandPalette();
        else setEditingTask(null);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
