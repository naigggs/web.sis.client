"use client";

import { useRouter } from "next/navigation";
import { IconArrowLeft, IconCircleX, IconPencil } from "@tabler/icons-react";

import { useGetStudentById } from "@/hooks/api/student/use-get-student-by-id";
import { Button, Card, CardContent, Skeleton } from "@/components/ui";

import { StudentInfoCard } from "./_profile/student-info-card";
import { GradeRecordsCard } from "./_profile/grade-records-card";
import { ReservationsCard } from "./_profile/reservations-card";
import { SubjectEligibilityCard } from "./_profile/subject-eligibility-card";

interface Props {
  studentId: string;
}

export function StudentProfile({ studentId }: Props) {
  const router = useRouter();

  const { data: student, isLoading, isError } = useGetStudentById(studentId);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-8xl">
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
          <StudentInfoCard student={student} isLoading={isLoading} />
          <GradeRecordsCard
            grades={student?.grades ?? []}
            isLoading={isLoading}
          />
          <ReservationsCard
            reservations={student?.reservations ?? []}
            isLoading={isLoading}
          />
          <SubjectEligibilityCard
            subjectStatus={student?.subjectStatus ?? []}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}
