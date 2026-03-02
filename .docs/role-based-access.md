# Role-Based Access Control

EduNest enforces role-based access at **three layers**: edge middleware, sidebar navigation, and command palette data scoping.

---

## Roles

| Role      | Description                                                                           |
| --------- | ------------------------------------------------------------------------------------- |
| `admin`   | Full system access — manages students, courses, subjects, users, reservations, grades |
| `staff`   | Grading access only — can enter and edit grades via the digital grading sheet         |
| `student` | Self-service only — enrollment (reserve/cancel subjects) and profile viewing          |

---

## Route Protection (Middleware)

The Next.js edge middleware (`middleware.ts`) reads the `user_role` cookie and enforces access before any page renders.

### Allowed Routes per Role

| Role      | Allowed Route Prefixes          | Default Landing |
| --------- | ------------------------------- | --------------- |
| `admin`   | **All routes** (no restriction) | `/dashboard`    |
| `staff`   | `/grades`                       | `/grades`       |
| `student` | `/enrollment`, `/profile`       | `/enrollment`   |

> **Note:** `/settings` and `/account` are accessible to all authenticated users — they are not restricted by the prefix rules because they don't match any blocked prefix.

### Redirect Rules

| Condition                         | Action                                        |
| --------------------------------- | --------------------------------------------- |
| Unauthenticated → protected route | Redirect to `/login?redirect=<original-path>` |
| Authenticated → `/login`          | Redirect to role default route                |
| Root `/` (authenticated)          | Redirect to role default route                |
| Root `/` (unauthenticated)        | Redirect to `/login`                          |
| Role accessing disallowed route   | Redirect to role default route                |

---

## Sidebar Navigation Filtering

The sidebar navigation data (`data/sidebar/data.tsx`) tags each item with a `roles` array:

```typescript
interface NavMainItem {
  title: string;
  url: string;
  icon: ComponentType;
  roles: NavRole[]; // e.g., ["admin"], ["admin", "staff"], ["student"]
  group: "overview" | "academic" | "management" | "personal";
  items?: NavSubItem[];
}
```

### Navigation Items by Role

| Group          | Item          | Admin | Staff | Student |
| -------------- | ------------- | ----- | ----- | ------- |
| **Overview**   | Dashboard     | ✅    |       |         |
| **Academic**   | Students      | ✅    |       |         |
| **Academic**   | Courses       | ✅    |       |         |
| **Academic**   | Subjects      | ✅    |       |         |
| **Academic**   | Grading Sheet | ✅    | ✅    |         |
| **Management** | Reservations  | ✅    |       |         |
| **Management** | Users         | ✅    |       |         |
| **Personal**   | My Enrollment |       |       | ✅      |
| **Personal**   | My Profile    |       |       | ✅      |

The `AppSidebar` component filters `data.navMain` based on the authenticated user's role, so users only see navigation items they can access.

### Grouped Navigation

Sidebar items are organized into collapsible groups by their `group` property:

- **Overview** — Dashboard
- **Academic** — Students, Courses, Subjects, Grading Sheet
- **Management** — Reservations, Users
- **Personal** — My Enrollment, My Profile

---

## Command Palette Data Scoping

The global command palette (`⌘K` / `Ctrl+K`) indexes data according to the user's role. The `SiteHeader` component uses React Query to fetch entity data, scoped by role:

### Admin Palette

| Data Source | Query                        | Display                                     |
| ----------- | ---------------------------- | ------------------------------------------- |
| Students    | `GET /v1/students?limit=200` | Student name → `/students/:id`              |
| Courses     | `GET /v1/courses?limit=200`  | Course name + code → `/courses/:id`         |
| Subjects    | `GET /v1/subjects?limit=200` | Subject title + code → `/subjects/:id/edit` |
| Users       | `GET /v1/users?limit=200`    | User email + role → `/users`                |

### Staff Palette

| Data Source | Query                        | Display              |
| ----------- | ---------------------------- | -------------------- |
| Courses     | `GET /v1/courses?limit=200`  | Course name + code   |
| Subjects    | `GET /v1/subjects?limit=200` | Subject title + code |

### Student Palette

| Data Source       | Query                                   | Display            |
| ----------------- | --------------------------------------- | ------------------ |
| My Profile        | `GET /v1/students/me`                   | Student info       |
| My Reservations   | `GET /v1/students/me/reservations`      | Reserved subjects  |
| Eligible Subjects | `GET /v1/students/me/eligible-subjects` | Available subjects |

### Common Palette Items (All Roles)

- **Navigation** — Links to all accessible pages (filtered by role)
- **Shortcuts** — Account Settings, App Settings, Toggle Theme

---

## Implementation Details

### Middleware (`middleware.ts`)

```typescript
const ROLE_ALLOWED_PREFIXES: Record<string, string[]> = {
  student: ["/enrollment", "/profile"],
  staff: ["/grades"],
  admin: [], // empty = all routes allowed
};

const ROLE_DEFAULT_ROUTE: Record<string, string> = {
  student: "/enrollment",
  staff: "/grades",
  admin: "/dashboard",
};
```

The middleware matcher excludes static assets, images, and public files from route checking.

### Client-Side Filtering

The `AppSidebar` reads the current user's role from `useAuth()` and filters navigation items:

```typescript
const filtered = data.navMain.filter((item) => item.roles.includes(user.role));
```

---

## Related Docs

- [Authentication](authentication.md) — Login flow and session management
- [Command Palette](features/command-palette.md) — Full command palette documentation
- [Architecture](architecture.md) — Layout and provider structure
