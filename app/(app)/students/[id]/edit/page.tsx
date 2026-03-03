"use client";

import { useParams } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

import { useGetStudentById } from "@/hooks/api/student/use-get-student-by-id";
import { EditStudentForm } from "@/components/pages/students/_form/edit-student-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
} from "@/components/ui";

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const { data: student, isLoading, isError } = useGetStudentById(id);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/students"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Back to students"
            >
              <IconArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Edit Student
              </h1>
              <p className="text-muted-foreground text-sm">
                {isLoading
                  ? "Loading student…"
                  : student
                    ? `Update details for ${student.firstName} ${student.lastName}.`
                    : "Student not found."}
              </p>
            </div>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            Keep student profile data accurate to avoid enrollment and grading
            inconsistencies.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Student Details</CardTitle>
            <CardDescription>
              Edit personal and academic assignment information.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                ))}
              </div>
            ) : isError || !student ? (
              <p className="text-destructive text-sm">
                Failed to load student.
              </p>
            ) : (
              <EditStudentForm student={student} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
