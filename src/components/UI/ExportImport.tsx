import { useState, useRef } from 'react';
import { encrypt, decrypt } from '../../lib/crypto';
import { getAllTasks, clearAndImportTasks } from '../../db/adapters';
import { useAppStore } from '../../store/useAppStore';
import type { Task } from '../../types';

interface ExportImportProps {
  onClose: () => void;
}

export function ExportImport({ onClose }: ExportImportProps) {
  const [mode, setMode] = useState<'export' | 'import'>('export');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    if (!password) { setStatus('Enter a password to encrypt the backup.'); return; }
    setLoading(true);
    try {
      const tasks = await getAllTasks();
      const json = JSON.stringify({ version: 1, tasks, exportedAt: Date.now() });
      const encrypted = await encrypt(json, password);
      const blob = new Blob([encrypted], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `godmode-backup-${new Date().toISOString().split('T')[0]}.enc`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus(`✓ Exported ${tasks.length} tasks.`);
    } catch (err) {
      setStatus(`Export failed: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) { setStatus('Select a backup file.'); return; }
    if (!password) { setStatus('Enter the backup password.'); return; }
    setLoading(true);
    try {
      const encoded = await file.text();
      const json = await decrypt(encoded.trim(), password);
      const data = JSON.parse(json) as { version: number; tasks: Task[] };
      if (!Array.isArray(data.tasks)) throw new Error('Invalid backup format');
      await clearAndImportTasks(data.tasks);
      useAppStore.getState().loadTasks(data.tasks);
      setStatus(`✓ Imported ${data.tasks.length} tasks.`);
    } catch (err) {
      setStatus(`Import failed — wrong password or corrupted file. (${String(err)})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm glass-dark rounded-2xl p-6 space-y-5 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-godmode-text">Backup & Restore</h2>
          <button onClick={onClose} className="text-godmode-muted hover:text-godmode-text text-xl">×</button>
        </div>

        <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
          {(['export', 'import'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setStatus(null); }}
              className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                mode === m ? 'bg-godmode-accent text-white' : 'text-godmode-muted hover:text-godmode-text'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {mode === 'import' && (
          <div>
            <label className="block text-xs text-godmode-muted mb-2">Backup file (.enc)</label>
            <input
              ref={fileRef}
              type="file"
              accept=".enc,.txt"
              className="w-full text-xs text-godmode-muted file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-white/10 file:text-godmode-text hover:file:bg-white/20 cursor-pointer"
            />
          </div>
        )}

        <div>
          <label className="block text-xs text-godmode-muted mb-2">
            Encryption password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 text-sm text-godmode-text rounded-xl px-4 py-2.5 border border-white/10 outline-none focus:border-godmode-accent"
            autoComplete="off"
          />
          <p className="text-xs text-godmode-muted mt-1 opacity-60">
            AES-256-GCM via PBKDF2. Password is never stored.
          </p>
        </div>

        {status && (
          <p className={`text-xs px-3 py-2 rounded-lg ${
            status.startsWith('✓') ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
          }`}>
            {status}
          </p>
        )}

        <button
          onClick={mode === 'export' ? handleExport : handleImport}
          disabled={loading || !password}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white bg-godmode-accent hover:bg-godmode-accentGlow transition-colors disabled:opacity-30"
        >
          {loading ? 'Processing…' : mode === 'export' ? 'Download Encrypted Backup' : 'Restore from Backup'}
        </button>
      </div>
    </div>
  );
}
