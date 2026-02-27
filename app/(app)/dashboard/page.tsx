"use client";

import { useAuth } from "@/hooks/use-auth";
import { AdminDashboard } from "@/components/pages/dashboard/admin-dashboard";
import { StaffDashboard } from "@/components/pages/dashboard/staff-dashboard";
import { StudentDashboard } from "@/components/pages/dashboard/student-dashboard";
import { Skeleton } from "@/components/ui";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (user.role === "admin") return <AdminDashboard user={user} />;
  if (user.role === "staff") return <StaffDashboard user={user} />;
  return <StudentDashboard user={user} />;
}
