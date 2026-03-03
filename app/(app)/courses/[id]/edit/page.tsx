"use client";

import { useParams } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

import { useGetCourseById } from "@/hooks/api/course/use-get-course-by-id";
import { EditCourseForm } from "@/components/pages/courses/_form/edit-course-form";
import { CourseSubjectsCard } from "@/components/pages/courses/_detail/course-subjects-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
} from "@/components/ui";

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const { data: course, isLoading, isError } = useGetCourseById(id);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/courses/${id}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Back to course"
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
          <Separator />
          <p className="text-sm text-muted-foreground">
            Keep course information and subject assignments in sync to maintain
            curriculum accuracy.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>
              Update core information for this degree program.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                ))}
              </div>
            ) : isError || !course ? (
              <p className="text-destructive text-sm">Course not found.</p>
            ) : (
              <EditCourseForm course={course} />
            )}
          </CardContent>
        </Card>
      </div>

      {!isLoading && !isError && course ? (
        <CourseSubjectsCard
          courseId={course.id}
          subjects={course.subjects}
          isLoading={false}
        />
      ) : null}
    </div>
  );
}
