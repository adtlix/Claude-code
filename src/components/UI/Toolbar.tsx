import { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useWeeklyProgress } from '../../hooks/useWeeklyProgress';
import { ExportImport } from './ExportImport';
import { getWeekDays } from '../../lib/dateUtils';

export function Toolbar() {
  const weekOffset = useAppStore((s) => s.weekOffset);
  const setWeekOffset = useAppStore((s) => s.setWeekOffset);
  const openCommandPalette = useAppStore((s) => s.openCommandPalette);
  const progress = useWeeklyProgress();
  const [showExport, setShowExport] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  // PWA install prompt
  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installPWA = () => {
    if (!deferredPrompt) return;
    (deferredPrompt as unknown as { prompt: () => void }).prompt();
  };

  const days = getWeekDays(weekOffset);
  const weekLabel = `${days[0]?.date ?? ''} – ${days[6]?.date ?? ''}`;

  return (
    <>
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 pointer-events-none">
        {/* Left — branding */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-8 h-8 rounded-lg bg-godmode-accent flex items-center justify-center text-white font-bold text-sm glow-accent">
            G
          </div>
          <div>
            <p className="text-sm font-semibold text-godmode-text leading-none">God Mode</p>
            <p className="text-xs text-godmode-muted">{weekLabel}</p>
          </div>
        </div>

        {/* Center — week navigation */}
        <div className="flex items-center gap-3 pointer-events-auto glass rounded-xl px-4 py-2">
          <button
            onClick={() => setWeekOffset(weekOffset - 1)}
            className="text-godmode-muted hover:text-godmode-text transition-colors text-lg leading-none"
            aria-label="Previous week"
          >
            ‹
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className={`text-xs font-medium transition-colors ${weekOffset === 0 ? 'text-godmode-accent' : 'text-godmode-muted hover:text-godmode-text'}`}
          >
            {weekOffset === 0 ? 'This Week' : weekOffset === -1 ? 'Last Week' : weekOffset === 1 ? 'Next Week' : `Week ${weekOffset > 0 ? '+' : ''}${weekOffset}`}
          </button>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="text-godmode-muted hover:text-godmode-text transition-colors text-lg leading-none"
            aria-label="Next week"
          >
            ›
          </button>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Progress badge */}
          <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-2">
            <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 rounded-full"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono text-godmode-muted">{Math.round(progress * 100)}%</span>
          </div>

          <button
            onClick={openCommandPalette}
            className="glass rounded-xl px-3 py-1.5 text-xs text-godmode-muted hover:text-godmode-text transition-colors"
            title="Command palette (⌘K)"
          >
            ⌘K
          </button>

          <button
            onClick={() => setShowExport(true)}
            className="glass rounded-xl px-3 py-1.5 text-xs text-godmode-muted hover:text-godmode-text transition-colors"
            title="Export / Import"
          >
            ⬇
          </button>

          {deferredPrompt && (
            <button
              onClick={installPWA}
              className="glass rounded-xl px-3 py-1.5 text-xs text-godmode-accent hover:text-godmode-accentGlow transition-colors"
              title="Install app"
            >
              Install
            </button>
          )}
        </div>
      </div>

      {showExport && <ExportImport onClose={() => setShowExport(false)} />}
    </>
  );
}
