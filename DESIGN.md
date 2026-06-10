# DESIGN.md — Liquid Glass Agent

## Visual Theme & Atmosphere

Dark spatial intelligence interface. The canvas is an infinite void, deep and dimensionless. Information surfaces as glass-like nodes floating in this space. The aesthetic blends the depth cues of glassmorphism with the functional precision of a data cockpit. No decorative gradients. No chrome. Only meaningful surfaces.

Taste-skill dials: `DESIGN_VARIANCE: 9` / `MOTION_INTENSITY: 8` / `VISUAL_DENSITY: 3`

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `canvas.bg` | `#030305` | Canvas background (not pure black) |
| `glass.surface` | `rgba(255,255,255,0.04)` | Node card backgrounds |
| `glass.border` | `rgba(255,255,255,0.08)` | Node card borders |
| `glass.white12` | `rgba(255,255,255,0.12)` | Elevated surfaces |
| `glass.white20` | `rgba(255,255,255,0.20)` | Active/hover surfaces |
| `accent.violet` | `#7c3aed` | Primary accent, buttons, camera rings |
| `accent.indigo` | `#4f46e5` | Gradient partner for violet |
| `node.weather` | `#3b82f6` | Weather node accent (blue) |
| `node.report` | `#a855f7` | Report node accent (purple) |
| `node.news` | `#06b6d4` | News node accent (cyan) |
| `node.data` | `#22c55e` | Data node accent (green) |
| `text.primary` | `rgba(255,255,255,0.90)` | Headlines |
| `text.secondary` | `rgba(255,255,255,0.60)` | Body copy |
| `text.tertiary` | `rgba(255,255,255,0.35)` | Labels, metadata |
| `text.muted` | `rgba(255,255,255,0.20)` | Hints, placeholders |

**Guardrails:** No `#000000` or `#ffffff`. No neon outer-glows. No beige, brass, or espresso palettes. All color decisions through semantic tokens.

---

## Typography Rules

| Role | Font | Size | Weight | Line Height |
|---|---|---|---|---|
| Display | Geist Sans | 28-40px | 400 | 1.1 |
| Heading | Geist Sans | 14-18px | 500-600 | 1.3 |
| Body | Geist Sans | 13-14px | 400 | 1.6 |
| Label | Geist Sans | 10-11px | 400 | 1.4 |
| Data/Mono | Geist Mono | 12-24px | 300-400 | 1.4 |

- Geist Sans for all UI text (taste-skill: no Inter as default)
- Geist Mono for temperatures, percentages, coordinates, and key-value data
- Uppercase only for node type badges and status labels, tracked at `0.08em`
- No italic display type without `leading-[1.1]` + `pb-1`

---

## Component Styling

### Glass Node Card
```css
background: rgba(255,255,255,0.04);
backdrop-filter: blur(24px);
-webkit-backdrop-filter: blur(24px);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 16px;
border-left: 2px solid <node-type-color>;
box-shadow: 0 0 40px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.06);
```

Hover state:
```css
box-shadow: 0 0 60px rgba(124,58,237,0.22), inset 0 1px 0 rgba(255,255,255,0.10);
transform: scale(1.02);
```

### Chat Sidebar
```css
background: rgba(255,255,255,0.025);
backdrop-filter: blur(48px);
border-left: 1px solid rgba(255,255,255,0.06);
width: 360px;
```

### User Message
```css
background: rgba(124,58,237,0.30);
border: 1px solid rgba(124,58,237,0.20);
border-radius: 16px 16px 4px 16px;
```

### Assistant Message
```css
background: rgba(255,255,255,0.05);
border: 1px solid rgba(255,255,255,0.08);
border-radius: 16px 16px 16px 4px;
```

---

## Layout Principles

