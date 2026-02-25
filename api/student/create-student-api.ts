import { API_URL } from "@/config/constants";
import {
  StudentResponse,
  CreateStudentRequest,
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
  const json = (await res.json()) as { data: StudentResponse };
  return json.data;
}
