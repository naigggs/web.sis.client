# User Management

The users module lets **admins** manage system accounts — create users, assign roles, toggle status flags, and permanently delete accounts.

**Access:** Admin

---

## Routes

| Route        | Component           | Description               |
| ------------ | ------------------- | ------------------------- |
| `/users`     | `users-section.tsx` | User list with data table |
| `/users/new` | `create-user.tsx`   | Create a new user         |
| `/users/:id` | `user-by-id.tsx`    | User details / edit       |

---

## Features

### Data Table

| Feature       | Details                                           |
| ------------- | ------------------------------------------------- |
| Search        | Filter by name, email, or username                |
| Role Filter   | Server-side `?role=` / `?role[]=` query parameter |
| Pagination    | Cursor-based with page size selector              |
| Bulk Actions  | Multi-select with bulk soft-delete                |
| Quick Actions | Edit, Soft Delete, Hard Delete (per row)          |

### Server-Side Role Filtering

The user list supports filtering by one or more roles:

```
GET /v1/users?role=admin          → admin users only
GET /v1/users?role[]=admin&role[]=staff → admin and staff users
```

This is implemented via a toggle group / filter dropdown in the table header that sends the selected role(s) as query parameters.

### User Roles

| Role      | Description                                |
| --------- | ------------------------------------------ |
| `admin`   | Full system access                         |
| `staff`   | Manage students, courses, subjects, grades |
| `student` | Self-service enrollment, profile, grades   |

### Status Flags

Users have three boolean status flags managed independently:

| Flag          | Purpose                                                 |
| ------------- | ------------------------------------------------------- |
| `isActive`    | Whether the account is active                           |
| `isBlocked`   | Whether the account is blocked (e.g., policy violation) |
| `isSuspended` | Whether the account is temporarily suspended            |

These flags are toggled via the edit page using `PATCH /v1/users/:id`.

### Soft Delete vs Hard Delete

| Action      | Method                      | Effect                                  |
| ----------- | --------------------------- | --------------------------------------- |
| Soft Delete | `DELETE /v1/users/:id`      | Marks user as deleted (recoverable)     |
| Hard Delete | `DELETE /v1/users/:id/hard` | Permanently removes user (irreversible) |

Hard delete triggers a confirmation dialog with a warning about irreversibility.

---

## Create User Form

| Field      | Type     | Validation                               |
| ---------- | -------- | ---------------------------------------- |
| First Name | Text     | Required                                 |
| Last Name  | Text     | Required                                 |
| Email      | Email    | Required, unique                         |
| Username   | Text     | Required, unique                         |
| Password   | Password | Required, minimum length                 |
| Role       | Select   | Required (`admin` / `staff` / `student`) |

---

## API Endpoints

| Hook                | API Call            | Method                      |
| ------------------- | ------------------- | --------------------------- |
| `useGetUsers`       | `getUsersApi`       | `GET /v1/users`             |
| `useGetUserById`    | `getUserByIdApi`    | `GET /v1/users/:id`         |
| `useCreateUser`     | `createUserApi`     | `POST /v1/users`            |
| `usePatchUser`      | `patchUserApi`      | `PATCH /v1/users/:id`       |
| `useSoftDeleteUser` | `softDeleteUserApi` | `DELETE /v1/users/:id`      |
| `useHardDeleteUser` | `hardDeleteUserApi` | `DELETE /v1/users/:id/hard` |

### Query Parameters

```
GET /v1/users?search=<term>&role=<role>&role[]=<role>&page=1&limit=10
```

---

## Key Files

| File                                       | Purpose                 |
| ------------------------------------------ | ----------------------- |
| `components/pages/users/users-section.tsx` | User list data table    |
| `components/pages/users/create-user.tsx`   | Create user form        |
| `components/pages/users/user-by-id.tsx`    | User detail / edit      |
| `hooks/api/user/`                          | User React Query hooks  |
| `hooks/api/user/user-keys.ts`              | Query key factory       |
| `api-calls/user/`                          | User API call functions |
| `data/interface/user.tsx`                  | TypeScript interfaces   |

---

## Related Docs

- [Role-Based Access](../role-based-access.md) — Role definitions & route protection
- [Authentication](../authentication.md) — Login, session, and cookie strategy
- [Data Models](../data-models.md) — `UserResponse`
