import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { CourseResponse, PatchCourseRequest } from "@/data/interface/course";

export async function patchCourseApi(
  courseId: string,
  payload: PatchCourseRequest,
): Promise<CourseResponse> {
  const res = await fetch(`${API_URL}/v1/courses/${courseId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Update course failed");
  const json: ApiResponse<{ course: CourseResponse }> = await res.json();
  return json.data!.course;
}
