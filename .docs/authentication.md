# Authentication

EduNest uses a **cookie + localStorage dual-persistence** strategy with a global 401 fetch interceptor for seamless session management.

---

## Overview

```
Login → Cookie set + localStorage cache → Refresh on mount → Global 401 interceptor
```

The system never exposes raw tokens to the client — session cookies are managed by the browser and sent automatically with `credentials: "include"` on every API call.

---

## Auth Flow

### 1. Login

**Endpoint:** `POST /v1/auth/login`
**Body:** `{ email, password }`
**Response:** `{ data: { user: UserResponse } }`

On success:

1. Store `UserResponse` in React state via `setUser()`
2. Persist user to `localStorage` (key: `"user"`) for SSR rehydration
3. Set `auth_session=1` cookie (flag for middleware — 1 year max-age)
4. Set `user_role=<role>` cookie (used by middleware for route protection)

### 2. Session Validation (Mount)

When the app mounts, `AuthProvider` runs:

1. Read stored user from `localStorage`
2. If found → set as current user immediately (instant rehydration, no flash)
3. Call `POST /v1/auth/refresh` to validate the session with the server
4. If refresh succeeds → update user state + cookies + localStorage
5. If refresh fails → sign out (clear state, cookies, localStorage, redirect to `/login`)

### 3. Global 401 Interceptor

`AuthProvider` patches `window.fetch` to intercept **all** HTTP responses:

```
Any fetch() → response.status === 401?
  ├── No  → return response as-is
  └── Yes → Is this the refresh endpoint itself?
        ├── Yes → return 401 (avoid infinite loop)
        └── No  → Has user session in localStorage?
              ├── No  → return 401
              └── Yes → Call refresh()
                    ├── Success → retry original request
                    └── Failure → return original 401
```

**Deduplication:** If multiple 401s fire simultaneously, only one refresh call is made. All waiting requests share the same refresh promise.

### 4. Logout

**Endpoint:** `POST /v1/auth/logout`

On logout (or refresh failure):

1. Call logout API (best-effort)
2. Clear React state (`setUser(null)`)
3. Clear `localStorage` (`"user"` key)
4. Clear `auth_session` cookie
5. Clear `user_role` cookie
6. Redirect to `/login`

---

## Key Files

| File                            | Purpose                                                          |
| ------------------------------- | ---------------------------------------------------------------- |
| `contexts/auth-context.tsx`     | Defines `AuthContextType` shape                                  |
| `providers/auth-provider.tsx`   | Full implementation: sign-in, sign-out, refresh, 401 interceptor |
| `hooks/use-auth.tsx`            | `useAuth()` hook — consumes `AuthContext`                        |
| `api-calls/auth/login-api.ts`   | `POST /v1/auth/login`                                            |
| `api-calls/auth/logout-api.ts`  | `POST /v1/auth/logout`                                           |
| `api-calls/auth/refresh-api.ts` | `POST /v1/auth/refresh`                                          |
| `api-calls/auth/me-api.ts`      | `GET /v1/auth/me`                                                |

---

## AuthContext Shape

```typescript
type AuthContextType = {
  user: UserResponse | null; // Current authenticated user (or null)
  isLoading: boolean; // True during initial session validation
  signIn: (creds: LoginRequest) => Promise<boolean>;
  signOut: () => Promise<void>;
  refresh: () => Promise<boolean>;
};
```

---

## Cookie Strategy

| Cookie         | Value                               | Purpose                                                   | Max Age |
| -------------- | ----------------------------------- | --------------------------------------------------------- | ------- |
| `auth_session` | `"1"`                               | Flag for Next.js middleware to know user is authenticated | 1 year  |
| `user_role`    | `"admin"` / `"staff"` / `"student"` | Used by middleware for role-based route protection        | 1 year  |

Both are `SameSite=Lax` and path `/`. The actual session is managed server-side — these cookies are lightweight flags.

---

## Middleware Route Protection

The edge middleware (`middleware.ts`) reads these cookies to enforce route access **before** any page renders:

- **No `auth_session`** → redirect to `/login?redirect=<path>`
- **Has session + on `/login`** → redirect to role default route
- **Has session + wrong role for route** → redirect to role default route

See [Role-Based Access](role-based-access.md) for the full route permission table.

---

## Why Dual Persistence?

| Layer              | Purpose                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| **Cookies**        | Available at the edge (middleware) — enables server-side route protection without a round-trip |
| **localStorage**   | Available instantly on client mount — enables rehydration without a loading flash              |
| **Server refresh** | Validates the session is still valid — single source of truth                                  |

The three layers work together: cookies protect routes at the edge, localStorage provides instant UI, and the server refresh ensures correctness.

---

## Related Docs

- [Role-Based Access](role-based-access.md) — Route permissions per role
- [API Layer](api-layer.md) — How API calls are structured
- [Architecture](architecture.md) — Provider hierarchy
