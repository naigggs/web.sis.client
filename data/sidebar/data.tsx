import { type ComponentType } from "react";
import {
  IconBook2,
  IconCalendarCheck,
  IconFileSpreadsheet,
  IconSchool,
  IconLayoutDashboard,
  IconLayersIntersect,
  IconUser,
  IconUsers,
} from "@tabler/icons-react";

export type NavRole = "admin" | "staff" | "student";

export interface NavSubItem {
  title: string;
  url: string;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon: ComponentType<{ className?: string }>;
  isActive?: boolean;
  roles: NavRole[];
  group: "overview" | "academic" | "management" | "personal";
  items?: NavSubItem[];
}

export const data = {
  user: {
    name: "EduNest Admin",
    email: "admin@edunest.edu",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    // ── Admin ──────────────────────────────────────────────────────────
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard,
      roles: ["admin"] as NavRole[],
      group: "overview",
    },
    {
      title: "Students",
      url: "/students",
      icon: IconSchool,
      roles: ["admin"] as NavRole[],
      group: "academic",
      isActive: true,
      items: [
        { title: "All Students", url: "/students" },
        { title: "Add Student", url: "/students/create" },
      ],
    },
    {
      title: "Courses",
      url: "/courses",
      icon: IconBook2,
      roles: ["admin"] as NavRole[],
      group: "academic",
      isActive: true,
      items: [
        { title: "All Courses", url: "/courses" },
        { title: "Add Course", url: "/courses/create" },
      ],
    },
    {
      title: "Subjects",
      url: "/subjects",
      icon: IconLayersIntersect,
      roles: ["admin"] as NavRole[],
      group: "academic",
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
      icon: IconCalendarCheck,
      roles: ["admin"] as NavRole[],
      group: "management",
    },
    {
      title: "Users",
      url: "/users",
      icon: IconUsers,
      roles: ["admin"] as NavRole[],
      group: "management",
    },
    // ── Admin + Staff ─────────────────────────────────────────────────
    {
      title: "Grading Sheet",
      url: "/grades",
      icon: IconFileSpreadsheet,
      roles: ["admin", "staff"] as NavRole[],
      group: "academic",
    },
    // ── Student ───────────────────────────────────────────────────────
    {
      title: "My Enrollment",
      url: "/enrollment",
      icon: IconCalendarCheck,
      roles: ["student"] as NavRole[],
      group: "personal",
      items: [{ title: "Enrollment Table", url: "/enrollment" }],
    },
    {
      title: "My Profile",
      url: "/profile",
      icon: IconUser,
      roles: ["student"] as NavRole[],
      group: "personal",
      items: [{ title: "Profile", url: "/profile" }],
    },
  ] satisfies NavMainItem[],
  navSecondary: [],
  projects: [],
};
