# CLAUDE.md

## Project: Liquid Glass Agent / Aura Voice Live

Autonomous AI assistant with an infinite glassmorphic node canvas. The AI communicates via a JSON command protocol embedded in its text responses to control the canvas in real time.

## Build Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # ESLint check
npm run type-check   # TypeScript type check (no emit)
```

## Environment Setup

Copy `.env.local.example` to `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...
```

## Architecture

- **`app/page.tsx`** — Client root; composes canvas + chat sidebar, handles all command dispatch
- **`app/api/chat/route.ts`** — Server route calling Anthropic SDK (API key lives here only)
- **`components/Canvas.tsx`** — Infinite pannable/zoomable canvas + StarField + HUD overlay
- **`components/AgentChat.tsx`** — 360px glass chat sidebar + command dispatcher
- **`components/NodeCard.tsx`** — Glassmorphic node wrapper with Framer Motion entrance
- **`components/nodes/`** — WeatherNode, ReportNode, NewsNode, DataNode content renderers
- **`hooks/useCanvas.ts`** — Camera transform via Framer Motion `useMotionValue` + `useAnimationControls`
- **`hooks/useNodes.ts`** — Node CRUD state management
- **`lib/commandParser.ts`** — Parses `[UI_COMMAND:{...}]` blocks from AI text responses
- **`types/index.ts`** — All shared TypeScript interfaces
- **`DESIGN.md`** — Liquid Glass design system documentation

## Key Concepts

The canvas uses Framer Motion `useMotionValue` for `x/y/scale` on an absolutely-positioned div. Drag sets values directly via `.set()` for zero-latency pan. Programmatic camera moves use `useAnimationControls.start()`. Node positions are world coordinates (pixels). Wheel zoom centers on cursor position.

The chat sidebar calls `/api/chat`, receives the AI response, parses all embedded `[UI_COMMAND:{...}]` blocks, dispatches them as canvas actions, and displays the clean text (commands stripped).

## Skills Installed

- `.claude/skills/ui-ux-pro-max/SKILL.md` — Design intelligence (50+ styles, 161 palettes)
- `.claude/skills/taste-skill/SKILL.md` — Anti-slop frontend rules + pre-flight checklist
