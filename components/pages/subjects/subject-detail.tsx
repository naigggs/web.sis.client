"use client";

import { useRouter } from "next/navigation";
import { IconArrowLeft, IconCircleX, IconPencil } from "@tabler/icons-react";

import { useGetSubjectById } from "@/hooks/api/subject/use-get-subject-by-id";
import { Button, Card, CardContent, Skeleton } from "@/components/ui";

import { SubjectInfoCard } from "./_detail/subject-info-card";
import { SubjectPrerequisitesCard } from "./_detail/subject-prerequisites-card";
import { SubjectEnrolledStudentsCard } from "./_detail/subject-enrolled-students-card";

interface Props {
  subjectId: string;
}

export function SubjectDetail({ subjectId }: Props) {
  const router = useRouter();

  const { data: subject, isLoading, isError } = useGetSubjectById(subjectId);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-8xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => router.push("/subjects")}
            aria-label="Back to subjects"
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
                  {subject ? subject.title : "Subject Not Found"}
                </h1>
                {subject && (
                  <p className="text-muted-foreground text-sm">
                    {subject.code}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {subject && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/subjects/${subjectId}/edit`)}
          >
            <IconPencil className="h-4 w-4" />
            Edit Subject
          </Button>
        )}
      </div>

      {isError ? (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6 flex items-center gap-2 text-destructive text-sm">
            <IconCircleX className="h-4 w-4 shrink-0" />
            Failed to load subject record.
          </CardContent>
        </Card>
      ) : (
        <>
          <SubjectInfoCard subject={subject} isLoading={isLoading} />
          {!!subject && (
            <SubjectPrerequisitesCard
              subjectId={subjectId}
              subjectCode={subject.code}
            />
          )}
          {!!subject && <SubjectEnrolledStudentsCard subjectId={subjectId} />}
        </>
      )}
    </div>
  );
}
