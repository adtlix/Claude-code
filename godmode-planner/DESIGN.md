---
name: Liquid Glass
colors:
  surface: '#f9f9fb'
  surface-dim: '#d9dadc'
  surface-bright: '#f9f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f5'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e4'
  on-surface: '#1a1c1d'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3132'
  inverse-on-surface: '#f0f0f2'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#005ab7'
  on-secondary: '#ffffff'
  secondary-container: '#0372e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#d7e2ff'
  secondary-fixed-dim: '#abc7ff'
  on-secondary-fixed: '#001b3f'
  on-secondary-fixed-variant: '#00458f'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9fb'
  on-background: '#1a1c1d'
  surface-variant: '#e2e2e4'
  liquid-tint: rgba(255, 255, 255, 0.7)
  glass-border: rgba(255, 255, 255, 0.2)
  deep-blur: rgba(0, 0, 0, 0.05)
typography:
  display-xl:
    fontFamily: Geist
    fontSize: 80px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 19px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 40px
---

## Brand & Style

The design system is centered on a "Liquid Glass" philosophy—a high-end, organic aesthetic that prioritizes depth, soft refraction, and fluid motion. It is designed to evoke a sense of premium craftsmanship, tranquility, and tactile responsiveness. The target audience is sophisticated users who value clarity and a seamless blend of hardware and software aesthetics.

The visual style is a refined evolution of **Glassmorphism**, utilizing deep background blurs and "squircle" geometry (superellipses) to avoid the harshness of standard geometric rounds. Every interface element should feel like a physical object suspended in a viscous, high-clarity medium. The UI avoids all "techy" tropes, opting instead for a pure, editorial look that feels both futuristic and timeless.

## Colors

The palette is rooted in a monochromatic foundation to allow the "liquid" background gradients to provide the necessary chromatic energy. 

- **Core Palette:** Pure Whites (#FFFFFF) and Deep Blacks (#000000) serve as the primary anchors for text and structural elements. 
- **Accents:** A single vibrant blue (#0071E3) is used sparingly for interactive highlights and critical calls to action.
- **Backgrounds:** Rather than flat colors, backgrounds should feature ultra-soft, multi-stop gradients (using muted pinks, purples, and blues) that shift slowly. These are always viewed through layers of blurred glass.
- **Surface Logic:** "Surfaces" are not defined by color codes alone but by their opacity and backdrop-filter properties.

## Typography

This design system utilizes **Geist** for its precision and modernist neutrality, mirroring the clarity of high-end Swiss typography. 

- **Hierarchy:** High contrast is key. Large display titles should use tight tracking and heavy weights to feel impactful against the soft glass backgrounds.
- **Readability:** Body text maintains generous line height (1.5) to ensure legibility over semi-transparent surfaces. 
- **Type Treatment:** On dark glass surfaces, text should use "vibrant" blending modes (yielding a slightly translucent white) rather than pure flat white, allowing a hint of the background color to bleed through the glyphs.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model for content containers to maintain editorial control, but uses **Fluid Margins** to center the experience.

- **Rhythm:** A strict 8px base unit governs all spacing.
- **Breakpoints:** 
    - **Desktop (1024px+):** 12-column grid, 40px margins.
    - **Tablet (768px - 1023px):** 8-column grid, 32px margins.
    - **Mobile (Up to 767px):** 4-column grid, 20px margins.
- **Composition:** Elements should be spaced with significant breathing room (whitespace) to reinforce the "premium" feel. Use "Stack" patterns for vertical consistency.

## Elevation & Depth

Depth in this design system is achieved through **optical physics** rather than standard drop shadows.

- **Backdrop Filters:** All floating surfaces must use a `backdrop-filter: blur(30px) saturate(150%)`. This ensures the colors underneath are diffused and vibrant.
- **Layering:** Use a three-tier surface system:
    1. **Base:** The liquid gradient background.
    2. **Secondary:** Large glass containers (low opacity, e.g., 40%).
    3. **Primary:** Interactive elements like buttons (higher opacity, e.g., 80% or solid white).
- **Inner Borders:** Instead of shadows, use a 0.5px or 1px "inner glow" border. On light mode, use a white border with 20% opacity. This simulates the edge of a glass pane catching light.

## Shapes

The design system strictly uses **superellipses (squircles)** for all containers and components. This creates a more organic, continuous curve than standard rounded rectangles.

- **Global Radius:** Use a base radius of 16px (1rem) for standard components.
- **Large Surfaces:** Containers and cards should use a 32px or 48px radius to emphasize the fluid, liquid nature of the UI.
- **Consistency:** Ensure that nested elements have a smaller radius than their parent to maintain visual harmony (the "concentric radius" rule).

## Components

- **Buttons:** Primary buttons are solid black (in light mode) or solid white (in dark mode) with high-contrast text. Secondary buttons use the "Glass" treatment with a subtle 1px border.
- **Cards:** Cards should never have a solid background. They are always glass panes with a 24px-40px blur. 
- **Inputs:** Search bars and text fields should be recessed glass—slightly darker or lighter than the parent surface with a 1px inner stroke.
- **Chips:** Highly rounded (pill-shaped) with a light frost effect. When active, they use the Primary Blue (#0071E3) with a white label.
- **Sliders & Toggles:** Use fluid, physics-based animations. The "thumb" of a slider should feel heavy and tactile, while the track is a thin, translucent frosted line.
- **Segmented Controls:** These should appear as a single carved-out glass track where the "active" state is a raised, opaque squircle that slides smoothly between options.