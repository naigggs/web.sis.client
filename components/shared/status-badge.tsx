import * as React from "react";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconCircleX,
  IconClock,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui";

type ReservationStatus = "RESERVED" | "APPROVED" | "DENIED" | "CANCELLED";
type GradeStatus = "PASSED" | "FAILED" | null;

type StatusKind = "reservation" | "grade";

interface StatusBadgeProps {
  kind: StatusKind;
  status: ReservationStatus | GradeStatus | string;
}

export function StatusBadge({ kind, status }: StatusBadgeProps) {
  if (!status) return <span className="text-muted-foreground text-xs">—</span>;

  if (kind === "reservation") {
    if (status === "RESERVED") {
      return (
        <Badge className="gap-1 border-blue-600/20 bg-blue-600/15 text-xs text-blue-700 hover:bg-blue-600/15 dark:text-blue-400">
          <IconClock className="h-3 w-3" />
          Reserved
        </Badge>
      );
    }

    if (status === "APPROVED") {
      return (
        <Badge className="gap-1 border-green-600/20 bg-green-600/15 text-xs text-green-700 hover:bg-green-600/15 dark:text-green-400">
          <IconCircleCheck className="h-3 w-3" />
          Approved
        </Badge>
      );
    }

    if (status === "DENIED") {
      return (
        <Badge variant="destructive" className="gap-1 text-xs">
          <IconCircleX className="h-3 w-3" />
          Denied
        </Badge>
      );
    }

    if (status === "CANCELLED") {
      return (
        <Badge variant="secondary" className="gap-1 text-xs">
          <IconAlertTriangle className="h-3 w-3" />
          Cancelled
        </Badge>
      );
    }
  }

  if (kind === "grade") {
    if (status === "PASSED") {
      return (
        <Badge className="gap-1 border-green-600/20 bg-green-600/15 text-xs text-green-700 hover:bg-green-600/15 dark:text-green-400">
          <IconCircleCheck className="h-3 w-3" />
          Passed
        </Badge>
      );
    }

    if (status === "FAILED") {
      return (
        <Badge variant="destructive" className="gap-1 text-xs">
          <IconCircleX className="h-3 w-3" />
          Failed
        </Badge>
      );
    }
  }

  return <Badge variant="secondary">{status}</Badge>;
}
