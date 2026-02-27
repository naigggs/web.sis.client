import { API_URL } from "@/config/constants";
import { ApiResponse } from "@/data/interface/api";
import { ImportStudentsResponse } from "@/data/interface/student";

export async function importStudentsApi(
  file: File,
): Promise<ImportStudentsResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/v1/students/import`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) throw new Error("Import failed");
  const json: ApiResponse<ImportStudentsResponse> = await res.json();
  return json.data!;
}
