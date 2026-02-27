import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import {
  GetGradesData,
  GetGradesParams,
  GradeResponse,
} from "@/data/interface/grade";

export async function getGradesApi(
  params: GetGradesParams = {},
): Promise<GetGradesData> {
  const searchParams = new URLSearchParams();
  if (params.courseId) searchParams.set("courseId", params.courseId);
  if (params.subjectId) searchParams.set("subjectId", params.subjectId);
  if (params.studentId) searchParams.set("studentId", params.studentId);
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));

  const query = searchParams.toString();
  const res = await fetch(`${API_URL}/v1/grades${query ? `?${query}` : ""}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Get grades failed");
  const json: ApiResponse<{ grades: GradeResponse[] }> = await res.json();
  return {
    grades: json.data?.grades ?? [],
    pagination: json.pagination!,
  };
}
