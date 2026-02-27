"use client";

import { useRouter } from "next/navigation";
import {
  IconUsers,
  IconBook2,
  IconChartBar,
  IconFileSpreadsheet,
} from "@tabler/icons-react";

import { useGetStudents } from "@/hooks/api/student/use-get-students";
import { useGetSubjects } from "@/hooks/api/subject/use-get-subjects";
import { useGetGrades } from "@/hooks/api/grade/use-get-grades";
import { UserResponse } from "@/data/interface/user";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
} from "@/components/ui";

interface StatCardProps {
  label: string;
  value: number | undefined;
  isLoading: boolean;
  icon: React.ReactNode;
  description?: string;
}

function StatCard({
  label,
  value,
  isLoading,
  icon,
  description,
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-muted-foreground text-sm font-medium">
            {label}
          </span>
          <div className="p-2 rounded-lg bg-muted">{icon}</div>
        </div>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <p className="text-3xl font-bold tabular-nums">
            {value?.toLocaleString() ?? "—"}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface Props {
  user: UserResponse;
}

export function StaffDashboard({ user }: Props) {
  const router = useRouter();

  const { data: studentsData, isLoading: studentsLoading } = useGetStudents({
    limit: 1,
  });
  const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjects({
    limit: 1,
  });
  const { data: gradesData, isLoading: gradesLoading } = useGetGrades({
    limit: 1,
  });

  const totalStudents =
    studentsData?.pagination?.totalItems ?? studentsData?.students.length;
  const totalSubjects =
    subjectsData?.pagination?.totalItems ?? subjectsData?.subjects.length;
  const totalGrades =
    gradesData?.pagination?.totalItems ?? gradesData?.grades.length;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <Badge variant="secondary" className="capitalize">
            {user.role}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Welcome back, <span className="font-medium">{user.email}</span>.
          Here's an overview of your scope.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Students"
          value={totalStudents}
          isLoading={studentsLoading}
          icon={<IconUsers className="h-4 w-4 text-muted-foreground" />}
          description="Registered students"
        />
        <StatCard
          label="Total Subjects"
          value={totalSubjects}
          isLoading={subjectsLoading}
          icon={<IconBook2 className="h-4 w-4 text-muted-foreground" />}
          description="Subjects across all courses"
        />
        <StatCard
          label="Grade Records"
          value={totalGrades}
          isLoading={gradesLoading}
          icon={<IconChartBar className="h-4 w-4 text-muted-foreground" />}
          description="Total grade entries"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for staff members.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/grades")}
            >
              <IconFileSpreadsheet className="h-5 w-5" />
              <span className="text-xs">Grading Sheet</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/students")}
            >
              <IconUsers className="h-5 w-5" />
              <span className="text-xs">View Students</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/subjects")}
            >
              <IconBook2 className="h-5 w-5" />
              <span className="text-xs">View Subjects</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
