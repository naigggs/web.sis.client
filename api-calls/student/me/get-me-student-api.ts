import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { StudentResponse } from "@/data/interface/student";

export async function getMeStudentApi(): Promise<StudentResponse> {
  const res = await fetch(`${API_URL}/v1/students/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Get student profile failed");
  const json: ApiResponse<{ student: StudentResponse }> = await res.json();
  return json.data!.student;
}
