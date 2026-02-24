import {
  BookOpen,
  CalendarCheck,
  FileSpreadsheet,
  GraduationCap,
  LifeBuoy,
  Layers,
  Settings2,
  Send,
} from "lucide-react";

export const data = {
  user: {
    name: "Admin",
    email: "admin@sis.edu",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Students",
      url: "/dashboard/students",
      icon: GraduationCap,
      isActive: true,
      items: [
        {
          title: "All Students",
          url: "/dashboard/students",
        },
        {
          title: "Add Student",
          url: "/dashboard/students/new",
        },
      ],
    },
    {
      title: "Courses",
      url: "/dashboard/courses",
      icon: BookOpen,
      items: [
        {
          title: "All Courses",
          url: "/dashboard/courses",
        },
        {
          title: "Add Course",
          url: "/dashboard/courses/new",
        },
      ],
    },
    {
      title: "Subjects",
      url: "/dashboard/subjects",
      icon: Layers,
      items: [
        {
          title: "All Subjects",
          url: "/dashboard/subjects",
        },
        {
          title: "Add Subject",
          url: "/dashboard/subjects/new",
        },
        {
          title: "Prerequisites",
          url: "/dashboard/subjects/prerequisites",
        },
      ],
    },
    {
      title: "Reservations",
      url: "/dashboard/reservations",
      icon: CalendarCheck,
      items: [
        {
          title: "All Reservations",
          url: "/dashboard/reservations",
        },
      ],
    },
    {
      title: "Grading Sheet",
      url: "/dashboard/grades",
      icon: FileSpreadsheet,
      items: [
        {
          title: "All Grades",
          url: "/dashboard/grades",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/settings",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [],
};
