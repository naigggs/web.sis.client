import { API_URL } from "@/config/constants";

export async function exportStudentsApi(): Promise<Blob> {
  const res = await fetch(`${API_URL}/v1/students/export`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Export failed");
  return res.blob();
}
