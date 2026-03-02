"use client";

import {
  IconBell,
  IconChevronDown,
  IconCommand,
  IconFileDescription,
  IconLayoutSidebarLeftExpand,
  IconMoon,
  IconSearch,
  IconSchool,
  IconSun,
  IconUser,
  IconUserCircle,
  IconUsers,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Kbd,
  Separator,
} from "@/components/ui";

import { useSidebar } from "@/hooks/use-sidebar";
import { useGetStudentById } from "@/hooks/api/student/use-get-student-by-id";
import { useGetCourseById } from "@/hooks/api/course/use-get-course-by-id";
import { useAuth } from "@/hooks/use-auth";
import { data, type NavRole } from "@/data/sidebar/data";
import { useQuery } from "@tanstack/react-query";
import { getStudentsApi } from "@/api-calls/student/get-students-api";
import { getCoursesApi } from "@/api-calls/course/get-courses-api";
import { getSubjectsApi } from "@/api-calls/subject/get-subjects-api";
import { getUsersApi } from "@/api-calls/user/get-users-api";
import { getMeStudentApi } from "@/api-calls/student/me/get-me-student-api";
import { getMeReservationsApi } from "@/api-calls/student/me/get-me-reservations-api";
import { getMeEligibleSubjectsApi } from "@/api-calls/student/me/get-me-eligible-subjects-api";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  students: "Students",
  courses: "Courses",
  subjects: "Subjects",
  reservations: "Reservations",
  grades: "Grading Sheet",
  enrollment: "Enrollment",
  profile: "My Profile",
  account: "Account",
  settings: "Settings",
  users: "Users",
  create: "Create",
  edit: "Edit",
  prerequisites: "Prerequisites",
};

type EntityType = "student" | "course";

interface Crumb {
  segment: string;
  href: string;
  isLast: boolean;
  entityType?: EntityType;
}

function buildBreadcrumbs(pathname: string): Crumb[] {
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => {
    const parent = segments[i - 1];
    let entityType: EntityType | undefined;
    if (!SEGMENT_LABELS[seg.toLowerCase()]) {
      if (parent === "students") entityType = "student";
      else if (parent === "courses") entityType = "course";
    }
    return {
      segment: seg,
      href: "/" + segments.slice(0, i + 1).join("/"),
      isLast: i === segments.length - 1,
      entityType,
    };
  });
}

function StudentLabel({ id }: { id: string }) {
  const { data } = useGetStudentById(id);
  if (!data) return <>{id}</>;
  return (
    <>
      {data.studentNo} – {data.firstName} {data.lastName}
    </>
  );
}

function CourseLabel({ id }: { id: string }) {
  const { data } = useGetCourseById(id);
  if (!data) return <>{id}</>;
  return (
    <>
      {data.code} – {data.name}
    </>
  );
}

