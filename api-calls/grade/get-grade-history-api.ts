import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import {
  GetGradeHistoryData,
  GetGradeHistoryParams,
  GradeAuditLog,
} from "@/data/interface/grade";

export async function getGradeHistoryApi(
  params: GetGradeHistoryParams,
): Promise<GetGradeHistoryData> {
  const searchParams = new URLSearchParams();
  searchParams.set("studentId", params.studentId);
  searchParams.set("subjectId", params.subjectId);
  searchParams.set("courseId", params.courseId);

  const res = await fetch(
    `${API_URL}/v1/grades/history?${searchParams.toString()}`,
    {
      credentials: "include",
    },
  );

  if (!res.ok) throw new Error("Get grade history failed");

  const json: ApiResponse<{ history: GradeAuditLog[] }> = await res.json();
  return {
    history: json.data?.history ?? [],
  };
}
