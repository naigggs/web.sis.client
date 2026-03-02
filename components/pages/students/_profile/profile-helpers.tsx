import * as React from "react";
import { StatusBadge } from "@/components/shared/status-badge";

export function GradeRemarksBadge({
  remarks,
}: {
  remarks: "PASSED" | "FAILED" | null;
}) {
  return <StatusBadge kind="grade" status={remarks} />;
}

export function GradeValue({ value }: { value: string | null }) {
  if (value === null)
    return <span className="text-muted-foreground tabular-nums">—</span>;
  return <span className="tabular-nums">{value}</span>;
}

export function ReservationStatusBadge({ status }: { status: string }) {
  return <StatusBadge kind="reservation" status={status} />;
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
