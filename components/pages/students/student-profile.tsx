"use client";

import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconMail,
  IconCalendar,
  IconId,
  IconBook,
  IconClipboardList,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconAlertTriangle,
  IconPencil,
} from "@tabler/icons-react";

import { useGetStudentById } from "@/hooks/api/student/use-get-student-by-id";
import {
  Button,
  Badge,
  Skeleton,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Separator,
} from "@/components/ui";

interface Props {
  studentId: string;
}

function GradeRemarksBadge({
  remarks,
}: {
  remarks: "PASSED" | "FAILED" | null;
}) {
  if (!remarks) return <span className="text-muted-foreground text-xs">—</span>;
  if (remarks === "PASSED")
    return (
      <Badge className="text-xs gap-1 bg-green-600/15 text-green-700 border-green-600/20 dark:text-green-400 hover:bg-green-600/15">
        <IconCircleCheck className="h-3 w-3" />
        Passed
      </Badge>
    );
  return (
    <Badge variant="destructive" className="text-xs gap-1">
      <IconCircleX className="h-3 w-3" />
      Failed
    </Badge>
  );
}

function GradeValue({ value }: { value: string | null }) {
  if (value === null)
    return <span className="text-muted-foreground tabular-nums">—</span>;
  return <span className="tabular-nums">{value}</span>;
}

function ReservationStatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s === "RESERVED")
    return (
      <Badge className="text-xs gap-1 bg-blue-600/15 text-blue-700 border-blue-600/20 dark:text-blue-400 hover:bg-blue-600/15">
        <IconClock className="h-3 w-3" />
        Reserved
      </Badge>
    );
  if (s === "CANCELLED")
    return (
      <Badge variant="destructive" className="gap-1 text-xs">
        <IconCircleX className="h-3 w-3" />
        Cancelled
      </Badge>
    );
  return (
    <Badge variant="secondary" className="gap-1 text-xs">
      {status}
    </Badge>
  );
}

function InfoField({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs flex items-center gap-1 uppercase tracking-wide font-medium">
        {icon}
        {label}
      </span>
      <div className="text-sm">{children}</div>
    </div>
  );
}

