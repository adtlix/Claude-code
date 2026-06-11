# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: Aurora landing page

A premium product landing page featuring a real-time, rotating 3D product
rendered with WebGL. Built as a static single-page site.

## Stack

- **Vite** + **React 18** + **TypeScript** (strict)
- **three** + **@react-three/fiber** + **@react-three/drei** — the 3D scene
- **@react-three/postprocessing** — Bloom / SMAA / Vignette for the cinematic look
- **framer-motion** — scroll-reveal and entrance animations

## Commands

- `npm install` — install dependencies
- `npm run dev` — start the local dev server (http://localhost:5173)
- `npm run build` — typecheck (`tsc -b`) then build to `dist/`
- `npm run preview` — preview the production build

## Architecture

- `src/App.tsx` — page composition; lazy-loads the WebGL scene
- `src/three/Scene.tsx` — the R3F `<Canvas>`, lighting, environment, post-processing
- `src/three/Product.tsx` — the procedurally-built rotating product (titanium core,
  glowing accent ring, sapphire-glass dome). No external 3D model needed.
- `src/components/*` — landing sections (Nav, Hero, Features, Specs, Showcase, CTA, Footer)
- `src/index.css` — design tokens (CSS custom properties) + base styles
- `src/app.css` — component styles

## Deployment

Deployed to Vercel (static Vite build). `vercel.json` pins the framework and
SPA rewrites.
