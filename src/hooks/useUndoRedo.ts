import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useUndoRedo() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (inInput) return;

      const isCtrl = e.ctrlKey || e.metaKey;
      if (!isCtrl || e.key !== 'z') return;

      e.preventDefault();
      const { history, historyIndex, undoAction } = useAppStore.getState();

      if (historyIndex >= 0) {
        const action = history[historyIndex];
        if (action) {
          undoAction(action);
          useAppStore.setState({ historyIndex: historyIndex - 1 });
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}
