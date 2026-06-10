# tasteskill: Anti-Slop Frontend Skill

This is a comprehensive design engineering specification for building landing pages, portfolios, and redesigns that avoid common AI-generated UI patterns ("slop"). The document emphasizes reading the design brief carefully before applying any patterns, using three configuration dials (DESIGN_VARIANCE, MOTION_INTENSITY, VISUAL_DENSITY) to drive decisions, and enforcing strict pre-flight checks before shipping.

## Core Workflow

**Step 1: Brief Inference** — Before any code, declare what you're building in one sentence: page type, audience, aesthetic direction, and design system choice. Ask one clarifying question only if genuinely ambiguous.

**Step 2: Set Dials** — Configure three values (1-10 scale) that gate all downstream layout, motion, and spacing decisions. These derive from the design read, not defaults.

**Step 3: Choose Foundation** — Reach for official design systems (Material Web, Fluent UI, Carbon, shadcn/ui, Tailwind) when they fit. Build custom with CSS + component libraries otherwise.

**Step 4: Build with Discipline** — Follow layout hard rules, animate with intent, avoid 47 named AI tells (em-dashes, beige-brass palettes, three-equal-cards, fake screenshots).

**Step 5: Run Pre-Flight** — Mechanical checklist of 80+ required passes before delivery. Failing any box means rework.

## High-Impact Rules (The Tells Most LLMs Break)

- **Em-dash ban (Section 9.G):** zero em-dashes or en-dashes anywhere on the page. Period, comma, colon, line break, or hyphen only.
- **Premium-consumer palette lock (Section 4.2):** "warm beige + brass + espresso" is the AI default for artisan briefs. Banned as default. Rotate to cold-luxury, forest, monochrome-plus-pop, or steel instead.
- **Eyebrow restraint (Section 4.7):** tiny uppercase labels above section headers at most 1 per 3 sections.
- **Serif discipline (Section 4.1):** serif fonts are discouraged as default. Acceptable only when the brand names one, or the aesthetic is genuinely editorial/luxury/heritage. Default sans-serif display (Geist, Cabinet Grotesk, Sohne). Never start with Fraunces or Instrument_Serif.
- **Hero viewport fit (Section 4.7):** headline at most 2 lines, subtext at most 20 words + at most 4 lines, CTA visible without scroll.
- **Real images (Section 4.8):** generate or source actual photography. Div-based fake screenshots and hand-rolled SVG illustrations are incomplete work.

## Three Dials (Global Configuration)

| Dial | Range | Governs | Baseline |
|---|---|---|---|
| **DESIGN_VARIANCE** | 1-10 | Layout symmetry vs asymmetry, grid complexity, whitespace ratio | 8 |
| **MOTION_INTENSITY** | 1-10 | Animation breadth: static to micro-transitions to scroll-hijack choreography | 6 |
| **VISUAL_DENSITY** | 1-10 | Space consumption: gallery-airy to standard-app to data-cockpit | 4 |

Infer these from the design read (e.g., "minimalist" = 5/3/2; "playful agency" = 9/8/3). Use table in Section 1.A.

## Design System Map (Section 2.A)

Use official packages when available:
- **Material Web** — Google / Material 3 UI
- **Fluent UI** — Microsoft / enterprise SaaS
- **Carbon** — IBM / dense data UI
- **Radix Themes** — accessible React foundation
- **shadcn/ui** — ownership-first Tailwind components
- **Tailwind v4** — utility-first default
- **Primer** — GitHub / devtool aesthetic
- **GOV.UK Frontend** / **USWDS** — public-sector trust-first

For aesthetics (glassmorphism, brutalism, kinetic-type, editorial), build with Tailwind + Motion + CSS, label borrowed inspiration honestly.

## Forbidden Tells (Section 9: AI Design Signatures)

