"use client";

import { Moon, Sun, SidebarIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Separator,
} from "@/components/ui";

import { useSidebar } from "@/hooks/use-sidebar";
import { useGetStudentById } from "@/hooks/api/student/use-get-student-by-id";
import { useGetCourseById } from "@/hooks/api/course/use-get-course-by-id";

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
  const pathname = usePathname();
  const crumbs = buildBreadcrumbs(pathname);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const html = document.documentElement;
    const nowDark = html.classList.toggle("dark");
    setIsDark(nowDark);
    localStorage.setItem("theme", nowDark ? "dark" : "light");
  }

  return (
    <header className="bg-background/95 backdrop-blur-sm sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {crumbs.map((crumb) => (
              <Fragment key={crumb.href}>
                <BreadcrumbItem>
                  {!crumb.isLast ? (
                    <BreadcrumbLink href={crumb.href}>
                      <CrumbLabel crumb={crumb} />
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>
                      <CrumbLabel crumb={crumb} />
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {!crumb.isLast && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
