"use client";

import { useParams } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

import { useGetSubjectById } from "@/hooks/api/subject/use-get-subject-by-id";
import { SubjectPrerequisitesCard } from "@/components/pages/subjects/_detail/subject-prerequisites-card";
import { EditSubjectForm } from "@/components/pages/subjects/_form/edit-subject-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
} from "@/components/ui";

export default function EditSubjectPage() {
  const { id } = useParams<{ id: string }>();
  const { data: subject, isLoading, isError } = useGetSubjectById(id);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 p-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Link
              href={`/subjects/${id}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Back to subject"
            >
              <IconArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Edit Subject
              </h1>
              <p className="text-muted-foreground text-sm">
                {isLoading
                  ? "Loading subject…"
                  : subject
                    ? `Update details for ${subject.code} – ${subject.title}.`
                    : "Subject not found."}
              </p>
            </div>
          </div>
          <Separator />
          <p className="text-sm text-muted-foreground">
            Review subject metadata and prerequisite relationships carefully to
            avoid enrollment conflicts.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subject Details</CardTitle>
            <CardDescription>
              Update core subject information and course assignment.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-full" />
                  </div>
                ))}
              </div>
            ) : isError || !subject ? (
              <p className="text-destructive text-sm">
                Failed to load subject.
              </p>
            ) : (
              <EditSubjectForm subject={subject} />
            )}
          </CardContent>
        </Card>
      </div>

      {!isLoading && !isError && subject ? (
        <SubjectPrerequisitesCard
          subjectId={subject.id}
          subjectCode={subject.code}
        />
      ) : null}
    </div>
  );
}
