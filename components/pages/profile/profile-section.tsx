"use client";

import * as React from "react";
import {
  IconUser,
  IconSchool,
  IconMail,
  IconCalendar,
} from "@tabler/icons-react";

import { useGetMeStudent } from "@/hooks/api/student/me/use-get-me-student";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Skeleton,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui";
import {
  GradeValue,
  GradeRemarksBadge,
} from "@/components/pages/students/_profile/profile-helpers";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm text-muted-foreground w-24 shrink-0">
        {label}
      </span>
      <span className="text-sm font-medium">{value ?? "—"}</span>
    </div>
  );
}

export function ProfileSection() {
  const { data: student, isLoading } = useGetMeStudent();

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  const grades = student?.grades ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your personal information and academic records.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
        {/* ── Profile card ───────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <IconUser className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">
                  {student ? `${student.firstName} ${student.lastName}` : "—"}
                </CardTitle>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">
                  {student?.studentNo}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="divide-y">
            <InfoRow
              icon={<IconMail className="h-4 w-4" />}
              label="Email"
              value={student?.email}
            />
            <InfoRow
              icon={<IconCalendar className="h-4 w-4" />}
              label="Birth Date"
              value={student?.birthDate}
            />
            <InfoRow
              icon={<IconSchool className="h-4 w-4" />}
              label="Course"
              value={
                student?.course
                  ? `${student.course.code} — ${student.course.name}`
                  : undefined
              }
            />
          </CardContent>
        </Card>

        {/* ── Grades table ───────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Academic Grades</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-center">Prelim</TableHead>
                  <TableHead className="text-center">Midterm</TableHead>
                  <TableHead className="text-center">Finals</TableHead>
                  <TableHead className="text-center">Final Grade</TableHead>
                  <TableHead className="text-center">Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground py-10"
                    >
                      No grade records yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  grades.map((g) => (
                    <TableRow key={g.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-muted-foreground">
                            {g.subject?.code}
                          </span>
                          <span className="text-sm">{g.subject?.title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <GradeValue value={g.prelim} />
                      </TableCell>
                      <TableCell className="text-center">
                        <GradeValue value={g.midterm} />
                      </TableCell>
                      <TableCell className="text-center">
                        <GradeValue value={g.finals} />
                      </TableCell>
                      <TableCell className="text-center">
                        <GradeValue value={g.finalGrade} />
                      </TableCell>
                      <TableCell className="text-center">
                        <GradeRemarksBadge remarks={g.remarks} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
