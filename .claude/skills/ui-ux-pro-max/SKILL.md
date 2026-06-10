# UI/UX Pro Max - Design Intelligence Guide

I'm a comprehensive design system resource for web and mobile applications. Here's what I provide:

## Core Content

**Design Database:** 50+ styles, 161 color palettes, 57 font pairings, 161 product types, 99 UX guidelines, and 25 chart types across 10 technology stacks (React, Next.js, Vue, Svelte, SwiftUI, React Native, Flutter, Tailwind, shadcn/ui, HTML/CSS).

**Rule Categories (Priority 1-10):**
1. Accessibility (CRITICAL) - Contrast ratios, focus states, alt text, keyboard navigation
2. Touch & Interaction (CRITICAL) - 44x44px minimum targets, 8px spacing, loading feedback
3. Performance (HIGH) - Image optimization, lazy loading, layout stability
4. Style Selection (HIGH) - Pattern matching, consistency, SVG icons
5. Layout & Responsive (HIGH) - Mobile-first design, viewport configuration
6. Typography & Color (MEDIUM) - Line height, font pairing, semantic tokens
7. Animation (MEDIUM) - 150-300ms timing, transform-only performance, meaning-driven motion
8. Forms & Feedback (MEDIUM) - Visible labels, error placement, progressive disclosure
9. Navigation Patterns (HIGH) - Predictable back, bottom nav limits, deep linking
10. Charts & Data (LOW) - Appropriate chart types, accessibility, legends

## How to Use

**Step 1:** Analyze your requirements (product type, audience, style keywords, tech stack)

**Step 2:** Generate design system with: `python3 search.py "<query>" --design-system`

**Step 3:** Supplement with domain searches: `--domain <domain>`

**Step 4:** Apply stack-specific guidelines: `--stack react-native`

## Key Principles

- Always prioritize accessibility and touch usability for mobile-first development
- Use semantic design tokens, not hardcoded hex values
- Respect system safe areas, reduced-motion preferences, and Dynamic Type scaling
- Animate with purpose (150-300ms micro-interactions); avoid decorative-only motion
- Test light and dark modes independently with verified contrast ratios

**Pre-delivery checklist:** No emoji icons, consistent interaction feedback, accessible focus/labels, safe-area compliance, and verified light/dark mode contrast.
