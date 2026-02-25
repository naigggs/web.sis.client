"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  IconSearch,
  IconTrash,
  IconPlus,
  IconLoader2,
  IconLock,
  IconAlertTriangle,
} from "@tabler/icons-react";

import { useGetStudents } from "@/hooks/api/student/use-get-students";
import { useGetStudentById } from "@/hooks/api/student/use-get-student-by-id";
import { useGetEligibleSubjects } from "@/hooks/api/student/use-get-eligible-subjects";
import { useReserveSubject } from "@/hooks/api/student/reservation/use-reserve-subject";
import { useUnreserveSubject } from "@/hooks/api/student/reservation/use-unreserve-subject";
import { ReservationResponse } from "@/data/interface/reservation";
import { SubjectStatusResponse } from "@/data/interface/subject";
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Badge,
  Skeleton,
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
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

  // ── Eligible subjects ──────────────────────────────────────────────────────
  const [eligibleSearch, setEligibleSearch] = React.useState("");
  const debouncedEligibleSearch = useDebounce(eligibleSearch);

  const { data: eligibleSubjects, isLoading: isLoadingEligible } =
    useGetEligibleSubjects(selectedStudentId);

  const filteredEligible = (eligibleSubjects ?? []).filter((s) => {
    const q = debouncedEligibleSearch.toLowerCase();
    return (
      s.code.toLowerCase().includes(q) || s.title.toLowerCase().includes(q)
    );
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const { mutate: reserveSubject, isPending: isReserving } =
    useReserveSubject();
  const { mutate: unreserveSubject, isPending: isUnreserving } =
    useUnreserveSubject();

  // ── Remove reservation confirm ─────────────────────────────────────────────
  const [cancelTarget, setCancelTarget] =
    React.useState<ReservationResponse | null>(null);

  const handleReserve = (subject: SubjectStatusResponse) => {
    if (!selectedStudentId) return;
    reserveSubject(
      { studentId: selectedStudentId, subjectId: subject.id },
      {
        onSuccess: () => toast.success(`Reserved ${subject.code}`),
        onError: () => toast.error(`Failed to reserve ${subject.code}`),
      },
    );
  };

  const handleUnreserve = (reservation: ReservationResponse) => {
    unreserveSubject(
      { studentId: selectedStudentId, reservationId: reservation.id },
      {
        onSuccess: () => {
          toast.success(`${reservation.subject.code} reservation cancelled`);
          setCancelTarget(null);
        },
        onError: () => toast.error("Failed to cancel reservation"),
      },
    );
  };

  const selectedStudent = allStudents.find((s) => s.id === selectedStudentId);

  const isLoading = isLoadingStudent && !!selectedStudentId;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reservations</h1>
        <p className="text-muted-foreground text-sm">
          Select a student to view their reservations and reserve eligible
          subjects.
        </p>
      </div>

      {/* Student selector */}
      <div className="max-w-sm flex flex-col gap-1.5">
        <label className="text-sm font-medium">Select Student</label>
        <Combobox
          value={selectedStudentId}
          onValueChange={(value) => {
            setSelectedStudentId(String(value ?? ""));
            setEligibleSearch("");
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

      {/* Content panels — only when a student is selected */}
      {selectedStudentId && (
        <div className="flex flex-col gap-8">
          {/* Student info strip */}
          {(isLoading ? true : !!student) && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-5 w-64" />
              ) : (
                <>
                  <span className="font-medium text-foreground">
                    {student!.firstName} {student!.lastName}
                  </span>
                  <span>·</span>
                  <span className="font-mono">{student!.studentNo}</span>
                  <span>·</span>
                  <span>{student!.course.code}</span>
                  {isFetchingStudent && !isLoadingStudent && (
                    <IconLoader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                </>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* ── Current Reservations ── */}
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">Current Reservations</h2>
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
                    ) : reservations.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="py-10 text-center text-muted-foreground text-sm"
                        >
                          No reservations found for this student.
                        </TableCell>
                      </TableRow>
                    ) : (
                      reservations.map((r) => (
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
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* ── Eligible Subjects ── */}
            <div className="flex flex-col gap-3">
              <h2 className="text-lg font-semibold">Eligible Subjects</h2>

              <div className="relative max-w-sm">
                <IconSearch className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none" />
                <Input
                  placeholder="Search eligible subjects…"
                  value={eligibleSearch}
                  onChange={(e) => setEligibleSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="rounded-2xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="text-center">Units</TableHead>
                      <TableHead className="text-center">Eligible</TableHead>
                      <TableHead className="text-right pr-4">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingEligible ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <TableRow key={i}>
                          {Array.from({ length: 5 }).map((_, j) => (
                            <TableCell key={j}>
                              <Skeleton className="h-4 w-full" />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : filteredEligible.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="py-10 text-center text-muted-foreground text-sm"
                        >
                          {debouncedEligibleSearch
                            ? "No matching subjects."
                            : "No eligible subjects found."}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEligible.map((subject) => {
                        const alreadyReserved = subject.alreadyReserved;
                        const hasMissingPrereqs =
                          subject.missingPrerequisites.length > 0;
                        const canReserve = subject.eligible && !alreadyReserved;

                        return (
                          <TableRow
                            key={subject.id}
                            className={
                              !subject.eligible ? "opacity-60" : undefined
                            }
                          >
                            <TableCell className="font-mono text-xs font-medium">
                              {subject.code}
                            </TableCell>
                            <TableCell>{subject.title}</TableCell>
                            <TableCell className="text-center text-muted-foreground">
                              {subject.units}
                            </TableCell>
                            <TableCell className="text-center">
                              {alreadyReserved ? (
                                <Badge
                                  variant="secondary"
                                  className="text-xs gap-1"
                                >
                                  Reserved
                                </Badge>
                              ) : hasMissingPrereqs ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="outline"
                                      className="text-xs gap-1 text-amber-600 border-amber-400/50 cursor-help"
                                    >
                                      <IconAlertTriangle className="h-3 w-3" />
                                      Missing Prereqs
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs text-xs">
                                    Missing:{" "}
                                    {subject.missingPrerequisites
                                      .map((p) => p.code)
                                      .join(", ")}
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <Badge className="text-xs gap-1 bg-green-600/15 text-green-700 border-green-600/20 dark:text-green-400 hover:bg-green-600/15">
                                  Eligible
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right pr-4">
                              {!canReserve ? (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span>
                                      <Button
                                        size="icon-sm"
                                        variant="ghost"
                                        disabled
                                        aria-label="Cannot reserve"
                                      >
                                        <IconLock className="h-4 w-4" />
                                      </Button>
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="text-xs">
                                    {alreadyReserved
                                      ? "Already reserved"
                                      : "Missing prerequisites"}
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => handleReserve(subject)}
                                  disabled={isReserving}
                                  aria-label="Reserve subject"
                                >
                                  <IconPlus className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
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
              onClick={() => cancelTarget && handleUnreserve(cancelTarget)}
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
