import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { CourseWithSubjectsResponse } from "@/data/interface/course";

export async function getCourseByIdApi(
  courseId: string,
): Promise<CourseWithSubjectsResponse> {
  const res = await fetch(`${API_URL}/v1/courses/${courseId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Get course failed");
  const json: ApiResponse<{ course: CourseWithSubjectsResponse }> =
    await res.json();
  return json.data!.course;
}
