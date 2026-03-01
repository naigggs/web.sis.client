"use client";

import { useRouter } from "next/navigation";
import {
  IconUsers,
  IconBook,
  IconBook2,
  IconUserCog,
  IconPlus,
  IconChartBar,
  IconCalendarCheck,
} from "@tabler/icons-react";

import { useGetStudents } from "@/hooks/api/student/use-get-students";
import { useGetCourses } from "@/hooks/api/course/use-get-courses";
import { useGetSubjects } from "@/hooks/api/subject/use-get-subjects";
import { useGetUsers } from "@/hooks/api/user/use-get-users";
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
  iconBg?: string;
}

function StatCard({
  label,
  value,
  isLoading,
  icon,
  description,
  iconBg = "bg-muted text-muted-foreground",
}: StatCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="pt-5">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-0.5">
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
              {label}
            </span>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mt-1" />
            ) : (
              <p className="text-3xl font-bold tabular-nums">
                {value?.toLocaleString() ?? "—"}
              </p>
            )}
          </div>
          <div className={`p-2.5 rounded-xl ${iconBg}`}>{icon}</div>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface Props {
  user: UserResponse;
}

export function AdminDashboard({ user }: Props) {
  const router = useRouter();

  const { data: studentsData, isLoading: studentsLoading } = useGetStudents({
    limit: 1,
  });
  const { data: coursesData, isLoading: coursesLoading } = useGetCourses({
    limit: 1,
  });
  const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjects({
    limit: 1,
  });
  const { data: usersData, isLoading: usersLoading } = useGetUsers({
    limit: 1,
  });

  const totalStudents =
    studentsData?.pagination?.totalItems ?? studentsData?.students.length;
  const totalCourses =
    coursesData?.pagination?.totalItems ?? coursesData?.courses.length;
  const totalSubjects =
    subjectsData?.pagination?.totalItems ?? subjectsData?.subjects.length;
  const totalUsers =
    usersData?.pagination?.totalItems ?? usersData?.users.length;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <Badge variant="secondary" className="capitalize">
              {user.role}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Welcome back, <span className="font-medium">{user.email}</span>.
            Here's an overview of the system.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Students"
          value={totalStudents}
          isLoading={studentsLoading}
          icon={<IconUsers className="h-4 w-4" />}
          iconBg="bg-blue-500/10 text-blue-600 dark:text-blue-400"
          description="Registered students"
        />
        <StatCard
          label="Total Courses"
          value={totalCourses}
          isLoading={coursesLoading}
          icon={<IconBook className="h-4 w-4" />}
          iconBg="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          description="Available degree programs"
        />
        <StatCard
          label="Total Subjects"
          value={totalSubjects}
          isLoading={subjectsLoading}
          icon={<IconBook2 className="h-4 w-4" />}
          iconBg="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          description="Subjects across all courses"
        />
        <StatCard
          label="Total Users"
          value={totalUsers}
          isLoading={usersLoading}
          icon={<IconUserCog className="h-4 w-4" />}
          iconBg="bg-orange-500/10 text-orange-600 dark:text-orange-400"
          description="System accounts"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for administrators.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/students/create")}
            >
              <IconPlus className="h-5 w-5" />
              <span className="text-xs">Add Student</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/courses/create")}
            >
              <IconPlus className="h-5 w-5" />
              <span className="text-xs">Add Course</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/subjects/create")}
            >
              <IconPlus className="h-5 w-5" />
              <span className="text-xs">Add Subject</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/reservations")}
            >
              <IconCalendarCheck className="h-5 w-5" />
              <span className="text-xs">Reservations</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/grades")}
            >
              <IconChartBar className="h-5 w-5" />
              <span className="text-xs">Grading Sheet</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/users")}
            >
              <IconUserCog className="h-5 w-5" />
              <span className="text-xs">Manage Users</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
