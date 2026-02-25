"use client";

import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconMail,
  IconCalendar,
  IconId,
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
  return (
    <Badge
      variant={remarks === "PASSED" ? "default" : "destructive"}
      className="text-xs"
    >
      {remarks}
    </Badge>
  );
}

function GradeValue({ value }: { value: string | null }) {
  if (value === null) return <span className="text-muted-foreground">—</span>;
  return <span>{value}</span>;
}

export function StudentProfile({ studentId }: Props) {
  const router = useRouter();

  const {
    data: student,
    isLoading: loadingStudent,
    isError,
  } = useGetStudentById(studentId);
  const grades = student?.grades ?? [];

  return (
    <div className="flex flex-col gap-6 p-6 max-w-4xl">
      {/* ── Back ── */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => router.push("/students")}
          aria-label="Back to students"
        >
          <IconArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          {loadingStudent ? (
            <>
              <Skeleton className="h-6 w-48 mb-1" />
              <Skeleton className="h-4 w-32" />
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
                  Student profile &amp; grade records
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {isError ? (
        <p className="text-destructive text-sm">Failed to load student.</p>
      ) : (
        <>
          {/* ── Info card ── */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic details for this student.</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              {loadingStudent ? (
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  ))}
                </div>
              ) : student ? (
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted-foreground text-xs flex items-center gap-1">
                      <IconId className="h-3 w-3" /> Student No
                    </span>
                    <span className="font-mono text-sm font-medium">
                      {student.studentNo}
                    </span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted-foreground text-xs">
                      Course
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{student.course.code}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {student.course.name}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted-foreground text-xs flex items-center gap-1">
                      <IconMail className="h-3 w-3" /> Email
                    </span>
                    <span className="text-sm">{student.email}</span>
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-muted-foreground text-xs flex items-center gap-1">
                      <IconCalendar className="h-3 w-3" /> Birth Date
                    </span>
                    <span className="text-sm tabular-nums">
                      {student.birthDate}
                    </span>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* ── Grades card ── */}
          <Card>
            <CardHeader>
              <CardTitle>Grade Records</CardTitle>
              <CardDescription>
                All subject grades for this student.
              </CardDescription>
            </CardHeader>
            <Separator />
            <div className="rounded-b-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Units</TableHead>
                    <TableHead className="text-center">Prelim</TableHead>
                    <TableHead className="text-center">Midterm</TableHead>
                    <TableHead className="text-center">Finals</TableHead>
                    <TableHead className="text-center">Final Grade</TableHead>
                    <TableHead className="text-center">Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingStudent ? (
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
                        className="py-12 text-center text-muted-foreground"
                      >
                        No grade records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    grades.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell className="font-mono text-xs">
                          {grade.subject.code}
                        </TableCell>
                        <TableCell>{grade.subject.title}</TableCell>
                        <TableCell className="text-center tabular-nums">
                          {grade.subject.units}
                        </TableCell>
                        <TableCell className="text-center tabular-nums">
                          <GradeValue value={grade.prelim} />
                        </TableCell>
                        <TableCell className="text-center tabular-nums">
                          <GradeValue value={grade.midterm} />
                        </TableCell>
                        <TableCell className="text-center tabular-nums">
                          <GradeValue value={grade.finals} />
                        </TableCell>
                        <TableCell className="text-center tabular-nums font-medium">
                          <GradeValue value={grade.finalGrade} />
                        </TableCell>
                        <TableCell className="text-center">
                          <GradeRemarksBadge remarks={grade.remarks} />
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
