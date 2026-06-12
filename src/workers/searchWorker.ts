import type { WorkerInMessage, WorkerOutMessage, Task } from '../types';

const taskIndex = new Map<string, Task>();
const trigramIndex = new Map<string, Set<string>>();

function buildTrigrams(text: string): Set<string> {
  const normalized = text.toLowerCase().replace(/\s+/g, ' ').trim();
  const trigrams = new Set<string>();
  for (let i = 0; i <= normalized.length - 3; i++) {
    trigrams.add(normalized.slice(i, i + 3));
  }
  return trigrams;
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function indexTasks(tasks: Task[]) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    taskIndex.clear();
    trigramIndex.clear();

    for (const task of tasks) {
      taskIndex.set(task.id, task);
      const trigrams = buildTrigrams(`${task.title} ${task.category}`);
      for (const trigram of trigrams) {
        if (!trigramIndex.has(trigram)) trigramIndex.set(trigram, new Set());
        trigramIndex.get(trigram)!.add(task.id);
      }
    }

    const response: WorkerOutMessage = { type: 'INDEXED', count: tasks.length };
    self.postMessage(response);
  }, 300);
}

function searchTasks(query: string, requestId: string) {
  if (!query.trim()) {
    const response: WorkerOutMessage = { type: 'RESULTS', requestId, results: [] };
    self.postMessage(response);
    return;
  }

  const queryTrigrams = buildTrigrams(query);
  const scores = new Map<string, number>();

  for (const trigram of queryTrigrams) {
    const ids = trigramIndex.get(trigram);
    if (!ids) continue;
    for (const id of ids) scores.set(id, (scores.get(id) ?? 0) + 1);
  }

  const results = Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id]) => taskIndex.get(id))
    .filter((t): t is Task => t !== undefined);

  const response: WorkerOutMessage = { type: 'RESULTS', requestId, results };
  self.postMessage(response);
}

self.onmessage = (e: MessageEvent<WorkerInMessage>) => {
  const msg = e.data;
  if (msg.type === 'INDEX') indexTasks(msg.tasks);
  else if (msg.type === 'SEARCH') searchTasks(msg.query, msg.requestId);
};
