# State Management

EduNest uses **TanStack React Query v5** as the primary data-fetching and caching layer, supplemented by **React Context** for global client state (auth, sidebar).

---

## React Query Setup

**File:** `providers/react-query-provider.tsx`

```typescript
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 60 seconds before data is considered stale
      refetchOnWindowFocus: false, // Don't refetch when tab regains focus
    },
  },
});
```

The `ReactQueryProvider` wraps only the `(app)` route group — React Query is not loaded on login or other public pages.

---

## Query Key Factories

Each entity has a **key factory** file (`hooks/api/<entity>/<entity>-keys.ts`) that produces structured query keys. This pattern enables precise cache invalidation.

### Factory Pattern

```typescript
// hooks/api/student/student-keys.ts (typical structure)
export const studentKeys = {
  all: ["students"] as const,
  lists: () => [...studentKeys.all, "list"] as const,
  list: (params) => [...studentKeys.lists(), params] as const,
  details: () => [...studentKeys.all, "detail"] as const,
  detail: (id) => [...studentKeys.details(), id] as const,
  // Nested resources
  eligibleSubjects: (id) =>
    [...studentKeys.detail(id), "eligible-subjects"] as const,
};
```

### All Key Factories

| Entity     | File                                      | Key Prefix       |
| ---------- | ----------------------------------------- | ---------------- |
| Course     | `hooks/api/course/course-keys.ts`         | `["courses"]`    |
| Student    | `hooks/api/student/student-keys.ts`       | `["students"]`   |
| Subject    | `hooks/api/subject/subject-keys.ts`       | `["subjects"]`   |
| Grade      | `hooks/api/grade/grade-keys.ts`           | `["grades"]`     |
| User       | `hooks/api/user/user-keys.ts`             | `["users"]`      |
| Me Student | `hooks/api/student/me/me-student-keys.ts` | `["me-student"]` |

---

## Custom Hooks

All 42+ hooks live in `hooks/api/`. Each wraps a single API call with `useQuery` (reads) or `useMutation` (writes).

### Query Hooks (reads)

| Hook                       | Returns                                | Key                                |
| -------------------------- | -------------------------------------- | ---------------------------------- |
| **Auth**                   |                                        |                                    |
| `useGetMe`                 | Current user                           | `["auth", "me"]`                   |
| **Courses**                |                                        |                                    |
| `useGetCourses`            | Paginated course list                  | `courseKeys.list(params)`          |
| `useGetCourseById`         | Single course with subjects            | `courseKeys.detail(id)`            |
| **Students**               |                                        |                                    |
| `useGetStudents`           | Paginated student list                 | `studentKeys.list(params)`         |
| `useGetStudentById`        | Single student (full profile)          | `studentKeys.detail(id)`           |
| `useGetEligibleSubjects`   | Eligible subjects for student          | `studentKeys.eligibleSubjects(id)` |
| **Subjects**               |                                        |                                    |
| `useGetSubjects`           | Paginated subject list                 | `subjectKeys.list(params)`         |
| `useGetSubjectById`        | Single subject                         | `subjectKeys.detail(id)`           |
| `useGetPrerequisites`      | Subject's prerequisites                | `subjectKeys.prerequisites(id)`    |
| `useGetEnrolledStudents`   | Students enrolled in subject           | `subjectKeys.enrolledStudents(id)` |
| **Grades**                 |                                        |                                    |
| `useGetGrades`             | Filtered grade list                    | `gradeKeys.list(params)`           |
| **Users**                  |                                        |                                    |
| `useGetUsers`              | Paginated user list (with role filter) | `userKeys.list(params)`            |
| `useGetUserById`           | Single user                            | `userKeys.detail(id)`              |
| **Student Me**             |                                        |                                    |
| `useGetMeStudent`          | Own student profile                    | `meStudentKeys.profile()`          |
| `useGetMeEligibleSubjects` | Own eligible subjects                  | `meStudentKeys.eligibleSubjects()` |
| `useGetMeReservations`     | Own reservations                       | `meStudentKeys.reservations()`     |

### Mutation Hooks (writes)

