import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { CreateGradeRequest, GradeResponse } from "@/data/interface/grade";

/** Upsert — creates or updates the grade record for a student+subject+course. */
export async function createGradeApi(
  payload: CreateGradeRequest,
): Promise<GradeResponse> {
  const res = await fetch(`${API_URL}/v1/grades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Upsert grade failed");
  const json: ApiResponse<{ grade: GradeResponse }> = await res.json();
  return json.data!.grade;
}
