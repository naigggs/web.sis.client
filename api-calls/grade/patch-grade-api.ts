import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { GradeResponse, PatchGradeRequest } from "@/data/interface/grade";

export async function patchGradeApi(
  gradeId: string,
  payload: PatchGradeRequest,
): Promise<GradeResponse> {
  const res = await fetch(`${API_URL}/v1/grades/${gradeId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Update grade failed");
  const json: ApiResponse<{ grade: GradeResponse }> = await res.json();
  return json.data!.grade;
}
