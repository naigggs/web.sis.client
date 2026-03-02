# Data Models

All TypeScript interfaces live in `data/interface/`. They define entity shapes, API request/response contracts, and query parameter types.

---

## Standardized API Response

**File:** `data/interface/api.tsx`

Every API endpoint returns this wrapper:

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

---

## Auth

**File:** `data/interface/auth.tsx`

```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

---

## User

**File:** `data/interface/user.tsx`

### UserResponse

```typescript
interface UserResponse {
  id: string;
  email: string;
  role: "student" | "staff" | "admin";
  isActive: boolean;
  isBlocked: boolean;
  isSuspended: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Query & Mutation Params

| Type             | Fields                                                                    |
| ---------------- | ------------------------------------------------------------------------- |
| `GetUsersParams` | `page?`, `limit?`, `search?`, `roles?: Array<UserResponse["role"]>`       |
| `CreateUserBody` | `email`, `password`, `role`                                               |
| `PatchUserBody`  | `email?`, `password?`, `role?`, `isActive?`, `isBlocked?`, `isSuspended?` |

---

## Student

**File:** `data/interface/student.tsx`

### StudentResponse

```typescript
interface StudentResponse {
  id: string;
  studentNo: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  course?: CourseResponse;
  grades?: GradeResponse[];
  reservations?: ReservationResponse[];
  subjectStatus?: SubjectStatusResponse[];
}
```

### Query & Mutation Params

| Type                | Fields                                                                 |
| ------------------- | ---------------------------------------------------------------------- |
| `GetStudentsParams` | `page?`, `limit?`, `search?`, `courseId?: string[]`                    |
| `CreateStudentBody` | `studentNo`, `firstName`, `lastName`, `email`, `birthDate`, `courseId` |
| `PatchStudentBody`  | All fields optional                                                    |

---

## Course

**File:** `data/interface/course.tsx`

### CourseResponse

```typescript
interface CourseResponse {
  id: string;
  code: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
```

### CourseWithSubjectsResponse

Extends `CourseResponse` with:

```typescript
interface CourseWithSubjectsResponse extends CourseResponse {
  subjects: SubjectResponse[];
}
```

### Query & Mutation Params

| Type               | Fields                        |
| ------------------ | ----------------------------- |
| `GetCoursesParams` | `page?`, `limit?`, `search?`  |
| `CreateCourseBody` | `code`, `name`, `description` |
| `PatchCourseBody`  | All fields optional           |

---

## Subject

**File:** `data/interface/subject.tsx`

### SubjectResponse

```typescript
interface SubjectResponse {
  id: string;
  code: string;
  title: string;
  units: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
  course?: CourseResponse;
}
```

### SubjectStatusResponse

Returned by the eligible-subjects endpoint — indicates whether a student can reserve a subject:

```typescript
interface SubjectStatusResponse {
  id: string;
  code: string;
  title: string;
  units: number;
  eligible: boolean;
  alreadyReserved: boolean;
  missingPrerequisites: MissingPrerequisiteResponse[];
}
```

### PrerequisiteResponse

```typescript
interface PrerequisiteResponse {
  id: string;
  code: string;
  title: string;
  units: number;
  courseId: string;
}
```

### EnrolledStudentResponse

Returned by the enrolled-students endpoint — a student with embedded grade for a specific subject:

```typescript
interface EnrolledStudentResponse {
  id: string;
  studentNo: string;
  firstName: string;
  lastName: string;
  grade?: GradeResponse;
}
```

### Query & Mutation Params

| Type                | Fields                                               |
| ------------------- | ---------------------------------------------------- |
| `GetSubjectsParams` | `page?`, `limit?`, `search?`, `course?`, `courseId?` |
| `CreateSubjectBody` | `code`, `title`, `units`, `courseId`                 |
| `PatchSubjectBody`  | All fields optional                                  |

> **Note:** `GetSubjectsParams` accepts both `course` and `courseId` for backwards compatibility. The API call uses `?course=` on the wire.

---

## Grade

**File:** `data/interface/grade.tsx`

### GradeResponse

```typescript
interface GradeResponse {
  id: string;
  prelim: number | null;
  midterm: number | null;
  finals: number | null;
  finalGrade: number | null;
  remarks: "PASSED" | "FAILED" | null;
  studentId: string;
  subjectId: string;
  courseId: string;
  encodedByUserId: string;
  createdAt: string;
  updatedAt: string;
  subject?: SubjectResponse;
  course?: CourseResponse;
}
```

### Query & Mutation Params

| Type              | Fields                                                                 |
| ----------------- | ---------------------------------------------------------------------- |
| `GetGradesParams` | `courseId?`, `subjectId?`, `studentId?`, `page?`, `limit?`             |
| `CreateGradeBody` | `studentId`, `subjectId`, `courseId`, `prelim?`, `midterm?`, `finals?` |
| `PatchGradeBody`  | `prelim?`, `midterm?`, `finals?`                                       |

---

## Reservation

**File:** `data/interface/reservation.tsx`

### ReservationResponse

```typescript
interface ReservationResponse {
  id: string;
  status: "RESERVED" | "APPROVED" | "DENIED" | "CANCELLED";
  reservedAt: string;
  studentId: string;
  subjectId: string;
  subject?: SubjectResponse;
}
```

### Status Workflow

```
RESERVED  →  APPROVED
          →  DENIED
          →  CANCELLED
```

Admins can transition a reservation from `RESERVED` to any of the three terminal states.

---

## Missing Prerequisite

**File:** `data/interface/missing-prerequisite.tsx`

```typescript
interface MissingPrerequisiteResponse {
  id: string;
  code: string;
  title: string;
  units: number;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}
```

Represents a prerequisite subject that the student has **not yet passed**. Used in `SubjectStatusResponse.missingPrerequisites[]` to explain why a subject is ineligible.

---

## Entity Relationships

```
User (1) ─── encodes ──→ (N) Grade
Student (N) ──→ (1) Course
Subject (N) ──→ (1) Course
Grade (N) ──→ (1) Student, (1) Subject, (1) Course
Reservation (N) ──→ (1) Student, (1) Subject
Subject (N) ──→ (N) Subject  [prerequisites — self-referencing M:N]
```

---

## Related Docs

- [API Layer](api-layer.md) — Endpoint reference using these interfaces
- [State Management](state-management.md) — React Query hooks typed with these models