function CrumbLabel({ crumb }: { crumb: Crumb }) {
  const staticLabel =
    SEGMENT_LABELS[crumb.segment.toLowerCase()] ?? crumb.segment;
  if (crumb.entityType === "student")
    return <StudentLabel id={crumb.segment} />;
  if (crumb.entityType === "course") return <CourseLabel id={crumb.segment} />;
  return <>{staticLabel}</>;
}

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const crumbs = buildBreadcrumbs(pathname);
  const { resolvedTheme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";
  const isStudent = user?.role === "student";

  const isDark = resolvedTheme === "dark";
  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
  const displayName = user?.email ? user.email.split("@")[0] : "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  const { data: studentsData } = useQuery({
    queryKey: ["palette", "students"],
    queryFn: () => getStudentsApi({ limit: 200 }),
    enabled: !!user && isAdmin,
    staleTime: 30_000,
  });

  const { data: coursesData } = useQuery({
    queryKey: ["palette", "courses"],
    queryFn: () => getCoursesApi({ limit: 200 }),
    enabled: !!user && (isAdmin || isStaff),
    staleTime: 30_000,
  });

  const { data: subjectsData } = useQuery({
    queryKey: ["palette", "subjects"],
    queryFn: () => getSubjectsApi({ limit: 200 }),
    enabled: !!user && (isAdmin || isStaff),
    staleTime: 30_000,
  });

  const { data: usersData } = useQuery({
    queryKey: ["palette", "users"],
    queryFn: () => getUsersApi({ limit: 200 }),
    enabled: !!user && isAdmin,
    staleTime: 30_000,
  });

  const { data: myStudent } = useQuery({
    queryKey: ["palette", "me", "student"],
    queryFn: () => getMeStudentApi(),
    enabled: !!user && isStudent,
    staleTime: 30_000,
  });

  const { data: myReservations } = useQuery({
    queryKey: ["palette", "me", "reservations"],
    queryFn: () => getMeReservationsApi(),
    enabled: !!user && isStudent,
    staleTime: 30_000,
  });

  const { data: myEligibleSubjects } = useQuery({
    queryKey: ["palette", "me", "eligible-subjects"],
    queryFn: () => getMeEligibleSubjectsApi(),
    enabled: !!user && isStudent,
    staleTime: 30_000,
  });

  const navCommands = useMemo(() => {
    if (!user) return [];

    return data.navMain
      .filter((item) => item.roles.includes(user.role as NavRole))
      .map((item) => ({
        title: item.title,
        href: item.url,
        icon: item.icon,
        group: item.group,
        children: (item.items ?? []).map((sub) => ({
          title: sub.title,
          href: sub.url,
        })),
      }));
  }, [user]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const studentCommands = useMemo(() => {
    if (!isAdmin) return [];
    return (studentsData?.students ?? []).map((student) => ({
      key: student.id,
      value: `${student.studentNo} ${student.firstName} ${student.lastName} ${student.email}`,
      label: `${student.studentNo} · ${student.firstName} ${student.lastName}`,
      href: `/students/${student.id}`,
      meta: student.email,
    }));
  }, [isAdmin, studentsData?.students]);

  const courseCommands = useMemo(() => {
    return (coursesData?.courses ?? []).map((course) => ({
      key: course.id,
      value: `${course.code} ${course.name} ${course.description}`,
      label: `${course.code} · ${course.name}`,
      href: `/courses/${course.id}`,
      meta: course.description,
    }));
  }, [coursesData?.courses]);

  const subjectCommands = useMemo(() => {
    return (subjectsData?.subjects ?? []).map((subject) => ({
      key: subject.id,
      value: `${subject.code} ${subject.title} ${subject.course?.code ?? ""} ${subject.course?.name ?? ""}`,
      label: `${subject.code} · ${subject.title}`,
      href: isAdmin ? `/subjects/${subject.id}/edit` : "/grades",
      meta: `${subject.course?.code ?? ""} ${subject.course?.name ?? ""}`.trim(),
    }));
  }, [isAdmin, subjectsData?.subjects]);

  const userCommands = useMemo(() => {
    if (!isAdmin) return [];
    return (usersData?.users ?? []).map((account) => ({
      key: account.id,
      value: `${account.email} ${account.role}`,
      label: account.email,
      href: "/users",
      meta: account.role,
    }));
  }, [isAdmin, usersData?.users]);

  const myReservationCommands = useMemo(() => {
    if (!isStudent) return [];
    return (myReservations ?? []).map((reservation) => ({
      key: reservation.id,
      value: `${reservation.subject.code} ${reservation.subject.title} ${reservation.status}`,
      label: `${reservation.subject.code} · ${reservation.subject.title}`,
      href: "/enrollment",
      meta: reservation.status,
    }));
  }, [isStudent, myReservations]);

  const myEligibleCommands = useMemo(() => {
    if (!isStudent) return [];
    return (myEligibleSubjects ?? []).map((subject) => ({
      key: subject.id,
      value: `${subject.code} ${subject.title} ${subject.eligible ? "eligible" : "ineligible"}`,
      label: `${subject.code} · ${subject.title}`,
      href: "/enrollment",
      meta: subject.eligible ? "Eligible" : "Missing prerequisites",
    }));
  }, [isStudent, myEligibleSubjects]);

  function goTo(href: string) {
    setSearchOpen(false);
    router.push(href);
  }

  return (
    <header className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-3 md:px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <IconLayoutSidebarLeftExpand className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-1.5 h-4" />

        <div className="min-w-0 flex-1">
          <Breadcrumb className="hidden sm:block">
            <BreadcrumbList className="flex-nowrap overflow-hidden">
              {crumbs.map((crumb) => (
                <Fragment key={crumb.href}>
                  <BreadcrumbItem className="truncate">
                    {!crumb.isLast ? (
                      <BreadcrumbLink href={crumb.href} className="truncate">
                        <CrumbLabel crumb={crumb} />
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="truncate">
                        <CrumbLabel crumb={crumb} />
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {!crumb.isLast && <BreadcrumbSeparator />}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Button
          variant="outline"
          onClick={() => setSearchOpen(true)}
          className="hidden h-8 w-full max-w-96 justify-between rounded-full px-3 text-muted-foreground md:flex"
        >
          <span className="inline-flex items-center gap-2 truncate">
            <IconSearch className="h-4 w-4" />
            Search students, courses, subjects...
          </span>

          <Kbd className="h-5 rounded-md border bg-background px-1.5 text-[10px] text-muted-foreground">
            {isMac ? "⌘K" : "Ctrl+K"}
          </Kbd>
        </Button>

        <div className="ml-1 flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
          >
            <IconSearch className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label="Notifications"
          >
            <IconBell className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <IconSun className="h-4 w-4" />
            ) : (
              <IconMoon className="h-4 w-4" />
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 gap-2 px-1.5">
                <Avatar className="h-7 w-7 rounded-full">
                  <AvatarImage src="/avatars/shadcn.jpg" alt={displayName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <IconChevronDown className="hidden h-3.5 w-3.5 sm:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{displayName}</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button onClick={() => goTo("/account")}>
                  <IconUserCircle className="mr-2 h-4 w-4" />
                  Account
                </button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button onClick={() => goTo("/settings")}>
                  <IconSettings className="mr-2 h-4 w-4" />
                  Settings
                </button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <IconLogout className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CommandDialog
        open={searchOpen}
        onOpenChange={setSearchOpen}
        title="Search"
        description="Search pages and actions"
      >
        <CommandInput placeholder="Search students, courses, subjects..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Navigation">
            {navCommands.map((item) => (
              <CommandItem
                key={item.href}
                value={`${item.title} ${item.href}`}
                onSelect={() => goTo(item.href)}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </CommandItem>
            ))}
          </CommandGroup>

          {studentCommands.length > 0 ? (
            <CommandGroup heading="Students">
              {studentCommands.map((item) => (
                <CommandItem
                  key={`student-${item.key}`}
                  value={item.value}
                  onSelect={() => goTo(item.href)}
                >
                  <IconSchool className="h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground truncate max-w-40">
                    {item.meta}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          {courseCommands.length > 0 ? (
            <CommandGroup heading="Courses">
              {courseCommands.map((item) => (
                <CommandItem
                  key={`course-${item.key}`}
                  value={item.value}
                  onSelect={() => goTo(item.href)}
                >
                  <IconFileDescription className="h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          {subjectCommands.length > 0 ? (
            <CommandGroup heading="Subjects">
              {subjectCommands.map((item) => (
                <CommandItem
                  key={`subject-${item.key}`}
                  value={item.value}
                  onSelect={() => goTo(item.href)}
                >
                  <IconSearch className="h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                  {item.meta ? (
                    <span className="ml-auto text-xs text-muted-foreground truncate max-w-36">
                      {item.meta}
                    </span>
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          {userCommands.length > 0 ? (
            <CommandGroup heading="Users">
              {userCommands.map((item) => (
                <CommandItem
                  key={`user-${item.key}`}
                  value={item.value}
                  onSelect={() => goTo(item.href)}
                >
                  <IconUsers className="h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                  <span className="ml-auto text-xs capitalize text-muted-foreground">
                    {item.meta}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          {isStudent && myStudent ? (
            <CommandGroup heading="My Profile">
              <CommandItem
                value={`${myStudent.studentNo} ${myStudent.firstName} ${myStudent.lastName} ${myStudent.email}`}
                onSelect={() => goTo("/profile")}
              >
                <IconUser className="h-4 w-4" />
                {myStudent.studentNo} · {myStudent.firstName}{" "}
                {myStudent.lastName}
              </CommandItem>
            </CommandGroup>
          ) : null}

          {myReservationCommands.length > 0 ? (
            <CommandGroup heading="My Reservations">
              {myReservationCommands.map((item) => (
                <CommandItem
                  key={`reservation-${item.key}`}
                  value={item.value}
                  onSelect={() => goTo(item.href)}
                >
                  <IconCommand className="h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {item.meta}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          {myEligibleCommands.length > 0 ? (
            <CommandGroup heading="Eligible Subjects">
              {myEligibleCommands.map((item) => (
                <CommandItem
                  key={`eligible-${item.key}`}
                  value={item.value}
                  onSelect={() => goTo(item.href)}
                >
                  <IconSearch className="h-4 w-4" />
                  <span className="truncate">{item.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {item.meta}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          <CommandGroup heading="Shortcuts">
            <CommandItem value="account" onSelect={() => goTo("/account")}>
              <IconUserCircle className="h-4 w-4" />
              Account Settings
            </CommandItem>
            <CommandItem value="settings" onSelect={() => goTo("/settings")}>
              <IconSettings className="h-4 w-4" />
              App Settings
            </CommandItem>
            <CommandItem
              value="toggle-theme"
              onSelect={() => setTheme(isDark ? "light" : "dark")}
            >
              <IconCommand className="h-4 w-4" />
              Toggle Theme
            </CommandItem>
          </CommandGroup>

          {navCommands.some((item) => item.children.length > 0) ? (
            <CommandGroup heading="Sub-pages">
              {navCommands.flatMap((item) =>
                item.children.map((sub) => (
                  <CommandItem
                    key={sub.href}
                    value={`${item.title} ${sub.title} ${sub.href}`}
                    onSelect={() => goTo(sub.href)}
                  >
                    <IconSearch className="h-4 w-4" />
                    {sub.title}
                  </CommandItem>
                )),
              )}
            </CommandGroup>
          ) : null}
        </CommandList>
      </CommandDialog>
    </header>
  );
}
