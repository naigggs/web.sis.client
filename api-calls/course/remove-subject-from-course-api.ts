import { API_URL } from "@/config/constants";

export async function removeSubjectFromCourseApi(
  courseId: string,
  subjectId: string,
): Promise<void> {
  const res = await fetch(
    `${API_URL}/v1/courses/${courseId}/subjects/${subjectId}`,
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  if (!res.ok) throw new Error("Remove subject from course failed");
}
