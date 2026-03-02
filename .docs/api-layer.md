# API Layer

All backend communication flows through a thin API layer in the `api-calls/` directory. Every function follows the same pattern and talks to a single RESTful backend.

---

## Pattern

Every API call function:

1. Builds a URL against `API_URL` from `config/constants.ts`
2. Calls `fetch()` with `credentials: "include"` (sends session cookies automatically)
3. Checks `res.ok` — throws on error
4. Parses JSON → extracts typed `data`
5. Returns the typed result

```typescript
// Typical structure (simplified)
export async function getStudentsApi(params?: GetStudentsParams) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const res = await fetch(`${API_URL}/v1/students?${searchParams}`, {
    credentials: "include",
  });

  const json: ApiResponse<{ students: StudentResponse[] }> = await res.json();
  return json;
}
```

---

## Environment Configuration

The `API_URL` is resolved at build time from environment variables:

| Environment | Variable                              | Example                               |
| ----------- | ------------------------------------- | ------------------------------------- |
| Development | `NEXT_PUBLIC_DEV_SERVICE_API_URL`     | `http://localhost:3000`               |
| Staging     | `NEXT_PUBLIC_STAGING_SERVICE_API_URL` | `https://staging-api.edunest.example` |
| Production  | `NEXT_PUBLIC_PROD_SERVICE_API_URL`    | `https://api.edunest.example`         |

Selection logic: `production` → PROD, `staging` → STAGING, else → DEV.

---

## Full Endpoint Reference

### Auth (`api-calls/auth/`)

| Function     | Method | Endpoint           | Description                        |
| ------------ | ------ | ------------------ | ---------------------------------- |
| `loginApi`   | POST   | `/v1/auth/login`   | Authenticate with email + password |
| `logoutApi`  | POST   | `/v1/auth/logout`  | End session                        |
| `refreshApi` | POST   | `/v1/auth/refresh` | Refresh/validate session           |
| `meApi`      | GET    | `/v1/auth/me`      | Get current user profile           |

### Students (`api-calls/student/`)

| Function                 | Method | Endpoint                             | Description                                            |
| ------------------------ | ------ | ------------------------------------ | ------------------------------------------------------ |
| `getStudentsApi`         | GET    | `/v1/students`                       | List students (search, filter by courseId, pagination) |
| `createStudentApi`       | POST   | `/v1/students`                       | Create a new student                                   |
| `getStudentByIdApi`      | GET    | `/v1/students/:id`                   | Get student detail                                     |
| `patchStudentApi`        | PATCH  | `/v1/students/:id`                   | Update student fields                                  |
| `bulkDeleteStudentsApi`  | DELETE | `/v1/students`                       | Bulk delete (body: `{ ids }`)                          |
| `importStudentsApi`      | POST   | `/v1/students/import`                | Import students from CSV (FormData)                    |
| `exportStudentsApi`      | GET    | `/v1/students/export`                | Export students as file (Blob response)                |
| `getEligibleSubjectsApi` | GET    | `/v1/students/:id/eligible-subjects` | Get subjects with eligibility flags                    |

### Student "Me" — Self-Service (`api-calls/student/me/`)

| Function                   | Method | Endpoint                            | Description             |
| -------------------------- | ------ | ----------------------------------- | ----------------------- |
| `getMeStudentApi`          | GET    | `/v1/students/me`                   | Get own student profile |
| `getMeEligibleSubjectsApi` | GET    | `/v1/students/me/eligible-subjects` | Own eligible subjects   |
| `getMeReservationsApi`     | GET    | `/v1/students/me/reservations`      | Own reservations        |
| `reserveMeApi`             | POST   | `/v1/students/me/reservations`      | Reserve a subject       |
| `unreserveMeApi`           | DELETE | `/v1/students/me/reservations/:id`  | Cancel a reservation    |

### Student Reservations — Admin (`api-calls/student/reservation/`)

| Function              | Method | Endpoint                             | Description                         |
| --------------------- | ------ | ------------------------------------ | ----------------------------------- |
| `getReservationsApi`  | GET    | `/v1/students/:id/reservations`      | Get student's reservations          |
| `reserveSubjectApi`   | POST   | `/v1/students/:id/reservations`      | Create reservation for student      |
| `unreserveSubjectApi` | DELETE | `/v1/students/:id/reservations/:rid` | Remove reservation                  |
| `patchReservationApi` | PATCH  | `/v1/students/:id/reservations/:rid` | Update status (approve/deny/cancel) |

