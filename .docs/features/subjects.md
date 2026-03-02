# Subjects

The Subjects module provides CRUD operations, a data table with course filtering, and a dedicated prerequisite management page.

**Access:** Admin only

---

## Routes

| Route                     | Component                   | Description             |
| ------------------------- | --------------------------- | ----------------------- |
| `/subjects`               | `subjects-section.tsx`      | Subject data table      |
| `/subjects/create`        | `_form/`                    | Create subject form     |
| `/subjects/[id]/edit`     | `_form/`                    | Edit subject form       |
| `/subjects/prerequisites` | `prerequisites-section.tsx` | Prerequisite management |

---

## Data Table — `/subjects`

**Component:** `components/pages/subjects/subjects-section.tsx`

### Features

| Feature              | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| **Search**           | Server-side full-text search via `?search=`                |
| **Course Filtering** | Filter by course via `?course=<courseId>`                  |
| **Pagination**       | Server-side with page/limit controls                       |
| **Bulk Delete**      | Checkbox selection → bulk delete via `DELETE /v1/subjects` |
| **Quick Actions**    | Edit, Delete per row                                       |

### Data Fetching

```
useGetSubjects({ page, limit: 20, search, course })
  → GET /v1/subjects?page=1&limit=20&search=...&course=<courseId>
```

> **Note:** The `course` parameter uses `?course=` on the wire (not `?courseId=`).

---

## Prerequisite Management — `/subjects/prerequisites`

**Component:** `components/pages/subjects/prerequisites-section.tsx`

This dedicated page allows admins to manage prerequisite relationships between subjects.

### How It Works

1. Select a **subject** from a dropdown
2. View its current prerequisites
3. **Add** a prerequisite by selecting from available subjects (same course)
4. **Remove** a prerequisite

### Validation Rules

- A subject **cannot be its own prerequisite** (`subject_id ≠ prerequisite_subject_id`)
- Prerequisites should be within the **same course** (enforced server-side)
- **Circular prerequisites** are prevented (A → B → A)

### API Calls

| Hook                    | API Call                | Method                                       |
| ----------------------- | ----------------------- | -------------------------------------------- |
| `useGetPrerequisites`   | `getPrerequisitesApi`   | `GET /v1/subjects/:id/prerequisites`         |
| `useAddPrerequisite`    | `addPrerequisiteApi`    | `POST /v1/subjects/:id/prerequisites`        |
| `useRemovePrerequisite` | `removePrerequisiteApi` | `DELETE /v1/subjects/:id/prerequisites/:pid` |

---

## Create/Edit Forms

**Component:** `components/pages/subjects/_form/`

### Fields

| Field  | Type                  | Validation                  |
| ------ | --------------------- | --------------------------- |
| Code   | Text                  | Required, unique per course |
| Title  | Text                  | Required                    |
| Units  | Number                | Required                    |
| Course | Select (courses list) | Required                    |

---

## API Endpoints

| Hook                     | API Call                 | Method                                   |
| ------------------------ | ------------------------ | ---------------------------------------- |
| `useGetSubjects`         | `getSubjectsApi`         | `GET /v1/subjects`                       |
| `useGetSubjectById`      | `getSubjectByIdApi`      | `GET /v1/subjects/:id`                   |
| `useCreateSubject`       | `createSubjectApi`       | `POST /v1/subjects`                      |
| `usePatchSubject`        | `patchSubjectApi`        | `PATCH /v1/subjects/:id`                 |
| `useBulkDeleteSubjects`  | `bulkDeleteSubjectsApi`  | `DELETE /v1/subjects`                    |
| `useGetEnrolledStudents` | `getEnrolledStudentsApi` | `GET /v1/subjects/:id/enrolled-students` |

---

## Key Files

| File                                                  | Purpose                        |
| ----------------------------------------------------- | ------------------------------ |
| `components/pages/subjects/subjects-section.tsx`      | Data table view                |
| `components/pages/subjects/prerequisites-section.tsx` | Prerequisite management        |
| `components/pages/subjects/_form/`                    | Create/edit form components    |
| `hooks/api/subject/`                                  | All subject React Query hooks  |
| `api-calls/subject/`                                  | All subject API call functions |
| `data/interface/subject.tsx`                          | TypeScript interfaces          |

---

## Related Docs

- [Courses](courses.md) — Subjects belong to courses
- [Grades](grades.md) — Grades are per-student-per-subject
- [Enrollment](enrollment.md) — Students reserve subjects (with prerequisite enforcement)
- [Data Models](../data-models.md) — `SubjectResponse`, `SubjectStatusResponse`, `PrerequisiteResponse`
