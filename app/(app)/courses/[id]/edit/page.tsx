"use client";

import { useParams } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

import { useGetCourses } from "@/hooks/api/course/use-get-courses";
import { EditCourseForm } from "@/components/pages/courses/_form/edit-course-form";
import { Skeleton } from "@/components/ui";

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetCourses();
  const course = data?.courses.find((c) => c.id === id);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-xl">
      <div className="flex items-center gap-3">
        <Link
          href="/courses"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back to courses"
        >
          <IconArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Course</h1>
          <p className="text-muted-foreground text-sm">
            {isLoading
              ? "Loading course…"
              : course
                ? `Update details for ${course.code} – ${course.name}.`
                : "Course not found."}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      ) : !course ? (
        <p className="text-destructive text-sm">Course not found.</p>
      ) : (
        <EditCourseForm course={course} />
      )}
    </div>
  );
}
