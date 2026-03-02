import * as React from "react";

import { Card, CardContent, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";

type StatTone = "emerald" | "teal" | "amber" | "sky" | "rose" | "neutral";

const TONE_STYLES: Record<StatTone, string> = {
  emerald: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  teal: "bg-teal-500/15 text-teal-700 dark:text-teal-300",
  amber: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  sky: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  rose: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  neutral: "bg-muted text-muted-foreground",
};

export interface StatCardProps {
  title: string;
  value?: string | number;
  description?: string;
  icon: React.ReactNode;
  tone?: StatTone;
  trend?: string;
  loading?: boolean;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  tone = "neutral",
  trend,
  loading = false,
}: StatCardProps) {
  return (
    <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="pt-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              {title}
            </p>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <p className="text-3xl font-bold tabular-nums">{value ?? "—"}</p>
            )}
          </div>
          <div className={cn("rounded-xl p-2.5", TONE_STYLES[tone])}>
            {icon}
          </div>
        </div>
        {(description || trend) && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-muted-foreground text-xs">{description}</p>
            {trend ? (
              <p className="text-xs font-medium text-primary">{trend}</p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
