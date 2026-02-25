import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { CourseResponse, CreateCourseRequest } from "@/data/interface/course";

export async function createCourseApi(
  payload: CreateCourseRequest,
): Promise<CourseResponse> {
  const res = await fetch(`${API_URL}/v1/courses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Create course failed");
  const json: ApiResponse<{ course: CourseResponse }> = await res.json();
  return json.data!.course;
}
