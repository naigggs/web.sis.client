import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import {
  CreateStudentRequest,
  StudentResponse,
} from "@/data/interface/student";

export async function createStudentApi(
  payload: CreateStudentRequest,
): Promise<StudentResponse> {
  const res = await fetch(`${API_URL}/v1/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Create student failed");
  const json: ApiResponse<{ student: StudentResponse }> = await res.json();
  return json.data!.student;
}
