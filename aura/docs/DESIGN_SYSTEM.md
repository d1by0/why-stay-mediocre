# Aura: Frontend Architecture & Design System Spec

This document specifies the frontend engineering principles, folder routing, design system tokens, typography rules, motion system physics, accessibility checklists, and primitive reusable components for the Aura interface.

---

## 🏗️ Next.js App Router Structure & Layouts

We organize `apps/web/src/app` using a unified nested layout hierarchy.

```
apps/web/src/app/
├── (marketing)/                # Unprotected routes (Landing, FAQ, Pricing)
│   ├── layout.tsx              # Clean headers, footer, SEO Metadata
│   └── page.tsx                # High-performance static home landing
├── (auth)/                     # Auth layouts
│   ├── sign-in/
│   └── sign-up/
├── (dashboard)/                # Protected workspace routes
│   ├── layout.tsx              # Sidebars/Bottom Navs, Clerk loading states
│   ├── dashboard/
│   ├── workouts/
│   ├── biometrics/
│   ├── journal/
│   └── settings/
├── layout.tsx                  # Global HTML, Root Providers (Clerk, Theme, Query)
├── error.tsx                   # Global error boundary UI fallback
└── loading.tsx                 # Root shimmer layout placeholder
```

### 1. Route Protection & Middleware
- Authentication is gated at the Edge using Clerk Middleware:
  ```typescript
  // middleware.ts
  import { authMiddleware } from "@clerk/nextjs";
  export default authMiddleware({
    publicRoutes: ["/", "/faq", "/pricing", "/api/webhooks(.*)"],
  });
  ```
- Any unauthorized traffic targeting `/dashboard/*` is redirected instantly to `/sign-in`.

### 2. Loading UI & Error Boundaries
- **Loading states (`loading.tsx`)**: Instead of spinner icons, Aura renders a custom content-aware skeleton shimmer layout that mimics the exact layout of the target page, maintaining spatial consistency and reducing perceived loading times.
- **Error states (`error.tsx`)**: Next.js wraps routes in React Error Boundaries. In case of render errors, Aura displays a premium, non-disruptive card reporting the issue, offering a "Retry" button, and logging stack traces to Sentry.

---

## 🎨 Design Tokens & UI Foundations

Aura uses an HSL-based, custom-palette design system tailored for sleek dark modes.

### 1. Colors Palette (CSS Custom Properties)
```css
:root {
  /* Sleek Dark Mode (Default) */
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  
  --card: 240 10% 6%;
  --card-foreground: 0 0% 98%;
  
  --primary: 263.4 70% 50.4%; /* Deep Aura Violet */
  --primary-foreground: 210 20% 98%;
  
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  
  --accent: 240 3.7% 15.9%;
  --accent-glow: 263.4 70% 50.4% / 0.15;
  
  --success: 142.1 76.2% 36.3%; /* Premium Growth Green */
  --destructive: 0 84.2% 60.2%; /* Alert Red */
}
```

### 2. Spacing Scale
Aura follows a strict 8-point grid to guarantee visual hierarchy across device form factors.
- `space-1` = 4px (0.25rem)
- `space-2` = 8px (0.5rem)
- `space-3` = 12px (0.75rem)
- `space-4` = 16px (1rem)
- `space-5` = 24px (1.5rem)
- `space-6` = 32px (2rem)
- `space-8` = 48px (3rem)

### 3. Typography Rules
- **Headings**: `Outfit` (sans-serif, geometric). Promotes a bold, modern personal growth aesthetic.
- **Body & Controls**: `Inter`. High-readability font system with optimal kerning for mobile displays.
- **Numbers / Timers**: `SF Pro Mono` / `JetBrains Mono` with **tabular numbers** enabled (`font-variant-numeric: tabular-nums`). This prevents UI layout shifts and numbers jumping back and forth during workout timers, clock tickers, and score count-ups.

---

## 🎬 Premium Motion & Animation Vocabulary

Aura uses physics-based spring models and custom cubic-beziers. Linear animations are banned.

### 1. Core Physics Easing
- **Ease-out (UI responses)**: `cubic-bezier(0.16, 1, 0.3, 1)` (Ultra-custom ease-out). Starts extremely fast and decays slowly, making clicks and transitions feel instantly responsive.
- **Asymmetric Easing (Entrances)**: `cubic-bezier(0.25, 1, 0.5, 1)`.
- **Spring Parameters (Spring Motion)**:
  - Default Spring: Stiffness: 180, Damping: 25, Mass: 1.0 (Snappy, clean transition).
  - Overshoot Spring (Pop-in): Stiffness: 300, Damping: 18, Mass: 0.8 (Playful, elastic bounce back).

### 2. Interaction Animations
- **Tap Feedback**: A physical-feeling click: `scale: 0.96` on touch down, returning to `scale: 1.0` on release.
- **Stagger Cascade**: Lists of workouts or daily habits are staggered using Framer Motion's orchestrator API, with a 30ms delay between consecutive items.
- **Morphing Card Transition**: Expanding a workout summary card into a detailed logger relies on **Shared Element Layout Animations**. The browser morphs the layout bounds smoothly, maintaining spatial consistency so the user never loses track of their context.
- **Hold-to-Confirm Progress**: Used on irreversible actions (e.g., delete workout, reset streak). The border fills up progressively over 1500ms of user pressing, accompanied by increasing haptic vibration intervals.

---

## ♿ Accessibility (A11y) Requirements

Aura is designed to be fully accessible:
1. **Contrast ratios**: All text colors maintain a minimum contrast ratio of 4.5:1 against their backgrounds (WCAG AA standard).
2. **Keyboard Navigation**: Interactive elements must feature clear `:focus-visible` styles using high-contrast outline rings.
3. **Screen Readers**: Elements are fully annotated with descriptive `aria-label`, `aria-expanded`, and `aria-live="polite"` tags (especially for screen updates like workout timer changes).
4. **Motion Access**: Respects system preferences via `@media (prefers-reduced-motion: reduce)` hooks, automatically scaling back scale/translate animations to simple opacity crossfades.

---

## 🧩 Reusable Primitives Blueprint

### 1. Button
An interactive element supporting haptic tap scales, loader states, and variants (primary, secondary, ghost, destructive).
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  isLoading?: boolean;
  withHaptic?: boolean;
}
```

### 2. Input
A clean, focused input displaying active status glow.
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}
```

### 3. Glass Card
A beautiful backdrop-filtered card overlay with subtle ambient gradients.
```typescript
interface CardProps {
  children: React.ReactNode;
  glowColor?: string;
  onClick?: () => void;
}
```
Uses `backdrop-filter: blur(16px)` and a subtle `1px` border of `rgba(255, 255, 255, 0.08)`.
