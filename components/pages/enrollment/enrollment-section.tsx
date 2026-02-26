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

import { useGetMeReservations } from "@/hooks/api/student/me/use-get-me-reservations";
import { useGetMeEligibleSubjects } from "@/hooks/api/student/me/use-get-me-eligible-subjects";
import { useReserveMe } from "@/hooks/api/student/me/use-reserve-me";
import { useUnreserveMe } from "@/hooks/api/student/me/use-unreserve-me";
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

export function EnrollmentSection() {
  // ── My Reservations ────────────────────────────────────────────────────────
  const { data: reservations = [], isLoading: isLoadingReservations } =
    useGetMeReservations();

  // ── Eligible Subjects ──────────────────────────────────────────────────────
  const [eligibleSearch, setEligibleSearch] = React.useState("");
  const debouncedEligibleSearch = useDebounce(eligibleSearch);

  const { data: eligibleSubjects = [], isLoading: isLoadingEligible } =
    useGetMeEligibleSubjects();

  const filteredEligible = eligibleSubjects.filter((s) => {
    const q = debouncedEligibleSearch.toLowerCase();
    return (
      s.code.toLowerCase().includes(q) || s.title.toLowerCase().includes(q)
    );
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const { mutate: reserveMe, isPending: isReserving } = useReserveMe();
  const { mutate: unreserveMe, isPending: isUnreserving } = useUnreserveMe();

  // ── Cancel confirm ─────────────────────────────────────────────────────────
  const [cancelTarget, setCancelTarget] =
    React.useState<ReservationResponse | null>(null);

  const handleReserve = (subject: SubjectStatusResponse) => {
    reserveMe(subject.id, {
      onSuccess: () => toast.success(`Reserved ${subject.code}`),
      onError: () => toast.error(`Failed to reserve ${subject.code}`),
    });
  };

  const handleUnreserve = (reservation: ReservationResponse) => {
    unreserveMe(reservation.id, {
      onSuccess: () =>
        toast.success(`Cancelled reservation for ${reservation.subject?.code}`),
      onError: () => toast.error("Failed to cancel reservation"),
    });
    setCancelTarget(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Enrollment</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View your current reservations and reserve available subjects.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[55%_1fr]">
        {/* ── Left: My Reservations ─────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-medium">My Reservations</h2>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Units</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingReservations ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : reservations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-10"
                    >
                      No reservations yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  reservations.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-sm">
                        {r.subject?.code ?? "—"}
                      </TableCell>
                      <TableCell>{r.subject?.title ?? "—"}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">
                          {r.subject?.units ?? 0} u
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ReservationStatusBadge status={r.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        {r.status === "RESERVED" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => setCancelTarget(r)}
                            disabled={isUnreserving}
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* ── Right: Available Subjects ──────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium flex-1">Available Subjects</h2>
          </div>
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search subjects…"
              value={eligibleSearch}
              onChange={(e) => setEligibleSearch(e.target.value)}
            />
          </div>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Units</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead />
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
                      className="text-center text-muted-foreground py-10"
                    >
                      No subjects available.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEligible.map((s) => (
                    <TableRow
                      key={s.id}
                      className={
                        !s.eligible || s.alreadyReserved
                          ? "opacity-60"
                          : undefined
                      }
                    >
                      <TableCell className="font-mono text-sm">
                        {s.code}
                      </TableCell>
                      <TableCell>{s.title}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{s.units} u</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {s.alreadyReserved ? (
                          <Badge className="text-xs bg-blue-600/15 text-blue-700 border-blue-600/20 dark:text-blue-400 hover:bg-blue-600/15">
                            Reserved
                          </Badge>
                        ) : s.eligible ? (
                          <Badge className="text-xs bg-green-600/15 text-green-700 border-green-600/20 dark:text-green-400 hover:bg-green-600/15">
                            Eligible
                          </Badge>
                        ) : (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className="text-xs gap-1 cursor-default"
                              >
                                <IconAlertTriangle className="h-3 w-3" />
                                Missing prereqs
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-52">
                              <p className="text-xs font-medium mb-1">
                                Missing prerequisites:
                              </p>
                              <ul className="text-xs space-y-0.5">
                                {s.missingPrerequisites.map((p) => (
                                  <li key={p.id}>
                                    {p.code} — {p.title}
                                  </li>
                                ))}
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {s.alreadyReserved ? null : s.eligible ? (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={() => handleReserve(s)}
                            disabled={isReserving}
                          >
                            {isReserving ? (
                              <IconLoader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <IconPlus className="h-4 w-4" />
                            )}
                          </Button>
                        ) : (
                          <IconLock className="h-4 w-4 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* ── Cancel confirmation dialog ──────────────────────────────────────── */}
      <AlertDialog
        open={!!cancelTarget}
        onOpenChange={(open) => !open && setCancelTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel reservation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your reservation for{" "}
              <strong>{cancelTarget?.subject?.code}</strong> —{" "}
              {cancelTarget?.subject?.title}. You can re-reserve it later if
              slots are still available.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => cancelTarget && handleUnreserve(cancelTarget)}
            >
              Cancel reservation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
