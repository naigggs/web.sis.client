import { API_URL } from "@/config/constants";

export async function deleteCourseApi(courseId: string): Promise<void> {
  const res = await fetch(`${API_URL}/v1/courses/${courseId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Delete course failed");
}
