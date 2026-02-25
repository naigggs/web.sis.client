"use client";

import { useParams } from "next/navigation";
import { StudentProfile } from "@/components/pages/students/student-profile";

export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  return <StudentProfile studentId={id} />;
}
