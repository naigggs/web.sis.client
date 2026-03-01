import {
  BookOpen,
  CalendarCheck,
  FileSpreadsheet,
  GraduationCap,
  Layers,
  UserCircle,
  Users,
  type LucideIcon,
  LayoutDashboard,
} from "lucide-react";

export type NavRole = "admin" | "staff" | "student";

export interface NavSubItem {
  title: string;
  url: string;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  roles: NavRole[];
  items?: NavSubItem[];
}

export const data = {
  user: {
    name: "Admin",
    email: "admin@sis.edu",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    // ── Admin ──────────────────────────────────────────────────────────
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      roles: ["admin"] as NavRole[],
    },
    {
      title: "Students",
      url: "/students",
      icon: GraduationCap,
      roles: ["admin"] as NavRole[],
      isActive: true,
      items: [
        { title: "All Students", url: "/students" },
        { title: "Add Student", url: "/students/create" },
      ],
    },
    {
      title: "Courses",
      url: "/courses",
      icon: BookOpen,
      roles: ["admin"] as NavRole[],
      isActive: true,
      items: [
        { title: "All Courses", url: "/courses" },
        { title: "Add Course", url: "/courses/create" },
      ],
    },
    {
      title: "Subjects",
      url: "/subjects",
      icon: Layers,
      roles: ["admin"] as NavRole[],
      isActive: true,
      items: [
        { title: "All Subjects", url: "/subjects" },
        { title: "Add Subject", url: "/subjects/create" },
        { title: "Prerequisites", url: "/subjects/prerequisites" },
      ],
    },
    {
      title: "Reservations",
      url: "/reservations",
      icon: CalendarCheck,
      roles: ["admin"] as NavRole[],
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
      roles: ["admin"] as NavRole[],
    },
    // ── Admin + Staff ─────────────────────────────────────────────────
    {
      title: "Grading Sheet",
      url: "/grades",
      icon: FileSpreadsheet,
      roles: ["admin", "staff"] as NavRole[],
    },
    // ── Student ───────────────────────────────────────────────────────
    {
      title: "My Enrollment",
      url: "/enrollment",
      icon: CalendarCheck,
      roles: ["student"] as NavRole[],
      items: [{ title: "Enrollment Table", url: "/enrollment" }],
    },
    {
      title: "My Profile",
      url: "/profile",
      icon: UserCircle,
      roles: ["student"] as NavRole[],
      items: [{ title: "Profile", url: "/profile" }],
    },
  ] satisfies NavMainItem[],
  navSecondary: [],
  projects: [],
};
