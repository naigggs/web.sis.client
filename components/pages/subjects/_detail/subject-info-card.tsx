"use client";

import * as React from "react";
import {
  IconBook2,
  IconCode,
  IconHash,
  IconSchool,
  IconCalendar,
} from "@tabler/icons-react";

import { SubjectResponse } from "@/data/interface/subject";
import {
  Badge,
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
  subject: SubjectResponse | undefined;
  isLoading: boolean;
}

export function SubjectInfoCard({ subject, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-lg font-bold select-none">
            {isLoading ? (
              <Skeleton className="h-14 w-14 rounded-2xl" />
            ) : (
              (subject?.code?.slice(0, 2) ?? "SU")
            )}
          </div>
          <div>
            <CardTitle>Subject Information</CardTitle>
            <CardDescription>Core details for this subject.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-40" />
              </div>
            ))}
          </div>
        ) : subject ? (
          <div className="grid grid-cols-2 gap-x-10 gap-y-5">
            <InfoField icon={<IconCode className="h-3 w-3" />} label="Code">
              <span className="font-mono font-semibold">{subject.code}</span>
            </InfoField>

            <InfoField icon={<IconBook2 className="h-3 w-3" />} label="Title">
              {subject.title}
            </InfoField>

            <InfoField icon={<IconHash className="h-3 w-3" />} label="Units">
              <Badge variant="outline">{subject.units}</Badge>
            </InfoField>

            <InfoField icon={<IconSchool className="h-3 w-3" />} label="Course">
              <Badge variant="secondary">{subject.course.code}</Badge>
            </InfoField>

            <InfoField
              icon={<IconCalendar className="h-3 w-3" />}
              label="Created At"
            >
              <span className="tabular-nums">
                {new Date(subject.createdAt).toLocaleDateString()}
              </span>
            </InfoField>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Subject not found.</p>
        )}
      </CardContent>
    </Card>
  );
}
