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
      url: "/students",
      icon: GraduationCap,
      isActive: true,
      items: [
        {
          title: "All Students",
          url: "/students",
        },
        {
          title: "Add Student",
          url: "/students/create",
        },
      ],
    },
    {
      title: "Courses",
      url: "/courses",
      icon: BookOpen,
      items: [
        {
          title: "All Courses",
          url: "/courses",
        },
        {
          title: "Add Course",
          url: "/courses/create",
        },
      ],
    },
    {
      title: "Subjects",
      url: "/subjects",
      icon: Layers,
      items: [
        {
          title: "All Subjects",
          url: "/subjects",
        },
        {
          title: "Add Subject",
          url: "/subjects/create",
        },
        {
          title: "Prerequisites",
          url: "/subjects/prerequisites",
        },
      ],
    },
    {
      title: "Reservations",
      url: "/reservations",
      icon: CalendarCheck,
      items: [
        {
          title: "All Reservations",
          url: "/reservations",
        },
      ],
    },
    {
      title: "Grading Sheet",
      url: "/grades",
      icon: FileSpreadsheet,
      items: [
        {
          title: "All Grades",
          url: "/grades",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings",
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