| Hook                     | Action                    | Invalidates                                                        |
| ------------------------ | ------------------------- | ------------------------------------------------------------------ |
| **Courses**              |                           |                                                                    |
| `useCreateCourse`        | Create course             | `courseKeys.lists()`                                               |
| `usePatchCourse`         | Update course             | `courseKeys.lists()`, `courseKeys.detail(id)`                      |
| `useBulkDeleteCourses`   | Delete multiple courses   | `courseKeys.lists()`                                               |
| `useAddSubjectsToCourse` | Add subjects to course    | `courseKeys.detail(id)`                                            |
| **Students**             |                           |                                                                    |
| `useCreateStudent`       | Create student            | `studentKeys.lists()`                                              |
| `usePatchStudent`        | Update student            | `studentKeys.lists()`, `studentKeys.detail(id)`                    |
| `useBulkDeleteStudents`  | Delete multiple students  | `studentKeys.lists()`                                              |
| `useImportStudents`      | CSV import                | `studentKeys.lists()`                                              |
| `useExportStudents`      | Download export           | _(no invalidation — blob download)_                                |
| **Subjects**             |                           |                                                                    |
| `useCreateSubject`       | Create subject            | `subjectKeys.lists()`                                              |
| `usePatchSubject`        | Update subject            | `subjectKeys.lists()`, `subjectKeys.detail(id)`                    |
| `useBulkDeleteSubjects`  | Delete multiple subjects  | `subjectKeys.lists()`                                              |
| `useAddPrerequisite`     | Add prerequisite link     | `subjectKeys.prerequisites(id)`                                    |
| `useRemovePrerequisite`  | Remove prerequisite link  | `subjectKeys.prerequisites(id)`                                    |
| **Grades**               |                           |                                                                    |
| `useCreateGrade`         | Create/upsert grade       | `gradeKeys.lists()`                                                |
| `usePatchGrade`          | Update grade              | `gradeKeys.lists()`                                                |
| **Users**                |                           |                                                                    |
| `useCreateUser`          | Create user               | `userKeys.lists()`                                                 |
| `usePatchUser`           | Update user               | `userKeys.lists()`, `userKeys.detail(id)`                          |
| `useSoftDeleteUser`      | Deactivate user           | `userKeys.lists()`                                                 |
| `useHardDeleteUser`      | Delete permanently        | `userKeys.lists()`                                                 |
| **Student Reservations** |                           |                                                                    |
| `useReserveSubject`      | Create reservation        | `studentKeys.detail(id)`                                           |
| `useUnreserveSubject`    | Cancel reservation        | `studentKeys.detail(id)`                                           |
| `usePatchReservation`    | Update reservation status | `studentKeys.detail(id)`                                           |
| **Student Me**           |                           |                                                                    |
| `useReserveMe`           | Reserve own subject       | `meStudentKeys.reservations()`, `meStudentKeys.eligibleSubjects()` |
| `useUnreserveMe`         | Cancel own reservation    | `meStudentKeys.reservations()`, `meStudentKeys.eligibleSubjects()` |

---

## Cache Invalidation Strategy

Mutations call `queryClient.invalidateQueries()` with the relevant key factory:

- **List-level invalidation:** After create/delete → invalidate `entity.lists()` to refetch all list views
- **Detail-level invalidation:** After update → invalidate both `entity.lists()` and `entity.detail(id)`
- **Cross-entity invalidation:** Some mutations invalidate related entities (e.g., reserving a subject invalidates both reservations and eligible subjects)

### Example

```typescript
// After creating a course
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
  toast.success("Course created");
};
```

---

## React Context (Non-Query State)

| Context          | Provider          | Hook           | Purpose                          |
| ---------------- | ----------------- | -------------- | -------------------------------- |
| `AuthContext`    | `AuthProvider`    | `useAuth()`    | User state, sign-in/out, refresh |
| `SidebarContext` | `SidebarProvider` | `useSidebar()` | Sidebar open/collapsed state     |

These contexts manage **client-only state** that doesn't come from the API. Auth state is rehydrated from `localStorage`; sidebar state is persisted to a cookie.

---

## Utility Hooks

| Hook          | File                      | Purpose                                   |
| ------------- | ------------------------- | ----------------------------------------- |
| `useAuth`     | `hooks/use-auth.tsx`      | Access `AuthContext`                      |
| `useSidebar`  | `hooks/use-sidebar.tsx`   | Access `SidebarContext`                   |
| `useDebounce` | `hooks/use-debounce.ts`   | Debounce a value (used for search inputs) |
| `useIsMobile` | `hooks/use-is-mobile.tsx` | Detect mobile viewport                    |

---

## Why No Redux/Zustand?

The architecture is intentionally lean:

- **Server state** (entities) → React Query handles fetching, caching, invalidation, and background refetching
- **Auth state** → React Context (single concern, shared globally)
- **UI state** → React Context (sidebar) + local component state

There's no need for a global state management library when React Query handles the bulk of the state complexity.

---

## Related Docs

- [API Layer](api-layer.md) — The `fetch()` functions these hooks wrap
- [Data Models](data-models.md) — TypeScript interfaces for typed responses
- [Architecture](architecture.md) — Provider hierarchy
