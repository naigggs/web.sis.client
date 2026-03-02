# Dashboard

The dashboard is the default landing page for **admin** users. Each role sees a different dashboard experience.

---

## Admin Dashboard

**Route:** `/dashboard`
**Component:** `components/pages/dashboard/admin-dashboard.tsx`

### Stat Cards

The admin dashboard shows four key system metrics as `StatCard` components:

| Metric         | Source                     | How                                              |
| -------------- | -------------------------- | ------------------------------------------------ |
| Total Students | `GET /v1/students?limit=1` | Uses `pagination.total` (no data payload needed) |
| Total Courses  | `GET /v1/courses?limit=1`  | Uses `pagination.total`                          |
| Total Subjects | `GET /v1/subjects?limit=1` | Uses `pagination.total`                          |
| Total Users    | `GET /v1/users?limit=1`    | Uses `pagination.total`                          |

> **Optimization:** By requesting `limit=1`, the API returns only the `pagination` object with the total count — avoiding loading full entity lists.

### Quick Actions

Action buttons for common admin tasks:

- Add Student → `/students/create`
- Add Course → `/courses/create`
- Add Subject → `/subjects/create`

### Recent Students

A small table showing the most recently created students, linking to their profiles.

---

## Staff Dashboard

**Component:** `components/pages/dashboard/staff-dashboard.tsx`

Staff users land on `/grades` by default (their only allowed route), but the dashboard component provides a grading-focused overview when accessed.

---

## Student Dashboard

**Component:** `components/pages/dashboard/student-dashboard.tsx`

Student users land on `/enrollment` by default. The student dashboard shows an enrollment overview when accessed.

---

## Key Files

| File                                               | Purpose                          |
| -------------------------------------------------- | -------------------------------- |
| `app/(app)/dashboard/page.tsx`                     | Route page (thin wrapper)        |
| `components/pages/dashboard/admin-dashboard.tsx`   | Admin dashboard implementation   |
| `components/pages/dashboard/staff-dashboard.tsx`   | Staff dashboard implementation   |
| `components/pages/dashboard/student-dashboard.tsx` | Student dashboard implementation |
| `components/shared/stat-card.tsx`                  | Reusable stat card component     |

---

## Related Docs

- [Role-Based Access](../role-based-access.md) — Dashboard access per role
- [Students](students.md) — Student management (linked from dashboard)
