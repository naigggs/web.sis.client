# UI Components

EduNest ships with a comprehensive, shadcn/ui-based component library. All atomic components live in `components/ui/`, cross-cutting components in `components/shared/`, and feature-specific components in `components/pages/`.

---

## Overview

- **48+ component families** in `components/ui/`
- **300+ named exports** barrel-exported via `components/ui/index.ts`
- Based on [Radix UI](https://www.radix-ui.com) primitives + [Tailwind CSS 4](https://tailwindcss.com)
- Styled with [class-variance-authority](https://cva.style) (CVA) for variant management
- Utility classes composed via `cn()` (`clsx` + `tailwind-merge`)

---

## Component Families

### Layout

| Component   | Directory       | Description                                                                                                                  |
| ----------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Sidebar     | `sidebar/`      | Full sidebar system: Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarFooter, SidebarInset, etc. |
| Sheet       | `sheet/`        | Slide-out panel (mobile-friendly drawer)                                                                                     |
| Drawer      | `drawer/`       | Bottom drawer (vaul-based)                                                                                                   |
| Dialog      | `dialog/`       | Modal dialog (Radix Dialog)                                                                                                  |
| Collapsible | `collapsible/`  | Collapsible/expandable section                                                                                               |
| Accordion   | `accordion/`    | Accordion panels                                                                                                             |
| ScrollArea  | `scroll-area/`  | Custom scrollbar container                                                                                                   |
| Separator   | `separator/`    | Horizontal/vertical separator line                                                                                           |
| AspectRatio | `aspect-ratio/` | Maintains aspect ratio for children                                                                                          |

### Forms

| Component   | Directory       | Description                                                      |
| ----------- | --------------- | ---------------------------------------------------------------- |
| Input       | `input/`        | Text input                                                       |
| InputGroup  | `input-group/`  | Input with prefix/suffix elements (icons, buttons)               |
| Textarea    | `textarea/`     | Multi-line text input                                            |
| Select      | `select/`       | Dropdown select (Radix Select)                                   |
| Combobox    | `combobox/`     | Searchable select with chips (multi-select support)              |
| Checkbox    | `checkbox/`     | Checkbox input                                                   |
| Switch      | `switch/`       | Toggle switch                                                    |
| Slider      | `slider/`       | Range slider                                                     |
| Toggle      | `toggle/`       | Toggle button                                                    |
| ToggleGroup | `toggle-group/` | Group of toggle buttons                                          |
| Calendar    | `calendar/`     | Date picker calendar (react-day-picker)                          |
| InputOTP    | `input-otp/`    | OTP/PIN code input                                               |
| Field       | `field/`        | Form field wrapper with FieldLabel, FieldError, FieldDescription |
| Label       | `label/`        | Form label                                                       |

### Data Display

| Component | Directory     | Description                                                   |
| --------- | ------------- | ------------------------------------------------------------- |
| Table     | `table/`      | Data table with header, body, row, cell, caption, footer      |
| Card      | `card/`       | Content card with header, title, description, content, footer |
| Badge     | `badge/`      | Status/tag badge with variants                                |
| Avatar    | `avatar/`     | User avatar with image fallback + AvatarGroup                 |
| Progress  | `progress/`   | Progress bar                                                  |
| Skeleton  | `skeleton/`   | Loading placeholder                                           |
| Tooltip   | `tooltip/`    | Hover tooltip                                                 |
| HoverCard | `hover-card/` | Rich hover preview card                                       |
| Empty     | `empty/`      | Empty state illustration                                      |

### Navigation

| Component      | Directory          | Description                                                             |
| -------------- | ------------------ | ----------------------------------------------------------------------- |
| Breadcrumb     | `breadcrumb/`      | Breadcrumb trail (BreadcrumbList, BreadcrumbItem, BreadcrumbLink, etc.) |
| NavigationMenu | `navigation-menu/` | Full navigation menu system                                             |
| DropdownMenu   | `dropdown-menu/`   | Context dropdown (Radix DropdownMenu)                                   |
| ContextMenu    | `context-menu/`    | Right-click context menu                                                |
| Command        | `command/`         | Command palette primitive (cmdk) + CommandDialog                        |

### Feedback

| Component   | Directory       | Description                      |
| ----------- | --------------- | -------------------------------- |
| AlertDialog | `alert-dialog/` | Confirmation dialog with actions |
| Alert       | `alert/`        | Inline alert banner              |
| Toaster     | `toaster/`      | Toast notifications (Sonner)     |
| Spinner     | `spinner/`      | Loading spinner                  |

### Typography & Animation

| Component   | Directory       | Description                                              |
| ----------- | --------------- | -------------------------------------------------------- |
| Text        | `text/`         | TextAurora, TextAnimatedGradient — animated text effects |
| Animated    | `animated/`     | AnimatedThemeToggler — animated light/dark icon          |
| Kbd         | `kbd/`          | Keyboard shortcut badge                                  |
| ButtonGroup | `button-group/` | Grouped action buttons                                   |

### Core

| Component | Directory      | Description                                      |
| --------- | -------------- | ------------------------------------------------ |
| Button    | `button/`      | Primary button with size/variant support via CVA |
| Variants  | `variants.tsx` | Shared CVA variant definitions                   |

---

## Shared Components

**Directory:** `components/shared/`

These components are more opinionated than atomic UI but reusable across features:

| Component       | File                 | Description                                                   |
| --------------- | -------------------- | ------------------------------------------------------------- |
| `PageHeader`    | `page-header.tsx`    | Page title + description + optional action button slot        |
| `ConfirmDialog` | `confirm-dialog.tsx` | Reusable confirmation dialog (uses AlertDialog underneath)    |
| `EmptyState`    | `empty-state.tsx`    | Empty data placeholder with customizable icon and message     |
| `StatCard`      | `stat-card.tsx`      | Dashboard statistic card with label, value, and optional icon |
| `StatusBadge`   | `status-badge.tsx`   | Color-coded badge for reservation/grade statuses              |

---

## Barrel Export

All UI components are re-exported from `components/ui/index.ts`:

```typescript
// Usage anywhere in the app
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Dialog,
  DialogContent,
  DialogHeader,
  Input,
  Badge,
  Toaster,
  // ... 300+ exports
} from "@/components/ui";
```

This single import path keeps feature components clean and avoids deep import chains.

---

## Customization

All components use:

- **OKLCH design tokens** from `globals.css` (see [Styling](styling.md))
- **CVA** (`class-variance-authority`) for variant management — sizes, colors, states
- **`cn()`** utility for merging Tailwind classes safely (resolves conflicts)
- **Tailwind CSS 4** with `@theme inline` directive for clean token integration

Components are designed to be customized via:

1. `className` prop (merged with defaults via `cn()`)
2. CVA variants (e.g., `<Button variant="destructive" size="sm">`)
3. Composition (slot-based — e.g., `Card` + `CardHeader` + `CardContent`)

---

## Related Docs

- [Styling & Design System](styling.md) — OKLCH tokens, theme, fonts
- [Architecture](architecture.md) — Component tier overview
