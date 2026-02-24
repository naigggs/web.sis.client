import type { Metadata } from "next"

export const siteMetadata: Metadata = {
  title: {
    default: "SIS | School Information System",
    template: "%s | SIS",
  },
  description:
    "A mini School Information System for managing students, courses, subjects, prerequisites, enrollments, and grading.",
  keywords: [
    "School Information System",
    "SIS",
    "Student Management",
    "Course Management",
    "Subject Enrollment",
    "Grading",
    "Prerequisites",
    "Academic Dashboard",
  ],
  authors: [{ name: "SIS Admin" }],
  creator: "SIS",
  publisher: "SIS",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sis.example.com",
    title: "SIS | School Information System",
    description:
      "A mini School Information System for managing students, courses, subjects, prerequisites, enrollments, and grading.",
    siteName: "SIS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "School Information System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIS | School Information System",
    description:
      "A mini School Information System for managing students, courses, subjects, prerequisites, enrollments, and grading.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}
