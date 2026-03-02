# Reservation Management (Admin)

The reservation management page lets **admins** view, approve, deny, and cancel student subject reservations. It provides a central hub for managing enrollment requests.

**Access:** Admin

---

## Route

| Route           | Component                  | Description                  |
| --------------- | -------------------------- | ---------------------------- |
| `/reservations` | `reservations-section.tsx` | Admin reservation management |

---

## Component

**File:** `components/pages/reservations/reservations-section.tsx`

---

## How It Works

### Reservation Workflow

```
Student Reserves
       ↓
   RESERVED ────→ APPROVED (by admin)
       │               │
       ├──→ DENIED      ├──→ CANCELLED
       │
       └──→ CANCELLED (by student or admin)
```

### Status Values

| Status      | Meaning                                                 |
| ----------- | ------------------------------------------------------- |
| `RESERVED`  | Student has reserved the subject — pending admin review |
| `APPROVED`  | Admin has approved the reservation                      |
| `DENIED`    | Admin has denied the reservation                        |
| `CANCELLED` | Reservation was cancelled (by student or admin)         |

### Admin Interface

1. **Select a Student** — Dropdown/search to pick a student
2. **View Reservations** — Shows all reservations for the selected student with status badges
3. **Actions** — Approve, Deny, or Cancel each reservation

### Status Badges

Each reservation displays a colour-coded badge:

| Status      | Badge Variant       |
| ----------- | ------------------- |
| `RESERVED`  | `warning` (yellow)  |
| `APPROVED`  | `success` (green)   |
| `DENIED`    | `destructive` (red) |
| `CANCELLED` | `secondary` (grey)  |

---

## API Endpoints

| Hook                  | API Call              | Method                                     |
| --------------------- | --------------------- | ------------------------------------------ |
| `useGetReservations`  | `getReservationsApi`  | `GET /v1/students/:id/reservations`        |
| `useReserveSubject`   | `reserveSubjectApi`   | `POST /v1/students/:id/reservations`       |
| `useUnreserveSubject` | `unreserveSubjectApi` | `DELETE /v1/students/:id/reservations/:id` |
| `usePatchReservation` | `patchReservationApi` | `PATCH /v1/students/:id/reservations/:id`  |

### Typical Admin Actions

```
Approve:  PATCH /v1/students/:studentId/reservations/:reservationId
          Body: { status: "APPROVED" }

Deny:     PATCH /v1/students/:studentId/reservations/:reservationId
          Body: { status: "DENIED" }

Cancel:   PATCH /v1/students/:studentId/reservations/:reservationId
          Body: { status: "CANCELLED" }
```

---

## Key Files

| File                                                     | Purpose                        |
| -------------------------------------------------------- | ------------------------------ |
| `components/pages/reservations/reservations-section.tsx` | Reservation management UI      |
| `hooks/api/student/reservation/`                         | Reservation React Query hooks  |
| `api-calls/student/reservation/`                         | Reservation API call functions |
| `data/interface/reservation.tsx`                         | TypeScript interfaces          |

---

## Related Docs

- [Enrollment](enrollment.md) — Student-facing reservation flow
- [Students](students.md) — Reservations are per-student
- [Subjects](subjects.md) — Reservations target a specific subject
- [Role-Based Access](../role-based-access.md) — Admin-only route
- [Data Models](../data-models.md) — `ReservationResponse`
