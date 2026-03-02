# Architecture

An overview of how the EduNest SIS client is structured, from route groups down to component tiers.

---

## App Router Layout Chain

Next.js 16 App Router uses **nested layouts**. EduNest has three layers:

```
app/layout.tsx                  ← Root layout (global)
├── app/(auth)/layout.tsx       ← Public layout (login)
└── app/(app)/layout.tsx        ← Protected layout (dashboard, students, etc.)
```

### Root Layout — `app/layout.tsx`

The outermost shell wraps the entire application:

1. **`ThemeProvider`** — `next-themes` with `attribute="class"`, `defaultTheme="system"`, `enableSystem`
2. **`AuthProvider`** — Global authentication context (user state, sign-in/out, refresh, 401 interceptor)
3. **`Toaster`** — Sonner toast notifications (rendered outside providers so toasts work everywhere)

**Fonts loaded:** Inter (primary `--font-sans`), Geist Sans, Geist Mono, Libre Baskerville (serif accent).

### Auth Layout — `app/(auth)/layout.tsx`

Used only by `/login`. A split-panel design:

- **Left panel** (hidden on mobile): Branded green surface with EduNest logo, tagline, and decorative gradient blurs
- **Right panel**: Login form content

### App Layout — `app/(app)/layout.tsx`

All authenticated pages share this layout:

1. **`ReactQueryProvider`** — TanStack Query client (60 s stale time, `refetchOnWindowFocus: false`)
2. **`SidebarProvider`** — Manages sidebar open/collapsed state, persisted to cookie
3. **`SiteHeader`** — Top header bar with breadcrumbs, command palette trigger, theme toggle, user avatar dropdown
4. **`AppSidebar`** — Role-filtered navigation sidebar
5. **`SidebarInset`** — Main content area

---

## Provider Hierarchy

```
ThemeProvider
└── AuthProvider
    └── ReactQueryProvider        ← only in (app) routes
        └── SidebarProvider
            └── Page content
```

**Why this order?**

- Theme must wrap everything for dark mode class on `<html>`.
- Auth must be available globally (including the login page).
- React Query is only needed in authenticated routes — it wraps the `(app)` group only.
- Sidebar state depends on the authenticated layout.

---

## Route Groups

### `(auth)` — Public Routes

| Route    | Page                        | Description                 |
| -------- | --------------------------- | --------------------------- |
| `/login` | `app/(auth)/login/page.tsx` | Email + password login form |

### `(app)` — Protected Routes

| Route                     | Page                                        | Role                    |
| ------------------------- | ------------------------------------------- | ----------------------- |
| `/dashboard`              | `app/(app)/dashboard/page.tsx`              | Admin (default landing) |
| `/students`               | `app/(app)/students/page.tsx`               | Admin                   |
| `/students/create`        | `app/(app)/students/create/page.tsx`        | Admin                   |
| `/students/[id]`          | `app/(app)/students/[id]/page.tsx`          | Admin                   |
| `/students/[id]/edit`     | `app/(app)/students/[id]/edit/page.tsx`     | Admin                   |
| `/courses`                | `app/(app)/courses/page.tsx`                | Admin                   |
| `/courses/create`         | `app/(app)/courses/create/page.tsx`         | Admin                   |
| `/courses/[id]`           | `app/(app)/courses/[id]/page.tsx`           | Admin                   |
| `/courses/[id]/edit`      | `app/(app)/courses/[id]/edit/page.tsx`      | Admin                   |
| `/subjects`               | `app/(app)/subjects/page.tsx`               | Admin                   |
| `/subjects/create`        | `app/(app)/subjects/create/page.tsx`        | Admin                   |
| `/subjects/[id]`          | `app/(app)/subjects/[id]/page.tsx`          | Admin                   |
| `/subjects/[id]/edit`     | `app/(app)/subjects/[id]/edit/page.tsx`     | Admin                   |
| `/subjects/prerequisites` | `app/(app)/subjects/prerequisites/page.tsx` | Admin                   |
| `/grades`                 | `app/(app)/grades/page.tsx`                 | Admin, Staff            |
| `/reservations`           | `app/(app)/reservations/page.tsx`           | Admin                   |
| `/users`                  | `app/(app)/users/page.tsx`                  | Admin                   |
| `/enrollment`             | `app/(app)/enrollment/page.tsx`             | Student                 |
| `/profile`                | `app/(app)/profile/page.tsx`                | Student                 |
| `/settings`               | `app/(app)/settings/page.tsx`               | All                     |
| `/account`                | `app/(app)/account/page.tsx`                | All                     |

