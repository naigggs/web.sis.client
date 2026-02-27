import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { StudentResponse } from "@/data/interface/student";

export async function getStudentByIdApi(
  studentId: string,
): Promise<StudentResponse> {
  const res = await fetch(`${API_URL}/v1/students/${studentId}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Get student failed");
  const json: ApiResponse<{ student: StudentResponse }> = await res.json();
  return json.data!.student;
}
