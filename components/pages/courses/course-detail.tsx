"use client";

import { useRouter } from "next/navigation";
import { IconArrowLeft, IconCircleX, IconPencil } from "@tabler/icons-react";

import { useGetCourseById } from "@/hooks/api/course/use-get-course-by-id";
import { Button, Card, CardContent, Skeleton } from "@/components/ui";

import { CourseInfoCard } from "./_detail/course-info-card";
import { CourseSubjectsCard } from "./_detail/course-subjects-card";

interface Props {
  courseId: string;
}

export function CourseDetail({ courseId }: Props) {
  const router = useRouter();

  const { data: course, isLoading, isError } = useGetCourseById(courseId);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-8xl">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => router.push("/courses")}
            aria-label="Back to courses"
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
                  {course ? course.name : "Course Not Found"}
                </h1>
                {course && (
                  <p className="text-muted-foreground text-sm">{course.code}</p>
                )}
              </>
            )}
          </div>
        </div>

        {course && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/courses/${courseId}/edit`)}
          >
            <IconPencil className="h-4 w-4" />
            Edit Course
          </Button>
        )}
      </div>

      {isError ? (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6 flex items-center gap-2 text-destructive text-sm">
            <IconCircleX className="h-4 w-4 shrink-0" />
            Failed to load course record.
          </CardContent>
        </Card>
      ) : (
        <>
          <CourseInfoCard course={course} isLoading={isLoading} />
          <CourseSubjectsCard
            courseId={courseId}
            subjects={course?.subjects ?? []}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}
