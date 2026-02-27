"use client";

import { useRouter } from "next/navigation";
import {
  IconCalendarCheck,
  IconBook2,
  IconChartBar,
  IconCircleCheck,
  IconCircleX,
  IconClock,
  IconAlertTriangle,
} from "@tabler/icons-react";

import { useGetMeStudent } from "@/hooks/api/student/me/use-get-me-student";
import { useGetMeReservations } from "@/hooks/api/student/me/use-get-me-reservations";
import { useGetMeEligibleSubjects } from "@/hooks/api/student/me/use-get-me-eligible-subjects";
import {
  ReservationResponse,
  ReservationStatus,
} from "@/data/interface/reservation";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

function ReservationStatusBadge({ status }: { status: ReservationStatus }) {
  if (status === "RESERVED")
    return (
      <Badge className="text-xs gap-1 bg-blue-600/15 text-blue-700 border-blue-600/20 dark:text-blue-400 hover:bg-blue-600/15">
        <IconClock className="h-3 w-3" />
        Reserved
      </Badge>
    );
  if (status === "APPROVED")
    return (
      <Badge className="text-xs gap-1 bg-green-600/15 text-green-700 border-green-600/20 dark:text-green-400 hover:bg-green-600/15">
        <IconCircleCheck className="h-3 w-3" />
        Approved
      </Badge>
    );
  if (status === "DENIED")
    return (
      <Badge variant="destructive" className="text-xs gap-1">
        <IconCircleX className="h-3 w-3" />
        Denied
      </Badge>
    );
  return (
    <Badge variant="secondary" className="text-xs gap-1">
      <IconAlertTriangle className="h-3 w-3" />
      Cancelled
    </Badge>
  );
}

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

export function StudentDashboard({ user }: Props) {
  const router = useRouter();

  const { data: meStudent, isLoading: meLoading } = useGetMeStudent();
  const { data: reservationsData, isLoading: reservationsLoading } =
    useGetMeReservations();
  const { data: eligibleSubjects, isLoading: eligibleLoading } =
    useGetMeEligibleSubjects();

  const reservations = reservationsData ?? [];
  const activeReservations = reservations.filter(
    (r) => r.status === "RESERVED" || r.status === "APPROVED",
  );
  const gradedCount =
    meStudent?.grades?.filter((g) => g.finalGrade !== null).length ?? 0;
  const eligibleCount = eligibleSubjects?.filter((s) => s.eligible).length ?? 0;

  const displayName = meStudent
    ? `${meStudent.firstName} ${meStudent.lastName}`
    : user.email;

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
        {meLoading ? (
          <Skeleton className="h-4 w-64" />
        ) : (
          <p className="text-muted-foreground text-sm">
            Welcome back, <span className="font-medium">{displayName}</span>.
            {meStudent?.course && (
              <>
                {" "}
                &middot;{" "}
                <span className="font-medium">
                  {meStudent.course.code}
                </span> — {meStudent.course.name}
              </>
            )}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Active Reservations"
          value={activeReservations.length}
          isLoading={reservationsLoading}
          icon={<IconCalendarCheck className="h-4 w-4 text-muted-foreground" />}
          description="Reserved or approved subjects"
        />
        <StatCard
          label="Grades Received"
          value={gradedCount}
          isLoading={meLoading}
          icon={<IconChartBar className="h-4 w-4 text-muted-foreground" />}
          description="Subjects with final grade"
        />
        <StatCard
          label="Eligible Subjects"
          value={eligibleCount}
          isLoading={eligibleLoading}
          icon={<IconBook2 className="h-4 w-4 text-muted-foreground" />}
          description="Subjects you can enroll in"
        />
      </div>

      {/* Recent Reservations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Reservations</CardTitle>
            <CardDescription>
              Your subject reservations and their current status.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/enrollment")}
          >
            View All
          </Button>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          {reservationsLoading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : reservations.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No reservations yet. Visit{" "}
              <button
                onClick={() => router.push("/enrollment")}
                className="underline"
              >
                My Enrollment
              </button>{" "}
              to reserve subjects.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.slice(0, 5).map((r: ReservationResponse) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.subject.title}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {r.subject.code}
                    </TableCell>
                    <TableCell>{r.subject.units}</TableCell>
                    <TableCell>
                      <ReservationStatusBadge status={r.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Shortcuts to common student tasks.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/enrollment")}
            >
              <IconCalendarCheck className="h-5 w-5" />
              <span className="text-xs">My Enrollment</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex-col gap-2 py-4"
              onClick={() => router.push("/profile")}
            >
              <IconChartBar className="h-5 w-5" />
              <span className="text-xs">My Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
