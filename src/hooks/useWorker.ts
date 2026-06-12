import { useRef, useEffect, useCallback } from 'react';
import type { Task, WorkerInMessage, WorkerOutMessage } from '../types';

interface PendingRequest {
  resolve: (results: Task[]) => void;
}

export function useWorker() {
  const workerRef = useRef<Worker | null>(null);
  const pendingRef = useRef<Map<string, PendingRequest>>(new Map());

  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/searchWorker.ts', import.meta.url),
      { type: 'module' }
    );
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<WorkerOutMessage>) => {
      const msg = e.data;
      if (msg.type === 'RESULTS') {
        const pending = pendingRef.current.get(msg.requestId);
        if (pending) {
          pending.resolve(msg.results);
          pendingRef.current.delete(msg.requestId);
        }
      }
    };

    worker.onerror = (err) => console.error('[SearchWorker]', err);

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const index = useCallback((tasks: Task[]) => {
    const msg: WorkerInMessage = { type: 'INDEX', tasks };
    workerRef.current?.postMessage(msg);
  }, []);

  const search = useCallback((query: string): Promise<Task[]> => {
    return new Promise((resolve) => {
      if (!workerRef.current) return resolve([]);
      const requestId = crypto.randomUUID();
      pendingRef.current.set(requestId, { resolve });
      const msg: WorkerInMessage = { type: 'SEARCH', query, requestId };
      workerRef.current.postMessage(msg);
      // Timeout safety
      setTimeout(() => {
        if (pendingRef.current.has(requestId)) {
          pendingRef.current.delete(requestId);
          resolve([]);
        }
      }, 2000);
    });
  }, []);

  return { index, search };
}
