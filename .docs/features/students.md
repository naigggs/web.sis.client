# Students

The Students module provides full CRUD, data table management, import/export, and a rich student profile page with prerequisite status indicators.

**Access:** Admin only

---

## Routes

| Route                 | Component              | Description          |
| --------------------- | ---------------------- | -------------------- |
| `/students`           | `students-section.tsx` | Student data table   |
| `/students/create`    | `_form/`               | Create student form  |
| `/students/[id]`      | `student-profile.tsx`  | Student profile page |
| `/students/[id]/edit` | `_form/`               | Edit student form    |

---

## Data Table — `/students`

**Component:** `components/pages/students/students-section.tsx`

### Features

| Feature              | Description                                                |
| -------------------- | ---------------------------------------------------------- |
| **Search**           | Server-side full-text search via `?search=`                |
| **Course Filtering** | Filter by one or more courses via `?courseId[]=`           |
| **Pagination**       | Server-side with page/limit controls                       |
| **Inline Editing**   | Edit student fields directly in the table                  |
| **Bulk Delete**      | Checkbox selection → bulk delete via `DELETE /v1/students` |
| **Import**           | CSV file upload via `POST /v1/students/import`             |
| **Export**           | Download as file via `GET /v1/students/export`             |
| **Quick Actions**    | View profile, Edit, Delete per row                         |

### Data Fetching

```
useGetStudents({ page, limit: 20, search, courseId })
  → GET /v1/students?page=1&limit=20&search=...&courseId[]=...
```

The search input is debounced with `useDebounce()` before firing API calls.

---

## Student Profile — `/students/[id]`

**Component:** `components/pages/students/student-profile.tsx`

### Sections

1. **Basic Info** — Student number, name, email, birth date
2. **Course** — Enrolled course with link
3. **Reserved Subjects** — List of reservations with status badges
4. **Grade Records** — Table of grades (prelim, midterm, finals, final grade, remarks)
5. **Subject Eligibility** — Eligible subjects with prerequisite status indicators

### Prerequisite Status

For each subject in the student's course, the eligibility API returns:

| Field                    | Meaning                                      |
| ------------------------ | -------------------------------------------- |
| `eligible: true`         | Student can reserve this subject             |
| `eligible: false`        | Missing prerequisites — cannot reserve       |
| `alreadyReserved: true`  | Student has already reserved this subject    |
| `missingPrerequisites[]` | List of prerequisite subjects not yet passed |

The UI shows:

- ✅ Eligible subjects with a reserve action
- 🔒 Ineligible subjects with lock icon and tooltip listing missing prerequisites
- ✓ Already-reserved subjects marked as such

---

## Create/Edit Forms

**Component:** `components/pages/students/_form/`

### Fields

| Field          | Type                  | Validation       |
| -------------- | --------------------- | ---------------- |
| Student Number | Text                  | Required, unique |
| First Name     | Text                  | Required         |
| Last Name      | Text                  | Required         |
| Email          | Email                 | Required         |
| Birth Date     | Date picker           | Required         |
| Course         | Select (courses list) | Required         |

---

## Import/Export

### Import (CSV)

1. User clicks "Import" → file picker opens
2. Select a CSV file
3. `POST /v1/students/import` with `FormData` containing the file
4. On success → toast notification, invalidate student list

### Export

1. User clicks "Export"
2. `GET /v1/students/export` → server returns a Blob
3. Browser triggers download of the file

---

## API Endpoints

| Hook                     | API Call                 | Method                                   |
| ------------------------ | ------------------------ | ---------------------------------------- |
| `useGetStudents`         | `getStudentsApi`         | `GET /v1/students`                       |
| `useGetStudentById`      | `getStudentByIdApi`      | `GET /v1/students/:id`                   |
| `useCreateStudent`       | `createStudentApi`       | `POST /v1/students`                      |
| `usePatchStudent`        | `patchStudentApi`        | `PATCH /v1/students/:id`                 |
| `useBulkDeleteStudents`  | `bulkDeleteStudentsApi`  | `DELETE /v1/students`                    |
| `useImportStudents`      | `importStudentsApi`      | `POST /v1/students/import`               |
| `useExportStudents`      | `exportStudentsApi`      | `GET /v1/students/export`                |
| `useGetEligibleSubjects` | `getEligibleSubjectsApi` | `GET /v1/students/:id/eligible-subjects` |

---

## Key Files

| File                                             | Purpose                        |
| ------------------------------------------------ | ------------------------------ |
| `components/pages/students/students-section.tsx` | Data table view                |
| `components/pages/students/student-profile.tsx`  | Profile page                   |
| `components/pages/students/_form/`               | Create/edit form components    |
| `components/pages/students/_profile/`            | Profile sub-components         |
| `hooks/api/student/`                             | All student React Query hooks  |
| `api-calls/student/`                             | All student API call functions |
| `data/interface/student.tsx`                     | TypeScript interfaces          |

---

## Related Docs

- [Courses](courses.md) — Students are enrolled in courses
- [Grades](grades.md) — Student grade records
- [Reservations](reservations.md) — Admin reservation management
- [Data Models](../data-models.md) — `StudentResponse` interface
