# Profile, Settings & Account

These pages provide personal information, appearance preferences, and account management.

---

## Routes

| Route       | Component             | Access    | Description                   |
| ----------- | --------------------- | --------- | ----------------------------- |
| `/profile`  | `profile-section.tsx` | Student   | Personal info, course, grades |
| `/settings` | Settings page         | All roles | Theme / appearance            |
| `/account`  | Account page          | All roles | Email & password change       |

---

## Profile (Student)

**Access:** Student only

**File:** `components/pages/profile/profile-section.tsx`

The profile page gives students a read-only overview of their academic record.

### Sections

| Section       | Content                                                                |
| ------------- | ---------------------------------------------------------------------- |
| Personal Info | Name, email, student number                                            |
| Course        | Enrolled course name and code                                          |
| Grades        | Table of subjects with prelim/midterm/finals, final grade, and remarks |
| Reservations  | Current subject reservations with status badges                        |

### Data Source

Profile data comes from the `/me` endpoints:

| Hook                   | API Call               | Method                             |
| ---------------------- | ---------------------- | ---------------------------------- |
| `useGetMe`             | `getMeApi`             | `GET /v1/auth/me`                  |
| `useGetMeReservations` | `getMeReservationsApi` | `GET /v1/students/me/reservations` |

The `/me` endpoint returns the authenticated user's full profile without needing to pass an ID.

---

## Settings (All Roles)

**Access:** All roles

### Theme Switching

The settings page exposes the application's theme controls powered by `next-themes`:

| Option | Description                     |
| ------ | ------------------------------- |
| Light  | Forces light mode               |
| Dark   | Forces dark mode                |
| System | Follows OS / browser preference |

Theme selection persists across sessions via `localStorage` (handled by `next-themes` automatically).

### Implementation

The `ThemeProvider` from `next-themes` is mounted at the root layout level:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

The `attribute="class"` setting adds/removes a `dark` class on `<html>`, which triggers the `@custom-variant dark (&:is(.dark *))` rule in the CSS design tokens.

---

## Account (All Roles)

**Access:** All roles

The account page lets users update their own credentials:

| Action          | Endpoint              |
| --------------- | --------------------- |
| Change email    | `PATCH /v1/users/:id` |
| Change password | `PATCH /v1/users/:id` |

Both fields use the existing `usePatchUser` hook scoped to the authenticated user's own ID.

### Password Change Flow

1. Enter current password (for verification)
2. Enter new password
3. Confirm new password
4. Submit → `PATCH /v1/users/:id` with password fields
5. Toast notification on success

---

## Key Files

| File                                           | Purpose         |
| ---------------------------------------------- | --------------- |
| `components/pages/profile/profile-section.tsx` | Student profile |
| `app/(app)/profile/page.tsx`                   | Profile route   |
| `app/(app)/settings/page.tsx`                  | Settings route  |
| `app/(app)/account/page.tsx`                   | Account route   |
| `hooks/api/student/me/`                        | Me-scoped hooks |
| `hooks/api/auth/`                              | Auth hooks (me) |

---

## Related Docs

- [Authentication](../authentication.md) — Session & `/me` endpoint
- [Styling](../styling.md) — OKLCH tokens, dark mode
- [Role-Based Access](../role-based-access.md) — Route access per role