---

## Thin Page Pattern

Route `page.tsx` files are intentionally minimal. They delegate all logic and rendering to **rich section components** in `components/pages/`:

```tsx
// app/(app)/students/page.tsx — typical example
import { StudentsSection } from "@/components/pages/students/students-section";

export default function StudentsPage() {
  return <StudentsSection />;
}
```

This keeps route files as thin wrappers and consolidates all feature logic (data fetching, state, UI) in one place per feature.

---

## Component Tiers

### 1. `components/ui/` — Atomic UI Library

48+ shadcn/ui-based component families. Barrel-exported via `components/ui/index.ts` (300+ named exports). These are generic, reusable building blocks:

- **Layout:** Sidebar, Sheet, Drawer, Dialog, Collapsible, Accordion, ScrollArea
- **Forms:** Input, InputGroup, Textarea, Select, Combobox, Checkbox, Switch, Calendar, Field
- **Data Display:** Table, Card, Badge, Avatar, Progress, Skeleton, Tooltip, Empty
- **Navigation:** Breadcrumb, NavigationMenu, DropdownMenu, Command/CommandDialog
- **Feedback:** AlertDialog, Alert, Toaster, Spinner

### 2. `components/shared/` — Cross-Cutting Components

Reusable across multiple features but more opinionated than atomic UI:

| Component       | Purpose                                       |
| --------------- | --------------------------------------------- |
| `PageHeader`    | Title + description + optional action buttons |
| `ConfirmDialog` | Reusable confirm/cancel dialog                |
| `EmptyState`    | Empty data placeholder with icon              |
| `StatCard`      | Dashboard statistic card                      |
| `StatusBadge`   | Color-coded status indicator                  |

### 3. `components/pages/` — Feature Components

One folder per feature (e.g., `students/`, `courses/`, `grades/`). Contains the main "section" component plus sub-components:

```
components/pages/students/
├── students-section.tsx       ← main list/table view
├── student-profile.tsx        ← detail/profile view
├── _form/                     ← create/edit form components
└── _profile/                  ← profile sub-components
```

### 4. `components/layouts/` — Structural Layout

- `sidebar/app-sidebar.tsx` — Role-filtered navigation sidebar
- `sidebar/site-header.tsx` — Top header with breadcrumbs, command palette, user menu

---

## Key Directories

| Directory         | Purpose                                                     |
| ----------------- | ----------------------------------------------------------- |
| `api-calls/`      | Thin `fetch()` wrappers — one file per API endpoint         |
| `hooks/api/`      | React Query hooks — one per query/mutation                  |
| `data/interface/` | TypeScript interfaces for all entities and API shapes       |
| `data/sidebar/`   | Navigation items with role tags                             |
| `contexts/`       | React Context definitions (`AuthContext`, `SidebarContext`) |
| `providers/`      | Context Provider implementations                            |
| `config/`         | Environment-aware configuration (API URLs)                  |
| `lib/`            | Utilities (`cn`, fonts, metadata, sidebar constants)        |
| `assets/styles/`  | `globals.css` — Tailwind CSS 4 + OKLCH design tokens        |

---

## Related Docs

- [Getting Started](getting-started.md) — Setup and running the project
- [Authentication](authentication.md) — Auth flow and middleware
- [State Management](state-management.md) — React Query patterns
- [UI Components](ui-components.md) — Component library details
- [Styling & Design System](styling.md) — Tokens, colors, fonts
