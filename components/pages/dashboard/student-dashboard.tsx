"use client";

import { useRouter } from "next/navigation";
import {
  IconCalendarCheck,
  IconBook2,
  IconChartBar,
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
import { StatusBadge } from "@/components/shared/status-badge";
import { StatCard } from "@/components/shared/stat-card";

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
          title="Active Reservations"
          value={activeReservations.length}
          loading={reservationsLoading}
          icon={<IconCalendarCheck className="h-4 w-4" />}
          tone="sky"
          description="Reserved or approved subjects"
        />
        <StatCard
          title="Grades Received"
          value={gradedCount}
          loading={meLoading}
          icon={<IconChartBar className="h-4 w-4" />}
          tone="emerald"
          description="Subjects with final grade"
        />
        <StatCard
          title="Eligible Subjects"
          value={eligibleCount}
          loading={eligibleLoading}
          icon={<IconBook2 className="h-4 w-4" />}
          tone="teal"
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
                      <StatusBadge
                        kind="reservation"
                        status={r.status as ReservationStatus}
                      />
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
