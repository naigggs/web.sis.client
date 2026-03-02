"use client";

import { useParams } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";

import { useGetSubjectById } from "@/hooks/api/subject/use-get-subject-by-id";
import { EditSubjectForm } from "@/components/pages/subjects/_form/edit-subject-form";
import { Skeleton } from "@/components/ui";

export default function EditSubjectPage() {
  const { id } = useParams<{ id: string }>();
  const { data: subject, isLoading, isError } = useGetSubjectById(id);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-8xl">
      <div className="flex items-center gap-3">
        <Link
          href={`/subjects/${id}`}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Back to subject"
        >
          <IconArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Subject</h1>
          <p className="text-muted-foreground text-sm">
            {isLoading
              ? "Loading subject…"
              : subject
                ? `Update details for ${subject.code} – ${subject.title}.`
                : "Subject not found."}
          </p>
        </div>
      </div>

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
        <p className="text-destructive text-sm">Failed to load subject.</p>
      ) : (
        <EditSubjectForm subject={subject} />
      )}
    </div>
  );
}
