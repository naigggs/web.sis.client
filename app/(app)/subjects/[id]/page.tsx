"use client";

import { useParams } from "next/navigation";
import { SubjectDetail } from "@/components/pages/subjects/subject-detail";

export default function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  return <SubjectDetail subjectId={id} />;
}