- Canvas fills the full viewport. No scroll. `overflow: hidden` on `html` and `body`.
- Chat sidebar is a fixed `360px` right panel overlaying the canvas.
- Canvas HUD controls sit bottom-left, outside the transform.
- Node cards are `280px` wide, positioned with `transform: translate(-50%, -50%)` so coordinates represent the center point.
- Canvas world coordinate space: `0..6000 x 0..6000`. Default viewport shows approximately `0..1440 x 0..900`.
- No `h-screen` — use explicit `h-full` on contained elements or `min-h-[100dvh]` on top-level.

---

## Depth & Elevation

Depth is conveyed through:
1. **Blur intensity** — deeper glass = more blur
2. **Border opacity** — more visible border = closer to camera
3. **Shadow glow** — active nodes have stronger violet glow
4. **Scale** — zoom in to increase apparent depth

No traditional drop-shadow elevation scale. The canvas handles depth through the camera itself.

---

## Motion Design

| Action | Duration | Easing |
|---|---|---|
| Node entrance | spring(stiffness=280, damping=24) | Spring |
| Node exit | 200ms | ease-out |
| Camera pan | 600ms | `[0.32, 0.72, 0, 1]` (custom decelerate) |
| Zoom to fit | 800ms | `[0.32, 0.72, 0, 1]` |
| Hover scale | 200ms | ease-out |
| Chat message | 200ms | ease-out |
| Thinking dots | 1200ms | ease-in-out, staggered 180ms |

**Reduced motion:** all animations collapse to instant under `prefers-reduced-motion: reduce`.

**Motion is motivated:**
- Node entrance communicates "new information arriving"
- Camera pan communicates "spatial focus has changed"
- Zoom-out communicates "overview mode"
- Hover scale communicates "interactive element"

---

## Design Guardrails

- No em-dashes anywhere. Period, comma, colon, hyphen, or line break only.
- No neon outer-glows on nodes. Tinted box-shadows only.
- No serif fonts. Dark glass interfaces read poorly with serif.
- No status dots on every element. Node type badge is the only persistent dot.
- No three-equal-card layouts. Nodes are spatially varied by definition.
- All motion is optional: UI is fully functional with `prefers-reduced-motion: reduce`.
- WCAG AA contrast on all text within node cards. Off-white on glass backgrounds verified.

---

## Responsive Behavior

- Desktop (1280px+): Full canvas + 360px chat sidebar
- Tablet (768-1280px): Canvas + collapsed sidebar (icon strip), expandable via button
- Mobile (<768px): Single view, toggle between canvas and chat

Canvas drag and zoom are touch-compatible:
- Touch-pan via `touchmove`
- Pinch-to-zoom via `touchmove` with 2 fingers

---

## Command Protocol Specification

The AI embeds UI commands as JSON blocks in its text responses. These are parsed client-side and dispatched to canvas state.

Format: `[UI_COMMAND:{...JSON...}]`

### spawn_node
```json
{
  "type": "spawn_node",
  "id": "unique_id",
  "node_type": "weather | report | news | data",
  "title": "Display title",
  "content": "string or object",
  "x": 400,
  "y": 300
}
```

### pan_camera
```json
{
  "type": "pan_camera",
  "target_id": "unique_id"
}
```

### zoom_out
```json
{
  "type": "zoom_out"
}
```

Content shapes per node type:
- `weather`: `{ temperature, condition, location, humidity?, wind?, feels_like? }`
- `report`: `{ summary?, details?: string[], score?: number, source? }`
- `news`: `{ headline?, summary?, source?, category? }`
- `data`: any flat key-value object, or a string scalar

---

## Agent Prompt Guide

When building on this design system, use these principles:

1. Place nodes across varied x/y coordinates (200-2000 range). Nodes are 280px wide, ~180px tall.
2. After spawning multiple nodes, use `pan_camera` to focus. Use `zoom_out` after 3+ nodes.
3. Data is more readable in mono font objects than prose. Use structured content objects for node data.
4. Communicate in direct sentences. No filler words. No em-dashes.
5. The canvas has infinite space. Use it. Spread nodes thematically.
