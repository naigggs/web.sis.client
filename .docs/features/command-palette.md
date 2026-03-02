# Command Palette

The command palette provides keyboard-driven navigation and entity search across the application, inspired by VS Code's `⌘K` / `Ctrl+K` pattern.

**Access:** All roles (data scoped per role)

---

## Activation

| Platform        | Shortcut |
| --------------- | -------- |
| macOS           | `⌘ K`    |
| Windows / Linux | `Ctrl K` |

Platform detection is done inline at render time:

```typescript
const isMac = navigator.userAgent.includes("Mac");
```

The shortcut hint is displayed in the site header next to the search trigger.

---

## Architecture

### Component Stack

```
SiteHeader
  └─ CommandDialog (cmdk + Dialog)
       ├─ CommandInput (search field)
       └─ CommandList
            ├─ CommandGroup "Navigation"
            ├─ CommandGroup "Students" (admin only)
            ├─ CommandGroup "Courses" (admin/staff)
            ├─ CommandGroup "Subjects" (admin/staff)
            ├─ CommandGroup "Users" (admin only)
            ├─ CommandGroup "Shortcuts"
            └─ CommandGroup "Sub-pages"
```

### Key Files

| File                                         | Purpose                             |
| -------------------------------------------- | ----------------------------------- |
| `components/layouts/sidebar/site-header.tsx` | Header with command palette trigger |
| `components/ui/command/command-dialog.tsx`   | Command dialog implementation       |
| `components/ui/command/`                     | cmdk wrapper components             |

---

## Data Groups

### Navigation

Static navigation items available to all roles. Clicking an item navigates via `router.push()`.

Items: Dashboard, Students, Courses, Subjects, Grades, Users, Enrollment, Reservations, Profile, Settings, Account

### Live Entity Search

Entity groups are powered by **React Query** hooks fetching real data:

| Group    | Hook             | Roles        | Display                       |
| -------- | ---------------- | ------------ | ----------------------------- |
| Students | `useGetStudents` | Admin        | Student name + student number |
| Courses  | `useGetCourses`  | Admin, Staff | Course code + name            |
| Subjects | `useGetSubjects` | Admin, Staff | Subject code + name           |
| Users    | `useGetUsers`    | Admin        | Username + email              |

Each group fires its query only if the user's role grants access — preventing unnecessary API calls for restricted entities.

### Shortcuts

Quick-action commands:

| Command     | Action                      |
| ----------- | --------------------------- |
| New Student | Navigate to `/students/new` |
| New Course  | Navigate to `/courses/new`  |
| New Subject | Navigate to `/subjects/new` |
| New User    | Navigate to `/users/new`    |

### Sub-pages

Deeply-linked pages:

| Command         | Action                  |
| --------------- | ----------------------- |
| Import Students | Navigate to import flow |
| Export Students | Navigate to export flow |

---

## Search Behaviour

- The `CommandInput` field filters **all groups simultaneously** using `cmdk`'s built-in fuzzy matching
- Empty search shows all navigation items and populated entity groups
- As the user types, results narrow down across all groups
- Selecting an item navigates to the relevant page and closes the dialog

---

## Role Scoping

The palette respects the user's role from `AuthContext`:

| Role    | Visible Groups                                                       |
| ------- | -------------------------------------------------------------------- |
| Admin   | Navigation, Students, Courses, Subjects, Users, Shortcuts, Sub-pages |
| Staff   | Navigation, Courses, Subjects, Shortcuts (subset)                    |
| Student | Navigation                                                           |

This ensures students never see admin-level data or shortcuts in the search results.

---

## Keyboard Interaction

| Key             | Action                  |
| --------------- | ----------------------- |
| `⌘K` / `Ctrl+K` | Open palette            |
| `↑` / `↓`       | Navigate results        |
| `Enter`         | Select highlighted item |
| `Escape`        | Close palette           |
| Type            | Filter results          |

---

## Implementation Details

### cmdk Integration

The command palette uses the [`cmdk`](https://cmdk.paco.me/) library, wrapped with shadcn/ui's `Command` component family:

- `Command` — Root container
- `CommandDialog` — Dialog wrapper (uses Radix `Dialog`)
- `CommandInput` — Search input with icon
- `CommandList` — Scrollable result list
- `CommandEmpty` — "No results found" state
- `CommandGroup` — Labelled section
- `CommandItem` — Selectable row

### Global Keyboard Listener

The shortcut is registered via a `useEffect` keydown listener in the `SiteHeader`:

```typescript
useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((open) => !open);
    }
  };
  document.addEventListener("keydown", down);
  return () => document.removeEventListener("keydown", down);
}, []);
```

---

## Related Docs

- [UI Components](../ui-components.md) — Command component family
- [Role-Based Access](../role-based-access.md) — Role-scoped data
- [State Management](../state-management.md) — React Query hooks powering live search
- [Architecture](../architecture.md) — SiteHeader placement in layout chain
