# Enrollment (Student Self-Service)

The enrollment page is the student-facing counterpart to [Reservation Management](reservations.md). Students can browse eligible subjects, reserve them, and track reservation status.

**Access:** Student

---

## Route

| Route         | Component                | Description                     |
| ------------- | ------------------------ | ------------------------------- |
| `/enrollment` | `enrollment-section.tsx` | Student self-service enrollment |

---

## Component

**File:** `components/pages/enrollment/enrollment-section.tsx`

---

## How It Works

### Two Panels

The enrollment page is split into two logical sections:

#### 1. My Reservations

Displays the currently-authenticated student's reservations with real-time status badges:

| Status      | Badge  | Meaning                |
| ----------- | ------ | ---------------------- |
| `RESERVED`  | Yellow | Pending admin approval |
| `APPROVED`  | Green  | Approved by admin      |
| `DENIED`    | Red    | Denied by admin        |
| `CANCELLED` | Grey   | Cancelled              |

Actions available to the student:

- **Cancel** a reservation that is still in `RESERVED` status (not yet reviewed)

#### 2. Eligible Subjects

Displays subjects the student is eligible to reserve based on prerequisite satisfaction.

### Prerequisite Enforcement

A subject is **eligible** only when:

1. The student is enrolled in a course that includes the subject
2. All prerequisites for that subject have a **PASSED** grade on the student's record
3. The student has **not already reserved or been approved** for that subject

For ineligible subjects:

- A **lock icon** is displayed
- A **tooltip** lists the missing prerequisites
- The Reserve button is disabled

### Reserve Flow

```
Browse eligible subjects
       ↓
Click "Reserve" on a subject
       ↓
POST /v1/students/me/reservations  →  status: RESERVED
       ↓
Appears in "My Reservations" as pending
       ↓
Admin reviews (see Reservations doc)
```

### Cancel Flow

```
Click "Cancel" on a RESERVED reservation
       ↓
DELETE /v1/students/me/reservations/:id
       ↓
Removed from My Reservations
```

---

## API Endpoints

All enrollment endpoints use the `/me` prefix — the server resolves the student from the authenticated session.

| Hook                       | API Call                   | Method                                    |
| -------------------------- | -------------------------- | ----------------------------------------- |
| `useGetMeReservations`     | `getMeReservationsApi`     | `GET /v1/students/me/reservations`        |
| `useGetMeEligibleSubjects` | `getMeEligibleSubjectsApi` | `GET /v1/students/me/eligible-subjects`   |
| `useReserveMe`             | `reserveMeApi`             | `POST /v1/students/me/reservations`       |
| `useUnreserveMe`           | `unreserveMeApi`           | `DELETE /v1/students/me/reservations/:id` |

---

## Eligible Subjects Response

The eligible subjects endpoint returns a list of subjects with prerequisite status information:

```typescript
interface SubjectStatusResponse {
  id: string;
  code: string;
  name: string;
  units: number;
  // prerequisite status
  isEligible: boolean;
  missingPrerequisites: MissingPrerequisiteResponse[];
}

interface MissingPrerequisiteResponse {
  id: string;
  code: string;
  name: string;
}
```

---

## Key Files

| File                                                 | Purpose                        |
| ---------------------------------------------------- | ------------------------------ |
| `components/pages/enrollment/enrollment-section.tsx` | Enrollment UI                  |
| `hooks/api/student/me/`                              | Me-scoped React Query hooks    |
| `api-calls/student/me/`                              | Me-scoped API call functions   |
| `api-calls/student/reservation/`                     | Reservation API call functions |
| `data/interface/student.tsx`                         | Subject status interfaces      |
| `data/interface/reservation.tsx`                     | Reservation interfaces         |

---

## Relationship to Reservations

| Aspect             | Enrollment (Student)       | Reservations (Admin)       |
| ------------------ | -------------------------- | -------------------------- |
| Access             | Student only               | Admin only                 |
| Scope              | Own reservations via `/me` | Any student's reservations |
| Can Create         | Yes (Reserve)              | Yes                        |
| Can Approve/Deny   | No                         | Yes                        |
| Can Cancel         | Own `RESERVED` only        | Any                        |
| Prerequisite Check | Enforced in UI             | N/A                        |

---

## Related Docs

- [Reservations](reservations.md) — Admin-side reservation management
- [Subjects](subjects.md) — Subject prerequisites
- [Grades](grades.md) — PASSED grades satisfy prerequisites
- [Role-Based Access](../role-based-access.md) — Student-only route
- [Data Models](../data-models.md) — `SubjectStatusResponse`, `ReservationResponse`
