# Courses

The Courses module provides CRUD operations, a data table with search and pagination, and a detail page showing the course's subjects.

**Access:** Admin only

---

## Routes

| Route                | Component             | Description                     |
| -------------------- | --------------------- | ------------------------------- |
| `/courses`           | `courses-section.tsx` | Course data table               |
| `/courses/create`    | `_form/`              | Create course form              |
| `/courses/[id]`      | `course-detail.tsx`   | Course detail (info + subjects) |
| `/courses/[id]/edit` | `_form/`              | Edit course form                |

---

## Data Table — `/courses`

**Component:** `components/pages/courses/courses-section.tsx`

### Features

| Feature           | Description                                               |
| ----------------- | --------------------------------------------------------- |
| **Search**        | Server-side full-text search via `?search=`               |
| **Pagination**    | Server-side with page/limit controls                      |
| **Bulk Delete**   | Checkbox selection → bulk delete via `DELETE /v1/courses` |
| **Quick Actions** | View detail, Edit, Delete per row                         |

### Data Fetching

```
useGetCourses({ page, limit: 20, search })
  → GET /v1/courses?page=1&limit=20&search=...
```

---

## Course Detail — `/courses/[id]`

**Component:** `components/pages/courses/course-detail.tsx`

### Sections

1. **Course Info Card** — Code, name, description, timestamps
2. **Subjects Card** — List of subjects assigned to this course

### Add Subjects to Course

Admins can add existing subjects to a course via:

```
useAddSubjectsToCourse(courseId)
  → POST /v1/courses/:id/subjects
```

---

## Create/Edit Forms

**Component:** `components/pages/courses/_form/`

### Fields

| Field       | Type     | Validation       |
| ----------- | -------- | ---------------- |
| Code        | Text     | Required, unique |
| Name        | Text     | Required         |
| Description | Textarea | Required         |

---

## API Endpoints

| Hook                     | API Call                 | Method                          |
| ------------------------ | ------------------------ | ------------------------------- |
| `useGetCourses`          | `getCoursesApi`          | `GET /v1/courses`               |
| `useGetCourseById`       | `getCourseByIdApi`       | `GET /v1/courses/:id`           |
| `useCreateCourse`        | `createCourseApi`        | `POST /v1/courses`              |
| `usePatchCourse`         | `patchCourseApi`         | `PATCH /v1/courses/:id`         |
| `useBulkDeleteCourses`   | `bulkDeleteCoursesApi`   | `DELETE /v1/courses`            |
| `useAddSubjectsToCourse` | `addSubjectsToCourseApi` | `POST /v1/courses/:id/subjects` |

---

## Key Files

| File                                           | Purpose                       |
| ---------------------------------------------- | ----------------------------- |
| `components/pages/courses/courses-section.tsx` | Data table view               |
| `components/pages/courses/course-detail.tsx`   | Detail page                   |
| `components/pages/courses/_detail/`            | Detail sub-components         |
| `components/pages/courses/_form/`              | Create/edit form components   |
| `hooks/api/course/`                            | All course React Query hooks  |
| `api-calls/course/`                            | All course API call functions |
| `data/interface/course.tsx`                    | TypeScript interfaces         |

---

## Related Docs

- [Subjects](subjects.md) — Subjects belong to courses
- [Students](students.md) — Students are enrolled in courses
- [Data Models](../data-models.md) — `CourseResponse`, `CourseWithSubjectsResponse`
