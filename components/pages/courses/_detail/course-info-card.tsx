"use client";

import * as React from "react";
import {
  IconCode,
  IconBook,
  IconAlignLeft,
  IconCalendar,
} from "@tabler/icons-react";

import { CourseWithSubjectsResponse } from "@/data/interface/course";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
} from "@/components/ui";

interface InfoFieldProps {
  icon?: React.ReactNode;
  label: string;
  children: React.ReactNode;
}

function InfoField({ icon, label, children }: InfoFieldProps) {
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

interface Props {
  course: CourseWithSubjectsResponse | undefined;
  isLoading: boolean;
}

export function CourseInfoCard({ course, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-lg font-bold select-none">
            {isLoading ? (
              <Skeleton className="h-14 w-14 rounded-2xl" />
            ) : (
              (course?.code?.slice(0, 2) ?? "CO")
            )}
          </div>
          <div>
            <CardTitle>Course Information</CardTitle>
            <CardDescription>Details for this course.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </div>
        ) : course ? (
          <div className="grid grid-cols-2 gap-x-10 gap-y-5">
            <InfoField icon={<IconCode className="h-3 w-3" />} label="Code">
              <span className="font-mono font-semibold">{course.code}</span>
            </InfoField>

            <InfoField icon={<IconBook className="h-3 w-3" />} label="Name">
              {course.name}
            </InfoField>

            <InfoField
              icon={<IconAlignLeft className="h-3 w-3" />}
              label="Description"
            >
              {course.description || (
                <span className="text-muted-foreground">—</span>
              )}
            </InfoField>

            <InfoField
              icon={<IconCalendar className="h-3 w-3" />}
              label="Created At"
            >
              <span className="tabular-nums">
                {new Date(course.createdAt).toLocaleDateString()}
              </span>
            </InfoField>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No course data.</p>
        )}
      </CardContent>
    </Card>
  );
}
