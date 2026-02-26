import {
  BookOpen,
  CalendarCheck,
  FileSpreadsheet,
  GraduationCap,
  LifeBuoy,
  Layers,
  Settings2,
  Send,
  UserCircle,
  type LucideIcon,
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
      items: [{ title: "All Reservations", url: "/reservations" }],
    },
    // ── Admin + Staff ─────────────────────────────────────────────────
    {
      title: "Grading Sheet",
      url: "/grades",
      icon: FileSpreadsheet,
      roles: ["admin", "staff"] as NavRole[],
      items: [{ title: "All Grades", url: "/grades" }],
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
    // ── Admin only ────────────────────────────────────────────────────
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      roles: ["admin"] as NavRole[],
      items: [{ title: "General", url: "/settings" }],
    },
  ] satisfies NavMainItem[],
  navSecondary: [
    { title: "Support", url: "#", icon: LifeBuoy },
    { title: "Feedback", url: "#", icon: Send },
  ],
  projects: [],
};
