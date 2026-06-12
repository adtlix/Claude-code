import { useState, useCallback, useEffect } from 'react';
import { Command } from 'cmdk';
import { useAppStore } from '../../store/useAppStore';
import { useWorker } from '../../hooks/useWorker';
import { getCommands } from './commands';
import type { Task } from '../../types';

export function CommandPalette() {
  const commandPaletteOpen = useAppStore((s) => s.commandPaletteOpen);
  const closeCommandPalette = useAppStore((s) => s.closeCommandPalette);
  const tasks = useAppStore((s) => s.tasks);
  const { search, index } = useWorker();

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Task[]>([]);

  // Re-index when tasks change
  useEffect(() => {
    index(Object.values(tasks));
  }, [tasks, index]);

  // Search on query change
  useEffect(() => {
    if (!query.trim()) { setSearchResults([]); return; }
    search(query).then(setSearchResults).catch(() => setSearchResults([]));
  }, [query, search]);

  const handleClose = useCallback(() => {
    closeCommandPalette();
    setQuery('');
    setSearchResults([]);
  }, [closeCommandPalette]);

  // Close on Escape
  useEffect(() => {
    if (!commandPaletteOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [commandPaletteOpen, handleClose]);

  if (!commandPaletteOpen) return null;

  const commands = getCommands();

  return (
    <div className="cmd-overlay" onClick={handleClose}>
      <div
        className="w-full max-w-lg glass-dark rounded-2xl overflow-hidden shadow-2xl animate-slide-up glow-accent"
        onClick={(e) => e.stopPropagation()}
        style={{ border: '1px solid rgba(99,102,241,0.3)' }}
      >
        <Command
          className="w-full"
          shouldFilter={false}
          onKeyDown={(e) => { if (e.key === 'Escape') handleClose(); }}
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
            <span className="text-godmode-muted text-sm">⌘</span>
            <Command.Input
              placeholder="Search tasks or run a command…"
              value={query}
              onValueChange={setQuery}
              className="flex-1 bg-transparent text-sm text-godmode-text placeholder:text-godmode-muted outline-none"
              autoFocus
            />
            <kbd className="text-xs text-godmode-muted bg-white/5 px-2 py-1 rounded">ESC</kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto py-2">
            <Command.Empty className="py-8 text-center text-sm text-godmode-muted">
              No results
            </Command.Empty>

            {searchResults.length > 0 && (
              <Command.Group
                heading={
                  <span className="text-xs text-godmode-muted px-3 pb-1 block font-medium uppercase tracking-wide">
                    Tasks
                  </span>
                }
              >
                {searchResults.map((task) => (
                  <Command.Item
                    key={task.id}
                    value={task.id}
                    onSelect={() => {
                      useAppStore.getState().setEditingTask(task.id);
                      handleClose();
                    }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer data-[selected=true]:bg-white/5 hover:bg-white/5 transition-colors"
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: task.status === 'done' ? '#475569' : '#6366f1' }}
                    />
                    <span className={task.status === 'done' ? 'line-through text-godmode-muted' : 'text-godmode-text'}>
                      {task.title}
                    </span>
                    <span className="ml-auto text-xs text-godmode-muted capitalize">{task.category}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group
              heading={
                <span className="text-xs text-godmode-muted px-3 pb-1 block font-medium uppercase tracking-wide">
                  Commands
                </span>
              }
            >
              {commands
                .filter((cmd) =>
                  !query.trim() || cmd.label.toLowerCase().includes(query.toLowerCase())
                )
                .map((cmd) => (
                  <Command.Item
                    key={cmd.id}
                    value={cmd.id}
                    onSelect={() => { cmd.handler(); handleClose(); }}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer data-[selected=true]:bg-white/5 hover:bg-white/5 transition-colors text-godmode-text"
                  >
                    <span className="flex-1">{cmd.label}</span>
                    {cmd.shortcut && (
                      <kbd className="text-xs text-godmode-muted bg-white/5 px-2 py-0.5 rounded font-mono">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </Command.Item>
                ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
