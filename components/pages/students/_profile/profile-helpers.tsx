import * as React from "react";
import { IconCircleCheck, IconCircleX, IconClock } from "@tabler/icons-react";
import { Badge } from "@/components/ui";

export function GradeRemarksBadge({
  remarks,
}: {
  remarks: "PASSED" | "FAILED" | null;
}) {
  if (!remarks) return <span className="text-muted-foreground text-xs">—</span>;
  if (remarks === "PASSED")
    return (
      <Badge className="text-xs gap-1 bg-green-600/15 text-green-700 border-green-600/20 dark:text-green-400 hover:bg-green-600/15">
        <IconCircleCheck className="h-3 w-3" />
        Passed
      </Badge>
    );
  return (
    <Badge variant="destructive" className="text-xs gap-1">
      <IconCircleX className="h-3 w-3" />
      Failed
    </Badge>
  );
}

export function GradeValue({ value }: { value: string | null }) {
  if (value === null)
    return <span className="text-muted-foreground tabular-nums">—</span>;
  return <span className="tabular-nums">{value}</span>;
}

export function ReservationStatusBadge({ status }: { status: string }) {
  if (status === "RESERVED")
    return (
      <Badge className="text-xs gap-1 bg-blue-600/15 text-blue-700 border-blue-600/20 dark:text-blue-400 hover:bg-blue-600/15">
        <IconClock className="h-3 w-3" />
        Reserved
      </Badge>
    );
  if (status === "CANCELLED")
    return (
      <Badge variant="destructive" className="gap-1 text-xs">
        <IconCircleX className="h-3 w-3" />
        Cancelled
      </Badge>
    );
  return (
    <Badge variant="secondary" className="gap-1 text-xs">
      {status}
    </Badge>
  );
}

export function InfoField({
  icon,
  label,
  children,
}: {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-xs flex items-center gap-1 uppercase tracking-wide font-medium">
        {icon}
        {label}
      </span>
      <div className="text-sm">{children}</div>
    </div>
  );
}
