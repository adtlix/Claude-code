# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**God Mode 3D Planner** — A high-performance, offline-first 3D weekly planner built with React Three Fiber, Zustand, and Dexie.js (IndexedDB).

## Build & Development Commands

```bash
npm run dev        # Start Vite dev server (http://localhost:5173)
npm run build      # TypeScript check + Vite production build → dist/
npm run preview    # Serve production build locally
npm run typecheck  # TypeScript type-check only (tsc --noEmit)
npm run lint       # ESLint (zero warnings enforced)
```

## Architecture Overview

### Layers
1. **3D Scene** (`src/components/Planner/`) — React Three Fiber canvas with inline GLSL shaders. Purely visual; reads from Zustand store.
2. **DnD Overlay** (`src/components/DnD/`) — Invisible @dnd-kit DOM layer. Bridges drag events → Zustand `dragState` → 3D card tilt via `useFrame`.
3. **UI Overlays** (`src/components/UI/`) — HTML overlays: Toolbar, TaskForm sidebar, ExportImport modal.
4. **Command Palette** (`src/components/CommandPalette/`) — cmdk-based floating palette (Cmd+K). Worker-powered search.

### Data Flow
```
IndexedDB (Dexie) ← db/adapters.ts ← store/slices/taskSlice.ts ← UI events
                                                   ↓
                                    store/useAppStore (Zustand)
                                                   ↓
                         3D scene reads state → renders cards
```

### Key Files
- `src/types/index.ts` — All shared TypeScript interfaces (Task, Day, HistoryAction, etc.)
- `src/store/useAppStore.ts` — Combined Zustand store (4 slices: task, history, ui, recurring)
- `src/db/database.ts` — Dexie.js schema (IndexedDB)
- `src/workers/searchWorker.ts` — Web Worker: trigram search index (keeps main thread free)
- `src/components/Planner/PlannerScene.tsx` — R3F Canvas entry point
- `src/App.tsx` — Root: DndContext, layout, DB load on mount

### Critical Design Decisions
- **3D card tilt**: @dnd-kit `useDndMonitor` → Zustand `dragState.delta` → `useFrame` lerp on `mesh.rotation.z`
- **Camera lock**: `pointerEvents: none` on canvas + `<OrbitControls enabled={false}>` when command palette is open
- **Worker scope**: Web Worker only for search indexing — NOT for Dexie I/O (already async)
- **PWA**: `vite-plugin-pwa` with Workbox, `registerType: 'autoUpdate'`
- **Encryption**: AES-256-GCM via Web Crypto API (PBKDF2 key derivation, 100k iterations)

### Undo System
Every mutation calls `historySlice.pushAction(HistoryAction)`. `Ctrl+Z` triggers `undoAction()` which reverses the last operation and decrements `historyIndex`.

### Error Boundaries
- Outer: `App.tsx` wraps the entire tree
- Inner: Each `DayColumn` has its own `ErrorBoundary` with a 3D fallback — one broken column never crashes the scene