export function StudentProfile({ studentId }: Props) {
  const router = useRouter();

  const { data: student, isLoading, isError } = useGetStudentById(studentId);

  const grades = student?.grades ?? [];
  const reservations = student?.reservations ?? [];
  const subjectStatus = student?.subjectStatus ?? [];

  const initials = student
    ? `${student.firstName[0]}${student.lastName[0]}`.toUpperCase()
    : "";

  return (
    <div className="flex flex-col gap-6 p-6 max-w-5xl">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => router.push("/students")}
            aria-label="Back to students"
          >
            <IconArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-7 w-52 mb-1" />
                <Skeleton className="h-4 w-36" />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold tracking-tight">
                  {student
                    ? `${student.firstName} ${student.lastName}`
                    : "Student Not Found"}
                </h1>
                {student && (
                  <p className="text-muted-foreground text-sm">
                    {student.studentNo} &middot; {student.course.code}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        {student && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/students/${studentId}/edit`)}
          >
            <IconPencil className="h-4 w-4" />
            Edit Student
          </Button>
        )}
      </div>

      {isError ? (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6 flex items-center gap-2 text-destructive text-sm">
            <IconCircleX className="h-4 w-4 shrink-0" />
            Failed to load student record.
          </CardContent>
        </Card>
      ) : (
        <>
          {/* ── Personal info ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-lg font-bold select-none">
                  {isLoading ? (
                    <Skeleton className="h-14 w-14 rounded-2xl" />
                  ) : (
                    initials
                  )}
                </div>
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Basic details for this student.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-5">
              {isLoading ? (
                <div className="grid grid-cols-2 gap-5">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  ))}
                </div>
              ) : student ? (
                <div className="grid grid-cols-2 gap-x-10 gap-y-5">
                  <InfoField
                    icon={<IconId className="h-3 w-3" />}
                    label="Student No"
                  >
                    <span className="font-mono font-semibold">
                      {student.studentNo}
                    </span>
                  </InfoField>

                  <InfoField label="Course">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{student.course.code}</Badge>
                      <span className="text-muted-foreground">
                        {student.course.name}
                      </span>
                    </div>
                  </InfoField>

                  <InfoField
                    icon={<IconMail className="h-3 w-3" />}
                    label="Email"
                  >
                    {student.email}
                  </InfoField>

                  <InfoField
                    icon={<IconCalendar className="h-3 w-3" />}
                    label="Birth Date"
                  >
                    <span className="tabular-nums">{student.birthDate}</span>
                  </InfoField>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* ── Grade Records ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconBook className="h-4 w-4 text-muted-foreground" />
                <div>
                  <CardTitle>Grade Records</CardTitle>
                  <CardDescription>
                    All subject grades enrolled by this student.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <div className="overflow-hidden rounded-b-2xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6 w-28">Code</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center w-16">Units</TableHead>
                    <TableHead className="text-center w-20">Prelim</TableHead>
                    <TableHead className="text-center w-20">Midterm</TableHead>
                    <TableHead className="text-center w-20">Finals</TableHead>
                    <TableHead className="text-center w-28">
                      Final Grade
                    </TableHead>
                    <TableHead className="text-center pr-6 w-24">
                      Remarks
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <TableRow key={i}>
                        {Array.from({ length: 8 }).map((_, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : grades.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-12 text-center text-muted-foreground text-sm"
                      >
                        No grade records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    grades.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell className="pl-6 font-mono text-xs font-medium">
                          {grade.subject.code}
                        </TableCell>
                        <TableCell className="font-medium">
                          {grade.subject.title}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {grade.subject.units}
                        </TableCell>
                        <TableCell className="text-center">
                          <GradeValue value={grade.prelim} />
                        </TableCell>
                        <TableCell className="text-center">
                          <GradeValue value={grade.midterm} />
                        </TableCell>
                        <TableCell className="text-center">
                          <GradeValue value={grade.finals} />
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          <GradeValue value={grade.finalGrade} />
                        </TableCell>
                        <TableCell className="text-center pr-6">
                          <GradeRemarksBadge remarks={grade.remarks} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* ── Reservations ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconClipboardList className="h-4 w-4 text-muted-foreground" />
                <div>
                  <CardTitle>Subject Reservations</CardTitle>
                  <CardDescription>
                    Subjects reserved by this student and their approval status.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <div className="overflow-hidden rounded-b-2xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6 w-28">Code</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center w-16">Units</TableHead>
                    <TableHead className="text-center w-32">
                      Reserved At
                    </TableHead>
                    <TableHead className="text-center pr-6 w-28">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
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
                        className="py-12 text-center text-muted-foreground text-sm"
                      >
                        No reservations found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    reservations.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="pl-6 font-mono text-xs font-medium">
                          {r.subject.code}
                        </TableCell>
                        <TableCell className="font-medium">
                          {r.subject.title}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {r.subject.units}
                        </TableCell>
                        <TableCell className="text-center text-muted-foreground text-xs tabular-nums">
                          {new Date(r.reservedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-center pr-6">
                          <ReservationStatusBadge status={r.status} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* ── Subject Status ── */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <IconCircleCheck className="h-4 w-4 text-muted-foreground" />
                <div>
                  <CardTitle>Subject Eligibility</CardTitle>
                  <CardDescription>
                    Subjects available for enrollment and their eligibility
                    status.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <div className="overflow-hidden rounded-b-2xl">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6 w-28">Code</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center w-16">Units</TableHead>
                    <TableHead className="text-center w-28">Eligible</TableHead>
                    <TableHead className="text-center w-28">Reserved</TableHead>
                    <TableHead className="pr-6">
                      Missing Prerequisites
                    </TableHead>
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
                  ) : subjectStatus.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="py-12 text-center text-muted-foreground text-sm"
                      >
                        No subject status data found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    subjectStatus.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="pl-6 font-mono text-xs font-medium">
                          {s.code}
                        </TableCell>
                        <TableCell className="font-medium">{s.title}</TableCell>
                        <TableCell className="text-center text-muted-foreground">
                          {s.units}
                        </TableCell>
                        <TableCell className="text-center">
                          {s.eligible ? (
                            <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                              <IconCircleCheck className="h-3.5 w-3.5" />
                              Eligible
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <IconCircleX className="h-3.5 w-3.5" />
                              Not Eligible
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {s.alreadyReserved ? (
                            <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                              <IconClock className="h-3.5 w-3.5" />
                              Reserved
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="pr-6">
                          {s.missingPrerequisites.length === 0 ? (
                            <span className="text-xs text-muted-foreground">
                              None
                            </span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {s.missingPrerequisites.map((p) => (
                                <span
                                  key={p.id}
                                  className="inline-flex items-center gap-0.5 rounded-md bg-destructive/10 text-destructive px-1.5 py-0.5 text-xs font-mono"
                                >
                                  <IconAlertTriangle className="h-2.5 w-2.5" />
                                  {p.prerequisiteSubject.code}
                                </span>
                              ))}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
