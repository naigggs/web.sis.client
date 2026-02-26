"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  IconSearch,
  IconLoader2,
  IconCircleCheck,
  IconCircleX,
  IconTrash,
} from "@tabler/icons-react";

import { useGetStudents } from "@/hooks/api/student/use-get-students";
import { useGetStudentById } from "@/hooks/api/student/use-get-student-by-id";
import { useUnreserveSubject } from "@/hooks/api/student/reservation/use-unreserve-subject";
import { usePatchReservation } from "@/hooks/api/student/reservation/use-patch-reservation";
import { ReservationResponse } from "@/data/interface/reservation";
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Skeleton,
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui";
import { ReservationStatusBadge } from "@/components/pages/students/_profile/profile-helpers";

function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function ReservationsSection() {
  // ── Student selector ───────────────────────────────────────────────────────
  const [studentSearch, setStudentSearch] = React.useState("");
  const debouncedStudentSearch = useDebounce(studentSearch, 350);
  const [selectedStudentId, setSelectedStudentId] = React.useState("");
  const [reservationSearch, setReservationSearch] = React.useState("");
  const debouncedReservationSearch = useDebounce(reservationSearch);

  const { data: studentsData, isLoading: isLoadingStudents } = useGetStudents({
    search: debouncedStudentSearch || undefined,
    limit: 50,
  });
  const allStudents = studentsData?.students ?? [];

  // ── Selected student data ──────────────────────────────────────────────────
  const {
    data: student,
    isLoading: isLoadingStudent,
    isFetching: isFetchingStudent,
  } = useGetStudentById(selectedStudentId);

  const reservations = student?.reservations ?? [];

  const filteredReservations = reservations.filter((r) => {
    const q = debouncedReservationSearch.toLowerCase();
    return (
      r.subject.code.toLowerCase().includes(q) ||
      r.subject.title.toLowerCase().includes(q)
    );
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const { mutate: patchReservation, isPending: isPatching } =
    usePatchReservation();
  const { mutate: unreserveSubject, isPending: isUnreserving } =
    useUnreserveSubject();

  // ── Confirm dialogs ────────────────────────────────────────────────────────
  const [cancelTarget, setCancelTarget] =
    React.useState<ReservationResponse | null>(null);

  const handleApprove = (r: ReservationResponse) => {
    patchReservation(
      {
        studentId: selectedStudentId,
        reservationId: r.id,
        payload: { status: "APPROVED" },
      },
      {
        onSuccess: () =>
          toast.success(`Approved reservation for ${r.subject.code}`),
        onError: () => toast.error("Failed to approve reservation"),
      },
    );
  };

  const handleDeny = (r: ReservationResponse) => {
    patchReservation(
      {
        studentId: selectedStudentId,
        reservationId: r.id,
        payload: { status: "DENIED" },
      },
      {
        onSuccess: () =>
          toast.success(`Denied reservation for ${r.subject.code}`),
        onError: () => toast.error("Failed to deny reservation"),
      },
    );
  };

  const handleCancel = (r: ReservationResponse) => {
    unreserveSubject(
      { studentId: selectedStudentId, reservationId: r.id },
      {
        onSuccess: () => {
          toast.success(`${r.subject.code} reservation cancelled`);
          setCancelTarget(null);
        },
        onError: () => toast.error("Failed to cancel reservation"),
      },
    );
  };

  const isLoading = isLoadingStudent && !!selectedStudentId;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reservations</h1>
        <p className="text-muted-foreground text-sm">
          Select a student to review and approve or deny their subject
          reservations.
        </p>
      </div>

      {/* Student selector */}
      <div className="max-w-sm flex flex-col gap-1.5">
        <label className="text-sm font-medium">Select Student</label>
        <Combobox
          value={selectedStudentId}
          onValueChange={(value) => {
            setSelectedStudentId(String(value ?? ""));
            setReservationSearch("");
          }}
          onInputValueChange={(value, details) => {
            if (details.reason === "input-change") setStudentSearch(value);
          }}
          itemToStringLabel={(id) => {
            const s = allStudents.find((s) => s.id === id);
            return s
              ? `${s.studentNo} – ${s.firstName} ${s.lastName}`
              : String(id);
          }}
          filter={null}
        >
          <ComboboxInput
            showClear
            placeholder="Search by name or student no…"
          />
          <ComboboxContent>
            <ComboboxList>
              {isLoadingStudents ? (
                <ComboboxEmpty>Loading...</ComboboxEmpty>
              ) : allStudents.length === 0 ? (
                <ComboboxEmpty>No students found.</ComboboxEmpty>
              ) : (
                allStudents.map((s) => (
                  <ComboboxItem key={s.id} value={s.id}>
                    <span className="font-mono text-xs">{s.studentNo}</span>
                    <span className="truncate text-muted-foreground ml-1">
                      – {s.firstName} {s.lastName}
                    </span>
                  </ComboboxItem>
                ))
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      {/* Content — only when a student is selected */}
      {selectedStudentId && (
        <div className="flex flex-col gap-4">
          {/* Student info strip */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isLoading ? (
              <Skeleton className="h-5 w-64" />
            ) : student ? (
              <>
                <span className="font-medium text-foreground">
                  {student.firstName} {student.lastName}
                </span>
                <span>·</span>
                <span className="font-mono">{student.studentNo}</span>
                <span>·</span>
                <span>{student.course.code}</span>
                {isFetchingStudent && !isLoadingStudent && (
                  <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                )}
              </>
            ) : null}
          </div>

          {/* Search bar */}
          <div className="relative max-w-sm">
            <IconSearch className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search by code or subject name…"
              value={reservationSearch}
              onChange={(e) => setReservationSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Reservations table */}
          <div className="rounded-2xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Units</TableHead>
                  <TableHead className="text-center">Reserved At</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filteredReservations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-10 text-center text-muted-foreground text-sm"
                    >
                      {reservationSearch
                        ? "No matching reservations."
                        : "No reservations for this student."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReservations.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {r.subject.code}
                      </TableCell>
                      <TableCell>{r.subject.title}</TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {r.subject.units}
                      </TableCell>
                      <TableCell className="text-center text-xs tabular-nums text-muted-foreground">
                        {new Date(r.reservedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <ReservationStatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        {r.status === "RESERVED" ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 gap-1 text-green-700 hover:text-green-700 hover:bg-green-600/10"
                              onClick={() => handleApprove(r)}
                              disabled={isPatching}
                            >
                              <IconCircleCheck className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeny(r)}
                              disabled={isPatching}
                            >
                              <IconCircleX className="h-4 w-4" />
                              Deny
                            </Button>
                          </div>
                        ) : r.status === "APPROVED" ? (
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setCancelTarget(r)}
                            disabled={isUnreserving}
                            aria-label="Cancel reservation"
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Cancel reservation confirm */}
      <AlertDialog
        open={!!cancelTarget}
        onOpenChange={(open) => {
          if (!open) setCancelTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the reservation for{" "}
              <strong>
                {cancelTarget?.subject.code} – {cancelTarget?.subject.title}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cancelTarget && handleCancel(cancelTarget)}
              disabled={isUnreserving}
            >
              {isUnreserving ? "Cancelling…" : "Cancel Reservation"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
