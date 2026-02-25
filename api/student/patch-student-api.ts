import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { PatchStudentRequest, StudentResponse } from "@/data/interface/student";

export async function patchStudentApi(
  studentId: string,
  payload: PatchStudentRequest,
): Promise<StudentResponse> {
  const res = await fetch(`${API_URL}/v1/students/${studentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Update student failed");
  const json: ApiResponse<{ student: StudentResponse }> = await res.json();
  return json.data!.student;
}
