import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import {
  AddSubjectsToCourseRequest,
  CourseSubjectResponse,
} from "@/data/interface/course";

export async function addSubjectsToCourseApi(
  courseId: string,
  payload: AddSubjectsToCourseRequest,
): Promise<CourseSubjectResponse[]> {
  const res = await fetch(`${API_URL}/v1/courses/${courseId}/subjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Add subjects to course failed");
  const json: ApiResponse<{ subjects: CourseSubjectResponse[] }> =
    await res.json();
  return json.data?.subjects ?? [];
}