### Courses (`api-calls/course/`)

| Function                 | Method | Endpoint                   | Description                           |
| ------------------------ | ------ | -------------------------- | ------------------------------------- |
| `getCoursesApi`          | GET    | `/v1/courses`              | List courses (search, pagination)     |
| `createCourseApi`        | POST   | `/v1/courses`              | Create course                         |
| `getCourseByIdApi`       | GET    | `/v1/courses/:id`          | Get course detail (includes subjects) |
| `patchCourseApi`         | PATCH  | `/v1/courses/:id`          | Update course                         |
| `bulkDeleteCoursesApi`   | DELETE | `/v1/courses`              | Bulk delete (body: `{ ids }`)         |
| `addSubjectsToCourseApi` | POST   | `/v1/courses/:id/subjects` | Add subjects to course                |

### Subjects (`api-calls/subject/`)

| Function                 | Method | Endpoint                              | Description                                    |
| ------------------------ | ------ | ------------------------------------- | ---------------------------------------------- |
| `getSubjectsApi`         | GET    | `/v1/subjects`                        | List subjects (search, `?course=`, pagination) |
| `createSubjectApi`       | POST   | `/v1/subjects`                        | Create subject                                 |
| `getSubjectByIdApi`      | GET    | `/v1/subjects/:id`                    | Get subject detail                             |
| `patchSubjectApi`        | PATCH  | `/v1/subjects/:id`                    | Update subject                                 |
| `bulkDeleteSubjectsApi`  | DELETE | `/v1/subjects`                        | Bulk delete (body: `{ ids }`)                  |
| `getPrerequisitesApi`    | GET    | `/v1/subjects/:id/prerequisites`      | Get subject prerequisites                      |
| `addPrerequisiteApi`     | POST   | `/v1/subjects/:id/prerequisites`      | Add prerequisite link                          |
| `removePrerequisiteApi`  | DELETE | `/v1/subjects/:id/prerequisites/:pid` | Remove prerequisite link                       |
| `getEnrolledStudentsApi` | GET    | `/v1/subjects/:id/enrolled-students`  | Get students enrolled in subject               |

### Grades (`api-calls/grade/`)

| Function         | Method | Endpoint         | Description                                                          |
| ---------------- | ------ | ---------------- | -------------------------------------------------------------------- |
| `getGradesApi`   | GET    | `/v1/grades`     | List grades (`?courseId=`, `?subjectId=`, `?studentId=`, pagination) |
| `createGradeApi` | POST   | `/v1/grades`     | Create/upsert grade                                                  |
| `patchGradeApi`  | PATCH  | `/v1/grades/:id` | Update grade fields                                                  |

### Users (`api-calls/user/`)

| Function            | Method | Endpoint                    | Description                                          |
| ------------------- | ------ | --------------------------- | ---------------------------------------------------- |
| `getUsersApi`       | GET    | `/v1/users`                 | List users (search, `?role=`/`?role[]=`, pagination) |
| `createUserApi`     | POST   | `/v1/users`                 | Create user                                          |
| `getUserByIdApi`    | GET    | `/v1/users/:id`             | Get user detail                                      |
| `patchUserApi`      | PATCH  | `/v1/users/:id`             | Update user                                          |
| `softDeleteUserApi` | DELETE | `/v1/users/:id/soft-delete` | Soft delete (deactivate)                             |
| `hardDeleteUserApi` | DELETE | `/v1/users/:id/hard-delete` | Permanent delete                                     |

---

## Query Parameters Convention

- **Pagination:** `?page=1&limit=20`
- **Search:** `?search=<term>` (server-side full-text search)
- **Filtering:** Entity-specific params (e.g., `?courseId[]=<id>` for students, `?course=<id>` for subjects, `?role=<role>` for users)
- **Array params:** Some endpoints accept array query params (e.g., `?courseId[]=a&courseId[]=b` or `?role[]=admin&role[]=staff`)

---

## Error Handling

All API functions rely on the standard `ApiResponse<T>` wrapper:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: Array<{ field: string; message: string }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  metadata?: {
    requestId: string;
    version: string;
    timestamp: string;
    serverTime: string;
  };
}
```

Error handling is primarily done at the React Query hook level — mutations show toast notifications on success/failure via Sonner.

---

## Related Docs

- [Data Models](data-models.md) — TypeScript interfaces for all entities
- [State Management](state-management.md) — React Query hooks wrapping these API calls
- [Authentication](authentication.md) — Session management and 401 interceptor
