"use client";

import { useParams } from "next/navigation";
import { CourseDetail } from "@/components/pages/courses/course-detail";

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <CourseDetail courseId={id} />;
}
