import { API_URL } from "@/config/constants";

export async function deleteStudentApi(studentId: string): Promise<void> {
  const res = await fetch(`${API_URL}/v1/students/${studentId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Delete student failed");
}
