import * as React from "react";

import { GradeAuditLog } from "@/data/interface/grade";
import {
  GradeRemarksBadge,
  GradeValue,
} from "@/components/pages/students/_profile/profile-helpers";
import { Badge, Skeleton } from "@/components/ui";

interface Props {
  history: GradeAuditLog[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return dateTimeFormatter.format(date);
}

function TimelineSkeleton() {
  return (
    <div className="relative pl-7">
      <span className="absolute left-[0.45rem] top-3 h-full w-px bg-border" />
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="relative pb-5">
          <span className="absolute -left-7 top-2 h-3 w-3 rounded-full bg-muted" />
          <div className="rounded-xl border bg-card/60 p-4 shadow-sm space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 5 }).map((__, idx) => (
                <Skeleton key={idx} className="h-8 w-full" />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function GradeHistoryTimeline({
  history,
  isLoading,
  isError,
  errorMessage,
}: Props) {
  const sortedHistory = React.useMemo(
    () =>
      [...history].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [history],
  );

  if (isLoading) return <TimelineSkeleton />;

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        Failed to load grade history.
        {errorMessage ? ` ${errorMessage}` : ""}
      </div>
    );
  }

  if (sortedHistory.length === 0) {
    return (
      <div className="rounded-xl border border-dashed py-14 text-center text-sm text-muted-foreground">
        No history yet.
      </div>
    );
  }

  return (
    <div className="relative pl-7">
      <span className="absolute left-[0.45rem] top-3 h-full w-px bg-border" />

      {sortedHistory.map((entry) => {
        const isCreated = entry.action === "CREATED";

        return (
          <div key={entry.id} className="relative pb-5">
            <span
              className={`absolute -left-7 top-2 h-3 w-3 rounded-full ring-4 ring-background ${
                isCreated ? "bg-emerald-500" : "bg-blue-500"
              }`}
            />

            <div className="rounded-xl border bg-card/70 shadow-sm p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm tracking-tight">
                    {entry.action} by {entry.performedBy.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(entry.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant={isCreated ? "secondary" : "outline"}>
                    {entry.action}
                  </Badge>
                  <Badge variant="outline">{entry.performedBy.role}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded-md border px-2 py-1.5">
                  <p className="text-xs text-muted-foreground">Prelim</p>
                  <GradeValue value={entry.prelim} />
                </div>
                <div className="rounded-md border px-2 py-1.5">
                  <p className="text-xs text-muted-foreground">Midterm</p>
                  <GradeValue value={entry.midterm} />
                </div>
                <div className="rounded-md border px-2 py-1.5">
                  <p className="text-xs text-muted-foreground">Finals</p>
                  <GradeValue value={entry.finals} />
                </div>
                <div className="rounded-md border px-2 py-1.5">
                  <p className="text-xs text-muted-foreground">Final Grade</p>
                  <GradeValue value={entry.finalGrade} />
                </div>
                <div className="rounded-md border px-2 py-1.5 col-span-2 flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground">Remarks</p>
                  <GradeRemarksBadge remarks={entry.remarks} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
