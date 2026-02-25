"use client";

import { useParams } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

import { useGetStudentById } from "@/hooks/api/student/use-get-student-by-id";
import { EditStudentForm } from "@/components/pages/students/edit-student-form";
import { Skeleton } from "@/components/ui";

export default function EditStudentPage() {
  const { id } = useParams<{ id: string }>();
  const { data: student, isLoading, isError } = useGetStudentById(id);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-xl">
      <div className="flex items-center gap-3">
        <Link
          href="/students"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back to students"
        >
          <IconArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Student</h1>
          <p className="text-muted-foreground text-sm">
            {isLoading
              ? "Loading student…"
              : student
                ? `Update details for ${student.firstName} ${student.lastName}.`
                : "Student not found."}
          </p>
        </div>
      </div>

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
        <p className="text-destructive text-sm">Failed to load student.</p>
      ) : (
        <EditStudentForm student={student} />
      )}
    </div>
  );
}
