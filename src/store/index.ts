import { create } from 'zustand'

export interface Task {
  id: string
  text: string
  done: boolean
  priority: 'high' | 'med' | 'low'
  createdAt: number
}

export interface ActivityEntry {
  id: string
  type: 'deploy' | 'commit' | 'test' | 'build' | 'pr' | 'alert'
  message: string
  detail: string
  ts: number
}

interface OSStore {
  booted: boolean
  setBooted: () => void

  tasks: Task[]
  addTask: (text: string) => void
  toggleTask: (id: string) => void

  notes: string
  setNotes: (v: string) => void

  activity: ActivityEntry[]
  pushActivity: (e: Omit<ActivityEntry, 'id' | 'ts'>) => void

  activeWidget: string | null
  setActiveWidget: (id: string | null) => void

  cpuHistory: number[]
  memHistory: number[]
  netHistory: number[]
  tickStats: () => void
}

const mkId = () => Math.random().toString(36).slice(2)

const SEED_TASKS: Task[] = [
  { id: mkId(), text: 'Redesign dashboard layout', done: false, priority: 'high', createdAt: Date.now() - 3600000 },
  { id: mkId(), text: 'Review API changes', done: false, priority: 'med', createdAt: Date.now() - 7200000 },
  { id: mkId(), text: 'Deploy to staging', done: true, priority: 'high', createdAt: Date.now() - 10800000 },
  { id: mkId(), text: 'Write integration tests', done: false, priority: 'low', createdAt: Date.now() - 14400000 },
  { id: mkId(), text: 'Optimize shader pipeline', done: false, priority: 'med', createdAt: Date.now() - 18000000 },
]

const SEED_ACTIVITY: ActivityEntry[] = [
  { id: mkId(), type: 'deploy', message: 'deploy:success', detail: 'prod → v2.3.1', ts: Date.now() - 120000 },
  { id: mkId(), type: 'pr', message: 'pr:merged', detail: 'fix/auth-flow #142', ts: Date.now() - 300000 },
  { id: mkId(), type: 'test', message: 'tests:passed', detail: '98/98 passing', ts: Date.now() - 540000 },
  { id: mkId(), type: 'build', message: 'build:success', detail: '1.2s compile', ts: Date.now() - 780000 },
  { id: mkId(), type: 'commit', message: 'commit:pushed', detail: 'feat/3d-renderer', ts: Date.now() - 1020000 },
  { id: mkId(), type: 'alert', message: 'alert:cleared', detail: 'cpu spike resolved', ts: Date.now() - 1440000 },
  { id: mkId(), type: 'deploy', message: 'deploy:staging', detail: 'staging → v2.2.9', ts: Date.now() - 2100000 },
]

export const useOSStore = create<OSStore>((set) => ({
  booted: false,
  setBooted: () => set({ booted: true }),

  tasks: SEED_TASKS,
  addTask: (text) => set((s) => ({
    tasks: [{ id: mkId(), text, done: false, priority: 'med', createdAt: Date.now() }, ...s.tasks],
  })),
  toggleTask: (id) => set((s) => ({
    tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
  })),

  notes: '// NOTES\n\n→ Check Three.js r160 changelog\n→ Implement shader LOD system\n→ Add socket.io reconnect logic\n→ Performance audit next sprint\n\n// IDEAS\n\n? Generative background per time of day\n? AI widget integration\n? Terminal command shortcuts',
  setNotes: (v) => set({ notes: v }),

  activity: SEED_ACTIVITY,
  pushActivity: (e) => set((s) => ({
    activity: [{ ...e, id: mkId(), ts: Date.now() }, ...s.activity].slice(0, 50),
  })),

  activeWidget: null,
  setActiveWidget: (id) => set({ activeWidget: id }),

  cpuHistory: Array.from({ length: 40 }, () => Math.random() * 60 + 20),
  memHistory: Array.from({ length: 40 }, () => Math.random() * 30 + 50),
  netHistory: Array.from({ length: 40 }, () => Math.random() * 80),
  tickStats: () => set((s) => ({
    cpuHistory: [...s.cpuHistory.slice(1), Math.min(100, Math.max(5, s.cpuHistory.at(-1)! + (Math.random() - 0.5) * 15))],
    memHistory: [...s.memHistory.slice(1), Math.min(95, Math.max(30, s.memHistory.at(-1)! + (Math.random() - 0.5) * 5))],
    netHistory: [...s.netHistory.slice(1), Math.min(100, Math.max(0, s.netHistory.at(-1)! + (Math.random() - 0.5) * 25))],
  })),
}))