**Visual & Layout**
- No neon outer-glows; use inner borders or tinted shadows.
- No `#000000` or `#ffffff`; use off-black/off-white.
- No three-equal-card feature rows; use 2-column zig-zag, asymmetric grid, or scroll alternative.
- No `h-screen` (causes layout shift on mobile). Use `min-h-[100dvh]`.

**Typography**
- No Inter as default (override path: minimalist / Linear-style only).
- No serif without brand justification or editorial aesthetic.
- No em-dash anywhere (headlines, eyebrows, body, quotes, attribution).

**Content & Data**
- No generic names ("John Doe", "Sarah Chan"); use realistic locale-appropriate names.
- No fake-precise specs (`99.99%`, `50.5 mm`) without data justification.
- No startup-slop brand names ("Acme", "Nexus", "Cloudly"); invent contextual names.
- No filler verbs ("Elevate", "Seamless", "Unleash", "Revolutionize"); use concrete action verbs.

**Decoration & Micro-Labels**
- No section-number eyebrows (`001 Capabilities`).
- No version labels in hero (`V0.6`, `BETA`, `EARLY ACCESS`).
- No colored status dots on every nav item or list row; only for real semantic state, max one per section.

## Layout Hard Rules (Section 4.7)

Failing any of these is shipping broken work:
- **Hero MUST fit initial viewport:** headline max 2 lines, subtext max 20 words + max 4 lines, CTAs visible without scroll.
- **Navigation on ONE line at desktop**, height at most 80px.
- **Hero top padding cap:** max `pt-24`.
- **Logo walls belong UNDER hero**, not inside it.
- **No duplicate CTA intent** per page.
- **Button contrast check:** WCAG AA 4.5:1 minimum.
- **Section-layout repetition:** no two sections share same layout family.
- **Zigzag cap:** max 2 consecutive alternations.
- **Bento grids:** exact cell count = content count. No empty cells mid-grid.

## Motion Discipline (Section 5 & 5.D)

- **Motion must be motivated:** ask "what does this communicate?" before adding.
- **One marquee per page max.**
- **Never `window.addEventListener('scroll')`** - use Motion `useScroll()`, GSAP ScrollTrigger, IntersectionObserver, or CSS scroll-driven animations.
- **Never `useState` for continuous values** (mouse position, scroll progress, pointer physics). Use Motion's `useMotionValue` + `useTransform`.
- **Reduced motion honored:** any animation above `MOTION_INTENSITY > 3` must collapse to static under `prefers-reduced-motion: reduce`.

## Stack Defaults (Section 3)

- **Framework:** React or Next.js (Server Components default).
- **Styling:** Tailwind v4 (or v3 if project requires).
- **Animation:** Motion (import `motion/react`). GSAP + ScrollTrigger for scroll hijacks (isolated components only).
- **Fonts:** `next/font` or self-hosted `@font-face`; never `<link>` to Google Fonts in production.
- **Icons:** Phosphor (priority) > HugeIcons > Radix > Tabler. Never hand-roll SVG paths. Lucide only on explicit request.
- **Dark mode:** Tailwind `dark:` variant or CSS variables. Test both modes before shipping.

## Pre-Flight Checklist (Section 14)

80+ mechanical checks. Failing any one = rework required. Key highlights:
- Brief inference declared (one-liner)?
- Dials explicit and reasoned?
- Zero em-dashes (headlines, eyebrows, body, quotes, buttons, alt text)?
- One page theme (light / dark / auto); no section flips mid-page?
- One accent color used consistently?
- Hero fits viewport without scroll?
- Every animation motivated?
- Motion reduced under `prefers-reduced-motion`?
- Dark mode tested in both modes?
- Mobile collapse explicit?
- No serif without justification?
- Premium-consumer palette not AI-default beige+brass?

Run every box. Output is incomplete until all pass.

---

**This is a live specification.** Use this as your north star for all landing page, portfolio, and redesign work. Every decision gates through brief inference, dials, and pre-flight checks. No shortcuts.
