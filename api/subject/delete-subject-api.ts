import { API_URL } from "@/config/constants";

export async function deleteSubjectApi(subjectId: string): Promise<void> {
  const res = await fetch(`${API_URL}/v1/subjects/${subjectId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Delete subject failed");
}
