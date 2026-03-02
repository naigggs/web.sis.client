# Styling & Design System

EduNest uses **Tailwind CSS 4** with a comprehensive **OKLCH-based design token system** for perceptually uniform colors, a full light/dark mode setup, and a curated font stack.

---

## Color System

### OKLCH Color Space

All colors are defined in the [OKLCH](https://oklch.com) color space (`oklch(lightness chroma hue)`) for perceptual uniformity — meaning color adjustments look visually consistent across the spectrum.

### Primary Palette

The primary color is a **green-tinted** hue (~160°), giving the app its signature emerald/campus feel:

```css
--primary: oklch(0.42 0.095 160); /* Dark green */
--primary-foreground: oklch(0.985 0.002 160); /* Near-white */
```

### Semantic Tokens

The full token set in `assets/styles/globals.css`:

| Token                                        | Light Mode Purpose                                                             | Dark Mode Adjusts |
| -------------------------------------------- | ------------------------------------------------------------------------------ | ----------------- |
| `--background`                               | Page background                                                                | Darker            |
| `--foreground`                               | Default text color                                                             | Lighter           |
| `--primary` / `--primary-foreground`         | Buttons, links, accents                                                        | Adjusted          |
| `--secondary` / `--secondary-foreground`     | Secondary UI elements                                                          | Adjusted          |
| `--muted` / `--muted-foreground`             | Subtle backgrounds, placeholder text                                           | Adjusted          |
| `--accent` / `--accent-foreground`           | Hover states, highlights                                                       | Adjusted          |
| `--destructive` / `--destructive-foreground` | Delete buttons, error states                                                   | Adjusted          |
| `--card` / `--card-foreground`               | Card surfaces                                                                  | Adjusted          |
| `--popover` / `--popover-foreground`         | Popover/dropdown surfaces                                                      | Adjusted          |
| `--sidebar-*`                                | Full sidebar token set (background, foreground, primary, accent, border, ring) | Adjusted          |
| `--chart-1` through `--chart-5`              | Chart color palette (teal, blue, yellow, purple, coral)                        | Adjusted          |

### Extended Tokens

| Token       | Purpose                       |
| ----------- | ----------------------------- |
| `--success` | Success states (green)        |
| `--warning` | Warning states (yellow/amber) |
| `--info`    | Informational states (blue)   |
| `--border`  | Default border color          |
| `--input`   | Form input borders            |
| `--ring`    | Focus ring color              |

---

## Theme System

### Provider

Theming is powered by `next-themes` with the following configuration in `app/layout.tsx`:

```tsx
<ThemeProvider
  attribute="class"      // Adds "dark" class to <html>
  defaultTheme="system"  // Follows OS preference by default
  enableSystem            // Enables system theme detection
  disableTransitionOnChange  // No transition flash on theme switch
>
```

### Dark Mode

Dark mode tokens are defined inside a `@custom-variant dark` block in `globals.css`. Every semantic token has a dark-mode counterpart:

```css
@custom-variant dark (&:is(.dark *));

/* Example */
:root {
  --background: oklch(1 0 0); /* white */
}
@layer base {
  .dark {
    --background: oklch(0.145 0.014 160); /* near-black with green tint */
  }
}
```

### User Controls

The Settings page (`/settings`) offers three theme options:

| Option | Behavior                      |
| ------ | ----------------------------- |
| Light  | Forces light mode             |
| Dark   | Forces dark mode              |
| System | Follows OS/browser preference |

---

## Border Radius System

A computed radius scale based on a single `--radius` token:

```css
--radius: 0.5rem;
```

| Variable       | Value                        | Usage            |
| -------------- | ---------------------------- | ---------------- |
| `--radius-sm`  | `calc(var(--radius) - 4px)`  | Small elements   |
| `--radius-md`  | `calc(var(--radius) - 2px)`  | Medium elements  |
| `--radius-lg`  | `var(--radius)`              | Cards, dialogs   |
| `--radius-xl`  | `calc(var(--radius) + 4px)`  | Large containers |
| `--radius-2xl` | `calc(var(--radius) + 8px)`  | Hero sections    |
| `--radius-3xl` | `calc(var(--radius) + 12px)` | Command palette  |
| `--radius-4xl` | `calc(var(--radius) + 16px)` | Special surfaces |

---

## Font Stack

Defined in `lib/fonts.ts` and loaded via `next/font/google`:

| Font                                                                     | CSS Variable               | Role                               |
| ------------------------------------------------------------------------ | -------------------------- | ---------------------------------- |
| [Inter](https://rsms.me/inter/)                                          | `--font-sans`              | Primary sans-serif (body text, UI) |
| [Geist Sans](https://vercel.com/font)                                    | `--font-geist-sans`        | Secondary sans-serif               |
| [Geist Mono](https://vercel.com/font)                                    | `--font-geist-mono`        | Monospace (code, technical)        |
| [Libre Baskerville](https://fonts.google.com/specimen/Libre+Baskerville) | `--font-libre-baskerville` | Serif accent (taglines, headings)  |

### Loading Strategy

Fonts are loaded at the root layout level and applied via CSS variables on `<html>` and `<body>`:

```tsx
// app/layout.tsx
<html lang="en" className={inter.variable}>
  <body className={`${geistSans.variable} ${geistMono.variable} ${libreBaskerville.variable} antialiased`}>
```

---

## Tailwind CSS 4 Integration

### Theme Directive

Tokens are injected into Tailwind via the `@theme inline` directive in `globals.css`:

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... all tokens ... */
  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  /* ... etc ... */
}
```

This makes all tokens available as Tailwind utilities:

```html
<div class="bg-primary text-primary-foreground rounded-lg border-border"></div>
```

### PostCSS

The build uses `@tailwindcss/postcss` (Tailwind CSS 4 plugin) configured in `postcss.config.mjs`.

### Animations

`tw-animate-css` provides animation utilities (fade, slide, scale) used by dialog/sheet/dropdown transitions.

---

## Utility Function

**File:** `lib/utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

The `cn()` function is used throughout all components to safely merge Tailwind classes — it resolves conflicts (e.g., `bg-red-500` + `bg-blue-500` → last one wins) and handles conditional classes.

---

## Related Docs

- [UI Components](ui-components.md) — Components using these tokens
- [Architecture](architecture.md) — Layout and provider structure
