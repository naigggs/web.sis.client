# Digital Grading Sheet

The grading sheet allows admins and staff to enter and edit grades per student per subject. It acts as a digital gradebook with inline editing.

**Access:** Admin, Staff

---

## Route

| Route     | Component             | Description           |
| --------- | --------------------- | --------------------- |
| `/grades` | `grading-section.tsx` | Digital grading sheet |

---

## How It Works

**Component:** `components/pages/grades/grading-section.tsx`

### Filter Flow

1. **Select a Course** — Dropdown of all courses
2. **Select a Subject** — Dropdown filtered to subjects in the selected course
3. **View Enrolled Students** — Table of students enrolled in the selected subject, with their grades

### Grade Table

| Column      | Description                                                 |
| ----------- | ----------------------------------------------------------- |
| Student No  | Student number                                              |
| Name        | Full name                                                   |
| Prelim      | Prelim grade (editable)                                     |
| Midterm     | Midterm grade (editable)                                    |
| Finals      | Finals grade (editable)                                     |
| Final Grade | Computed final grade (read-only, server-calculated)         |
| Remarks     | `PASSED` / `FAILED` / `null` (read-only, server-calculated) |

### Inline Editing

Grades are edited **inline** directly in the table:

1. Click on a grade cell → switches to input mode
2. Enter/change the grade value
3. Blur or press Enter → saves via API
4. Toast notification confirms success

### Grade Upsert

When entering a grade for the first time, the system uses an **upsert** pattern:

```
useCreateGrade → POST /v1/grades
  Body: { studentId, subjectId, courseId, prelim?, midterm?, finals? }
```

The backend creates a new grade record if one doesn't exist, or updates the existing one. This prevents duplicate grade records per `(student_id, subject_id, course_id)`.

### Grade Update

For editing existing grades:

```
usePatchGrade → PATCH /v1/grades/:id
  Body: { prelim?, midterm?, finals? }
```

---

## Passing/Failing Logic

- The **server** computes `finalGrade` and `remarks` based on the component grades.
- `remarks` is `"PASSED"` if the final grade meets the passing threshold, `"FAILED"` otherwise, or `null` if grades are incomplete.
- A grade with `remarks = "PASSED"` satisfies the prerequisite for any subject that requires this subject as a prerequisite.

---

## API Endpoints

| Hook             | API Call         | Method                                |
| ---------------- | ---------------- | ------------------------------------- |
| `useGetGrades`   | `getGradesApi`   | `GET /v1/grades?courseId=&subjectId=` |
| `useCreateGrade` | `createGradeApi` | `POST /v1/grades`                     |
| `usePatchGrade`  | `patchGradeApi`  | `PATCH /v1/grades/:id`                |

### Query Parameters

```
GET /v1/grades?courseId=<id>&subjectId=<id>&studentId=<id>&page=1&limit=50
```

---

## Key Files

| File                                          | Purpose                      |
| --------------------------------------------- | ---------------------------- |
| `components/pages/grades/grading-section.tsx` | Grading sheet implementation |
| `hooks/api/grade/`                            | Grade React Query hooks      |
| `hooks/api/grade/grade-keys.ts`               | Query key factory            |
| `api-calls/grade/`                            | Grade API call functions     |
| `data/interface/grade.tsx`                    | TypeScript interfaces        |

---

## Related Docs

- [Students](students.md) — Grades are linked to students
- [Subjects](subjects.md) — Grades are per-subject
- [Courses](courses.md) — Grades are scoped to a course
- [Enrollment](enrollment.md) — Prerequisites require PASSED grades
- [Data Models](../data-models.md) — `GradeResponse`
