import { API_URL } from "@/config/constants";

export async function bulkDeleteSubjectsApi(ids: string[]): Promise<void> {
  const res = await fetch(`${API_URL}/v1/subjects`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new Error("Delete subject failed");
}
